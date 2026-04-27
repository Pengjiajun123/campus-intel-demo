export type IntelCategory =
  | "课程DDL"
  | "班级通知"
  | "社团活动"
  | "比赛机会"
  | "实习机会"
  | "讲座活动"
  | "已错过事项";

export type IntelPriority = "高" | "中" | "低";

type IntelCardBase = {
  id: string;
  title: string;
  category: IntelCategory;
  priority: IntelPriority;
  location?: string;
  source: string;
  sourceQuote: string;
  confidence: number;
  summary: string;
  aiReason: string;
  nextActions: string[];
  risks: string[];
  tags: string[];
  matchScore: number;
};

type IntelCardWithDeadline = IntelCardBase & {
  deadline: string;
  eventTime?: string;
};

type IntelCardWithEventTime = IntelCardBase & {
  deadline?: string;
  eventTime: string;
};

export type IntelCard = IntelCardWithDeadline | IntelCardWithEventTime;

export type RiskReminder = {
  id: string;
  cardId: string;
  title: string;
  risk: string;
  priority: IntelPriority;
  source: string;
};

export type AnalyzeStep = {
  id: string;
  label: string;
  description: string;
};

export type ChatExample = {
  id: string;
  question: string;
  answer: string;
};

export type AnalyzeMode = "mock" | "real";

export type AnalyzeInputFile = {
  name: string;
  type?: string;
  size?: number;
  source?: string;
};

export type AnalyzeRequestPayload = {
  mode?: AnalyzeMode;
  text?: string;
  files?: AnalyzeInputFile[];
};
