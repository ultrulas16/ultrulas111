import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MapPin, 
  GraduationCap, 
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
  Eye,
  ExternalLink
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface JobApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  education: string;
  experience: string;
  position: string;
  cover_letter: string | null;
  resume_url: string;
  heard_from: string | null;
  status: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const JobApplicationsPage = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [positionFilter, setPositionFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<JobApplication>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [positions, setPositions] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<string | null>(null);

  const statusOptions = [
    { value: 'all', label: 'Tüm Durumlar' },
    { value: 'new', label: 'Yeni' },
    { value: 'reviewed', label: 'İncelendi' },
    { value: 'interview', label: 'Görüşme' },
    { value: 'hired', label: 'İşe Alındı' },
    { value: 'rejected', label: 'Reddedildi' }
  ];

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter, positionFilter, currentPage]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setApplications(data || []);
      
      // Extract unique positions for filtering
      const uniquePositions = Array.from(new Set(data?.map(app => app.position).filter(Boolean) as string[]));
      setPositions(uniquePositions);
      
    } catch (error) {
      console.error('Error fetching job applications:', error);
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

    // Position filter
    if (positionFilter !== 'all') {
      filtered = filtered.filter(app => app.position === positionFilter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.cover_letter && app.cover_letter.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    
    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedResults = filtered.slice(startIndex, startIndex + itemsPerPage);
    
    setFilteredApplications(paginatedResults);
  };

  const handleUpdateApplication = async (id: string, data: Partial<JobApplication>) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      
      // Refresh the applications list
      fetchApplications();
      
      // Close the edit modal
      setShowEditModal(false);
      
    } catch (error) {
      console.error('Error updating job application:', error);
      alert('Güncelleme sırasında bir hata oluştu.');
    }
  };

  const handleDeleteApplication = async (id: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Refresh the applications list
      fetchApplications();
      
      // Close the confirmation modal
      setShowDeleteConfirm(false);
      setApplicationToDelete(null);
      
    } catch (error) {
      console.error('Error deleting job application:', error);
      alert('Silme işlemi sırasında bir hata oluştu.');
    }
  };

  const openDetailModal = (application: JobApplication) => {
    setSelectedApplication(application);
    setShowDetailModal(true);
  };

  const openEditModal = (application: JobApplication) => {
    setSelectedApplication(application);
    setEditFormData({
      full_name: application.full_name,
      email: application.email,
      phone: application.phone,
      city: application.city,
      education: application.education,
      experience: application.experience,
      position: application.position,
      cover_letter: application.cover_letter,
      resume_url: application.resume_url,
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
      'İsim', 'E-posta', 'Telefon', 'Şehir', 'Eğitim', 'Deneyim', 
      'Pozisyon', 'Ön Yazı', 'Özgeçmiş URL', 'Nereden Duydu', 
      'Durum', 'Notlar', 'Oluşturulma Tarihi'
    ];
    
    const csvRows = [
      headers.join(','),
      ...applications.map(app => [
        `"${app.full_name}"`,
        `"${app.email}"`,
        `"${app.phone}"`,
        `"${app.city}"`,
        `"${app.education}"`,
        `"${app.experience}"`,
        `"${app.position}"`,
        `"${app.cover_letter?.replace(/"/g, '""') || ''}"`,
        `"${app.resume_url}"`,
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
    link.setAttribute('download', `is-basvurulari-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800';
      case 'interview': return 'bg-purple-100 text-purple-800';
      case 'hired': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string | null) => {
    switch (status) {
      case 'new': return 'Yeni';
      case 'reviewed': return 'İncelendi';
      case 'interview': return 'Görüşme';
      case 'hired': return 'İşe Alındı';
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
          <h1 className="text-3xl font-bold text-gray-900">İş Başvuruları</h1>
          <p className="text-gray-600 mt-2">İş başvurularını yönetin</p>
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
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
            >
              <option value="all">Tüm Pozisyonlar</option>
              {positions.map((position) => (
                <option key={position} value={position}>
                  {position}
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
                  Pozisyon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Eğitim/Deneyim
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
                    İş başvurusu bulunamadı
                  </td>
                </tr>
              ) : (
                filteredApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{application.full_name}</div>
                          <div className="text-sm text-gray-500">{application.city}</div>
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
                      <div className="text-sm text-gray-900">{application.position}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{application.education}</div>
                      <div className="text-sm text-gray-500">{application.experience}</div>
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
                İş Başvurusu Detayı
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
                        <div className="text-sm text-gray-500">{selectedApplication.city}</div>
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
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Eğitim ve Deneyim</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <GraduationCap className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                      <div>
                        <div className="font-medium text-gray-900">Eğitim</div>
                        <div className="text-gray-700">{selectedApplication.education}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Briefcase className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                      <div>
                        <div className="font-medium text-gray-900">Deneyim</div>
                        <div className="text-gray-700">{selectedApplication.experience}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Briefcase className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                      <div>
                        <div className="font-medium text-gray-900">Pozisyon</div>
                        <div className="text-gray-700">{selectedApplication.position}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Özgeçmiş</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <a 
                      href={selectedApplication.resume_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <FileText className="h-5 w-5 mr-2" />
                      <span>Özgeçmişi Görüntüle</span>
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Application Details */}
              <div className="space-y-6">
                {selectedApplication.cover_letter && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Ön Yazı</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-line">{selectedApplication.cover_letter}</p>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Başvuru Detayları</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className={`h-5 w-5 rounded-full mr-3 mt-1 ${
                        selectedApplication.status === 'new' ? 'bg-blue-500' :
                        selectedApplication.status === 'reviewed' ? 'bg-yellow-500' :
                        selectedApplication.status === 'interview' ? 'bg-purple-500' :
                        selectedApplication.status === 'hired' ? 'bg-green-500' :
                        selectedApplication.status === 'rejected' ? 'bg-red-500' :
                        'bg-gray-500'
                      }`} />
                      <div>
                        <div className="font-medium text-gray-900">Durum</div>
                        <div className="text-gray-700">{getStatusText(selectedApplication.status)}</div>
                      </div>
                    </div>
                    {selectedApplication.heard_from && (
                      <div className="flex items-start">
                        <FileText className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                        <div>
                          <div className="font-medium text-gray-900">Nereden Duydu</div>
                          <div className="text-gray-700">{selectedApplication.heard_from}</div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                      <div>
                        <div className="font-medium text-gray-900">Başvuru Tarihi</div>
                        <div className="text-gray-700">{formatDate(selectedApplication.created_at)}</div>
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
                İş Başvurusu Düzenle
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Şehir
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={editFormData.city || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Education & Experience */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Eğitim ve Deneyim</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Eğitim
                      </label>
                      <input
                        type="text"
                        name="education"
                        value={editFormData.education || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Deneyim
                      </label>
                      <input
                        type="text"
                        name="experience"
                        value={editFormData.experience || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pozisyon
                      </label>
                      <input
                        type="text"
                        name="position"
                        value={editFormData.position || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Resume URL */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Özgeçmiş</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Özgeçmiş URL
                      </label>
                      <div className="flex items-center">
                        <input
                          type="text"
                          name="resume_url"
                          value={editFormData.resume_url || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          readOnly
                        />
                        <a 
                          href={editFormData.resume_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      </div>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="new">Yeni</option>
                        <option value="reviewed">İncelendi</option>
                        <option value="interview">Görüşme</option>
                        <option value="hired">İşe Alındı</option>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Başvuru hakkında notlar..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Ön Yazı</h3>
                <div>
                  <textarea
                    name="cover_letter"
                    value={editFormData.cover_letter || ''}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  ></textarea>
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
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
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
              İş Başvurusunu Sil
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Bu iş başvurusunu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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

export default JobApplicationsPage;