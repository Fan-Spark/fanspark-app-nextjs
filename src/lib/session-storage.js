// Simple UUID generator
const generateId = () => {
  return 'xxxx-xxxx-4xxx-yxxx-xxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Cookie utilities
export const CookieManager = {
  set: (name, value, days = 30) => {
    if (typeof window === 'undefined') return;
    
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  },

  get: (name) => {
    if (typeof window === 'undefined') return null;
    
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },

  delete: (name) => {
    if (typeof window === 'undefined') return;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
};

// Session management
export const SessionManager = {
  SESSION_KEY: 'fanspark_chat_session',
  USER_KEY: 'fanspark_chat_user',

  // Get or create user session
  getOrCreateSession: () => {
    let sessionId = CookieManager.get(SessionManager.SESSION_KEY);
    let userId = CookieManager.get(SessionManager.USER_KEY);

    if (!sessionId) {
      sessionId = generateId();
      CookieManager.set(SessionManager.SESSION_KEY, sessionId, 365); // 1 year
    }

    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      CookieManager.set(SessionManager.USER_KEY, userId, 365); // 1 year
    }

    return { sessionId, userId };
  },

  // Clear session
  clearSession: () => {
    CookieManager.delete(SessionManager.SESSION_KEY);
    CookieManager.delete(SessionManager.USER_KEY);
    localStorage.clear();
  },

  // Get current user ID
  getUserId: () => {
    return CookieManager.get(SessionManager.USER_KEY);
  }
};

// Chat history management with localStorage
export const ChatHistoryManager = {
  // Get storage key for agent chat
  getStorageKey: (agentId, userId) => {
    return `fanspark_chat_${userId}_${agentId}`;
  },

  // Save chat messages to localStorage
  saveMessages: (agentId, messages, userId) => {
    if (typeof window === 'undefined') return;
    
    try {
      const key = ChatHistoryManager.getStorageKey(agentId, userId);
      const chatData = {
        messages,
        lastUpdated: new Date().toISOString(),
        agentId,
        userId
      };
      localStorage.setItem(key, JSON.stringify(chatData));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  },

  // Load chat messages from localStorage
  loadMessages: (agentId, userId) => {
    if (typeof window === 'undefined') return [];
    
    try {
      const key = ChatHistoryManager.getStorageKey(agentId, userId);
      const stored = localStorage.getItem(key);
      if (stored) {
        const chatData = JSON.parse(stored);
        return chatData.messages || [];
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
    return [];
  },

  // Clear messages for specific agent
  clearMessages: (agentId, userId) => {
    if (typeof window === 'undefined') return;
    
    try {
      const key = ChatHistoryManager.getStorageKey(agentId, userId);
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  },

  // Get all chat sessions for a user
  getAllChatSessions: (userId) => {
    if (typeof window === 'undefined') return {};
    
    const sessions = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`fanspark_chat_${userId}_`)) {
          const agentId = key.replace(`fanspark_chat_${userId}_`, '');
          const stored = localStorage.getItem(key);
          if (stored) {
            const chatData = JSON.parse(stored);
            sessions[agentId] = {
              messages: chatData.messages || [],
              lastUpdated: chatData.lastUpdated,
              messageCount: (chatData.messages || []).length
            };
          }
        }
      }
    } catch (error) {
      console.error('Error getting chat sessions:', error);
    }
    return sessions;
  },

  // Clear all chat history for user
  clearAllMessages: (userId) => {
    if (typeof window === 'undefined') return;
    
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`fanspark_chat_${userId}_`)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing all chat history:', error);
    }
  }
};

// Server sync utilities
export const ServerSyncManager = {
  // Sync local messages with server memories
  syncWithServer: async (agentId, userId, localMessages, agentsAPI) => {
    try {
      // Get server memories
      const serverMemories = await agentsAPI.getMemories(agentId, 0, 50);
      
      // For now, we'll prioritize local storage
      // In a full implementation, you might want to merge or resolve conflicts
      return localMessages;
    } catch (error) {
      console.error('Error syncing with server:', error);
      return localMessages;
    }
  },

  // Clear server memories and local storage
  clearServerAndLocal: async (agentId, userId, agentsAPI) => {
    try {
      // Clear server memories
      await agentsAPI.clearMemories(agentId);
      
      // Clear local storage
      ChatHistoryManager.clearMessages(agentId, userId);
      
      return true;
    } catch (error) {
      console.error('Error clearing server and local chat:', error);
      return false;
    }
  }
}; 