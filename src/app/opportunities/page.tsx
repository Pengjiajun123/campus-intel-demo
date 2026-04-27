import { Header } from "@/components/Header";
import { IntelCard } from "@/components/IntelCard";
import { SectionPageHeader } from "@/components/SectionPageHeader";
import { getOpportunities } from "@/data/mockIntel";
import { getStatusCopy } from "@/lib/status";

export default function OpportunitiesPage() {
  const items = getOpportunities();

  return (
    <main className="page-shell">
      <Header />
      <section className="px-4 pb-12 pt-24">
        <div className="app-container grid gap-8">
          <SectionPageHeader
            eyebrow="本周机会"
            title="值得抓住的窗口"
            description="机会类事项按匹配度、deadline 和优先级排序，避免好机会被群消息冲掉。"
            status={getStatusCopy("easy")}
            countLabel={`${items.length} 个`}
          />

          <div className="grid gap-5 lg:grid-cols-3">
            {items.map((card) => (
              <IntelCard key={card.id} card={card} compact />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
