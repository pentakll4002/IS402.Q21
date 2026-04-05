import { FaCreditCard, FaMoneyBillWave, FaWallet, FaQrcode, FaDownload, FaSpinner, FaExclamationCircle, FaTerminal } from 'react-icons/fa';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// QR server utility functions built directly into component
const QR_SERVER_URLS = ['http://127.0.0.1:8001', 'http://localhost:8001'];
const MOCK_QR_DATA = {
  qr_image_base64: "iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAOdSURBVO3BQY4kRxIAQdVA/f/Leh87NQK6B0hmyTCHjfgZa/zCWuMX1hq/sNb4hbXGL6w1fmGt8QtrjV9Ya/zCWuMX1hq/sNb4hbXGL6w1fuGDl0D+UsVNoJO6E8idil9SMVNxE+gk8pcq3lhr/MJa4xfWGr/w4WEVTwI9CXRSdxKYKk4qJoGTipOKE4EnFU9aa/zCWuMX1hq/8OGXBbpTcRK4U3ES6E7FSeBJxU2gOxVPAroT+JcE7qw1fmGt8QtrjV/48P8M0EnFpOKk4i8FelLFSeBE4KRiErij8X9nrfELa41fWGv8woe/rOImMFXcBE4qJoGbikngpGIS6ATuVEwCk8A/aa3xC2uNX1hr/MKHX1bxJoGp4k5FJ3CnojtPAj0J3Kk4qegEJoEnFW9aa/zCWuMX1hq/8OFhAv+SQHcqJoGp4omKSeAk0FPFJDAJdAJ3KiaBSeAvWWv8wlrjF9Yav/DhZRU3gSeBTuBEYKp4EnhS0VU8CZxUTAJPKm4qnrTW+IW1xi+sNX7hw8ME7lRMAneCnoBOxSRwp6ITeBI4qZgETgQ6gU6gE5gq7qw1fmGt8QtrjV/48LKKk4qbQE8VJ4FO4CbQCXQCJxWTwFTRCdwETgQmgZOKTmCqeNJa4xfWGr+w1viFDw8T+JcqOoFJoBOYKu4IdAJ3Km4CncBJxSTQCZwI/JecVEwCb1hr/MJa4xfWGr/w4WEVJxWTwE3FJNAJdBWTwFTxJHAnMFV0An+JwFRxEjgReNJa4xfWGr+w1viFDy8T+EsqJoFJYKroKjqBN1WcCEwVncBJxSRwUjEJdAJ3Kt601viFtcYvrDV+4cMvq7gJnFTcBJ4EnlScVNwEOoFOYBI4EZgqTio6gZOKTuBNAm9aa/zCWuMX1hq/8OFhAp3AScWbKiaBO4GbipvAJHBT0Ql0ApPAVHESOKl4UjEJ3Flr/MJa4xfWGr/w4X9MxSTQVdwETiomgTsVJwKTwFTRCXQCncBNxSQwCUwVT1pr/MJa4xfWGr/w4WUCf0mgE+gETipOKiaB7jypOBHoKjqBSeAk8CRwp+JJa41fWGv8wlrjFz48rOIvEegqJoFJ4KTipOKXVNwRegLoBDqBJ601fmGt8QtrjV/48DCBvxS4qegq7lRMAneFTuCkohOYBCaBk4qbQCfwprXGL6w1fmGt8QsfXibwlyreBPQkcBI4qZgEbiomgUngTkUncBI4qZgqnrTW+IW1xi+sNX5hrfELa41fWGv8wlrjF9Yav7DW+IW1xi+sNX5hrfELa41fWGv8wlrjF/4H3Iaa2rU/5rsAAAAASUVORK5CYII=",
  amount: 1000000,
  note: "DEMO_QR_CODE",
  mb_link: "https://example.com/mbqr",
  momo_uri: "momo://?action=pay&amount=1000000"
};

// Check if QR server is running - improved version with shorter timeout
const checkQrServer = async (url) => {
  try {
    console.log(`Checking QR server at ${url}/health...`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500); // 1.5 second timeout
    
    const response = await axios.get(`${url}/health`, { 
      timeout: 1500,
      headers: { 'Cache-Control': 'no-cache' },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.status === 200) {
      console.log(`QR server is running at ${url}`);
      return url;
    }
  } catch (error) {
    console.warn(`QR server not available at ${url}: ${error.message}`);
  }
  return null;
};

// Try all possible server URLs
const getQrServerUrl = async () => {
  console.log("Attempting to find available QR server...");
  // Try to reach each server URL in parallel for faster detection
  const results = await Promise.allSettled(
    QR_SERVER_URLS.map(url => checkQrServer(url))
  );
  
  // Find the first successful result
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value) {
      return result.value;
    }
  }
  
  console.warn("No QR server available, using fallback URL");
  return QR_SERVER_URLS[0]; // Default fallback
};

