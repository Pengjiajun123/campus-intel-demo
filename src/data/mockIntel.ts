import type { AnalyzeStep, ChatExample, IntelCard, RiskReminder } from "@/lib/types";

export const mockIntelCards: IntelCard[] = [
  {
    id: "database-report",
    title: "数据库实验报告提交",
    category: "课程DDL",
    priority: "高",
    deadline: "本周五 23:59",
    source: "数据库课程群",
    sourceQuote:
      "本周五 23:59 前提交数据库实验报告，文件命名为“学号-姓名-实验三”。实验截图和 SQL 代码都要放进报告里，原则上不接受迟交。",
    confidence: 0.94,
    summary: "需要按命名要求提交数据库实验报告，并补齐实验截图与 SQL 代码。",
    aiReason: "通知包含明确截止时间、提交材料、命名规则和迟交风险，属于必须优先处理的课程 DDL。",
    nextActions: ["整理实验截图", "导出 SQL 代码", "按要求命名报告文件", "周五前完成最终检查"],
    risks: ["迟交可能影响实验成绩", "缺少截图或 SQL 代码会导致材料不完整"],
    tags: ["今日必办", "课程", "DDL", "报告"],
    matchScore: 96,
  },
  {
    id: "scholarship-form",
    title: "奖学金信息统计表填写",
    category: "班级通知",
    priority: "高",
    deadline: "周三 12:00",
    source: "班级通知",
    sourceQuote: "各位同学，请在周三中午 12 点前填写奖学金信息统计表，未填写视为放弃本次评选资格。",
    confidence: 0.91,
    summary: "奖学金评选相关信息需要在周三中午前补齐并提交。",
    aiReason: "原文直接说明未填写视为放弃评选资格，后果明确且不可逆，适合进入今日必办列表。",
    nextActions: ["打开统计表链接", "核对个人基础信息", "提交后截图留存"],
    risks: ["错过截止时间会被视为放弃评选资格", "统计表信息填写错误可能影响后续审核"],
    tags: ["今日必办", "班级", "奖学金", "表格"],
    matchScore: 92,
  },
  {
    id: "club-interview",
    title: "产品社团二面确认",
    category: "社团活动",
    priority: "高",
    deadline: "今晚 22:00 前回复",
    eventTime: "周四 19:00",
    location: "教学楼 B203",
    source: "产品社团群",
    sourceQuote:
      "产品社团招新二面将在周四晚 19:00 于教学楼 B203 进行，请今晚 22:00 前回复是否参加。",
    confidence: 0.96,
    summary: "需要今晚 22:00 前回复是否参加产品社团二面，并记下面试时间地点。",
    aiReason: "该信息同时包含回复截止时间、正式活动时间和地点；回复截止很近，不处理会影响面试资格。",
    nextActions: ["立即生成确认回复", "设置周四 18:30 面试提醒", "确认教学楼 B203 位置"],
    risks: ["不回复可能被视为放弃面试", "面试时间和地点容易被群消息淹没"],
    tags: ["今日必办", "社团", "面试", "确认"],
    matchScore: 95,
  },
  {
    id: "pcg-ai-contest",
    title: "腾讯 PCG 校园 AI 产品创意赛",
    category: "比赛机会",
    priority: "中",
    deadline: "本周日 23:59 前整理提交物",
    source: "比赛通知截图 / 用户粘贴文本",
    sourceQuote:
      "腾讯 PCG 校园 AI 产品创意赛，主题为用 AI 搞定校园生活的烦心事。初赛需提交 Demo 链接、Demo 演示录屏和说明文档。演示录屏不超过 3 分钟，说明文档为 PDF。",
    confidence: 0.89,
    summary: "这是一个与校园 AI 产品 Demo 高度相关的比赛机会，提交物包括 Demo 链接、录屏和 PDF。",
    aiReason: "比赛主题与当前校园信息整理助手方向高度匹配，且提交材料较多，需要拆成多天准备。",
    nextActions: ["今天确定产品选题", "明天完成 Demo 核心页面", "后天录制 3 分钟演示并整理 PDF"],
    risks: ["提交物包含链接、录屏、PDF 三项，不适合最后一天才准备", "录屏超过 3 分钟可能影响初赛材料质量"],
    tags: ["机会", "比赛", "AI", "产品"],
    matchScore: 86,
  },
  {
    id: "pm-intern-referral",
    title: "产品经理实习内推",
    category: "实习机会",
    priority: "中",
    deadline: "本周四 18:00 前发送简历",
    source: "实习交流群",
    sourceQuote: "有产品经理实习内推名额，适合有校园产品或 AI 工具项目经历的同学投递，请本周四 18:00 前发简历。",
    confidence: 0.82,
    summary: "实习机会与产品方向相关，可整理 Campus Intel Demo 和社团经历后投递。",
    aiReason: "岗位方向与用户的 AI 产品、校园工具和产品设计兴趣相关，但不是强制任务，归入本周机会。",
    nextActions: ["更新简历项目经历", "准备 3 句话自我介绍", "联系内推人确认岗位 JD"],
    risks: ["岗位名额可能很快满员", "简历如果没有突出项目产出，匹配度会下降"],
    tags: ["机会", "实习", "内推", "产品"],
    matchScore: 73,
  },
  {
    id: "ai-lecture",
    title: "校园 AI 讲座",
    category: "讲座活动",
    priority: "低",
    eventTime: "周五 19:30",
    location: "图书馆报告厅",
    source: "公众号海报",
    sourceQuote: "本周五晚 19:30，图书馆报告厅举办校园 AI 产品讲座，分享 AI 工具在学习、社团和比赛中的应用。",
    confidence: 0.78,
    summary: "这场讲座可作为比赛选题、产品表达和 Demo 亮点包装的参考。",
    aiReason: "讲座主题与 AI 产品方向相关，但没有强制提交要求，适合作为低优先级机会保留。",
    nextActions: ["收藏活动信息", "视时间安排参加", "记录可用于 Demo 的观点"],
    risks: ["与数据库实验报告截止日接近，需避免占用 DDL 前的关键时间"],
    tags: ["机会", "讲座", "AI", "灵感"],
    matchScore: 68,
  },
  {
    id: "library-book-overdue",
    title: "图书馆借书归还已逾期",
    category: "已错过事项",
    priority: "高",
    deadline: "昨天 22:00 已过",
    location: "图书馆一楼自助还书区",
    source: "图书馆系统提醒",
    sourceQuote: "你借阅的《用户体验要素》应于昨天 22:00 前归还，目前已逾期，请尽快处理以免继续产生滞纳记录。",
    confidence: 0.88,
    summary: "图书归还 deadline 已经错过，需要尽快还书并确认是否产生逾期记录。",
    aiReason: "原文出现“已逾期”和明确已过截止时间，属于损失已经发生的事项，应优先标记为已错过并生成补救动作。",
    nextActions: ["今天先归还图书", "查看是否产生逾期记录", "如果影响借阅权限，联系图书馆服务台确认补救方式"],
    risks: ["逾期记录继续累积会影响后续借阅", "如果不处理，容易被新的群消息继续淹没"],
    tags: ["已错过", "补救", "风险提醒", "24小时内"],
    matchScore: 89,
  },
];

