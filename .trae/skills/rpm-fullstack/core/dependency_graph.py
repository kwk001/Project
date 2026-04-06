#!/usr/bin/env python3
"""
依赖关系与关键路径管理
支持任务间依赖配置、关键路径自动计算、依赖可视化
"""
from datetime import datetime, timedelta
from typing import List, Dict, Set, Tuple, Optional
from dataclasses import dataclass, field
from enum import Enum
import networkx as nx
from collections import defaultdict


@dataclass
class Dependency:
    """任务依赖关系"""
    from_task_id: str
    to_task_id: str
    type: str = "FS"  # FS=完成-开始, SS=开始-开始, FF=完成-完成, SF=开始-完成
    lag_days: int = 0  # 滞后时间（天）


@dataclass
class TaskNode:
    """任务节点"""
    id: str
    name: str
    duration: float  # 工期（天）
    early_start: Optional[datetime] = None
    early_finish: Optional[datetime] = None
    late_start: Optional[datetime] = None
    late_finish: Optional[datetime] = None
    total_float: float = 0  # 总浮动时间
    free_float: float = 0  # 自由浮动时间
    is_critical: bool = False
    dependencies: List[str] = field(default_factory=list)  # 前置任务ID列表


class DependencyGraph:
    """依赖关系图管理器"""

    def __init__(self):
        self.graph = nx.DiGraph()
        self.tasks: Dict[str, TaskNode] = {}
        self.dependencies: List[Dependency] = []

    def add_task(self, task: TaskNode):
        """添加任务节点"""
        self.tasks[task.id] = task
        self.graph.add_node(
            task.id,
            name=task.name,
            duration=task.duration,
            task=task
        )

    def add_dependency(self, dep: Dependency):
        """添加依赖关系"""
        self.dependencies.append(dep)
        self.graph.add_edge(
            dep.from_task_id,
            dep.to_task_id,
            type=dep.type,
            lag=dep.lag_days
        )

        # 更新任务的前置依赖列表
        if dep.to_task_id in self.tasks:
            if dep.from_task_id not in self.tasks[dep.to_task_id].dependencies:
                self.tasks[dep.to_task_id].dependencies.append(dep.from_task_id)

    def remove_dependency(self, from_task: str, to_task: str):
        """移除依赖关系"""
        if self.graph.has_edge(from_task, to_task):
            self.graph.remove_edge(from_task, to_task)

        # 更新任务的依赖列表
        if to_task in self.tasks:
            if from_task in self.tasks[to_task].dependencies:
                self.tasks[to_task].dependencies.remove(from_task)

        # 清理已移除的依赖记录
        self.dependencies = [
            d for d in self.dependencies
            if not (d.from_task_id == from_task and d.to_task_id == to_task)
        ]

    def detect_cycles(self) -> List[List[str]]:
        """检测循环依赖"""
        try:
            cycles = list(nx.simple_cycles(self.graph))
            return cycles
        except nx.NetworkXNoCycle:
            return []

    def calculate_critical_path(self, project_start: datetime) -> Tuple[List[str], float]:
        """
        计算关键路径

        使用CPM（关键路径法）算法：
        1. 正向遍历：计算最早开始/结束时间
        2. 反向遍历：计算最晚开始/结束时间
        3. 总浮动时间=0的任务构成关键路径

        Returns:
            (关键路径任务ID列表, 项目总工期)
        """
        if not self.tasks:
            return [], 0

        # 检查循环依赖
        cycles = self.detect_cycles()
        if cycles:
            raise ValueError(f"检测到循环依赖: {cycles}")

        # 找到起始任务（没有前置依赖的任务）
        start_tasks = [
            task_id for task_id, task in self.tasks.items()
            if not task.dependencies
        ]

        # ========== 正向遍历：计算最早时间 ==========
        for task_id in nx.topological_sort(self.graph):
            task = self.tasks[task_id]

            if task_id in start_tasks:
                # 起始任务从项目开始日期启动
                task.early_start = project_start
            else:
                # 非起始任务：取所有前置任务的最早结束时间的最大值
                max_early_finish = project_start

                for dep in self.dependencies:
                    if dep.to_task_id == task_id:
                        pred_task = self.tasks.get(dep.from_task_id)
                        if pred_task and pred_task.early_finish:
                            # 考虑依赖类型和滞后时间
                            if dep.type == "FS":
                                candidate = pred_task.early_finish + timedelta(days=dep.lag_days)
                            elif dep.type == "SS":
                                candidate = pred_task.early_start + timedelta(days=dep.lag_days) if pred_task.early_start else project_start
                            elif dep.type == "FF":
                                candidate = pred_task.early_finish + timedelta(days=dep.lag_days - task.duration) if pred_task.early_finish else project_start
                            else:  # SF
                                candidate = pred_task.early_start + timedelta(days=dep.lag_days - task.duration) if pred_task.early_start else project_start

                            max_early_finish = max(max_early_finish, candidate)

                task.early_start = max_early_finish

            # 计算最早结束时间
            task.early_finish = task.early_start + timedelta(days=task.duration)

        # 找到项目最早结束时间
        project_early_finish = max(
            (task.early_finish for task in self.tasks.values() if task.early_finish),
            default=project_start
        )
        project_duration = (project_early_finish - project_start).days

        # ========== 反向遍历：计算最晚时间 ==========
        # 找到终止任务（没有后置任务的任务）
        end_tasks = [
            task_id for task_id in self.tasks
            if self.graph.out_degree(task_id) == 0
        ]

        # 从终止任务开始反向遍历
        for task_id in reversed(list(nx.topological_sort(self.graph))):
            task = self.tasks[task_id]

            if task_id in end_tasks:
                # 终止任务的最晚结束时间等于项目最早结束时间
                task.late_finish = project_early_finish
            else:
                # 非终止任务：取所有后继任务的最晚开始时间的最小值
                min_late_start = project_early_finish

                for dep in self.dependencies:
                    if dep.from_task_id == task_id:
                        succ_task = self.tasks.get(dep.to_task_id)
                        if succ_task and succ_task.late_start:
                            # 考虑依赖类型和滞后时间
                            if dep.type == "FS":
                                candidate = succ_task.late_start - timedelta(days=dep.lag_days)
                            elif dep.type == "SS":
                                candidate = succ_task.late_start - timedelta(days=dep.lag_days)
                            elif dep.type == "FF":
                                candidate = succ_task.late_finish - timedelta(days=dep.lag_days) if succ_task.late_finish else project_early_finish
                            else:  # SF
                                candidate = succ_task.late_finish - timedelta(days=dep.lag_days) if succ_task.late_finish else project_early_finish

                            min_late_start = min(min_late_start, candidate)

                task.late_finish = min_late_start

            # 计算最晚开始时间
            task.late_start = task.late_finish - timedelta(days=task.duration)

            # 计算总浮动时间
            task.total_float = (task.late_start - task.early_start).days

            # 判断是否为关键任务
            task.is_critical = (task.total_float == 0)

        # ========== 提取关键路径 ==========
        critical_path = [
            task_id for task_id, task in self.tasks.items()
            if task.is_critical
        ]

        # 按最早开始时间排序
        critical_path.sort(
            key=lambda tid: self.tasks[tid].early_start or datetime.min
        )

        return critical_path, project_duration

    def get_downstream_tasks(self, task_id: str) -> List[str]:
        """获取下游依赖任务（受影响任务）"""
        if task_id not in self.graph:
            return []

        # 使用DFS获取所有可达节点
        downstream = list(nx.descendants(self.graph, task_id))
        return downstream

    def get_upstream_tasks(self, task_id: str) -> List[str]:
        """获取上游依赖任务"""
        if task_id not in self.graph:
            return []

        # 使用DFS获取所有前驱节点
        upstream = list(nx.ancestors(self.graph, task_id))
        return upstream

    def analyze_delay_impact(self, task_id: str, delay_days: int) -> Dict:
        """
        分析任务延期对项目的影响

        Returns:
            {
                "is_critical": 是否影响关键路径,
                "project_delay": 项目总延期天数,
                "affected_tasks": 受影响的下游任务列表,
                "mitigation_suggestions": 缓解建议
            }
        """
        task = self.tasks.get(task_id)
        if not task:
            return {"error": "任务不存在"}

        # 重新计算关键路径（考虑延期）
        original_duration = task.duration
        task.duration += delay_days

        try:
            critical_path, new_project_duration = self.calculate_critical_path(
                task.early_start or datetime.now()
            )
        finally:
            # 恢复原工期
            task.duration = original_duration

        # 获取受影响任务
        affected_tasks = self.get_downstream_tasks(task_id)

        # 判断是否影响关键路径
        is_critical = task_id in critical_path or any(
            t in critical_path for t in affected_tasks
        )

        # 计算项目延期
        original_project_duration = self._get_original_project_duration()
        project_delay = max(0, new_project_duration - original_project_duration)

        # 生成缓解建议
        suggestions = []
        if is_critical:
            suggestions.append("该任务在关键路径上，延期将直接影响项目交付日期")
            suggestions.append("建议立即协调资源追赶进度")
            if delay_days <= 2:
                suggestions.append("考虑加班或并行处理部分工作")
            else:
                suggestions.append("考虑范围裁剪或调整后续任务优先级")
        else:
            float_days = task.total_float
            if delay_days <= float_days:
                suggestions.append(f"该任务有{float_days}天浮动时间，延期不影响项目")
            else:
                suggestions.append(f"延期超过浮动时间({float_days}天)，将转化为关键路径任务")

        return {
            "is_critical": is_critical,
            "project_delay": project_delay,
            "affected_tasks": affected_tasks,
            "affected_count": len(affected_tasks),
            "mitigation_suggestions": suggestions
        }

    def _get_original_project_duration(self) -> float:
        """获取原始项目工期（简化计算）"""
        if not self.tasks:
            return 0

        # 简化为关键路径任务的总工期
        critical_path, duration = self.calculate_critical_path(datetime.now())
        return duration

    def export_to_mermaid(self) -> str:
        """
        导出为Mermaid流程图语法

        可用于在Markdown中展示依赖关系图
        """
        lines = ["graph TD"]

        # 添加节点定义
        for task_id, task in self.tasks.items():
            style = ""
            if task.is_critical:
                style = f"    style {task_id} fill:#ff6b6b"
            lines.append(f"    {task_id}[{task.name}]" + (f"\n{style}" if style else ""))

        # 添加依赖边
        for dep in self.dependencies:
            label = f"|{dep.type}|" if dep.type != "FS" else ""
            if dep.lag_days > 0:
                label = f"|+{dep.lag_days}d|"
            arrow = f" --{label}--> " if label else " --> "
            lines.append(f"    {dep.from_task_id}{arrow}{dep.to_task_id}")

        return "\n".join(lines)

    def export_to_gantt(self, project_start: datetime) -> List[Dict]:
        """
        导出为甘特图数据格式
        """
        gantt_data = []

        for task_id, task in self.tasks.items():
            if task.early_start and task.early_finish:
                gantt_data.append({
                    "id": task_id,
                    "name": task.name,
                    "start": task.early_start.strftime("%Y-%m-%d"),
                    "end": task.early_finish.strftime("%Y-%m-%d"),
                    "duration": task.duration,
                    "progress": 0,  # 需要外部更新
                    "is_critical": task.is_critical,
                    "dependencies": task.dependencies,
                    "float": task.total_float
                })

        return sorted(gantt_data, key=lambda x: x["start"])

    def notify_downstream(self, task_id: str, message: str) -> List[Dict]:
        """
        通知下游任务关联方

        Returns:
            需要通知的人员列表
        """
        downstream_tasks = self.get_downstream_tasks(task_id)
        notifications = []

        for ds_task_id in downstream_tasks:
            task = self.tasks.get(ds_task_id)
            if task:
                notifications.append({
                    "task_id": ds_task_id,
                    "task_name": task.name,
                    "message": f"前置任务{task_id}变更: {message}",
                    "notify_type": "dependency_change"
                })

        return notifications


