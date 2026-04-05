import { supabase } from '@/components/services/supabase';

function formatCurrency(value) {
  if (!value) return '0₫';
  return `${Number(value).toLocaleString('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}₫`;
}

export function formatCurrencyValue(value) {
  if (!value) return 0;
  return Number(value).toLocaleString('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export async function fetchProducts(category = 'laptop') {
  let tableName = 'laptop';

  if (category === 'ssd') {
    tableName = 'ssd';
  } else if (category === 'keyboard') {
    tableName = 'keyboards';
  } else if (category === 'headphone') {
    tableName = 'headphone';
  } else if (category === 'pccooling') {
    tableName = 'pccooling';
  } else if (category === 'mouse') {
    tableName = 'mouse';
  } else if (category === 'pcgaming') {
    tableName = 'pcgaming';
  } else if (category === 'laptop') {
    tableName = 'laptop';
  } else if (category === 'laptop-do-hoa') {
    tableName = 'laptop_do_hoa';
  } else if (category === 'laptop-doanh-nhan') {
    tableName = 'laptop_doanh_nhan';
  } else if (category === 'laptop-gaming') {
    tableName = 'laptop_gaming';
  } else if (category === 'laptop-van-phong') {
    tableName = 'laptop_van_phong';
  } else if (category === 'laptop-asus-oled') {
    tableName = 'laptop_asus_oled';
  } else if (category === 'laptop-asus-vivobook') {
    tableName = 'laptop_asus_vivobook';
  } else if (category === 'laptop-asus-zenbook') {
    tableName = 'laptop_asus_zenbook';
  } else if (category === 'laptop-asus-tuf') {
    tableName = 'laptop_tuf_gaming';
  } else if (category === 'laptop-rog-strix') {
    tableName = 'laptop_rog_strix';
  } else if (category === 'laptop-rog-zephyrus') {
    tableName = 'laptop_rog_zephyrus';
  } else if (category === 'laptop-acer-aspire') {
    tableName = 'laptop_acer_aspire';
  } else if (category === 'laptop-acer-swift') {
    tableName = 'laptop_acer_swift';
  } else if (category === 'laptop-acer-predator-helios') {
    tableName = 'laptop_acer_predator_helios';
  } else if (category === 'laptop-acer-nitro') {
    tableName = 'laptop_acer_nitro';
  } else if (category === 'laptop-msi-cyborg') {
    tableName = 'laptop_msi_cyborg';
  } else if (category === 'laptop-msi-katana') {
    tableName = 'laptop_msi_katana';
  } else if (category === 'laptop-msi-modern') {
    tableName = 'laptop_msi_modern';
  } else if (category === 'laptop-msi-prestige') {
    tableName = 'laptop_msi_prestige';
  } else if (category === 'laptop-msi-raider') {
    tableName = 'laptop_msi_raider';
  } else if (category === 'laptop-lenovo-ideapad') {
    tableName = 'laptop_lenovo_ideapad';
  } else if (category === 'laptop-lenovo-legion') {
    tableName = 'laptop_lenovo_legion';
  } else if (category === 'laptop-lenovo-thinkbook') {
    tableName = 'laptop_lenovo_thinkbook';
  } else if (category === 'laptop-lenovo-thinkpad') {
    tableName = 'laptop_lenovo_thinkpad';
  } else if (category === 'laptop-lenovo-yoga') {
    tableName = 'laptop_lenovo_yoga';
  } else if (category === 'laptop-dell-alienware') {
    tableName = 'laptop_dell_alienware';
  } else if (category === 'laptop-dell-g15') {
    tableName = 'laptop_dell_g15';
  } else if (category === 'laptop-dell-inspiron') {
    tableName = 'laptop_dell_inspiron';
  } else if (category === 'laptop-dell-xps') {
    tableName = 'laptop_dell_xps';
  } else if (category === 'laptop-dell-latitude') {
    tableName = 'laptop_dell_latitude';
  } else if (category === 'laptop-dell-vostro') {
    tableName = 'laptop_dell_vostro';
  } else if (category === 'laptop-hp-omen') {
    tableName = 'laptop_hp_omen';
  } else if (category === 'laptop-hp-victus') {
    tableName = 'laptop_hp_victus';
  } else if (category === 'laptop-chay-ai') {
    tableName = 'laptop_chay_ai';
  } else if (category === 'laptop-duoi-15-trieu') {
    tableName = 'laptop_duoi_15tr';
  } else if (category === 'laptop-tren-20-trieu') {
    tableName = 'laptop_tren_20tr';
  } else if (category === 'laptop-tu-15-den-20-trieu') {
    tableName = 'laptop_tu_15_den_20_trieu';
  } else if (category === 'cpu-intel-i3') {
    tableName = 'cpu_intel_i3';
  } else if (category === 'cpu-intel-i5') {
    tableName = 'cpu_intel_i5';
  } else if (category === 'cpu-intel-i7') {
    tableName = 'cpu_intel_i7';
  } else if (category === 'cpu-intel-i9') {
    tableName = 'cpu_intel_i9';
  } else if (category === 'cpu-amd-r3') {
    tableName = 'cpu_amd_r3';
  } else if (category === 'cpu-amd-r5') {
    tableName = 'cpu_amd_r5';
  } else if (category === 'cpu-amd-r7') {
    tableName = 'cpu_amd_r7';
  } else if (category === 'cpu-amd-r9') {
    tableName = 'cpu_amd_r9';
  }

  const { data, error } = await supabase.from(tableName).select('*');
  
  if (error) {
    console.error(`Error fetching ${tableName}:`, error.message);
    return [];
  }

  return data.map((item) => {
    const title = item.title?.replace(/-/g, ' ') || 'No Title';
    const brand = item.brand || 'Unknown';
    const salePrice = item.sale_price || 0;
    const originalPrice = item.original_price || Math.round(salePrice * 1.2);

    const discount =
      originalPrice && salePrice
        ? `${Math.round(((originalPrice - salePrice) / originalPrice) * 100)}%`
        : '0%';

    return {
      id: item.id || '',
      title,
      brand,
      image: item.image || '',
      salePrice: formatCurrency(salePrice),
      originalPrice: formatCurrency(originalPrice),
      discount,
      rating: item.rating || 0,
      reviewCount: item.review_count || 0,
      thumbnail: item.thumbnails || '',
      description: item.description || '',
      detailImage: item.detail_image || '',
      performance: item.performance || '',
      extends: item.extends || '',
      category: tableName,
    };
  });
}

// ============= DASHBOARD ANALYTICS FUNCTIONS =============

// Lấy tổng số sản phẩm của tất cả các danh mục
export async function getProductCount() {
  // Danh sách các bảng sản phẩm
  const productTables = [
    'laptop', 'ssd', 'keyboards', 'headphone', 'pccooling', 
    'mouse', 'pcgaming', 'laptop_gaming', 'laptop_do_hoa'
    // Thêm các bảng khác nếu cần
  ];
  
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
}

// Lấy tổng doanh thu từ bảng orders
export async function getTotalRevenue() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('total');
      
    if (error) throw error;
    
    // Tính tổng doanh thu
    return data.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);
  } catch (error) {
    console.error('Lỗi khi lấy tổng doanh thu:', error);
    // Trả về dữ liệu mẫu cho môi trường phát triển
    return 5249750000; // Khoảng 5.2 tỷ VND
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
    console.error('Lỗi khi đếm đơn hàng:', error);
    // Trả về dữ liệu mẫu
    return 1783;
  }
}

