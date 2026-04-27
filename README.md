# 校园情报局 Campus Intel

校园情报局是一个面向大学生的 AI 校园信息整理助手 Demo。它把群聊截图、活动海报、通知文本等碎片化校园信息，整理成情报卡片、今日待办、风险提醒和 AI 行动建议。

> 把 99+ 群消息，变成今天该做的三件事。

## 项目目标

本项目用于参赛 Demo 展示，不追求一开始做成完整 App，也不接复杂登录系统。当前目标是先做一个稳定、好看、可录屏、可提交链接的前端 Demo。

评委应能在 2 到 3 分钟内看懂：

- 用户为什么需要它。
- AI 如何理解和整理校园信息。
- 产品如何把杂乱信息变成可执行行动。
- 为什么它适合校园群聊、内容流和社交信息场景。

## 技术栈

- Next.js
- TypeScript
- Tailwind CSS
- mock AI 数据优先

暂不接真实 AI API。后续会预留 `/api/analyze` 接口，用于替换 mock 解析逻辑。

## 开发规则

1. 每次任务先说明计划，再改代码。
2. 每次只做一个模块，不一次性重构整个项目。
3. 代码保持简单、清晰，优先服务比赛 Demo。
4. 页面风格偏移动端小程序，适合截图和录屏。
5. 每次改完后运行 `npm run build`。
6. 不引入不必要的复杂依赖。
7. mock 数据集中放在 `src/data/mockIntel.ts`。
8. 类型定义集中放在 `src/lib/types.ts`。
9. 每次完成后说明改动文件、运行方式和验收方式。

## 建议目录结构

```text
src/
  app/
    page.tsx
    api/
      analyze/
        route.ts
  data/
    mockIntel.ts
  lib/
    types.ts
  components/
docs/
  PRD.md
```

## 开发计划

1. 建立项目规则、README 和 PRD 文档。
2. 创建 `src/lib/types.ts` 和 `src/data/mockIntel.ts`。
3. 实现移动端首页与「一键体验示例」入口。
4. 实现信息导入页和示例素材加载。
5. 实现 AI 解析中页面。
6. 实现情报看板、情报详情和 AI 对话助手。
7. 预留 `/api/analyze` 接口，保持 mock 数据演示稳定。
8. 做移动端适配、录屏路径打磨和构建验收。

## 本地运行

```bash
npm install
npm run dev
```

打开：

```text
http://127.0.0.1:3000
```

## 验收

每次完成一个模块后运行：

```bash
npm run build
```

当前完整产品 PRD 见 [docs/PRD.md](docs/PRD.md)。

## 参赛材料

- [评分对照页](docs/02-score-alignment.md)：说明项目如何对应赛道适配、完整性、创新性、用户洞察、AI 原生性、落地可行性和商业化。
- [3 分钟录屏脚本](docs/03-recording-script.md)：给出演示时间线、逐段讲稿和录屏注意事项。
- [用户洞察证据与样例数据](docs/04-user-insight-and-data.md)：说明目标用户、真实痛点、mock 数据覆盖和 AI 原生机制。
- [具体使用手册](docs/05-user-manual.md)：说明本地运行、演示路径、状态贴纸、真实 AI 接口和验收清单。
- [最终提交检查清单](docs/06-final-submission-checklist.md)：按照初赛提交指南核对 Demo 链接、录屏和说明文档。
- [说明文档 PDF 正文草稿](docs/07-submission-pdf-draft.md)：可直接整理成参赛 PDF 的完整正文。
- [GitHub 部署指南](docs/08-github-deployment.md)：说明如何推送到 GitHub，并通过 Vercel 部署保留 Next.js API。
