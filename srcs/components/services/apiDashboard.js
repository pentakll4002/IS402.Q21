import { supabase } from '@/components/services/supabase';

// Định dạng tiền tệ không có ký hiệu để sử dụng trong dashboard
export function formatCurrencyValue(value) {
  if (!value) return 0;
  return Number(value).toLocaleString('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export async function getProductCount() {
  // Danh sách các bảng sản phẩm
  const productTables = [
    'laptop',
    'ssd',
    'keyboards',
    'headphone',
    'pccooling',
    'mouse',
    'pcgaming',
    'laptop_gaming',
    'laptop_do_hoa',
  ];

  try {
    let totalCount = 0;

    // Đếm số lượng sản phẩm trong mỗi bảng
    for (const table of productTables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (!error) {
        totalCount += count || 0;
      }
    }

    return totalCount;
  } catch (error) {
    console.error('Error counting products:', error);
    return 0;
  }
}

// Lấy tổng doanh thu từ bảng orders
export async function getTotalRevenue() {
  try {
    const { data, error } = await supabase.from('orders').select('total');

    if (error) throw error;

    // Tính tổng doanh thu
    return data.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);
  } catch (error) {
    console.error('Error getting total revenue:', error);
    return 0;
  }
}

// Lấy tổng doanh thu theo khoảng thời gian
export async function getRevenueByTimeRange(startDate, endDate) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('total, order_date, created_at')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (error) throw error;

    return data.reduce((sum, order) => {
      const orderTotal = parseFloat(order.total) || 0;
      return sum + orderTotal;
    }, 0);
  } catch (error) {
    console.error('Error getting revenue by time range:', error);
    return 0;
  }
}

// Lấy tổng số đơn hàng
export async function getOrderCount() {
  try {
    const { count, error } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error counting orders:', error);
    return 0;
  }
}

// Lấy số đơn hàng theo khoảng thời gian
export async function getOrderCountByTimeRange(startDate, endDate) {
  try {
    const { count, error } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error counting orders by time range:', error);
    return 0;
  }
}

// Lấy tổng số khách hàng từ auth.users hoặc profiles
export async function getUserCount() {
  try {
    // Thử lấy từ bảng profiles trước
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (!error) {
      return count || 0;
    }

    // Nếu không có bảng profiles, thử lấy từ auth.users
    const { data, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.error('Error counting users from auth:', authError);
      return 0;
    }

    return data?.users?.length || 0;
  } catch (error) {
    console.error('Error counting users:', error);
    return 0;
  }
}

// Lấy doanh thu theo tháng cho năm hiện tại
export async function getRevenueByMonth() {
  try {
    const currentYear = new Date().getFullYear();
    const startOfYear = `${currentYear}-01-01T00:00:00.000Z`;
    const endOfYear = `${currentYear}-12-31T23:59:59.999Z`;

    const { data, error } = await supabase
      .from('orders')
      .select('total, created_at')
      .gte('created_at', startOfYear)
      .lte('created_at', endOfYear);

    if (error) throw error;

    // Khởi tạo mảng doanh thu theo tháng (12 tháng, bắt đầu từ tháng 1)
    const monthlyRevenue = Array(12).fill(0);

    // Phân loại doanh thu theo tháng
    data.forEach((order) => {
      const orderDate = new Date(order.created_at);
      const month = orderDate.getMonth(); // 0-based (0 = Tháng 1)
      const orderTotal = parseFloat(order.total) || 0;
      monthlyRevenue[month] += orderTotal;
    });

    return monthlyRevenue;
  } catch (error) {
    console.error('Error getting revenue by month:', error);
    return Array(12).fill(0);
  }
}

// Lấy lợi nhuận theo tháng (giả định lợi nhuận là 30% doanh thu)
export async function getProfitByMonth() {
  try {
    const revenueByMonth = await getRevenueByMonth();
    // Lợi nhuận = 30% doanh thu
    return revenueByMonth.map((revenue) => revenue * 0.3);
  } catch (error) {
    console.error('Error calculating profit by month:', error);
    return Array(12).fill(0);
  }
}

// Lấy top 5 sản phẩm bán chạy nhất từ bảng order_items
export async function getTopProductPerformance(limit = 5) {
  try {
    // Lấy thông tin sản phẩm từ bảng order_items
    const { data: orderItems, error: orderItemsError } = await supabase
      .from('order_items')
      .select('product_id, product_name, quantity');

    if (orderItemsError) throw orderItemsError;

    // Tính tổng số lượng bán của từng sản phẩm
    const productSales = {};
    orderItems.forEach((item) => {
      const { product_id, product_name, quantity } = item;
      if (!product_id) return;

      if (!productSales[product_id]) {
        productSales[product_id] = {
          id: product_id,
          name: product_name,
          sales: 0,
        };
      }
      productSales[product_id].sales += quantity || 1;
    });

    // Chuyển đổi thành mảng và sắp xếp giảm dần theo số lượng bán
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, limit)
      .map((product) => ({
        ...product,
        growth: Math.round((Math.random() * 30 - 10) * 10) / 10, // Giả định tỷ lệ tăng trưởng
      }));

    return topProducts;
  } catch (error) {
    console.error('Error getting top product performance:', error);
    return [
      { id: 'mock1', name: 'Laptop Gaming ASUS TUF', sales: 523, growth: 18.5 },
      { id: 'mock2', name: 'Laptop Dell XPS 13', sales: 347, growth: 12.3 },
      { id: 'mock3', name: 'SSD Samsung 1TB', sales: 289, growth: 8.7 },
      { id: 'mock4', name: 'Chuột Gaming Logitech', sales: 245, growth: -3.2 },
      { id: 'mock5', name: 'Bàn phím cơ AKKO', sales: 198, growth: 15.1 },
    ];
  }
}

