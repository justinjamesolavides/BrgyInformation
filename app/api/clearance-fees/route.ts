import { NextResponse } from 'next/server';

// In-memory storage (would be replaced with database in production)
let clearanceFees = {
  residency: 50,
  business: 100,
  employment: 75,
  indigency: 25,
  certification: 30,
  seniorCitizen: 10,
  pwd: 10
};

let feeHistory = [
  { 
    id: 1,
    date: new Date().toISOString(),
    type: "residency", 
    oldFee: 40, 
    newFee: 50, 
    changedBy: "System",
    changedById: 1
  }
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        fees: clearanceFees,
        history: feeHistory.slice(0, 10) // Last 10 changes
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clearance fees' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { type, newFee, changedBy, changedById } = await request.json();
    
    if (!type || newFee === undefined) {
      return NextResponse.json(
        { success: false, error: 'Type and new fee are required' },
        { status: 400 }
      );
    }

    const oldFee = clearanceFees[type as keyof typeof clearanceFees];
    
    // Update the fee
    clearanceFees[type as keyof typeof clearanceFees] = newFee;

    // Add to history
    feeHistory.unshift({
      id: feeHistory.length + 1,
      date: new Date().toISOString(),
      type,
      oldFee,
      newFee,
      changedBy: changedBy || 'Admin',
      changedById: changedById || 1
    });

    // Keep only last 50 history entries
    if (feeHistory.length > 50) {
      feeHistory = feeHistory.slice(0, 50);
    }

    // Broadcast update to all connected clients
    broadcastFeeUpdate({ type, oldFee, newFee, changedBy, changedById });

    return NextResponse.json({
      success: true,
      data: {
        fees: clearanceFees,
        message: 'Fee updated successfully'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update clearance fee' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { fees, changedBy, changedById } = await request.json();
    
    if (!fees) {
      return NextResponse.json(
        { success: false, error: 'Fees data is required' },
        { status: 400 }
      );
    }

    const oldFees = { ...clearanceFees };
    const changes = [];

    // Update all fees
    for (const [type, newFee] of Object.entries(fees)) {
      if (clearanceFees.hasOwnProperty(type)) {
        const oldFee = clearanceFees[type as keyof typeof clearanceFees];
        if (oldFee !== newFee) {
          clearanceFees[type as keyof typeof clearanceFees] = newFee as number;
          changes.push({ type, oldFee, newFee });
        }
      }
    }

    // Add to history for each change
    changes.forEach(change => {
      feeHistory.unshift({
        id: feeHistory.length + 1,
        date: new Date().toISOString(),
        type: change.type,
        oldFee: change.oldFee,
        newFee: change.newFee,
        changedBy: changedBy || 'Admin',
        changedById: changedById || 1
      });
    });

    // Keep only last 50 history entries
    if (feeHistory.length > 50) {
      feeHistory = feeHistory.slice(0, 50);
    }

    // Broadcast updates
    changes.forEach(change => {
      broadcastFeeUpdate({
        type: change.type,
        oldFee: change.oldFee,
        newFee: change.newFee,
        changedBy,
        changedById
      });
    });

    return NextResponse.json({
      success: true,
      data: {
        fees: clearanceFees,
        message: 'All fees updated successfully'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update clearance fees' },
      { status: 500 }
    );
  }
}

// Function to broadcast fee updates (would integrate with WebSocket service)
function broadcastFeeUpdate(update: any) {
  // In a real implementation, this would broadcast to WebSocket clients
  console.log('Broadcasting fee update:', update);
  
  // For now, we'll just log it
  // In production, you'd use something like:
  // WebSocketService.broadcast('fee_update', update);
}