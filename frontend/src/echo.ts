/// <reference types="vite/client" />
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const getToken = () => {
  try { return localStorage.getItem('token') || ''; } catch { return ''; }
};

declare global {
  interface Window { Pusher: typeof Pusher; Echo: Echo; __SOCKET_ID__?: string; }
}

window.Pusher = Pusher as any;

// small env log for sanity
console.log('[echo] ENV', {
  API_BASE: import.meta.env.VITE_API_BASE,
  KEY: import.meta.env.VITE_PUSHER_KEY,
  CLUSTER: import.meta.env.VITE_PUSHER_CLUSTER,
});

const EchoInstance: Echo = new (Echo as any)({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_KEY,
  cluster: import.meta.env.VITE_PUSHER_CLUSTER,
  forceTLS: true,

  // Private-channel authorizer with the *required* body fields
  authorizer: (channel: any) => ({
    authorize: async (socketId: string, callback: (err: boolean, data: any) => void) => {
      try {
        const url = `${import.meta.env.VITE_API_BASE}/broadcasting/auth`;
        console.log('[echo] AUTH →', { url, channel: channel.name, socketId });
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            channel_name: channel.name,
            socket_id: socketId, // ← IMPORTANT: must be in body
          }),
        });
        console.log('[echo] AUTH ←', res.status);
        if (!res.ok) throw new Error(`Auth failed: ${res.status}`);
        const data = await res.json();
        callback(false, data);
      } catch (err) {
        console.error('[echo] AUTH error', err);
        callback(true, err);
      }
    },
  }),
} as any);

window.Echo = EchoInstance as any;

// tiny connection logs (useful once, then you can remove)
const p = (window as any).Echo?.connector?.pusher;
if (p) {
  p.connection.bind('connected', () => {
    (window as any).__SOCKET_ID__ = p.connection.socket_id;
    console.log('[pusher] connected socket_id =', (window as any).__SOCKET_ID__);
  });
  p.connection.bind('error', (e: any) => console.error('[pusher] error', e));
}

export default EchoInstance;
