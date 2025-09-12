import React, { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList,
} from "recharts";
import styles from "./styles.module.css";

export type SkillRow = { name: string; count: number; percentage?: number };

type Props = {
  title?: string;
  data: SkillRow[];
  topN?: number;          // default 15
  className?: string;
};

function pctOf(total: number, v: number) {
  return total ? Math.round((v / total) * 100) : 0;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload as SkillRow & { _pct: number };
  return (
    <div className={styles.tooltip}>
      <div className={styles.trow}><span>Skill</span><b>{p.name}</b></div>
      <div className={styles.trow}><span>Employees</span><b>{p.count}</b></div>
      <div className={styles.trow}><span>Share</span><b>{p._pct}%</b></div>
    </div>
  );
}

export default function SkillsBarChartCard({
  title = "Employees per Skill",
  data,
  topN = 15,
  className,
}: Props) {
  const cleaned = useMemo(() => {
    const arr = (Array.isArray(data) ? data : [])
      .filter(d => d && typeof d.name === "string" && Number.isFinite(Number(d.count)) && d.count > 0);
    const total = arr.reduce((s, r) => s + r.count, 0);
    return arr
      .map(d => ({ ...d, _pct: d.percentage ?? pctOf(total, d.count) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, topN);
  }, [data, topN]);

  // pick a height bucket via class (no inline)
  const rows = cleaned.length;
  const heightClass =
    rows <= 6  ? styles.h220 :
    rows <= 10 ? styles.h300 :
    rows <= 15 ? styles.h420 : styles.h560;

  const totalShown = useMemo(() => cleaned.reduce((s, r) => s + r.count, 0), [cleaned]);

  return (
    <div className={`${styles.card} ${className || ""}`}>
      <div className={styles.head}>
        <div>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.sub}>Top {cleaned.length} skills</p>
        </div>
        <div className={styles.kpis}>
          <div>
            <div className={styles.kL}>Employees shown</div>
            <div className={styles.kV}>{totalShown}</div>
          </div>
        </div>
      </div>

      <div className={`${styles.chartWrap} ${heightClass}`}>
        <ResponsiveContainer>
          <BarChart
            data={cleaned}
            layout="vertical"
            barCategoryGap={6}
            margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
          >
            <defs>
              <linearGradient id="barFillSkill" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"  stopColor="var(--primary-color)" stopOpacity={0.95} />
                <stop offset="100%" stopColor="var(--primary-color)" stopOpacity={0.45} />
              </linearGradient>
            </defs>

            <CartesianGrid horizontal strokeDasharray="3 3" />
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="name" width={200} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="url(#barFillSkill)" radius={[6,6,6,6]} barSize={18} maxBarSize={22}>
              <LabelList dataKey="_pct" position="right" formatter={(v: number) => `${v}%`} fill="#334155" fontSize={12} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
