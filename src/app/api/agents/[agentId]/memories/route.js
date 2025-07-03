import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://agents-api.doodles.app';
const APP_ID = process.env.AGENTS_APP_ID;
const APP_SECRET = process.env.AGENTS_APP_SECRET;

export async function GET(request, { params }) {
  try {
    if (!APP_ID || !APP_SECRET) {
      console.error('Missing environment variables: AGENTS_APP_ID or AGENTS_APP_SECRET');
      return NextResponse.json({ 
        error: 'Server configuration error' 
      }, { status: 500 });
    }

    const { agentId } = await params;
    const { searchParams } = new URL(request.url);
    const offset = searchParams.get('offset') || '0';
    const limit = searchParams.get('limit') || '10';

    const url = new URL(`${API_BASE_URL}/agents/${agentId}/memories`);
    url.searchParams.append('offset', offset);
    url.searchParams.append('limit', limit);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-mini-app-id': APP_ID,
        'x-mini-app-secret': APP_SECRET
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching memories:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch memories' 
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!APP_ID || !APP_SECRET) {
      console.error('Missing environment variables: AGENTS_APP_ID or AGENTS_APP_SECRET');
      return NextResponse.json({ 
        error: 'Server configuration error' 
      }, { status: 500 });
    }

    const { agentId } = await params;

    const response = await fetch(`${API_BASE_URL}/agents/${agentId}/memories`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-mini-app-id': APP_ID,
        'x-mini-app-secret': APP_SECRET
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error clearing memories:', error);
    return NextResponse.json({ 
      error: 'Failed to clear memories' 
    }, { status: 500 });
  }
} 