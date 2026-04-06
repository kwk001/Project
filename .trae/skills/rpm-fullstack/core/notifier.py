#!/usr/bin/env python3
"""
自动化通知器
处理延期、风险、里程碑、质量门禁等事件的通知
"""
from datetime import datetime
from typing import List, Dict, Optional
from dataclasses import dataclass, field
from enum import Enum


class NotificationType(Enum):
    TASK_DELAY = "任务延期"
    RISK_TRIGGER = "风险触发"
    MILESTONE_ARRIVE = "里程碑到达"
    QUALITY_GATE_BLOCK = "质量门禁拦截"
    RESOURCE_OVERLOAD = "资源过载"
    CHANGE_APPROVAL = "变更审批"
    DAILY_SUMMARY = "每日汇总"
    WEEKLY_REPORT = "周报"


class NotificationChannel(Enum):
    WECHAT = "企业微信"
    DINGTALK = "钉钉"
    LARK = "飞书"
    EMAIL = "邮件"
    SMS = "短信"


@dataclass
class Notification:
    """通知定义"""
    id: str
    type: NotificationType
    title: str
    content: str
    recipients: List[str]
    channels: List[NotificationChannel]
    created_at: datetime = field(default_factory=datetime.now)
    priority: str = "normal"  # low, normal, high, urgent
    status: str = "pending"  # pending, sent, failed


