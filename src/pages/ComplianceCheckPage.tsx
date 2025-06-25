import React, { useState, useRef, useEffect } from 'react';
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
  Mail,
  Phone
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const ComplianceCheckPage = () => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    assessorCompany: 'PestMentor',
    assessorName: '',
    clientCompany: '',
    clientName: '',
    assessmentDate: new Date().toISOString().split('T')[0],
    propertyType: '',
    standard: 'BRC',
    notes: '',
    logoUrl: ''
  });

  // Compliance items state
  const [complianceItems, setComplianceItems] = useState<{
    [category: string]: {
      title: string;
      requirements: {
        id: string;
        text: string;
        compliant: boolean | null;
        notes: string;
      }[];
    };
  }>({
    'documentation': {
      title: 'Dokümantasyon',
      requirements: [
        { id: 'doc1', text: 'Zararlı mücadele prosedürü mevcut ve güncel', compliant: null, notes: '' },
        { id: 'doc2', text: 'Zararlı mücadele planı ve haritası mevcut', compliant: null, notes: '' },
        { id: 'doc3', text: 'Monitoring kayıtları düzenli tutuluyor', compliant: null, notes: '' },
        { id: 'doc4', text: 'Düzeltici eylem kayıtları mevcut', compliant: null, notes: '' },
        { id: 'doc5', text: 'Personel eğitim kayıtları mevcut', compliant: null, notes: '' }
      ]
    },
    'equipment': {
      title: 'Ekipman ve Malzemeler',
      requirements: [
        { id: 'eq1', text: 'Kemirgen istasyonları uygun yerleştirilmiş', compliant: null, notes: '' },
        { id: 'eq2', text: 'İstasyonlar numaralandırılmış ve etiketlenmiş', compliant: null, notes: '' },
        { id: 'eq3', text: 'Yapışkan tuzaklar uygun konumlandırılmış', compliant: null, notes: '' },
        { id: 'eq4', text: 'Feromon tuzakları uygun konumlandırılmış', compliant: null, notes: '' },
        { id: 'eq5', text: 'EFK cihazları uygun konumlandırılmış', compliant: null, notes: '' }
      ]
    },
    'procedures': {
      title: 'Operasyonel Prosedürler',
      requirements: [
        { id: 'proc1', text: 'Düzenli monitoring yapılıyor', compliant: null, notes: '' },
        { id: 'proc2', text: 'Trend analizi yapılıyor', compliant: null, notes: '' },
        { id: 'proc3', text: 'Düzeltici eylemler zamanında uygulanıyor', compliant: null, notes: '' },
        { id: 'proc4', text: 'Acil durum prosedürleri mevcut', compliant: null, notes: '' },
        { id: 'proc5', text: 'Tedarikçi değerlendirmesi yapılıyor', compliant: null, notes: '' }
      ]
    },
    'physical': {
      title: 'Fiziksel Önlemler',
      requirements: [
        { id: 'phys1', text: 'Kapı ve pencereler zararlı girişini önleyecek şekilde', compliant: null, notes: '' },
        { id: 'phys2', text: 'Drenaj sistemleri korumalı', compliant: null, notes: '' },
        { id: 'phys3', text: 'Duvar ve zemin birleşim yerleri uygun', compliant: null, notes: '' },
        { id: 'phys4', text: 'Dış alan düzenli ve temiz', compliant: null, notes: '' },
        { id: 'phys5', text: 'Atık alanları uygun yönetiliyor', compliant: null, notes: '' }
      ]
    },
    'training': {
      title: 'Eğitim ve Farkındalık',
      requirements: [
        { id: 'train1', text: 'Personel zararlı tanıma eğitimi almış', compliant: null, notes: '' },
        { id: 'train2', text: 'Personel zararlı bildirimi yapıyor', compliant: null, notes: '' },
        { id: 'train3', text: 'Yönetim zararlı kontrolünü destekliyor', compliant: null, notes: '' },
        { id: 'train4', text: 'Dış kaynaklı personel bilgilendiriliyor', compliant: null, notes: '' },
        { id: 'train5', text: 'Eğitimler düzenli tekrarlanıyor', compliant: null, notes: '' }
      ]
    }
  });

  // Additional notes state
  const [additionalNotes, setAdditionalNotes] = useState([
    { id: 'note1', text: 'Kemirgen aktivitesi depo alanında gözlemlendi. Acil müdahale gerekli.' },
    { id: 'note2', text: 'EFK cihazlarının bakım tarihi geçmiş, yenileme planlanmalı.' },
    { id: 'note3', text: 'Dış alan temizliği yetersiz, zararlı barınma riski mevcut.' }
  ]);

  // Recommendations state
  const [recommendations, setRecommendations] = useState([
    { id: 'rec1', text: 'Depo alanında kemirgen istasyonlarının sayısı artırılmalı.' },
    { id: 'rec2', text: 'EFK cihazlarının düzenli bakım programı oluşturulmalı.' },
    { id: 'rec3', text: 'Dış alan temizlik sıklığı artırılmalı ve düzenli kontrol edilmeli.' }
  ]);

  // Predefined requirements for quick add
  const predefinedRequirements = {
    'BRC': [
      'Zararlı mücadele prosedürü mevcut ve güncel',
      'Zararlı mücadele planı ve haritası mevcut',
      'Monitoring kayıtları düzenli tutuluyor',
      'Düzeltici eylem kayıtları mevcut',
      'Personel eğitim kayıtları mevcut',
      'Kemirgen istasyonları uygun yerleştirilmiş',
      'İstasyonlar numaralandırılmış ve etiketlenmiş',
      'Yapışkan tuzaklar uygun konumlandırılmış',
      'Feromon tuzakları uygun konumlandırılmış',
      'EFK cihazları uygun konumlandırılmış',
      'Düzenli monitoring yapılıyor',
      'Trend analizi yapılıyor',
      'Düzeltici eylemler zamanında uygulanıyor',
      'Acil durum prosedürleri mevcut',
      'Tedarikçi değerlendirmesi yapılıyor'
    ],
    'AIB': [
      'Dış alan zararlı kontrolü uygun',
      'Bina dış cephesi zararlı girişine karşı korumalı',
      'Kapı ve pencereler zararlı girişini önleyecek şekilde',
      'İç alan zararlı kontrolü uygun',
      'Depolama alanları zararlı barınmasına karşı korumalı',
      'Üretim alanları zararlı barınmasına karşı korumalı',
      'Zararlı mücadele programı yazılı ve güncel',
      'Zararlı mücadele hizmet sağlayıcı değerlendirmesi yapılmış',
      'Zararlı mücadele kimyasalları uygun depolanıyor',
      'Zararlı mücadele ekipmanları uygun durumda'
    ],
    'HACCP': [
      'Zararlı mücadelesi HACCP planına dahil edilmiş',
      'Zararlı mücadelesi kritik kontrol noktası olarak değerlendirilmiş',
      'Zararlı mücadelesi için kritik limitler belirlenmiş',
      'Zararlı mücadelesi için monitoring prosedürleri mevcut',
      'Zararlı mücadelesi için düzeltici eylemler tanımlanmış',
      'Zararlı mücadelesi için doğrulama prosedürleri mevcut',
      'Zararlı mücadelesi için kayıt tutma sistemi mevcut',
      'Zararlı mücadelesi için tehlike analizi yapılmış',
      'Zararlı mücadelesi için önkoşul programları tanımlanmış',
      'Zararlı mücadelesi için validasyon çalışmaları mevcut'
    ],
    'ISO 22000': [
      'Zararlı mücadelesi gıda güvenliği politikasına dahil edilmiş',
      'Zararlı mücadelesi için kaynaklar tahsis edilmiş',
      'Zararlı mücadelesi için roller ve sorumluluklar tanımlanmış',
      'Zararlı mücadelesi için iletişim prosedürleri mevcut',
      'Zararlı mücadelesi için acil durum hazırlığı mevcut',
      'Zararlı mücadelesi için ön gereksinim programları mevcut',
      'Zararlı mücadelesi için operasyonel ön gereksinim programları mevcut',
      'Zararlı mücadelesi için izleme ve ölçme sistemleri mevcut',
      'Zararlı mücadelesi için iç tetkik programı mevcut',
      'Zararlı mücadelesi için sürekli iyileştirme mekanizmaları mevcut'
    ]
  };

  // Predefined notes for quick add
  const predefinedNotes = [
    'Kemirgen aktivitesi depo alanında gözlemlendi. Acil müdahale gerekli.',
    'EFK cihazlarının bakım tarihi geçmiş, yenileme planlanmalı.',
    'Dış alan temizliği yetersiz, zararlı barınma riski mevcut.',
    'Personel zararlı farkındalığı düşük, eğitim planlanmalı.',
    'Monitoring kayıtları eksik, düzenli kayıt tutulmalı.',
    'Kapı altlarında boşluklar mevcut, kemirgen girişi riski var.',
    'Atık alanı yönetimi yetersiz, çekim sıklığı artırılmalı.',
    'Depo düzeni uygun değil, temizlik ve kontrol zorlaşıyor.',
    'Drenaj sistemleri korumasız, kemirgen girişi riski var.',
    'Dış aydınlatma böcek çekimine neden oluyor, değiştirilmeli.'
  ];

  // Predefined recommendations for quick add
  const predefinedRecommendations = [
    'Depo alanında kemirgen istasyonlarının sayısı artırılmalı.',
    'EFK cihazlarının düzenli bakım programı oluşturulmalı.',
    'Dış alan temizlik sıklığı artırılmalı ve düzenli kontrol edilmeli.',
    'Tüm personele zararlı tanıma ve bildirme eğitimi verilmeli.',
    'Monitoring kayıtları için dijital sistem kurulmalı.',
    'Kapı altlarındaki boşluklar fırça fitil ile kapatılmalı.',
    'Atık alanı için kapalı konteyner sistemi kurulmalı.',
    'Depo düzeni için 5S metodolojisi uygulanmalı.',
    'Drenaj sistemlerine kemirgen girişini önleyici ızgaralar takılmalı.',
    'Dış aydınlatma armatürleri böcek çekmeyen tipte değiştirilmeli.'
  ];

  // Calculate compliance score
  const calculateScore = () => {
    let totalItems = 0;
    let compliantItems = 0;

    Object.values(complianceItems).forEach(category => {
      category.requirements.forEach(req => {
        if (req.compliant !== null) {
          totalItems++;
          if (req.compliant) {
            compliantItems++;
          }
        }
      });
    });

    return totalItems > 0 ? Math.round((compliantItems / totalItems) * 100) : 0;
  };

  const score = calculateScore();

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle compliance item changes
  const handleComplianceChange = (category: string, id: string, field: 'compliant' | 'notes', value: any) => {
    setComplianceItems(prev => {
      const newItems = { ...prev };
      const reqIndex = newItems[category].requirements.findIndex(req => req.id === id);
      
      if (reqIndex !== -1) {
        newItems[category].requirements[reqIndex] = {
          ...newItems[category].requirements[reqIndex],
          [field]: value
        };
      }
      
      return newItems;
    });
  };

  // Add a new category
  const addCategory = () => {
    const newCategoryId = `category${Object.keys(complianceItems).length + 1}`;
    setComplianceItems(prev => ({
      ...prev,
      [newCategoryId]: {
        title: `Yeni Kategori ${Object.keys(prev).length + 1}`,
        requirements: []
      }
    }));
  };

  // Update category title
  const updateCategoryTitle = (categoryId: string, newTitle: string) => {
    setComplianceItems(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        title: newTitle
      }
    }));
  };

  // Add a new requirement to a category
  const addRequirement = (categoryId: string, text: string = '') => {
    setComplianceItems(prev => {
      const newItems = { ...prev };
      const newReqId = `${categoryId}_req${newItems[categoryId].requirements.length + 1}`;
      
      newItems[categoryId].requirements.push({
        id: newReqId,
        text: text || `Yeni gereksinim ${newItems[categoryId].requirements.length + 1}`,
        compliant: null,
        notes: ''
      });
      
      return newItems;
    });
  };

  // Remove a requirement
  const removeRequirement = (categoryId: string, reqId: string) => {
    setComplianceItems(prev => {
      const newItems = { ...prev };
      newItems[categoryId].requirements = newItems[categoryId].requirements.filter(req => req.id !== reqId);
      return newItems;
    });
  };

  // Remove a category
  const removeCategory = (categoryId: string) => {
    setComplianceItems(prev => {
      const newItems = { ...prev };
      delete newItems[categoryId];
      return newItems;
    });
  };

  // Add a new note
  const addNote = (text: string = '') => {
    setAdditionalNotes(prev => [
      ...prev,
      { id: `note${prev.length + 1}`, text: text || `Yeni not ${prev.length + 1}` }
    ]);
  };

  // Update a note
  const updateNote = (id: string, text: string) => {
    setAdditionalNotes(prev => 
      prev.map(note => note.id === id ? { ...note, text } : note)
    );
  };

  // Remove a note
  const removeNote = (id: string) => {
    setAdditionalNotes(prev => prev.filter(note => note.id !== id));
  };

  // Add a new recommendation
  const addRecommendation = (text: string = '') => {
    setRecommendations(prev => [
      ...prev,
      { id: `rec${prev.length + 1}`, text: text || `Yeni öneri ${prev.length + 1}` }
    ]);
  };

  // Update a recommendation
  const updateRecommendation = (id: string, text: string) => {
    setRecommendations(prev => 
      prev.map(rec => rec.id === id ? { ...rec, text } : rec)
    );
  };

  // Remove a recommendation
  const removeRecommendation = (id: string) => {
    setRecommendations(prev => prev.filter(rec => rec.id !== id));
  };

  // Add predefined requirements based on selected standard
  const addPredefinedRequirements = (categoryId: string, standard: string) => {
    if (predefinedRequirements[standard as keyof typeof predefinedRequirements]) {
      const requirements = predefinedRequirements[standard as keyof typeof predefinedRequirements];
      requirements.forEach(req => {
        addRequirement(categoryId, req);
      });
    }
  };

  // Add predefined note
  const addPredefinedNote = (text: string) => {
    addNote(text);
  };

  // Add predefined recommendation
  const addPredefinedRecommendation = (text: string) => {
    addRecommendation(text);
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
      // Get all report pages
      const reportPages = reportRef.current.querySelectorAll('.report-page');
      
      if (reportPages.length === 0) {
        throw new Error('No report pages found');
      }
      
      // Create PDF document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Process each page
      for (let i = 0; i < reportPages.length; i++) {
        const page = reportPages[i] as HTMLElement;
        
        // Add a new page for all pages except the first one
        if (i > 0) {
          pdf.addPage();
        }
        
        // Create canvas for this page
        const canvas = await html2canvas(page, {
          scale: 2,
          logging: false,
          useCORS: true,
          backgroundColor: '#ffffff'
        });
        
        // Get the image data
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        // Calculate dimensions to fit the page
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Add image to PDF
        pdf.addImage(imgData, 'JPEG', 0 , 20, imgWidth, imgHeight);
      }
      
      // Save the PDF
      pdf.save(`Uygunluk_Kontrol_${formData.clientCompany}_${formData.assessmentDate}.pdf`);
      
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('PDF oluşturulurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Generate JPEG images
  const generateJPEG = async () => {
    if (!reportRef.current) return;
    
    setLoading(true);
    
    try {
      // Get all report pages
      const reportPages = reportRef.current.querySelectorAll('.report-page');
      
      if (reportPages.length === 0) {
        throw new Error('No report pages found');
      }
      
      // Process each page
      for (let i = 0; i < reportPages.length; i++) {
        const page = reportPages[i] as HTMLElement;
        
        // Create canvas for this page
        const canvas = await html2canvas(page, {
          scale: 1,
          logging: false,
          useCORS: true,
          backgroundColor: '#ffffff'
        });
        
        // Get the image data
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        // Create a download link
        const link = document.createElement('a');
        link.href = imgData;
        link.download = `Uygunluk_Kontrol_${formData.clientCompany}_${formData.assessmentDate}_Sayfa_${i+1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Add a small delay between downloads to prevent browser issues
        if (i < reportPages.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
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
            <h2 className="text-xl font-bold text-gray-800 mb-4">Uygunluk Kontrol Formu</h2>
            
            {/* Company Information */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Denetleyen Firma
                </label>
                <input
                  type="text"
                  name="assessorCompany"
                  value={formData.assessorCompany}
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
                  name="assessorName"
                  value={formData.assessorName}
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
                  name="assessmentDate"
                  value={formData.assessmentDate}
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
                  Standart
                </label>
                <select
                  name="standard"
                  value={formData.standard}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="BRC">BRC</option>
                  <option value="AIB">AIB</option>
                  <option value="HACCP">HACCP</option>
                  <option value="ISO 22000">ISO 22000</option>
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

          {/* Categories and Requirements Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Kategoriler</h2>
              <button
                onClick={addCategory}
                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors text-sm"
              >
                + Kategori Ekle
              </button>
            </div>
            
            <div className="space-y-6">
              {Object.entries(complianceItems).map(([categoryId, category]) => (
                <div key={categoryId} className="border border-gray-200 rounded-md p-4">
                  <div className="flex justify-between items-center mb-3">
                    <input
                      type="text"
                      value={category.title}
                      onChange={(e) => updateCategoryTitle(categoryId, e.target.value)}
                      className="font-semibold text-gray-800 border-b border-dashed border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                    />
                    <button
                      onClick={() => removeCategory(categoryId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    {category.requirements.map((req) => (
                      <div key={req.id} className="flex items-start space-x-2">
                        <div className="flex space-x-2 mt-1">
                          <button
                            onClick={() => handleComplianceChange(categoryId, req.id, 'compliant', true)}
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              req.compliant === true ? 'bg-green-500 text-white' : 'bg-gray-200'
                            }`}
                          >
                            <CheckCircle size={14} />
                          </button>
                          <button
                            onClick={() => handleComplianceChange(categoryId, req.id, 'compliant', false)}
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              req.compliant === false ? 'bg-red-500 text-white' : 'bg-gray-200'
                            }`}
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={req.text}
                            onChange={(e) => {
                              const newReqs = [...category.requirements];
                              const index = newReqs.findIndex(r => r.id === req.id);
                              newReqs[index] = { ...newReqs[index], text: e.target.value };
                              setComplianceItems(prev => ({
                                ...prev,
                                [categoryId]: { ...prev[categoryId], requirements: newReqs }
                              }));
                            }}
                            className="w-full text-sm text-gray-700 border-b border-dashed border-gray-200 focus:outline-none focus:border-blue-500"
                          />
                          <input
                            type="text"
                            value={req.notes}
                            onChange={(e) => handleComplianceChange(categoryId, req.id, 'notes', e.target.value)}
                            placeholder="Not ekle..."
                            className="w-full text-xs text-gray-500 mt-1 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <button
                          onClick={() => removeRequirement(categoryId, req.id)}
                          className="text-red-500 hover:text-red-700 mt-1"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => addRequirement(categoryId)}
                      className="text-sm text-blue-500 hover:text-blue-700"
                    >
                      + Gereksinim Ekle
                    </button>
                    <div className="relative group">
                      <button
                        className="text-sm text-green-500 hover:text-green-700"
                      >
                        + Hazır Gereksinimler
                      </button>
                      <div className="absolute left-0 mt-2 w-64 bg-white shadow-lg rounded-md p-2 hidden group-hover:block z-10">
                        <div className="text-xs font-semibold text-gray-700 mb-1">Standart Seçin:</div>
                        {Object.keys(predefinedRequirements).map(standard => (
                          <button
                            key={standard}
                            onClick={() => addPredefinedRequirements(categoryId, standard)}
                            className="block w-full text-left text-xs py-1 px-2 hover:bg-gray-100 rounded"
                          >
                            {standard} Gereksinimleri
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Notes Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Ek Notlar</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => addNote()}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors text-sm"
                >
                  + Not Ekle
                </button>
                <div className="relative group">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors text-sm"
                  >
                    + Hazır Notlar
                  </button>
                  <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md p-2 hidden group-hover:block z-10 max-h-60 overflow-y-auto">
                    {predefinedNotes.map((note, index) => (
                      <button
                        key={index}
                        onClick={() => addPredefinedNote(note)}
                        className="block w-full text-left text-xs py-1 px-2 hover:bg-gray-100 rounded"
                      >
                        {note}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {additionalNotes.map((note) => (
                <div key={note.id} className="flex items-start space-x-2">
                  <div className="flex-1">
                    <textarea
                      value={note.text}
                      onChange={(e) => updateNote(note.id, e.target.value)}
                      className="w-full text-sm text-gray-700 border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      rows={2}
                    />
                  </div>
                  <button
                    onClick={() => removeNote(note.id)}
                    className="text-red-500 hover:text-red-700 mt-2"
                  >
                    <X size={16} />
                  </button>
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
                  <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md p-2 hidden group-hover:block z-10 max-h-60 overflow-y-auto">
                    {predefinedRecommendations.map((rec, index) => (
                      <button
                        key={index}
                        onClick={() => addPredefinedRecommendation(rec)}
                        className="block w-full text-left text-xs py-1 px-2 hover:bg-gray-100 rounded"
                      >
                        {rec}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div key={rec.id} className="flex items-start space-x-2">
                  <div className="flex-1">
                    <textarea
                      value={rec.text}
                      onChange={(e) => updateRecommendation(rec.id, e.target.value)}
                      className="w-full text-sm text-gray-700 border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      rows={2}
                    />
                  </div>
                  <button
                    onClick={() => removeRecommendation(rec.id)}
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
                    <Download className="mr-2" size={18} />
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
              className="bg-white border border-gray-200 rounded-lg p-12 max-w-4xl mx-auto"
              style={{ minHeight: '297mm', width: '210mm' }}
            >
              {/* Report Header - Page 1 */}
              <div className="report-page">
                {/* Report Header */}
                <div className="flex justify-between items-center mb-8 border-b pb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Zararlı Mücadelesi Uygunluk Kontrol Raporu</h1>
                    <p className="text-gray-600 mt-1">{formData.standard} Standardı</p>
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
                          <p>{formData.assessorCompany}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <User className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium">Denetçi:</p>
                          <p>{formData.assessorName || 'Belirtilmemiş'}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium">Tarih:</p>
                          <p>{new Date(formData.assessmentDate).toLocaleDateString('tr-TR')}</p>
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

                {/* Compliance Score */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">Uygunluk Skoru</h3>
                  <div className="flex items-center">
                    <div className="w-24 h-24 rounded-full flex items-center justify-center border-8 border-gray-200 relative">
                      <div 
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `conic-gradient(${
                            score >= 90 ? '#10B981' : 
                            score >= 70 ? '#3B82F6' : 
                            score >= 50 ? '#F59E0B' : 
                            '#EF4444'
                          } ${score}%, transparent 0)`,
                          clipPath: 'circle(50%)'
                        }}
                      ></div>
                      <span className="text-2xl font-bold relative z-10">{score}%</span>
                    </div>
                    <div className="ml-6">
                      <p className="font-medium">Değerlendirme:</p>
                      <p className={`font-semibold ${
                        score >= 90 ? 'text-green-600' : 
                        score >= 70 ? 'text-blue-600' : 
                        score >= 50 ? 'text-amber-600' : 
                        'text-red-600'
                      }`}>
                        {
                          score >= 90 ? 'Mükemmel' : 
                          score >= 70 ? 'İyi' : 
                          score >= 50 ? 'Geliştirilmeli' : 
                          'Yetersiz'
                        }
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formData.standard} standardına göre değerlendirilmiştir.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compliance Items - Page 2 */}
              <div className="report-page">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">Uygunluk Değerlendirmesi</h3>
                
                <div className="space-y-6">
                  {Object.entries(complianceItems).map(([categoryId, category]) => (
                    <div key={categoryId}>
                      <h4 className="font-medium text-gray-800 mb-2">{category.title}</h4>
                      <div className="space-y-2">
                        {category.requirements.map((req) => (
                          <div key={req.id} className="flex items-start border-b border-gray-100 pb-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                              req.compliant === true ? 'bg-green-500 text-white' : 
                              req.compliant === false ? 'bg-red-500 text-white' : 
                              'bg-gray-200'
                            }`}>
                              {req.compliant === true ? (
                                <CheckCircle size={14} />
                              ) : req.compliant === false ? (
                                <X size={14} />
                              ) : (
                                <span className="text-xs">?</span>
                              )}
                            </div>
                            <div className="ml-3 flex-1">
                              <p className="text-sm">{req.text}</p>
                              {req.notes && (
                                <p className="text-xs text-gray-500 mt-1">Not: {req.notes}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Notes and Recommendations - Page 3 */}
              <div className="report-page">
                {/* Additional Notes */}
                {additionalNotes.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">Ek Notlar</h3>
                    <div className="bg-amber-50 p-4 rounded-md">
                      <ul className="list-disc list-inside space-y-2">
                        {additionalNotes.map((note) => (
                          <li key={note.id} className="text-sm text-amber-800">{note.text}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {recommendations.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">Öneriler</h3>
                    <div className="bg-blue-50 p-4 rounded-md">
                      <ul className="list-disc list-inside space-y-2">
                        {recommendations.map((rec) => (
                          <li key={rec.id} className="text-sm text-blue-800">{rec.text}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Summary */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">Özet</h3>
                  <p className="text-sm text-gray-700">
                    Bu rapor, {formData.clientCompany || 'müşteri'} firmasının {formData.standard} standardına göre zararlı mücadele uygunluğunu değerlendirmektedir. 
                    Genel uygunluk skoru <strong>{score}%</strong> olarak hesaplanmıştır, bu da 
                    <strong> {
                      score >= 90 ? 'mükemmel' : 
                      score >= 70 ? 'iyi' : 
                      score >= 50 ? 'geliştirilmeli' : 
                      'yetersiz'
                    }</strong> seviyesine karşılık gelmektedir. 
                    {score < 70 ? ' Önerilen iyileştirmelerin yapılması durumunda uygunluk seviyesinin artacağı değerlendirilmektedir.' : 
                     score < 90 ? ' Mevcut uygunluk seviyesinin korunması ve önerilen iyileştirmelerin yapılması önerilmektedir.' : 
                     ' Mevcut uygunluk seviyesinin korunması önerilmektedir.'}
                  </p>
                </div>

                {/* Footer */}
                <div className="border-t pt-4 text-sm text-gray-500 flex justify-between">
                  <div>
                    <p>Rapor Tarihi: {new Date().toLocaleDateString('tr-TR')}</p>
                    <p>Denetleyen: {formData.assessorName || 'Belirtilmemiş'}</p>
                  </div>
                  <div className="text-right">
                    <p>{formData.assessorCompany}</p>
                    <p>www.pestmentor.com.tr</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="mt-12 bg-blue-600 rounded-lg p-8 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Profesyonel Uygunluk Denetimi İster misiniz?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Uzman ekibimiz, tesislerinizin uluslararası standartlara uygunluğunu değerlendirmek için yanınızda.
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

export default ComplianceCheckPage;