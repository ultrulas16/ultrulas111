import React, { useState, useMemo, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Compass, Building, FileText, Wind, ShieldCheck, Plus, Edit, Trash2, Image as ImageIcon, Download, Loader2, Building2, TreePine, MapPin } from 'lucide-react';

// --- VERİ YAPILARI (INTERFACES) ---

interface ReportInfo {
  clientName: string;
  facilityAddress: string;
  buildingType: string; // Yeni
  serviceType: string;  // Yeni
  analysisDate: string;
  analystName:string;
  pestControlCompanyName: string; // Yeni
  pestControlCompanyLogo: string | null; // Yeni
}

interface EnvironmentalFactor {
  id: string;
  name: string;
  type: 'Komşu İşletme' | 'Doğal Alan' | 'Atık Alanı' | 'Altyapı' | 'Diğer';
  distance: string;
  potentialPests: string;
  description: string;
  riskLevel: 'Düşük' | 'Orta' | 'Yüksek' | 'Kritik';
  recommendation: string;
  photo: string | null;
}

// --- YARDIMCI BİLEŞENLER ---

const FactorTypeIcon: React.FC<{ type: EnvironmentalFactor['type']; className?: string }> = ({ type, className = "h-6 w-6" }) => {
  switch (type) {
    case 'Komşu İşletme': return <Building2 className={`${className} text-gray-500`} />;
    case 'Doğal Alan': return <TreePine className={`${className} text-green-600`} />;
    case 'Atık Alanı': return <Trash2 className={`${className} text-amber-700`} />;
    case 'Altyapı': return <MapPin className={`${className} text-blue-600`} />;
    default: return <Wind className={`${className} text-gray-500`} />;
  }
};

const RiskLevelBadge: React.FC<{ level: EnvironmentalFactor['riskLevel'] }> = ({ level }) => {
  const baseClasses = "px-3 py-1 text-sm font-bold rounded-full";
  switch (level) {
    case 'Kritik': return <span className={`${baseClasses} bg-red-600 text-white`}>Kritik Risk</span>;
    case 'Yüksek': return <span className={`${baseClasses} bg-amber-500 text-white`}>Yüksek Risk</span>;
    case 'Orta': return <span className={`${baseClasses} bg-yellow-400 text-black`}>Orta Risk</span>;
    case 'Düşük': return <span className={`${baseClasses} bg-green-500 text-white`}>Düşük Risk</span>;
    default: return <span className={`${baseClasses} bg-gray-500 text-white`}>{level}</span>;
  }
};


// --- ANA BİLEŞEN ---

