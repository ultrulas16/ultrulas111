import React, { useState, useRef } from 'react';
import {
  Eye,
  CheckCircle,
  X,
  Download,
  Save,
  Building,
  Calendar,
  User,
  Camera,
  Upload,
  Plus,
  Trash2,
  AlertTriangle,
  Info,
  Image as ImageIcon
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface CheckItem {
  id: string;
  area: string;
  item: string;
  status: 'compliant' | 'non-compliant' | 'not-applicable';
  notes: string;
  photo: string | null;
  correctiveAction: string;
}

interface ReportInfo {
  companyName: string;
  companyAddress: string;
  visitDate: string;
  operatorName: string;
  inspectorName: string;
  inspectorTitle: string;
  generalNotes: string;
  companyLogo: string | null;
  footerText: string;
}

const ThirdEyeReportPage = () => {
  const [checkItems, setCheckItems] = useState<CheckItem[]>([
    {
      id: '1',
      area: 'Depo Alanı',
      item: 'Kemirgen istasyonlarının düzgün yerleştirilmesi',
      status: 'compliant',
      notes: '',
      photo: null,
      correctiveAction: ''
    },
    {
      id: '2',
      area: 'Üretim Alanı',
      item: 'EFK cihazlarının düzgün çalışması',
      status: 'compliant',
      notes: '',
      photo: null,
      correctiveAction: ''
    },
    {
      id: '3',
      area: 'Giriş Kapısı',
      item: 'Hava perdesi ve kapı fitillerinin durumu',
      status: 'non-compliant',
      notes: 'Kapı fitili yıpranmış durumda',
      photo: null,
      correctiveAction: 'Kapı fitilinin değiştirilmesi'
    }
  ]);

  const [reportInfo, setReportInfo] = useState<ReportInfo>({
    companyName: '',
    companyAddress: '',
    visitDate: new Date().toISOString().split('T')[0],
    operatorName: '',
    inspectorName: '',
    inspectorTitle: '',
    generalNotes: '',
    companyLogo: null,
    footerText: 'PestMentor © 2025 | Sistem İlaçlama San. ve Tic. Ltd. Şti. | www.pestmentor.com.tr'
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCheckItemForm, setShowCheckItemForm] = useState(false);
  const [currentCheckItem, setCurrentCheckItem] = useState<CheckItem | null>(null);
  const [activeTab, setActiveTab] = useState<'report' | 'preview'>('report');

  const reportRef = useRef<HTMLDivElement>(null);

  // Handle report info changes
  const handleReportInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReportInfo(prev => ({ ...prev, [name]: value }));
  };

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setReportInfo(prev => ({ ...prev, companyLogo: event.target?.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add a new check item
  const addCheckItem = () => {
    const newCheckItem: CheckItem = {
      id: Date.now().toString(),
      area: '',
      item: '',
      status: 'compliant',
      notes: '',
      photo: null,
      correctiveAction: ''
    };

    setCurrentCheckItem(newCheckItem);
    setShowCheckItemForm(true);
  };

  // Edit an existing check item
  const editCheckItem = (item: CheckItem) => {
    setCurrentCheckItem(item);
    setShowCheckItemForm(true);
  };

  // Delete a check item
  const deleteCheckItem = (id: string) => {
    setCheckItems(checkItems.filter(item => item.id !== id));
  };

  // Save check item changes
  const saveCheckItem = () => {
    if (!currentCheckItem) return;

    if (checkItems.some(item => item.id === currentCheckItem.id)) {
      setCheckItems(checkItems.map(item => item.id === currentCheckItem.id ? currentCheckItem : item));
    } else {
      setCheckItems([...checkItems, currentCheckItem]);
    }

    setShowCheckItemForm(false);
    setCurrentCheckItem(null);
  };

  // Handle check item form input changes
  const handleCheckItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!currentCheckItem) return;

    const { name, value } = e.target;
    setCurrentCheckItem({ ...currentCheckItem, [name]: value });
  };

  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentCheckItem) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCurrentCheckItem({ ...currentCheckItem, photo: event.target?.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800';
      case 'non-compliant': return 'bg-red-100 text-red-800';
      case 'not-applicable': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status text
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'compliant': return 'Uygun';
      case 'non-compliant': return 'Uygun Değil';
      case 'not-applicable': return 'Geçerli Değil';
      default: return status;
    }
  };

  // Calculate statistics
  const calculateStats = () => {
    const total = checkItems.length;
    const compliant = checkItems.filter(item => item.status === 'compliant').length;
    const nonCompliant = checkItems.filter(item => item.status === 'non-compliant').length;
    const notApplicable = checkItems.filter(item => item.status === 'not-applicable').length;
    const complianceRate = total > 0 ? Math.round((compliant / (total - notApplicable)) * 100) : 0;

    return { total, compliant, nonCompliant, notApplicable, complianceRate };
  };

  // Generate PDF report
  const generatePDF = async () => {
    if (!reportRef.current) return;

    setLoading(true);
    setError(null);

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`3_Göz_Raporu_${reportInfo.companyName || 'Rapor'}.pdf`);

      setSuccess('PDF raporu başarıyla oluşturuldu!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('PDF generation error:', error);
      setError('PDF oluşturulurken bir hata meydana geldi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  // Generate JPEG image
  const generateJPEG = async () => {
    if (!reportRef.current) return;

    setLoading(true);
    setError(null);

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `3_Göz_Raporu_${reportInfo.companyName || 'Rapor'}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSuccess('JPEG görüntüsü başarıyla oluşturuldu!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('JPEG generation error:', error);
      setError('JPEG oluşturulurken bir hata meydana geldi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const stats = calculateStats();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tabs */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">3. Göz Denetim Raporu</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('report')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'report'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Rapor Oluştur
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'preview'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Önizleme
          </button>
        </div>
      </div>

      {/* Success and Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {/* Report Creation Form */}
      {activeTab === 'report' && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Report Info Form */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Building className="h-6 w-6 text-amber-600 mr-2" />
                Rapor Bilgileri
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Şirket Adı
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={reportInfo.companyName}
                    onChange={handleReportInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Şirket adını girin"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Şirket Adresi
                  </label>
                  <input
                    type="text"
                    name="companyAddress"
                    value={reportInfo.companyAddress}
                    onChange={handleReportInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Şirket adresini girin"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ziyaret Tarihi
                  </label>
                  <input
                    type="date"
                    name="visitDate"
                    value={reportInfo.visitDate}
                    onChange={handleReportInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Operatör Adı
                  </label>
                  <input
                    type="text"
                    name="operatorName"
                    value={reportInfo.operatorName}
                    onChange={handleReportInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Operatörün adı"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Denetçi Adı (3. Göz)
                  </label>
                  <input
                    type="text"
                    name="inspectorName"
                    value={reportInfo.inspectorName}
                    onChange={handleReportInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Denetçinin adı"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Denetçi Ünvanı
                  </label>
                  <input
                    type="text"
                    name="inspectorTitle"
                    value={reportInfo.inspectorTitle}
                    onChange={handleReportInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Ör: Süpervizör, Kalite Müdürü"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Genel Notlar
                  </label>
                  <textarea
                    name="generalNotes"
                    value={reportInfo.generalNotes}
                    onChange={handleReportInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Genel değerlendirme notları"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Şirket Logosu
                  </label>
                  <div className="flex items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200 transition-colors flex items-center"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Logo Yükle
                    </label>
                    {reportInfo.companyLogo && (
                      <div className="ml-4 relative">
                        <img src={reportInfo.companyLogo} alt="Logo" className="h-10 object-contain" />
                        <button
                          onClick={() => setReportInfo(prev => ({ ...prev, companyLogo: null }))}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alt Bilgi Metni
                  </label>
                  <input
                    type="text"
                    name="footerText"
                    value={reportInfo.footerText}
                    onChange={handleReportInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Alt bilgi metni"
                  />
                </div>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Rapor Oluştur</h2>

              <div className="flex flex-col space-y-3">
                <button
                  onClick={generatePDF}
                  disabled={loading}
                  className="flex items-center justify-center bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors disabled:bg-gray-400"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      PDF Oluşturuluyor...
                    </span>
                  ) : (
                    <>
                      <Download className="mr-2" size={18} />
                      PDF İndir
                    </>
                  )}
                </button>

                <button
                  onClick={generateJPEG}
                  disabled={loading}
                  className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      JPEG Oluşturuluyor...
                    </span>
                  ) : (
                    <>
                      <ImageIcon className="mr-2" size={18} />
                      JPEG İndir
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">İstatistikler</h2>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Toplam Kontrol:</span>
                  <span className="font-semibold text-gray-800">{stats.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Uygun:</span>
                  <span className="font-semibold text-green-600">{stats.compliant}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Uygun Değil:</span>
                  <span className="font-semibold text-red-600">{stats.nonCompliant}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Geçerli Değil:</span>
                  <span className="font-semibold text-gray-600">{stats.notApplicable}</span>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Uygunluk Oranı:</span>
                    <span className="font-bold text-blue-600 text-xl">{stats.complianceRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Check Items List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Kontrol Listesi</h2>
                <button
                  onClick={addCheckItem}
                  className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors flex items-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Yeni Kontrol Ekle
                </button>
              </div>

              {checkItems.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Eye className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz Kontrol Eklenmedi</h3>
                  <p className="text-gray-500 mb-4">Denetim yapmak için kontrol maddeleri ekleyin.</p>
                  <button
                    onClick={addCheckItem}
                    className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors inline-flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Kontrol Ekle
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {checkItems.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="font-semibold text-gray-800">{item.area}</span>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                              {getStatusText(item.status)}
                            </span>
                          </div>
                          <p className="text-gray-600">{item.item}</p>
                          {item.notes && (
                            <p className="text-sm text-gray-500 mt-2">
                              <span className="font-medium">Not:</span> {item.notes}
                            </p>
                          )}
                          {item.correctiveAction && item.status === 'non-compliant' && (
                            <p className="text-sm text-amber-600 mt-2">
                              <span className="font-medium">Düzeltici Eylem:</span> {item.correctiveAction}
                            </p>
                          )}
                          {item.photo && (
                            <div className="mt-3">
                              <img src={item.photo} alt="Evidence" className="h-32 object-cover rounded" />
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => editCheckItem(item)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Düzenle"
                          >
                            <User className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => deleteCheckItem(item.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Sil"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Report Preview */}
      {activeTab === 'preview' && (
        <div>
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex justify-end space-x-4">
              <button
                onClick={generatePDF}
                disabled={loading}
                className="flex items-center bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'İşleniyor...' : (
                  <>
                    <Download className="mr-2" size={18} />
                    PDF İndir
                  </>
                )}
              </button>
              <button
                onClick={generateJPEG}
                disabled={loading}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'İşleniyor...' : (
                  <>
                    <ImageIcon className="mr-2" size={18} />
                    JPEG İndir
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Report Preview */}
          <div
            ref={reportRef}
            className="bg-white border border-gray-200 rounded-lg p-8 max-w-[210mm] mx-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">3. GÖZ DENETİM RAPORU</h1>
                <p className="text-gray-600">Operatör Sonrası Bağımsız Denetim</p>
              </div>
              {reportInfo.companyLogo && (
                <img src={reportInfo.companyLogo} alt="Company Logo" className="h-16 object-contain" />
              )}
            </div>

            {/* Report Information */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Müşteri Bilgileri</h2>
                <div className="space-y-2">
                  <div className="flex">
                    <span className="font-medium w-32">Şirket:</span>
                    <span>{reportInfo.companyName || 'Belirtilmemiş'}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-32">Adres:</span>
                    <span>{reportInfo.companyAddress || 'Belirtilmemiş'}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-32">Ziyaret Tarihi:</span>
                    <span>{new Date(reportInfo.visitDate).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Denetim Bilgileri</h2>
                <div className="space-y-2">
                  <div className="flex">
                    <span className="font-medium w-32">Operatör:</span>
                    <span>{reportInfo.operatorName || 'Belirtilmemiş'}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-32">Denetçi:</span>
                    <span>{reportInfo.inspectorName || 'Belirtilmemiş'}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-32">Ünvan:</span>
                    <span>{reportInfo.inspectorTitle || 'Belirtilmemiş'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Summary */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Denetim Özeti</h2>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">Toplam Kontrol</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">Uygun</p>
                  <p className="text-2xl font-bold text-green-600">{stats.compliant}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">Uygun Değil</p>
                  <p className="text-2xl font-bold text-red-600">{stats.nonCompliant}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">Uygunluk Oranı</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.complianceRate}%</p>
                </div>
              </div>
            </div>

            {/* Check Items */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Denetim Bulguları</h2>
              <div className="space-y-4">
                {checkItems.map((item, index) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center font-semibold">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-gray-800">{item.area}</p>
                          <p className="text-sm text-gray-600">{item.item}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {getStatusText(item.status)}
                      </span>
                    </div>
                    {item.notes && (
                      <p className="text-sm text-gray-600 mt-2 ml-11">
                        <span className="font-medium">Not:</span> {item.notes}
                      </p>
                    )}
                    {item.correctiveAction && item.status === 'non-compliant' && (
                      <p className="text-sm text-amber-600 mt-2 ml-11">
                        <span className="font-medium">Düzeltici Eylem:</span> {item.correctiveAction}
                      </p>
                    )}
                    {item.photo && (
                      <div className="mt-3 ml-11">
                        <img src={item.photo} alt="Evidence" className="max-w-xs rounded border" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* General Notes */}
            {reportInfo.generalNotes && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Genel Değerlendirme</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{reportInfo.generalNotes}</p>
              </div>
            )}

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="text-center">
                <div className="border-t-2 border-gray-400 pt-2 mt-16">
                  <p className="font-semibold text-gray-800">{reportInfo.operatorName}</p>
                  <p className="text-sm text-gray-600">Operatör</p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t-2 border-gray-400 pt-2 mt-16">
                  <p className="font-semibold text-gray-800">{reportInfo.inspectorName}</p>
                  <p className="text-sm text-gray-600">{reportInfo.inspectorTitle}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t pt-4 text-center text-sm text-gray-500">
              <p>{reportInfo.footerText}</p>
            </div>
          </div>
        </div>
      )}

      {/* Check Item Form Modal */}
      {showCheckItemForm && currentCheckItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Kontrol Maddesi
              </h2>
              <button
                onClick={() => {
                  setShowCheckItemForm(false);
                  setCurrentCheckItem(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alan *
                </label>
                <input
                  type="text"
                  name="area"
                  value={currentCheckItem.area}
                  onChange={handleCheckItemChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Ör: Depo, Üretim Alanı, Giriş"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kontrol Maddesi *
                </label>
                <textarea
                  name="item"
                  value={currentCheckItem.item}
                  onChange={handleCheckItemChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Kontrol edilecek maddeyi yazın"
                  rows={2}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durum *
                </label>
                <select
                  name="status"
                  value={currentCheckItem.status}
                  onChange={handleCheckItemChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                >
                  <option value="compliant">Uygun</option>
                  <option value="non-compliant">Uygun Değil</option>
                  <option value="not-applicable">Geçerli Değil</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notlar
                </label>
                <textarea
                  name="notes"
                  value={currentCheckItem.notes}
                  onChange={handleCheckItemChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Ek açıklamalar"
                  rows={2}
                />
              </div>

              {currentCheckItem.status === 'non-compliant' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Düzeltici Eylem
                  </label>
                  <textarea
                    name="correctiveAction"
                    value={currentCheckItem.correctiveAction}
                    onChange={handleCheckItemChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Alınması gereken düzeltici eylemleri yazın"
                    rows={2}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fotoğraf
                </label>
                <div className="flex items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200 transition-colors flex items-center"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Fotoğraf Yükle
                  </label>
                  {currentCheckItem.photo && (
                    <div className="ml-4 relative">
                      <img src={currentCheckItem.photo} alt="Preview" className="h-20 object-cover rounded" />
                      <button
                        onClick={() => setCurrentCheckItem({ ...currentCheckItem, photo: null })}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowCheckItemForm(false);
                  setCurrentCheckItem(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 mr-4"
              >
                İptal
              </button>
              <button
                onClick={saveCheckItem}
                className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      {activeTab === 'report' && (
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <Info className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">3. Göz Denetimi Hakkında</h3>
              <p className="text-blue-700 mb-4">
                3. Göz Denetimi, operatör ziyareti sonrası süpervizör veya yönetici tarafından yapılan bağımsız kalite kontrol denetimidir. Bu denetim, operatörün çalışmasının kalitesini değerlendirmek ve müşteri memnuniyetini artırmak için kullanılır.
              </p>
              <h4 className="font-semibold text-blue-800 mb-1">Nasıl Kullanılır?</h4>
              <ul className="space-y-1 text-blue-700">
                <li>1. Rapor bilgilerini doldurun (şirket, tarih, operatör, denetçi)</li>
                <li>2. "Yeni Kontrol Ekle" butonuna tıklayarak kontrol maddelerini ekleyin</li>
                <li>3. Her kontrol için alan, madde ve durum bilgilerini girin</li>
                <li>4. Gerekirse fotoğraf ve düzeltici eylem ekleyin</li>
                <li>5. Genel değerlendirme notlarınızı yazın</li>
                <li>6. "Önizleme" sekmesine geçerek raporu kontrol edin</li>
                <li>7. "PDF İndir" veya "JPEG İndir" butonlarıyla raporu dışa aktarın</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThirdEyeReportPage;
