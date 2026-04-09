#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import pandas as pd

# 读取功能清单
file_path = '功能清单__国际物流航空货站运行平台及海关信息平台V1.1.xlsx'
df = pd.read_excel(file_path, sheet_name='功能清单')
df['一级目录'] = df['一级目录'].ffill()
df['二级目录'] = df['二级目录'].ffill()

# 生成页面详细说明数据
output = []

for system in ['航空货运信息管理系统', '海关信息系统', '园区运行中心', '航空物流公共信息平台']:
    output.append(f'\n=== {system} ===\n')
    system_df = df[df['一级目录'] == system]

    for submodule in system_df['二级目录'].unique():
        submodule_df = system_df[system_df['二级目录'] == submodule]
        output.append(f'\n【{submodule}】\n')

        pages = submodule_df['页面名称'].unique()
        for page in pages:
            page_df = submodule_df[submodule_df['页面名称'] == page]
            functions = ', '.join(page_df['功能点'].tolist())
            p0_count = len(page_df[page_df['优先级'] == 'P0'])
            total = len(page_df)

            desc = str(page_df.iloc[0]['功能描述']) if len(page_df) > 0 else ''
            # 提取应用场景
            if '应用场景：' in desc:
                scenario = desc.split('应用场景：')[1].split('\n')[0].strip()
            else:
                scenario = desc[:80] + '...' if len(desc) > 80 else desc

            output.append(f'  页面：{page}')
            output.append(f'  功能：{functions}')
            output.append(f'  优先级：P0功能{p0_count}个，共{total}个')
            output.append(f'  说明：{scenario}')
            output.append('')

with open('/tmp/page_details.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(output))

print('页面详细说明已保存到 /tmp/page_details.txt')
print(f'共分析了 {len(df)} 个功能点')
