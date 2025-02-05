import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const WebSocketContext = createContext();

const SERVER_URL = 'http://localhost:5000'; // Replace with your backend URL

const socket = io(SERVER_URL, {
  autoConnect: false, // Prevent auto connect
  transports: ['websocket'], // Use WebSocket transport
});

export const WebSocketProvider = ({ children }) => {
  const [connected, setConnected] = useState(socket.connected);

  useEffect(() => {
    // Manually connect the socket when the provider is mounted
    socket.connect();

    // Listen for socket connection and disconnection
    socket.on('connect', () => {
      console.log('✅ Connected to WebSocket server:', socket.id);
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from WebSocket server');
      setConnected(false);
    });

    // Cleanup on unmount
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket, connected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to use the WebSocket context
export const useWebSocket = () => useContext(WebSocketContext);
