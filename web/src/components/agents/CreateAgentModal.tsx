import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../shared/Modal';
import Button from '../shared/Button';

const AVATAR_COLORS = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #11998e, #38ef7d)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #ff9a9e, #fecfef)',
  'linear-gradient(135deg, #a18cd1, #fbc2eb)',
];

const KNOWLEDGE_BASES = [
  { id: 'product-docs', name: 'Product Documentation', meta: '2,847 articles • Last synced 1 hour ago' },
  { id: 'faq', name: 'FAQ Database', meta: '156 Q&A pairs • Last synced 3 hours ago' },
  { id: 'support', name: 'Support Articles', meta: '1,234 articles • Last synced 2 hours ago' },
];

export default function CreateAgentModal({ onClose }) {
  const navigate = useNavigate();
  const { addAgent, showToast } = useApp();
  
  const [step, setStep] = useState(1);
  const [agentType, setAgentType] = useState('scripted');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);
  const [selectedKbs, setSelectedKbs] = useState([]);

  const canProceed = () => {
    if (step === 1) return agentType !== '';
    if (step === 2) return name.trim() !== '';
    if (step === 3) return true;
    return true;
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleCreate = () => {
    const newAgent = addAgent({
      name,
      description: description || 'New AI Agent',
      gradient: avatarColor,
      status: 'Ready to Publish',
      knowledgeBases: selectedKbs
    });
    
    showToast(`Agent "${name}" created successfully!`);
    onClose();
    navigate(`/agents/${newAgent.id}`);
  };

  const toggleKb = (kbId) => {
    setSelectedKbs(prev => 
      prev.includes(kbId) 
        ? prev.filter(id => id !== kbId)
        : [...prev, kbId]
    );
  };

  const getInitials = () => {
    if (!name) return '??';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Create New Agent" onClose={onClose} />
      
      {/* Wizard Progress */}
      <div className="wizard-progress">
        <div className={`wizard-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <div className="wizard-step-number">{step > 1 ? '✓' : '1'}</div>
          <span className="wizard-step-label">Type</span>
        </div>
        <div className={`wizard-step-line ${step > 1 ? 'completed' : ''}`}></div>
        <div className={`wizard-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <div className="wizard-step-number">{step > 2 ? '✓' : '2'}</div>
          <span className="wizard-step-label">Details</span>
        </div>
        <div className={`wizard-step-line ${step > 2 ? 'completed' : ''}`}></div>
        <div className={`wizard-step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
          <div className="wizard-step-number">{step > 3 ? '✓' : '3'}</div>
          <span className="wizard-step-label">Knowledge</span>
        </div>
        <div className={`wizard-step-line ${step > 3 ? 'completed' : ''}`}></div>
        <div className={`wizard-step ${step >= 4 ? 'active' : ''}`}>
          <div className="wizard-step-number">4</div>
          <span className="wizard-step-label">Review</span>
        </div>
      </div>

      <ModalBody>
        {/* Step 1: Agent Type */}
        {step === 1 && (
          <div className="agent-type-grid">
            <div 
              className={`agent-type-card ${agentType === 'scripted' ? 'selected' : ''}`}
              onClick={() => setAgentType('scripted')}
            >
              <div className="agent-type-icon" style={{ background: 'rgba(100, 180, 250, 0.2)' }}>
                <svg viewBox="0 0 24 24" fill="#64b4fa">
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                </svg>
              </div>
              <h3>Scripted Agent</h3>
              <p>Follow predefined scripts and decision trees for consistent responses.</p>
              <div className="agent-type-features">
                <div className="agent-type-feature">
                  <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  Predictable behavior
                </div>
                <div className="agent-type-feature">
                  <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  Easy to maintain
                </div>
              </div>
            </div>

            <div 
              className={`agent-type-card ${agentType === 'autonomous' ? 'selected' : ''}`}
              onClick={() => setAgentType('autonomous')}
            >
              <div className="agent-type-icon" style={{ background: 'rgba(54, 211, 153, 0.2)' }}>
                <svg viewBox="0 0 24 24" fill="#36d399">
                  <path d="M21 10.12h-6.78l2.74-2.82c-2.73-2.7-7.15-2.8-9.88-.1-2.73 2.71-2.73 7.08 0 9.79s7.15 2.71 9.88 0C18.32 15.65 19 14.08 19 12.1h2c0 1.98-.88 4.55-2.64 6.29-3.51 3.48-9.21 3.48-12.72 0-3.5-3.47-3.53-9.11-.02-12.58s9.14-3.47 12.65 0L21 3v7.12z"/>
                </svg>
              </div>
              <h3>Autonomous Agent</h3>
              <p>Use AI to dynamically respond based on context and knowledge.</p>
              <div className="agent-type-features">
                <div className="agent-type-feature">
                  <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  Flexible responses
                </div>
                <div className="agent-type-feature">
                  <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  Knowledge-powered
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div>
            <div className="form-group">
              <label className="form-label">
                Agent Name <span className="required">*</span>
              </label>
              <input 
                type="text" 
                className="form-input"
                placeholder="e.g., Customer Support Bot"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea 
                className="form-input"
                placeholder="Briefly describe what this agent does..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Avatar</label>
              <div className="avatar-selector">
                <div 
                  className="avatar-preview" 
                  style={{ background: avatarColor }}
                >
                  {getInitials()}
                </div>
                <div className="avatar-colors">
                  {AVATAR_COLORS.map((color, idx) => (
                    <div
                      key={idx}
                      className={`avatar-color ${avatarColor === color ? 'selected' : ''}`}
                      style={{ background: color }}
                      onClick={() => setAvatarColor(color)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Knowledge */}
        {step === 3 && (
          <div>
            <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
              Select knowledge bases to connect to your agent (optional)
            </p>
            {KNOWLEDGE_BASES.map(kb => (
              <div 
                key={kb.id}
                className={`kb-option ${selectedKbs.includes(kb.id) ? 'selected' : ''}`}
                onClick={() => toggleKb(kb.id)}
              >
                <input 
                  type="checkbox" 
                  checked={selectedKbs.includes(kb.id)}
                  onChange={() => {}}
                />
                <div className="kb-option-info">
                  <div className="kb-option-name">{kb.name}</div>
                  <div className="kb-option-meta">{kb.meta}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div>
            <div className="summary-section">
              <div className="summary-section-title">Agent Details</div>
              <div className="summary-row">
                <span className="summary-label">Type</span>
                <span className="summary-value">{agentType === 'scripted' ? 'Scripted Agent' : 'Autonomous Agent'}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Name</span>
                <span className="summary-value">{name}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Description</span>
                <span className="summary-value">{description || 'No description'}</span>
              </div>
            </div>

            <div className="summary-section">
              <div className="summary-section-title">Knowledge Bases</div>
              {selectedKbs.length === 0 ? (
                <div className="summary-row">
                  <span className="summary-label">None selected</span>
                </div>
              ) : (
                selectedKbs.map(kbId => {
                  const kb = KNOWLEDGE_BASES.find(k => k.id === kbId);
                  return (
                    <div key={kbId} className="summary-row">
                      <span className="summary-value">{kb?.name}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        <div>
          {step > 1 && (
            <Button variant="secondary" onClick={handleBack}>
              Back
            </Button>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          {step < 4 ? (
            <Button onClick={handleNext} disabled={!canProceed()}>
              Next
            </Button>
          ) : (
            <Button onClick={handleCreate}>
              Create Agent
            </Button>
          )}
        </div>
      </ModalFooter>
    </Modal>
  );
}
