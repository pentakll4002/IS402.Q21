import { supabase } from '@/components/services/supabase';

const CATEGORY_TABLE_MAP = {
  laptop: 'laptop',
  ssd: 'ssd',
  keyboard: 'keyboards',
  headphone: 'headphone',
  pccooling: 'pccooling',
  mouse: 'mouse',
  pcgaming: 'pcgaming',
  product: 'product',
  'laptop-do-hoa': 'laptop_do_hoa',
  'laptop-doanh-nhan': 'laptop_doanh_nhan',
  'laptop-gaming': 'laptop_gaming',
  'laptop-van-phong': 'laptop_van_phong',
  'laptop-asus-oled': 'laptop_asus_oled',
  'laptop-asus-vivobook': 'laptop_asus_vivobook',
  'laptop-asus-zenbook': 'laptop_asus_zenbook',
  'laptop-asus-tuf': 'laptop_tuf_gaming',
  'laptop-rog-strix': 'laptop_rog_strix',
  'laptop-rog-zephyrus': 'laptop_rog_zephyrus',
  'laptop-acer-aspire': 'laptop_acer_aspire',
  'laptop-acer-swift': 'laptop_acer_swift',
  'laptop-acer-predator-helios': 'laptop_acer_predator_helios',
  'laptop-acer-nitro': 'laptop_acer_nitro',
  'laptop-msi-cyborg': 'laptop_msi_cyborg',
  'laptop-msi-katana': 'laptop_msi_katana',
  'laptop-msi-modern': 'laptop_msi_modern',
  'laptop-msi-prestige': 'laptop_msi_prestige',
  'laptop-msi-raider': 'laptop_msi_raider',
  'laptop-lenovo-ideapad': 'laptop_lenovo_ideapad',
  'laptop-lenovo-legion': 'laptop_lenovo_legion',
  'laptop-lenovo-thinkbook': 'laptop_lenovo_thinkbook',
  'laptop-lenovo-thinkpad': 'laptop_lenovo_thinkpad',
  'laptop-lenovo-yoga': 'laptop_lenovo_yoga',
  'laptop-dell-alienware': 'laptop_dell_alienware',
  'laptop-dell-g15': 'laptop_dell_g15',
  'laptop-dell-inspiron': 'laptop_dell_inspiron',
  'laptop-dell-xps': 'laptop_dell_xps',
  'laptop-dell-latitude': 'laptop_dell_latitude',
  'laptop-dell-vostro': 'laptop_dell_vostro',
  'laptop-hp-omen': 'laptop_hp_omen',
  'laptop-hp-victus': 'laptop_hp_victus',
  'laptop-chay-ai': 'laptop_chay_ai',
  'laptop-duoi-15-trieu': 'laptop_duoi_15tr',
  'laptop-tren-20-trieu': 'laptop_tren_20tr',
  'laptop-tu-15-den-20-trieu': 'laptop_tu_15_den_20_trieu',
  'cpu-intel-i3': 'cpu_intel_i3',
  'cpu-intel-i5': 'cpu_intel_i5',
  'cpu-intel-i7': 'cpu_intel_i7',
  'cpu-intel-i9': 'cpu_intel_i9',
  'cpu-amd-r3': 'cpu_amd_r3',
  'cpu-amd-r5': 'cpu_amd_r5',
  'cpu-amd-r7': 'cpu_amd_r7',
  'cpu-amd-r9': 'cpu_amd_r9',
};

export function formatCurrency(value) {
  if (!value || isNaN(value)) return '₫0';
  return `₫${Number(value).toLocaleString('vi-VN')}`;
}

export async function fetchProducts(category = 'laptop') {
  const tableName = CATEGORY_TABLE_MAP[category] || 'laptop';

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

export async function getUserId() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

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
