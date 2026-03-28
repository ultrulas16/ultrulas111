  import { useState, useEffect } from 'react'
  import { Link } from 'react-router-dom'
  import { useAuth } from '../../contexts/AuthContext'
  import { supabase } from '../../lib/supabase'
  import { 
    Users, 
    MessageSquare, 
    Calendar, 
    LogOut, 
    Mail, 
    Phone, 
    Clock,
    Eye,
    FileText,
    Settings,
    Package,
    ShoppingCart,
    Search,
    Building,
    Briefcase,
    UserCog,
    Activity,
    CheckSquare,
    Send,
    ChevronRight,
    Monitor,
    Globe,
    Zap
  } from 'lucide-react'
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
    Filler,
    ArcElement
  } from 'chart.js'
  import { Line } from 'react-chartjs-2'

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
  )

  interface DashboardStats {
    totalDiscoveryRequests: number
    totalContactMessages: number
    totalDocuments: number
    totalProducts: number
    totalOrders: number
    pendingRequests: number
    completedRequests: number
    newMessages: number
    respondedMessages: number
    activeDocuments: number
    activeProducts: number
    pendingOrders: number
    totalFranchiseApplications: number
    totalJobApplications: number
    totalUsers: number
    totalSurveys: number
    totalSurveyResponses: number
    totalEmailCampaigns: number
    totalEmailsSent: number
    totalVisitors: number
    uniqueVisitors: number
  }

  interface DiscoveryRequest {
    id: string
    name: string
    email: string
    phone: string
    service_type: string
    message: string
    status: string
    priority: string
    created_at: string
  }

  interface ContactMessage {
    id: string
    name: string
    email: string
    subject: string
    message: string
    status: string
    priority: string
    created_at: string
  }

  interface Order {
    id: string
    order_number: string
    customer_name: string
    customer_email: string
    total_amount: number
    status: string
    payment_status: string
    created_at: string
  }

  const DashboardPage = () => {
    const { user, signOut } = useAuth()
    const [stats, setStats] = useState<DashboardStats>({
      totalDiscoveryRequests: 0,
      totalContactMessages: 0,
      totalDocuments: 0,
      totalProducts: 0,
      totalOrders: 0,
      pendingRequests: 0,
      completedRequests: 0,
      newMessages: 0,
      respondedMessages: 0,
      activeDocuments: 0,
      activeProducts: 0,
      pendingOrders: 0,
      totalFranchiseApplications: 0,
      totalJobApplications: 0,
      totalUsers: 0,
      totalSurveys: 0,
      totalSurveyResponses: 0,
      totalEmailCampaigns: 0,
      totalEmailsSent: 0,
      totalVisitors: 0,
      uniqueVisitors: 0
    })
    const [recentDiscoveryRequests, setRecentDiscoveryRequests] = useState<DiscoveryRequest[]>([])
    const [recentContactMessages, setRecentContactMessages] = useState<ContactMessage[]>([])
    const [recentOrders, setRecentOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
      try {
        // Fetch discovery requests stats
        const { data: discoveryRequests } = await supabase
          .from('discovery_requests')
          .select('*')
          .order('created_at', { ascending: false })

        // Fetch contact messages stats
        const { data: contactMessages } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false })

        // Fetch documents stats
        const { data: documents } = await supabase
          .from('documents')
          .select('*')

        // Fetch products stats
        const { data: products } = await supabase
          .from('products')
          .select('*')

        // Fetch orders stats
        const { data: orders } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          
        // Fetch franchise applications stats
        const { data: franchiseApplications } = await supabase
          .from('franchise_applications')
          .select('*')
          
        // Fetch job applications stats
        const { data: jobApplications } = await supabase
          .from('job_applications')
          .select('*')
          
        // Fetch users stats
        const { data: users } = await supabase
          .from('users')
          .select('*')
          
        // Fetch surveys stats
        const { data: surveys } = await supabase
          .from('surveys')
          .select('*')
          
        // Fetch survey responses stats
        const { data: surveyResponses } = await supabase
          .from('survey_responses')
          .select('*')
          
        // Fetch email campaigns stats
        const { data: emailCampaigns } = await supabase
          .from('email_campaigns')
          .select('*')

        // Fetch visitors count
        const { data: visitsData } = await supabase
          .from('site_visits')
          .select('session_id')

        if (discoveryRequests && contactMessages && documents && products && orders) {
          const pendingRequests = discoveryRequests.filter(req => 
            ['new', 'contacted', 'scheduled'].includes(req.status)
          ).length

          const completedRequests = discoveryRequests.filter(req => 
            req.status === 'completed'
          ).length

          const newMessages = contactMessages.filter(msg => 
            ['new', 'read'].includes(msg.status)
          ).length

          const respondedMessages = contactMessages.filter(msg => 
            ['responded', 'resolved'].includes(msg.status)
          ).length

          const activeDocuments = documents.filter(doc => doc.is_active).length
          const activeProducts = products.filter(product => product.is_active).length
          const pendingOrders = orders.filter(order => 
            ['pending', 'confirmed', 'processing'].includes(order.status)
          ).length
          
          // Count sent email campaigns
          const sentEmails = emailCampaigns ? emailCampaigns.filter(campaign => 
            campaign.status === 'sent'
          ).length : 0

          setStats({
            totalDiscoveryRequests: discoveryRequests.length,
            totalContactMessages: contactMessages.length,
            totalDocuments: documents.length,
            totalProducts: products.length,
            totalOrders: orders.length,
            pendingRequests,
            completedRequests,
            newMessages,
            respondedMessages,
            activeDocuments,
            activeProducts,
            pendingOrders,
            totalFranchiseApplications: franchiseApplications?.length || 0,
            totalJobApplications: jobApplications?.length || 0,
            totalUsers: users?.length || 0,
            totalSurveys: surveys?.length || 0,
            totalSurveyResponses: surveyResponses?.length || 0,
            totalEmailCampaigns: emailCampaigns?.length || 0,
            totalEmailsSent: sentEmails,
            totalVisitors: visitsData?.length || 0,
            uniqueVisitors: visitsData ? new Set(visitsData.map((v: any) => v.session_id)).size : 0
          })

          setRecentDiscoveryRequests(discoveryRequests.slice(0, 5))
          setRecentContactMessages(contactMessages.slice(0, 5))
          setRecentOrders(orders.slice(0, 5))
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    const handleSignOut = async () => {
      await signOut()
    }

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'new': return 'bg-blue-100 text-blue-800'
        case 'contacted': return 'bg-yellow-100 text-yellow-800'
        case 'scheduled': return 'bg-purple-100 text-purple-800'
        case 'completed': return 'bg-green-100 text-green-800'
        case 'cancelled': return 'bg-red-100 text-red-800'
        case 'read': return 'bg-gray-100 text-gray-800'
        case 'in_progress': return 'bg-orange-100 text-orange-800'
        case 'responded': return 'bg-green-100 text-green-800'
        case 'resolved': return 'bg-emerald-100 text-emerald-800'
        case 'pending': return 'bg-yellow-100 text-yellow-800'
        case 'confirmed': return 'bg-blue-100 text-blue-800'
        case 'processing': return 'bg-purple-100 text-purple-800'
        case 'shipped': return 'bg-indigo-100 text-indigo-800'
        case 'delivered': return 'bg-green-100 text-green-800'
        default: return 'bg-gray-100 text-gray-800'
      }
    }

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pest-green-600"></div>
            <p className="mt-4 text-gray-600 font-medium">Veriler yükleniyor...</p>
          </div>
        </div>
      )
    }

    const chartData = {
      labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
      datasets: [
        {
          label: 'Talepler',
          data: [12, 19, 3, 5, 2, 3, 9],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Mesajlar',
          data: [7, 11, 5, 8, 3, 7, 12],
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
          tension: 0.4,
          fill: true
        }
      ]
    }

    return (
      <div className="min-h-screen bg-gray-50/50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center">
                <Link to="/admin/dashboard" className="flex items-center">
                  <div className="p-2 bg-pest-green-50 rounded-xl mr-3">
                    <Monitor className="h-8 w-8 text-pest-green-600" />
                  </div>
                  <div>
                    <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">PestMentor</h1>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">Kontrol Paneli</p>
                  </div>
                </Link>
              </div>
              <div className="hidden lg:flex items-center space-x-1">
                {[
                  { to: "/admin/discovery-requests", icon: Search, label: "Keşif" },
                  { to: "/admin/documents", icon: FileText, label: "Döküman" },
                  { to: "/admin/products", icon: Package, label: "Ürünler" },
                  { to: "/admin/orders", icon: ShoppingCart, label: "Siparişler" },
                  { to: "/admin/analytics", icon: Activity, label: "Analitik" }
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-gray-600 hover:text-pest-green-600 hover:bg-pest-green-50 rounded-xl transition-all"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
              <div className="flex items-center space-x-4 border-l pl-6">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-900">{user?.email?.split('@')[0]}</p>
                  <p className="text-xs text-gray-500">Yönetici</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  title="Güvenli Çıkış"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Welcome Section */}
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-gray-900 leading-tight">Hoş Geldiniz, <span className="text-pest-green-600">{user?.email?.split('@')[0]}</span></h2>
              <p className="text-gray-500 mt-1 font-medium">İşte bugün sitenizde olup bitenlerin özeti.</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-bold text-gray-700">{stats.uniqueVisitors} Aktif Ziyaretçi</span>
              </div>
              <Link 
                to="/admin/analytics"
                className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all flex items-center space-x-2 shadow-lg shadow-gray-200"
              >
                <Activity className="h-4 w-4" />
                <span>Detaylı Analiz</span>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { label: 'Keşif Talepleri', value: stats.totalDiscoveryRequests, sub: `${stats.pendingRequests} Bekliyor`, icon: Calendar, color: 'blue' },
              { label: 'İletişim Mesajları', value: stats.totalContactMessages, sub: `${stats.newMessages} Yeni`, icon: MessageSquare, color: 'green' },
              { label: 'Aktif Ürünler', value: stats.activeProducts, sub: `${stats.totalProducts} Toplam`, icon: Package, color: 'purple' },
              { label: 'Toplam Sipariş', value: stats.totalOrders, sub: `${stats.pendingOrders} Bekleyen`, icon: ShoppingCart, color: 'orange' }
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-pest-green-100 group">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 bg-${stat.color}-50 rounded-2xl group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                <div className="flex items-baseline space-x-2 mt-1">
                  <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
                  <span className="text-xs font-bold text-gray-400">{stat.sub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Analytics Preview & Rapid Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900">Etkileşim Grafiği</h3>
                  <p className="text-sm text-gray-500 font-medium">Haftalık talep ve mesaj yoğunluğu</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 mr-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-xs font-bold text-gray-600">Talepler</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs font-bold text-gray-600">Mesajlar</span>
                  </div>
                </div>
              </div>
              <div className="h-[300px]">
                <Line 
                  data={chartData} 
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.03)' } },
                      x: { grid: { display: false } }
                    }
                  }} 
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100">
                <div className="flex items-center justify-between mb-6">
                  <Globe className="h-8 w-8 text-indigo-200" />
                  <span className="text-xs font-black bg-white/20 px-3 py-1 rounded-full">CANLI VERİ</span>
                </div>
                <h4 className="text-sm font-bold text-indigo-100 uppercase tracking-widest mb-1">Toplam Ziyaretçi</h4>
                <div className="flex items-baseline space-x-2">
                  <h3 className="text-4xl font-black">{stats.totalVisitors}</h3>
                  <span className="text-indigo-200 text-sm font-bold">oturum</span>
                </div>
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-indigo-100">Benzersiz</span>
                    <span className="text-lg font-black">{stats.uniqueVisitors}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h4 className="text-sm font-bold text-gray-900 mb-4">Mail Kampanyaları</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 rounded-xl">
                      <Send className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase">Gönderilen</p>
                      <p className="text-xl font-black text-gray-900">{stats.totalEmailsSent}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Grid (Quick Actions) */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-extrabold text-gray-900">Hızlı Erişim</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { to: "/admin/discovery-requests", icon: Search, label: "Keşif" },
                { to: "/admin/documents", icon: FileText, label: "Döküman" },
                { to: "/admin/products", icon: Package, label: "Mağaza" },
                { to: "/admin/orders", icon: ShoppingCart, label: "Siparişler" },
                { to: "/admin/email-campaigns", icon: Mail, label: "Kampanya" },
                { to: "/admin/franchise-applications", icon: Building, label: "Bayilik" },
                { to: "/admin/job-applications", icon: Briefcase, label: "Kariyer" },
                { to: "/admin/users", icon: UserCog, label: "Üyeler" },
                { to: "/admin/analytics", icon: Activity, label: "Analiz" },
                { to: "/admin/surveys", icon: CheckSquare, label: "Anketler" },
                { to: "/admin/recipient-groups", icon: Users, label: "Gruplar" },
                { to: "/admin/system-settings", icon: Settings, label: "Ayarlar" }
              ].map((action, i) => (
                <Link
                  key={i}
                  to={action.to}
                  className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center transition-all hover:shadow-md hover:-translate-y-1 group"
                >
                  <div className="p-3 bg-gray-50 rounded-xl mb-3 group-hover:bg-gray-900 transition-all">
                    <action.icon className="h-6 w-6 text-gray-600 group-hover:text-white transition-all" />
                  </div>
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-tighter">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Detailed Data Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Discovery Requests */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900">Güncel Keşif Talepleri</h3>
                  <p className="text-xs text-gray-500 font-medium">Sistemden gelen son başvurular</p>
                </div>
                <Link to="/admin/discovery-requests" className="text-sm font-bold text-pest-green-600 hover:bg-pest-green-50 px-3 py-1.5 rounded-lg transition-all">
                  Tümünü Gör
                </Link>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {recentDiscoveryRequests.length === 0 ? (
                    <div className="text-center py-10">
                      <Zap className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                      <p className="text-gray-400 font-medium">Aktif talep bulunamadı.</p>
                    </div>
                  ) : (
                    recentDiscoveryRequests.map((request) => (
                      <div key={request.id} className="group flex items-center p-4 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-lg font-black text-gray-400 mr-4 group-hover:bg-pest-green-100 group-hover:text-pest-green-600 transition-all uppercase">
                          {request.name.substring(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-0.5">
                            <h4 className="font-bold text-gray-900 truncate">{request.name}</h4>
                            <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded-md ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3 text-xs text-gray-400 font-bold">
                            <span className="flex items-center"><Phone className="h-3 w-3 mr-1" /> {request.phone}</span>
                            <span className="flex items-center font-medium"><Clock className="h-3 w-3 mr-1" /> {new Date(request.created_at).toLocaleDateString('tr-TR')}</span>
                          </div>
                        </div>
                        <Link to="/admin/discovery-requests" className="hidden group-hover:flex p-2 bg-white rounded-lg shadow-sm">
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Recent Contact Messages */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900">Son Mesajlar</h3>
                  <p className="text-xs text-gray-500 font-medium">İletişim formundan gelenler</p>
                </div>
                <Link to="/admin/contact-messages" className="text-sm font-bold text-pest-green-600 hover:bg-pest-green-50 px-3 py-1.5 rounded-lg transition-all">
                  Tümünü Gör
                </Link>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {recentContactMessages.length === 0 ? (
                    <div className="text-center py-10">
                      <MessageSquare className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                      <p className="text-gray-400 font-medium">Henüz mesaj yok.</p>
                    </div>
                  ) : (
                    recentContactMessages.map((message) => (
                      <div key={message.id} className="group flex items-start p-4 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-blue-100 transition-all">
                          <Mail className="h-6 w-6 text-gray-400 group-hover:text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-0.5">
                            <h4 className="font-bold text-gray-900 truncate">{message.name}</h4>
                            <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded-md ${getStatusColor(message.status)}`}>
                              {message.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 font-medium line-clamp-1 mb-2">{message.message}</p>
                          <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none">
                            {new Date(message.created_at).toLocaleString('tr-TR')}
                          </div>
                        </div>
                        <Link to="/admin/contact-messages" className="hidden group-hover:flex p-2 bg-white rounded-lg shadow-sm">
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-2">
              <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900">Son Siparişler</h3>
                  <p className="text-xs text-gray-500 font-medium">En son gelen siparişler</p>
                </div>
                <Link to="/admin/orders" className="text-sm font-bold text-pest-green-600 hover:bg-pest-green-50 px-3 py-1.5 rounded-lg transition-all">
                  Tümünü Gör
                </Link>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {recentOrders.length === 0 ? (
                    <div className="text-center py-10">
                      <ShoppingCart className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                      <p className="text-gray-400 font-medium">Henüz sipariş yok.</p>
                    </div>
                  ) : (
                    recentOrders.map((order) => (
                      <div key={order.id} className="group flex items-center p-4 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-orange-100 transition-all">
                          <Package className="h-6 w-6 text-gray-400 group-hover:text-orange-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <h4 className="font-bold text-gray-900 truncate">#{order.order_number} - {order.customer_name}</h4>
                            <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded-md ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500 font-medium">₺{order.total_amount.toLocaleString('tr-TR')}</p>
                            <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none">
                              {new Date(order.created_at).toLocaleDateString('tr-TR')}
                            </div>
                          </div>
                        </div>
                        <Link to="/admin/orders" className="hidden group-hover:flex p-2 bg-white rounded-lg shadow-sm ml-4">
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  export default DashboardPage