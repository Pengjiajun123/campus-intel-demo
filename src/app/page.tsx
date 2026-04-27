"use client";

import { useCallback, useEffect, useState } from "react";
import { AnalyzeProgress } from "@/components/AnalyzeProgress";
import { ChatAssistant } from "@/components/ChatAssistant";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { IntelDashboard } from "@/components/IntelDashboard";
import { UploadPanel } from "@/components/UploadPanel";
import type { AnalyzeMode, AnalyzeRequestPayload } from "@/lib/types";

export default function Home() {
  const [sampleLoaded, setSampleLoaded] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<AnalyzeMode>("mock");
  const [analysisNote, setAnalysisNote] = useState("示例演示模式：使用本地 mock 数据，适合稳定录屏。");
  const [analysisStarted, setAnalysisStarted] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisRunId, setAnalysisRunId] = useState(0);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("showDashboard") !== "1") {
      return;
    }

    const mountTimer = window.setTimeout(() => {
      setAnalysisComplete(true);
    }, 0);
    const scrollTimer = window.setTimeout(() => {
      const targetId = window.location.hash === "#chat" ? "chat" : "dashboard";

      document.getElementById(targetId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 360);

    return () => {
      window.clearTimeout(mountTimer);
      window.clearTimeout(scrollTimer);
    };
  }, []);

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
        ? "真实解析模式：已请求 /api/analyze，未配置 AI_API_KEY 时会自动回退示例数据。"
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
            ? "真实 AI 已返回结构化 JSON；当前看板仍用稳定示例数据呈现比赛流程。"
            : "示例演示模式：接口已返回 mockIntel 数据。",
        );
      })
      .catch(() => {
        setAnalysisNote("/api/analyze 暂不可用，已继续使用本地示例解析流程。");
      });

    window.setTimeout(() => {
      document.getElementById("analyze")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  }

  const handleAnalysisComplete = useCallback(() => {
    setAnalysisComplete(true);

    window.setTimeout(() => {
      document.getElementById("dashboard")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 240);
  }, []);

  return (
    <main className="page-shell">
      <Header />
      <HeroSection />
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
        <>
          <IntelDashboard />
          <ChatAssistant />
        </>
      ) : null}
    </main>
  );
}
