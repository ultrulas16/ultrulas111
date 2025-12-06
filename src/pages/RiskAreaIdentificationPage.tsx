import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Trash2, 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  Image as ImageIcon, 
  FileText, 
  Target, 
  Move, 
  Edit, 
  X, 
  Maximize, 
  Minimize,
  Calendar,
  Building,
  User,
  Hexagon,
  Square,
  MousePointerClick
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// Tipler
type ShapeType = 'rectangle' | 'polygon';

interface Point {
  x: number;
  y: number;
}

interface RiskArea {
  id: string;
  type: ShapeType;
  points: Point[]; // Poligon için noktalar
  x: number; // Dikdörtgen için (veya poligon bounding box)
  y: number;
  width: number;
  height: number;
  color: string;
  riskLevel: 'high' | 'medium' | 'low';
  riskName: string;
  riskDescription: string;
  potentialConsequences: string;
  recommendedActions: string;
}

interface ReportInfo {
  companyName: string;
  companyLogo: string | null;
  customerName: string;
  revisionDate: string;
}

const RiskAreaIdentificationPage = () => {
  // --- State Tanımları ---
  const [layoutImage, setLayoutImage] = useState<string | null>(null);
  const [riskAreas, setRiskAreas] = useState<RiskArea[]>([]);
  
  // Çizim Modu State'leri
  const [drawingTool, setDrawingTool] = useState<ShapeType>('rectangle');
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]); // Poligon veya Rect için geçici noktalar
  const [tempMousePos, setTempMousePos] = useState<Point | null>(null); // Poligon çizimi sırasında mouse takibi

  // Seçim ve Düzenleme State'leri
  const [selectedRiskArea, setSelectedRiskArea] = useState<string | null>(null);
  const [showRiskDetailsModal, setShowRiskDetailsModal] = useState(false);
  const [drawMode, setDrawMode] = useState<'high' | 'medium' | 'low'>('medium');
  
  // UI State'leri
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Form State'i
  const [reportInfo, setReportInfo] = useState<ReportInfo>({
    companyName: 'PestMentor',
    companyLogo: null,
    customerName: '',
    revisionDate: new Date().toISOString().split('T')[0]
  });
  
  // Refs
  const canvasRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  
  // Renkler
  const riskLevelColors = {
    high: 'rgba(239, 68, 68, 0.5)', // red
    medium: 'rgba(245, 158, 11, 0.5)', // amber
    low: 'rgba(16, 185, 129, 0.5)' // green
  };

  const riskLevelBorderColors = {
    high: 'rgb(239, 68, 68)',
    medium: 'rgb(245, 158, 11)',
    low: 'rgb(16, 185, 129)'
  };

  // --- Dosya Yükleme ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLayoutImage(event.target?.result as string);
          setRiskAreas([]);
          setSelectedRiskArea(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setReportInfo(prev => ({ ...prev, companyLogo: event.target?.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Koordinat Yardımcıları ---
  const getMousePos = (e: React.MouseEvent): Point => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  // --- Çizim İşlemleri (SVG Üzerinde) ---

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!layoutImage || selectedRiskArea) return; // Seçiliyken çizim yapma
    
    const pos = getMousePos(e);

    if (drawingTool === 'rectangle') {
      setIsDrawing(true);
      setCurrentPoints([pos]); // Başlangıç noktası
    } else if (drawingTool === 'polygon') {
      // Poligon mantığı: Her tıklama bir nokta ekler
      if (!isDrawing) {
        setIsDrawing(true);
        setCurrentPoints([pos]);
      } else {
        // Çizim devam ediyor, yeni nokta ekle
        setCurrentPoints(prev => [...prev, pos]);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const pos = getMousePos(e);
    setTempMousePos(pos);

    if (isDrawing && drawingTool === 'rectangle') {
      // Dikdörtgen sürüklenirken sadece son noktayı güncellemiyoruz, render kısmında start ve current mouse pos kullanacağız
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (drawingTool === 'rectangle' && isDrawing) {
      const endPos = getMousePos(e);
      const startPos = currentPoints[0];

      // Minimum boyut kontrolü (yanlışlıkla tıklamaları önlemek için)
      if (Math.abs(endPos.x - startPos.x) > 10 && Math.abs(endPos.y - startPos.y) > 10) {
        finishShape([startPos, endPos], 'rectangle');
      } else {
        setIsDrawing(false);
        setCurrentPoints([]);
      }
    }
  };

  // Poligonu kapatma (Çift tıklama veya ilk noktaya tıklama)
  const handleDoubleClick = () => {
    if (drawingTool === 'polygon' && isDrawing && currentPoints.length >= 3) {
      finishShape(currentPoints, 'polygon');
    }
  };

  const finishShape = (points: Point[], type: ShapeType) => {
    let finalPoints = points;
    let x = 0, y = 0, width = 0, height = 0;

    if (type === 'rectangle') {
      // Dikdörtgen için noktaları normalize et (sol-üst, sağ-alt)
      const p1 = points[0];
      const p2 = points[1];
      x = Math.min(p1.x, p2.x);
      y = Math.min(p1.y, p2.y);
      width = Math.abs(p1.x - p2.x);
      height = Math.abs(p1.y - p2.y);
      // SVG rect için noktalar bu x,y,w,h'den türetilir, ama veri yapımızda points tutabiliriz veya dönüştürebiliriz.
      // Tutarlılık için rectangle'ı da 4 nokta olarak kaydedelim.
      finalPoints = [
        { x, y },
        { x: x + width, y },
        { x: x + width, y: y + height },
        { x, y: y + height }
      ];
    } else {
      // Poligon için bounding box hesapla (ikon yerleşimi vs için lazım olabilir)
      const xs = points.map(p => p.x);
      const ys = points.map(p => p.y);
      x = Math.min(...xs);
      y = Math.min(...ys);
      width = Math.max(...xs) - x;
      height = Math.max(...ys) - y;
    }

    const newArea: RiskArea = {
      id: `risk-${Date.now()}`,
      type,
      points: finalPoints,
      x, y, width, height,
      color: riskLevelColors[drawMode],
      riskLevel: drawMode,
      riskName: '',
      riskDescription: '',
      potentialConsequences: '',
      recommendedActions: ''
    };

    setRiskAreas([...riskAreas, newArea]);
    setSelectedRiskArea(newArea.id);
    setShowRiskDetailsModal(true);
    
    // Reset
    setIsDrawing(false);
    setCurrentPoints([]);
    setTempMousePos(null);
    // Poligon çiziminden sonra otomatik olarak araca devam etmek isteyebilirler ama
    // şimdilik kullanıcıyı yormamak için seçime geçiyoruz.
  };

  // --- Yardımcı Render Fonksiyonları (SVG) ---
  const pointsToString = (points: Point[]) => {
    return points.map(p => `${p.x},${p.y}`).join(' ');
  };

  // --- PDF Çıktı ---
  const generatePDF = async () => {
    if (!reportRef.current || !layoutImage) return;
    setLoading(true);

    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // Kalite için
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // İlk sayfa
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Diğer sayfalar (içerik uzunsa)
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Riskli_Alan_Raporu_${reportInfo.customerName || 'Musteri'}.pdf`);
      setSuccess('PDF başarıyla oluşturuldu.');
      setTimeout(() => setSuccess(null), 3000);

    } catch (err) {
      console.error(err);
      setError('PDF oluşturulurken hata meydana geldi.');
    } finally {
      setLoading(false);
    }
  };

  // --- Silme ve Düzenleme ---
  const deleteRiskArea = (id: string) => {
    setRiskAreas(riskAreas.filter(a => a.id !== id));
    if (selectedRiskArea === id) setSelectedRiskArea(null);
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'high': return 'Yüksek Risk';
      case 'medium': return 'Orta Risk';
      case 'low': return 'Düşük Risk';
      default: return '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Üst Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Riskli Alan Belirleme</h1>
        <div className="flex space-x-3">
          <button
            onClick={generatePDF}
            disabled={!layoutImage || riskAreas.length === 0 || loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <span>İşleniyor...</span> : <><Download size={18} /> <span>Rapor (PDF)</span></>}
          </button>
          
          <button
            onClick={() => {
              if (isFullscreen) document.exitFullscreen();
              else fullscreenRef.current?.requestFullscreen();
            }}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center"
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        </div>
      </div>

      {/* Mesajlar */}
      {success && <div className="bg-green-100 text-green-800 p-3 rounded-lg mb-4 flex items-center"><CheckCircle size={18} className="mr-2"/>{success}</div>}
      {error && <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-4 flex items-center"><AlertTriangle size={18} className="mr-2"/>{error}</div>}

      {/* Ana Grid */}
      <div className="grid lg:grid-cols-12 gap-6" ref={fullscreenRef}>
        
        {/* SOL KOLON: Ayarlar ve Çizim Alanı (8 birim) */}
        <div className={`lg:col-span-7 bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col ${isFullscreen ? 'h-screen overflow-auto' : ''}`}>
          
          {/* Çizim Araç Çubuğu */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
             {/* Araçlar */}
             <div className="flex items-center space-x-2 border-r pr-4 border-gray-300">
                <span className="text-xs font-semibold text-gray-500 uppercase">Araç:</span>
                <button 
                  onClick={() => { setDrawingTool('rectangle'); setSelectedRiskArea(null); }}
                  className={`p-2 rounded ${drawingTool === 'rectangle' ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500' : 'hover:bg-gray-200'}`}
                  title="Dikdörtgen Çiz"
                >
                  <Square size={20} />
                </button>
                <button 
                  onClick={() => { setDrawingTool('polygon'); setSelectedRiskArea(null); }}
                  className={`p-2 rounded ${drawingTool === 'polygon' ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500' : 'hover:bg-gray-200'}`}
                  title="Serbest Çokgen Çiz"
                >
                  <Hexagon size={20} />
                </button>
                <div className="text-xs text-gray-500 ml-2">
                    {drawingTool === 'rectangle' ? 'Tıkla ve Sürükle' : 'Noktaları Tıkla (Bitirmek için çift tıkla)'}
                </div>
             </div>

             {/* Risk Seviyesi */}
             <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-gray-500 uppercase">Risk:</span>
                {(['high', 'medium', 'low'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setDrawMode(level)}
                    className={`w-6 h-6 rounded-full border-2 ${drawMode === level ? 'ring-2 ring-offset-1 ring-gray-400' : ''}`}
                    style={{ 
                      backgroundColor: riskLevelColors[level], 
                      borderColor: riskLevelBorderColors[level] 
                    }}
                    title={getRiskLevelText(level)}
                  />
                ))}
             </div>

             {/* İşlemler */}
             <div className="flex items-center space-x-2 ml-auto">
               <button onClick={() => {setRiskAreas([]); setLayoutImage(null);}} className="text-red-500 hover:bg-red-50 p-2 rounded">
                 <Trash2 size={18} />
               </button>
             </div>
          </div>

          {/* Çizim Alanı (Canvas/SVG) */}
          <div 
            className="relative bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden flex items-center justify-center min-h-[400px] select-none"
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onDoubleClick={handleDoubleClick}
          >
            {!layoutImage ? (
              <label className="cursor-pointer flex flex-col items-center">
                <Upload size={48} className="text-gray-400 mb-2" />
                <span className="text-gray-500 font-medium">Kroki Yüklemek için Tıklayın</span>
                <span className="text-xs text-gray-400">JPEG, PNG</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            ) : (
              <div className="relative w-full h-full">
                <img src={layoutImage} alt="Layout" className="w-full h-auto object-contain pointer-events-none select-none" />
                
                {/* SVG Overlay Katmanı */}
                <svg className="absolute inset-0 w-full h-full cursor-crosshair">
                  {/* 1. Kaydedilmiş Alanlar */}
                  {riskAreas.map((area) => (
                    <g key={area.id} onClick={(e) => { e.stopPropagation(); setSelectedRiskArea(area.id); }}>
                      <polygon
                        points={pointsToString(area.points)}
                        fill={area.color}
                        stroke={selectedRiskArea === area.id ? 'blue' : riskLevelBorderColors[area.riskLevel]}
                        strokeWidth={selectedRiskArea === area.id ? 3 : 1.5}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                      />
                      {/* Risk Numarası/Label */}
                      <rect 
                        x={area.x} y={area.y - 20} 
                        width={100} height={20} 
                        fill="rgba(0,0,0,0.7)" 
                        rx={4}
                      />
                      <text x={area.x + 5} y={area.y - 5} fill="white" fontSize="12">
                         {area.riskName || getRiskLevelText(area.riskLevel)}
                      </text>
                    </g>
                  ))}

                  {/* 2. Aktif Çizim (Henüz kaydedilmemiş) */}
                  {isDrawing && (
                    <g pointerEvents="none">
                      {drawingTool === 'rectangle' && currentPoints.length > 0 && tempMousePos && (
                        <rect
                          x={Math.min(currentPoints[0].x, tempMousePos.x)}
                          y={Math.min(currentPoints[0].y, tempMousePos.y)}
                          width={Math.abs(tempMousePos.x - currentPoints[0].x)}
                          height={Math.abs(tempMousePos.y - currentPoints[0].y)}
                          fill={riskLevelColors[drawMode]}
                          stroke={riskLevelBorderColors[drawMode]}
                          strokeDasharray="5,5"
                        />
                      )}
                      {drawingTool === 'polygon' && currentPoints.length > 0 && (
                        <>
                          <polyline
                            points={pointsToString([...currentPoints, ...(tempMousePos ? [tempMousePos] : [])])}
                            fill="none"
                            stroke={riskLevelBorderColors[drawMode]}
                            strokeWidth="2"
                            strokeDasharray="5,5"
                          />
                          {/* Noktaları göster */}
                          {currentPoints.map((p, i) => (
                            <circle key={i} cx={p.x} cy={p.y} r="3" fill="blue" />
                          ))}
                        </>
                      )}
                    </g>
                  )}
                </svg>

                {/* Poligon İpucu */}
                {isDrawing && drawingTool === 'polygon' && (
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm pointer-events-none">
                    Bitirmek için çift tıklayın
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* SAĞ KOLON: Rapor Bilgileri ve Önizleme (5 birim) */}
        <div className={`lg:col-span-5 flex flex-col gap-6 ${isFullscreen ? 'hidden' : ''}`}>
          
          {/* Firma Bilgileri Formu */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h2 className="font-bold text-gray-700 mb-4 flex items-center"><FileText size={20} className="mr-2 text-blue-600"/> Rapor Başlığı</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500">Firma Adı</label>
                  <input 
                    type="text" 
                    value={reportInfo.companyName}
                    onChange={e => setReportInfo({...reportInfo, companyName: e.target.value})}
                    className="w-full text-sm border rounded p-2" 
                  />
                </div>
                <div>
                   <label className="text-xs text-gray-500">Müşteri</label>
                   <input 
                    type="text" 
                    value={reportInfo.customerName}
                    onChange={e => setReportInfo({...reportInfo, customerName: e.target.value})}
                    className="w-full text-sm border rounded p-2" 
                   />
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <label className="flex-1 cursor-pointer bg-gray-50 border border-dashed rounded p-2 flex items-center justify-center text-xs text-gray-600 hover:bg-gray-100">
                    <Upload size={14} className="mr-1"/> Logo Yükle
                    <input type="file" onChange={handleLogoUpload} className="hidden" accept="image/*" />
                 </label>
                 {reportInfo.companyLogo && (
                    <div className="h-8 w-8 relative">
                      <img src={reportInfo.companyLogo} className="h-full w-full object-contain" />
                      <button onClick={() => setReportInfo({...reportInfo, companyLogo: null})} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><X size={10}/></button>
                    </div>
                 )}
              </div>
            </div>
          </div>

          {/* Rapor Önizleme (Raporun render edileceği gerçek alan) */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <h2 className="font-bold text-gray-700 mb-4">Rapor Önizleme</h2>
            <div className="overflow-auto max-h-[600px] border bg-gray-50 p-2">
              
              {/* --- RAPOR ŞABLONU BAŞLANGICI --- */}
              <div ref={reportRef} className="bg-white mx-auto shadow-sm p-8" style={{ width: '210mm', minHeight: '297mm' }}>
                
                {/* Rapor Header */}
                <div className="border-b-2 border-gray-800 pb-4 mb-6 flex justify-between items-end">
                   <div>
                     <h1 className="text-2xl font-bold text-gray-900">RİSK ANALİZ RAPORU</h1>
                     <p className="text-sm text-gray-500 mt-1">Tarih: {reportInfo.revisionDate}</p>
                   </div>
                   {reportInfo.companyLogo ? (
                     <img src={reportInfo.companyLogo} className="h-16 object-contain" alt="Logo" />
                   ) : (
                     <div className="text-xl font-bold text-gray-400">{reportInfo.companyName}</div>
                   )}
                </div>

                {/* Bilgiler */}
                <div className="grid grid-cols-2 gap-6 mb-8 bg-gray-50 p-4 rounded">
                    <div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase mb-1">Hizmet Veren</h3>
                      <p className="font-semibold">{reportInfo.companyName}</p>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase mb-1">Müşteri</h3>
                      <p className="font-semibold">{reportInfo.customerName}</p>
                    </div>
                </div>

                {/* Kroki Görüntüsü */}
                {layoutImage && (
                  <div className="mb-8 border border-gray-200 rounded relative overflow-hidden">
                    <img src={layoutImage} className="w-full h-auto" />
                    {/* SVG'yi rapora statik olarak basıyoruz, etkileşim yok */}
                    <svg className="absolute inset-0 w-full h-full">
                       {riskAreas.map(area => (
                         <g key={area.id}>
                            <polygon
                              points={pointsToString(area.points)}
                              fill={area.color}
                              stroke={riskLevelBorderColors[area.riskLevel]}
                              strokeWidth="2"
                            />
                            {/* Numara etiketi */}
                            <circle cx={area.x + 10} cy={area.y + 10} r="10" fill="black"/>
                            <text x={area.x + 10} y={area.y + 14} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                              {riskAreas.indexOf(area) + 1}
                            </text>
                         </g>
                       ))}
                    </svg>
                  </div>
                )}

                {/* Risk Tablosu */}
                <div className="space-y-6">
                   <h3 className="font-bold text-lg border-b pb-2 mb-4">Tespit Edilen Riskler ve Aksiyonlar</h3>
                   {riskAreas.length === 0 ? (
                     <p className="text-gray-500 italic text-center py-4">Henüz işaretlenmiş bir risk alanı bulunmuyor.</p>
                   ) : (
                     riskAreas.map((area, index) => (
                       <div key={area.id} className="break-inside-avoid border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-sm">
                          <div className="flex items-center gap-3 mb-3">
                             <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">{index + 1}</span>
                             <h4 className="font-bold text-gray-800 flex-1">{area.riskName || 'İsimsiz Risk Alanı'}</h4>
                             <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${
                               area.riskLevel === 'high' ? 'bg-red-50 text-red-700 border-red-200' :
                               area.riskLevel === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                               'bg-green-50 text-green-700 border-green-200'
                             }`}>
                               {getRiskLevelText(area.riskLevel)}
                             </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                             <div className="bg-gray-50 p-2 rounded">
                               <p className="font-semibold text-gray-600 text-xs mb-1">Risk Tanımı</p>
                               <p>{area.riskDescription || '-'}</p>
                             </div>
                             <div className="bg-gray-50 p-2 rounded">
                               <p className="font-semibold text-gray-600 text-xs mb-1">Olası Sonuçlar</p>
                               <p>{area.potentialConsequences || '-'}</p>
                             </div>
                             <div className="bg-blue-50 p-2 rounded border border-blue-100">
                               <p className="font-semibold text-blue-700 text-xs mb-1">Önerilen Aksiyon</p>
                               <p className="text-gray-800">{area.recommendedActions || '-'}</p>
                             </div>
                          </div>
                       </div>
                     ))
                   )}
                </div>

                <div className="mt-8 text-center text-xs text-gray-400 border-t pt-4">
                  Bu rapor PestMentor sistemi tarafından oluşturulmuştur.
                </div>

              </div>
              {/* --- RAPOR ŞABLONU SONU --- */}

            </div>
          </div>
        </div>
      </div>

      {/* Modal: Risk Detayları */}
      {showRiskDetailsModal && selectedRiskArea && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
               <h3 className="font-bold text-lg">Risk Detaylarını Düzenle</h3>
               <button onClick={() => setShowRiskDetailsModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Risk Adı / Başlık</label>
                 <input 
                    type="text" 
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Örn: Açık Gider Deliği"
                    value={riskAreas.find(a => a.id === selectedRiskArea)?.riskName || ''}
                    onChange={(e) => {
                       setRiskAreas(riskAreas.map(a => a.id === selectedRiskArea ? {...a, riskName: e.target.value} : a));
                    }}
                 />
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Risk Seviyesi</label>
                 <div className="flex space-x-2">
                    {(['high', 'medium', 'low'] as const).map(level => (
                       <button
                         key={level}
                         onClick={() => setRiskAreas(riskAreas.map(a => a.id === selectedRiskArea ? {...a, riskLevel: level, color: riskLevelColors[level]} : a))}
                         className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            riskAreas.find(a => a.id === selectedRiskArea)?.riskLevel === level 
                            ? `bg-${level === 'high' ? 'red' : level === 'medium' ? 'amber' : 'green'}-100 border-${level === 'high' ? 'red' : level === 'medium' ? 'amber' : 'green'}-500 text-black`
                            : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                         }`}
                       >
                         {getRiskLevelText(level)}
                       </button>
                    ))}
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Risk Tanımı</label>
                 <textarea 
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none"
                    placeholder="Riskin ne olduğunu açıklayın..."
                    value={riskAreas.find(a => a.id === selectedRiskArea)?.riskDescription || ''}
                    onChange={(e) => setRiskAreas(riskAreas.map(a => a.id === selectedRiskArea ? {...a, riskDescription: e.target.value} : a))}
                 />
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Olası Sonuçlar</label>
                 <textarea 
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none"
                    placeholder="Bu risk neye sebep olabilir?"
                    value={riskAreas.find(a => a.id === selectedRiskArea)?.potentialConsequences || ''}
                    onChange={(e) => setRiskAreas(riskAreas.map(a => a.id === selectedRiskArea ? {...a, potentialConsequences: e.target.value} : a))}
                 />
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1 text-blue-700">Önerilen Aksiyon (Çözüm)</label>
                 <textarea 
                    className="w-full border border-blue-200 bg-blue-50 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none"
                    placeholder="Bu risk nasıl giderilebilir?"
                    value={riskAreas.find(a => a.id === selectedRiskArea)?.recommendedActions || ''}
                    onChange={(e) => setRiskAreas(riskAreas.map(a => a.id === selectedRiskArea ? {...a, recommendedActions: e.target.value} : a))}
                 />
               </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
               <button 
                 onClick={() => deleteRiskArea(selectedRiskArea)}
                 className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium mr-auto"
               >
                 Alanı Sil
               </button>
               <button 
                 onClick={() => setShowRiskDetailsModal(false)}
                 className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium shadow-sm"
               >
                 Kaydet ve Kapat
               </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default RiskAreaIdentificationPage;