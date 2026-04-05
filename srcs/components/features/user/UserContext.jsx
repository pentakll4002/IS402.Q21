import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { useAuth } from "../auth/AuthContext";
import { getUserId as getSupabaseUserId } from "../products/apiProduct";
// Import will be restored when database functionality is needed
import { supabase } from "@/components/services/supabase";
import { toast } from "react-hot-toast";

const UserContext = createContext();

export function UserProvider({ children }) {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [userId, setUserId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [recentlyAddedItems, setRecentlyAddedItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [orderCount, setOrderCount] = useState({ active: 0, completed: 0, cancelled: 0 });
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUserInfo({
        fullName: user.user_metadata?.full_name || "",
        gender: user.user_metadata?.gender || "",
        phone: user.user_metadata?.phone || "",
        email: user.email,
        dob: user.user_metadata?.dob || { day: "", month: "", year: "" },
      });
      
      // Set user ID directly from auth context
      setUserId(user.id);
      
      // Fetch cart items when user is logged in
      fetchCartItems(user.id);
      
      // Fetch order counts when user is logged in
      fetchOrderCounts(user.id);
    } else {
      setUserInfo(null);
      setUserId(null);
      setCartItems([]);
      setCartCount(0);
      setOrderCount({ active: 0, completed: 0, cancelled: 0 });
    }
  }, [user]);

  // Function to get user ID (for consistency with apiProduct.js)
  const getUserId = async () => {
    // Return from state if available to avoid unnecessary Supabase calls
    if (userId) return userId;
    
    // Otherwise, use the function from apiProduct.js
    return await getSupabaseUserId();
  };

  // Fetch order counts for badges and notifications
  const fetchOrderCounts = async (uid) => {
    if (!uid) return;
    
    setIsOrdersLoading(true);
    
    try {
      // First, try to get a sample record to check the schema
      const { data: sampleData, error: sampleError } = await supabase
        .from('orders')
        .select('*')
        .limit(1);
        
      if (sampleError) {
        console.error("Error fetching sample order:", sampleError);
        setOrderCount({ active: 0, completed: 0, cancelled: 0 });
        setIsOrdersLoading(false);
        return;
      }
      
      // Determine the correct column name for user ID
      let userIdColumn = 'user_id';
      
      if (sampleData && sampleData.length > 0) {
        const firstRecord = sampleData[0];
        // Check if userId (camelCase) exists instead of user_id (snake_case)
        if (Object.prototype.hasOwnProperty.call(firstRecord, 'userId') && 
            !Object.prototype.hasOwnProperty.call(firstRecord, 'user_id')) {
          userIdColumn = 'userId';
          console.log("Using 'userId' column instead of 'user_id'");
        }
        // Check if userid (lowercase) exists
        else if (Object.prototype.hasOwnProperty.call(firstRecord, 'userid') && 
                !Object.prototype.hasOwnProperty.call(firstRecord, 'user_id')) {
          userIdColumn = 'userid';
          console.log("Using 'userid' column instead of 'user_id'");
        }
      } else {
        console.log("No sample data available to determine schema");
        setOrderCount({ active: 0, completed: 0, cancelled: 0 });
        setIsOrdersLoading(false);
        return;
      }
      
      // Now use the correct column name for all queries
      
      // Get active orders (pending, processing, shipping)
      const { data: activeOrders, error: activeError } = await supabase
        .from('orders')
        .select('id')
        .eq(userIdColumn, uid)
        .in('status', ['pending', 'processing', 'shipping']);
        
      if (activeError) {
        console.error("Error fetching active orders:", activeError);
        return;
      }
      
      // Get completed orders
      const { data: completedOrders, error: completedError } = await supabase
        .from('orders')
        .select('id')
        .eq(userIdColumn, uid)
        .eq('status', 'completed');
        
      if (completedError) {
        console.error("Error fetching completed orders:", completedError);
        return;
      }
      
      // Get cancelled and refunded orders
      const { data: cancelledOrders, error: cancelledError } = await supabase
        .from('orders')
        .select('id')
        .eq(userIdColumn, uid)
        .in('status', ['cancelled', 'refunded']);
        
      if (cancelledError) {
        console.error("Error fetching cancelled orders:", cancelledError);
        return;
      }
      
      // Set counts based on array lengths
      setOrderCount({
        active: Array.isArray(activeOrders) ? activeOrders.length : 0,
        completed: Array.isArray(completedOrders) ? completedOrders.length : 0,
        cancelled: Array.isArray(cancelledOrders) ? cancelledOrders.length : 0
      });
      
    } catch (error) {
      console.error("Error fetching order counts:", error);
      setOrderCount({ active: 0, completed: 0, cancelled: 0 });
    } finally {
      setIsOrdersLoading(false);
    }
  };

  // Fetch cart items from database or local storage
  const fetchCartItems = async (uid) => {
    if (!uid) return;
    
    setIsCartLoading(true);
    
    try {
      // Instead of querying Supabase for a non-existent table, use local storage
      // Note: We'll use localStorage for all cart operations until the database is set up
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        const parsedCart = JSON.parse(localCart);
        setCartItems(parsedCart);
        setCartCount(parsedCart.reduce((total, item) => total + (item.quantity || 1), 0));
      } else {
        // Initialize with empty cart
        setCartItems([]);
        setCartCount(0);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      // Initialize with empty cart on error
      setCartItems([]);
      setCartCount(0);
    } finally {
      setIsCartLoading(false);
    }
  };

  // Sync local cart to database - Temporarily mocked until database is set up
  const syncLocalCartToDatabase = async () => {
    // This function is mocked for now and will be implemented when cart_items table is created
    console.log("Cart sync functionality will be available when database tables are created");
    // The real implementation will be added when the database schema is updated
  };

  // Add item to cart
  const addToCart = useCallback(async (product, quantity = 1, showToast = true) => {
    if (!product) return;
    
    try {
      const userId = await getUserId();
      
      // Use localStorage for all cart operations until database is set up
      const localCart = localStorage.getItem('cart');
      let updatedCart = [];
      
      if (localCart) {
        updatedCart = JSON.parse(localCart);
        const existingItemIndex = updatedCart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex >= 0) {
          // Update quantity for existing item
          updatedCart[existingItemIndex].quantity = 
            (updatedCart[existingItemIndex].quantity || 1) + quantity;
        } else {
          // Add new item
          updatedCart.push({
            ...product,
            quantity: quantity
          });
        }
      } else {
        // Create new cart with this item
        updatedCart = [{ ...product, quantity: quantity }];
      }
      
      // Update local storage
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      
      // Update state
      setCartItems(updatedCart);
      
      // Update cart count
      updateCartCount();
      
      // Add to recently added items
      addToRecentlyAdded(product);
      
      // For future implementation - will sync cart to database when tables are ready
      if (userId) {
        syncLocalCartToDatabase();
      }
      
      // Show toast notification if needed
      if (showToast) {
        toast.success(`Đã thêm ${quantity} ${product.title || 'sản phẩm'} vào giỏ hàng!`, {
          icon: '🛒',
          duration: 3000
        });
      }
      
      return true;
    } catch (error) {
      console.error("Error adding item to cart:", error);
      if (showToast) {
        toast.error("Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.");
      }
      return false;
    }
  }, [cartItems]);

  // Add to recently added items
  const addToRecentlyAdded = (product) => {
    // Remove if exists already
    const updatedRecent = recentlyAddedItems.filter(item => 
      item.id !== product.id
    );
    
    // Add at the beginning (most recent)
    setRecentlyAddedItems([product, ...updatedRecent].slice(0, 5));
    
    // Also store in local storage for persistence
    localStorage.setItem('recentlyAddedItems', JSON.stringify([product, ...updatedRecent].slice(0, 5)));
  };

  // Update cart count
  const updateCartCount = () => {
    const newCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
    setCartCount(newCount);
  };

  // Remove item from cart
  const removeFromCart = useCallback(async (itemId) => {
    try {
      // Use localStorage for all cart operations until database is set up
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        const updatedCart = JSON.parse(localCart).filter(item => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        
        // Update local state
        setCartItems(updatedCart);
        
        // Update cart count
        updateCartCount();
      }
      
      toast.success("Sản phẩm đã được xóa khỏi giỏ hàng!");
      return true;
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("Không thể xóa sản phẩm khỏi giỏ hàng. Vui lòng thử lại sau.");
      return false;
    }
  }, []);

  // Update item quantity in cart
  const updateCartItemQuantity = useCallback(async (itemId, newQuantity) => {
    try {
      // Use localStorage for all cart operations until database is set up
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        const parsedCart = JSON.parse(localCart);
        const updatedCart = parsedCart.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        );
        
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        
        // Update local state
        setCartItems(updatedCart);
        
        // Update cart count
        updateCartCount();
      }
      
      return true;
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      toast.error("Không thể cập nhật số lượng. Vui lòng thử lại sau.");
      return false;
    }
  }, []);

  // Clear entire cart
  const clearCart = useCallback(async () => {
    try {
      // Use localStorage for all cart operations until database is configured
      // Clear local storage cart
      localStorage.removeItem('cart');
      
      // Clear state
      setCartItems([]);
      setCartCount(0);
      
      return true;
    } catch (error) {
      console.error("Error clearing cart:", error);
      return false;
    }
  }, []);
  
  // Create a new order
  const createOrder = useCallback(async (orderData) => {
    try {
      const userId = await getUserId();
      if (!userId) {
        toast.error("Vui lòng đăng nhập để đặt hàng!");
        return false;
      }
      
      // First, check the orders table structure to determine the correct column name
      const { data: sampleData, error: sampleError } = await supabase
        .from('orders')
        .select('*')
        .limit(1);
      
      // Determine the correct column name for user ID
      let userIdColumn = 'user_id';
      
      if (!sampleError && sampleData && sampleData.length > 0) {
        const firstRecord = sampleData[0];
        // Check if userId (camelCase) exists instead of user_id (snake_case)
        if (Object.prototype.hasOwnProperty.call(firstRecord, 'userId') && 
            !Object.prototype.hasOwnProperty.call(firstRecord, 'user_id')) {
          userIdColumn = 'userId';
          console.log("Using 'userId' column instead of 'user_id'");
        }
        // Check if userid (lowercase) exists
        else if (Object.prototype.hasOwnProperty.call(firstRecord, 'userid') && 
                !Object.prototype.hasOwnProperty.call(firstRecord, 'user_id')) {
          userIdColumn = 'userid';
          console.log("Using 'userid' column instead of 'user_id'");
        }
      }
      
      // Add user ID to order data with the correct column name
      const orderWithUserId = {
        ...orderData,
        status: 'pending',
        order_date: new Date().toISOString(),
        created_at: new Date().toISOString()
      };
      
      // Set the user ID with the correct column name
      orderWithUserId[userIdColumn] = userId;
      
      // Insert into orders table
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderWithUserId)
        .select()
        .single();
        
      if (orderError) throw orderError;
      
      // Get order items from cart
      const orderItems = orderData.product_info.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.title || item.name,
        quantity: item.quantity,
        price: item.price,
        image_url: item.thumbnail || item.image,
        created_at: new Date().toISOString()
      }));
      
      // Insert into order_items table
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
        
      if (itemsError) throw itemsError;
      
      // Clear cart after successful order
      await clearCart();
      
      // Update order counts
      await fetchOrderCounts(userId);
      
      toast.success("Đặt hàng thành công!");
      return order.id;
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Không thể tạo đơn hàng. Vui lòng thử lại sau.");
      return false;
    }
  }, [clearCart]);

  return (
    <UserContext.Provider value={{ 
      userInfo, 
      setUserInfo, 
      getUserId, 
      userId,
      cartItems,
      cartCount,
      isCartLoading,
      recentlyAddedItems,
      orderCount,
      isOrdersLoading,
      fetchOrderCounts,
      createOrder,
      addToCart,
      removeFromCart,
      updateCartItemQuantity,
      clearCart
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
