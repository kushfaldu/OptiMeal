import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 24px;
  padding-left: 304px; // 280px for sidebar + 24px padding
  max-width: 1200px;
  min-height: 100vh;
  background: #f8f9fa;
`;

const PageTitle = styled.h1`
  color: #2c3e50;
  margin-bottom: 24px;
  font-size: 28px;
`;

const InsightGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 800px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  width: 100%;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const Icon = styled.div`
  background: rgba(52, 152, 219, 0.15);
  color: #3498db;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
`;

const Title = styled.h2`
  color: #2c3e50;
  font-size: 20px;
  margin: 0;
`;

const Description = styled.p`
  color: #7f8c8d;
  font-size: 16px;
  margin-top: 8px;
`;

const MetricValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin: 16px 0;
`;

const TrendIndicator = styled.div<{ trend: 'up' | 'down' }>`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => props.trend === 'up' ? '#2ecc71' : '#e74c3c'};
  font-size: 14px;
  margin-top: 8px;
  &::before {
    content: "${props => props.trend === 'up' ? '↑' : '↓'}";
  }
`;

const AIInsights: React.FC = () => {
  return (
    <Container>
      <PageTitle>AI Insights</PageTitle>
      <InsightGrid>
        <Card>
          <CardHeader>
            <Icon>S</Icon>
            <Title>Sales Forecast</Title>
          </CardHeader>
          <Description>Predicted sales for the next 7 days</Description>
          <MetricValue>₹45,000</MetricValue>
          <TrendIndicator trend="up">
            Expected 12% increase from last week
          </TrendIndicator>
        </Card>

        <Card>
          <CardHeader>
            <Icon>W</Icon>
            <Title>Waste Management</Title>
          </CardHeader>
          <Description>Current waste analytics and predictions</Description>
          <MetricValue>₹2,500</MetricValue>
          <TrendIndicator trend="down">
            8% reduction from last month
          </TrendIndicator>
        </Card>

        <Card>
          <CardHeader>
            <Icon>I</Icon>
            <Title>Inventory Optimization</Title>
          </CardHeader>
          <Description>AI-powered inventory recommendations</Description>
          <MetricValue>92%</MetricValue>
          <TrendIndicator trend="up">
            Efficiency score increased by 5%
          </TrendIndicator>
        </Card>
      </InsightGrid>
    </Container>
  );
};

export default AIInsights;
