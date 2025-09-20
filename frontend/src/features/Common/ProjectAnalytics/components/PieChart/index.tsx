import React, { useMemo } from 'react';
import { ResponsivePie } from '@nivo/pie';
import styles from './styles.module.css';

export type PieSlice = { id: string; value: number; percent?: number };

type Props = {
  title?: string;
  data: PieSlice[];
  total?: number;
  colors?: string[];
  width?: number;
  height?: number;
};

const defaultColors = ['#99ABC7', '#FFC65B', '#16a34a', '#EB6D6F', '#64748b'];

const PieMini: React.FC<Props> = ({
  title,
  data,
  total,
  colors = defaultColors,
  width = 300,
  height = 220,
}) => {
  const computedTotal = useMemo(
    () => (typeof total === 'number' ? total : data.reduce((s, d) => s + (Number(d.value) || 0), 0)),
    [data, total]
  );

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        {title && <div className={styles.title}>{title}</div>}
        <div className={styles.total}>Total: {computedTotal}</div>
      </div>

      <div className={styles.chartWrap} style={{ width, height }}>
        <ResponsivePie
          data={data}
          innerRadius={0.72}
          padAngle={1.2}
          cornerRadius={3}
          margin={{ top: 10, right: 80, bottom: 10, left: 80 }}
          colors={colors as any}
          enableArcLabels={false}
          enableArcLinkLabels
          arcLinkLabel={d => String(d.id)}
          arcLinkLabelsSkipAngle={5}
          arcLinkLabelsTextColor="#0f172a"
          arcLinkLabelsThickness={1.5}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLinkLabelsDiagonalLength={14}
          arcLinkLabelsStraightLength={16}
          arcLinkLabelsTextOffset={6}

          tooltip={({ datum }) => {
            const value = Number(datum.value) || 0;
            const apiPct = (datum.data as PieSlice).percent; 
            const pct = typeof apiPct === 'number'
              ? apiPct.toFixed(2)
              : (computedTotal > 0 ? ((value / computedTotal) * 100).toFixed(2) : '0.00');
            return (
              <div className={styles.tooltip}>
                <div className={styles.tipRow}><span className={styles.tipKey}>Name:</span> {String(datum.id)}</div>
                <div className={styles.tipRow}><span className={styles.tipKey}>Count:</span> {value}</div>
                <div className={styles.tipRow}><span className={styles.tipKey}>Percent:</span> {pct}%</div>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default PieMini;