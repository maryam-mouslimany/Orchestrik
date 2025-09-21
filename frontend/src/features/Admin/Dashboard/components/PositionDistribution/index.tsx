import styles from "./styles.module.css";
import  { type PositionDistribution } from "../../../../../routes/loaders/dashboardLoader";

type Props = {
  data: PositionDistribution[];      
  size?: number;             
  title?: string;           
};

export default function PositionDistribution({
  data,
  size = 240,
  title = "Positions Distribution",
}: Props) {
  const rows = Array.isArray(data)
    ? data.filter(d => d && typeof d.name === "string" && Number.isFinite(Number(d.count)))
    : [];

  const total = rows.reduce((s, d) => s + Number(d.count), 0);
  if (!rows.length || total === 0) {
    return <div className={styles.card}>No position data.</div>;
  }

  const r = size * 0.36;
  const cx = size / 2;
  const cy = size / 2;
  const stroke = Math.max(18, Math.round(size * 0.12));
  const C = 2 * Math.PI * r;
  const gap = 2;

  const series = rows.map(d => ({ ...d, pct: d.count / total }));
  const top = [...series].sort((a, b) => b.count - a.count)[0];
  const topPct = Math.round((top.count / total) * 100);

  let offset = 0;

  return (
    <div className={styles.card} role="group" aria-label="Donut chart of positions distribution">
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.total}>Total: {total}</div>
      </div>

      <div className={styles.body}>
        <svg
          className={styles.chart}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label={`${title}. ${series.length} positions.`}
        >
          <circle className={styles.bg} cx={cx} cy={cy} r={r} fill="none" strokeWidth={stroke} />
          {series.map((s, i) => {
            const length = Math.max(0, s.pct * C - gap);
            const dasharray = `${length} ${C - length}`;
            const dashoffset = (C - offset) % C;
            offset += s.pct * C;
            return (
              <circle
                key={`${s.id || s.name}-${i}`}
                className={`${styles.slice} ${styles[`s${i % 10}`]}`}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                strokeWidth={stroke}
                strokeDasharray={dasharray}
                strokeDashoffset={dashoffset}
                role="presentation"
              />
            );
          })}

          <g aria-hidden="true">
            <text x={cx} y={cy - 6} textAnchor="middle" className={styles.centerBig}>
              {topPct}%
            </text>
            <text x={cx} y={cy + 16} textAnchor="middle" className={styles.centerSmall}>
              {top.name}
            </text>
          </g>
        </svg>

        <ul className={styles.legend} aria-label="Legend">
          {series.map((s, i) => {
            const pct = Math.round((s.count / total) * 100);
            return (
              <li key={`${s.id || s.name}-legend-${i}`} className={styles.legendItem}>
                <span className={`${styles.swatch} ${styles[`s${i % 10}`]}`} aria-hidden="true" />
                <span className={styles.legendText}>
                  <strong className={styles.legendName}>{s.name}</strong>
                  <span className={styles.legendNums}>{pct}%</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
