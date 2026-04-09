#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# 读取文件
with open('PRD文档_国际物流航空货站运行平台及海关信息平台.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 找到2.4业务价值的起始和结束行
start_line = None
end_line = None

for i, line in enumerate(lines):
    if line.strip() == '## 2.4 业务价值':
        start_line = i
        print(f"找到2.4业务价值起始行: {i+1}")
    if start_line is not None and line.strip() == '## 4. 非功能性需求':
        end_line = i
        print(f"找到2.4业务价值结束行(---之后): {i}")
        break

if start_line is None:
    print("未找到2.4业务价值")
    exit(1)

# 提取2.4业务价值的内容（包含---）
section_24_lines = lines[start_line:end_line]
section_24_content = ''.join(section_24_lines)

print(f"提取了 {len(section_24_lines)} 行内容")

# 删除原来的2.4业务价值
lines_before = lines[:start_line]
lines_after = lines[end_line:]

# 找到2.3使用场景之后的位置
insert_pos = None
for i, line in enumerate(lines_before):
    if '### 2.3 使用场景' in line:
        # 找到2.3使用场景后的第一个"---"
        for j in range(i, len(lines_before)):
            if lines_before[j].strip() == '---':
                insert_pos = j + 1
                print(f"找到插入位置: {insert_pos}")
                break
        break

if insert_pos is None:
    print("未找到插入位置")
    exit(1)

# 插入2.4业务价值
new_lines = lines_before[:insert_pos] + ['\n'] + section_24_lines + ['\n'] + lines_before[insert_pos:] + lines_after

# 保存文件
with open('PRD文档_国际物流航空货站运行平台及海关信息平台.md', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("章节顺序修复完成！")
print(f"文件总行数: {len(new_lines)}")
