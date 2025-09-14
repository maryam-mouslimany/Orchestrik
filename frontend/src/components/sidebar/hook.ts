// src/layout/Sidebar/hook.ts
import { useMemo, useState, useEffect, useCallback } from 'react';
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

  // --- your existing role + menu logic (unchanged) ---
  const roleName = (user?.role?.name as 'admin' | 'pm' | 'employee');
  const items = useMemo(() => MENU_BY_ROLE[roleName], [roleName]);
  const activePath = location.pathname;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // --- NEW: notifications state for badge + modal ---
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [openNotifs, setOpenNotifs] = useState<boolean>(false);

  // Use your existing /notifications endpoint (unread only) to compute count.
  // If later you add /notifications/count, you can switch here with 1 line.
  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await apiCall('/notifications', { method: 'GET', requiresAuth: true });
      const list = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
      setUnreadCount(list.length);
    } catch {
      setUnreadCount(0);
    }
  }, []);

  // Initial count on mount
  useEffect(() => {
    void fetchUnreadCount();
  }, [fetchUnreadCount]);

  // Refresh count when modal closes (in case items were marked read inside)
  useEffect(() => {
    if (!openNotifs) {
      void fetchUnreadCount();
    }
  }, [openNotifs, fetchUnreadCount]);

  // --- Laravel Echo / Pusher live updates ---
  useEffect(() => {
    // If you expose Echo globally, this will work. Otherwise, import your instance here.
    const EchoInstance = (window as any)?.Echo;
    const uid = user?.id;
    if (!EchoInstance || !uid) return;

    // Default private notification channel for Notifiable users:
    // "private-App.Models.User.{id}"
    const channelName = `App.Models.User.${uid}`;
    const channel = EchoInstance.private(channelName);

    // Standard notification callback increments unread badge
    const onNotification = (_notification: any) => {
      setUnreadCount((c) => c + 1);
      // If your modal is open and you want to inject the new item in the list,
      // do it inside your NotificationsModal component.
    };

    channel.notification(onNotification);

    return () => {
      try {
        EchoInstance.leave(`private-${channelName}`);
      } catch {
        // no-op
      }
    };
  }, [user?.id]);

  return {
    // existing returns
    items,
    activePath,
    roleName,
    handleLogout,

    // NEW for notifications
    unreadCount,
    openNotifs,
    setOpenNotifs,

    // handy if you need to pull count manually from elsewhere
    refreshUnreadCount: fetchUnreadCount,
  };
};
