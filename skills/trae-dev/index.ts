import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

export async function run(params: any) {
  const { command, args } = params;
  
  if (command === 'trae' && args[0] === 'start') {
    // 启动 Trae IDE
    exec('/Applications/Trae CN.app/Contents/MacOS/Trae CN', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
    });
    return {
      response: '正在启动 Trae IDE...'
    };
  }
  
  if (command === 'trae' && args[0] === 'open' && args[1]) {
    // 打开指定项目
    const projectPath = args[1];
    exec(`/Applications/Trae CN.app/Contents/MacOS/Trae CN ${projectPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
    });
    return {
      response: `正在打开项目: ${projectPath}`
    };
  }
  
  if (command === 'trae' && args[0] === 'file' && args[1] === 'open' && args[2]) {
    // 打开指定文件
    const filePath = args[2];
    exec(`/Applications/Trae CN.app/Contents/MacOS/Trae CN ${filePath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
    });
    return {
      response: `正在打开文件: ${filePath}`
    };
  }
  
  if (command === 'trae' && args[0] === 'file' && args[1] === 'list' && args[2]) {
    // 列出目录中的文件
    const directory = args[2];
    try {
      const files = fs.readdirSync(directory);
      const fileList = files.map(file => {
        const fullPath = path.join(directory, file);
        const stats = fs.statSync(fullPath);
        return `${file}${stats.isDirectory() ? '/' : ''}`;
      }).join('\n');
      return {
        response: `目录 ${directory} 中的文件：\n${fileList}`
      };
    } catch (error) {
      return {
        response: `错误：${error.message}`
      };
    }
  }
  
  if (command === 'trae' && args[0] === 'file' && args[1] === 'read' && args[2]) {
    // 读取文件内容
    const filePath = args[2];
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      // 限制返回内容长度，避免消息过长
      const maxLength = 1000;
      const truncatedContent = content.length > maxLength ? content.substring(0, maxLength) + '...（内容已截断）' : content;
      return {
        response: `文件 ${filePath} 的内容：\n\`\`\`\n${truncatedContent}\n\`\`\``
      };
    } catch (error) {
      return {
        response: `错误：${error.message}`
      };
    }
  }
  
  return {
    response: 'Trae 技能命令格式：\ntrae start\ntrae open <项目路径>\ntrae file open <文件路径>\ntrae file list <目录路径>\ntrae file read <文件路径>'
  };
}