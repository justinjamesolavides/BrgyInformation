import { NextRequest } from 'next/server';

// Store active WebSocket connections
let activeConnections: Set<WebSocket> = new Set();

export async function GET(request: NextRequest) {
  // Upgrade the request to a WebSocket connection
  const upgradeHeader = request.headers.get('upgrade');
  
  if (upgradeHeader !== 'websocket') {
    return new Response('Expected Upgrade: websocket', { status: 426 });
  }

  // Create a new WebSocket pair
  const webSocketPair = new WebSocketPair();
  const [client, server] = Object.values(webSocketPair);

  // Handle the WebSocket on the server side
  server.accept();
  
  // Add this connection to our active connections
  activeConnections.add(server);
  
  // Handle incoming messages
  server.addEventListener('message', (event) => {
    // Broadcast the message to all other connected clients
    const message = JSON.parse(event.data.toString());
    
    activeConnections.forEach((conn) => {
      if (conn !== server && conn.readyState === WebSocket.OPEN) {
        conn.send(JSON.stringify(message));
      }
    });
  });

  // Remove the connection when it closes
  server.addEventListener('close', () => {
    activeConnections.delete(server);
  });

  // Handle errors
  server.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
    activeConnections.delete(server);
  });

  // Return the client WebSocket
  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}

export async function POST(request: NextRequest) {
  // Handle sending messages to all connected clients
  const { type, resident } = await request.json();
  
  // Broadcast the message to all connected clients
  const message = JSON.stringify({ type, resident });
  
  activeConnections.forEach((conn) => {
    if (conn.readyState === WebSocket.OPEN) {
      conn.send(message);
    }
  });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}