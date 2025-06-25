import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { 
  Settings, 
  Save, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle,
  Key,
  Eye,
  EyeOff,
  RefreshCw,
  Mail,
  User,
  Shield,
  Send
} from 'lucide-react';

interface SystemSetting {
  id: string;
  key: string;
  value: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface SmtpSettings {
  id: string;
  host: string;
  port: number;
  username: string;
  password: string;
  from_email: string;
  from_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const SystemSettingsPage = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [moduleEmail, setModuleEmail] = useState('');
  const [modulePassword, setModulePassword] = useState('');
  
  // SMTP Settings
  const [smtpSettings, setSmtpSettings] = useState<SmtpSettings | null>(null);
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUsername, setSmtpUsername] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [smtpFromEmail, setSmtpFromEmail] = useState('');
  const [smtpFromName, setSmtpFromName] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [smtpTestResult, setSmtpTestResult] = useState<{success: boolean, message: string} | null>(null);

  useEffect(() => {
    fetchSettings();
    fetchSmtpSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('key');

      if (error) throw error;
      
      setSettings(data || []);
      
      // Set email and password from settings
      const emailSetting = data?.find(s => s.key === 'modules_email');
      const passwordSetting = data?.find(s => s.key === 'modules_password');
      
      if (emailSetting) setModuleEmail(emailSetting.value);
      if (passwordSetting) setModulePassword(passwordSetting.value);
      
    } catch (error) {
      console.error('Error fetching settings:', error);
      setError('Ayarlar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSmtpSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('smtp_settings')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No active SMTP settings found, that's okay
          return;
        }
        throw error;
      }
      
      if (data) {
        setSmtpSettings(data);
        setSmtpHost(data.host);
        setSmtpPort(data.port.toString());
        setSmtpUsername(data.username);
        setSmtpPassword(data.password);
        setSmtpFromEmail(data.from_email);
        setSmtpFromName(data.from_name);
      }
    } catch (error) {
      console.error('Error fetching SMTP settings:', error);
      setError('SMTP ayarları yüklenirken bir hata oluştu.');
    }
  };

  const handleSettingChange = (key: string, value: string) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.key === key ? { ...setting, value } : setting
      )
    );
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      // Update each setting
      for (const setting of settings) {
        const { error } = await supabase
          .from('system_settings')
          .update({ value: setting.value })
          .eq('id', setting.id);
        
        if (error) throw error;
      }
      
      // Check if modules_email exists, if not create it
      const emailSetting = settings.find(s => s.key === 'modules_email');
      if (!emailSetting) {
        const { error } = await supabase
          .from('system_settings')
          .insert([{ 
            key: 'modules_email', 
            value: moduleEmail,
            description: 'Email for accessing modules page'
          }]);
        
        if (error) throw error;
      }
      
      // Check if modules_password exists, if not create it
      const passwordSetting = settings.find(s => s.key === 'modules_password');
      if (!passwordSetting) {
        const { error } = await supabase
          .from('system_settings')
          .insert([{ 
            key: 'modules_password', 
            value: modulePassword,
            description: 'Password for accessing modules page'
          }]);
        
        if (error) throw error;
      }
      
      setSuccess('Ayarlar başarıyla kaydedildi.');
      
      // Refresh settings
      await fetchSettings();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Ayarlar kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const saveSmtpSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const smtpData = {
        host: smtpHost,
        port: parseInt(smtpPort),
        username: smtpUsername,
        password: smtpPassword,
        from_email: smtpFromEmail,
        from_name: smtpFromName,
        is_active: true
      };
      
      if (smtpSettings) {
        // Update existing settings
        const { error } = await supabase
          .from('smtp_settings')
          .update(smtpData)
          .eq('id', smtpSettings.id);
        
        if (error) throw error;
      } else {
        // Insert new settings
        const { error } = await supabase
          .from('smtp_settings')
          .insert([smtpData]);
        
        if (error) throw error;
      }
      
      setSuccess('SMTP ayarları başarıyla kaydedildi.');
      
      // Refresh SMTP settings
      await fetchSmtpSettings();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
    } catch (error) {
      console.error('Error saving SMTP settings:', error);
      setError('SMTP ayarları kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const testSmtpConnection = async () => {
    if (!testEmail) {
      setError('Test için bir e-posta adresi girmelisiniz.');
      return;
    }
    
    try {
      setTestingSmtp(true);
      setSmtpTestResult(null);
      setError(null);
      
      // Create a test request to the edge function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/test-smtp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          host: smtpHost,
          port: parseInt(smtpPort),
          username: smtpUsername,
          password: smtpPassword,
          from: smtpFromEmail,
          fromName: smtpFromName,
          to: testEmail // Include the 'to' parameter
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setSmtpTestResult({
          success: true,
          message: 'SMTP bağlantısı başarılı! Test e-postası gönderildi.'
        });
      } else {
        setSmtpTestResult({
          success: false,
          message: `SMTP bağlantı hatası: ${result.error || 'Bilinmeyen hata'}`
        });
      }
    } catch (error) {
      console.error('Error testing SMTP connection:', error);
      setSmtpTestResult({
        success: false,
        message: 'SMTP bağlantısı test edilirken bir hata oluştu.'
      });
    } finally {
      setTestingSmtp(false);
    }
  };

  const resetModulesPassword = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      // Generate a random password
      const newPassword = Math.random().toString(36).slice(-8);
      
      // Find the modules_password setting
      const modulesPasswordSetting = settings.find(s => s.key === 'modules_password');
      
      if (modulesPasswordSetting) {
        // Update the setting
        const { error } = await supabase
          .from('system_settings')
          .update({ value: newPassword })
          .eq('id', modulesPasswordSetting.id);
        
        if (error) throw error;
        
        // Update local state
        setSettings(prev => 
          prev.map(setting => 
            setting.key === 'modules_password' ? { ...setting, value: newPassword } : setting
          )
        );
        
        setModulePassword(newPassword);
        
        setSuccess('Modüller şifresi başarıyla sıfırlandı.');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        // Create new setting if it doesn't exist
        const newPassword = Math.random().toString(36).slice(-8);
        setModulePassword(newPassword);
        
        const { error } = await supabase
          .from('system_settings')
          .insert([{ 
            key: 'modules_password', 
            value: newPassword,
            description: 'Password for accessing modules page'
          }]);
        
        if (error) throw error;
        
        await fetchSettings();
        
        setSuccess('Modüller şifresi başarıyla oluşturuldu.');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      }
      
    } catch (error) {
      console.error('Error resetting password:', error);
      setError('Şifre sıfırlanırken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Sistem Ayarları</h1>
          <p className="text-gray-600 mt-2">Sistem ayarlarını yönetin</p>
        </div>
        <div className="flex space-x-4">
          <Link 
            to="/admin/dashboard" 
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Settings Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-start">
            <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Shield className="h-6 w-6 mr-2 text-pest-green-600" />
            Modüller Erişim Ayarları
          </h2>
          
          {/* Modules Access Settings */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <p className="text-gray-600 mb-6">
              Bu bölümdeki ayarlar, modüller sayfasına erişim için kullanılacak kullanıcı adı ve şifreyi belirler.
              Modüller sayfasına erişmek isteyen kullanıcılar bu bilgileri girmek zorundadır.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={moduleEmail}
                    onChange={(e) => setModuleEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500"
                    placeholder="ornek@pestmentor.com.tr"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Modüller sayfasına giriş için kullanılacak e-posta adresi
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şifre
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={modulePassword}
                    onChange={(e) => setModulePassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Modüller sayfasına giriş için kullanılacak şifre
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={resetModulesPassword}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="h-5 w-5" />
                <span>Rastgele Şifre Oluştur</span>
              </button>
            </div>
          </div>
          
          {/* SMTP Settings */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Mail className="h-6 w-6 mr-2 text-blue-600" />
            E-posta (SMTP) Ayarları
          </h2>
          
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <p className="text-gray-600 mb-6">
              E-posta gönderimi için SMTP sunucu ayarlarını yapılandırın. Bu ayarlar, sistem tarafından gönderilen tüm e-postalar için kullanılacaktır.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Sunucu (Host)
                </label>
                <input
                  type="text"
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="smtp.example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Port
                </label>
                <input
                  type="number"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="587"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kullanıcı Adı
                </label>
                <input
                  type="text"
                  value={smtpUsername}
                  onChange={(e) => setSmtpUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="username@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şifre
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={smtpPassword}
                    onChange={(e) => setSmtpPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gönderen E-posta
                </label>
                <input
                  type="email"
                  value={smtpFromEmail}
                  onChange={(e) => setSmtpFromEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="noreply@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gönderen Adı
                </label>
                <input
                  type="text"
                  value={smtpFromName}
                  onChange={(e) => setSmtpFromName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="PestMentor"
                />
              </div>
            </div>
            
            <div className="mt-6 border-t border-blue-200 pt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">SMTP Bağlantı Testi</h3>
              
              <div className="flex items-end gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test E-posta Adresi
                  </label>
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="test@example.com"
                  />
                </div>
                
                <button
                  onClick={testSmtpConnection}
                  disabled={testingSmtp || !smtpHost || !smtpUsername || !smtpPassword || !smtpFromEmail || !testEmail}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {testingSmtp ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Test Ediliyor...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Bağlantıyı Test Et</span>
                    </>
                  )}
                </button>
              </div>
              
              {smtpTestResult && (
                <div className={`mt-4 p-4 rounded-lg ${
                  smtpTestResult.success ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                  <div className="flex items-start">
                    {smtpTestResult.success ? (
                      <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    )}
                    <span>{smtpTestResult.message}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={saveSmtpSettings}
                disabled={saving || !smtpHost || !smtpUsername || !smtpPassword || !smtpFromEmail}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Kaydediliyor...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>SMTP Ayarlarını Kaydet</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Other settings can be added here */}
          
          <div className="flex justify-end mt-8">
            <button
              onClick={saveSettings}
              disabled={saving}
              className="bg-pest-green-600 text-white px-6 py-3 rounded-lg hover:bg-pest-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Ayarları Kaydet</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsPage;