import React, { useState, useRef } from 'react';
import {
  Bug,
  CheckCircle,
  X,
  Download,
  Building,
  Calendar,
  Plus,
  Trash2,
  AlertTriangle,
  Info,
  Image as ImageIcon,
  Upload,
  Edit
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface PestRiskItem {
  id: string;
  pestType: string;
  environmentalConditions: number;
  buildingControls: number;
  growthRate: number;
  totalRisk: number;
  riskLevel: string;
  visitFrequency: string;
}

interface ReportInfo {
  companyName: string;
  companyAddress: string;
  assessmentDate: string;
  assessor: string;
  companyLogo: string | null;
  footerText: string;
}

const PestRiskAnalysisPage = () => {
  const [pestRisks, setPestRisks] = useState<PestRiskItem[]>([
    {
      id: '1',
      pestType: 'Kemirgenler',
      environmentalConditions: 2,
      buildingControls: 2,
      growthRate: 1,
      totalRisk: 4,
      riskLevel: 'DÜŞÜK SEVİYEDE RİSK',
      visitFrequency: 'AYDA 1 SERVİS'
    },
    {
      id: '2',
      pestType: 'Hamamböcekleri',
      environmentalConditions: 1,
      buildingControls: 2,
      growthRate: 2,
      totalRisk: 4,
      riskLevel: 'DÜŞÜK SEVİYEDE RİSK',
      visitFrequency: 'AYDA 1 SERVİS'
    },
    {
      id: '3',
      pestType: 'Uçan Zararlılar',
      environmentalConditions: 2,
      buildingControls: 2,
      growthRate: 2,
      totalRisk: 8,
      riskLevel: 'ORTA SEVİYEDE RİSK',
      visitFrequency: 'AYDA 2 SERVİS'
    },
    {
      id: '4',
      pestType: 'Depo Zararlıları',
      environmentalConditions: 3,
      buildingControls: 1,
      growthRate: 2,
      totalRisk: 6,
      riskLevel: 'DÜŞÜK SEVİYEDE RİSK',
      visitFrequency: 'AYDA 1 SERVİS'
    },
    {
      id: '5',
      pestType: 'Kuşlar',
      environmentalConditions: 3,
      buildingControls: 2,
      growthRate: 1,
      totalRisk: 6,
      riskLevel: 'DÜŞÜK SEVİYEDE RİSK',
      visitFrequency: 'AYDA 1 SERVİS'
    }
  ]);

  const [reportInfo, setReportInfo] = useState<ReportInfo>({
    companyName: '',
    companyAddress: '',
    assessmentDate: new Date().toISOString().split('T')[0],
    assessor: '',
    companyLogo: null,
    footerText: 'PestMentor © 2025 | Sistem İlaçlama San. ve Tic. Ltd. Şti. | www.pestmentor.com.tr'
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPestForm, setShowPestForm] = useState(false);
  const [currentPest, setCurrentPest] = useState<PestRiskItem | null>(null);
  const [activeTab, setActiveTab] = useState<'report' | 'preview'>('report');

  const reportRef = useRef<HTMLDivElement>(null);

  // Calculate risk based on scores
  const calculateRisk = (environmentalConditions: number, buildingControls: number, growthRate: number) => {
    const totalRisk = (environmentalConditions * buildingControls * growthRate);

    let riskLevel = '';
    let visitFrequency = '';

    if (totalRisk === 1) {
      riskLevel = 'RİSK YOK';
      visitFrequency = 'SERVİSE GEREK YOK';
    } else if (totalRisk >= 2 && totalRisk <= 6) {
      riskLevel = 'DÜŞÜK SEVİYEDE RİSK';
      visitFrequency = 'AYDA 1 SERVİS';
    } else if (totalRisk >= 8 && totalRisk <= 12) {
      riskLevel = 'ORTA SEVİYEDE RİSK';
      visitFrequency = 'AYDA 2 SERVİS';
    } else if (totalRisk >= 18 && totalRisk <= 27) {
      riskLevel = 'YÜKSEK SEVİYEDE RİSK';
      visitFrequency = 'HAFTADA 1 SERVİS';
    }

    return { totalRisk, riskLevel, visitFrequency };
  };

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

  // Add a new pest risk
  const addPestRisk = () => {
    const newPest: PestRiskItem = {
      id: Date.now().toString(),
      pestType: '',
      environmentalConditions: 1,
      buildingControls: 1,
      growthRate: 1,
      totalRisk: 1,
      riskLevel: 'RİSK YOK',
      visitFrequency: 'SERVİSE GEREK YOK'
    };

    setCurrentPest(newPest);
    setShowPestForm(true);
  };

  // Edit an existing pest risk
  const editPestRisk = (pest: PestRiskItem) => {
    setCurrentPest(pest);
    setShowPestForm(true);
  };

  // Delete a pest risk
  const deletePestRisk = (id: string) => {
    setPestRisks(pestRisks.filter(p => p.id !== id));
  };

  // Save pest risk changes
  const savePestRisk = () => {
    if (!currentPest) return;

    const { totalRisk, riskLevel, visitFrequency } = calculateRisk(
      currentPest.environmentalConditions,
      currentPest.buildingControls,
      currentPest.growthRate
    );

    const updatedPest = {
      ...currentPest,
      totalRisk,
      riskLevel,
      visitFrequency
    };

    if (pestRisks.some(p => p.id === updatedPest.id)) {
      setPestRisks(pestRisks.map(p => p.id === updatedPest.id ? updatedPest : p));
    } else {
      setPestRisks([...pestRisks, updatedPest]);
    }

    setShowPestForm(false);
    setCurrentPest(null);
  };

  // Handle pest form input changes
  const handlePestChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!currentPest) return;

    const { name, value } = e.target;
    const updatedPest = { ...currentPest, [name]: name === 'pestType' ? value : parseInt(value) };

    setCurrentPest(updatedPest);
  };

  // Get risk level color
  const getRiskLevelColor = (riskLevel: string): string => {
    if (riskLevel.includes('YOK')) return 'bg-white text-gray-800 border-2 border-gray-300';
    if (riskLevel.includes('DÜŞÜK')) return 'bg-green-400 text-gray-800';
    if (riskLevel.includes('ORTA')) return 'bg-yellow-400 text-gray-800';
    if (riskLevel.includes('YÜKSEK')) return 'bg-red-500 text-white';
    return 'bg-gray-200 text-gray-800';
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

      pdf.save(`Zararlı_Risk_Analizi_${reportInfo.companyName || 'Rapor'}.pdf`);

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
      link.download = `Zararlı_Risk_Analizi_${reportInfo.companyName || 'Rapor'}.jpg`;
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tabs */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Zararlı Risk Analizi ve Ziyaret Planı</h1>
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
                    Değerlendirme Tarihi
                  </label>
                  <input
                    type="date"
                    name="assessmentDate"
                    value={reportInfo.assessmentDate}
                    onChange={handleReportInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Değerlendiren Kişi
                  </label>
                  <input
                    type="text"
                    name="assessor"
                    value={reportInfo.assessor}
                    onChange={handleReportInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Değerlendiren kişinin adı"
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
                  {loading ? 'PDF Oluşturuluyor...' : (
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
                  {loading ? 'JPEG Oluşturuluyor...' : (
                    <>
                      <ImageIcon className="mr-2" size={18} />
                      JPEG İndir
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Pest Risk List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Zararlı Risk Analizi</h2>
                <button
                  onClick={addPestRisk}
                  className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors flex items-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Yeni Zararlı Ekle
                </button>
              </div>

              {pestRisks.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Bug className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz Zararlı Eklenmedi</h3>
                  <p className="text-gray-500 mb-4">Risk analizi yapmak için zararlı türlerini ekleyin.</p>
                  <button
                    onClick={addPestRisk}
                    className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors inline-flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Zararlı Ekle
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase border">Zararlı Tipi</th>
                        <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase border">Çevresel Şartlar</th>
                        <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase border">Bina Şartları ve Kontrol</th>
                        <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase border">Zararlı Büyüme ve Yayılma</th>
                        <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase border">Toplam Risk</th>
                        <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase border">Risk Değerlendirme</th>
                        <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase border">Uygulama Sıklığı</th>
                        <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase border">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pestRisks.map((pest) => (
                        <tr key={pest.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 border font-medium">{pest.pestType}</td>
                          <td className="py-3 px-4 border text-center">{pest.environmentalConditions}</td>
                          <td className="py-3 px-4 border text-center">{pest.buildingControls}</td>
                          <td className="py-3 px-4 border text-center">{pest.growthRate}</td>
                          <td className="py-3 px-4 border text-center font-bold">{pest.totalRisk}</td>
                          <td className={`py-3 px-4 border text-center font-semibold ${getRiskLevelColor(pest.riskLevel)}`}>
                            {pest.riskLevel}
                          </td>
                          <td className={`py-3 px-4 border text-center font-semibold ${getRiskLevelColor(pest.riskLevel)}`}>
                            {pest.visitFrequency}
                          </td>
                          <td className="py-3 px-4 border text-center">
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() => editPestRisk(pest)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Düzenle"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => deletePestRisk(pest.id)}
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
              )}
            </div>

            {/* Risk Matrix Reference */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Risk Skor Matrisi</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-3 border text-center">Çevresel Şartlar</th>
                      <th className="py-2 px-3 border text-center">Bina Şartları ve Kontrol</th>
                      <th className="py-2 px-3 border text-center">Zararlı Büyüme ve Yayılma</th>
                      <th className="py-2 px-3 border text-center">Toplam Risk</th>
                      <th className="py-2 px-3 border text-center">Risk Değerlendirme</th>
                      <th className="py-2 px-3 border text-center">Uygulama Sıklığı</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 px-3 border text-center">1</td>
                      <td className="py-2 px-3 border text-center">1</td>
                      <td className="py-2 px-3 border text-center">1</td>
                      <td className="py-2 px-3 border text-center font-bold">1</td>
                      <td className="py-2 px-3 border text-center bg-white">RİSK YOK</td>
                      <td className="py-2 px-3 border text-center bg-white">SERVİSE GEREK YOK</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border text-center">1-2</td>
                      <td className="py-2 px-3 border text-center">1-3</td>
                      <td className="py-2 px-3 border text-center">1-3</td>
                      <td className="py-2 px-3 border text-center font-bold">2-6</td>
                      <td className="py-2 px-3 border text-center bg-green-400">DÜŞÜK SEVİYEDE RİSK</td>
                      <td className="py-2 px-3 border text-center bg-green-400">AYDA 1 SERVİS</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border text-center">2-3</td>
                      <td className="py-2 px-3 border text-center">2-3</td>
                      <td className="py-2 px-3 border text-center">2-3</td>
                      <td className="py-2 px-3 border text-center font-bold">8-12</td>
                      <td className="py-2 px-3 border text-center bg-yellow-400">ORTA SEVİYEDE RİSK</td>
                      <td className="py-2 px-3 border text-center bg-yellow-400">AYDA 2 SERVİS</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border text-center">3</td>
                      <td className="py-2 px-3 border text-center">3</td>
                      <td className="py-2 px-3 border text-center">2-3</td>
                      <td className="py-2 px-3 border text-center font-bold">18-27</td>
                      <td className="py-2 px-3 border text-center bg-red-500 text-white">YÜKSEK SEVİYEDE RİSK</td>
                      <td className="py-2 px-3 border text-center bg-red-500 text-white">HAFTADA 1 SERVİS</td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{reportInfo.companyName || 'Şirket Adı'}</h1>
                <h2 className="text-xl font-semibold text-gray-700">ZARARLI MÜCADELE RİSK ANALİZ DEĞERLENDİRMESİ</h2>
              </div>
              {reportInfo.companyLogo && (
                <img src={reportInfo.companyLogo} alt="Company Logo" className="h-16 object-contain" />
              )}
            </div>

            {/* Info Section */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <span className="font-medium">Adres:</span> {reportInfo.companyAddress || 'Belirtilmemiş'}
              </div>
              <div>
                <span className="font-medium">Tarih:</span> {new Date(reportInfo.assessmentDate).toLocaleDateString('tr-TR')}
              </div>
              <div>
                <span className="font-medium">Değerlendiren:</span> {reportInfo.assessor || 'Belirtilmemiş'}
              </div>
            </div>

            {/* Evaluation Criteria */}
            <div className="mb-6 text-sm">
              <h3 className="font-bold mb-2">1. Ortaya çıkma olasılığı için derecelendirme başlıkları:</h3>

              <div className="ml-4">
                <p className="font-semibold">1.1. Çevresel şartların değerlendirilmesi:</p>
                <ul className="ml-6 space-y-1">
                  <li>1- Bulaşma kaynağı hiç yok (çevre temiz ve riskli alan mevcut değil)</li>
                  <li>2- Orta ölçüde bulaşma kaynakları var (çevrede kısmen kirlilik var ve riskli alan bulunuyor)</li>
                  <li>3- Yüksek ölçüde bulaşma kaynağı var (çevrede kirlilik, orman alanı, hayvan barınağı vb alanlar mevcut)</li>
                </ul>

                <p className="font-semibold mt-3">1.2. Bina şartları ve kontrol önlemleri:</p>
                <ul className="ml-6 space-y-1">
                  <li>1- Bütün önlemler alınmış, izolasyon çok iyi (zararlı girişi için uygun yer yok)</li>
                  <li>2- Orta ölçüde önlemler alınmış, izolasyon orta (zararlı girişi için kısmen ve küçük ölçekte açıklıklar var)</li>
                  <li>3- Hiçbir önlem alınmamış, izolasyon çok yetersiz (zararlı girişi bir çok yerden mümkün)</li>
                </ul>

                <p className="font-semibold mt-3">1.3. Zararlının büyüme ve yayılma hızı:</p>
                <ul className="ml-6 space-y-1">
                  <li>1- Az üreme potansiyeline sahiptir (1 aydan fazla çoğalma süresi)</li>
                  <li>2- Orta üreme potansiyeline sahiptir (2-29 günlük çoğalma süresi)</li>
                  <li>3- Yüksek üreme potansiyeline sahiptir (1 günden hızlı çoğalma süresi)</li>
                </ul>
              </div>
            </div>

            {/* Risk Matrix */}
            <div className="mb-6">
              <h3 className="font-bold mb-2 text-sm">2. Risk skor (derecelendirme) matrisi:</h3>
              <div className="overflow-x-auto">
                <table className="w-full border text-xs">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-2 border text-center">ÇEVRESEL ŞARTLAR DEĞERLENDİRMESİ</th>
                      <th className="py-2 px-2 border text-center">BİNA ŞARTLARI VE KONTROL ÖNLEMLERİ</th>
                      <th className="py-2 px-2 border text-center">ZARARLI BÜYÜME VE YAYILMA HIZI</th>
                      <th className="py-2 px-2 border text-center">TOPLAM RİSK</th>
                      <th className="py-2 px-2 border text-center">RİSK DEĞERLENDİRME</th>
                      <th className="py-2 px-2 border text-center">UYGULAMA SIKLIĞI</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 px-2 border text-center">1</td>
                      <td className="py-2 px-2 border text-center">1</td>
                      <td className="py-2 px-2 border text-center">1</td>
                      <td className="py-2 px-2 border text-center font-bold">1</td>
                      <td className="py-2 px-2 border text-center bg-white">RİSK YOK</td>
                      <td className="py-2 px-2 border text-center bg-white">SERVİSE GEREK YOK</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 border text-center">1-2</td>
                      <td className="py-2 px-2 border text-center">1-3</td>
                      <td className="py-2 px-2 border text-center">1-3</td>
                      <td className="py-2 px-2 border text-center font-bold">2-6</td>
                      <td className="py-2 px-2 border text-center bg-green-400">DÜŞÜK SEVİYEDE RİSK</td>
                      <td className="py-2 px-2 border text-center bg-green-400">AYDA 1 SERVİS</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 border text-center">2-3</td>
                      <td className="py-2 px-2 border text-center">2-3</td>
                      <td className="py-2 px-2 border text-center">2-3</td>
                      <td className="py-2 px-2 border text-center font-bold">8-12</td>
                      <td className="py-2 px-2 border text-center bg-yellow-400">ORTA SEVİYEDE RİSK</td>
                      <td className="py-2 px-2 border text-center bg-yellow-400">AYDA 2 SERVİS</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 border text-center">3</td>
                      <td className="py-2 px-2 border text-center">3</td>
                      <td className="py-2 px-2 border text-center">2-3</td>
                      <td className="py-2 px-2 border text-center font-bold">18-27</td>
                      <td className="py-2 px-2 border text-center bg-red-500 text-white">YÜKSEK SEVİYEDE RİSK</td>
                      <td className="py-2 px-2 border text-center bg-red-500 text-white">HAFTADA 1 SERVİS</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pest Risk Analysis Table */}
            <div className="mb-6">
              <h3 className="font-bold mb-2 text-sm">
                KISMET TATLI RİSK SKOR MATRİSİ: {new Date(reportInfo.assessmentDate).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border text-xs">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-2 border text-center">ZARARLI TİPİ</th>
                      <th className="py-2 px-2 border text-center">ÇEVRESEL ŞARTLAR DEĞERLENDİRMESİ</th>
                      <th className="py-2 px-2 border text-center">BİNA ŞARTLARI VE KONTROL ÖNLEMLERİ</th>
                      <th className="py-2 px-2 border text-center">ZARARLI BÜYÜME VE YAYILMA HIZI</th>
                      <th className="py-2 px-2 border text-center">TOPLAM RİSK</th>
                      <th className="py-2 px-2 border text-center">RİSK DEĞERLENDİRME</th>
                      <th className="py-2 px-2 border text-center">UYGULAMA SIKLIĞI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pestRisks.map((pest) => (
                      <tr key={pest.id}>
                        <td className="py-2 px-2 border">{pest.pestType}</td>
                        <td className="py-2 px-2 border text-center">{pest.environmentalConditions}</td>
                        <td className="py-2 px-2 border text-center">{pest.buildingControls}</td>
                        <td className="py-2 px-2 border text-center">{pest.growthRate}</td>
                        <td className="py-2 px-2 border text-center font-bold">{pest.totalRisk}</td>
                        <td className={`py-2 px-2 border text-center font-semibold ${getRiskLevelColor(pest.riskLevel)}`}>
                          {pest.riskLevel}
                        </td>
                        <td className={`py-2 px-2 border text-center font-semibold ${getRiskLevelColor(pest.riskLevel)}`}>
                          {pest.visitFrequency}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t pt-4 text-center text-xs text-gray-500">
              <p>{reportInfo.footerText}</p>
            </div>
          </div>
        </div>
      )}

      {/* Pest Form Modal */}
      {showPestForm && currentPest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Zararlı Risk Analizi
              </h2>
              <button
                onClick={() => {
                  setShowPestForm(false);
                  setCurrentPest(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zararlı Tipi *
                </label>
                <input
                  type="text"
                  name="pestType"
                  value={currentPest.pestType}
                  onChange={handlePestChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Ör: Kemirgenler, Hamamböcekleri, Uçan Zararlılar"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Çevresel Şartlar Değerlendirmesi (1-3) *
                </label>
                <select
                  name="environmentalConditions"
                  value={currentPest.environmentalConditions}
                  onChange={handlePestChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                >
                  <option value={1}>1 - Bulaşma kaynağı hiç yok</option>
                  <option value={2}>2 - Orta ölçüde bulaşma kaynakları var</option>
                  <option value={3}>3 - Yüksek ölçüde bulaşma kaynağı var</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bina Şartları ve Kontrol Önlemleri (1-3) *
                </label>
                <select
                  name="buildingControls"
                  value={currentPest.buildingControls}
                  onChange={handlePestChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                >
                  <option value={1}>1 - Bütün önlemler alınmış, izolasyon çok iyi</option>
                  <option value={2}>2 - Orta ölçüde önlemler alınmış, izolasyon orta</option>
                  <option value={3}>3 - Hiçbir önlem alınmamış, izolasyon çok yetersiz</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zararlının Büyüme ve Yayılma Hızı (1-3) *
                </label>
                <select
                  name="growthRate"
                  value={currentPest.growthRate}
                  onChange={handlePestChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                >
                  <option value={1}>1 - Az üreme potansiyeline sahiptir</option>
                  <option value={2}>2 - Orta üreme potansiyeline sahiptir</option>
                  <option value={3}>3 - Yüksek üreme potansiyeline sahiptir</option>
                </select>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Hesaplanan Risk:</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Toplam Risk</p>
                    <p className="text-xl font-bold text-gray-800">
                      {currentPest.environmentalConditions * currentPest.buildingControls * currentPest.growthRate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Risk Seviyesi</p>
                    <p className={`text-sm font-semibold px-2 py-1 rounded ${getRiskLevelColor(
                      calculateRisk(currentPest.environmentalConditions, currentPest.buildingControls, currentPest.growthRate).riskLevel
                    )}`}>
                      {calculateRisk(currentPest.environmentalConditions, currentPest.buildingControls, currentPest.growthRate).riskLevel}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Uygulama Sıklığı</p>
                    <p className={`text-sm font-semibold px-2 py-1 rounded ${getRiskLevelColor(
                      calculateRisk(currentPest.environmentalConditions, currentPest.buildingControls, currentPest.growthRate).riskLevel
                    )}`}>
                      {calculateRisk(currentPest.environmentalConditions, currentPest.buildingControls, currentPest.growthRate).visitFrequency}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowPestForm(false);
                  setCurrentPest(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 mr-4"
              >
                İptal
              </button>
              <button
                onClick={savePestRisk}
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
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Zararlı Risk Analizi Hakkında</h3>
              <p className="text-blue-700 mb-4">
                Bu modül, müşteri tesislerinde zararlı mücadelesi için risk analizi yapar ve otomatik olarak ziyaret sıklığı önerir.
                Çevresel şartlar, bina kontrolleri ve zararlının yayılma hızına göre risk seviyesi belirlenir.
              </p>
              <h4 className="font-semibold text-blue-800 mb-1">Nasıl Kullanılır?</h4>
              <ul className="space-y-1 text-blue-700">
                <li>1. Rapor bilgilerini doldurun (şirket, tarih, değerlendiren)</li>
                <li>2. "Yeni Zararlı Ekle" butonuna tıklayın</li>
                <li>3. Zararlı tipini girin (Kemirgen, Hamamböceği, vb.)</li>
                <li>4. Her kriter için 1-3 arası puan verin</li>
                <li>5. Sistem otomatik olarak risk seviyesi ve ziyaret sıklığını hesaplar</li>
                <li>6. "Önizleme" sekmesinden raporu görüntüleyin</li>
                <li>7. PDF veya JPEG olarak indirin</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PestRiskAnalysisPage;
