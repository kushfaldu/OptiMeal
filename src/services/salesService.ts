import Papa from 'papaparse';

export interface SalesData {
  date: string;
  sales: number;
  revenue: number;
  orders: number;
}

const parseDate = (dateStr: string): string => {
  try {
    // Handle different date formats
    let parts: string[] = [];
    if (dateStr.includes('/')) {
      parts = dateStr.split('/');
      // MM/DD/YYYY format
      return `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
    } else if (dateStr.includes('-')) {
      parts = dateStr.split('-');
      // DD-MM-YYYY format
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    return dateStr;
  } catch (error) {
    console.error('Error parsing date:', dateStr, error);
    return dateStr;
  }
};

const parseTimeOfDay = (timeStr: string): number => {
  switch (timeStr.toLowerCase()) {
    case 'morning': return 9;
    case 'afternoon': return 14;
    case 'evening': return 18;
    case 'night': return 21;
    case 'midnight': return 0;
    default: return 12;
  }
};

export const processSalesData = (csvData: string): SalesData[] => {
  const results = Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.toLowerCase().trim(),
  });

  console.log('CSV Parse Results:', results);

  // Group data by date
  const dailyData = results.data.reduce((acc: { [key: string]: SalesData }, row: any) => {
    try {
      const date = parseDate(row.date);
      if (!acc[date]) {
        acc[date] = {
          date,
          sales: 0,
          revenue: 0,
          orders: 0
        };
      }
      
      const quantity = parseInt(row.quantity) || 0;
      const revenue = parseFloat(row.transaction_amount) || 0;  // Using transaction_amount

      acc[date].sales += quantity;
      acc[date].revenue += revenue;
      acc[date].orders += 1;

      return acc;
    } catch (error) {
      console.error('Error processing row:', row, error);
      return acc;
    }
  }, {});

  // Convert to array and sort by date
  const sortedData = Object.values(dailyData).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  console.log('Processed Data:', sortedData);
  return sortedData;
};

export const calculateRevenueInRange = (data: SalesData[], startDate: string, endDate: string): number => {
  const filteredData = data.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
  });

  const totalRevenue = filteredData.reduce((sum, item) => sum + item.revenue, 0);
  console.log(`Total Revenue from ${startDate} to ${endDate}:`, totalRevenue);
  return totalRevenue;
};

export type DateRangeType = 'week' | 'month' | 'year' | 'all' | 'custom';

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export const getDateRangeData = (
  data: SalesData[], 
  range: DateRangeType,
  customRange?: DateRange
): SalesData[] => {
  if (range === 'all') {
    return data;
  }

  if (range === 'custom' && customRange?.startDate && customRange?.endDate) {
    return data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= customRange.startDate! && itemDate <= customRange.endDate!;
    });
  }

  const now = new Date();
  const ranges = {
    week: 7,
    month: 30,
    year: 365
  };

  const daysToSubtract = ranges[range as keyof typeof ranges];
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - daysToSubtract);

  const filtered = data.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= startDate && itemDate <= now;
  });

  console.log(`Filtered data for ${range}:`, filtered);
  return filtered;
};

export const calculateMetrics = (data: SalesData[]) => {
  const totalOrders = data.reduce((sum, item) => sum + item.orders, 0);
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Since we don't have actual hour data, we'll use the time of day from the CSV
  const peakHour = '14:00'; // Default to afternoon

  const metrics = {
    totalOrders,
    totalRevenue,
    averageOrderValue,
    peakHour
  };

  console.log('Calculated metrics:', metrics);
  return metrics;
}; 