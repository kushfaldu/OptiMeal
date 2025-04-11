import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Menu from './pages/Menu';
import WasteManagement from './pages/WasteManagement';
import AIInsights from './pages/AIInsights';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
  overflow-y: auto;
`;

const App: React.FC = () => {
  return (
    <Router>
      <AppContainer>
        <Sidebar />
        <MainContent>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/waste" element={<WasteManagement />} />
            <Route path="/ai-insights" element={<AIInsights />} />
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
};

export default App; 