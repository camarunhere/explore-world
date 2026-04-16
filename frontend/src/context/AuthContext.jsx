import { createContext, useContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async (token) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        localStorage.removeItem('ew_token');
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('ew_token');
    if (token) fetchMe(token);
    else setLoading(false);
  }, [fetchMe]);

  const login = (token, userData) => {
    localStorage.setItem('ew_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('ew_token');
    setUser(null);
  };

  const updateUser = (updatedData) => setUser((prev) => ({ ...prev, ...updatedData }));

  const getToken = () => localStorage.getItem('ew_token');

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
