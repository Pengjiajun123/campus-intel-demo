"use client";

import { useEffect, useState } from "react";
import { analyzeSteps } from "@/data/mockIntel";
import type { AnalyzeMode } from "@/lib/types";

type AnalyzeProgressProps = {
  mode?: AnalyzeMode;
  note?: string;
  onComplete: () => void;
};

const STEP_DURATION_MS = 760;
const FINISH_DELAY_MS = 420;
const stepColors = ["#9ae2e1", "#ffd84d", "#ff9b45", "#6fb8ff", "#71d66b"];
const stepFaces = ["•ᴗ•", "⌐■", "汗", "T_T", "OK"];

function getStepState(index: number, activeIndex: number, isComplete: boolean) {
  if (isComplete || index < activeIndex) {
    return "done";
  }

  if (index === activeIndex) {
    return "loading";
  }

  return "pending";
}

export function AnalyzeProgress({ mode = "mock", note, onComplete }: AnalyzeProgressProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const pendingText =
    note ??
    (mode === "real"
      ? "已请求 /api/analyze；如果没有 AI_API_KEY，会自动回退到示例数据。"
      : "示例演示模式：用本地 mock 数据和动画模拟 AI 解析流程。");

  useEffect(() => {
    const timers = analyzeSteps.map((_, index) =>
      window.setTimeout(() => {
        setActiveIndex(index);
      }, index * STEP_DURATION_MS),
    );

    const completeTimer = window.setTimeout(
      () => {
        setIsComplete(true);
        onComplete();
      },
      analyzeSteps.length * STEP_DURATION_MS + FINISH_DELAY_MS,
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <section id="analyze" className="scroll-mt-24 px-4 pb-8">
      <div className="app-container">
        <div className="mx-auto max-w-[760px] text-center">
          <span className="tag-pill">AI 正在翻口袋</span>
          <h2 className="friendly-title mt-4 text-[clamp(2.2rem,7vw,4.2rem)]">
            一张张贴纸正在被点亮。
          </h2>
          <p className="friendly-copy mx-auto mt-4 max-w-xl">
            识别图片、提取时间、判断风险、检查是否错过，再生成今天能直接照做的行动建议。
          </p>
        </div>

        <ol className="mx-auto mt-8 grid max-w-[980px] gap-4 md:grid-cols-5">
          {analyzeSteps.map((step, index) => {
            const state = getStepState(index, activeIndex, isComplete);

            return (
              <li
                key={step.id}
                className={`sticker-card-sm p-4 text-center transition ${
                  state === "loading" ? "breathing scale-[1.03]" : state === "pending" ? "opacity-55 grayscale" : ""
                }`}
                style={{ background: stepColors[index] }}
                aria-current={state === "loading" ? "step" : undefined}
              >
                <div className="mx-auto grid size-20 place-items-center rounded-[28px] border-[5px] border-white bg-white/58 text-2xl font-black">
                  {state === "done" ? "✓" : stepFaces[index]}
                </div>
                <p className="mt-3 text-sm font-black leading-5">{step.label}</p>
                <span className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-black">
                  {state === "done" ? "完成" : state === "loading" ? "跳动中" : "等待"}
                </span>
              </li>
            );
          })}
        </ol>

        <div className="sticker-card-sm mx-auto mt-6 max-w-[620px] bg-[#fffdf8] p-4 text-center" aria-live="polite">
          <p className="text-lg font-black">
            {isComplete ? "整理好啦，正在贴到今日行动板上。" : pendingText}
          </p>
        </div>
      </div>
    </section>
  );
}
