// src/echo.ts
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from 'axios';

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo;
  }
}

window.Pusher = Pusher;

// grab your auth token if you use Bearer tokens for API auth
const token = localStorage.getItem('token') || '';

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  forceTLS: (import.meta.env.VITE_PUSHER_SCHEME || 'https') === 'https',
  // If your backend uses cookie session / Sanctum, use withCredentials: true instead of authorizer.
  // withCredentials: true,

  // If your backend uses Bearer token for /broadcasting/auth:
  authorizer: (channel: any) => ({
    authorize: (socketId: string, callback: Function) => {
      axios.post(
        '/broadcasting/auth',
        { socket_id: socketId, channel_name: channel.name },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      )
      .then(res => callback(false, res.data))
      .catch(err => callback(true, err));
    },
  }),
});
