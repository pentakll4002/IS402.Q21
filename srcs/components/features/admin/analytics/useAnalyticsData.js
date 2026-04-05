import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  getOrderCount,
  getOrderStatsByStatus,
  getProfitByMonth,
  getRegionalDistribution,
  getRevenueByMonth,
  getRevenueByRecentDays,
  getTotalRevenue,
} from './apiAnalytics';

export const useAnalyticsData = (selectedYear) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [recentDaysData, setRecentDaysData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [regionalData, setRegionalData] = useState([]);
  const [summaryMetrics, setSummaryMetrics] = useState({
    revenue: '0',
    orders: 0,
    newCustomers: 0,
    profit: '0',
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const year = parseInt(selectedYear);

        const [monthlyRevenue, monthlyProfit] = await Promise.all([
          getRevenueByMonth(year),
          getProfitByMonth(year),
        ]);

        const formattedSalesData = monthlyRevenue.map((revenue, index) => {
          const profit = monthlyProfit[index] || Math.round(revenue * 0.35);
          const avgOrderValue = 2500000;
          const orders = Math.round(revenue / avgOrderValue);

          return {
            name: `T${index + 1}`,
            revenue: Math.round(revenue / 1000000),
            profit: Math.round(profit / 1000000),
            orders,
          };
        });
        setSalesData(formattedSalesData);

        const topProductsData = [
          { name: 'Laptop Asus ROG', sales: 120000000, category: 'Laptop' },
          { name: 'Chuột Logitech G Pro', sales: 35000000, category: 'Chuột' },
          { name: 'Bàn phím AKKO 3068', sales: 22000000, category: 'Bàn phím' },
        ];
        setTopProducts(topProductsData);

        const categorySales = {};
        topProductsData.forEach((product) => {
          const category =
            product.category || product.name.split(' ')[0] || 'Khác';
          categorySales[category] =
            (categorySales[category] || 0) + (product.sales || 0);
        });

        const formattedCategoryData = Object.entries(categorySales).map(
          ([name, value]) => ({ name, value })
        );
        setCategoryData(formattedCategoryData);

        const [totalRevenue, totalOrders, statusData, recentData, regionData] =
          await Promise.all([
            getTotalRevenue(),
            getOrderCount(),
            getOrderStatsByStatus(),
            getRevenueByRecentDays(7),
            getRegionalDistribution(),
          ]);

        setSummaryMetrics({
          revenue: `₫${Math.round(totalRevenue / 1000000).toLocaleString()}M`,
          orders: totalOrders,
          newCustomers: 0,
          profit: `₫${Math.round(
            (totalRevenue * 0.35) / 1000000
          ).toLocaleString()}M`,
        });

        setOrderStatusData(statusData);
        setRecentDaysData(recentData);
        setRegionalData(regionData);
      } catch (err) {
        console.error(err);
        setError('Không thể tải dữ liệu phân tích. Vui lòng thử lại sau.');
        toast.error('Lỗi kết nối dữ liệu!');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedYear]);

  return {
    salesData,
    categoryData,
    orderStatusData,
    recentDaysData,
    topProducts,
    regionalData,
    summaryMetrics,
    isLoading,
    error,
  };
};
