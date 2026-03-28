import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  MessageSquare, 
  Calendar,
  ArrowLeft,
  Download,
  Activity,
  Package,
  Mail,
  Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AnalyticsStats {
  discoveryByStatus: Record<string, number>;
  messagesByStatus: Record<string, number>;
  ordersByStatus: Record<string, number>;
  monthlyTrends: {
    labels: string[];
    requests: number[];
    messages: number[];
    orders: number[];
  };
  overview: {
    totalRequests: number;
    totalMessages: number;
    totalOrders: number;
    totalRevenue: number;
    totalUsers: number;
    totalVisitors: number;
    uniqueVisitors: number;
  };
}

const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [timeRange, setTimeRange] = useState('30'); // days

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch Discovery Requests
      const { data: discoveryData } = await supabase
        .from('discovery_requests')
        .select('created_at, status');

      // Fetch Contact Messages
      const { data: messagesData } = await supabase
        .from('contact_messages')
        .select('created_at, status');

      // Fetch Orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('created_at, status, total_amount');

      // Fetch Users
      const { count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Fetch Visitors
      const { data: visitsData } = await supabase
        .from('site_visits')
        .select('session_id');

      if (discoveryData && messagesData && ordersData) {
        // Calculate status distributions
        const discoveryByStatus = discoveryData.reduce((acc: Record<string, number>, curr) => {
          acc[curr.status] = (acc[curr.status] || 0) + 1;
          return acc;
        }, {});

        const messagesByStatus = messagesData.reduce((acc: Record<string, number>, curr) => {
          acc[curr.status] = (acc[curr.status] || 0) + 1;
          return acc;
        }, {});

        const ordersByStatus = ordersData.reduce((acc: Record<string, number>, curr) => {
          acc[curr.status] = (acc[curr.status] || 0) + 1;
          return acc;
        }, {});

        // Monthly trends (last 6 months)
        const labels: string[] = [];
        const monthlyRequests: number[] = [];
        const monthlyMessages: number[] = [];
        const monthlyOrders: number[] = [];

        for (let i = 5; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          const monthLabel = date.toLocaleString('tr-TR', { month: 'long' });
          labels.push(monthLabel);

          const monthYear = `${date.getMonth()}-${date.getFullYear()}`;
          
          monthlyRequests.push(discoveryData.filter((d: any) => {
            const dDate = new Date(d.created_at);
            return `${dDate.getMonth()}-${dDate.getFullYear()}` === monthYear;
          }).length);

          monthlyMessages.push(messagesData.filter((m: any) => {
            const mDate = new Date(m.created_at);
            return `${mDate.getMonth()}-${mDate.getFullYear()}` === monthYear;
          }).length);

          monthlyOrders.push(ordersData.filter((o: any) => {
            const oDate = new Date(o.created_at);
            return `${oDate.getMonth()}-${oDate.getFullYear()}` === monthYear;
          }).length);
        }

        const totalRevenue = ordersData.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0);

        const uniqueVisitors = visitsData ? new Set(visitsData.map((v: any) => v.session_id)).size : 0;
        const totalVisitors = visitsData ? visitsData.length : 0;

        setStats({
          discoveryByStatus,
          messagesByStatus,
          ordersByStatus,
          monthlyTrends: {
            labels,
            requests: monthlyRequests,
            messages: monthlyMessages,
            orders: monthlyOrders
          },
          overview: {
            totalRequests: discoveryData.length,
            totalMessages: messagesData.length,
            totalOrders: ordersData.length,
            totalRevenue,
            totalUsers: usersCount || 0,
            totalVisitors,
            uniqueVisitors
          }
        });
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pest-green-700"></div>
      </div>
    );
  }

  const trendData = {
    labels: stats.monthlyTrends.labels,
    datasets: [
      {
        label: 'Keşif Talepleri',
        data: stats.monthlyTrends.requests,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'İletişim Mesajları',
        data: stats.monthlyTrends.messages,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Siparişler',
        data: stats.monthlyTrends.orders,
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.5)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const discoveryStatusData = {
    labels: Object.keys(stats.discoveryByStatus),
    datasets: [
      {
        data: Object.values(stats.discoveryByStatus),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(168, 85, 247, 0.8)'
        ],
        borderWidth: 1
      }
    ]
  };

  const orderStatusData = {
    labels: Object.keys(stats.ordersByStatus),
    datasets: [
      {
        data: Object.values(stats.ordersByStatus),
        backgroundColor: [
          'rgba(168, 85, 247, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/admin/dashboard" className="mr-4 text-gray-500 hover:text-gray-700 transition-colors">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Activity className="h-8 w-8 text-indigo-600 mr-3" />
                Ziyaretçi ve Sistem Analitiği
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="7">Son 7 Gün</option>
                <option value="30">Son 30 Gün</option>
                <option value="90">Son 90 Gün</option>
                <option value="365">Son 1 Yıl</option>
              </select>
              <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                <Download className="h-4 w-4" />
                <span>Rapor İndir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center transition-transform hover:scale-[1.02]">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Keşif Talepleri</p>
              <p className="text-2xl font-bold text-gray-900">{stats.overview.totalRequests}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center transition-transform hover:scale-[1.02]">
            <div className="p-3 bg-green-50 rounded-lg">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Mesajlar</p>
              <p className="text-2xl font-bold text-gray-900">{stats.overview.totalMessages}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center transition-transform hover:scale-[1.02]">
            <div className="p-3 bg-purple-50 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Siparişler</p>
              <p className="text-2xl font-bold text-gray-900">{stats.overview.totalOrders}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center transition-transform hover:scale-[1.02]">
            <div className="p-3 bg-amber-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Hasılat</p>
              <p className="text-2xl font-bold text-gray-900">₺{stats.overview.totalRevenue.toLocaleString('tr-TR')}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center transition-transform hover:scale-[1.02]">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanıcılar</p>
              <p className="text-2xl font-bold text-gray-900">{stats.overview.totalUsers}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center transition-transform hover:scale-[1.02]">
            <div className="p-3 bg-rose-50 rounded-lg">
              <Activity className="h-6 w-6 text-rose-600" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tekil Ziyaretçi</p>
              <p className="text-2xl font-bold text-gray-900">{stats.overview.uniqueVisitors}</p>
            </div>
          </div>
        </div>

        {/* Main Trends Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Sistem Etkileşim Trendleri</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Activity className="h-4 w-4" />
              <span>Son 6 Aylık Veriler</span>
            </div>
          </div>
          <div className="h-[400px]">
            <Line 
              data={trendData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom' }
                },
                scales: {
                  y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                  x: { grid: { display: false } }
                }
              }} 
            />
          </div>
        </div>

        {/* Status Distribution Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Keşif Talebi Durumları</h3>
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/2 h-[250px]">
                <Doughnut 
                  data={discoveryStatusData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                  }}
                />
              </div>
              <div className="w-full md:w-1/2 mt-6 md:mt-0 md:pl-8">
                <div className="space-y-3">
                  {Object.entries(stats.discoveryByStatus).map(([status, count], index) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: discoveryStatusData.datasets[0].backgroundColor[index] }}></div>
                        <span className="text-sm text-gray-600 capitalize">{status}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Sipariş Durumları</h3>
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/2 h-[250px]">
                <Doughnut 
                  data={orderStatusData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                  }}
                />
              </div>
              <div className="w-full md:w-1/2 mt-6 md:mt-0 md:pl-8">
                <div className="space-y-3">
                  {Object.entries(stats.ordersByStatus).map(([status, count], index) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: orderStatusData.datasets[0].backgroundColor[index] }}></div>
                        <span className="text-sm text-gray-600 capitalize">{status}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Sistem Özet Bilgileri</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Package className="h-5 w-5 text-blue-600 mr-2" />
                <h4 className="font-semibold text-gray-900">Ürün Performansı</h4>
              </div>
              <p className="text-sm text-gray-600">En çok satan 5 ürünü ve stok durumlarını görmek için ürün yönetimine gidin.</p>
              <Link to="/admin/products" className="text-indigo-600 text-sm font-medium mt-3 inline-block hover:underline">Ürünleri Yönet →</Link>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Mail className="h-5 w-5 text-green-600 mr-2" />
                <h4 className="font-semibold text-gray-900">Kampanya Etkisi</h4>
              </div>
              <p className="text-sm text-gray-600">E-posta kampanyalarınızın geri dönüşlerini ve etkileşim oranlarını inceleyin.</p>
              <Link to="/admin/email-campaigns" className="text-indigo-600 text-sm font-medium mt-3 inline-block hover:underline">Kampanyaları Gör →</Link>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Briefcase className="h-5 w-5 text-amber-600 mr-2" />
                <h4 className="font-semibold text-gray-900">Başvurular</h4>
              </div>
              <p className="text-sm text-gray-600">Bayilik ve iş başvurularını detaylı olarak incelemek ve yanıtlamak için tıklayın.</p>
              <div className="flex space-x-4 mt-3">
                <Link to="/admin/franchise-applications" className="text-indigo-600 text-sm font-medium hover:underline">Bayilik →</Link>
                <Link to="/admin/job-applications" className="text-indigo-600 text-sm font-medium hover:underline">İş →</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;
