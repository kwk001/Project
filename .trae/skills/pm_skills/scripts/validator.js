#!/usr/bin/env node

/**
 * 统一预检脚本
 * 整合PRD、功能清单、React表格页面的自动化检查
 */

const fs = require('fs');
const path = require('path');

// 导入各检查模块
const { validatePRD } = require('./prd-validator');
const { validateFeatureList } = require('./feature-list-validator');
const { validateReactTable } = require('./react-table-validator');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

// 打印分隔线
function printDivider() {
  console.log(colorize('═'.repeat(60), 'cyan'));
}

// 打印标题
function printTitle(title) {
  console.log('');
  printDivider();
  console.log(colorize(`  ${title}`, 'blue'));
  printDivider();
}

// 主函数
async function main() {
  const projectPath = process.argv[2] || '.';
  
  console.log(colorize('\n  🚀 PM自动化预检工具 v1.0\n', 'green'));
  console.log(`  📁 项目路径: ${path.resolve(projectPath)}\n`);
  
  let allPassed = true;
  const results = {
    prd: null,
    featureList: null,
    reactTable: null
  };
  
  // 1. 检查PRD文档
  printTitle('📄 第一步: 检查PRD需求文档');
  const prdPath = path.join(projectPath, 'PRD.md');
  if (fs.existsSync(prdPath)) {
    results.prd = validatePRD(prdPath);
    console.log(`  ✅ 章节覆盖度: ${results.prd.sectionCount}/${results.prd.totalSections}`);
    console.log(`  📊 完成度: ${Math.round((results.prd.sectionCount / results.prd.totalSections) * 100)}%`);
    
    if (results.prd.issues.length > 0) {
      console.log(colorize(`\n  ❌ 发现 ${results.prd.issues.length} 个问题:`, 'red'));
      results.prd.issues.forEach((issue, i) => {
        console.log(colorize(`     ${i + 1}. ${issue}`, 'red'));
      });
      allPassed = false;
    }
    
    if (results.prd.warnings.length > 0) {
      console.log(colorize(`\n  ⚠️  发现 ${results.prd.warnings.length} 个建议:`, 'yellow'));
      results.prd.warnings.forEach((warning, i) => {
        console.log(colorize(`     ${i + 1}. ${warning}`, 'yellow'));
      });
    }
    
    if (results.prd.valid && results.prd.warnings.length === 0) {
      console.log(colorize('\n  🎉 PRD文档检查通过！', 'green'));
    }
  } else {
    console.log(colorize('  ⚠️  未找到PRD.md文件', 'yellow'));
  }
  
  // 2. 检查功能清单
  printTitle('📋 第二步: 检查功能清单');
  const featureListPath = path.join(projectPath, 'feature-list.md');
  if (fs.existsSync(featureListPath)) {
    results.featureList = validateFeatureList(featureListPath);
    console.log(`  📊 功能项数量: ${results.featureList.featureCount}`);
    
    if (results.featureList.issues.length > 0) {
      console.log(colorize(`\n  ❌ 发现 ${results.featureList.issues.length} 个问题:`, 'red'));
      results.featureList.issues.forEach((issue, i) => {
        console.log(colorize(`     ${i + 1}. ${issue}`, 'red'));
      });
      allPassed = false;
    }
    
    if (results.featureList.warnings.length > 0) {
      console.log(colorize(`\n  ⚠️  发现 ${results.featureList.warnings.length} 个建议:`, 'yellow'));
      results.featureList.warnings.forEach((warning, i) => {
        console.log(colorize(`     ${i + 1}. ${warning}`, 'yellow'));
      });
    }
    
    if (results.featureList.valid && results.featureList.warnings.length === 0) {
      console.log(colorize('\n  🎉 功能清单检查通过！', 'green'));
    }
  } else {
    console.log(colorize('  ⚠️  未找到feature-list.md文件', 'yellow'));
  }
  
  // 3. 检查React表格页面
  printTitle('⚛️ 第三步: 检查React表格页面');
  const reactPaths = [
    path.join(projectPath, 'index.jsx'),
    path.join(projectPath, 'src', 'pages', 'index.jsx'),
    path.join(projectPath, 'src', 'components', 'Table', 'index.jsx')
  ];
  
  let reactPath = null;
  for (const p of reactPaths) {
    if (fs.existsSync(p)) {
      reactPath = p;
      break;
    }
  }
  
  if (reactPath) {
    results.reactTable = validateReactTable(reactPath);
    console.log(`  🎨 主题支持: ${results.reactTable.hasThemeSupport ? colorize('✅ 已支持深/浅色系', 'green') : colorize('❌ 主题支持不完整', 'red')}`);
    
    if (results.reactTable.issues.length > 0) {
      console.log(colorize(`\n  ❌ 发现 ${results.reactTable.issues.length} 个问题:`, 'red'));
      results.reactTable.issues.forEach((issue, i) => {
        console.log(colorize(`     ${i + 1}. ${issue}`, 'red'));
      });
      allPassed = false;
    }
    
    if (results.reactTable.warnings.length > 0) {
      console.log(colorize(`\n  ⚠️  发现 ${results.reactTable.warnings.length} 个建议:`, 'yellow'));
      results.reactTable.warnings.forEach((warning, i) => {
        console.log(colorize(`     ${i + 1}. ${warning}`, 'yellow'));
      });
    }
    
    if (results.reactTable.valid && results.reactTable.warnings.length === 0) {
      console.log(colorize('\n  🎉 React表格页面检查通过！', 'green'));
    }
  } else {
    console.log(colorize('  ⚠️  未找到React表格页面文件', 'yellow'));
  }
  
  // 总结
  printTitle('📊 预检总结');
  
  if (allPassed) {
    console.log(colorize('  ✅ 所有检查项通过！可以进入人工评审阶段。\n', 'green'));
    console.log('  📋 下一步操作:');
    console.log('     1. 查看警告项并进行优化（可选）');
    console.log('     2. 提交至人工深度评审');
    console.log('     3. 计算最终匹配度\n');
    process.exit(0);
  } else {
    console.log(colorize('  ❌ 存在必须修复的问题，请解决后重新运行预检。\n', 'red'));
    console.log('  📋 修复建议:');
    console.log('     1. 根据上述问题清单逐项修复');
    console.log('     2. 参考模板文件进行对照');
    console.log('     3. 修复完成后再次运行预检\n');
    process.exit(1);
  }
}

// 运行主函数
main().catch(err => {
  console.error(colorize(`\n  ❌ 运行出错: ${err.message}\n`, 'red'));
  process.exit(1);
});
