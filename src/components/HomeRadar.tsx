import Link from "next/link";
import { StatusSticker } from "@/components/StatusSticker";
import { getMissedItems, getOpportunities, getRisks, getTodayMustDo, mockIntelCards } from "@/data/mockIntel";
import { getOverallStickerStatus } from "@/lib/status";

const missedItems = getMissedItems();
const todayItems = getTodayMustDo();
const opportunities = getOpportunities();
const risks = getRisks();
const overallStatus = getOverallStickerStatus(mockIntelCards);
const topActions = [...missedItems, ...todayItems].slice(0, 3);

export function HomeRadar() {
  return (
    <div className="phone-frame home-radar-frame">
      <div className="phone-inner p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-[#75685f]">今日校园状态</p>
            <h2 className="text-2xl font-black leading-tight text-[#283044]">小情报雷达</h2>
          </div>
          <span className="tag-pill bg-[#9ae2e1] text-[#283044]">Live</span>
        </div>

        <StatusSticker
          status={overallStatus}
          title={overallStatus.title}
          subtitle={overallStatus.description}
          size="lg"
          className="home-radar-sticker mx-auto mt-4"
          priority
        />

        <div className="mt-4 grid grid-cols-4 gap-2 text-center">
          <RadarMetric href="/missed" value={missedItems.length} label="错过" color="#6fb8ff" />
          <RadarMetric href="/today" value={todayItems.length} label="必办" color="#ffd84d" />
          <RadarMetric href="/opportunities" value={opportunities.length} label="机会" color="#ff9ecf" />
          <RadarMetric href="/risks" value={risks.length} label="风险" color="#ff9b45" />
        </div>

        <div className="sticker-card-sm mt-4 bg-[#fff8ef] p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-lg font-black">今天先看这三件</p>
            <span className="rounded-full bg-[#ffd84d] px-3 py-1 text-xs font-black">AI 排序</span>
          </div>

          <ol className="mt-3 grid gap-2">
            {topActions.map((item, index) => (
              <li key={item.id}>
                <Link
                  href={`/intel/${item.id}`}
                  className="flex min-h-12 items-center gap-3 rounded-[22px] bg-white px-3 py-3 text-sm font-black transition hover:-translate-y-0.5"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#9ae2e1]">{index + 1}</span>
                  <span className="min-w-0 flex-1 truncate">{item.title}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function RadarMetric({
  href,
  value,
  label,
  color,
}: {
  href: string;
  value: number;
  label: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-[22px] border-[5px] border-white px-2 py-3 shadow-[0_8px_0_rgba(65,45,36,0.05)] transition hover:-translate-y-1"
      style={{ background: color }}
    >
      <span className="block text-2xl font-black leading-none">{value}</span>
      <span className="mt-1 block text-[0.72rem] font-black text-[#283044]/72">{label}</span>
    </Link>
  );
}
