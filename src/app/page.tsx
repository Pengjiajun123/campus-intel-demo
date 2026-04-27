import Link from "next/link";
import { AppNavGrid } from "@/components/AppNavGrid";
import { CampusCalendar } from "@/components/CampusCalendar";
import { Header } from "@/components/Header";
import { HomeRadar } from "@/components/HomeRadar";

export default function Home() {
  return (
    <main className="page-shell">
      <Header />

      <section id="dashboard" className="relative overflow-hidden px-4 pb-10 pt-24 sm:pt-28">
        <Decorations />

        <div className="app-container relative grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_430px] lg:items-start lg:gap-12">
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:pt-8 lg:text-left">
            <span className="tag-pill bounce-in">AI 校园消息整理助手</span>
            <h1 className="friendly-title mt-4 text-[clamp(3.4rem,12vw,6.4rem)]">
              <span className="block">校园</span>
              <span className="block">情报局</span>
              <span className="mt-2 block text-[clamp(1.8rem,5vw,3.6rem)] text-[#ff7fbf]">Campus Intel</span>
            </h1>
            <p className="mt-4 text-[clamp(1.32rem,4vw,2.15rem)] font-black leading-tight text-[#283044]">
              把 99+ 群消息，变成今天该做的三件事。
            </p>
            <p className="friendly-copy mx-auto mt-3 max-w-xl lg:mx-0">
              从课程群、班群、社团群、比赛通知和实习信息里，抓出 deadline、风险、错过事项和下一步行动。
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:max-w-xl">
              <Link href="/import" className="pill-button">
                一键体验示例
              </Link>
              <Link href="/assistant" className="pill-button secondary">
                问 AI 下一步
              </Link>
            </div>

          </div>

          <div className="radar-stack mx-auto grid w-full max-w-[430px] gap-4">
            <HomeRadar />
            <CampusCalendar />
          </div>

          <div className="lg:col-span-2">
            <AppNavGrid />
          </div>
        </div>
      </section>
    </main>
  );
}

function Decorations() {
  return (
    <>
      <span className="floating-shape shape-dot left-[5%] top-28 size-12 bg-[#9ae2e1]" />
      <span className="floating-shape shape-tilt right-[8%] top-24 size-16 bg-[#ffd84d]" />
      <span className="floating-shape shape-pill bottom-12 left-[9%] h-10 w-24 bg-[#ff9ecf]" />
      <span className="floating-shape shape-dot bottom-24 right-[14%] size-9 bg-[#71d66b]" />
    </>
  );
}
