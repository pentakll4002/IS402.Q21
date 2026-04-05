import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../features/auth/AuthContext';

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function checkAdminRole() {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Lỗi khi kiểm tra vai trò người dùng:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data?.role === 'admin');
        }

        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi kiểm tra quyền admin:', error);
        setIsAdmin(false);
        setLoading(false);
      }
    }

    checkAdminRole();
  }, [user]);

  return { isAdmin, loading };
}
