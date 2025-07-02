import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import {
  Map,
  Settings,
  Download,
  Building,
  Calendar,
  User,
  MapPin,
  Link2,
  Mountain,
  Factory,
  Tractor,
  AlertTriangle,
  PlusCircle,
  XCircle,
  Zap,
  ChevronDown,
  Trash2,
  Edit,
  Save,
  RefreshCw
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// --- KESİN ÇÖZÜM 1: İkonları metin isimleriyle eşleştiren bir harita oluşturuldu. ---
// Bu, state'e bileşen değil, sadece metin kaydetmemizi sağlar.
const iconMap = {
  Mountain,
  Factory,
  Tractor,
  AlertTriangle,
  Settings,
};

// --- KESİN ÇÖZÜM 2: TypeScript tipleri metin tabanlı ikon isimlerini kullanacak şekilde güncellendi. ---
type IconName = keyof typeof iconMap;
type RiskLevel = 'low' | 'medium' | 'high' | 'opportunity';

interface AnalysisItem {
  id: string;
  text: string;
  risk: RiskLevel | null;
  notes: string;
}

interface AnalysisCategory {
  id: string;
  title: string;
  icon: IconName; // Artık React.ElementType değil, 'Mountain' gibi bir metin.
  items: AnalysisItem[];
}

interface ReportData {
  clientCompany: string;
  factoryAddress: string;
  assessmentDate: string;
  assessorName: string;
  mapImageUrl: string;
  strategicSummary: string;
}

// --- KESİN ÇÖZÜM 3: Başlangıç state'i de ikonları metin olarak kullanıyor. ---
const getDefaultState = (): { reportData: ReportData; analysisItems: AnalysisCategory[] } => ({
  reportData: {
    clientCompany: '', factoryAddress: '', assessmentDate: new Date().toISOString().split('T')[0],
    assessorName: 'Uzman Analist', mapImageUrl: '',
    strategicSummary: 'Yapılan analizler sonucunda, tesisin konumu genel olarak değerlendirilmiş ve potansiyel riskler ile fırsatlar aşağıda detaylandırılmıştır. Özellikle dikkat edilmesi gereken hususlar...'
  },
  analysisItems: [
    { id: 'cat1', title: 'Çevresel Faktörler', icon: 'Mountain', items: [] },
    { id: 'cat2', title: 'Komşu Yapılanma ve Sanayi', icon: 'Factory', items: [] },
    { id: 'cat3', title: 'Arazi Kullanımı ve Lojistik', icon: 'Tractor', items: [] },
    { id: 'cat4', title: 'Doğal Afet ve Altyapı Riskleri', icon: 'AlertTriangle', items: [] },
  ]
});

// --- Alt Bileşenler ---

const RiskDonutChart = React.memo(({ data }: { data: { [key in RiskLevel]: number } }) => {
    const total = Object.values(data).reduce((s, v) => s + v, 0);
    if (total === 0) return <div className="flex items-center justify-center h-full text-gray-400">Analiz Verisi Girilmedi</div>;
    const r = 60, sw = 15, c = 2 * Math.PI * r;
    const segments = [
        { v: data.high, c: '#ef4444' }, { v: data.medium, c: '#f59e0b' },
        { v: data.low, c: '#22c55e' }, { v: data.opportunity, c: '#3b82f6' }
    ];
    let offset = 0;
    return (
        <div className="flex items-center space-x-6">
            <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
                <circle className="text-gray-200" stroke="currentColor" strokeWidth={sw} fill="transparent" r={r} cx="70" cy="70" />
                {segments.map((seg, i) => {
                    if (seg.v === 0) return null;
                    const o = (offset / total) * c;
                    const da = (seg.v / total) * c;
                    offset += seg.v;
                    return <circle key={i} stroke={seg.c} strokeWidth={sw} strokeDasharray={`${da} ${c}`} strokeDashoffset={-o} fill="transparent" r={r} cx="70" cy="70" style={{ transition: 'all 0.5s' }} />;
                })}
                <text x="50%" y="50%" textAnchor="middle" dy=".3em" className="rotate-90 origin-center fill-current text-gray-700 text-2xl font-bold">{total}</text>
                <text x="50%" y="65%" textAnchor="middle" dy=".3em" className="rotate-90 origin-center fill-current text-gray-500 text-xs">Madde</text>
            </svg>
            <div className="text-sm space-y-1">
                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>{data.high} Yüksek Risk</div>
                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>{data.medium} Orta Risk</div>
                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>{data.low} Düşük Risk</div>
                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>{data.opportunity} Fırsat</div>
            </div>
        </div>
    );
});

const AccordionItem = ({ title, children }: { title: string, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                <h3 className="font-semibold text-gray-700">{title}</h3>
                <ChevronDown size={20} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <div className="p-4 border-t border-gray-200">{children}</div>}
        </div>
    );
};

