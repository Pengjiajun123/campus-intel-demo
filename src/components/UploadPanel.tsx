"use client";

import { useRef } from "react";
import type { AnalyzeInputFile, AnalyzeMode } from "@/lib/types";

type UploadPanelProps = {
  sampleLoaded: boolean;
  analysisMode: AnalyzeMode;
  onModeChange: (mode: AnalyzeMode) => void;
  onUseSamples: () => void;
  onStartAnalyze: (payload: { text: string; files: AnalyzeInputFile[] }) => void;
};

const sampleMaterials = [
  {
    title: "数据库课程群通知",
    source: "课程群",
    content: "本周五 23:59 前提交数据库实验报告，实验截图和 SQL 代码都要放进报告里。",
    color: "#ffd84d",
  },
  {
    title: "奖学金班级通知",
    source: "班级群",
    content: "周三中午 12 点前填写奖学金信息统计表，未填写视为放弃评选资格。",
    color: "#ff9ecf",
  },
  {
    title: "产品社团二面通知",
    source: "社团群",
    content: "周四晚 19:00 在教学楼 B203 二面，请今晚 22:00 前回复是否参加。",
    color: "#ff9b45",
  },
  {
    title: "腾讯 PCG 校园 AI 产品创意赛",
    source: "比赛通知",
    content: "初赛需提交 Demo 链接、Demo 演示录屏和 PDF 说明文档。",
    color: "#9ae2e1",
  },
];

const inputEntrances = [
  {
    id: "chat-screenshot",
    title: "群聊截图",
    description: "把 99+ 群消息截图丢进来",
    face: "^-^",
    color: "#9ae2e1",
    rotate: "-rotate-2",
  },
  {
    id: "activity-poster",
    title: "活动海报",
    description: "讲座、比赛、招新都能识别",
    face: "•ᴗ•",
    color: "#ff9ecf",
    rotate: "rotate-2",
  },
];

const sampleText = sampleMaterials.map((item) => `${item.title}：${item.content}`).join("\n");

export function UploadPanel({
  sampleLoaded,
  analysisMode,
  onModeChange,
  onUseSamples,
  onStartAnalyze,
}: UploadPanelProps) {
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const textRef = useRef<HTMLTextAreaElement | null>(null);

  function handleStartAnalyze() {
    const files = inputEntrances.flatMap((item) =>
      Array.from(fileInputRefs.current[item.id]?.files ?? []).map((file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
        source: item.title,
      })),
    );
    const text = textRef.current?.value.trim() || (sampleLoaded ? sampleText : "");

    onStartAnalyze({ text, files });
  }

  return (
    <section id="demo" className="section-pad scroll-mt-24 px-4">
      <div className="app-container">
        <div className="mx-auto max-w-[760px] text-center">
          <span className="tag-pill">信息导入</span>
          <h2 className="friendly-title mt-4 text-[clamp(2.4rem,7vw,4.8rem)]">
            把信息丢进 AI 口袋。
          </h2>
          <p className="friendly-copy mx-auto mt-4 max-w-xl">
            默认用示例素材稳定演示；切到真实解析模式后，会请求预留的 /api/analyze 接口。
          </p>
        </div>

        <div className="phone-frame mt-8">
          <div className="phone-inner p-4">
            <div className="sticker-card-sm mb-4 bg-[#fff8ef] p-3">
              <p className="px-2 text-sm font-black text-[#75685f]">解析模式</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <ModeButton
                  active={analysisMode === "mock"}
                  title="示例演示模式"
                  description="默认稳定录屏"
                  onClick={() => onModeChange("mock")}
                />
                <ModeButton
                  active={analysisMode === "real"}
                  title="真实解析模式"
                  description="有 Key 才调用"
                  onClick={() => onModeChange("real")}
                />
              </div>
            </div>

            <div className="grid gap-3">
              {inputEntrances.map((item) => (
                <label
                  key={item.id}
                  htmlFor={item.id}
                  className={`sticker-card-sm sticker-hover flex min-h-32 cursor-pointer items-center gap-4 p-4 ${item.rotate}`}
                  style={{ background: item.color }}
                >
                  <span className="grid size-20 shrink-0 place-items-center rounded-[28px] border-[5px] border-white bg-white/62 text-2xl font-black shadow-[0_8px_0_rgba(65,45,36,0.06)]">
                    {item.face}
                  </span>
                  <span className="text-left">
                    <span className="block text-2xl font-black">{item.title}</span>
                    <span className="mt-1 block text-sm font-black text-[#283044]/68">{item.description}</span>
                    <span className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-black">选择文件</span>
                  </span>
                  <input
                    ref={(node) => {
                      fileInputRefs.current[item.id] = node;
                    }}
                    id={item.id}
                    name={item.id}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    suppressHydrationWarning
                  />
                </label>
              ))}

              <div className="sticker-card-sm sticker-hover -rotate-1 bg-[#ffd84d] p-4">
                <label htmlFor="notice-text" className="block text-2xl font-black">
                  通知文本
                </label>
                <p className="mt-1 text-sm font-black text-[#283044]/68">粘贴班群通知、实习内推、比赛要求</p>
                <textarea
                  ref={textRef}
                  id="notice-text"
                  name="notice-text"
                  rows={4}
                  suppressHydrationWarning
                  placeholder="把通知原文贴在这里..."
                  className="mt-3 w-full resize-none rounded-[26px] border-[5px] border-white bg-[#fffdf8] px-4 py-3 text-base font-black text-[#283044] outline-none placeholder:text-[#75685f]/55"
                />
              </div>

              <div className="grid gap-3 pt-2 sm:grid-cols-2">
                <button type="button" onClick={onUseSamples} aria-expanded={sampleLoaded} className="pill-button secondary">
                  使用示例素材
                </button>
                <button type="button" onClick={handleStartAnalyze} className="pill-button">
                  开始 AI 解析
                </button>
              </div>
            </div>
          </div>
        </div>

        {sampleLoaded ? (
          <div className="mx-auto mt-8 grid max-w-[920px] gap-4 md:grid-cols-2" aria-live="polite">
            {sampleMaterials.map((item, index) => (
              <article
                key={item.title}
                className={`sticker-card-sm sticker-hover p-4 ${index % 2 === 0 ? "-rotate-1" : "rotate-1"}`}
                style={{ background: item.color }}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-black leading-6">{item.title}</h3>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black">{item.source}</span>
                </div>
                <p className="mt-3 text-sm font-black leading-6 text-[#283044]/72">{item.content}</p>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ModeButton({
  active,
  title,
  description,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-[24px] border-[5px] border-white px-3 py-3 text-left shadow-[0_7px_0_rgba(65,45,36,0.05)] transition ${
        active ? "bg-[#ffd84d]" : "bg-white"
      }`}
    >
      <span className="block text-sm font-black text-[#283044]">{title}</span>
      <span className="mt-1 block text-xs font-black text-[#75685f]">{description}</span>
    </button>
  );
}