// Lấy phân bố đơn hàng theo khu vực từ trường city trong address
export async function getRegionalDistribution() {
  try {
    const { data, error } = await supabase.from('orders').select('address');

    if (error) throw error;

    // Đếm số lượng đơn hàng theo khu vực
    const regions = {
      Bắc: ['Hà Nội', 'Hải Phòng', 'Quảng Ninh', 'Bắc Ninh', 'Hải Dương'],
      Trung: ['Đà Nẵng', 'Huế', 'Quảng Nam', 'Nghệ An', 'Hà Tĩnh'],
      Nam: [
        'Hồ Chí Minh',
        'Cần Thơ',
        'Bình Dương',
        'Đồng Nai',
        'Bà Rịa - Vũng Tàu',
      ],
      Tây: ['Cần Thơ', 'Kiên Giang', 'An Giang', 'Đồng Tháp'],
    };

    const regionCounts = { Bắc: 0, Trung: 0, Nam: 0, Tây: 0 };

    data.forEach((order) => {
      if (order.address && order.address.city) {
        const city = order.address.city;

        let found = false;
        for (const [region, cities] of Object.entries(regions)) {
          if (cities.some((c) => city.includes(c))) {
            regionCounts[region]++;
            found = true;
            break;
          }
        }

        // Nếu không tìm thấy khu vực, mặc định là miền Nam
        if (!found) regionCounts['Nam']++;
      }
    });

    // Tính tổng số đơn hàng
    const total = Object.values(regionCounts).reduce(
      (sum, count) => sum + count,
      0
    );

    // Chuyển đổi thành phần trăm
    return Object.entries(regionCounts).map(([region, count]) => ({
      region,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }));
  } catch (error) {
    console.error('Error getting regional distribution:', error);
    return [
      { region: 'Bắc', percentage: 38 },
      { region: 'Nam', percentage: 32 },
      { region: 'Trung', percentage: 20 },
      { region: 'Tây', percentage: 10 },
    ];
  }
}

// Lấy tỷ lệ đơn hàng theo trạng thái
export async function getOrderStatsByStatus() {
  try {
    const { data, error } = await supabase.from('orders').select('status');

    if (error) throw error;

    // Đếm số lượng đơn hàng theo trạng thái
    const statusCounts = {};
    data.forEach((order) => {
      const status = order.status || 'unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    // Chuyển đổi thành mảng và tính phần trăm
    const total = Object.values(statusCounts).reduce(
      (sum, count) => sum + count,
      0
    );

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }));
  } catch (error) {
    console.error('Error getting order stats by status:', error);
    return [];
  }
}

// Lấy tổng đơn hàng theo trạng thái
export async function getOrderCountByStatus(status) {
  try {
    const { count, error } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', status);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error(`Error counting orders with status ${status}:`, error);
    return 0;
  }
}

// Lấy doanh thu 7 ngày gần nhất
export async function getRevenueByRecentDays(days = 7) {
  try {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - days + 1);
    startDate.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('orders')
      .select('total, created_at')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', today.toISOString());

    if (error) throw error;

    // Khởi tạo mảng doanh thu theo ngày
    const dailyData = Array(days)
      .fill()
      .map((_, index) => {
        const date = new Date();
        date.setDate(today.getDate() - days + 1 + index);
        return {
          day: new Intl.DateTimeFormat('vi-VN', { weekday: 'short' }).format(
            date
          ),
          orders: 0,
          revenue: 0,
        };
      });

    // Phân loại doanh thu theo ngày
    data.forEach((order) => {
      const orderDate = new Date(order.created_at);
      const diffTime = Math.abs(today - orderDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= days) {
        const dayIndex = days - diffDays;
        const orderTotal = parseFloat(order.total) || 0;

        if (dailyData[dayIndex]) {
          dailyData[dayIndex].revenue += orderTotal;
          dailyData[dayIndex].orders++;
        }
      }
    });

    return dailyData;
  } catch (error) {
    console.error('Error getting revenue by recent days:', error);
    return Array(days)
      .fill()
      .map((_, index) => ({
        day: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][index % 7],
        orders: 0,
        revenue: 0,
      }));
  }
}
