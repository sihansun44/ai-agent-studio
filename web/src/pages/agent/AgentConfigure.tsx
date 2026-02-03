import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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

// Example instruction templates
const EXAMPLE_TEMPLATES = [
  {
    id: 'customer-support',
    name: 'Customer Support',
    description: 'Standard support agent instructions',
    content: `You are a helpful customer support agent. Your role is to assist customers with their inquiries, troubleshoot issues, and provide accurate information.

## Guidelines:
- Always be polite, professional, and empathetic
- If you don't know the answer, offer to connect the customer with a human agent
- Never make up information about products or policies
- Keep responses concise but helpful

## Tone:
Professional yet friendly. Use clear, simple language.`
  },
  {
    id: 'sales-assistant',
    name: 'Sales Assistant',
    description: 'Product recommendation focus',
    content: `You are a knowledgeable sales assistant. Help customers find the perfect products based on their needs and preferences.

## Guidelines:
- Ask clarifying questions to understand customer needs
- Provide personalized product recommendations
- Highlight key features and benefits
- Be transparent about pricing and availability

## Tone:
Enthusiastic and helpful without being pushy.`
  },
  {
    id: 'technical-help',
    name: 'Technical Help',
    description: 'Troubleshooting focus',
    content: `You are a technical support specialist. Help users diagnose and resolve technical issues with our products.

## Guidelines:
- Ask for error messages and system information
- Provide step-by-step troubleshooting instructions
- Escalate complex issues to engineering when needed
- Document solutions for future reference

## Tone:
Patient, clear, and technically precise.`
  },
  {
    id: 'general-assistant',
    name: 'General Assistant',
    description: 'Flexible conversational agent',
    content: `You are a versatile AI assistant. Help users with a wide range of questions and tasks.

## Guidelines:
- Adapt your communication style to match the user
- Provide accurate and helpful information
- Acknowledge when you're uncertain
- Offer to help with follow-up questions

## Tone:
Friendly, approachable, and adaptable.`
  }
];

const WELCOME_MESSAGE = `## Welcome Message

👋 Welcome! I'm here to help you today.

Before we begin, could you please tell me:
- Your name
- What I can help you with today

---

`;

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
  const instructionContainerRef = useRef(null);
  const initialized = useRef(false);

  // Plus menu state
  const [showPlusButton, setShowPlusButton] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [plusButtonPosition, setPlusButtonPosition] = useState({ x: 0, y: 0 });
  const [showExamplesModal, setShowExamplesModal] = useState(false);
  const [showCapabilityPicker, setShowCapabilityPicker] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Set initial content only once
  useEffect(() => {
    if (instructionRef.current && !initialized.current) {
      instructionRef.current.innerHTML = `You are a helpful customer support agent for Acme Corporation. Your role is to assist customers with their inquiries, troubleshoot issues, and provide accurate information.<br><br>## Guidelines:<br>- Always be polite, professional, and empathetic<br>- If you don't know the answer, offer to connect the customer with a human agent<br>- Never make up information about products or policies<br>- Keep responses concise but helpful<br><br>## Tone:<br>Professional yet friendly. Use clear, simple language.`;
      initialized.current = true;
    }
  }, []);

  // Update plus button position based on cursor - always at end of line
  const updatePlusButtonPosition = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && instructionRef.current) {
      const range = selection.getRangeAt(0);
      if (instructionRef.current.contains(range.startContainer)) {
        const cursorRect = range.getBoundingClientRect();
        const containerRect = instructionRef.current.getBoundingClientRect();
        
        if (cursorRect.top > 0) {
          // Position at the end of the current line (right edge of container)
          setPlusButtonPosition({
            x: containerRect.right - 40,
            y: cursorRect.top - 2
          });
        }
      }
    }
  };

  // Handle focus on instruction field
  const handleInstructionFocus = () => {
    setShowPlusButton(true);
    setTimeout(updatePlusButtonPosition, 10);
  };

  // Handle blur on instruction field
  const handleInstructionBlur = (e) => {
    // Don't hide if clicking on plus button or menu
    const relatedTarget = e.relatedTarget;
    if (relatedTarget?.closest('.instruction-plus-btn') || 
        relatedTarget?.closest('.instruction-plus-menu') ||
        relatedTarget?.closest('.instruction-capability-picker')) {
      return;
    }
    // Longer delay to allow menu clicks to register
    setTimeout(() => {
      if (!showPlusMenu && !showCapabilityPicker) {
        setShowPlusButton(false);
      }
    }, 200);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showPlusMenu || showCapabilityPicker) {
        const target = e.target;
        if (!target.closest('.instruction-plus-menu') && 
            !target.closest('.instruction-capability-picker') &&
            !target.closest('.instruction-plus-btn')) {
          setShowPlusMenu(false);
          setShowCapabilityPicker(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPlusMenu, showCapabilityPicker]);

  // Handle selection change in instruction field
  const handleSelectionChange = () => {
    if (showPlusButton) {
      updatePlusButtonPosition();
    }
  };

  // Add welcome message at the beginning
  const handleAddWelcome = () => {
    if (instructionRef.current) {
      const currentContent = instructionRef.current.innerHTML;
      instructionRef.current.innerHTML = WELCOME_MESSAGE.replace(/\n/g, '<br>') + currentContent;
      showToast('Welcome message added');
    }
    setShowPlusMenu(false);
  };

  // Open examples modal
  const handleViewExamples = () => {
    setShowPlusMenu(false);
    setShowExamplesModal(true);
  };

  // Apply example template
  const handleApplyTemplate = (template) => {
    if (instructionRef.current) {
      instructionRef.current.innerHTML = template.content.replace(/\n/g, '<br>');
      showToast(`Applied "${template.name}" template`);
    }
    setShowExamplesModal(false);
  };

  // Optimize instruction with mock AI
  const handleOptimizeInstruction = () => {
    setShowPlusMenu(false);
    setIsOptimizing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      if (instructionRef.current) {
        const currentContent = instructionRef.current.innerText;
        const optimizedContent = `## Role & Purpose
You are a professional customer support agent for Acme Corporation, dedicated to providing exceptional service.

## Core Responsibilities
- Assist customers with inquiries and issues
- Provide accurate, helpful information
- Troubleshoot problems efficiently

## Communication Guidelines
1. **Be Professional**: Maintain a polite, empathetic tone
2. **Be Honest**: Never fabricate information about products or policies
3. **Be Helpful**: Offer to connect with human agents when needed
4. **Be Concise**: Keep responses clear and to the point

## Response Style
- Use clear, simple language
- Structure responses for easy reading
- Acknowledge customer concerns
- End with next steps or follow-up options`;
        
        instructionRef.current.innerHTML = optimizedContent.replace(/\n/g, '<br>');
        showToast('Instruction optimized with AI');
      }
      setIsOptimizing(false);
    }, 1500);
  };

  // Show capability picker
  const handleShowCapabilityPicker = () => {
    setShowPlusMenu(false);
    setShowCapabilityPicker(true);
  };

  // Insert capability at cursor position
  const insertCapabilityAtCursor = (cap) => {
    if (!instructionRef.current) return;
    
    const colors = {
      mcp: { bg: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' },
      action: { bg: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', border: 'rgba(168, 85, 247, 0.3)' },
      handoff: { bg: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', border: 'rgba(34, 197, 94, 0.3)' }
    };
    const typeColor = colors[cap.type.toLowerCase()] || colors.mcp;
    
    const chip = document.createElement('span');
    chip.setAttribute('contenteditable', 'false');
    chip.style.cssText = `display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 4px; background: ${typeColor.bg}; color: ${typeColor.color}; border: 1px solid ${typeColor.border}; font-size: 12px; font-weight: 500; margin: 0 2px; vertical-align: middle;`;
    chip.textContent = `⚡ ${cap.name}`;
    
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (instructionRef.current.contains(range.startContainer)) {
        range.insertNode(chip);
        const space = document.createTextNode('\u00A0');
        if (chip.nextSibling) {
          chip.parentNode.insertBefore(space, chip.nextSibling);
        } else {
          chip.parentNode.appendChild(space);
        }
        range.setStartAfter(space);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        instructionRef.current.appendChild(document.createTextNode('\u00A0'));
        instructionRef.current.appendChild(chip);
        instructionRef.current.appendChild(document.createTextNode('\u00A0'));
      }
    } else {
      instructionRef.current.appendChild(document.createTextNode('\u00A0'));
      instructionRef.current.appendChild(chip);
      instructionRef.current.appendChild(document.createTextNode('\u00A0'));
    }
    
    setShowCapabilityPicker(false);
    instructionRef.current.focus();
    showToast(`Added "${cap.name}" capability`);
  };
  
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
            <div className="instruction-editor-container" ref={instructionContainerRef}>
              {/* Formatting Toolbar */}
              <div className="instruction-toolbar">
                <div className="toolbar-left">
                  <button 
                    className="toolbar-btn" 
                    title="Bold (Ctrl+B)"
                    onMouseDown={(e) => { e.preventDefault(); document.execCommand('bold'); }}
                  >
                    <strong>B</strong>
                  </button>
                  <button 
                    className="toolbar-btn" 
                    title="Italic (Ctrl+I)"
                    onMouseDown={(e) => { e.preventDefault(); document.execCommand('italic'); }}
                  >
                    <em>I</em>
                  </button>
                  <button 
                    className="toolbar-btn" 
                    title="Underline (Ctrl+U)"
                    onMouseDown={(e) => { e.preventDefault(); document.execCommand('underline'); }}
                  >
                    <span style={{ textDecoration: 'underline' }}>U</span>
                  </button>
                  <div className="toolbar-divider" />
                  <button 
                    className="toolbar-btn" 
                    title="Add Link"
                    onMouseDown={(e) => { 
                      e.preventDefault(); 
                      const url = prompt('Enter URL:');
                      if (url) document.execCommand('createLink', false, url);
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                    </svg>
                  </button>
                  <div className="toolbar-divider" />
                  <button 
                    className="toolbar-btn toolbar-btn-text" 
                    title="Markdown formatting enabled"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.56 18H3.44C2.65 18 2 17.37 2 16.59V7.41C2 6.63 2.65 6 3.44 6h17.12c.79 0 1.44.63 1.44 1.41v9.18c0 .78-.65 1.41-1.44 1.41zM6.81 15.19v-3.66l1.92 2.35 1.92-2.35v3.66h1.93V8.81h-1.93l-1.92 2.35-1.92-2.35H4.89v6.38h1.92zM19.69 12h-1.92V8.81h-1.92V12h-1.93l2.89 3.28L19.69 12z"/>
                    </svg>
                    <span>Markdown</span>
                  </button>
                </div>
                <div className="toolbar-right">
                  <button 
                    className="toolbar-btn toolbar-btn-primary"
                    onClick={handleOptimizeInstruction}
                    disabled={isOptimizing}
                  >
                    {isOptimizing ? (
                      <>
                        <span className="toolbar-spinner" />
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7.5 5.6L10 7 8.6 4.5 10 2 7.5 3.4 5 2l1.4 2.5L5 7zm12 9.8L17 14l1.4 2.5L17 19l2.5-1.4L22 19l-1.4-2.5L22 14zM22 2l-2.5 1.4L17 2l1.4 2.5L17 7l2.5-1.4L22 7l-1.4-2.5zm-7.63 5.29a.996.996 0 00-1.41 0L1.29 18.96a.996.996 0 000 1.41l2.34 2.34c.39.39 1.02.39 1.41 0L16.7 11.05a.996.996 0 000-1.41l-2.33-2.35zm-1.03 5.49l-2.12-2.12 2.44-2.44 2.12 2.12-2.44 2.44z"/>
                        </svg>
                        Optimize
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div 
                ref={instructionRef}
                className={`configure-textarea instruction-editor ${isDragOver ? 'drag-over' : ''}`}
                contentEditable
                suppressContentEditableWarning
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onFocus={handleInstructionFocus}
                onBlur={handleInstructionBlur}
                onKeyUp={handleSelectionChange}
                onMouseUp={handleSelectionChange}
              />
              
            </div>
          </div>
        </div>

        {/* Floating Plus Button - rendered via portal */}
        {showPlusButton && createPortal(
          <button 
            className="instruction-plus-btn"
            style={{ 
              position: 'fixed',
              left: `${plusButtonPosition.x}px`,
              top: `${plusButtonPosition.y}px`
            }}
            onClick={() => setShowPlusMenu(!showPlusMenu)}
            onMouseDown={(e) => e.preventDefault()}
          >
            +
          </button>,
          document.body
        )}
        
        {/* Plus Menu Dropdown - rendered via portal */}
        {showPlusMenu && createPortal(
          <div 
            className="instruction-plus-menu"
            style={{ 
              position: 'fixed',
              left: `${plusButtonPosition.x}px`,
              top: `${plusButtonPosition.y + 32}px`
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            <button onMouseDown={(e) => { e.preventDefault(); handleAddWelcome(); }}>
              <span className="menu-icon">👋</span>
              Add welcome message
            </button>
            <button onMouseDown={(e) => { e.preventDefault(); handleViewExamples(); }}>
              <span className="menu-icon">📋</span>
              View and add example
            </button>
            <button onMouseDown={(e) => { e.preventDefault(); if (!isOptimizing) handleOptimizeInstruction(); }} disabled={isOptimizing}>
              <span className="menu-icon">{isOptimizing ? '⏳' : '✨'}</span>
              {isOptimizing ? 'Optimizing...' : 'Optimize my instruction'}
            </button>
            <button onMouseDown={(e) => { e.preventDefault(); handleShowCapabilityPicker(); }}>
              <span className="menu-icon">⚡</span>
              Add capability
            </button>
          </div>,
          document.body
        )}
        
        {/* Capability Picker Dropdown - rendered via portal */}
        {showCapabilityPicker && createPortal(
          <div 
            className="instruction-capability-picker"
            style={{ 
              position: 'fixed',
              left: `${plusButtonPosition.x}px`,
              top: `${plusButtonPosition.y + 32}px`
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            <div className="picker-header">Select a capability</div>
            {capabilities.filter(c => c.enabled).map(cap => (
              <button 
                key={cap.id} 
                onMouseDown={(e) => { e.preventDefault(); insertCapabilityAtCursor(cap); }}
                className={`picker-item type-${cap.type.toLowerCase()}`}
              >
                <span className="picker-icon">⚡</span>
                <span className="picker-name">{cap.name}</span>
                <span className={`picker-type type-${cap.type.toLowerCase()}`}>{cap.type}</span>
              </button>
            ))}
          </div>,
          document.body
        )}

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

      {/* Examples Modal */}
      {showExamplesModal && (
        <Modal onClose={() => setShowExamplesModal(false)}>
          <ModalHeader title="Instruction Examples" onClose={() => setShowExamplesModal(false)} />
          <ModalBody>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Choose a template to get started quickly. This will replace your current instruction.
            </p>
            <div className="examples-grid">
              {EXAMPLE_TEMPLATES.map(template => (
                <div 
                  key={template.id} 
                  className="example-card"
                  onClick={() => handleApplyTemplate(template)}
                >
                  <h4 className="example-card-title">{template.name}</h4>
                  <p className="example-card-description">{template.description}</p>
                  <div className="example-card-preview">
                    {template.content.slice(0, 120)}...
                  </div>
                </div>
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <div></div>
            <Button variant="secondary" onClick={() => setShowExamplesModal(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}