const EnvironmentalAnalysisModule: React.FC = () => {
  // --- STATE'LER ---
  const [reportInfo, setReportInfo] = useState<ReportInfo>({
    clientName: 'Örnek Sanayi A.Ş.',
    facilityAddress: 'Organize Sanayi Bölgesi, 12. Cadde No:5',
    buildingType: 'Betonarme Gıda Üretim Tesisi',
    serviceType: 'Entegre Zararlı Yönetimi (IPM)',
    analysisDate: new Date().toISOString().split('T')[0],
    analystName: 'Uzman Biyolog Ali Veli',
    pestControlCompanyName: 'PestMentor Profesyonel Çözümler',
    pestControlCompanyLogo: null,
  });

  const [factors, setFactors] = useState<EnvironmentalFactor[]>([]);
  const [selectedFactorId, setSelectedFactorId] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingFactor, setEditingFactor] = useState<EnvironmentalFactor | null>(null);
  const [loading, setLoading] = useState(false);
  const reportContainerRef = useRef<HTMLDivElement>(null);


  // --- TÜRETİLMİŞ STATE ---
  const selectedFactor = useMemo(() =>
    factors.find(f => f.id === selectedFactorId),
    [factors, selectedFactorId]
  );

  // --- HANDLER'LAR ---

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setReportInfo({ ...reportInfo, [e.target.name]: e.target.value });
  };
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setReportInfo(prev => ({ ...prev, pestControlCompanyLogo: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenModal = (factor?: EnvironmentalFactor) => {
    setEditingFactor(factor || {
      id: `factor_${Date.now()}`,
      name: '', type: 'Doğal Alan', distance: '', potentialPests: '',
      description: '', riskLevel: 'Orta', recommendation: '', photo: null,
    });
    setModalOpen(true);
  };
  
  const handleSaveFactor = (factorData: EnvironmentalFactor) => {
    const exists = factors.some(f => f.id === factorData.id);
    if (exists) {
      setFactors(factors.map(f => f.id === factorData.id ? factorData : f));
    } else {
      setFactors([...factors, factorData]);
    }
    setModalOpen(false);
  };
  
  const handleDeleteFactor = (factorId: string) => {
    if (window.confirm("Bu faktörü silmek istediğinizden emin misiniz?")) {
        setFactors(factors.filter(f => f.id !== factorId));
        if(selectedFactorId === factorId) setSelectedFactorId(null);
    }
  };
  
  const handleGenerateReport = async (format: 'pdf' | 'jpeg') => {
      if (!reportContainerRef.current) return;
      setLoading(true);

      const pageElements = reportContainerRef.current.querySelectorAll('.report-page');
      
      try {
          if (format === 'pdf') {
              const pdf = new jsPDF('p', 'mm', 'a4');
              for (let i = 0; i < pageElements.length; i++) {
                  const canvas = await html2canvas(pageElements[i] as HTMLElement, { scale: 2 });
                  const imgData = canvas.toDataURL('image/jpeg', 1.0);
                  const pageWidth = pdf.internal.pageSize.getWidth();
                  const pageHeight = pdf.internal.pageSize.getHeight();
                  const imgWidth = pageWidth;
                  const imgHeight = (canvas.height * imgWidth) / canvas.width;
                  let heightLeft = imgHeight;
                  let position = 0;
                  
                  if (i > 0) pdf.addPage();
                  pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
              }
              pdf.save(`${reportInfo.clientName} - Çevresel Risk Analizi.pdf`);
          } else { // JPEG
              for (let i = 0; i < pageElements.length; i++) {
                  const canvas = await html2canvas(pageElements[i] as HTMLElement, { scale: 2 });
                  const link = document.createElement('a');
                  link.download = `${reportInfo.clientName}-Sayfa-${i + 1}.jpg`;
                  link.href = canvas.toDataURL('image/jpeg', 1.0);
                  link.click();
                  await new Promise(resolve => setTimeout(resolve, 500)); // Tarayıcıyı yormamak için kısa bir bekleme
              }
          }
      } catch (error) {
          console.error("Rapor oluşturma hatası:", error);
          alert("Rapor oluşturulurken bir hata oluştu.");
      } finally {
          setLoading(false);
      }
  };


  // --- RENDER ---
  return (
    <>
      <div className="bg-gray-100 min-h-screen p-8 font-sans">
        <div className="container mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 flex items-center">
              <Compass className="mr-4 text-blue-600" /> Çevresel Risk Analizi
            </h1>
          </header>

          <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* SOL PANEL */}
            <aside className="lg:col-span-1 flex flex-col gap-8">
              {/* Rapor Bilgileri Formu */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><FileText className="mr-2 text-blue-600" />Rapor Bilgileri</h2>
                <div className="space-y-4 text-sm">
                    <input name="clientName" value={reportInfo.clientName} onChange={handleInfoChange} placeholder="Müşteri Adı" className="w-full p-2 border rounded"/>
                    <input name="facilityAddress" value={reportInfo.facilityAddress} onChange={handleInfoChange} placeholder="Tesis Adresi" className="w-full p-2 border rounded"/>
                    <input name="buildingType" value={reportInfo.buildingType} onChange={handleInfoChange} placeholder="Bina Türü" className="w-full p-2 border rounded"/>
                    <input name="serviceType" value={reportInfo.serviceType} onChange={handleInfoChange} placeholder="Hizmet Türü" className="w-full p-2 border rounded"/>
                    <input name="pestControlCompanyName" value={reportInfo.pestControlCompanyName} onChange={handleInfoChange} placeholder="İlaçlama Firması Adı" className="w-full p-2 border rounded"/>
                    <div className="flex items-center gap-4">
                        <label htmlFor="logo-upload" className="w-full text-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200 transition-colors">Logo Yükle</label>
                        <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                        {reportInfo.pestControlCompanyLogo && <img src={reportInfo.pestControlCompanyLogo} alt="logo" className="h-10"/>}
                    </div>
                </div>
              </div>

              {/* Çevresel Faktörler Listesi */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center"><Wind className="mr-2 text-blue-600" />Çevresel Faktörler</h2>
                    <button onClick={() => handleOpenModal()} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="space-y-3 max-h-[45vh] overflow-y-auto">
                    {factors.map(factor => (
                      <div key={factor.id} onClick={() => setSelectedFactorId(factor.id)} className={`p-4 rounded-lg cursor-pointer border-l-4 ${selectedFactorId === factor.id ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}>
                        <div className="flex items-center justify-between"><div className="flex items-center gap-3"><FactorTypeIcon type={factor.type} /><span className="font-semibold text-gray-800">{factor.name}</span></div><RiskLevelBadge level={factor.riskLevel} /></div>
                      </div>
                    ))}
                  </div>
              </div>

              {/* Rapor İndirme */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><Download className="mr-2 text-blue-600" />Raporu Dışa Aktar</h2>
                  <div className="flex gap-4">
                      <button onClick={() => handleGenerateReport('pdf')} disabled={loading} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400">
                          {loading ? <Loader2 className="animate-spin" /> : 'PDF'}
                      </button>
                      <button onClick={() => handleGenerateReport('jpeg')} disabled={loading} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:bg-gray-400">
                          {loading ? <Loader2 className="animate-spin" /> : 'JPEG'}
                      </button>
                  </div>
              </div>
            </aside>

            {/* SAĞ PANEL */}
            <section className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8">
              {/* Detay görünümü burada */}
              {!selectedFactor && <div className="flex flex-col items-center justify-center h-full text-center"><Compass className="h-24 w-24 text-gray-300" /><h3 className="mt-4 text-2xl font-bold text-gray-700">Analize Başlayın</h3><p className="mt-2 text-gray-500">Soldaki listeden bir faktör seçin veya yeni bir tane ekleyin.</p></div>}
              {selectedFactor && (
                  <div>
                    {/* ... seçilen faktörün detayları ... */}
                  </div>
              )}
            </section>
          </main>
        </div>
      </div>

      {/* Raporlama için Gizli Alan */}
      <div className="absolute -z-50 -left-[9999px] top-0">
          <ReportPreview ref={reportContainerRef} reportInfo={reportInfo} factors={factors} />
      </div>

      {/* Modal */}
      {isModalOpen && editingFactor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
             <h2 className="text-2xl font-bold mb-6">{editingFactor.id.startsWith('factor_') ? 'Yeni Çevresel Faktör Ekle' : 'Faktörü Düzenle'}</h2>
             {/* Modal formu burada olacak. Detaylı form yapısı için önceki yanıtlara bakabilirsiniz. */}
             <div className="flex justify-end gap-4 mt-6">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">İptal</button>
                <button onClick={() => handleSaveFactor(editingFactor)} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Kaydet</button>
             </div>
          </div>
        </div>
      )}
    </>
  );
};

// --- RAPOR ÖNİZLEME BİLEŞENİ ---
const ReportPreview = React.forwardRef<HTMLDivElement, { reportInfo: ReportInfo, factors: EnvironmentalFactor[] }>(({ reportInfo, factors }, ref) => {
    
    // Faktörleri sayfalara bölmek için (her sayfada 2 faktör detayı)
    const factorsPerPage = 2;
    const factorPages = [];
    for (let i = 0; i < factors.length; i += factorsPerPage) {
        factorPages.push(factors.slice(i, i + factorsPerPage));
    }
    
    return (
        <div ref={ref}>
            {/* Sayfa 1: Kapak */}
            <div className="report-page">
                {/* Her sayfanın başlığı ve alt bilgisi için ortak bir yapı kullanılabilir. */}
                <div className="p-8 h-full flex flex-col justify-between">
                    <div>
                        {reportInfo.pestControlCompanyLogo && <img src={reportInfo.pestControlCompanyLogo} alt="logo" className="h-20 mb-10"/>}
                        <h1 className="text-4xl font-bold text-gray-900">ÇEVRESEL RİSK ANALİZ RAPORU</h1>
                        <h2 className="text-2xl text-gray-700 mt-4">{reportInfo.clientName}</h2>
                    </div>
                    <div className="text-sm border-t pt-4">
                        <p><strong>Tesis Adresi:</strong> {reportInfo.facilityAddress}</p>
                        <p><strong>Analiz Tarihi:</strong> {new Date(reportInfo.analysisDate).toLocaleDateString('tr-TR')}</p>
                        <p><strong>Hazırlayan:</strong> {reportInfo.pestControlCompanyName} - {reportInfo.analystName}</p>
                    </div>
                </div>
            </div>

            {/* Sayfa 2: Özet */}
            <div className="report-page">
                 <div className="p-8 h-full">
                    <h2 className="text-2xl font-bold border-b pb-2 mb-4">Analiz Özeti</h2>
                    <p>Bu rapor, <strong>{reportInfo.clientName}</strong> tesisinin çevresindeki zararlı risklerini oluşturan faktörleri ve bu risklere karşı alınması gereken önlemleri içermektedir.</p>
                    <h3 className="text-xl font-bold mt-6 mb-2">Tespit Edilen Faktörler ve Risk Seviyeleri</h3>
                    <table className="w-full text-left border-collapse">
                        <thead><tr className="bg-gray-100"><th className="border p-2">Faktör</th><th className="border p-2">Türü</th><th className="border p-2">Risk Seviyesi</th></tr></thead>
                        <tbody>{factors.map(f=><tr key={f.id}><td className="border p-2">{f.name}</td><td className="border p-2">{f.type}</td><td className="border p-2">{f.riskLevel}</td></tr>)}</tbody>
                    </table>
                 </div>
            </div>

            {/* Diğer Sayfalar: Faktör Detayları */}
            {factorPages.map((pageFactors, pageIndex) => (
                <div key={pageIndex} className="report-page">
                    <div className="p-8 h-full">
                        <h2 className="text-2xl font-bold border-b pb-2 mb-4">Faktör Detayları - Sayfa {pageIndex + 1}</h2>
                        {pageFactors.map(factor => (
                            <div key={factor.id} className="mb-6 pb-6 border-b last:border-b-0">
                                <h3 className="text-xl font-bold">{factor.name} ({factor.type}) - <span className="font-normal">{factor.riskLevel} Risk</span></h3>
                                <p><strong>Uzaklık:</strong> {factor.distance}</p>
                                <p><strong>Açıklama:</strong> {factor.description}</p>
                                <p><strong>Potansiyel Zararlılar:</strong> {factor.potentialPests}</p>
                                <p className="mt-2 p-2 bg-green-50 text-green-800 rounded"><strong>Öneri:</strong> {factor.recommendation}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
});

// Stiller (CSS-in-JS olarak eklemek daha iyi olabilir, ama basitlik için burada)
// Bu stilleri bir <style> etiketiyle veya global CSS dosyanıza ekleyebilirsiniz.
// Örnek:
// .report-page { width: 210mm; min-height: 297mm; background: white; page-break-after: always; }

export default EnvironmentalAnalysisModule;