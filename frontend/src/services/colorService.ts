
export const colorService = (): void => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return; // no user found

    const user = JSON.parse(userStr);
    const color = user?.data?.role?.color;

    if (color) {
      document.documentElement.style.setProperty('--primary-color', color);
    }
  } catch (error) {
    console.error('Failed to apply role color:', error);
  }
};
