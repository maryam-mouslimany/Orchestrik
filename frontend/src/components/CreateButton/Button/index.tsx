import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import styles from './styles.module.css';

type Props = {
  to: string;           // route to navigate to, e.g. "/projects/create"
  label?: string;       // optional text, defaults to "Create"
  ariaLabel?: string;   // optional aria-label; if omitted we'll use label
};

export default function CreateButton({ to }: Props) {
  return (
    <Link
      to={to}
      className={styles.btn}
      role="button"
    >
      <FiPlus className={styles.icon} aria-hidden="true" />
    </Link>
  );
}
