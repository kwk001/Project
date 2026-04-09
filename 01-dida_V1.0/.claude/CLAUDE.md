# 低代码项目开发指南

**重要提示：请使用中文进行所有回复和交互**

## 项目类型

这是一个低代码应用开发项目，使用开物云低代码引擎（@kaiwu-cloud/lowcode-engine）构建。

## 核心技能使用

- kagent-skills 位于 ../.kagent/kagent-skills目录，
- 优先使用 ../.kagent/kagent-skills/marketplace.json 来确定可用的skill

**优先使用以下 Skills 完成任务**：

### 低代码开发

- **requirement-preprocessor** - 需求预处理
- **requirement-analyzer** - 需要详细分析
- **lowcode-generator** - 生成低代码应用
- **schema-generator** - 数据库模式定义

### 文档处理

- **document-skills/xls** - execl 文件处理和转换
- **document-skills/docx** - word 文件处理和转换
- **document-skills/pptx** - powerpoint 文件处理和转换
- **document-skills/pdf** - pdf 文件处理和转换

### 代码质量

### 项目管理

## 技术栈

- **框架**: React 16.8.3+
- **低代码引擎**: @alilc/lowcode-engine 1.1.2
- **UI 组件**: @alifd/next (Fusion)
- **状态管理**: zustand
- **包管理器**: Bun

## 常用命令

```bash

```

## 开发规范

1. **优先使用 Skills** - 遇到任务时首先考虑是否有对应的 skill
2. **组件化** - 复用 Fusion/KaiwuFlex 组件，避免自定义样式
3. **中文命名** - 页面和组件使用中文名称
4. **渐进增强** - 先实现基础功能，再优化体验

## 工作区结构

```

```

## 快速提示

- 生成页面时，使用 `lowcode-generator` skill
- 修改组件时，优先检查 KaiwuFlex组件库
- 遇到问题时，先搜索技能库 `.kagent/kagent-skills/`
