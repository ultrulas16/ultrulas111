import React, { useState, useRef, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Download, 
  Save, 
  Building, 
  FileText, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  ArrowDown, 
  ArrowUp, 
  Edit, 
  Upload,
  Search,
  Copy,
  PenTool,
  ChevronDown,
  Camera,
  RefreshCw,
  Filter
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// --- TİP TANIMLARI ---
interface HazardItem {
  id: string;
  hazard: string;
  category: string;
  consequences: string;
  existingControls: string;
  likelihood: number; // 1-5
  severity: number;   // 1-5
  riskScore: number;  // L x S
  riskLevel: string;
  recommendedControls: string;
  responsiblePerson: string;
  targetDate: string;
  status: 'open' | 'in-progress' | 'completed';
  newLikelihood: number;
  newSeverity: number;
  newRiskScore: number;
  newRiskLevel: string;
  evidencePhoto: string | null; // Kanıt fotoğrafı
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
  visitFrequency: string;
}

interface Signature {
    name: string;
    title: string;
    signatureImage: string | null;
}

// --- HAZIR ŞABLON VERİLERİ ---
const PREDEFINED_HAZARDS = [
    {
        category: 'Biyolojik',
        hazard: 'Kemirgen Aktivitesi',
        consequences: 'Gıda kontaminasyonu, hastalık riski, kablo kemirme sonucu yangın riski.',
        existingControls: 'Dış hat istasyonları mevcut.',
        recommendedControls: 'Bina girişlerindeki açıklıkların kapatılması (yalıtım), istasyon sayısının artırılması.'
    },
    {
        category: 'Biyolojik',
        hazard: 'Hamam Böceği İstilası',
        consequences: 'Patojen taşıma, gıda zehirlenmesi, müşteri şikayeti.',
        existingControls: 'Aylık rutin ilaçlama.',
        recommendedControls: 'Jel yem uygulamasına geçilmesi, fayans aralarındaki derzlerin yenilenmesi.'
    },
    {
        category: 'Fiziksel',
        hazard: 'Yalıtım Eksikliği (Kapı Altları)',
        consequences: 'Zararlı girişi, toz ve kir girişi, ısı kaybı.',
        existingControls: 'Yok.',
        recommendedControls: 'Tüm dış kapı altlarına fırçalı süpürgelik takılması.'
    },
    {
        category: 'Hijyen',
        hazard: 'Birikmiş Gıda Atıkları',
        consequences: 'Zararlı çekiciliği, kötü koku, bakteri üremesi.',
        existingControls: 'Günlük temizlik.',
        recommendedControls: 'Atık kovalarının kapaklı olması ve temizlik sıklığının artırılması.'
    },
    {
        category: 'Kimyasal',
        hazard: 'Hatalı Pestisit Depolama',
        consequences: 'Çevre kirliliği, zehirlenme riski.',
        existingControls: 'Depo kilitli.',
        recommendedControls: 'Kimyasalların MSDS formlarının asılması ve dökülme havuzu kullanılması.'
    }
];

// --- ANA BİLEŞEN ---
const HazardRiskAssessmentPage = () => {
  // --- STATE ---
  const [loading, setLoading] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [showHazardForm, setShowHazardForm] = useState(false);
  const [showPredefinedList, setShowPredefinedList] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const reportRef = useRef<HTMLDivElement>(null);
  const predefinedListRef = useRef<HTMLDivElement>(null);

  // Form Verileri
  const [reportInfo, setReportInfo] = useState<ReportInfo>({
    companyName: 'PestMentor',
    companyAddress: '',
    assessmentDate: new Date().toISOString().split('T')[0],
    assessor: '',
    department: 'Genel',
    reviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    companyLogo: null,
    footerText: 'PestMentor © 2025 | Profesyonel Risk Yönetim Sistemi',
    visitFrequency: 'monthly-1'
  });

  const [hazards, setHazards] = useState<HazardItem[]>([]);
  const [currentHazard, setCurrentHazard] = useState<HazardItem | null>(null);

  // İmzalar
  const [signatures, setSignatures] = useState<{assessor: Signature, client: Signature}>({
      assessor: { name: '', title: 'Risk Değerlendirme Uzmanı', signatureImage: null },
      client: { name: '', title: 'İşletme Yetkilisi', signatureImage: null }
  });

  // --- INIT & AUTOSAVE ---
  useEffect(() => {
    const saved = localStorage.getItem('riskAssessment_Draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setReportInfo(parsed.reportInfo);
        setHazards(parsed.hazards);
        if(parsed.signatures) setSignatures(parsed.signatures);
      } catch (e) { console.error("Kayıt yüklenemedi"); }
    } else {
        // İlk açılışta boş ise 1 tane örnek ekle
        addHazard(PREDEFINED_HAZARDS[0]);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('riskAssessment_Draft', JSON.stringify({ reportInfo, hazards, signatures }));
      setAutoSaved(true);
      setTimeout(() => setAutoSaved(false), 2000);
    }, 1000);
    return () => clearTimeout(timer);
  }, [reportInfo, hazards, signatures]);

  // Click Outside Listener for Dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (predefinedListRef.current && !predefinedListRef.current.contains(event.target as Node)) {
        setShowPredefinedList(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- HESAPLAMA FONKSİYONLARI ---
  const calculateRiskLevel = (score: number): string => {
    if (score >= 15) return 'Çok Yüksek'; // 15-25
    if (score >= 10) return 'Yüksek';     // 10-12
    if (score >= 5) return 'Orta';        // 5-9
    if (score >= 3) return 'Düşük';       // 3-4
    return 'Çok Düşük';                   // 1-2
  };

  const getRiskColor = (score: number) => {
      if (score >= 15) return 'bg-red-600 text-white';
      if (score >= 10) return 'bg-orange-500 text-white';
      if (score >= 5) return 'bg-yellow-400 text-black';
      if (score >= 3) return 'bg-green-500 text-white';
      return 'bg-green-200 text-green-900';
  };

  // --- CRUD İŞLEMLERİ ---
  const addHazard = (template?: any) => {
    const newHazard: HazardItem = {
      id: `h-${Date.now()}`,
      hazard: template?.hazard || '',
      category: template?.category || 'Biyolojik',
      consequences: template?.consequences || '',
      existingControls: template?.existingControls || '',
      likelihood: 3,
      severity: 3,
      riskScore: 9,
      riskLevel: 'Orta',
      recommendedControls: template?.recommendedControls || '',
      responsiblePerson: 'İşletme Yönetimi',
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'open',
      newLikelihood: 1,
      newSeverity: 3,
      newRiskScore: 3,
      newRiskLevel: 'Düşük',
      evidencePhoto: null
    };
    
    // Eğer şablondan geliyorsa direkt listeye ekle, yoksa modal aç
    if (template) {
        setHazards(prev => [...prev, newHazard]);
        setShowPredefinedList(false);
    } else {
        setCurrentHazard(newHazard);
        setShowHazardForm(true);
    }
  };

  const updateHazardField = (name: keyof HazardItem, value: any) => {
      if (!currentHazard) return;
      
      let updated = { ...currentHazard, [name]: value };

      // Risk hesaplaması
      if (['likelihood', 'severity', 'newLikelihood', 'newSeverity'].includes(name)) {
          const l = name === 'likelihood' ? parseInt(value) : updated.likelihood;
          const s = name === 'severity' ? parseInt(value) : updated.severity;
          updated.riskScore = l * s;
          updated.riskLevel = calculateRiskLevel(updated.riskScore);

          const nl = name === 'newLikelihood' ? parseInt(value) : updated.newLikelihood;
          const ns = name === 'newSeverity' ? parseInt(value) : updated.newSeverity;
          updated.newRiskScore = nl * ns;
          updated.newRiskLevel = calculateRiskLevel(updated.newRiskScore);
      }

      setCurrentHazard(updated);
  };

  const saveCurrentHazard = () => {
      if (!currentHazard) return;
      
      setHazards(prev => {
          const index = prev.findIndex(h => h.id === currentHazard.id);
          if (index > -1) {
              const newArr = [...prev];
              newArr[index] = currentHazard;
              return newArr;
          } else {
              return [...prev, currentHazard];
          }
      });
      setShowHazardForm(false);
      setCurrentHazard(null);
  };

  const deleteHazard = (id: string) => {
      if(confirm('Silmek istediğinize emin misiniz?')) {
          setHazards(prev => prev.filter(h => h.id !== id));
      }
  };

  const moveHazard = (index: number, direction: 'up' | 'down') => {
      if (direction === 'up' && index === 0) return;
      if (direction === 'down' && index === hazards.length - 1) return;
      
      const newArr = [...hazards];
      const target = direction === 'up' ? index - 1 : index + 1;
      [newArr[index], newArr[target]] = [newArr[target], newArr[index]];
      setHazards(newArr);
  };

  const duplicateHazard = (hazard: HazardItem) => {
      const copy = { ...hazard, id: `h-${Date.now()}` };
      setHazards(prev => [...prev, copy]);
  };

  // --- FOTOĞRAF YÜKLEME ---
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, isEvidence: boolean = false) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
              if (ev.target?.result) {
                  if (isEvidence && currentHazard) {
                      updateHazardField('evidencePhoto', ev.target.result);
                  } else if (!isEvidence) {
                      setReportInfo(prev => ({ ...prev, companyLogo: ev.target?.result as string }));
                  }
              }
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSignatureUpload = (type: 'assessor' | 'client', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                setSignatures(prev => ({
                    ...prev,
                    [type]: { ...prev[type], signatureImage: event.target?.result as string }
                }));
            }
        };
        reader.readAsDataURL(file);
    }
  };

  // --- PDF GENERATION ---
  const generatePDF = async () => {
    if (!reportRef.current) return;
    setLoading(true);
    
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape
      const pdfWidth = 297;
      const pdfHeight = 210;
      
      // Sayfa sayısını hesapla (her sayfa div'i 210mm yüksekliğinde)
      // Preview modunda zaten sayfaları bölüyoruz, burada tek büyük canvas yerine sayfa sayfa alabiliriz
      // Ancak basitlik için büyük canvas alıp bölüyoruz (Dikkat: Bu bazen kesilmelere yol açar)
      // Daha güvenli yöntem: .report-page class'ına sahip her div'i ayrı ayrı render etmek.
      
      const pages = reportRef.current.querySelectorAll('.report-page');
      
      for (let i = 0; i < pages.length; i++) {
          if (i > 0) pdf.addPage();
          
          const pageCanvas = await html2canvas(pages[i] as HTMLElement, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
          const pageImg = pageCanvas.toDataURL('image/jpeg', 0.95);
          pdf.addImage(pageImg, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      }

      pdf.save(`Risk_Degerlendirme_${reportInfo.companyName}.pdf`);
      setSuccess('Rapor indirildi.');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error(err);
      alert("PDF oluşturulurken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pb-20 font-sans">
      
      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-30 px-6 py-4 shadow-sm flex justify-between items-center">
        <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
                <AlertTriangle className="text-amber-600"/> Risk Değerlendirme Modülü
            </h1>
            <p className="text-xs text-gray-500 hidden md:block">ISO ve BRC standartlarına uygun tehlike analizi ve risk yönetimi.</p>
        </div>
        
        <div className="flex items-center gap-3">
             {autoSaved && <span className="text-xs text-green-600 font-medium animate-pulse flex items-center"><Save size={14} className="mr-1"/> Kaydedildi</span>}
             
             <div className="flex bg-gray-100 p-1 rounded-lg lg:hidden">
                <button onClick={() => setActiveTab('edit')} className={`px-3 py-1 text-sm rounded-md transition-all ${activeTab === 'edit' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>Düzenle</button>
                <button onClick={() => setActiveTab('preview')} className={`px-3 py-1 text-sm rounded-md transition-all ${activeTab === 'preview' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>Önizle</button>
             </div>

             <button
                onClick={generatePDF}
                disabled={loading}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors flex items-center space-x-2 disabled:opacity-50 text-sm font-medium"
            >
                {loading ? <RefreshCw className="animate-spin h-4 w-4"/> : <Download className="h-4 w-4" />}
                <span className="hidden sm:inline">PDF İndir</span>
            </button>
        </div>
      </header>

      {success && (
        <div className="fixed top-24 right-6 z-50 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center animate-in slide-in-from-right">
            <CheckCircle className="h-5 w-5 mr-2" /> {success}
        </div>
      )}

      <main className="container mx-auto px-4 py-6 grid lg:grid-cols-12 gap-8">
        
        {/* SOL PANEL: EDİTÖR */}
        <div className={`lg:col-span-5 space-y-6 ${activeTab === 'preview' ? 'hidden lg:block' : ''}`}>
           
           {/* Firma Bilgileri */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
             <h2 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><Building size={18}/> Firma Bilgileri</h2>
             <div className="grid grid-cols-2 gap-3">
                <input placeholder="Firma Adı" value={reportInfo.companyName} onChange={e => setReportInfo({...reportInfo, companyName: e.target.value})} className="border rounded p-2 text-sm w-full"/>
                <input placeholder="Değerlendiren" value={reportInfo.assessor} onChange={e => setReportInfo({...reportInfo, assessor: e.target.value})} className="border rounded p-2 text-sm w-full"/>
                <input type="date" value={reportInfo.assessmentDate} onChange={e => setReportInfo({...reportInfo, assessmentDate: e.target.value})} className="border rounded p-2 text-sm w-full"/>
                <label className="cursor-pointer border rounded p-2 text-sm w-full bg-gray-50 flex items-center justify-center hover:bg-gray-100">
                    <ImageIcon size={14} className="mr-2"/> {reportInfo.companyLogo ? 'Logo Değiştir' : 'Logo Yükle'}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload(e)} />
                </label>
             </div>
           </div>

           {/* Risk Listesi */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
                  <h2 className="font-bold text-gray-700 flex items-center gap-2"><FileText size={18}/> Riskler ({hazards.length})</h2>
                  
                  <div className="relative" ref={predefinedListRef}>
                      <button onClick={() => setShowPredefinedList(!showPredefinedList)} className="bg-white border px-3 py-1.5 rounded text-xs font-medium hover:bg-gray-50 flex items-center gap-1">
                          + Şablon <ChevronDown size={14}/>
                      </button>
                      <button onClick={() => addHazard()} className="ml-2 bg-amber-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-amber-700">
                          + Yeni
                      </button>

                      {showPredefinedList && (
                          <div className="absolute right-0 top-full mt-2 w-72 bg-white shadow-xl rounded-lg border z-20 overflow-hidden max-h-80 flex flex-col">
                              <div className="p-2 border-b bg-gray-50 sticky top-0">
                                  <input 
                                    autoFocus
                                    placeholder="Risk ara..." 
                                    className="w-full text-xs border rounded p-1"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                  />
                              </div>
                              <div className="overflow-y-auto">
                                  {PREDEFINED_HAZARDS.filter(h => h.hazard.toLowerCase().includes(searchTerm.toLowerCase())).map((t, i) => (
                                      <button key={i} onClick={() => addHazard(t)} className="w-full text-left p-3 hover:bg-blue-50 border-b last:border-0 group">
                                          <div className="font-bold text-xs text-gray-800">{t.hazard}</div>
                                          <div className="text-[10px] text-gray-500">{t.category}</div>
                                      </button>
                                  ))}
                              </div>
                          </div>
                      )}
                  </div>
              </div>

              <div className="max-h-[600px] overflow-y-auto bg-gray-50 p-3 space-y-3">
                  {hazards.map((hazard, index) => (
                      <div key={hazard.id} className="bg-white p-3 rounded-lg border shadow-sm group hover:border-amber-400 transition-colors relative">
                          <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                  <span className="bg-gray-800 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</span>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                      hazard.status === 'open' ? 'bg-red-100 text-red-700' : 
                                      hazard.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                                  }`}>
                                      {hazard.status === 'open' ? 'Açık' : hazard.status === 'in-progress' ? 'Sürüyor' : 'Kapalı'}
                                  </span>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-2 bg-white pl-2">
                                  <button onClick={() => moveHazard(index, 'up')} className="p-1 hover:bg-gray-100 rounded text-gray-500"><ArrowUp size={14}/></button>
                                  <button onClick={() => moveHazard(index, 'down')} className="p-1 hover:bg-gray-100 rounded text-gray-500"><ArrowDown size={14}/></button>
                                  <button onClick={() => duplicateHazard(hazard)} className="p-1 hover:bg-blue-50 rounded text-blue-600"><Copy size={14}/></button>
                                  <button onClick={() => deleteHazard(hazard.id)} className="p-1 hover:bg-red-50 rounded text-red-600"><Trash2 size={14}/></button>
                              </div>
                          </div>
                          
                          <div className="cursor-pointer" onClick={() => { setCurrentHazard(hazard); setShowHazardForm(true); }}>
                              <h3 className="font-bold text-gray-800 text-sm mb-1">{hazard.hazard}</h3>
                              <p className="text-xs text-gray-500 line-clamp-2 mb-2">{hazard.consequences}</p>
                              
                              <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed">
                                  <div className="flex items-center gap-2">
                                      <div className={`text-[10px] px-2 py-0.5 rounded font-bold ${getRiskColor(hazard.riskScore)}`}>
                                          Risk: {hazard.riskScore}
                                      </div>
                                      <div className="text-[10px] text-gray-400">
                                          Hedef: {getRiskColor(hazard.newRiskScore).includes('green') ? 'Düşük' : 'Orta'}
                                      </div>
                                  </div>
                                  {hazard.evidencePhoto && <Camera size={14} className="text-blue-500"/>}
                              </div>
                          </div>
                      </div>
                  ))}
                  {hazards.length === 0 && <div className="text-center text-gray-400 py-4 text-xs">Risk kaydı bulunamadı.</div>}
              </div>
           </div>

           {/* İmzalar */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
               <h3 className="font-bold text-gray-700 mb-3 text-sm flex items-center gap-2"><PenTool size={16}/> Dijital İmzalar</h3>
               <div className="grid grid-cols-2 gap-4">
                   {['assessor', 'client'].map((role) => (
                       <div key={role} className="border border-dashed rounded p-3 text-center bg-gray-50">
                           <span className="text-xs block font-bold text-gray-500 mb-1">{role === 'assessor' ? 'Denetçi' : 'Müşteri'}</span>
                           {signatures[role as keyof typeof signatures].signatureImage ? (
                               <div className="relative group">
                                   <img src={signatures[role as keyof typeof signatures].signatureImage!} className="h-10 mx-auto object-contain" alt="İmza" />
                                   <button onClick={() => setSignatures(p => ({...p, [role]: {...p[role as keyof typeof signatures], signatureImage: null}}))} className="absolute -top-2 -right-2 text-red-500 bg-white rounded-full hidden group-hover:block"><X size={12}/></button>
                               </div>
                           ) : (
                               <label className="text-xs text-blue-600 cursor-pointer hover:underline block py-2">Yükle <input type="file" onChange={(e) => handleSignatureUpload(role as any, e)} className="hidden"/></label>
                           )}
                           <input 
                                value={signatures[role as keyof typeof signatures].name} 
                                onChange={e => setSignatures(p => ({...p, [role]: {...p[role as keyof typeof signatures], name: e.target.value}}))} 
                                placeholder="Ad Soyad" 
                                className="w-full text-xs text-center mt-1 bg-transparent border-b outline-none focus:border-blue-500"
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
                    <span>Rapor Önizleme (A4 Yatay)</span>
                    <span>{hazards.length} Kayıt</span>
                </div>
                
                <div className="overflow-auto bg-gray-500/10 p-4 rounded-b-lg border border-gray-300 h-[calc(100vh-160px)] custom-scrollbar">
                    <div ref={reportRef}>
                        {/* SAYFA 1: KAPAK VE ÖZET */}
                        <div className="report-page bg-white shadow-lg mx-auto mb-8 relative p-[15mm]" style={{ width: '297mm', height: '210mm' }}>
                            {/* Header */}
                            <div className="flex justify-between items-end border-b-2 border-gray-800 pb-4 mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">RİSK ANALİZ RAPORU</h1>
                                    <p className="text-sm text-gray-500 mt-1 uppercase tracking-wider">TEHLİKE BELİRLEME VE RİSK DEĞERLENDİRME</p>
                                </div>
                                {reportInfo.companyLogo ? (
                                    <img src={reportInfo.companyLogo} className="h-16 object-contain" alt="Logo" />
                                ) : (
                                    <div className="text-xl font-bold text-gray-300">{reportInfo.companyName}</div>
                                )}
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-8 mb-8">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between border-b pb-1"><span className="font-bold text-gray-600">Firma:</span> <span>{reportInfo.companyName}</span></div>
                                    <div className="flex justify-between border-b pb-1"><span className="font-bold text-gray-600">Adres:</span> <span className="truncate">{reportInfo.companyAddress || '-'}</span></div>
                                    <div className="flex justify-between border-b pb-1"><span className="font-bold text-gray-600">Departman:</span> <span>{reportInfo.department}</span></div>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between border-b pb-1"><span className="font-bold text-gray-600">Değerlendiren:</span> <span>{reportInfo.assessor}</span></div>
                                    <div className="flex justify-between border-b pb-1"><span className="font-bold text-gray-600">Tarih:</span> <span>{new Date(reportInfo.assessmentDate).toLocaleDateString('tr-TR')}</span></div>
                                    <div className="flex justify-between border-b pb-1"><span className="font-bold text-gray-600">Gözden Geçirme:</span> <span>{new Date(reportInfo.reviewDate).toLocaleDateString('tr-TR')}</span></div>
                                </div>
                            </div>

                            {/* Risk Matrix Visualization */}
                            <div className="flex gap-8 mb-4">
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-700 text-sm mb-2 border-b pb-1">Risk Matrisi (L x S)</h3>
                                    <div className="grid grid-cols-6 text-[10px] gap-0.5">
                                        <div className="col-span-1 row-span-6 flex items-center justify-center font-bold -rotate-90 text-gray-500">OLASILIK</div>
                                        {/* Header Row */}
                                        <div className="bg-gray-100"></div>
                                        {[1,2,3,4,5].map(i => <div key={i} className="text-center font-bold bg-gray-100 py-1">{i}</div>)}
                                        
                                        {[5,4,3,2,1].map(row => (
                                            <React.Fragment key={row}>
                                                <div className="font-bold bg-gray-100 flex items-center justify-center">{row}</div>
                                                {[1,2,3,4,5].map(col => {
                                                    const val = row * col;
                                                    return (
                                                        <div key={col} className={`flex items-center justify-center py-1 font-bold border border-white ${getRiskColor(val)}`}>
                                                            {val}
                                                        </div>
                                                    )
                                                })}
                                            </React.Fragment>
                                        ))}
                                        <div className="col-span-6 text-center font-bold text-gray-500 mt-1">ŞİDDET (ETKİ)</div>
                                    </div>
                                </div>
                                
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-700 text-sm mb-2 border-b pb-1">Risk Dağılımı</h3>
                                    <div className="space-y-2 text-xs">
                                        {['Çok Yüksek', 'Yüksek', 'Orta', 'Düşük', 'Çok Düşük'].map(level => {
                                            const count = hazards.filter(h => h.riskLevel === level).length;
                                            const percent = hazards.length ? Math.round((count/hazards.length)*100) : 0;
                                            const colorClass = level === 'Çok Yüksek' ? 'bg-red-600' : level === 'Yüksek' ? 'bg-orange-500' : level === 'Orta' ? 'bg-yellow-400' : 'bg-green-500';
                                            
                                            return (
                                                <div key={level} className="flex items-center gap-2">
                                                    <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
                                                    <div className="w-24">{level}</div>
                                                    <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                                                        <div className={`h-full ${colorClass}`} style={{width: `${percent}%`}}></div>
                                                    </div>
                                                    <div className="w-8 text-right font-bold">{count}</div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Signatures */}
                            <div className="absolute bottom-[15mm] left-[15mm] right-[15mm] flex justify-between">
                                <div className="text-center w-1/3">
                                    <div className="h-16 border-b border-gray-400 flex items-end justify-center pb-1">
                                        {signatures.assessor.signatureImage && <img src={signatures.assessor.signatureImage} className="max-h-full"/>}
                                    </div>
                                    <p className="font-bold text-sm mt-1">{signatures.assessor.name}</p>
                                    <p className="text-xs text-gray-500">{signatures.assessor.title}</p>
                                </div>
                                <div className="text-center w-1/3">
                                    <div className="h-16 border-b border-gray-400 flex items-end justify-center pb-1">
                                        {signatures.client.signatureImage && <img src={signatures.client.signatureImage} className="max-h-full"/>}
                                    </div>
                                    <p className="font-bold text-sm mt-1">{signatures.client.name}</p>
                                    <p className="text-xs text-gray-500">{signatures.client.title}</p>
                                </div>
                            </div>
                        </div>

                        {/* SAYFA 2+: TABLO (Sayfa başı 4-5 kayıt sığar) */}
                        {/* Basitlik için tüm tabloyu tek sayfada gösterip taşanı jsPDF ile bölmeyeceğiz, CSS ile sayfa sonu vereceğiz */}
                        <div className="report-page bg-white shadow-lg mx-auto relative p-[15mm] min-h-[210mm]" style={{ width: '297mm' }}>
                             <h3 className="font-bold text-gray-800 text-lg mb-4 border-b pb-2">DETAYLI RİSK ANALİZ TABLOSU</h3>
                             <table className="w-full text-xs border-collapse">
                                 <thead>
                                     <tr className="bg-gray-800 text-white">
                                         <th className="p-2 border border-gray-600 w-8">#</th>
                                         <th className="p-2 border border-gray-600 w-1/5">Tehlike & Kategori</th>
                                         <th className="p-2 border border-gray-600 w-1/5">Risk & Sonuç</th>
                                         <th className="p-2 border border-gray-600 text-center">İlk R</th>
                                         <th className="p-2 border border-gray-600 w-1/4">Kontrol Önlemleri</th>
                                         <th className="p-2 border border-gray-600 text-center">Son R</th>
                                         <th className="p-2 border border-gray-600 w-24 text-center">Durum</th>
                                     </tr>
                                 </thead>
                                 <tbody>
                                     {hazards.map((h, i) => (
                                         <tr key={h.id} className="break-inside-avoid">
                                             <td className="p-2 border border-gray-300 text-center align-top font-bold">{i+1}</td>
                                             <td className="p-2 border border-gray-300 align-top">
                                                 <div className="font-bold text-gray-900">{h.hazard}</div>
                                                 <span className="inline-block bg-gray-100 px-1.5 py-0.5 rounded text-[10px] text-gray-600 mt-1">{h.category}</span>
                                                 {h.evidencePhoto && (
                                                     <div className="mt-2">
                                                         <img src={h.evidencePhoto} className="h-16 border rounded object-cover" alt="Kanıt"/>
                                                     </div>
                                                 )}
                                             </td>
                                             <td className="p-2 border border-gray-300 align-top text-gray-600">
                                                 {h.consequences}
                                             </td>
                                             <td className="p-2 border border-gray-300 text-center align-top">
                                                 <div className="font-bold">{h.likelihood} x {h.severity}</div>
                                                 <div className={`mt-1 text-[10px] font-bold px-1 rounded text-white ${getRiskColor(h.riskScore).split(' ')[0]}`}>{h.riskScore}</div>
                                             </td>
                                             <td className="p-2 border border-gray-300 align-top">
                                                 <div className="mb-1"><span className="font-bold text-[10px] text-gray-500">MEVCUT:</span> {h.existingControls || '-'}</div>
                                                 <div><span className="font-bold text-[10px] text-blue-600">ÖNERİLEN:</span> {h.recommendedControls}</div>
                                                 <div className="mt-1 text-[10px] text-gray-500 italic">Sorumlu: {h.responsiblePerson} | Tarih: {new Date(h.targetDate).toLocaleDateString('tr-TR')}</div>
                                             </td>
                                             <td className="p-2 border border-gray-300 text-center align-top">
                                                 <div className="font-bold">{h.newLikelihood} x {h.newSeverity}</div>
                                                 <div className={`mt-1 text-[10px] font-bold px-1 rounded ${getRiskColor(h.newRiskScore).includes('green') ? 'bg-green-500 text-white' : 'bg-yellow-400 text-black'}`}>{h.newRiskScore}</div>
                                             </td>
                                             <td className="p-2 border border-gray-300 text-center align-top">
                                                 <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                                      h.status === 'open' ? 'bg-red-100 text-red-700' : 
                                                      h.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                                                 }`}>
                                                     {h.status === 'open' ? 'Açık' : h.status === 'in-progress' ? 'Sürüyor' : 'Kapalı'}
                                                 </span>
                                             </td>
                                         </tr>
                                     ))}
                                 </tbody>
                             </table>
                             <div className="mt-4 text-[10px] text-gray-400 text-center">Bu rapor {reportInfo.companyName} tarafından hazırlanmıştır. İzinsiz çoğaltılamaz.</div>
                        </div>
                    </div>
                </div>
             </div>
        </div>
      </main>

      {/* MODAL: HAZARD FORM */}
      {showHazardForm && currentHazard && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold text-gray-800">
                {hazards.some(h => h.id === currentHazard.id) ? 'Tehlike Düzenle' : 'Yeni Tehlike'}
              </h2>
              <button onClick={() => setShowHazardForm(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Tehlike Tanımı</label>
                        <input value={currentHazard.hazard} onChange={e => updateHazardField('hazard', e.target.value)} className="w-full border rounded p-2 text-sm focus:ring-2 ring-amber-500 outline-none" placeholder="Örn: Kemirgen Girişi"/>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Kategori</label>
                        <select value={currentHazard.category} onChange={e => updateHazardField('category', e.target.value)} className="w-full border rounded p-2 text-sm">
                            {['Biyolojik', 'Kimyasal', 'Fiziksel', 'Ergonomik', 'Hijyen', 'Yapısal'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Kanıt Fotoğrafı</label>
                        <label className="flex items-center justify-center border border-dashed rounded p-1.5 cursor-pointer hover:bg-gray-50 text-xs">
                            <Camera size={14} className="mr-2"/> {currentHazard.evidencePhoto ? 'Değiştir' : 'Yükle'}
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload(e, true)} />
                        </label>
                        {currentHazard.evidencePhoto && <p className="text-[10px] text-green-600 mt-1 text-center">Fotoğraf eklendi</p>}
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Olası Sonuçlar</label>
                    <textarea rows={2} value={currentHazard.consequences} onChange={e => updateHazardField('consequences', e.target.value)} className="w-full border rounded p-2 text-sm resize-none"/>
                </div>

                <div className="grid md:grid-cols-2 gap-6 bg-gray-50 p-3 rounded-lg border">
                    <div>
                        <h4 className="font-bold text-sm mb-2 text-red-600 border-b border-red-200 pb-1">Mevcut Durum (İlk Risk)</h4>
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="text-[10px]">Olasılık (1-5)</label>
                                    <input type="number" min="1" max="5" value={currentHazard.likelihood} onChange={e => updateHazardField('likelihood', e.target.value)} className="w-full border rounded p-1"/>
                                </div>
                                <div className="flex-1">
                                    <label className="text-[10px]">Şiddet (1-5)</label>
                                    <input type="number" min="1" max="5" value={currentHazard.severity} onChange={e => updateHazardField('severity', e.target.value)} className="w-full border rounded p-1"/>
                                </div>
                            </div>
                            <div className={`text-center text-xs font-bold py-1 rounded ${getRiskColor(currentHazard.riskScore)}`}>
                                Skor: {currentHazard.riskScore} ({currentHazard.riskLevel})
                            </div>
                            <textarea placeholder="Mevcut kontroller..." rows={2} value={currentHazard.existingControls} onChange={e => updateHazardField('existingControls', e.target.value)} className="w-full border rounded p-2 text-xs"/>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-sm mb-2 text-green-600 border-b border-green-200 pb-1">Hedeflenen (Son Risk)</h4>
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="text-[10px]">Olasılık (1-5)</label>
                                    <input type="number" min="1" max="5" value={currentHazard.newLikelihood} onChange={e => updateHazardField('newLikelihood', e.target.value)} className="w-full border rounded p-1"/>
                                </div>
                                <div className="flex-1">
                                    <label className="text-[10px]">Şiddet (1-5)</label>
                                    <input type="number" min="1" max="5" value={currentHazard.newSeverity} onChange={e => updateHazardField('newSeverity', e.target.value)} className="w-full border rounded p-1"/>
                                </div>
                            </div>
                            <div className={`text-center text-xs font-bold py-1 rounded ${getRiskColor(currentHazard.newRiskScore)}`}>
                                Skor: {currentHazard.newRiskScore} ({currentHazard.newRiskLevel})
                            </div>
                            <textarea placeholder="Önerilen kontroller..." rows={2} value={currentHazard.recommendedControls} onChange={e => updateHazardField('recommendedControls', e.target.value)} className="w-full border rounded p-2 text-xs"/>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Sorumlu</label>
                        <input value={currentHazard.responsiblePerson} onChange={e => updateHazardField('responsiblePerson', e.target.value)} className="w-full border rounded p-2 text-sm"/>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Termin</label>
                        <input type="date" value={currentHazard.targetDate} onChange={e => updateHazardField('targetDate', e.target.value)} className="w-full border rounded p-2 text-sm"/>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Durum</label>
                        <select value={currentHazard.status} onChange={e => updateHazardField('status', e.target.value)} className="w-full border rounded p-2 text-sm">
                            <option value="open">Açık</option>
                            <option value="in-progress">Sürüyor</option>
                            <option value="completed">Tamamlandı</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="p-4 border-t bg-gray-50 rounded-b-xl flex justify-end gap-3">
                <button onClick={() => setShowHazardForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded text-sm">İptal</button>
                <button onClick={saveCurrentHazard} className="px-6 py-2 bg-amber-600 text-white hover:bg-amber-700 rounded text-sm shadow-lg">Kaydet</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HazardRiskAssessmentPage;