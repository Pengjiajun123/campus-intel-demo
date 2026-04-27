<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Campus Intel 项目规则

你现在是这个项目的全栈工程师，目标是开发一个参赛用的网页 Demo。

项目名称：校园情报局 Campus Intel。

项目目标：做一个面向大学生的 AI 校园信息整理助手 Demo。它可以把群聊截图、活动海报、通知文本等碎片化校园信息，整理成情报卡片、今日待办、风险提醒和 AI 行动建议。

技术目标：

- 使用 Next.js + TypeScript + Tailwind CSS。
- 先做稳定的前端 Demo 和 mock AI 数据，不要一开始接真实 AI API。
- 后续预留 `/api/analyze` 接口。

开发规则：

1. 每次任务先告诉用户计划，再改代码。
2. 每次只做一个模块，不要一次性重构整个项目。
3. 代码要简单、清晰，适合比赛 Demo。
4. 页面要偏移动端小程序风格，适合截图和录屏。
5. 每次改完后运行 `npm run build`，如果报错就修复。
6. 不要引入太多复杂依赖。
7. 所有 mock 数据要集中放在 `src/data/mockIntel.ts`。
8. 类型定义集中放在 `src/lib/types.ts`。
9. 每次完成后告诉用户：改了哪些文件、如何运行、如何验收。

当前阶段：

- 第 1 步已经创建 Next.js 项目和本地 Git 仓库。
- 第 2 步只建立项目规则、README 和 PRD 文档。
- 先不要做具体页面，先完成项目文档和开发计划。

推荐项目结构：

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
    ...
docs/
  PRD.md
```

实现顺序建议：

1. 项目规则与文档。
2. mock 数据和类型定义。
3. 移动端首页与一键体验入口。
4. 信息导入与示例素材加载。
5. AI 解析流程动效。
6. 情报看板、详情和对话助手。
7. 预留 `/api/analyze`，但仍使用 mock 数据保证演示稳定。
