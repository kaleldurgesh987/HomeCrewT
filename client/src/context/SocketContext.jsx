import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [activeSosAlert, setActiveSosAlert] = useState(null);
  const { user, workerProfile } = useAuth();

  useEffect(() => {
    // Connect to server (proxied to port 5000 in dev)
    const socketInstance = io('/', {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });

    socketInstance.on('connect', () => {
      console.log('[Socket] Connected to HomeCrew real-time server:', socketInstance.id);
      if (workerProfile?._id) {
        socketInstance.emit('join-worker', workerProfile._id);
      }
    });

    socketInstance.on('sos-alert-broadcast', (alertData) => {
      console.warn('[SOS Alert Received]:', alertData);
      setActiveSosAlert(alertData);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket && workerProfile?._id) {
      socket.emit('join-worker', workerProfile._id);
    }
  }, [socket, workerProfile]);

  const joinJob = (jobId) => {
    if (socket && jobId) {
      socket.emit('join-job', jobId);
    }
  };

  const leaveJob = (jobId) => {
    if (socket && jobId) {
      socket.emit('leave-job', jobId);
    }
  };

  const sendWorkerLocation = (data) => {
    if (socket) {
      socket.emit('worker-location', data);
    }
  };

  const triggerSosAlert = (data) => {
    if (socket) {
      socket.emit('sos-alert', data);
    }
  };

  const dismissSosAlert = () => {
    setActiveSosAlert(null);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        activeSosAlert,
        dismissSosAlert,
        joinJob,
        leaveJob,
        sendWorkerLocation,
        triggerSosAlert,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
