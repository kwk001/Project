#!/usr/bin/env python3
"""
智能排期引擎
根据需求优先级、资源约束和依赖关系自动生成研发执行计划
"""
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass, field
from enum import Enum
import json


class Priority(Enum):
    P0 = 0  # 最高优先级
    P1 = 1
    P2 = 2
    P3 = 3  # 最低优先级


class TaskStatus(Enum):
    TODO = "待开始"
    IN_PROGRESS = "进行中"
    DONE = "已完成"
    BLOCKED = "已阻塞"
    DELAYED = "已延期"


@dataclass
class TeamMember:
    """团队成员"""
    id: str
    name: str
    role: str
    capacity: float = 8.0  # 每日可用工时
    skills: List[str] = field(default_factory=list)


@dataclass
class Task:
    """任务定义"""
    id: str
    name: str
    priority: Priority
    assignee: Optional[TeamMember] = None
    planned_hours: float = 0
    actual_hours: float = 0
    status: TaskStatus = TaskStatus.TODO
    progress: float = 0.0  # 0-1
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    dependencies: List[str] = field(default_factory=list)  # 前置任务ID
    milestone_id: Optional[str] = None
    story_points: int = 0


@dataclass
class ProjectPlan:
    """项目计划"""
    project_id: str
    project_name: str
    start_date: datetime
    end_date: datetime
    tasks: List[Task] = field(default_factory=list)
    milestones: Dict[str, datetime] = field(default_factory=dict)


class SmartScheduler:
    """智能调度器"""

    def __init__(self, team: List[TeamMember]):
        self.team = {m.id: m for m in team}
        self.task_map: Dict[str, Task] = {}

    def schedule(self, tasks: List[Task],
                 project_start: datetime,
                 working_hours_per_day: float = 8.0) -> ProjectPlan:
        """
        智能排期主算法

        规则：
        1. 按优先级排序（P0优先）
        2. 考虑任务依赖（前置任务完成后才能开始）
        3. 考虑资源约束（人员负载均衡）
        4. 计算每个任务的开始/结束时间
        """
        # 构建任务映射
        self.task_map = {t.id: t for t in tasks}

        # 按优先级排序
        sorted_tasks = sorted(tasks, key=lambda t: t.priority.value)

        # 计算每个任务的时间安排
        for task in sorted_tasks:
            self._calculate_task_schedule(
                task, project_start, working_hours_per_day
            )

        # 构建项目计划
        plan = ProjectPlan(
            project_id="",
            project_name="",
            start_date=project_start,
            end_date=max((t.end_date for t in tasks if t.end_date), default=project_start),
            tasks=tasks
        )

        return plan

    def _calculate_task_schedule(self, task: Task,
                                  project_start: datetime,
                                  working_hours_per_day: float):
        """计算单个任务的时间安排"""

        # 1. 确定最早开始时间（考虑依赖）
        earliest_start = project_start

        for dep_id in task.dependencies:
            dep_task = self.task_map.get(dep_id)
            if dep_task and dep_task.end_date:
                earliest_start = max(earliest_start, dep_task.end_date + timedelta(days=1))

        # 2. 考虑资源可用性
        if task.assignee:
            # 这里可以添加更复杂的资源冲突检测
            pass

        # 3. 计算工期（天数）
        if task.planned_hours > 0:
            duration_days = int(task.planned_hours / working_hours_per_day)
            if task.planned_hours % working_hours_per_day > 0:
                duration_days += 1
        else:
            duration_days = 1  # 默认1天

        # 4. 设置任务时间
        task.start_date = earliest_start
        task.end_date = earliest_start + timedelta(days=duration_days - 1)

    def rebalance_load(self) -> List[Dict]:
        """
        资源负载均衡优化

        检测资源过载情况，提供调配建议
        """
        # 按人员统计负载
        load_by_person: Dict[str, float] = {}

        for task in self.task_map.values():
            if task.assignee:
                person_id = task.assignee.id
                load_by_person[person_id] = load_by_person.get(person_id, 0) + task.planned_hours

        # 检测瓶颈
        bottlenecks = []
        for person_id, load in load_by_person.items():
            person = self.team.get(person_id)
            if person:
                capacity = person.capacity * 30  # 假设30天周期
                utilization = load / capacity if capacity > 0 else 0

                if utilization > 1.0:
                    bottlenecks.append({
                        "person": person.name,
                        "role": person.role,
                        "assigned_hours": load,
                        "capacity": capacity,
                        "utilization": utilization,
                        "severity": "high" if utilization > 1.2 else "medium",
                        "suggestion": self._suggest_reallocation(person_id)
                    })

        return bottlenecks

    def _suggest_reallocation(self, overloaded_person_id: str) -> List[str]:
        """提供资源重分配建议"""
        suggestions = []

        # 查找可以转移任务的候选人员
        candidates = [
            p for p in self.team.values()
            if p.id != overloaded_person_id and p.role == self.team[overloaded_person_id].role
        ]

        if candidates:
            candidate_names = ", ".join([c.name for c in candidates])
            suggestions.append(f"考虑将部分任务转移给: {candidate_names}")

        suggestions.append("评估任务优先级，考虑延期或裁剪低优先级任务")
        suggestions.append("考虑增加资源或调整项目范围")

        return suggestions


