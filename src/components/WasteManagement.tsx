import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { WasteAnalytics } from '../types/waste';
import { wasteService } from '../services/wasteService';

const WasteContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 24px;
`;

const Title = styled.h2`
  color: #123458;
  margin: 0 0 24px 0;
  font-size: 1.5em;
  font-weight: 600;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 24px;
`;

const Card = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
`;

const CardTitle = styled.h3`
  color: #123458;
  margin: 0 0 16px 0;
  font-size: 1.2em;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #123458;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
`;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const WasteManagement: React.FC = () => {
  const [analytics, setAnalytics] = useState<WasteAnalytics | null>(null);

  useEffect(() => {
    // Initial load
    loadAnalytics();

    // Subscribe to updates
    const unsubscribe = wasteService.subscribe(() => {
      loadAnalytics();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const loadAnalytics = async () => {
    const data = await wasteService.getAnalytics();
    setAnalytics(data);
  };

  if (!analytics) {
    return <div>Loading...</div>;
  }

  return (
    <WasteContainer>
      <Title>Waste Analytics</Title>

      <StatGrid>
        <StatCard>
          <StatValue>₹{analytics.totalWasteCost.toFixed(2)}</StatValue>
          <StatLabel>Total Waste Cost</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{analytics.topWastedItems.length}</StatValue>
          <StatLabel>Top Wasted Items</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{analytics.wasteByCategoryData.length}</StatValue>
          <StatLabel>Waste Categories</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{analytics.wasteOverTime.length}</StatValue>
          <StatLabel>Days Recorded</StatLabel>
        </StatCard>
      </StatGrid>

      <Grid>
        <Card>
          <CardTitle>Waste by Category</CardTitle>
          <PieChart width={400} height={300}>
            <Pie
              data={analytics.wasteByCategoryData}
              cx={200}
              cy={150}
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="cost"
              nameKey="category"
              label={({ category, cost }) => `${category} (₹${cost.toFixed(0)})`}
            >
              {analytics.wasteByCategoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `₹${(value as number).toFixed(2)}`} />
            <Legend />
          </PieChart>
        </Card>

        <Card>
          <CardTitle>Waste Over Time</CardTitle>
          <LineChart width={400} height={300} data={analytics.wasteOverTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              stroke="#1C345C"
            />
            <YAxis 
              tickFormatter={(value) => `₹${value}`}
              stroke="#1C345C"
            />
            <Tooltip 
              formatter={(value) => `₹${(value as number).toFixed(2)}`}
              contentStyle={{
                background: 'white',
                border: '1px solid #1C345C20',
                borderRadius: '8px',
                boxShadow: '0 2px 4px #1C345C10'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="cost" 
              name="Cost (₹)"
              stroke="#1C345C"
              strokeWidth={2}
              dot={{ fill: '#1C345C', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#1C345C' }}
            />
          </LineChart>
        </Card>
      </Grid>
    </WasteContainer>
  );
};

export default WasteManagement; 