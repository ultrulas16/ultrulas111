import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Trash2, 
  Plus, 
  Edit, 
  Save,
  PenTool,
  RotateCcw,
  Check,
  X,
  Upload,
  Image as ImageIcon,
  Printer,
  RefreshCw
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// --- TİP TANIMLARI ---
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

interface BankAccount {
    id: string;
    bank: string;
    branch: string;
    accountNo: string;
    iban: string;
}

interface Signature {
    image: string | null;
    date: string;
}

// --- VARSAYILAN VERİLER ---
const DEFAULT_CLAUSES: ContractClause[] = [
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
];

// --- ANA COMPONENT ---
const ContractPage = () => {
  // --- STATE ---
  const [loading, setLoading] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

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
    contractDate: new Date().toISOString().split('T')[0],
    logo: null as string | null
  });

  const [serviceProvider, setServiceProvider] = useState({
    name: 'SİSTEM İLAÇLAMA SAN. VE TİC. LTD. ŞTİ./PestMENTOR',
    address: 'Kükürtlü Mah. Belde Cad. Gündüz Sok. Tan Apt. No:2 Osmangazi / BURSA',
    phone: '0224 233 83 87',
    fax: '(0224) 233 82 32',
    email: 'pazarlama@pestmentor.com.tr',
    shortName: 'PestMENTOR'
  });

  const [signatures, setSignatures] = useState<{provider: Signature, client: Signature}>({
      provider: { image: null, date: new Date().toISOString().split('T')[0] },
      client: { image: null, date: new Date().toISOString().split('T')[0] }
  });

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: '1',
      bank: 'GARANTİ BANKASI',
      branch: 'GAZCILAR ŞUBESİ',
      accountNo: '6297367',
      iban: 'TR82 0006 2000 0370 0006 2973 67'
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

  const [contractClauses, setContractClauses] = useState<ContractClause[]>(DEFAULT_CLAUSES);

  // Refs
  const contractRef = useRef<HTMLDivElement>(null);
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);

  // --- INIT & AUTOSAVE ---
  useEffect(() => {
    // Load from local storage
    const saved = localStorage.getItem('contractDraft');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            setFormData(parsed.formData);
            setServiceProvider(parsed.serviceProvider);
            setBankAccounts(parsed.bankAccounts);
            setPestServices(parsed.pestServices);
            setContractClauses(parsed.contractClauses);
            if(parsed.signatures) setSignatures(parsed.signatures);
        } catch(e) { console.error("Kayıt yüklenemedi"); }
    } else {
        // Set default contract number
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        setFormData(prev => ({
            ...prev,
            contractNumber: `${year}-${month}${Math.floor(Math.random() * 900 + 100)}`,
            startDate: `${year}-01-01`,
            endDate: `${year}-12-31`
        }));
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
        localStorage.setItem('contractDraft', JSON.stringify({
            formData, serviceProvider, bankAccounts, pestServices, contractClauses, signatures
        }));
        setAutoSaved(true);
        setTimeout(() => setAutoSaved(false), 2000);
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData, serviceProvider, bankAccounts, pestServices, contractClauses, signatures]);

  // --- HELPERS ---
  const convertNumberToTurkishWords = (num: number): string => {
    const ones = ['', 'BİR', 'İKİ', 'ÜÇ', 'DÖRT', 'BEŞ', 'ALTI', 'YEDİ', 'SEKİZ', 'DOKUZ'];
    const tens = ['', 'ON', 'YİRMİ', 'OTUZ', 'KIRK', 'ELLİ', 'ALTMIŞ', 'YETMİŞ', 'SEKSEN', 'DOKSAN'];
    const thousands = ['', 'BİN', 'MİLYON', 'MİLYAR'];
    
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
        if (hundreds > 0) chunkWords += (hundreds === 1 ? 'YÜZ' : ones[hundreds] + ' YÜZ');
        if (ten > 0) chunkWords += ' ' + tens[ten];
        if (one > 0) chunkWords += ' ' + ones[one];
        if (i === 1 && chunk === 1) words = thousands[i] + ' ' + words;
        else words = chunkWords.trim() + ' ' + thousands[i] + ' ' + words;
      }
      num = Math.floor(num / 1000);
      i++;
    }
    return words.trim();
  };

  const replaceVariables = (text: string): string => {
    return text
      .replace(/{clientName}/g, formData.clientName || '................................................')
      .replace(/{providerName}/g, serviceProvider.name)
      .replace(/{providerShortName}/g, serviceProvider.shortName)
      .replace(/{startDate}/g, formData.startDate ? new Date(formData.startDate).toLocaleDateString('tr-TR') : '.../.../......')
      .replace(/{endDate}/g, formData.endDate ? new Date(formData.endDate).toLocaleDateString('tr-TR') : '.../.../......')
      .replace(/{price}/g, formData.price || '.........')
      .replace(/{priceInWords}/g, formData.priceInWords || '..............................');
  };

  // --- HANDLERS ---
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setFormData(prev => ({
          ...prev, 
          price: val,
          priceInWords: val ? convertNumberToTurkishWords(parseInt(val) || 0) : ''
      }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
              if (ev.target?.result) setFormData(prev => ({...prev, logo: ev.target?.result as string}));
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSignatureUpload = (type: 'provider' | 'client', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            if (ev.target?.result) {
                setSignatures(prev => ({
                    ...prev,
                    [type]: { ...prev[type], image: ev.target?.result as string }
                }));
            }
        };
        reader.readAsDataURL(file);
    }
  };

  const exportToPdf = async () => {
    if (!contractRef.current) return;
    setLoading(true);
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pages = [page1Ref.current, page2Ref.current]; // Explicit pages
      
      for (let i = 0; i < pages.length; i++) {
          if (!pages[i]) continue;
          if (i > 0) pdf.addPage();
          
          const canvas = await html2canvas(pages[i]!, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
          const imgData = canvas.toDataURL('image/jpeg', 0.95);
          pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297); // A4 dimensions
      }

      pdf.save(`Hizmet-Sozlesmesi-${formData.contractNumber}.pdf`);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('PDF oluşturulurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
      
      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-30 px-6 py-4 shadow-sm flex justify-between items-center">
        <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FileText className="text-blue-600"/> Sözleşme Oluşturucu
            </h1>
            <p className="text-xs text-gray-500 hidden md:block">Kurumsal hizmet sözleşmelerinizi hızlıca hazırlayın ve imzalayın.</p>
        </div>
        
        <div className="flex items-center gap-3">
             {autoSaved && <span className="text-xs text-green-600 font-medium animate-pulse flex items-center"><Save size={14} className="mr-1"/> Taslak Kaydedildi</span>}
             
             {/* Mobile Tabs Switcher */}
             <div className="flex bg-gray-100 p-1 rounded-lg lg:hidden">
                <button onClick={() => setActiveTab('edit')} className={`px-3 py-1 text-sm rounded-md transition-all ${activeTab === 'edit' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>Düzenle</button>
                <button onClick={() => setActiveTab('preview')} className={`px-3 py-1 text-sm rounded-md transition-all ${activeTab === 'preview' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>Önizle</button>
             </div>

             <button
                onClick={exportToPdf}
                disabled={loading}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors flex items-center space-x-2 disabled:opacity-50 text-sm font-medium"
            >
                {loading ? <RefreshCw className="animate-spin h-4 w-4"/> : <Download className="h-4 w-4" />}
                <span className="hidden sm:inline">PDF İndir</span>
            </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 grid lg:grid-cols-12 gap-8">
        
        {/* SOL PANEL: EDİTÖR */}
        <div className={`lg:col-span-5 space-y-6 ${activeTab === 'preview' ? 'hidden lg:block' : ''}`}>
           
           {/* Genel Bilgiler */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
             <h2 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><PenTool size={18}/> Sözleşme Detayları</h2>
             
             {/* Logo */}
             <div className="mb-4 flex items-center gap-3 p-3 bg-gray-50 rounded border border-dashed">
                {formData.logo ? (
                    <div className="relative h-12 w-24 bg-white border rounded flex items-center justify-center">
                        <img src={formData.logo} className="max-h-full max-w-full object-contain" alt="Logo"/>
                        <button onClick={() => setFormData(p => ({...p, logo: null}))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><X size={10}/></button>
                    </div>
                ) : (
                    <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center text-gray-400"><ImageIcon size={20}/></div>
                )}
                <div className="flex-1">
                    <label className="text-xs text-blue-600 font-bold cursor-pointer hover:underline block">
                        Firma Logosu Yükle
                        <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload}/>
                    </label>
                    <p className="text-[10px] text-gray-400">Önerilen: PNG veya JPG (Max 2MB)</p>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-3">
                <input placeholder="Sözleşme No" value={formData.contractNumber} onChange={e => setFormData({...formData, contractNumber: e.target.value})} className="border rounded p-2 text-sm w-full"/>
                <input type="date" value={formData.contractDate} onChange={e => setFormData({...formData, contractDate: e.target.value})} className="border rounded p-2 text-sm w-full"/>
             </div>
             
             <div className="mt-3 space-y-3">
                 <input placeholder="Müşteri Firma Ünvanı" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} className="border rounded p-2 text-sm w-full font-medium"/>
                 <textarea placeholder="Müşteri Adresi" value={formData.clientAddress} onChange={e => setFormData({...formData, clientAddress: e.target.value})} className="border rounded p-2 text-sm w-full h-20 resize-none"/>
                 <div className="grid grid-cols-2 gap-3">
                    <input placeholder="Telefon" value={formData.clientPhone} onChange={e => setFormData({...formData, clientPhone: e.target.value})} className="border rounded p-2 text-sm w-full"/>
                    <input placeholder="E-Posta" value={formData.clientEmail} onChange={e => setFormData({...formData, clientEmail: e.target.value})} className="border rounded p-2 text-sm w-full"/>
                 </div>
             </div>
           </div>

           {/* Süre ve Ücret */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
             <h2 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><Check size={18}/> Süre ve Ücret</h2>
             <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500">Başlangıç</label>
                    <input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="border rounded p-2 text-sm w-full"/>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500">Bitiş</label>
                    <input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="border rounded p-2 text-sm w-full"/>
                </div>
             </div>
             <div className="space-y-1">
                 <label className="text-xs font-bold text-gray-500">Aylık Hizmet Bedeli (TL)</label>
                 <input type="number" placeholder="Örn: 1500" value={formData.price} onChange={handlePriceChange} className="border rounded p-2 text-sm w-full font-bold text-blue-600"/>
                 <p className="text-xs text-gray-400 italic">Yazı ile: {formData.priceInWords} TL</p>
             </div>
           </div>

           {/* Banka Hesapları */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
             <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold text-gray-700 flex items-center gap-2"><Check size={18}/> Banka Bilgileri</h2>
                <button onClick={() => setBankAccounts([...bankAccounts, { id: Date.now().toString(), bank: '', branch: '', accountNo: '', iban: '' }])} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Plus size={16}/></button>
             </div>
             <div className="space-y-3">
                 {bankAccounts.map((acc, i) => (
                     <div key={acc.id} className="p-3 bg-gray-50 rounded border relative group">
                         <input placeholder="Banka Adı" value={acc.bank} onChange={e => {
                             const newAccs = [...bankAccounts]; newAccs[i].bank = e.target.value; setBankAccounts(newAccs);
                         }} className="bg-transparent border-b w-full text-sm font-bold mb-1 outline-none"/>
                         <div className="grid grid-cols-2 gap-2">
                             <input placeholder="Şube" value={acc.branch} onChange={e => {
                                 const newAccs = [...bankAccounts]; newAccs[i].branch = e.target.value; setBankAccounts(newAccs);
                             }} className="bg-transparent border-b w-full text-xs outline-none"/>
                             <input placeholder="Hesap No" value={acc.accountNo} onChange={e => {
                                 const newAccs = [...bankAccounts]; newAccs[i].accountNo = e.target.value; setBankAccounts(newAccs);
                             }} className="bg-transparent border-b w-full text-xs outline-none"/>
                         </div>
                         <input placeholder="IBAN" value={acc.iban} onChange={e => {
                             const newAccs = [...bankAccounts]; newAccs[i].iban = e.target.value; setBankAccounts(newAccs);
                         }} className="bg-transparent border-b w-full text-xs mt-2 font-mono outline-none"/>
                         
                         {bankAccounts.length > 1 && <button onClick={() => setBankAccounts(bankAccounts.filter(b => b.id !== acc.id))} className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600"><Trash2 size={14}/></button>}
                     </div>
                 ))}
             </div>
           </div>

           {/* Maddeler */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
             <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold text-gray-700 flex items-center gap-2"><FileText size={18}/> Sözleşme Maddeleri</h2>
                <button onClick={() => { if(confirm('Tüm maddeler varsayılana dönecek?')) setContractClauses(DEFAULT_CLAUSES); }} className="text-gray-400 hover:text-gray-600 text-xs flex items-center gap-1"><RotateCcw size={12}/> Sıfırla</button>
             </div>
             <div className="space-y-2">
                 {contractClauses.map((clause, i) => (
                     <div key={clause.id} className="border rounded p-3 text-sm bg-gray-50 group hover:bg-white hover:shadow-sm transition-all">
                         <div className="flex justify-between items-center mb-1">
                             <span className="font-bold text-gray-700">{clause.number}. {clause.title}</span>
                         </div>
                         <textarea 
                            rows={3}
                            value={clause.content} 
                            onChange={e => {
                                const newClauses = [...contractClauses]; newClauses[i].content = e.target.value; setContractClauses(newClauses);
                            }}
                            className="w-full bg-transparent border-none resize-y text-gray-600 text-xs focus:ring-0 p-0"
                         />
                     </div>
                 ))}
             </div>
           </div>

           {/* İmzalar */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
               <h3 className="font-bold text-gray-700 mb-3 text-sm flex items-center gap-2"><PenTool size={16}/> Dijital İmzalar</h3>
               <div className="grid grid-cols-2 gap-4">
                   {['provider', 'client'].map((role) => (
                       <div key={role} className="border border-dashed rounded p-3 text-center bg-gray-50">
                           <span className="text-xs block font-bold text-gray-500 mb-1">{role === 'provider' ? 'Hizmet Veren' : 'Hizmet Alan'}</span>
                           {signatures[role as keyof typeof signatures].image ? (
                               <div className="relative group">
                                   <img src={signatures[role as keyof typeof signatures].image!} className="h-12 mx-auto object-contain" alt="İmza" />
                                   <button onClick={() => setSignatures(p => ({...p, [role]: {...p[role as keyof typeof signatures], image: null}}))} className="absolute -top-2 -right-2 text-red-500 bg-white rounded-full hidden group-hover:block"><X size={12}/></button>
                               </div>
                           ) : (
                               <label className="text-xs text-blue-600 cursor-pointer hover:underline block py-2">Kaşe/İmza Yükle <input type="file" onChange={(e) => handleSignatureUpload(role as any, e)} className="hidden"/></label>
                           )}
                           <input 
                                type="date"
                                value={signatures[role as keyof typeof signatures].date} 
                                onChange={e => setSignatures(p => ({...p, [role]: {...p[role as keyof typeof signatures], date: e.target.value}}))} 
                                className="w-full text-xs text-center mt-1 bg-transparent border-b outline-none"
                           />
                       </div>
                   ))}
               </div>
           </div>

        </div>

        {/* SAĞ PANEL: ÖNİZLEME */}
        <div className={`lg:col-span-7 ${activeTab === 'edit' ? 'hidden lg:block' : ''}`}>
             <div className="sticky top-24">
                <div className="bg-gray-800 text-white text-xs px-4 py-2 rounded-t-lg flex justify-between items-center">
                    <span>A4 Önizleme (2 Sayfa)</span>
                    <Printer size={14} className="cursor-pointer hover:text-blue-300" onClick={() => window.print()}/>
                </div>
                
                <div className="overflow-auto bg-gray-500/10 p-4 rounded-b-lg border border-gray-300 h-[calc(100vh-160px)] custom-scrollbar">
                    <div ref={contractRef}>
                        
                        {/* SAYFA 1 */}
                        <div ref={page1Ref} className="bg-white shadow-lg mx-auto mb-8 relative p-[20mm] text-[11px] leading-relaxed text-justify text-gray-800" style={{ width: '210mm', height: '297mm' }}>
                            {/* Header */}
                            <div className="flex justify-between items-center mb-8 border-b-2 border-gray-800 pb-4">
                                {formData.logo ? (
                                    <img src={formData.logo} className="h-16 object-contain" alt="Logo" />
                                ) : (
                                    <div className="text-xl font-bold text-gray-300 tracking-widest">{serviceProvider.shortName}</div>
                                )}
                                <div className="text-right">
                                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">HİZMET SÖZLEŞMESİ</h1>
                                    <p className="font-mono text-gray-500">NO: {formData.contractNumber}</p>
                                </div>
                            </div>

                            {/* Maddeler 1-5 */}
                            <div className="space-y-4">
                                {contractClauses.slice(0, 5).map(clause => (
                                    <div key={clause.id}>
                                        <h3 className="font-bold text-black border-b border-gray-200 mb-1">{clause.number}. {clause.title}</h3>
                                        <div className="whitespace-pre-line text-gray-700">
                                            {replaceVariables(clause.content)}
                                        </div>
                                        {/* Tablo Eklemeleri */}
                                        {clause.number === '2' && (
                                            <div className="grid grid-cols-2 gap-4 mt-2 bg-gray-50 p-2 border text-[10px]">
                                                <div>
                                                    <strong className="block text-gray-900">HİZMET ALAN (İŞVEREN)</strong>
                                                    <p>{formData.clientName}</p>
                                                    <p>{formData.clientAddress}</p>
                                                    <p>Tel: {formData.clientPhone} | Mail: {formData.clientEmail}</p>
                                                </div>
                                                <div>
                                                    <strong className="block text-gray-900">HİZMET VEREN</strong>
                                                    <p>{serviceProvider.name}</p>
                                                    <p>{serviceProvider.address}</p>
                                                    <p>Tel: {serviceProvider.phone} | Mail: {serviceProvider.email}</p>
                                                </div>
                                            </div>
                                        )}
                                        {clause.number === '3' && (
                                            <table className="w-full mt-2 border-collapse text-[10px]">
                                                <thead>
                                                    <tr className="bg-gray-100">
                                                        <th className="border p-1 text-left">ZARARLI TÜRÜ</th>
                                                        <th className="border p-1 text-left">SIKLIK</th>
                                                        <th className="border p-1 text-left">ALAN</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {pestServices.map(ps => (
                                                        <tr key={ps.id}>
                                                            <td className="border p-1">{ps.pests}</td>
                                                            <td className="border p-1">{ps.frequency}</td>
                                                            <td className="border p-1">{ps.area}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                ))}
                            </div>
                            
                            {/* Footer 1 */}
                            <div className="absolute bottom-4 left-0 w-full text-center text-[9px] text-gray-400">
                                Sayfa 1 / 2 - {formData.contractNumber}
                            </div>
                        </div>

                        {/* SAYFA 2 */}
                        <div ref={page2Ref} className="bg-white shadow-lg mx-auto relative p-[20mm] text-[11px] leading-relaxed text-justify text-gray-800" style={{ width: '210mm', height: '297mm' }}>
                            <div className="space-y-4">
                                {contractClauses.slice(5).map(clause => (
                                    <div key={clause.id}>
                                        <h3 className="font-bold text-black border-b border-gray-200 mb-1">{clause.number}. {clause.title}</h3>
                                        <div className="whitespace-pre-line text-gray-700">
                                            {replaceVariables(clause.content)}
                                        </div>
                                        {/* Banka Bilgileri */}
                                        {clause.number === '8' && (
                                            <div className="mt-2 p-2 border rounded bg-gray-50">
                                                <p className="font-bold text-center mb-1 text-[10px]">BANKA HESAP BİLGİLERİ</p>
                                                <div className="grid grid-cols-2 gap-2 text-[10px]">
                                                    {bankAccounts.map(acc => (
                                                        <div key={acc.id}>
                                                            <p className="font-bold">{acc.bank} - {acc.branch}</p>
                                                            <p>IBAN: {acc.iban}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* İmzalar */}
                            <div className="mt-12 pt-8 border-t-2 border-gray-800">
                                <div className="text-center mb-4 font-bold">SÖZLEŞME TARİHİ: {new Date(formData.contractDate).toLocaleDateString('tr-TR')}</div>
                                <div className="flex justify-between">
                                    <div className="w-1/3 text-center">
                                        <p className="font-bold mb-2">HİZMET VEREN</p>
                                        <p className="text-[10px] h-8 overflow-hidden">{serviceProvider.name}</p>
                                        <div className="h-20 border border-dashed border-gray-300 mt-2 flex items-center justify-center relative">
                                            {signatures.provider.image ? <img src={signatures.provider.image} className="max-h-full max-w-full object-contain mix-blend-multiply" /> : <span className="text-gray-200 text-[10px]">İMZA/KAŞE</span>}
                                        </div>
                                        <p className="text-[9px] mt-1 text-gray-500">{new Date(signatures.provider.date).toLocaleDateString('tr-TR')}</p>
                                    </div>
                                    <div className="w-1/3 text-center">
                                        <p className="font-bold mb-2">HİZMET ALAN (MÜŞTERİ)</p>
                                        <p className="text-[10px] h-8 overflow-hidden">{formData.clientName}</p>
                                        <div className="h-20 border border-dashed border-gray-300 mt-2 flex items-center justify-center relative">
                                            {signatures.client.image ? <img src={signatures.client.image} className="max-h-full max-w-full object-contain mix-blend-multiply" /> : <span className="text-gray-200 text-[10px]">İMZA/KAŞE</span>}
                                        </div>
                                        <p className="text-[9px] mt-1 text-gray-500">{new Date(signatures.client.date).toLocaleDateString('tr-TR')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer 2 */}
                            <div className="absolute bottom-4 left-0 w-full text-center text-[9px] text-gray-400">
                                Sayfa 2 / 2 - {serviceProvider.shortName} Hizmet Sözleşmesi
                            </div>
                        </div>

                    </div>
                </div>
             </div>
        </div>
      </main>
    </div>
  );
};

export default ContractPage;