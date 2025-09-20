import React, { useMemo } from "react";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import styles from "./styles.module.css";

type TaskRow = { title: string; estimated: number; actual: number; assignee: string };

export default function EstimateVsActualScatter({ tasks }: { tasks: TaskRow[] }) {
  const series = useMemo(() => {
    const by = new Map<string, TaskRow[]>();
    tasks.forEach(t => (by.has(t.assignee) ? by : by.set(t.assignee, [])).get(t.assignee)!.push(t));
    const sorted = [...by.entries()].sort((a, b) => b[1].length - a[1].length);
    const keep = sorted.slice(0, 6);
    const others = sorted.slice(6).flatMap(([, r]) => r);
    const out = keep.map(([id, rows]) => ({ id, data: rows.map(r => ({ x: r.estimated, y: r.actual, title: r.title })) }));
    if (others.length) out.push({ id: "Others", data: others.map(r => ({ x: r.estimated, y: r.actual, title: r.title })) });
    return out;
  }, [tasks]);

  const maxVal = Math.max(1, ...tasks.flatMap(t => [t.estimated, t.actual]));
  const padMax = Math.ceil(maxVal * 1.1);

  // --- ONLY NEW PART: Y = X reference line ---
  const refLine = ({ xScale, yScale }: any) => (
    <line
      className={styles.refLine}
      x1={xScale(0)} y1={yScale(0)}
      x2={xScale(padMax)} y2={yScale(padMax)}
    />
  );

  return (
    <div className={styles.card}>
      <div className={`${styles.chart} ${styles.h360}`}>
        <ResponsiveScatterPlot
          data={series}
          xScale={{ type: "linear", min: 0, max: padMax }}
          yScale={{ type: "linear", min: 0, max: padMax }}
          axisBottom={{ legend: "Estimated (h)", legendOffset: 30, legendPosition: "middle" }}
          axisLeft={{ legend: "Actual (h)",    legendOffset: -36, legendPosition: "middle" }}
          margin={{ top: 10, right: 20, bottom: 50, left: 50 }}
          colors={{ scheme: "set2" }}
          blendMode="multiply"
          useMesh
          layers={["grid", "axes", refLine, "nodes", "markers", "mesh", "legends"]} 
          tooltip={({ node }) => (
            <div className={styles.tooltip}>
              <div><span>Task: </span><b>{node?.data?.title}</b></div>
              <div><span>Est.: </span><b>{node?.data?.x} h</b></div>
              <div><span>Actual: </span><b>{node?.data?.y} h</b></div>
              <div><span>Assignee: </span><b>{node?.serieId}</b></div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
