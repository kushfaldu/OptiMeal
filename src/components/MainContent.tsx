import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Dashboard from '../pages/Dashboard';
import Inventory from '../pages/Inventory';
import Menu from '../pages/Menu';

const MainContentContainer = styled.main`
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
  overflow-y: auto;
`;

const MainContent: React.FC = () => {
  return (
    <MainContentContainer>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/menu" element={<Menu />} />
      </Routes>
    </MainContentContainer>
  );
};

export default MainContent; 