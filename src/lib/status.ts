import type { IntelCard } from "@/lib/types";

export type StickerMood = "missed" | "overload" | "busy" | "urgent" | "easy" | "clear";

export type StickerStatus = {
  mood: StickerMood;
  title: string;
  description: string;
  shortLabel: string;
  face: "sad" | "angry" | "sweat" | "worried" | "smile" | "satisfied";
  shape: "drop" | "burst" | "blob" | "hex" | "heart" | "bean";
};

const statusCopy: Record<StickerMood, StickerStatus> = {
  missed: {
    mood: "missed",
    title: "有事项已错过",
    description: "先标记损失，再处理补救动作。",
    shortLabel: "已错过",
    face: "sad",
    shape: "drop",
  },
  overload: {
    mood: "overload",
    title: "今天有点炸",
    description: "紧急事项偏多，需要马上排序处理。",
    shortLabel: "压力过载",
    face: "angry",
    shape: "burst",
  },
  busy: {
    mood: "busy",
    title: "任务偏多",
    description: "事情堆起来了，但还有缓冲时间。",
    shortLabel: "任务堆积",
    face: "sweat",
    shape: "blob",
  },
  urgent: {
    mood: "urgent",
    title: "只有一件急事",
    description: "数量不多，但有 deadline 正在逼近。",
    shortLabel: "临近截止",
    face: "worried",
    shape: "hex",
  },
  easy: {
    mood: "easy",
    title: "今天还算轻松",
    description: "待处理事项不多，按建议推进就行。",
    shortLabel: "轻松可控",
    face: "smile",
    shape: "heart",
  },
  clear: {
    mood: "clear",
    title: "今日清爽",
    description: "没有必须马上处理的事项。",
    shortLabel: "安全",
    face: "satisfied",
    shape: "bean",
  },
};

export function isMissedIntel(card: IntelCard) {
  return card.tags.includes("已错过") || card.category === "已错过事项";
}

export function isWithin24Hours(card: IntelCard) {
  const deadline = card.deadline ?? "";

  return (
    card.tags.includes("24小时内") ||
    deadline.includes("今晚") ||
    deadline.includes("今天") ||
    deadline.includes("明早") ||
    deadline.includes("明天")
  );
}

export function getOverallStickerStatus(cards: IntelCard[]): StickerStatus {
  const activeCards = cards.filter((card) => !isMissedIntel(card));
  const missedCount = cards.length - activeCards.length;
  const highPriorityCount = activeCards.filter((card) => card.priority === "高").length;
  const within24Count = activeCards.filter(isWithin24Hours).length;
  const totalCount = activeCards.length;
  const hasOnlyLowOpportunities =
    totalCount > 0 &&
    activeCards.every((card) => card.priority === "低" || card.tags.includes("机会"));

  if (missedCount > 0) {
    return statusCopy.missed;
  }

  if (totalCount === 0) {
    return statusCopy.clear;
  }

  if (highPriorityCount >= 3 || within24Count >= 2) {
    return statusCopy.overload;
  }

  if (totalCount >= 5 && highPriorityCount <= 2) {
    return statusCopy.busy;
  }

  if (totalCount <= 2 && within24Count > 0) {
    return statusCopy.urgent;
  }

  if (hasOnlyLowOpportunities) {
    return statusCopy.clear;
  }

  if (totalCount >= 1 && totalCount <= 3 && highPriorityCount === 0) {
    return statusCopy.easy;
  }

  return statusCopy.busy;
}

export function getCardStickerStatus(card: IntelCard): StickerStatus {
  if (isMissedIntel(card)) {
    return statusCopy.missed;
  }

  if (card.priority === "高" && isWithin24Hours(card)) {
    return statusCopy.overload;
  }

  if (card.priority === "高") {
    return statusCopy.urgent;
  }

  if (card.priority === "中") {
    return statusCopy.busy;
  }

  if (card.tags.includes("机会")) {
    return statusCopy.easy;
  }

  return statusCopy.clear;
}

export function getStatusCopy(mood: StickerMood) {
  return statusCopy[mood];
}
