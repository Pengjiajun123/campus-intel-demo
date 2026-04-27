import Link from "next/link";
import { getMissedItems, getOpportunities, getRisks, getTodayMustDo } from "@/data/mockIntel";

const navItems = [
  {
    href: "/import",
    title: "信息导入",
    desc: "把截图、海报、通知丢进 AI 口袋",
    count: "AI",
    color: "#9ae2e1",
    rotate: "-rotate-1",
  },
  {
    href: "/missed",
    title: "已错过事项",
    desc: "先补救损失，再安排后续动作",
    count: getMissedItems().length,
    color: "#6fb8ff",
    rotate: "rotate-1",
  },
  {
    href: "/today",
    title: "今日必办",
    desc: "只看今天最应该处理的事",
    count: getTodayMustDo().length,
    color: "#ffd84d",
    rotate: "rotate-1",
  },
  {
    href: "/opportunities",
    title: "本周机会",
    desc: "比赛、实习、讲座按匹配度排序",
    count: getOpportunities().length,
    color: "#ff9ecf",
    rotate: "-rotate-1",
  },
  {
    href: "/risks",
    title: "风险提醒",
    desc: "材料缺口、资格风险单独拎出来",
    count: getRisks().length,
    color: "#ff9b45",
    rotate: "-rotate-1",
  },
  {
    href: "/assistant",
    title: "AI 助手",
    desc: "问今晚先做什么，直接给动作",
    count: "Chat",
    color: "#71d66b",
    rotate: "rotate-1",
  },
];

export function AppNavGrid() {
  return (
    <nav aria-label="校园情报入口" className="grid gap-3 sm:grid-cols-2">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`sticker-card-sm sticker-hover flex min-h-28 items-center gap-3 p-4 ${item.rotate}`}
          style={{ background: item.color }}
        >
          <span className="grid size-16 shrink-0 place-items-center rounded-[24px] border-[5px] border-white bg-white/58 text-lg font-black shadow-[0_8px_0_rgba(65,45,36,0.06)]">
            {item.count}
          </span>
          <span className="min-w-0 text-left">
            <span className="block text-xl font-black leading-6 text-[#283044]">{item.title}</span>
            <span className="mt-1 block text-sm font-black leading-5 text-[#283044]/68">{item.desc}</span>
          </span>
        </Link>
      ))}
    </nav>
  );
}
