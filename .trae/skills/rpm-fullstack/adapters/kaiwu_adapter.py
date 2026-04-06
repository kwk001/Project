#!/usr/bin/env python3
"""
Kaiwu Cloud 低代码平台适配器
对接开物云低代码平台，同步项目数据
"""
from datetime import datetime
from typing import List, Dict, Optional, Any
from dataclasses import dataclass, field
import json


@dataclass
class FormRecord:
    """表单记录"""
    id: str
    form_code: str
    form_name: str
    data: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
    creator: str
    status: str


@dataclass
class WorkflowInstance:
    """流程实例"""
    id: str
    process_code: str
    process_name: str
    status: str  # running, completed, terminated
    current_node: str
    start_time: datetime
    end_time: Optional[datetime] = None
    participants: List[str] = field(default_factory=list)
    form_data: Dict[str, Any] = field(default_factory=dict)


class KaiwuAdapter:
    """Kaiwu Cloud 适配器"""

    def __init__(self, app_id: str, api_endpoint: str = ""):
        self.app_id = app_id
        self.api_endpoint = api_endpoint
        self.form_cache: Dict[str, List[FormRecord]] = {}

    # ========== 表单操作 ==========

    def get_form_structure(self, form_code: str) -> Dict:
        """获取表单结构定义"""
        # 实际实现需要调用 Kaiwu Form MCP
        # 这里提供模拟实现
        return {
            "form_id": f"form_{form_code}",
            "form_code": form_code,
            "form_name": self._get_form_name(form_code),
            "fields": self._get_form_fields(form_code)
        }

    def query_form_data(self, form_code: str,
                       conditions: List[Dict] = None,
                       page: int = 1,
                       size: int = 20) -> List[FormRecord]:
        """
        查询表单数据

        Args:
            form_code: 表单编码
            conditions: 查询条件
            page: 页码
            size: 每页条数
        """
        # 实际实现需要调用 Kaiwu Form MCP
        # 返回模拟数据
        return self._mock_form_data(form_code)

    def create_form_record(self, form_code: str,
                          data: Dict[str, Any]) -> FormRecord:
        """创建表单记录"""
        record = FormRecord(
            id=f"REC{datetime.now().timestamp()}",
            form_code=form_code,
            form_name=self._get_form_name(form_code),
            data=data,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            creator="system",
            status="active"
        )
        return record

    def update_form_record(self, form_code: str,
                          record_id: str,
                          data: Dict[str, Any]) -> FormRecord:
        """更新表单记录"""
        # 实际实现需要调用 Kaiwu Form MCP
        pass

    # ========== 流程操作 ==========

    def start_workflow(self, process_code: str,
                      form_data: Dict[str, Any],
                      starter: str) -> WorkflowInstance:
        """启动流程实例"""
        instance = WorkflowInstance(
            id=f"WF{datetime.now().timestamp()}",
            process_code=process_code,
            process_name=self._get_process_name(process_code),
            status="running",
            current_node="start",
            start_time=datetime.now(),
            participants=[starter],
            form_data=form_data
        )
        return instance

    def get_workflow_status(self, instance_id: str) -> WorkflowInstance:
        """获取流程状态"""
        # 实际实现需要调用 Kaiwu Form MCP
        pass

    def approve_workflow(self, instance_id: str,
                        approver: str,
                        decision: str,
                        comment: str = "") -> bool:
        """审批流程"""
        # 实际实现需要调用 Kaiwu Form MCP
        return True

    # ========== 项目数据同步 ==========

    def sync_project_data(self, project_id: str) -> Dict:
        """
        同步项目相关数据

        从低代码平台同步：
        - 任务列表
        - 变更请求
        - 缺陷记录
        - 里程碑状态
        """
        return {
            "tasks": self._sync_tasks(project_id),
            "changes": self._sync_changes(project_id),
            "defects": self._sync_defects(project_id),
            "milestones": self._sync_milestones(project_id)
        }

    def _sync_tasks(self, project_id: str) -> List[Dict]:
        """同步任务数据"""
        # 从任务表单查询
        records = self.query_form_data("RPM_TASK", [
            {"field": "project_id", "operator": "eq", "value": project_id}
        ])

        return [
            {
                "id": r.data.get("task_id"),
                "name": r.data.get("task_name"),
                "status": r.data.get("status"),
                "assignee": r.data.get("assignee"),
                "priority": r.data.get("priority"),
                "progress": r.data.get("progress", 0),
                "planned_hours": r.data.get("planned_hours"),
                "actual_hours": r.data.get("actual_hours")
            }
            for r in records
        ]

    def _sync_changes(self, project_id: str) -> List[Dict]:
        """同步变更请求"""
        records = self.query_form_data("RPM_CHANGE", [
            {"field": "project_id", "operator": "eq", "value": project_id}
        ])

        return [
            {
                "id": r.data.get("change_id"),
                "title": r.data.get("title"),
                "status": r.data.get("approval_status"),
                "type": r.data.get("change_type"),
                "created_at": r.created_at.isoformat()
            }
            for r in records
        ]

    def _sync_defects(self, project_id: str) -> List[Dict]:
        """同步缺陷数据"""
        records = self.query_form_data("RPM_DEFECT", [
            {"field": "project_id", "operator": "eq", "value": project_id}
        ])

        return [
            {
                "id": r.data.get("defect_id"),
                "title": r.data.get("title"),
                "severity": r.data.get("severity"),
                "status": r.data.get("status"),
                "assignee": r.data.get("assignee"),
                "related_task": r.data.get("related_task_id")
            }
            for r in records
        ]

    def _sync_milestones(self, project_id: str) -> List[Dict]:
        """同步里程碑数据"""
        records = self.query_form_data("RPM_MILESTONE", [
            {"field": "project_id", "operator": "eq", "value": project_id}
        ])

        return [
            {
                "id": r.data.get("milestone_id"),
                "name": r.data.get("milestone_name"),
                "planned_date": r.data.get("planned_date"),
                "actual_date": r.data.get("actual_date"),
                "status": r.data.get("status"),
                "health": r.data.get("health_status")
            }
            for r in records
        ]

    # ========== 数据写入 ==========

    def create_task(self, project_id: str, task_data: Dict) -> str:
        """在低代码平台创建任务"""
        data = {
            "project_id": project_id,
            **task_data
        }
        record = self.create_form_record("RPM_TASK", data)
        return record.id

    def update_task_progress(self, task_id: str, progress: float,
                            actual_hours: float,
                            status: str) -> bool:
        """更新任务进度"""
        # 实际实现需要调用 Kaiwu Form MCP
        return True

    def create_risk_record(self, project_id: str, risk_data: Dict) -> str:
        """创建风险记录"""
        data = {
            "project_id": project_id,
            **risk_data
        }
        record = self.create_form_record("RPM_RISK", data)
        return record.id

    def create_change_request(self, project_id: str,
                             change_data: Dict) -> str:
        """创建变更请求并启动审批流程"""
        # 1. 创建变更记录
        data = {
            "project_id": project_id,
            "approval_status": "pending",
            **change_data
        }
        record = self.create_form_record("RPM_CHANGE", data)

        # 2. 启动审批流程
        instance = self.start_workflow(
            "CHANGE_APPROVAL",
            {"change_id": record.id, **change_data},
            change_data.get("requester", "system")
        )

        return record.id

    # ========== 报表数据 ==========

    def get_project_dashboard_data(self, project_id: str) -> Dict:
        """获取项目仪表盘数据"""
        project_data = self.sync_project_data(project_id)

        # 计算统计数据
        tasks = project_data["tasks"]
        defects = project_data["defects"]
        milestones = project_data["milestones"]

        return {
            "summary": {
                "total_tasks": len(tasks),
                "completed_tasks": len([t for t in tasks if t.get("status") == "completed"]),
                "in_progress_tasks": len([t for t in tasks if t.get("status") == "in_progress"]),
                "open_defects": len([d for d in defects if d.get("status") != "closed"]),
                "critical_defects": len([d for d in defects if d.get("severity") == "P0"]),
                "on_track_milestones": len([m for m in milestones if m.get("health") == "green"]),
                "overall_progress": self._calculate_overall_progress(tasks)
            },
            "details": project_data
        }

    def _calculate_overall_progress(self, tasks: List[Dict]) -> float:
        """计算整体进度"""
        if not tasks:
            return 0.0

        total_planned = sum(t.get("planned_hours", 0) for t in tasks)
        total_actual = sum(t.get("actual_hours", 0) for t in tasks)

        if total_planned == 0:
            return 0.0

        return round(total_actual / total_planned, 2)

    # ========== 辅助方法 ==========

    def _get_form_name(self, form_code: str) -> str:
        """获取表单名称"""
        form_names = {
            "RPM_TASK": "任务管理",
            "RPM_CHANGE": "变更管理",
            "RPM_RISK": "风险管理",
            "RPM_DEFECT": "缺陷管理",
            "RPM_MILESTONE": "里程碑管理",
            "RPM_RESOURCE": "资源管理"
        }
        return form_names.get(form_code, form_code)

    def _get_form_fields(self, form_code: str) -> List[Dict]:
        """获取表单字段定义"""
        # 返回标准字段定义
        field_definitions = {
            "RPM_TASK": [
                {"name": "task_id", "type": "text", "required": True},
                {"name": "task_name", "type": "text", "required": True},
                {"name": "project_id", "type": "text", "required": True},
                {"name": "assignee", "type": "user", "required": True},
                {"name": "status", "type": "select", "options": ["todo", "in_progress", "completed", "blocked"]},
                {"name": "priority", "type": "select", "options": ["P0", "P1", "P2", "P3"]},
                {"name": "progress", "type": "number", "min": 0, "max": 100},
                {"name": "planned_hours", "type": "number"},
                {"name": "actual_hours", "type": "number"},
                {"name": "start_date", "type": "date"},
                {"name": "end_date", "type": "date"}
            ]
        }
        return field_definitions.get(form_code, [])

    def _get_process_name(self, process_code: str) -> str:
        """获取流程名称"""
        process_names = {
            "CHANGE_APPROVAL": "变更审批流程",
            "RISK_ESCALATION": "风险升级流程",
            "MILESTONE_REVIEW": "里程碑评审流程"
        }
        return process_names.get(process_code, process_code)

    def _mock_form_data(self, form_code: str) -> List[FormRecord]:
        """生成模拟表单数据"""
        # 用于测试和演示
        return []


