"use client";

import { useMemo, useState } from "react";
import { StatusSticker } from "@/components/StatusSticker";
import { getMissedItems, getOpportunities, getRisks, mockIntelCards } from "@/data/mockIntel";
import { getStatusCopy } from "@/lib/status";

type QuickQuestion = {
  id: string;
  question: string;
  answer: string[];
};

const clubInterview = requireIntel("club-interview");
const databaseReport = requireIntel("database-report");
const scholarshipForm = requireIntel("scholarship-form");
const pcgContest = requireIntel("pcg-ai-contest");
const missedItems = getMissedItems();
const missedFirst = missedItems[0];

function buildQuickQuestions(): QuickQuestion[] {
  const opportunities = getOpportunities();
  const highRisks = getRisks().filter((risk) => risk.priority === "高").slice(0, 4);

  return [
    {
      id: "tonight-two-hours",
      question: "我今晚只有 2 个小时，应该先做什么？",
      answer: [
        missedFirst
          ? `先处理蓝色伤心贴纸「${missedFirst.title}」：${missedFirst.deadline}，已经错过了，先补救和止损。`
          : "先检查有没有蓝色伤心贴纸，如果没有错过事项，再处理最急 deadline。",
        `第二步处理红色紧急贴纸「${clubInterview.title}」：${clubInterview.deadline}，先回复确认，避免影响面试资格。`,
        `第三步处理「${databaseReport.title}」：补齐截图和 SQL 代码。最后再给「${pcgContest.title}」留 20 分钟确认选题。`,
      ],
    },
    {
      id: "club-reply",
      question: "帮我生成社团二面确认回复",
      answer: [
        `学长/学姐好，我确认参加${clubInterview.eventTime}在${clubInterview.location}的产品社团二面，谢谢！`,
        `这条是红色紧急贴纸，建议现在直接发，因为回复截止是${clubInterview.deadline}。`,
      ],
    },
    {
      id: "contest-plan",
      question: "帮我生成 AI 产品创意赛三天计划",
      answer: [
        `第一天：确定选题和 PRD，把「${pcgContest.summary}」拆成痛点、用户故事和 Demo 流程。`,
        "第二天：完成 Demo 页面，优先保证首页、导入、解析、看板、详情页和 AI 助手能录屏。",
        "第三天：录屏、写 PDF、测试链接，确保 Demo 链接、演示录屏和说明文档都齐。",
      ],
    },
    {
      id: "weekly-risks",
      question: "我这周有哪些高风险事项？",
      answer: [
        missedFirst
          ? `已错过：${missedFirst.title}，需要今天先补救。`
          : "当前没有已错过事项。",
        `高风险：${clubInterview.title}，${clubInterview.deadline} 前必须回复。`,
        `材料风险：${databaseReport.title}，需要截图和 SQL 代码，不能只写文字报告。`,
        `资格风险：${scholarshipForm.title}，${scholarshipForm.deadline} 前未填写会被视为放弃评选资格。`,
        `机会风险：${opportunities[0].title}需要 Demo 链接、录屏和 PDF。已识别 ${highRisks.length} 条高优先级风险。`,
      ],
    },
  ];
}

export function ChatAssistant() {
  const quickQuestions = useMemo(() => buildQuickQuestions(), []);
  const [activeId, setActiveId] = useState(quickQuestions[0].id);
  const activeQuestion = quickQuestions.find((item) => item.id === activeId) ?? quickQuestions[0];
  const assistantStatus = getStatusCopy("easy");

  return (
    <section id="chat" className="section-pad scroll-mt-24 px-4 pt-4">
      <div className="app-container">
        <div className="mx-auto max-w-[760px] text-center">
          <span className="tag-pill">AI 贴纸助手</span>
          <h2 className="friendly-title mt-4 text-[clamp(2.3rem,7vw,4.4rem)]">
            问它下一步，它会先看情绪颜色。
          </h2>
          <p className="friendly-copy mx-auto mt-4 max-w-xl">
            蓝色已错过优先补救，红色紧急马上处理，橙色任务堆积再安排时间块。
          </p>
        </div>

        <div className="phone-frame mt-8">
          <div className="phone-inner p-4">
            <div className="flex items-center gap-3">
              <StatusSticker status={assistantStatus} title="小 Intel" subtitle="在线" size="sm" className="w-28" />
              <div>
                <p className="text-2xl font-black">行动建议会话</p>
                <p className="text-sm font-black text-[#75685f]">基于 {mockIntelCards.length} 条情报生成</p>
              </div>
            </div>

            <div className="mt-5 grid gap-2">
              {quickQuestions.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  aria-pressed={activeId === item.id}
                  className={`rounded-[26px] border-[5px] border-white px-4 py-3 text-left text-sm font-black shadow-[0_8px_0_rgba(65,45,36,0.05)] transition ${
                    activeId === item.id ? "bg-[#ffd84d]" : index % 2 === 0 ? "bg-[#ff9ecf]/80" : "bg-[#9ae2e1]/80"
                  }`}
                >
                  {item.question}
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-4">
              <div className="ml-auto max-w-[86%] rounded-[28px] border-[5px] border-white bg-[#ffd84d] px-4 py-3 text-sm font-black shadow-[0_8px_0_rgba(65,45,36,0.05)]">
                {activeQuestion.question}
              </div>

              <div className="max-w-[92%] rounded-[30px] border-[6px] border-white bg-[#fff8ef] p-4 shadow-[0_10px_0_rgba(65,45,36,0.06)]" aria-live="polite">
                <p className="text-sm font-black text-[#75685f]">校园情报局助手说：</p>
                <div className="mt-3 grid gap-3 text-base font-black leading-7 text-[#283044]/78">
                  {activeQuestion.answer.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-[28px] border-[5px] border-white bg-white px-3 py-2">
              <input
                type="text"
                readOnly
                value="后续可接入真实 AI API"
                suppressHydrationWarning
                className="min-h-10 flex-1 bg-transparent text-sm font-black text-[#75685f] outline-none"
                aria-label="自定义输入展示"
              />
              <button type="button" disabled className="rounded-full bg-[#d2cecb] px-4 py-2 text-sm font-black text-[#75685f]">
                发送
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function requireIntel(id: string) {
  const card = mockIntelCards.find((item) => item.id === id);

  if (!card) {
    throw new Error(`Missing mock intel card: ${id}`);
  }

  return card;
}
