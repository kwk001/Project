#!/usr/bin/env node

/**
 * PRD文档自动化检查脚本
 * 检查PRD是否符合prd-template.md模板要求
 */

const fs = require('fs');
const path = require('path');

// 必需的章节列表
const REQUIRED_SECTIONS = [
  '文档信息',
  '修订记录',
  '需求背景',
  '业务需求',
  '用户痛点',
  '业务目标',
  '功能概述',
  '功能范围',
  '用户画像',
  '使用场景',
  '详细功能描述',
  '功能描述',
  '业务流程',
  '业务规则',
  '验收标准',
  '非功能需求',
  '测试要点',
  '上线方案'
];

// 检查PRD文档
function validatePRD(filePath) {
  const issues = [];
  const warnings = [];
  
  if (!fs.existsSync(filePath)) {
    return { valid: false, issues: ['PRD文件不存在'], warnings: [] };
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // 1. 检查必需章节
  REQUIRED_SECTIONS.forEach(section => {
    if (!content.includes(section)) {
      issues.push(`缺少必需章节: ${section}`);
    }
  });
  
  // 2. 检查文档信息表格
  if (!content.includes('| 文档名称 |') || !content.includes('| 版本号 |')) {
    issues.push('文档信息表格格式不正确');
  }
  
  // 3. 检查Mermaid流程图
  const mermaidMatches = content.match(/```mermaid[\s\S]*?```/g);
  if (!mermaidMatches || mermaidMatches.length === 0) {
    warnings.push('未检测到Mermaid流程图，建议添加业务流程图');
  }
  
  // 4. 检查验收标准
  if (!content.includes('**功能验收：**') || !content.includes('- [ ]')) {
    warnings.push('验收标准格式可能不正确，建议使用复选框格式');
  }
  
  // 5. 检查异常处理
  if (!content.includes('**异常处理：**')) {
    warnings.push('缺少异常处理章节');
  }
  
  // 6. 检查埋点设计
  if (!content.includes('**埋点设计：**')) {
    warnings.push('缺少埋点设计章节');
  }
  
  return {
    valid: issues.length === 0,
    issues,
    warnings,
    sectionCount: REQUIRED_SECTIONS.filter(s => content.includes(s)).length,
    totalSections: REQUIRED_SECTIONS.length
  };
}

// 主函数
function main() {
  const prdPath = process.argv[2] || './PRD.md';
  
  console.log('🔍 开始检查PRD文档...\n');
  console.log(`📄 文件路径: ${prdPath}\n`);
  
  const result = validatePRD(prdPath);
  
  console.log(`✅ 章节覆盖度: ${result.sectionCount}/${result.totalSections}`);
  console.log(`📊 完成度: ${Math.round((result.sectionCount / result.totalSections) * 100)}%\n`);
  
  if (result.issues.length > 0) {
    console.log('❌ 必须修复的问题:');
    result.issues.forEach((issue, index) => {
      console.log(`  ${index + 1}. ${issue}`);
    });
    console.log('');
  }
  
  if (result.warnings.length > 0) {
    console.log('⚠️  建议优化:');
    result.warnings.forEach((warning, index) => {
      console.log(`  ${index + 1}. ${warning}`);
    });
    console.log('');
  }
  
  if (result.valid && result.warnings.length === 0) {
    console.log('🎉 PRD文档检查通过！');
    process.exit(0);
  } else if (result.valid) {
    console.log('⚡ PRD文档基本合格，建议处理警告项');
    process.exit(0);
  } else {
    console.log('❌ PRD文档检查未通过，请修复上述问题');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { validatePRD };
