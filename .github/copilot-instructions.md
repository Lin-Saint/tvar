# Tvar VS Code Extension - AI Agent Instructions

此文档旨在帮助 AI 代理快速理解并在此代码库中高效工作。

## 项目概述

Tvar 是一个 VS Code 扩展项目，用于变量翻译功能。该项目使用 TypeScript 开发，遵循 VS Code 扩展开发的最佳实践。

## 代码库结构

```
src/
  ├── extension.ts     # 扩展的主要入口点
  └── test/           # 测试目录
```

## 关键开发工作流

### 构建和开发

1. 开发模式（带热重载）:

```bash
pnpm watch
```

2. 测试监听模式：

```bash
pnpm watch-tests
```

3. 构建生产版本：

```bash
pnpm package
```

### 测试流程

运行所有测试：

```bash
pnpm test
```

## 项目特定约定

1. **命令注册**:

   - 所有命令都在 `package.json` 的 `contributes.commands` 节点下定义
   - 命令实现在 `extension.ts` 中使用 `vscode.commands.registerCommand` 注册
   - 命令 ID 使用 `tvar.` 前缀，例如 `tvar.helloWorld`

2. **项目管理**:
   - 使用 pnpm 作为包管理器
   - 使用 webpack 进行构建打包
   - 使用 ESLint 进行代码风格检查

## 核心实现说明

扩展的生命周期由两个主要函数控制：

- `activate`: 在扩展首次激活时调用，负责注册命令和初始化功能
- `deactivate`: 在扩展停用时调用，用于清理资源

## 注意事项

1. 所有代码更改都应该通过 webpack 构建，确保在 `dist/` 目录生成最终的打包文件
2. 代码风格必须通过 ESLint 检查 (`pnpm lint`)
3. 新功能必须包含相应的测试用例

## 提示和建议

- 使用 `vscode.window.showInformationMessage` 向用户显示信息
- 在开发过程中保持 `pnpm watch` 运行以获得实时反馈
- 参考 VS Code 的 [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines) 确保最佳实践
