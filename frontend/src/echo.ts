/// <reference types="vite/client" />
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo;
  }
}

const getToken = (): string => {
  try {
    return localStorage.getItem('token') || '';
  } catch {
    return '';
  }
};

window.Pusher = Pusher;

const EchoInstance = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_KEY,
  cluster: import.meta.env.VITE_PUSHER_CLUSTER,
  forceTLS: true,
  authorizer: (channel: { name: string }) => ({
    authorize: async (socketId: string, callback: (err: boolean, data: unknown) => void) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/broadcasting/auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ channel_name: channel.name, socket_id: socketId }),
        });
        if (!res.ok) throw new Error(`Auth failed: ${res.status}`);
        callback(false, await res.json());
      } catch (e) {
        callback(true, e);
      }
    },
  }),
});

window.Echo = EchoInstance;

export default EchoInstance;
