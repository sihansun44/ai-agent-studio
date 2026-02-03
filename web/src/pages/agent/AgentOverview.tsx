import { useParams, Navigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { AgentHeader } from '../../components/agents';
import { Card, CardTitle } from '../../components/shared/Card';

export default function AgentOverview() {
  const { agentId } = useParams();
  const { agents, currentAgent, selectAgent } = useApp();

  // If no current agent or different agent, select it
  if (!currentAgent || currentAgent.id !== agentId) {
    const agent = agents[agentId];
    if (agent) {
      selectAgent(agentId);
    } else {
      return <Navigate to="/agents" replace />;
    }
  }

  const agent = currentAgent || agents[agentId];
  if (!agent) return <Navigate to="/agents" replace />;

  const isPublished = agent.status === 'Published';

  return (
    <div className="primary-content">
      <AgentHeader agent={agent} activeTab="overview" />

      <div className="secondary-content">
        {/* Quick Stats - only show for published agents */}
        {isPublished && (
          <>
            <Card>
              <CardTitle style={{ marginBottom: '16px' }}>Quick Stats (7 days)</CardTitle>
              <div className="grid grid-2" style={{ gap: '16px' }}>
                <div className="stat-card">
                  <div className="stat-label">Total Sessions</div>
                  <div className="stat-value">{agent.sessions}</div>
                  <div className="stat-change positive">↑ 12% vs last week</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Success Rate</div>
                  <div className="stat-value">{agent.successRate}</div>
                  <div className="stat-change positive">↑ 2.1%</div>
                </div>
              </div>
            </Card>
            <div className="section-divider"></div>
          </>
        )}

        {/* Configuration Summary */}
        <Card>
          <CardTitle style={{ marginBottom: '16px' }}>Configuration Summary</CardTitle>
          <div className="config-summary-card">
            <div className="config-summary-row">
              <span className="config-summary-label">Agent Type</span>
              <span className="config-summary-value">Autonomous</span>
            </div>
            <div className="config-summary-row">
              <span className="config-summary-label">Knowledge Bases</span>
              <span className="config-summary-value">3 connected</span>
            </div>
            <div className="config-summary-row">
              <span className="config-summary-label">Capabilities</span>
              <span className="config-summary-value">8 enabled</span>
            </div>
            <div className="config-summary-row">
              <span className="config-summary-label">Version</span>
              <span className="config-summary-value">v2.4.0</span>
            </div>
          </div>
        </Card>

        <div className="section-divider"></div>

        {/* Deployments */}
        <Card>
          <CardTitle style={{ marginBottom: '16px' }}>Deployments</CardTitle>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Where this agent is embedded (read-only)
          </p>

          {isPublished ? (
            <div className="deployment-widget">
              <div className="deployment-section">
                <div className="deployment-section-title">
                  <span>FlowBuilder Digital</span>
                  <a href="#" className="deployment-link">View in Connect →</a>
                </div>
                <div className="deployment-item">
                  <span>Customer Support Flow</span>
                </div>
                <div className="deployment-item">
                  <span>Website Chat Flow</span>
                </div>
              </div>
              <div className="deployment-divider"></div>
              <div className="deployment-section">
                <div className="deployment-section-title">
                  <span>FlowBuilder Voice</span>
                  <a href="#" className="deployment-link">View in FlowBuilder →</a>
                </div>
                <div className="deployment-item">
                  <span>IVR Support Flow</span>
                </div>
              </div>
              <div className="deployment-divider"></div>
              <div className="deployment-section">
                <div className="deployment-section-title">
                  <span>Agent Desktop</span>
                  <a href="#" className="deployment-link">View in Agent Desktop →</a>
                </div>
                <div className="deployment-item">
                  <span>AI Assistant for Support Agents</span>
                </div>
              </div>
              <div className="deployment-divider"></div>
              <div className="deployment-section">
                <div className="deployment-section-title">
                  <span>Control Hub</span>
                  <a href="#" className="deployment-link">View in Control Hub →</a>
                </div>
                <div className="deployment-item">
                  <span>Channel Management</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="deployment-widget">
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Deploy your agent to make it available in these channels:
              </p>
              <div className="deployment-section">
                <div className="deployment-item">
                  <span>Deploy to digital flow</span>
                  <a href="#" className="deployment-link">Go to Webex Connect →</a>
                </div>
              </div>
              <div className="deployment-section">
                <div className="deployment-item">
                  <span>Deploy to voice flow</span>
                  <a href="#" className="deployment-link">Go to FlowBuilder →</a>
                </div>
              </div>
              <div className="deployment-section">
                <div className="deployment-item">
                  <span>Deploy to Agent Desktop</span>
                  <a href="#" className="deployment-link">Go to Control Hub →</a>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
