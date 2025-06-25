import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Building, User, Calendar, Download, Save, Printer, FileText, AlertTriangle, Bug, Rat, Bird, Skull, Thermometer, Droplets, Wind, Sun, Home, Factory, Warehouse, Store, Hotel, School, Guitar as Hospital, Utensils, Trash2, Truck, Leaf, Zap, Layers, CheckCircle, XCircle, Clock, ArrowLeft, Phone, Mail, Image, FileImage, File as FilePdf } from 'lucide-react';
import html2canvas from 'html2canvas';
import { supabase } from '../lib/supabase';
import jsPDF from 'jspdf';

const RiskAssessmentPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    assessorCompany: '',
    assessorName: '',
    clientCompany: '',
    clientName: '',
    assessmentDate: new Date().toISOString().split('T')[0],
    propertyType: '',
    rodentRisk: 'low',
    insectRisk: 'low',
    birdRisk: 'low',
    otherRisk: 'low',
    notes: '',
    recommendations: '',
    logo: null as File | null,
    logoPreview: '',
    signature: null as File | null,
    signaturePreview: '',
    assessorTitle: '',
    assessorContact: '',
    assessmentLocation: '',
    propertySize: '',
    propertyAge: '',
    constructionType: '',
    surroundingEnvironment: '',
    historyOfInfestation: '',
    currentControlMeasures: '',
    foodStoragePractices: '',
    wasteManagementPractices: '',
    buildingMaintenance: '',
    landscapeMaintenance: '',
    waterSources: '',
    accessPoints: '',
    ventilationSystems: '',
    lightingConditions: '',
    humanTraffic: '',
    seasonalFactors: '',
    regulatoryRequirements: '',
    industryStandards: '',
    clientExpectations: '',
    budgetConstraints: '',
    timelineRequirements: '',
    specialConsiderations: '',
    rodentSpecies: [] as string[],
    insectSpecies: [] as string[],
    birdSpecies: [] as string[],
    otherSpecies: [] as string[],
    rodentEvidence: [] as string[],
    insectEvidence: [] as string[],
    birdEvidence: [] as string[],
    otherEvidence: [] as string[],
    rodentRecommendations: '',
    insectRecommendations: '',
    birdRecommendations: '',
    otherRecommendations: '',
    rodentPriority: 'medium',
    insectPriority: 'medium',
    birdPriority: 'medium',
    otherPriority: 'medium',
    rodentTimeframe: 'immediate',
    insectTimeframe: 'immediate',
    birdTimeframe: 'immediate',
    otherTimeframe: 'immediate',
    rodentControlMethods: [] as string[],
    insectControlMethods: [] as string[],
    birdControlMethods: [] as string[],
    otherControlMethods: [] as string[],
    preventativeMeasures: '',
    monitoringPlan: '',
    staffTraining: '',
    followUpSchedule: '',
    emergencyProcedures: '',
    documentationRequirements: '',
    regulatoryCompliance: '',
    costEstimate: '',
    implementationTimeline: '',
    maintenanceRequirements: '',
    evaluationCriteria: '',
    reportDate: new Date().toISOString().split('T')[0],
    reportNumber: `RA-${Math.floor(100000 + Math.random() * 900000)}`,
    confidentialityStatement: 'Bu rapor gizli bilgiler içermektedir ve yalnızca yetkili kişiler tarafından kullanılmalıdır.',
    disclaimer: 'Bu risk değerlendirmesi, değerlendirme tarihindeki koşullara dayanmaktadır. Koşullar değişebilir ve bu değerlendirmenin geçerliliğini etkileyebilir.',
    rodentScore: 0,
    insectScore: 0,
    birdScore: 0,
    otherScore: 0,
    overallRiskScore: 0,
    overallRiskLevel: 'Düşük'
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportUrl, setReportUrl] = useState('');
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const rodentSpeciesOptions = [
    'Ev Faresi (Mus musculus)',
    'Norveç Sıçanı (Rattus norvegicus)',
    'Çatı Sıçanı (Rattus rattus)',
    'Tarla Faresi',
    'Diğer Kemirgenler'
  ];

  const insectSpeciesOptions = [
    'Hamam Böceği (Blattella germanica)',
    'Karafatma (Blatta orientalis)',
    'Karınca',
    'Sivrisinek',
    'Karasinek',
    'Meyve Sineği',
    'Bit',
    'Pire',
    'Tahta Kurusu',
    'Güve',
    'Gümüş Balığı',
    'Kene',
    'Ambar Zararlıları',
    'Arı',
    'Eşek Arısı',
    'Diğer Böcekler'
  ];

  const birdSpeciesOptions = [
    'Güvercin',
    'Martı',
    'Serçe',
    'Sığırcık',
    'Karga',
    'Kumru',
    'Diğer Kuşlar'
  ];

  const otherSpeciesOptions = [
    'Örümcek',
    'Akrep',
    'Yılan',
    'Kertenkele',
    'Salyangoz',
    'Sümüklü Böcek',
    'Yumuşakça',
    'Diğer'
  ];

  const evidenceOptions = [
    'Canlı Örnek Görüldü',
    'Ölü Örnek Bulundu',
    'Dışkı İzleri',
    'Kemirme İzleri',
    'Yuva/Barınak',
    'Ayak/Pati İzleri',
    'Ses',
    'Koku',
    'Hasar Belirtileri',
    'Tüy/Kıl',
    'Yumurta/Larva',
    'Diğer'
  ];

  const controlMethodOptions = [
    'Kimyasal Mücadele',
    'Mekanik Tuzaklar',
    'Fiziksel Engelleme',
    'Ultrasonik Cihazlar',
    'Biyolojik Mücadele',
    'Isı Uygulaması',
    'Soğuk Uygulaması',
    'Feromon Tuzakları',
    'Işık Tuzakları',
    'Yapışkan Tuzaklar',
    'Elektrikli Tuzaklar',
    'Fumigasyon',
    'ULV Uygulaması',
    'Jel Yem',
    'Granül Yem',
    'Diğer'
  ];

  const propertyTypeOptions = [
    'Konut',
    'Ofis',
    'Restoran',
    'Gıda Üretim Tesisi',
    'Depo',
    'Otel',
    'Hastane',
    'Okul',
    'Fabrika',
    'Perakende Mağaza',
    'Diğer'
  ];

  const priorityOptions = [
    { value: 'low', label: 'Düşük', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Orta', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'Yüksek', color: 'bg-orange-100 text-orange-800' },
    { value: 'critical', label: 'Kritik', color: 'bg-red-100 text-red-800' }
  ];

  const timeframeOptions = [
    { value: 'immediate', label: 'Acil (0-7 gün)', color: 'bg-red-100 text-red-800' },
    { value: 'short', label: 'Kısa Vadeli (1-4 hafta)', color: 'bg-orange-100 text-orange-800' },
    { value: 'medium', label: 'Orta Vadeli (1-3 ay)', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'long', label: 'Uzun Vadeli (3+ ay)', color: 'bg-green-100 text-green-800' }
  ];

  const riskLevelOptions = [
    { value: 'low', label: 'Düşük', color: 'bg-green-100 text-green-800', score: 1 },
    { value: 'medium', label: 'Orta', color: 'bg-yellow-100 text-yellow-800', score: 2 },
    { value: 'high', label: 'Yüksek', color: 'bg-orange-100 text-orange-800', score: 3 },
    { value: 'critical', label: 'Kritik', color: 'bg-red-100 text-red-800', score: 4 }
  ];

  const getRiskLevelColor = (level: string) => {
    const option = riskLevelOptions.find(opt => opt.value === level);
    return option ? option.color : 'bg-gray-100 text-gray-800';
  };

  const getRiskLevelLabel = (level: string) => {
    const option = riskLevelOptions.find(opt => opt.value === level);
    return option ? option.label : 'Bilinmiyor';
  };

  const getPriorityColor = (priority: string) => {
    const option = priorityOptions.find(opt => opt.value === priority);
    return option ? option.color : 'bg-gray-100 text-gray-800';
  };

  const getPriorityLabel = (priority: string) => {
    const option = priorityOptions.find(opt => opt.value === priority);
    return option ? option.label : 'Bilinmiyor';
  };

  const getTimeframeColor = (timeframe: string) => {
    const option = timeframeOptions.find(opt => opt.value === timeframe);
    return option ? option.color : 'bg-gray-100 text-gray-800';
  };

  const getTimeframeLabel = (timeframe: string) => {
    const option = timeframeOptions.find(opt => opt.value === timeframe);
    return option ? option.label : 'Bilinmiyor';
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'Konut': return Home;
      case 'Ofis': return Building;
      case 'Restoran': return Utensils;
      case 'Gıda Üretim Tesisi': return Factory;
      case 'Depo': return Warehouse;
      case 'Otel': return Hotel;
      case 'Hastane': return Hospital;
      case 'Okul': return School;
      case 'Fabrika': return Factory;
      case 'Perakende Mağaza': return Store;
      default: return Building;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (category: string, value: string) => {
    const fieldName = `${category}Species` as keyof typeof formData;
    const currentValues = [...(formData[fieldName] as string[])];
    
    if (currentValues.includes(value)) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: currentValues.filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [fieldName]: [...currentValues, value]
      }));
    }
  };

  const handleEvidenceChange = (category: string, value: string) => {
    const fieldName = `${category}Evidence` as keyof typeof formData;
    const currentValues = [...(formData[fieldName] as string[])];
    
    if (currentValues.includes(value)) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: currentValues.filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [fieldName]: [...currentValues, value]
      }));
    }
  };

  const handleControlMethodChange = (category: string, value: string) => {
    const fieldName = `${category}ControlMethods` as keyof typeof formData;
    const currentValues = [...(formData[fieldName] as string[])];
    
    if (currentValues.includes(value)) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: currentValues.filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [fieldName]: [...currentValues, value]
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'signature') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          [field]: file,
          [`${field}Preview`]: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      if (step === 4) {
        calculateRiskScores();
      }
      setStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const validateStep = () => {
    setError(null);
    
    switch (step) {
      case 1:
        if (!formData.assessorCompany || !formData.assessorName || !formData.clientCompany || !formData.clientName || !formData.assessmentDate || !formData.propertyType) {
          setError('Lütfen tüm zorunlu alanları doldurun');
          return false;
        }
        return true;
      
      case 2:
        // Validation for step 2 if needed
        return true;
      
      case 3:
        // Validation for step 3 if needed
        return true;
      
      case 4:
        // Validation for step 4 if needed
        return true;
      
      default:
        return true;
    }
  };

  const calculateRiskScores = () => {
    // Calculate risk scores based on selected options
    const getRiskScore = (level: string) => {
      const option = riskLevelOptions.find(opt => opt.value === level);
      return option ? option.score : 0;
    };

    const rodentScore = getRiskScore(formData.rodentRisk);
    const insectScore = getRiskScore(formData.insectRisk);
    const birdScore = getRiskScore(formData.birdRisk);
    const otherScore = getRiskScore(formData.otherRisk);
    
    // Calculate overall risk score (average of all scores)
    const overallScore = (rodentScore + insectScore + birdScore + otherScore) / 4;
    
    // Determine overall risk level based on score
    let overallRiskLevel = 'Düşük';
    if (overallScore >= 3.5) {
      overallRiskLevel = 'Kritik';
    } else if (overallScore >= 2.5) {
      overallRiskLevel = 'Yüksek';
    } else if (overallScore >= 1.5) {
      overallRiskLevel = 'Orta';
    }
    
    setFormData(prev => ({
      ...prev,
      rodentScore,
      insectScore,
      birdScore,
      otherScore,
      overallRiskScore: overallScore,
      overallRiskLevel
    }));
  };

  const saveReport = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Capture the report as an image
      if (reportRef.current) {
        const canvas = await html2canvas(reportRef.current, {
          scale: 2,
          logging: false,
          useCORS: true,
          allowTaint: true,
          scrollX: 0,
          scrollY: 0
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        
        // Convert base64 to blob
        const byteString = atob(imgData.split(',')[1]);
        const mimeString = imgData.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        
        // Generate a unique filename
        const filename = `risk_assessment_${Date.now()}.jpg`;
        
        // Upload to Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(`risk_assessments/${filename}`, blob, {
            contentType: 'image/jpeg',
            cacheControl: '3600'
          });
        
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('documents')
          .getPublicUrl(`risk_assessments/${filename}`);
        
        const reportUrl = urlData.publicUrl;
        setReportUrl(reportUrl);
        
        // Save to database
        const { error: dbError } = await supabase
          .from('risk_assessments')
          .insert([
            {
              assessor_company: formData.assessorCompany,
              assessor_name: formData.assessorName,
              client_company: formData.clientCompany,
              client_name: formData.clientName,
              assessment_date: formData.assessmentDate,
              property_type: formData.propertyType,
              rodent_risk: formData.rodentRisk,
              insect_risk: formData.insectRisk,
              bird_risk: formData.birdRisk,
              other_risk: formData.otherRisk,
              report_url: reportUrl
            }
          ]);
        
        if (dbError) throw dbError;
        
        setSuccess(true);
      }
    } catch (error) {
      console.error('Error saving report:', error);
      setError('Rapor kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const downloadReportAsImage = async () => {
    if (reportRef.current) {
      try {
        const canvas = await html2canvas(reportRef.current, {
          scale: 2,
          logging: false,
          useCORS: true,
          allowTaint: true,
          scrollX: 0,
          scrollY: 0
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        
        const link = document.createElement('a');
        link.href = imgData;
        link.download = `risk_assessment_${formData.clientCompany.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.jpg`;
        link.click();
      } catch (error) {
        console.error('Error downloading report:', error);
        setError('Rapor indirilirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }
  };

  const downloadReportAsPdf = async () => {
    if (reportRef.current) {
      try {
        setIsGeneratingPdf(true);
        
        // Create a new PDF document
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        // Define page dimensions
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        // Function to add page number
        const addPageNumber = (pageNumber: number, totalPages: number) => {
          pdf.setFontSize(8);
          pdf.setTextColor(100, 100, 100);
          pdf.text(`Sayfa ${pageNumber}/${totalPages}`, pageWidth / 2, pageHeight - 5, { align: 'center' });
        };

        // Create sections of the report
        const sections = [
          { id: 'header-section', title: 'Kapak' },
          { id: 'summary-section', title: 'Risk Özeti' },
          { id: 'property-section', title: 'Mülk Bilgileri' },
          { id: 'risk-assessment-section', title: 'Risk Değerlendirmesi' },
          { id: 'recommendations-section', title: 'Öneriler' },
          { id: 'conclusion-section', title: 'Sonuç' }
        ];
        
        // Capture each section separately
        let totalPages = sections.length;
        
        // First, create temporary elements for each section
        const tempElements: HTMLDivElement[] = [];
        
        for (const section of sections) {
          const sectionElement = document.getElementById(section.id);
          if (sectionElement) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = sectionElement.outerHTML;
            tempDiv.style.width = '210mm';
            tempDiv.style.padding = '10mm';
            tempDiv.style.backgroundColor = 'white';
            document.body.appendChild(tempDiv);
            tempElements.push(tempDiv);
          }
        }
        
        // Now capture each section and add to PDF
        for (let i = 0; i < tempElements.length; i++) {
          const element = tempElements[i];
          
          // Special handling for risk assessment section which needs two pages
          if (sections[i].id === 'risk-assessment-section') {
            // Capture the section
            const canvas = await html2canvas(element, {
              scale: 2,
              logging: false,
              useCORS: true,
              allowTaint: true
            });
            
            // Add a new page for this section
            if (i > 0) pdf.addPage();
            
            // Add content to the first page
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            pdf.addImage(imgData, 'JPEG', 10, 10, pageWidth - 20, 0, '', 'FAST');
            addPageNumber(i + 1, totalPages + 1); // +1 because this section takes 2 pages
            
            // Add a second page for the continuation of this section
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 10, -(pageHeight - 40), pageWidth - 20, 0, '', 'FAST');
            addPageNumber(i + 2, totalPages + 1);
            
            // Adjust total pages and current index
            totalPages++;
            i++;
          } else {
            // Regular section handling
            const canvas = await html2canvas(element, {
              scale: 2,
              logging: false,
              useCORS: true,
              allowTaint: true
            });
            
            if (i > 0) pdf.addPage();
            
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            pdf.addImage(imgData, 'JPEG', 10, 10, pageWidth - 20, 0, '', 'FAST');
            addPageNumber(i + 1, totalPages);
          }
        }
        
        // Clean up temporary elements
        tempElements.forEach(el => document.body.removeChild(el));
        
        // Save the PDF
        pdf.save(`risk_assessment_${formData.clientCompany.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
      } catch (error) {
        console.error('Error generating PDF:', error);
        setError('PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
      } finally {
        setIsGeneratingPdf(false);
      }
    }
  };

  const printReport = () => {
    window.print();
  };

  const resetForm = () => {
    setFormData({
      assessorCompany: '',
      assessorName: '',
      clientCompany: '',
      clientName: '',
      assessmentDate: new Date().toISOString().split('T')[0],
      propertyType: '',
      rodentRisk: 'low',
      insectRisk: 'low',
      birdRisk: 'low',
      otherRisk: 'low',
      notes: '',
      recommendations: '',
      logo: null,
      logoPreview: '',
      signature: null,
      signaturePreview: '',
      assessorTitle: '',
      assessorContact: '',
      assessmentLocation: '',
      propertySize: '',
      propertyAge: '',
      constructionType: '',
      surroundingEnvironment: '',
      historyOfInfestation: '',
      currentControlMeasures: '',
      foodStoragePractices: '',
      wasteManagementPractices: '',
      buildingMaintenance: '',
      landscapeMaintenance: '',
      waterSources: '',
      accessPoints: '',
      ventilationSystems: '',
      lightingConditions: '',
      humanTraffic: '',
      seasonalFactors: '',
      regulatoryRequirements: '',
      industryStandards: '',
      clientExpectations: '',
      budgetConstraints: '',
      timelineRequirements: '',
      specialConsiderations: '',
      rodentSpecies: [],
      insectSpecies: [],
      birdSpecies: [],
      otherSpecies: [],
      rodentEvidence: [],
      insectEvidence: [],
      birdEvidence: [],
      otherEvidence: [],
      rodentRecommendations: '',
      insectRecommendations: '',
      birdRecommendations: '',
      otherRecommendations: '',
      rodentPriority: 'medium',
      insectPriority: 'medium',
      birdPriority: 'medium',
      otherPriority: 'medium',
      rodentTimeframe: 'immediate',
      insectTimeframe: 'immediate',
      birdTimeframe: 'immediate',
      otherTimeframe: 'immediate',
      rodentControlMethods: [],
      insectControlMethods: [],
      birdControlMethods: [],
      otherControlMethods: [],
      preventativeMeasures: '',
      monitoringPlan: '',
      staffTraining: '',
      followUpSchedule: '',
      emergencyProcedures: '',
      documentationRequirements: '',
      regulatoryCompliance: '',
      costEstimate: '',
      implementationTimeline: '',
      maintenanceRequirements: '',
      evaluationCriteria: '',
      reportDate: new Date().toISOString().split('T')[0],
      reportNumber: `RA-${Math.floor(100000 + Math.random() * 900000)}`,
      confidentialityStatement: 'Bu rapor gizli bilgiler içermektedir ve yalnızca yetkili kişiler tarafından kullanılmalıdır.',
      disclaimer: 'Bu risk değerlendirmesi, değerlendirme tarihindeki koşullara dayanmaktadır. Koşullar değişebilir ve bu değerlendirmenin geçerliliğini etkileyebilir.',
      rodentScore: 0,
      insectScore: 0,
      birdScore: 0,
      otherScore: 0,
      overallRiskScore: 0,
      overallRiskLevel: 'Düşük'
    });
    setStep(1);
    setSuccess(false);
    setError(null);
    setReportUrl('');
  };

  return (
    <div className="pt-8">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-12 w-12 text-blue-600 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              Risk Değerlendirme Modülü
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Zararlı mücadelesi için profesyonel risk değerlendirme raporu oluşturun. 
            Müşterilerinize sunabileceğiniz detaylı risk analizi ve öneriler.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {success ? (
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Risk Değerlendirme Raporu Oluşturuldu</h2>
                <p className="text-gray-600">Raporunuz başarıyla oluşturuldu ve kaydedildi.</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Rapor Bilgileri</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Müşteri:</p>
                    <p className="font-medium text-gray-800">{formData.clientCompany}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Değerlendirme Tarihi:</p>
                    <p className="font-medium text-gray-800">{new Date(formData.assessmentDate).toLocaleDateString('tr-TR')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rapor Numarası:</p>
                    <p className="font-medium text-gray-800">{formData.reportNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Genel Risk Seviyesi:</p>
                    <p className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      formData.overallRiskLevel === 'Düşük' ? 'bg-green-100 text-green-800' :
                      formData.overallRiskLevel === 'Orta' ? 'bg-yellow-100 text-yellow-800' :
                      formData.overallRiskLevel === 'Yüksek' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {formData.overallRiskLevel}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center mb-8">
                <button
                  onClick={downloadReportAsImage}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <FileImage className="h-5 w-5" />
                  <span>JPEG Olarak İndir</span>
                </button>
                <button
                  onClick={downloadReportAsPdf}
                  disabled={isGeneratingPdf}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  <FilePdf className="h-5 w-5" />
                  <span>{isGeneratingPdf ? 'PDF Hazırlanıyor...' : 'PDF Olarak İndir'}</span>
                </button>
                <button
                  onClick={printReport}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <Printer className="h-5 w-5" />
                  <span>Yazdır</span>
                </button>
              </div>

              <div className="text-center">
                <button
                  onClick={resetForm}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Yeni Rapor Oluştur
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex justify-between items-center">
                  {[1, 2, 3, 4, 5].map((stepNumber) => (
                    <div key={stepNumber} className="flex items-center">
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                          step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {stepNumber}
                      </div>
                      {stepNumber < 5 && (
                        <div 
                          className={`h-1 w-16 ${
                            step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        ></div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-600">Temel Bilgiler</span>
                  <span className="text-xs text-gray-600">Mülk Detayları</span>
                  <span className="text-xs text-gray-600">Risk Analizi</span>
                  <span className="text-xs text-gray-600">Öneriler</span>
                  <span className="text-xs text-gray-600">Rapor</span>
                </div>
              </div>

              {/* Form Steps */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                {/* Step 1: Basic Information */}
                {step === 1 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Temel Bilgiler</h2>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Değerlendirme Şirketi *
                        </label>
                        <input
                          type="text"
                          name="assessorCompany"
                          value={formData.assessorCompany}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Şirket adınız"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Değerlendirme Uzmanı *
                        </label>
                        <input
                          type="text"
                          name="assessorName"
                          value={formData.assessorName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Adınız ve soyadınız"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Uzman Ünvanı
                        </label>
                        <input
                          type="text"
                          name="assessorTitle"
                          value={formData.assessorTitle}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Ünvanınız"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          İletişim Bilgisi
                        </label>
                        <input
                          type="text"
                          name="assessorContact"
                          value={formData.assessorContact}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Telefon veya e-posta"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Müşteri Şirketi *
                        </label>
                        <input
                          type="text"
                          name="clientCompany"
                          value={formData.clientCompany}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Müşteri şirket adı"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Müşteri Yetkilisi *
                        </label>
                        <input
                          type="text"
                          name="clientName"
                          value={formData.clientName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Müşteri yetkili adı"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Değerlendirme Tarihi *
                        </label>
                        <input
                          type="date"
                          name="assessmentDate"
                          value={formData.assessmentDate}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mülk Türü *
                        </label>
                        <select
                          name="propertyType"
                          value={formData.propertyType}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Seçiniz</option>
                          {propertyTypeOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Değerlendirme Lokasyonu
                        </label>
                        <input
                          type="text"
                          name="assessmentLocation"
                          value={formData.assessmentLocation}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Adres veya lokasyon"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rapor Numarası
                        </label>
                        <input
                          type="text"
                          name="reportNumber"
                          value={formData.reportNumber}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Rapor numarası"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Şirket Logosu
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'logo')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {formData.logoPreview && (
                          <div className="mt-2">
                            <img 
                              src={formData.logoPreview} 
                              alt="Logo Önizleme" 
                              className="h-16 object-contain"
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          İmza
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'signature')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {formData.signaturePreview && (
                          <div className="mt-2">
                            <img 
                              src={formData.signaturePreview} 
                              alt="İmza Önizleme" 
                              className="h-16 object-contain"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Property Details */}
                {step === 2 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Mülk Detayları</h2>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mülk Büyüklüğü
                        </label>
                        <input
                          type="text"
                          name="propertySize"
                          value={formData.propertySize}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="m² cinsinden"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mülk Yaşı
                        </label>
                        <input
                          type="text"
                          name="propertyAge"
                          value={formData.propertyAge}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Yıl cinsinden"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Yapı Tipi
                        </label>
                        <input
                          type="text"
                          name="constructionType"
                          value={formData.constructionType}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Betonarme, ahşap, vb."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Çevre Koşulları
                        </label>
                        <input
                          type="text"
                          name="surroundingEnvironment"
                          value={formData.surroundingEnvironment}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Şehir merkezi, kırsal, vb."
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Geçmiş Zararlı Problemi
                      </label>
                      <textarea
                        name="historyOfInfestation"
                        value={formData.historyOfInfestation}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        placeholder="Geçmişte yaşanan zararlı problemleri"
                      ></textarea>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mevcut Kontrol Önlemleri
                      </label>
                      <textarea
                        name="currentControlMeasures"
                        value={formData.currentControlMeasures}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        placeholder="Halihazırda uygulanan zararlı kontrol önlemleri"
                      ></textarea>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gıda Depolama Uygulamaları
                        </label>
                        <textarea
                          name="foodStoragePractices"
                          value={formData.foodStoragePractices}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          placeholder="Gıda depolama koşulları ve uygulamaları"
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Atık Yönetimi Uygulamaları
                        </label>
                        <textarea
                          name="wasteManagementPractices"
                          value={formData.wasteManagementPractices}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          placeholder="Atık toplama ve bertaraf uygulamaları"
                        ></textarea>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bina Bakımı
                        </label>
                        <textarea
                          name="buildingMaintenance"
                          value={formData.buildingMaintenance}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          placeholder="Bina bakım uygulamaları ve sıklığı"
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Peyzaj Bakımı
                        </label>
                        <textarea
                          name="landscapeMaintenance"
                          value={formData.landscapeMaintenance}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          placeholder="Bahçe ve çevre düzenleme bakımı"
                        ></textarea>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Su Kaynakları
                        </label>
                        <textarea
                          name="waterSources"
                          value={formData.waterSources}
                          onChange={handleChange}
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          placeholder="Su birikintileri, havuzlar, vb."
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Giriş Noktaları
                        </label>
                        <textarea
                          name="accessPoints"
                          value={formData.accessPoints}
                          onChange={handleChange}
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          placeholder="Kapılar, pencereler, çatlaklar, vb."
                        ></textarea>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Havalandırma Sistemleri
                        </label>
                        <textarea
                          name="ventilationSystems"
                          value={formData.ventilationSystems}
                          onChange={handleChange}
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          placeholder="HVAC sistemleri, havalandırma kanalları, vb."
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Aydınlatma Koşulları
                        </label>
                        <textarea
                          name="lightingConditions"
                          value={formData.lightingConditions}
                          onChange={handleChange}
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          placeholder="İç ve dış aydınlatma sistemleri"
                        ></textarea>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          İnsan Trafiği
                        </label>
                        <textarea
                          name="humanTraffic"
                          value={formData.humanTraffic}
                          onChange={handleChange}
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          placeholder="Günlük ziyaretçi sayısı, yoğun saatler, vb."
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mevsimsel Faktörler
                        </label>
                        <textarea
                          name="seasonalFactors"
                          value={formData.seasonalFactors}
                          onChange={handleChange}
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          placeholder="Mevsimsel zararlı aktivitesi, hava koşulları, vb."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Risk Analysis */}
                {step === 3 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Risk Analizi</h2>
                    
                    {/* Rodent Risk */}
                    <div className="mb-8">
                      <div className="flex items-center mb-4">
                        <Rat className="h-6 w-6 text-gray-700 mr-2" />
                        <h3 className="text-xl font-semibold text-gray-800">Kemirgen Riski</h3>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Risk Seviyesi
                          </label>
                          <select
                            name="rodentRisk"
                            value={formData.rodentRisk}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {riskLevelOptions.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Öncelik
                          </label>
                          <select
                            name="rodentPriority"
                            value={formData.rodentPriority}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {priorityOptions.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tespit Edilen Türler
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {rodentSpeciesOptions.map((species) => (
                            <label key={species} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={formData.rodentSpecies.includes(species)}
                                onChange={() => handleCheckboxChange('rodent', species)}
                                className="rounded text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">{species}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tespit Edilen Kanıtlar
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {evidenceOptions.map((evidence) => (
                            <label key={evidence} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={formData.rodentEvidence.includes(evidence)}
                                onChange={() => handleEvidenceChange('rodent', evidence)}
                                className="rounded text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">{evidence}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Insect Risk */}
                    <div className="mb-8">
                      <div className="flex items-center mb-4">
                        <Bug className="h-6 w-6 text-gray-700 mr-2" />
                        <h3 className="text-xl font-semibold text-gray-800">Böcek Riski</h3>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Risk Seviyesi
                          </label>
                          <select
                            name="insectRisk"
                            value={formData.insectRisk}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {riskLevelOptions.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Öncelik
                          </label>
                          <select
                            name="insectPriority"
                            value={formData.insectPriority}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {priorityOptions.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tespit Edilen Türler
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {insectSpeciesOptions.map((species) => (
                            <label key={species} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={formData.insectSpecies.includes(species)}
                                onChange={() => handleCheckboxChange('insect', species)}
                                className="rounded text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">{species}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tespit Edilen Kanıtlar
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {evidenceOptions.map((evidence) => (
                            <label key={evidence} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={formData.insectEvidence.includes(evidence)}
                                onChange={() => handleEvidenceChange('insect', evidence)}
                                className="rounded text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">{evidence}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bird Risk */}
                    <div className="mb-8">
                      <div className="flex items-center mb-4">
                        <Bird className="h-6 w-6 text-gray-700 mr-2" />
                        <h3 className="text-xl font-semibold text-gray-800">Kuş Riski</h3>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Risk Seviyesi
                          </label>
                          <select
                            name="birdRisk"
                            value={formData.birdRisk}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {riskLevelOptions.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Öncelik
                          </label>
                          <select
                            name="birdPriority"
                            value={formData.birdPriority}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {priorityOptions.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tespit Edilen Türler
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {birdSpeciesOptions.map((species) => (
                            <label key={species} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={formData.birdSpecies.includes(species)}
                                onChange={() => handleCheckboxChange('bird', species)}
                                className="rounded text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">{species}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tespit Edilen Kanıtlar
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {evidenceOptions.map((evidence) => (
                            <label key={evidence} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={formData.birdEvidence.includes(evidence)}
                                onChange={() => handleEvidenceChange('bird', evidence)}
                                className="rounded text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">{evidence}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Other Risk */}
                    <div className="mb-8">
                      <div className="flex items-center mb-4">
                        <Skull className="h-6 w-6 text-gray-700 mr-2" />
                        <h3 className="text-xl font-semibold text-gray-800">Diğer Zararlı Riski</h3>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Risk Seviyesi
                          </label>
                          <select
                            name="otherRisk"
                            value={formData.otherRisk}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {riskLevelOptions.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Öncelik
                          </label>
                          <select
                            name="otherPriority"
                            value={formData.otherPriority}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {priorityOptions.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tespit Edilen Türler
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {otherSpeciesOptions.map((species) => (
                            <label key={species} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={formData.otherSpecies.includes(species)}
                                onChange={() => handleCheckboxChange('other', species)}
                                className="rounded text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">{species}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tespit Edilen Kanıtlar
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {evidenceOptions.map((evidence) => (
                            <label key={evidence} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={formData.otherEvidence.includes(evidence)}
                                onChange={() => handleEvidenceChange('other', evidence)}
                                className="rounded text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">{evidence}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Genel Notlar
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        placeholder="Risk değerlendirmesi ile ilgili genel notlar"
                      ></textarea>
                    </div>
                  </div>
                )}

                {/* Step 4: Recommendations */}
                {step === 4 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Öneriler ve Çözümler</h2>
                    
                    {/* Rodent Recommendations */}
                    <div className="mb-8">
                      <div className="flex items-center mb-4">
                        <Rat className="h-6 w-6 text-gray-700 mr-2" />
                        <h3 className="text-xl font-semibold text-gray-800">Kemirgen Mücadele Önerileri</h3>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Zaman Çerçevesi
                          </label>
                          <select
                            name="rodentTimeframe"
                            value={formData.rodentTimeframe}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {timeframeOptions.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Önerilen Kontrol Yöntemleri
                          </label>
                          <div className="grid grid-cols-2 gap-2 h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
                            {controlMethodOptions.map((method) => (
                              <label key={method} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={formData.rodentControlMethods.includes(method)}
                                  onChange={() => handleControlMethodChange('rodent', method)}
                                  className="rounded text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">{method}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Detaylı Öneriler
                        </label>
                        <textarea
                          name="rodentRecommendations"
                          value={formData.rodentRecommendations}
                          onChange={handleChange}
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          placeholder="Kemirgen mücadelesi için detaylı öneriler"
                        ></textarea>
                      </div>
                    </div>

                    {/* Insect Recommendations */}
                    <div className="mb-8">
                      <div className="flex items-center mb-4">
                        <Bug className="h-6 w-6 text-gray-700 mr-2" />
                        <h3 className="text-xl font-semibold text-gray-800">Böcek Mücadele Önerileri</h3>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Zaman Çerçevesi
                          </label>
                          <select
                            name="insectTimeframe"
                            value={formData.insectTimeframe}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {timeframeOptions.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Önerilen Kontrol Yöntemleri
                          </label>
                          <div className="grid grid-cols-2 gap-2 h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
                            {controlMethodOptions.map((method) => (
                              <label key={method} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={formData.insectControlMethods.includes(method)}
                                  onChange={() => handleControlMethodChange('insect', method)}
                                  className="rounded text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">{method}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Detaylı Öneriler
                        </label>
                        <textarea
                          name="insectRecommendations"
                          value={formData.insectRecommendations}
                          onChange={handleChange}
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          placeholder="Böcek mücadelesi için detaylı öneriler"
                        ></textarea>
                      </div>
                    </div>

                    {/* Bird Recommendations */}
                    <div className="mb-8">
                      <div className="flex items-center mb-4">
                        <Bird className="h-6 w-6 text-gray-700 mr-2" />
                        <h3 className="text-xl font-semibold text-gray-800">Kuş Mücadele Önerileri</h3>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Zaman Çerçevesi
                          </label>
                          <select
                            name="birdTimeframe"
                            value={formData.birdTimeframe}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {timeframeOptions.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Önerilen Kontrol Yöntemleri
                          </label>
                          <div className="grid grid-cols-2 gap-2 h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
                            {controlMethodOptions.map((method) => (
                              <label key={method} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={formData.birdControlMethods.includes(method)}
                                  onChange={() => handleControlMethodChange('bird', method)}
                                  className="rounded text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">{method}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Detaylı Öneriler
                        </label>
                        <textarea
                          name="birdRecommendations"
                          value={formData.birdRecommendations}
                          onChange={handleChange}
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          placeholder="Kuş mücadelesi için detaylı öneriler"
                        ></textarea>
                      </div>
                    </div>

                    {/* Other Recommendations */}
                    <div className="mb-8">
                      <div className="flex items-center mb-4">
                        <Skull className="h-6 w-6 text-gray-700 mr-2" />
                        <h3 className="text-xl font-semibold text-gray-800">Diğer Zararlı Mücadele Önerileri</h3>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Zaman Çerçevesi
                          </label>
                          <select
                            name="otherTimeframe"
                            value={formData.otherTimeframe}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {timeframeOptions.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Önerilen Kontrol Yöntemleri
                          </label>
                          <div className="grid grid-cols-2 gap-2 h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
                            {controlMethodOptions.map((method) => (
                              <label key={method} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={formData.otherControlMethods.includes(method)}
                                  onChange={() => handleControlMethodChange('other', method)}
                                  className="rounded text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">{method}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Detaylı Öneriler
                        </label>
                        <textarea
                          name="otherRecommendations"
                          value={formData.otherRecommendations}
                          onChange={handleChange}
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          placeholder="Diğer zararlı mücadelesi için detaylı öneriler"
                        ></textarea>
                      </div>
                    </div>

                    {/* General Recommendations */}
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Genel Öneriler</h3>
                      
                      <div className="grid md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Önleyici Tedbirler
                          </label>
                          <textarea
                            name="preventativeMeasures"
                            value={formData.preventativeMeasures}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            placeholder="Zararlı girişini önleyici tedbirler"
                          ></textarea>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            İzleme Planı
                          </label>
                          <textarea
                            name="monitoringPlan"
                            value={formData.monitoringPlan}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            placeholder="Zararlı aktivitesini izleme planı"
                          ></textarea>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Personel Eğitimi
                          </label>
                          <textarea
                            name="staffTraining"
                            value={formData.staffTraining}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            placeholder="Personel eğitim önerileri"
                          ></textarea>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Takip Programı
                          </label>
                          <textarea
                            name="followUpSchedule"
                            value={formData.followUpSchedule}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            placeholder="Önerilen takip ve kontrol programı"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Report Preview */}
                {step === 5 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Rapor Önizleme</h2>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        <FileText className="h-4 w-4" />
                        <span>Aşağıda raporun önizlemesini görebilirsiniz. Raporu kaydetmek veya indirmek için sayfanın altındaki butonları kullanabilirsiniz.</span>
                      </div>
                    </div>
                    
                    {/* Report Preview */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                      <div ref={reportRef} className="bg-white p-8" style={{ width: '210mm', margin: '0 auto' }}>
                        {/* Report Header */}
                        <div id="header-section" className="mb-8">
                          <div className="flex justify-between items-center mb-6">
                            <div>
                              {formData.logoPreview ? (
                                <img 
                                  src={formData.logoPreview} 
                                  alt="Şirket Logosu" 
                                  className="h-16 object-contain"
                                />
                              ) : (
                                <div className="flex items-center">
                                  <Shield className="h-8 w-8 text-blue-600 mr-2" />
                                  <span className="text-xl font-bold text-gray-800">{formData.assessorCompany}</span>
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <h1 className="text-2xl font-bold text-gray-800">RİSK DEĞERLENDİRME RAPORU</h1>
                              <p className="text-gray-600">Rapor No: {formData.reportNumber}</p>
                              <p className="text-gray-600">Tarih: {new Date(formData.assessmentDate).toLocaleDateString('tr-TR')}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                              <h2 className="text-lg font-semibold text-gray-800 mb-2">Müşteri Bilgileri</h2>
                              <p className="text-gray-700"><strong>Şirket:</strong> {formData.clientCompany}</p>
                              <p className="text-gray-700"><strong>Yetkili:</strong> {formData.clientName}</p>
                              <p className="text-gray-700"><strong>Lokasyon:</strong> {formData.assessmentLocation || 'Belirtilmemiş'}</p>
                            </div>
                            <div>
                              <h2 className="text-lg font-semibold text-gray-800 mb-2">Değerlendirme Bilgileri</h2>
                              <p className="text-gray-700"><strong>Şirket:</strong> {formData.assessorCompany}</p>
                              <p className="text-gray-700"><strong>Uzman:</strong> {formData.assessorName}</p>
                              <p className="text-gray-700"><strong>Ünvan:</strong> {formData.assessorTitle || 'Zararlı Mücadele Uzmanı'}</p>
                              <p className="text-gray-700"><strong>İletişim:</strong> {formData.assessorContact || 'Belirtilmemiş'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Risk Summary */}
                        <div id="summary-section" className="mb-8">
                          <h2 className="text-xl font-bold text-gray-800 border-b-2 border-blue-600 pb-2 mb-4">Risk Değerlendirme Özeti</h2>
                          
                          <div className="mb-4">
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-gray-800">Genel Risk Seviyesi:</h3>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  formData.overallRiskLevel === 'Düşük' ? 'bg-green-100 text-green-800' :
                                  formData.overallRiskLevel === 'Orta' ? 'bg-yellow-100 text-yellow-800' :
                                  formData.overallRiskLevel === 'Yüksek' ? 'bg-orange-100 text-orange-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {formData.overallRiskLevel}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className={`h-2.5 rounded-full ${
                                    formData.overallRiskLevel === 'Düşük' ? 'bg-green-600' :
                                    formData.overallRiskLevel === 'Orta' ? 'bg-yellow-600' :
                                    formData.overallRiskLevel === 'Yüksek' ? 'bg-orange-600' :
                                    'bg-red-600'
                                  }`}
                                  style={{ width: `${(formData.overallRiskScore / 4) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200">
                              <thead>
                                <tr className="bg-gray-50">
                                  <th className="py-2 px-4 border-b border-r border-gray-200 text-left text-sm font-medium text-gray-700">Zararlı Türü</th>
                                  <th className="py-2 px-4 border-b border-r border-gray-200 text-left text-sm font-medium text-gray-700">Risk Seviyesi</th>
                                  <th className="py-2 px-4 border-b border-r border-gray-200 text-left text-sm font-medium text-gray-700">Öncelik</th>
                                  <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-700">Zaman Çerçevesi</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="py-2 px-4 border-b border-r border-gray-200 text-sm text-gray-700">
                                    <div className="flex items-center">
                                      <Rat className="h-4 w-4 mr-2 text-gray-600" />
                                      <span>Kemirgenler</span>
                                    </div>
                                  </td>
                                  <td className="py-2 px-4 border-b border-r border-gray-200">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(formData.rodentRisk)}`}>
                                      {getRiskLevelLabel(formData.rodentRisk)}
                                    </span>
                                  </td>
                                  <td className="py-2 px-4 border-b border-r border-gray-200">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(formData.rodentPriority)}`}>
                                      {getPriorityLabel(formData.rodentPriority)}
                                    </span>
                                  </td>
                                  <td className="py-2 px-4 border-b border-gray-200">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTimeframeColor(formData.rodentTimeframe)}`}>
                                      {getTimeframeLabel(formData.rodentTimeframe)}
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 px-4 border-b border-r border-gray-200 text-sm text-gray-700">
                                    <div className="flex items-center">
                                      <Bug className="h-4 w-4 mr-2 text-gray-600" />
                                      <span>Böcekler</span>
                                    </div>
                                  </td>
                                  <td className="py-2 px-4 border-b border-r border-gray-200">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(formData.insectRisk)}`}>
                                      {getRiskLevelLabel(formData.insectRisk)}
                                    </span>
                                  </td>
                                  <td className="py-2 px-4 border-b border-r border-gray-200">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(formData.insectPriority)}`}>
                                      {getPriorityLabel(formData.insectPriority)}
                                    </span>
                                  </td>
                                  <td className="py-2 px-4 border-b border-gray-200">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTimeframeColor(formData.insectTimeframe)}`}>
                                      {getTimeframeLabel(formData.insectTimeframe)}
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 px-4 border-b border-r border-gray-200 text-sm text-gray-700">
                                    <div className="flex items-center">
                                      <Bird className="h-4 w-4 mr-2 text-gray-600" />
                                      <span>Kuşlar</span>
                                    </div>
                                  </td>
                                  <td className="py-2 px-4 border-b border-r border-gray-200">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(formData.birdRisk)}`}>
                                      {getRiskLevelLabel(formData.birdRisk)}
                                    </span>
                                  </td>
                                  <td className="py-2 px-4 border-b border-r border-gray-200">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(formData.birdPriority)}`}>
                                      {getPriorityLabel(formData.birdPriority)}
                                    </span>
                                  </td>
                                  <td className="py-2 px-4 border-b border-gray-200">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTimeframeColor(formData.birdTimeframe)}`}>
                                      {getTimeframeLabel(formData.birdTimeframe)}
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 px-4 border-b border-r border-gray-200 text-sm text-gray-700">
                                    <div className="flex items-center">
                                      <Skull className="h-4 w-4 mr-2 text-gray-600" />
                                      <span>Diğer Zararlılar</span>
                                    </div>
                                  </td>
                                  <td className="py-2 px-4 border-b border-r border-gray-200">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(formData.otherRisk)}`}>
                                      {getRiskLevelLabel(formData.otherRisk)}
                                    </span>
                                  </td>
                                  <td className="py-2 px-4 border-b border-r border-gray-200">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(formData.otherPriority)}`}>
                                      {getPriorityLabel(formData.otherPriority)}
                                    </span>
                                  </td>
                                  <td className="py-2 px-4 border-b border-gray-200">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTimeframeColor(formData.otherTimeframe)}`}>
                                      {getTimeframeLabel(formData.otherTimeframe)}
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Property Information */}
                        <div id="property-section" className="mb-8">
                          <h2 className="text-xl font-bold text-gray-800 border-b-2 border-blue-600 pb-2 mb-4">Mülk Bilgileri</h2>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Mülk Türü:</p>
                              <div className="flex items-center">
                                {React.createElement(getPropertyTypeIcon(formData.propertyType), { className: "h-4 w-4 mr-2 text-gray-700" })}
                                <p className="text-gray-800">{formData.propertyType}</p>
                              </div>
                            </div>
                            {formData.propertySize && (
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Mülk Büyüklüğü:</p>
                                <p className="text-gray-800">{formData.propertySize}</p>
                              </div>
                            )}
                            {formData.propertyAge && (
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Mülk Yaşı:</p>
                                <p className="text-gray-800">{formData.propertyAge}</p>
                              </div>
                            )}
                            {formData.constructionType && (
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Yapı Tipi:</p>
                                <p className="text-gray-800">{formData.constructionType}</p>
                              </div>
                            )}
                          </div>

                          {formData.surroundingEnvironment && (
                            <div className="mb-4">
                              <p className="text-sm text-gray-600 mb-1">Çevre Koşulları:</p>
                              <p className="text-gray-800">{formData.surroundingEnvironment}</p>
                            </div>
                          )}

                          {formData.historyOfInfestation && (
                            <div className="mb-4">
                              <p className="text-sm text-gray-600 mb-1">Geçmiş Zararlı Problemi:</p>
                              <p className="text-gray-800">{formData.historyOfInfestation}</p>
                            </div>
                          )}

                          {formData.currentControlMeasures && (
                            <div className="mb-4">
                              <p className="text-sm text-gray-600 mb-1">Mevcut Kontrol Önlemleri:</p>
                              <p className="text-gray-800">{formData.currentControlMeasures}</p>
                            </div>
                          )}
                        </div>

                        {/* Risk Assessment */}
                        <div id="risk-assessment-section" className="mb-8">
                          <h2 className="text-xl font-bold text-gray-800 border-b-2 border-blue-600 pb-2 mb-4">Detaylı Risk Değerlendirmesi</h2>
                          
                          {/* Rodent Risk */}
                          <div className="mb-6">
                            <div className="flex items-center mb-2">
                              <Rat className="h-5 w-5 text-gray-700 mr-2" />
                              <h3 className="text-lg font-semibold text-gray-800">Kemirgen Riski</h3>
                              <span className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(formData.rodentRisk)}`}>
                                {getRiskLevelLabel(formData.rodentRisk)}
                              </span>
                            </div>
                            
                            {formData.rodentSpecies.length > 0 && (
                              <div className="mb-2">
                                <p className="text-sm text-gray-600 mb-1">Tespit Edilen Türler:</p>
                                <div className="flex flex-wrap gap-1">
                                  {formData.rodentSpecies.map((species) => (
                                    <span key={species} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                      {species}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {formData.rodentEvidence.length > 0 && (
                              <div className="mb-2">
                                <p className="text-sm text-gray-600 mb-1">Tespit Edilen Kanıtlar:</p>
                                <div className="flex flex-wrap gap-1">
                                  {formData.rodentEvidence.map((evidence) => (
                                    <span key={evidence} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                      {evidence}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Insect Risk */}
                          <div className="mb-6">
                            <div className="flex items-center mb-2">
                              <Bug className="h-5 w-5 text-gray-700 mr-2" />
                              <h3 className="text-lg font-semibold text-gray-800">Böcek Riski</h3>
                              <span className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(formData.insectRisk)}`}>
                                {getRiskLevelLabel(formData.insectRisk)}
                              </span>
                            </div>
                            
                            {formData.insectSpecies.length > 0 && (
                              <div className="mb-2">
                                <p className="text-sm text-gray-600 mb-1">Tespit Edilen Türler:</p>
                                <div className="flex flex-wrap gap-1">
                                  {formData.insectSpecies.map((species) => (
                                    <span key={species} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                      {species}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {formData.insectEvidence.length > 0 && (
                              <div className="mb-2">
                                <p className="text-sm text-gray-600 mb-1">Tespit Edilen Kanıtlar:</p>
                                <div className="flex flex-wrap gap-1">
                                  {formData.insectEvidence.map((evidence) => (
                                    <span key={evidence} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                      {evidence}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Bird Risk */}
                          <div className="mb-6">
                            <div className="flex items-center mb-2">
                              <Bird className="h-5 w-5 text-gray-700 mr-2" />
                              <h3 className="text-lg font-semibold text-gray-800">Kuş Riski</h3>
                              <span className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(formData.birdRisk)}`}>
                                {getRiskLevelLabel(formData.birdRisk)}
                              </span>
                            </div>
                            
                            {formData.birdSpecies.length > 0 && (
                              <div className="mb-2">
                                <p className="text-sm text-gray-600 mb-1">Tespit Edilen Türler:</p>
                                <div className="flex flex-wrap gap-1">
                                  {formData.birdSpecies.map((species) => (
                                    <span key={species} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                      {species}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {formData.birdEvidence.length > 0 && (
                              <div className="mb-2">
                                <p className="text-sm text-gray-600 mb-1">Tespit Edilen Kanıtlar:</p>
                                <div className="flex flex-wrap gap-1">
                                  {formData.birdEvidence.map((evidence) => (
                                    <span key={evidence} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                      {evidence}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Other Risk */}
                          <div className="mb-6">
                            <div className="flex items-center mb-2">
                              <Skull className="h-5 w-5 text-gray-700 mr-2" />
                              <h3 className="text-lg font-semibold text-gray-800">Diğer Zararlı Riski</h3>
                              <span className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(formData.otherRisk)}`}>
                                {getRiskLevelLabel(formData.otherRisk)}
                              </span>
                            </div>
                            
                            {formData.otherSpecies.length > 0 && (
                              <div className="mb-2">
                                <p className="text-sm text-gray-600 mb-1">Tespit Edilen Türler:</p>
                                <div className="flex flex-wrap gap-1">
                                  {formData.otherSpecies.map((species) => (
                                    <span key={species} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                      {species}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {formData.otherEvidence.length > 0 && (
                              <div className="mb-2">
                                <p className="text-sm text-gray-600 mb-1">Tespit Edilen Kanıtlar:</p>
                                <div className="flex flex-wrap gap-1">
                                  {formData.otherEvidence.map((evidence) => (
                                    <span key={evidence} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                      {evidence}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {formData.notes && (
                            <div className="mb-4">
                              <p className="text-sm text-gray-600 mb-1">Genel Notlar:</p>
                              <p className="text-gray-800 text-sm">{formData.notes}</p>
                            </div>
                          )}
                        </div>

                        {/* Recommendations */}
                        <div id="recommendations-section" className="mb-8">
                          <h2 className="text-xl font-bold text-gray-800 border-b-2 border-blue-600 pb-2 mb-4">Öneriler ve Çözümler</h2>
                          
                          {/* Rodent Recommendations */}
                          {(formData.rodentRecommendations || formData.rodentControlMethods.length > 0) && (
                            <div className="mb-6">
                              <div className="flex items-center mb-2">
                                <Rat className="h-5 w-5 text-gray-700 mr-2" />
                                <h3 className="text-lg font-semibold text-gray-800">Kemirgen Mücadele Önerileri</h3>
                                <span className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${getTimeframeColor(formData.rodentTimeframe)}`}>
                                  {getTimeframeLabel(formData.rodentTimeframe)}
                                </span>
                              </div>
                              
                              {formData.rodentControlMethods.length > 0 && (
                                <div className="mb-2">
                                  <p className="text-sm text-gray-600 mb-1">Önerilen Kontrol Yöntemleri:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {formData.rodentControlMethods.map((method) => (
                                      <span key={method} className="bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded">
                                        {method}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {formData.rodentRecommendations && (
                                <div className="mb-2">
                                  <p className="text-sm text-gray-600 mb-1">Detaylı Öneriler:</p>
                                  <p className="text-gray-800 text-sm">{formData.rodentRecommendations}</p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Insect Recommendations */}
                          {(formData.insectRecommendations || formData.insectControlMethods.length > 0) && (
                            <div className="mb-6">
                              <div className="flex items-center mb-2">
                                <Bug className="h-5 w-5 text-gray-700 mr-2" />
                                <h3 className="text-lg font-semibold text-gray-800">Böcek Mücadele Önerileri</h3>
                                <span className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${getTimeframeColor(formData.insectTimeframe)}`}>
                                  {getTimeframeLabel(formData.insectTimeframe)}
                                </span>
                              </div>
                              
                              {formData.insectControlMethods.length > 0 && (
                                <div className="mb-2">
                                  <p className="text-sm text-gray-600 mb-1">Önerilen Kontrol Yöntemleri:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {formData.insectControlMethods.map((method) => (
                                      <span key={method} className="bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded">
                                        {method}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {formData.insectRecommendations && (
                                <div className="mb-2">
                                  <p className="text-sm text-gray-600 mb-1">Detaylı Öneriler:</p>
                                  <p className="text-gray-800 text-sm">{formData.insectRecommendations}</p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Bird Recommendations */}
                          {(formData.birdRecommendations || formData.birdControlMethods.length > 0) && (
                            <div className="mb-6">
                              <div className="flex items-center mb-2">
                                <Bird className="h-5 w-5 text-gray-700 mr-2" />
                                <h3 className="text-lg font-semibold text-gray-800">Kuş Mücadele Önerileri</h3>
                                <span className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${getTimeframeColor(formData.birdTimeframe)}`}>
                                  {getTimeframeLabel(formData.birdTimeframe)}
                                </span>
                              </div>
                              
                              {formData.birdControlMethods.length > 0 && (
                                <div className="mb-2">
                                  <p className="text-sm text-gray-600 mb-1">Önerilen Kontrol Yöntemleri:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {formData.birdControlMethods.map((method) => (
                                      <span key={method} className="bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded">
                                        {method}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {formData.birdRecommendations && (
                                <div className="mb-2">
                                  <p className="text-sm text-gray-600 mb-1">Detaylı Öneriler:</p>
                                  <p className="text-gray-800 text-sm">{formData.birdRecommendations}</p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Other Recommendations */}
                          {(formData.otherRecommendations || formData.otherControlMethods.length > 0) && (
                            <div className="mb-6">
                              <div className="flex items-center mb-2">
                                <Skull className="h-5 w-5 text-gray-700 mr-2" />
                                <h3 className="text-lg font-semibold text-gray-800">Diğer Zararlı Mücadele Önerileri</h3>
                                <span className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${getTimeframeColor(formData.otherTimeframe)}`}>
                                  {getTimeframeLabel(formData.otherTimeframe)}
                                </span>
                              </div>
                              
                              {formData.otherControlMethods.length > 0 && (
                                <div className="mb-2">
                                  <p className="text-sm text-gray-600 mb-1">Önerilen Kontrol Yöntemleri:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {formData.otherControlMethods.map((method) => (
                                      <span key={method} className="bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded">
                                        {method}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {formData.otherRecommendations && (
                                <div className="mb-2">
                                  <p className="text-sm text-gray-600 mb-1">Detaylı Öneriler:</p>
                                  <p className="text-gray-800 text-sm">{formData.otherRecommendations}</p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* General Recommendations */}
                          <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Genel Öneriler</h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                              {formData.preventativeMeasures && (
                                <div className="mb-2">
                                  <p className="text-sm text-gray-600 mb-1">Önleyici Tedbirler:</p>
                                  <p className="text-gray-800 text-sm">{formData.preventativeMeasures}</p>
                                </div>
                              )}
                              
                              {formData.monitoringPlan && (
                                <div className="mb-2">
                                  <p className="text-sm text-gray-600 mb-1">İzleme Planı:</p>
                                  <p className="text-gray-800 text-sm">{formData.monitoringPlan}</p>
                                </div>
                              )}
                              
                              {formData.staffTraining && (
                                <div className="mb-2">
                                  <p className="text-sm text-gray-600 mb-1">Personel Eğitimi:</p>
                                  <p className="text-gray-800 text-sm">{formData.staffTraining}</p>
                                </div>
                              )}
                              
                              {formData.followUpSchedule && (
                                <div className="mb-2">
                                  <p className="text-sm text-gray-600 mb-1">Takip Programı:</p>
                                  <p className="text-gray-800 text-sm">{formData.followUpSchedule}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Conclusion */}
                        <div id="conclusion-section" className="mb-8">
                          <h2 className="text-xl font-bold text-gray-800 border-b-2 border-blue-600 pb-2 mb-4">Sonuç</h2>
                          
                          <div className="mb-6">
                            <p className="text-gray-800 text-sm mb-4">
                              Bu risk değerlendirme raporu, {formData.assessmentDate && new Date(formData.assessmentDate).toLocaleDateString('tr-TR')} tarihinde {formData.clientCompany} için {formData.assessorCompany} tarafından gerçekleştirilmiştir. Raporda belirtilen risk seviyeleri ve öneriler, değerlendirme sırasındaki gözlemlere dayanmaktadır.
                            </p>
                            <p className="text-gray-800 text-sm mb-4">
                              Önerilen kontrol yöntemlerinin uygulanması, tespit edilen zararlı risklerini minimize etmeye yardımcı olacaktır. Düzenli izleme ve takip, uzun vadeli zararlı kontrolü için kritik öneme sahiptir.
                            </p>
                            <p className="text-gray-800 text-sm">
                              Daha detaylı bilgi ve uygulama desteği için lütfen bizimle iletişime geçin.
                            </p>
                          </div>

                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Rapor Tarihi:</p>
                              <p className="text-gray-800">{new Date(formData.reportDate).toLocaleDateString('tr-TR')}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600 mb-1">Değerlendirme Uzmanı:</p>
                              <p className="text-gray-800 font-medium">{formData.assessorName}</p>
                              {formData.assessorTitle && (
                                <p className="text-gray-600 text-sm">{formData.assessorTitle}</p>
                              )}
                              {formData.signaturePreview && (
                                <img 
                                  src={formData.signaturePreview} 
                                  alt="İmza" 
                                  className="h-12 object-contain ml-auto mt-2"
                                />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Disclaimer */}
                        <div className="text-xs text-gray-500 border-t border-gray-200 pt-4">
                          <p className="mb-1">{formData.confidentialityStatement}</p>
                          <p>{formData.disclaimer}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <button
                        onClick={prevStep}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Geri
                      </button>
                      <div className="space-x-4">
                        <button
                          onClick={saveReport}
                          disabled={loading}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Kaydediliyor...</span>
                            </>
                          ) : (
                            <>
                              <Save className="h-5 w-5" />
                              <span>Raporu Kaydet</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Navigation Buttons */}
                {step < 5 && (
                  <div className="flex justify-between mt-8">
                    {step > 1 && (
                      <button
                        onClick={prevStep}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Geri
                      </button>
                    )}
                    <button
                      onClick={nextStep}
                      className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {step === 4 ? 'Raporu Görüntüle' : 'İleri'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Risk Assessment Explanation */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Risk Değerlendirme Puan Tablosu</h2>
            
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 border-b border-r border-gray-200 text-left text-sm font-medium text-gray-700">Risk Seviyesi</th>
                      <th className="py-3 px-4 border-b border-r border-gray-200 text-left text-sm font-medium text-gray-700">Puan</th>
                      <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-700">Açıklama</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-3 px-4 border-b border-r border-gray-200">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Düşük</span>
                      </td>
                      <td className="py-3 px-4 border-b border-r border-gray-200 text-sm text-gray-700">1</td>
                      <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-700">
                        Zararlı aktivitesi yok veya minimal. Rutin önleyici tedbirler yeterli.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 border-b border-r border-gray-200">
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Orta</span>
                      </td>
                      <td className="py-3 px-4 border-b border-r border-gray-200 text-sm text-gray-700">2</td>
                      <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-700">
                        Sınırlı zararlı aktivitesi mevcut. Hedefli kontrol önlemleri gerekli.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 border-b border-r border-gray-200">
                        <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">Yüksek</span>
                      </td>
                      <td className="py-3 px-4 border-b border-r border-gray-200 text-sm text-gray-700">3</td>
                      <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-700">
                        Belirgin zararlı aktivitesi mevcut. Kapsamlı kontrol programı gerekli.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 border-b border-r border-gray-200">
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Kritik</span>
                      </td>
                      <td className="py-3 px-4 border-b border-r border-gray-200 text-sm text-gray-700">4</td>
                      <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-700">
                        Ciddi zararlı istilası mevcut. Acil ve yoğun müdahale gerekli.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Genel Risk Puanı Hesaplama</h3>
              <p className="text-gray-600 mb-4">
                Genel risk puanı, dört zararlı kategorisinin (kemirgen, böcek, kuş ve diğer zararlılar) risk puanlarının ortalaması alınarak hesaplanır.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 font-medium">Genel Risk Puanı = (Kemirgen Puanı + Böcek Puanı + Kuş Puanı + Diğer Zararlı Puanı) / 4</p>
              </div>
              
              <div className="mt-6">
                <h4 className="font-semibold text-gray-800 mb-2">Genel Risk Seviyesi Belirleme:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">1.0 - 1.4: <strong>Düşük Risk</strong></span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-700">1.5 - 2.4: <strong>Orta Risk</strong></span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700">2.5 - 3.4: <strong>Yüksek Risk</strong></span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700">3.5 - 4.0: <strong>Kritik Risk</strong></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Profesyonel Zararlı Mücadele Hizmetleri
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Risk değerlendirmesi sonrası profesyonel zararlı mücadele hizmetlerimizle 
            tespit edilen riskleri ortadan kaldırın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/iletisim" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-lg flex items-center justify-center space-x-2"
            >
              <Mail className="h-5 w-5" />
              <span>Teklif Alın</span>
            </Link>
            <a 
              href="tel:02242338387" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <Phone className="h-5 w-5" />
              <span>Hemen Arayın</span>
            </a>
          </div>
        </div>
      </section>

      {/* Back to Modules */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <Link 
            to="/moduller" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Tüm Modüllere Dön
          </Link>
        </div>
      </section>
    </div>
  );
};

export default RiskAssessmentPage;