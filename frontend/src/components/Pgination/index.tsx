import styles from './styles.module.css';

type Props = {
  page: number;
  perPage: number;
  total: number;
  onPageChange: (p: number) => void;
  disabled?: boolean;
};

export default function Pagination({
  page,
  perPage,
  total,
  onPageChange,
  disabled = false,
}: Props) {
  const pages = Math.max(1, Math.ceil((total || 0) / Math.max(1, perPage || 1)));
  const go = (p: number) => onPageChange(Math.min(Math.max(1, p), pages));

  const canPrev = !disabled && page > 1;
  const canNext = !disabled && page < pages;

  return (
    <nav className={styles.pager} aria-label="Pagination">
      <button
        type="button"
        className={`${styles.nav} ${!canPrev ? styles.isDisabled : ''}`}
        onClick={() => go(page - 1)}
        disabled={!canPrev}
        aria-label="Previous page"
      >
        ‹
      </button>

      <div className={styles.center}>
        <span className={styles.badge}>{page}</span>
        <span className={styles.sep}>/</span>
        <span className={styles.total}>{pages}</span>
      </div>

      <button
        type="button"
        className={`${styles.nav} ${!canNext ? styles.isDisabled : ''}`}
        onClick={() => go(page + 1)}
        disabled={!canNext}
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  );
}
