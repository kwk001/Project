#!/usr/bin/env node

/**
 * React表格页面自动化检查脚本
 * 检查React表格页面是否符合index.jsx模板要求，包括深/浅色系主题
 */

const fs = require('fs');

// 必需的导入和特性
const REQUIRED_IMPORTS = [
  'useState',
  'useEffect',
  'Table',
  'Button',
  'Modal',
  'message'
];

// 必需的表格功能
const REQUIRED_FEATURES = [
  'columns',
  'dataSource',
  'pagination'
];

// 主题相关检查
const THEME_REQUIREMENTS = {
  darkMode: ['isDark', 'dark', 'theme'],
  lightMode: ['light', 'theme'],
  themeSwitch: ['theme.background', 'theme.text', 'theme.border']
};

// 检查React表格页面
function validateReactTable(filePath) {
  const issues = [];
  const warnings = [];
  
  if (!fs.existsSync(filePath)) {
    return { valid: false, issues: ['React文件不存在'], warnings: [] };
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // 1. 检查基础导入
  REQUIRED_IMPORTS.forEach(importItem => {
    if (!content.includes(importItem)) {
      issues.push(`缺少必需导入: ${importItem}`);
    }
  });
  
  // 2. 检查Ant Design组件导入
  if (!content.includes('from \'antd\'') && !content.includes('from "antd"')) {
    issues.push('未检测到Ant Design组件库导入');
  }
  
  // 3. 检查表格基础功能
  REQUIRED_FEATURES.forEach(feature => {
    if (!content.includes(feature)) {
      issues.push(`缺少表格必需属性: ${feature}`);
    }
  });
  
  // 4. 检查深色系主题支持
  const hasDarkMode = THEME_REQUIREMENTS.darkMode.some(keyword => 
    content.toLowerCase().includes(keyword.toLowerCase())
  );
  
  if (!hasDarkMode) {
    issues.push('未检测到深色系主题支持（缺少isDark/theme相关代码）');
  }
  
  // 5. 检查主题切换机制
  const hasThemeSwitch = THEME_REQUIREMENTS.themeSwitch.some(keyword => 
    content.includes(keyword)
  );
  
  if (!hasThemeSwitch) {
    issues.push('未检测到主题切换机制（缺少theme.background/theme.text等）');
  }
  
  // 6. 检查主题上下文使用
  if (!content.includes('useTheme') && !content.includes('ThemeContext') && !content.includes('theme')) {
    warnings.push('建议使用useTheme或ThemeContext管理主题状态');
  }
  
  // 7. 检查表格样式定制
  if (!content.includes('rowClassName') && !content.includes('onRow')) {
    warnings.push('建议添加行样式定制（rowClassName或onRow）');
  }
  
  // 8. 检查加载状态
  if (!content.includes('loading')) {
    warnings.push('建议添加表格加载状态处理');
  }
  
  // 9. 检查操作按钮
  if (!content.includes('新增') && !content.includes('添加')) {
    warnings.push('建议添加"新增"操作按钮');
  }
  
  // 10. 检查搜索功能
  if (!content.includes('search') && !content.includes('Search') && !content.includes('筛选')) {
    warnings.push('建议添加搜索或筛选功能');
  }
  
  // 11. 检查响应式设计
  if (!content.includes('scroll') && !content.includes('responsive')) {
    warnings.push('建议添加表格响应式处理（scroll属性）');
  }
  
  // 12. 检查深色主题样式
  const hasDarkStyles = content.includes('isDark ?') || content.includes('isDark&&');
  if (!hasDarkStyles) {
    issues.push('未检测到深色主题条件样式（如isDark ? ... : ...）');
  }
  
  // 13. 检查导出功能
  if (!content.includes('export') && !content.includes('Export') && !content.includes('导出')) {
    warnings.push('建议添加数据导出功能');
  }
  
  return {
    valid: issues.length === 0,
    issues,
    warnings,
    hasThemeSupport: hasDarkMode && hasThemeSwitch && hasDarkStyles
  };
}

// 主函数
function main() {
  const filePath = process.argv[2] || './index.jsx';
  
  console.log('🔍 开始检查React表格页面...\n');
  console.log(`📄 文件路径: ${filePath}\n`);
  
  const result = validateReactTable(filePath);
  
  console.log(`🎨 主题支持: ${result.hasThemeSupport ? '✅ 已支持深/浅色系' : '❌ 主题支持不完整'}\n`);
  
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
    console.log('🎉 React表格页面检查通过！');
    process.exit(0);
  } else if (result.valid) {
    console.log('⚡ React表格页面基本合格，建议处理警告项');
    process.exit(0);
  } else {
    console.log('❌ React表格页面检查未通过，请修复上述问题');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { validateReactTable };
