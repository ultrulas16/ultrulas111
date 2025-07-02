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

// DÜZELTME 1: İkonları isimleriyle eşleştirecek bir harita oluşturuldu.
const iconMap = {
  Mountain,
  Factory,
  Tractor,
  AlertTriangle,
  Settings,
};

// DÜZELTME 2: TypeScript arayüzünde icon tipi, haritanın anahtarı (string) olarak güncellendi.
type IconName = keyof typeof iconMap;

type RiskLevel = 'low' | 'medium' | 'high' | 'opportunity';

interface AnalysisItem {
  id: string;
  text: string;
  risk: RiskLevel | null;
  notes: string;
}

interface AnalysisCategory {
  id:string;
  title: string;
  icon: IconName; // Artık bir string.
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

// DÜZELTME 3: Başlangıç state'inde ikonlar artık string olarak tanımlanıyor.
const getDefaultState = (): { reportData: ReportData; analysisItems: AnalysisCategory[] } => ({
  reportData: {
    clientCompany: '',
    factoryAddress: '',
    assessmentDate: new Date().toISOString().split('T')[0],
    assessorName: 'Uzman Analist',
    mapImageUrl: '',
    strategicSummary: 'Yapılan analizler sonucunda, tesisin konumu genel olarak değerlendirilmiş ve potansiyel riskler ile fırsatlar aşağıda detaylandırılmıştır. Özellikle dikkat edilmesi gereken hususlar...'
  },
  analysisItems: [
    { id: 'cat1', title: 'Çevresel Faktörler', icon: 'Mountain', items: [] },
    { id: 'cat2', title: 'Komşu Yapılanma ve Sanayi', icon: 'Factory', items: [] },
    { id: 'cat3', title: 'Arazi Kullanımı ve Lojistik', icon: 'Tractor', items: [] },
    { id: 'cat4', title: 'Doğal Afet ve Altyapı Riskleri', icon: 'AlertTriangle', items: [] },
  ]
});

// --- Alt Bileşenler (Değişiklik yok) ---
const RiskDonutChart = React.memo(/* ... */);
const AccordionItem = React.memo(/* ... */);


// --- Ana Bileşen ---
const LocationAnalysisDashboardFinal = () => {
    const reportRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
  
    // --- State Yönetimi (localStorage Destekli) ---
    const [reportData, setReportData] = useState<ReportData>(() => {
        try { const saved = localStorage.getItem('locationAnalysisReportData'); return saved ? JSON.parse(saved) : getDefaultState().reportData; } catch (error) { return getDefaultState().reportData; }
    });
  
    const [analysisItems, setAnalysisItems] = useState<AnalysisCategory[]>(() => {
        try { const saved = localStorage.getItem('locationAnalysisItems'); return saved ? JSON.parse(saved) : getDefaultState().analysisItems; } catch (error) { return getDefaultState().analysisItems; }
    });
  
    useEffect(() => {
      localStorage.setItem('locationAnalysisReportData', JSON.stringify(reportData));
      localStorage.setItem('locationAnalysisItems', JSON.stringify(analysisItems));
    }, [reportData, analysisItems]);
  
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    const [editingCategoryTitle, setEditingCategoryTitle] = useState('');
  
    // --- Handlers ---
    const handleDataChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setReportData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }, []);
  
    const addCategory = useCallback(() => {
      const newCategory: AnalysisCategory = { id: `cat${Date.now()}`, title: 'Yeni Kategori', icon: 'Settings', items: [] }; // icon string olarak eklendi
      setAnalysisItems(prev => [...prev, newCategory]);
    }, []);

    // Diğer handler'lar (removeCategory, startEditingCategory vs.) aynı kalabilir.
    const removeCategory = useCallback((catId: string) => {
        if (window.confirm("Bu kategoriyi ve içindeki tüm maddeleri silmek istediğinizden emin misiniz?")) { setAnalysisItems(prev => prev.filter(cat => cat.id !== catId)); }
    }, []);
    const startEditingCategory = useCallback((category: AnalysisCategory) => { setEditingCategoryId(category.id); setEditingCategoryTitle(category.title); }, []);
    const saveCategoryTitle = useCallback((catId: string) => { setAnalysisItems(prev => prev.map(cat => cat.id === catId ? { ...cat, title: editingCategoryTitle } : cat)); setEditingCategoryId(null); }, [editingCategoryTitle]);
    const handleItemChange = useCallback((catId: string, itemId: string, field: 'text' | 'notes', value: string) => { setAnalysisItems(prev => prev.map(cat => cat.id === catId ? { ...cat, items: cat.items.map(item => item.id === itemId ? { ...item, [field]: value } : item)} : cat)); }, []);
    const handleRiskChange = useCallback((catId: string, itemId: string, risk: RiskLevel | null) => { setAnalysisItems(prev => prev.map(cat => cat.id === catId ? { ...cat, items: cat.items.map(item => item.id === itemId ? { ...item, risk } : item )} : cat)); }, []);
    const addItem = useCallback((catId: string) => { const newItem: AnalysisItem = { id: `item${Date.now()}`, text: 'Yeni analiz maddesi', risk: null, notes: ''}; setAnalysisItems(prev => prev.map(cat => cat.id === catId ? { ...cat, items: [...cat.items, newItem] } : cat));}, []);
    const removeItem = useCallback((catId: string, itemId: string) => { setAnalysisItems(prev => prev.map(cat => cat.id === catId ? { ...cat, items: cat.items.filter(item => item.id !== itemId) } : cat)); }, []);
    const resetState = useCallback(() => { if (window.confirm("Tüm verileriniz silinecek ve uygulama başlangıç durumuna dönecek. Emin misiniz?")) { setReportData(getDefaultState().reportData); setAnalysisItems(getDefaultState().analysisItems); }}, []);
    
    // ... Diğer kodlar (riskCounts, generateReport, riskColors, LoadingSpinner) aynı kalabilir ...
    const riskCounts = useMemo(() => {
        const counts: { [key in RiskLevel]: number } = { low: 0, medium: 0, high: 0, opportunity: 0 };
        analysisItems.forEach(cat => cat.items.forEach(item => item.risk && counts[item.risk]++));
        return counts;
      }, [analysisItems]);
    
      const generateReport = async (format: 'pdf' | 'jpeg') => {
        if (!reportRef.current) return;
        setLoading(true);
        const reportElement = reportRef.current;
        const originalStyles = { overflow: reportElement.style.overflow, height: reportElement.style.height };
        reportElement.style.overflow = 'visible';
        reportElement.style.height = 'auto';
    
        try {
          const canvas = await html2canvas(reportElement, { scale: 2, useCORS: true, backgroundColor: '#ffffff', windowWidth: reportElement.scrollWidth, windowHeight: reportElement.scrollHeight });
          if (format === 'pdf') {
            const imgData = canvas.toDataURL('image/png', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Konum_Analizi_${reportData.clientCompany || 'rapor'}.pdf`);
          } else {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/jpeg', 0.95);
            link.download = `Konum_Analizi_${reportData.clientCompany || 'rapor'}.jpg`;
            link.click();
          }
        } catch (error) {
          console.error("Rapor oluşturma hatası:", error);
          alert('Rapor oluşturulurken bir hata oluştu. Lütfen konsolu kontrol edin.');
        } finally {
          reportElement.style.overflow = originalStyles.overflow;
          reportElement.style.height = originalStyles.height;
          setLoading(false);
        }
      };
    
      const riskColors: { [key in RiskLevel]: string } = {
        low: 'border-green-500 bg-green-50 text-green-800', medium: 'border-amber-500 bg-amber-50 text-amber-800',
        high: 'border-red-500 bg-red-50 text-red-800', opportunity: 'border-blue-500 bg-blue-50 text-blue-800',
      };
    
      const LoadingSpinner = () => (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      );
  
    return (
      <div className="flex h-screen bg-gray-100 font-sans">
        {/* Rapor Önizleme Alanı */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div ref={reportRef} className="bg-white max-w-4xl mx-auto p-12 shadow-2xl rounded-lg border border-gray-200">
            {/* ... */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-6">Detaylı Analiz</h2>
              <div className="space-y-6">
                {analysisItems.map(cat => {
                  // DÜZELTME 4: İkonu haritadan (iconMap) bularak render et.
                  const IconComponent = iconMap[cat.icon] || Settings; // Eğer ikon bulunamazsa varsayılan olarak Settings ikonu kullanılır.
                  return cat.items.length > 0 && (
                    <div key={cat.id}>
                      <h3 className="flex items-center text-xl font-semibold text-gray-600 mb-3">
                        <IconComponent size={20} className="mr-3 text-gray-400"/> {cat.title}
                      </h3>
                      <div className="space-y-3 pl-8">
                        {cat.items.map(item => (
                          <div key={item.id} className={`p-4 border-l-4 rounded-r-lg ${item.risk ? riskColors[item.risk] : 'border-gray-200 bg-white'}`}>
                            <p className="font-medium">{item.text}</p>
                            {item.notes && <p className="text-sm mt-1 opacity-80"><strong>Not:</strong> {item.notes}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
            {/* Diğer rapor bölümleri aynı */}
          </div>
        </main>
  
        {/* Kontrol Paneli Alanı */}
        <aside className="w-[450px] bg-gray-50 border-l border-gray-200 p-6 flex flex-col">
            {/* ... Kontrol panelinin içeriği aynı kalabilir, çünkü o sadece string'leri yönetiyor. ... */}
        </aside>
      </div>
    );
  };
  
  export default LocationAnalysisDashboardFinal;