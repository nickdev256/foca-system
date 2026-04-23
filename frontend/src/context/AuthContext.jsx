import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { dashboardPathByRole } from '../utils/dashboardPathByRole';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

function normalizeRole(role = '') {
  return String(role).trim().toLowerCase().replace(/\s+/g, '_');
}

function normalizeUser(user = null) {
  if (!user) return null;

  return {
    ...user,
    role: normalizeRole(user.role),
  };
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearAuth = () => {
    localStorage.removeItem('foca_token');
    localStorage.removeItem('foca_user');
    setToken(null);
    setUser(null);
  };

  const persistAuth = (data) => {
    const safeUser = normalizeUser(data?.user);
    const safeToken = data?.token;

    if (safeToken) {
      localStorage.setItem('foca_token', safeToken);
      setToken(safeToken);
    }

    if (safeUser) {
      localStorage.setItem('foca_user', JSON.stringify(safeUser));
      setUser(safeUser);
    }

    return safeUser;
  };

  const login = async (form) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      return persistAuth(data);
    } catch (err) {
      clearAuth();
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (form) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        ...form,
        role: form.role || 'member',
      });
      return persistAuth(data);
    } catch (err) {
      clearAuth();
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
    window.location.href = '/login';
  };

  const refreshUser = async () => {
    try {
      const { data } = await api.get('/auth/me');
      const freshUser = normalizeUser(data?.user);

      if (!freshUser) throw new Error('Invalid user');

      setUser(freshUser);
      localStorage.setItem('foca_user', JSON.stringify(freshUser));

      return freshUser;
    } catch (err) {
      clearAuth();
      return null;
    }
  };

  useEffect(() => {
    const init = async () => {
      const savedToken = localStorage.getItem('foca_token');
      const savedUser = localStorage.getItem('foca_user');

      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        setToken(savedToken);

        if (savedUser) {
          setUser(normalizeUser(JSON.parse(savedUser)));
        }

        const { data } = await api.get('/auth/me');
        const freshUser = normalizeUser(data?.user);

        setUser(freshUser);
        localStorage.setItem('foca_user', JSON.stringify(freshUser));
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const isAuthenticated = Boolean(token && user);

  const dashboardPath = useMemo(() => {
    if (!user?.role) return '/login';
    return dashboardPathByRole[user.role] || '/dashboard/member';
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        dashboardPath,
        login,
        register,
        logout,
        refreshUser,
        setUser,
        normalizeRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};