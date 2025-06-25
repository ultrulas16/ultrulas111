import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ClipboardList, 
  CheckCircle, 
  X, 
  AlertTriangle, 
  Download, 
  Save, 
  Clipboard, 
  Building, 
  Calendar, 
  User, 
  FileText,
  Camera,
  Plus,
  Trash2,
  Mail,
  Phone,
  Image
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const InspectionReportPage = () => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    inspectorCompany: 'PestMentor',
    inspectorName: '',
    clientCompany: '',
    clientName: '',
    inspectionDate: new Date().toISOString().split('T')[0],
    propertyType: '',
    nextInspectionDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    overallStatus: 'satisfactory',
    logoUrl: ''
  });

  // Findings state
  const [findings, setFindings] = useState<{
    id: string;
    area: string;
    issue: string;
    severity: 'critical' | 'major' | 'minor' | 'observation';
    photo: string | null;
  }[]>([
    {
      id: 'finding1',
      area: 'Depo Girişi',
      issue: 'Kapı altında 1.5 cm boşluk tespit edildi. Kemirgen girişi riski mevcut.',
      severity: 'major',
      photo: null
    },
    {
      id: 'finding2',
      area: 'Üretim Alanı',
      issue: 'EFK cihazı arızalı durumda, UV lambası çalışmıyor.',
      severity: 'major',
      photo: null
    },
    {
      id: 'finding3',
      area: 'Dış Alan',
      issue: 'Atık konteyneri kapağı açık bırakılmış, sinek aktivitesi gözlemlendi.',
      severity: 'minor',
      photo: null
    }
  ]);

  // Recommendations state
  const [recommendations, setRecommendations] = useState<string[]>([
    'Depo girişindeki kapı altı boşluğu fırça fitil ile kapatılmalıdır.',
    'Arızalı EFK cihazının UV lambası yenilenmelidir.',
    'Atık konteynerleri her zaman kapalı tutulmalı ve düzenli olarak temizlenmelidir.',
    'Dış alanda bulunan su birikintileri drene edilmelidir.',
    'Depo içi istif düzeni duvardan en az 50 cm uzakta olacak şekilde düzenlenmelidir.'
  ]);

  // Predefined findings for quick add
  const predefinedFindings = [
    {
      area: 'Depo Girişi',
      issue: 'Kapı altında boşluk tespit edildi. Kemirgen girişi riski mevcut.',
      severity: 'major'
    },
    {
      area: 'Üretim Alanı',
      issue: 'EFK cihazı arızalı durumda, UV lambası çalışmıyor.',
      severity: 'major'
    },
    {
      area: 'Dış Alan',
      issue: 'Atık konteyneri kapağı açık bırakılmış, sinek aktivitesi gözlemlendi.',
      severity: 'minor'
    },
    {
      area: 'Depo İçi',
      issue: 'Duvar-zemin birleşiminde çatlaklar mevcut, hamam böceği aktivitesi gözlemlendi.',
      severity: 'major'
    },
    {
      area: 'Personel Girişi',
      issue: 'Hava perdesi çalışmıyor, uçan böcek girişi riski mevcut.',
      severity: 'minor'
    },
    {
      area: 'Hammadde Deposu',
      issue: 'Kemirgen dışkısı tespit edildi, aktif istila mevcut.',
      severity: 'critical'
    },
    {
      area: 'Paketleme Alanı',
      issue: 'Yapışkan tuzaklarda yüksek sayıda hamam böceği yakalanmış.',
      severity: 'major'
    },
    {
      area: 'Çatı Katı',
      issue: 'Güvercin yuvaları ve dışkıları tespit edildi.',
      severity: 'major'
    },
    {
      area: 'Kantin',
      issue: 'Gider borusu çevresinde sızdırmazlık eksikliği, kemirgen girişi riski.',
      severity: 'minor'
    },
    {
      area: 'Bahçe Alanı',
      issue: 'Yüksek çim ve bakımsız bitki örtüsü, kemirgen barınma riski.',
      severity: 'observation'
    },
    {
      area: 'Mal Kabul',
      issue: 'Kapı uzun süre açık kalıyor, böcek girişi gözlemlendi.',
      severity: 'minor'
    },
    {
      area: 'Ofis Alanı',
      issue: 'Mutfak dolabında gıda artıkları, karınca aktivitesi mevcut.',
      severity: 'minor'
    }
  ];

  // Predefined recommendations for quick add
  const predefinedRecommendations = [
    'Depo girişindeki kapı altı boşluğu fırça fitil ile kapatılmalıdır.',
    'Arızalı EFK cihazının UV lambası yenilenmelidir.',
    'Atık konteynerleri her zaman kapalı tutulmalı ve düzenli olarak temizlenmelidir.',
    'Dış alanda bulunan su birikintileri drene edilmelidir.',
    'Depo içi istif düzeni duvardan en az 50 cm uzakta olacak şekilde düzenlenmelidir.',
    'Duvar-zemin birleşimindeki çatlaklar sızdırmaz malzeme ile kapatılmalıdır.',
    'Hava perdesi tamir edilmeli veya yenisiyle değiştirilmelidir.',
    'Kemirgen istilası için acil müdahale programı uygulanmalıdır.',
    'Hamam böceği aktivitesi için jel yem uygulaması yapılmalıdır.',
    'Güvercin yuvaları temizlenmeli ve fiziksel engelleme sistemleri kurulmalıdır.',
    'Gider borusu çevresi sızdırmaz malzeme ile kapatılmalıdır.',
    'Bahçe alanı düzenli olarak bakıma alınmalı, çimler kısa tutulmalıdır.',
    'Mal kabul kapılarına hava perdesi veya plastik şerit perde takılmalıdır.',
    'Ofis mutfağında gıda saklama koşulları iyileştirilmelidir.',
    'Tüm personele zararlı farkındalık eğitimi verilmelidir.',
    'Monitoring istasyonları sayısı artırılmalıdır.',
    'Dış cephe aydınlatmaları böcek çekmeyen tipte lambalarla değiştirilmelidir.',
    'Atık yönetimi prosedürü oluşturulmalı ve uygulanmalıdır.',
    'Depo kapılarına kendiliğinden kapanma mekanizması eklenmelidir.',
    'Pencere sineklikleri kontrol edilmeli ve hasarlı olanlar değiştirilmelidir.'
  ];

  // General recommendations that will always be included
  const generalRecommendations = [
    'Tüm personele düzenli olarak zararlı farkındalık eğitimi verilmelidir.',
    'Zararlı aktivitesi gözlemlendiğinde hemen bildirim yapılmalıdır.',
    'Gıda depolama alanlarında açık gıda bulundurulmamalıdır.',
    'Kapı ve pencereler mümkün olduğunca kapalı tutulmalıdır.',
    'Dış alan temizliği ve düzeni düzenli olarak kontrol edilmelidir.'
  ];

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Add a new finding
  const addFinding = (predefinedFinding?: typeof predefinedFindings[0]) => {
    const newFinding = {
      id: `finding${findings.length + 1}`,
      area: predefinedFinding?.area || '',
      issue: predefinedFinding?.issue || '',
      severity: predefinedFinding?.severity || 'minor' as 'critical' | 'major' | 'minor' | 'observation',
      photo: null
    };
    
    setFindings(prev => [...prev, newFinding]);
  };

  // Update a finding
  const updateFinding = (id: string, field: keyof typeof findings[0], value: any) => {
    setFindings(prev => 
      prev.map(finding => finding.id === id ? { ...finding, [field]: value } : finding)
    );
  };

  // Remove a finding
  const removeFinding = (id: string) => {
    setFindings(prev => prev.filter(finding => finding.id !== id));
  };

  // Add a recommendation
  const addRecommendation = (text: string = '') => {
    setRecommendations(prev => [...prev, text || `Yeni öneri ${prev.length + 1}`]);
  };

  // Update a recommendation
  const updateRecommendation = (index: number, text: string) => {
    setRecommendations(prev => {
      const newRecs = [...prev];
      newRecs[index] = text;
      return newRecs;
    });
  };

  // Remove a recommendation
  const removeRecommendation = (index: number) => {
    setRecommendations(prev => prev.filter((_, i) => i !== index));
  };

  // Handle photo upload for a finding
  const handlePhotoUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateFinding(id, 'photo', event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData(prev => ({ ...prev, logoUrl: event.target?.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate PDF report
  const generatePDF = async () => {
    if (!reportRef.current) return;
    
    setLoading(true);
    
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Denetim_Raporu_${formData.clientCompany}_${formData.inspectionDate}.pdf`);
      
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('PDF oluşturulurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Generate JPEG image
  const generateJPEG = async () => {
    if (!reportRef.current) return;
    
    setLoading(true);
    
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // Create a download link
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `Denetim_Raporu_${formData.clientCompany}_${formData.inspectionDate}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('JPEG generation error:', error);
      alert('JPEG oluşturulurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'major': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'minor': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'observation': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get severity label
  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'critical': return 'Kritik';
      case 'major': return 'Majör';
      case 'minor': return 'Minör';
      case 'observation': return 'Gözlem';
      default: return severity;
    }
  };

  // Get overall status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'satisfactory': return 'text-blue-600';
      case 'needs_improvement': return 'text-orange-600';
      case 'unsatisfactory': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Get overall status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'excellent': return 'Mükemmel';
      case 'satisfactory': return 'Yeterli';
      case 'needs_improvement': return 'İyileştirilmeli';
      case 'unsatisfactory': return 'Yetersiz';
      default: return status;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form Section */}
        <div className="lg:w-1/3 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Denetim Raporu Formu</h2>
            
            {/* Company Information */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Denetleyen Firma
                </label>
                <input
                  type="text"
                  name="inspectorCompany"
                  value={formData.inspectorCompany}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Denetleyen Kişi
                </label>
                <input
                  type="text"
                  name="inspectorName"
                  value={formData.inspectorName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Adınız ve soyadınız"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Müşteri Firma
                </label>
                <input
                  type="text"
                  name="clientCompany"
                  value={formData.clientCompany}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Müşteri firma adı"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Müşteri Yetkilisi
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Müşteri yetkilisinin adı"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Denetim Tarihi
                </label>
                <input
                  type="date"
                  name="inspectionDate"
                  value={formData.inspectionDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tesis Türü
                </label>
                <input
                  type="text"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Örn: Gıda Üretim Tesisi"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sonraki Denetim Tarihi
                </label>
                <input
                  type="date"
                  name="nextInspectionDate"
                  value={formData.nextInspectionDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Genel Durum
                </label>
                <select
                  name="overallStatus"
                  value={formData.overallStatus}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="excellent">Mükemmel</option>
                  <option value="satisfactory">Yeterli</option>
                  <option value="needs_improvement">İyileştirilmeli</option>
                  <option value="unsatisfactory">Yetersiz</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo Yükle
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Findings Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Bulgular</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => addFinding()}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors text-sm"
                >
                  + Bulgu Ekle
                </button>
                <div className="relative group">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors text-sm"
                  >
                    + Hazır Bulgular
                  </button>
                  <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-md p-2 hidden group-hover:block z-10 max-h-60 overflow-y-auto">
                    {predefinedFindings.map((finding, index) => (
                      <button
                        key={index}
                        onClick={() => addFinding(finding)}
                        className="block w-full text-left text-xs py-2 px-2 hover:bg-gray-100 rounded border-b border-gray-100"
                      >
                        <div className="font-medium">{finding.area}</div>
                        <div className="text-gray-600">{finding.issue}</div>
                        <div className={`text-xs mt-1 inline-block px-2 py-0.5 rounded-full ${getSeverityColor(finding.severity)}`}>
                          {getSeverityLabel(finding.severity)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {findings.map((finding) => (
                <div key={finding.id} className="border border-gray-200 rounded-md p-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Alan
                      </label>
                      <input
                        type="text"
                        value={finding.area}
                        onChange={(e) => updateFinding(finding.id, 'area', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Örn: Depo Girişi"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Bulgu
                      </label>
                      <textarea
                        value={finding.issue}
                        onChange={(e) => updateFinding(finding.id, 'issue', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Bulgu açıklaması"
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Önem Derecesi
                      </label>
                      <select
                        value={finding.severity}
                        onChange={(e) => updateFinding(finding.id, 'severity', e.target.value as any)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="critical">Kritik</option>
                        <option value="major">Majör</option>
                        <option value="minor">Minör</option>
                        <option value="observation">Gözlem</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Fotoğraf
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(finding.id, e)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      {finding.photo && (
                        <div className="mt-2 relative">
                          <img 
                            src={finding.photo} 
                            alt="Finding" 
                            className="h-20 object-cover rounded-md"
                          />
                          <button
                            onClick={() => updateFinding(finding.id, 'photo', null)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => removeFinding(finding.id)}
                      className="text-red-500 hover:text-red-700 text-sm flex items-center"
                    >
                      <Trash2 size={14} className="mr-1" />
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Öneriler</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => addRecommendation()}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors text-sm"
                >
                  + Öneri Ekle
                </button>
                <div className="relative group">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors text-sm"
                  >
                    + Hazır Öneriler
                  </button>
                  <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-md p-2 hidden group-hover:block z-10 max-h-60 overflow-y-auto">
                    {predefinedRecommendations.map((rec, index) => (
                      <button
                        key={index}
                        onClick={() => addRecommendation(rec)}
                        className="block w-full text-left text-xs py-2 px-2 hover:bg-gray-100 rounded border-b border-gray-100"
                      >
                        {rec}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="flex-1">
                    <textarea
                      value={rec}
                      onChange={(e) => updateRecommendation(index, e.target.value)}
                      className="w-full text-sm text-gray-700 border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      rows={2}
                    />
                  </div>
                  <button
                    onClick={() => removeRecommendation(index)}
                    className="text-red-500 hover:text-red-700 mt-2"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Export Buttons */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Rapor Oluştur</h2>
            
            <div className="flex flex-col space-y-3">
              <button
                onClick={generatePDF}
                disabled={loading}
                className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    İşleniyor...
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
                className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    İşleniyor...
                  </span>
                ) : (
                  <>
                    <Image className="mr-2" size={18} />
                    JPEG İndir
                  </>
                )}
              </button>
            </div>
            
            {showSuccessMessage && (
              <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                <span className="block sm:inline">Rapor başarıyla oluşturuldu!</span>
              </div>
            )}
          </div>
        </div>

        {/* Report Preview */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Rapor Önizleme</h2>
            
            <div 
              ref={reportRef} 
              className="bg-white border border-gray-200 rounded-lg p-8 max-w-4xl mx-auto"
              style={{ minHeight: '297mm', width: '210mm' }}
            >
              {/* Report Header */}
              <div className="flex justify-between items-center mb-8 border-b pb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Zararlı Mücadelesi Denetim Raporu</h1>
                  <p className="text-gray-600 mt-1">Denetim Tarihi: {new Date(formData.inspectionDate).toLocaleDateString('tr-TR')}</p>
                </div>
                {formData.logoUrl && (
                  <img 
                    src={formData.logoUrl} 
                    alt="Company Logo" 
                    className="h-16 object-contain"
                  />
                )}
              </div>

              {/* Company Information */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">Denetleyen Bilgileri</h3>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <Building className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Firma:</p>
                        <p>{formData.inspectorCompany}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <User className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Denetçi:</p>
                        <p>{formData.inspectorName || 'Belirtilmemiş'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">Müşteri Bilgileri</h3>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <Building className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Firma:</p>
                        <p>{formData.clientCompany || 'Belirtilmemiş'}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <User className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Yetkili:</p>
                        <p>{formData.clientName || 'Belirtilmemiş'}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FileText className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Tesis Türü:</p>
                        <p>{formData.propertyType || 'Belirtilmemiş'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overall Status */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">Genel Durum</h3>
                <div className="flex items-center">
                  <div className={`text-xl font-bold ${getStatusColor(formData.overallStatus)}`}>
                    {getStatusLabel(formData.overallStatus)}
                  </div>
                  <div className="ml-4 text-sm text-gray-600">
                    Bir sonraki denetim tarihi: {new Date(formData.nextInspectionDate).toLocaleDateString('tr-TR')}
                  </div>
                </div>
              </div>

              {/* Findings */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">Bulgular</h3>
                
                <div className="space-y-4">
                  {findings.map((finding) => (
                    <div key={finding.id} className={`border rounded-md p-4 ${getSeverityColor(finding.severity)}`}>
                      <div className="flex justify-between">
                        <h4 className="font-medium">{finding.area}</h4>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white">
                          {getSeverityLabel(finding.severity)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm">{finding.issue}</p>
                      {finding.photo && (
                        <div className="mt-3">
                          <img 
                            src={finding.photo} 
                            alt="Finding" 
                            className="max-h-32 rounded-md"
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  {findings.length === 0 && (
                    <p className="text-gray-500 italic">Henüz bulgu eklenmemiş.</p>
                  )}
                </div>
              </div>

              {/* Recommendations */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">Öneriler</h3>
                
                <div className="space-y-2">
                  <ol className="list-decimal list-inside">
                    {recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-700 mb-2">{rec}</li>
                    ))}
                  </ol>

                  {recommendations.length === 0 && (
                    <p className="text-gray-500 italic">Henüz öneri eklenmemiş.</p>
                  )}
                </div>
              </div>

              {/* General Recommendations */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">Genel Öneriler</h3>
                
                <div className="bg-blue-50 p-4 rounded-md">
                  <ul className="list-disc list-inside space-y-2">
                    {generalRecommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-blue-800">{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Summary */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">Özet</h3>
                <p className="text-sm text-gray-700">
                  Bu rapor, {formData.clientCompany || 'müşteri'} firmasının zararlı mücadele denetimini içermektedir. 
                  Denetim sonucunda tespit edilen bulgular ve öneriler yukarıda listelenmiştir. 
                  Genel durum <strong className={getStatusColor(formData.overallStatus)}>{getStatusLabel(formData.overallStatus)}</strong> olarak değerlendirilmiştir.
                  Bir sonraki denetim {new Date(formData.nextInspectionDate).toLocaleDateString('tr-TR')} tarihinde gerçekleştirilecektir.
                </p>
              </div>

              {/* Footer */}
              <div className="border-t pt-4 text-sm text-gray-500 flex justify-between">
                <div>
                  <p>Rapor Tarihi: {new Date().toLocaleDateString('tr-TR')}</p>
                  <p>Denetleyen: {formData.inspectorName || 'Belirtilmemiş'}</p>
                </div>
                <div className="text-right">
                  <p>{formData.inspectorCompany}</p>
                  <p>www.pestmentor.com.tr</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="mt-12 bg-blue-600 rounded-lg p-8 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Profesyonel Denetim Hizmeti İster misiniz?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Uzman ekibimiz, tesislerinizin zararlı mücadele denetimini profesyonel olarak gerçekleştirmek için yanınızda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/iletisim" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-lg flex items-center justify-center space-x-2"
            >
              <Mail className="h-5 w-5" />
              <span>İletişime Geçin</span>
            </Link>
            <a 
              href="tel:02242338387" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <Phone className="h-5 w-5" />
              <span>Hemen Arayın</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InspectionReportPage;