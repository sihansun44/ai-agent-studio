import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { agents, openAgents, currentAgent, goToAgent, closeAgentNav } = useApp();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <svg viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg> },
    { path: '/agents', label: 'Agents', icon: <svg viewBox="0 0 24 24"><path d="M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zM7.5 11.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S9.83 13 9 13s-1.5-.67-1.5-1.5zM16 17H8v-2h8v2zm-1-4c-.83 0-1.5-.67-1.5-1.5S14.17 10 15 10s1.5.67 1.5 1.5S15.83 13 15 13z"/></svg> },
    { path: '/knowledge', label: 'Knowledge', icon: <svg viewBox="0 0 24 24"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg> },
    { path: '/connections', label: 'Connections', icon: <svg viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg> },
  ];

  const handleAgentClick = (agentId) => {
    goToAgent(agentId);
    navigate(`/agents/${agentId}`);
  };

  const handleCloseAgent = (e, agentId) => {
    e.stopPropagation();
    closeAgentNav(agentId);
    
    // If on agent page, navigate back to agents list
    if (location.pathname.startsWith(`/agents/${agentId}`)) {
      navigate('/agents');
    }
  };

  const isAgentPage = location.pathname.startsWith('/agents/') && location.pathname !== '/agents';

  return (
    <nav className="sidebar">
      <div className="sidebar-main">
        <div className="nav-section">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => {
                // Special handling: /agents should not be active when on agent detail pages
                if (item.path === '/agents' && isAgentPage) {
                  return 'nav-item';
                }
                return `nav-item ${isActive ? 'active' : ''}`;
              }}
              end={item.path === '/agents'}
            >
              <span className="nav-item-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>

        {openAgents.length > 0 && (
          <>
            <div className="nav-divider"></div>
            <div className="agent-menu-container">
              {openAgents.map(agentId => {
                const agent = agents[agentId];
                if (!agent) return null;
                
                const isActive = currentAgent && currentAgent.id === agentId && isAgentPage;
                
                return (
                  <div
                    key={agentId}
                    className={`agent-shortcut ${isActive ? 'active' : ''}`}
                    onClick={() => handleAgentClick(agentId)}
                    title={agent.name}
                  >
                    <div 
                      className="agent-shortcut-icon" 
                      style={{ background: agent.gradient }}
                    >
                      {agent.initials}
                    </div>
                    <span className="agent-shortcut-name">{agent.name}</span>
                    <button 
                      className="nav-close-btn" 
                      onClick={(e) => handleCloseAgent(e, agentId)}
                      title="Remove shortcut"
                    >
                      <svg viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <div className="sidebar-bottom">
        <NavLink
          to="/settings"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          title="Organization Settings"
        >
          <span className="nav-item-icon">
            <svg viewBox="0 0 24 24">
              <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
            </svg>
          </span>
          Settings
        </NavLink>
      </div>
    </nav>
  );
}
