export const getAccessToken = (): string | null => {
  try {
    return localStorage.getItem('accessToken');
  } catch (error) {
    console.error('Failed to access localStorage:', error);
    return null;
  }
};

export const setAccessToken = (token: string): void => {
  try {
    localStorage.setItem('accessToken', token);
  } catch (error) {
    console.error('Failed to access localStorage:', error);
  }
};

export const removeAccessToken = (): void => {
  try {
    localStorage.removeItem('accessToken');
  } catch (error) {
    console.error('Failed to access localStorage:', error);
  }
};
