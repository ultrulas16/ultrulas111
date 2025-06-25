import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Send, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Calendar, 
  Mail, 
  Users, 
  CheckCircle, 
  X, 
  AlertCircle,
  Eye,
  Clock,
  ArrowLeft,
  FileText,
  BarChart3
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Campaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  recipient_group: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  scheduled_at: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  recipient_count: number;
  open_count: number;
  click_count: number;
}

interface RecipientGroup {
  id: string;
  name: string;
  description: string | null;
  count: number;
}

const EmailCampaignsPage = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [recipientGroups, setRecipientGroups] = useState<RecipientGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null);
  const [sendingCampaign, setSendingCampaign] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaigns();
    fetchRecipientGroups();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('email_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipientGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('recipient_groups')
        .select('*')
        .order('name');

      if (error) throw error;
      setRecipientGroups(data || []);
    } catch (error) {
      console.error('Error fetching recipient groups:', error);
    }
  };

  const getFilteredCampaigns = () => {
    return campaigns.filter(campaign => {
      const matchesSearch = 
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.subject.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  const handleDeleteCampaign = async (id: string) => {
    try {
      const { error } = await supabase
        .from('email_campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCampaigns(campaigns.filter(campaign => campaign.id !== id));
      setShowDeleteConfirm(false);
      setCampaignToDelete(null);
      setSuccess('Kampanya başarıyla silindi');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error deleting campaign:', error);
      setError('Kampanya silinirken bir hata oluştu');
      setTimeout(() => setError(null), 3000);
    }
  };

  const confirmDelete = (id: string) => {
    setCampaignToDelete(id);
    setShowDeleteConfirm(true);
  };

  const viewCampaignDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowDetailModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'sent': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Taslak';
      case 'scheduled': return 'Planlandı';
      case 'sent': return 'Gönderildi';
      case 'failed': return 'Başarısız';
      default: return status;
    }
  };

  const getRecipientGroupName = (id: string) => {
    const group = recipientGroups.find(g => g.id === id);
    return group ? group.name : 'Bilinmeyen Grup';
  };

  const handleSendCampaign = async (campaignId: string) => {
    try {
      setSendingCampaign(true);
      setError(null);
      
      // First check if SMTP settings are configured
      const { data: smtpSettings, error: smtpError } = await supabase
        .from('smtp_settings')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();
      
      if (smtpError) {
        throw new Error('SMTP ayarlarını kontrol ederken bir hata oluştu');
      }
      
      if (!smtpSettings) {
        throw new Error('Aktif SMTP ayarı bulunamadı. Lütfen önce SMTP ayarlarını yapılandırın.');
      }
      
      // Call the Edge Function to send the campaign
      const { data, error } = await supabase.functions.invoke('send-campaign', {
        body: { campaignId }
      });
      
      if (error) {
        console.error('Error sending campaign:', error);
        throw new Error(`Kampanya gönderilirken bir hata oluştu: ${error.message}`);
      }
      
      if (!data.success) {
        throw new Error(data.message || 'Kampanya gönderilirken bir hata oluştu');
      }
      
      // Refresh campaigns to show updated status
      await fetchCampaigns();
      
      setSuccess('Kampanya başarıyla gönderildi!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error('Error sending campaign:', error);
      setError(error.message || 'Kampanya gönderilirken bir hata oluştu');
    } finally {
      setSendingCampaign(false);
    }
  };

  const filteredCampaigns = getFilteredCampaigns();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">E-posta Kampanyaları</h1>
          <p className="text-gray-600 mt-2">E-posta kampanyalarını oluşturun, düzenleyin ve gönderin</p>
        </div>
        <div className="flex space-x-4">
          <Link 
            to="/admin/dashboard" 
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link 
            to="/admin/recipient-groups" 
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Users className="h-5 w-5" />
            <span>Alıcı Grupları</span>
          </Link>
          <Link 
            to="/admin/email-campaigns/new" 
            className="flex items-center space-x-2 bg-pest-green-600 text-white px-4 py-2 rounded-lg hover:bg-pest-green-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Yeni Kampanya</span>
          </Link>
        </div>
      </div>

      {/* Success and Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Kampanya ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="draft">Taslak</option>
              <option value="scheduled">Planlandı</option>
              <option value="sent">Gönderildi</option>
              <option value="failed">Başarısız</option>
            </select>
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kampanya
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alıcı Grubu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İstatistikler
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
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Kampanya bulunamadı
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                        <div className="text-sm text-gray-500">{campaign.subject}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {getRecipientGroupName(campaign.recipient_group)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {campaign.recipient_count > 0 ? `${campaign.recipient_count} alıcı` : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                        {getStatusText(campaign.status)}
                      </span>
                      {campaign.scheduled_at && campaign.status === 'scheduled' && (
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(campaign.scheduled_at).toLocaleString('tr-TR')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {campaign.status === 'sent' ? (
                        <div className="text-xs text-gray-600">
                          <div className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            <span>Açılma: {campaign.open_count || 0}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <Mail className="h-3 w-3 mr-1" />
                            <span>Tıklama: {campaign.click_count || 0}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(campaign.created_at).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewCampaignDetails(campaign)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Detaylar"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        {campaign.status === 'draft' && (
                          <>
                            <Link
                              to={`/admin/email-campaigns/edit/${campaign.id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Düzenle"
                            >
                              <Edit className="h-5 w-5" />
                            </Link>
                            <button
                              onClick={() => handleSendCampaign(campaign.id)}
                              disabled={sendingCampaign}
                              className="text-green-600 hover:text-green-900 disabled:opacity-50"
                              title="Gönder"
                            >
                              <Send className="h-5 w-5" />
                            </button>
                          </>
                        )}
                        {campaign.status === 'sent' && (
                          <Link
                            to={`/admin/email-campaigns/analytics/${campaign.id}`}
                            className="text-purple-600 hover:text-purple-900"
                            title="Analitik"
                          >
                            <BarChart3 className="h-5 w-5" />
                          </Link>
                        )}
                        <button
                          onClick={() => confirmDelete(campaign.id)}
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

      {/* Campaign Detail Modal */}
      {showDetailModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Kampanya Detayı
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Kampanya Bilgileri</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Kampanya Adı
                    </label>
                    <div className="text-gray-900 font-medium">{selectedCampaign.name}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Konu
                    </label>
                    <div className="text-gray-900">{selectedCampaign.subject}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Alıcı Grubu
                    </label>
                    <div className="text-gray-900">{getRecipientGroupName(selectedCampaign.recipient_group)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Durum
                    </label>
                    <div>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedCampaign.status)}`}>
                        {getStatusText(selectedCampaign.status)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Oluşturulma Tarihi
                    </label>
                    <div className="text-gray-900">{new Date(selectedCampaign.created_at).toLocaleString('tr-TR')}</div>
                  </div>
                  {selectedCampaign.sent_at && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Gönderim Tarihi
                      </label>
                      <div className="text-gray-900">{new Date(selectedCampaign.sent_at).toLocaleString('tr-TR')}</div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">İçerik Önizleme</h3>
                <div className="border border-gray-200 rounded-lg p-4 h-96 overflow-y-auto">
                  <div dangerouslySetInnerHTML={{ __html: selectedCampaign.content }} />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              {selectedCampaign.status === 'draft' && (
                <div className="flex justify-end space-x-4">
                  <Link
                    to={`/admin/email-campaigns/edit/${selectedCampaign.id}`}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Düzenle
                  </Link>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleSendCampaign(selectedCampaign.id);
                    }}
                    disabled={sendingCampaign}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {sendingCampaign ? 'Gönderiliyor...' : 'Gönder'}
                  </button>
                </div>
              )}
              {selectedCampaign.status === 'sent' && (
                <div className="flex justify-end">
                  <Link
                    to={`/admin/email-campaigns/analytics/${selectedCampaign.id}`}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Analitik Görüntüle
                  </Link>
                </div>
              )}
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
              Kampanyayı Sil
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Bu kampanyayı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={() => campaignToDelete && handleDeleteCampaign(campaignToDelete)}
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

export default EmailCampaignsPage;