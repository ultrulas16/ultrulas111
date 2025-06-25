import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle, 
  X, 
  AlertCircle, 
  Edit, 
  Trash2, 
  User, 
  Building, 
  ArrowLeft, 
  ArrowRight, 
  Download, 
  FileText,
  Send
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

interface DiscoveryRequest {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  service_type: string | null;
  property_type: string | null;
  message: string;
  preferred_time: string | null;
  status: string | null;
  priority: string | null;
  city: string | null;
  district: string | null;
  address: string | null;
  company_name: string | null;
  source: string | null;
  notes: string | null;
  assigned_to: string | null;
  scheduled_date: string | null;
  completed_date: string | null;
  created_at: string;
  updated_at: string;
}

const DiscoveryRequestsPage = () => {
  const [requests, setRequests] = useState<DiscoveryRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<DiscoveryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<DiscoveryRequest | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<DiscoveryRequest>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [cities, setCities] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);

  const statusOptions = [
    { value: 'all', label: 'Tüm Durumlar' },
    { value: 'new', label: 'Yeni' },
    { value: 'contacted', label: 'İletişime Geçildi' },
    { value: 'scheduled', label: 'Planlandı' },
    { value: 'completed', label: 'Tamamlandı' },
    { value: 'cancelled', label: 'İptal Edildi' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'Tüm Öncelikler' },
    { value: 'low', label: 'Düşük' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'Yüksek' },
    { value: 'urgent', label: 'Acil' }
  ];

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm, statusFilter, priorityFilter, cityFilter, currentPage]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('discovery_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setRequests(data || []);
      
      // Extract unique cities for filtering
      const uniqueCities = Array.from(new Set(data?.map(req => req.city).filter(Boolean) as string[]));
      setCities(uniqueCities);
      
    } catch (error) {
      console.error('Error fetching discovery requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = requests;

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(req => req.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(req => req.priority === priorityFilter);
    }

    // City filter
    if (cityFilter !== 'all') {
      filtered = filtered.filter(req => req.city === cityFilter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(req =>
        req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (req.email && req.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (req.message && req.message.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (req.company_name && req.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    
    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedResults = filtered.slice(startIndex, startIndex + itemsPerPage);
    
    setFilteredRequests(paginatedResults);
  };

  const handleUpdateRequest = async (id: string, data: Partial<DiscoveryRequest>) => {
    try {
      const { error } = await supabase
        .from('discovery_requests')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      
      // Refresh the requests list
      fetchRequests();
      
      // Close the edit modal
      setShowEditModal(false);
      
    } catch (error) {
      console.error('Error updating discovery request:', error);
      alert('Güncelleme sırasında bir hata oluştu.');
    }
  };

  const handleDeleteRequest = async (id: string) => {
    try {
      const { error } = await supabase
        .from('discovery_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Refresh the requests list
      fetchRequests();
      
      // Close the confirmation modal
      setShowDeleteConfirm(false);
      setRequestToDelete(null);
      
    } catch (error) {
      console.error('Error deleting discovery request:', error);
      alert('Silme işlemi sırasında bir hata oluştu.');
    }
  };

  const openDetailModal = (request: DiscoveryRequest) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const openEditModal = (request: DiscoveryRequest) => {
    setSelectedRequest(request);
    setEditFormData({
      name: request.name,
      email: request.email,
      phone: request.phone,
      service_type: request.service_type,
      property_type: request.property_type,
      message: request.message,
      preferred_time: request.preferred_time,
      status: request.status,
      priority: request.priority,
      city: request.city,
      district: request.district,
      address: request.address,
      company_name: request.company_name,
      notes: request.notes,
      scheduled_date: request.scheduled_date
    });
    setShowEditModal(true);
  };

  const confirmDelete = (id: string) => {
    setRequestToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRequest) {
      handleUpdateRequest(selectedRequest.id, editFormData);
    }
  };

  const exportToCSV = () => {
    // Create CSV content
    const headers = [
      'İsim', 'E-posta', 'Telefon', 'Şirket', 'Hizmet Türü', 'Mekan Türü', 
      'Şehir', 'İlçe', 'Adres', 'Mesaj', 'Tercih Edilen Zaman', 'Durum', 
      'Öncelik', 'Notlar', 'Oluşturulma Tarihi'
    ];
    
    const csvRows = [
      headers.join(','),
      ...requests.map(req => [
        `"${req.name}"`,
        `"${req.email || ''}"`,
        `"${req.phone}"`,
        `"${req.company_name || ''}"`,
        `"${req.service_type || ''}"`,
        `"${req.property_type || ''}"`,
        `"${req.city || ''}"`,
        `"${req.district || ''}"`,
        `"${req.address || ''}"`,
        `"${req.message.replace(/"/g, '""')}"`,
        `"${req.preferred_time || ''}"`,
        `"${req.status || ''}"`,
        `"${req.priority || ''}"`,
        `"${req.notes?.replace(/"/g, '""') || ''}"`,
        `"${new Date(req.created_at).toLocaleDateString('tr-TR')}"`,
      ].join(','))
    ];
    
    const csvContent = csvRows.join('\n');
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `keşif-talepleri-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string | null) => {
    switch (status) {
      case 'new': return 'Yeni';
      case 'contacted': return 'İletişime Geçildi';
      case 'scheduled': return 'Planlandı';
      case 'completed': return 'Tamamlandı';
      case 'cancelled': return 'İptal Edildi';
      default: return 'Bilinmiyor';
    }
  };

  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case 'low': return 'text-green-600';
      case 'normal': return 'text-blue-600';
      case 'high': return 'text-orange-600';
      case 'urgent': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityText = (priority: string | null) => {
    switch (priority) {
      case 'low': return 'Düşük';
      case 'normal': return 'Normal';
      case 'high': return 'Yüksek';
      case 'urgent': return 'Acil';
      default: return 'Normal';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pest-green-700"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Keşif Talepleri</h1>
          <p className="text-gray-600 mt-2">Müşteri keşif taleplerini yönetin</p>
        </div>
        <div className="flex space-x-4">
          <Link 
            to="/admin/dashboard" 
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 bg-pest-green-600 text-white px-4 py-2 rounded-lg hover:bg-pest-green-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            <span>CSV İndir</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="İsim, telefon veya e-posta ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
            >
              <option value="all">Tüm Şehirler</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Müşteri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İletişim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hizmet Bilgisi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Konum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Keşif talebi bulunamadı
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{request.name}</div>
                          {request.company_name && (
                            <div className="text-sm text-gray-500 flex items-center">
                              <Building className="h-3 w-3 mr-1" />
                              {request.company_name}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        {request.phone}
                      </div>
                      {request.email && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-500" />
                          {request.email}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{request.service_type || 'Belirtilmemiş'}</div>
                      <div className="text-sm text-gray-500">{request.property_type || 'Belirtilmemiş'}</div>
                      {request.preferred_time && (
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {request.preferred_time}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {request.city && (
                        <div className="text-sm text-gray-900 flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          {request.city}
                          {request.district && `, ${request.district}`}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-2">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                          {getStatusText(request.status)}
                        </span>
                        <span className={`text-xs ${getPriorityColor(request.priority)}`}>
                          {getPriorityText(request.priority)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(request.created_at)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openDetailModal(request)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Detayları Görüntüle"
                        >
                          <FileText className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openEditModal(request)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Düzenle"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => confirmDelete(request.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Sil"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-500">
            Toplam {requests.length} keşif talebi, Sayfa {currentPage}/{totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 disabled:opacity-50"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Keşif Talebi Detayı
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Customer Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Müşteri Bilgileri</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">{selectedRequest.name}</div>
                        {selectedRequest.company_name && (
                          <div className="text-sm text-gray-500">{selectedRequest.company_name}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{selectedRequest.phone}</span>
                    </div>
                    {selectedRequest.email && (
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-900">{selectedRequest.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Hizmet Bilgileri</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Building className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                      <div>
                        <div className="font-medium text-gray-900">Hizmet Türü</div>
                        <div className="text-gray-700">{selectedRequest.service_type || 'Belirtilmemiş'}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Home className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                      <div>
                        <div className="font-medium text-gray-900">Mekan Türü</div>
                        <div className="text-gray-700">{selectedRequest.property_type || 'Belirtilmemiş'}</div>
                      </div>
                    </div>
                    {selectedRequest.preferred_time && (
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                        <div>
                          <div className="font-medium text-gray-900">Tercih Edilen Zaman</div>
                          <div className="text-gray-700">{selectedRequest.preferred_time}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Konum Bilgileri</h3>
                  <div className="space-y-3">
                    {selectedRequest.city && (
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                        <div>
                          <div className="font-medium text-gray-900">Şehir / İlçe</div>
                          <div className="text-gray-700">
                            {selectedRequest.city}
                            {selectedRequest.district && `, ${selectedRequest.district}`}
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedRequest.address && (
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                        <div>
                          <div className="font-medium text-gray-900">Adres</div>
                          <div className="text-gray-700">{selectedRequest.address}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Request Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Talep Detayları</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <FileText className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                      <div>
                        <div className="font-medium text-gray-900">Mesaj</div>
                        <div className="text-gray-700 whitespace-pre-line">{selectedRequest.message}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                      <div>
                        <div className="font-medium text-gray-900">Oluşturulma Tarihi</div>
                        <div className="text-gray-700">{formatDate(selectedRequest.created_at)}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className={`h-5 w-5 rounded-full mr-3 mt-1 ${
                        selectedRequest.status === 'new' ? 'bg-blue-500' :
                        selectedRequest.status === 'contacted' ? 'bg-yellow-500' :
                        selectedRequest.status === 'scheduled' ? 'bg-purple-500' :
                        selectedRequest.status === 'completed' ? 'bg-green-500' :
                        selectedRequest.status === 'cancelled' ? 'bg-red-500' :
                        'bg-gray-500'
                      }`} />
                      <div>
                        <div className="font-medium text-gray-900">Durum</div>
                        <div className="text-gray-700">{getStatusText(selectedRequest.status)}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <AlertCircle className={`h-5 w-5 mr-3 mt-1 ${getPriorityColor(selectedRequest.priority)}`} />
                      <div>
                        <div className="font-medium text-gray-900">Öncelik</div>
                        <div className="text-gray-700">{getPriorityText(selectedRequest.priority)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedRequest.notes && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Notlar</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-line">{selectedRequest.notes}</p>
                    </div>
                  </div>
                )}

                <div className="pt-4 flex space-x-4">
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      openEditModal(selectedRequest);
                    }}
                    className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Düzenle</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      confirmDelete(selectedRequest.id);
                    }}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Sil</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Keşif Talebi Düzenle
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Müşteri Bilgileri</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ad Soyad
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        E-posta
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={editFormData.email || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefon
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={editFormData.phone || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Şirket Adı
                      </label>
                      <input
                        type="text"
                        name="company_name"
                        value={editFormData.company_name || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Service Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Hizmet Bilgileri</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hizmet Türü
                      </label>
                      <input
                        type="text"
                        name="service_type"
                        value={editFormData.service_type || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mekan Türü
                      </label>
                      <input
                        type="text"
                        name="property_type"
                        value={editFormData.property_type || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tercih Edilen Zaman
                      </label>
                      <input
                        type="text"
                        name="preferred_time"
                        value={editFormData.preferred_time || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Planlanan Tarih
                      </label>
                      <input
                        type="datetime-local"
                        name="scheduled_date"
                        value={editFormData.scheduled_date ? new Date(editFormData.scheduled_date).toISOString().slice(0, 16) : ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Location Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Konum Bilgileri</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Şehir
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={editFormData.city || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        İlçe
                      </label>
                      <input
                        type="text"
                        name="district"
                        value={editFormData.district || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Adres
                      </label>
                      <textarea
                        name="address"
                        value={editFormData.address || ''}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Status Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Durum Bilgileri</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Durum
                      </label>
                      <select
                        name="status"
                        value={editFormData.status || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                      >
                        <option value="new">Yeni</option>
                        <option value="contacted">İletişime Geçildi</option>
                        <option value="scheduled">Planlandı</option>
                        <option value="completed">Tamamlandı</option>
                        <option value="cancelled">İptal Edildi</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Öncelik
                      </label>
                      <select
                        name="priority"
                        value={editFormData.priority || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                      >
                        <option value="low">Düşük</option>
                        <option value="normal">Normal</option>
                        <option value="high">Yüksek</option>
                        <option value="urgent">Acil</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notlar
                      </label>
                      <textarea
                        name="notes"
                        value={editFormData.notes || ''}
                        onChange={handleInputChange}
                        rows={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                        placeholder="Talep hakkında notlar..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-1 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Mesaj</h3>
                  <div>
                    <textarea
                      name="message"
                      value={editFormData.message || ''}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-pest-green-600 text-white rounded-lg hover:bg-pest-green-700 transition-colors flex items-center space-x-2"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Kaydet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-center mb-6 text-red-600">
              <AlertCircle className="h-12 w-12" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
              Keşif Talebini Sil
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Bu keşif talebini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={() => requestToDelete && handleDeleteRequest(requestToDelete)}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscoveryRequestsPage;