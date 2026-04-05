import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import {
  FaUserShield,
  FaUser,
  FaShoppingBag,
  FaSignOutAlt,
} from 'react-icons/fa';

function UserDropdownMenu({
  onClose,
  onGoToUser,
  onGoToOrders,
  onGoToAdmin,
  onSignOut,
  isAdmin: isAdminProp,
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(isAdminProp || false);

  useEffect(() => {
    // Prioritize the prop value if provided
    if (isAdminProp !== undefined) {
      setIsAdmin(isAdminProp);
      return;
    }

    async function checkAdminRole() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setIsAdmin(false);
          return;
        }

        try {
          // First, check the user_admin table structure
          const { data: sampleData, error: sampleError } = await supabase
            .from('user_admin')
            .select('*')
            .limit(1);

          if (sampleError) {
            console.error('Error checking user_admin table:', sampleError);
            setIsAdmin(false);
            return;
          }

          // Determine the correct column name for user ID
          let userIdColumn = 'user_id';

          if (sampleData && sampleData.length > 0) {
            const firstRecord = sampleData[0];
            // Check if userId (camelCase) exists instead of user_id (snake_case)
            if (
              Object.prototype.hasOwnProperty.call(firstRecord, 'userId') &&
              !Object.prototype.hasOwnProperty.call(firstRecord, 'user_id')
            ) {
              userIdColumn = 'userId';
              console.log("Using 'userId' column instead of 'user_id'");
            }
            // Check if userid (lowercase) exists
            else if (
              Object.prototype.hasOwnProperty.call(firstRecord, 'userid') &&
              !Object.prototype.hasOwnProperty.call(firstRecord, 'user_id')
            ) {
              userIdColumn = 'userid';
              console.log("Using 'userid' column instead of 'user_id'");
            }
          }

          // Query the user_admin table to check for admin role
          const { data, error } = await supabase
            .from('user_admin')
            .select('role')
            .eq(userIdColumn, user.id)
            .eq('role', 'admin');

          if (error) {
            console.error('Error checking admin role:', error);
            setIsAdmin(false);
            return;
          }

          // Check if we got any results back
          setIsAdmin(Array.isArray(data) && data.length > 0);
        } catch (error) {
          console.error('Lỗi khi kiểm tra vai trò admin:', error);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Lỗi khi kiểm tra vai trò admin:', error);
        setIsAdmin(false);
      }
    }

    checkAdminRole();
  }, [isAdminProp]);

  return (
    <div className='absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg py-2 z-50'>
      <button
        className='w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2'
        onClick={() => {
          onGoToUser();
          onClose();
        }}
      >
        <FaUser className='text-gray-600' />
        Thông tin tài khoản
      </button>
      <button
        className='w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2'
        onClick={() => {
          onGoToOrders();
          onClose();
        }}
      >
        <FaShoppingBag className='text-gray-600' />
        Đơn hàng của tôi
      </button>
      {isAdmin && (
        <button
          className='w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-blue-600 font-medium'
          onClick={() => {
            if (onGoToAdmin) {
              onGoToAdmin();
            } else {
              window.location.href = '/admin';
              onClose();
            }
          }}
        >
          <FaUserShield className='text-blue-600' />
          Quản lý hệ thống
        </button>
      )}
      <button
        className='w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center gap-2'
        onClick={() => setShowConfirm(true)}
      >
        <FaSignOutAlt className='text-red-600' />
        Đăng xuất
      </button>

      {showConfirm && (
        <div className='fixed inset-0 bg-black/30 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-sm shadow-lg text-center'>
            <h2 className='text-lg font-semibold mb-4'>
              Bạn chắc chắn muốn đăng xuất?
            </h2>
            <div className='flex justify-center gap-4'>
              <button
                className='px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition'
                onClick={() => setShowConfirm(false)}
              >
                Hủy
              </button>
              <button
                className='px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition'
                onClick={() => {
                  onSignOut();
                  onClose();
                  setShowConfirm(false);
                }}
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDropdownMenu;
