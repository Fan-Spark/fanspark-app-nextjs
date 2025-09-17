import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://agents-api.doodles.app';
const APP_ID = process.env.AGENTS_APP_ID;
const APP_SECRET = process.env.AGENTS_APP_SECRET;

// Mapping from original agent IDs to new Fanspark agent data
const AGENT_MAPPING = {
  'af5504a3-406e-0064-8ebb-22b7c1fca166': {
    name: 'Kai Stellar',
    avatar: '/character/Kai.png',
    bio: 'A plucky 12-year-old Martian youth whose boundless curiosity and stubborn optimism drive him forward. Though still growing into his newfound cosmic powers, his fierce determination and loyalty make him a natural leader and friend.'
  },
  'b91b282c-b14a-0c3b-89da-bc535285117a': {
    name: 'Aqualis',
    avatar: '/character/Aqualis.png',
    bio: 'Playful and adaptable, Aqualis is the Water & Adaptability spirit who dances between roles of trickster and strategist. Her quick wit and fluid fighting style keep enemies, and teammates, on their toes.'
  },
  'c31ed031-8e65-0d9f-9c4c-fa22bf3ac89a': {
    name: 'Soluna',
    avatar: '/character/Soluna.png',
    bio: 'The gentle embodiment of Light & Hope, Soluna is a compassionate guide who lifts the team\'s spirits when doubt creeps in. Calm and empathetic, she channels her radiant energy to heal wounds, both physical and emotional.'
  },
  '89b30336-e318-00ba-89d5-392b23085f7b': {
    name: 'Terranox',
    avatar: '/character/Terranox.png',
    bio: 'A towering guardian of Earth & Endurance, Terranox combines rough-hewn strength with a warm, steady heart. Though her granite exterior and booming laugh can be intimidating, she\'s fiercely protective and unfailingly patient.'
  }
};

function transformAgentData(agents) {
  return agents.map(agent => {
    const mappedAgent = AGENT_MAPPING[agent.id];
    if (mappedAgent) {
      return {
        ...agent,
        name: mappedAgent.name,
        avatar: mappedAgent.avatar,
        // Use the custom bio if available, otherwise keep original with replacements
        bio: mappedAgent.bio || agent.bio
          .replace(/Doodleverse/gi, 'Fanspark Universe')
          .replace(/doodle/gi, 'Fanspark')
          .replace(/Deysi the Verdant Vibe/gi, 'Kai')
          .replace(/Doug Hermlin/gi, 'Aqualis')
          .replace(/Maxine Klintz/gi, 'Soluna')
          .replace(/Kyle the Keeper/gi, 'Terranox')
      };
    }
    return agent;
  });
}

export async function GET() {
  try {
    // Backend API is not working, using static data instead
    // const response = await fetch(`${API_BASE_URL}/agents`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   cache: 'no-store'
    // });

    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }

    // const data = await response.json();
    
    // Return static agent data instead of API call
    const staticData = {
      agents: Object.values(AGENT_MAPPING).map((agent, index) => ({
        id: `static-agent-${index}`,
        name: agent.name,
        avatar: agent.avatar,
        bio: agent.bio,
        universe: 'Stellar Universe',
        isComingSoon: false
      }))
    };
    
    return NextResponse.json(staticData);
  } catch (error) {
    console.error('Error with static agents data:', error);
    return NextResponse.json({ 
      error: 'Failed to load agents data' 
    }, { status: 500 });
  }
} 