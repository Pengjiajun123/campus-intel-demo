import Link from "next/link";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3">
      <div className="site-header-bar mx-auto flex min-h-14 items-center justify-between rounded-full border-[6px] border-white bg-[#fffdf8] px-3 text-[#283044] shadow-[0_10px_0_rgba(65,45,36,0.06),0_18px_32px_rgba(75,52,39,0.12)] md:w-full md:max-w-[760px]">
        <Link href="/" className="flex min-h-10 items-center gap-2 rounded-full pr-2 text-sm font-black">
          <span className="grid size-8 place-items-center rounded-full bg-[#ffd84d] text-xs">CI</span>
          <span className="leading-tight">
            <span className="block">校园情报局</span>
            <span className="hidden text-xs text-[#75685f] sm:block">Campus Intel</span>
          </span>
        </Link>

        <nav aria-label="主导航" className="flex items-center gap-1 text-sm font-black text-[#75685f]">
          <Link className="rounded-full px-3 py-2 transition hover:bg-[#f7f1ed] hover:text-[#283044]" href="/#demo">
            Demo
          </Link>
          <Link className="rounded-full px-3 py-2 transition hover:bg-[#f7f1ed] hover:text-[#283044]" href="/?showDashboard=1#dashboard">
            看板
          </Link>
          <Link className="hidden rounded-full px-3 py-2 transition hover:bg-[#f7f1ed] hover:text-[#283044] sm:inline-flex" href="/?showDashboard=1#chat">
            助手
          </Link>
        </nav>
      </div>
    </header>
  );
}