function PaymentMethods({ paymentMethod, setPaymentMethod, orderInfo }) {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiUrl, setApiUrl] = useState('http://127.0.0.1:8001'); 
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [showServerInstructions, setShowServerInstructions] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking'); // 'online', 'offline', 'checking'

  // Initialize QR server URL on component mount
  useEffect(() => {
    const initServer = async () => {
      setServerStatus('checking');
      try {
        const serverUrl = await getQrServerUrl();
        setApiUrl(serverUrl);
        
        // Test if we can actually connect
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);
        
        try {
          await axios.get(`${serverUrl}/health`, { 
            timeout: 1500,
            signal: controller.signal
          });
          setServerStatus('online');
        } catch (error) {
          console.warn("Health check failed:", error.message);
          setServerStatus('offline');
        } finally {
          clearTimeout(timeoutId);
        }
      } catch (error) {
        console.error("Error initializing server:", error);
        setServerStatus('offline');
      }
    };
    
    initServer();
    
    // Check server status every 30 seconds
    const intervalId = setInterval(async () => {
      try {
        const available = await checkQrServer(apiUrl);
        setServerStatus(available ? 'online' : 'offline');
      } catch (error) {
        setServerStatus('offline');
      }
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Format price to VND
  const formatPrice = (price) => {
    if (!price && price !== 0) return "0 ₫";
    
    try {
      // Convert to string if it's a number
      const priceStr = typeof price === 'number' ? price.toString() : price;
      // Remove non-digit characters if it's a string
      const numericPrice = priceStr.replace ? parseInt(priceStr.replace(/[^\d]/g, '')) : parseInt(priceStr);
      return numericPrice.toLocaleString('vi-VN') + " ₫";
    } catch (error) {
      console.error('Error formatting price:', error, price);
      return (price || 0) + " ₫";
    }
  };

  const methods = [
    { 
      id: "cod", 
      label: "Thanh toán khi nhận hàng", 
      icon: <FaMoneyBillWave className="text-2xl text-green-600" />,
      description: "Thanh toán bằng tiền mặt khi nhận hàng tại địa chỉ của bạn."
    },
    { 
      id: "bank", 
      label: "Thanh toán qua ngân hàng", 
      icon: <FaCreditCard className="text-2xl text-blue-600" />,
      description: "Chuyển khoản qua tài khoản ngân hàng MBBank của chúng tôi."
    },
    { 
      id: "wallet", 
      label: "Thanh toán qua ví điện tử", 
      icon: <FaWallet className="text-2xl text-purple-600" />,
      description: "Thanh toán qua ví điện tử Momo nhanh chóng, tiện lợi."
    },
  ];

  // Hàm lấy tổng giá trị đơn hàng nếu có
  const getOrderAmount = useCallback(() => {
    if (!orderInfo || !orderInfo.product) return 100000; // Default amount
    
    try {
      let amount = 0;
      if (orderInfo.product.salePrice) {
        const salePrice = typeof orderInfo.product.salePrice === 'string' 
          ? parseInt(orderInfo.product.salePrice.replace(/[^\d]/g, '')) 
          : orderInfo.product.salePrice;
        amount = salePrice * (orderInfo.product.quantity || 1);
      }
      
      // Trừ giảm giá nếu có
      if (orderInfo.discount && orderInfo.discount.amount) {
        amount -= orderInfo.discount.amount;
      }
      
      return amount;
    } catch (error) {
      console.error('Error calculating order amount:', error);
      return 100000; // Default amount
    }
  }, [orderInfo]);

  // Fetch QR code based on payment method
  const fetchQrCode = useCallback(async () => {
    // Clear any existing errors
    setError(null);
    
    // Skip if payment method is COD
    if (paymentMethod === 'cod') {
      setQrData(null);
      return;
    }
    
    try {
      setLoading(true);
      
      // Only try to fetch if server status is online, otherwise use mock data
      if (serverStatus === 'online') {
        // Attempt to get a working server URL
        try {
          const serverUrl = await getQrServerUrl();
          
          if (serverUrl) {
            setApiUrl(serverUrl);
            
            // Determine the endpoint based on payment method
            // Sử dụng endpoint mới với template KE2heNu
            const endpoint = paymentMethod === 'bank' ? '/mb/qr' : '/momo/qr';
            
            // Generate a reference ID for the payment
            const refId = `ORD${Date.now().toString().slice(-6)}`;
            
            // Get amount from order info if available
            const amount = getOrderAmount();
            
            console.log(`Fetching QR code from ${serverUrl}${endpoint} with amount ${amount}`);
            
            const response = await axios.get(`${serverUrl}${endpoint}`, {
              params: {
                amount: amount,
                order_id: refId
              },
              timeout: 2500 // Slightly longer timeout for actual data fetch
            });
            
            setQrData(response.data);
            console.log('QR Data received:', response.data);
            setServerStatus('online'); // Update status since we successfully connected
            return;
          } else {
            throw new Error('No available server URL');
          }
        } catch (initialError) {
          console.error('Failed to fetch QR code:', initialError);
          throw initialError;
        }
      } else {
        throw new Error('QR server is offline');
      }
    } catch (error) {
      console.error('Error fetching QR code:', error);
      setServerStatus('offline');
      
      // Create a mock QR code data for better user experience
      const mockData = {
        ...MOCK_QR_DATA,
        amount: getOrderAmount(),
        note: `ThanhToan_ORD${Date.now().toString().slice(-6)}`,
        is_mock: true
      };
      
      setQrData(mockData);
      setError('Máy chủ QR không phản hồi. Chúng tôi hiển thị mã QR demo, vui lòng sử dụng thông tin chuyển khoản bên dưới để hoàn tất thanh toán.');
    } finally {
      setLoading(false);
    }
  }, [paymentMethod, apiUrl, getOrderAmount, serverStatus]);

  // Check server status when component mounts
  const checkServerStatus = useCallback(async () => {
    try {
      setServerStatus('checking');
      const serverUrl = await getQrServerUrl();
      if (serverUrl) {
        setApiUrl(serverUrl);
        setServerStatus('online');
        return true;
      } else {
        setServerStatus('offline');
        return false;
      }
    } catch (error) {
      console.error("Error checking server status:", error);
      setServerStatus('offline');
      return false;
    }
  }, []);

  // Set up automatic refresh when payment method changes
  useEffect(() => {
    // Clear previous interval if exists
    if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }

    // Fetch QR code immediately when payment method changes
    if (paymentMethod === 'bank' || paymentMethod === 'wallet') {
      fetchQrCode();
      
      // Set up interval to refresh QR code every 30 seconds
      const interval = setInterval(() => {
        console.log('Refreshing QR code...');
        fetchQrCode();
      }, 30000); // 30 seconds
      
      setRefreshInterval(interval);
    }

    // Clean up interval on unmount
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [paymentMethod, fetchQrCode]);
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [refreshInterval]);

  // Get payment method name
  const getPaymentName = () => {
    if (paymentMethod === 'bank') return 'MBBank';
    if (paymentMethod === 'wallet') return 'Momo';
    return '';
  };

  // Add a helper function to open server status page
  const openServerStatusPage = useCallback(() => {
    window.open('/qr-server-status.html', '_blank');
  }, []);

  // Add helper function to start server
  const startQrServer = useCallback(() => {
    // Create a hidden iframe to run the batch file (won't work due to security restrictions)
    // Instead, we'll show instructions to the user
    setShowServerInstructions(true);
  }, []);

  return (
    <section className="bg-white rounded-2xl shadow-lg p-6 mb-8 transition-all duration-300 hover:shadow-xl">
      {/* Server Status Banner */}
      {(paymentMethod === 'bank' || paymentMethod === 'wallet') && (
        <div className={`mb-4 p-3 rounded-lg text-sm flex items-center justify-between ${
          serverStatus === 'online' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : serverStatus === 'offline' 
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
        }`}>
          <div className="flex items-center gap-2">
            {serverStatus === 'online' ? (
              <>
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span>Máy chủ QR đang hoạt động</span>
              </>
            ) : serverStatus === 'offline' ? (
              <>
                <span className="h-3 w-3 bg-red-500 rounded-full"></span>
                <span>Máy chủ QR đang offline</span>
              </>
            ) : (
              <>
                <FaSpinner className="animate-spin text-yellow-500" />
                <span>Đang kiểm tra kết nối máy chủ QR...</span>
              </>
            )}
          </div>
          <div className="flex gap-2">
            {serverStatus === 'offline' && (
              <button 
                onClick={startQrServer}
                className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
              >
                <FaTerminal size={10} /> Khởi động server
              </button>
            )}
            <button 
              onClick={checkServerStatus}
              className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Kiểm tra lại
            </button>
            <button 
              onClick={openServerStatusPage}
              className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Chi tiết
            </button>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Phương thức thanh toán</h2>

      <div className="flex flex-col gap-4">
        {methods.map((method) => (
          <div 
            key={method.id} 
            className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
              paymentMethod === method.id 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => setPaymentMethod(method.id)}
          >
            <input
              type="radio"
              id={method.id}
              name="payment-method"
              checked={paymentMethod === method.id}
              onChange={() => setPaymentMethod(method.id)}
              className="hidden"
            />
            <label
              htmlFor={method.id}
              className="flex items-center gap-4 cursor-pointer w-full"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
                {method.icon}
              </div>
              <div className="flex-1">
                <p className="font-medium text-lg text-gray-800">{method.label}</p>
                <p className="text-sm text-gray-500">{method.description}</p>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === method.id 
                    ? "border-blue-500 bg-blue-500" 
                    : "border-gray-300"
                }`}
              >
                {paymentMethod === method.id && (
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                )}
              </div>
            </label>
          </div>
        ))}
      </div>

      {/* QR Code Server Instructions - Show when there's an error connecting */}
      {showServerInstructions && (
        <div className="mt-4 mb-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-800 mb-1">Khởi động máy chủ QR</h4>
          <p className="text-xs text-yellow-700 mb-2">Để tạo mã QR thanh toán thật, vui lòng:</p>
          <ol className="text-xs text-yellow-700 pl-5 list-decimal">
            <li>Mở thư mục dự án (C:\Users\Admin\Desktop\ok\IS207_P21)</li>
            <li>Chạy (double-click) file <strong>start-payment-server.bat</strong> hoặc <strong>run_qr_server.bat</strong></li>
            <li>Giữ cửa sổ terminal mở khi sử dụng tính năng thanh toán</li>
            <li>Sau đó quay lại đây và nhấn "Kiểm tra lại"</li>
          </ol>
          <div className="flex gap-2 mt-2">
            <button 
              onClick={() => setShowServerInstructions(false)}
              className="text-xs text-blue-600 hover:text-blue-800">
              Đã hiểu
            </button>
            <button 
              onClick={openServerStatusPage}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1">
              <FaExclamationCircle size={10} /> Kiểm tra trạng thái server
            </button>
          </div>
        </div>
      )}

      {/* QR Code Section - Displayed for both bank and wallet */}
      {(paymentMethod === "bank" || paymentMethod === "wallet") && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <FaQrcode className="text-blue-600" />
            Mã QR thanh toán {getPaymentName()}
          </h3>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FaSpinner className="animate-spin text-blue-500 text-3xl mb-2" />
              <p className="text-sm text-gray-500">Đang tạo mã QR...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 text-red-500">
              <FaExclamationCircle className="text-3xl mb-2" />
              <p className="text-sm text-center max-w-md">
                {error}
                <button 
                  onClick={openServerStatusPage}
                  className="ml-2 text-blue-500 hover:underline text-sm inline-flex items-center"
                >
                  <FaExclamationCircle className="mr-1" size={12} />
                  Kiểm tra server
                </button>
              </p>
              
              {/* Always show payment info with error for reliability */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 w-full max-w-md">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-800">Thông tin chuyển khoản:</h4>
                  <button 
                    onClick={() => setShowServerInstructions(!showServerInstructions)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    {showServerInstructions ? 'Ẩn hướng dẫn' : 'Xem hướng dẫn khắc phục'}
                  </button>
                </div>
                
                {showServerInstructions && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs">
                    <h5 className="font-medium text-blue-800 mb-1">Khởi động QR Server</h5>
                    <ol className="list-decimal pl-4 text-blue-700 space-y-1">
                      <li>Mở thư mục dự án (C:\Users\Admin\Desktop\ok\IS207_P21)</li>
                      <li>Tìm và chạy (double-click) file <strong>start-payment-server.bat</strong></li>
                      <li>Giữ cửa sổ terminal mở trong khi sử dụng tính năng thanh toán</li>
                      <li>
                        <button 
                          onClick={openServerStatusPage}
                          className="text-blue-600 hover:underline inline-flex items-center"
                        >
                          <FaExclamationCircle className="mr-1" size={10} />
                          Mở trang kiểm tra trạng thái server
                        </button>
                      </li>
                    </ol>
                  </div>
                )}
                
                {paymentMethod === 'bank' && (
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Ngân hàng:</span> MB Bank</p>
                    <p><span className="font-medium">Số tài khoản:</span> 0982685374</p>
                    <p><span className="font-medium">Chủ tài khoản:</span> DANG THIEN AN</p>
                    <p><span className="font-medium">Số tiền:</span> {formatPrice(getOrderAmount())}</p>
                    <p><span className="font-medium">Nội dung CK:</span> ThanhToan_ORD{Date.now().toString().slice(-6)}</p>
                  </div>
                )}
                
                {paymentMethod === 'wallet' && (
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Ví MoMo:</span> 0982685374</p>
                    <p><span className="font-medium">Tên:</span> DANG THIEN AN</p>
                    <p><span className="font-medium">Số tiền:</span> {formatPrice(getOrderAmount())}</p>
                    <p><span className="font-medium">Nội dung CK:</span> ThanhToan_ORD{Date.now().toString().slice(-6)}</p>
                  </div>
                )}
              </div>
              
              <button 
                onClick={fetchQrCode}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Thử lại
              </button>
            </div>
          ) : qrData ? (
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1">
                <div className="bg-gray-50 p-4 rounded-xl flex justify-center">
                  {qrData.qr_image_base64 ? (
                    <img 
                      src={`data:image/png;base64,${qrData.qr_image_base64}`}
                      alt="QR thanh toán" 
                      className="max-w-[250px]"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[250px] w-[250px] bg-gray-100 rounded-lg">
                      <FaExclamationCircle className="text-red-500 text-3xl mb-2" />
                      <p className="text-sm text-center text-gray-600">Không thể tạo mã QR</p>
                    </div>
                  )}
                </div>
                {qrData.is_mock && (
                  <div className="mt-2 text-xs text-red-500 text-center">
                    <FaExclamationCircle className="inline-block mr-1" />
                    Đây là mã QR demo, vui lòng sử dụng thông tin chuyển khoản bên dưới
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">Số tiền:</span>
                    <span className="text-blue-600 font-bold">{formatPrice(qrData.amount)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">Nội dung:</span>
                    <span>{qrData.note}</span>
                  </div>
                  
                  <p className="text-xs text-gray-500 bg-yellow-50 p-2 rounded-lg border border-yellow-200">
                    Mã QR sẽ tự động làm mới sau 30 giây để đảm bảo tính bảo mật
                  </p>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        // Download QR code as image
                        const link = document.createElement('a');
                        link.href = `data:image/png;base64,${qrData.qr_image_base64}`;
                        link.download = `payment-qr-${qrData.note}.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors"
                    >
                      <FaDownload /> Tải mã QR
                    </button>
                    
                    {paymentMethod === 'wallet' && qrData.momo_uri && (
                      <a 
                        href={qrData.momo_uri}
                        className="flex-1 flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg transition-colors"
                      >
                        <FaWallet /> Mở Momo
                      </a>
                    )}
                    
                    {paymentMethod === 'bank' && qrData.mb_link && (
                      <a 
                        href={qrData.mb_link}
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-colors"
                      >
                        <FaCreditCard /> Mở MBBank
                      </a>
                    )}
                  </div>
                  
                  {/* Always show manual payment info for reliability */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm">
                    <h5 className="font-medium text-gray-700 mb-2">Thông tin chuyển khoản thủ công:</h5>
                    {paymentMethod === 'bank' && (
                      <div className="space-y-1 text-xs">
                        <p><span className="font-medium">Số tài khoản:</span> 0982685374</p>
                        <p><span className="font-medium">Chủ TK:</span> DANG THIEN AN (MBBANK)</p>
                        <p><span className="font-medium">Nội dung:</span> {qrData.note}</p>
                      </div>
                    )}
                    
                    {paymentMethod === 'wallet' && (
                      <div className="space-y-1 text-xs">
                        <p><span className="font-medium">Số Momo:</span> 0982685374</p>
                        <p><span className="font-medium">Tên:</span> DANG THIEN AN</p>
                        <p><span className="font-medium">Nội dung:</span> {qrData.note}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-8">
              <button 
                onClick={fetchQrCode}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tạo mã QR thanh toán
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default PaymentMethods;
