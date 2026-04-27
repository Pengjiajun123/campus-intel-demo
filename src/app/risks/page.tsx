import { Header } from "@/components/Header";
import { RiskStickerCard } from "@/components/RiskStickerCard";
import { SectionPageHeader } from "@/components/SectionPageHeader";
import { getRisks } from "@/data/mockIntel";
import { getStatusCopy } from "@/lib/status";

export default function RisksPage() {
  const risks = getRisks();

  return (
    <main className="page-shell">
      <Header />
      <section className="px-4 pb-12 pt-24">
        <div className="app-container grid gap-8">
          <SectionPageHeader
            eyebrow="风险提醒"
            title="这些后果要先看"
            description="材料缺口、资格损失、迟交风险会被单独贴出来，按严重程度优先处理。"
            status={getStatusCopy("busy")}
            countLabel={`${risks.length} 条`}
          />

          <div className="grid gap-4 md:grid-cols-2">
            {risks.map((risk, index) => (
              <RiskStickerCard key={risk.id} risk={risk} index={index} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
