# GitHub 部署指南

本项目是 Next.js App Router 项目，并包含 `/api/analyze` 动态接口。因此最终演示链接建议使用：

```text
GitHub 仓库托管代码 + Vercel 部署网站
```

不建议直接使用 GitHub Pages 部署，因为 GitHub Pages 只能托管静态页面，无法运行 `/api/analyze` 这类服务端接口。

## 1. 推送到 GitHub

当前本地代码已经提交，可以直接创建 GitHub 仓库并推送。

如果 GitHub CLI 未登录，先执行：

```bash
gh auth login
```

登录后，在项目根目录执行：

```bash
gh repo create campus-intel-demo --public --source=. --remote=origin --push
```

如果想创建私有仓库，把 `--public` 改成：

```bash
--private
```

## 2. 使用 Vercel 从 GitHub 部署

1. 打开 Vercel。
2. 选择 Add New Project。
3. Import Git Repository。
4. 选择 `campus-intel-demo` 仓库。
5. Framework Preset 选择 Next.js。
6. Build Command 保持：

```bash
npm run build
```

7. 不需要填写 Output Directory。
8. 点击 Deploy。

## 3. 环境变量

Demo 默认不依赖真实 AI API，所以不配置环境变量也能正常演示。

如果后续要启用真实解析模式，可以在 Vercel 项目里配置：

```text
AI_API_KEY=你的真实 API Key
AI_API_BASE_URL=https://api.openai.com/v1/chat/completions
AI_MODEL=gpt-4o-mini
```

安全要求：

- 不要把 API Key 写进代码。
- 不要把 `.env` 文件提交到 GitHub。
- 当前 `.gitignore` 已忽略 `.env*`。

## 4. 部署后检查

部署完成后检查这些链接：

```text
https://你的域名/
https://你的域名/?showDashboard=1#dashboard
https://你的域名/intel/pcg-ai-contest
https://你的域名/api/analyze
```

其中 `/api/analyze` 打开后应返回接口说明 JSON。

## 5. 参赛材料中需要替换的内容

部署完成后，把公网 URL 填入：

- `docs/06-final-submission-checklist.md`
- `docs/07-submission-pdf-draft.md`
- 最终导出的 PDF 封面页

建议写法：

```text
Demo 链接：https://你的域名/
```

## 6. 如果只能用 GitHub Pages

如果比赛平台只接受 GitHub Pages，也可以做静态演示版，但会失去 `/api/analyze` 动态接口。当前项目为了保留 AI 接口预留能力，不建议走这个路线。

最终推荐：

```text
GitHub 仓库链接：用于提交代码与说明
Vercel Demo 链接：用于评委在线体验
```
