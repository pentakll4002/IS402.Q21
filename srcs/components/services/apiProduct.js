import { supabase } from './supabase';

export async function getProduct() {
  let { data: product, error } = await supabase.from('product').select('*');

  if (error) {
    console.error(error);
    throw new Error('Không tìm thấy dữ liệu');
  }

  return product;
}

export async function createProduct(newProduct) {
  const { data, error } = await supabase
    .from('product')
    .insert([newProduct])
    .select();

  if (error) {
    console.error(error);
    throw new Error('Không thể thêm sản phẩm');
  }

  return data;
}

export async function deleteProduct(id) {
  const { data, error } = await supabase.from('product').delete().eq('id', id);

  if (error) {
    console.error(error);
    throw new Error('Không thể xoá sản phẩm');
  }

  return data;
}

export async function countProduct() {
  const { count, error } = await supabase
    .from('product')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Lỗi đếm sản phẩm:', error.message);
    return 0;
  }

  return count || 0;
}

export const getFeaturedProducts = async (category) => {
  let query = supabase.from('product').select('*');

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Lỗi get featured:', error);
    throw new Error('Không thể tải sản phẩm nổi bật');
  }

  return data;
};

export async function getProductById(id) {
  const { data, error } = await supabase
    .from('product')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Lỗi khi lấy chi tiết sản phẩm:', error.message);
    throw new Error('Không tìm thấy sản phẩm');
  }

  return data;
}

// Lấy tổng doanh thu
export async function getTotalRevenue() {
  const { data, error } = await supabase.from('orders').select('total_amount');

  if (error) {
    console.error('Lỗi lấy tổng doanh thu:', error.message);
    return 0;
  }

  // Tính tổng từ mảng các đơn hàng
  const totalRevenue = data.reduce(
    (sum, order) => sum + (order.total_amount || 0),
    0
  );
  return totalRevenue;
}

// Đếm tổng số đơn hàng
export async function countOrders() {
  const { count, error } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Lỗi đếm đơn hàng:', error.message);
    return 0;
  }

  return count || 0;
}

// Đếm tổng số khách hàng
export async function countCustomers() {
  const { count, error } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Lỗi đếm khách hàng:', error.message);
    return 0;
  }

  return count || 0;
}

// Lấy doanh thu theo tháng
export async function getRevenueByMonth(year = new Date().getFullYear()) {
  // Tạo mảng chứa doanh thu theo tháng, mặc định là 0
  const monthlyRevenue = Array(12).fill(0);

  const { data, error } = await supabase
    .from('orders')
    .select('created_at, total_amount')
    .gte('created_at', `${year}-01-01`)
    .lte('created_at', `${year}-12-31`);

  if (error) {
    console.error('Lỗi lấy doanh thu theo tháng:', error.message);
    return monthlyRevenue;
  }

  // Tính doanh thu cho từng tháng
  data.forEach((order) => {
    const orderDate = new Date(order.created_at);
    const month = orderDate.getMonth(); // 0-11
    monthlyRevenue[month] += order.total_amount || 0;
  });

  return monthlyRevenue;
}

// Lấy hiệu suất của sản phẩm (top 5 sản phẩm bán chạy)
export async function getProductPerformance() {
  const { data, error } = await supabase
    .from('order_items')
    .select(
      `
      quantity,
      product_id,
      product:product_id (name, price)
    `
    )
    .order('quantity', { ascending: false });

  if (error) {
    console.error('Lỗi lấy hiệu suất sản phẩm:', error.message);
    return [];
  }

  // Nhóm theo sản phẩm và tính tổng số lượng bán
  const productMap = new Map();

  data.forEach((item) => {
    if (!item.product) return;

    const productId = item.product_id;
    const currentData = productMap.get(productId) || {
      name: item.product.name,
      sales: 0,
      revenue: 0,
    };

    currentData.sales += item.quantity || 0;
    currentData.revenue += (item.quantity || 0) * (item.product.price || 0);

    productMap.set(productId, currentData);
  });

  // Chuyển đổi Map thành mảng và sắp xếp theo doanh số
  const productPerformance = Array.from(productMap.values())
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5)
    .map((product) => ({
      ...product,
      // Tính % tăng trưởng - trong thực tế cần so sánh với dữ liệu tháng trước
      growth: Math.round((Math.random() * 30 - 10) * 10) / 10, // Giả lập dữ liệu
    }));

  return productPerformance;
}

// Lấy phân bố doanh thu theo khu vực
export async function getRevenueByRegion() {
  const { data, error } = await supabase.from('orders').select(`
      total_amount,
      shipping_address,
      user:user_id (address)
    `);

  if (error) {
    console.error('Lỗi lấy doanh thu theo khu vực:', error.message);
    return [];
  }

  // Giả lập phân chia theo khu vực - trong thực tế cần phân tích shipping_address
  const regions = ['Bắc', 'Nam', 'Trung', 'Tây'];
  const regionMap = new Map(regions.map((region) => [region, 0]));

  data.forEach((order) => {
    // Giả lập phân bổ doanh thu vào khu vực
    const region = regions[Math.floor(Math.random() * regions.length)];
    regionMap.set(region, regionMap.get(region) + (order.total_amount || 0));
  });

  // Tính tổng doanh thu
  const totalRevenue = Array.from(regionMap.values()).reduce(
    (sum, value) => sum + value,
    0
  );

  // Chuyển đổi sang định dạng phần trăm
  const regionData = Array.from(regionMap.entries()).map(
    ([region, amount]) => ({
      region,
      amount,
      percentage:
        totalRevenue > 0 ? Math.round((amount / totalRevenue) * 100) : 0,
    })
  );

  return regionData;
}
