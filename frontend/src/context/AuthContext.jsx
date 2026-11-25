import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('clinic_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          const res = await API.get('/auth/me');
          setUser(res.data.user);
        } catch (error) {
          console.error('Session expired or invalid token:', error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    const { token: receivedToken, user: loggedUser } = res.data;
    localStorage.setItem('clinic_token', receivedToken);
    localStorage.setItem('clinic_user', JSON.stringify(loggedUser));
    setToken(receivedToken);
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (userData) => {
    const res = await API.post('/auth/register', userData);
    const { token: receivedToken, user: registeredUser } = res.data;
    localStorage.setItem('clinic_token', receivedToken);
    localStorage.setItem('clinic_user', JSON.stringify(registeredUser));
    setToken(receivedToken);
    setUser(registeredUser);
    return registeredUser;
  };

  const logout = () => {
    localStorage.removeItem('clinic_token');
    localStorage.removeItem('clinic_user');
    setToken(null);
    setUser(null);
  };

  const demoLogin = async (role) => {
    let credentials = { email: 'patient@medcare.com', password: 'Patient@1234' };
    if (role === 'doctor') {
      credentials = { email: 'dr.sarah@medcare.com', password: 'Doctor@1234' };
    } else if (role === 'admin') {
      credentials = { email: 'admin@medcare.com', password: 'Admin@1234' };
    }
    return await login(credentials.email, credentials.password);
  };

  const updateUser = (updated) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        demoLogin,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
