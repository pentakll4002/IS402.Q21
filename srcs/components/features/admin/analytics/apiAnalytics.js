import { supabase } from '../../../services/supabase';

export async function getRevenueByMonth(year = 2023) {
  const { data, error } = await supabase
    .from('orders')
    .select('order_date, total')
    .gte('order_date', `${year}-01-01`)
    .lte('order_date', `${year}-12-31`);

  if (error) {
    console.error('Error fetching revenue by month:', error);
    return Array(12).fill(0);
  }

  const monthlyRevenue = Array(12).fill(0);
  data.forEach((order) => {
    const date = new Date(order.order_date);
    const month = date.getMonth();
    monthlyRevenue[month] += order.total || 0;
  });

  return monthlyRevenue;
}

export async function getProfitByMonth(year = 2023) {
  const revenue = await getRevenueByMonth(year);
  return revenue.map((amount) => Math.round(amount * 0.3));
}

export async function getTotalRevenue() {
  const { data, error } = await supabase.from('orders').select('total');
  if (error) {
    console.error('Error fetching total revenue:', error);
    return 0;
  }
  return data.reduce((sum, order) => sum + (order.total || 0), 0);
}

export async function getOrderCount() {
  const { count, error } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });
  if (error) {
    console.error('Error fetching order count:', error);
    return 0;
  }
  return count || 0;
}

export async function getOrderStatsByStatus() {
  const { data, error } = await supabase.from('orders').select('status');
  if (error) {
    console.error('Error fetching order status:', error);
    return [];
  }

  const statusCounts = {};
  const statusNames = {
    completed: 'Hoàn thành',
    processing: 'Đang xử lý',
    shipping: 'Đang giao hàng',
    cancelled: 'Đã hủy',
    pending: 'Chờ xác nhận',
  };

  data.forEach((order) => {
    const status = order.status || 'pending';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  const total = Object.values(statusCounts).reduce(
    (sum, count) => sum + count,
    0
  );
  return Object.entries(statusCounts)
    .map(([status, count]) => ({
      name: statusNames[status] || status,
      value: total ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.value - a.value);
}

export async function getRevenueByRecentDays(days = 7) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days + 1);

  const startStr = startDate.toISOString().split('T')[0];
  const endStr = endDate.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('orders')
    .select('order_date, total')
    .gte('order_date', startStr)
    .lte('order_date', endStr);

  if (error) {
    console.error('Error fetching recent orders:', error);
    return [];
  }

  const dailyRevenue = {};
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    dailyRevenue[dateStr] = 0;
  }

  data.forEach((order) => {
    const dateStr = new Date(order.order_date).toISOString().split('T')[0];
    dailyRevenue[dateStr] = (dailyRevenue[dateStr] || 0) + (order.total || 0);
  });

  return Object.entries(dailyRevenue).map(([date, revenue]) => ({
    day: new Date(date).toLocaleDateString('vi-VN'),
    revenue,
    orders: Math.round(revenue / 2500000),
  }));
}

export async function getRegionalDistribution() {
  const { data, error } = await supabase
    .from('orders')
    .select('address, total');

  if (error) {
    console.error('Error fetching regional data:', error);
    return [
      { name: 'Miền Nam', value: 33 },
      { name: 'Miền Bắc', value: 33 },
      { name: 'Miền Trung', value: 34 },
    ];
  }

  const regions = { 'Miền Nam': 0, 'Miền Bắc': 0, 'Miền Trung': 0 };
  const south = ['hcm', 'sài gòn', 'cần thơ', 'đồng nai', 'bình dương'];
  const north = ['hà nội', 'hải phòng', 'bắc ninh', 'quảng ninh'];
  const central = ['đà nẵng', 'huế', 'nha trang', 'quảng nam'];

  data.forEach((order) => {
    const rawAddress = order.address;
    const addr = typeof rawAddress === 'string' ? rawAddress.toLowerCase() : '';
    const amount = order.total || 0;

    if (south.some((key) => addr.includes(key))) regions['Miền Nam'] += amount;
    else if (north.some((key) => addr.includes(key)))
      regions['Miền Bắc'] += amount;
    else if (central.some((key) => addr.includes(key)))
      regions['Miền Trung'] += amount;
    else {
      regions['Miền Nam'] += amount / 3;
      regions['Miền Bắc'] += amount / 3;
      regions['Miền Trung'] += amount / 3;
    }
  });

  const total = Object.values(regions).reduce((a, b) => a + b, 0);
  return Object.entries(regions).map(([region, value]) => ({
    region,
    percentage: total ? Math.round((value / total) * 100) : 33,
  }));
}
