import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  Calendar, 
  Building, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  DollarSign,
  CheckSquare,
  AlertTriangle,
  X,
  Image,
  Plus,
  Minus,
  Edit,
  Save
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface PestService {
  id: string;
  pests: string;
  frequency: string;
  area: string;
}

interface ContractClause {
  id: string;
  number: string;
  title: string;
  content: string;
}

const ContractPage = () => {
  const [formData, setFormData] = useState({
    contractNumber: '',
    clientName: '',
    clientAddress: '',
    clientPhone: '',
    clientEmail: '',
    clientContactPerson: '',
    serviceDescription: 'Zararlı haşere ile mücadele hizmetleri',
    startDate: '',
    endDate: '',
    price: '',
    priceInWords: '',
    paymentTerms: 'Fatura tarihini takip eden 15 gün içerisinde',
    contractDate: new Date().toISOString().split('T')[0]
  });

  const [serviceProvider, setServiceProvider] = useState({
    name: 'SİSTEM İLAÇLAMA SAN. VE TİC. LTD. ŞTİ./PestMENTOR',
    address: 'Kükürtlü Mah. Belde Cad. Gündüz Sok. Tan Apt. No:2 Osmangazi / BURSA',
    phone: '0224 233 83 87',
    fax: '(0224) 233 82 32',
    email: 'pazarlama@pestmentor.com.tr',
    shortName: 'PestMENTOR'
  });

  const [bankAccounts, setBankAccounts] = useState([
    {
      id: '1',
      bank: 'GARANTİ BANKASI',
      branch: 'GAZCILAR ŞUBESİ',
      accountNo: '6297367',
      iban: 'TR82 0006 2000 0370 0006 2973 67'
    },
    {
      id: '2',
      bank: 'İŞ BANKASI',
      branch: 'NİLÜFER ŞUBESİ',
      accountNo: '331402',
      iban: 'TR13 0006 4000 0012 2510 3314 02'
    }
  ]);

  const [pestServices, setPestServices] = useState<PestService[]>([
    {
      id: '1',
      pests: 'Fare-Sıçanlar (Kemirgenler)',
      frequency: 'Ayda 1 ziyaret',
      area: 'İşletme Geneli'
    }
  ]);

  const [contractClauses, setContractClauses] = useState<ContractClause[]>([
    {
      id: '1',
      number: '1',
      title: 'SÖZLEŞMENİN KONUSU',
      content: '{clientName} işletmesinde insan sağlığı, hammadde ve ürün kalitesini insan sağlığını bozacak olumsuz yönde etkileyecek zararlı haşerenin kontrolüne ilişkin onaylanmış alanlarda {providerName} tarafından yapılacak zararlı haşere ile mücadele hizmetlerine ilişkin teknik, idari, mali ve hukuki şartlar ve sorumlulukların kabulü, taahhüdü ve onayları iş bu sözleşmenin konusunu oluşturmaktadır.'
    },
    {
      id: '2',
      number: '2',
      title: 'TARAFLAR',
      content: 'HİZMET ALAN FİRMA ve HİZMET VEREN FİRMA bilgileri yukarıda belirtilmiştir.'
    },
    {
      id: '3',
      number: '3',
      title: 'YAPILACAK İŞİN TANIMI',
      content: 'Yukarıda adresi belirtilen İŞVEREN işletmesinde aşağıda belirtilen zararlılara karşı yapılacak mücadelenin denetimi, engellenmesi ve yok edilmesi hizmetleridir.'
    },
    {
      id: '4',
      number: '4',
      title: 'YETKİ VE SORUMLULUKLAR',
      content: '4.1 {providerShortName} yetkilisi, İŞVEREN elemanının nezaretinde, entegre zararlı mücadelesi/IPM işlerini icra edecek olup, gizlilik kurallarına uyulması, özel mülkün korunması ve mahremiyet ilkelerine ilişkin mevzuata tam olarak riayet etmek zorundadır.\n4.2 {providerShortName} T.C. Tarım Bakanlığı ve Sağlık Bakanlığı\'nın müsaade ve tavsiye ettiği her türlü ilaç, ekipman monitör (yem istasyonu) kullanımına ilişkin yem, cinsel çekici hormon, insektisit ve rodentisit v.b. diğer haşere mücadele – kontrol ve önlenmesine ilişkin doğal veya kimyasal tüm materyali kullanabilme, gereğinde değiştirebilme, dozaj ve sayısını duruma göre değerlendirerek, artırıp, azaltabilme, insektisit v.b. sıvı doğal veya kimyasal ilaçların uygun ilaçlama ekipmanlarında kullanımı, ilaçlama zaman ve sıklığını gerektiğinde ilaçlama süresince ve sonrasına uygulama alanına yetkili olmayan diğer kişilerin uzak tutulmasında, karar, uygulama ve uygulattırma yetkisine sahip olacaktır.\n4.3 Uygulama sonrası gözlem, takip ve periyodik kontrollerin yapılması, raporlanması, gerekiyorsa İŞVEREN onayı ile tedarikçi firmaların denetlenmesi {providerShortName} tarafından yapılacaktır.\n4.4 Periyodik kontroller veya uygulama sonrası bina ve tesis haşereden arınmış olarak teslim edilmiş ise, bir sonraki uygulama veya kontrol tarihine kadar görülebilecek haşerenin ve kalıntının bildirilmesi İŞVEREN sorumluluğundadır.\n4.5 İşbu sözleşme devam ettiği sürece, sözleşme kapsamında olan zararlı kontrol ve mücadelesine yönelik {providerShortName} bilgisi dışında, herhangi bir uygulama ve fiziksel tuzak veya monitör kullanılmasına müsaade etmeyecektir.\n4.6 {providerShortName} kırılan veya kullanılmaz hale getirilen monitörlerin (yem istasyonu) bedelini İŞVEREN\'e fatura eder.\n4.7 Uygulama veya kontrol öncesinde, çalışma yapılacak bölgeler İŞVEREN tarafından hazır hale getirilecektir.\n4.8 {providerShortName} tarafından raporlarda belirtilen izolasyon ve hijyen iyileştirmeleri ve/veya yapılan öneriler doğrultusunda alınması gereken cihazların veya yapılması gereken fiziki önlemlerin bedeli İŞVEREN tarafından karşılanacak veya tedarik edilecek'
    },
    {
      id: '5',
      number: '5',
      title: 'HİZMETİN SÜRESİ, FESİH VE DİĞER ŞARTLAR',
      content: '5.1 İşbu sözleşme {startDate} – {endDate} tarihleri arasında geçerli olup {endDate} tarihinden bir ay önce sözleşmenin yenilenmeyeceği yazılı olarak taraflarca bildirilmediği takdirde kendiliğinden yenilenmiş olur.\n5.2 Bu hüküm takip eden yıllar için de geçerli olacaktır. Bu aşamada TÜİK (Türkiye İstatistik Kurumu) tarafından açıklanmış yıllık enflasyon oranı dikkate alınarak taraflar karşılıklı görüşerek artırım oranını belirlerler.\n5.3 İŞVEREN, işbu sözleşmeyi ilk altı ay boyunca feshedemez, işbu sözleşme, taraf olarak imza vadeden kimselerin katılımı olmadan feshedilemez, devredilemez.\n5.4 Bu sözleşme fesihle ya da süresinin hitamıyla sona ermiş olsa dahi, {providerShortName} sözleşmede öngörülen hizmeti İŞVEREN\'in öngöreceği süre kadar işbu sözleşme hükümleri çerçevesinde yürütmek zorundadır. Söz konusu süre her halükarda 1 (bir) ayı geçemez.'
    },
    {
      id: '6',
      number: '6',
      title: 'İHTİLAFLARIN HALLİ',
      content: 'İhtilafların hallinde Bursa Mahkemeleri ve İcra Daireleri yetkilidir.'
    },
    {
      id: '7',
      number: '7',
      title: 'ZORUNLU NEDENLER',
      content: '{providerShortName} savaş, sel, yangın, ağır mevsim şartları, deprem gibi doğal afetler, ayaklanma, terör, toplu halk hareketleri, grev lokavt ve İŞVEREN alanındaki çalışma şartlarının sağlanmamış olması gibi mücbir sebeplerin dışında bir başka sebeple işbu sözleşmede belirtilen hizmetleri yapmaktan kaçınamaz, haklı sebepler ileri süremez.'
    },
    {
      id: '8',
      number: '8',
      title: 'FİYAT VE ÖDEME',
      content: '8.1 Fiyat\nİşbu sözleşmenin, 2. maddesinde belirtilen adresindeki İŞVEREN alanındaki, 3 ve 4 ncü maddelerde belirtilen işlerin tamamı için sözleşmenin geçerli olduğu sürece {providerShortName}, aylık aşağıda belirtilen tutarda fatura düzenleyecektir.\n\n{price}.-TL/AY+KDV\t\t( {priceInWords} TL/AY+KDV )\n\n8.2 Ödeme\nFatura tarihini takip eden 15 gün içerisinde ödeme yapılacaktır. Zamanında yapılmayan ödemeler için aylık Merkez bankası reeskont faizi uygulanacaktır.'
    },
    {
      id: '9',
      number: '9',
      title: 'DİĞER HÜKÜMLER',
      content: 'İşbu sözleşme iki (2) sayfa ve dokuz (9) maddeden ibaret olup, 1 nüsha olarak düzenlenmiştir. Tarafların tebligat adresleri işbu sözleşmenin ikinci maddesinde yazıldığı gibidir. Adres değişiklikleri karşı tarafa yazılı olarak bildirilmediği taktirde anılan adreslere yapılan tebligatlar geçerli sayılacaktır.'
    }
  ]);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const contractRef = useRef<HTMLDivElement>(null);
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);
  
  const [editingClause, setEditingClause] = useState<string | null>(null);
  const [editingProvider, setEditingProvider] = useState(false);
  const [editingBank, setEditingBank] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<string | null>(null);

  useEffect(() => {
    // Set default contract number based on current date
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const defaultContractNumber = `${year}-${month}${Math.floor(Math.random() * 900 + 100)}`;
    
    setFormData(prev => ({
      ...prev,
      contractNumber: defaultContractNumber,
      startDate: `${year}-01-01`,
      endDate: `${year}-12-31`
    }));
  }, []);

  useEffect(() => {
    // Update price in words when price changes
    if (formData.price) {
      try {
        const priceNum = parseInt(formData.price);
        if (!isNaN(priceNum)) {
          // Convert number to Turkish words
          const priceInWords = convertNumberToTurkishWords(priceNum);
          setFormData(prev => ({ ...prev, priceInWords }));
        }
      } catch (e) {
        console.error("Error converting price to words:", e);
      }
    }
  }, [formData.price]);

  const convertNumberToTurkishWords = (num: number): string => {
    const ones = ['', 'BİR', 'İKİ', 'ÜÇ', 'DÖRT', 'BEŞ', 'ALTI', 'YEDİ', 'SEKİZ', 'DOKUZ'];
    const tens = ['', 'ON', 'YİRMİ', 'OTUZ', 'KIRK', 'ELLİ', 'ALTMIŞ', 'YETMİŞ', 'SEKSEN', 'DOKSAN'];
    const thousands = ['', 'BİN', 'MİLYON', 'MİLYAR', 'TRİLYON'];
    
    if (num === 0) return 'SIFIR';
    
    let words = '';
    let i = 0;
    
    while (num > 0) {
      const chunk = num % 1000;
      if (chunk !== 0) {
        const hundreds = Math.floor(chunk / 100);
        const ten = Math.floor((chunk % 100) / 10);
        const one = chunk % 10;
        
        let chunkWords = '';
        
        if (hundreds > 0) {
          chunkWords += (hundreds === 1 ? 'YÜZ' : ones[hundreds] + ' YÜZ');
        }
        
        if (ten > 0) {
          chunkWords += ' ' + tens[ten];
        }
        
        if (one > 0) {
          chunkWords += ' ' + ones[one];
        }
        
        // Special case for 1000
        if (i === 1 && chunk === 1) {
          words = thousands[i] + ' ' + words;
        } else {
          words = chunkWords.trim() + ' ' + thousands[i] + ' ' + words;
        }
      }
      
      num = Math.floor(num / 1000);
      i++;
    }
    
    return words.trim();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProviderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setServiceProvider(prev => ({ ...prev, [name]: value }));
  };

  const handleBankChange = (id: string, field: string, value: string) => {
    setBankAccounts(prev => 
      prev.map(account => 
        account.id === id ? { ...account, [field]: value } : account
      )
    );
  };

  const handleServiceChange = (id: string, field: string, value: string) => {
    setPestServices(prev => 
      prev.map(service => 
        service.id === id ? { ...service, [field]: value } : service
      )
    );
  };

  const handleClauseChange = (id: string, field: string, value: string) => {
    setContractClauses(prev => 
      prev.map(clause => 
        clause.id === id ? { ...clause, [field]: value } : clause
      )
    );
  };

  const addPestService = () => {
    const newId = (pestServices.length + 1).toString();
    setPestServices(prev => [
      ...prev,
      {
        id: newId,
        pests: '',
        frequency: '',
        area: ''
      }
    ]);
  };

  const removePestService = (id: string) => {
    if (pestServices.length > 1) {
      setPestServices(prev => prev.filter(service => service.id !== id));
    }
  };

  const addBankAccount = () => {
    const newId = (bankAccounts.length + 1).toString();
    setBankAccounts(prev => [
      ...prev,
      {
        id: newId,
        bank: '',
        branch: '',
        accountNo: '',
        iban: ''
      }
    ]);
  };

  const removeBankAccount = (id: string) => {
    if (bankAccounts.length > 1) {
      setBankAccounts(prev => prev.filter(account => account.id !== id));
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile) return null;
    
    try {
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, logoFile);
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      return null;
    }
  };

  const exportToJpeg = async () => {
    if (!contractRef.current) return;
    
    setExportLoading(true);
    try {
      // First page
      const canvas1 = await html2canvas(page1Ref.current!, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData1 = canvas1.toDataURL('image/jpeg', 1.0);
      
      // Second page
      const canvas2 = await html2canvas(page2Ref.current!, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData2 = canvas2.toDataURL('image/jpeg', 1.0);
      
      // Create links to download both pages
      const link1 = document.createElement('a');
      link1.href = imgData1;
      link1.download = `Hizmet-Sozlesmesi-${formData.contractNumber}-Sayfa1.jpeg`;
      link1.click();
      
      setTimeout(() => {
        const link2 = document.createElement('a');
        link2.href = imgData2;
        link2.download = `Hizmet-Sozlesmesi-${formData.contractNumber}-Sayfa2.jpeg`;
        link2.click();
      }, 500);
      
    } catch (error) {
      console.error('Error exporting to JPEG:', error);
      alert('JPEG dışa aktarma sırasında bir hata oluştu.');
    } finally {
      setExportLoading(false);
    }
  };

  const exportToPdf = async () => {
    if (!contractRef.current) return;
    
    setExportLoading(true);
    try {
      // Create PDF document (A4 size)
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // First page
      const canvas1 = await html2canvas(page1Ref.current!, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData1 = canvas1.toDataURL('image/jpeg', 1.0);
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas1.height * imgWidth) / canvas1.width;
      
      pdf.addImage(imgData1, 'JPEG', 0, 0, imgWidth, imgHeight);
      
      // Second page
      const canvas2 = await html2canvas(page2Ref.current!, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData2 = canvas2.toDataURL('image/jpeg', 1.0);
      
      // Add new page
      pdf.addPage();
      pdf.addImage(imgData2, 'JPEG', 0, 0, imgWidth, imgHeight);
      
      // Save PDF
      pdf.save(`Hizmet-Sozlesmesi-${formData.contractNumber}.pdf`);
      
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('PDF dışa aktarma sırasında bir hata oluştu.');
    } finally {
      setExportLoading(false);
    }
  };

  const replaceVariables = (text: string): string => {
    return text
      .replace(/{clientName}/g, formData.clientName)
      .replace(/{providerName}/g, serviceProvider.name)
      .replace(/{providerShortName}/g, serviceProvider.shortName)
      .replace(/{startDate}/g, formData.startDate ? new Date(formData.startDate).toLocaleDateString('tr-TR') : '01.01.2025')
      .replace(/{endDate}/g, formData.endDate ? new Date(formData.endDate).toLocaleDateString('tr-TR') : '31.12.2025')
      .replace(/{price}/g, formData.price || '1014')
      .replace(/{priceInWords}/g, formData.priceInWords || 'BİN ON DÖRT');
  };

  return (
    <div className="pt-8 pb-16">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <FileText className="h-12 w-12 text-blue-600 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              Hizmet Sözleşmesi Oluştur
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Müşterileriniz için profesyonel hizmet sözleşmeleri oluşturun. 
            Firma logonuzu ekleyin ve sözleşmeyi JPEG veya PDF olarak indirin.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form Section */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Sözleşme Bilgileri</h2>
              
              {/* Logo Upload */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Firma Logosu</h3>
                <div className="flex items-center space-x-4">
                  {logoPreview ? (
                    <div className="relative">
                      <img 
                        src={logoPreview} 
                        alt="Logo Preview" 
                        className="h-20 object-contain border rounded p-2"
                      />
                      <button
                        onClick={removeLogo}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        title="Logoyu Kaldır"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                         onClick={() => document.getElementById('logo-upload')?.click()}>
                      <Image className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Logo Ekle</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG (max 2MB)</p>
                    </div>
                  )}
                  <input
                    type="file"
                    id="logo-upload"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </div>
              </div>
              
              {/* Contract Details */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sözleşme Numarası
                    </label>
                    <input
                      type="text"
                      name="contractNumber"
                      value={formData.contractNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sözleşme Tarihi
                    </label>
                    <input
                      type="date"
                      name="contractDate"
                      value={formData.contractDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Service Provider Info */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Hizmet Veren Firma Bilgileri</h3>
                    <button
                      onClick={() => setEditingProvider(!editingProvider)}
                      className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      {editingProvider ? (
                        <>
                          <Save className="h-4 w-4" />
                          <span className="text-sm">Kaydet</span>
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4" />
                          <span className="text-sm">Düzenle</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  {editingProvider ? (
                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Firma Adı
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={serviceProvider.name}
                          onChange={handleProviderChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Kısa Ad (Sözleşmede Kullanılacak)
                        </label>
                        <input
                          type="text"
                          name="shortName"
                          value={serviceProvider.shortName}
                          onChange={handleProviderChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Adres
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={serviceProvider.address}
                          onChange={handleProviderChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Telefon
                          </label>
                          <input
                            type="text"
                            name="phone"
                            value={serviceProvider.phone}
                            onChange={handleProviderChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Faks
                          </label>
                          <input
                            type="text"
                            name="fax"
                            value={serviceProvider.fax}
                            onChange={handleProviderChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          E-posta
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={serviceProvider.email}
                          onChange={handleProviderChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p><strong>Firma Adı:</strong> {serviceProvider.name}</p>
                      <p><strong>Adres:</strong> {serviceProvider.address}</p>
                      <p><strong>Telefon:</strong> {serviceProvider.phone}</p>
                      <p><strong>Faks:</strong> {serviceProvider.fax}</p>
                      <p><strong>E-posta:</strong> {serviceProvider.email}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Müşteri Bilgileri</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Müşteri Adı
                      </label>
                      <input
                        type="text"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Örn: BESİNTAŞ KARACABEY ÇELTİK UN VE YEM FAB. SAN. A.Ş."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Adres
                      </label>
                      <textarea
                        name="clientAddress"
                        value={formData.clientAddress}
                        onChange={handleChange}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Örn: Bursa Yolu Üzeri Çatrık Mevkii Karacabey / BURSA"
                      ></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Telefon
                        </label>
                        <input
                          type="text"
                          name="clientPhone"
                          value={formData.clientPhone}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Örn: (0224) 671 85 01"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          E-posta
                        </label>
                        <input
                          type="email"
                          name="clientEmail"
                          value={formData.clientEmail}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Örn: info@example.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Hizmet Bilgileri</h3>
                    <button
                      onClick={addPestService}
                      className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="text-sm">Zararlı Ekle</span>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {pestServices.map((service, index) => (
                      <div key={service.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-gray-700">Zararlı #{index + 1}</h4>
                          {pestServices.length > 1 && (
                            <button
                              onClick={() => removePestService(service.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        
                        {editingService === service.id ? (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Zararlılar
                              </label>
                              <input
                                type="text"
                                value={service.pests}
                                onChange={(e) => handleServiceChange(service.id, 'pests', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Örn: Fare-Sıçanlar (Kemirgenler)"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ziyaret Sıklığı
                              </label>
                              <input
                                type="text"
                                value={service.frequency}
                                onChange={(e) => handleServiceChange(service.id, 'frequency', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Örn: Ayda 1 ziyaret"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Uygulama Alanı
                              </label>
                              <input
                                type="text"
                                value={service.area}
                                onChange={(e) => handleServiceChange(service.id, 'area', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Örn: İşletme Geneli"
                              />
                            </div>
                            <div className="flex justify-end">
                              <button
                                onClick={() => setEditingService(null)}
                                className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                              >
                                <Save className="h-4 w-4" />
                                <span className="text-sm">Kaydet</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p><strong>Zararlılar:</strong> {service.pests || 'Belirtilmemiş'}</p>
                            <p><strong>Ziyaret Sıklığı:</strong> {service.frequency || 'Belirtilmemiş'}</p>
                            <p><strong>Uygulama Alanı:</strong> {service.area || 'Belirtilmemiş'}</p>
                            <div className="flex justify-end">
                              <button
                                onClick={() => setEditingService(service.id)}
                                className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                              >
                                <Edit className="h-4 w-4" />
                                <span className="text-sm">Düzenle</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Sözleşme Süresi ve Ödeme</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Başlangıç Tarihi
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bitiş Tarihi
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Aylık Ücret (TL)
                      </label>
                      <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Örn: 1014"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ödeme Koşulları
                      </label>
                      <input
                        type="text"
                        name="paymentTerms"
                        value={formData.paymentTerms}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Bank Accounts */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Banka Hesapları</h3>
                    <button
                      onClick={addBankAccount}
                      className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="text-sm">Hesap Ekle</span>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {bankAccounts.map((account) => (
                      <div key={account.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-gray-700">{account.bank || 'Yeni Banka Hesabı'}</h4>
                          {bankAccounts.length > 1 && (
                            <button
                              onClick={() => removeBankAccount(account.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        
                        {editingBank === account.id ? (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Banka Adı
                              </label>
                              <input
                                type="text"
                                value={account.bank}
                                onChange={(e) => handleBankChange(account.id, 'bank', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Şube
                              </label>
                              <input
                                type="text"
                                value={account.branch}
                                onChange={(e) => handleBankChange(account.id, 'branch', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Hesap No
                              </label>
                              <input
                                type="text"
                                value={account.accountNo}
                                onChange={(e) => handleBankChange(account.id, 'accountNo', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                IBAN
                              </label>
                              <input
                                type="text"
                                value={account.iban}
                                onChange={(e) => handleBankChange(account.id, 'iban', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="flex justify-end">
                              <button
                                onClick={() => setEditingBank(null)}
                                className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                              >
                                <Save className="h-4 w-4" />
                                <span className="text-sm">Kaydet</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p><strong>Banka:</strong> {account.bank}</p>
                            <p><strong>Şube:</strong> {account.branch}</p>
                            <p><strong>Hesap No:</strong> {account.accountNo}</p>
                            <p><strong>IBAN:</strong> {account.iban}</p>
                            <div className="flex justify-end">
                              <button
                                onClick={() => setEditingBank(account.id)}
                                className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                              >
                                <Edit className="h-4 w-4" />
                                <span className="text-sm">Düzenle</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contract Clauses */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Sözleşme Maddeleri</h3>
                  <div className="space-y-4">
                    {contractClauses.map((clause) => (
                      <div key={clause.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-gray-700">{clause.number}. {clause.title}</h4>
                          <button
                            onClick={() => setEditingClause(editingClause === clause.id ? null : clause.id)}
                            className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                          >
                            {editingClause === clause.id ? (
                              <>
                                <Save className="h-4 w-4" />
                                <span className="text-sm">Kaydet</span>
                              </>
                            ) : (
                              <>
                                <Edit className="h-4 w-4" />
                                <span className="text-sm">Düzenle</span>
                              </>
                            )}
                          </button>
                        </div>
                        
                        {editingClause === clause.id ? (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Madde Numarası
                              </label>
                              <input
                                type="text"
                                value={clause.number}
                                onChange={(e) => handleClauseChange(clause.id, 'number', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Madde Başlığı
                              </label>
                              <input
                                type="text"
                                value={clause.title}
                                onChange={(e) => handleClauseChange(clause.id, 'title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Madde İçeriği
                              </label>
                              <textarea
                                value={clause.content}
                                onChange={(e) => handleClauseChange(clause.id, 'content', e.target.value)}
                                rows={5}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              ></textarea>
                              <p className="text-xs text-gray-500 mt-1">
                                Değişkenler: {'{clientName}'}, {'{providerName}'}, {'{providerShortName}'}, {'{startDate}'}, {'{endDate}'}, {'{price}'}, {'{priceInWords}'}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-600 whitespace-pre-line">
                            {replaceVariables(clause.content).substring(0, 150)}...
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Export Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={exportToJpeg}
                  disabled={exportLoading}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {exportLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>İşleniyor...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5" />
                      <span>JPEG İndir</span>
                    </>
                  )}
                </button>
                <button
                  onClick={exportToPdf}
                  disabled={exportLoading}
                  className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {exportLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>İşleniyor...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="h-5 w-5" />
                      <span>PDF İndir</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-8 overflow-hidden">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Sözleşme Önizleme</h2>
              
              <div className="border rounded-lg p-4 overflow-auto max-h-[800px]">
                <div ref={contractRef} className="text-sm">
                  {/* Page 1 */}
                  <div ref={page1Ref} className="w-[210mm] h-[297mm] bg-white p-8 mx-auto mb-8 border shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      {logoPreview && (
                        <div className="max-w-[200px] max-h-[80px]">
                          <img 
                            src={logoPreview} 
                            alt="Company Logo" 
                            className="h-auto max-h-[80px] w-auto object-contain"
                          />
                        </div>
                      )}
                      <div className="text-right">
                        <h2 className="text-xl font-bold">HİZMET SÖZLEŞMESİ</h2>
                        <p className="text-sm">SÖZLEŞME NO: {formData.contractNumber}</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Clause 1 */}
                      <div>
                        <h3 className="font-bold border-b pb-1 mb-2">{contractClauses[0].number}. {contractClauses[0].title}</h3>
                        <p className="text-justify">
                          {replaceVariables(contractClauses[0].content)}
                        </p>
                      </div>

                      {/* Clause 2 */}
                      <div>
                        <h3 className="font-bold border-b pb-1 mb-2">{contractClauses[1].number}. {contractClauses[1].title}</h3>
                        <div className="space-y-4">
                          <div>
                            <p className="font-semibold">HİZMET ALAN FİRMA:</p>
                            <p>{formData.clientName}</p>
                            <p>Adres: {formData.clientAddress}</p>
                            <p>Tel: {formData.clientPhone}</p>
                            <p>Mail: {formData.clientEmail}</p>
                            <p className="mt-1">Sözleşme metninde bundan sonra sadece "İŞVEREN" olarak anılacaktır.</p>
                          </div>
                          
                          <div>
                            <p className="font-semibold">HİZMET VEREN FİRMA:</p>
                            <p>{serviceProvider.name}</p>
                            <p>Adres: {serviceProvider.address}</p>
                            <p>Tel: {serviceProvider.phone}   Faks: {serviceProvider.fax}</p>
                            <p>Mail: {serviceProvider.email}</p>
                            <p className="mt-1">Sözleşme metninde bundan sonra sadece "{serviceProvider.shortName}" olarak anılacaktır.</p>
                          </div>
                        </div>
                      </div>

                      {/* Clause 3 */}
                      <div>
                        <h3 className="font-bold border-b pb-1 mb-2">{contractClauses[2].number}. {contractClauses[2].title}</h3>
                        <p className="mb-2">
                          {replaceVariables(contractClauses[2].content)}
                        </p>
                        <table className="w-full border-collapse border border-gray-300">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border border-gray-300 p-2 text-left">ZARARLILAR</th>
                              <th className="border border-gray-300 p-2 text-left">ZİYARETLER</th>
                              <th className="border border-gray-300 p-2 text-left">UYGULAMA ALANI</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pestServices.map((service) => (
                              <tr key={service.id}>
                                <td className="border border-gray-300 p-2">{service.pests}</td>
                                <td className="border border-gray-300 p-2">{service.frequency}</td>
                                <td className="border border-gray-300 p-2">{service.area}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Clause 4 */}
                      <div>
                        <h3 className="font-bold border-b pb-1 mb-2">{contractClauses[3].number}. {contractClauses[3].title}</h3>
                        <div className="whitespace-pre-line">
                          {replaceVariables(contractClauses[3].content)}
                        </div>
                      </div>

                      {/* Clause 5 */}
                      <div>
                        <h3 className="font-bold border-b pb-1 mb-2">{contractClauses[4].number}. {contractClauses[4].title}</h3>
                        <div className="whitespace-pre-line">
                          {replaceVariables(contractClauses[4].content)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Page 2 */}
                  <div ref={page2Ref} className="w-[210mm] h-[297mm] bg-white p-8 mx-auto border shadow-sm">
                    <div className="space-y-6">
                      {/* Clause 6 */}
                      <div>
                        <h3 className="font-bold border-b pb-1 mb-2">{contractClauses[5].number}. {contractClauses[5].title}</h3>
                        <p>{replaceVariables(contractClauses[5].content)}</p>
                      </div>

                      {/* Clause 7 */}
                      <div>
                        <h3 className="font-bold border-b pb-1 mb-2">{contractClauses[6].number}. {contractClauses[6].title}</h3>
                        <p className="text-justify">
                          {replaceVariables(contractClauses[6].content)}
                        </p>
                      </div>

                      {/* Clause 8 */}
                      <div>
                        <h3 className="font-bold border-b pb-1 mb-2">{contractClauses[7].number}. {contractClauses[7].title}</h3>
                        <div className="whitespace-pre-line">
                          {replaceVariables(contractClauses[7].content)}
                        </div>
                        
                        <div className="mt-4 border p-4 rounded-lg">
                          <p className="font-semibold text-center mb-2">{serviceProvider.name.split('/')[0]} BANKA BİLGİLERİ</p>
                          <div className="grid grid-cols-2 gap-4">
                            {bankAccounts.map((account, index) => (
                              <div key={account.id}>
                                <p className="font-semibold">{account.bank}</p>
                                <p>ŞUBE: {account.branch}</p>
                                <p>HESAP NO: {account.accountNo}</p>
                                <p>IBAN NO: {account.iban}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Clause 9 */}
                      <div>
                        <h3 className="font-bold border-b pb-1 mb-2">{contractClauses[8].number}. {contractClauses[8].title}</h3>
                        <p className="text-justify">
                          {replaceVariables(contractClauses[8].content)}
                        </p>
                      </div>

                      <div className="mt-8">
                        <p className="text-center mb-4">SÖZLEŞME İMZA TARİHİ: {formData.contractDate ? new Date(formData.contractDate).toLocaleDateString('tr-TR') : ''}</p>
                        
                        <div className="flex justify-between mt-8">
                          <div className="text-center">
                            <p className="font-bold">HİZMETİ VEREN</p>
                            <p>{serviceProvider.name.split('/')[0]}</p>
                            <div className="h-20"></div> {/* Space for signature */}
                          </div>
                          <div className="text-center">
                            <p className="font-bold">HİZMETİ ALAN</p>
                            <p>{formData.clientName.split(' ')[0] || 'BESİNTAŞ'}</p>
                            <div className="h-20"></div> {/* Space for signature */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractPage;