#!/usr/bin/env python3
"""
风险预报引擎
监控项目状态，自动识别风险并预报
"""
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Set
from dataclasses import dataclass, field
from enum import Enum
import json


class RiskLevel(Enum):
    LOW = "低"
    MEDIUM = "中"
    HIGH = "高"
    CRITICAL = "严重"


class RiskStatus(Enum):
    OPEN = "开放"
    MONITORING = "监控中"
    MITIGATED = "已缓解"
    CLOSED = "已关闭"
    CONVERTED = "已转为问题"


class RiskCategory(Enum):
    SCHEDULE = "进度风险"
    RESOURCE = "资源风险"
    TECHNICAL = "技术风险"
    QUALITY = "质量风险"
    SCOPE = "范围风险"
    EXTERNAL = "外部风险"


@dataclass
class Risk:
    """风险定义"""
    id: str
    title: str
    description: str
    category: RiskCategory
    level: RiskLevel
    probability: float  # 0-1
    impact: float  # 0-1
    owner: str
    status: RiskStatus = RiskStatus.OPEN
    created_at: datetime = field(default_factory=datetime.now)
    identified_by: str = "system"
    mitigation_plan: str = ""
    contingency_plan: str = ""
    trigger_condition: str = ""
    related_tasks: List[str] = field(default_factory=list)
    related_milestones: List[str] = field(default_factory=list)
    escalation_count: int = 0

    @property
    def risk_score(self) -> float:
        """风险分数 = 概率 × 影响"""
        return self.probability * self.impact


@dataclass
class Issue:
    """问题定义（风险转化后）"""
    id: str
    title: str
    description: str
    source_risk_id: Optional[str]
    severity: RiskLevel
    status: str  # 新建/处理中/已解决/已关闭
    owner: str
    created_at: datetime
    resolved_at: Optional[datetime] = None
    solution: str = ""
    lessons_learned: str = ""


