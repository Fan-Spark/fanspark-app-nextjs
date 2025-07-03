const API_BASE_URL = 'https://agents-api.doodles.app';
const APP_ID = '10e616f3-12b3-4fa2-aa96-dad28678c43c';
const APP_SECRET = 'N3WFaxTLyOQupEKv+TM7D9wtPhgryoFSo3V1Yy/AY90=';

// Test function to get all agents (public endpoint)
async function getAllAgents() {
  try {
    console.log('🔍 Fetching all agents...');
    const response = await fetch(`${API_BASE_URL}/agents`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const agents = await response.json();
    console.log('✅ All agents:', JSON.stringify(agents, null, 2));
    return agents;
  } catch (error) {
    console.error('❌ Error fetching agents:', error);
    return null;
  }
}

// Test function to get a specific agent (public endpoint)
async function getAgentById(agentId) {
  try {
    console.log(`🔍 Fetching agent ${agentId}...`);
    const response = await fetch(`${API_BASE_URL}/agents/${agentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const agent = await response.json();
    console.log(`✅ Agent ${agentId}:`, JSON.stringify(agent, null, 2));
    return agent;
  } catch (error) {
    console.error(`❌ Error fetching agent ${agentId}:`, error);
    return null;
  }
}

// Test function to send a message to an agent (authenticated endpoint)
async function sendMessageToAgent(agentId, message, user = 'user') {
  try {
    console.log(`💬 Sending message to agent ${agentId}: "${message}"`);
    const response = await fetch(`${API_BASE_URL}/${agentId}/user/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-mini-app-id': APP_ID,
        'x-mini-app-secret': APP_SECRET
      },
      body: JSON.stringify({
        text: message,
        user: user
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const agentResponse = await response.json();
    console.log(`✅ Agent response:`, JSON.stringify(agentResponse, null, 2));
    return agentResponse;
  } catch (error) {
    console.error(`❌ Error sending message to agent ${agentId}:`, error);
    return null;
  }
}

// Test function to get agent memories (authenticated endpoint)
async function getAgentMemories(agentId, offset = 0, limit = 10) {
  try {
    console.log(`🧠 Fetching memories for agent ${agentId}...`);
    const url = new URL(`${API_BASE_URL}/agents/${agentId}/memories`);
    url.searchParams.append('offset', offset.toString());
    url.searchParams.append('limit', limit.toString());

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

    const memories = await response.json();
    console.log(`✅ Agent memories:`, JSON.stringify(memories, null, 2));
    return memories;
  } catch (error) {
    console.error(`❌ Error fetching memories for agent ${agentId}:`, error);
    return null;
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting Agents API Tests\n');

  // Test 1: Get all agents
  const agents = await getAllAgents();
  console.log('\n' + '='.repeat(50) + '\n');

  if (agents && agents.length > 0) {
    // Test 2: Get first agent details
    const firstAgent = agents[0];
    const agentId = firstAgent.id || firstAgent.agentId || Object.keys(firstAgent)[0];
    
    if (agentId) {
      await getAgentById(agentId);
      console.log('\n' + '='.repeat(50) + '\n');

      // Test 3: Send a test message
      await sendMessageToAgent(agentId, 'Hello! This is a test message.');
      console.log('\n' + '='.repeat(50) + '\n');

      // Test 4: Get memories
      await getAgentMemories(agentId);
    }
  }

  console.log('\n✨ API Tests Complete!');
}

// Run the tests
runTests().catch(console.error); 