// --- Ana Bileşen ---
const LocationAnalysisDashboard = () => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  // --- State Yönetimi ---
  const [reportData, setReportData] = useState<ReportData>(() => {
    try { const saved = localStorage.getItem('locationAnalysisReportData'); return saved ? JSON.parse(saved) : getDefaultState().reportData; } catch { return getDefaultState().reportData; }
  });

  const [analysisItems, setAnalysisItems] = useState<AnalysisCategory[]>(() => {
    try { const saved = localStorage.getItem('locationAnalysisItems'); return saved ? JSON.parse(saved) : getDefaultState().analysisItems; } catch { return getDefaultState().analysisItems; }
  });

  useEffect(() => {
    localStorage.setItem('locationAnalysisReportData', JSON.stringify(reportData));
    localStorage.setItem('locationAnalysisItems', JSON.stringify(analysisItems));
  }, [reportData, analysisItems]);

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryTitle, setEditingCategoryTitle] = useState('');

  const handleDataChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setReportData(p => ({ ...p, [e.target.name]: e.target.value })), []);

  const addCategory = useCallback(() => {
    // KESİN ÇÖZÜM 4: Yeni kategori eklerken ikonun metin adı ('Settings') kullanılır.
    const newCategory: AnalysisCategory = { id: `cat${Date.now()}`, title: 'Yeni Kategori', icon: 'Settings', items: [] };
    setAnalysisItems(p => [...p, newCategory]);
  }, []);

  const removeCategory = useCallback((id: string) => { if (window.confirm("Kategoriyi silmek istediğinize emin misiniz?")) setAnalysisItems(p => p.filter(c => c.id !== id)); }, []);
  const startEditingCategory = useCallback((cat: AnalysisCategory) => { setEditingCategoryId(cat.id); setEditingCategoryTitle(cat.title); }, []);
  const saveCategoryTitle = useCallback((id: string) => { setAnalysisItems(p => p.map(c => c.id === id ? { ...c, title: editingCategoryTitle } : c)); setEditingCategoryId(null); }, [editingCategoryTitle]);
  const handleItemChange = useCallback((catId: string, itemId: string, field: 'text' | 'notes', val: string) => setAnalysisItems(p => p.map(c => c.id === catId ? { ...c, items: c.items.map(i => i.id === itemId ? { ...i, [field]: val } : i) } : c)), []);
  const handleRiskChange = useCallback((catId: string, itemId: string, risk: RiskLevel | null) => setAnalysisItems(p => p.map(c => c.id === catId ? { ...c, items: c.items.map(i => i.id === itemId ? { ...i, risk } : i) } : c)), []);
  const addItem = useCallback((catId: string) => setAnalysisItems(p => p.map(c => c.id === catId ? { ...c, items: [...c.items, { id: `item${Date.now()}`, text: 'Yeni madde', risk: null, notes: '' }] } : c)), []);
  const removeItem = useCallback((catId: string, itemId: string) => setAnalysisItems(p => p.map(c => c.id === catId ? { ...c, items: c.items.filter(i => i.id !== itemId) } : c)), []);
  const resetState = useCallback(() => { if (window.confirm("Tüm veriler sıfırlanacak. Emin misiniz?")) { setReportData(getDefaultState().reportData); setAnalysisItems(getDefaultState().analysisItems); }}, []);

  const riskCounts = useMemo(() => {
    const counts: { [key in RiskLevel]: number } = { low: 0, medium: 0, high: 0, opportunity: 0 };
    analysisItems.forEach(c => c.items.forEach(i => i.risk && counts[i.risk]++));
    return counts;
  }, [analysisItems]);

  const generateReport = async (format: 'pdf' | 'jpeg') => {
    if (!reportRef.current) return; setLoading(true);
    const el = reportRef.current; const oS = { overflow: el.style.overflow, height: el.style.height };
    el.style.overflow = 'visible'; el.style.height = 'auto';
    try {
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff', width: el.scrollWidth, height: el.scrollHeight });
      if (format === 'pdf') {
        const d = canvas.toDataURL('image/png', 1.0); const pdf = new jsPDF('p', 'mm', 'a4');
        const pW = pdf.internal.pageSize.getWidth(); const pH = (canvas.height * pW) / canvas.width;
        pdf.addImage(d, 'PNG', 0, 0, pW, pH); pdf.save(`Konum_Analizi_${reportData.clientCompany || 'rapor'}.pdf`);
      } else {
        const link = document.createElement('a'); link.href = canvas.toDataURL('image/jpeg', 0.95);
        link.download = `Konum_Analizi_${reportData.clientCompany || 'rapor'}.jpg`; link.click();
      }
    } catch (e) { console.error("Rapor hatası:", e); alert('Rapor oluşturulamadı.');
    } finally { el.style.overflow = oS.overflow; el.style.height = oS.height; setLoading(false); }
  };

  const riskColors: { [key in RiskLevel]: string } = { low: 'border-green-500 bg-green-50 text-green-800', medium: 'border-amber-500 bg-amber-50 text-amber-800', high: 'border-red-500 bg-red-50 text-red-800', opportunity: 'border-blue-500 bg-blue-50 text-blue-800' };
  const LoadingSpinner = () => <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Rapor Önizleme Alanı */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div ref={reportRef} className="bg-white max-w-4xl mx-auto p-12 shadow-2xl rounded-lg border border-gray-200">
          <header className="text-center border-b-2 border-gray-200 pb-6 mb-10">
            <h1 className="text-4xl font-bold text-gray-800">Konum Analiz Raporu</h1>
            <p className="text-lg text-gray-500 mt-2">{reportData.clientCompany || "Müşteri Firması"}</p>
          </header>
          <section className="grid grid-cols-5 gap-8 mb-10">
            <div className="col-span-2 space-y-4 text-sm text-gray-700">
              <div className="flex"><Building size={16} className="mr-3 mt-0.5 text-gray-400" /><div><strong>Firma:</strong> {reportData.clientCompany || '...'}</div></div>
              <div className="flex"><MapPin size={16} className="mr-3 mt-0.5 text-gray-400" /><div><strong>Adres:</strong> {reportData.factoryAddress || '...'}</div></div>
              <div className="flex"><Calendar size={16} className="mr-3 mt-0.5 text-gray-400" /><div><strong>Tarih:</strong> {new Date(reportData.assessmentDate).toLocaleDateString('tr-TR')}</div></div>
              <div className="flex"><User size={16} className="mr-3 mt-0.5 text-gray-400" /><div><strong>Analist:</strong> {reportData.assessorName || '...'}</div></div>
            </div>
            <div className="col-span-3 bg-gray-100 rounded-lg flex items-center justify-center min-h-[150px] border">
              {reportData.mapImageUrl ? <img src={reportData.mapImageUrl} alt="Harita Görseli" className="w-full h-full object-cover rounded-lg" /> : <div className="text-center text-gray-400"><Map size={40} className="mx-auto mb-2" /><p>Harita Görseli</p></div>}
            </div>
          </section>
          <section className="mb-10"><h2 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-4">Risk Özeti</h2><div className="bg-gray-50 p-6 rounded-lg border"><RiskDonutChart data={riskCounts} /></div></section>
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-6">Detaylı Analiz</h2>
            <div className="space-y-6">
              {analysisItems.map(cat => {
                // KESİN ÇÖZÜM 5: İkon, haritadan (iconMap) güvenli bir şekilde çağrılır.
                const IconComponent = iconMap[cat.icon] || Settings;
                return cat.items.length > 0 && (
                  <div key={cat.id}>
                    <h3 className="flex items-center text-xl font-semibold text-gray-600 mb-3"><IconComponent size={20} className="mr-3 text-gray-400" /> {cat.title}</h3>
                    <div className="space-y-3 pl-8">
                      {cat.items.map(item => (<div key={item.id} className={`p-4 border-l-4 rounded-r-lg ${item.risk ? riskColors[item.risk] : 'border-gray-200 bg-white'}`}><p className="font-medium">{item.text}</p>{item.notes && <p className="text-sm mt-1 opacity-80"><strong>Not:</strong> {item.notes}</p>}</div>))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
          <section><h2 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-4">Stratejik Özet ve Öneriler</h2><p className="text-gray-600 whitespace-pre-line leading-relaxed">{reportData.strategicSummary}</p></section>
          <footer className="text-center text-xs text-gray-400 border-t pt-4 mt-12">PestMentor Konum Analiz Raporu - {new Date().getFullYear()}</footer>
        </div>
      </main>

      {/* Kontrol Paneli */}
      <aside className="w-[450px] bg-gray-50 border-l border-gray-200 p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center text-2xl font-bold text-gray-800"><Settings size={24} className="mr-3 text-blue-600" /> Kontrol Paneli</div>
          <button onClick={resetState} title="Tüm verileri varsayılana sıfırla" className="p-2 text-gray-500 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors"><RefreshCw size={18} /></button>
        </div>
        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
          <AccordionItem title="Genel Rapor Bilgileri"><div className="space-y-3">
              <input type="text" name="clientCompany" value={reportData.clientCompany} onChange={handleDataChange} placeholder="Müşteri Firma Adı" className="w-full p-2 border rounded-md text-sm" />
              <textarea name="factoryAddress" value={reportData.factoryAddress} onChange={handleDataChange} placeholder="Fabrika Adresi" className="w-full p-2 border rounded-md text-sm h-20 resize-none" />
              <input type="text" name="assessorName" value={reportData.assessorName} onChange={handleDataChange} placeholder="Analist Adı" className="w-full p-2 border rounded-md text-sm" />
              <input type="date" name="assessmentDate" value={reportData.assessmentDate} onChange={handleDataChange} className="w-full p-2 border rounded-md text-sm text-gray-500" />
              <div className="relative"><Link2 size={16} className="absolute left-2.5 top-2.5 text-gray-400" /><input type="text" name="mapImageUrl" value={reportData.mapImageUrl} onChange={handleDataChange} placeholder="Harita Görsel URL'i" className="w-full p-2 pl-8 border rounded-md text-sm" /></div>
          </div></AccordionItem>
          <AccordionItem title="Analiz Kategorileri ve Maddeleri"><div className="space-y-4">
              {analysisItems.map(cat => (<div key={cat.id} className="bg-gray-100 p-3 rounded-lg border">
                  <div className="flex justify-between items-center mb-2">
                      {editingCategoryId === cat.id ? (<input type="text" value={editingCategoryTitle} onChange={e => setEditingCategoryTitle(e.target.value)} className="font-medium text-sm text-gray-700 bg-white border-blue-500 border rounded px-1" autoFocus onBlur={() => saveCategoryTitle(cat.id)} onKeyDown={e => e.key === 'Enter' && saveCategoryTitle(cat.id)}/>) : (<h4 className="font-medium text-sm text-gray-700">{cat.title}</h4>)}
                      <div className="flex items-center space-x-2">
                          {editingCategoryId === cat.id ? (<button onClick={() => saveCategoryTitle(cat.id)} className="text-green-600 hover:text-green-800"><Save size={16} /></button>) : (<button onClick={() => startEditingCategory(cat)} className="text-blue-600 hover:text-blue-800"><Edit size={16} /></button>)}
                          <button onClick={() => removeCategory(cat.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                          <button onClick={() => addItem(cat.id)} className="text-blue-500 hover:text-blue-700"><PlusCircle size={18} /></button>
                      </div>
                  </div>
                  <div className="space-y-2">{cat.items.map(item => (<div key={item.id} className="bg-white p-2 rounded border">
                      <div className="flex items-center"><input type="text" value={item.text} onChange={e => handleItemChange(cat.id, item.id, 'text', e.target.value)} className="flex-1 text-sm border-b focus:outline-none focus:border-blue-500" /><button onClick={() => removeItem(cat.id, item.id)} className="ml-2 text-red-400 hover:text-red-600"><XCircle size={16} /></button></div>
                      <div className="flex space-x-1 mt-2">{Object.keys(riskColors).map(risk => (<button key={risk} onClick={() => handleRiskChange(cat.id, item.id, risk as RiskLevel)} className={`px-1.5 py-0.5 text-xs rounded transition-all ${item.risk === risk ? `${{low:'bg-green-500',medium:'bg-amber-500',high:'bg-red-500',opportunity:'bg-blue-500'}[risk as RiskLevel]} text-white` : 'bg-gray-200 hover:bg-gray-300'}`}>{risk === 'opportunity' ? <Zap size={12} /> : risk[0].toUpperCase()}</button>))}</div>
                      <textarea value={item.notes} onChange={e => handleItemChange(cat.id, item.id, 'notes', e.target.value)} placeholder="Notlar..." className="w-full p-1 mt-2 border rounded-md text-xs h-16 resize-none" />
                  </div>))}</div>
              </div>))}
              <button onClick={addCategory} className="w-full mt-2 p-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-dashed border-blue-300 transition-colors">Yeni Kategori Ekle</button>
          </div></AccordionItem>
          <AccordionItem title="Stratejik Özet"><textarea name="strategicSummary" value={reportData.strategicSummary} onChange={handleDataChange} className="w-full p-2 border rounded-md text-sm h-32 resize-none" /></AccordionItem>
        </div>
        <div className="mt-6 pt-6 border-t">
          <h3 className="font-semibold text-gray-600 mb-2">Raporu İndir</h3>
          <div className="flex space-x-2">
            <button onClick={() => generateReport('pdf')} disabled={loading} className="w-full flex items-center justify-center bg-blue-600 text-white px-4 py-2.5 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-all">{loading ? <LoadingSpinner /> : <Download size={16} className="mr-2" />} PDF</button>
            <button onClick={() => generateReport('jpeg')} disabled={loading} className="w-full flex items-center justify-center bg-green-600 text-white px-4 py-2.5 rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-all">{loading ? <LoadingSpinner /> : <Download size={16} className="mr-2" />} JPEG</button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default LocationAnalysisDashboard;