class RiskEngine:
    """风险引擎核心类"""

    # 风险阈值配置
    THRESHOLDS = {
        "task_delay_days": 1,  # 任务延期超过1天触发风险
        "critical_path_delay_days": 0.5,  # 关键路径延期超过0.5天触发高风险
        "resource_overload": 1.1,  # 资源负载超过110%触发风险
        "defect_density": 0.5,  # 缺陷密度超过0.5/kloc触发风险
        "scope_change_per_week": 3,  # 每周变更超过3次触发风险
    }

    def __init__(self):
        self.risks: Dict[str, Risk] = {}
        self.issues: Dict[str, Issue] = {}
        self.risk_counter = 0
        self.issue_counter = 0

    def scan_project_health(self, project_data: Dict) -> List[Risk]:
        """
        扫描项目健康状态，识别潜在风险

        Args:
            project_data: 项目数据，包含任务、资源、质量等信息
        """
        new_risks = []

        # 1. 检查任务延期
        task_risks = self._check_task_delays(project_data.get('tasks', []))
        new_risks.extend(task_risks)

        # 2. 检查关键路径
        cp_risks = self._check_critical_path(project_data.get('critical_path', []))
        new_risks.extend(cp_risks)

        # 3. 检查资源负载
        resource_risks = self._check_resource_overload(project_data.get('resources', []))
        new_risks.extend(resource_risks)

        # 4. 检查质量指标
        quality_risks = self._check_quality_metrics(project_data.get('quality', {}))
        new_risks.extend(quality_risks)

        # 5. 检查范围变更
        scope_risks = self._check_scope_changes(project_data.get('changes', []))
        new_risks.extend(scope_risks)

        # 6. 检查里程碑健康度
        milestone_risks = self._check_milestone_health(project_data.get('milestones', []))
        new_risks.extend(milestone_risks)

        # 保存新识别的风险
        for risk in new_risks:
            self.risks[risk.id] = risk

        return new_risks

    def _check_task_delays(self, tasks: List[Dict]) -> List[Risk]:
        """检查任务延期风险"""
        risks = []

        for task in tasks:
            status = task.get('status')
            planned_end = task.get('planned_end_date')
            actual_end = task.get('actual_end_date')
            expected_end = task.get('expected_end_date')

            if status == 'delayed' or (expected_end and planned_end and expected_end > planned_end):
                delay_days = (expected_end - planned_end).days if isinstance(expected_end, datetime) else 1

                if delay_days >= self.THRESHOLDS['task_delay_days']:
                    self.risk_counter += 1
                    risk = Risk(
                        id=f"R{self.risk_counter:03d}",
                        title=f"任务延期: {task.get('name', '未知任务')}",
                        description=f"任务延期{delay_days}天，可能影响后续依赖任务",
                        category=RiskCategory.SCHEDULE,
                        level=RiskLevel.HIGH if delay_days > 3 else RiskLevel.MEDIUM,
                        probability=0.8,
                        impact=0.7 if task.get('on_critical_path') else 0.4,
                        owner=task.get('assignee', '项目经理'),
                        related_tasks=[task.get('id')],
                        trigger_condition=f"延期>={self.THRESHOLDS['task_delay_days']}天",
                        mitigation_plan="评估延期影响，协调资源追赶进度，必要时调整后续计划"
                    )
                    risks.append(risk)

        return risks

    def _check_critical_path(self, critical_path: List[Dict]) -> List[Risk]:
        """检查关键路径风险"""
        risks = []

        total_delay = sum(task.get('delay_days', 0) for task in critical_path)

        if total_delay > self.THRESHOLDS['critical_path_delay_days']:
            self.risk_counter += 1
            risk = Risk(
                id=f"R{self.risk_counter:03d}",
                title="关键路径延期",
                description=f"关键路径总延期{total_delay:.1f}天，项目整体进度受到威胁",
                category=RiskCategory.SCHEDULE,
                level=RiskLevel.CRITICAL,
                probability=0.9,
                impact=0.9,
                owner="项目经理",
                related_tasks=[t.get('id') for t in critical_path],
                trigger_condition=f"关键路径延期>={self.THRESHOLDS['critical_path_delay_days']}天",
                mitigation_plan="立即启动应急响应：1) 增加资源 2) 范围裁剪 3) 加班赶工",
                contingency_plan="准备项目延期通知，评估范围裁剪方案"
            )
            risks.append(risk)

        return risks

    def _check_resource_overload(self, resources: List[Dict]) -> List[Risk]:
        """检查资源过载风险"""
        risks = []

        for resource in resources:
            utilization = resource.get('utilization', 0)

            if utilization > self.THRESHOLDS['resource_overload']:
                self.risk_counter += 1
                risk = Risk(
                    id=f"R{self.risk_counter:03d}",
                    title=f"资源过载: {resource.get('name', '未知人员')}",
                    description=f"资源负载{utilization:.0%}，超过健康阈值，可能导致 burnout 或质量下降",
                    category=RiskCategory.RESOURCE,
                    level=RiskLevel.HIGH if utilization > 1.3 else RiskLevel.MEDIUM,
                    probability=0.7,
                    impact=0.6,
                    owner="项目经理",
                    mitigation_plan="1) 重新分配任务 2) 延长工期 3) 增加资源",
                    contingency_plan="准备人员调配方案，评估招聘或外包"
                )
                risks.append(risk)

        return risks

    def _check_quality_metrics(self, quality: Dict) -> List[Risk]:
        """检查质量指标风险"""
        risks = []

        defect_density = quality.get('defect_density', 0)
        if defect_density > self.THRESHOLDS['defect_density']:
            self.risk_counter += 1
            risk = Risk(
                id=f"R{self.risk_counter:03d}",
                title="缺陷密度超标",
                description=f"缺陷密度{defect_density:.2f}/kloc，超过阈值{self.THRESHOLDS['defect_density']}",
                category=RiskCategory.QUALITY,
                level=RiskLevel.HIGH,
                probability=0.8,
                impact=0.7,
                owner="测试负责人",
                mitigation_plan="1) 加强代码审查 2) 增加测试覆盖 3) 暂停新功能开发，专注修复",
                contingency_plan="评估上线延期，准备质量改进计划"
            )
            risks.append(risk)

        # 检查P0缺陷
        critical_defects = quality.get('critical_defects_open', 0)
        if critical_defects > 0:
            self.risk_counter += 1
            risk = Risk(
                id=f"R{self.risk_counter:03d}",
                title=f"存在{critical_defects}个P0缺陷未关闭",
                description="P0缺陷阻塞上线，必须全部修复才能发布",
                category=RiskCategory.QUALITY,
                level=RiskLevel.CRITICAL,
                probability=1.0,
                impact=0.9,
                owner="研发负责人",
                mitigation_plan="立即修复所有P0缺陷，暂停新功能开发",
                contingency_plan="评估上线延期，准备热修复方案"
            )
            risks.append(risk)

        return risks

    def _check_scope_changes(self, changes: List[Dict]) -> List[Risk]:
        """检查范围变更风险"""
        risks = []

        # 统计最近一周的变更
        recent_changes = [
            c for c in changes
            if (datetime.now() - c.get('created_at', datetime.now())).days <= 7
        ]

        if len(recent_changes) > self.THRESHOLDS['scope_change_per_week']:
            self.risk_counter += 1
            risk = Risk(
                id=f"R{self.risk_counter:03d}",
                title="范围变更频繁",
                description=f"本周发生{len(recent_changes)}次范围变更，可能影响项目稳定性",
                category=RiskCategory.SCOPE,
                level=RiskLevel.MEDIUM,
                probability=0.6,
                impact=0.5,
                owner="产品经理",
                mitigation_plan="1) 加强变更控制 2) 冻结非紧急变更 3) 评估影响并调整计划",
                contingency_plan="准备项目范围基线重新确认"
            )
            risks.append(risk)

        return risks

    def _check_milestone_health(self, milestones: List[Dict]) -> List[Risk]:
        """检查里程碑健康度"""
        risks = []

        for milestone in milestones:
            status = milestone.get('status')
            planned_date = milestone.get('planned_date')
            projected_date = milestone.get('projected_date')

            if status == 'at_risk' and planned_date and projected_date:
                delay_days = (projected_date - planned_date).days

                self.risk_counter += 1
                risk = Risk(
                    id=f"R{self.risk_counter:03d}",
                    title=f"里程碑风险: {milestone.get('name', '未知里程碑')}",
                    description=f"里程碑预计延期{delay_days}天",
                    category=RiskCategory.SCHEDULE,
                    level=RiskLevel.HIGH if delay_days > 3 else RiskLevel.MEDIUM,
                    probability=0.75,
                    impact=0.6,
                    owner="项目经理",
                    related_milestones=[milestone.get('id')],
                    mitigation_plan="评估关键路径，协调资源，必要时向上汇报"
                )
                risks.append(risk)

        return risks

    def convert_risk_to_issue(self, risk_id: str, reason: str) -> Optional[Issue]:
        """
        将风险转化为问题

        触发条件：
        1. 风险发生（概率实现）
        2. 风险升级次数超过阈值
        """
        risk = self.risks.get(risk_id)
        if not risk:
            return None

        self.issue_counter += 1
        issue = Issue(
            id=f"I{self.issue_counter:03d}",
            title=risk.title,
            description=f"{risk.description}\n转化原因: {reason}",
            source_risk_id=risk_id,
            severity=risk.level,
            status="新建",
            owner=risk.owner,
            created_at=datetime.now()
        )

        self.issues[issue.id] = issue
        risk.status = RiskStatus.CONVERTED

        return issue

    def get_risk_report(self) -> Dict:
        """生成风险报告"""
        open_risks = [r for r in self.risks.values() if r.status == RiskStatus.OPEN]
        critical_risks = [r for r in open_risks if r.level == RiskLevel.CRITICAL]
        high_risks = [r for r in open_risks if r.level == RiskLevel.HIGH]

        # 按类别统计
        category_counts = {}
        for risk in open_risks:
            cat = risk.category.value
            category_counts[cat] = category_counts.get(cat, 0) + 1

        return {
            "summary": {
                "total_risks": len(self.risks),
                "open_risks": len(open_risks),
                "critical": len(critical_risks),
                "high": len(high_risks),
                "medium": len([r for r in open_risks if r.level == RiskLevel.MEDIUM]),
                "low": len([r for r in open_risks if r.level == RiskLevel.LOW]),
                "converted_to_issues": len([r for r in self.risks.values() if r.status == RiskStatus.CONVERTED])
            },
            "by_category": category_counts,
            "critical_risks": [
                {
                    "id": r.id,
                    "title": r.title,
                    "owner": r.owner,
                    "mitigation": r.mitigation_plan
                }
                for r in critical_risks
            ],
            "recommendations": self._generate_recommendations(open_risks)
        }

    def _generate_recommendations(self, risks: List[Risk]) -> List[str]:
        """生成风险应对建议"""
        recommendations = []

        # 按类别分组建议
        has_schedule_risk = any(r.category == RiskCategory.SCHEDULE for r in risks)
        has_resource_risk = any(r.category == RiskCategory.RESOURCE for r in risks)
        has_quality_risk = any(r.category == RiskCategory.QUALITY for r in risks)

        if has_schedule_risk:
            recommendations.append("建议召开进度评审会，评估关键路径优化方案")

        if has_resource_risk:
            recommendations.append("建议进行资源重新调配，考虑增加人员或调整任务分配")

        if has_quality_risk:
            recommendations.append("建议暂停新功能开发，集中资源解决质量问题")

        if len(risks) > 5:
            recommendations.append("项目整体风险较高，建议向管理层汇报并启动风险应对预案")

        return recommendations

    def auto_escalate(self) -> List[Dict]:
        """
        自动升级处理

        升级条件：
        1. 风险开放超过7天无进展
        2. 高风险持续3天未缓解
        """
        escalations = []

        for risk in self.risks.values():
            if risk.status != RiskStatus.OPEN:
                continue

            days_open = (datetime.now() - risk.created_at).days

            should_escalate = False
            escalation_level = ""

            if risk.level == RiskLevel.CRITICAL and days_open >= 1:
                should_escalate = True
                escalation_level = "immediate"
            elif risk.level == RiskLevel.HIGH and days_open >= 3:
                should_escalate = True
                escalation_level = "urgent"
            elif days_open >= 7:
                should_escalate = True
                escalation_level = "normal"

            if should_escalate:
                risk.escalation_count += 1
                escalations.append({
                    "risk_id": risk.id,
                    "risk_title": risk.title,
                    "escalation_level": escalation_level,
                    "days_open": days_open,
                    "notify": ["Project Manager", "Department Head"] if escalation_level == "immediate" else ["Project Manager"]
                })

        return escalations