class DependencyValidator:
    """依赖关系验证器"""

    @staticmethod
    def validate_new_dependency(graph: DependencyGraph, new_dep: Dependency) -> Tuple[bool, str]:
        """
        验证新增依赖是否合法

        Returns:
            (是否合法, 错误信息)
        """
        # 检查任务是否存在
        if new_dep.from_task_id not in graph.tasks:
            return False, f"源任务 {new_dep.from_task_id} 不存在"

        if new_dep.to_task_id not in graph.tasks:
            return False, f"目标任务 {new_dep.to_task_id} 不存在"

        # 检查是否自依赖
        if new_dep.from_task_id == new_dep.to_task_id:
            return False, "任务不能依赖自身"

        # 检查是否已存在
        if graph.graph.has_edge(new_dep.from_task_id, new_dep.to_task_id):
            return False, "依赖关系已存在"

        # 检查是否会导致循环依赖
        temp_graph = graph.graph.copy()
        temp_graph.add_edge(new_dep.from_task_id, new_dep.to_task_id)

        try:
            list(nx.topological_sort(temp_graph))
        except nx.NetworkXError:
            return False, "新增依赖将导致循环依赖"

        return True, "验证通过"


# 使用示例
if __name__ == "__main__":
    # 创建依赖图
    graph = DependencyGraph()

    # 添加任务
    tasks = [
        TaskNode("T1", "需求分析", 5),
        TaskNode("T2", "概要设计", 3),
        TaskNode("T3", "详细设计", 5),
        TaskNode("T4", "前端开发", 10),
        TaskNode("T5", "后端开发", 10),
        TaskNode("T6", "接口联调", 3),
        TaskNode("T7", "系统测试", 5),
    ]

    for task in tasks:
        graph.add_task(task)

    # 添加依赖关系
    deps = [
        Dependency("T1", "T2"),
        Dependency("T2", "T3"),
        Dependency("T3", "T4"),
        Dependency("T3", "T5"),
        Dependency("T4", "T6"),
        Dependency("T5", "T6"),
        Dependency("T6", "T7"),
    ]

    for dep in deps:
        graph.add_dependency(dep)

    # 计算关键路径
    project_start = datetime(2026, 4, 6)
    critical_path, duration = graph.calculate_critical_path(project_start)

    print("关键路径:", " -> ".join(critical_path))
    print(f"项目总工期: {duration}天")
    print("\n任务详情:")
    for task_id in critical_path:
        task = graph.tasks[task_id]
        print(f"  {task.name}: {task.early_start.date()} ~ {task.early_finish.date()}")

    # 分析延期影响
    print("\n延期影响分析 (T3延期2天):")
    impact = graph.analyze_delay_impact("T3", 2)
    print(f"  是否关键: {impact['is_critical']}")
    print(f"  项目延期: {impact['project_delay']}天")
    print(f"  受影响任务: {impact['affected_count']}个")
    print(f"  建议: {impact['mitigation_suggestions']}")

    # 导出Mermaid图
    print("\nMermaid流程图:")
    print(graph.export_to_mermaid())
