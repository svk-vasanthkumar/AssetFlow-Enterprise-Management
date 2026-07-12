import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('assetflow_token');
    const savedUser = localStorage.getItem('assetflow_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authAPI.login({ email, password });
    const { token: jwt, user: userData } = data;
    localStorage.setItem('assetflow_token', jwt);
    localStorage.setItem('assetflow_user', JSON.stringify(userData));
    setToken(jwt);
    setUser(userData);
    return userData;
  };

  const register = async (userData) => {
    const data = await authAPI.register(userData);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('assetflow_token');
    localStorage.removeItem('assetflow_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
