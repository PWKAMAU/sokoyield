import { ApiStatus } from "@/components/api-status";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-10 px-6 py-16">
      <header className="space-y-3">
        <h1 className="text-5xl font-semibold tracking-tight">
          <span className="text-cyber">Soko</span>
          <span className="text-gold">Yield</span>
        </h1>
        <p className="text-muted">
          Buyer &amp; Admin dashboards. Trading, escrow and control-room views
          arrive in later phases.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-sm uppercase tracking-widest text-muted">
          Infrastructure status
        </h2>
        <ApiStatus />
      </section>
    </main>
  );
}
