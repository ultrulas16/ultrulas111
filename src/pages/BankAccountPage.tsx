import React, { useState, useRef, useMemo } from 'react';
import {
  Map,
  Settings,
  Download,
  Building,
  Calendar,
  User,
  MapPin,
  Link2,
  Mountain, // Çevre
  Industry, // Komşu İşletmeler
  Tractor,  // Arazi Kullanımı
  AlertTriangle, // Riskler
  PlusCircle,
  XCircle,
  Check,
  Zap, // Fırsat
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// --- Alt Bileşen: Risk Dağılımını Gösteren Halka Grafik ---
const RiskDonutChart = ({ data }: { data: { low: number; medium: number; high: number; opportunity: number } }) => {
  const total = Object.values(data).reduce((sum, value) => sum + value, 0);
  if (total === 0) {
    return <div className="flex items-center justify-center h-full text-gray-400">Veri Yok</div>;
  }

  const radius = 60;
  const strokeWidth = 15;
  const circumference = 2 * Math.PI * radius;

  const segments = [
    { value: data.high, color: '#ef4444' }, // Red-500
    { value: data.medium, color: '#f59e0b' }, // Amber-500
    { value: data.low, color: '#22c55e' }, // Green-500
    { value: data.opportunity, color: '#3b82f6' }, // Blue-500
  ];

  let accumulatedOffset = 0;

  return (
    <div className="flex items-center space-x-6">
      <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
        <circle
          className="text-gray-200"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx="70"
          cy="70"
        />
        {segments.map((segment, index) => {
          if (segment.value === 0) return null;
          const offset = (accumulatedOffset / total) * circumference;
          const dashArray = (segment.value / total) * circumference;
          accumulatedOffset += segment.value;
          return (
            <circle
              key={index}
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashArray} ${circumference}`}
              strokeDashoffset={-offset}
              fill="transparent"
              r={radius}
              cx="70"
              cy="70"
              style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
            />
          );
        })}
        <text x="50%" y="50%" textAnchor="middle" dy=".3em" className="rotate-90 origin-center fill-current text-gray-700 text-2xl font-bold">
          {total}
        </text>
        <text x="50%" y="65%" textAnchor="middle" dy=".3em" className="rotate-90 origin-center fill-current text-gray-500 text-xs">
          Madde
        </text>
      </svg>
      <div className="text-sm">
        <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>{data.high} Yüksek Risk</div>
        <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>{data.medium} Orta Risk</div>
        <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>{data.low} Düşük Risk</div>
        <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>{data.opportunity} Fırsat</div>
      </div>
    </div>
  );
};


// --- Ana Bileşen ---
const LocationAnalysisDashboard = () => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  // --- State Yönetimi ---
  const [reportData, setReportData] = useState({
    clientCompany: '',
    factoryAddress: '',
    assessmentDate: new Date().toISOString().split('T')[0],
    assessorName: 'Uzman Analist',
    mapImageUrl: '',
    strategicSummary: 'Yapılan analizler sonucunda, tesisin konumu genel olarak değerlendirilmiş ve potansiyel riskler ile fırsatlar aşağıda detaylandırılmıştır. Özellikle dikkat edilmesi gereken hususlar...'
  });

  const [analysisItems, setAnalysisItems] = useState([
    { id: 'c1', title: 'Çevresel Faktörler', icon: Mountain, items: [
      { id: 'c1i1', text: 'Hakim rüzgar yönünün yerleşim alanlarına etkisi', risk: null, notes: ''},
      { id: 'c1i2', text: 'Yakın su kaynakları (nehir, göl) ve kirlilik riski', risk: null, notes: ''},
    ]},
    { id: 'c2', title: 'Komşu Yapılanma ve Sanayi', icon: Industry, items: [
      { id: 'c2i1', text: 'Komşu tesislerin (kimya, gıda vb.) faaliyet türü', risk: null, notes: ''},
      { id: 'c2i2', text: 'Yakın konut bölgelerine olan mesafe ve tampon bölge', risk: null, notes: ''},
    ]},
    { id: 'c3', title: 'Arazi Kullanımı ve Lojistik', icon: Tractor, items: [
        { id: 'c3i1', text: 'Tarım arazilerine yakınlık ve potansiyel etkileşim', risk: null, notes: ''},
        { id: 'c3i2', text: 'Ana ulaşım yollarına (otoyol, liman) erişim kolaylığı', risk: null, notes: ''},
    ]},
    { id: 'c4', title: 'Doğal Afet ve Altyapı Riskleri', icon: AlertTriangle, items: [
      { id: 'c4i1', text: 'Bölgenin sel, taşkın veya deprem riski durumu', risk: null, notes: ''},
      { id: 'c4i2', text: 'Yakındaki atık/çöp depolama alanları', risk: null, notes: ''},
    ]},
  ]);

  // --- Handlers ---
  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setReportData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleItemChange = (catId: string, itemId: string, field: 'text' | 'notes', value: string) => {
    setAnalysisItems(prev => prev.map(cat => 
      cat.id === catId ? { ...cat, items: cat.items.map(item => 
        item.id === itemId ? { ...item, [field]: value } : item
      )} : cat
    ));
  };
  
  const handleRiskChange = (catId: string, itemId: string, risk: 'low' | 'medium' | 'high' | 'opportunity' | null) => {
    setAnalysisItems(prev => prev.map(cat => 
      cat.id === catId ? { ...cat, items: cat.items.map(item => 
        item.id === itemId ? { ...item, risk } : item
      )} : cat
    ));
  };

  const addItem = (catId: string) => {
    const newItem = { id: `c${catId}i${Date.now()}`, text: 'Yeni analiz maddesi', risk: null, notes: ''};
    setAnalysisItems(prev => prev.map(cat => 
      cat.id === catId ? { ...cat, items: [...cat.items, newItem] } : cat
    ));
  };

  const removeItem = (catId: string, itemId: string) => {
    setAnalysisItems(prev => prev.map(cat => 
      cat.id === catId ? { ...cat, items: cat.items.filter(item => item.id !== itemId) } : cat
    ));
  };

  // --- Hesaplamalar ---
  const riskCounts = useMemo(() => {
    const counts = { low: 0, medium: 0, high: 0, opportunity: 0 };
    analysisItems.forEach(cat => {
      cat.items.forEach(item => {
        if (item.risk) counts[item.risk]++;
      });
    });
    return counts;
  }, [analysisItems]);

  // --- Rapor İndirme Fonksiyonları ---
  const generateReport = async (format: 'pdf' | 'jpeg') => {
    if (!reportRef.current) return;
    setLoading(true);
    
    // Rapor oluşturulurken geçici olarak scrollbar'ı gizle
    const reportElement = reportRef.current;
    reportElement.style.overflow = 'visible';
    reportElement.style.height = 'auto';

    try {
        const canvas = await html2canvas(reportElement, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            windowWidth: reportElement.scrollWidth,
            windowHeight: reportElement.scrollHeight,
        });

        if (format === 'pdf') {
            const imgData = canvas.toDataURL('image/png', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Konum_Analizi_${reportData.clientCompany}.pdf`);
        } else {
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            const link = document.createElement('a');
            link.href = imgData;
            link.download = `Konum_Analizi_${reportData.clientCompany}.jpg`;
            link.click();
        }
    } catch (error) {
        console.error("Rapor oluşturma hatası:", error);
        alert('Rapor oluşturulurken bir hata oluştu.');
    } finally {
        reportElement.style.overflow = 'auto'; // scrollbar'ı geri getir
        setLoading(false);
    }
  };

  const riskColors: { [key: string]: string } = {
    low: 'border-green-500 bg-green-50 text-green-800',
    medium: 'border-amber-500 bg-amber-50 text-amber-800',
    high: 'border-red-500 bg-red-50 text-red-800',
    opportunity: 'border-blue-500 bg-blue-50 text-blue-800',
  };

  // --- JSX ---
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Rapor Önizleme Alanı (Sol Taraf) */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div ref={reportRef} className="bg-white max-w-4xl mx-auto p-12 shadow-lg rounded-lg border border-gray-200">
          {/* Rapor Başlığı */}
          <header className="text-center border-b-2 border-gray-200 pb-6 mb-10">
            <h1 className="text-4xl font-bold text-gray-800">Konum Analiz Raporu</h1>
            <p className="text-lg text-gray-500 mt-2">{reportData.clientCompany || "Müşteri Firması"}</p>
          </header>

          {/* Lokasyon Bilgileri ve Harita */}
          <section className="grid grid-cols-5 gap-8 mb-10">
            <div className="col-span-2 space-y-4 text-sm">
              <div className="flex"><Building size={16} className="mr-3 mt-0.5 text-gray-400" /><div><strong>Firma:</strong> {reportData.clientCompany || '...'}</div></div>
              <div className="flex"><MapPin size={16} className="mr-3 mt-0.5 text-gray-400" /><div><strong>Adres:</strong> {reportData.factoryAddress || '...'}</div></div>
              <div className="flex"><Calendar size={16} className="mr-3 mt-0.5 text-gray-400" /><div><strong>Tarih:</strong> {new Date(reportData.assessmentDate).toLocaleDateString('tr-TR')}</div></div>
              <div className="flex"><User size={16} className="mr-3 mt-0.5 text-gray-400" /><div><strong>Analist:</strong> {reportData.assessorName || '...'}</div></div>
            </div>
            <div className="col-span-3 bg-gray-100 rounded-lg flex items-center justify-center min-h-[150px] border">
              {reportData.mapImageUrl ? 
                <img src={reportData.mapImageUrl} alt="Harita Görseli" className="w-full h-full object-cover rounded-lg"/> :
                <div className="text-center text-gray-400">
                  <Map size={40} className="mx-auto mb-2"/>
                  <p>Harita Görseli</p>
                </div>
              }
            </div>
          </section>

          {/* Risk Özeti */}
          <section className="mb-10">
             <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-4">Risk Özeti</h2>
             <div className="bg-gray-50 p-6 rounded-lg border"><RiskDonutChart data={riskCounts} /></div>
          </section>

          {/* Detaylı Analiz */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-6">Detaylı Analiz</h2>
            <div className="space-y-6">
              {analysisItems.map(cat => (
                <div key={cat.id}>
                  <h3 className="flex items-center text-xl font-semibold text-gray-600 mb-3">
                    <cat.icon size={20} className="mr-3 text-gray-400"/> {cat.title}
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
              ))}
            </div>
          </section>
          
          {/* Stratejik Özet */}
           <section>
            <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-4">Stratejik Özet ve Öneriler</h2>
            <p className="text-gray-600 whitespace-pre-line leading-relaxed">{reportData.strategicSummary}</p>
          </section>
        </div>
      </main>

      {/* Kontrol Paneli (Sağ Taraf) */}
      <aside className="w-[400px] bg-white border-l border-gray-200 p-6 overflow-y-auto">
        <div className="flex items-center text-2xl font-bold text-gray-800 mb-6">
          <Settings size={24} className="mr-3 text-blue-600"/> Kontrol Paneli
        </div>

        {/* Firma Bilgileri */}
        <div className="space-y-4 mb-6">
          <h3 className="font-semibold text-gray-600">Genel Bilgiler</h3>
          <input type="text" name="clientCompany" value={reportData.clientCompany} onChange={handleDataChange} placeholder="Müşteri Firma Adı" className="w-full p-2 border rounded-md text-sm"/>
          <input type="text" name="factoryAddress" value={reportData.factoryAddress} onChange={handleDataChange} placeholder="Fabrika Adresi" className="w-full p-2 border rounded-md text-sm"/>
          <input type="text" name="assessorName" value={reportData.assessorName} onChange={handleDataChange} placeholder="Analist Adı" className="w-full p-2 border rounded-md text-sm"/>
          <input type="date" name="assessmentDate" value={reportData.assessmentDate} onChange={handleDataChange} className="w-full p-2 border rounded-md text-sm text-gray-500"/>
          <div className="relative">
            <Link2 size={16} className="absolute left-2 top-2.5 text-gray-400"/>
            <input type="text" name="mapImageUrl" value={reportData.mapImageUrl} onChange={handleDataChange} placeholder="Harita Görsel URL'i" className="w-full p-2 pl-8 border rounded-md text-sm"/>
          </div>
        </div>
        
        {/* Analiz Maddeleri */}
        <div className="space-y-4 mb-6">
          <h3 className="font-semibold text-gray-600">Analiz Maddeleri</h3>
          {analysisItems.map(cat => (
            <div key={cat.id} className="bg-gray-50 p-3 rounded-lg border">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-sm text-gray-700">{cat.title}</h4>
                    <button onClick={() => addItem(cat.id)} className="text-blue-500 hover:text-blue-700"><PlusCircle size={18}/></button>
                </div>
                <div className="space-y-2">
                    {cat.items.map(item => (
                        <div key={item.id} className="bg-white p-2 rounded border">
                            <div className="flex items-center">
                                <input type="text" value={item.text} onChange={e => handleItemChange(cat.id, item.id, 'text', e.target.value)} className="flex-1 text-sm border-b focus:outline-none focus:border-blue-500"/>
                                <button onClick={() => removeItem(cat.id, item.id)} className="ml-2 text-red-400 hover:text-red-600"><XCircle size={16}/></button>
                            </div>
                            <div className="flex space-x-1 mt-2">
                                <button onClick={() => handleRiskChange(cat.id, item.id, 'high')} className={`px-1.5 py-0.5 text-xs rounded ${item.risk === 'high' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}>Yüksek</button>
                                <button onClick={() => handleRiskChange(cat.id, item.id, 'medium')} className={`px-1.5 py-0.5 text-xs rounded ${item.risk === 'medium' ? 'bg-amber-500 text-white' : 'bg-gray-200'}`}>Orta</button>
                                <button onClick={() => handleRiskChange(cat.id, item.id, 'low')} className={`px-1.5 py-0.5 text-xs rounded ${item.risk === 'low' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>Düşük</button>
                                <button onClick={() => handleRiskChange(cat.id, item.id, 'opportunity')} className={`p-1 text-xs rounded ${item.risk === 'opportunity' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}><Zap size={12}/></button>
                            </div>
                            <textarea value={item.notes} onChange={e => handleItemChange(cat.id, item.id, 'notes', e.target.value)} placeholder="Detaylı notlar..." className="w-full p-1 mt-2 border rounded-md text-xs h-16 resize-none"/>
                        </div>
                    ))}
                </div>
            </div>
          ))}
        </div>
        
        {/* Stratejik Özet Girişi */}
        <div className="space-y-2 mb-6">
            <h3 className="font-semibold text-gray-600">Stratejik Özet</h3>
            <textarea name="strategicSummary" value={reportData.strategicSummary} onChange={handleDataChange} className="w-full p-2 border rounded-md text-sm h-32 resize-none"/>
        </div>

        {/* İndirme Butonları */}
        <div>
           <h3 className="font-semibold text-gray-600 mb-2">Raporu İndir</h3>
           <div className="flex space-x-2">
            <button onClick={() => generateReport('pdf')} disabled={loading} className="flex-1 flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                <Download size={16} className="mr-2"/>{loading ? 'İşleniyor...' : 'PDF'}
            </button>
            <button onClick={() => generateReport('jpeg')} disabled={loading} className="flex-1 flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400">
                <Download size={16} className="mr-2"/>{loading ? 'İşleniyor...' : 'JPEG'}
            </button>
           </div>
        </div>
      </aside>
    </div>
  );
};

export default LocationAnalysisDashboard