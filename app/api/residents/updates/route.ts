import { NextRequest } from 'next/server';

// Store for real-time updates
const subscribers: { id: string; response: ResponseInit }[] = [];

export async function GET(request: NextRequest) {
  // Create a new stream for real-time updates
  const stream = new ReadableStream({
    start(controller) {
      // Generate a unique ID for this subscriber
      const id = `subscriber-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Send initial event to establish connection
      controller.enqueue(`data: {"type":"connected","id":"${id}"}\n\n`);
      
      // Store the controller to send future updates
      const subscriber = {
        id,
        controller,
        response: request,
      };
      
      // Cleanup when connection closes
      const cleanup = () => {
        const index = subscribers.findIndex(sub => sub.id === id);
        if (index !== -1) {
          subscribers.splice(index, 1);
        }
      };

      // Handle connection interruption
      request.signal.addEventListener('abort', cleanup);
    },
    cancel() {
      // Cleanup when stream is cancelled
    }
  });

  return new Response(stream, {
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
    }
  });
}

// Handle sending updates
export async function POST(request: NextRequest) {
  const { type, resident } = await request.json();
  
  // In a real implementation, this would broadcast to all connected staff members
  // For now, we'll just return success to confirm the update was received
  
  // Log the update for debugging
  console.log(`Broadcasting update: ${type}`, { resident });
  
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}