import type { AppUser } from "./authService";

export const colorService = (user: AppUser | null) => {
  const color = user?.role?.color ?? '#000000ff';
  document.documentElement.style.setProperty('--primary-color', color);
};