export function getTodayMustDo(cards: IntelCard[] = mockIntelCards): IntelCard[] {
  return cards
    .filter((card) => !card.tags.includes("已错过"))
    .filter((card) => card.priority === "高" || card.tags.includes("今日必办"))
    .sort((a, b) => b.matchScore - a.matchScore);
}

export function getMissedItems(cards: IntelCard[] = mockIntelCards): IntelCard[] {
  return cards
    .filter((card) => card.tags.includes("已错过") || card.category === "已错过事项")
    .sort((a, b) => b.matchScore - a.matchScore);
}

export function getOpportunities(cards: IntelCard[] = mockIntelCards): IntelCard[] {
  const opportunityCategories = new Set(["比赛机会", "实习机会", "讲座活动"]);

  return cards
    .filter((card) => opportunityCategories.has(card.category))
    .sort((a, b) => b.matchScore - a.matchScore);
}

export function getRisks(cards: IntelCard[] = mockIntelCards): RiskReminder[] {
  return cards.flatMap((card) =>
    card.risks.map((risk, index) => ({
      id: `${card.id}-risk-${index + 1}`,
      cardId: card.id,
      title: card.title,
      risk,
      priority: card.priority,
      source: card.source,
    })),
  );
}

export const analyzeSteps: AnalyzeStep[] = [
  {
    id: "recognize",
    label: "正在识别图片和通知文本",
    description: "读取群聊、海报和粘贴文本，先判断哪些内容是真正的校园事项。",
  },
  {
    id: "extract",
    label: "正在提取时间、地点、材料和对象",
    description: "从原文里拆出截止时间、活动地点、提交材料和涉及对象。",
  },
  {
    id: "judge",
    label: "正在判断风险和紧急程度",
    description: "判断是否影响资格、成绩、机会窗口或需要立刻回复。",
  },
  {
    id: "missed",
    label: "正在检查是否错过 deadline",
    description: "识别已经逾期的事项，优先生成补救动作和损失提示。",
  },
  {
    id: "generate",
    label: "正在生成今日行动建议",
    description: "输出今日必办、本周机会、风险提醒、已错过事项和下一步建议。",
  },
];

export const chatExamples: ChatExample[] = [
  {
    id: "tonight",
    question: "我今晚只有 2 个小时，应该先做什么？",
    answer: "先回复产品社团二面确认，再整理数据库实验报告的截图和 SQL 代码。",
  },
  {
    id: "reply",
    question: "帮我生成一条社团二面确认回复。",
    answer: "学长/学姐好，我确认参加本周四晚 19:00 在教学楼 B203 的产品社团二面，谢谢！",
  },
];
