"use client";

import React, { useState, useEffect } from 'react';

const WebSocketTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [messages, setMessages] = useState<string[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const addMessage = (message: string) => {
    setMessages(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const connectWebSocket = () => {
    // Create environment-aware WebSocket URL
    const getWebSocketUrl = () => {
      if (typeof window === 'undefined') return '';
      
      const { protocol, hostname, port } = window.location;
      const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:';
      const wsPort = port ? `:${port}` : '';
      
      return `${wsProtocol}//${hostname}${wsPort}/api/notifications/ws`;
    };
    
    const wsUrl = getWebSocketUrl();
    addMessage(`Attempting connection to: ${wsUrl}`);
    
    const websocket = new WebSocket(wsUrl);
    
    websocket.onopen = () => {
      setConnectionStatus('connected');
      addMessage('WebSocket connected successfully!');
      setWs(websocket);
      
      // Send subscription message
      websocket.send(JSON.stringify({
        type: 'subscribe',
        userId: 1
      }));
    };
    
    websocket.onmessage = (event) => {
      addMessage(`Received: ${event.data}`);
    };
    
    websocket.onerror = (error) => {
      setConnectionStatus('error');
      addMessage(`WebSocket error: ${JSON.stringify(error)}`);
    };
    
    websocket.onclose = () => {
      setConnectionStatus('disconnected');
      addMessage('WebSocket disconnected');
    };
  };

  const disconnectWebSocket = () => {
    if (ws) {
      ws.close();
      setWs(null);
    }
  };

  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const testMessage = JSON.stringify({
        type: 'test',
        message: 'Hello from test client'
      });
      ws.send(testMessage);
      addMessage(`Sent: ${testMessage}`);
    } else {
      addMessage('WebSocket not connected');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">WebSocket Connection Test</h1>
        
        {/* Connection Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' :
              connectionStatus === 'error' ? 'bg-red-500' :
              'bg-gray-500'
            }`}></div>
            <span className="text-gray-700 capitalize">{connectionStatus}</span>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={connectWebSocket}
              disabled={connectionStatus === 'connected'}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Connect
            </button>
            <button
              onClick={disconnectWebSocket}
              disabled={connectionStatus !== 'connected'}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              Disconnect
            </button>
            <button
              onClick={sendMessage}
              disabled={connectionStatus !== 'connected'}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              Send Test Message
            </button>
          </div>
        </div>

        {/* Messages Log */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Connection Log</h2>
          <div className="h-96 overflow-y-auto bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            {messages.length === 0 ? (
              <div className="text-gray-500">No messages yet. Click "Connect" to start.</div>
            ) : (
              <div className="space-y-1">
                {messages.map((msg, index) => (
                  <div key={index}>{msg}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebSocketTest;