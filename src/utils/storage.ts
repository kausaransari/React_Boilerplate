const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

class Storage {
  private getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  }

  private setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  }

  private removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  getToken(): string | null {
    return this.getItem(TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return this.getItem(REFRESH_TOKEN_KEY);
  }

  setTokens(token: string, refreshToken: string): void {
    this.setItem(TOKEN_KEY, token);
    this.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  clearTokens(): void {
    this.removeItem(TOKEN_KEY);
    this.removeItem(REFRESH_TOKEN_KEY);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }
}

export const storage = new Storage();
