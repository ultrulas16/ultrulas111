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
  Camera,
  Plus,
  Trash2,
  Mail,
  Phone,
  Image,
  Target,
  Search,
  Filter,
  Edit,
  Copy,
  ChevronDown
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface RiskAction {
  id: string;
  risk: string;
  detectionMethod: string;
  criticalLimit: string;
  responsible: string;
  action: string;
  documentation: string;
}

const RiskActionPlanPage = () => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showPredefinedActions, setShowPredefinedActions] = useState(false);
  const predefinedActionsRef = useRef<HTMLDivElement>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    assessorCompany: 'PestMentor',
    assessorName: '',
    clientCompany: '',
    clientName: '',
    assessmentDate: new Date().toISOString().split('T')[0],
    propertyType: '',
    nextAssessmentDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    logoUrl: ''
  });

  // Risk actions state
  const [riskActions, setRiskActions] = useState<RiskAction[]>([
    {
      id: 'risk1',
      risk: 'Dış alanda kemirgen aktivitesi',
      detectionMethod: 'Kemirgen yem istesyonlarının ayda 2 kez kontrolü',
      criticalLimit: 'Aynı istasyonda ayda 2 kez yapılan kontrollerin herbirinde tüketim görülmesi',
      responsible: 'SİSTEM İLAÇLAMA---FEYZ GIDA',
      action: '1-Aktif yuvaların bulunması ve kaynağın tespit edilmesi\n2-Üst üste 3 gün takip edillip, aktivite yoksa rutine geçilmesi\n3-Soruna bağlı olarak çevrenin yönetilmesi\n4-İstasyonlarda revizyona gidilmesi(aktif istasyonun sağına ve soluna ilave)\n5-İşletmeye en yakın noktalarda yalıtımın gözden geçirilmesi.',
      documentation: 'Faaliyet raporu----Risk analiz raporu'
    },
    {
      id: 'risk2',
      risk: 'Dış alanda kemirgen istilası',
      detectionMethod: 'Kemirgen yem istesyonlarının haftalık kontrolü ve GMP denetimi',
      criticalLimit: 'Bir kontrolde toplam yem istasyonlarının %25\'inde tüketim tespit edilmesi',
      responsible: 'SİSTEM İLAÇLAMA---FEYZ GIDA',
      action: '1-Sorunun kaynağının tespiti\n2-Aktivite normale dönene kadar bir hafta boyunca hergün kontrol yapılması\n3-Soruna bağlı olarak çevrenin yönetilmesi\n4-İstasyon yerleşiminde revizyona gidilmesi\n5-İşletmenin kemirgen açısından topyekün kontrolü\n6-Personelin uyarılması ve bilgilendirilmesi',
      documentation: 'Faaliyet raporu----Risk analiz raporu'
    }
  ]);

  // Predefined risk actions for quick add
  const predefinedRiskActions = [
    {
      risk: 'Dış alanda kemirgen aktivitesi',
      detectionMethod: 'Kemirgen yem istesyonlarının ayda 2 kez kontrolü',
      criticalLimit: 'Aynı istasyonda ayda 2 kez yapılan kontrollerin herbirinde tüketim görülmesi',
      responsible: 'SİSTEM İLAÇLAMA---FEYZ GIDA',
      action: '1-Aktif yuvaların bulunması ve kaynağın tespit edilmesi\n2-Üst üste 3 gün takip edillip, aktivite yoksa rutine geçilmesi\n3-Soruna bağlı olarak çevrenin yönetilmesi\n4-İstasyonlarda revizyona gidilmesi(aktif istasyonun sağına ve soluna ilave)\n5-İşletmeye en yakın noktalarda yalıtımın gözden geçirilmesi.',
      documentation: 'Faaliyet raporu----Risk analiz raporu'
    },
    {
      risk: 'Dış alanda kemirgen istilası',
      detectionMethod: 'Kemirgen yem istesyonlarının haftalık kontrolü ve GMP denetimi',
      criticalLimit: 'Bir kontrolde toplam yem istasyonlarının %25\'inde tüketim tespit edilmesi',
      responsible: 'SİSTEM İLAÇLAMA---FEYZ GIDA',
      action: '1-Sorunun kaynağının tespiti\n2-Aktivite normale dönene kadar bir hafta boyunca hergün kontrol yapılması\n3-Soruna bağlı olarak çevrenin yönetilmesi\n4-İstasyon yerleşiminde revizyona gidilmesi\n5-İşletmenin kemirgen açısından topyekün kontrolü\n6-Personelin uyarılması ve bilgilendirilmesi',
      documentation: 'Faaliyet raporu----Risk analiz raporu'
    },
    {
      risk: 'İşletme üzerinde kuş yuvası',
      detectionMethod: 'Haftalık dış saha gözlemleri ve aylık GMP denetimleri, personel geri bildirimleri',
      criticalLimit: '1 adet kuş yuvası',
      responsible: 'SİSTEM İLAÇLAMA---FEYZ GIDA',
      action: '1-Yapılan tespit sonrası 24 saat içerisinde yuvanın kaldırılması\n2-Yuvanın tekrar yapılmaması için bir hafta boyunca takip edilmesi\n3-Bölgenin yuva yapılamaz hale getirilmesi\n4-Dış çevrede kuşlar için çekici olabilecek unsurların bertarafı',
      documentation: 'Faaliyet raporu----Risk analiz raporu'
    },
    {
      risk: 'Dış alanda uçkun zararlı yoğunluğu',
      detectionMethod: 'Haftalık dış saha gözlemleri ve personel geri bildirimleri ve LFT sayımlarının dış alan gözlemleriyle örtüşmesi',
      criticalLimit: 'Dış kapı yakınlarındaki LFT cihazlarındaki yapışkan plakaların ölçümlerinin maximum düzeye ulaşması ve/veya bir hafta içerisinde tüm yüzeyin kaplanması',
      responsible: 'SİSTEM İLAÇLAMA---FEYZ GIDA',
      action: '1-Yoğunluğa neden olan ağırlıklı sinek türünün tespiti\n2-Kaynağın bulunması\n3-Popülasyon küçük sineklerden oluşuyorsa kanal içlerinin kontrolleri ve temizliklerinin yapılması\n4-Toksik olmayan yöntemlerle mevcut yoğunluğun eliminasyonu\n5-Sorun yaşanan noktada her vardiyada takibin yapılması\n6-Bölgedeki LFT cihazlarının etkinliklerinin test edilmesi',
      documentation: 'Faaliyet raporu----Risk analiz raporu'
    },
    {
      risk: 'Dış alanda kedi veya köpek aktivitesi',
      detectionMethod: 'Haftalık rutin gözlemlerve personel geri bildirimleri',
      criticalLimit: '1 adet kedi veya köpek varlığı',
      responsible: 'SİSTEM İLAÇLAMA---FEYZ GIDA',
      action: '1-Kedi veya köpek kapanlarının uygun noktalara kurulması, yakalanıp uzaklaştırılana kadar takibin devam etmesi\n2-Fabrika alanına giriş yerlerinin tespit edilmesi ve yalıtımın yapılması\n3-Yakalanıp uzaklaştırılan hayvanın bölgesinde 3 gün süre ile takip yapılması\n4-Uzaklaştırılan canlının dışkılarının temizlenmesi',
      documentation: 'Faaliyet raporu----Risk analiz raporu'
    },
    {
      risk: 'İç alanda kemirgen yakalanması',
      detectionMethod: 'Canlı yakalama kapanları ve haftalık kontroller ve personel geri bildirimleri',
      criticalLimit: 'canlı kapanlarda 1 adet yakalanma',
      responsible: 'SİSTEM İLAÇLAMA---FEYZ GIDA',
      action: '1-Türün tespitinin yapılması\n2-Kaynağın bulunması ve buna bağlı önlemlerin geliştirilmesi\n3-Peşpeşe 3 gün süre ile takip yapılması,yakalanma yok ise rutine dönülmesi\n4-Gerekli ise canlı kapan ve toksik olmayan yöntemlerin arttırlması\n5-Bölgede kirlenen yüzeylerin temizlik ve dezenfeksiyonun yapılması',
      documentation: 'Faaliyet raporu----Risk analiz raporu'
    },
    {
      risk: 'İç alanda kemirgen aktivitesi ve/veya buna bağlı bulgular',
      detectionMethod: 'Canlı yakalama kapanları ve haftalık kontroller ve GMP denetimleri ve personel geri bildirimleri',
      criticalLimit: 'en az 1 adet gözlem',
      responsible: 'SİSTEM İLAÇLAMA---FEYZ GIDA',
      action: '1-Canlı kemirgen yakalanana veya uzaklaştırılana kadar takiplerin devam etmesi\n2-Kemirgen türünün tespiti\n3-Sorunun kaynağının bulunması(gerekirse tedarikçi denetimi yapılmalı)\n4-Bu bilgilerle süratle ek önlemlerin alınması\n5-Yakalanma ve izlerin temizlenmesinden sonra 3 gün peşpeşe takip yapılıp,uygunsa rutine dönülmesi',
      documentation: 'Faaliyet raporu----Risk analiz raporu'
    },
    {
      risk: 'İç alanda kemirgen istilası',
      detectionMethod: 'Personel bildirimleri, Canlı yakalama kapanlarıve haftalık kontroller',
      criticalLimit: 'Aynı alanda 1\' den fazla gözlem, aynı alan canlı yakalamalarda 1\' den fazla kapanda yakalanma, rutin dışı emareler',
      responsible: 'SİSTEM İLAÇLAMA---FEYZ GIDA',
      action: '1-Tüm canlı yakalama kapanlarının kontrolü ve kontrolleri günlük periyotlara çekilmesi\n2-Tür tespitinin yapılması\n3-Kaynakların bölüm ve fabrika genelinde araştırılıp, berteraf edilmesi\n4-Kontaminasyonun araştırlması\n5-Ek önlemlerin alınması(ilave monitör,yapışkan plaka vb.)\n6-Dış alan kontrollerinin arttırılması.',
      documentation: 'Teknik inceleme raporu-Faaliyet raporu-Risk analiz raporu'
    },
    {
      risk: 'Üretim ve paketleme alanlarında sinek aktivitesi',
      detectionMethod: 'Haftalık kontroller,LFT cihazları,GMP denetimleri ve personel geri bildirimleri',
      criticalLimit: 'Bir ekipman çevrsinde dar bir alanda 5 adet sineğin varlığı',
      responsible: 'SİSTEM İLAÇLAMA---FEYZ GIDA',
      action: '1-Yoğunluğa neden olan ağırlıklı sinek türünün tespiti\n2-Kaynağın bulunması\n3-Popülasyon küçük sineklerden oluşuyorsa kanal içlerinin kontrolleri ve temizliklerinin yapılması\n4-Toksik olmayan yöntemlerle mevcut yoğunluğun eliminasyonu\n5-Sorun yaşanan noktada her vardiyada takibin yapılması\n6-Bölgedeki LFT cihazlarının etkinliklerinin test edilmesi',
      documentation: 'Faaliyet raporu----Risk analiz raporu'
    },
    {
      risk: 'Hassas noktalardaki LFT cihazlarında yakalanan sinek sayısındaki artış',
      detectionMethod: 'Ayda en az 2 kez LFT cihazlarının bakım ve ayda bir kez sayımlarının yapılması',
      criticalLimit: 'Haftalık sayımlarda cihaz başına yakalanm ortalamasının 150 den fazla olması',
      responsible: 'SİSTEM İLAÇLAMA---FEYZ GIDA',
      action: '1-Ağırlıklı sinek türünün tespitinin yapılması\n2-Yoğunluk nedeninin bulunması\n3-Bu bilgilere bağlı olarak ek önlemlerin alınması\n4-Gerekiyorsa LFT cihazlarında geçici artış yapılması\n5-Yalıtımla ilgili sorunlar varsa giderilmeli',
      documentation: 'Faaliyet raporu----Risk analiz raporu'
    },
    {
      risk: 'Üretim ve paketleme dışı alanlardaki LFT cihazlarında yakalanan sinek sayısındaki artış',
      detectionMethod: 'Ayda en az 2 kez LFT cihazlarının bakım ve ayda bir kez sayımlarının yapılması',
      criticalLimit: 'Haftalık sayımlarda cihaz başına yakalanm ortalamasının 250\' den fazla olması',
      responsible: 'SİSTEM İLAÇLAMA---FEYZ GIDA',
      action: '1-Ağırlıklı sinek türünün tespitinin yapılması\n2-Yoğunluk nedeninin bulunması\n3-Bu bilgilere bağlı olarak ek önlemlerin alınması\n4-Gerekiyorsa LFT cihazlarında geçici artış yapılması\n5-Yalıtımla ilgili sorunlar varsa giderilmeli',
      documentation: 'Faaliyet raporu----Risk analiz raporu'
    },
    {
      risk: 'Depo zararlısı aktivitesi',
      detectionMethod: 'Haftalık rutin kontroller,feromonlu tuzak kontrolleri,personel geri bildirimleri,hammadde alım gözlemleri',
      criticalLimit: 'Herhangi bir depo zararlısının 1 adet yakalanması veya gözlenmesi',
      responsible: 'SİSTEM İLAÇLAMA---FEYZ GIDA',
      action: '1-Depo zararlısının tür tespiti\n2-Türe bağlı önlemlerin değerlendirilmesi\n3-Tedarikçi ile irtibata geçerek destek alınmalı\n4-Sorun yaygın ise red, karantina gibi radikal önlemler alınmalı\n5-Sorun görülen alanda ve üründe bir hafta bıyunca hergün kontrol yapılmalı\n6-Rutin kontrole dönüldükten 21 gün sonra tekrar kontrol yapılmalıdır.',
      documentation: 'Faaliyet raporu----Risk analiz raporu'
    },
    {
      risk: 'Bina içerisinde kuş aktivitesi',
      detectionMethod: 'Haftalık kontroller ve personel geri bildirimleri',
      criticalLimit: '1 adet kuş aktivitesi',
      responsible: 'SİSTEM İLAÇLAMA---FEYZ GIDA',
      action: '1-Kuş yakalanana veya dışarı çıkartılana kadar takiplerin devam etmesi\n2-Kuşun içeride yaptığı kirliliklerin giderilmesi\n3-Henüz tespit edilmeyen giriş noktalarının tespitinin yapılması, sabah erken saatlerde ve günün değişik zamanlarında tekrar kontrollerin yapılması\n4-Sorun yaşanan alanın dış çevresinde kuş kontrol önlemlerinin değerlendirilmesi.',
      documentation: 'Faaliyet raporu----Risk analiz raporu'
    },
    {
      risk: 'İşletme içerisinde herhangi bir yerde hamam böceği aktivitesi veya yakalanması',
      detectionMethod: 'Haftalık kontroller,böcek trapları,canlı kapanlar,GMP denetimleri,personel geri bildirimleri',
      criticalLimit: '1 adet hamamböceği',
      responsible: 'SİSTEM İLAÇLAMA---FEYZ GIDA',
      action: '1-Tür tespitinin yapılması\n2-Kaynağın bulunması\n3-Peşpeşe 3 gün yeni bir yakalanma olup olmadığının izlenmesi, sonuç olumlu ise rutine geçilmesi\n4-Gerekiyorsa canlı kapan ve toksik olmayan yöntemlerin sayısının arttrılması\n5-Zorunlu ise üretim dışı bir zamanda uygulama yapılması\n6-Taşınma olasılığına karşı personel dolaplarında örnekleme ile gıda kontrolü yapılması',
      documentation: 'Faaliyet raporu----Risk analiz raporu'
    },
    {
      risk: 'Bulaşıcı hastalık etmeni zararlıların varlığı',
      detectionMethod: 'Haftalık rutin gözlemler',
      criticalLimit: '1 ADET',
      responsible: 'SİSTEM İLAÇLAMA---FEYZ GIDA',
      action: '1-Türün tespiti\n2-Fabrika yönetimi ile birlikte alınabilecek en geniş önlemin alınması\n3-Saptanan kontrol yöntemlerin öncelikle hayata geçirilmesi\n4-Konu ile ilgili işyeri hekiminin bilgilendirilmsi.',
      documentation: 'Faaliyet raporu----Risk analiz raporu'
    }
  ];

  // Document options
  const documentOptions = [
    'Faaliyet raporu',
    'Risk analiz raporu',
    'Değerlendirme raporu',
    'Teknik inceleme raporu',
    'Faaliyet raporu----Risk analiz raporu',
    'Teknik inceleme raporu-Faaliyet raporu-Risk analiz raporu'
  ];

  // Responsible party options
  const responsibleOptions = [
    'SİSTEM İLAÇLAMA',
    'MÜŞTERİ',
    'SİSTEM İLAÇLAMA---MÜŞTERİ'
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (predefinedActionsRef.current && !predefinedActionsRef.current.contains(event.target as Node)) {
        setShowPredefinedActions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  // Add a new risk action
  const addRiskAction = (predefinedAction?: typeof predefinedRiskActions[0]) => {
    const newRiskAction = {
      id: `risk${riskActions.length + 1}`,
      risk: predefinedAction?.risk || '',
      detectionMethod: predefinedAction?.detectionMethod || '',
      criticalLimit: predefinedAction?.criticalLimit || '',
      responsible: predefinedAction?.responsible || 'SİSTEM İLAÇLAMA',
      action: predefinedAction?.action || '',
      documentation: predefinedAction?.documentation || 'Faaliyet raporu'
    };
    
    setRiskActions(prev => [...prev, newRiskAction]);
    setShowPredefinedActions(false);
  };

  // Update a risk action
  const updateRiskAction = (id: string, field: keyof RiskAction, value: string) => {
    setRiskActions(prev => 
      prev.map(action => action.id === id ? { ...action, [field]: value } : action)
    );
  };

  // Remove a risk action
  const removeRiskAction = (id: string) => {
    setRiskActions(prev => prev.filter(action => action.id !== id));
  };

  // Generate PDF report with proper scaling and pagination
  const generatePDF = async () => {
    if (!reportRef.current) return;
    
    setLoading(true);
    
    try {
      // Create a PDF with landscape orientation
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      // A4 landscape dimensions
      const pdfWidth = 297;
      const pdfHeight = 210;
      
      // Get the element to be captured
      const element = reportRef.current;
      
      // Calculate the number of pages needed based on the element's height
      const elementHeight = element.scrollHeight;
      const elementWidth = element.scrollWidth;
      const pageRatio = pdfWidth / pdfHeight;
      const elementRatio = elementWidth / elementHeight;
      
      // Calculate how many pages we need
      const pagesNeeded = Math.ceil(elementHeight / (elementWidth / pageRatio));
      
      // For each page, capture a portion of the element
      for (let i = 0; i < pagesNeeded; i++) {
        // If not the first page, add a new page
        if (i > 0) {
          pdf.addPage();
        }
        
        // Calculate the portion of the element to capture for this page
        const sourceY = i * (elementHeight / pagesNeeded);
        const sourceHeight = elementHeight / pagesNeeded;
        
        // Create a canvas for this portion
        const canvas = await html2canvas(element, {
          scale: 2, // Higher scale for better quality
          logging: false,
          useCORS: true,
          backgroundColor: '#ffffff',
          x: 0,
          y: sourceY,
          width: elementWidth,
          height: sourceHeight,
          windowHeight: sourceHeight
        });
        
        // Add the image to the PDF
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      }
      
      // Save the PDF
      pdf.save(`Risk_Aksiyon_Planı_${formData.clientCompany}_${formData.assessmentDate}.pdf`);
      
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('PDF oluşturulurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Generate JPEG images for each page
  const generateJPEG = async () => {
    if (!reportRef.current) return;
    
    setLoading(true);
    
    try {
      // Get the element to be captured
      const element = reportRef.current;
      
      // Calculate the number of pages needed based on the element's height
      const elementHeight = element.scrollHeight;
      const elementWidth = element.scrollWidth;
      
      // A4 landscape dimensions (in pixels at 96 DPI)
      const a4Width = 1123; // 297mm at 96 DPI
      const a4Height = 794; // 210mm at 96 DPI
      
      // Calculate how many pages we need
      const pagesNeeded = Math.ceil(elementHeight / a4Height);
      
      // For each page, capture a portion of the element
      for (let i = 0; i < pagesNeeded; i++) {
        // Calculate the portion of the element to capture for this page
        const sourceY = i * a4Height;
        const sourceHeight = Math.min(a4Height, elementHeight - sourceY);
        
        // Create a canvas for this portion
        const canvas = await html2canvas(element, {
          scale: 1, // Higher scale for better quality
          logging: false,
          useCORS: true,
          backgroundColor: '#ffffff',
          x: 0,
          y: sourceY,
          width: elementWidth,
          height: sourceHeight,
          windowHeight: sourceHeight
        });
        
        // Get the image data
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        // Create a download link
        const link = document.createElement('a');
        link.href = imgData;
        link.download = `Risk_Aksiyon_Planı_${formData.clientCompany}_${formData.assessmentDate}_Sayfa${i+1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Add a small delay between downloads to prevent browser issues
        await new Promise(resolve => setTimeout(resolve, 500));
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Risk Değerlendirmesi - Eylem ve Aksiyon Planı</h1>
        <div className="flex space-x-4">
          <button
            onClick={generatePDF}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Download className="h-5 w-5" />
            <span>PDF İndir</span>
          </button>
          <button
            onClick={generateJPEG}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Image className="h-5 w-5" />
            <span>JPEG İndir</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <ClipboardList className="h-6 w-6 text-blue-600 mr-2" />
              Rapor Bilgileri
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Değerlendirmeyi Yapan Firma
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
                  Değerlendirmeyi Yapan Kişi
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
                  Değerlendirme Tarihi
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
                  Sonraki Değerlendirme Tarihi
                </label>
                <input
                  type="date"
                  name="nextAssessmentDate"
                  value={formData.nextAssessmentDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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

          {/* Risk Actions Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Target className="h-6 w-6 text-blue-600 mr-2" />
                Risk Aksiyonları
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => addRiskAction()}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors text-sm"
                >
                  + Aksiyon Ekle
                </button>
                <div className="relative" ref={predefinedActionsRef}>
                  <button
                    onClick={() => setShowPredefinedActions(!showPredefinedActions)}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors text-sm flex items-center"
                  >
                    <span>+ Hazır Aksiyonlar</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </button>
                  {showPredefinedActions && (
                    <div className="absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-md p-2 z-10 max-h-96 overflow-y-auto">
                      {predefinedRiskActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => addRiskAction(action)}
                          className="block w-full text-left text-xs py-2 px-2 hover:bg-gray-100 rounded border-b border-gray-100"
                        >
                          <div className="font-medium">{action.risk}</div>
                          <div className="text-gray-600 truncate">{action.detectionMethod}</div>
                          <div className="text-gray-600 truncate">{action.criticalLimit}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {riskActions.map((action) => (
                <div key={action.id} className="border border-gray-200 rounded-md p-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Risk
                      </label>
                      <input
                        type="text"
                        value={action.risk}
                        onChange={(e) => updateRiskAction(action.id, 'risk', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Örn: Dış alanda kemirgen aktivitesi"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Tespit Yöntemi
                      </label>
                      <input
                        type="text"
                        value={action.detectionMethod}
                        onChange={(e) => updateRiskAction(action.id, 'detectionMethod', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Örn: Kemirgen yem istasyonlarının ayda 2 kez kontrolü"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Kritik Limit
                      </label>
                      <input
                        type="text"
                        value={action.criticalLimit}
                        onChange={(e) => updateRiskAction(action.id, 'criticalLimit', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Örn: Aynı istasyonda ayda 2 kez tüketim görülmesi"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Sorumlu
                      </label>
                      <select
                        value={action.responsible}
                        onChange={(e) => updateRiskAction(action.id, 'responsible', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        {responsibleOptions.map((option, index) => (
                          <option key={index} value={option}>{option}</option>
                        ))}
                        <option value={formData.clientCompany}>{formData.clientCompany}</option>
                        <option value={`${formData.assessorCompany}---${formData.clientCompany}`}>
                          {`${formData.assessorCompany}---${formData.clientCompany}`}
                        </option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Aksiyon
                      </label>
                      <textarea
                        value={action.action}
                        onChange={(e) => updateRiskAction(action.id, 'action', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Alınacak aksiyonları yazın (her madde yeni satırda olmalı)"
                        rows={5}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Her maddeyi yeni satıra yazın. Örn: 1-Birinci madde, 2-İkinci madde
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Evrak
                      </label>
                      <select
                        value={action.documentation}
                        onChange={(e) => updateRiskAction(action.id, 'documentation', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        {documentOptions.map((option, index) => (
                          <option key={index} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => removeRiskAction(action.id)}
                      className="text-red-500 hover:text-red-700 text-sm flex items-center"
                    >
                      <Trash2 size={14} className="mr-1" />
                      Sil
                    </button>
                  </div>
                </div>
              ))}

              {riskActions.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Henüz risk aksiyonu eklenmemiş.</p>
                  <button
                    onClick={() => addRiskAction()}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm"
                  >
                    Risk Aksiyonu Ekle
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Success Message */}
          {showSuccessMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Rapor başarıyla oluşturuldu!</span>
              </div>
            </div>
          )}
        </div>

        {/* Report Preview */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FileText className="h-6 w-6 text-blue-600 mr-2" />
              Rapor Önizleme
            </h2>
            
            <div 
              ref={reportRef}
              className="border border-gray-300 rounded-lg p-8 bg-white"
              style={{ width: '297mm', height: 'auto', minHeight: '210mm' }} // A4 landscape
            >
              {/* Report Header */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-300">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">RİSK DEĞERLENDİRMESİ - EYLEM VE AKSİYON PLANI</h1>
                  <p className="text-gray-600 mt-1">Değerlendirme Tarihi: {new Date(formData.assessmentDate).toLocaleDateString('tr-TR')}</p>
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
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">Değerlendirmeyi Yapan</h3>
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
                        <p className="font-medium">Değerlendirmeyi Yapan:</p>
                        <p>{formData.assessorName || 'Belirtilmemiş'}</p>
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

              {/* Risk Action Plan Table */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Risk Değerlendirmesi - Eylem ve Aksiyon Planı</h3>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-300 text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-3 py-2 text-left font-medium text-gray-700">RİSK</th>
                        <th className="border border-gray-300 px-3 py-2 text-left font-medium text-gray-700">TESPİT YÖNTEMİ</th>
                        <th className="border border-gray-300 px-3 py-2 text-left font-medium text-gray-700">KRİTİK LİMİT</th>
                        <th className="border border-gray-300 px-3 py-2 text-left font-medium text-gray-700">SORUMLU</th>
                        <th className="border border-gray-300 px-3 py-2 text-left font-medium text-gray-700">AKSİYON</th>
                        <th className="border border-gray-300 px-3 py-2 text-left font-medium text-gray-700">EVRAK</th>
                      </tr>
                    </thead>
                    <tbody>
                      {riskActions.map((action, index) => (
                        <tr key={action.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-300 px-3 py-2 align-top">{action.risk}</td>
                          <td className="border border-gray-300 px-3 py-2 align-top">{action.detectionMethod}</td>
                          <td className="border border-gray-300 px-3 py-2 align-top">{action.criticalLimit}</td>
                          <td className="border border-gray-300 px-3 py-2 align-top">{action.responsible}</td>
                          <td className="border border-gray-300 px-3 py-2 align-top whitespace-pre-line">{action.action}</td>
                          <td className="border border-gray-300 px-3 py-2 align-top">{action.documentation}</td>
                        </tr>
                      ))}
                      {riskActions.length === 0 && (
                        <tr>
                          <td colSpan={6} className="border border-gray-300 px-3 py-4 text-center text-gray-500">
                            Henüz risk aksiyonu eklenmemiş
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Notes and Signatures */}
              <div className="mt-8 pt-4 border-t border-gray-300">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">Sonraki Değerlendirme Tarihi:</p>
                    <p>{new Date(formData.nextAssessmentDate).toLocaleDateString('tr-TR')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Değerlendirmeyi Yapan:</p>
                    <p>{formData.assessorName || 'Belirtilmemiş'}</p>
                    <p>{formData.assessorCompany}</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-12 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
                <p>Bu rapor {formData.assessorCompany} tarafından {formData.clientCompany || 'müşteri'} için hazırlanmıştır.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="mt-12 bg-blue-600 rounded-lg p-8 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Profesyonel Risk Değerlendirmesi İster misiniz?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Uzman ekibimiz, tesislerinizin risk değerlendirmesini profesyonel olarak gerçekleştirmek için yanınızda.
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

export default RiskActionPlanPage;