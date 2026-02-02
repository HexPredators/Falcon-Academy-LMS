import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [realTimeData, setRealTimeData] = useState({
    onlineUsers: 0,
    notifications: [],
    liveUpdates: {}
  });
  
  const { user, token } = useAuth();
  const { showNotification } = useNotification();

  useEffect(() => {
    if (user && token) {
      // Initialize socket connection
      const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling']
      });

      newSocket.on('connect', () => {
        console.log('🔌 Connected to real-time server');
        setIsConnected(true);
        
        // Authenticate socket with user data
        newSocket.emit('authenticate', {
          userId: user.id,
          role: user.role,
          gradeAccess: user.grade_access
        });
      });

      newSocket.on('disconnect', () => {
        console.log('❌ Disconnected from real-time server');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
      });

      // Real-time event handlers
      newSocket.on('new_assignment', (data) => {
        showNotification({
          type: 'info',
          title: 'New Assignment',
          message: `New assignment: ${data.title}`,
          action: {
            label: 'View',
            onClick: () => window.location.href = '/assignments'
          }
        });
        
        setRealTimeData(prev => ({
          ...prev,
          liveUpdates: {
            ...prev.liveUpdates,
            assignments: Date.now()
          }
        }));
      });

      newSocket.on('new_submission', (data) => {
        if (user.role === 'teacher') {
          showNotification({
            type: 'success',
            title: 'New Submission',
            message: `${data.studentName} submitted an assignment`,
            action: {
              label: 'Grade',
              onClick: () => window.location.href = `/assignments/grade/${data.assignmentId}`
            }
          });
        }
      });

      newSocket.on('grade_received', (data) => {
        showNotification({
          type: 'success',
          title: 'Grade Received',
          message: `You scored ${data.points}/${data.maxPoints} on an assignment`,
          action: {
            label: 'View',
            onClick: () => window.location.href = '/assignments'
          }
        });
      });

      newSocket.on('new_message', (data) => {
        showNotification({
          type: 'info',
          title: 'New Message',
          message: `From: ${data.from}`,
          action: {
            label: 'Read',
            onClick: () => window.location.href = '/messages'
          }
        });
      });

      newSocket.on('system_alert', (data) => {
        showNotification({
          type: 'warning',
          title: 'System Alert',
          message: data.message,
          duration: 10000
        });
      });

      newSocket.on('user_status_change', (data) => {
        setRealTimeData(prev => ({
          ...prev,
          onlineUsers: data.status === 'online' 
            ? prev.onlineUsers + 1 
            : Math.max(0, prev.onlineUsers - 1)
        }));
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user, token, showNotification]);

  const emitEvent = (event, data) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    }
  };

  const value = {
    socket,
    isConnected,
    realTimeData,
    emitEvent
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
export default SocketContext