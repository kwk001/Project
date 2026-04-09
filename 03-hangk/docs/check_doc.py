#!/usr/bin/env python3
import zipfile
import xml.etree.ElementTree as ET

docx_path = '3.3章节_四大系统页面详细说明.docx'
with zipfile.ZipFile(docx_path, 'r') as zip_ref:
    xml_content = zip_ref.read('word/document.xml')

root = ET.fromstring(xml_content)
ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}

paragraphs = []
for p in root.findall('.//w:p', ns):
    text_parts = []
    for t in p.findall('.//w:t', ns):
        if t.text:
            text_parts.append(t.text)
    if text_parts:
        para_text = ''.join(text_parts).strip()
        if para_text:
            paragraphs.append(para_text)

print('总段落数:', len(paragraphs))
print('表格数:', len(root.findall('.//w:tbl', ns)))
print()
print('=== 内容预览 ===')
for i, p in enumerate(paragraphs[:40]):
    if len(p) > 5:
        preview = p[:80] + '...' if len(p) > 80 else p
        print(f'{i+1}. {preview}')
