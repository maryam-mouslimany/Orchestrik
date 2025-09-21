import React, { useMemo } from "react";
import styles from "./styles.module.css";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from "recharts";

export type DistItem = {
  name: string;     
  count: number;    
  percentage?: number; 
};

type Props = {
  title?: string;
  data: DistItem[];
  colors?: string[];
  height?: number;
};

const DEFAULT_COLORS = [
  "#99ABC7","#EB6D6F","#FFC65B","#7FB77E","#6EC5E9",
  "#A5A6F6","#FFB4A2","#84A59D","#B5838D","#90BE6D",
  "#C3A995","#7F7EFF","#FF9770","#6E94B6","#F6AE2D",
];

function calcTotal(items: DistItem[]) {
  return items.reduce((s, d) => s + (Number.isFinite(d.count) ? d.count : 0), 0) || 1;
}

function renderPercentLabel(props: any) {
  const { cx, cy, midAngle, outerRadius, percent } = props;
  const RAD = Math.PI / 180;
  const r = outerRadius * 0.62;
  const x = cx + r * Math.cos(-midAngle * RAD);
  const y = cy + r * Math.sin(-midAngle * RAD);
  const pct = Math.round((percent || 0) * 100);
  if (pct < 4) return null;
  return (
    <text x={x} y={y} textAnchor="middle" dominantBaseline="middle"
      fill="#0f172a" fontSize={12} fontWeight={600}>
      {pct}%
    </text>
  );
}

export default function UnifiedCircleChart({
  title = "Distribution",
  data,
  colors = DEFAULT_COLORS,
  height = 280,
}: Props) {

  const cleaned = useMemo(() => {
    const arr = (Array.isArray(data) ? data : [])
      .filter(d => d && typeof d.name === "string" && Number.isFinite(Number(d.count)) && d.count > 0);
    const total = calcTotal(arr);
    return arr
      .map(d => ({ ...d, percentage: d.percentage ?? Math.round((d.count / total) * 100) }))
      .sort((a,b) => b.count - a.count);
  }, [data]);

  const total = calcTotal(cleaned);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.meta}>Total: {total}</div>
      </div>

      <div className={styles.chartWrap} style={{ height }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={cleaned}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="95%"
              innerRadius={0}          
              isAnimationActive={false} 
              label={renderPercentLabel}
              labelLine={false}
            >
              {cleaned.map((_, i) => (
                <Cell key={`c-${i}`} fill={colors[i % colors.length]} />
              ))}
            </Pie>

            <Tooltip
              cursor={{ fill: "rgba(2,6,23,0.04)" }}
              contentStyle={{
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                boxShadow: "0 8px 24px rgba(2,6,23,.08)",
              }}
              formatter={(value: any, _name: any, ctx: any) => {

                const v = Number(value) || 0;
                const suffix = v === 1 ? "user" : "users";
                return [`${v} ${suffix}`, ctx?.payload?.name];
              }}
              labelFormatter={() => ""} 
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
