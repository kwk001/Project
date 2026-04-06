#!/usr/bin/env python3
"""
RPM Fullstack - 研发项目全生命周期管理
主入口脚本

Usage:
    python main.py init --config project.json --output ./output
    python main.py update --project ./project --git-sync
    python main.py change --project ./project --request change.json
    python main.py milestone --project ./project --milestone M2
    python main.py retro --project ./project --output ./report
"""
import argparse
import json
import os
import sys
from datetime import datetime

# 添加当前目录到路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from core.planner import SmartScheduler, PriorityBasedPlanner, Task, TeamMember, Priority
from core.risk_engine import RiskEngine
from core.dependency_graph import DependencyGraph, TaskNode, Dependency
from core.notifier import Notifier, NotificationType
from adapters.git_adapter import GitAdapter
from adapters.kaiwu_adapter import KaiwuAdapter


def cmd_init(args):
    """初始化项目"""
    print("=" * 60)
    print("RPM Fullstack - 项目初始化")
    print("=" * 60)

    # 加载配置
    if args.config:
        with open(args.config, 'r', encoding='utf-8') as f:
            config = json.load(f)
    else:
        # 使用默认配置
        config = {
            "project_name": "新项目",
            "template": "agile",
            "start_date": datetime.now().strftime("%Y-%m-%d"),
            "team": []
        }

    # 加载项目模板
    template_path = f"./config/project-templates.json"
    if os.path.exists(template_path):
        with open(template_path, 'r', encoding='utf-8') as f:
            templates = json.load(f)
            template = templates.get("templates", {}).get(config.get("template", "agile"), {})
    else:
        template = {}

    # 生成项目计划
    output_dir = args.output or "./output"
    os.makedirs(output_dir, exist_ok=True)

    # 调用模板生成器
    from templates.generate_all import generate_all_templates
    generate_all_templates(output_dir)

    print(f"\n项目初始化完成！")
    print(f"输出目录: {os.path.abspath(output_dir)}")
    print("=" * 60)


def cmd_update(args):
    """更新项目进度"""
    print("=" * 60)
    print("RPM Fullstack - 进度更新")
    print("=" * 60)

    project_dir = args.project

    # 同步Git进度
    if args.git_sync:
        print("\n同步Git代码进度...")
        git_adapter = GitAdapter(args.git_repo or project_dir)
        commits = git_adapter.fetch_commits(since=datetime.now() - __import__('datetime').timedelta(days=7))
        print(f"  获取到 {len(commits)} 条提交记录")

    # 扫描风险
    print("\n扫描项目风险...")
    risk_engine = RiskEngine()
    # 这里需要加载项目数据

    # 生成日报
    if args.report:
        print("\n生成项目报告...")
        notifier = Notifier()
        # 生成并发送报告

    print("=" * 60)


def cmd_change(args):
    """处理变更请求"""
    print("=" * 60)
    print("RPM Fullstack - 变更管理")
    print("=" * 60)

    # 加载变更请求
    if args.request:
        with open(args.request, 'r', encoding='utf-8') as f:
            change_request = json.load(f)
        print(f"变更请求: {change_request.get('title', '未命名')}")

    # 评估影响
    print("\n评估变更影响...")

    # 如果自动调整
    if args.auto_adjust:
        print("自动调整项目计划...")

    print("=" * 60)


def cmd_milestone(args):
    """里程碑评审"""
    print("=" * 60)
    print("RPM Fullstack - 里程碑评审")
    print("=" * 60)

    milestone_id = args.milestone
    print(f"里程碑: {milestone_id}")

    # 检查准入条件
    print("\n检查准入条件...")

    # 生成评审报告
    print("生成评审报告...")

    print("=" * 60)


def cmd_retro(args):
    """项目复盘"""
    print("=" * 60)
    print("RPM Fullstack - 项目复盘")
    print("=" * 60)

    project_dir = args.project
    output_dir = args.output or "./report"
    os.makedirs(output_dir, exist_ok=True)

    # 汇总项目数据
    print("\n汇总项目数据...")

    # 生成复盘报告
    print("生成复盘报告...")

    print(f"\n复盘报告已保存到: {os.path.abspath(output_dir)}")
    print("=" * 60)


def main():
    parser = argparse.ArgumentParser(
        description="RPM Fullstack - 研发项目全生命周期管理",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  # 初始化新项目
  python main.py init --config project.json --output ./myproject

  # 每日进度更新
  python main.py update --project ./myproject --git-sync --report

  # 提交变更请求
  python main.py change --project ./myproject --request change.json

  # 里程碑评审
  python main.py milestone --project ./myproject --milestone M2

  # 项目复盘
  python main.py retro --project ./myproject --output ./report
        """
    )

    subparsers = parser.add_subparsers(dest='command', help='可用命令')

    # init 命令
    init_parser = subparsers.add_parser('init', help='初始化新项目')
    init_parser.add_argument('--config', '-c', help='项目配置文件路径')
    init_parser.add_argument('--output', '-o', help='输出目录')
    init_parser.set_defaults(func=cmd_init)

    # update 命令
    update_parser = subparsers.add_parser('update', help='更新项目进度')
    update_parser.add_argument('--project', '-p', required=True, help='项目目录')
    update_parser.add_argument('--git-sync', action='store_true', help='同步Git进度')
    update_parser.add_argument('--git-repo', help='Git仓库路径')
    update_parser.add_argument('--report', '-r', action='store_true', help='生成报告')
    update_parser.set_defaults(func=cmd_update)

    # change 命令
    change_parser = subparsers.add_parser('change', help='处理变更请求')
    change_parser.add_argument('--project', '-p', required=True, help='项目目录')
    change_parser.add_argument('--request', '-r', required=True, help='变更请求文件')
    change_parser.add_argument('--auto-adjust', action='store_true', help='自动调整计划')
    change_parser.set_defaults(func=cmd_change)

    # milestone 命令
    milestone_parser = subparsers.add_parser('milestone', help='里程碑评审')
    milestone_parser.add_argument('--project', '-p', required=True, help='项目目录')
    milestone_parser.add_argument('--milestone', '-m', required=True, help='里程碑ID')
    milestone_parser.set_defaults(func=cmd_milestone)

    # retro 命令
    retro_parser = subparsers.add_parser('retro', help='项目复盘')
    retro_parser.add_argument('--project', '-p', required=True, help='项目目录')
    retro_parser.add_argument('--output', '-o', help='报告输出目录')
    retro_parser.set_defaults(func=cmd_retro)

    args = parser.parse_args()

    if args.command is None:
        parser.print_help()
        sys.exit(1)

    args.func(args)


if __name__ == "__main__":
    main()
