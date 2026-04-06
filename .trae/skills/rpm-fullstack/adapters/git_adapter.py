#!/usr/bin/env python3
"""
Git 代码进度适配器
同步Git提交记录到任务进度
"""
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Set
from dataclasses import dataclass, field
import re
import subprocess
from pathlib import Path


@dataclass
class GitCommit:
    """Git提交记录"""
    hash: str
    author: str
    email: str
    date: datetime
    message: str
    files_changed: List[str] = field(default_factory=list)
    additions: int = 0
    deletions: int = 0
    branch: str = ""


@dataclass
class CodeProgress:
    """代码进度统计"""
    task_id: str
    task_name: str
    commits: List[GitCommit] = field(default_factory=list)
    total_commits: int = 0
    total_additions: int = 0
    total_deletions: int = 0
    files_modified: Set[str] = field(default_factory=set)
    estimated_progress: float = 0.0  # 估算的完成百分比
    last_commit_date: Optional[datetime] = None


class GitAdapter:
    """Git适配器"""

    # 任务ID提取模式
    TASK_ID_PATTERNS = [
        r'#?(TASK|task|Task)-?(\d+)',  # TASK-001, task001
        r'#?(T|t)(\d{3,})',             # T001, t001
        r'\[(T\d+)\]',                  # [T001]
        r'@(T\d+)',                     # @T001
    ]

    def __init__(self, repo_path: str):
        self.repo_path = Path(repo_path)
        self.commits: List[GitCommit] = []

    def fetch_commits(self, since: Optional[datetime] = None,
                     until: Optional[datetime] = None,
                     branch: str = "HEAD") -> List[GitCommit]:
        """
        获取Git提交记录

        Args:
            since: 开始日期
            until: 结束日期
            branch: 分支
        """
        cmd = [
            "git", "log", branch,
            "--pretty=format:%H|%an|%ae|%ad|%s",
            "--date=iso",
            "--numstat"
        ]

        if since:
            cmd.extend(["--since", since.isoformat()])
        if until:
            cmd.extend(["--until", until.isoformat()])

        try:
            result = subprocess.run(
                cmd, cwd=self.repo_path, capture_output=True, text=True
            )

            if result.returncode != 0:
                print(f"Git命令执行失败: {result.stderr}")
                return []

            return self._parse_git_log(result.stdout)

        except Exception as e:
            print(f"获取Git提交失败: {e}")
            return []

    def _parse_git_log(self, log_output: str) -> List[GitCommit]:
        """解析Git日志输出"""
        commits = []
        current_commit = None

        for line in log_output.split('\n'):
            line = line.strip()
            if not line:
                continue

            # 检查是否是提交头行（包含hash、author等信息）
            parts = line.split('|')
            if len(parts) >= 5:
                # 保存上一个commit
                if current_commit:
                    commits.append(current_commit)

                # 解析新的commit
                try:
                    date = datetime.fromisoformat(parts[3].strip())
                except:
                    date = datetime.now()

                current_commit = GitCommit(
                    hash=parts[0].strip(),
                    author=parts[1].strip(),
                    email=parts[2].strip(),
                    date=date,
                    message=parts[4].strip()
                )

            # 检查是否是统计行（additions deletions filename）
            elif current_commit and '\t' in line:
                stats = line.split('\t')
                if len(stats) >= 3:
                    try:
                        additions = int(stats[0]) if stats[0] != '-' else 0
                        deletions = int(stats[1]) if stats[1] != '-' else 0
                        filename = stats[2].strip()

                        current_commit.additions += additions
                        current_commit.deletions += deletions
                        current_commit.files_changed.append(filename)
                    except ValueError:
                        pass

        # 添加最后一个commit
        if current_commit:
            commits.append(current_commit)

        self.commits = commits
        return commits

    def extract_task_ids(self, commit_message: str) -> List[str]:
        """从提交消息中提取任务ID"""
        task_ids = []

        for pattern in self.TASK_ID_PATTERNS:
            matches = re.findall(pattern, commit_message)
            for match in matches:
                if isinstance(match, tuple):
                    # 提取数字部分
                    task_id = f"T{match[1]}"
                else:
                    task_id = match
                if task_id not in task_ids:
                    task_ids.append(task_id)

        return task_ids

    def sync_progress(self, tasks: List[Dict]) -> Dict[str, CodeProgress]:
        """
        同步代码进度到任务

        Args:
            tasks: 任务列表，每项包含task_id, estimated_hours等

        Returns:
            任务ID到代码进度的映射
        """
        if not self.commits:
            self.fetch_commits()

        # 初始化代码进度
        code_progress_map: Dict[str, CodeProgress] = {}

        for task in tasks:
            task_id = task.get('id')
            if task_id:
                code_progress_map[task_id] = CodeProgress(
                    task_id=task_id,
                    task_name=task.get('name', '未知任务')
                )

        # 关联提交到任务
        for commit in self.commits:
            task_ids = self.extract_task_ids(commit.message)

            for task_id in task_ids:
                if task_id in code_progress_map:
                    progress = code_progress_map[task_id]
                    progress.commits.append(commit)
                    progress.total_additions += commit.additions
                    progress.total_deletions += commit.deletions
                    progress.files_modified.update(commit.files_changed)

                    if not progress.last_commit_date or commit.date > progress.last_commit_date:
                        progress.last_commit_date = commit.date

        # 计算估算进度
        for task_id, progress in code_progress_map.items():
            progress.total_commits = len(progress.commits)

            # 查找对应的任务信息
            task_info = next((t for t in tasks if t.get('id') == task_id), None)
            if task_info:
                progress.estimated_progress = self._estimate_progress(
                    progress, task_info
                )

        return code_progress_map

    def _estimate_progress(self, progress: CodeProgress, task: Dict) -> float:
        """
        估算任务完成百分比

        算法：
        1. 如果有预估工时，根据代码提交量估算
        2. 如果有故事点，根据复杂度估算
        3. 综合多个因素给出进度
        """
        if not progress.commits:
            return 0.0

        estimated_hours = task.get('estimated_hours', 0)
        story_points = task.get('story_points', 0)

        # 基于提交次数的进度估算（简单模型）
        if story_points > 0:
            # 假设每个故事点对应2-3个commit
            expected_commits = story_points * 2
            commit_progress = min(1.0, progress.total_commits / expected_commits)
        elif estimated_hours > 0:
            # 假设每小时对应0.5个commit
            expected_commits = estimated_hours * 0.5
            commit_progress = min(1.0, progress.total_commits / expected_commits)
        else:
            # 没有预估数据，使用固定阈值
            commit_progress = min(1.0, progress.total_commits / 5)

        # 基于代码行数的进度估算
        total_lines = progress.total_additions + progress.total_deletions
        if estimated_hours > 0:
            # 假设每小时产生20-30行代码变更
            expected_lines = estimated_hours * 25
            lines_progress = min(1.0, total_lines / expected_lines)
        else:
            lines_progress = 0.5  # 默认值

        # 基于文件数的进度估算
        files_count = len(progress.files_modified)
        if story_points > 0:
            expected_files = story_points
            files_progress = min(1.0, files_count / expected_files)
        else:
            files_progress = min(1.0, files_count / 3)

        # 加权综合
        # commit频率权重40%，代码量权重30%，文件数权重30%
        estimated = (
            commit_progress * 0.4 +
            lines_progress * 0.3 +
            files_progress * 0.3
        )

        # 基于提交时间的活跃度调整
        if progress.last_commit_date:
            days_since_last_commit = (datetime.now() - progress.last_commit_date).days
            if days_since_last_commit > 7:
                # 超过7天无提交，可能已暂停或完成
                pass

        return round(min(1.0, estimated), 2)

    def generate_contribution_report(self, since: Optional[datetime] = None) -> Dict:
        """生成代码贡献报告"""
        if not self.commits:
            self.fetch_commits(since=since)

        # 按作者统计
        author_stats: Dict[str, Dict] = {}

        for commit in self.commits:
            author = commit.author

            if author not in author_stats:
                author_stats[author] = {
                    "commits": 0,
                    "additions": 0,
                    "deletions": 0,
                    "files_changed": set(),
                    "tasks": set()
                }

            author_stats[author]["commits"] += 1
            author_stats[author]["additions"] += commit.additions
            author_stats[author]["deletions"] += commit.deletions
            author_stats[author]["files_changed"].update(commit.files_changed)

            # 提取关联的任务
            task_ids = self.extract_task_ids(commit.message)
            author_stats[author]["tasks"].update(task_ids)

        # 转换为列表格式
        contributors = []
        for author, stats in author_stats.items():
            contributors.append({
                "name": author,
                "commits": stats["commits"],
                "additions": stats["additions"],
                "deletions": stats["deletions"],
                "files_changed": len(stats["files_changed"]),
                "tasks_count": len(stats["tasks"])
            })

        # 按提交数排序
        contributors.sort(key=lambda x: x["commits"], reverse=True)

        return {
            "total_commits": len(self.commits),
            "total_additions": sum(c.additions for c in self.commits),
            "total_deletions": sum(c.deletions for c in self.commits),
            "contributors": contributors,
            "date_range": {
                "start": min(c.date for c in self.commits).isoformat() if self.commits else None,
                "end": max(c.date for c in self.commits).isoformat() if self.commits else None
            }
        }

    def detect_code_hotspots(self) -> List[Dict]:
        """
        检测代码热点（频繁修改的文件）

        用于识别可能存在技术债务或设计问题的模块
        """
        file_changes: Dict[str, Dict] = {}

        for commit in self.commits:
            for filename in commit.files_changed:
                if filename not in file_changes:
                    file_changes[filename] = {
                        "changes": 0,
                        "commits": set(),
                        "additions": 0,
                        "deletions": 0
                    }

                file_changes[filename]["changes"] += 1
                file_changes[filename]["commits"].add(commit.hash)
                file_changes[filename]["additions"] += commit.additions
                file_changes[filename]["deletions"] += commit.deletions

        # 按变更次数排序
        hotspots = []
        for filename, stats in file_changes.items():
            if stats["changes"] >= 3:  # 至少修改3次才算热点
                hotspots.append({
                    "file": filename,
                    "change_count": stats["changes"],
                    "commit_count": len(stats["commits"]),
                    "churn": stats["additions"] + stats["deletions"],
                    "risk_level": "high" if stats["changes"] >= 5 else "medium"
                })

        hotspots.sort(key=lambda x: x["change_count"], reverse=True)
        return hotspots[:10]  # 返回前10个热点