# 使用示例
if __name__ == "__main__":
    engine = RiskEngine()

    # 模拟项目数据
    project_data = {
        "tasks": [
            {
                "id": "T001",
                "name": "登录功能",
                "status": "delayed",
                "planned_end_date": datetime(2026, 4, 10),
                "expected_end_date": datetime(2026, 4, 14),
                "assignee": "张三",
                "on_critical_path": True
            },
            {
                "id": "T002",
                "name": "支付功能",
                "status": "in_progress",
                "assignee": "李四",
                "on_critical_path": True
            }
        ],
        "critical_path": [
            {"id": "T001", "delay_days": 4}
        ],
        "resources": [
            {"name": "张三", "utilization": 1.2},
            {"name": "李四", "utilization": 1.5}
        ],
        "quality": {
            "defect_density": 0.8,
            "critical_defects_open": 2
        },
        "changes": [
            {"created_at": datetime.now() - timedelta(days=1)},
            {"created_at": datetime.now() - timedelta(days=2)},
            {"created_at": datetime.now() - timedelta(days=3)},
            {"created_at": datetime.now() - timedelta(days=4)}
        ],
        "milestones": [
            {
                "id": "M1",
                "name": "设计评审",
                "status": "at_risk",
                "planned_date": datetime(2026, 4, 15),
                "projected_date": datetime(2026, 4, 18)
            }
        ]
    }

    # 扫描风险
    new_risks = engine.scan_project_health(project_data)

    print(f"识别到 {len(new_risks)} 个新风险:")
    for risk in new_risks:
        print(f"  [{risk.level.value}] {risk.title}")
        print(f"    类别: {risk.category.value}")
        print(f"    风险分: {risk.risk_score:.2f}")
        print(f"    负责人: {risk.owner}")
        print()

    # 生成风险报告
    report = engine.get_risk_report()
    print("风险报告:")
    print(json.dumps(report, ensure_ascii=False, indent=2))
