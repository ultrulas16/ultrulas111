import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  CheckCircle, 
  X, 
  AlertTriangle, 
  Edit, 
  Trash2, 
  User, 
  ArrowLeft, 
  ArrowRight, 
  Download, 
  FileText,
  Eye
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface FranchiseApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  district: string | null;
  address: string | null;
  investment_budget: string;
  business_experience: string | null;
  current_occupation: string | null;
  why_interested: string;
  additional_info: string | null;
  heard_from: string | null;
  status: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const FranchiseApplicationsPage = () => {
  const [applications, setApplications] = useState<FranchiseApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<FranchiseApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<FranchiseApplication | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<FranchiseApplication>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [cities, setCities] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<string | null>(null);

  const statusOptions = [
    { value: 'all', label: 'Tüm Durumlar' },
    { value: 'new', label: 'Yeni' },
    { value: 'contacted', label: 'İletişime Geçildi' },
    { value: 'meeting', label: 'Görüşme' },
    { value: 'approved', label: 'Onaylandı' },
    { value: 'rejected', label: 'Reddedildi' }
  ];

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter, cityFilter, currentPage]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('franchise_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setApplications(data || []);
      
      // Extract unique cities for filtering
      const uniqueCities = Array.from(new Set(data?.map(app => app.city).filter(Boolean) as string[]));
      setCities(uniqueCities);
      
    } catch (error) {
      console.error('Error fetching franchise applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // City filter
    if (cityFilter !== 'all') {
      filtered = filtered.filter(app => app.city === cityFilter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.email && app.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (app.why_interested && app.why_interested.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (app.current_occupation && app.current_occupation.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    
    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedResults = filtered.slice(startIndex, startIndex + itemsPerPage);
    
    setFilteredApplications(paginatedResults);
  };

  const handleUpdateApplication = async (id: string, data: Partial<FranchiseApplication>) => {
    try {
      const { error } = await supabase
        .from('franchise_applications')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      
      // Refresh the applications list
      fetchApplications();
      
      // Close the edit modal
      setShowEditModal(false);
      
    } catch (error) {
      console.error('Error updating franchise application:', error);
      alert('Güncelleme sırasında bir hata oluştu.');
    }
  };

  const handleDeleteApplication = async (id: string) => {
    try {
      const { error } = await supabase
        .from('franchise_applications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Refresh the applications list
      fetchApplications();
      
      // Close the confirmation modal
      setShowDeleteConfirm(false);
      setApplicationToDelete(null);
      
    } catch (error) {
      console.error('Error deleting franchise application:', error);
      alert('Silme işlemi sırasında bir hata oluştu.');
    }
  };

  const openDetailModal = (application: FranchiseApplication) => {
    setSelectedApplication(application);
    setShowDetailModal(true);
  };

  const openEditModal = (application: FranchiseApplication) => {
    setSelectedApplication(application);
    setEditFormData({
      full_name: application.full_name,
      email: application.email,
      phone: application.phone,
      city: application.city,
      district: application.district,
      address: application.address,
      investment_budget: application.investment_budget,
      business_experience: application.business_experience,
      current_occupation: application.current_occupation,
      why_interested: application.why_interested,
      additional_info: application.additional_info,
      heard_from: application.heard_from,
      status: application.status,
      notes: application.notes
    });
    setShowEditModal(true);
  };

  const confirmDelete = (id: string) => {
    setApplicationToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedApplication) {
      handleUpdateApplication(selectedApplication.id, editFormData);
    }
  };

  const exportToCSV = () => {
    // Create CSV content
    const headers = [
      'İsim', 'E-posta', 'Telefon', 'Şehir', 'İlçe', 'Adres', 
      'Yatırım Bütçesi', 'İş Deneyimi', 'Mevcut Meslek', 
      'Neden İlgileniyor', 'Ek Bilgiler', 'Nereden Duydu', 
      'Durum', 'Notlar', 'Oluşturulma Tarihi'
    ];
    
    const csvRows = [
      headers.join(','),
      ...applications.map(app => [
        `"${app.full_name}"`,
        `"${app.email}"`,
        `"${app.phone}"`,
        `"${app.city}"`,
        `"${app.district || ''}"`,
        `"${app.address || ''}"`,
        `"${app.investment_budget}"`,
        `"${app.business_experience || ''}"`,
        `"${app.current_occupation || ''}"`,
        `"${app.why_interested.replace(/"/g, '""')}"`,
        `"${app.additional_info?.replace(/"/g, '""') || ''}"`,
        `"${app.heard_from || ''}"`,
        `"${app.status || ''}"`,
        `"${app.notes?.replace(/"/g, '""') || ''}"`,
        `"${new Date(app.created_at).toLocaleDateString('tr-TR')}"`,
      ].join(','))
    ];
    
    const csvContent = csvRows.join('\n');
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bayilik-basvurulari-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'meeting': return 'bg-purple-100 text-purple-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string | null) => {
    switch (status) {
      case 'new': return 'Yeni';
      case 'contacted': return 'İletişime Geçildi';
      case 'meeting': return 'Görüşme';
      case 'approved': return 'Onaylandı';
      case 'rejected': return 'Reddedildi';
      default: return 'Bilinmiyor';
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
          <h1 className="text-3xl font-bold text-gray-900">Bayilik Başvuruları</h1>
          <p className="text-gray-600 mt-2">Bayilik başvurularını yönetin</p>
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

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Başvuran
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İletişim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Konum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yatırım
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
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Bayilik başvurusu bulunamadı
                  </td>
                </tr>
              ) : (
                filteredApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-amber-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{application.full_name}</div>
                          {application.current_occupation && (
                            <div className="text-sm text-gray-500">
                              {application.current_occupation}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        {application.phone}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        {application.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        {application.city}
                        {application.district && `, ${application.district}`}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-amber-600" />
                        {application.investment_budget}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(application.status)}`}>
                        {getStatusText(application.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(application.created_at)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openDetailModal(application)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Detayları Görüntüle"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openEditModal(application)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Düzenle"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => confirmDelete(application.id)}
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
            Toplam {applications.length} başvuru, Sayfa {currentPage}/{totalPages}
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
      {showDetailModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Bayilik Başvurusu Detayı
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Personal Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Kişisel Bilgiler</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">{selectedApplication.full_name}</div>
                        {selectedApplication.current_occupation && (
                          <div className="text-sm text-gray-500">{selectedApplication.current_occupation}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{selectedApplication.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{selectedApplication.email}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Konum Bilgileri</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                      <div>
                        <div className="font-medium text-gray-900">Şehir / İlçe</div>
                        <div className="text-gray-700">
                          {selectedApplication.city}
                          {selectedApplication.district && `, ${selectedApplication.district}`}
                        </div>
                      </div>
                    </div>
                    {selectedApplication.address && (
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                        <div>
                          <div className="font-medium text-gray-900">Adres</div>
                          <div className="text-gray-700">{selectedApplication.address}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">İş Bilgileri</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <DollarSign className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                      <div>
                        <div className="font-medium text-gray-900">Yatırım Bütçesi</div>
                        <div className="text-gray-700">{selectedApplication.investment_budget}</div>
                      </div>
                    </div>
                    {selectedApplication.business_experience && (
                      <div className="flex items-start">
                        <Briefcase className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                        <div>
                          <div className="font-medium text-gray-900">İş Deneyimi</div>
                          <div className="text-gray-700">{selectedApplication.business_experience}</div>
                        </div>
                      </div>
                    )}
                    {selectedApplication.heard_from && (
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                        <div>
                          <div className="font-medium text-gray-900">Nereden Duydu</div>
                          <div className="text-gray-700">{selectedApplication.heard_from}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Application Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Başvuru Detayları</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <FileText className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                      <div>
                        <div className="font-medium text-gray-900">Neden İlgileniyor</div>
                        <div className="text-gray-700 whitespace-pre-line">{selectedApplication.why_interested}</div>
                      </div>
                    </div>
                    {selectedApplication.additional_info && (
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                        <div>
                          <div className="font-medium text-gray-900">Ek Bilgiler</div>
                          <div className="text-gray-700 whitespace-pre-line">{selectedApplication.additional_info}</div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start">
                      <div className={`h-5 w-5 rounded-full mr-3 mt-1 ${
                        selectedApplication.status === 'new' ? 'bg-blue-500' :
                        selectedApplication.status === 'contacted' ? 'bg-yellow-500' :
                        selectedApplication.status === 'meeting' ? 'bg-purple-500' :
                        selectedApplication.status === 'approved' ? 'bg-green-500' :
                        selectedApplication.status === 'rejected' ? 'bg-red-500' :
                        'bg-gray-500'
                      }`} />
                      <div>
                        <div className="font-medium text-gray-900">Durum</div>
                        <div className="text-gray-700">{getStatusText(selectedApplication.status)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedApplication.notes && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Notlar</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-line">{selectedApplication.notes}</p>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Zaman Bilgisi</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                      <div>
                        <div className="font-medium text-gray-900">Başvuru Tarihi</div>
                        <div className="text-gray-700">{formatDate(selectedApplication.created_at)}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                      <div>
                        <div className="font-medium text-gray-900">Son Güncelleme</div>
                        <div className="text-gray-700">{formatDate(selectedApplication.updated_at)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex space-x-4">
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      openEditModal(selectedApplication);
                    }}
                    className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Düzenle</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      confirmDelete(selectedApplication.id);
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
      {showEditModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Bayilik Başvurusu Düzenle
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
                {/* Personal Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Kişisel Bilgiler</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ad Soyad
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        value={editFormData.full_name || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mevcut Meslek
                      </label>
                      <input
                        type="text"
                        name="current_occupation"
                        value={editFormData.current_occupation || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>

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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Business Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">İş Bilgileri</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Yatırım Bütçesi
                      </label>
                      <input
                        type="text"
                        name="investment_budget"
                        value={editFormData.investment_budget || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        İş Deneyimi
                      </label>
                      <input
                        type="text"
                        name="business_experience"
                        value={editFormData.business_experience || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nereden Duydu
                      </label>
                      <input
                        type="text"
                        name="heard_from"
                        value={editFormData.heard_from || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      />
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="new">Yeni</option>
                        <option value="contacted">İletişime Geçildi</option>
                        <option value="meeting">Görüşme</option>
                        <option value="approved">Onaylandı</option>
                        <option value="rejected">Reddedildi</option>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                        placeholder="Başvuru hakkında notlar..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-1 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Neden İlgileniyor</h3>
                  <div>
                    <textarea
                      name="why_interested"
                      value={editFormData.why_interested || ''}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    ></textarea>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Ek Bilgiler</h3>
                  <div>
                    <textarea
                      name="additional_info"
                      value={editFormData.additional_info || ''}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
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
                  className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
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
              <AlertTriangle className="h-12 w-12" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
              Bayilik Başvurusunu Sil
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Bu bayilik başvurusunu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={() => applicationToDelete && handleDeleteApplication(applicationToDelete)}
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

export default FranchiseApplicationsPage;