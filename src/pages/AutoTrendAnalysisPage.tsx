import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  Image as ImageIcon,
  FileText,
  RefreshCw,
  Check,
  AlertCircle,
  Loader,
  ArrowRight
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface EquipmentData {
  id: string;
  type: string;
  location: string;
  activityStatus: 'Aktivite Var' | 'Aktivite Yok';
  counts: {
    rodent?: number;
    cockroach?: number;
    ant?: number;
    other?: number;
    housefly?: number;
    mosquito?: number;
    moth?: number;
    bee?: number;
    fruitFly?: number;
    driedFruitMoth?: number;
    flourMoth?: number;
    clothesMoth?: number;
    tobaccoMoth?: number;
    otherStoredPest?: number;
  };
  uvaPercentage?: number;
}

interface VisitData {
  id: string;
  date: string;
  equipmentData: EquipmentData[];
}

interface ReportData {
  companyName: string;
  customerName: string;
  reportDate: string;
  logoUrl: string | null;
  visits: VisitData[];
}

const AutoTrendAnalysisPage: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData>({
    companyName: '',
    customerName: '',
    reportDate: new Date().toISOString().split('T')[0],
    logoUrl: null,
    visits: []
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAddVisitModal, setShowAddVisitModal] = useState(false);
  const [newVisitDate, setNewVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [showEditEquipmentModal, setShowEditEquipmentModal] = useState(false);
  const [currentVisitIndex, setCurrentVisitIndex] = useState<number | null>(null);
  const [currentEquipmentIndex, setCurrentEquipmentIndex] = useState<number | null>(null);
  const [editingEquipment, setEditingEquipment] = useState<EquipmentData | null>(null);
  const [processingPage, setProcessingPage] = useState<number | null>(null);

  const reportRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Equipment types
  const equipmentTypes = [
    'Kemirgen Yemli İstasyon',
    'Canlı Yakalama Kapanı',
    'Yapışkan Tuzak',
    'EFK (Elektrikli Sinek Tuzağı)',
    'Feromon Tuzağı',
    'Depo Zararlısı Tuzağı'
  ];

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setReportData({
            ...reportData,
            logoUrl: event.target.result as string
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add a new visit
  const addVisit = () => {
    // Generate random equipment data
    const newEquipmentData: EquipmentData[] = [];
    
    // Add random number of rodent bait stations (3-8)
    const rodentStationCount = Math.floor(Math.random() * 6) + 3;
    for (let i = 0; i < rodentStationCount; i++) {
      const hasActivity = Math.random() < 0.3; // 30% chance of activity
      newEquipmentData.push({
        id: `r-${i + 1}`,
        type: 'Kemirgen Yemli İstasyon',
        location: `Dış Alan ${i + 1}`,
        activityStatus: hasActivity ? 'Aktivite Var' : 'Aktivite Yok',
        counts: {
          rodent: hasActivity ? Math.floor(Math.random() * 3) + 1 : 0
        }
      });
    }
    
    // Add random number of live traps (2-5)
    const liveTrapsCount = Math.floor(Math.random() * 4) + 2;
    for (let i = 0; i < liveTrapsCount; i++) {
      const hasActivity = Math.random() < 0.2; // 20% chance of activity
      newEquipmentData.push({
        id: `lt-${i + 1}`,
        type: 'Canlı Yakalama Kapanı',
        location: `İç Alan ${i + 1}`,
        activityStatus: hasActivity ? 'Aktivite Var' : 'Aktivite Yok',
        counts: {
          rodent: hasActivity ? Math.floor(Math.random() * 2) + 1 : 0
        }
      });
    }
    
    // Add random number of sticky traps (4-10)
    const stickyTrapsCount = Math.floor(Math.random() * 7) + 4;
    for (let i = 0; i < stickyTrapsCount; i++) {
      const hasActivity = Math.random() < 0.4; // 40% chance of activity
      newEquipmentData.push({
        id: `st-${i + 1}`,
        type: 'Yapışkan Tuzak',
        location: `Üretim Alanı ${i + 1}`,
        activityStatus: hasActivity ? 'Aktivite Var' : 'Aktivite Yok',
        counts: {
          cockroach: hasActivity ? Math.floor(Math.random() * 5) + 1 : 0,
          ant: hasActivity ? Math.floor(Math.random() * 3) : 0,
          other: hasActivity ? Math.floor(Math.random() * 2) : 0
        }
      });
    }
    
    // Add random number of EFK (2-4)
    const efkCount = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < efkCount; i++) {
      const hasActivity = Math.random() < 0.6; // 60% chance of activity
      newEquipmentData.push({
        id: `efk-${i + 1}`,
        type: 'EFK (Elektrikli Sinek Tuzağı)',
        location: `Üretim Alanı ${i + 1}`,
        activityStatus: hasActivity ? 'Aktivite Var' : 'Aktivite Yok',
        counts: {
          housefly: hasActivity ? Math.floor(Math.random() * 15) + 1 : 0,
          mosquito: hasActivity ? Math.floor(Math.random() * 8) : 0,
          moth: hasActivity ? Math.floor(Math.random() * 5) : 0,
          fruitFly: hasActivity ? Math.floor(Math.random() * 10) : 0,
          bee: hasActivity ? Math.floor(Math.random() * 3) : 0
        },
        uvaPercentage: Math.floor(Math.random() * 30) + 70 // 70-100%
      });
    }
    
    // Add random number of pheromone traps (2-5)
    const pheromoneTrapsCount = Math.floor(Math.random() * 4) + 2;
    for (let i = 0; i < pheromoneTrapsCount; i++) {
      const hasActivity = Math.random() < 0.3; // 30% chance of activity
      newEquipmentData.push({
        id: `pt-${i + 1}`,
        type: 'Feromon Tuzağı',
        location: `Depo ${i + 1}`,
        activityStatus: hasActivity ? 'Aktivite Var' : 'Aktivite Yok',
        counts: {
          moth: hasActivity ? Math.floor(Math.random() * 4) + 1 : 0
        }
      });
    }
    
    // Add random number of stored product traps (2-4)
    const storedProductTrapsCount = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < storedProductTrapsCount; i++) {
      const hasActivity = Math.random() < 0.25; // 25% chance of activity
      newEquipmentData.push({
        id: `spt-${i + 1}`,
        type: 'Depo Zararlısı Tuzağı',
        location: `Hammadde Deposu ${i + 1}`,
        activityStatus: hasActivity ? 'Aktivite Var' : 'Aktivite Yok',
        counts: {
          driedFruitMoth: hasActivity ? Math.floor(Math.random() * 3) : 0,
          flourMoth: hasActivity ? Math.floor(Math.random() * 4) : 0,
          clothesMoth: hasActivity ? Math.floor(Math.random() * 2) : 0,
          tobaccoMoth: hasActivity ? Math.floor(Math.random() * 2) : 0,
          otherStoredPest: hasActivity ? Math.floor(Math.random() * 3) : 0
        }
      });
    }

    const newVisit: VisitData = {
      id: `visit-${Date.now()}`,
      date: newVisitDate,
      equipmentData: newEquipmentData
    };

    setReportData({
      ...reportData,
      visits: [...reportData.visits, newVisit].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    });

    setShowAddVisitModal(false);
    setNewVisitDate(new Date().toISOString().split('T')[0]);
  };

  // Remove a visit
  const removeVisit = (visitId: string) => {
    setReportData({
      ...reportData,
      visits: reportData.visits.filter(visit => visit.id !== visitId)
    });
  };

  // Reset activity counts for a visit
  const resetActivityCounts = (visitId: string) => {
    if (window.confirm('Bu ziyaret için tüm aktivite sayım değerlerini sıfırlamak istediğinizden emin misiniz?')) {
      setReportData({
        ...reportData,
        visits: reportData.visits.map(visit => {
          if (visit.id === visitId) {
            return {
              ...visit,
              equipmentData: visit.equipmentData.map(equipment => {
                return {
                  ...equipment,
                  activityStatus: 'Aktivite Yok',
                  counts: {
                    rodent: 0,
                    cockroach: 0,
                    ant: 0,
                    other: 0,
                    housefly: 0,
                    mosquito: 0,
                    moth: 0,
                    bee: 0,
                    fruitFly: 0,
                    driedFruitMoth: 0,
                    flourMoth: 0,
                    clothesMoth: 0,
                    tobaccoMoth: 0,
                    otherStoredPest: 0
                  }
                };
              })
            };
          }
          return visit;
        })
      });
      
      setSuccess('Aktivite sayım değerleri başarıyla sıfırlandı');
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  // Open edit equipment modal
  const openEditEquipmentModal = (visitIndex: number, equipmentIndex: number) => {
    setCurrentVisitIndex(visitIndex);
    setCurrentEquipmentIndex(equipmentIndex);
    setEditingEquipment({...reportData.visits[visitIndex].equipmentData[equipmentIndex]});
    setShowEditEquipmentModal(true);
  };

  // Save edited equipment
  const saveEditedEquipment = () => {
    if (currentVisitIndex === null || currentEquipmentIndex === null || !editingEquipment) return;
    
    const updatedVisits = [...reportData.visits];
    updatedVisits[currentVisitIndex].equipmentData[currentEquipmentIndex] = editingEquipment;
    
    setReportData({
      ...reportData,
      visits: updatedVisits
    });
    
    setShowEditEquipmentModal(false);
    setEditingEquipment(null);
    setCurrentVisitIndex(null);
    setCurrentEquipmentIndex(null);
    
    setSuccess('Ekipman bilgileri başarıyla güncellendi');
    setTimeout(() => setSuccess(null), 3000);
  };

  // Prepare chart data
  const prepareChartData = () => {
    if (reportData.visits.length === 0) return null;
    
    // Sort visits by date
    const sortedVisits = [...reportData.visits].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Prepare labels (visit dates)
    const labels = sortedVisits.map(visit => {
      const date = new Date(visit.date);
      return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    });
    
    // Count active equipment by type for each visit
    const rodentData = sortedVisits.map(visit => {
      return visit.equipmentData
        .filter(eq => eq.type === 'Kemirgen Yemli İstasyon' && eq.activityStatus === 'Aktivite Var')
        .reduce((sum, eq) => sum + (eq.counts.rodent || 0), 0);
    });
    
    const cockroachData = sortedVisits.map(visit => {
      return visit.equipmentData
        .filter(eq => eq.type === 'Yapışkan Tuzak')
        .reduce((sum, eq) => sum + (eq.counts.cockroach || 0), 0);
    });
    
    const flyData = sortedVisits.map(visit => {
      return visit.equipmentData
        .filter(eq => eq.type === 'EFK (Elektrikli Sinek Tuzağı)')
        .reduce((sum, eq) => {
          return sum + (
            (eq.counts.housefly || 0) + 
            (eq.counts.mosquito || 0) + 
            (eq.counts.fruitFly || 0)
          );
        }, 0);
    });
    
    const mothData = sortedVisits.map(visit => {
      return visit.equipmentData
        .filter(eq => eq.type === 'Feromon Tuzağı' || eq.type === 'Depo Zararlısı Tuzağı')
        .reduce((sum, eq) => {
          return sum + (
            (eq.counts.moth || 0) + 
            (eq.counts.driedFruitMoth || 0) + 
            (eq.counts.flourMoth || 0) + 
            (eq.counts.clothesMoth || 0) + 
            (eq.counts.tobaccoMoth || 0)
          );
        }, 0);
    });
    
    return {
      labels,
      datasets: [
        {
          label: 'Kemirgen',
          data: rodentData,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1
        },
        {
          label: 'Hamam Böceği',
          data: cockroachData,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1
        },
        {
          label: 'Uçan Böcekler',
          data: flyData,
          backgroundColor: 'rgba(255, 206, 86, 0.5)',
          borderColor: 'rgb(255, 206, 86)',
          borderWidth: 1
        },
        {
          label: 'Güve',
          data: mothData,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1
        }
      ]
    };
  };

  // Prepare equipment activity chart data
  const prepareEquipmentActivityChart = () => {
    if (reportData.visits.length === 0) return null;
    
    // Count total equipment and active equipment by type
    const equipmentCounts: Record<string, { total: number, active: number }> = {};
    
    reportData.visits.forEach(visit => {
      visit.equipmentData.forEach(equipment => {
        if (!equipmentCounts[equipment.type]) {
          equipmentCounts[equipment.type] = { total: 0, active: 0 };
        }
        
        equipmentCounts[equipment.type].total++;
        if (equipment.activityStatus === 'Aktivite Var') {
          equipmentCounts[equipment.type].active++;
        }
      });
    });
    
    const labels = Object.keys(equipmentCounts);
    const activeData = labels.map(type => equipmentCounts[type].active);
    const inactiveData = labels.map(type => equipmentCounts[type].total - equipmentCounts[type].active);
    
    return {
      labels,
      datasets: [
        {
          label: 'Aktif',
          data: activeData,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1
        },
        {
          label: 'Pasif',
          data: inactiveData,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1
        }
      ]
    };
  };

  // Prepare location activity chart data
  const prepareLocationActivityChart = () => {
    if (reportData.visits.length === 0) return null;
    
    // Get unique locations
    const locations = new Set<string>();
    reportData.visits.forEach(visit => {
      visit.equipmentData.forEach(equipment => {
        locations.add(equipment.location);
      });
    });
    
    // Count active equipment by location
    const locationActivity: Record<string, number> = {};
    Array.from(locations).forEach(location => {
      locationActivity[location] = 0;
    });
    
    reportData.visits.forEach(visit => {
      visit.equipmentData.forEach(equipment => {
        if (equipment.activityStatus === 'Aktivite Var') {
          locationActivity[equipment.location]++;
        }
      });
    });
    
    const labels = Object.keys(locationActivity);
    const data = labels.map(location => locationActivity[location]);
    
    return {
      labels,
      datasets: [
        {
          label: 'Aktivite Sayısı',
          data,
          backgroundColor: 'rgba(153, 102, 255, 0.5)',
          borderColor: 'rgb(153, 102, 255)',
          borderWidth: 1
        }
      ]
    };
  };

  // Helper function to wait for all images to load
  const waitForImagesToLoad = async (element: HTMLElement): Promise<void> => {
    const images = Array.from(element.querySelectorAll('img'));
    if (images.length === 0) return Promise.resolve();
    
    return Promise.all(
      images.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error(`Failed to load image: ${img.src}`));
          // Set a timeout to avoid hanging forever
          setTimeout(() => resolve(), 5000);
        });
      })
    ).then(() => {});
  };

  // Export PDF
  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Create a PDF with A4 dimensions
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // A4 dimensions in mm
      const pageWidth = 210;
      const pageHeight = 297;
      
      // Get all page divs
      const pages = Array.from(reportRef.current.querySelectorAll('.report-page'));
      
      // Process each page
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        
        // Wait for all images on this page to load
        await waitForImagesToLoad(page as HTMLElement);
        
        // Add a new page for all pages except the first one
        if (i > 0) {
          pdf.addPage();
        }
        
        setProcessingPage(i + 1);
        
        // Capture the page as canvas
        const canvas = await html2canvas(page as HTMLElement, {
          scale: 2, // Higher scale for better quality
          useCORS: true,
          logging: false,
          backgroundColor: '#FFFFFF'
        });
        
        // Calculate the aspect ratio to fit the page to A4
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Add the image to the PDF
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      }
      
      // Save the PDF
      pdf.save(`Trend_Analiz_${reportData.companyName}_${reportData.reportDate}.pdf`);
      
      setSuccess('PDF başarıyla oluşturuldu!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error exporting PDF:', err);
      setError(`PDF oluşturulurken bir hata oluştu: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`);
    } finally {
      setLoading(false);
      setProcessingPage(null);
    }
  };

  // Export JPEG (A4 size)
  const handleExportJPEG = async () => {
    if (!reportRef.current) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Get all page divs
      const pages = Array.from(reportRef.current.querySelectorAll('.report-page'));
      
      // Process each page
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        
        // Wait for all images on this page to load
        await waitForImagesToLoad(page as HTMLElement);
        
        setProcessingPage(i + 1);
        
        // Capture the page as canvas
        const canvas = await html2canvas(page as HTMLElement, {
          scale: 2, // Higher scale for better quality
          useCORS: true,
          logging: false,
          backgroundColor: '#FFFFFF'
        });
        
        // Convert to JPEG and download
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const link = document.createElement('a');
        link.href = imgData;
        link.download = `Trend_Analiz_${reportData.companyName}_${reportData.reportDate}_Sayfa${i+1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Add a small delay between downloads to prevent browser issues
        if (i < pages.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      setSuccess('JPEG dosyaları başarıyla oluşturuldu!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error exporting JPEG:', err);
      setError(`JPEG oluşturulurken bir hata oluştu: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`);
    } finally {
      setLoading(false);
      setProcessingPage(null);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Get total count for a specific pest type across all visits
  const getTotalPestCount = (pestType: keyof EquipmentData['counts']) => {
    return reportData.visits.reduce((total, visit) => {
      return total + visit.equipmentData.reduce((sum, equipment) => {
        return sum + (equipment.counts[pestType] || 0);
      }, 0);
    }, 0);
  };

  // Get total active equipment count
  const getTotalActiveEquipment = () => {
    return reportData.visits.reduce((total, visit) => {
      return total + visit.equipmentData.filter(eq => eq.activityStatus === 'Aktivite Var').length;
    }, 0);
  };

  // Get total equipment count
  const getTotalEquipment = () => {
    return reportData.visits.reduce((total, visit) => {
      return total + visit.equipmentData.length;
    }, 0);
  };

  // Get activity percentage
  const getActivityPercentage = () => {
    const totalEquipment = getTotalEquipment();
    if (totalEquipment === 0) return 0;
    return (getTotalActiveEquipment() / totalEquipment * 100).toFixed(1);
  };

  // Get chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Zararlı Aktivite Trendi',
        font: {
          size: 16
        }
      },
    },
  };

  // Get equipment activity chart options
  const equipmentActivityChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Ekipman Türüne Göre Aktivite',
        font: {
          size: 16
        }
      }
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  // Get location activity chart options
  const locationActivityChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: 'Lokasyona Göre Aktivite',
        font: {
          size: 16
        }
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Otomatik Trend Analiz Modülü</h1>
        <div className="flex space-x-4">
          <button
            onClick={handleExportPDF}
            disabled={loading || reportData.visits.length === 0}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            {loading && processingPage ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Sayfa {processingPage} işleniyor...</span>
              </>
            ) : (
              <>
                <FileText className="h-5 w-5" />
                <span>PDF İndir</span>
              </>
            )}
          </button>
          <button
            onClick={handleExportJPEG}
            disabled={loading || reportData.visits.length === 0}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            {loading && processingPage ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Sayfa {processingPage} işleniyor...</span>
              </>
            ) : (
              <>
                <ImageIcon className="h-5 w-5" />
                <span>JPEG İndir</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success and Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Rapor Bilgileri</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Şirket Adı
                </label>
                <input
                  type="text"
                  value={reportData.companyName}
                  onChange={(e) => setReportData({...reportData, companyName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Şirket adını girin"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Müşteri Adı
                </label>
                <input
                  type="text"
                  value={reportData.customerName}
                  onChange={(e) => setReportData({...reportData, customerName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Müşteri adını girin"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rapor Tarihi
                </label>
                <input
                  type="date"
                  value={reportData.reportDate}
                  onChange={(e) => setReportData({...reportData, reportDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Ziyaretler</h2>
              <button
                onClick={() => setShowAddVisitModal(true)}
                className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Ziyaret Ekle
              </button>
            </div>
            
            {reportData.visits.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Henüz ziyaret eklenmemiş.</p>
                <button
                  onClick={() => setShowAddVisitModal(true)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm inline-flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Ziyaret Ekle
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {reportData.visits.map((visit, visitIndex) => (
                  <div 
                    key={visit.id} 
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-800">Ziyaret {visitIndex + 1}</h3>
                        <p className="text-sm text-gray-600">{formatDate(visit.date)}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => resetActivityCounts(visit.id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Aktivite Sayımlarını Sıfırla"
                        >
                          <RefreshCw className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => removeVisit(visit.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Ziyareti Sil"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-sm">
                      <div className="flex justify-between text-gray-600 mb-1">
                        <span>Toplam Ekipman:</span>
                        <span>{visit.equipmentData.length}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 mb-1">
                        <span>Aktif Ekipman:</span>
                        <span>{visit.equipmentData.filter(eq => eq.activityStatus === 'Aktivite Var').length}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Aktivite Oranı:</span>
                        <span className="text-blue-600">
                          {visit.equipmentData.length > 0 
                            ? ((visit.equipmentData.filter(eq => eq.activityStatus === 'Aktivite Var').length / visit.equipmentData.length) * 100).toFixed(1)
                            : 0}%
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        // Show visit details in the report preview
                        const element = document.getElementById(`visit-details-${visit.id}`);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="mt-3 text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    >
                      <span>Detayları Görüntüle</span>
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Report Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Rapor Önizleme</h2>
            
            <div 
              ref={reportRef}
              className="border border-gray-300 rounded-lg bg-white"
            >
              {/* Page 1: Summary */}
              <div className="report-page" style={{ width: '210mm', height: '297mm', padding: '20mm', position: 'relative' }}>
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Zararlı Trend Analiz Raporu</h1>
                    <p className="text-gray-600">Rapor Tarihi: {formatDate(reportData.reportDate)}</p>
                  </div>
                  {reportData.logoUrl && (
                    <img 
                      src={reportData.logoUrl} 
                      alt="Company Logo" 
                      className="h-16 object-contain"
                    />
                  )}
                </div>

                {/* Company Information */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Firma Bilgileri</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-gray-700">Şirket Adı:</p>
                      <p>{reportData.companyName || 'Belirtilmemiş'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Müşteri Adı:</p>
                      <p>{reportData.customerName || 'Belirtilmemiş'}</p>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Özet Bilgiler</h2>
                  
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-medium text-blue-800 mb-2">Ziyaret Bilgileri</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Toplam Ziyaret:</span>
                          <span className="font-medium">{reportData.visits.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">İlk Ziyaret:</span>
                          <span className="font-medium">
                            {reportData.visits.length > 0 
                              ? formatDate(reportData.visits.sort((a, b) => 
                                  new Date(a.date).getTime() - new Date(b.date).getTime()
                                )[0].date)
                              : 'Yok'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Son Ziyaret:</span>
                          <span className="font-medium">
                            {reportData.visits.length > 0 
                              ? formatDate(reportData.visits.sort((a, b) => 
                                  new Date(b.date).getTime() - new Date(a.date).getTime()
                                )[0].date)
                              : 'Yok'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-medium text-green-800 mb-2">Ekipman Bilgileri</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Toplam Ekipman:</span>
                          <span className="font-medium">{getTotalEquipment()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Aktif Ekipman:</span>
                          <span className="font-medium">{getTotalActiveEquipment()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Aktivite Oranı:</span>
                          <span className="font-medium">{getActivityPercentage()}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h3 className="font-medium text-red-800 mb-2">Zararlı Aktivitesi</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Kemirgen:</span>
                          <span className="font-medium">{getTotalPestCount('rodent')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Hamam Böceği:</span>
                          <span className="font-medium">{getTotalPestCount('cockroach')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Karınca:</span>
                          <span className="font-medium">{getTotalPestCount('ant')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Diğer:</span>
                          <span className="font-medium">{getTotalPestCount('other')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-medium text-purple-800 mb-2">Uçan Böcek Aktivitesi</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Karasinek:</span>
                          <span className="font-medium">{getTotalPestCount('housefly')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sivrisinek:</span>
                          <span className="font-medium">{getTotalPestCount('mosquito')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Güve:</span>
                          <span className="font-medium">{getTotalPestCount('moth')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Meyve Sineği:</span>
                          <span className="font-medium">{getTotalPestCount('fruitFly')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trend Chart */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Zararlı Trend Analizi</h2>
                  
                  {reportData.visits.length > 0 ? (
                    <div className="h-64">
                      <Bar 
                        data={prepareChartData() || {labels: [], datasets: []}} 
                        options={chartOptions} 
                      />
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">Trend analizi için ziyaret ekleyin.</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="absolute bottom-20 left-0 right-0 text-center text-sm text-gray-500">
                  <p>Bu rapor otomatik olarak oluşturulmuştur.</p>
                  <p>© {new Date().getFullYear()} PestMentor - Sistem İlaçlama San. ve Tic. Ltd. Şti.</p>
                </div>
              </div>

              {/* Page 2: Equipment Activity */}
              <div className="report-page" style={{ width: '210mm', height: '297mm', padding: '20mm', position: 'relative' }}>
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Ekipman Aktivite Analizi</h1>
                    <p className="text-gray-600">Rapor Tarihi: {formatDate(reportData.reportDate)}</p>
                  </div>
                  {reportData.logoUrl && (
                    <img 
                      src={reportData.logoUrl} 
                      alt="Company Logo" 
                      className="h-16 object-contain"
                    />
                  )}
                </div>

                {/* Equipment Activity Chart */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Ekipman Türüne Göre Aktivite</h2>
                  
                  {reportData.visits.length > 0 ? (
                    <div className="h-64 mb-8">
                      <Bar 
                        data={prepareEquipmentActivityChart() || {labels: [], datasets: []}} 
                        options={equipmentActivityChartOptions} 
                      />
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg mb-8">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">Ekipman aktivite analizi için ziyaret ekleyin.</p>
                    </div>
                  )}

                  {/* Location Activity Chart */}
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Lokasyona Göre Aktivite</h2>
                  
                  {reportData.visits.length > 0 ? (
                    <div className="h-64">
                      <Bar 
                        data={prepareLocationActivityChart() || {labels: [], datasets: []}} 
                        options={locationActivityChartOptions} 
                      />
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">Lokasyon aktivite analizi için ziyaret ekleyin.</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="absolute bottom-20 left-0 right-0 text-center text-sm text-gray-500">
                  <p>Bu rapor otomatik olarak oluşturulmuştur.</p>
                  <p>© {new Date().getFullYear()} PestMentor - Sistem İlaçlama San. ve Tic. Ltd. Şti.</p>
                </div>
              </div>

              {/* Page 3+: Visit Details (one page per visit) */}
              {reportData.visits.map((visit, visitIndex) => (
                <div 
                  key={visit.id} 
                  id={`visit-details-${visit.id}`}
                  className="report-page" 
                  style={{ width: '210mm', height: '297mm', padding: '20mm', position: 'relative' }}
                >
                  {/* Header */}
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">Ziyaret Detayları</h1>
                      <p className="text-gray-600">Ziyaret Tarihi: {formatDate(visit.date)}</p>
                    </div>
                    {reportData.logoUrl && (
                      <img 
                        src={reportData.logoUrl} 
                        alt="Company Logo" 
                        className="h-16 object-contain"
                      />
                    )}
                  </div>

                  {/* Visit Summary */}
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Ziyaret Özeti</h2>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h3 className="font-medium text-blue-800 mb-1 text-sm">Toplam Ekipman</h3>
                        <p className="text-2xl font-bold text-blue-600">{visit.equipmentData.length}</p>
                      </div>
                      
                      <div className="bg-green-50 p-3 rounded-lg">
                        <h3 className="font-medium text-green-800 mb-1 text-sm">Aktif Ekipman</h3>
                        <p className="text-2xl font-bold text-green-600">
                          {visit.equipmentData.filter(eq => eq.activityStatus === 'Aktivite Var').length}
                        </p>
                      </div>
                      
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <h3 className="font-medium text-purple-800 mb-1 text-sm">Aktivite Oranı</h3>
                        <p className="text-2xl font-bold text-purple-600">
                          {visit.equipmentData.length > 0 
                            ? ((visit.equipmentData.filter(eq => eq.activityStatus === 'Aktivite Var').length / visit.equipmentData.length) * 100).toFixed(1)
                            : 0}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Equipment Details */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Ekipman Detayları</h2>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Ekipman ID
                            </th>
                            <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Tür
                            </th>
                            <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Lokasyon
                            </th>
                            <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Durum
                            </th>
                            <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Detaylar
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {visit.equipmentData.map((equipment, equipmentIndex) => (
                            <tr key={equipment.id} className={equipment.activityStatus === 'Aktivite Var' ? 'bg-red-50' : ''}>
                              <td className="py-2 px-3 text-sm text-gray-900 border-b">
                                {equipment.id}
                              </td>
                              <td className="py-2 px-3 text-sm text-gray-900 border-b">
                                {equipment.type}
                              </td>
                              <td className="py-2 px-3 text-sm text-gray-900 border-b">
                                {equipment.location}
                              </td>
                              <td className="py-2 px-3 text-sm border-b">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  equipment.activityStatus === 'Aktivite Var' 
                                    ? 'bg-red-100 text-red-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {equipment.activityStatus}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-sm text-gray-900 border-b">
                                {equipment.type === 'Kemirgen Yemli İstasyon' && equipment.counts.rodent !== undefined && (
                                  <span>Kemirgen: {equipment.counts.rodent}</span>
                                )}
                                
                                {equipment.type === 'Canlı Yakalama Kapanı' && equipment.counts.rodent !== undefined && (
                                  <span>Kemirgen: {equipment.counts.rodent}</span>
                                )}
                                
                                {equipment.type === 'Yapışkan Tuzak' && (
                                  <div>
                                    {equipment.counts.cockroach !== undefined && <div>Hamam Böceği: {equipment.counts.cockroach}</div>}
                                    {equipment.counts.ant !== undefined && <div>Karınca: {equipment.counts.ant}</div>}
                                    {equipment.counts.other !== undefined && <div>Diğer: {equipment.counts.other}</div>}
                                  </div>
                                )}
                                
                                {equipment.type === 'EFK (Elektrikli Sinek Tuzağı)' && (
                                  <div>
                                    {equipment.counts.housefly !== undefined && <div>Karasinek: {equipment.counts.housefly}</div>}
                                    {equipment.counts.mosquito !== undefined && <div>Sivrisinek: {equipment.counts.mosquito}</div>}
                                    {equipment.counts.moth !== undefined && <div>Güve: {equipment.counts.moth}</div>}
                                    {equipment.counts.fruitFly !== undefined && <div>Meyve Sineği: {equipment.counts.fruitFly}</div>}
                                    {equipment.counts.bee !== undefined && <div>Arı: {equipment.counts.bee}</div>}
                                    {equipment.uvaPercentage !== undefined && <div>UVA: %{equipment.uvaPercentage}</div>}
                                  </div>
                                )}
                                
                                {equipment.type === 'Feromon Tuzağı' && equipment.counts.moth !== undefined && (
                                  <span>Güve: {equipment.counts.moth}</span>
                                )}
                                
                                {equipment.type === 'Depo Zararlısı Tuzağı' && (
                                  <div>
                                    {equipment.counts.driedFruitMoth !== undefined && <div>Kuru Meyve Güvesi: {equipment.counts.driedFruitMoth}</div>}
                                    {equipment.counts.flourMoth !== undefined && <div>Değirmen Güvesi: {equipment.counts.flourMoth}</div>}
                                    {equipment.counts.clothesMoth !== undefined && <div>Elbise Güvesi: {equipment.counts.clothesMoth}</div>}
                                    {equipment.counts.tobaccoMoth !== undefined && <div>Tütün Güvesi: {equipment.counts.tobaccoMoth}</div>}
                                    {equipment.counts.otherStoredPest !== undefined && <div>Diğer: {equipment.counts.otherStoredPest}</div>}
                                  </div>
                                )}
                                
                                <button
                                  onClick={() => openEditEquipmentModal(visitIndex, equipmentIndex)}
                                  className="mt-1 text-blue-600 hover:text-blue-800 text-xs flex items-center"
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  <span>Düzenle</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="absolute bottom-20 left-0 right-0 text-center text-sm text-gray-500">
                    <p>Bu rapor otomatik olarak oluşturulmuştur.</p>
                    <p>© {new Date().getFullYear()} PestMentor - Sistem İlaçlama San. ve Tic. Ltd. Şti.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Visit Modal */}
      {showAddVisitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Yeni Ziyaret Ekle</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ziyaret Tarihi
              </label>
              <input
                type="date"
                value={newVisitDate}
                onChange={(e) => setNewVisitDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowAddVisitModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={addVisit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Equipment Modal */}
      {showEditEquipmentModal && editingEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Ekipman Düzenle</h2>
              <button
                onClick={() => setShowEditEquipmentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ekipman ID
                </label>
                <input
                  type="text"
                  value={editingEquipment.id}
                  onChange={(e) => setEditingEquipment({...editingEquipment, id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ekipman Türü
                </label>
                <select
                  value={editingEquipment.type}
                  onChange={(e) => setEditingEquipment({...editingEquipment, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {equipmentTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lokasyon
                </label>
                <input
                  type="text"
                  value={editingEquipment.location}
                  onChange={(e) => setEditingEquipment({...editingEquipment, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aktivite Durumu
                </label>
                <select
                  value={editingEquipment.activityStatus}
                  onChange={(e) => setEditingEquipment({
                    ...editingEquipment, 
                    activityStatus: e.target.value as 'Aktivite Var' | 'Aktivite Yok'
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Aktivite Var">Aktivite Var</option>
                  <option value="Aktivite Yok">Aktivite Yok</option>
                </select>
              </div>
              
              {/* Conditional fields based on equipment type */}
              {(editingEquipment.type === 'Kemirgen Yemli İstasyon' || editingEquipment.type === 'Canlı Yakalama Kapanı') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kemirgen Sayısı
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingEquipment.counts.rodent || 0}
                    onChange={(e) => setEditingEquipment({
                      ...editingEquipment,
                      counts: {
                        ...editingEquipment.counts,
                        rodent: parseInt(e.target.value) || 0
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              
              {editingEquipment.type === 'Yapışkan Tuzak' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hamam Böceği Sayısı
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingEquipment.counts.cockroach || 0}
                      onChange={(e) => setEditingEquipment({
                        ...editingEquipment,
                        counts: {
                          ...editingEquipment.counts,
                          cockroach: parseInt(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Karınca Sayısı
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingEquipment.counts.ant || 0}
                      onChange={(e) => setEditingEquipment({
                        ...editingEquipment,
                        counts: {
                          ...editingEquipment.counts,
                          ant: parseInt(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Diğer Zararlı Sayısı
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingEquipment.counts.other || 0}
                      onChange={(e) => setEditingEquipment({
                        ...editingEquipment,
                        counts: {
                          ...editingEquipment.counts,
                          other: parseInt(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
              
              {editingEquipment.type === 'EFK (Elektrikli Sinek Tuzağı)' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Karasinek Sayısı
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingEquipment.counts.housefly || 0}
                      onChange={(e) => setEditingEquipment({
                        ...editingEquipment,
                        counts: {
                          ...editingEquipment.counts,
                          housefly: parseInt(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sivrisinek Sayısı
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingEquipment.counts.mosquito || 0}
                      onChange={(e) => setEditingEquipment({
                        ...editingEquipment,
                        counts: {
                          ...editingEquipment.counts,
                          mosquito: parseInt(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Güve Sayısı
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingEquipment.counts.moth || 0}
                      onChange={(e) => setEditingEquipment({
                        ...editingEquipment,
                        counts: {
                          ...editingEquipment.counts,
                          moth: parseInt(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meyve Sineği Sayısı
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingEquipment.counts.fruitFly || 0}
                      onChange={(e) => setEditingEquipment({
                        ...editingEquipment,
                        counts: {
                          ...editingEquipment.counts,
                          fruitFly: parseInt(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Arı Sayısı
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingEquipment.counts.bee || 0}
                      onChange={(e) => setEditingEquipment({
                        ...editingEquipment,
                        counts: {
                          ...editingEquipment.counts,
                          bee: parseInt(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      UVA Yüzdesi (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editingEquipment.uvaPercentage || 0}
                      onChange={(e) => setEditingEquipment({
                        ...editingEquipment,
                        uvaPercentage: parseInt(e.target.value) || 0
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
              
              {editingEquipment.type === 'Feromon Tuzağı' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Güve Sayısı
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingEquipment.counts.moth || 0}
                    onChange={(e) => setEditingEquipment({
                      ...editingEquipment,
                      counts: {
                        ...editingEquipment.counts,
                        moth: parseInt(e.target.value) || 0
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              
              {editingEquipment.type === 'Depo Zararlısı Tuzağı' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kuru Meyve Güvesi Sayısı
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingEquipment.counts.driedFruitMoth || 0}
                      onChange={(e) => setEditingEquipment({
                        ...editingEquipment,
                        counts: {
                          ...editingEquipment.counts,
                          driedFruitMoth: parseInt(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Değirmen Güvesi Sayısı
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingEquipment.counts.flourMoth || 0}
                      onChange={(e) => setEditingEquipment({
                        ...editingEquipment,
                        counts: {
                          ...editingEquipment.counts,
                          flourMoth: parseInt(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Elbise Güvesi Sayısı
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingEquipment.counts.clothesMoth || 0}
                      onChange={(e) => setEditingEquipment({
                        ...editingEquipment,
                        counts: {
                          ...editingEquipment.counts,
                          clothesMoth: parseInt(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tütün Güvesi Sayısı
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingEquipment.counts.tobaccoMoth || 0}
                      onChange={(e) => setEditingEquipment({
                        ...editingEquipment,
                        counts: {
                          ...editingEquipment.counts,
                          tobaccoMoth: parseInt(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Diğer Depo Zararlısı Sayısı
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingEquipment.counts.otherStoredPest || 0}
                      onChange={(e) => setEditingEquipment({
                        ...editingEquipment,
                        counts: {
                          ...editingEquipment.counts,
                          otherStoredPest: parseInt(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowEditEquipmentModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={saveEditedEquipment}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <AlertCircle className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Otomatik Trend Analiz Modülü Kullanımı</h3>
            <ul className="space-y-2 text-blue-700">
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2"></div>
                <span>Şirket adı, müşteri adı ve rapor tarihi girerek başlayın</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2"></div>
                <span>İsterseniz şirket logonuzu yükleyin</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2"></div>
                <span>"Ziyaret Ekle" butonu ile ziyaret ekleyin - sistem otomatik olarak ekipman ve aktivite verileri oluşturacaktır</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2"></div>
                <span>Ekipman verilerini düzenlemek için ziyaret detaylarında "Düzenle" butonunu kullanın</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2"></div>
                <span>Aktivite sayım değerlerini sıfırlamak için "Aktivite Sayımlarını Sıfırla" butonunu kullanın</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2"></div>
                <span>Raporu PDF veya JPEG formatında indirin - her sayfa ayrı olarak indirilecektir</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoTrendAnalysisPage;