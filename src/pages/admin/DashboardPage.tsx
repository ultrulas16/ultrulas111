import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  LogOut, 
  Mail, 
  Phone, 
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  Edit,
  FileText,
  Settings,
  BarChart3,
  Package,
  ShoppingCart,
  Search,
  Building,
  Briefcase,
  UserCog,
  Activity,
  CheckSquare,
  Send
} from 'lucide-react'

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
    totalEmailsSent: 0
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
          totalEmailsSent: sentEmails
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-600'
      case 'normal': return 'text-blue-600'
      case 'high': return 'text-orange-600'
      case 'urgent': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pest-green-700"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img 
                src="/pestmentor-logo-png-297x97.webp" 
                alt="PestMentor Logo" 
                className="h-10 w-auto mr-4"
              />
              <h1 className="text-2xl font-bold text-gray-900">Yönetim Paneli</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/discovery-requests"
                className="flex items-center space-x-2 text-gray-600 hover:text-pest-green-600 transition-colors"
              >
                <Search className="h-5 w-5" />
                <span>Keşif Talepleri</span>
              </Link>
              <Link
                to="/admin/documents"
                className="flex items-center space-x-2 text-gray-600 hover:text-pest-green-600 transition-colors"
              >
                <FileText className="h-5 w-5" />
                <span>Dökümanlar</span>
              </Link>
              <Link
                to="/admin/products"
                className="flex items-center space-x-2 text-gray-600 hover:text-pest-green-600 transition-colors"
              >
                <Package className="h-5 w-5" />
                <span>Ürünler</span>
              </Link>
              <Link
                to="/admin/orders"
                className="flex items-center space-x-2 text-gray-600 hover:text-pest-green-600 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Siparişler</span>
              </Link>
              <Link
                to="/admin/email-campaigns"
                className="flex items-center space-x-2 text-gray-600 hover:text-pest-green-600 transition-colors"
              >
                <Send className="h-5 w-5" />
                <span>E-posta Kampanyaları</span>
              </Link>
              <Link
                to="/admin/system-settings"
                className="flex items-center space-x-2 text-gray-600 hover:text-pest-green-600 transition-colors"
              >
                <Settings className="h-5 w-5" />
                <span>Ayarlar</span>
              </Link>
              <span className="text-sm text-gray-600">
                Hoş geldiniz, {user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Çıkış</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Keşif Talebi</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDiscoveryRequests}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <div>
                <span className="text-green-600 font-medium">{stats.completedRequests}</span> tamamlandı
              </div>
              <div>
                <span className="text-blue-600 font-medium">{stats.pendingRequests}</span> bekliyor
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Mesaj</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalContactMessages}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <div>
                <span className="text-green-600 font-medium">{stats.respondedMessages}</span> yanıtlandı
              </div>
              <div>
                <span className="text-blue-600 font-medium">{stats.newMessages}</span> yeni
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Ürün</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <div>
                <span className="text-green-600 font-medium">{stats.activeProducts}</span> aktif
              </div>
              <div>
                <span className="text-gray-600 font-medium">{stats.totalProducts - stats.activeProducts}</span> pasif
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Sipariş</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <div>
                <span className="text-orange-600 font-medium">{stats.pendingOrders}</span> bekleyen
              </div>
              <div>
                <span className="text-green-600 font-medium">{stats.totalOrders - stats.pendingOrders}</span> tamamlanan
              </div>
            </div>
          </div>
        </div>
        
        {/* Email Campaigns Stats */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Send className="h-5 w-5 text-blue-600 mr-2" />
            E-posta Kampanyaları
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">Toplam Kampanya</p>
                  <p className="text-2xl font-bold text-blue-800">{stats.totalEmailCampaigns}</p>
                </div>
                <Mail className="h-10 w-10 text-blue-400" />
              </div>
              <div className="mt-2">
                <Link 
                  to="/admin/email-campaigns"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  <span>Kampanyaları Yönet</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700">Gönderilen E-postalar</p>
                  <p className="text-2xl font-bold text-green-800">{stats.totalEmailsSent}</p>
                </div>
                <Send className="h-10 w-10 text-green-400" />
              </div>
              <div className="mt-2">
                <Link 
                  to="/admin/recipient-groups"
                  className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
                >
                  <span>Alıcı Gruplarını Yönet</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Applications Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Building className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bayilik Başvuruları</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalFranchiseApplications}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link 
                to="/admin/franchise-applications"
                className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center"
              >
                <span>Başvuruları Görüntüle</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">İş Başvuruları</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalJobApplications}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link 
                to="/admin/job-applications"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
              >
                <span>Başvuruları Görüntüle</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Kullanıcılar</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link 
                to="/admin/users"
                className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center"
              >
                <span>Kullanıcıları Yönet</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Activity className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ziyaretçi Analitiği</p>
                <p className="text-2xl font-bold text-gray-900">Aktif</p>
              </div>
            </div>
            <div className="mt-4">
              <Link 
                to="/admin/analytics"
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center"
              >
                <span>Analitiği Görüntüle</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckSquare className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Anketler</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSurveys}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link 
                to="/admin/surveys"
                className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
              >
                <span>Anketleri Yönet</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Hızlı İşlemler</h3>
          <div className="grid grid-cols-1 md:grid-cols-9 gap-4">
            <Link
              to="/admin/discovery-requests"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Search className="h-8 w-8 text-pest-green-600" />
              <div>
                <h4 className="font-medium text-gray-900">Keşif Talepleri</h4>
                <p className="text-sm text-gray-600">Talepleri yönet</p>
              </div>
            </Link>
            
            <Link
              to="/admin/documents"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="h-8 w-8 text-pest-green-600" />
              <div>
                <h4 className="font-medium text-gray-900">Döküman Yönetimi</h4>
                <p className="text-sm text-gray-600">Dökümanları yönet</p>
              </div>
            </Link>
            
            <Link
              to="/admin/products"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Package className="h-8 w-8 text-pest-green-600" />
              <div>
                <h4 className="font-medium text-gray-900">Ürün Yönetimi</h4>
                <p className="text-sm text-gray-600">Mağaza ürünleri</p>
              </div>
            </Link>
            
            <Link
              to="/admin/orders"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ShoppingCart className="h-8 w-8 text-pest-green-600" />
              <div>
                <h4 className="font-medium text-gray-900">Sipariş Yönetimi</h4>
                <p className="text-sm text-gray-600">Siparişleri yönet</p>
              </div>
            </Link>
            
            <Link
              to="/admin/email-campaigns"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Send className="h-8 w-8 text-blue-600" />
              <div>
                <h4 className="font-medium text-gray-900">E-posta Kampanyaları</h4>
                <p className="text-sm text-gray-600">Kampanyaları yönet</p>
              </div>
            </Link>
            
            <Link
              to="/admin/franchise-applications"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Building className="h-8 w-8 text-amber-600" />
              <div>
                <h4 className="font-medium text-gray-900">Bayilik Başvuruları</h4>
                <p className="text-sm text-gray-600">Başvuruları yönet</p>
              </div>
            </Link>
            
            <Link
              to="/admin/job-applications"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Briefcase className="h-8 w-8 text-blue-600" />
              <div>
                <h4 className="font-medium text-gray-900">İş Başvuruları</h4>
                <p className="text-sm text-gray-600">Başvuruları yönet</p>
              </div>
            </Link>
            
            <Link
              to="/admin/users"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <UserCog className="h-8 w-8 text-purple-600" />
              <div>
                <h4 className="font-medium text-gray-900">Kullanıcı Yönetimi</h4>
                <p className="text-sm text-gray-600">Kullanıcıları yönet</p>
              </div>
            </Link>
            
            <Link
              to="/admin/analytics"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Activity className="h-8 w-8 text-indigo-600" />
              <div>
                <h4 className="font-medium text-gray-900">Ziyaretçi Analitiği</h4>
                <p className="text-sm text-gray-600">İstatistikleri gör</p>
              </div>
            </Link>
            
            <Link
              to="/admin/surveys"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <CheckSquare className="h-8 w-8 text-green-600" />
              <div>
                <h4 className="font-medium text-gray-900">Anket Yönetimi</h4>
                <p className="text-sm text-gray-600">Anketleri yönet</p>
              </div>
            </Link>
            
            <Link
              to="/admin/system-settings"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Settings className="h-8 w-8 text-pest-green-600" />
              <div>
                <h4 className="font-medium text-gray-900">Sistem Ayarları</h4>
                <p className="text-sm text-gray-600">Ayarları yönet</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Data */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Discovery Requests */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Son Keşif Talepleri</h3>
              <Link to="/admin/discovery-requests" className="text-sm text-pest-green-600 hover:text-pest-green-800">
                Tümünü Gör
              </Link>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentDiscoveryRequests.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Henüz keşif talebi bulunmuyor</p>
                ) : (
                  recentDiscoveryRequests.map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-gray-900">{request.name}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-1" />
                              {request.phone}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {request.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(request.created_at).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Recent Contact Messages */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Son İletişim Mesajları</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentContactMessages.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Henüz iletişim mesajı bulunmuyor</p>
                ) : (
                  recentContactMessages.map((message) => (
                    <div key={message.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-gray-900">{message.name}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(message.status)}`}>
                              {message.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Konu:</strong> {message.subject || 'Konu belirtilmemiş'}
                          </p>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {message.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(message.created_at).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Son Siparişler</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentOrders.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Henüz sipariş bulunmuyor</p>
                ) : (
                  recentOrders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-gray-900">#{order.order_number}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {order.customer_name}
                            </div>
                          </div>
                          <p className="text-sm font-medium text-pest-green-600">
                            ₺{order.total_amount.toLocaleString('tr-TR')}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(order.created_at).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                        <Link
                          to={`/admin/orders`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </div>
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