import { NavLink } from 'react-router-dom';
import { useSidebar } from './hook';
import styles from './styles.module.css';
import logo from '../../assets/images/logo.png';
import { FiBell } from 'react-icons/fi';
import NotificationsModal from '../Notifications';

const Sidebar: React.FC = () => {
    const { items, roleName, handleLogout, unreadCount, openNotifs, setOpenNotifs } = useSidebar();

    return (
        <>
            <aside className={styles.sidebar} data-role={roleName}>
                <div className={styles.header}>
                    <div className={styles.logoGroup}>
                        <img className={styles.logo} src={logo} alt="App logo" />
                        <div className={styles.brand}>
                            <span className={styles.title}>Menu </span>
                            <span className={styles.role}>{roleName.toUpperCase()}</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className={styles.bellBtn}
                        onClick={() => setOpenNotifs(true)}
                    >
                        <FiBell size={18} />
                        {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
                    </button>
                </div>

                <nav className={styles.nav}>
                    <ul className={styles.list}>
                        {items.map((item) => (
                            <li key={item.key} className={styles.item}>
                                <NavLink
                                    to={item.to}
                                    className={({ isActive }) =>
                                        `${styles.link} ${isActive ? styles.isActive : ''}`
                                    }
                                    end={['/dashboard', '/my-tasks'].includes(item.to)}
                                >
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}
                        <li className={styles.item}>
                            <button className={styles.logoutBtn} onClick={handleLogout}>
                                Logout
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* mount notifications modal */}
            <NotificationsModal open={openNotifs} onClose={() => setOpenNotifs(false)} />
        </>
    );
};
export default Sidebar;