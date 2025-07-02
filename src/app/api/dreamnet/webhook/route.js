import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Get the request body
    const body = await request.text();
    let parsedBody;
    
    try {
      parsedBody = JSON.parse(body);
    } catch (error) {
      return NextResponse.json({ 
        error: 'Invalid JSON payload' 
      }, { status: 400 });
    }

    // Validate required fields
    if (!parsedBody.eventType) {
      return NextResponse.json({ 
        error: 'Missing eventType in request body' 
      }, { status: 400 });
    }

    // Process the webhook based on eventType
    console.log('Received webhook:', {
      eventType: parsedBody.eventType,
      timestamp: new Date().toISOString(),
      body: parsedBody
    });

    // Handle different event types
    switch (parsedBody.eventType) {
      case 'request':
        // Handle request event
        return NextResponse.json({ 
          success: true,
          message: 'Request event processed successfully',
          eventType: parsedBody.eventType,
          timestamp: new Date().toISOString()
        });
        
      default:
        // Handle unknown event types
        return NextResponse.json({ 
          success: true,
          message: `Event type '${parsedBody.eventType}' received and logged`,
          eventType: parsedBody.eventType,
          timestamp: new Date().toISOString()
        });
    }

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// Optionally handle GET requests for testing
export async function GET() {
  return NextResponse.json({ 
    message: 'Dreamnet webhook endpoint is active',
    method: 'POST',
    body: { eventType: 'string' }
  });
} 