class PriorityBasedPlanner:
    """基于优先级的计划生成器"""

    PRIORITY_WEIGHTS = {
        Priority.P0: 1.0,  # 100%资源分配
        Priority.P1: 0.7,  # 70%资源分配
        Priority.P2: 0.4,  # 40%资源分配
        Priority.P3: 0.2,  # 20%资源分配
    }

    def __init__(self, scheduler: SmartScheduler):
        self.scheduler = scheduler

    def generate_plan(self, requirements: List[Dict],
                      team: List[TeamMember],
                      project_start: datetime,
                      project_end: datetime) -> ProjectPlan:
        """
        根据需求列表生成完整执行计划

        Args:
            requirements: 需求列表，每项包含优先级、估算工时等
            team: 团队成员列表
            project_start: 项目开始日期
            project_end: 项目截止日期
        """
        tasks = []

        for idx, req in enumerate(requirements):
            priority = Priority[req.get('priority', 'P2')]

            # 根据优先级分配资源
            assignee = self._assign_by_priority(priority, team)

            task = Task(
                id=f"T{idx+1:03d}",
                name=req.get('name', f'任务{idx+1}'),
                priority=priority,
                assignee=assignee,
                planned_hours=req.get('estimated_hours', 40),
                story_points=req.get('story_points', 0),
                dependencies=req.get('dependencies', []),
                milestone_id=req.get('milestone_id')
            )
            tasks.append(task)

        # 执行智能排期
        plan = self.scheduler.schedule(tasks, project_start)
        plan.end_date = project_end

        return plan

    def _assign_by_priority(self, priority: Priority, team: List[TeamMember]) -> Optional[TeamMember]:
        """根据优先级分配最佳人员"""
        # 简化的分配逻辑：选择负载最轻的人
        # 实际应用中可以考虑技能匹配、历史表现等因素

        if not team:
            return None

        # 这里可以实现更复杂的分配算法
        # 暂时返回第一个匹配角色的人员
        return team[0]

    def adjust_for_changes(self, plan: ProjectPlan,
                          changes: List[Dict]) -> ProjectPlan:
        """
        根据变更请求调整计划

        Args:
            plan: 当前计划
            changes: 变更请求列表
        """
        for change in changes:
            change_type = change.get('type')

            if change_type == 'add':
                # 新增任务
                new_task = Task(
                    id=f"T{len(plan.tasks)+1:03d}",
                    name=change.get('name'),
                    priority=Priority[change.get('priority', 'P2')],
                    planned_hours=change.get('estimated_hours', 40),
                    dependencies=change.get('dependencies', [])
                )
                plan.tasks.append(new_task)

            elif change_type == 'modify':
                # 修改任务
                task_id = change.get('task_id')
                for task in plan.tasks:
                    if task.id == task_id:
                        if 'priority' in change:
                            task.priority = Priority[change['priority']]
                        if 'estimated_hours' in change:
                            task.planned_hours = change['estimated_hours']
                        break

            elif change_type == 'remove':
                # 删除任务
                task_id = change.get('task_id')
                plan.tasks = [t for t in plan.tasks if t.id != task_id]

        # 重新排期
        return self.scheduler.schedule(plan.tasks, plan.start_date)


# 使用示例
if __name__ == "__main__":
    # 创建团队
    team = [
        TeamMember("M1", "张三", "Frontend", 8, ["React", "Vue"]),
        TeamMember("M2", "李四", "Backend", 8, ["Java", "Python"]),
        TeamMember("M3", "王五", "Fullstack", 8, ["React", "Node.js"]),
    ]

    # 创建调度器
    scheduler = SmartScheduler(team)

    # 定义需求
    requirements = [
        {"name": "用户登录功能", "priority": "P0", "estimated_hours": 16, "dependencies": []},
        {"name": "商品列表页", "priority": "P0", "estimated_hours": 24, "dependencies": []},
        {"name": "购物车功能", "priority": "P1", "estimated_hours": 20, "dependencies": ["T001"]},
        {"name": "订单管理", "priority": "P1", "estimated_hours": 32, "dependencies": ["T003"]},
        {"name": "数据统计", "priority": "P2", "estimated_hours": 16, "dependencies": []},
    ]

    # 生成计划
    planner = PriorityBasedPlanner(scheduler)
    plan = planner.generate_plan(
        requirements,
        team,
        datetime(2026, 4, 6),
        datetime(2026, 6, 15)
    )

    # 输出计划
    print(f"项目: {plan.project_name}")
    print(f"周期: {plan.start_date.date()} ~ {plan.end_date.date()}")
    print("\n任务列表:")
    for task in plan.tasks:
        assignee = task.assignee.name if task.assignee else "未分配"
        print(f"  {task.id}: {task.name} [{task.priority.name}] - {assignee}")
        print(f"      计划: {task.start_date.date()} ~ {task.end_date.date()}")

    # 检查资源负载
    bottlenecks = scheduler.rebalance_load()
    if bottlenecks:
        print("\n资源瓶颈:")
        for b in bottlenecks:
            print(f"  {b['person']} ({b['role']}): 负载{b['utilization']:.0%}")
