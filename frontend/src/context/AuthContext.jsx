import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      const token = localStorage.getItem('homework_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await authService.me();
        setUser(data.user);
      } catch {
        localStorage.removeItem('homework_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    bootstrap();
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    async login(email, password) {
      const data = await authService.login(email, password);
      localStorage.setItem('homework_token', data.token);
      setUser(data.user);
      return data;
    },
    async register(payload) {
      const data = await authService.register(payload);
      localStorage.setItem('homework_token', data.token);
      setUser(data.user);
      return data;
    },
    async logout() {
      try {
        await authService.logout();
      } catch {
        /* still clear local session */
      }
      localStorage.removeItem('homework_token');
      setUser(null);
    }
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
