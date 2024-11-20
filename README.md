# 个人技术博客

基于 Nuxt 3 构建的个人技术博客站点，用于展示技术文章、管理心得和在线 Demo。

## 主要功能

- 技术文章展示
- 在线 Demo 演示
- 暗黑模式支持
- 文章搜索
- 标签分类
- 响应式设计

## 技术栈

- Vue 3 - 渐进式 JavaScript 框架
- Nuxt 3 - Vue.js 全栈框架
- TypeScript - JavaScript 的超集
- Element Plus - Vue 3 组件库
- Nuxt Content - 文档驱动框架
- UnoCSS - 原子化 CSS 引擎

## 开始使用

### 安装依赖

```bash
npm install
```

### 开发环境

```bash
npm run dev
```

访问 `http://localhost:3000`

### 生产环境构建

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 项目结构

```
tech-blog/
├── components/     # 可复用组件
├── content/        # 文章内容 (Markdown)
├── layouts/        # 布局组件
├── pages/          # 页面文件
├── public/         # 静态资源
└── server/         # 服务端API
```

## 文章编写

1. 在 `content/articles/` 目录下创建 `.md` 文件
2. 添加文章元数据：
```md
---
title: 文章标题
description: 文章描述
date: YYYY-MM-DD
tags: ['标签1', '标签2']
---
```
3. 使用 Markdown 编写文章内容

## Demo 项目

在 `content/demos/` 目录下创建新的 Demo 项目，每个 Demo 需要包含：

1. 项目说明文档
2. 源代码
3. 在线预览配置

## 部署

本项目已配置好自动部署到 Vercel 平台：

1. Fork 本项目
2. 在 Vercel 中导入项目
3. 自动部署完成

## License

MIT