class Notifier:
    """通知管理器"""

    def __init__(self, config: Dict = None):
        self.config = config or {}
        self.notification_history: List[Notification] = []

    def notify_task_delay(self, task: Dict, delay_days: int,
                         impact: Dict) -> Notification:
        """任务延期通知"""
        title = f"任务延期警告: {task.get('name', '未知任务')}"

        content = f"""
【任务延期通知】

任务: {task.get('name')}
负责人: {task.get('assignee')}
延期: {delay_days}天
原计划: {task.get('planned_end_date')}
现预计: {task.get('expected_end_date')}

影响分析:
- 是否影响关键路径: {'是' if impact.get('is_critical') else '否'}
- 受影响任务数: {impact.get('affected_count', 0)}
- 项目可能延期: {impact.get('project_delay', 0)}天

建议措施:
{chr(10).join(impact.get('mitigation_suggestions', []))}

请及时处理，如需协助请联系项目经理。
        """.strip()

        notification = Notification(
            id=f"NTF-{datetime.now().timestamp()}",
            type=NotificationType.TASK_DELAY,
            title=title,
            content=content,
            recipients=[task.get('assignee'), '项目经理'],
            channels=[NotificationChannel.WECHAT, NotificationChannel.EMAIL],
            priority="high" if impact.get('is_critical') else "normal"
        )

        self._send(notification)
        return notification

    def notify_risk_trigger(self, risk: Dict) -> Notification:
        """风险触发通知"""
        title = f"风险警报: {risk.get('title')}"

        content = f"""
【风险触发通知】

风险编号: {risk.get('id')}
风险描述: {risk.get('description')}
风险等级: {risk.get('level')}
风险分数: {risk.get('risk_score', 0):.2f}
责任人: {risk.get('owner')}

缓解措施:
{risk.get('mitigation_plan', '待制定')}

请立即采取应对措施！
        """.strip()

        notification = Notification(
            id=f"NTF-{datetime.now().timestamp()}",
            type=NotificationType.RISK_TRIGGER,
            title=title,
            content=content,
            recipients=[risk.get('owner'), '项目经理', '部门负责人'],
            channels=[NotificationChannel.WECHAT],
            priority="urgent" if risk.get('level') == '严重' else "high"
        )

        self._send(notification)
        return notification

    def notify_milestone(self, milestone: Dict, status: str) -> Notification:
        """里程碑通知"""
        if status == "upcoming":
            title = f"里程碑即将到来: {milestone.get('name')}"
            content = f"""
【里程碑提醒】

里程碑: {milestone.get('name')}
计划日期: {milestone.get('planned_date')}
距今还有: 3天

请提前准备交付物和评审材料。
            """.strip()
            priority = "normal"

        elif status == "completed":
            title = f"里程碑已完成: {milestone.get('name')}"
            content = f"""
【里程碑完成】

里程碑: {milestone.get('name')}
实际完成: {milestone.get('actual_date')}
状态: 已通过评审

恭喜团队达成里程碑！
            """.strip()
            priority = "normal"

        else:  # delayed
            title = f"里程碑延期警告: {milestone.get('name')}"
            content = f"""
【里程碑延期】

里程碑: {milestone.get('name')}
计划日期: {milestone.get('planned_date')}
预计延期: {milestone.get('delay_days')}天

请及时评估影响并调整计划！
            """.strip()
            priority = "high"

        notification = Notification(
            id=f"NTF-{datetime.now().timestamp()}",
            type=NotificationType.MILESTONE_ARRIVE,
            title=title,
            content=content,
            recipients=['项目经理', '全团队'],
            channels=[NotificationChannel.WECHAT],
            priority=priority
        )

        self._send(notification)
        return notification

    def notify_quality_gate_block(self, gate: str, reasons: List[str]) -> Notification:
        """质量门禁拦截通知"""
        title = f"质量门禁拦截: {gate}"

        content = f"""
【质量门禁拦截】

门禁点: {gate}
拦截时间: {datetime.now().strftime('%Y-%m-%d %H:%M')}

未通过项:
{chr(10).join(['- ' + r for r in reasons])}

请修复上述问题后重新提交！
        """.strip()

        notification = Notification(
            id=f"NTF-{datetime.now().timestamp()}",
            type=NotificationType.QUALITY_GATE_BLOCK,
            title=title,
            content=content,
            recipients=['研发负责人', '测试负责人', '项目经理'],
            channels=[NotificationChannel.WECHAT, NotificationChannel.EMAIL],
            priority="urgent"
        )

        self._send(notification)
        return notification

    def generate_daily_summary(self, project_data: Dict) -> Notification:
        """生成每日汇总通知"""
        summary = project_data.get('summary', {})

        title = f"项目日报: {project_data.get('project_name', '项目')}"

        content = f"""
【项目日报】{datetime.now().strftime('%Y-%m-%d')}

📊 整体进度: {summary.get('overall_progress', 0):.0%}
✅ 完成任务: {summary.get('completed_tasks', 0)}/{summary.get('total_tasks', 0)}
🐛 未关闭缺陷: {summary.get('open_defects', 0)} (P0: {summary.get('critical_defects', 0)})
⚠️ 进行中风险: {summary.get('open_risks', 0)}
📅 里程碑状态: {summary.get('on_track_milestones', 0)}/{summary.get('total_milestones', 0)}正常

今日待关注:
{chr(10).join(['- ' + item for item in project_data.get('attention_items', [])])}

详细数据请查看项目仪表盘。
        """.strip()

        notification = Notification(
            id=f"NTF-{datetime.now().timestamp()}",
            type=NotificationType.DAILY_SUMMARY,
            title=title,
            content=content,
            recipients=['全团队'],
            channels=[NotificationChannel.WECHAT],
            priority="normal"
        )

        return notification

    def _send(self, notification: Notification):
        """发送通知（模拟实现）"""
        # 实际实现需要对接企业微信/钉钉/飞书等API
        print(f"[通知发送] {notification.type.value}: {notification.title}")
        print(f"  收件人: {', '.join(notification.recipients)}")
        print(f"  优先级: {notification.priority}")
        print(f"  渠道: {', '.join([c.value for c in notification.channels])}")

        notification.status = "sent"
        self.notification_history.append(notification)

    def get_notification_history(self, notification_type: NotificationType = None,
                                 start_date: datetime = None,
                                 end_date: datetime = None) -> List[Notification]:
        """获取通知历史"""
        result = self.notification_history

        if notification_type:
            result = [n for n in result if n.type == notification_type]

        if start_date:
            result = [n for n in result if n.created_at >= start_date]

        if end_date:
            result = [n for n in result if n.created_at <= end_date]

        return result


# 使用示例
if __name__ == "__main__":
    notifier = Notifier()

    # 模拟任务延期通知
    task = {
        "name": "用户登录功能",
        "assignee": "张三",
        "planned_end_date": "2026-04-10",
        "expected_end_date": "2026-04-14"
    }
    impact = {
        "is_critical": True,
        "affected_count": 3,
        "project_delay": 4,
        "mitigation_suggestions": ["协调资源追赶进度", "评估范围裁剪"]
    }
    notifier.notify_task_delay(task, 4, impact)

    # 模拟风险触发通知
    risk = {
        "id": "R001",
        "title": "第三方接口延迟",
        "description": "第三方API对接进度延迟",
        "level": "高",
        "risk_score": 0.72,
        "owner": "架构师",
        "mitigation_plan": "提前对接测试环境"
    }
    notifier.notify_risk_trigger(risk)
