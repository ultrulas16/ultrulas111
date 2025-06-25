import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  ArrowLeft, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  Upload,
  Download,
  Save,
  FileText
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface RecipientGroup {
  id: string;
  name: string;
  description: string;
  count: number;
  created_at: string;
  updated_at: string;
}

interface Recipient {
  id: string;
  group_id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  created_at: string;
}

const RecipientGroupsPage = () => {
  const [groups, setGroups] = useState<RecipientGroup[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showRecipientModal, setShowRecipientModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<Partial<RecipientGroup>>({});
  const [currentRecipient, setCurrentRecipient] = useState<Partial<Recipient>>({});
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: 'group' | 'recipient'} | null>(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroupId) {
      fetchRecipients(selectedGroupId);
    }
  }, [selectedGroupId]);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('recipient_groups')
        .select('*')
        .order('name');

      if (error) throw error;
      setGroups(data || []);
      
      if (data && data.length > 0 && !selectedGroupId) {
        setSelectedGroupId(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
      setError('Gruplar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipients = async (groupId: string) => {
    try {
      const { data, error } = await supabase
        .from('recipients')
        .select('*')
        .eq('group_id', groupId)
        .order('name');

      if (error) throw error;
      setRecipients(data || []);
    } catch (error) {
      console.error('Error fetching recipients:', error);
      setError('Alıcılar yüklenirken bir hata oluştu.');
    }
  };

  const handleGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentGroup.id) {
        // Update existing group
        const { error } = await supabase
          .from('recipient_groups')
          .update({
            name: currentGroup.name,
            description: currentGroup.description
          })
          .eq('id', currentGroup.id);

        if (error) throw error;
        setSuccess('Grup başarıyla güncellendi.');
      } else {
        // Create new group
        const { error } = await supabase
          .from('recipient_groups')
          .insert([{
            name: currentGroup.name,
            description: currentGroup.description,
            count: 0
          }]);

        if (error) throw error;
        setSuccess('Grup başarıyla oluşturuldu.');
      }

      setShowGroupModal(false);
      fetchGroups();
    } catch (error) {
      console.error('Error saving group:', error);
      setError('Grup kaydedilirken bir hata oluştu.');
    }
  };

  const handleRecipientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!selectedGroupId) {
        setError('Lütfen önce bir grup seçin.');
        return;
      }

      if (currentRecipient.id) {
        // Update existing recipient
        const { error } = await supabase
          .from('recipients')
          .update({
            name: currentRecipient.name,
            email: currentRecipient.email,
            phone: currentRecipient.phone,
            company: currentRecipient.company
          })
          .eq('id', currentRecipient.id);

        if (error) throw error;
        setSuccess('Alıcı başarıyla güncellendi.');
      } else {
        // Create new recipient
        const { error } = await supabase
          .from('recipients')
          .insert([{
            group_id: selectedGroupId,
            name: currentRecipient.name,
            email: currentRecipient.email,
            phone: currentRecipient.phone,
            company: currentRecipient.company
          }]);

        if (error) throw error;
        
        // Update group count
        await updateGroupCount(selectedGroupId);
        
        setSuccess('Alıcı başarıyla eklendi.');
      }

      setShowRecipientModal(false);
      fetchRecipients(selectedGroupId);
    } catch (error) {
      console.error('Error saving recipient:', error);
      setError('Alıcı kaydedilirken bir hata oluştu.');
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportFile(file);
      
      // Preview CSV file
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const csv = event.target?.result as string;
          const lines = csv.split('\n');
          const headers = lines[0].split(',');
          
          const preview = [];
          for (let i = 1; i < Math.min(6, lines.length); i++) {
            if (lines[i].trim()) {
              const values = lines[i].split(',');
              const row: any = {};
              headers.forEach((header, index) => {
                row[header.trim()] = values[index]?.trim() || '';
              });
              preview.push(row);
            }
          }
          
          setImportPreview(preview);
        } catch (error) {
          console.error('Error parsing CSV:', error);
          setError('CSV dosyası işlenirken bir hata oluştu.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleImportSubmit = async () => {
    if (!importFile || !selectedGroupId) {
      setError('Lütfen bir dosya ve grup seçin.');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const csv = event.target?.result as string;
          const lines = csv.split('\n');
          const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
          
          // Validate headers
          const requiredHeaders = ['name', 'email'];
          const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
          
          if (missingHeaders.length > 0) {
            setError(`CSV dosyasında gerekli başlıklar eksik: ${missingHeaders.join(', ')}`);
            return;
          }
          
          // Process data
          const recipients = [];
          for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
              const values = lines[i].split(',');
              const recipient: any = {
                group_id: selectedGroupId
              };
              
              headers.forEach((header, index) => {
                if (values[index]) {
                  recipient[header] = values[index].trim();
                }
              });
              
              // Validate required fields
              if (recipient.name && recipient.email) {
                recipients.push(recipient);
              }
            }
          }
          
          if (recipients.length === 0) {
            setError('İçe aktarılacak geçerli alıcı bulunamadı.');
            return;
          }
          
          // Insert recipients in batches
          const batchSize = 100;
          for (let i = 0; i < recipients.length; i += batchSize) {
            const batch = recipients.slice(i, i + batchSize);
            const { error } = await supabase
              .from('recipients')
              .insert(batch);
            
            if (error) throw error;
          }
          
          // Update group count
          await updateGroupCount(selectedGroupId);
          
          setSuccess(`${recipients.length} alıcı başarıyla içe aktarıldı.`);
          setShowImportModal(false);
          fetchRecipients(selectedGroupId);
        } catch (error) {
          console.error('Error importing recipients:', error);
          setError('Alıcılar içe aktarılırken bir hata oluştu.');
        }
      };
      reader.readAsText(importFile);
    } catch (error) {
      console.error('Error reading file:', error);
      setError('Dosya okunurken bir hata oluştu.');
    }
  };

  const handleExportRecipients = async () => {
    if (!selectedGroupId || recipients.length === 0) {
      setError('Dışa aktarılacak alıcı bulunamadı.');
      return;
    }

    try {
      // Create CSV content
      const headers = ['name', 'email', 'phone', 'company'];
      const csvRows = [
        headers.join(','),
        ...recipients.map(recipient => [
          recipient.name,
          recipient.email,
          recipient.phone || '',
          recipient.company || ''
        ].join(','))
      ];
      
      const csvContent = csvRows.join('\n');
      
      // Create a blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `recipients_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSuccess('Alıcılar başarıyla dışa aktarıldı.');
    } catch (error) {
      console.error('Error exporting recipients:', error);
      setError('Alıcılar dışa aktarılırken bir hata oluştu.');
    }
  };

  const updateGroupCount = async (groupId: string) => {
    try {
      // Get current count
      const { data: countData, error: countError } = await supabase
        .from('recipients')
        .select('id', { count: 'exact' })
        .eq('group_id', groupId);
      
      if (countError) throw countError;
      
      // Update group count
      const { error: updateError } = await supabase
        .from('recipient_groups')
        .update({ count: countData.length })
        .eq('id', groupId);
      
      if (updateError) throw updateError;
      
      // Refresh groups
      fetchGroups();
    } catch (error) {
      console.error('Error updating group count:', error);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === 'group') {
        // Delete group and all its recipients (cascade)
        const { error } = await supabase
          .from('recipient_groups')
          .delete()
          .eq('id', itemToDelete.id);

        if (error) throw error;
        setSuccess('Grup ve tüm alıcıları başarıyla silindi.');
        fetchGroups();
        setSelectedGroupId(null);
      } else {
        // Delete recipient
        const { error } = await supabase
          .from('recipients')
          .delete()
          .eq('id', itemToDelete.id);

        if (error) throw error;
        
        // Update group count
        if (selectedGroupId) {
          await updateGroupCount(selectedGroupId);
        }
        
        setSuccess('Alıcı başarıyla silindi.');
        if (selectedGroupId) {
          fetchRecipients(selectedGroupId);
        }
      }

      setShowDeleteConfirm(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting item:', error);
      setError('Silme işlemi sırasında bir hata oluştu.');
    }
  };

  const confirmDelete = (id: string, type: 'group' | 'recipient') => {
    setItemToDelete({ id, type });
    setShowDeleteConfirm(true);
  };

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRecipients = recipients.filter(recipient => 
    recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipient.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alıcı Grupları</h1>
          <p className="text-gray-600 mt-2">E-posta kampanyaları için alıcı gruplarını yönetin</p>
        </div>
        <div className="flex space-x-4">
          <Link 
            to="/admin/email-campaigns" 
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Kampanyalara Dön</span>
          </Link>
        </div>
      </div>

      {/* Success and Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>{success}</span>
          <button 
            onClick={() => setSuccess(null)} 
            className="ml-auto text-green-700 hover:text-green-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span>{error}</span>
          <button 
            onClick={() => setError(null)} 
            className="ml-auto text-red-700 hover:text-red-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Groups List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Gruplar</h2>
              <button
                onClick={() => {
                  setCurrentGroup({});
                  setShowGroupModal(true);
                }}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                title="Yeni Grup"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Grup ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {filteredGroups.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Grup bulunamadı
                </div>
              ) : (
                filteredGroups.map((group) => (
                  <div 
                    key={group.id} 
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedGroupId === group.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedGroupId(group.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{group.name}</h3>
                        <p className="text-sm text-gray-500">{group.count} alıcı</p>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentGroup(group);
                            setShowGroupModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Düzenle"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDelete(group.id, 'group');
                          }}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Sil"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {group.description && (
                      <p className="text-xs text-gray-500 mt-1">{group.description}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recipients List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {selectedGroupId 
                  ? `Alıcılar: ${groups.find(g => g.id === selectedGroupId)?.name}` 
                  : 'Alıcılar'}
              </h2>
              <div className="flex space-x-2">
                {selectedGroupId && (
                  <>
                    <button
                      onClick={() => {
                        setCurrentRecipient({});
                        setShowRecipientModal(true);
                      }}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                      title="Yeni Alıcı"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Alıcı Ekle</span>
                    </button>
                    <button
                      onClick={() => setShowImportModal(true)}
                      className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
                      title="İçe Aktar"
                    >
                      <Upload className="h-4 w-4" />
                      <span>İçe Aktar</span>
                    </button>
                    <button
                      onClick={handleExportRecipients}
                      className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-1"
                      title="Dışa Aktar"
                      disabled={recipients.length === 0}
                    >
                      <Download className="h-4 w-4" />
                      <span>Dışa Aktar</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {!selectedGroupId ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Lütfen bir grup seçin</h3>
                <p className="text-gray-500">Alıcıları görüntülemek için soldaki listeden bir grup seçin.</p>
              </div>
            ) : recipients.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Alıcı Bulunamadı</h3>
                <p className="text-gray-500 mb-4">Bu grupta henüz alıcı bulunmuyor.</p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      setCurrentRecipient({});
                      setShowRecipientModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Alıcı Ekle</span>
                  </button>
                  <button
                    onClick={() => setShowImportModal(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Upload className="h-5 w-5" />
                    <span>CSV İçe Aktar</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İsim
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          E-posta
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Telefon
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Şirket
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredRecipients.map((recipient) => (
                        <tr key={recipient.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{recipient.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{recipient.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{recipient.phone || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{recipient.company || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setCurrentRecipient(recipient);
                                  setShowRecipientModal(true);
                                }}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Düzenle"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => confirmDelete(recipient.id, 'recipient')}
                                className="text-red-600 hover:text-red-900"
                                title="Sil"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Group Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {currentGroup.id ? 'Grubu Düzenle' : 'Yeni Grup'}
              </h2>
              <button
                onClick={() => setShowGroupModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleGroupSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grup Adı *
                </label>
                <input
                  type="text"
                  value={currentGroup.name || ''}
                  onChange={(e) => setCurrentGroup({...currentGroup, name: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Grup adı"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  value={currentGroup.description || ''}
                  onChange={(e) => setCurrentGroup({...currentGroup, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Grup açıklaması"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowGroupModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {currentGroup.id ? 'Güncelle' : 'Oluştur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recipient Modal */}
      {showRecipientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {currentRecipient.id ? 'Alıcıyı Düzenle' : 'Yeni Alıcı'}
              </h2>
              <button
                onClick={() => setShowRecipientModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleRecipientSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İsim *
                </label>
                <input
                  type="text"
                  value={currentRecipient.name || ''}
                  onChange={(e) => setCurrentRecipient({...currentRecipient, name: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Alıcı adı"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta *
                </label>
                <input
                  type="email"
                  value={currentRecipient.email || ''}
                  onChange={(e) => setCurrentRecipient({...currentRecipient, email: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="E-posta adresi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={currentRecipient.phone || ''}
                  onChange={(e) => setCurrentRecipient({...currentRecipient, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Telefon numarası"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şirket
                </label>
                <input
                  type="text"
                  value={currentRecipient.company || ''}
                  onChange={(e) => setCurrentRecipient({...currentRecipient, company: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Şirket adı"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowRecipientModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {currentRecipient.id ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                CSV Dosyasından İçe Aktar
              </h2>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CSV Dosyası *
                </label>
                <div className="flex items-center">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleImportFile}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label
                    htmlFor="csv-upload"
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200 transition-colors flex items-center"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    CSV Dosyası Seç
                  </label>
                  {importFile && (
                    <span className="ml-3 text-sm text-gray-600">
                      {importFile.name}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  CSV dosyası en az "name" ve "email" sütunlarını içermelidir.
                </p>
              </div>

              {importPreview.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Önizleme</h3>
                  <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          {Object.keys(importPreview[0]).map((header) => (
                            <th 
                              key={header} 
                              className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {importPreview.map((row, index) => (
                          <tr key={index}>
                            {Object.values(row).map((value, i) => (
                              <td key={i} className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                {value as string}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    İlk 5 satır gösteriliyor. Toplam {importFile?.size} byte.
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="button"
                  onClick={handleImportSubmit}
                  disabled={!importFile}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  İçe Aktar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-center mb-6 text-red-600">
              <AlertTriangle className="h-12 w-12" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
              {itemToDelete?.type === 'group' ? 'Grubu Sil' : 'Alıcıyı Sil'}
            </h2>
            <p className="text-gray-600 text-center mb-6">
              {itemToDelete?.type === 'group' 
                ? 'Bu grubu ve içindeki tüm alıcıları silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.'
                : 'Bu alıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.'}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSV Template Download Section */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <FileText className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">CSV Şablonu</h3>
            <p className="text-blue-700 mb-4">
              Alıcılarınızı toplu olarak içe aktarmak için aşağıdaki CSV şablonunu kullanabilirsiniz.
              Şablonu indirin, Excel veya benzeri bir programda düzenleyin ve içe aktarın.
            </p>
            <button
              onClick={() => {
                // Create CSV template
                const headers = ['name', 'email', 'phone', 'company'];
                const exampleRow = ['John Doe', 'john@example.com', '5551234567', 'ABC Company'];
                const csvContent = [headers.join(','), exampleRow.join(',')].join('\n');
                
                // Create a blob and download link
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.setAttribute('href', url);
                link.setAttribute('download', 'recipients_template.csv');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 inline-flex"
            >
              <Download className="h-5 w-5" />
              <span>CSV Şablonu İndir</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipientGroupsPage;