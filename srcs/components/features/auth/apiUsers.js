import { supabase } from '@/components/services/supabase';

// Lấy danh sách tất cả người dùng
export async function getAllUsers() {
  const { data, error } = await supabase.from('profiles').select('*');

  if (error) {
    console.error('Lỗi khi lấy danh sách người dùng:', error);
    throw new Error('Không thể tải danh sách người dùng');
  }

  return data;
}

//Lấy thông tin 1 user theo ID
export async function getUserById(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Lỗi khi lấy thông tin user:', error);
    throw new Error('Không thể tìm thấy người dùng');
  }

  return data;
}

//Cập nhật vai trò (role) của user
export async function updateUser(id, updates) {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Lỗi khi cập nhật người dùng:', error);
    throw new Error('Không thể cập nhật thông tin người dùng');
  }

  return true;
}

//Tính số lượng user theo vai trò
export async function countUsersByRole() {
  const users = await getAllUsers();

  const counts = {
    total: users.length,
    admin: users.filter((u) => u.role === 'admin').length,
    user: users.filter((u) => u.role === 'user').length,
    recent: users.filter((u) => {
      const createdAt = new Date(u.created_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return createdAt > thirtyDaysAgo;
    }).length,
  };

  return counts;
}

//Xoá user
export async function deleteUserById(userId) {
  const { error } = await supabase.from('profiles').delete().eq('id', userId);

  if (error) {
    console.error('Lỗi khi xoá người dùng:', error);
    throw new Error('Không thể xoá người dùng');
  }

  return true;
}
