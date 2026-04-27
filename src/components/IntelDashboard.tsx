import type { ReactNode } from "react";
import { IntelCard } from "@/components/IntelCard";
import { StatusSticker } from "@/components/StatusSticker";
import { getMissedItems, getOpportunities, getRisks, getTodayMustDo, mockIntelCards } from "@/data/mockIntel";
import { getOverallStickerStatus } from "@/lib/status";

const todayMustDo = getTodayMustDo();
const opportunities = getOpportunities();
const missedItems = getMissedItems();
const riskReminders = getRisks().slice(0, 4);
const overallStatus = getOverallStickerStatus(mockIntelCards);

export function IntelDashboard() {
  return (
    <section id="dashboard" className="section-pad scroll-mt-24 px-4">
      <div className="app-container">
        <div className="mx-auto max-w-[760px] text-center">
          <span className="tag-pill">今日行动板</span>
          <h2 className="friendly-title mt-4 text-[clamp(2.3rem,7vw,4.6rem)]">
            <span className="block">AI 把混乱消息</span>
            <span className="block">贴成一面墙。</span>
          </h2>
          <p className="friendly-copy mx-auto mt-4 max-w-xl">
            颜色和表情先表达压力状态，再用小标签说明信息类型。先补救，再处理急事，最后看机会。
          </p>
        </div>

        <div className="phone-frame mt-8">
          <div className="phone-inner p-4">
            <div className="grid gap-4">
              <StatusSticker
                status={overallStatus}
                title={overallStatus.title}
                subtitle={`必办 ${todayMustDo.length} · 错过 ${missedItems.length} · 风险 ${riskReminders.length}`}
                size="lg"
              />

              <div className="grid grid-cols-3 gap-2 text-center">
                <Metric value={todayMustDo.length} label="必办" color="#ffd84d" />
                <Metric value={opportunities.length} label="机会" color="#ff9ecf" />
                <Metric value={missedItems.length} label="错过" color="#6fb8ff" />
              </div>
            </div>
          </div>
        </div>

        {missedItems.length > 0 ? (
          <DashboardSection title="已错过事项" note="蓝色低落贴纸，先做补救。">
            <div className="grid gap-5 lg:grid-cols-2">
              {missedItems.map((card) => (
                <IntelCard key={card.id} card={card} />
              ))}
            </div>
          </DashboardSection>
        ) : null}

        <DashboardSection title="今日必办" note="高压力贴纸，优先处理。">
          <div className="grid gap-5 lg:grid-cols-3">
            {todayMustDo.map((card) => (
              <IntelCard key={card.id} card={card} />
            ))}
          </div>
        </DashboardSection>

        <DashboardSection title="本周机会" note="机会不是最急，但值得收藏。">
          <div className="grid gap-5 lg:grid-cols-3">
            {opportunities.map((card) => (
              <IntelCard key={card.id} card={card} compact />
            ))}
          </div>
        </DashboardSection>

        <DashboardSection title="风险提醒" note="材料缺口和资格风险单独贴出来。">
          <div className="grid gap-4 md:grid-cols-2">
            {riskReminders.map((risk, index) => (
              <article
                key={risk.id}
                className={`sticker-card-sm sticker-hover p-4 ${index % 2 === 0 ? "-rotate-1" : "rotate-1"}`}
                style={{ background: index === 0 ? "#ff6b5f" : index === 1 ? "#ffd84d" : "#ff9b45" }}
              >
                <div className="flex items-start gap-3">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full border-[4px] border-white bg-white/60 text-lg font-black">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-lg font-black leading-6">{risk.risk}</p>
                    <p className="mt-2 text-sm font-black text-[#283044]/70">来源：{risk.source}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </DashboardSection>
      </div>
    </section>
  );
}

function DashboardSection({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  return (
    <section className="mt-12">
      <div className="mb-5 flex flex-col gap-2 text-center sm:text-left">
        <span className="tag-pill mx-auto sm:mx-0">{note}</span>
        <h3 className="text-4xl font-black leading-none text-[#283044]">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function Metric({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="rounded-[26px] border-[5px] border-white px-3 py-3 shadow-[0_8px_0_rgba(65,45,36,0.05)]" style={{ background: color }}>
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs font-black text-[#283044]/70">{label}</p>
    </div>
  );
}
