import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MapPin, 
  GraduationCap, 
  CheckCircle, 
  X, 
  AlertCircle, 
  Edit, 
  Trash2, 
  User, 
  ArrowLeft, 
  ArrowRight, 
  Download, 
  FileText,
  Eye,
  ExternalLink,
  Clock,
  Save,
  Lock,
  Unlock,
  Shield,
  Building
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface UserType {
  id: string;
  email: string;
  role: 'admin' | 'user';
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserModuleAccess {
  id: string;
  user_id: string;
  modules: string[];
}

const UserManagementPage = () => {
  const { user: currentUser, refreshModuleAccess } = useAuth();
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<UserType>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [userModules, setUserModules] = useState<string[]>([]);
  const [savingModules, setSavingModules] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Define available modules
  const availableModules = [
    { id: 'risk-assessment', name: 'Risk Değerlendirme', path: '/moduller/risk-degerlendirme', description: 'Risk değerlendirme raporu oluşturma' },
    { id: 'inspection-report', name: 'Denetim Raporu', path: '/moduller/denetim-raporu', description: 'Denetim raporu oluşturma' },
    { id: 'compliance-check', name: 'Uygunluk Kontrol', path: '/moduller/uygunluk-kontrol', description: 'Uygunluk kontrol raporu oluşturma' },
    { id: 'contract', name: 'Sözleşme', path: '/moduller/sozlesme', description: 'Sözleşme oluşturma' },
    { id: 'layout-designer', name: 'Ekipman Krokisi', path: '/moduller/ekipman-krokisi', description: 'Ekipman yerleşim planı oluşturma' },
    { id: 'trend-analysis', name: 'Trend Analiz', path: '/moduller/trend-analiz', description: 'Trend analiz raporu oluşturma' },
    { id: 'visit-calendar', name: 'Ziyaret Takvimi', path: '/moduller/ziyaret-takvimi', description: 'Ziyaret takvimi oluşturma' },
    { id: 'auto-trend-analysis', name: 'Otomatik Trend Analiz', path: '/moduller/otomatik-trend-analiz', description: 'Otomatik trend analiz raporu oluşturma' },
    { id: 'training-presentation', name: 'Eğitim Sunumu', path: '/moduller/egitim-sunumu', description: 'Eğitim sunumu oluşturma' },
    { id: 'training-certificate', name: 'Eğitim Sertifikası', path: '/moduller/egitim-sertifikasi', description: 'Eğitim sertifikası oluşturma' },
    { id: 'quote-generator', name: 'Fiyat Teklifi', path: '/moduller/fiyat-teklifi', description: 'Fiyat teklifi oluşturma' }
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Convert snake_case to camelCase
      const formattedUsers = data?.map(user => ({
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        company: user.company,
        phone: user.phone,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      })) || [];
      
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserModules = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_module_access')
        .select('modules')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No record found, create one with empty modules
          await supabase
            .from('user_module_access')
            .upsert([{ user_id: userId, modules: [] }]);
          setUserModules([]);
        } else {
          throw error;
        }
      } else {
        setUserModules(data?.modules || []);
      }
    } catch (error) {
      console.error('Error fetching user modules:', error);
      setUserModules([]);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.company && user.company.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    
    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedResults = filtered.slice(startIndex, startIndex + itemsPerPage);
    
    setFilteredUsers(paginatedResults);
  };

  const handleUpdateUser = async (id: string, data: Partial<UserType>) => {
    try {
      // Convert camelCase to snake_case for database
      const dbData: any = {};
      if (data.firstName !== undefined) dbData.first_name = data.firstName;
      if (data.lastName !== undefined) dbData.last_name = data.lastName;
      if (data.company !== undefined) dbData.company = data.company;
      if (data.phone !== undefined) dbData.phone = data.phone;
      if (data.role !== undefined) dbData.role = data.role;

      const { error } = await supabase
        .from('users')
        .update(dbData)
        .eq('id', id);

      if (error) throw error;
      
      // Refresh the users list
      fetchUsers();
      
      // Close the edit modal
      setShowEditModal(false);
      
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Güncelleme sırasında bir hata oluştu.');
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      // First delete from user_module_access
      await supabase
        .from('user_module_access')
        .delete()
        .eq('user_id', id);
        
      // Then delete from users table
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Refresh the users list
      fetchUsers();
      
      // Close the confirmation modal
      setShowDeleteConfirm(false);
      setUserToDelete(null);
      
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Silme işlemi sırasında bir hata oluştu.');
    }
  };

  const openDetailModal = (user: UserType) => {
    setSelectedUser(user);
    fetchUserModules(user.id);
    setShowDetailModal(true);
  };

  const openEditModal = (user: UserType) => {
    setSelectedUser(user);
    setEditFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      company: user.company,
      role: user.role
    });
    setShowEditModal(true);
  };

  const openModuleModal = (user: UserType) => {
    setSelectedUser(user);
    fetchUserModules(user.id);
    setShowModuleModal(true);
    setSaveSuccess(false);
  };

  const confirmDelete = (id: string) => {
    setUserToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      handleUpdateUser(selectedUser.id, editFormData);
    }
  };

  const toggleModuleAccess = (modulePath: string) => {
    setUserModules(prev => {
      if (prev.includes(modulePath)) {
        return prev.filter(path => path !== modulePath);
      } else {
        return [...prev, modulePath];
      }
    });
  };

  const saveModuleAccess = async () => {
    if (!selectedUser) return;
    
    try {
      setSavingModules(true);
      const { error } = await supabase
        .from('user_module_access')
        .upsert([
          {
            user_id: selectedUser.id,
            modules: userModules
          }
        ], {
          onConflict: 'user_id'
        });

      if (error) throw error;
      
      // Show success message
      setSaveSuccess(true);
      
      // If the current user is updating their own permissions, refresh their access
      if (currentUser?.id === selectedUser.id) {
        await refreshModuleAccess();
      }
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error saving module access:', error);
      alert('Modül erişimi kaydedilirken bir hata oluştu.');
    } finally {
      setSavingModules(false);
    }
  };

  const exportToCSV = () => {
    // Create CSV content
    const headers = [
      'Ad', 'Soyad', 'E-posta', 'Telefon', 'Şirket', 'Rol', 'Kayıt Tarihi'
    ];
    
    const csvRows = [
      headers.join(','),
      ...users.map(user => [
        `"${user.firstName || ''}"`,
        `"${user.lastName || ''}"`,
        `"${user.email}"`,
        `"${user.phone || ''}"`,
        `"${user.company || ''}"`,
        `"${user.role}"`,
        `"${new Date(user.createdAt).toLocaleDateString('tr-TR')}"`,
      ].join(','))
    ];
    
    const csvContent = csvRows.join('\n');
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `kullanicilar-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <h1 className="text-3xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
          <p className="text-gray-600 mt-2">Sistem kullanıcılarını ve modül erişimlerini yönetin</p>
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
              placeholder="İsim, e-posta veya şirket ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
            >
              <option value="all">Tüm Roller</option>
              <option value="admin">Admin</option>
              <option value="user">Kullanıcı</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İletişim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Şirket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kayıt Tarihi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Kullanıcı bulunamadı
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.id === currentUser?.id && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                Siz
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-500" />
                          {user.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {user.company || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openDetailModal(user)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Detayları Görüntüle"
                        >
                          <FileText className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openModuleModal(user)}
                          className="text-green-600 hover:text-green-900"
                          title="Modül Erişimi"
                        >
                          <Lock className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openEditModal(user)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Düzenle"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        {user.id !== currentUser?.id && (
                          <button
                            onClick={() => confirmDelete(user.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Sil"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
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
            Toplam {users.length} kullanıcı, Sayfa {currentPage}/{totalPages}
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
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Kullanıcı Detayı
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* User Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Kullanıcı Bilgileri</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {selectedUser.firstName} {selectedUser.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {selectedUser.id === currentUser?.id && 'Aktif kullanıcı'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{selectedUser.email}</span>
                    </div>
                    {selectedUser.phone && (
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-900">{selectedUser.phone}</span>
                      </div>
                    )}
                    {selectedUser.company && (
                      <div className="flex items-center">
                        <Building className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-900">{selectedUser.company}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Hesap Bilgileri</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Shield className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                      <div>
                        <div className="font-medium text-gray-900">Rol</div>
                        <div className="text-gray-700">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            selectedUser.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {selectedUser.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                      <div>
                        <div className="font-medium text-gray-900">Kayıt Tarihi</div>
                        <div className="text-gray-700">{formatDate(selectedUser.createdAt)}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                      <div>
                        <div className="font-medium text-gray-900">Son Güncelleme</div>
                        <div className="text-gray-700">{formatDate(selectedUser.updatedAt)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Module Access */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Lock className="h-5 w-5 text-gray-400 mr-2" />
                  Modül Erişimi
                </h3>
                
                {selectedUser.role === 'admin' ? (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                    <p className="text-purple-700 flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Admin kullanıcılar tüm modüllere erişebilir
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {userModules.length === 0 ? (
                      <p className="text-gray-500 italic">Bu kullanıcının erişim yetkisi olan modül bulunmuyor.</p>
                    ) : (
                      availableModules
                        .filter(module => userModules.includes(module.path))
                        .map(module => (
                          <div key={module.id} className="flex items-center p-2 bg-green-50 border border-green-200 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                            <span className="text-green-800">{module.name}</span>
                          </div>
                        ))
                    )}
                  </div>
                )}

                <div className="mt-6">
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      openModuleModal(selectedUser);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Lock className="h-5 w-5" />
                    <span>Modül Erişimini Düzenle</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Kapat
              </button>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  openEditModal(selectedUser);
                }}
                className="px-6 py-3 bg-pest-green-600 text-white rounded-lg hover:bg-pest-green-700 transition-colors flex items-center space-x-2"
              >
                <Edit className="h-5 w-5" />
                <span>Düzenle</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Kullanıcı Düzenle
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={editFormData.firstName || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Soyad
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={editFormData.lastName || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">E-posta adresi değiştirilemez</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={editFormData.phone || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şirket
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={editFormData.company || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rol
                  </label>
                  <select
                    name="role"
                    value={editFormData.role || 'user'}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                    disabled={selectedUser.id === currentUser?.id} // Prevent changing own role
                  >
                    <option value="user">Kullanıcı</option>
                    <option value="admin">Admin</option>
                  </select>
                  {selectedUser.id === currentUser?.id && (
                    <p className="text-xs text-gray-500 mt-1">Kendi rolünüzü değiştiremezsiniz</p>
                  )}
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

      {/* Module Access Modal */}
      {showModuleModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Modül Erişimi Düzenle
              </h2>
              <button
                onClick={() => setShowModuleModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Success message */}
            {saveSuccess && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-green-700">Modül erişimi başarıyla kaydedildi!</span>
              </div>
            )}

            {selectedUser.role === 'admin' ? (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
                <div className="flex items-start">
                  <Shield className="h-6 w-6 text-purple-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-purple-800 mb-2">Admin Kullanıcı</h3>
                    <p className="text-purple-700">
                      Admin kullanıcılar otomatik olarak tüm modüllere erişebilir. Modül erişimini düzenlemek için önce kullanıcı rolünü "Kullanıcı" olarak değiştirmelisiniz.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-6">
                  <strong>{selectedUser.firstName} {selectedUser.lastName}</strong> kullanıcısının erişebileceği modülleri seçin:
                </p>
                
                <div className="space-y-4 mb-8">
                  {availableModules.map(module => (
                    <div 
                      key={module.id} 
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        userModules.includes(module.path) 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleModuleAccess(module.path)}
                    >
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                          userModules.includes(module.path) ? 'bg-green-500 text-white' : 'bg-gray-200'
                        }`}>
                          {userModules.includes(module.path) ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Lock className="h-4 w-4 text-gray-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{module.name}</h4>
                          <p className="text-sm text-gray-500">{module.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between border-t pt-6">
                  <button
                    onClick={() => setUserModules(availableModules.map(m => m.path))}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span>Tümünü Seç</span>
                  </button>
                  
                  <button
                    onClick={() => setUserModules([])}
                    className="text-red-600 hover:text-red-800 font-medium flex items-center"
                  >
                    <X className="h-4 w-4 mr-1" />
                    <span>Tümünü Kaldır</span>
                  </button>
                </div>
              </>
            )}

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowModuleModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={saveModuleAccess}
                disabled={selectedUser.role === 'admin' || savingModules}
                className="px-6 py-3 bg-pest-green-600 text-white rounded-lg hover:bg-pest-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                {savingModules ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Kaydediliyor...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Kaydet</span>
                  </>
                )}
              </button>
            </div>
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
              Kullanıcıyı Sil
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={() => userToDelete && handleDeleteUser(userToDelete)}
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

export default UserManagementPage;