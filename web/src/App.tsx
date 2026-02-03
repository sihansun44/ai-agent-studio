import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { MainLayout } from './components/layout';
import { Dashboard, Agents, Knowledge, KnowledgeBaseDetail, Connections, Settings } from './pages';
import { AgentOverview, AgentConfigure, AgentMonitor, AgentChangelog } from './pages/agent';
import '@momentum-design/fonts/dist/css/fonts.css';
import '@momentum-design/tokens/dist/css/theme/webex/dark-stable.css';
import '@momentum-design/tokens/dist/css/components/complete.css';
import { ThemeProvider, IconProvider } from '@momentum-design/components/react';

function App() {
  return (
    <ThemeProvider themeclass="mds-theme-stable-darkWebex">
      <IconProvider iconSet="momentum-icons">
        <AppProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="agents" element={<Agents />} />
                <Route path="agents/:agentId" element={<AgentOverview />} />
                <Route path="agents/:agentId/configure" element={<AgentConfigure />} />
                <Route path="agents/:agentId/monitor" element={<AgentMonitor />} />
                <Route path="agents/:agentId/changelog" element={<AgentChangelog />} />
                <Route path="knowledge" element={<Knowledge />} />
                <Route path="knowledge/:kbId" element={<KnowledgeBaseDetail />} />
                <Route path="connections" element={<Connections />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </IconProvider>
    </ThemeProvider>
  );
}

export default App;
