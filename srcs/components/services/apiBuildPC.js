import { supabase } from './supabase';

export async function getProductsByCategory(category) {
  let { data: product, error } = await supabase
    .from('product')
    .select('*')
    .eq('category', category);

  if (error) {
    console.error(error);
    throw new Error('Không tìm thấy dữ liệu');
  }

  return product;
}
