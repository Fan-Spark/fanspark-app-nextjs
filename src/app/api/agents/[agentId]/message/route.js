import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://agents-api.doodles.app';
const APP_ID = process.env.AGENTS_APP_ID;
const APP_SECRET = process.env.AGENTS_APP_SECRET;

// Mapping from original agent IDs to new Fanspark agent names
const AGENT_NAME_MAPPING = {
  'af5504a3-406e-0064-8ebb-22b7c1fca166': 'Kai',
  'b91b282c-b14a-0c3b-89da-bc535285117a': 'Aqualis',
  'c31ed031-8e65-0d9f-9c4c-fa22bf3ac89a': 'Soluna',
  '89b30336-e318-00ba-89d5-392b23085f7b': 'Terranox'
};

function transformMessageContent(text, agentId) {
  let transformedText = text;
  
  // Replace doodleverse references
  transformedText = transformedText.replace(/Doodleverse/gi, 'Fanspark Universe');
  transformedText = transformedText.replace(/doodle/gi, 'Fanspark');
  
  // Replace old agent names with new ones
  transformedText = transformedText.replace(/Deysi the Verdant Vibe/gi, 'Kai');
  transformedText = transformedText.replace(/Doug Hermlin/gi, 'Aqualis');
  transformedText = transformedText.replace(/Maxine Klintz/gi, 'Soluna');
  transformedText = transformedText.replace(/Kyle the Keeper/gi, 'Terranox');
  
  // Replace any references to the current agent's old name with new name
  const newAgentName = AGENT_NAME_MAPPING[agentId];
  if (newAgentName) {
    // Use the agent's new name when referring to themselves
    if (agentId === 'af5504a3-406e-0064-8ebb-22b7c1fca166') {
      transformedText = transformedText.replace(/Deysi/gi, newAgentName);
    } else if (agentId === 'b91b282c-b14a-0c3b-89da-bc535285117a') {
      transformedText = transformedText.replace(/Doug/gi, newAgentName);
    } else if (agentId === 'c31ed031-8e65-0d9f-9c4c-fa22bf3ac89a') {
      transformedText = transformedText.replace(/Maxine/gi, newAgentName);
    } else if (agentId === '89b30336-e318-00ba-89d5-392b23085f7b') {
      transformedText = transformedText.replace(/Kyle/gi, newAgentName);
    }
  }
  
  return transformedText;
}

function transformMessageResponse(data, agentId) {
  if (Array.isArray(data)) {
    return data.map(message => ({
      ...message,
      text: message.text ? transformMessageContent(message.text, agentId) : message.text
    }));
  } else if (data.text) {
    return {
      ...data,
      text: transformMessageContent(data.text, agentId)
    };
  } else if (data.response) {
    return {
      ...data,
      response: transformMessageContent(data.response, agentId)
    };
  } else if (data.message) {
    return {
      ...data,
      message: transformMessageContent(data.message, agentId)
    };
  }
  return data;
}

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
    
    // Transform the message response to use new agent names and branding
    const transformedData = transformMessageResponse(data, agentId);
    
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ 
      error: 'Failed to send message' 
    }, { status: 500 });
  }
} 