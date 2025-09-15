import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { MENU_BY_ROLE } from '../../constants/constants';
import apiCall from '../../services/apiCallService';

export type MenuItem = {
  key: string;
  label: string;
  to: string;
  icon?: React.ReactNode;
};

export const useSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // menu logic
  const roleName = (user?.role?.name as 'admin' | 'pm' | 'employee');
  const items = useMemo(() => MENU_BY_ROLE[roleName], [roleName]);
  const activePath = location.pathname;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // ----------------- notifications -----------------
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [openNotifs, setOpenNotifs] = useState<boolean>(false);

  // Fetch unread count once (and when modal closes)
  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await apiCall('/notifications/count', { method: 'GET', requiresAuth: true });
      const raw = (res as any)?.data;
      // support {count}, {data: number}, or a plain number
      const count =
        typeof raw?.count === 'number' ? raw.count :
        typeof raw?.data  === 'number' ? raw.data  :
        typeof raw       === 'number'  ? raw       :
        0;
      console.log('[count] initial =', count, 'raw =', raw);
      setUnreadCount(count);
    } catch (e) {
      console.error('[count] fetch error', e);
      setUnreadCount(0);
    }
  }, []);

  // initial load (also re-run if user changes)
  useEffect(() => { if (user?.id) void fetchUnreadCount(); }, [user?.id, fetchUnreadCount]);

  // refresh when modal closes (e.g., after mark-as-read inside modal)
  useEffect(() => {
    if (!openNotifs && user?.id) void fetchUnreadCount();
  }, [openNotifs, user?.id, fetchUnreadCount]);

  // Live updates via Echo -> UnreadCountUpdated
  useEffect(() => {
    const uid = user?.id;
    const EchoInstance = (window as any)?.Echo;
    if (!uid || !EchoInstance) {
      console.warn('[echo] no uid or Echo', { uid, Echo: !!EchoInstance });
      return;
    }

    // Guard against React 18 Strict-Mode double mounting in dev
    const active = { current: true };

    const chanName = `notifications.${uid}`;
    console.log('[echo] subscribe →', chanName);
    const chan = EchoInstance.private(chanName);

    // Subscribe success/error (useful debug)
    const sub: any = (chan as any).subscription;
    if (sub?.bind) {
      sub.bind('pusher:subscription_succeeded', () => console.log('[echo] subscription_succeeded', chanName));
      sub.bind('pusher:subscription_error', (status: any) => console.error('[echo] subscription_error', chanName, status));
    }

    const onCount = (e: { unread_count?: number }) => {
      console.log('[echo] UnreadCountUpdated ←', e);
      if (typeof e?.unread_count === 'number') {
        setUnreadCount(e.unread_count);
      } else {
        console.warn('[echo] unread_count missing in event payload');
      }
    };

    chan.listen('UnreadCountUpdated', onCount);

    return () => {
      if (!active.current) return;
      active.current = false;
      try {
        chan.stopListening('UnreadCountUpdated');
        EchoInstance.leave(chanName);
        console.log('[echo] left', chanName);
      } catch (e) {
        console.warn('[echo] cleanup error', e);
      }
    };
  }, [user?.id]);

  // -------------------------------------------------

  return {
    items,
    activePath,
    roleName,
    handleLogout,
    unreadCount,
    openNotifs,
    setOpenNotifs,
    refreshUnreadCount: fetchUnreadCount,
  };
};
