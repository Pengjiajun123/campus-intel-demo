"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { AnalyzeProgress } from "@/components/AnalyzeProgress";
import { StatusSticker } from "@/components/StatusSticker";
import { UploadPanel } from "@/components/UploadPanel";
import type { AnalyzeMode, AnalyzeRequestPayload } from "@/lib/types";
import { getStatusCopy } from "@/lib/status";

export function ImportFlow() {
  const [sampleLoaded, setSampleLoaded] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<AnalyzeMode>("mock");
  const [analysisNote, setAnalysisNote] = useState("示例演示模式：使用本地 mock 数据，适合稳定录屏。");
  const [analysisStarted, setAnalysisStarted] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisRunId, setAnalysisRunId] = useState(0);

  function handleUseSamples() {
    setSampleLoaded(true);
    setAnalysisStarted(false);
    setAnalysisComplete(false);
  }

  function handleStartAnalyze(payload: Omit<AnalyzeRequestPayload, "mode">) {
    setAnalysisStarted(true);
    setAnalysisComplete(false);
    setAnalysisRunId((current) => current + 1);
    setAnalysisNote(
      analysisMode === "real"
        ? "真实解析模式：已请求 /api/analyze；未配置 AI_API_KEY 时会自动回退示例数据。"
        : "示例演示模式：使用本地 mock 数据，适合稳定录屏。",
    );

    void fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: analysisMode,
        text: payload.text,
        files: payload.files,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Analyze request failed");
        }

        return (await response.json()) as { mode?: AnalyzeMode; warning?: string };
      })
      .then((data) => {
        if (data.warning) {
          setAnalysisNote(data.warning);
          return;
        }

        setAnalysisNote(
          data.mode === "real"
            ? "真实 AI 已返回结构化 JSON；当前页面继续用稳定示例数据呈现比赛流程。"
            : "示例演示模式：接口已返回 mockIntel 数据。",
        );
      })
      .catch(() => {
        setAnalysisNote("/api/analyze 暂不可用，已继续使用本地示例解析流程。");
      });
  }

  const handleAnalysisComplete = useCallback(() => {
    setAnalysisComplete(true);
  }, []);

  return (
    <>
      <UploadPanel
        sampleLoaded={sampleLoaded}
        analysisMode={analysisMode}
        onModeChange={setAnalysisMode}
        onUseSamples={handleUseSamples}
        onStartAnalyze={handleStartAnalyze}
      />

      {analysisStarted ? (
        <AnalyzeProgress key={analysisRunId} mode={analysisMode} note={analysisNote} onComplete={handleAnalysisComplete} />
      ) : null}

      {analysisComplete ? (
        <section className="px-4 pb-12">
          <div className="app-container">
            <div className="phone-frame">
              <div className="phone-inner p-4 text-center">
                <StatusSticker status={getStatusCopy("easy")} title="解析完成" subtitle="情报已贴到行动板" size="md" className="mx-auto" />
                <div className="mt-5 grid gap-3">
                  <Link href="/today" className="pill-button">
                    查看今日必办
                  </Link>
                  <Link href="/risks" className="pill-button secondary">
                    查看风险提醒
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
