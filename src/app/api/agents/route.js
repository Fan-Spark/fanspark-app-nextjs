import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://agents-api.doodles.app';
const APP_ID = process.env.AGENTS_APP_ID;
const APP_SECRET = process.env.AGENTS_APP_SECRET;

export async function GET() {
  try {
    if (!APP_ID || !APP_SECRET) {
      console.error('Missing environment variables: AGENTS_APP_ID or AGENTS_APP_SECRET');
      return NextResponse.json({ 
        error: 'Server configuration error' 
      }, { status: 500 });
    }

    const response = await fetch(`${API_BASE_URL}/agents`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch agents' 
    }, { status: 500 });
  }
} 