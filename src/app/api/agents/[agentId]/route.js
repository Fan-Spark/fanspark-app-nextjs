import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://agents-api.doodles.app';
const APP_ID = process.env.AGENTS_APP_ID;
const APP_SECRET = process.env.AGENTS_APP_SECRET;

// Mapping from original agent IDs to new Fanspark agent data
const AGENT_MAPPING = {
  'af5504a3-406e-0064-8ebb-22b7c1fca166': {
    name: 'Kai',
    avatar: '/character/Kai.png'
  },
  'b91b282c-b14a-0c3b-89da-bc535285117a': {
    name: 'Aqualis',
    avatar: '/character/Aqualis.png'
  },
  'c31ed031-8e65-0d9f-9c4c-fa22bf3ac89a': {
    name: 'Soluna',
    avatar: '/character/Soluna.png'
  },
  '89b30336-e318-00ba-89d5-392b23085f7b': {
    name: 'Terranox',
    avatar: '/character/Terranox.png'
  }
};

function transformAgentData(agent) {
  const mappedAgent = AGENT_MAPPING[agent.id];
  if (mappedAgent) {
    return {
      ...agent,
      name: mappedAgent.name,
      avatar: mappedAgent.avatar,
      // Update bio to remove doodleverse references and use new names
      bio: agent.bio
        .replace(/Doodleverse/gi, 'Fanspark Universe')
        .replace(/doodle/gi, 'Fanspark')
        .replace(/Deysi the Verdant Vibe/gi, 'Kai')
        .replace(/Doug Hermlin/gi, 'Aqualis')
        .replace(/Maxine Klintz/gi, 'Soluna')
        .replace(/Kyle the Keeper/gi, 'Terranox')
    };
  }
  return agent;
}

export async function GET(request, { params }) {
  try {
    if (!APP_ID || !APP_SECRET) {
      console.error('Missing environment variables: AGENTS_APP_ID or AGENTS_APP_SECRET');
      return NextResponse.json({ 
        error: 'Server configuration error' 
      }, { status: 500 });
    }

    const { agentId } = await params;

    const response = await fetch(`${API_BASE_URL}/agents/${agentId}`, {
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
    
    // Transform the agent data with new names and avatars
    const transformedData = transformAgentData(data);
    
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching agent:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch agent' 
    }, { status: 500 });
  }
} 