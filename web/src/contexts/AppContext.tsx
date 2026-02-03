import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Types
export interface Agent {
  id: string;
  name: string;
  initials: string;
  description: string;
  gradient: string;
  status: string;
  statusClass: string;
  sessions: string;
  successRate: string;
  messages: string;
  avgResponse: string;
  meta: string;
  knowledgeBases?: string[];
}

export interface AgentsMap {
  [key: string]: Agent;
}

export interface AppContextValue {
  agents: AgentsMap;
  currentAgent: Agent | null;
  openAgents: string[];
  selectAgent: (agentId: string) => void;
  goToAgent: (agentId: string) => void;
  closeAgentNav: (agentId: string) => void;
  addAgent: (newAgent: Partial<Agent>) => Agent;
  toggleAgentPublish: (agentId: string) => void;
  toast: string | null;
  showToast: (message: string) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
}

// Initial agents data
const initialAgents: AgentsMap = {
  'cs': {
    id: 'cs',
    name: 'Customer Support Bot',
    initials: 'CS',
    description: 'Handles customer inquiries',
    gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
    status: 'Published',
    statusClass: 'badge-success',
    sessions: '5,234',
    successRate: '94.2%',
    messages: '18,921',
    avgResponse: '1.2s',
    meta: 'Handles customer inquiries • Last updated 2 hours ago'
  },
  'sa': {
    id: 'sa',
    name: 'Sales Assistant',
    initials: 'SA',
    description: 'Lead qualification',
    gradient: 'linear-gradient(135deg, #11998e, #38ef7d)',
    status: 'Published',
    statusClass: 'badge-success',
    sessions: '3,891',
    successRate: '91.8%',
    messages: '12,456',
    avgResponse: '1.4s',
    meta: 'Lead qualification • Last updated 5 hours ago'
  },
  'it': {
    id: 'it',
    name: 'IT Support Agent',
    initials: 'IT',
    description: 'Technical support',
    gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    status: 'Ready to Publish',
    statusClass: 'badge-warning',
    sessions: '—',
    successRate: '—',
    messages: '—',
    avgResponse: '—',
    meta: 'Technical support • Last updated 1 hour ago'
  }
};

// Create context
const AppContext = createContext<AppContextValue | null>(null);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  // Agents state
  const [agents, setAgents] = useState<AgentsMap>(initialAgents);
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);
  const [openAgents, setOpenAgents] = useState<string[]>([]);
  
  // Toast state
  const [toast, setToast] = useState<string | null>(null);
  
  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Select an agent (navigates to agent overview)
  const selectAgent = useCallback((agentId: string) => {
    const agent = agents[agentId];
    if (!agent) return;
    
    setCurrentAgent(agent);
    
    // Add to open agents if not already there
    setOpenAgents(prev => {
      if (!prev.includes(agentId)) {
        return [...prev, agentId];
      }
      return prev;
    });
  }, [agents]);

  // Go to agent (when clicking sidebar shortcut)
  const goToAgent = useCallback((agentId: string) => {
    const agent = agents[agentId];
    if (!agent) return;
    setCurrentAgent(agent);
  }, [agents]);

  // Close agent shortcut from sidebar
  const closeAgentNav = useCallback((agentId: string) => {
    setOpenAgents(prev => prev.filter(id => id !== agentId));
    
    // If closing current agent, clear it
    if (currentAgent && currentAgent.id === agentId) {
      setCurrentAgent(null);
    }
  }, [currentAgent]);

  // Show toast message
  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Add new agent
  const addAgent = useCallback((newAgent: Partial<Agent> & { name: string; description: string; gradient: string; status: string }) => {
    const id = newAgent.name.toLowerCase().replace(/\s+/g, '-').slice(0, 10);
    const agentWithId: Agent = {
      id,
      name: newAgent.name,
      description: newAgent.description,
      gradient: newAgent.gradient,
      status: newAgent.status,
      initials: newAgent.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
      statusClass: 'badge-warning',
      sessions: '—',
      successRate: '—',
      messages: '—',
      avgResponse: '—',
      meta: `${newAgent.description} • Just created`
    };
    
    setAgents(prev => ({
      ...prev,
      [id]: agentWithId
    }));
    
    // Select the new agent
    setCurrentAgent(agentWithId);
    setOpenAgents(prev => [...prev, id]);
    
    return agentWithId;
  }, []);

  // Toggle agent publish status
  const toggleAgentPublish = useCallback((agentId: string) => {
    setAgents(prev => {
      const agent = prev[agentId];
      if (!agent) return prev;
      
      const isPublished = agent.status === 'Published';
      const updatedAgent: Agent = {
        ...agent,
        status: isPublished ? 'Ready to Publish' : 'Published',
        statusClass: isPublished ? 'badge-warning' : 'badge-success'
      };
      
      // Update currentAgent if it's the same one
      if (currentAgent && currentAgent.id === agentId) {
        setCurrentAgent(updatedAgent);
      }
      
      return {
        ...prev,
        [agentId]: updatedAgent
      };
    });
  }, [currentAgent]);

  const value: AppContextValue = {
    // Agents
    agents,
    currentAgent,
    openAgents,
    selectAgent,
    goToAgent,
    closeAgentNav,
    addAgent,
    toggleAgentPublish,
    
    // Toast
    toast,
    showToast,
    
    // Modal
    isCreateModalOpen,
    setIsCreateModalOpen
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
