#!/usr/bin/env python3
"""
RPM Fullstack - 全生命周期项目管理模板生成器
生成所有管理所需的 Excel 模板
"""
import os
import sys

# 将上级目录加入路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from templates.project_plan import generate_project_plan
from templates.task_tracker import generate_task_tracker
from templates.milestone_manager import generate_milestone_manager
from templates.risk_manager import generate_risk_manager
from templates.change_manager import generate_change_manager
from templates.resource_manager import generate_resource_manager
from templates.defect_tracker import generate_defect_tracker
from templates.dashboard import generate_dashboard


def generate_all_templates(output_dir: str = "./output"):
    """生成所有模板文件"""

    os.makedirs(output_dir, exist_ok=True)

    print("=" * 60)
    print("RPM Fullstack - 模板生成器")
    print("=" * 60)

    generators = [
        ("01-项目计划表", generate_project_plan),
        ("02-任务跟踪表", generate_task_tracker),
        ("03-里程碑管理表", generate_milestone_manager),
        ("04-风险管理表", generate_risk_manager),
        ("05-变更管理表", generate_change_manager),
        ("06-资源负载表", generate_resource_manager),
        ("07-缺陷跟踪表", generate_defect_tracker),
        ("08-项目仪表盘", generate_dashboard),
    ]

    for name, generator in generators:
        try:
            filepath = os.path.join(output_dir, f"{name}.xlsx")
            generator(filepath)
            print(f"✅ {name}.xlsx 已生成")
        except Exception as e:
            print(f"❌ {name}.xlsx 生成失败: {e}")

    print("=" * 60)
    print(f"所有模板已保存到: {os.path.abspath(output_dir)}")
    print("=" * 60)


if __name__ == "__main__":
    output_dir = sys.argv[1] if len(sys.argv) > 1 else "./output"
    generate_all_templates(output_dir)
