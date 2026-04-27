import Link from "next/link";
import { ChatAssistant } from "@/components/ChatAssistant";
import { Header } from "@/components/Header";

export default function AssistantPage() {
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
      <ChatAssistant />
    </main>
  );
}
