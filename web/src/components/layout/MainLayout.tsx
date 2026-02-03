import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Toast from '../shared/Toast';
import CreateAgentModal from '../agents/CreateAgentModal';
import { useApp } from '../../contexts/AppContext';

export default function MainLayout() {
  const { toast, isCreateModalOpen, setIsCreateModalOpen } = useApp();

  return (
    <>
      {/* Gradient Background */}
      <div className="gradient-bg"></div>
      
      {/* Header */}
      <Header />
      
      {/* App Container */}
      <div className="app">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content Area */}
        <main className="main">
          <Outlet />
        </main>
      </div>
      
      {/* Toast Notification */}
      {toast && <Toast message={toast} />}
      
      {/* Create Agent Modal */}
      {isCreateModalOpen && (
        <CreateAgentModal onClose={() => setIsCreateModalOpen(false)} />
      )}
    </>
  );
}
