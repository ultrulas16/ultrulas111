import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Upload, 
  Trash2, 
  Plus, 
  Download, 
  Save, 
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
  ArrowLeft,
  ArrowRight,
  Calendar,
  Building,
  User
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface RiskArea {
  id: string;
  x: number;
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
  const [layoutImage, setLayoutImage] = useState<string | null>(null);
  const [riskAreas, setRiskAreas] = useState<RiskArea[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentRiskArea, setCurrentRiskArea] = useState<Partial<RiskArea> | null>(null);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [selectedRiskArea, setSelectedRiskArea] = useState<string | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [moveStartPoint, setMoveStartPoint] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [showRiskDetailsModal, setShowRiskDetailsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [drawMode, setDrawMode] = useState<'high' | 'medium' | 'low'>('medium');
  const [reportInfo, setReportInfo] = useState<ReportInfo>({
    companyName: 'PestMentor',
    companyLogo: null,
    customerName: '',
    revisionDate: new Date().toISOString().split('T')[0]
  });
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  
  const riskLevelColors = {
    high: 'rgba(239, 68, 68, 0.5)', // red
    medium: 'rgba(245, 158, 11, 0.5)', // amber
    low: 'rgba(16, 185, 129, 0.5)' // green
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLayoutImage(event.target?.result as string);
          // Reset risk areas when new image is uploaded
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
          setReportInfo({
            ...reportInfo,
            companyLogo: event.target?.result as string
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (!layoutImage || selectedRiskArea) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setStartPoint({ x, y });
    setIsDrawing(true);
    setCurrentRiskArea({
      id: `risk-${Date.now()}`,
      x,
      y,
      width: 0,
      height: 0,
      color: riskLevelColors[drawMode],
      riskLevel: drawMode,
      riskName: '',
      riskDescription: '',
      potentialConsequences: '',
      recommendedActions: ''
    });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (isDrawing && currentRiskArea) {
      setCurrentRiskArea({
        ...currentRiskArea,
        x: Math.min(x, startPoint.x),
        y: Math.min(y, startPoint.y),
        width: Math.abs(x - startPoint.x),
        height: Math.abs(y - startPoint.y)
      });
    } else if (isMoving && selectedRiskArea) {
      const selectedArea = riskAreas.find(area => area.id === selectedRiskArea);
      if (selectedArea) {
        const dx = x - moveStartPoint.x;
        const dy = y - moveStartPoint.y;
        
        setRiskAreas(areas => 
          areas.map(area => 
            area.id === selectedRiskArea 
              ? { 
                  ...area, 
                  x: area.x + dx, 
                  y: area.y + dy 
                } 
              : area
          )
        );
        
        setMoveStartPoint({ x, y });
      }
    } else if (isResizing && selectedRiskArea && resizeDirection) {
      const selectedArea = riskAreas.find(area => area.id === selectedRiskArea);
      if (selectedArea) {
        let newX = selectedArea.x;
        let newY = selectedArea.y;
        let newWidth = selectedArea.width;
        let newHeight = selectedArea.height;
        
        switch (resizeDirection) {
          case 'n':
            newY = y;
            newHeight = selectedArea.y + selectedArea.height - y;
            break;
          case 's':
            newHeight = y - selectedArea.y;
            break;
          case 'e':
            newWidth = x - selectedArea.x;
            break;
          case 'w':
            newX = x;
            newWidth = selectedArea.x + selectedArea.width - x;
            break;
          case 'ne':
            newY = y;
            newHeight = selectedArea.y + selectedArea.height - y;
            newWidth = x - selectedArea.x;
            break;
          case 'nw':
            newY = y;
            newHeight = selectedArea.y + selectedArea.height - y;
            newX = x;
            newWidth = selectedArea.x + selectedArea.width - x;
            break;
          case 'se':
            newWidth = x - selectedArea.x;
            newHeight = y - selectedArea.y;
            break;
          case 'sw':
            newX = x;
            newWidth = selectedArea.x + selectedArea.width - x;
            newHeight = y - selectedArea.y;
            break;
        }
        
        // Ensure width and height are positive
        if (newWidth > 10 && newHeight > 10) {
          setRiskAreas(areas => 
            areas.map(area => 
              area.id === selectedRiskArea 
                ? { 
                    ...area, 
                    x: newX, 
                    y: newY, 
                    width: newWidth, 
                    height: newHeight 
                  } 
                : area
            )
          );
        }
      }
    }
  };

  const handleCanvasMouseUp = () => {
    if (isDrawing && currentRiskArea && currentRiskArea.width && currentRiskArea.height) {
      // Only add if the area has some size
      if (currentRiskArea.width > 10 && currentRiskArea.height > 10) {
        setRiskAreas([...riskAreas, currentRiskArea as RiskArea]);
        setSelectedRiskArea(currentRiskArea.id as string);
        setShowRiskDetailsModal(true);
      }
    }
    
    setIsDrawing(false);
    setIsMoving(false);
    setIsResizing(false);
    setResizeDirection(null);
    setCurrentRiskArea(null);
  };

  const handleRiskAreaClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRiskArea(id);
  };

  const handleRiskAreaDoubleClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRiskArea(id);
    setShowRiskDetailsModal(true);
  };

  const startMovingRiskArea = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedRiskArea) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsMoving(true);
    setMoveStartPoint({ x, y });
  };

  const startResizingRiskArea = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    if (!selectedRiskArea) return;
    
    setIsResizing(true);
    setResizeDirection(direction);
  };

  const deleteRiskArea = (id: string) => {
    setRiskAreas(riskAreas.filter(area => area.id !== id));
    if (selectedRiskArea === id) {
      setSelectedRiskArea(null);
    }
  };

  const updateRiskAreaDetails = (details: Partial<RiskArea>) => {
    if (!selectedRiskArea) return;
    
    setRiskAreas(areas => 
      areas.map(area => 
        area.id === selectedRiskArea 
          ? { 
              ...area, 
              ...details,
              color: details.riskLevel ? riskLevelColors[details.riskLevel] : area.color
            } 
          : area
      )
    );
    
    setShowRiskDetailsModal(false);
  };

  const generatePDF = async () => {
    if (!reportRef.current || !layoutImage) return;
    
    setLoading(true);
    
    try {
      const reportElement = reportRef.current;
      
      // Create a PDF with A4 dimensions
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Get the width of the PDF page
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate the number of pages needed
      const reportHeight = reportElement.scrollHeight;
      const reportWidth = reportElement.scrollWidth;
      const ratio = reportWidth / reportHeight;
      
      // Calculate how many pages we need
      const pageHeight = pdfWidth / ratio;
      const totalPages = Math.ceil(reportHeight / pageHeight);
      
      // For each page, capture a portion of the element
      for (let i = 0; i < totalPages; i++) {
        // If not the first page, add a new page
        if (i > 0) {
          pdf.addPage();
        }
        
        // Calculate the portion of the element to capture for this page
        const sourceY = i * pageHeight;
        const sourceHeight = Math.min(pageHeight, reportHeight - sourceY);
        
        // Create a canvas for this portion
        const canvas = await html2canvas(reportElement, {
          scale: 2, // Higher scale for better quality
          logging: false,
          useCORS: true,
          backgroundColor: '#ffffff',
          y: sourceY,
          height: sourceHeight
        });
        
        // Add the image to the PDF
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      }
      
      // Save the PDF
      pdf.save(`Riskli_Alan_Raporu_${reportInfo.customerName || 'Musteri'}_${new Date().toISOString().slice(0, 10)}.pdf`);
      
      setSuccess('PDF başarıyla oluşturuldu!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('PDF generation error:', error);
      setError('PDF oluşturulurken bir hata oluştu.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const generateJPEG = async () => {
    if (!reportRef.current || !layoutImage) return;
    
    setLoading(true);
    
    try {
      const reportElement = reportRef.current;
      
      // Calculate the number of pages needed
      const reportHeight = reportElement.scrollHeight;
      const reportWidth = reportElement.scrollWidth;
      
      // A4 dimensions in pixels at 96 DPI
      const a4Width = 794; // 210mm at 96 DPI
      const a4Height = 1123; // 297mm at 96 DPI
      
      // Calculate how many pages we need
      const pageHeight = a4Height;
      const totalPages = Math.ceil(reportHeight / pageHeight);
      
      // For each page, capture a portion of the element
      for (let i = 0; i < totalPages; i++) {
        // Calculate the portion of the element to capture for this page
        const sourceY = i * pageHeight;
        const sourceHeight = Math.min(pageHeight, reportHeight - sourceY);
        
        // Create a canvas for this portion
        const canvas = await html2canvas(reportElement, {
          scale: 2, // Higher scale for better quality
          logging: false,
          useCORS: true,
          backgroundColor: '#ffffff',
          y: sourceY,
          height: sourceHeight,
          width: reportWidth
        });
        
        // Get the image data
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        // Create a download link
        const link = document.createElement('a');
        link.href = imgData;
        link.download = `Riskli_Alan_Raporu_${reportInfo.customerName || 'Musteri'}_${new Date().toISOString().slice(0, 10)}_Sayfa${i+1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Add a small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      setSuccess('JPEG başarıyla oluşturuldu!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('JPEG generation error:', error);
      setError('JPEG oluşturulurken bir hata oluştu.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (fullscreenRef.current?.requestFullscreen) {
        fullscreenRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'high': return 'Yüksek Risk';
      case 'medium': return 'Orta Risk';
      case 'low': return 'Düşük Risk';
      default: return 'Bilinmeyen Risk';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Riskli Alan Belirleme Modülü</h1>
        <div className="flex space-x-4">
          <button
            onClick={generatePDF}
            disabled={!layoutImage || loading || riskAreas.length === 0}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <Download className="h-5 w-5" />
            <span>PDF İndir</span>
          </button>
          <button
            onClick={generateJPEG}
            disabled={!layoutImage || loading || riskAreas.length === 0}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <ImageIcon className="h-5 w-5" />
            <span>JPEG İndir</span>
          </button>
          <button
            onClick={toggleFullscreen}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            {isFullscreen ? (
              <>
                <Minimize className="h-5 w-5" />
                <span>Tam Ekrandan Çık</span>
              </>
            ) : (
              <>
                <Maximize className="h-5 w-5" />
                <span>Tam Ekran</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success and Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {/* Report Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <FileText className="h-6 w-6 text-blue-600 mr-2" />
          Rapor Bilgileri
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İlaçlama Firması Adı
            </label>
            <input
              type="text"
              value={reportInfo.companyName}
              onChange={(e) => setReportInfo({...reportInfo, companyName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Firma adını girin"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Firma Logosu
            </label>
            <div className="flex items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200 transition-colors flex items-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                Logo Yükle
              </label>
              {reportInfo.companyLogo && (
                <div className="ml-4 relative">
                  <img src={reportInfo.companyLogo} alt="Logo" className="h-10 object-contain" />
                  <button
                    onClick={() => setReportInfo({...reportInfo, companyLogo: null})}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Müşteri Adı
            </label>
            <input
              type="text"
              value={reportInfo.customerName}
              onChange={(e) => setReportInfo({...reportInfo, customerName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Müşteri adını girin"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Revize Tarihi
            </label>
            <input
              type="date"
              value={reportInfo.revisionDate}
              onChange={(e) => setReportInfo({...reportInfo, revisionDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Canvas and Controls */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <ImageIcon className="h-6 w-6 text-blue-600 mr-2" />
              Kroki Yükleme ve Düzenleme
            </h2>
            
            {!layoutImage ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="layout-upload"
                />
                <label
                  htmlFor="layout-upload"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <Upload className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">Kroki Yükle</p>
                  <p className="text-sm text-gray-500">JPEG, PNG veya GIF formatında</p>
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => {
                        if (selectedRiskArea) {
                          setSelectedRiskArea(null);
                        } else {
                          setLayoutImage(null);
                          setRiskAreas([]);
                        }
                      }}
                      className="text-red-600 hover:text-red-800 flex items-center space-x-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>{selectedRiskArea ? 'Seçimi İptal Et' : 'Krokiyi Kaldır'}</span>
                    </button>
                    
                    {selectedRiskArea && (
                      <button
                        onClick={() => setShowRiskDetailsModal(true)}
                        className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Risk Detaylarını Düzenle</span>
                      </button>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        const fileInput = document.getElementById('layout-upload') as HTMLInputElement;
                        if (fileInput) {
                          fileInput.click();
                        }
                      }}
                      className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm flex items-center space-x-1"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Yeni Kroki</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setRiskAreas([]);
                        setSelectedRiskArea(null);
                      }}
                      className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition-colors text-sm flex items-center space-x-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Tüm Alanları Temizle</span>
                    </button>
                  </div>
                </div>
                
                {/* Risk Level Selection */}
                <div className="flex justify-center space-x-4 mb-4">
                  <button
                    onClick={() => setDrawMode('high')}
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                      drawMode === 'high' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    <div className="w-4 h-4 bg-red-500 bg-opacity-50 border border-red-600"></div>
                    <span>Yüksek Risk</span>
                  </button>
                  <button
                    onClick={() => setDrawMode('medium')}
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                      drawMode === 'medium' 
                        ? 'bg-amber-600 text-white' 
                        : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    }`}
                  >
                    <div className="w-4 h-4 bg-amber-500 bg-opacity-50 border border-amber-600"></div>
                    <span>Orta Risk</span>
                  </button>
                  <button
                    onClick={() => setDrawMode('low')}
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                      drawMode === 'low' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    <div className="w-4 h-4 bg-green-500 bg-opacity-50 border border-green-600"></div>
                    <span>Düşük Risk</span>
                  </button>
                </div>
                
                <div 
                  ref={canvasRef}
                  className="relative border border-gray-300 rounded-lg overflow-hidden cursor-crosshair"
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseLeave={handleCanvasMouseUp}
                >
                  <img 
                    src={layoutImage} 
                    alt="Layout" 
                    className="max-w-full"
                  />
                  
                  {/* Current drawing area */}
                  {isDrawing && currentRiskArea && (
                    <div
                      style={{
                        position: 'absolute',
                        left: `${currentRiskArea.x}px`,
                        top: `${currentRiskArea.y}px`,
                        width: `${currentRiskArea.width}px`,
                        height: `${currentRiskArea.height}px`,
                        backgroundColor: currentRiskArea.color || riskLevelColors[drawMode],
                        border: '2px dashed #000',
                        pointerEvents: 'none'
                      }}
                    ></div>
                  )}
                  
                  {/* Existing risk areas */}
                  {riskAreas.map((area) => (
                    <div
                      key={area.id}
                      style={{
                        position: 'absolute',
                        left: `${area.x}px`,
                        top: `${area.y}px`,
                        width: `${area.width}px`,
                        height: `${area.height}px`,
                        backgroundColor: area.color,
                        border: selectedRiskArea === area.id ? '2px solid #000' : '1px solid rgba(0,0,0,0.3)',
                        cursor: 'pointer'
                      }}
                      onClick={(e) => handleRiskAreaClick(area.id, e)}
                      onDoubleClick={(e) => handleRiskAreaDoubleClick(area.id, e)}
                    >
                      {selectedRiskArea === area.id && (
                        <>
                          {/* Move handle */}
                          <div 
                            className="absolute top-0 left-0 right-0 h-6 bg-black bg-opacity-20 cursor-move flex items-center justify-center"
                            onMouseDown={startMovingRiskArea}
                          >
                            <Move className="h-4 w-4 text-white" />
                          </div>
                          
                          {/* Resize handles */}
                          <div className="absolute top-0 left-0 w-3 h-3 bg-white border border-black cursor-nw-resize" 
                               onMouseDown={(e) => startResizingRiskArea(e, 'nw')}></div>
                          <div className="absolute top-0 right-0 w-3 h-3 bg-white border border-black cursor-ne-resize"
                               onMouseDown={(e) => startResizingRiskArea(e, 'ne')}></div>
                          <div className="absolute bottom-0 left-0 w-3 h-3 bg-white border border-black cursor-sw-resize"
                               onMouseDown={(e) => startResizingRiskArea(e, 'sw')}></div>
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-white border border-black cursor-se-resize"
                               onMouseDown={(e) => startResizingRiskArea(e, 'se')}></div>
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border border-black cursor-n-resize"
                               onMouseDown={(e) => startResizingRiskArea(e, 'n')}></div>
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border border-black cursor-s-resize"
                               onMouseDown={(e) => startResizingRiskArea(e, 's')}></div>
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white border border-black cursor-w-resize"
                               onMouseDown={(e) => startResizingRiskArea(e, 'w')}></div>
                          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white border border-black cursor-e-resize"
                               onMouseDown={(e) => startResizingRiskArea(e, 'e')}></div>
                          
                          {/* Delete button */}
                          <button
                            className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteRiskArea(area.id);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </>
                      )}
                      
                      {/* Risk label */}
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                        {area.riskName || getRiskLevelText(area.riskLevel)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <div className="text-sm text-gray-500">
                    {selectedRiskArea ? 'Seçili alanı düzenlemek için çift tıklayın' : 'Yeni alan eklemek için tıklayıp sürükleyin'}
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    Çizim modu: <span className="font-medium">{getRiskLevelText(drawMode)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Risk Areas List */}
          {riskAreas.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Target className="h-6 w-6 text-red-600 mr-2" />
                Riskli Alanlar
              </h2>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {riskAreas.map((area) => (
                  <div 
                    key={area.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedRiskArea === area.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedRiskArea(area.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{area.riskName || 'İsimsiz Risk Alanı'}</h3>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getRiskLevelColor(area.riskLevel)}`}>
                          {getRiskLevelText(area.riskLevel)}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRiskArea(area.id);
                            setShowRiskDetailsModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 p-1"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteRiskArea(area.id);
                          }}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {area.riskDescription && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{area.riskDescription}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Report Preview */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FileText className="h-6 w-6 text-blue-600 mr-2" />
              Rapor Önizleme
            </h2>
            
            <div 
              ref={reportRef}
              className="border border-gray-300 rounded-lg p-8 bg-white"
              style={{ width: '210mm', minHeight: '297mm' }} // A4 size
            >
              {/* Report Header */}
              <div className="flex justify-between items-center mb-8 border-b pb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">RİSKLİ ALAN BELİRLEME RAPORU</h1>
                  <div className="flex items-center mt-2 text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Revizyon Tarihi: {new Date(reportInfo.revisionDate).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
                {reportInfo.companyLogo && (
                  <img 
                    src={reportInfo.companyLogo} 
                    alt="Company Logo" 
                    className="h-16 object-contain"
                  />
                )}
              </div>
              
              {/* Company and Customer Info */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">Firma Bilgileri</h3>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <Building className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Firma:</p>
                        <p>{reportInfo.companyName || 'Belirtilmemiş'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">Müşteri Bilgileri</h3>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <User className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Müşteri:</p>
                        <p>{reportInfo.customerName || 'Belirtilmemiş'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Layout Image with Risk Areas */}
              {layoutImage && (
                <div className="mb-8 relative border border-gray-300 rounded-lg overflow-hidden">
                  <img 
                    src={layoutImage} 
                    alt="Layout" 
                    className="max-w-full"
                  />
                  
                  {/* Risk areas */}
                  {riskAreas.map((area) => (
                    <div
                      key={area.id}
                      style={{
                        position: 'absolute',
                        left: `${area.x}px`,
                        top: `${area.y}px`,
                        width: `${area.width}px`,
                        height: `${area.height}px`,
                        backgroundColor: area.color,
                        border: '1px solid rgba(0,0,0,0.3)'
                      }}
                    >
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                        {area.riskName || getRiskLevelText(area.riskLevel)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Risk Areas Details */}
              {riskAreas.length > 0 ? (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Riskli Alan Detayları</h2>
                  
                  <div className="space-y-6">
                    {riskAreas.map((area) => (
                      <div key={area.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">{area.riskName || 'İsimsiz Risk Alanı'}</h3>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(area.riskLevel)}`}>
                            {getRiskLevelText(area.riskLevel)}
                          </div>
                        </div>
                        
                        {area.riskDescription && (
                          <div className="mb-3">
                            <h4 className="font-medium text-gray-700 mb-1">Risk Tanımı:</h4>
                            <p className="text-gray-600 text-sm">{area.riskDescription}</p>
                          </div>
                        )}
                        
                        {area.potentialConsequences && (
                          <div className="mb-3">
                            <h4 className="font-medium text-gray-700 mb-1">Olası Sonuçlar:</h4>
                            <p className="text-gray-600 text-sm">{area.potentialConsequences}</p>
                          </div>
                        )}
                        
                        {area.recommendedActions && (
                          <div>
                            <h4 className="font-medium text-gray-700 mb-1">Önerilen Aksiyonlar:</h4>
                            <p className="text-gray-600 text-sm">{area.recommendedActions}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Henüz Riskli Alan Eklenmedi</h3>
                  <p className="text-gray-500">Kroki üzerinde riskli alanları işaretleyin ve detaylarını girin.</p>
                </div>
              )}
              
              {/* Report Footer */}
              <div className="mt-8 pt-4 border-t text-center text-sm text-gray-500">
                <p>Bu rapor {reportInfo.companyName} tarafından {reportInfo.customerName || 'müşteri'} için hazırlanmıştır.</p>
                <p>© {new Date().getFullYear()} {reportInfo.companyName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Details Modal */}
      {showRiskDetailsModal && selectedRiskArea && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Risk Detayları</h2>
              <button
                onClick={() => setShowRiskDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Risk Adı
                </label>
                <input
                  type="text"
                  value={riskAreas.find(a => a.id === selectedRiskArea)?.riskName || ''}
                  onChange={(e) => {
                    const updatedRiskAreas = riskAreas.map(area => 
                      area.id === selectedRiskArea 
                        ? { ...area, riskName: e.target.value } 
                        : area
                    );
                    setRiskAreas(updatedRiskAreas);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Örn: Kemirgen Giriş Noktası"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Risk Seviyesi
                </label>
                <select
                  value={riskAreas.find(a => a.id === selectedRiskArea)?.riskLevel || 'medium'}
                  onChange={(e) => {
                    const riskLevel = e.target.value as 'high' | 'medium' | 'low';
                    const updatedRiskAreas = riskAreas.map(area => 
                      area.id === selectedRiskArea 
                        ? { 
                            ...area, 
                            riskLevel, 
                            color: riskLevelColors[riskLevel] 
                          } 
                        : area
                    );
                    setRiskAreas(updatedRiskAreas);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="high">Yüksek Risk</option>
                  <option value="medium">Orta Risk</option>
                  <option value="low">Düşük Risk</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Risk Tanımı
                </label>
                <textarea
                  value={riskAreas.find(a => a.id === selectedRiskArea)?.riskDescription || ''}
                  onChange={(e) => {
                    const updatedRiskAreas = riskAreas.map(area => 
                      area.id === selectedRiskArea 
                        ? { ...area, riskDescription: e.target.value } 
                        : area
                    );
                    setRiskAreas(updatedRiskAreas);
                  }}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Riskin detaylı tanımını yazın..."
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Olası Sonuçlar
                </label>
                <textarea
                  value={riskAreas.find(a => a.id === selectedRiskArea)?.potentialConsequences || ''}
                  onChange={(e) => {
                    const updatedRiskAreas = riskAreas.map(area => 
                      area.id === selectedRiskArea 
                        ? { ...area, potentialConsequences: e.target.value } 
                        : area
                    );
                    setRiskAreas(updatedRiskAreas);
                  }}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Bu riskin olası sonuçlarını yazın..."
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Önerilen Aksiyonlar
                </label>
                <textarea
                  value={riskAreas.find(a => a.id === selectedRiskArea)?.recommendedActions || ''}
                  onChange={(e) => {
                    const updatedRiskAreas = riskAreas.map(area => 
                      area.id === selectedRiskArea 
                        ? { ...area, recommendedActions: e.target.value } 
                        : area
                    );
                    setRiskAreas(updatedRiskAreas);
                  }}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Bu riski azaltmak için önerilen aksiyonları yazın..."
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowRiskDetailsModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={() => {
                  const selectedArea = riskAreas.find(a => a.id === selectedRiskArea);
                  if (selectedArea) {
                    updateRiskAreaDetails(selectedArea);
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen View */}
      <div 
        ref={fullscreenRef}
        className={`fixed inset-0 bg-white z-50 overflow-auto ${isFullscreen ? 'block' : 'hidden'}`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Riskli Alan Raporu</h2>
            <button
              onClick={toggleFullscreen}
              className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="bg-white border border-gray-300 rounded-lg p-8">
            {/* Report Header */}
            <div className="flex justify-between items-center mb-8 border-b pb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">RİSKLİ ALAN BELİRLEME RAPORU</h1>
                <div className="flex items-center mt-2 text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Revizyon Tarihi: {new Date(reportInfo.revisionDate).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>
              {reportInfo.companyLogo && (
                <img 
                  src={reportInfo.companyLogo} 
                  alt="Company Logo" 
                  className="h-16 object-contain"
                />
              )}
            </div>
            
            {/* Company and Customer Info */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">Firma Bilgileri</h3>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <Building className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Firma:</p>
                      <p>{reportInfo.companyName || 'Belirtilmemiş'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">Müşteri Bilgileri</h3>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Müşteri:</p>
                      <p>{reportInfo.customerName || 'Belirtilmemiş'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Layout Image with Risk Areas */}
            {layoutImage && (
              <div className="mb-8 relative border border-gray-300 rounded-lg overflow-hidden">
                <img 
                  src={layoutImage} 
                  alt="Layout" 
                  className="max-w-full"
                />
                
                {/* Risk areas */}
                {riskAreas.map((area) => (
                  <div
                    key={area.id}
                    style={{
                      position: 'absolute',
                      left: `${area.x}px`,
                      top: `${area.y}px`,
                      width: `${area.width}px`,
                      height: `${area.height}px`,
                      backgroundColor: area.color,
                      border: '1px solid rgba(0,0,0,0.3)'
                    }}
                  >
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                      {area.riskName || getRiskLevelText(area.riskLevel)}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Risk Areas Details */}
            {riskAreas.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Riskli Alan Detayları</h2>
                
                <div className="space-y-6">
                  {riskAreas.map((area) => (
                    <div key={area.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{area.riskName || 'İsimsiz Risk Alanı'}</h3>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(area.riskLevel)}`}>
                          {getRiskLevelText(area.riskLevel)}
                        </div>
                      </div>
                      
                      {area.riskDescription && (
                        <div className="mb-3">
                          <h4 className="font-medium text-gray-700 mb-1">Risk Tanımı:</h4>
                          <p className="text-gray-600 text-sm">{area.riskDescription}</p>
                        </div>
                      )}
                      
                      {area.potentialConsequences && (
                        <div className="mb-3">
                          <h4 className="font-medium text-gray-700 mb-1">Olası Sonuçlar:</h4>
                          <p className="text-gray-600 text-sm">{area.potentialConsequences}</p>
                        </div>
                      )}
                      
                      {area.recommendedActions && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-1">Önerilen Aksiyonlar:</h4>
                          <p className="text-gray-600 text-sm">{area.recommendedActions}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Report Footer */}
            <div className="mt-8 pt-4 border-t text-center text-sm text-gray-500">
              <p>Bu rapor {reportInfo.companyName} tarafından {reportInfo.customerName || 'müşteri'} için hazırlanmıştır.</p>
              <p>© {new Date().getFullYear()} {reportInfo.companyName}</p>
            </div>
          </div>
          
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={generatePDF}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <Download className="h-5 w-5" />
              <span>PDF İndir</span>
            </button>
            <button
              onClick={generateJPEG}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <ImageIcon className="h-5 w-5" />
              <span>JPEG İndir</span>
            </button>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <AlertTriangle className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Riskli Alan Belirleme Modülü Kullanımı</h3>
            <ul className="space-y-2 text-blue-700">
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2"></div>
                <span>Önce firma adı, logo, müşteri adı ve revizyon tarihini girin</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2"></div>
                <span>Kroki yüklemek için "Kroki Yükle" butonuna tıklayın</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2"></div>
                <span>Üstteki risk seviyesi butonlarından çizmek istediğiniz risk seviyesini seçin</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2"></div>
                <span>Riskli alan eklemek için kroki üzerinde tıklayıp sürükleyin</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2"></div>
                <span>Riskli alan detaylarını girmek için alanı seçip çift tıklayın</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2"></div>
                <span>Alanları taşımak için üst kısmındaki taşıma çubuğunu kullanın</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2"></div>
                <span>Alanları yeniden boyutlandırmak için köşelerdeki tutamaçları kullanın</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2"></div>
                <span>Raporu PDF veya JPEG olarak indirmek için ilgili butonları kullanın</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAreaIdentificationPage;