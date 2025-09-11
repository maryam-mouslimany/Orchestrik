import { useState } from "react";
import styles from "./styles.module.css";

type Item = { title: string; duration: number };

export default function TopLeastDurationsCompact({
  most, least
}: { most: Item[]; least: Item[] }) {
  const [tab, setTab] = useState<"most" | "least">("most");
  const items = tab === "most" ? most : least;

  // both arrays are already ordered by API; pick a max for meter scale
  const max = items.length
    ? (tab === "most" ? items[0].duration : items[items.length - 1].duration)
    : 0;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>Completed Tasks by Duration</div>
        <div className={styles.tabs} role="tablist" aria-label="Durations">
          <button
            className={`${styles.tab} ${tab === "most" ? styles.active : ""}`}
            onClick={() => setTab("most")}
            role="tab"
            aria-selected={tab === "most"}
          >
            Most
          </button>
          <button
            className={`${styles.tab} ${tab === "least" ? styles.active : ""}`}
            onClick={() => setTab("least")}
            role="tab"
            aria-selected={tab === "least"}
          >
            Least
          </button>
        </div>
      </div>

      <ul className={styles.list}>
        {items.map((it, i) => (
          <li key={i} className={styles.row}>
            <div className={styles.main}>
              <div className={styles.line}>
                <span className={styles.title} title={it.title}>{it.title}</span>
                <span className={styles.value}>{it.duration}</span>
              </div>
              <meter className={styles.meter} min={0} max={max || 1} value={it.duration}></meter>
            </div>
          </li>
        ))}
        {items.length === 0 && <li className={styles.empty}>No data.</li>}
      </ul>
    </div>
  );
}
