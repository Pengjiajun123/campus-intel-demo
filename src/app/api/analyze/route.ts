import { NextResponse } from "next/server";
import { mockIntelCards } from "@/data/mockIntel";
import {
  buildCampusIntelUserPrompt,
  CAMPUS_INTEL_ANALYZE_PROMPT,
  CAMPUS_INTEL_PROMPT_VERSION,
} from "@/lib/analyzePrompt";
import type { AnalyzeInputFile, AnalyzeMode, AnalyzeRequestPayload, IntelCard, IntelCategory, IntelPriority } from "@/lib/types";

export const runtime = "nodejs";

const DEFAULT_AI_API_URL = "https://api.openai.com/v1/chat/completions";
const DEFAULT_AI_MODEL = "gpt-4o-mini";
const MAX_TEXT_LENGTH = 12000;
const MAX_FILES = 10;

type AnalyzeApiResponse = {
  mode: AnalyzeMode;
  source: "mock-demo" | "missing-api-key" | "empty-input" | "real-ai" | "real-ai-fallback";
  promptVersion: string;
  cards: IntelCard[];
  warning?: string;
};

const categoryFallback: IntelCategory = "班级通知";
const priorityFallback: IntelPriority = "中";
const allowedCategories: IntelCategory[] = [
  "课程DDL",
  "班级通知",
  "社团活动",
  "比赛机会",
  "实习机会",
  "讲座活动",
  "已错过事项",
];
const allowedPriorities: IntelPriority[] = ["高", "中", "低"];

export async function GET() {
  return NextResponse.json({
    endpoint: "/api/analyze",
    method: "POST",
    promptVersion: CAMPUS_INTEL_PROMPT_VERSION,
    defaultMode: "mock",
    expectedBody: {
      mode: "mock | real",
      text: "用户粘贴的通知文本或 OCR 文本",
      files: [{ name: "poster.png", type: "image/png", size: 123456, source: "活动海报" }],
    },
    note: "未配置 AI_API_KEY 或使用 mock 模式时，接口会返回本地 mockIntel 数据。",
  });
}

export async function POST(request: Request) {
  const body = await readAnalyzeBody(request);

  if (!body.ok) {
    return NextResponse.json({ error: body.error }, { status: 400 });
  }

  const mode: AnalyzeMode = body.value.mode === "real" ? "real" : "mock";
  const text = normalizeText(body.value.text);
  const files = normalizeFiles(body.value.files);
  const apiKey = process.env.AI_API_KEY;

  if (mode === "mock") {
    return mockResponse("mock", "mock-demo");
  }

  if (!apiKey) {
    return mockResponse("mock", "missing-api-key", "未配置 AI_API_KEY，已自动回退到示例演示数据。");
  }

  if (!text && files.length === 0) {
    return mockResponse("mock", "empty-input", "真实解析模式没有收到文本或文件信息，已回退到示例演示数据。");
  }

  try {
    const cards = await analyzeWithRealModel({ apiKey, text, files });

    return NextResponse.json<AnalyzeApiResponse>({
      mode: "real",
      source: "real-ai",
      promptVersion: CAMPUS_INTEL_PROMPT_VERSION,
      cards,
    });
  } catch {
    return mockResponse("mock", "real-ai-fallback", "真实 AI 解析暂不可用，已自动回退到示例演示数据。");
  }
}

async function readAnalyzeBody(request: Request): Promise<
  | { ok: true; value: AnalyzeRequestPayload }
  | { ok: false; error: string }
> {
  try {
    const value = (await request.json()) as unknown;

    if (!isRecord(value)) {
      return { ok: false, error: "请求体必须是 JSON 对象。" };
    }

    return { ok: true, value: value as AnalyzeRequestPayload };
  } catch {
    return { ok: false, error: "请求体不是合法 JSON。" };
  }
}

function mockResponse(mode: AnalyzeMode, source: AnalyzeApiResponse["source"], warning?: string) {
  return NextResponse.json<AnalyzeApiResponse>({
    mode,
    source,
    promptVersion: CAMPUS_INTEL_PROMPT_VERSION,
    cards: mockIntelCards,
    warning,
  });
}

