// Use our secure backend API routes instead of calling external API directly

export class AgentsAPI {
  static async getAllAgents() {
    try {
      const response = await fetch('/api/agents', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.agents || [];
    } catch (error) {
      console.error('Error fetching agents:', error);
      throw error;
    }
  }

  static async getAgentById(agentId) {
    try {
      const response = await fetch(`/api/agents/${agentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching agent ${agentId}:`, error);
      throw error;
    }
  }

  static async sendMessage(agentId, message, user = 'user') {
    try {
      const response = await fetch(`/api/agents/${agentId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: message,
          user: user
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error sending message to agent ${agentId}:`, error);
      throw error;
    }
  }

  static async getMemories(agentId, offset = 0, limit = 10) {
    try {
      const url = new URL(`/api/agents/${agentId}/memories`, window.location.origin);
      url.searchParams.append('offset', offset.toString());
      url.searchParams.append('limit', limit.toString());

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching memories for agent ${agentId}:`, error);
      throw error;
    }
  }

  static async clearMemories(agentId) {
    try {
      const response = await fetch(`/api/agents/${agentId}/memories`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error clearing memories for agent ${agentId}:`, error);
      throw error;
    }
  }
} 