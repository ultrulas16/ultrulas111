import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Shield, 
  Clock, 
  Save, 
  AlertCircle, 
  CheckCircle, 
  Lock,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ProfilePage = () => {
  const { user, updateProfile, moduleAccess, refreshModuleAccess } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    company: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [modules, setModules] = useState<{id: string, name: string, path: string}[]>([]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        company: user.company || ''
      });
    }

    // Refresh module access to ensure we have the latest data
    refreshModuleAccess();

    // Set available modules
    setModules([
      { id: 'risk-assessment', name: 'Risk Değerlendirme', path: '/moduller/risk-degerlendirme' },
      { id: 'inspection-report', name: 'Denetim Raporu', path: '/moduller/denetim-raporu' },
      { id: 'compliance-check', name: 'Uygunluk Kontrol', path: '/moduller/uygunluk-kontrol' },
      { id: 'contract', name: 'Sözleşme', path: '/moduller/sozlesme' },
      { id: 'layout-designer', name: 'Ekipman Krokisi', path: '/moduller/ekipman-krokisi' },
      { id: 'trend-analysis', name: 'Trend Analiz', path: '/moduller/trend-analiz' },
      { id: 'visit-calendar', name: 'Ziyaret Takvimi', path: '/moduller/ziyaret-takvimi' },
      { id: 'auto-trend-analysis', name: 'Otomatik Trend Analiz', path: '/moduller/otomatik-trend-analiz' },
      { id: 'training-presentation', name: 'Eğitim Sunumu', path: '/moduller/egitim-sunumu' },
      { id: 'training-certificate', name: 'Eğitim Sertifikası', path: '/moduller/egitim-sertifikasi' },
      { id: 'quote-generator', name: 'Fiyat Teklifi', path: '/moduller/fiyat-teklifi' }
    ]);
  }, [user, refreshModuleAccess]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { error } = await updateProfile(formData);
      
      if (error) {
        throw new Error(error.message || 'Profil güncellenirken bir hata oluştu');
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Kullanıcı bilgileri yüklenemedi</p>
          <Link 
            to="/auth/login" 
            className="bg-pest-green-600 text-white px-4 py-2 rounded-lg hover:bg-pest-green-700 transition-colors"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link to="/moduller" className="text-gray-600 hover:text-gray-800 mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Profil Bilgilerim</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Kişisel Bilgiler</h2>
            
            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Profil bilgileriniz başarıyla güncellendi</span>
              </div>
            )}
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
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
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
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
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şirket
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-pest-green-600 text-white px-6 py-3 rounded-lg hover:bg-pest-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Kaydediliyor...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>Değişiklikleri Kaydet</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Account Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Hesap Bilgileri</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Rol</p>
                  <p className="font-medium text-gray-900">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Kayıt Tarihi</p>
                  <p className="font-medium text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">E-posta</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link 
                to="/auth/change-password" 
                className="text-pest-green-600 hover:text-pest-green-700 font-medium flex items-center"
              >
                <Lock className="h-5 w-5 mr-2" />
                Şifremi Değiştir
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Lock className="h-5 w-5 text-gray-700 mr-2" />
              Modül Erişimi
            </h2>
            
            {user.role === 'admin' ? (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-purple-700 flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Admin olarak tüm modüllere erişebilirsiniz
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {moduleAccess.length === 0 ? (
                  <p className="text-gray-500 italic">Henüz erişim yetkiniz olan modül bulunmuyor.</p>
                ) : (
                  modules
                    .filter(module => moduleAccess.includes(module.path))
                    .map(module => (
                      <div key={module.id} className="flex items-center p-2 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-green-800">{module.name}</span>
                      </div>
                    ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;