async function analyzeWithRealModel(input: { apiKey: string; text: string; files: AnalyzeInputFile[] }) {
  const apiUrl = process.env.AI_API_BASE_URL || DEFAULT_AI_API_URL;
  const model = process.env.AI_MODEL || DEFAULT_AI_MODEL;
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: CAMPUS_INTEL_ANALYZE_PROMPT },
        { role: "user", content: buildCampusIntelUserPrompt({ text: input.text, files: input.files }) },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`AI provider returned ${response.status}`);
  }

  const data = (await response.json()) as unknown;
  const content = extractModelText(data);
  const parsed = parseJsonObject(content);
  const cards = coerceIntelCards(parsed);

  if (cards.length === 0) {
    throw new Error("AI provider returned no valid cards");
  }

  return cards;
}

function extractModelText(value: unknown) {
  const data = isRecord(value) ? value : {};

  if (typeof data.output_text === "string") {
    return data.output_text;
  }

  const choices = Array.isArray(data.choices) ? data.choices : [];
  const firstChoice = isRecord(choices[0]) ? choices[0] : {};
  const message = isRecord(firstChoice.message) ? firstChoice.message : {};
  const content = message.content;

  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => (isRecord(item) && typeof item.text === "string" ? item.text : ""))
      .filter(Boolean)
      .join("\n");
  }

  throw new Error("AI provider returned empty content");
}

function parseJsonObject(content: string) {
  const trimmed = content
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");

  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    const jsonMatch = trimmed.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("No JSON object found");
    }

    return JSON.parse(jsonMatch[0]) as unknown;
  }
}

function coerceIntelCards(value: unknown): IntelCard[] {
  const source = isRecord(value) && Array.isArray(value.cards) ? value.cards : Array.isArray(value) ? value : [];

  return source.map(coerceIntelCard).filter((card): card is IntelCard => Boolean(card));
}

function coerceIntelCard(value: unknown): IntelCard | null {
  if (!isRecord(value)) {
    return null;
  }

  const title = readString(value.title);
  const source = readString(value.source);
  const sourceQuote = readString(value.sourceQuote);
  const summary = readString(value.summary);
  const aiReason = readString(value.aiReason);
  const deadline = readString(value.deadline);
  const eventTime = readString(value.eventTime);

  if (!title || !source || !sourceQuote || !summary || !aiReason || (!deadline && !eventTime)) {
    return null;
  }

  const base = {
    id: readString(value.id) || slugify(title),
    title,
    category: normalizeCategory(value.category),
    priority: normalizePriority(value.priority),
    location: readString(value.location) || undefined,
    source,
    sourceQuote,
    confidence: clampNumber(value.confidence, 0, 1, 0.7),
    summary,
    aiReason,
    nextActions: readStringArray(value.nextActions).slice(0, 4),
    risks: readStringArray(value.risks).slice(0, 3),
    tags: readStringArray(value.tags),
    matchScore: Math.round(clampNumber(value.matchScore, 0, 100, 70)),
  };

  return deadline ? { ...base, deadline, eventTime: eventTime || undefined } : { ...base, eventTime };
}

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, MAX_TEXT_LENGTH) : "";
}

function normalizeFiles(value: unknown): AnalyzeInputFile[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.slice(0, MAX_FILES).flatMap((item) => {
    if (!isRecord(item)) {
      return [];
    }

    const name = readString(item.name);

    if (!name) {
      return [];
    }

    return [
      {
        name,
        type: readString(item.type) || undefined,
        size: typeof item.size === "number" && Number.isFinite(item.size) ? item.size : undefined,
        source: readString(item.source) || undefined,
      },
    ];
  });
}

function normalizeCategory(value: unknown): IntelCategory {
  return allowedCategories.includes(value as IntelCategory) ? (value as IntelCategory) : categoryFallback;
}

function normalizePriority(value: unknown): IntelPriority {
  return allowedPriorities.includes(value as IntelPriority) ? (value as IntelPriority) : priorityFallback;
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readStringArray(value: unknown) {
  return Array.isArray(value) ? value.map(readString).filter(Boolean) : [];
}

function clampNumber(value: unknown, min: number, max: number, fallback: number) {
  const numberValue = typeof value === "number" && Number.isFinite(value) ? value : fallback;

  return Math.min(max, Math.max(min, numberValue));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "campus-intel-item";
}
