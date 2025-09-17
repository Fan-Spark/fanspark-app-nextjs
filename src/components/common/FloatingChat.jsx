'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Trash2, ChevronLeft, Bot, User, Sparkles } from 'lucide-react';
import { AgentsAPI } from '@/lib/agents-api';
import { toast } from 'sonner';
import { SessionManager, ChatHistoryManager, ServerSyncManager } from '@/lib/session-storage';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState('agents'); // 'agents' | 'chat'
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [userSession, setUserSession] = useState(null);
  const messagesEndRef = useRef(null);
  const chatWidgetRef = useRef(null);
  const chatButtonRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages]);

  // Close chat when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking on the chat button or chat widget
      const isClickingButton = chatButtonRef.current && chatButtonRef.current.contains(event.target);
      const isClickingWidget = chatWidgetRef.current && chatWidgetRef.current.contains(event.target);
      
      if (!isClickingButton && !isClickingWidget && isOpen) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  // Initialize user session
  useEffect(() => {
    const session = SessionManager.getOrCreateSession();
    setUserSession(session);
  }, []);

  // Load agents when component mounts
  useEffect(() => {
    if (isOpen && agents.length === 0) {
      loadAgents();
    }
  }, [isOpen]);

  const loadAgents = async () => {
    try {
      setIsLoading(true);
      const agentsData = await AgentsAPI.getAllAgents();
      setAgents(agentsData);
    } catch (error) {
      toast.error('Failed to load agents');
      console.error('Error loading agents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectAgent = (agent) => {
    setSelectedAgent(agent);
    setCurrentView('chat');
    
    // Load chat history from localStorage
    if (userSession) {
      const savedMessages = ChatHistoryManager.loadMessages(agent.id, userSession.userId);
      setMessages(savedMessages);
    } else {
      setMessages([]);
    }
  };

  const goBackToAgents = () => {
    // Save current conversation before leaving
    if (selectedAgent && userSession && messages.length > 0) {
      ChatHistoryManager.saveMessages(selectedAgent.id, messages, userSession.userId);
    }
    
    setCurrentView('agents');
    setSelectedAgent(null);
    setMessages([]);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedAgent || isSending || !userSession) return;

    const userMessage = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    const messageToSend = newMessage;
    setNewMessage('');
    setIsSending(true);

    try {
      const response = await AgentsAPI.sendMessage(selectedAgent.id, messageToSend, userSession.userId);
      
      // Handle the API response format (array with agent response)
      let responseText = 'No response received';
      if (Array.isArray(response) && response.length > 0) {
        responseText = response[0].text || responseText;
      } else if (response?.text) {
        responseText = response.text;
      } else if (response?.response) {
        responseText = response.response;
      } else if (response?.message) {
        responseText = response.message;
      }
      
      const agentMessage = {
        id: Date.now() + 1,
        text: responseText,
        sender: 'agent',
        timestamp: new Date()
      };

      const finalMessages = [...updatedMessages, agentMessage];
      setMessages(finalMessages);
      
      // Save to localStorage
      ChatHistoryManager.saveMessages(selectedAgent.id, finalMessages, userSession.userId);
    } catch (error) {
      toast.error('Failed to send message');
      console.error('Error sending message:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'agent',
        timestamp: new Date(),
        isError: true
      };
      
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      
      // Save to localStorage even with error
      ChatHistoryManager.saveMessages(selectedAgent.id, finalMessages, userSession.userId);
    } finally {
      setIsSending(false);
    }
  };

  const clearChat = async () => {
    if (!selectedAgent || !userSession) return;
    
    try {
      // Use server sync manager to clear both server and local storage
      const success = await ServerSyncManager.clearServerAndLocal(
        selectedAgent.id, 
        userSession.userId, 
        AgentsAPI
      );
      
      if (success) {
        setMessages([]);
        toast.success('Chat history cleared');
      } else {
        // Fallback: at least clear local storage
        ChatHistoryManager.clearMessages(selectedAgent.id, userSession.userId);
        setMessages([]);
        toast.success('Local chat history cleared');
      }
    } catch (error) {
      toast.error('Failed to clear chat history');
      console.error('Error clearing chat:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50" ref={chatButtonRef}>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 transition-all duration-300 hover:scale-110 hover:shadow-xl"
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </Button>
      </div>

      {/* Chat Widget */}
      {isOpen && (
        <div 
          ref={chatWidgetRef}
          className="fixed bottom-24 right-6 w-[480px] h-[650px] z-50 animate-in slide-in-from-bottom-2 duration-300"
        >
          <Card className="h-full flex flex-col shadow-2xl border-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            {/* Header */}
            <CardHeader className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                {currentView === 'chat' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goBackToAgents}
                    className="text-white hover:text-white hover:bg-white/20 p-2"
                  >
                    <ChevronLeft size={20} />
                  </Button>
                )}
                <div className="flex items-center space-x-2 flex-1 justify-center">
                  <Sparkles size={20} />
                  <h3 className="font-semibold text-lg">
                    {currentView === 'agents' ? 'Fanspark Agents' : selectedAgent?.name}
                  </h3>
                </div>
                {currentView === 'chat' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearChat}
                    className="text-white hover:text-white hover:bg-white/20 p-2"
                    title="Clear chat"
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
              {currentView === 'chat' && selectedAgent && (
                <div className="flex items-center space-x-2 mt-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={selectedAgent.avatar} alt={selectedAgent.name} />
                    <AvatarFallback>{selectedAgent.name[0]}</AvatarFallback>
                  </Avatar>
                  <Badge variant="secondary" className="text-xs bg-white/20 text-white border-0">
                    Online
                  </Badge>
                </div>
              )}
            </CardHeader>

            {/* Content */}
            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
              {currentView === 'agents' ? (
                <AgentsList 
                  agents={agents} 
                  isLoading={isLoading} 
                  onSelectAgent={selectAgent}
                  userSession={userSession}
                />
              ) : (
                <ChatInterface
                  messages={messages}
                  newMessage={newMessage}
                  setNewMessage={setNewMessage}
                  onSendMessage={sendMessage}
                  onKeyPress={handleKeyPress}
                  isSending={isSending}
                  selectedAgent={selectedAgent}
                  messagesEndRef={messagesEndRef}
                />
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

// Agents List Component
function AgentsList({ agents, isLoading, onSelectAgent, userSession }) {
  // Get chat sessions for indicators
  const chatSessions = userSession ? ChatHistoryManager.getAllChatSessions(userSession.userId) : {};

  // Fallback FanSpark characters when agents are not available
  const fansparkCharacters = [
    {
      id: 'hikari-fanspark',
      name: 'Hikari',
      bio: 'Coming Soon - A mysterious character from the FanSpark universe awaiting her debut.',
      avatar: '/character/hikari_pfp.png',
      isComingSoon: true,
      universe: 'FanSpark'
    },
    {
      id: 'sparky-fanspark', 
      name: 'Sparky',
      bio: 'Coming Soon - An energetic character from the FanSpark universe ready to spark new adventures.',
      avatar: '/character/sparky_pfp.png',
      isComingSoon: true,
      universe: 'FanSpark'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex-1 p-6">
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center space-x-3 p-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Determine which agents to show - API agents or fallback FanSpark characters
  const agentsToShow = agents.length > 0 ? agents : fansparkCharacters;
  const showingFallback = agents.length === 0;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-4 border-b flex-shrink-0">
        <h4 className="text-sm font-medium text-muted-foreground">
          {showingFallback 
            ? "FanSpark Characters (Coming Soon)" 
            : "Choose a Fanspark Agent to chat with"
          }
        </h4>
        {/* {showingFallback && (
          <p className="text-xs text-muted-foreground mt-1">
            Doodle agents are currently unavailable. Check out these FanSpark characters!
          </p>
        )} */}
      </div>
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="p-4 pb-6 space-y-3">
          {agentsToShow.map((agent) => (
            <Card
              key={agent.id}
              onClick={() => agent.isComingSoon ? null : onSelectAgent(agent)}
              className={`transition-all duration-200 border-border/50 ${
                agent.isComingSoon 
                  ? 'opacity-75 cursor-not-allowed' 
                  : 'cursor-pointer hover:shadow-md hover:scale-[1.02] hover:border-primary/50'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-12 w-12 ring-2 ring-primary/10">
                    <AvatarImage src={agent.avatar} alt={agent.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      {agent.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-base">{agent.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        <Bot size={10} className="mr-1" />
                        {agent.universe || 'Stellar Universe'}
                      </Badge>
                      {agent.isComingSoon && (
                        <Badge variant="outline" className="text-xs bg-orange-500/10 text-orange-600 border-orange-500/20">
                          Coming Soon
                        </Badge>
                      )}
                      {!agent.isComingSoon && chatSessions[agent.id] && chatSessions[agent.id].messageCount > 0 && (
                        <Badge variant="outline" className="text-xs ml-1">
                          {chatSessions[agent.id].messageCount} msgs
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {agent.bio.substring(0, 120)}...
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

// Chat Interface Component
function ChatInterface({ 
  messages, 
  newMessage, 
  setNewMessage, 
  onSendMessage, 
  onKeyPress, 
  isSending,
  selectedAgent,
  messagesEndRef
}) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Messages */}
      <ScrollArea className="flex-1 h-0">
        <div className="p-2 pb-6 space-y-3 w-full min-h-full">
                      {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="relative mb-4">
                <Avatar className="h-20 w-20 ring-4 ring-primary/20">
                  <AvatarImage src={selectedAgent?.avatar} alt={selectedAgent?.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl">
                    {selectedAgent?.name?.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                  <Bot size={12} className="text-white" />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">{selectedAgent?.name}</h3>
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                Start a conversation! I'm here to help and chat about anything you'd like.
              </p>
            </div>
          )}
          
          {messages.map((message) => (
            <div key={message.id} className="space-y-1 w-full">
              <div className={`flex items-start space-x-3 w-full ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <Avatar className="h-8 w-8 flex-shrink-0">
                  {message.sender === 'user' ? (
                    <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-500 text-white">
                      <User size={16} />
                    </AvatarFallback>
                  ) : (
                    <>
                      <AvatarImage src={selectedAgent?.avatar} alt={selectedAgent?.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        <Bot size={16} />
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div className={`flex flex-col space-y-1 w-full max-w-[75%] ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className="text-xs text-muted-foreground">
                    {message.sender === 'user' ? 'You' : selectedAgent?.name}
                  </div>
                  <Card className={`
                    w-full
                    ${message.sender === 'user' 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0' 
                      : message.isError
                      ? 'bg-destructive/10 border-destructive/20 text-destructive'
                      : 'bg-muted/50'
                    }
                  `}>
                    <CardContent className="px-3">
                      <p className="text-sm leading-tight whitespace-pre-wrap break-words overflow-wrap-anywhere">
                        {message.text}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ))}
          
          {isSending && (
            <div className="space-y-1 w-full">
              <div className="flex items-start space-x-3 w-full">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={selectedAgent?.avatar} alt={selectedAgent?.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                    <Bot size={16} />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1 w-full max-w-[75%]">
                  <div className="text-xs text-muted-foreground">{selectedAgent?.name}</div>
                  <Card className="bg-muted/50 w-full">
                    <CardContent className="px-3 py-1">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} className="pb-4" />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t bg-background/95 backdrop-blur p-4 pb-6">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Type your message..."
            disabled={isSending}
            className="flex-1 focus-visible:ring-primary"
          />
          <Button
            onClick={onSendMessage}
            disabled={!newMessage.trim() || isSending}
            size="icon"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
} 