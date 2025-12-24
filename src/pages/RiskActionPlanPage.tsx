import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ClipboardList, 
  CheckCircle, 
  X, 
  AlertTriangle, 
  Download, 
  Save, 
  Building, 
  User, 
  FileText,
  Camera,
  Trash2,
  Mail,
  Phone,
  Image as ImageIcon,
  Target,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Copy,
  MoreVertical,
  PenTool,
  RefreshCw
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// --- TİP TANIMLARI ---
type StatusType = 'open' | 'closed' | 'pending';

interface RiskAction {
  id: string;
  risk: string;
  detectionMethod: string;
  criticalLimit: string;
  responsible: string;
  action: string;
  documentation: string;
  status: StatusType;
  evidencePhoto: string | null;
}

interface Signature {
    name: string;
    title: string;
    signatureImage: string | null;
}

// --- ANA COMPONENT ---
const RiskActionPlanPage = () => {
  const reportRef = useRef<HTMLDivElement>(null);
  const predefinedActionsRef = useRef<HTMLDivElement>(null);

  // --- STATE'LER ---
  const [loading, setLoading] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showPredefinedActions, setShowPredefinedActions] = useState(false);
  
  // Tab menüsü (Mobil/Desktop görünümü için)
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  // Form Verileri
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

  // İmzalar
  const [signatures, setSignatures] = useState<{assessor: Signature, client: Signature}>({
      assessor: { name: '', title: 'Servis Sorumlusu', signatureImage: null },
      client: { name: '', title: 'İşletme Yetkilisi', signatureImage: null }
  });

  // Risk Listesi (Varsayılan boş veya örnek veri ile)
  const [riskActions, setRiskActions] = useState<RiskAction[]>([
    {
      id: 'risk1',
      risk: 'Dış alanda kemirgen aktivitesi',
      detectionMethod: 'İstasyon kontrolü',
      criticalLimit: 'Tüketim görülmesi',
      responsible: 'SİSTEM İLAÇLAMA',
      action: '1-Aktif yuvaların bulunması\n2-Yalıtım kontrolü',
      documentation: 'Faaliyet raporu',
      status: 'open',
      evidencePhoto: null
    }
  ]);

  // --- PREDEFINED DATA (Kısaltılmış Örnekler) ---
  const predefinedRiskActions = [
    {
      risk: 'Dış alanda kemirgen aktivitesi',
      detectionMethod: 'Kemirgen yem istesyonlarının ayda 2 kez kontrolü',
      criticalLimit: 'Tüketim görülmesi',
      responsible: 'SİSTEM İLAÇLAMA',
      action: '1-Aktif yuvaların bulunması ve kaynağın tespit edilmesi\n2-Üst üste 3 gün takip edilmesi\n3-Çevrenin yönetilmesi',
      documentation: 'Faaliyet raporu'
    },
    {
      risk: 'İç alanda uçkun aktivitesi',
      detectionMethod: 'LFT cihazı kontrolü',
      criticalLimit: 'Cihazda >10 sinek',
      responsible: 'SİSTEM İLAÇLAMA',
      action: '1-Giriş noktalarının yalıtımı\n2-Cihaz lambalarının değişimi\n3-Kapıların kapalı tutulması',
      documentation: 'Risk analiz raporu'
    }
    // ... Diğer maddeler buraya eklenebilir
  ];

  // --- INIT & LOCAL STORAGE ---
  useEffect(() => {
    const saved = localStorage.getItem('riskActionPlan_Draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed.formData);
        setRiskActions(parsed.riskActions);
        if(parsed.signatures) setSignatures(parsed.signatures);
      } catch (e) { console.error("Kayıt yüklenemedi"); }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('riskActionPlan_Draft', JSON.stringify({ formData, riskActions, signatures }));
      setAutoSaved(true);
      setTimeout(() => setAutoSaved(false), 2000);
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData, riskActions, signatures]);

  // --- EVENT HANDLERS ---
  
  // Dropdown dışına tıklama kontrolü
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (predefinedActionsRef.current && !predefinedActionsRef.current.contains(event.target as Node)) {
        setShowPredefinedActions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) setFormData(prev => ({ ...prev, logoUrl: event.target?.result as string }));
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

  // --- CRUD OPERATIONS ---

  const addRiskAction = (predefinedAction?: any) => {
    const newRiskAction: RiskAction = {
      id: `risk-${Date.now()}`,
      risk: predefinedAction?.risk || '',
      detectionMethod: predefinedAction?.detectionMethod || '',
      criticalLimit: predefinedAction?.criticalLimit || '',
      responsible: predefinedAction?.responsible || 'SİSTEM İLAÇLAMA',
      action: predefinedAction?.action || '',
      documentation: predefinedAction?.documentation || 'Faaliyet raporu',
      status: 'open',
      evidencePhoto: null
    };
    
    setRiskActions(prev => [...prev, newRiskAction]);
    setShowPredefinedActions(false);
  };

  const updateRiskAction = (id: string, field: keyof RiskAction, value: any) => {
    setRiskActions(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const removeRiskAction = (id: string) => {
    if(window.confirm('Bu maddeyi silmek istediğinize emin misiniz?')) {
        setRiskActions(prev => prev.filter(a => a.id !== id));
    }
  };

  const duplicateRiskAction = (action: RiskAction) => {
      const duplicated = { ...action, id: `risk-${Date.now()}` };
      setRiskActions(prev => [...prev, duplicated]);
  };

  const moveAction = (index: number, direction: 'up' | 'down') => {
      if (direction === 'up' && index === 0) return;
      if (direction === 'down' && index === riskActions.length - 1) return;
      
      const newActions = [...riskActions];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      [newActions[index], newActions[targetIndex]] = [newActions[targetIndex], newActions[index]];
      setRiskActions(newActions);
  };

  const handleEvidencePhotoUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) updateRiskAction(id, 'evidencePhoto', ev.target?.result);
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
      // Geçici olarak scale class'ı kaldır veya ayarla gerekirse
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape
      const pdfWidth = 297;
      const pdfHeight = 210;
      
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`Risk_Plani_${formData.clientCompany || 'Musteri'}.pdf`);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (err) {
      console.error(err);
      alert('PDF oluşturulurken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // --- HELPERS ---
  const getStatusColor = (status: StatusType) => {
      switch(status) {
          case 'open': return 'bg-red-100 text-red-800 border-red-200';
          case 'closed': return 'bg-green-100 text-green-800 border-green-200';
          case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
          default: return 'bg-gray-100';
      }
  };

  const getStatusLabel = (status: StatusType) => {
    switch(status) {
        case 'open': return 'Açık';
        case 'closed': return 'Kapalı';
        case 'pending': return 'Beklemede';
        default: return '';
    }
};

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
      
      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-30 px-6 py-4 shadow-sm flex justify-between items-center">
        <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Target className="text-blue-600"/> Aksiyon Planı Oluşturucu
            </h1>
            <p className="text-xs text-gray-500 hidden md:block">Profesyonel risk değerlendirme ve aksiyon raporu hazırlayın.</p>
        </div>
        
        <div className="flex items-center gap-3">
             {autoSaved && <span className="text-xs text-green-600 font-medium animate-pulse flex items-center"><Save size={14} className="mr-1"/> Kaydedildi</span>}
             
             {/* Mobile Tabs Switcher */}
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

      {showSuccessMessage && (
        <div className="fixed top-24 right-6 z-50 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center animate-in slide-in-from-right">
            <CheckCircle className="h-5 w-5 mr-2" /> Raport İndirildi!
        </div>
      )}

      <main className="container mx-auto px-4 py-6 grid lg:grid-cols-12 gap-8">
        
        {/* SOL PANEL: EDİTÖR */}
        <div className={`lg:col-span-5 space-y-6 ${activeTab === 'preview' ? 'hidden lg:block' : ''}`}>
           
           {/* Firma Bilgileri Kartı */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
                <h2 className="font-bold text-gray-700 flex items-center gap-2"><Building size={18}/> Rapor Bilgileri</h2>
             </div>
             <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs font-bold text-gray-500 mb-1 block">Firma (Siz)</label>
                        <input name="assessorCompany" value={formData.assessorCompany} onChange={handleInputChange} className="w-full border rounded p-2 text-sm" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 mb-1 block">Denetçi Adı</label>
                        <input name="assessorName" value={formData.assessorName} onChange={handleInputChange} className="w-full border rounded p-2 text-sm" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 mb-1 block">Müşteri Firma</label>
                        <input name="clientCompany" value={formData.clientCompany} onChange={handleInputChange} className="w-full border rounded p-2 text-sm" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 mb-1 block">Müşteri Yetkilisi</label>
                        <input name="clientName" value={formData.clientName} onChange={handleInputChange} className="w-full border rounded p-2 text-sm" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 mb-1 block">Tarih</label>
                        <input type="date" name="assessmentDate" value={formData.assessmentDate} onChange={handleInputChange} className="w-full border rounded p-2 text-sm" />
                    </div>
                     <div>
                        <label className="text-xs font-bold text-gray-500 mb-1 block">Logo</label>
                        <div className="flex items-center gap-2">
                            <label className="cursor-pointer bg-blue-50 text-blue-600 px-3 py-1.5 rounded text-xs font-bold hover:bg-blue-100 flex items-center gap-1">
                                <ImageIcon size={14}/> Seç
                                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                            </label>
                            {formData.logoUrl && <span className="text-xs text-green-600">Yüklendi</span>}
                        </div>
                    </div>
                </div>
             </div>
           </div>

           {/* Aksiyonlar Listesi */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-bold text-gray-700 flex items-center gap-2"><ClipboardList size={18}/> Aksiyonlar ({riskActions.length})</h2>
                
                <div className="flex items-center gap-2 relative" ref={predefinedActionsRef}>
                    <button onClick={() => setShowPredefinedActions(!showPredefinedActions)} className="bg-white border text-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-50 flex items-center gap-1 shadow-sm">
                        <span>+ Hazır Ekle</span> <ChevronDown size={14}/>
                    </button>
                    <button onClick={() => addRiskAction()} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 shadow-sm shadow-blue-200">
                        + Yeni
                    </button>

                    {showPredefinedActions && (
                        <div className="absolute top-full right-0 mt-2 w-72 bg-white shadow-xl rounded-lg border z-20 max-h-80 overflow-y-auto">
                            {predefinedRiskActions.map((action, i) => (
                                <button key={i} onClick={() => addRiskAction(action)} className="w-full text-left p-3 hover:bg-blue-50 border-b last:border-0 group">
                                    <div className="font-bold text-sm text-gray-800 group-hover:text-blue-700">{action.risk}</div>
                                    <div className="text-xs text-gray-500 truncate">{action.action}</div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
              </div>

              <div className="divide-y max-h-[600px] overflow-y-auto bg-gray-50/50">
                  {riskActions.map((action, index) => (
                      <div key={action.id} className="p-4 bg-white group transition-all hover:shadow-md border-l-4 border-transparent hover:border-blue-500">
                          <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-2">
                                  <span className="bg-gray-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</span>
                                  
                                  {/* Status Selector */}
                                  <select 
                                    value={action.status} 
                                    onChange={(e) => updateRiskAction(action.id, 'status', e.target.value)}
                                    className={`text-xs font-bold uppercase px-2 py-1 rounded border outline-none cursor-pointer ${getStatusColor(action.status)}`}
                                  >
                                      <option value="open">AÇIK</option>
                                      <option value="pending">BEKLEMEDE</option>
                                      <option value="closed">KAPALI</option>
                                  </select>
                              </div>

                              <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => moveAction(index, 'up')} disabled={index===0} className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"><ArrowUp size={14}/></button>
                                  <button onClick={() => moveAction(index, 'down')} disabled={index===riskActions.length-1} className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"><ArrowDown size={14}/></button>
                                  <button onClick={() => duplicateRiskAction(action)} className="p-1 hover:bg-blue-50 text-blue-600 rounded" title="Kopyala"><Copy size={14}/></button>
                                  <button onClick={() => removeRiskAction(action.id)} className="p-1 hover:bg-red-50 text-red-600 rounded" title="Sil"><Trash2 size={14}/></button>
                              </div>
                          </div>

                          <div className="grid gap-3">
                              <input 
                                value={action.risk} 
                                onChange={(e) => updateRiskAction(action.id, 'risk', e.target.value)}
                                placeholder="Risk Tanımı" 
                                className="w-full font-bold text-gray-800 border-b border-gray-200 focus:border-blue-500 outline-none pb-1 bg-transparent" 
                              />
                              
                              <div className="grid grid-cols-2 gap-2">
                                  <input 
                                    value={action.detectionMethod} 
                                    onChange={(e) => updateRiskAction(action.id, 'detectionMethod', e.target.value)}
                                    placeholder="Tespit Yöntemi" 
                                    className="text-xs border p-1.5 rounded bg-gray-50"
                                  />
                                  <input 
                                    value={action.criticalLimit} 
                                    onChange={(e) => updateRiskAction(action.id, 'criticalLimit', e.target.value)}
                                    placeholder="Kritik Limit" 
                                    className="text-xs border p-1.5 rounded bg-gray-50"
                                  />
                              </div>

                              <textarea 
                                value={action.action} 
                                onChange={(e) => updateRiskAction(action.id, 'action', e.target.value)}
                                placeholder="Aksiyon Planı (Her satır yeni madde)" 
                                className="w-full text-sm border p-2 rounded bg-yellow-50/50 min-h-[80px]"
                              />

                              <div className="flex items-center justify-between gap-3 pt-2 border-t border-dashed">
                                  <div className="flex-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Sorumlu</label>
                                    <select 
                                        value={action.responsible} 
                                        onChange={(e) => updateRiskAction(action.id, 'responsible', e.target.value)}
                                        className="w-full text-xs border-none p-0 bg-transparent font-medium text-gray-700 outline-none"
                                    >
                                        <option value="SİSTEM İLAÇLAMA">SİSTEM İLAÇLAMA</option>
                                        <option value={formData.clientCompany}>{formData.clientCompany || 'MÜŞTERİ'}</option>
                                        <option value={`SİSTEM İLAÇLAMA - ${formData.clientCompany}`}>ORTAK SORUMLULUK</option>
                                    </select>
                                  </div>
                                  
                                  <div>
                                      <label className={`cursor-pointer flex items-center gap-1 text-xs border px-2 py-1 rounded transition-colors ${action.evidencePhoto ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 hover:bg-gray-100'}`}>
                                          <Camera size={14}/> {action.evidencePhoto ? 'Fotoğraf Var' : 'Foto Ekle'}
                                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleEvidencePhotoUpload(action.id, e)} />
                                      </label>
                                  </div>
                              </div>
                          </div>
                      </div>
                  ))}
                  {riskActions.length === 0 && <div className="p-8 text-center text-gray-400 italic">Listeniz boş. Yukarıdan "Hazır Ekle" veya "Yeni" butonunu kullanın.</div>}
              </div>
           </div>
           
           {/* İmza Ayarları */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h3 className="font-bold text-gray-700 mb-3 text-sm flex items-center gap-2"><PenTool size={16}/> Dijital İmzalar</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="border border-dashed rounded p-3 text-center bg-gray-50">
                        <span className="text-xs block font-bold text-gray-500 mb-2">Denetçi İmzası</span>
                        {signatures.assessor.signatureImage ? (
                            <div className="relative group">
                                <img src={signatures.assessor.signatureImage} className="h-10 mx-auto object-contain" alt="İmza" />
                                <button onClick={() => setSignatures(p => ({...p, assessor: {...p.assessor, signatureImage: null}}))} className="absolute top-0 right-0 text-red-500 hidden group-hover:block"><X size={12}/></button>
                            </div>
                        ) : (
                            <label className="text-xs text-blue-600 cursor-pointer hover:underline">Yükle <input type="file" onChange={(e) => handleSignatureUpload('assessor', e)} className="hidden"/></label>
                        )}
                        <input value={signatures.assessor.name} onChange={e => setSignatures(p => ({...p, assessor: {...p.assessor, name: e.target.value}}))} placeholder="Ad Soyad" className="w-full text-xs text-center mt-2 bg-transparent border-b outline-none"/>
                    </div>
                    <div className="border border-dashed rounded p-3 text-center bg-gray-50">
                        <span className="text-xs block font-bold text-gray-500 mb-2">Müşteri İmzası</span>
                        {signatures.client.signatureImage ? (
                             <div className="relative group">
                                <img src={signatures.client.signatureImage} className="h-10 mx-auto object-contain" alt="İmza" />
                                <button onClick={() => setSignatures(p => ({...p, client: {...p.client, signatureImage: null}}))} className="absolute top-0 right-0 text-red-500 hidden group-hover:block"><X size={12}/></button>
                            </div>
                        ) : (
                             <label className="text-xs text-blue-600 cursor-pointer hover:underline">Yükle <input type="file" onChange={(e) => handleSignatureUpload('client', e)} className="hidden"/></label>
                        )}
                         <input value={signatures.client.name} onChange={e => setSignatures(p => ({...p, client: {...p.client, name: e.target.value}}))} placeholder="Ad Soyad" className="w-full text-xs text-center mt-2 bg-transparent border-b outline-none"/>
                    </div>
                </div>
           </div>

        </div>

        {/* SAĞ PANEL: PREVIEW */}
        <div className={`lg:col-span-7 ${activeTab === 'edit' ? 'hidden lg:block' : ''}`}>
             <div className="sticky top-24">
                <div className="bg-gray-800 text-white text-xs px-4 py-2 rounded-t-lg flex justify-between items-center">
                    <span>A4 Yatay Önizleme</span>
                    <span>{riskActions.length} Kayıt</span>
                </div>
                
                {/* PDF RENDER ALANI */}
                <div className="overflow-auto bg-gray-500/10 p-4 rounded-b-lg border border-gray-300 h-[calc(100vh-160px)] custom-scrollbar">
                    <div 
                        ref={reportRef}
                        className="bg-white mx-auto shadow-2xl relative"
                        style={{ width: '297mm', minHeight: '210mm', padding: '15mm' }} // A4 Landscape Padding
                    >
                        {/* Header */}
                        <div className="flex justify-between items-end border-b-2 border-gray-800 pb-4 mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">RİSK EYLEM PLANI</h1>
                                <p className="text-sm text-gray-500 mt-1 uppercase tracking-wider">Rapor No: {new Date().getTime().toString().slice(-6)}</p>
                            </div>
                            {formData.logoUrl ? (
                                <img src={formData.logoUrl} className="h-16 object-contain" alt="Logo" />
                            ) : (
                                <div className="text-xl font-bold text-gray-300">{formData.assessorCompany}</div>
                            )}
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-8 text-sm">
                            <div className="border-l-4 border-blue-600 pl-4 py-1 bg-blue-50/30">
                                <span className="block text-xs font-bold text-gray-500 uppercase">Değerlendiren Firma</span>
                                <span className="font-semibold text-lg">{formData.assessorCompany}</span>
                                <span className="block text-gray-600">{formData.assessorName}</span>
                            </div>
                            <div className="border-l-4 border-green-600 pl-4 py-1 bg-green-50/30">
                                <span className="block text-xs font-bold text-gray-500 uppercase">Müşteri Firma</span>
                                <span className="font-semibold text-lg">{formData.clientCompany}</span>
                                <span className="block text-gray-600">{formData.clientName}</span>
                            </div>
                            <div className="flex justify-between border-b pb-1">
                                <span className="font-medium text-gray-500">Değerlendirme Tarihi:</span>
                                <span>{new Date(formData.assessmentDate).toLocaleDateString('tr-TR')}</span>
                            </div>
                             <div className="flex justify-between border-b pb-1">
                                <span className="font-medium text-gray-500">Sonraki Kontrol:</span>
                                <span>{new Date(formData.nextAssessmentDate).toLocaleDateString('tr-TR')}</span>
                            </div>
                        </div>

                        {/* Table */}
                        <table className="w-full text-xs border-collapse mb-8">
                            <thead>
                                <tr className="bg-gray-800 text-white">
                                    <th className="p-2 text-left w-8 text-center">#</th>
                                    <th className="p-2 text-left w-1/4">Risk Tanımı</th>
                                    <th className="p-2 text-left">Tespit & Limit</th>
                                    <th className="p-2 text-left w-1/3">Aksiyon</th>
                                    <th className="p-2 text-left w-24">Sorumlu</th>
                                    <th className="p-2 text-center w-20">Durum</th>
                                </tr>
                            </thead>
                            <tbody>
                                {riskActions.map((action, idx) => (
                                    <tr key={action.id} className="border-b border-gray-200 break-inside-avoid">
                                        <td className="p-2 text-center font-bold bg-gray-50 align-top">{idx + 1}</td>
                                        <td className="p-2 align-top">
                                            <div className="font-bold text-gray-800 text-sm mb-1">{action.risk}</div>
                                            {action.evidencePhoto && (
                                                <div className="mt-2 border rounded p-1 inline-block bg-white">
                                                    <img src={action.evidencePhoto} className="h-16 w-auto object-cover" alt="Kanıt" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-2 align-top text-gray-600">
                                            <div><strong className="text-gray-900">Yöntem:</strong> {action.detectionMethod}</div>
                                            <div className="mt-1"><strong className="text-gray-900">Limit:</strong> {action.criticalLimit}</div>
                                            <div className="mt-1 text-[10px] italic text-gray-400">{action.documentation}</div>
                                        </td>
                                        <td className="p-2 align-top whitespace-pre-line leading-relaxed">
                                            {action.action}
                                        </td>
                                        <td className="p-2 align-top font-medium text-gray-700">
                                            {action.responsible}
                                        </td>
                                        <td className="p-2 align-top text-center">
                                            <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase border ${getStatusColor(action.status)}`}>
                                                {getStatusLabel(action.status)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Signatures */}
                        <div className="grid grid-cols-2 gap-12 mt-12 break-inside-avoid">
                             <div className="text-center">
                                 <div className="h-20 flex items-end justify-center mb-2">
                                     {signatures.assessor.signatureImage ? <img src={signatures.assessor.signatureImage} className="max-h-full" alt="İmza"/> : <div className="text-gray-300 italic">İmza Yok</div>}
                                 </div>
                                 <div className="border-t border-gray-400 pt-2 font-bold">{signatures.assessor.name || 'İsim Girilmedi'}</div>
                                 <div className="text-xs text-gray-500 uppercase">{signatures.assessor.title}</div>
                             </div>
                             <div className="text-center">
                                 <div className="h-20 flex items-end justify-center mb-2">
                                     {signatures.client.signatureImage ? <img src={signatures.client.signatureImage} className="max-h-full" alt="İmza"/> : <div className="text-gray-300 italic">İmza Yok</div>}
                                 </div>
                                 <div className="border-t border-gray-400 pt-2 font-bold">{signatures.client.name || 'İsim Girilmedi'}</div>
                                 <div className="text-xs text-gray-500 uppercase">{signatures.client.title}</div>
                             </div>
                        </div>

                        {/* Footer */}
                        <div className="absolute bottom-4 left-0 w-full text-center text-[10px] text-gray-400">
                            Sayfa 1 / 1 - {formData.assessorCompany} Lisanslı Raporlama Sistemi
                        </div>
                    </div>
                </div>
             </div>
        </div>
      </main>

      {/* CTA FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t p-3 flex justify-center items-center gap-4 shadow-lg lg:hidden z-20">
         <a href="tel:02242338387" className="bg-green-600 text-white p-2 rounded-full shadow-lg"><Phone size={20}/></a>
         <Link to="/iletisim" className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-lg text-sm">Destek Al</Link>
      </div>

    </div>
  );
};

export default RiskActionPlanPage;