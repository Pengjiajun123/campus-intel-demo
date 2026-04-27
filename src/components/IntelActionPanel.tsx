"use client";

import Link from "next/link";
import { useState } from "react";
import type { IntelCard } from "@/lib/types";

type IntelActionPanelProps = {
  card: IntelCard;
};

type ResultType = "plan" | "reply";

export function IntelActionPanel({ card }: IntelActionPanelProps) {
  const [activeResult, setActiveResult] = useState<ResultType | null>(null);

  const resultTitle = activeResult === "plan" ? "行动计划贴纸" : "群回复贴纸";
  const resultLines = activeResult === "plan" ? buildActionPlan(card) : buildGroupReply(card);

  return (
    <section className="sticker-card mt-6 bg-[#9ae2e1] p-5">
      <div className="flex flex-col gap-4">
        <div>
          <span className="tag-pill">AI 行动建议</span>
          <h2 className="mt-3 text-3xl font-black leading-tight">把这条情报变成下一步。</h2>
          <p className="mt-2 text-base font-black leading-7 text-[#283044]/72">
            这里先用静态结果模拟 AI Agent，不接真实接口，适合比赛录屏展示。
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Link href="/" className="pill-button secondary text-center">
            返回首页
          </Link>
          <button type="button" onClick={() => setActiveResult("plan")} className="pill-button">
            生成行动计划
          </button>
          <button type="button" onClick={() => setActiveResult("reply")} className="pill-button secondary">
            生成群回复
          </button>
        </div>

        {activeResult ? (
          <div className="rounded-[28px] border-[6px] border-white bg-[#fff8ef] p-4 shadow-[0_10px_0_rgba(65,45,36,0.06)]" aria-live="polite">
            <p className="text-sm font-black text-[#75685f]">{resultTitle}</p>
            <div className="mt-3 grid gap-2 text-base font-black leading-7 text-[#283044]/76">
              {resultLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function buildActionPlan(card: IntelCard) {
  if (card.id === "pcg-ai-contest") {
    return ["第一天：确定选题和 PRD", "第二天：完成 Demo 页面", "第三天：录屏、写 PDF、测试链接"];
  }

  return card.nextActions.map((action, index) => `第 ${index + 1} 步：${action}`);
}

function buildGroupReply(card: IntelCard) {
  if (card.id === "club-interview") {
    return ["学长/学姐好，我确认参加本周四晚 19:00 在教学楼 B203 的产品社团二面，谢谢！"];
  }

  if (card.id === "pcg-ai-contest") {
    return ["收到，我会尽快确认产品选题，并准备 Demo 链接、演示录屏和 PDF 说明文档。"];
  }

  if (card.deadline) {
    return [`收到，我会在${card.deadline}前完成「${card.title}」，提交后会及时确认。`];
  }

  return [`收到，我已记录「${card.title}」的时间和地点，会按时关注。`];
}
