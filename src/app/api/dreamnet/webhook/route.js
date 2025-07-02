import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Get the signature from headers
    const signature = request.headers.get('x-signature');
    console.log('signature', signature);
    
    if (!signature) {
      return NextResponse.json({ 
        error: 'Missing x-signature header' 
      }, { status: 401 });
    }

    // Get the webhook secret from environment variables
    const webhookSecret = process.env.WEBHOOK_SECRET;
    console.log('webhookSecret', webhookSecret);
    
    if (!webhookSecret) {
      console.error('WEBHOOK_SECRET environment variable is not set');
      return NextResponse.json({ 
        error: 'Server configuration error' 
      }, { status: 500 });
    }

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

    // Direct comparison with the webhook secret
    const isValidSignature = signature === webhookSecret;

    if (!isValidSignature) {
      return NextResponse.json({ 
        error: 'Invalid signature' 
      }, { status: 401 });
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
    headers: ['x-signature'],
    body: { eventType: 'string' }
  });
} 