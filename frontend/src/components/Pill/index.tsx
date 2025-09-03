import './styles.module.css'; 
import { usePillClass } from './hook';

type Props = { label: string };

const Pill = ({ label }: Props) => {
  const cls = usePillClass(label); 
  return <span className={cls}>{label}</span>; 
}
export default Pill;