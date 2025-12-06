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
  Maximize, 
  Minimize,
  X,
  Square,
  Hexagon,
  MousePointer
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// --- TİP TANIMLARI ---
type ShapeType = 'rectangle' | 'polygon';

interface Point {
  x: number;
  y: number;
}

interface RiskArea {
  id: string;
  type: ShapeType;
  points: Point[]; // Tüm köşe noktaları burada tutulur
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

// --- ANA COMPONENT ---
const RiskAreaIdentificationPage = () => {
  // --- STATE'LER ---
  const [layoutImage, setLayoutImage] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 }); // Resmin orijinal boyutları
  const [riskAreas, setRiskAreas] = useState<RiskArea[]>([]);
  
  // Çizim Araçları
  const [drawingTool, setDrawingTool] = useState<ShapeType>('rectangle');
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]); 
  const [tempMousePos, setTempMousePos] = useState<Point | null>(null);

  // Seçim ve Modal
  const [selectedRiskArea, setSelectedRiskArea] = useState<string | null>(null);
  const [showRiskDetailsModal, setShowRiskDetailsModal] = useState(false);
  const [drawMode, setDrawMode] = useState<'high' | 'medium' | 'low'>('medium');
  
  // UI
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Form Bilgileri
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

  // Renk Sabitleri
  const riskLevelColors = {
    high: 'rgba(239, 68, 68, 0.4)', 
    medium: 'rgba(245, 158, 11, 0.4)', 
    low: 'rgba(16, 185, 129, 0.4)' 
  };

  const riskLevelBorderColors = {
    high: '#EF4444',
    medium: '#F59E0B',
    low: '#10B981'
  };

  // --- DOSYA YÜKLEME ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLayoutImage(event.target?.result as string);
          setRiskAreas([]);
          setSelectedRiskArea(null);
          // Not: imageDimensions, resim <img> etiketinde yüklendiğinde (onLoad) set edilecek.
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

  // Resim yüklendiğinde orijinal boyutları al (KAYMAYI ÖNLEYEN KISIM)
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setImageDimensions({ width: naturalWidth, height: naturalHeight });
  };

  // --- KOORDİNAT HESAPLAMA (EKRAN -> ORİJİNAL RESİM) ---
  const getMousePos = (e: React.MouseEvent): Point => {
    if (!canvasRef.current || imageDimensions.width === 0) return { x: 0, y: 0 };
    
    const rect = canvasRef.current.getBoundingClientRect();
    
    // Mouse'un div içindeki yeri
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    
    // Ölçekleme faktörü (Gerçek Resim / Görünen Resim)
    const scaleX = imageDimensions.width / rect.width;
    const scaleY = imageDimensions.height / rect.height;

    return {
      x: clientX * scaleX,
      y: clientY * scaleY
    };
  };

  // --- ÇİZİM İŞLEMLERİ ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!layoutImage || selectedRiskArea) return;
    
    const pos = getMousePos(e);

    if (drawingTool === 'rectangle') {
      setIsDrawing(true);
      setCurrentPoints([pos]); // Başlangıç noktası
    } else if (drawingTool === 'polygon') {
      if (!isDrawing) {
        setIsDrawing(true);
        setCurrentPoints([pos]);
      } else {
        setCurrentPoints(prev => [...prev, pos]);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const pos = getMousePos(e);
    setTempMousePos(pos);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (drawingTool === 'rectangle' && isDrawing && currentPoints.length > 0) {
      const startPos = currentPoints[0];
      const endPos = getMousePos(e);

      // Çok küçük çizimleri engelle
      if (Math.abs(endPos.x - startPos.x) > (imageDimensions.width * 0.01)) {
        // Dikdörtgeni 4 nokta olarak kaydet (SVG polygon mantığıyla uyumlu olsun)
        const rectPoints = [
          { x: startPos.x, y: startPos.y },
          { x: endPos.x, y: startPos.y },
          { x: endPos.x, y: endPos.y },
          { x: startPos.x, y: endPos.y }
        ];
        finishShape(rectPoints, 'rectangle');
      } else {
        setIsDrawing(false);
        setCurrentPoints([]);
      }
    }
  };

  const handleDoubleClick = () => {
    if (drawingTool === 'polygon' && isDrawing && currentPoints.length >= 3) {
      finishShape(currentPoints, 'polygon');
    }
  };

  const finishShape = (points: Point[], type: ShapeType) => {
    const newArea: RiskArea = {
      id: `risk-${Date.now()}`,
      type,
      points,
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
    
    setIsDrawing(false);
    setCurrentPoints([]);
    setTempMousePos(null);
  };

  // --- YARDIMCI METODLAR ---
  const pointsToString = (points: Point[]) => {
    return points.map(p => `${p.x},${p.y}`).join(' ');
  };

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

  // --- PDF OLUŞTURMA (Sayfa Bölme Destekli) ---
  const generatePDF = async () => {
    if (!reportRef.current || !layoutImage) return;
    setLoading(true);

    try {
      const element = reportRef.current;
      
      // Canvas oluştururken scale: 2 kaliteyi artırır
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = 210;
      const pdfHeight = 297;
      
      // Canvas'ın PDF üzerindeki yüksekliği
      const imgHeightInPdf = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = imgHeightInPdf;
      let position = 0;

      // İlk sayfa
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeightInPdf);
      heightLeft -= pdfHeight;

      // İçerik taşarsa yeni sayfalar ekle
      while (heightLeft > 0) {
        position = heightLeft - imgHeightInPdf; // Bir sonraki sayfa için pozisyonu kaydır
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, -(pdfHeight - heightLeft) - pdfHeight , pdfWidth, imgHeightInPdf); 
        // Not: jsPDF sayfa bölme mantığı bazen karmaşıktır, basit döngü:
        // Her sayfa için `position` değerini `pageHeight` kadar yukarı çekiyoruz.
      }
      
      // Alternatif Basit Loop (Daha güvenilir):
      const pageCount = Math.ceil(imgHeightInPdf / pdfHeight);
      const newPdf = new jsPDF('p', 'mm', 'a4');
      for (let i = 0; i < pageCount; i++) {
        if (i > 0) newPdf.addPage();
        // Resmi her sayfada yukarı öteleyerek çiz
        newPdf.addImage(imgData, 'JPEG', 0, -(i * pdfHeight), pdfWidth, imgHeightInPdf);
      }

      newPdf.save(`Risk_Raporu_${reportInfo.customerName || 'Musteri'}.pdf`);
      setSuccess('PDF Başarıyla oluşturuldu!');
      setTimeout(() => setSuccess(null), 3000);

    } catch (err) {
      console.error(err);
      setError('PDF oluşturulurken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER ---
  return (
    <div className="container mx-auto px-4 py-8 font-sans">
      {/* BAŞLIK VE BUTONLAR */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Riskli Alan Belirleme Modülü</h1>
        <div className="flex space-x-3">
          <button
            onClick={generatePDF}
            disabled={!layoutImage || riskAreas.length === 0 || loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
          >
            {loading ? <span>Hazırlanıyor...</span> : <><Download size={18} /> <span>PDF İndir</span></>}
          </button>
          <button
            onClick={() => {
              if (isFullscreen) document.exitFullscreen();
              else fullscreenRef.current?.requestFullscreen();
            }}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        </div>
      </div>

      {/* BİLDİRİMLER */}
      {success && <div className="bg-green-100 text-green-800 p-3 rounded-lg mb-4 flex items-center"><CheckCircle size={18} className="mr-2"/>{success}</div>}
      {error && <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-4 flex items-center"><AlertTriangle size={18} className="mr-2"/>{error}</div>}

      <div className="grid lg:grid-cols-12 gap-6" ref={fullscreenRef}>
        
        {/* SOL: ÇİZİM VE DÜZENLEME */}
        <div className={`lg:col-span-7 bg-white p-4 rounded-xl shadow border flex flex-col ${isFullscreen ? 'h-screen overflow-auto' : ''}`}>
          
          {/* Araç Çubuğu */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 p-3 bg-gray-50 rounded border">
            <div className="flex items-center space-x-2 border-r pr-4">
              <span className="text-xs font-bold text-gray-500">ARAÇ:</span>
              <button 
                onClick={() => { setDrawingTool('rectangle'); setSelectedRiskArea(null); }}
                className={`p-2 rounded ${drawingTool === 'rectangle' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-500' : 'hover:bg-gray-200'}`}
                title="Dikdörtgen"
              >
                <Square size={20} />
              </button>
              <button 
                onClick={() => { setDrawingTool('polygon'); setSelectedRiskArea(null); }}
                className={`p-2 rounded ${drawingTool === 'polygon' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-500' : 'hover:bg-gray-200'}`}
                title="Poligon (Çokgen)"
              >
                <Hexagon size={20} />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-gray-500">RİSK:</span>
              {(['high', 'medium', 'low'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setDrawMode(level)}
                  className={`w-6 h-6 rounded-full border-2 ${drawMode === level ? 'ring-2 ring-offset-1 ring-gray-400' : ''}`}
                  style={{ backgroundColor: riskLevelColors[level], borderColor: riskLevelBorderColors[level] }}
                />
              ))}
            </div>

            <button onClick={() => {setRiskAreas([]); setLayoutImage(null);}} className="ml-auto text-red-500 hover:bg-red-50 p-2 rounded">
              <Trash2 size={18} />
            </button>
          </div>

          {/* Çizim Alanı */}
          <div 
            className="relative bg-gray-100 border-2 border-dashed border-gray-300 rounded overflow-hidden flex items-center justify-center min-h-[400px] select-none"
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onDoubleClick={handleDoubleClick}
          >
            {!layoutImage ? (
              <label className="cursor-pointer flex flex-col items-center">
                <Upload size={48} className="text-gray-400 mb-2" />
                <span className="text-gray-600 font-medium">Kroki Yükle</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            ) : (
              <div className="relative w-full h-full">
                {/* Resmi göster (pointer-events-none ki SVG tıklamaları alsın) */}
                <img 
                  src={layoutImage} 
                  onLoad={handleImageLoad}
                  alt="Kroki" 
                  className="w-full h-auto object-contain pointer-events-none" 
                />
                
                {/* SVG Overlay: viewBox sayesinde resimle birebir ölçeklenir */}
                <svg 
                  className="absolute inset-0 w-full h-full cursor-crosshair"
                  viewBox={`0 0 ${imageDimensions.width} ${imageDimensions.height}`}
                  preserveAspectRatio="none"
                >
                  {/* Mevcut Alanlar */}
                  {riskAreas.map((area, idx) => (
                    <g key={area.id} onClick={(e) => { e.stopPropagation(); setSelectedRiskArea(area.id); }}>
                      <polygon
                        points={pointsToString(area.points)}
                        fill={area.color}
                        stroke={selectedRiskArea === area.id ? 'blue' : riskLevelBorderColors[area.riskLevel]}
                        strokeWidth={selectedRiskArea === area.id ? imageDimensions.width * 0.008 : imageDimensions.width * 0.004}
                        className="cursor-pointer hover:opacity-90 transition-opacity"
                      />
                      {/* Basit etiket (Çizim sırasında sadece numara yeterli) */}
                      <text 
                        x={area.points[0].x} 
                        y={area.points[0].y} 
                        fill="black" 
                        fontSize={imageDimensions.width * 0.03} 
                        fontWeight="bold"
                        paintOrder="stroke"
                        stroke="white"
                        strokeWidth={imageDimensions.width * 0.005}
                      >
                        {idx + 1}
                      </text>
                    </g>
                  ))}

                  {/* Çizim Önizlemesi */}
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
                          strokeWidth={imageDimensions.width * 0.004}
                          strokeDasharray="10,10"
                        />
                      )}
                      {drawingTool === 'polygon' && currentPoints.length > 0 && (
                        <>
                          <polyline
                            points={pointsToString([...currentPoints, ...(tempMousePos ? [tempMousePos] : [])])}
                            fill="none"
                            stroke={riskLevelBorderColors[drawMode]}
                            strokeWidth={imageDimensions.width * 0.004}
                            strokeDasharray="10,10"
                          />
                          {currentPoints.map((p, i) => (
                            <circle key={i} cx={p.x} cy={p.y} r={imageDimensions.width * 0.005} fill="blue" />
                          ))}
                        </>
                      )}
                    </g>
                  )}
                </svg>

                {isDrawing && drawingTool === 'polygon' && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm pointer-events-none">
                    Bitirmek için çift tıkla
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* SAĞ: RAPOR ÖNİZLEME (PDF ÇIKTISI BURADAN ALINIR) */}
        <div className={`lg:col-span-5 flex flex-col gap-6 ${isFullscreen ? 'hidden' : ''}`}>
          
          {/* Giriş Formu */}
          <div className="bg-white p-4 rounded-xl shadow border">
            <h2 className="font-bold text-gray-700 mb-3 flex items-center"><FileText size={18} className="mr-2 text-blue-600"/> Rapor Bilgileri</h2>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input 
                placeholder="Firma Adı"
                className="border p-2 rounded text-sm"
                value={reportInfo.companyName}
                onChange={e => setReportInfo({...reportInfo, companyName: e.target.value})}
              />
              <input 
                placeholder="Müşteri Adı"
                className="border p-2 rounded text-sm"
                value={reportInfo.customerName}
                onChange={e => setReportInfo({...reportInfo, customerName: e.target.value})}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="flex-1 cursor-pointer bg-gray-50 border border-dashed rounded p-2 flex items-center justify-center text-xs hover:bg-gray-100">
                <Upload size={14} className="mr-1"/> Logo Yükle
                <input type="file" onChange={handleLogoUpload} className="hidden" accept="image/*" />
              </label>
              {reportInfo.companyLogo && (
                <button onClick={() => setReportInfo({...reportInfo, companyLogo: null})} className="text-red-500">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Gerçek Rapor Alanı */}
          <div className="bg-gray-100 p-2 rounded border overflow-auto max-h-[600px]">
            <div ref={reportRef} className="bg-white mx-auto p-8 shadow-sm" style={{ width: '210mm', minHeight: '297mm' }}>
              
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
                <div><span className="text-xs font-bold text-gray-500 block">Hizmet Veren</span>{reportInfo.companyName}</div>
                <div><span className="text-xs font-bold text-gray-500 block">Müşteri</span>{reportInfo.customerName}</div>
              </div>

              {/* Rapor Haritası (SVG ile birlikte) */}
              {layoutImage && (
                <div className="mb-8 border border-gray-200 rounded relative overflow-hidden">
                  <img src={layoutImage} className="w-full h-auto" alt="Rapor Kroki" />
                  
                  {/* RAPOR SVG: Burada isimleri de gösteriyoruz */}
                  <svg 
                    className="absolute inset-0 w-full h-full"
                    viewBox={`0 0 ${imageDimensions.width} ${imageDimensions.height}`}
                    preserveAspectRatio="none"
                  >
                    {riskAreas.map((area, idx) => {
                      // Yazı boyutu ve konumu hesaplama
                      const fontSize = imageDimensions.width * 0.02; // Dinamik font
                      const labelX = area.points[0].x;
                      const labelY = area.points[0].y;
                      const text = `${idx + 1} - ${area.riskName || getRiskLevelText(area.riskLevel)}`;
                      // Text genişliğini tahmini hesaplama (harf sayısı * font katsayısı)
                      const textWidth = text.length * (fontSize * 0.6) + (fontSize * 2);

                      return (
                        <g key={area.id}>
                          <polygon
                            points={pointsToString(area.points)}
                            fill={area.color}
                            stroke={riskLevelBorderColors[area.riskLevel]}
                            strokeWidth={imageDimensions.width * 0.005}
                          />
                          
                          {/* Etiket Grubu */}
                          <g transform={`translate(${labelX}, ${labelY})`}>
                            {/* Arka plan kutusu (Okunabilirlik için) */}
                            <rect 
                              x="0" 
                              y={-fontSize * 1.2} 
                              width={textWidth} 
                              height={fontSize * 1.5} 
                              fill="rgba(255, 255, 255, 0.9)" 
                              stroke="black"
                              strokeWidth={imageDimensions.width * 0.001}
                              rx={fontSize * 0.2}
                            />
                            {/* Yazı */}
                            <text 
                              x={fontSize * 0.5} 
                              y={-fontSize * 0.2} 
                              fill="black" 
                              fontSize={fontSize} 
                              fontWeight="bold"
                              fontFamily="Arial"
                            >
                              {text}
                            </text>
                          </g>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              )}

              {/* Tablo */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg border-b pb-2">Risk Detayları</h3>
                {riskAreas.map((area, index) => (
                  <div key={area.id} className="break-inside-avoid border rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">{index + 1}</span>
                      <h4 className="font-bold flex-1">{area.riskName || 'İsimsiz Risk'}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${
                        area.riskLevel === 'high' ? 'bg-red-50 text-red-700 border-red-200' :
                        area.riskLevel === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-green-50 text-green-700 border-green-200'
                      }`}>{getRiskLevelText(area.riskLevel)}</span>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 text-sm mt-3">
                      <div className="bg-gray-50 p-2 rounded">
                        <strong className="block text-xs text-gray-500 mb-1">Risk Tanımı</strong>
                        {area.riskDescription || '-'}
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <strong className="block text-xs text-gray-500 mb-1">Olası Sonuçlar</strong>
                        {area.potentialConsequences || '-'}
                      </div>
                      <div className="bg-blue-50 p-2 rounded border-blue-100 border">
                        <strong className="block text-xs text-blue-700 mb-1">Önerilen Aksiyon</strong>
                        {area.recommendedActions || '-'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Modal: Risk Düzenleme */}
      {showRiskDetailsModal && selectedRiskArea && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold">Risk Detaylarını Düzenle</h3>
              <button onClick={() => setShowRiskDetailsModal(false)}><X size={20} className="text-gray-400"/></button>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="text-sm font-medium block mb-1">Risk Adı</label>
                <input 
                  className="w-full border rounded p-2"
                  value={riskAreas.find(a => a.id === selectedRiskArea)?.riskName || ''}
                  onChange={(e) => setRiskAreas(riskAreas.map(a => a.id === selectedRiskArea ? {...a, riskName: e.target.value} : a))}
                />
              </div>
              
              <div>
                 <label className="text-sm font-medium block mb-1">Risk Seviyesi</label>
                 <div className="flex gap-2">
                    {(['high', 'medium', 'low'] as const).map(level => (
                       <button
                         key={level}
                         onClick={() => setRiskAreas(riskAreas.map(a => a.id === selectedRiskArea ? {...a, riskLevel: level, color: riskLevelColors[level]} : a))}
                         className={`flex-1 py-2 rounded border text-sm ${
                            riskAreas.find(a => a.id === selectedRiskArea)?.riskLevel === level 
                            ? 'bg-gray-800 text-white border-gray-800' 
                            : 'bg-white text-gray-600'
                         }`}
                       >
                         {getRiskLevelText(level)}
                       </button>
                    ))}
                 </div>
              </div>

              {['riskDescription', 'potentialConsequences', 'recommendedActions'].map((field) => (
                <div key={field}>
                  <label className="text-sm font-medium block mb-1 capitalize">
                    {field === 'riskDescription' ? 'Risk Tanımı' : field === 'potentialConsequences' ? 'Olası Sonuçlar' : 'Önerilen Aksiyon'}
                  </label>
                  <textarea 
                    className="w-full border rounded p-2 h-20 resize-none"
                    value={(riskAreas.find(a => a.id === selectedRiskArea) as any)[field] || ''}
                    onChange={(e) => setRiskAreas(riskAreas.map(a => a.id === selectedRiskArea ? {...a, [field]: e.target.value} : a))}
                  />
                </div>
              ))}
            </div>

            <div className="p-4 border-t bg-gray-50 flex justify-between">
              <button onClick={() => deleteRiskArea(selectedRiskArea)} className="text-red-600 text-sm font-medium">Sil</button>
              <button onClick={() => setShowRiskDetailsModal(false)} className="bg-blue-600 text-white px-4 py-2 rounded">Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskAreaIdentificationPage;