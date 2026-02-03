export default function Header() {
  return (
    <header className="header">
      {/* Left Section */}
      <div className="header-left">
        {/* Menu Button */}
        <button className="header-btn-primary">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="#000" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </button>
        {/* Webex Wordmark */}
        <div className="header-wordmark">
          <span className="webex-text">webex</span>
        </div>
      </div>
      
      {/* Vertical Divider */}
      <div className="header-divider"></div>
      
      {/* App Label */}
      <span className="header-app-label">AI Agent Studio</span>
      
      {/* Spacer */}
      <div className="header-spacer"></div>
      
      {/* Right Section */}
      <div className="header-right">
        {/* Cisco AI Symbol */}
        <button className="header-btn-ai">
          <svg viewBox="0 0 32 32" width="24" height="24">
            <circle cx="16" cy="16" r="14" fill="none" stroke="#00bceb" strokeWidth="2"/>
            <circle cx="16" cy="12" r="4" fill="#00bceb"/>
            <path d="M10 22c0-3.3 2.7-6 6-6s6 2.7 6 6" fill="none" stroke="#00bceb" strokeWidth="2"/>
          </svg>
        </button>
        
        {/* Message Icon */}
        <button className="header-btn">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
        </button>
        
        {/* Help Icon */}
        <button className="header-btn">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/>
          </svg>
        </button>
        
        {/* Notification Bell */}
        <button className="header-btn">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
        </button>
        
        {/* Waffle Menu */}
        <button className="header-btn">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/>
          </svg>
        </button>
        
        {/* Avatar */}
        <div className="header-avatar">
          <img src="https://i.pravatar.cc/32?img=8" alt="User" />
        </div>
      </div>
    </header>
  );
}
