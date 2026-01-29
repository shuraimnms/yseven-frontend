import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';
import Cookies from 'js-cookie';

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

interface UseWebSocketOptions {
  url?: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const {
    url = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'https://yseven-backend.onrender.com',
    reconnectInterval = 5000,
    maxReconnectAttempts = 5,
    onMessage,
    onConnect,
    onDisconnect,
    onError
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  
  const socket = useRef<Socket | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const { isAuthenticated, user } = useAuthStore();

  const connect = () => {
    if (!isAuthenticated || !user) {
      console.log('Socket.IO: Not authenticated, skipping connection');
      return;
    }

    if (user.role !== 'admin') {
      console.log('Socket.IO: User is not admin, skipping connection');
      return;
    }

    try {
      setConnectionStatus('connecting');
      console.log('Socket.IO: Connecting to', url);

      // Get token from cookies
      const token = Cookies.get('accessToken');
      
      console.log('Socket.IO: Token for auth:', !!token);
      
      socket.current = io(url, {
        auth: {
          token: token
        },
        extraHeaders: token ? {
          'Authorization': `Bearer ${token}`
        } : {},
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true
      });

      socket.current.on('connect', () => {
        console.log('Socket.IO: Connected successfully');
        setIsConnected(true);
        setConnectionStatus('connected');
        reconnectAttempts.current = 0;
        
        // Subscribe to dashboard updates
        socket.current?.emit('subscribe_dashboard');
        
        onConnect?.();
      });

      socket.current.on('connected', (data) => {
        console.log('Socket.IO: Server confirmed connection:', data);
      });

      socket.current.on('subscribed', (data) => {
        console.log('Socket.IO: Subscribed to dashboard updates:', data);
      });

      socket.current.on('dashboard_update', (message: WebSocketMessage) => {
        console.log('Socket.IO: Dashboard update received', message);
        setLastMessage(message);
        onMessage?.(message);
      });

      socket.current.on('new_order', (message: WebSocketMessage) => {
        console.log('Socket.IO: New order notification', message);
        setLastMessage(message);
        onMessage?.(message);
      });

      socket.current.on('low_stock_alert', (message: WebSocketMessage) => {
        console.log('Socket.IO: Low stock alert', message);
        setLastMessage(message);
        onMessage?.(message);
      });

      socket.current.on('payment_received', (message: WebSocketMessage) => {
        console.log('Socket.IO: Payment received', message);
        setLastMessage(message);
        onMessage?.(message);
      });

      socket.current.on('disconnect', (reason) => {
        console.log('Socket.IO: Disconnected:', reason);
        setIsConnected(false);
        setConnectionStatus('disconnected');
        onDisconnect?.();
        
        // Attempt to reconnect
        if (reconnectAttempts.current < maxReconnectAttempts && reason !== 'io client disconnect') {
          reconnectAttempts.current++;
          console.log(`Socket.IO: Reconnecting... Attempt ${reconnectAttempts.current}`);
          
          reconnectTimeout.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        } else {
          console.log('Socket.IO: Max reconnection attempts reached or manual disconnect');
          setConnectionStatus('error');
        }
      });

      socket.current.on('connect_error', (error) => {
        console.error('Socket.IO: Connection error', error);
        setConnectionStatus('error');
        setIsConnected(false);
        onError?.(error as any);
        
        // Attempt to reconnect on connection error
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          console.log(`Socket.IO: Reconnecting after error... Attempt ${reconnectAttempts.current}`);
          
          reconnectTimeout.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      });

    } catch (error) {
      console.error('Socket.IO: Connection failed', error);
      setConnectionStatus('error');
    }
  };

  const disconnect = () => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
    }
    
    if (socket.current) {
      socket.current.disconnect();
      socket.current = null;
    }
    
    setIsConnected(false);
    setConnectionStatus('disconnected');
  };

  const sendMessage = (type: string, data: any) => {
    if (socket.current && isConnected) {
      const message = {
        type,
        data,
        timestamp: new Date().toISOString()
      };
      
      socket.current.emit(type, message);
      return true;
    }
    
    console.warn('Socket.IO: Cannot send message, not connected');
    return false;
  };

  useEffect(() => {
    // Temporarily disable WebSocket to focus on API fixes
    // if (isAuthenticated && user?.role === 'admin') {
    //   connect();
    // } else {
    //   disconnect();
    // }

    return () => {
      disconnect();
    };
  }, [isAuthenticated, user]);

  return {
    isConnected,
    connectionStatus,
    lastMessage,
    sendMessage,
    connect,
    disconnect
  };
};

// Hook for admin dashboard real-time updates
export const useAdminWebSocket = () => {
  const [dashboardUpdates, setDashboardUpdates] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  const handleMessage = (message: WebSocketMessage) => {
    switch (message.type) {
      case 'dashboard_update':
        setDashboardUpdates(message.data);
        break;
      case 'new_order':
        setNotifications(prev => [...prev, {
          id: Date.now(),
          type: 'order',
          message: `New order received: ${message.data.orderId}`,
          timestamp: message.timestamp
        }]);
        break;
      case 'low_stock_alert':
        setNotifications(prev => [...prev, {
          id: Date.now(),
          type: 'inventory',
          message: `Low stock alert: ${message.data.productName} (${message.data.stock} remaining)`,
          timestamp: message.timestamp
        }]);
        break;
      case 'payment_received':
        setNotifications(prev => [...prev, {
          id: Date.now(),
          type: 'payment',
          message: `Payment received: ₹${message.data.amount} for order ${message.data.orderId}`,
          timestamp: message.timestamp
        }]);
        break;
    }
  };

  const { isConnected, connectionStatus, sendMessage } = useWebSocket({
    onMessage: handleMessage,
    onConnect: () => {
      console.log('Admin WebSocket: Connected to real-time updates');
    },
    onDisconnect: () => {
      console.log('Admin WebSocket: Disconnected from real-time updates');
    }
  });

  const clearNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return {
    isConnected,
    connectionStatus,
    dashboardUpdates,
    notifications,
    clearNotification,
    clearAllNotifications,
    sendMessage
  };
};