import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import Button from '../components/shared/Button';
import Badge from '../components/shared/Badge';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../components/shared/Table';
import { AgentCard } from '../components/agents';

export default function Agents() {
  const navigate = useNavigate();
  const { agents, setIsCreateModalOpen, selectAgent } = useApp();
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const agentList = Object.values(agents);

  const filteredAgents = agentList.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'published' && agent.status === 'Published') ||
      (statusFilter === 'draft' && agent.status !== 'Published');
    return matchesSearch && matchesStatus;
  });

  const handleAgentClick = (agentId) => {
    selectAgent(agentId);
    navigate(`/agents/${agentId}`);
  };

  const handleConfigureClick = (agentId) => {
    selectAgent(agentId);
    navigate(`/agents/${agentId}/configure`);
  };

  const getBadgeVariant = (statusClass) => {
    if (statusClass === 'badge-success') return 'success';
    if (statusClass === 'badge-warning') return 'warning';
    return 'default';
  };

  return (
    <div className="primary-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Agents</h1>
          <p className="page-subtitle">Manage your AI agents</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>+ Create Agent</Button>
      </div>

      <div className="secondary-content">
        {/* Filter Bar */}
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          
          {/* View Switcher */}
          <div className="view-switcher">
            <button 
              className={`view-switcher-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              <svg viewBox="0 0 24 24">
                <path d="M3 14h4v-4H3v4zm0 5h4v-4H3v4zM3 9h4V5H3v4zm5 5h12v-4H8v4zm0 5h12v-4H8v4zM8 5v4h12V5H8z"/>
              </svg>
            </button>
            <button 
              className={`view-switcher-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <svg viewBox="0 0 24 24">
                <path d="M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Table View */}
        {viewMode === 'table' && (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Agent</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Sessions</TableHeader>
                <TableHeader>Success Rate</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAgents.map(agent => (
                <TableRow key={agent.id} onClick={() => handleAgentClick(agent.id)}>
                  <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div 
                        style={{ 
                          width: '36px', 
                          height: '36px', 
                          borderRadius: '50%', 
                          background: agent.gradient,
                          marginRight: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '13px',
                          fontWeight: 600
                        }}
                      >
                        {agent.initials}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500 }}>{agent.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{agent.description}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(agent.statusClass)}>{agent.status}</Badge>
                  </TableCell>
                  <TableCell>{agent.sessions}</TableCell>
                  <TableCell>{agent.successRate}</TableCell>
                  <TableCell>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfigureClick(agent.id);
                      }}
                    >
                      Configure
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="agents-card-grid">
            {filteredAgents.map(agent => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onSelect={() => handleAgentClick(agent.id)}
                onConfigure={() => handleConfigureClick(agent.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
