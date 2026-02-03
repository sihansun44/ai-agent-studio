import { useNavigate } from 'react-router-dom';
import Badge from '../shared/Badge';
import Button from '../shared/Button';
import { useApp } from '../../contexts/AppContext';

export default function AgentHeader({ agent, activeTab, showPublishButton = true }) {
  const navigate = useNavigate();
  const { toggleAgentPublish, showToast } = useApp();

  const getBadgeVariant = (statusClass) => {
    if (statusClass === 'badge-success') return 'success';
    if (statusClass === 'badge-warning') return 'warning';
    return 'default';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', path: '' },
    { id: 'configure', label: 'Configure', path: '/configure' },
    { id: 'monitor', label: 'Monitor', path: '/monitor' },
    { id: 'changelog', label: 'Changelog', path: '/changelog' },
  ];

  const handlePublishToggle = () => {
    const action = agent.status === 'Published' ? 'unpublished' : 'published';
    toggleAgentPublish(agent.id);
    showToast(`Agent ${action} successfully`);
  };

  return (
    <>
      <div className="agent-header" style={{ marginBottom: '16px' }}>
        <div 
          className="agent-avatar" 
          style={{ background: agent.gradient }}
        >
          {agent.initials}
        </div>
        <div className="agent-info">
          <div className="agent-name-row">
            <span className="agent-name">{agent.name}</span>
            <Badge variant={getBadgeVariant(agent.statusClass)}>
              {agent.status}
            </Badge>
          </div>
          <div className="agent-meta">{agent.meta}</div>
        </div>
        {showPublishButton && (
          <Button 
            variant={agent.status === 'Published' ? 'secondary' : 'primary'}
            onClick={handlePublishToggle}
          >
            {agent.status === 'Published' ? 'Unpublish' : 'Publish'}
          </Button>
        )}
      </div>

      <div className="tabs" style={{ marginBottom: '16px' }}>
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => navigate(`/agents/${agent.id}${tab.path}`)}
          >
            {tab.label}
          </div>
        ))}
      </div>
    </>
  );
}
