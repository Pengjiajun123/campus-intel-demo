import Link from "next/link";
import { Header } from "@/components/Header";
import { ImportFlow } from "@/components/ImportFlow";

export default function ImportPage() {
  return (
    <main className="page-shell">
      <Header />
      <section className="px-4 pt-24">
        <div className="app-container">
          <Link href="/" className="pill-button secondary w-fit px-5 text-sm">
            返回首页
          </Link>
        </div>
      </section>
      <ImportFlow />
    </main>
  );
}
