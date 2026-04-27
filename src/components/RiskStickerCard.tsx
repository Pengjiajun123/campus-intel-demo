import Link from "next/link";
import type { RiskReminder } from "@/lib/types";

type RiskStickerCardProps = {
  risk: RiskReminder;
  index: number;
};

export function RiskStickerCard({ risk, index }: RiskStickerCardProps) {
  const color = index === 0 ? "#ff6b5f" : index % 3 === 1 ? "#ffd84d" : "#ff9b45";

  return (
    <article className={`sticker-card-sm sticker-hover p-4 ${index % 2 === 0 ? "-rotate-1" : "rotate-1"}`} style={{ background: color }}>
      <div className="flex items-start gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-full border-[4px] border-white bg-white/62 text-lg font-black">
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-black text-[#283044]/62">{risk.title}</p>
          <h2 className="mt-1 text-lg font-black leading-6 text-[#283044]">{risk.risk}</h2>
          <p className="mt-2 text-sm font-black text-[#283044]/70">来源：{risk.source}</p>
          <Link href={`/intel/${risk.cardId}`} className="mt-3 inline-flex rounded-full bg-white px-4 py-2 text-sm font-black shadow-[0_6px_0_rgba(65,45,36,0.06)]">
            查看详情
          </Link>
        </div>
      </div>
    </article>
  );
}
