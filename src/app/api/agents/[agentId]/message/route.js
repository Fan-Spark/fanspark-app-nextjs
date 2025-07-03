import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://agents-api.doodles.app';
const APP_ID = process.env.AGENTS_APP_ID;
const APP_SECRET = process.env.AGENTS_APP_SECRET;

export async function POST(request, { params }) {
  try {
    if (!APP_ID || !APP_SECRET) {
      console.error('Missing environment variables: AGENTS_APP_ID or AGENTS_APP_SECRET');
      return NextResponse.json({ 
        error: 'Server configuration error' 
      }, { status: 500 });
    }

    const { agentId } = await params;
    const body = await request.json();
    
    if (!body.text || !body.user) {
      return NextResponse.json({ 
        error: 'Missing required fields: text and user' 
      }, { status: 400 });
    }

    const response = await fetch(`${API_BASE_URL}/${agentId}/user/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-mini-app-id': APP_ID,
        'x-mini-app-secret': APP_SECRET
      },
      body: JSON.stringify({
        text: body.text,
        user: body.user
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ 
      error: 'Failed to send message' 
    }, { status: 500 });
  }
} 