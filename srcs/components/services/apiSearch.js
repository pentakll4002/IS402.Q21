import { supabase } from './supabase';

export const fetchProductsByTitle = async (title) => {
  if (!title) return [];

  const { data, error } = await supabase
    .from('product')
    .select('*')
    .ilike('title', `%${title}%`)
    .order('rating', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Lỗi khi tìm kiếm sản phẩm:', error.message);
    return [];
  }

  return data;
};
