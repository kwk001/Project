#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import re

# 读取文件
with open('PRD文档_国际物流航空货站运行平台及海关信息平台.md', 'r', encoding='utf-8') as f:
    content = f.read()

# 提取2.4业务价值的内容
pattern = r'(## 2\.4 业务价值.*?)(?=\n## 3\. 详细功能描述)'
match = re.search(pattern, content, re.DOTALL)

if match:
    section_24 = match.group(1).strip()
    print("找到2.4业务价值内容")

    # 删除原来的2.4业务价值（在文件末尾的部分）
    last_pattern = r'## 2\.4 业务价值.*?---\n(?=\n## 4\. 非功能性需求)'
    last_match = re.search(last_pattern, content, re.DOTALL)

    if last_match:
        print("找到末尾的2.4业务价值")
        # 删除末尾的2.4业务价值
        content = content[:last_match.start()] + content[last_match.end():]

        # 在2.3使用场景之后插入2.4业务价值
        insert_pattern = r'(### 2\.3 使用场景.*?---\n)(?=\n## 3\. 详细功能描述)'
        insert_match = re.search(insert_pattern, content, re.DOTALL)

        if insert_match:
            print("找到插入位置")
            insert_pos = insert_match.end()
            # 插入2.4业务价值
            content = content[:insert_pos] + '\n' + section_24 + '\n\n' + content[insert_pos:]

            # 保存文件
            with open('PRD文档_国际物流航空货站运行平台及海关信息平台.md', 'w', encoding='utf-8') as f:
                f.write(content)

            print("章节顺序修复完成！")
        else:
            print("未找到插入位置")
    else:
        print("未找到末尾的2.4业务价值")
else:
    print("未找到2.4业务价值内容")
