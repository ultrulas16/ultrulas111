import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Download, 
  Save, 
  Clipboard, 
  Building, 
  Calendar, 
  User, 
  FileText,
  Mail,
  Phone,
  Image,
  Info,
  Plus,
  Trash2,
  ArrowDown,
  ArrowUp,
  Edit,
  Upload
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface HazardItem {
  id: string;
  hazard: string;
  category: string;
  consequences: string;
  existingControls: string;
  likelihood: number;
  severity: number;
  riskScore: number;
  riskLevel: string;
  recommendedControls: string;
  responsiblePerson: string;
  targetDate: string;
  status: 'open' | 'in-progress' | 'completed';
  newLikelihood: number;
  newSeverity: number;
  newRiskScore: number;
  newRiskLevel: string;
}

interface ReportInfo {
  companyName: string;
  companyAddress: string;
  assessmentDate: string;
  assessor: string;
  department: string;
  reviewDate: string;
  companyLogo: string | null;
  footerText: string;
  visitFrequency: 'weekly-1' | 'monthly-2' | 'monthly-4' | '';
}

const HazardRiskAssessmentPage = () => {
  const [hazards, setHazards] = useState<HazardItem[]>([
    {
      id: '1',
      hazard: 'Kemirgen istilası',
      category: 'Biyolojik',
      consequences: 'Gıda kontaminasyonu, hastalık bulaşma riski, yapısal hasar',
      existingControls: 'Periyodik ilaçlama, kapı altı fitilleri',
      likelihood: 3,
      severity: 4,
      riskScore: 12,
      riskLevel: 'Yüksek',
      recommendedControls: 'Kemirgen istasyonlarının sayısını artırma, giriş noktalarını kapatma',
      responsiblePerson: 'Kalite Müdürü',
      targetDate: '2025-07-30',
      status: 'in-progress',
      newLikelihood: 2,
      newSeverity: 4,
      newRiskScore: 8,
      newRiskLevel: 'Orta'
    },
    {
      id: '2',
      hazard: 'Hamam böceği istilası',
      category: 'Biyolojik',
      consequences: 'Gıda kontaminasyonu, müşteri şikayetleri, itibar kaybı',
      existingControls: 'Aylık ilaçlama, hijyen prosedürleri',
      likelihood: 4,
      severity: 3,
      riskScore: 12,
      riskLevel: 'Yüksek',
      recommendedControls: 'Jel yem uygulaması, çatlak ve yarıkları kapatma',
      responsiblePerson: 'Üretim Müdürü',
      targetDate: '2025-06-15',
      status: 'open',
      newLikelihood: 2,
      newSeverity: 3,
      newRiskScore: 6,
      newRiskLevel: 'Orta'
    },
    {
      id: '3',
      hazard: 'Uçan böcek istilası',
      category: 'Biyolojik',
      consequences: 'Gıda kontaminasyonu, müşteri şikayetleri',
      existingControls: 'Hava perdesi, sineklikler',
      likelihood: 3,
      severity: 3,
      riskScore: 9,
      riskLevel: 'Orta',
      recommendedControls: 'EFK cihazlarının sayısını artırma, kapı disiplini eğitimi',
      responsiblePerson: 'Kalite Müdürü',
      targetDate: '2025-06-30',
      status: 'completed',
      newLikelihood: 1,
      newSeverity: 3,
      newRiskScore: 3,
      newRiskLevel: 'Düşük'
    }
  ]);

  const [reportInfo, setReportInfo] = useState<ReportInfo>({
    companyName: '',
    companyAddress: '',
    assessmentDate: new Date().toISOString().split('T')[0],
    assessor: '',
    department: '',
    reviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    companyLogo: null,
    footerText: 'PestMentor © 2025 | Sistem İlaçlama San. ve Tic. Ltd. Şti. | www.pestmentor.com.tr',
    visitFrequency: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showHazardForm, setShowHazardForm] = useState(false);
  const [currentHazard, setCurrentHazard] = useState<HazardItem | null>(null);
  const [activeTab, setActiveTab] = useState<'report' | 'preview'>('report');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const reportRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Calculate risk level based on likelihood and severity
  const calculateRiskLevel = (likelihood: number, severity: number): string => {
    const score = likelihood * severity;
    if (score >= 15) return 'Çok Yüksek';
    if (score >= 10) return 'Yüksek';
    if (score >= 5) return 'Orta';
    if (score >= 3) return 'Düşük';
    return 'Çok Düşük';
  };

  // Calculate risk score and level for a hazard
  const calculateRisk = (hazard: HazardItem): HazardItem => {
    const riskScore = hazard.likelihood * hazard.severity;
    const riskLevel = calculateRiskLevel(hazard.likelihood, hazard.severity);
    const newRiskScore = hazard.newLikelihood * hazard.newSeverity;
    const newRiskLevel = calculateRiskLevel(hazard.newLikelihood, hazard.newSeverity);
    
    return {
      ...hazard,
      riskScore,
      riskLevel,
      newRiskScore,
      newRiskLevel
    };
  };

  // Add a new hazard
  const addHazard = () => {
    const newHazard: HazardItem = {
      id: Date.now().toString(),
      hazard: '',
      category: 'Biyolojik',
      consequences: '',
      existingControls: '',
      likelihood: 3,
      severity: 3,
      riskScore: 9,
      riskLevel: 'Orta',
      recommendedControls: '',
      responsiblePerson: '',
      targetDate: new Date().toISOString().split('T')[0],
      status: 'open',
      newLikelihood: 2,
      newSeverity: 3,
      newRiskScore: 6,
      newRiskLevel: 'Orta'
    };
    
    setCurrentHazard(calculateRisk(newHazard));
    setShowHazardForm(true);
  };

  // Edit an existing hazard
  const editHazard = (hazard: HazardItem) => {
    setCurrentHazard(hazard);
    setShowHazardForm(true);
  };

  // Delete a hazard
  const deleteHazard = (id: string) => {
    setHazards(hazards.filter(h => h.id !== id));
  };

  // Save hazard changes
  const saveHazard = () => {
    if (!currentHazard) return;
    
    const updatedHazard = calculateRisk(currentHazard);
    
    if (hazards.some(h => h.id === updatedHazard.id)) {
      // Update existing hazard
      setHazards(hazards.map(h => h.id === updatedHazard.id ? updatedHazard : h));
    } else {
      // Add new hazard
      setHazards([...hazards, updatedHazard]);
    }
    
    setShowHazardForm(false);
    setCurrentHazard(null);
  };

  // Handle hazard form input changes
  const handleHazardChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!currentHazard) return;
    
    const { name, value } = e.target;
    
    let updatedHazard = { ...currentHazard, [name]: value };
    
    // Recalculate risk scores if likelihood or severity changes
    if (['likelihood', 'severity', 'newLikelihood', 'newSeverity'].includes(name)) {
      const numValue = parseInt(value);
      updatedHazard = {
        ...updatedHazard,
        [name]: numValue
      };
      
      if (name === 'likelihood' || name === 'severity') {
        const riskScore = name === 'likelihood' 
          ? numValue * updatedHazard.severity 
          : updatedHazard.likelihood * numValue;
        
        updatedHazard = {
          ...updatedHazard,
          riskScore,
          riskLevel: calculateRiskLevel(
            name === 'likelihood' ? numValue : updatedHazard.likelihood,
            name === 'severity' ? numValue : updatedHazard.severity
          )
        };
      }
      
      if (name === 'newLikelihood' || name === 'newSeverity') {
        const newRiskScore = name === 'newLikelihood' 
          ? numValue * updatedHazard.newSeverity 
          : updatedHazard.newLikelihood * numValue;
        
        updatedHazard = {
          ...updatedHazard,
          newRiskScore,
          newRiskLevel: calculateRiskLevel(
            name === 'newLikelihood' ? numValue : updatedHazard.newLikelihood,
            name === 'newSeverity' ? numValue : updatedHazard.newSeverity
          )
        };
      }
    }
    
    setCurrentHazard(updatedHazard);
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

  // Calculate average risk scores
  const calculateAverageRiskScores = () => {
    if (hazards.length === 0) return { initial: 0, final: 0 };

    const initialSum = hazards.reduce((sum, hazard) => sum + hazard.riskScore, 0);
    const finalSum = hazards.reduce((sum, hazard) => sum + hazard.newRiskScore, 0);

    return {
      initial: Math.round((initialSum / hazards.length) * 10) / 10,
      final: Math.round((finalSum / hazards.length) * 10) / 10
    };
  };

  // Calculate visit plan
  const calculateVisitPlan = () => {
    if (!reportInfo.visitFrequency) {
      return { summer: 0, winter: 0, label: '' };
    }

    let monthlyVisits = 0;
    let label = '';

    switch (reportInfo.visitFrequency) {
      case 'weekly-1':
        monthlyVisits = 4;
        label = 'Haftada 1 Ziyaret';
        break;
      case 'monthly-2':
        monthlyVisits = 2;
        label = 'Ayda 2 Ziyaret';
        break;
      case 'monthly-4':
        monthlyVisits = 4;
        label = 'Ayda 4 Ziyaret';
        break;
    }

    const summerMonths = 6;
    const winterMonths = 6;

    return {
      summer: monthlyVisits * summerMonths,
      winter: monthlyVisits * winterMonths,
      label,
      monthly: monthlyVisits
    };
  };

  // Get risk level color
  const getRiskLevelColor = (level: string): string => {
    switch (level) {
      case 'Çok Yüksek': return 'bg-red-600 text-white';
      case 'Yüksek': return 'bg-red-500 text-white';
      case 'Orta': return 'bg-yellow-500 text-white';
      case 'Düşük': return 'bg-green-500 text-white';
      case 'Çok Düşük': return 'bg-green-400 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status text
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'open': return 'Açık';
      case 'in-progress': return 'Devam Ediyor';
      case 'completed': return 'Tamamlandı';
      default: return status;
    }
  };

  // Move hazard up in the list
  const moveHazardUp = (id: string) => {
    const index = hazards.findIndex(h => h.id === id);
    if (index > 0) {
      const newHazards = [...hazards];
      [newHazards[index - 1], newHazards[index]] = [newHazards[index], newHazards[index - 1]];
      setHazards(newHazards);
    }
  };

  // Move hazard down in the list
  const moveHazardDown = (id: string) => {
    const index = hazards.findIndex(h => h.id === id);
    if (index < hazards.length - 1) {
      const newHazards = [...hazards];
      [newHazards[index], newHazards[index + 1]] = [newHazards[index + 1], newHazards[index]];
      setHazards(newHazards);
    }
  };

  // Generate PDF report
  const generatePDF = async () => {
    if (!reportRef.current) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Initialize PDF with A4 landscape
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      // Define page dimensions
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Get all page elements
      const pageElements = reportRef.current.querySelectorAll('.report-page');
      
      // Process each page
      for (let i = 0; i < pageElements.length; i++) {
        const pageElement = pageElements[i] as HTMLElement;
        
        // Add a new page for all pages except the first one
        if (i > 0) {
          pdf.addPage();
        }
        
        // Capture the page as an image
        const canvas = await html2canvas(pageElement, {
          scale: 2, // Higher scale for better quality
          logging: false,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        });
        
        // Convert to image
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        // Calculate dimensions to fit the page
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Add image to PDF
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      }
      
      // Save the PDF
      pdf.save(`Tehlike_Risk_Değerlendirme_${reportInfo.companyName || 'Rapor'}.pdf`);
      
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
      // Get all page elements
      const pageElements = reportRef.current.querySelectorAll('.report-page');
      
      // Process each page
      for (let i = 0; i < pageElements.length; i++) {
        const pageElement = pageElements[i] as HTMLElement;
        
        // Capture the page as an image
        const canvas = await html2canvas(pageElement, {
          scale: 2, // Higher scale for better quality
          logging: false,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        });
        
        // Convert to image
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        // Create a download link
        const link = document.createElement('a');
        link.href = imgData;
        link.download = `Tehlike_Risk_Değerlendirme_${reportInfo.companyName || 'Rapor'}_Sayfa_${i+1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Add a small delay between downloads
        if (i < pageElements.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      setSuccess('JPEG görüntüleri başarıyla oluşturuldu!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('JPEG generation error:', error);
      setError('JPEG oluşturulurken bir hata meydana geldi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate total pages based on content
  useEffect(() => {
    if (activeTab === 'preview' && reportRef.current) {
      // Reset page refs array
      pageRefs.current = [];
      
      // Get all page elements
      const pageElements = reportRef.current.querySelectorAll('.report-page');
      setTotalPages(pageElements.length);
      
      // Store refs to each page
      pageElements.forEach((element) => {
        pageRefs.current.push(element as HTMLDivElement);
      });
    }
  }, [activeTab, hazards, reportInfo]);

  // Navigate to specific page
  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);

      // Scroll to the page
      if (pageRefs.current[pageNumber - 1]) {
        pageRefs.current[pageNumber - 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Calculate average risk scores
  const averageRiskScores = calculateAverageRiskScores();

  // Calculate visit plan
  const visitPlan = calculateVisitPlan();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tabs */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Tehlike Belirleme ve Risk Değerlendirme</h1>
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
                    Departman/Bölüm
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={reportInfo.department}
                    onChange={handleReportInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Departman veya bölüm adı"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gözden Geçirme Tarihi
                  </label>
                  <input
                    type="date"
                    name="reviewDate"
                    value={reportInfo.reviewDate}
                    onChange={handleReportInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ziyaret Sıklığı
                  </label>
                  <select
                    name="visitFrequency"
                    value={reportInfo.visitFrequency}
                    onChange={handleReportInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">Seçiniz</option>
                    <option value="weekly-1">Haftada 1 Ziyaret</option>
                    <option value="monthly-2">Ayda 2 Ziyaret</option>
                    <option value="monthly-4">Ayda 4 Ziyaret</option>
                  </select>
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
                      <Image className="mr-2" size={18} />
                      JPEG İndir
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Hazards List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Tehlike ve Risk Listesi</h2>
                <button
                  onClick={addHazard}
                  className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors flex items-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Yeni Tehlike Ekle
                </button>
              </div>
              
              {hazards.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz Tehlike Eklenmedi</h3>
                  <p className="text-gray-500 mb-4">Değerlendirme yapmak için tehlike ekleyin.</p>
                  <button
                    onClick={addHazard}
                    className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors inline-flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Tehlike Ekle
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tehlike</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İlk Risk</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Son Risk</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {hazards.map((hazard, index) => (
                        <tr key={hazard.id} className="hover:bg-gray-50">
                          <td className="py-4 px-4 text-sm font-medium text-gray-900">{hazard.hazard}</td>
                          <td className="py-4 px-4 text-sm text-gray-500">{hazard.category}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskLevelColor(hazard.riskLevel)}`}>
                              {hazard.riskScore} - {hazard.riskLevel}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskLevelColor(hazard.newRiskLevel)}`}>
                              {hazard.newRiskScore} - {hazard.newRiskLevel}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(hazard.status)}`}>
                              {getStatusText(hazard.status)}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => editHazard(hazard)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Düzenle"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => deleteHazard(hazard.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Sil"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => moveHazardUp(hazard.id)}
                                disabled={index === 0}
                                className={`text-gray-600 hover:text-gray-900 ${index === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title="Yukarı Taşı"
                              >
                                <ArrowUp className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => moveHazardDown(hazard.id)}
                                disabled={index === hazards.length - 1}
                                className={`text-gray-600 hover:text-gray-900 ${index === hazards.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title="Aşağı Taşı"
                              >
                                <ArrowDown className="h-5 w-5" />
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

            {/* Risk Matrix */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Risk Matrisi</h2>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Risk Matrisi</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                      <thead>
                        <tr>
                          <th className="border border-gray-300 p-2 bg-gray-100"></th>
                          <th colSpan={5} className="border border-gray-300 p-2 bg-gray-100 text-center">Şiddet (S)</th>
                        </tr>
                        <tr>
                          <th className="border border-gray-300 p-2 bg-gray-100">Olasılık (O)</th>
                          <th className="border border-gray-300 p-2 bg-gray-100 text-center">1</th>
                          <th className="border border-gray-300 p-2 bg-gray-100 text-center">2</th>
                          <th className="border border-gray-300 p-2 bg-gray-100 text-center">3</th>
                          <th className="border border-gray-300 p-2 bg-gray-100 text-center">4</th>
                          <th className="border border-gray-300 p-2 bg-gray-100 text-center">5</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[5, 4, 3, 2, 1].map(likelihood => (
                          <tr key={likelihood}>
                            <td className="border border-gray-300 p-2 bg-gray-100 text-center font-medium">{likelihood}</td>
                            {[1, 2, 3, 4, 5].map(severity => {
                              const score = likelihood * severity;
                              let bgColor = 'bg-green-100 text-green-800';
                              if (score >= 15) bgColor = 'bg-red-600 text-white';
                              else if (score >= 10) bgColor = 'bg-red-500 text-white';
                              else if (score >= 5) bgColor = 'bg-yellow-500 text-white';
                              else if (score >= 3) bgColor = 'bg-green-500 text-white';
                              
                              return (
                                <td key={severity} className={`border border-gray-300 p-2 text-center ${bgColor}`}>
                                  {score}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Risk Seviyeleri</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-red-600 mr-2"></div>
                      <span>Çok Yüksek Risk (15-25): Derhal önlem alınmalı</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-red-500 mr-2"></div>
                      <span>Yüksek Risk (10-14): Kısa vadede önlem alınmalı</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-yellow-500 mr-2"></div>
                      <span>Orta Risk (5-9): Planlı önlemler alınmalı</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-green-500 mr-2"></div>
                      <span>Düşük Risk (3-4): İzlenmeli</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-green-100 mr-2"></div>
                      <span>Çok Düşük Risk (1-2): Önlem gerekmez</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Risk Ortalamaları</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">İlk Risk Ortalaması:</p>
                        <p className="text-xl font-bold text-amber-600">{averageRiskScores.initial}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Son Risk Ortalaması:</p>
                        <p className="text-xl font-bold text-green-600">{averageRiskScores.final}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Risk Azalma Oranı:</p>
                      <p className="text-xl font-bold text-blue-600">
                        {averageRiskScores.initial > 0 
                          ? `%${Math.round((1 - averageRiskScores.final / averageRiskScores.initial) * 100)}`
                          : '%0'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Preview */}
      {activeTab === 'preview' && (
        <div>
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  Sayfa {currentPage} / {totalPages}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
                  >
                    Önceki
                  </button>
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
                  >
                    Sonraki
                  </button>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={generatePDF}
                  disabled={loading}
                  className="flex items-center bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors disabled:bg-gray-400"
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
                  className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
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
            </div>
          </div>

          {/* Report Preview */}
          <div 
            ref={reportRef}
            className="bg-white border border-gray-200 rounded-lg p-4 max-w-[297mm] mx-auto"
          >
            {/* Page 1: Cover and General Information */}
            <div className="report-page" style={{ width: '297mm', height: '210mm', position: 'relative', pageBreakAfter: 'always' }}>
              <div className="p-8 h-full flex flex-col">
                {/* Header with Logo */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">TEHLİKE BELİRLEME VE RİSK DEĞERLENDİRME RAPORU</h1>
                    <p className="text-gray-600 mt-2">Zararlı Mücadelesi Risk Değerlendirmesi</p>
                  </div>
                  {reportInfo.companyLogo && (
                    <img src={reportInfo.companyLogo} alt="Company Logo" className="h-16 object-contain" />
                  )}
                </div>

                {/* Company Information */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Şirket Bilgileri</h2>
                    <div className="space-y-3">
                      <div className="flex">
                        <span className="font-medium w-32">Şirket Adı:</span>
                        <span>{reportInfo.companyName || 'Belirtilmemiş'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-32">Adres:</span>
                        <span>{reportInfo.companyAddress || 'Belirtilmemiş'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-32">Departman:</span>
                        <span>{reportInfo.department || 'Tüm Tesis'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Değerlendirme Bilgileri</h2>
                    <div className="space-y-3">
                      <div className="flex">
                        <span className="font-medium w-32">Değerlendiren:</span>
                        <span>{reportInfo.assessor || 'Belirtilmemiş'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-32">Tarih:</span>
                        <span>{new Date(reportInfo.assessmentDate).toLocaleDateString('tr-TR')}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-32">Gözden Geçirme:</span>
                        <span>{new Date(reportInfo.reviewDate).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visit Plan */}
                {reportInfo.visitFrequency && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Ziyaret Planı</h2>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="grid grid-cols-3 gap-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-2">Ziyaret Sıklığı</p>
                          <p className="text-2xl font-bold text-blue-600">{visitPlan.label}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-2">Yaz Dönemi Ziyaret</p>
                          <p className="text-2xl font-bold text-amber-600">{visitPlan.summer} Ziyaret</p>
                          <p className="text-xs text-gray-500 mt-1">(Nisan - Eylül)</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-2">Kış Dönemi Ziyaret</p>
                          <p className="text-2xl font-bold text-blue-600">{visitPlan.winter} Ziyaret</p>
                          <p className="text-xs text-gray-500 mt-1">(Ekim - Mart)</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Toplam Yıllık Ziyaret:</span> {visitPlan.summer + visitPlan.winter} Ziyaret
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Risk Matrix */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Risk Matrisi</h2>
                  
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <table className="min-w-full border border-gray-300">
                        <thead>
                          <tr>
                            <th className="border border-gray-300 p-2 bg-gray-100"></th>
                            <th colSpan={5} className="border border-gray-300 p-2 bg-gray-100 text-center">Şiddet (S)</th>
                          </tr>
                          <tr>
                            <th className="border border-gray-300 p-2 bg-gray-100">Olasılık (O)</th>
                            <th className="border border-gray-300 p-2 bg-gray-100 text-center">1</th>
                            <th className="border border-gray-300 p-2 bg-gray-100 text-center">2</th>
                            <th className="border border-gray-300 p-2 bg-gray-100 text-center">3</th>
                            <th className="border border-gray-300 p-2 bg-gray-100 text-center">4</th>
                            <th className="border border-gray-300 p-2 bg-gray-100 text-center">5</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[5, 4, 3, 2, 1].map(likelihood => (
                            <tr key={likelihood}>
                              <td className="border border-gray-300 p-2 bg-gray-100 text-center font-medium">{likelihood}</td>
                              {[1, 2, 3, 4, 5].map(severity => {
                                const score = likelihood * severity;
                                let bgColor = 'bg-green-100 text-green-800';
                                if (score >= 15) bgColor = 'bg-red-600 text-white';
                                else if (score >= 10) bgColor = 'bg-red-500 text-white';
                                else if (score >= 5) bgColor = 'bg-yellow-500 text-white';
                                else if (score >= 3) bgColor = 'bg-green-500 text-white';
                                
                                return (
                                  <td key={severity} className={`border border-gray-300 p-2 text-center ${bgColor}`}>
                                    {score}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-red-600 mr-2"></div>
                          <span>Çok Yüksek Risk (15-25): Derhal önlem alınmalı</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-red-500 mr-2"></div>
                          <span>Yüksek Risk (10-14): Kısa vadede önlem alınmalı</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-yellow-500 mr-2"></div>
                          <span>Orta Risk (5-9): Planlı önlemler alınmalı</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-green-500 mr-2"></div>
                          <span>Düşük Risk (3-4): İzlenmeli</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-green-100 mr-2"></div>
                          <span>Çok Düşük Risk (1-2): Önlem gerekmez</span>
                        </div>
                      </div>
                      
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-2">Risk Ortalamaları</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">İlk Risk Ortalaması:</p>
                            <p className="text-xl font-bold text-amber-600">{averageRiskScores.initial}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Son Risk Ortalaması:</p>
                            <p className="text-xl font-bold text-green-600">{averageRiskScores.final}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">Risk Azalma Oranı:</p>
                          <p className="text-xl font-bold text-blue-600">
                            {averageRiskScores.initial > 0 
                              ? `%${Math.round((1 - averageRiskScores.final / averageRiskScores.initial) * 100)}`
                              : '%0'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-auto border-t pt-4 text-sm text-gray-500">
                  <p>{reportInfo.footerText}</p>
                </div>
              </div>
            </div>

            {/* Page 2: Hazards and Risks */}
            <div className="report-page" style={{ width: '297mm', height: '210mm', position: 'relative', pageBreakAfter: 'always' }}>
              <div className="p-8 h-full flex flex-col">
                {/* Header with Logo */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">TEHLİKE BELİRLEME VE RİSK DEĞERLENDİRME RAPORU</h1>
                    <p className="text-gray-600 text-sm">Şirket: {reportInfo.companyName || 'Belirtilmemiş'} | Tarih: {new Date(reportInfo.assessmentDate).toLocaleDateString('tr-TR')}</p>
                  </div>
                  {reportInfo.companyLogo && (
                    <img src={reportInfo.companyLogo} alt="Company Logo" className="h-12 object-contain" />
                  )}
                </div>

                {/* Hazards Table */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Tehlike ve Risk Listesi</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2 text-left">Tehlike</th>
                          <th className="border border-gray-300 p-2 text-left">Kategori</th>
                          <th className="border border-gray-300 p-2 text-left">Sonuçlar</th>
                          <th className="border border-gray-300 p-2 text-left">Mevcut Kontroller</th>
                          <th className="border border-gray-300 p-2 text-center">O</th>
                          <th className="border border-gray-300 p-2 text-center">Ş</th>
                          <th className="border border-gray-300 p-2 text-center">Risk</th>
                          <th className="border border-gray-300 p-2 text-center">Seviye</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hazards.map((hazard) => (
                          <tr key={hazard.id}>
                            <td className="border border-gray-300 p-2">{hazard.hazard}</td>
                            <td className="border border-gray-300 p-2">{hazard.category}</td>
                            <td className="border border-gray-300 p-2">{hazard.consequences}</td>
                            <td className="border border-gray-300 p-2">{hazard.existingControls}</td>
                            <td className="border border-gray-300 p-2 text-center">{hazard.likelihood}</td>
                            <td className="border border-gray-300 p-2 text-center">{hazard.severity}</td>
                            <td className="border border-gray-300 p-2 text-center">{hazard.riskScore}</td>
                            <td className="border border-gray-300 p-2 text-center">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskLevelColor(hazard.riskLevel)}`}>
                                {hazard.riskLevel}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Risk Distribution */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Risk Dağılımı</h2>
                  
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-3">İlk Risk Dağılımı</h3>
                      <div className="space-y-2">
                        {['Çok Yüksek', 'Yüksek', 'Orta', 'Düşük', 'Çok Düşük'].map(level => {
                          const count = hazards.filter(h => h.riskLevel === level).length;
                          const percentage = hazards.length > 0 ? Math.round((count / hazards.length) * 100) : 0;
                          
                          return (
                            <div key={level} className="flex items-center">
                              <div className={`w-6 h-6 ${getRiskLevelColor(level)} mr-2`}></div>
                              <span className="w-24">{level}:</span>
                              <div className="flex-1 bg-gray-200 rounded-full h-2.5 mr-2">
                                <div 
                                  className={`h-2.5 rounded-full ${getRiskLevelColor(level)}`} 
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span>{count} ({percentage}%)</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-3">Son Risk Dağılımı</h3>
                      <div className="space-y-2">
                        {['Çok Yüksek', 'Yüksek', 'Orta', 'Düşük', 'Çok Düşük'].map(level => {
                          const count = hazards.filter(h => h.newRiskLevel === level).length;
                          const percentage = hazards.length > 0 ? Math.round((count / hazards.length) * 100) : 0;
                          
                          return (
                            <div key={level} className="flex items-center">
                              <div className={`w-6 h-6 ${getRiskLevelColor(level)} mr-2`}></div>
                              <span className="w-24">{level}:</span>
                              <div className="flex-1 bg-gray-200 rounded-full h-2.5 mr-2">
                                <div 
                                  className={`h-2.5 rounded-full ${getRiskLevelColor(level)}`} 
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span>{count} ({percentage}%)</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-auto border-t pt-4 text-sm text-gray-500">
                  <p>{reportInfo.footerText}</p>
                </div>
              </div>
            </div>

            {/* Page 3: Control Measures */}
            <div className="report-page" style={{ width: '297mm', height: '210mm', position: 'relative', pageBreakAfter: 'always' }}>
              <div className="p-8 h-full flex flex-col">
                {/* Header with Logo */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">TEHLİKE BELİRLEME VE RİSK DEĞERLENDİRME RAPORU</h1>
                    <p className="text-gray-600 text-sm">Şirket: {reportInfo.companyName || 'Belirtilmemiş'} | Tarih: {new Date(reportInfo.assessmentDate).toLocaleDateString('tr-TR')}</p>
                  </div>
                  {reportInfo.companyLogo && (
                    <img src={reportInfo.companyLogo} alt="Company Logo" className="h-12 object-contain" />
                  )}
                </div>

                {/* Control Measures Table */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Kontrol Önlemleri ve Eylem Planı</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2 text-left">Tehlike</th>
                          <th className="border border-gray-300 p-2 text-left">Önerilen Kontroller</th>
                          <th className="border border-gray-300 p-2 text-left">Sorumlu Kişi</th>
                          <th className="border border-gray-300 p-2 text-center">Hedef Tarih</th>
                          <th className="border border-gray-300 p-2 text-center">Durum</th>
                          <th className="border border-gray-300 p-2 text-center">Son Risk</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hazards.map((hazard) => (
                          <tr key={hazard.id}>
                            <td className="border border-gray-300 p-2">{hazard.hazard}</td>
                            <td className="border border-gray-300 p-2">{hazard.recommendedControls}</td>
                            <td className="border border-gray-300 p-2">{hazard.responsiblePerson}</td>
                            <td className="border border-gray-300 p-2 text-center">{new Date(hazard.targetDate).toLocaleDateString('tr-TR')}</td>
                            <td className="border border-gray-300 p-2 text-center">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(hazard.status)}`}>
                                {getStatusText(hazard.status)}
                              </span>
                            </td>
                            <td className="border border-gray-300 p-2 text-center">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskLevelColor(hazard.newRiskLevel)}`}>
                                {hazard.newRiskScore} - {hazard.newRiskLevel}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Risk Reduction Summary */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Risk Azaltma Özeti</h2>
                  
                  <div className="grid grid-cols-2 gap-8">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-800 mb-3">Risk Azaltma Analizi</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600">İlk Risk Ortalaması:</p>
                          <p className="text-xl font-bold text-amber-600">{averageRiskScores.initial}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Son Risk Ortalaması:</p>
                          <p className="text-xl font-bold text-green-600">{averageRiskScores.final}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Risk Azalma Oranı:</p>
                          <p className="text-xl font-bold text-blue-600">
                            {averageRiskScores.initial > 0 
                              ? `%${Math.round((1 - averageRiskScores.final / averageRiskScores.initial) * 100)}`
                              : '%0'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-3">Sonuç ve Öneriler</h3>
                      <p className="text-gray-700">
                        Bu risk değerlendirmesi sonucunda, tespit edilen tehlikelere yönelik kontrol önlemleri uygulandığında 
                        risk seviyesinde {averageRiskScores.initial > 0 
                          ? `%${Math.round((1 - averageRiskScores.final / averageRiskScores.initial) * 100)}`
                          : '%0'} oranında bir azalma sağlanacağı öngörülmektedir. 
                        Önerilen kontrol önlemlerinin belirtilen tarihlerde uygulanması ve düzenli olarak gözden geçirilmesi önemlidir.
                      </p>
                      <p className="text-gray-700 mt-4">
                        Bu risk değerlendirmesi raporu {new Date(reportInfo.reviewDate).toLocaleDateString('tr-TR')} tarihinde 
                        gözden geçirilecektir. Tesis koşullarında önemli değişiklikler olması durumunda daha erken bir tarihte 
                        revize edilmelidir.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-auto border-t pt-4 text-sm text-gray-500">
                  <p>{reportInfo.footerText}</p>
                </div>
              </div>
            </div>

            {/* Page 4: Detailed Hazard Analysis */}
            {hazards.length > 0 && (
              <div className="report-page" style={{ width: '297mm', height: '210mm', position: 'relative' }}>
                <div className="p-8 h-full flex flex-col">
                  {/* Header with Logo */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">TEHLİKE BELİRLEME VE RİSK DEĞERLENDİRME RAPORU</h1>
                      <p className="text-gray-600 text-sm">Şirket: {reportInfo.companyName || 'Belirtilmemiş'} | Tarih: {new Date(reportInfo.assessmentDate).toLocaleDateString('tr-TR')}</p>
                    </div>
                    {reportInfo.companyLogo && (
                      <img src={reportInfo.companyLogo} alt="Company Logo" className="h-12 object-contain" />
                    )}
                  </div>

                  {/* Detailed Hazard Analysis */}
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Detaylı Tehlike Analizi</h2>
                    
                    <div className="space-y-6">
                      {hazards.map((hazard) => (
                        <div key={hazard.id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold text-gray-800">{hazard.hazard}</h3>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(hazard.status)}`}>
                              {getStatusText(hazard.status)}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Kategori:</p>
                              <p className="text-sm text-gray-600">{hazard.category}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Sonuçlar:</p>
                              <p className="text-sm text-gray-600">{hazard.consequences}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Mevcut Kontroller:</p>
                              <p className="text-sm text-gray-600">{hazard.existingControls}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Önerilen Kontroller:</p>
                              <p className="text-sm text-gray-600">{hazard.recommendedControls}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                              <p className="text-sm font-medium text-gray-700">İlk Risk Değerlendirmesi:</p>
                              <div className="flex items-center mt-1">
                                <div className="flex items-center space-x-2 mr-4">
                                  <span className="text-sm text-gray-600">O: {hazard.likelihood}</span>
                                  <span className="text-sm text-gray-600">Ş: {hazard.severity}</span>
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRiskLevelColor(hazard.riskLevel)}`}>
                                  {hazard.riskScore} - {hazard.riskLevel}
                                </span>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Son Risk Değerlendirmesi:</p>
                              <div className="flex items-center mt-1">
                                <div className="flex items-center space-x-2 mr-4">
                                  <span className="text-sm text-gray-600">O: {hazard.newLikelihood}</span>
                                  <span className="text-sm text-gray-600">Ş: {hazard.newSeverity}</span>
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRiskLevelColor(hazard.newRiskLevel)}`}>
                                  {hazard.newRiskScore} - {hazard.newRiskLevel}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <p className="text-sm font-medium text-gray-700">Eylem Planı:</p>
                            <div className="flex items-center mt-1">
                              <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-600">Sorumlu: {hazard.responsiblePerson}</span>
                                <span className="text-sm text-gray-600">Hedef Tarih: {new Date(hazard.targetDate).toLocaleDateString('tr-TR')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-auto border-t pt-4 text-sm text-gray-500">
                    <p>{reportInfo.footerText}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hazard Form Modal */}
      {showHazardForm && currentHazard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {currentHazard.id === Date.now().toString() ? 'Yeni Tehlike Ekle' : 'Tehlikeyi Düzenle'}
              </h2>
              <button
                onClick={() => {
                  setShowHazardForm(false);
                  setCurrentHazard(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tehlike *
                </label>
                <input
                  type="text"
                  name="hazard"
                  value={currentHazard.hazard}
                  onChange={handleHazardChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Tehlikeyi tanımlayın"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori *
                </label>
                <select
                  name="category"
                  value={currentHazard.category}
                  onChange={handleHazardChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                >
                  <option value="Biyolojik">Biyolojik</option>
                  <option value="Kimyasal">Kimyasal</option>
                  <option value="Fiziksel">Fiziksel</option>
                  <option value="Ergonomik">Ergonomik</option>
                  <option value="Psikososyal">Psikososyal</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sonuçlar *
                </label>
                <textarea
                  name="consequences"
                  value={currentHazard.consequences}
                  onChange={handleHazardChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Tehlikenin olası sonuçlarını açıklayın"
                  rows={2}
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mevcut Kontroller
                </label>
                <textarea
                  name="existingControls"
                  value={currentHazard.existingControls}
                  onChange={handleHazardChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Mevcut kontrol önlemlerini açıklayın"
                  rows={2}
                />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">İlk Risk Değerlendirmesi</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Olasılık (1-5) *
                    </label>
                    <select
                      name="likelihood"
                      value={currentHazard.likelihood}
                      onChange={handleHazardChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    >
                      <option value={1}>1 - Çok Düşük</option>
                      <option value={2}>2 - Düşük</option>
                      <option value={3}>3 - Orta</option>
                      <option value={4}>4 - Yüksek</option>
                      <option value={5}>5 - Çok Yüksek</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Şiddet (1-5) *
                    </label>
                    <select
                      name="severity"
                      value={currentHazard.severity}
                      onChange={handleHazardChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    >
                      <option value={1}>1 - Çok Düşük</option>
                      <option value={2}>2 - Düşük</option>
                      <option value={3}>3 - Orta</option>
                      <option value={4}>4 - Yüksek</option>
                      <option value={5}>5 - Çok Yüksek</option>
                    </select>
                  </div>
                  
                  <div className="col-span-2">
                    <div className="flex items-center space-x-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Risk Skoru
                        </label>
                        <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                          {currentHazard.riskScore}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Risk Seviyesi
                        </label>
                        <div className={`px-3 py-2 rounded-md font-medium ${getRiskLevelColor(currentHazard.riskLevel)}`}>
                          {currentHazard.riskLevel}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Kontrol Önlemleri</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Önerilen Kontroller *
                    </label>
                    <textarea
                      name="recommendedControls"
                      value={currentHazard.recommendedControls}
                      onChange={handleHazardChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Önerilen kontrol önlemlerini açıklayın"
                      rows={2}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sorumlu Kişi *
                    </label>
                    <input
                      type="text"
                      name="responsiblePerson"
                      value={currentHazard.responsiblePerson}
                      onChange={handleHazardChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Sorumlu kişinin adı veya pozisyonu"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hedef Tarih *
                      </label>
                      <input
                        type="date"
                        name="targetDate"
                        value={currentHazard.targetDate}
                        onChange={handleHazardChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Durum *
                      </label>
                      <select
                        name="status"
                        value={currentHazard.status}
                        onChange={handleHazardChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      >
                        <option value="open">Açık</option>
                        <option value="in-progress">Devam Ediyor</option>
                        <option value="completed">Tamamlandı</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Son Risk Değerlendirmesi</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Olasılık (1-5) *
                    </label>
                    <select
                      name="newLikelihood"
                      value={currentHazard.newLikelihood}
                      onChange={handleHazardChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    >
                      <option value={1}>1 - Çok Düşük</option>
                      <option value={2}>2 - Düşük</option>
                      <option value={3}>3 - Orta</option>
                      <option value={4}>4 - Yüksek</option>
                      <option value={5}>5 - Çok Yüksek</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Şiddet (1-5) *
                    </label>
                    <select
                      name="newSeverity"
                      value={currentHazard.newSeverity}
                      onChange={handleHazardChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    >
                      <option value={1}>1 - Çok Düşük</option>
                      <option value={2}>2 - Düşük</option>
                      <option value={3}>3 - Orta</option>
                      <option value={4}>4 - Yüksek</option>
                      <option value={5}>5 - Çok Yüksek</option>
                    </select>
                  </div>
                  
                  <div className="col-span-2">
                    <div className="flex items-center space-x-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Risk Skoru
                        </label>
                        <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                          {currentHazard.newRiskScore}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Risk Seviyesi
                        </label>
                        <div className={`px-3 py-2 rounded-md font-medium ${getRiskLevelColor(currentHazard.newRiskLevel)}`}>
                          {currentHazard.newRiskLevel}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-8 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowHazardForm(false);
                  setCurrentHazard(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 mr-4"
              >
                İptal
              </button>
              <button
                onClick={saveHazard}
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
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Tehlike Belirleme ve Risk Değerlendirme Hakkında</h3>
              <p className="text-blue-700 mb-4">
                Bu modül, zararlı mücadelesi ile ilgili tehlikeleri belirlemek, risk seviyelerini değerlendirmek ve kontrol önlemlerini planlamak için kullanılır.
              </p>
              <h4 className="font-semibold text-blue-800 mb-1">Nasıl Kullanılır?</h4>
              <ul className="space-y-1 text-blue-700">
                <li>1. Rapor bilgilerini doldurun (şirket adı, değerlendirme tarihi, vb.)</li>
                <li>2. "Yeni Tehlike Ekle" butonuna tıklayarak tehlikeleri ekleyin</li>
                <li>3. Her tehlike için ilk risk değerlendirmesini yapın (olasılık ve şiddet)</li>
                <li>4. Önerilen kontrol önlemlerini, sorumlu kişileri ve hedef tarihleri belirleyin</li>
                <li>5. Kontrol önlemleri sonrası son risk değerlendirmesini yapın</li>
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

export default HazardRiskAssessmentPage;