# 使用示例
if __name__ == "__main__":
    import sys

    # 示例：分析当前目录的Git仓库
    repo_path = sys.argv[1] if len(sys.argv) > 1 else "."

    adapter = GitAdapter(repo_path)

    # 获取最近30天的提交
    since = datetime.now() - timedelta(days=30)
    commits = adapter.fetch_commits(since=since)

    print(f"获取到 {len(commits)} 条提交记录")

    # 模拟任务列表
    tasks = [
        {"id": "T001", "name": "用户登录功能", "estimated_hours": 16, "story_points": 3},
        {"id": "T002", "name": "商品列表页", "estimated_hours": 24, "story_points": 5},
        {"id": "T003", "name": "购物车功能", "estimated_hours": 20, "story_points": 4},
    ]

    # 同步进度
    progress_map = adapter.sync_progress(tasks)

    print("\n任务代码进度:")
    for task_id, progress in progress_map.items():
        print(f"  {progress.task_name} ({task_id}):")
        print(f"    提交数: {progress.total_commits}")
        print(f"    代码变更: +{progress.total_additions}/-{progress.total_deletions}")
        print(f"    估算进度: {progress.estimated_progress:.0%}")
        print()

    # 生成贡献报告
    report = adapter.generate_contribution_report(since=since)
    print("\n贡献者统计:")
    for contributor in report["contributors"]:
        print(f"  {contributor['name']}: {contributor['commits']}次提交, "
              f"+{contributor['additions']}/-{contributor['deletions']}行代码")

    # 检测代码热点
    hotspots = adapter.detect_code_hotspots()
    print("\n代码热点 (Top 5):")
    for hotspot in hotspots[:5]:
        print(f"  {hotspot['file']}: {hotspot['change_count']}次变更 "
              f"(风险: {hotspot['risk_level']})")
