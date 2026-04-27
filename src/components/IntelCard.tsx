import Link from "next/link";
import { StatusSticker } from "@/components/StatusSticker";
import type { IntelCard as IntelCardData } from "@/lib/types";
import { getCardStickerStatus, isMissedIntel } from "@/lib/status";

type IntelCardProps = {
  card: IntelCardData;
  compact?: boolean;
};

export function IntelCard({ card, compact = false }: IntelCardProps) {
  const status = getCardStickerStatus(card);
  const timeLabel = isMissedIntel(card) ? "错过" : card.deadline ? "截止" : "时间";
  const timeValue = card.deadline ?? card.eventTime ?? "待确认";
  const reasonPreview =
    card.aiReason.length > 42 ? `${card.aiReason.slice(0, 42)}...` : card.aiReason;

  return (
    <article className="sticker-card sticker-hover flex h-full flex-col bg-[#fffdf8] p-4">
      <div className="flex items-start gap-4">
        <StatusSticker status={status} title={status.shortLabel} size="sm" className="w-28 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <span className="tag-pill bg-white">{card.category}</span>
            {isMissedIntel(card) ? <span className="tag-pill bg-[#6fb8ff] text-[#283044]">已错过</span> : null}
          </div>
          <h3 className="mt-3 text-2xl font-black leading-7 text-[#283044]">{card.title}</h3>
        </div>
      </div>

      <p className={`mt-4 text-base font-black leading-7 text-[#283044]/72 ${compact ? "line-clamp-2" : ""}`}>
        {card.summary}
      </p>

      <dl className="mt-4 grid gap-2 rounded-[26px] bg-[#f7f1ed] p-4 text-sm font-black">
        <InfoRow label={timeLabel} value={timeValue} />
        <InfoRow label="来源" value={card.source} />
        <InfoRow label="置信度" value={`${Math.round(card.confidence * 100)}%`} />
      </dl>

      <div className="mt-4 rounded-[26px] border-[5px] border-white bg-[#9ae2e1]/50 p-4">
        <p className="text-xs font-black text-[#75685f]">AI 判断</p>
        <p className="mt-1 text-sm font-black leading-6 text-[#283044]/74">{reasonPreview}</p>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <span className="rounded-full bg-[#fff8ef] px-3 py-1 text-xs font-black text-[#75685f]">
          匹配 {card.matchScore}%
        </span>
        <Link href={`/intel/${card.id}`} className="pill-button min-h-12 px-5 py-2 text-sm">
          查看详情
        </Link>
      </div>
    </article>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-[#75685f]">{label}</dt>
      <dd className="text-right text-[#283044]">{value}</dd>
    </div>
  );
}
