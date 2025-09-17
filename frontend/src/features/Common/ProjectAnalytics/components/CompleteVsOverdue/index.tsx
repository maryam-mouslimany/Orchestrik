import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import styles from './styles.module.css';

export type CompletedVsOverdueShape = {
  completed_total: number;
  on_time_count: number;
  overdue_count: number;
  on_time_percent: number;
  overdue_percent: number;
};

type Props = {
  title?: string;
  data: CompletedVsOverdueShape;
};

const CompletedVsOverdue: React.FC<Props> = ({ title = 'Completed: On-time vs Overdue', data }) => {
  const chartData = [
    { id: 'On time', label: 'On time', value: data.on_time_count,  percent: data.on_time_percent,  color: '#16a34a' },
    { id: 'Overdue', label: 'Overdue', value: data.overdue_count,  percent: data.overdue_percent,  color: '#EB6D6F' },
  ];

  return (
    <div className={styles.card} role="region" aria-label="Completed tasks: on-time vs overdue">
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.total}>Completed: {data.completed_total}</div>
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
          margin={{ top: 10, right: 10, bottom: 50, left: 10 }}
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              translateY: 36,
              itemWidth: 110,
              itemHeight: 14,
              itemsSpacing: 8,
              symbolSize: 12,
              symbolShape: 'circle',
              itemTextColor: '#334155',
            },
          ]}
          tooltip={({ datum }) => (
            <div className={styles.tooltip}>
              <div className={styles.tooltipTitle}>{String(datum.id)}</div>
              <div className={styles.tooltipRow}><span>Count</span><b>{datum.value}</b></div>
              <div className={styles.tooltipRow}><span>Percent</span><b>{(datum.data as any).percent.toFixed(2)}%</b></div>
            </div>
          )}
          theme={{ legends: { text: { fontSize: 12 } }, tooltip: { container: { background: '#fff' } } }}
        />
      </div>
    </div>
  );
};

export default CompletedVsOverdue;
