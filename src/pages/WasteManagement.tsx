import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { WasteEntry, WasteAnalytics, WasteCategory } from '../types/waste';
import { wasteService } from '../services/wasteService';

const PageContainer = styled.div`
  padding: 32px;
  margin-left: 280px;
`;

const Title = styled.h1`
  color: #123458;
  margin-bottom: 32px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 24px;
  margin-bottom: 32px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #123458;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
`;

const Button = styled.button`
  background: #123458;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px;
  font-size: 1em;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #0a1f33;
  }
`;

const CardTitle = styled.h2`
  color: #123458;
  margin: 0 0 24px 0;
  font-size: 1.5em;
  font-weight: 600;
  padding-bottom: 12px;
  border-bottom: 2px solid #F1EFEC;
`;

const StatValue = styled.div`
  font-size: 2em;
  font-weight: 600;
  color: #123458;
  margin: 16px 0;
`;

const WasteManagement: React.FC = () => {
  const [entries, setEntries] = useState<WasteEntry[]>([]);
  const [analytics, setAnalytics] = useState<WasteAnalytics | null>(null);
  const [formData, setFormData] = useState<Omit<WasteEntry, 'id'>>({
    itemName: '',
    quantity: 0,
    unit: 'kg',
    category: 'Spoilage',
    cost: 0,
    date: new Date().toISOString().split('T')[0],
    reason: '',
    chefName: ''
  });

  const loadData = async () => {
    const [entriesData, analyticsData] = await Promise.all([
      wasteService.getAllEntries(),
      wasteService.getAnalytics()
    ]);
    setEntries(entriesData);
    setAnalytics(analyticsData);
  };

  useEffect(() => {
    // Initial load
    loadData();

    // Subscribe to updates
    const unsubscribe = wasteService.subscribe(() => {
      loadData();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await wasteService.addEntry(formData);
    setFormData({
      itemName: '',
      quantity: 0,
      unit: 'kg',
      category: 'Spoilage',
      cost: 0,
      date: new Date().toISOString().split('T')[0],
      reason: '',
      chefName: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'cost' ? parseFloat(value) : value
    }));
  };

  if (!analytics) return <div>Loading...</div>;

  return (
    <PageContainer>
      <Title>Waste Management</Title>

      <Grid>
        <Card>
          <CardTitle>Add Waste Entry</CardTitle>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Item Name</Label>
              <Input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Quantity</Label>
              <Input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
                min="0"
                step="0.1"
              />
            </FormGroup>

            <FormGroup>
              <Label>Unit</Label>
              <Select name="unit" value={formData.unit} onChange={handleInputChange}>
                <option value="kg">Kilograms (kg)</option>
                <option value="g">Grams (g)</option>
                <option value="l">Liters (l)</option>
                <option value="ml">Milliliters (ml)</option>
                <option value="units">Units</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Category</Label>
              <Select name="category" value={formData.category} onChange={handleInputChange}>
                <option value="Preparation Waste">Preparation Waste</option>
                <option value="Expired Items">Expired Items</option>
                <option value="Overproduction">Overproduction</option>
                <option value="Spoilage">Spoilage</option>
                <option value="Other">Other</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Cost (₹)</Label>
              <Input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </FormGroup>

            <FormGroup>
              <Label>Date</Label>
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Reason</Label>
              <Input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Chef Name</Label>
              <Input
                type="text"
                name="chefName"
                value={formData.chefName}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <Button type="submit">Add Entry</Button>
          </Form>
        </Card>

        <div>
          <Card style={{ marginBottom: '24px' }}>
            <CardTitle>Total Waste Cost</CardTitle>
            <StatValue>₹{analytics.totalWasteCost.toFixed(2)}</StatValue>
          </Card>

          <Card style={{ marginBottom: '24px', height: '300px' }}>
            <CardTitle>Waste by Category</CardTitle>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={analytics.wasteByCategoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cost" name="Cost (₹)" fill="#123458" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card style={{ height: '300px' }}>
            <CardTitle>Waste Cost Over Time</CardTitle>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={analytics.wasteOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cost" name="Cost (₹)" stroke="#123458" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </Grid>

      <Card>
        <CardTitle>Top Wasted Items</CardTitle>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '12px', borderBottom: '2px solid #F1EFEC' }}>Item</th>
              <th style={{ textAlign: 'right', padding: '12px', borderBottom: '2px solid #F1EFEC' }}>Total Quantity</th>
              <th style={{ textAlign: 'right', padding: '12px', borderBottom: '2px solid #F1EFEC' }}>Total Cost (₹)</th>
            </tr>
          </thead>
          <tbody>
            {analytics.topWastedItems.map((item, index) => (
              <tr key={index}>
                <td style={{ padding: '12px', borderBottom: '1px solid #F1EFEC' }}>{item.itemName}</td>
                <td style={{ textAlign: 'right', padding: '12px', borderBottom: '1px solid #F1EFEC' }}>
                  {item.totalQuantity.toFixed(2)}
                </td>
                <td style={{ textAlign: 'right', padding: '12px', borderBottom: '1px solid #F1EFEC' }}>
                  ₹{item.totalCost.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </PageContainer>
  );
};

export default WasteManagement; 