import React from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { InventoryItem } from '../types/inventory';

const colors = {
  primary: '#1C345C',    // New primary button color
  secondary: '#2E294E',  // Space Cadet
  accent: '#9055A2',     // Purpureus
  light: '#D499B9',      // Lilac
  lighter: '#E8C1C5',    // Tea Rose
};

const AnalyticsContainer = styled.div`
  width: 100%;
`;

const Title = styled.h2`
  color: ${colors.primary};
  margin: 0 0 24px 0;
  font-size: 1.5em;
  font-weight: 600;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 24px;
`;

const StatRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 24px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 4px ${colors.primary}10;
  border: 1px solid ${colors.primary}20;
`;

const CardTitle = styled.h2`
  color: ${colors.primary};
  margin: 0 0 40px 0;
  font-size: 1.5em;
  font-weight: 600;
  padding-bottom: 12px;
  border-bottom: 2px solid ${colors.primary}20;
`;

const List = styled.div`
  margin-top: 16px;
  max-height: 300px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${colors.primary}10;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${colors.primary}30;
    border-radius: 4px;
  }
`;

const ListItem = styled.div<{ isAlert?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: ${props => props.isAlert ? `${colors.primary}10` : `${colors.primary}05`};
  border-radius: 8px;
  margin-bottom: 8px;
  
  span:first-child {
    color: ${props => props.isAlert ? colors.primary : colors.primary}90;
    font-weight: ${props => props.isAlert ? '600' : '500'};
  }
  
  span:last-child {
    color: ${props => props.isAlert ? colors.primary : colors.primary}90;
    font-weight: ${props => props.isAlert ? '600' : '500'};
  }
`;

const ItemName = styled.span`
  color: ${colors.primary};
  font-weight: 500;
  font-size: 1.1em;
`;

const ItemValue = styled.span<{ isAlert?: boolean }>`
  color: ${props => props.isAlert ? colors.primary : colors.primary}90;
  font-weight: ${props => props.isAlert ? '600' : '500'};
  font-size: 1.1em;
  min-width: 120px;
  text-align: right;
`;

const ChartContainer = styled(Card)`
  grid-column: 1 / -1;
  height: 400px;
`;

const Badge = styled.span<{ isAlert?: boolean }>`
  background-color: ${props => props.isAlert ? `${colors.primary}15` : `${colors.primary}10`};
  color: ${props => props.isAlert ? colors.primary : colors.primary}90;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
  font-weight: 500;
`;

const InventoryAnalytics: React.FC = () => {
  // Mock data - replace with actual data from your service
  const lowStockItems = [
    { name: 'Milk', quantity: 13, minQuantity: 20 },
    { name: 'Tomatoes', quantity: 16, minQuantity: 25 },
    { name: 'Chicken', quantity: 21, minQuantity: 30 },
    { name: 'Paneer', quantity: 20, minQuantity: 25 },
    { name: 'Spices Mix', quantity: 28, minQuantity: 35 },
  ];

  const expiringItems = [
    { name: 'Chicken', daysLeft: 2, quantity: 6 },
    { name: 'Milk', daysLeft: 5, quantity: 13 },
    { name: 'Chicken', daysLeft: 8, quantity: 21 },
    { name: 'Rice', daysLeft: 3, quantity: 16 },
    { name: 'Spices Mix', daysLeft: 2, quantity: 33 },
    { name: 'Fish', daysLeft: 3, quantity: 46 },
  ];

  // Transform data for the bar chart
  const chartData = lowStockItems.map(item => ({
    name: item.name,
    'Current Stock': item.quantity,
    'Minimum Required': item.minQuantity,
  }));

  return (
    <AnalyticsContainer>
      <Title>Inventory Analytics</Title>
      
      <StatRow>
        <Card>
          <CardTitle>Low Stock Alerts</CardTitle>
          <List>
            {lowStockItems.map((item, index) => (
              <ListItem key={index} isAlert>
                <span>{item.name}</span>
                <span>{item.quantity} units left</span>
              </ListItem>
            ))}
          </List>
        </Card>

        <Card>
          <CardTitle>Expiring Soon</CardTitle>
          <List>
            {expiringItems.map((item, index) => (
              <ListItem key={index} isAlert>
                <span>{item.name}</span>
                <span>Expires in {item.daysLeft} days</span>
              </ListItem>
            ))}
          </List>
        </Card>
      </StatRow>

      <ChartContainer>
        <CardTitle>Stock Levels vs Minimum Required</CardTitle>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={`${colors.primary}10`} />
            <XAxis dataKey="name" stroke={colors.primary} />
            <YAxis stroke={colors.primary} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white',
                border: `1px solid ${colors.primary}20`,
                borderRadius: '8px',
                boxShadow: `0 2px 4px ${colors.primary}10`
              }}
              labelStyle={{ color: colors.primary }}
            />
            <Legend />
            <Bar dataKey="Current Stock" fill={colors.primary} />
            <Bar dataKey="Minimum Required" fill={`${colors.primary}70`} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </AnalyticsContainer>
  );
};

export default InventoryAnalytics; 