import styles from "./styles.module.css";
import type { Workload } from "../../../../../routes/loaders/dashboardLoader";

export default function WorkloadHeatmap({ rows }: { rows: Workload[] }) {
  if (!rows?.length) return <div className={styles.empty}>No workload data.</div>;

  const maxTotal = rows.reduce((m, r) => Math.max(m, r.total), 0) || 1;
  const bucketByTotal = (total: number) => {
    const idx = Math.min(7, Math.floor((total / maxTotal) * 7)); 
    return styles[`b${idx}` as keyof typeof styles] as string;
  };

  return (
    <div className={styles.card} aria-label="Workload heatmap (total tasks per employee)">
      <div className={styles.header}>
        <div className={styles.title}>Workload (by total tasks)</div>
        <div className={styles.legend}>
          <span>Low</span>
          <div className={styles.gradient} aria-hidden="true" />
          <span>High</span>
        </div>
      </div>

      <div className={styles.grid} role="list">
        {rows.map((r, i) => (
          <div
            key={i}
            role="listitem"
            className={`${styles.tile} ${bucketByTotal(r.total)}`}
            title={`${r.name}\nTotal: ${r.total}\nPending: ${r.pending}\nIn-Progress: ${r.in_progress}`}
            aria-label={`${r.name}, total ${r.total}`}
          >
            <div className={styles.tileBody}>
              <div className={styles.count}>{r.total}</div>
              <div className={styles.name}>{r.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
