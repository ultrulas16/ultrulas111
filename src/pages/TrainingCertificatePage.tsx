import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, 
  Download, 
  Plus, 
  Trash2, 
  Upload, 
  Users, 
  Calendar, 
  FileText, 
  Save, 
  Image as ImageIcon,
  CheckCircle,
  X,
  Copy,
  Edit,
  AlertTriangle,
  Loader
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { supabase } from '../lib/supabase';

interface Certificate {
  id: string;
  participantName: string;
  companyName: string;
  trainingTitle: string;
  trainingDate: string;
  certificateNumber: string;
  issuerName: string;
  issuerTitle: string;
}

const TrainingCertificatePage = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [currentCertificate, setCurrentCertificate] = useState<Certificate>({
    id: `cert-${Date.now()}`,
    participantName: '',
    companyName: '',
    trainingTitle: '',
    trainingDate: new Date().toISOString().split('T')[0],
    certificateNumber: generateCertificateNumber(),
    issuerName: 'MEMDUH AYKUT ÜNAL',
    issuerTitle: 'ZİRAAT MÜHENDİSİ'
  });
  
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchParticipants, setBatchParticipants] = useState('');
  const [savedCertificates, setSavedCertificates] = useState<Certificate[]>([]);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'single' | 'batch'>('single');
  const [processingCertificate, setProcessingCertificate] = useState<string | null>(null);
  
  const certificateRef = useRef<HTMLDivElement>(null);
  const batchCertificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSavedCertificates();
  }, []);

  const loadSavedCertificates = () => {
    const saved = localStorage.getItem('pestmentor_certificates');
    if (saved) {
      try {
        setSavedCertificates(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading saved certificates:', e);
      }
    }
  };

  const saveCertificates = (certs: Certificate[]) => {
    localStorage.setItem('pestmentor_certificates', JSON.stringify(certs));
    setSavedCertificates(certs);
  };

  function generateCertificateNumber() {
    const prefix = 'CERT';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentCertificate(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCompanyLogo(event.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const generateCertificate = async () => {
    if (!certificateRef.current) return;
    
    setLoading(true);
    
    try {
      // First, ensure the certificate is properly styled for A4
      const certificateElement = certificateRef.current;
      
      // Create a canvas with the correct A4 dimensions and DPI
      const canvas = await html2canvas(certificateElement, {
        scale: 2, // Higher scale for better quality
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: certificateElement.offsetWidth,
        height: certificateElement.offsetHeight
      });
      
      // Get the image data
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // Create a download link
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `Sertifika_${currentCertificate.participantName.replace(/\s+/g, '_')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Save to local storage
      const newCert = {...currentCertificate, id: `cert-${Date.now()}`};
      saveCertificates([...savedCertificates, newCert]);
      
      setSuccess('Sertifika başarıyla oluşturuldu ve indirildi!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Certificate generation error:', error);
      setError('Sertifika oluşturulurken bir hata oluştu.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const generateBatchCertificates = async () => {
    if (!certificateRef.current) return;
    
    setLoading(true);
    
    try {
      const participants = batchParticipants
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      
      if (participants.length === 0) {
        setError('Lütfen en az bir katılımcı adı girin.');
        setLoading(false);
        return;
      }
      
      const newCertificates: Certificate[] = [];
      const batchCertificates: Certificate[] = [];
      
      for (const participant of participants) {
        const certNumber = generateCertificateNumber();
        const newCert = {
          ...currentCertificate,
          id: `cert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          participantName: participant,
          certificateNumber: certNumber
        };
        
        batchCertificates.push(newCert);
        newCertificates.push(newCert);
      }
      
      setCertificates(batchCertificates);
      
      // Save to local storage
      saveCertificates([...savedCertificates, ...newCertificates]);
      
      setShowBatchModal(false);
      setSuccess(`${participants.length} sertifika başarıyla oluşturuldu!`);
      setTimeout(() => setSuccess(null), 3000);
      
      // Switch to batch tab to show the generated certificates
      setActiveTab('batch');
    } catch (error) {
      console.error('Batch certificate generation error:', error);
      setError('Toplu sertifika oluşturulurken bir hata oluştu.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const downloadBatchCertificate = async (certificate: Certificate) => {
    if (!batchCertificateRef.current) return;
    
    setProcessingCertificate(certificate.id);
    
    try {
      // Temporarily set the current certificate to the one we want to download
      setCurrentCertificate(certificate);
      
      // Wait for the DOM to update
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get the certificate element
      const certificateElement = batchCertificateRef.current;
      
      // Create a canvas with the correct dimensions
      const canvas = await html2canvas(certificateElement, {
        scale: 2, // Higher scale for better quality
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: certificateElement.offsetWidth,
        height: certificateElement.offsetHeight
      });
      
      // Get the image data
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // Create a download link
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `Sertifika_${certificate.participantName.replace(/\s+/g, '_')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSuccess('Sertifika başarıyla indirildi!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Certificate download error:', error);
      setError('Sertifika indirilirken bir hata oluştu.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setProcessingCertificate(null);
    }
  };

  const downloadAllCertificates = async () => {
    if (certificates.length === 0) {
      setError('İndirilecek sertifika bulunamadı.');
      return;
    }
    
    setLoading(true);
    setSuccess('Sertifikalar hazırlanıyor, lütfen bekleyin...');
    
    try {
      for (let i = 0; i < certificates.length; i++) {
        const certificate = certificates[i];
        setProcessingCertificate(certificate.id);
        
        // Temporarily set the current certificate to the one we want to download
        setCurrentCertificate(certificate);
        
        // Wait for the DOM to update
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Get the certificate element
        const certificateElement = batchCertificateRef.current!;
        
        // Create a canvas with the correct dimensions
        const canvas = await html2canvas(certificateElement, {
          scale: 2, // Higher scale for better quality
          logging: false,
          useCORS: true,
          backgroundColor: '#ffffff',
          width: certificateElement.offsetWidth,
          height: certificateElement.offsetHeight
        });
        
        // Get the image data
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        // Create a download link
        const link = document.createElement('a');
        link.href = imgData;
        link.download = `Sertifika_${certificate.participantName.replace(/\s+/g, '_')}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Add a small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      setSuccess(`${certificates.length} sertifika başarıyla indirildi!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Batch download error:', error);
      setError('Sertifikalar indirilirken bir hata oluştu.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
      setProcessingCertificate(null);
    }
  };

  const deleteSavedCertificate = (id: string) => {
    if (window.confirm('Bu sertifikayı silmek istediğinizden emin misiniz?')) {
      const updatedCertificates = savedCertificates.filter(cert => cert.id !== id);
      saveCertificates(updatedCertificates);
    }
  };

  const loadSavedCertificate = (certificate: Certificate) => {
    setCurrentCertificate(certificate);
    setShowSavedModal(false);
  };

  const clearForm = () => {
    setCurrentCertificate({
      id: `cert-${Date.now()}`,
      participantName: '',
      companyName: '',
      trainingTitle: '',
      trainingDate: new Date().toISOString().split('T')[0],
      certificateNumber: generateCertificateNumber(),
      issuerName: 'MEMDUH AYKUT ÜNAL',
      issuerTitle: 'ZİRAAT MÜHENDİSİ'
    });
    setCompanyLogo(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Eğitim Sertifikası Modülü</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowSavedModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            disabled={savedCertificates.length === 0}
          >
            <FileText className="h-5 w-5" />
            <span>Kaydedilmiş Sertifikalar</span>
          </button>
          <button
            onClick={() => setShowBatchModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <Users className="h-5 w-5" />
            <span>Toplu Sertifika</span>
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

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex border-b border-gray-200">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'single' 
                ? 'text-pest-green-600 border-b-2 border-pest-green-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('single')}
          >
            Tekil Sertifika
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'batch' 
                ? 'text-pest-green-600 border-b-2 border-pest-green-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('batch')}
          >
            Toplu Sertifikalar
          </button>
        </div>
      </div>

      {activeTab === 'single' && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Certificate Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Award className="h-6 w-6 text-pest-green-600 mr-2" />
              Sertifika Bilgileri
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Katılımcı Adı *
                </label>
                <input
                  type="text"
                  name="participantName"
                  value={currentCertificate.participantName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pest-green-500"
                  placeholder="Katılımcının adı ve soyadı"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şirket Adı *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={currentCertificate.companyName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pest-green-500"
                  placeholder="Eğitimin gerçekleştirildiği şirket"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Eğitim Başlığı *
                </label>
                <input
                  type="text"
                  name="trainingTitle"
                  value={currentCertificate.trainingTitle}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pest-green-500"
                  placeholder="Eğitimin konusu"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Eğitim Tarihi *
                </label>
                <input
                  type="date"
                  name="trainingDate"
                  value={currentCertificate.trainingDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pest-green-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sertifika Numarası
                </label>
                <div className="flex">
                  <input
                    type="text"
                    name="certificateNumber"
                    value={currentCertificate.certificateNumber}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-pest-green-500"
                    placeholder="Otomatik oluşturulur"
                    readOnly
                  />
                  <button
                    onClick={() => setCurrentCertificate({
                      ...currentCertificate,
                      certificateNumber: generateCertificateNumber()
                    })}
                    className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r-md hover:bg-gray-300"
                    title="Yeni numara oluştur"
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İmzalayan Adı
                </label>
                <input
                  type="text"
                  name="issuerName"
                  value={currentCertificate.issuerName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pest-green-500"
                  placeholder="Sertifikayı imzalayan kişi"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İmzalayan Ünvanı
                </label>
                <input
                  type="text"
                  name="issuerTitle"
                  value={currentCertificate.issuerTitle}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pest-green-500"
                  placeholder="İmzalayan kişinin ünvanı"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  {companyLogo && (
                    <div className="ml-4 relative">
                      <img src={companyLogo} alt="Logo" className="h-10 object-contain" />
                      <button
                        onClick={() => setCompanyLogo(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={clearForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <X className="h-5 w-5" />
                  <span>Temizle</span>
                </button>
                <button
                  onClick={generateCertificate}
                  disabled={loading || !currentCertificate.participantName || !currentCertificate.companyName || !currentCertificate.trainingTitle}
                  className="flex-1 bg-pest-green-600 text-white px-4 py-2 rounded-md hover:bg-pest-green-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>İşleniyor...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5" />
                      <span>Sertifika Oluştur</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Certificate Preview */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <ImageIcon className="h-6 w-6 text-pest-green-600 mr-2" />
                Sertifika Önizleme
              </h2>
              
              <div 
                ref={certificateRef}
                className="border-4 border-green-800 rounded-lg p-8 bg-white relative"
                style={{ width: '210mm', height: '297mm' }} // A4 size
              >
                {/* Certificate Content */}
                <div className="border-2 border-green-800 h-full w-full p-8 flex flex-col items-center justify-between relative">
                  {/* Decorative Corner Elements */}
                  <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-green-800"></div>
                  <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-green-800"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-green-800"></div>
                  <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-green-800"></div>
                  
                  {/* Decorative Background Pattern */}
                  <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <div className="w-full h-full" style={{ 
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23166534\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")',
                      backgroundSize: '20px 20px'
                    }}></div>
                  </div>
                  
                  {/* Logo */}
                  <div className="text-center z-10 mt-4">
                    {companyLogo ? (
                      <img src={companyLogo} alt="Logo" className="h-24 object-contain mx-auto mb-4" />
                    ) : (
                      <img src="/pestmentor-logo-png-297x97.webp" alt="PestMentor Logo" className="h-24 object-contain mx-auto mb-4" />
                    )}
                  </div>
                  
                  {/* Title with decorative elements */}
                  <div className="text-center mb-4 z-10">
                    <div className="relative inline-block">
                      <h1 className="text-4xl font-bold text-green-800 mb-2 relative">
                        <span className="relative z-10">EĞİTİM SERTİFİKASI</span>
                        <span className="absolute -bottom-2 left-0 right-0 h-1 bg-green-800"></span>
                      </h1>
                    </div>
                    <p className="text-gray-700 mt-4">Bu belge</p>
                  </div>
                  
                  {/* Participant Name */}
                  <div className="text-center mb-4 z-10 flex-grow flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-green-800 mb-2 px-4 py-2 border-b border-t border-green-200">
                      {currentCertificate.participantName || 'KATILIMCI ADI'}
                    </h2>
                    <p className="text-gray-700 mt-4">adlı katılımcının, {formatDate(currentCertificate.trainingDate) || '01 Ocak 2025'} tarihinde</p>
                    <p className="text-gray-700 font-bold mt-2">
                      {currentCertificate.companyName || 'ŞİRKET ADI'} firmasında gerçekleştirilen
                    </p>
                    <p className="text-gray-700 font-bold mt-2 text-xl px-8 py-2 border-b border-green-200 inline-block">
                      "{currentCertificate.trainingTitle || 'EĞİTİM BAŞLIĞI'}"
                    </p>
                    <p className="text-gray-700 mt-4">
                      konulu eğitimi başarıyla tamamladığını belgelemektedir.
                    </p>
                  </div>
                  
                  {/* Decorative Award Icon */}
                  <div className="my-6 z-10">
                    <div className="w-20 h-20 mx-auto rounded-full bg-green-50 flex items-center justify-center border-2 border-green-800">
                      <Award className="h-12 w-12 text-green-800" />
                    </div>
                  </div>
                  
                  {/* Signature */}
                  <div className="flex justify-between w-full mt-8 z-10">
                    <div className="text-left">
                      <p className="text-gray-700 text-sm">Sertifika No: {currentCertificate.certificateNumber}</p>
                    </div>
                    <div className="text-right">
                      <div className="border-t border-gray-400 pt-2 w-48">
                        <p className="font-bold">{currentCertificate.issuerName}</p>
                        <p className="text-sm">{currentCertificate.issuerTitle}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="text-center w-full mt-6 z-10">
                    <p className="text-xs text-gray-500">
                      PestMentor © {new Date().getFullYear()} | Sistem İlaçlama San. ve Tic. Ltd. Şti. | www.pestmentor.com.tr
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'batch' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Users className="h-6 w-6 text-pest-green-600 mr-2" />
              Toplu Sertifikalar
            </h2>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowBatchModal(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Yeni Toplu Sertifika</span>
              </button>
              <button
                onClick={downloadAllCertificates}
                disabled={loading || certificates.length === 0}
                className="bg-pest-green-600 text-white px-4 py-2 rounded-md hover:bg-pest-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                <Download className="h-5 w-5" />
                <span>Tümünü İndir</span>
              </button>
            </div>
          </div>

          {certificates.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Henüz Sertifika Oluşturulmadı</h3>
              <p className="text-gray-500 mb-4">Toplu sertifika oluşturmak için "Yeni Toplu Sertifika" butonuna tıklayın.</p>
              <button
                onClick={() => setShowBatchModal(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors inline-flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Yeni Toplu Sertifika</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Katılımcı</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Şirket</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Eğitim</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sertifika No</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {certificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">{cert.participantName}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">{cert.companyName}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">{cert.trainingTitle}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">{formatDate(cert.trainingDate)}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">{cert.certificateNumber}</td>
                      <td className="py-4 px-4 text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => downloadBatchCertificate(cert)}
                            disabled={processingCertificate === cert.id}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                            title="İndir"
                          >
                            {processingCertificate === cert.id ? (
                              <Loader className="h-5 w-5 animate-spin" />
                            ) : (
                              <Download className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              const updatedCertificates = certificates.filter(c => c.id !== cert.id);
                              setCertificates(updatedCertificates);
                              // Also remove from saved certificates
                              const updatedSaved = savedCertificates.filter(c => c.id !== cert.id);
                              saveCertificates(updatedSaved);
                            }}
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
      )}

      {/* Hidden certificate for batch processing */}
      <div className="hidden">
        <div 
          ref={batchCertificateRef}
          className="border-4 border-green-800 rounded-lg p-8 bg-white relative"
          style={{ width: '210mm', height: '297mm' }} // A4 size
        >
          {/* Certificate Content */}
          <div className="border-2 border-green-800 h-full w-full p-8 flex flex-col items-center justify-between relative">
            {/* Decorative Corner Elements */}
            <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-green-800"></div>
            <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-green-800"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-green-800"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-green-800"></div>
            
            {/* Decorative Background Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="w-full h-full" style={{ 
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23166534\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")',
                backgroundSize: '20px 20px'
              }}></div>
            </div>
            
            {/* Logo */}
            <div className="text-center z-10 mt-4">
              {companyLogo ? (
                <img src={companyLogo} alt="Logo" className="h-24 object-contain mx-auto mb-4" />
              ) : (
                <img src="/pestmentor-logo-png-297x97.webp" alt="PestMentor Logo" className="h-24 object-contain mx-auto mb-4" />
              )}
            </div>
            
            {/* Title with decorative elements */}
            <div className="text-center mb-4 z-10">
              <div className="relative inline-block">
                <h1 className="text-4xl font-bold text-green-800 mb-2 relative">
                  <span className="relative z-10">EĞİTİM SERTİFİKASI</span>
                  <span className="absolute -bottom-2 left-0 right-0 h-1 bg-green-800"></span>
                </h1>
              </div>
              <p className="text-gray-700 mt-4">Bu belge</p>
            </div>
            
            {/* Participant Name */}
            <div className="text-center mb-4 z-10 flex-grow flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-green-800 mb-2 px-4 py-2 border-b border-t border-green-200">
                {currentCertificate.participantName || 'KATILIMCI ADI'}
              </h2>
              <p className="text-gray-700 mt-4">adlı katılımcının, {formatDate(currentCertificate.trainingDate) || '01 Ocak 2025'} tarihinde</p>
              <p className="text-gray-700 font-bold mt-2">
                {currentCertificate.companyName || 'ŞİRKET ADI'} firmasında gerçekleştirilen
              </p>
              <p className="text-gray-700 font-bold mt-2 text-xl px-8 py-2 border-b border-green-200 inline-block">
                "{currentCertificate.trainingTitle || 'EĞİTİM BAŞLIĞI'}"
              </p>
              <p className="text-gray-700 mt-4">
                konulu eğitimi başarıyla tamamladığını belgelemektedir.
              </p>
            </div>
            
            {/* Decorative Award Icon */}
            <div className="my-6 z-10">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-50 flex items-center justify-center border-2 border-green-800">
                <Award className="h-12 w-12 text-green-800" />
              </div>
            </div>
            
            {/* Signature */}
            <div className="flex justify-between w-full mt-8 z-10">
              <div className="text-left">
                <p className="text-gray-700 text-sm">Sertifika No: {currentCertificate.certificateNumber}</p>
              </div>
              <div className="text-right">
                <div className="border-t border-gray-400 pt-2 w-48">
                  <p className="font-bold">{currentCertificate.issuerName}</p>
                  <p className="text-sm">{currentCertificate.issuerTitle}</p>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="text-center w-full mt-6 z-10">
              <p className="text-xs text-gray-500">
                PestMentor © {new Date().getFullYear()} | Sistem İlaçlama San. ve Tic. Ltd. Şti. | www.pestmentor.com.tr
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Batch Certificate Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Toplu Sertifika Oluştur</h2>
              <button
                onClick={() => setShowBatchModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şirket Adı *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={currentCertificate.companyName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pest-green-500"
                  placeholder="Eğitimin gerçekleştirildiği şirket"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Eğitim Başlığı *
                </label>
                <input
                  type="text"
                  name="trainingTitle"
                  value={currentCertificate.trainingTitle}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pest-green-500"
                  placeholder="Eğitimin konusu"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Eğitim Tarihi *
                </label>
                <input
                  type="date"
                  name="trainingDate"
                  value={currentCertificate.trainingDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pest-green-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şirket Logosu
                </label>
                <div className="flex items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="batch-logo-upload"
                  />
                  <label
                    htmlFor="batch-logo-upload"
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200 transition-colors flex items-center"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Logo Yükle
                  </label>
                  {companyLogo && (
                    <div className="ml-4 relative">
                      <img src={companyLogo} alt="Logo" className="h-10 object-contain" />
                      <button
                        onClick={() => setCompanyLogo(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Katılımcı Listesi *
              </label>
              <p className="text-sm text-gray-500 mb-2">
                Her satıra bir katılımcı adı yazın. Her katılımcı için ayrı sertifika oluşturulacaktır.
              </p>
              <textarea
                value={batchParticipants}
                onChange={(e) => setBatchParticipants(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pest-green-500"
                rows={8}
                placeholder="Örnek:
Ahmet Yılmaz
Mehmet Demir
Ayşe Kaya"
                required
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowBatchModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={generateBatchCertificates}
                disabled={loading || !currentCertificate.companyName || !currentCertificate.trainingTitle || !batchParticipants.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>İşleniyor...</span>
                  </>
                ) : (
                  <>
                    <Users className="h-5 w-5" />
                    <span>Sertifikaları Oluştur</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Certificates Modal */}
      {showSavedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Kaydedilmiş Sertifikalar</h2>
              <button
                onClick={() => setShowSavedModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {savedCertificates.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Kaydedilmiş Sertifika Bulunamadı</h3>
                <p className="text-gray-500">Henüz hiç sertifika oluşturmadınız veya kaydetmediniz.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Katılımcı</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Şirket</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Eğitim</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sertifika No</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {savedCertificates.map((cert) => (
                      <tr key={cert.id} className="hover:bg-gray-50">
                        <td className="py-4 px-4 text-sm font-medium text-gray-900">{cert.participantName}</td>
                        <td className="py-4 px-4 text-sm text-gray-500">{cert.companyName}</td>
                        <td className="py-4 px-4 text-sm text-gray-500">{cert.trainingTitle}</td>
                        <td className="py-4 px-4 text-sm text-gray-500">{formatDate(cert.trainingDate)}</td>
                        <td className="py-4 px-4 text-sm text-gray-500">{cert.certificateNumber}</td>
                        <td className="py-4 px-4 text-sm font-medium">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => loadSavedCertificate(cert)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Düzenle"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => deleteSavedCertificate(cert.id)}
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
        </div>
      )}

      {/* Help Section */}
      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <AlertTriangle className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Sertifika Modülü Kullanımı</h3>
            <ul className="space-y-2 text-blue-700">
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2"></div>
                <span>Katılımcı bilgilerini, şirket adını ve eğitim detaylarını girin</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2"></div>
                <span>İsterseniz şirket logonuzu yükleyin</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2"></div>
                <span>Sertifika numarası otomatik oluşturulur, isterseniz yenileyebilirsiniz</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2"></div>
                <span>Toplu sertifika oluşturmak için "Toplu Sertifika" butonunu kullanın</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2"></div>
                <span>Oluşturulan tüm sertifikalar otomatik olarak kaydedilir</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2"></div>
                <span>Sertifikalar A4 boyutunda JPEG olarak indirilir</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
};

export default TrainingCertificatePage;