# ========== 集成辅助类 ==========

class KaiwuFormHelper:
    """Kaiwu表单操作辅助类"""

    @staticmethod
    def build_condition(field: str, operator: str, value: Any) -> Dict:
        """构建查询条件"""
        return {
            "field": field,
            "operator": operator,
            "value": value
        }

    @staticmethod
    def build_conditions(logic: str = "and", conditions: List[Dict] = None) -> Dict:
        """构建复合查询条件"""
        return {
            "logic": logic,
            "conditions": conditions or []
        }

    @staticmethod
    def map_task_status(status: str) -> str:
        """映射任务状态"""
        status_map = {
            "todo": "待开始",
            "in_progress": "进行中",
            "completed": "已完成",
            "blocked": "已阻塞",
            "delayed": "已延期"
        }
        return status_map.get(status, status)


# 使用示例
if __name__ == "__main__":
    # 初始化适配器
    adapter = KaiwuAdapter(
        app_id="15e5b882231520462e3435fded48cb3c"
    )

    # 获取表单结构
    structure = adapter.get_form_structure("RPM_TASK")
    print(f"表单: {structure['form_name']}")
    print(f"字段数: {len(structure['fields'])}")

    # 同步项目数据
    project_id = "PRJ-2026-001"
    data = adapter.sync_project_data(project_id)

    print(f"\n项目 {project_id} 数据:")
    print(f"  任务数: {len(data['tasks'])}")
    print(f"  变更数: {len(data['changes'])}")
    print(f"  缺陷数: {len(data['defects'])}")
    print(f"  里程碑数: {len(data['milestones'])}")

    # 获取仪表盘数据
    dashboard = adapter.get_project_dashboard_data(project_id)
    print(f"\n仪表盘摘要:")
    print(f"  整体进度: {dashboard['summary']['overall_progress']:.0%}")
    print(f"  未关闭缺陷: {dashboard['summary']['open_defects']}")
