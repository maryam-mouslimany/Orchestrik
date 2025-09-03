// returns: "success" | "warning" | "danger" | "info" | "neutral"

const MAP: Record<string, 'success'|'warning'|'danger'|'info'|'neutral'> = {
  // statuses
  active: 'success',
  completed: 'success',
  pending: 'warning',
  'on hold': 'warning',
  'in progress': 'info',
  reopened: 'info',

  // priorities
  low: 'success',
  medium: 'warning',
  high: 'danger',
};

export function usePillClass(label: string) {
  return MAP[label] ?? 'neutral';
}
