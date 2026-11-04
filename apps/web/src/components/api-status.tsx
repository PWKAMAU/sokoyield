"use client";

import { useEffect, useState } from "react";

type Status = "checking" | "up" | "down";

interface Component {
  status: "up" | "down";
  latencyMs: number;
}

interface HealthReport {
  status: "ok" | "degraded";
  components: Record<string, Component>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

/** Phase 1 infrastructure probe: polls the NestJS readiness endpoint. */
export function ApiStatus() {
  const [api, setApi] = useState<Status>("checking");
  const [report, setReport] = useState<HealthReport | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(`${API_URL}/api/v1/health`, { cache: "no-store" });
        const body = (await res.json()) as HealthReport;
        if (!cancelled) {
          setApi("up");
          setReport(body);
        }
      } catch {
        if (!cancelled) {
          setApi("down");
          setReport(null);
        }
      }
    }

    void poll();
    const id = setInterval(poll, 10_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const rows: Array<[string, Status, number | undefined]> = [
    ["NestJS API", api, undefined],
    ["PostgreSQL", report?.components.postgres?.status ?? (api === "checking" ? "checking" : "down"), report?.components.postgres?.latencyMs],
    ["Redis", report?.components.redis?.status ?? (api === "checking" ? "checking" : "down"), report?.components.redis?.latencyMs],
    ["Kafka", report?.components.kafka?.status ?? (api === "checking" ? "checking" : "down"), report?.components.kafka?.latencyMs],
  ];

  return (
    <ul className="divide-y divide-line rounded-xl border border-line bg-midnight-2">
      {rows.map(([name, status, latency]) => (
        <li key={name} className="flex items-center justify-between px-5 py-3 text-sm">
          <span className="text-ink">{name}</span>
          <span className="flex items-center gap-3">
            {latency !== undefined && <span className="font-mono text-muted">{latency} ms</span>}
            <span
              className={
                status === "up"
                  ? "rounded-full border border-cyber/60 px-3 py-0.5 text-cyber"
                  : status === "down"
                    ? "rounded-full border border-alert/60 px-3 py-0.5 text-alert"
                    : "rounded-full border border-line px-3 py-0.5 text-muted"
              }
            >
              {status}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