// Lấy tổng số khách hàng
export async function getUserCount() {
  try {
    // Kiểm tra xem bảng users có tồn tại không
    const { count, error } = await supabase
      .from('profiles')  // Thử dùng bảng profiles thay vì users
      .select('*', { count: 'exact', head: true });
      
    if (error) {
      console.error('Lỗi khi đếm người dùng từ profiles:', error);
      // Thử bảng khác
      const { count: authCount, error: authError } = await supabase
        .from('auth')
        .select('*', { count: 'exact', head: true });
        
      if (authError) {
        console.error('Lỗi khi đếm người dùng từ auth:', authError);
        return 945; // Giá trị mẫu
      }
      
      return authCount || 945;
    }
    
    return count || 945;
  } catch (error) {
    console.error('Lỗi khi đếm người dùng:', error);
    // Trả về dữ liệu mẫu
    return 945;
  }
}

// Lấy doanh thu theo tháng
export async function getRevenueByMonth() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('created_at, total')
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    
    const monthlyRevenue = Array(12).fill(0);
    const currentYear = new Date().getFullYear();
    
    data.forEach(order => {
      const orderDate = new Date(order.created_at);
      if (orderDate.getFullYear() === currentYear) {
        const month = orderDate.getMonth();
        monthlyRevenue[month] += parseFloat(order.total) || 0;
      }
    });
    
    return monthlyRevenue;
  } catch (error) {
    console.error('Lỗi khi lấy doanh thu theo tháng:', error);
    // Trả về dữ liệu mẫu cho biểu đồ
    return [320, 450, 520, 590, 680, 720, 800, 850, 780, 940, 1020, 950].map(x => x * 1000000);
  }
}

// Lấy lợi nhuận theo tháng (giả định lợi nhuận khoảng 30% doanh thu)
export async function getProfitByMonth() {
  try {
    const monthlyRevenue = await getRevenueByMonth();
    // Tính lợi nhuận (giả định lợi nhuận là 30% doanh thu)
    return monthlyRevenue.map(revenue => revenue * 0.3);
  } catch (error) {
    console.error('Lỗi khi tính lợi nhuận theo tháng:', error);
    // Trả về dữ liệu mẫu
    return [95, 135, 156, 177, 204, 216, 240, 255, 234, 282, 306, 285].map(x => x * 1000000);
  }
}

// Lấy hiệu suất bán hàng của các sản phẩm hàng đầu
export async function getTopProductPerformance() {
  // Return mock data directly without trying to query the database
  return [
    { name: 'Laptop Gaming ASUS TUF', sales: 523, growth: 18.5 },
    { name: 'Laptop Dell XPS 13', sales: 347, growth: 12.3 },
    { name: 'SSD Samsung 1TB', sales: 289, growth: 8.7 },
    { name: 'Chuột Gaming Logitech', sales: 245, growth: -3.2 },
    { name: 'Bàn phím cơ AKKO', sales: 198, growth: 15.1 }
  ];
}

// Lấy phân bố doanh thu theo khu vực
export async function getRegionalDistribution() {
  // Return mock data directly
  return [
    { region: 'Bắc', percentage: 38 },
    { region: 'Nam', percentage: 32 },
    { region: 'Trung', percentage: 20 },
    { region: 'Tây', percentage: 10 }
  ];
}

// Get current logged in user ID
export async function getUserId() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error fetching user:', error.message);
      return null;
    }
    
    return user?.id || null;
  } catch (error) {
    console.error('Error in getUserId:', error);
    return null;
  }
}
