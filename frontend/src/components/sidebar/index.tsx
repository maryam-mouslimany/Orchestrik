import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSidebar } from './hook';
import styles from './styles.module.css';

// join module class strings

const Sidebar: React.FC = () => {
    const { items, activePath, roleName } = useSidebar();

    return (
        <aside className={styles.sidebar} data-role={roleName}>
            <div className={styles.header}>
                <span className={styles.title}>Menu </span>
                <span className={styles.role}>{roleName.toUpperCase()}</span>
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
                                end={['/dashboard', '/my-tasks'].includes(item.to)}//for pages that do not have child routes
                            >
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
