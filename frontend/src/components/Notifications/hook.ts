// src/features/NotificationsModal/hook.ts
import { useEffect, useState, useCallback } from 'react';
import apiCall from '../../services/apiCallService';

export type Notification = {
    id: string;
    type: string;
    notifiable_type: string;
    notifiable_id: number;
    data: {
        kind?: string;
        task_id?: number;
        title?: string;
        payload?: {
            task_title?: string | null;
            project_title?: string | null;
            created_by?: number | null;
        } | null;
    };
    read_at: string | null;
    created_at: string;
    updated_at: string;
};

export const useNotificationsModal = (open: boolean) => {
    const [items, setItems] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiCall('/notifications', { method: 'GET', requiresAuth: true });
            // Accept envelope: {status, message, data:[...]} OR raw array
            const arr =
                Array.isArray((res as any)?.data) ? (res as any).data :
                    Array.isArray((res as any)) ? (res as any) :
                        [];
            setItems(arr as Notification[]);
        } catch (e: any) {
            setError(e?.message ?? 'Failed to load notifications');
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (open) void load();
    }, [open, load]);

    // Mark a single notification as read (optimistic update)
    const markRead = useCallback(async (id: string) => {
        // optimistic: remove immediately
        const prev = items;
        setItems(prev.filter(n => n.id !== id));

        try {
            // If your backend uses a different verb or path, change here.
            await apiCall(`/notifications/read`, {
                method: 'POST',
                requiresAuth: true,
                data: { notificationId: id },   // <--- add this
            });

            // success → nothing to do (already removed)
        } catch (e) {
            // rollback if it failed
            setItems(prev);
            throw e;
        }
    }, [items]);

    return {
        items,
        loading,
        error,
        load,
        markRead,
    };
};
