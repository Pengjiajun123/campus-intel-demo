import { Header } from "@/components/Header";
import { IntelCard } from "@/components/IntelCard";
import { SectionPageHeader } from "@/components/SectionPageHeader";
import { getTodayMustDo } from "@/data/mockIntel";
import { getOverallStickerStatus, getStatusCopy } from "@/lib/status";

export default function TodayPage() {
  const items = getTodayMustDo();
  const status = items.length > 0 ? getOverallStickerStatus(items) : getStatusCopy("clear");

  return (
    <main className="page-shell">
      <Header />
      <section className="px-4 pb-12 pt-24">
        <div className="app-container grid gap-8">
          <SectionPageHeader
            eyebrow="今日必办"
            title="先处理这些急事"
            description="按优先级和 deadline 自动排序，先做会影响资格和结果的事项。"
            status={status}
            countLabel={`${items.length} 件`}
          />

          <div className="grid gap-5 lg:grid-cols-3">
            {items.map((card) => (
              <IntelCard key={card.id} card={card} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
