import { useState, useRef, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import Button from '../../components/shared/Button';
import Toggle from '../../components/shared/Toggle';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../components/shared/Modal';

// Chip component for capabilities in instruction
function CapabilityChip({ name, type, onRemove }) {
  return (
    <span className={`instruction-chip chip-${type.toLowerCase()}`} contentEditable={false}>
      <span className="chip-icon">⚡</span>
      {name}
      <button className="chip-remove" onClick={onRemove}>×</button>
    </span>
  );
}

const KNOWLEDGE_BASES = [
  { id: 1, name: 'Product Documentation', count: '2,847 articles' },
  { id: 2, name: 'FAQ Database', count: '156 Q&A pairs' },
  { id: 3, name: 'Support Articles', count: '1,234 articles' },
];

const CAPABILITIES = [
  { id: 1, name: 'Customer Data Lookup', type: 'MCP', enabled: true },
  { id: 2, name: 'Order Status Check', type: 'MCP', enabled: true },
  { id: 3, name: 'Ticket Creation', type: 'Action', enabled: true },
  { id: 4, name: 'Transfer to Agent', type: 'Handoff', enabled: true },
  { id: 5, name: 'Schedule Callback', type: 'Action', enabled: false },
];

export default function AgentConfigure() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const { agents, currentAgent, selectAgent, showToast } = useApp();
  const [agentName, setAgentName] = useState('');
  const [description, setDescription] = useState('');
  const [capabilities, setCapabilities] = useState(CAPABILITIES);
  const [selectedKbs, setSelectedKbs] = useState([1, 2]);
  const [language, setLanguage] = useState('English');
  const [showAdvancedModal, setShowAdvancedModal] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const instructionRef = useRef(null);
  const initialized = useRef(false);

  // Set initial content only once
  useEffect(() => {
    if (instructionRef.current && !initialized.current) {
      instructionRef.current.innerHTML = `You are a helpful customer support agent for Acme Corporation. Your role is to assist customers with their inquiries, troubleshoot issues, and provide accurate information.<br><br>## Guidelines:<br>- Always be polite, professional, and empathetic<br>- If you don't know the answer, offer to connect the customer with a human agent<br>- Never make up information about products or policies<br>- Keep responses concise but helpful<br><br>## Tone:<br>Professional yet friendly. Use clear, simple language.`;
      initialized.current = true;
    }
  }, []);
  
  // Advanced settings state
  const [responseLength, setResponseLength] = useState('medium');
  const [fallbackBehavior, setFallbackBehavior] = useState('transfer');
  const [temperature, setTemperature] = useState('0.7');
  const [multiLanguage, setMultiLanguage] = useState(false);

  // Drag and drop handlers
  const handleDragStart = (e, cap) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(cap));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const data = e.dataTransfer.getData('text/plain');
    if (!data || !instructionRef.current) return;
    
    try {
      const cap = JSON.parse(data);
      
      // Color mapping based on type
      const colors = {
        mcp: { bg: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' },
        action: { bg: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', border: 'rgba(168, 85, 247, 0.3)' },
        handoff: { bg: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', border: 'rgba(34, 197, 94, 0.3)' }
      };
      const typeColor = colors[cap.type.toLowerCase()] || colors.mcp;
      
      // Create chip element with inline styles matching type colors
      const chip = document.createElement('span');
      chip.setAttribute('contenteditable', 'false');
      chip.style.cssText = `display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 4px; background: ${typeColor.bg}; color: ${typeColor.color}; border: 1px solid ${typeColor.border}; font-size: 12px; font-weight: 500; margin: 0 2px; vertical-align: middle;`;
      chip.textContent = `⚡ ${cap.name}`;
      
      // Get drop position from mouse coordinates
      let range = null;
      if (document.caretRangeFromPoint) {
        range = document.caretRangeFromPoint(e.clientX, e.clientY);
      }
      
      if (range && instructionRef.current.contains(range.startContainer)) {
        // Insert at exact drop position
        range.insertNode(chip);
        // Add space after chip
        const space = document.createTextNode('\u00A0');
        if (chip.nextSibling) {
          chip.parentNode.insertBefore(space, chip.nextSibling);
        } else {
          chip.parentNode.appendChild(space);
        }
        // Move cursor after the space
        range.setStartAfter(space);
        range.collapse(true);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      } else {
        // Fallback: append at end
        instructionRef.current.appendChild(document.createTextNode('\u00A0'));
        instructionRef.current.appendChild(chip);
        instructionRef.current.appendChild(document.createTextNode('\u00A0'));
      }
      
      instructionRef.current.focus();
    } catch (err) {
      console.error('Drop error:', err);
    }
  };

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

  // Initialize state from agent data
  if (!agentName && agent.name) {
    setAgentName(agent.name);
    setDescription(agent.description || '');
  }

  const toggleCapability = (id) => {
    setCapabilities(prev => 
      prev.map(cap => cap.id === id ? { ...cap, enabled: !cap.enabled } : cap)
    );
  };

  const toggleKnowledge = (id) => {
    setSelectedKbs(prev => 
      prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    showToast('Changes saved successfully');
  };

  const handleSaveAdvanced = () => {
    setShowAdvancedModal(false);
    showToast('Advanced settings saved');
  };

  return (
    <div className="primary-content">
      {/* Header */}
      <div className="agent-header" style={{ marginBottom: '16px' }}>
        <div className="agent-avatar" style={{ background: agent.gradient }}>
          {agent.initials}
        </div>
        <div className="agent-info">
          <div className="agent-name">{agent.name}</div>
          <div className="agent-meta">Configure your agent</div>
        </div>
        <Button variant="secondary" style={{ marginRight: '8px' }}>Preview</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>

      {/* Main Tabs */}
      <div className="tabs" style={{ marginBottom: '16px' }}>
        <div className="tab" onClick={() => navigate(`/agents/${agent.id}`)}>Overview</div>
        <div className="tab active" onClick={() => navigate(`/agents/${agent.id}/configure`)}>Configure</div>
        <div className="tab" onClick={() => navigate(`/agents/${agent.id}/monitor`)}>Monitor</div>
        <div className="tab" onClick={() => navigate(`/agents/${agent.id}/changelog`)}>Changelog</div>
      </div>

      {/* Unified Configure Layout */}
      <div className="configure-layout">
        {/* Left: Main Instruction Area */}
        <div className="configure-main">
          <div className="configure-section">
            <label className="configure-label">Instruction</label>
            <div 
              ref={instructionRef}
              className={`configure-textarea instruction-editor ${isDragOver ? 'drag-over' : ''}`}
              contentEditable
              suppressContentEditableWarning
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            />
          </div>
        </div>

        {/* Right: Settings Sidebar */}
        <div className="configure-sidebar">
          {/* Agent Name */}
          <div className="configure-section">
            <label className="configure-label">Agent name</label>
            <input 
              type="text"
              className="configure-input"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="Enter agent name"
            />
          </div>

          {/* Description */}
          <div className="configure-section">
            <label className="configure-label">Description</label>
            <textarea 
              className="configure-input configure-input-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of what this agent does"
              rows={3}
            />
          </div>

          {/* Capabilities */}
          <div className="configure-section">
            <label className="configure-label">
              Capabilities
              <span className="configure-label-hint">Drag capabilities to the instruction field</span>
            </label>
            <div className="configure-list">
              {capabilities.map(cap => (
                <div 
                  key={cap.id} 
                  className={`configure-capability-item ${!cap.enabled ? 'disabled' : ''}`}
                  draggable={cap.enabled}
                  onDragStart={(e) => cap.enabled && handleDragStart(e, cap)}
                >
                  <Toggle 
                    checked={cap.enabled}
                    onChange={() => toggleCapability(cap.id)}
                  />
                  <div className="configure-capability-info">
                    <span className="configure-capability-name">{cap.name}</span>
                    <span className={`configure-capability-type type-${cap.type.toLowerCase()}`}>{cap.type}</span>
                  </div>
                  {cap.enabled && <span className="drag-handle">⋮⋮</span>}
                </div>
              ))}
              <button className="configure-add-btn">+ Add capability</button>
            </div>
          </div>

          {/* Knowledge */}
          <div className="configure-section">
            <label className="configure-label">Knowledge</label>
            <div className="configure-list">
              {KNOWLEDGE_BASES.map(kb => (
                <div key={kb.id} className="configure-list-item">
                  <label className="configure-checkbox">
                    <input 
                      type="checkbox"
                      checked={selectedKbs.includes(kb.id)}
                      onChange={() => toggleKnowledge(kb.id)}
                    />
                    <span className="checkmark"></span>
                    <span>
                      {kb.name}
                      <span className="configure-list-meta">{kb.count}</span>
                    </span>
                  </label>
                </div>
              ))}
              <button className="configure-add-btn">+ Connect knowledge base</button>
            </div>
          </div>

          {/* Language */}
          <div className="configure-section">
            <label className="configure-label">Language</label>
            <select 
              className="configure-input"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Japanese</option>
              <option>Chinese</option>
            </select>
          </div>

          {/* Advanced Settings Link */}
          <button 
            className="configure-advanced-link"
            onClick={() => setShowAdvancedModal(true)}
          >
            Advanced settings →
          </button>
        </div>
      </div>

      {/* Advanced Settings Modal */}
      {showAdvancedModal && (
        <Modal onClose={() => setShowAdvancedModal(false)}>
          <ModalHeader title="Advanced Settings" onClose={() => setShowAdvancedModal(false)} />
          <ModalBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Response Language */}
              <div className="configure-section">
                <label className="configure-label">Response Language</label>
                <select 
                  className="configure-input"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Japanese</option>
                  <option>Chinese</option>
                  <option>Portuguese</option>
                  <option>Italian</option>
                  <option>Korean</option>
                  <option>Arabic</option>
                </select>
              </div>

              {/* Multi-language Support */}
              <div className="configure-section">
                <label className="configure-checkbox" style={{ cursor: 'pointer' }}>
                  <input 
                    type="checkbox"
                    checked={multiLanguage}
                    onChange={(e) => setMultiLanguage(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  <span>
                    Enable multi-language support
                    <span className="configure-list-meta" style={{ display: 'block' }}>
                      Auto-detect and respond in user's language
                    </span>
                  </span>
                </label>
              </div>

              {/* Response Length */}
              <div className="configure-section">
                <label className="configure-label">Response Length</label>
                <select 
                  className="configure-input"
                  value={responseLength}
                  onChange={(e) => setResponseLength(e.target.value)}
                >
                  <option value="short">Short (50-100 words)</option>
                  <option value="medium">Medium (100-200 words)</option>
                  <option value="long">Long (200-500 words)</option>
                </select>
              </div>

              {/* Temperature / Creativity */}
              <div className="configure-section">
                <label className="configure-label">
                  Creativity Level
                  <span style={{ fontWeight: 400, color: 'var(--text-secondary)', marginLeft: '8px' }}>
                    {temperature}
                  </span>
                </label>
                <input 
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--accent-color)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span>Precise</span>
                  <span>Creative</span>
                </div>
              </div>

              {/* Fallback Behavior */}
              <div className="configure-section">
                <label className="configure-label">Fallback Behavior</label>
                <select 
                  className="configure-input"
                  value={fallbackBehavior}
                  onChange={(e) => setFallbackBehavior(e.target.value)}
                >
                  <option value="transfer">Transfer to human agent</option>
                  <option value="faq">Show FAQ suggestions</option>
                  <option value="retry">Apologize and retry</option>
                  <option value="escalate">Create support ticket</option>
                </select>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <div></div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="secondary" onClick={() => setShowAdvancedModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveAdvanced}>
                Save Settings
              </Button>
            </div>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}
