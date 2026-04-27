import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { IntelActionPanel } from "@/components/IntelActionPanel";
import { StatusSticker } from "@/components/StatusSticker";
import { mockIntelCards } from "@/data/mockIntel";
import { getCardStickerStatus, isMissedIntel } from "@/lib/status";

type IntelDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const pcgPlan = [
  "第一天：确定选题和 PRD",
  "第二天：完成 Demo 页面",
  "第三天：录屏、写 PDF、测试链接",
];

const pcgDeliverables = ["Demo 链接", "Demo 演示录屏", "说明文档 PDF"];

export function generateStaticParams() {
  return mockIntelCards.map((card) => ({
    id: card.id,
  }));
}

export default async function IntelDetailPage({ params }: IntelDetailPageProps) {
  const { id } = await params;
  const card = mockIntelCards.find((item) => item.id === id);

  if (!card) {
    notFound();
  }

  const status = getCardStickerStatus(card);
  const isPcgContest = card.id === "pcg-ai-contest";
  const missed = isMissedIntel(card);

  return (
    <main className="page-shell min-h-screen">
      <Header />

      <section className="px-4 pb-12 pt-28">
        <div className="app-container">
          <Link href="/?showDashboard=1#dashboard" className="pill-button secondary">
            返回情报看板
          </Link>

          <div className="phone-frame mt-6">
            <div className="phone-inner p-4">
              <StatusSticker
                status={status}
                title={missed ? "先补救它" : status.shortLabel}
                subtitle={status.description}
                size="lg"
              />

              <article className="sticker-card mt-5 bg-[#fffdf8] p-5">
                <div className="flex flex-wrap gap-2">
                  <span className="tag-pill">{card.category}</span>
                  <span className="tag-pill bg-[#ffd84d]">{card.priority}优先级</span>
                  {missed ? <span className="tag-pill bg-[#6fb8ff] text-[#283044]">已错过</span> : null}
                </div>
                <h1 className="mt-4 text-4xl font-black leading-none text-[#283044]">{card.title}</h1>
                <p className="mt-4 text-base font-black leading-7 text-[#283044]/72">{card.summary}</p>
              </article>
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-5">
              <InfoSection title="基础信息" color="#ffd84d">
                <dl className="grid gap-3 text-sm font-black">
                  <InfoRow label="类型" value={card.category} />
                  <InfoRow label="优先级" value={card.priority} />
                  <InfoRow label="置信度" value={`${Math.round(card.confidence * 100)}%`} />
                  {card.deadline ? <InfoRow label={missed ? "错过时间" : "Deadline"} value={card.deadline} /> : null}
                  {card.eventTime ? <InfoRow label="Event Time" value={card.eventTime} /> : null}
                  {card.location ? <InfoRow label="Location" value={card.location} /> : null}
                  <InfoRow label="来源" value={card.source} />
                </dl>
              </InfoSection>

              <InfoSection title="来源追溯" color="#9ae2e1">
                <p className="text-base font-black">{card.source}</p>
                <blockquote className="mt-3 rounded-[26px] border-[5px] border-white bg-[#fffdf8] p-4 text-base font-black leading-7 text-[#283044]/72">
                  {card.sourceQuote}
                </blockquote>
              </InfoSection>

              <InfoSection title="AI 判断理由" color="#ff9ecf">
                <p className="text-base font-black leading-7 text-[#283044]/72">{card.aiReason}</p>
              </InfoSection>
            </div>

            <div className="space-y-5">
              <InfoSection title={missed ? "下一步补救行动" : "下一步行动"} color="#9ae2e1">
                <ol className="grid gap-3">
                  {card.nextActions.map((action, index) => (
                    <li key={action} className="flex gap-3 rounded-[26px] border-[5px] border-white bg-[#fffdf8] p-4">
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#ffd84d] text-base font-black">
                        {index + 1}
                      </span>
                      <span className="text-base font-black leading-7 text-[#283044]/74">{action}</span>
                    </li>
                  ))}
                </ol>
              </InfoSection>

              <InfoSection title="风险提醒" color="#ff9b45">
                <ul className="grid gap-3">
                  {card.risks.map((risk) => (
                    <li key={risk} className="rounded-[26px] border-[5px] border-white bg-[#fffdf8] p-4 text-base font-black leading-7 text-[#283044]/74">
                      {risk}
                    </li>
                  ))}
                </ul>
              </InfoSection>

              {isPcgContest ? (
                <InfoSection title="比赛专项贴纸" color="#ff9ecf">
                  <div className="rounded-[26px] border-[5px] border-white bg-[#fffdf8] p-4">
                    <p className="text-base font-black">初赛提交物</p>
                    <ul className="mt-3 grid gap-2 text-base font-black leading-7 text-[#283044]/72">
                      {pcgDeliverables.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 rounded-[26px] border-[5px] border-white bg-[#fffdf8] p-4">
                    <p className="text-base font-black">建议三天计划</p>
                    <ol className="mt-3 grid gap-2 text-base font-black leading-7 text-[#283044]/72">
                      {pcgPlan.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ol>
                  </div>
                </InfoSection>
              ) : null}
            </div>
          </div>

          <IntelActionPanel card={card} />
        </div>
      </section>
    </main>
  );
}

function InfoSection({ title, children, color }: { title: string; children: ReactNode; color: string }) {
  return (
    <section className="sticker-card p-5" style={{ background: color }}>
      <h2 className="text-3xl font-black leading-none text-[#283044]">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-[24px] border-[5px] border-white bg-[#fffdf8] px-4 py-3">
      <dt className="text-[#75685f]">{label}</dt>
      <dd className="text-right text-[#283044]">{value}</dd>
    </div>
  );
}
