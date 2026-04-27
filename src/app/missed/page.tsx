import { Header } from "@/components/Header";
import { IntelCard } from "@/components/IntelCard";
import { SectionPageHeader } from "@/components/SectionPageHeader";
import { getMissedItems } from "@/data/mockIntel";
import { getStatusCopy } from "@/lib/status";

export default function MissedPage() {
  const items = getMissedItems();
  const status = items.length > 0 ? getStatusCopy("missed") : getStatusCopy("clear");

  return (
    <main className="page-shell">
      <Header />
      <section className="px-4 pb-12 pt-24">
        <div className="app-container grid gap-8">
          <SectionPageHeader
            eyebrow="已错过事项"
            title="先补救损失"
            description="蓝色低落贴纸表示 deadline 已过，先止损，再决定是否继续投入。"
            status={status}
            countLabel={`${items.length} 件`}
          />

          <div className="grid gap-5 lg:grid-cols-2">
            {items.map((card) => (
              <IntelCard key={card.id} card={card} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
