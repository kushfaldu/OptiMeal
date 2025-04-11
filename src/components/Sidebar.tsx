import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const colors = {
  darkBlue: '#030303',
  mediumBlue: '#123458',
  beige: '#D4C9BE',
  lightGray: '#F1EFEC',
};

const SidebarContainer = styled.div`
  width: 280px;
  background: ${colors.darkBlue};
  color: ${colors.lightGray};
  height: 100vh;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 48px;
  padding: 0 12px;
`;

const LogoIcon = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 12px;
`;

const LogoText = styled.div`
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 0.5px;
  color: ${colors.lightGray};
`;

const NavSection = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.div`
  text-transform: uppercase;
  color: ${colors.beige};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1.2px;
  padding: 0 12px;
  margin-bottom: 12px;
`;

const NavList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NavItem = styled(Link)<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  text-decoration: none;
  color: ${props => props.active ? colors.lightGray : colors.beige};
  border-radius: 12px;
  background: ${props => props.active ? colors.mediumBlue : 'transparent'};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 3px;
    background: ${colors.beige};
    transform: scaleY(0);
    transition: transform 0.3s ease;
    border-radius: 0 2px 2px 0;
  }

  &:hover {
    background: ${colors.mediumBlue};
    color: ${colors.lightGray};
    transform: translateX(4px);
  }

  ${props => props.active && `
    &:before {
      transform: scaleY(1);
    }
  `}
`;

const NavText = styled.span`
  font-size: 15px;
  font-weight: 500;
`;

const UserSection = styled.div`
  margin-top: auto;
  padding: 16px 12px;
  border-top: 1px solid ${colors.beige}40;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: ${colors.mediumBlue};
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${colors.beige};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  color: ${colors.darkBlue};
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: ${colors.lightGray};
`;

const UserRole = styled.div`
  font-size: 12px;
  color: ${colors.beige};
`;

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <SidebarContainer>
      <Logo>
        <LogoText>OptiMeal</LogoText>
      </Logo>

      <NavSection>
        <SectionTitle>Main Menu</SectionTitle>
        <NavList>
          <NavItem to="/" active={location.pathname === '/'}>
            <NavText>Dashboard</NavText>
          </NavItem>
          <NavItem to="/inventory" active={location.pathname === '/inventory'}>
            <NavText>Inventory</NavText>
          </NavItem>
          <NavItem to="/menu" active={location.pathname === '/menu'}>
            <NavText>Recipe Generator</NavText>
          </NavItem>
          <NavItem to="/waste" active={location.pathname === '/waste'}>
            <NavText>Waste Management</NavText>
          </NavItem>
          <NavItem to="/ai-insights" active={location.pathname === '/ai-insights'}>
            <NavText>AI Insights</NavText>
          </NavItem>
        </NavList>
      </NavSection>

      <UserSection>
        <UserInfo>
          <UserAvatar>RK</UserAvatar>
          <UserDetails>
            <UserName>Raj Kumar</UserName>
            <UserRole>Head Chef</UserRole>
          </UserDetails>
        </UserInfo>
      </UserSection>
    </SidebarContainer>
  );
};

export default Sidebar; 