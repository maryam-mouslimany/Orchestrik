import styles from './styles.module.css';
import { useAuth } from '../../contexts/AuthContext';

const SideBar = ()=>{
    console.log(useAuth())
    console.log('[Login] localStorage[auth:user]=', localStorage.getItem('auth:user'));

    return(<div className={styles.container}>hiiiii</div>)
}

export default SideBar