import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import styles from './styles.module.css';

export type StatusSlice = {
  status: string;
  count: number;
  percent: number; // 0–100
};

type Props = {
  title?: string;
  total: number;
  data: StatusSlice[];
};

const COLORS_BY_STATUS: Record<string, string> = {
  pending: '#99ABC7',
  'in progress': '#FFC65B',
  completed: '#16a34a',
  reopened: '#EB6D6F',
  review: '#64748b',
};
const fallback = ['#99ABC7', '#FFC65B', '#16a34a', '#EB6D6F', '#64748b'];

const ProjectTaskStatusesChart: React.FC<Props> = ({ title = 'Task Status Breakdown', total, data }) => {
  const chartData = data.map((d, i) => ({
    id: d.status,
    label: d.status,
    value: d.count,
    percent: d.percent,
    color: COLORS_BY_STATUS[d.status.toLowerCase()] ?? fallback[i % fallback.length],
  }));

  return (
    <div className={styles.card} role="region" aria-label="Project task status pie chart">
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.total}>Total: {total}</div>
      </div>

      <div className={styles.chartWrap}>
        <ResponsivePie
          data={chartData}
          colors={{ datum: 'data.color' }}
          innerRadius={0.6}
          padAngle={1.5}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          enableArcLabels={false}
          tooltip={({ datum }) => (
            <div className={styles.tooltip}>
              <div className={styles.tooltipTitle}>{String(datum.id)}</div>
              <div className={styles.tooltipRow}>
                <span>Count</span>
                <b>{datum.value}</b>
              </div>
              <div className={styles.tooltipRow}>
                <span>Percent</span>
                <b>{(datum.data as any).percent.toFixed(2)}%</b>
              </div>
            </div>
          )}
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              justify: false,
              translateY: 36,
              itemsSpacing: 8,
              itemWidth: 110,
              itemHeight: 14,
              itemTextColor: '#334155',
              symbolSize: 12,
              symbolShape: 'circle',
            },
          ]}
          theme={{
            labels: { text: { fontSize: 12, fill: '#0f172a' } },
            legends: { text: { fontSize: 12 } },
            tooltip: { container: { background: '#fff' } },
          }}
          margin={{ top: 10, right: 10, bottom: 50, left: 10 }}
        />
      </div>

      <ul className={styles.legendList} role="list">
        {chartData.map((s, i) => (
          <li className={styles.legendItem} key={i}>
            <span className={styles.swatch} style={{ background: s.color }} />
            <span className={styles.legendLabel}>{s.label}</span>
            <span className={styles.legendValue}>{s.value}</span>
            <span className={styles.legendPercent}>
              {(s.percent as number).toFixed(2)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectTaskStatusesChart;
