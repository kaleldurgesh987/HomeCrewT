import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [workerProfile, setWorkerProfile] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('homecrew_token'));
  const [loading, setLoading] = useState(true);

  // Fetch current user on initial load if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/users/me');
        if (res.data.success) {
          setUser(res.data.user);
          if (res.data.workerProfile) {
            setWorkerProfile(res.data.workerProfile);
          }
        }
      } catch (err) {
        console.error('Failed to load authenticated user:', err);
        localStorage.removeItem('homecrew_token');
        setToken(null);
        setUser(null);
        setWorkerProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const sendOtp = async (phone) => {
    const res = await api.post('/auth/send-otp', { phone });
    return res.data;
  };

  const verifyOtp = async (credentials) => {
    const res = await api.post('/auth/verify-otp', credentials);
    if (res.data.success) {
      localStorage.setItem('homecrew_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      if (res.data.workerProfile) {
        setWorkerProfile(res.data.workerProfile);
      }
    }
    return res.data;
  };

  const quickDemoLogin = async (phone) => {
    return await verifyOtp({
      phone,
      otp: '123456',
    });
  };

  const updateProfile = async (updateData) => {
    const res = await api.put('/users/me', updateData);
    if (res.data.success) {
      setUser(res.data.user);
      if (res.data.workerProfile) {
        setWorkerProfile(res.data.workerProfile);
      }
    }
    return res.data;
  };

  const toggleAvailability = async () => {
    if (!user || user.role !== 'worker') return;
    const res = await api.put('/workers/availability');
    if (res.data.success) {
      setWorkerProfile((prev) => ({
        ...prev,
        availability: res.data.availability,
      }));
    }
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('homecrew_token');
    setToken(null);
    setUser(null);
    setWorkerProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        workerProfile,
        token,
        loading,
        isAuthenticated: !!user,
        sendOtp,
        verifyOtp,
        quickDemoLogin,
        updateProfile,
        toggleAvailability,
        setWorkerProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
