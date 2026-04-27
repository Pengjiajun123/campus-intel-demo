import { isMissedIntel } from "@/lib/status";
import type { IntelCard, RiskReminder } from "@/lib/types";

const priorityRank: Record<IntelCard["priority"], number> = {
  高: 3,
  中: 2,
  低: 1,
};

const opportunityCategories = new Set(["比赛机会", "实习机会", "讲座活动"]);
const demoWeekStart = new Date("2026-04-27T09:00:00+08:00").getTime();
const oneDay = 24 * 60 * 60 * 1000;

const weekdayOffset: Record<string, number> = {
  一: 0,
  二: 1,
  三: 2,
  四: 3,
  五: 4,
  六: 5,
  日: 6,
  天: 6,
};

export function sortIntelByUrgency(cards: IntelCard[]): IntelCard[] {
  return [...cards].sort((a, b) => {
    const missedDelta = Number(isMissedIntel(b)) - Number(isMissedIntel(a));

    if (missedDelta !== 0) {
      return missedDelta;
    }

    if (isMissedIntel(a) && isMissedIntel(b)) {
      return (
        getMissedLossScore(b) - getMissedLossScore(a) ||
        getIntelDueTime(b) - getIntelDueTime(a) ||
        b.matchScore - a.matchScore
      );
    }

    return (
      priorityRank[b.priority] - priorityRank[a.priority] ||
      getIntelDueTime(a) - getIntelDueTime(b) ||
      b.matchScore - a.matchScore
    );
  });
}

export function getMissedIntel(cards: IntelCard[]): IntelCard[] {
  return sortIntelByUrgency(cards.filter((card) => isMissedIntel(card)));
}

export function getTodayIntel(cards: IntelCard[]): IntelCard[] {
  return sortIntelByUrgency(
    cards.filter((card) => !isMissedIntel(card)).filter((card) => card.priority === "高" || card.tags.includes("今日必办")),
  );
}

export function getOpportunityIntel(cards: IntelCard[]): IntelCard[] {
  return [...cards]
    .filter((card) => !isMissedIntel(card))
    .filter((card) => opportunityCategories.has(card.category))
    .sort(
      (a, b) =>
        b.matchScore - a.matchScore ||
        getIntelDueTime(a) - getIntelDueTime(b) ||
        priorityRank[b.priority] - priorityRank[a.priority],
    );
}

export function getRiskIntel(cards: IntelCard[]): RiskReminder[] {
  return cards
    .flatMap((card) =>
      card.risks.map((risk, index) => ({
        id: `${card.id}-risk-${index + 1}`,
        cardId: card.id,
        title: card.title,
        risk,
        priority: card.priority,
        source: card.source,
      })),
    )
    .sort((a, b) => {
      const cardA = cards.find((card) => card.id === a.cardId);
      const cardB = cards.find((card) => card.id === b.cardId);

      return (
        getRiskSeverity(b.risk) - getRiskSeverity(a.risk) ||
        priorityRank[b.priority] - priorityRank[a.priority] ||
        (cardA && cardB ? getIntelDueTime(cardA) - getIntelDueTime(cardB) : 0)
      );
    });
}

export function getIntelScheduleKey(card: IntelCard): string {
  const source = card.deadline ?? card.eventTime ?? "";
  const parsed = parseChineseSchedule(source);

  if (!parsed) {
    return "2026-05-03";
  }

  return parsed.toISOString().slice(0, 10);
}

export function getIntelDueTime(card: IntelCard): number {
  const source = card.deadline ?? card.eventTime ?? "";
  const parsed = parseChineseSchedule(source);

  return parsed?.getTime() ?? Number.MAX_SAFE_INTEGER;
}

function parseChineseSchedule(value: string): Date | null {
  if (!value) {
    return null;
  }

  if (value.includes("昨天")) {
    return withTime(demoWeekStart - oneDay, value, 22, 0);
  }

  if (value.includes("今晚") || value.includes("今天")) {
    return withTime(demoWeekStart, value, value.includes("今晚") ? 22 : 18, 0);
  }

  if (value.includes("明早")) {
    return withTime(demoWeekStart + oneDay, value, 9, 0);
  }

  if (value.includes("明天")) {
    return withTime(demoWeekStart + oneDay, value, 18, 0);
  }

  const weekdayMatch = value.match(/(?:本周|周)([一二三四五六日天])/);

  if (weekdayMatch) {
    return withTime(demoWeekStart + (weekdayOffset[weekdayMatch[1]] ?? 6) * oneDay, value, 18, 0);
  }

  return null;
}

function withTime(dayStart: number, value: string, fallbackHour: number, fallbackMinute: number) {
  const timeMatch = value.match(/(\d{1,2})[:：](\d{2})/);
  const date = new Date(dayStart);

  date.setHours(Number(timeMatch?.[1] ?? fallbackHour), Number(timeMatch?.[2] ?? fallbackMinute), 0, 0);

  return date;
}

function getMissedLossScore(card: IntelCard) {
  const text = `${card.summary}${card.aiReason}${card.risks.join("")}`;

  if (text.includes("资格") || text.includes("成绩") || text.includes("逾期记录")) {
    return 3;
  }

  if (text.includes("材料") || text.includes("名额")) {
    return 2;
  }

  return 1;
}

function getRiskSeverity(risk: string) {
  if (risk.includes("放弃") || risk.includes("成绩") || risk.includes("资格") || risk.includes("不回复")) {
    return 3;
  }

  if (risk.includes("迟交") || risk.includes("名额") || risk.includes("材料")) {
    return 2;
  }

  return 1;
}
