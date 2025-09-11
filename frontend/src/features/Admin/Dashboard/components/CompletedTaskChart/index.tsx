import React, { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import styles from "./styles.module.css";

type Row = { date: string; completed: number };
type Props = { title?: string; data: Row[]; className?: string };

const formatDay = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" });

function CustomTooltip({ active, label, payload }: { active?: boolean; label?: string; payload?: any[] }) {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <div className={styles.trow}><span>Date</span><b>{formatDay(String(label))}</b></div>
      <div className={styles.trow}><span>Completed</span><b>{payload[0].value}</b></div>
    </div>
  );
}

const Completed7dChartCard: React.FC<Props> = ({ title = "Completed (Last 7 Days)", data, className }) => {
  const total = useMemo(() => data.reduce((s, r) => s + (Number.isFinite(r.completed) ? r.completed : 0), 0), [data]);
  const avg = data.length ? total / data.length : 0;

  return (
    <div className={`${styles.card} ${className || ""}`}>
      <div className={styles.head}>
        <div>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.sub}>{data[0]?.date} → {data[data.length - 1]?.date}</p>
        </div>
        <div className={styles.kpis}>
          <div><div className={styles.kL}>Total</div><div className={styles.kV}>{total}</div></div>
          <div><div className={styles.kL}>Avg / day</div><div className={styles.kV}>{avg.toFixed(1)}</div></div>
        </div>
      </div>

      <div className={styles.chartWrap}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            barCategoryGap="35%"      /* ← gap between categories (dates) */
            barGap={8}                /* ← gap between multiple <Bar>s (if you add more) */
          >
            <defs>
              <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary-color)" stopOpacity={0.95} />
                <stop offset="100%" stopColor="var(--primary-color)" stopOpacity={0.35} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDay}
              interval={0}
              tickMargin={8}
              padding={{ left: 14, right: 14 }} /* ← space at chart edges */
              allowDuplicatedCategory={false}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              axisLine={{ stroke: "var(--border-color)" }}
              tickLine={{ stroke: "var(--border-color)" }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              axisLine={{ stroke: "var(--border-color)" }}
              tickLine={{ stroke: "var(--border-color)" }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--tooltip-cursor)" }} />
            <Bar
              dataKey="completed"
              fill="url(#barFill)"
              radius={[6, 6, 0, 0]}
              barSize={36}            /* ← bar width */
              maxBarSize={48}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Completed7dChartCard;
