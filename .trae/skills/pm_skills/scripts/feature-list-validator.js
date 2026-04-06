#!/usr/bin/env node

/**
 * 功能清单自动化检查脚本
 * 检查功能清单是否符合feature-list-example.md模板要求
 */

const fs = require('fs');

// 必需的表头
const REQUIRED_HEADERS = ['ID', '一级目录', '二级目录', '页面名称', '详细描述', '优先级', '复杂度', '依赖', '验收标准'];

// 优先级有效值
const VALID_PRIORITIES = ['P0', 'P1', 'P2', 'P3'];

// 复杂度有效值
const VALID_COMPLEXITY = ['低', '中', '高'];

// 检查功能清单
function validateFeatureList(filePath) {
  const issues = [];
  const warnings = [];
  
  if (!fs.existsSync(filePath)) {
    return { valid: false, issues: ['功能清单文件不存在'], warnings: [] };
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // 1. 检查必需表头
  REQUIRED_HEADERS.forEach(header => {
    if (!content.includes(header)) {
      issues.push(`缺少必需表头: ${header}`);
    }
  });
  
  // 2. 解析表格内容
  const tableMatch = content.match(/\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|/g);
  
  if (!tableMatch || tableMatch.length < 2) {
    issues.push('未检测到功能清单表格或表格格式不正确');
    return { valid: false, issues, warnings };
  }
  
  // 3. 检查数据行（跳过表头和分隔行）
  const dataRows = tableMatch.slice(2);
  
  if (dataRows.length === 0) {
    warnings.push('功能清单表格为空，未检测到功能项');
  }
  
  // 4. 检查每一行数据
  dataRows.forEach((row, index) => {
    const cells = row.split('|').map(cell => cell.trim()).filter(cell => cell);
    
    if (cells.length < 9) {
      issues.push(`第${index + 1}行数据不完整，缺少必要字段`);
      return;
    }
    
    const [id, level1, level2, pageName, description, priority, complexity, dependency, acceptance] = cells;
    
    // 检查ID格式
    if (!/^F\d{2,}$/.test(id)) {
      issues.push(`第${index + 1}行ID格式不正确: ${id}，应为F开头+数字（如F01）`);
    }
    
    // 检查优先级
    if (!VALID_PRIORITIES.includes(priority)) {
      issues.push(`第${index + 1}行优先级不正确: ${priority}，应为P0/P1/P2/P3`);
    }
    
    // 检查复杂度
    if (!VALID_COMPLEXITY.includes(complexity)) {
      issues.push(`第${index + 1}行复杂度不正确: ${complexity}，应为低/中/高`);
    }
    
    // 检查必填字段
    if (!pageName || pageName === '-') {
      issues.push(`第${index + 1}行页面名称为空`);
    }
    
    if (!description || description === '-') {
      warnings.push(`第${index + 1}行详细描述为空`);
    }
    
    // 检查验收标准格式
    if (!acceptance || acceptance === '-') {
      warnings.push(`第${index + 1}行验收标准为空`);
    } else if (!acceptance.includes('1.') && !acceptance.includes('<br>')) {
      warnings.push(`第${index + 1}行验收标准格式建议优化，使用编号或换行`);
    }
  });
  
  // 5. 检查是否有功能清单编写规范
  if (!content.includes('功能清单编写规范')) {
    warnings.push('建议添加功能清单编写规范说明');
  }
  
  return {
    valid: issues.length === 0,
    issues,
    warnings,
    featureCount: dataRows.length
  };
}

// 主函数
function main() {
  const filePath = process.argv[2] || './feature-list.md';
  
  console.log('🔍 开始检查功能清单...\n');
  console.log(`📄 文件路径: ${filePath}\n`);
  
  const result = validateFeatureList(filePath);
  
  console.log(`📊 功能项数量: ${result.featureCount}\n`);
  
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
    console.log('🎉 功能清单检查通过！');
    process.exit(0);
  } else if (result.valid) {
    console.log('⚡ 功能清单基本合格，建议处理警告项');
    process.exit(0);
  } else {
    console.log('❌ 功能清单检查未通过，请修复上述问题');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { validateFeatureList };
