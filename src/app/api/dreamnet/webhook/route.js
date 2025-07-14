import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
  try {
    // Get webhook secret from environment
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
    
    if (!WEBHOOK_SECRET) {
      console.error('WEBHOOK_SECRET not configured');
      return NextResponse.json({ 
        error: 'Webhook secret not configured' 
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

    // Verify webhook signature if provided
    const signature = request.headers.get('x-signature');
    if (signature) {
      const expectedSignature = crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(body)
        .digest('hex');
      
      // Handle both formats: raw signature and sha256= prefix
      const receivedSignature = signature.startsWith('sha256=') 
        ? signature.substring(7) 
        : signature;
      
      if (receivedSignature !== expectedSignature) {
        console.error('Invalid webhook signature');
        return NextResponse.json({ 
          error: 'Invalid signature' 
        }, { status: 401 });
      }
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