import { StatusSticker } from "@/components/StatusSticker";
import { getMissedItems, getTodayMustDo, mockIntelCards } from "@/data/mockIntel";
import { getOverallStickerStatus } from "@/lib/status";

const todayActions = [
  "先补救已错过事项",
  "回复社团二面确认",
  "整理数据库报告材料",
];

export function HeroSection() {
  const status = getOverallStickerStatus(mockIntelCards);
  const todayCount = getTodayMustDo().length;
  const missedCount = getMissedItems().length;

  return (
    <section className="relative overflow-hidden px-4 pb-10 pt-28 sm:pb-14 sm:pt-32">
      <Decorations />

      <div className="app-container desktop-phone-layout relative">
        <div className="mx-auto max-w-xl text-center md:text-left">
          <span className="tag-pill bounce-in">AI 校园消息整理助手</span>
          <h1 className="friendly-title mt-5 text-[clamp(3.2rem,10vw,6.8rem)]">
            <span className="block">校园</span>
            <span className="block">情报局</span>
            <span className="mt-2 block text-[clamp(2rem,5vw,4rem)] text-[#ff7fbf]">
              Campus Intel
            </span>
          </h1>
          <p className="mt-5 text-[clamp(1.45rem,4vw,2.35rem)] font-black leading-tight text-[#283044]">
            把 99+ 群消息，变成今天该做的三件事。
          </p>
          <p className="friendly-copy mx-auto mt-4 max-w-lg md:mx-0">
            AI 从课程群、班群、社团群、比赛通知和实习信息里，抓出 deadline、风险、错过事项和下一步行动。
          </p>

          <div className="mt-7 grid gap-3 sm:flex sm:justify-center md:justify-start">
            <a href="#demo" className="pill-button w-full sm:w-auto">
              一键体验示例
            </a>
            <a href="#demo" className="pill-button secondary w-full sm:w-auto">
              上传我的校园信息
            </a>
          </div>
        </div>

        <div className="phone-frame mt-10 md:mt-0">
          <div className="phone-inner p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-[#75685f]">今日校园状态</p>
                <p className="text-2xl font-black text-[#283044]">小情报雷达</p>
              </div>
              <span className="tag-pill bg-[#9ae2e1] text-[#283044]">Live</span>
            </div>

            <StatusSticker
              status={status}
              title={status.title}
              subtitle={status.description}
              size="lg"
              className="mx-auto mt-5 w-[86%]"
            />

            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              <MiniStat value={todayCount} label="必办" color="#ffd84d" />
              <MiniStat value={missedCount} label="错过" color="#6fb8ff" />
              <MiniStat value={mockIntelCards.length} label="情报" color="#ff9ecf" />
            </div>

            <div className="sticker-card-sm mt-5 bg-[#fff8ef] p-4">
              <div className="flex items-center justify-between">
                <p className="text-lg font-black">今天先做这三件</p>
                <span className="rounded-full bg-[#ffd84d] px-3 py-1 text-xs font-black">AI 排序</span>
              </div>
              <ol className="mt-3 grid gap-2">
                {todayActions.map((item, index) => (
                  <li key={item} className="flex items-center gap-3 rounded-[22px] bg-white px-3 py-3 text-sm font-black">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#9ae2e1]">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniStat({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="rounded-[24px] border-[5px] border-white px-3 py-3 shadow-[0_8px_0_rgba(65,45,36,0.05)]" style={{ background: color }}>
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs font-black text-[#283044]/70">{label}</p>
    </div>
  );
}

function Decorations() {
  return (
    <>
      <span className="floating-shape shape-dot left-[5%] top-28 size-12 bg-[#9ae2e1]" />
      <span className="floating-shape shape-tilt right-[8%] top-24 size-16 bg-[#ffd84d]" />
      <span className="floating-shape shape-pill bottom-16 left-[9%] h-10 w-24 bg-[#ff9ecf]" />
      <span className="floating-shape shape-dot bottom-24 right-[14%] size-9 bg-[#71d66b]" />
    </>
  );
}
