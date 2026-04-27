import Link from "next/link";
import { StatusSticker } from "@/components/StatusSticker";
import type { StickerStatus } from "@/lib/status";

type SectionPageHeaderProps = {
  title: string;
  eyebrow: string;
  description: string;
  status: StickerStatus;
  countLabel?: string;
};

export function SectionPageHeader({ title, eyebrow, description, status, countLabel }: SectionPageHeaderProps) {
  return (
    <div className="grid gap-5">
      <Link href="/" className="pill-button secondary w-fit px-5 text-sm">
        返回首页
      </Link>

      <div className="phone-frame">
        <div className="phone-inner p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black text-[#75685f]">{eyebrow}</p>
              <h1 className="text-3xl font-black leading-none text-[#283044]">{title}</h1>
            </div>
            {countLabel ? <span className="tag-pill bg-[#ffd84d] text-[#283044]">{countLabel}</span> : null}
          </div>

          <StatusSticker status={status} title={status.title} subtitle={description} size="lg" className="mx-auto mt-4" />
        </div>
      </div>
    </div>
  );
}
