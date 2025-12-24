import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Upload, 
  Trash2, 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  Maximize, 
  Minimize,
  X,
  Square,
  Hexagon,
  ZoomIn,
  ZoomOut,
  Undo,
  Redo,
  Save,
  RefreshCw,
  Move
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
  points: Point[];
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
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  
  // Geçmiş (Undo/Redo)
  const [riskAreas, setRiskAreas] = useState<RiskArea[]>([]);
  const [history, setHistory] = useState<RiskArea[][]>([]);
  const [historyStep, setHistoryStep] = useState(0);

  // Zoom ve Pan
  const [scale, setScale] = useState(1);
  const [panning, setPanning] = useState(false);
  const [panOrigin, setPanOrigin] = useState<Point>({ x: 0, y: 0 });
  const [translate, setTranslate] = useState<Point>({ x: 0, y: 0 });
  
  // Çizim Araçları
  const [drawingTool, setDrawingTool] = useState<ShapeType | 'move'>('rectangle');
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
  const [autoSaved, setAutoSaved] = useState(false);

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

  // --- LOCAL STORAGE & INIT ---
  useEffect(() => {
    const savedData = localStorage.getItem('riskReportDraft');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.riskAreas) setRiskAreas(parsed.riskAreas);
        if (parsed.reportInfo) setReportInfo(parsed.reportInfo);
        // Resim verisi çok büyük olabileceği için bazen localStorage limitine takılabilir
        // Bu örnekte basitleştirilmiş olarak alıyoruz.
      } catch (e) {
        console.error("Kayıtlı veri yüklenemedi");
      }
    }
  }, []);

  // Değişiklik olduğunda kaydet
  useEffect(() => {
    const timer = setTimeout(() => {
      if (riskAreas.length > 0 || reportInfo.customerName) {
        localStorage.setItem('riskReportDraft', JSON.stringify({
          riskAreas,
          reportInfo
        }));
        setAutoSaved(true);
        setTimeout(() => setAutoSaved(false), 2000);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [riskAreas, reportInfo]);

  // --- HISTORY YÖNETİMİ ---
  const updateRiskAreasWithHistory = (newAreas: RiskArea[]) => {
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(newAreas);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
    setRiskAreas(newAreas);
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      const prevStep = historyStep - 1;
      setRiskAreas(history[prevStep]);
      setHistoryStep(prevStep);
    } else if (historyStep === 0) {
      // Başlangıca dön
      setRiskAreas([]);
      setHistoryStep(-1);
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      const nextStep = historyStep + 1;
      setRiskAreas(history[nextStep]);
      setHistoryStep(nextStep);
    }
  };

  // İlk yüklemede history başlat
  useEffect(() => {
    if (history.length === 0 && riskAreas.length > 0) {
      setHistory([riskAreas]);
      setHistoryStep(0);
    }
  }, [riskAreas]); // Dependency array riskAreas is tricky here, but needed for init logic

  // --- KLAVYE KISAYOLLARI ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
      if (e.key === 'Escape') {
        setIsDrawing(false);
        setCurrentPoints([]);
        setSelectedRiskArea(null);
      }
      if (e.key === 'Delete' && selectedRiskArea) {
        deleteRiskArea(selectedRiskArea);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyStep, selectedRiskArea, riskAreas]); // Dependencies updated

  // --- DOSYA YÜKLEME ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLayoutImage(event.target?.result as string);
          setRiskAreas([]);
          setHistory([]);
          setHistoryStep(-1);
          setSelectedRiskArea(null);
          setScale(1);
          setTranslate({ x: 0, y: 0 });
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

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setImageDimensions({ width: naturalWidth, height: naturalHeight });
  };

  // --- KOORDİNAT HESAPLAMA (GELİŞMİŞ ZOOM/PAN DESTEKLİ) ---
  const getMousePos = (clientX: number, clientY: number): Point => {
    if (!canvasRef.current || imageDimensions.width === 0) return { x: 0, y: 0 };
    
    const rect = canvasRef.current.getBoundingClientRect();
    
    // Zoom (Scale) ve Pan (Translate) hesaba katılıyor
    // Formül: (MouseEkran - CanvasBaşlangıç - KaydırmaMiktarı) / ZoomOranı * (ResimOrjinalBoyut / CanvasGörünenBoyut)
    
    // CanvasGörünenBoyut (CSS pixel)
    const domWidth = rect.width / scale; 
    const domHeight = rect.height / scale;

    const x = (clientX - rect.left) / scale;
    const y = (clientY - rect.top) / scale;

    // Resim orijinal boyutuna ölçekleme
    const scaleX = imageDimensions.width / domWidth;
    const scaleY = imageDimensions.height / domHeight;

    return {
      x: x * scaleX,
      y: y * scaleY
    };
  };

  // --- ÇİZİM VE ETKİLEŞİM İŞLEMLERİ ---
  const handleStart = (clientX: number, clientY: number) => {
    if (!layoutImage) return;

    // Move aracı seçiliyse veya space basılıysa pan işlemi
    if (drawingTool === 'move') {
      setPanning(true);
      setPanOrigin({ x: clientX - translate.x, y: clientY - translate.y });
      return;
    }

    if (selectedRiskArea) {
        // Eğer bir alan seçiliyse ve boşluğa tıklanırsa seçimi kaldır
        // (Bu mantık geliştirilebilir: tıklanan yer polygon içinde mi?)
        // Şimdilik basitleştirilmiş:
        setSelectedRiskArea(null);
        return;
    }
    
    const pos = getMousePos(clientX, clientY);

    if (drawingTool === 'rectangle') {
      setIsDrawing(true);
      setCurrentPoints([pos]);
    } else if (drawingTool === 'polygon') {
      if (!isDrawing) {
        setIsDrawing(true);
        setCurrentPoints([pos]);
      } else {
        setCurrentPoints(prev => [...prev, pos]);
      }
    }
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (panning) {
      setTranslate({
        x: clientX - panOrigin.x,
        y: clientY - panOrigin.y
      });
      return;
    }

    const pos = getMousePos(clientX, clientY);
    setTempMousePos(pos);
  };

  const handleEnd = (clientX: number, clientY: number) => {
    if (panning) {
      setPanning(false);
      return;
    }

    if (drawingTool === 'rectangle' && isDrawing && currentPoints.length > 0) {
      const startPos = currentPoints[0];
      const endPos = getMousePos(clientX, clientY);

      if (Math.abs(endPos.x - startPos.x) > (imageDimensions.width * 0.01)) {
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

  // Mouse Event Wrappers
  const onMouseDown = (e: React.MouseEvent) => handleStart(e.clientX, e.clientY);
  const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX, e.clientY);
  const onMouseUp = (e: React.MouseEvent) => handleEnd(e.clientX, e.clientY);

  // Touch Event Wrappers
  const onTouchStart = (e: React.TouchEvent) => {
    // Mobilde sayfa kaymasını engelle (sadece canvas üzerinde)
    // e.preventDefault(); // Bu bazen scroll'u tamamen kilitler, dikkatli kullanın.
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    // Touch end'de clientX/Y genelde değişmiş touches[0] olmayabilir, changedTouches kullanılır
    const touch = e.changedTouches[0];
    handleEnd(touch.clientX, touch.clientY);
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

    updateRiskAreasWithHistory([...riskAreas, newArea]);
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
    const filtered = riskAreas.filter(a => a.id !== id);
    updateRiskAreasWithHistory(filtered);
    if (selectedRiskArea === id) setSelectedRiskArea(null);
    setShowRiskDetailsModal(false);
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'high': return 'Yüksek Risk';
      case 'medium': return 'Orta Risk';
      case 'low': return 'Düşük Risk';
      default: return '';
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setScale(prev => {
      const newScale = direction === 'in' ? prev * 1.2 : prev / 1.2;
      return Math.max(0.1, Math.min(newScale, 5)); // 0.1x ile 5x arası limit
    });
  };

  const resetView = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };

  // --- PDF OLUŞTURMA ---
  const generatePDF = async () => {
    if (!reportRef.current || !layoutImage) return;
    setLoading(true);

    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210;
      const pdfHeight = 297;
      const imgHeightInPdf = (canvas.height * pdfWidth) / canvas.width;
      
      const pageCount = Math.ceil(imgHeightInPdf / pdfHeight);
      
      for (let i = 0; i < pageCount; i++) {
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, -(i * pdfHeight), pdfWidth, imgHeightInPdf);
      }

      pdf.save(`Risk_Raporu_${reportInfo.customerName || 'Musteri'}.pdf`);
      setSuccess('PDF Başarıyla indirildi!');
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
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-blue-100">
      
      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-20 shadow-sm px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded text-white"><AlertTriangle size={20}/></div>
            <h1 className="text-xl font-bold text-gray-800 hidden md:block">Risk Analiz Modülü</h1>
        </div>
        
        <div className="flex items-center space-x-3">
            {autoSaved && <span className="text-xs text-green-600 flex items-center font-medium animate-pulse"><Save size={14} className="mr-1"/> Taslak Kaydedildi</span>}
            <button
                onClick={generatePDF}
                disabled={!layoutImage || riskAreas.length === 0 || loading}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors flex items-center space-x-2 disabled:opacity-50 text-sm font-medium"
            >
                {loading ? <RefreshCw size={16} className="animate-spin"/> : <Download size={16} />}
                <span>Rapor İndir</span>
            </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6" ref={fullscreenRef}>
        
        {/* BİLDİRİMLER */}
        {success && <div className="fixed top-20 right-4 z-50 bg-green-100 text-green-800 p-4 rounded-lg shadow-lg flex items-center border border-green-200"><CheckCircle size={20} className="mr-2"/>{success}</div>}
        {error && <div className="fixed top-20 right-4 z-50 bg-red-100 text-red-800 p-4 rounded-lg shadow-lg flex items-center border border-red-200"><AlertTriangle size={20} className="mr-2"/>{error}</div>}

        <div className="grid lg:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
          
          {/* SOL PANEL: ÇİZİM ALANI */}
          <div className={`lg:col-span-8 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 lg:col-span-12 rounded-none' : ''}`}>
            
            {/* Toolbar */}
            <div className="p-3 border-b bg-gray-50 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-1 bg-white p-1 rounded-lg border shadow-sm">
                 <button onClick={() => setDrawingTool('move')} className={`p-2 rounded hover:bg-gray-100 ${drawingTool === 'move' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`} title="Kaydır (Pan)"><Move size={18} /></button>
                 <div className="w-px h-6 bg-gray-200 mx-1"></div>
                 <button onClick={() => setDrawingTool('rectangle')} className={`p-2 rounded hover:bg-gray-100 ${drawingTool === 'rectangle' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`} title="Dikdörtgen"><Square size={18} /></button>
                 <button onClick={() => setDrawingTool('polygon')} className={`p-2 rounded hover:bg-gray-100 ${drawingTool === 'polygon' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`} title="Çokgen"><Hexagon size={18} /></button>
              </div>

              <div className="flex items-center space-x-2">
                 {/* Risk Selector */}
                 <div className="flex bg-white p-1 rounded-lg border shadow-sm">
                    {(['high', 'medium', 'low'] as const).map((level) => (
                        <button
                        key={level}
                        onClick={() => setDrawMode(level)}
                        className={`w-8 h-8 rounded flex items-center justify-center transition-all ${drawMode === level ? 'ring-2 ring-gray-400 transform scale-105' : 'opacity-60 hover:opacity-100'}`}
                        title={`${getRiskLevelText(level)}`}
                        >
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: riskLevelColors[level].replace('0.4', '1'), border: `2px solid ${riskLevelBorderColors[level]}` }}></div>
                        </button>
                    ))}
                 </div>
              </div>

              <div className="flex items-center space-x-1 bg-white p-1 rounded-lg border shadow-sm">
                <button onClick={handleUndo} disabled={historyStep <= -1} className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30 rounded"><Undo size={18}/></button>
                <button onClick={handleRedo} disabled={historyStep >= history.length - 1} className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30 rounded"><Redo size={18}/></button>
              </div>

              <div className="flex items-center space-x-1 ml-auto">
                 <button onClick={() => handleZoom('out')} className="p-2 text-gray-600 hover:bg-gray-100 rounded"><ZoomOut size={18}/></button>
                 <span className="text-xs font-mono text-gray-400 w-12 text-center">{Math.round(scale * 100)}%</span>
                 <button onClick={() => handleZoom('in')} className="p-2 text-gray-600 hover:bg-gray-100 rounded"><ZoomIn size={18}/></button>
                 <button onClick={resetView} className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 ml-1">Sıfırla</button>
              </div>

              <button
                onClick={() => {
                  if (isFullscreen) document.exitFullscreen().catch(() => setIsFullscreen(false));
                  else fullscreenRef.current?.requestFullscreen().catch(() => {});
                  setIsFullscreen(!isFullscreen);
                }}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded ml-2"
              >
                {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
              </button>
            </div>

            {/* Canvas Container */}
            <div className="flex-1 overflow-hidden relative bg-[#e5e5e5] flex items-center justify-center cursor-crosshair">
                {!layoutImage ? (
                    <div className="text-center p-10 bg-white rounded-xl shadow border border-dashed border-gray-300">
                         <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Upload size={32} className="text-blue-600" />
                         </div>
                         <h3 className="text-lg font-bold text-gray-700">Bir Yerleşim Planı Yükleyin</h3>
                         <p className="text-gray-500 text-sm mb-4">JPG veya PNG formatında kroki yükleyerek başlayın.</p>
                         <label className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block">
                            Dosya Seç
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                    </div>
                ) : (
                    <div 
                        ref={canvasRef}
                        className="relative shadow-2xl origin-top-left transition-transform duration-75 ease-out"
                        style={{ 
                            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                            cursor: drawingTool === 'move' || panning ? 'grab' : 'crosshair'
                        }}
                        onMouseDown={onMouseDown}
                        onMouseMove={onMouseMove}
                        onMouseUp={onMouseUp}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                        onDoubleClick={handleDoubleClick}
                    >
                        <img 
                            src={layoutImage} 
                            alt="Plan" 
                            onLoad={handleImageLoad}
                            className="pointer-events-none select-none max-w-none" 
                        />
                        
                        <svg 
                            className="absolute inset-0 w-full h-full"
                            viewBox={`0 0 ${imageDimensions.width} ${imageDimensions.height}`}
                            preserveAspectRatio="none"
                        >
                             {/* Mevcut Alanlar */}
                            {riskAreas.map((area, idx) => (
                                <g key={area.id} onClick={(e) => { e.stopPropagation(); if(drawingTool !== 'move') setSelectedRiskArea(area.id); setShowRiskDetailsModal(true); }}>
                                    <polygon
                                        points={pointsToString(area.points)}
                                        fill={area.color}
                                        stroke={selectedRiskArea === area.id ? 'blue' : riskLevelBorderColors[area.riskLevel]}
                                        strokeWidth={selectedRiskArea === area.id ? imageDimensions.width * 0.008 : imageDimensions.width * 0.004}
                                        className="hover:opacity-80 transition-opacity cursor-pointer vector-effect-non-scaling-stroke"
                                        style={{ vectorEffect: 'non-scaling-stroke' }} // Zoomda stroke kalınlığını korumak için opsiyonel
                                    />
                                    {/* Numara */}
                                    <circle 
                                        cx={area.points[0].x} 
                                        cy={area.points[0].y} 
                                        r={imageDimensions.width * 0.015} 
                                        fill="white" 
                                        stroke="black" 
                                        strokeWidth={imageDimensions.width * 0.002}
                                    />
                                    <text 
                                        x={area.points[0].x} 
                                        y={area.points[0].y} 
                                        dy={imageDimensions.width * 0.005}
                                        textAnchor="middle"
                                        fill="black" 
                                        fontSize={imageDimensions.width * 0.012} 
                                        fontWeight="bold"
                                    >
                                        {idx + 1}
                                    </text>
                                </g>
                            ))}

                            {/* Çizim Önizleme */}
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
                                            strokeDasharray="10,5"
                                        />
                                    )}
                                    {drawingTool === 'polygon' && currentPoints.length > 0 && (
                                        <>
                                            <polyline
                                                points={pointsToString([...currentPoints, ...(tempMousePos ? [tempMousePos] : [])])}
                                                fill={riskLevelColors[drawMode]}
                                                stroke={riskLevelBorderColors[drawMode]}
                                                strokeWidth={imageDimensions.width * 0.004}
                                                strokeDasharray="10,5"
                                            />
                                            {currentPoints.map((p, i) => (
                                                <circle key={i} cx={p.x} cy={p.y} r={imageDimensions.width * 0.004} fill="white" stroke="black" strokeWidth={1} />
                                            ))}
                                            {tempMousePos && (
                                                 <line x1={currentPoints[currentPoints.length-1].x} y1={currentPoints[currentPoints.length-1].y} x2={tempMousePos.x} y2={tempMousePos.y} stroke="gray" strokeWidth={1} strokeDasharray="5,5" />
                                            )}
                                        </>
                                    )}
                                </g>
                            )}
                        </svg>
                    </div>
                )}
                
                {/* Alt Bilgi Çubuğu */}
                {layoutImage && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow border text-xs font-medium text-gray-600 flex items-center gap-3">
                        <span>Sol Tık: Çiz/Seç</span>
                        <span className="w-px h-3 bg-gray-300"></span>
                        <span>Shift+Drag / Araç: Kaydır</span>
                        <span className="w-px h-3 bg-gray-300"></span>
                        <span>Çift Tık: Poligon Bitir</span>
                    </div>
                )}
            </div>
          </div>

          {/* SAĞ PANEL: BİLGİ GİRİŞİ */}
          <div className={`lg:col-span-4 flex flex-col gap-4 overflow-y-auto ${isFullscreen ? 'hidden' : ''}`}>
             <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center"><FileText size={18} className="mr-2 text-blue-600"/> Rapor Başlığı</h3>
                <div className="space-y-3">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Firma Adı</label>
                        <input 
                            value={reportInfo.companyName} 
                            onChange={e => setReportInfo({...reportInfo, companyName: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Müşteri Adı</label>
                        <input 
                            value={reportInfo.customerName} 
                            onChange={e => setReportInfo({...reportInfo, customerName: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                        <label className="flex-1 cursor-pointer bg-gray-50 border border-dashed border-gray-300 rounded-lg p-2 flex items-center justify-center text-xs hover:bg-gray-100 transition-colors h-10">
                            <Upload size={14} className="mr-2 text-gray-500"/> Logo Seç
                            <input type="file" onChange={handleLogoUpload} className="hidden" accept="image/*" />
                        </label>
                        {reportInfo.companyLogo && (
                            <div className="relative group">
                                <img src={reportInfo.companyLogo} className="h-10 w-10 object-contain border rounded bg-white" alt="Logo" />
                                <button onClick={() => setReportInfo({...reportInfo, companyLogo: null})} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hidden group-hover:block"><X size={10}/></button>
                            </div>
                        )}
                    </div>
                </div>
             </div>

             {/* Risk Listesi Özeti */}
             <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex-1 overflow-hidden flex flex-col">
                <h3 className="font-bold text-gray-800 mb-4">Risk Listesi ({riskAreas.length})</h3>
                <div className="overflow-y-auto flex-1 space-y-2 pr-1">
                    {riskAreas.length === 0 ? (
                        <div className="text-center text-gray-400 py-10 text-sm">
                            Henüz riskli alan belirlenmedi.
                        </div>
                    ) : (
                        riskAreas.map((area, idx) => (
                            <div 
                                key={area.id} 
                                onClick={() => { setSelectedRiskArea(area.id); setShowRiskDetailsModal(true); }}
                                className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-3 ${selectedRiskArea === area.id ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200'}`}
                            >
                                <span className="bg-gray-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">{idx+1}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm truncate">{area.riskName || 'İsimsiz Risk'}</div>
                                    <div className="text-xs text-gray-500 truncate">{area.riskDescription || 'Açıklama yok'}</div>
                                </div>
                                <div className={`w-3 h-3 rounded-full shrink-0`} style={{ backgroundColor: riskLevelBorderColors[area.riskLevel] }}></div>
                            </div>
                        ))
                    )}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* GİZLİ RAPOR ŞABLONU (PDF Üretimi İçin) */}
      <div className="absolute top-0 left-0 -z-50 opacity-0 pointer-events-none w-0 h-0 overflow-hidden">
         <div ref={reportRef} className="bg-white mx-auto p-10" style={{ width: '210mm', minHeight: '297mm' }}>
             {/* Header */}
             <div className="border-b-4 border-gray-800 pb-6 mb-8 flex justify-between items-center">
                 <div>
                     <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">RİSK ANALİZ RAPORU</h1>
                     <p className="text-gray-500 mt-2 font-medium">Tarih: {new Date().toLocaleDateString('tr-TR')}</p>
                 </div>
                 {reportInfo.companyLogo ? (
                     <img src={reportInfo.companyLogo} className="h-20 object-contain" alt="Logo" />
                 ) : (
                    <div className="text-2xl font-bold text-gray-300">{reportInfo.companyName}</div>
                 )}
             </div>
             
             {/* Info Table */}
             <table className="w-full mb-8 border-collapse">
                 <tbody>
                     <tr className="border-b border-gray-200">
                         <td className="py-2 text-sm font-bold text-gray-500 w-1/4">Hizmet Veren</td>
                         <td className="py-2 text-lg font-semibold text-gray-800">{reportInfo.companyName}</td>
                     </tr>
                     <tr className="border-b border-gray-200">
                         <td className="py-2 text-sm font-bold text-gray-500">Müşteri</td>
                         <td className="py-2 text-lg font-semibold text-gray-800">{reportInfo.customerName}</td>
                     </tr>
                 </tbody>
             </table>

             {/* Map */}
             {layoutImage && (
                 <div className="mb-8 border-2 border-gray-900 rounded-lg overflow-hidden relative break-inside-avoid">
                     <img src={layoutImage} className="w-full h-auto block" alt="Kroki" />
                     <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${imageDimensions.width} ${imageDimensions.height}`} preserveAspectRatio="none">
                         {riskAreas.map((area, idx) => (
                             <g key={area.id}>
                                <polygon points={pointsToString(area.points)} fill={area.color} stroke={riskLevelBorderColors[area.riskLevel]} strokeWidth={imageDimensions.width * 0.005} />
                                <circle cx={area.points[0].x} cy={area.points[0].y} r={imageDimensions.width * 0.015} fill="black" />
                                <text x={area.points[0].x} y={area.points[0].y} dy={imageDimensions.width * 0.005} textAnchor="middle" fill="white" fontSize={imageDimensions.width * 0.012} fontWeight="bold">{idx + 1}</text>
                             </g>
                         ))}
                     </svg>
                 </div>
             )}

             {/* Details */}
             <div className="space-y-6">
                 {riskAreas.map((area, idx) => (
                     <div key={area.id} className="break-inside-avoid border rounded-lg overflow-hidden shadow-sm">
                         <div className="bg-gray-50 p-3 border-b flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                 <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">{idx + 1}</span>
                                 <h4 className="font-bold text-lg text-gray-800">{area.riskName || 'Tanımsız Risk'}</h4>
                             </div>
                             <span className="text-xs font-bold uppercase px-3 py-1 rounded bg-white border" style={{ color: riskLevelBorderColors[area.riskLevel], borderColor: riskLevelBorderColors[area.riskLevel] }}>
                                 {getRiskLevelText(area.riskLevel)}
                             </span>
                         </div>
                         <div className="p-4 grid grid-cols-3 gap-4 text-sm">
                             <div><strong className="block text-xs text-gray-400 uppercase mb-1">Risk Tanımı</strong>{area.riskDescription || '-'}</div>
                             <div><strong className="block text-xs text-gray-400 uppercase mb-1">Sonuçlar</strong>{area.potentialConsequences || '-'}</div>
                             <div className="bg-blue-50 p-2 rounded"><strong className="block text-xs text-blue-600 uppercase mb-1">Önerilen Aksiyon</strong>{area.recommendedActions || '-'}</div>
                         </div>
                     </div>
                 ))}
             </div>
         </div>
      </div>

      {/* MODAL: RİSK DETAYLARI */}
      {showRiskDetailsModal && selectedRiskArea && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
              <h3 className="font-bold text-lg text-gray-800">Risk Detaylarını Düzenle</h3>
              <button onClick={() => setShowRiskDetailsModal(false)} className="hover:bg-gray-200 p-1 rounded-full"><X size={20} className="text-gray-500"/></button>
            </div>
            
            <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Risk Adı</label>
                <input 
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Örn: Kaygan Zemin"
                  value={riskAreas.find(a => a.id === selectedRiskArea)?.riskName || ''}
                  onChange={(e) => {
                      const updated = riskAreas.map(a => a.id === selectedRiskArea ? {...a, riskName: e.target.value} : a);
                      setRiskAreas(updated);
                  }}
                  onBlur={() => updateRiskAreasWithHistory(riskAreas)} // Blur'da history kaydet
                />
              </div>
              
              <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Risk Seviyesi</label>
                  <div className="flex gap-2">
                    {(['high', 'medium', 'low'] as const).map(level => {
                       const isSelected = riskAreas.find(a => a.id === selectedRiskArea)?.riskLevel === level;
                       return (
                        <button
                          key={level}
                          onClick={() => {
                              const updated = riskAreas.map(a => a.id === selectedRiskArea ? {...a, riskLevel: level, color: riskLevelColors[level]} : a);
                              updateRiskAreasWithHistory(updated);
                          }}
                          className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                            isSelected
                            ? 'ring-2 ring-offset-1 ring-gray-400 shadow-sm'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                          }`}
                          style={{ 
                              backgroundColor: isSelected ? riskLevelColors[level].replace('0.4', '0.1') : undefined,
                              borderColor: isSelected ? riskLevelBorderColors[level] : undefined,
                              color: isSelected ? riskLevelBorderColors[level] : undefined
                          }}
                        >
                          {getRiskLevelText(level)}
                        </button>
                    )})}
                  </div>
              </div>

              {[
                  { key: 'riskDescription', label: 'Risk Tanımı', placeholder: 'Tehlikenin kaynağını açıklayın...' },
                  { key: 'potentialConsequences', label: 'Olası Sonuçlar', placeholder: 'Yaralanma, maddi hasar...' },
                  { key: 'recommendedActions', label: 'Önerilen Aksiyon', placeholder: 'Alınması gereken önlemler...' }
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">{field.label}</label>
                  <textarea 
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm h-20 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder={field.placeholder}
                    value={(riskAreas.find(a => a.id === selectedRiskArea) as any)[field.key] || ''}
                    onChange={(e) => {
                        const updated = riskAreas.map(a => a.id === selectedRiskArea ? {...a, [field.key]: e.target.value} : a);
                        setRiskAreas(updated);
                    }}
                    onBlur={() => updateRiskAreasWithHistory(riskAreas)}
                  />
                </div>
              ))}
            </div>

            <div className="p-4 border-t bg-gray-50 rounded-b-2xl flex justify-between items-center">
              <button 
                  onClick={() => deleteRiskArea(selectedRiskArea)} 
                  className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
              >
                  <Trash2 size={16} className="mr-2"/> Sil
              </button>
              <button onClick={() => setShowRiskDetailsModal(false)} className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors shadow-lg shadow-gray-200">
                  Tamamla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskAreaIdentificationPage;