import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import VideoModal from '../components/VideoModal';
import InventoryAnalytics from './InventoryAnalytics';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  processSalesData, 
  getDateRangeData, 
  calculateMetrics, 
  calculateRevenueInRange,
  SalesData, 
  DateRangeType, 
  DateRange 
} from '../services/salesService';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import WasteManagement from '../components/WasteManagement';

const colors = {
  primary: '#1C345C',    // New primary button color
  secondary: '#2E294E',  // Space Cadet
  accent: '#9055A2',     // Purpureus
  light: '#D499B9',      // Lilac
  lighter: '#E8C1C5',    // Tea Rose
  darkBlue: '#030303',
  mediumBlue: '#123458',
  beige: '#D4C9BE',
  lightGray: '#F1EFEC',
};

const DashboardContainer = styled.div`
  padding: 32px;
  margin-left: 280px;
  background: #f5f5f5;
  min-height: 100vh;
`;

const Title = styled.h1`
  color: #123458;
  margin: 0 0 32px 0;
  font-size: 2em;
  font-weight: 600;
`;

const Section = styled.div`
  background: white;
  padding: 24px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 32px;
  width: 100%;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  color: ${colors.darkBlue};
  font-size: 1.8em;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid ${colors.beige};
`;

const Button = styled.button<{ active?: boolean; variant?: 'outline' | 'filled' }>`
  padding: 12px 24px;
  border: 1px solid ${props => props.active ? colors.primary : colors.primary}30;
  border-radius: 8px;
  background: ${props => {
    if (props.variant === 'filled') return colors.primary;
    return props.active ? colors.primary : 'transparent';
  }};
  color: ${props => {
    if (props.variant === 'filled') return 'white';
    return props.active ? 'white' : colors.primary;
  }};
  font-size: 0.95em;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 120px;

  &:hover {
    background: ${props => {
      if (props.variant === 'filled') return colors.primary;
      return props.active ? colors.primary : `${colors.primary}10`;
    }};
    color: ${props => {
      if (props.variant === 'filled') return 'white';
      return props.active ? 'white' : colors.primary;
    }};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px ${colors.primary}20;
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
`;

const DateRangeSelector = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  align-items: center;
`;

const CameraGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-top: 24px;
`;

const CameraButton = styled(Button)`
  padding: 24px;
  flex-direction: column;
  background: white;
  border: 1px solid ${colors.primary}20;
  min-height: 120px;
  width: 100%;

  span:first-child {
    color: ${colors.primary};
    font-size: 1.2em;
    font-weight: 600;
    margin-bottom: 8px;
  }

  span:last-child {
    color: ${colors.primary}90;
    font-size: 0.9em;
  }

  &:hover {
    background: ${colors.primary}05;
    border-color: ${colors.primary};
  }
`;

const CustomDateContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 32px;
  flex-wrap: wrap;
`;

const DatePickerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  .react-datepicker-wrapper {
    width: auto;
  }

  .react-datepicker__input-container input {
    padding: 10px 16px;
    border: 1px solid ${colors.primary}30;
    border-radius: 8px;
    font-size: 0.95em;
    color: ${colors.primary};
    width: 130px;
    background: white;

    &:focus {
      outline: none;
      border-color: ${colors.primary};
      box-shadow: 0 0 0 2px ${colors.primary}20;
    }
  }
`;

const DateLabel = styled.span`
  color: ${colors.primary};
  font-size: 0.95em;
  font-weight: 500;
`;

const ApplyButton = styled.button`
  padding: 8px 16px;
  background: ${colors.accent};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const MetricCard = styled.div`
  background: ${colors.lightGray};
  padding: 16px;
  border-radius: 12px;
  border: 1px solid ${colors.beige};
  text-align: center;
`;

const MetricLabel = styled.div`
  color: ${colors.darkBlue};
  font-size: 0.9em;
  margin-bottom: 8px;
`;

const MetricValue = styled.div`
  color: ${colors.accent};
  font-size: 1.4em;
  font-weight: 600;
`;

const MetricTrend = styled.div<{ positive?: boolean }>`
  color: ${props => props.positive ? '#2ecc71' : '#e74c3c'};
  font-size: 0.8em;
  margin-top: 4px;
`;

const ChartContainer = styled.div`
  height: 400px;
  width: 100%;
  margin-top: 24px;
`;

const Dashboard: React.FC = () => {
  const [selectedCamera, setSelectedCamera] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<DateRangeType>('custom');
  const [customDateRange, setCustomDateRange] = useState<DateRange>({
    startDate: new Date('2022-11-06'),
    endDate: new Date('2022-12-13')
  });
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [filteredData, setFilteredData] = useState<SalesData[]>([]);
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    peakHour: '0:00'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSalesData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching sales data...');
        
        const response = await fetch('/files/sales_data.csv');
        if (!response.ok) {
          throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
        }
        
        const csvText = await response.text();
        if (!csvText.trim()) {
          throw new Error('CSV file is empty');
        }

        const data = processSalesData(csvText);
        if (data.length === 0) {
          throw new Error('No data processed from CSV');
        }

        setSalesData(data);
        
        // Calculate initial revenue for the default date range
        const initialRevenue = calculateRevenueInRange(
          data,
          '2022-11-06',
          '2022-12-13'
        );
        console.log('Initial total revenue:', initialRevenue);
        
        // Update metrics with the calculated revenue
        setMetrics(prev => ({
          ...prev,
          totalRevenue: initialRevenue
        }));
        
        updateDataAndMetrics(data, 'custom');
      } catch (error) {
        console.error('Error loading sales data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load sales data');
      } finally {
        setLoading(false);
      }
    };

    loadSalesData();
  }, []);

  const updateDataAndMetrics = (data: SalesData[], range: DateRangeType) => {
    try {
      console.log('Updating data for range:', range);
      
      const filtered = getDateRangeData(data, range, range === 'custom' ? customDateRange : undefined);
      setFilteredData(filtered);
      
      if (range === 'custom' && customDateRange.startDate && customDateRange.endDate) {
        const revenue = calculateRevenueInRange(
          data,
          customDateRange.startDate.toISOString().split('T')[0],
          customDateRange.endDate.toISOString().split('T')[0]
        );
        setMetrics(prev => ({
          ...prev,
          ...calculateMetrics(filtered),
          totalRevenue: revenue
        }));
      } else {
        setMetrics(calculateMetrics(filtered));
      }
    } catch (error) {
      console.error('Error updating metrics:', error);
      setError('Failed to update metrics');
    }
  };

  const handleDateRangeChange = (range: DateRangeType) => {
    setDateRange(range);
    updateDataAndMetrics(salesData, range);
  };

  const handleCustomDateApply = () => {
    if (customDateRange.startDate && customDateRange.endDate) {
      setDateRange('custom');
      updateDataAndMetrics(salesData, 'custom');
    }
  };

  const handleCameraClick = (level: number) => {
    setSelectedCamera(level);
  };

  const getCameraUrl = (level: number) => {
    return `http://your-camera-server.com/feed/level-${level}`;
  };

  if (loading) {
    return (
      <DashboardContainer>
        <Title>Loading sales data...</Title>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <Title>Error</Title>
        <Section>
          <SectionTitle>Failed to load sales data</SectionTitle>
          <p style={{ color: colors.accent }}>{error}</p>
        </Section>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Title>Dashboard</Title>

      {/* Sales & Revenue Analytics Section */}
      <Section>
        <SectionTitle>Sales & Revenue Analytics</SectionTitle>
        <DateRangeSelector>
          <Button 
            active={dateRange === 'week'} 
            onClick={() => handleDateRangeChange('week')}
          >
            This Week
          </Button>
          <Button 
            active={dateRange === 'month'} 
            onClick={() => handleDateRangeChange('month')}
          >
            This Month
          </Button>
          <Button 
            active={dateRange === 'year'} 
            onClick={() => handleDateRangeChange('year')}
          >
            This Year
          </Button>
          <Button 
            active={dateRange === 'all'} 
            onClick={() => handleDateRangeChange('all')}
          >
            All Time
          </Button>
          <Button 
            active={dateRange === 'custom'} 
            onClick={() => setDateRange('custom')}
          >
            Custom Range
          </Button>
        </DateRangeSelector>

        {dateRange === 'custom' && (
          <CustomDateContainer>
            <DatePickerWrapper>
              <DateLabel>From:</DateLabel>
              <DatePicker
                selected={customDateRange.startDate}
                onChange={(date) => setCustomDateRange(prev => ({ ...prev, startDate: date }))}
                selectsStart
                startDate={customDateRange.startDate}
                endDate={customDateRange.endDate}
                maxDate={new Date()}
                placeholderText="Start Date"
              />
            </DatePickerWrapper>
            <DatePickerWrapper>
              <DateLabel>To:</DateLabel>
              <DatePicker
                selected={customDateRange.endDate}
                onChange={(date) => setCustomDateRange(prev => ({ ...prev, endDate: date }))}
                selectsEnd
                startDate={customDateRange.startDate}
                endDate={customDateRange.endDate}
                minDate={customDateRange.startDate || undefined}
                maxDate={new Date()}
                placeholderText="End Date"
              />
            </DatePickerWrapper>
            <Button 
              variant="filled"
              onClick={handleCustomDateApply}
            >
              Apply Range
            </Button>
          </CustomDateContainer>
        )}

        <MetricsGrid>
          <MetricCard>
            <MetricLabel>Total Orders</MetricLabel>
            <MetricValue>{metrics.totalOrders}</MetricValue>
            <MetricTrend positive>
              {dateRange === 'custom' 
                ? 'Selected period' 
                : dateRange === 'all' 
                  ? 'Total' 
                  : `Last ${dateRange}`}
            </MetricTrend>
          </MetricCard>
          <MetricCard>
            <MetricLabel>Total Revenue</MetricLabel>
            <MetricValue>
              ₹{metrics.totalRevenue.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </MetricValue>
            <MetricTrend positive>
              {dateRange === 'custom' 
                ? 'Selected period' 
                : dateRange === 'all' 
                  ? 'Total' 
                  : `Last ${dateRange}`}
            </MetricTrend>
          </MetricCard>
          <MetricCard>
            <MetricLabel>Average Order Value</MetricLabel>
            <MetricValue>₹{metrics.averageOrderValue.toFixed(2)}</MetricValue>
            <MetricTrend>
              {dateRange === 'custom' 
                ? 'Selected period' 
                : dateRange === 'all' 
                  ? 'Overall' 
                  : `Last ${dateRange}`}
            </MetricTrend>
          </MetricCard>
          <MetricCard>
            <MetricLabel>Peak Hour</MetricLabel>
            <MetricValue>{metrics.peakHour}</MetricValue>
            <MetricTrend>Most orders</MetricTrend>
          </MetricCard>
        </MetricsGrid>

        <ChartContainer>
          {filteredData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={filteredData} 
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                key={dateRange}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={colors.beige} />
                <XAxis 
                  dataKey="date" 
                  stroke={colors.darkBlue}
                  tickFormatter={(value) => {
                    try {
                      return new Date(value).toLocaleDateString();
                    } catch (e) {
                      console.error('Date formatting error:', e);
                      return value;
                    }
                  }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  yAxisId="left"
                  stroke={colors.darkBlue}
                  tickFormatter={(value) => `₹${value.toLocaleString()}`}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke={colors.mediumBlue}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: `1px solid ${colors.beige}`,
                    borderRadius: '8px'
                  }}
                  labelFormatter={(value) => {
                    try {
                      return new Date(value).toLocaleDateString();
                    } catch (e) {
                      return value;
                    }
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === 'revenue') {
                      return [`₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Revenue'];
                    }
                    if (name === 'sales') {
                      return [value.toString(), 'Items Sold'];
                    }
                    return [value.toString(), name];
                  }}
                  labelStyle={{ color: colors.darkBlue }}
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke={colors.accent} 
                  strokeWidth={2}
                  dot={{ fill: colors.accent, strokeWidth: 2 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="sales" 
                  stroke={colors.mediumBlue} 
                  strokeWidth={2}
                  dot={{ fill: colors.mediumBlue, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: colors.darkBlue 
            }}>
              No data available for the selected date range
            </div>
          )}
        </ChartContainer>
      </Section>

      {/* Refrigerator Camera Feeds Section */}
      <Section>
        <SectionTitle>Refrigerator Camera Feeds</SectionTitle>
        <CameraGrid>
          {[1, 2, 3, 4].map((level) => (
            <CameraButton
              key={level}
              onClick={() => handleCameraClick(level)}
            >
              <span>Level {level}</span>
              <span>Camera Feed</span>
            </CameraButton>
          ))}
        </CameraGrid>
      </Section>

      {/* Inventory Analytics Section */}
      <Section>
        <InventoryAnalytics />
      </Section>

      {/* Waste Management Section */}
      <Section>
        <WasteManagement />
      </Section>

      {selectedCamera && (
        <VideoModal
          levelNumber={selectedCamera}
          onClose={() => setSelectedCamera(null)}
          videoUrl={getCameraUrl(selectedCamera)}
        />
      )}
    </DashboardContainer>
  );
};

export default Dashboard; 