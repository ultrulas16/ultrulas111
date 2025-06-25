import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  LineChart, 
  Download, 
  Plus, 
  Trash2, 
  Save, 
  FileText, 
  Calendar, 
  Building, 
  User, 
  Eye, 
  Edit, 
  CheckCircle, 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  AlertTriangle,
  Droplets,
  Percent,
  Bug,
  Rat,
  Bird,
  Thermometer,
  Zap,
  Image,
  ListPlus
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Stage, Layer, Rect, Circle, Text, Line } from 'react-konva';

interface VisitData {
  id: string;
  date: string;
  equipmentData: EquipmentData[];
  biocidalProducts: BiocidalProduct[];
}

interface EquipmentData {
  id: string;
  equipmentNumber: number;
  equipmentType: string;
  location: string;
  activityStatus: 'Aktivite Var' | 'Aktivite Yok';
  rodentCount?: number;
  insectCount?: number;
  notes?: string;
  // Flying insect specific counts
  houseflies?: number;
  mosquitoes?: number;
  moths?: number;
  bees?: number;
  fruitFlies?: number;
  // Stored product pests
  driedFruitMoths?: number;
  flourMoths?: number;
  clothesMoths?: number;
  tobaccoMoths?: number;
  otherStoredPests?: number;
  // UVA measurement for light traps
  uvaPercentage?: number;
}

interface BiocidalProduct {
  id: string;
  productName: string;
  activeIngredient: string;
  activePercentage: number;
  amountUsed: number;
  unit: 'g' | 'ml' | 'kg' | 'l';
}

interface ReportData {
  id: string;
  companyName: string;
  customerName: string;
  visits: VisitData[];
  equipmentList: EquipmentData[]; // Fixed equipment list
  equipmentTypes: string[];
  logoUrl?: string;
}

const TrendAnalysisPage: React.FC = () => {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [showEquipmentForm, setShowEquipmentForm] = useState(false);
  const [showBulkEquipmentForm, setShowBulkEquipmentForm] = useState(false);
  const [showEquipmentListForm, setShowEquipmentListForm] = useState(false);
  const [showBiocidalForm, setShowBiocidalForm] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentVisit, setCurrentVisit] = useState<VisitData | null>(null);
  const [currentEquipment, setCurrentEquipment] = useState<EquipmentData | null>(null);
  const [currentBiocidal, setCurrentBiocidal] = useState<BiocidalProduct | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const [showExcelUpload, setShowExcelUpload] = useState(false);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [equipmentTypes, setEquipmentTypes] = useState<string[]>([
    'Kemirgen Yemli Monitör',
    'Canlı Yakalama Monitörü',
    'Kemirgen Yapışkanlı Monitör',
    'Uçan Haşere Monitörü',
    'Depo Zararlısı Monitörü',
    'Hamamböceği Monitörü'
  ]);

  // Bulk equipment form state
  const [bulkEquipmentData, setBulkEquipmentData] = useState({
    count: 10,
    type: 'Kemirgen Yemli Monitör',
    startNumber: 1
  });

  const reportRef = useRef<HTMLDivElement>(null);

  // Form data for new report
  const [newReportData, setNewReportData] = useState({
    companyName: '',
    customerName: ''
  });

  // Form data for new visit
  const [newVisitData, setNewVisitData] = useState({
    date: new Date().toISOString().split('T')[0]
  });

  // Form data for new equipment
  const [newEquipmentData, setNewEquipmentData] = useState<Partial<EquipmentData>>({
    equipmentNumber: 1,
    equipmentType: 'Kemirgen Yemli Monitör',
    location: '',
    activityStatus: 'Aktivite Yok' as 'Aktivite Yok',
    rodentCount: 0,
    insectCount: 0,
    notes: '',
    houseflies: 0,
    mosquitoes: 0,
    moths: 0,
    bees: 0,
    fruitFlies: 0,
    driedFruitMoths: 0,
    flourMoths: 0,
    clothesMoths: 0,
    tobaccoMoths: 0,
    otherStoredPests: 0,
    uvaPercentage: 100
  });

  // Form data for new biocidal product
  const [newBiocidalData, setNewBiocidalData] = useState<Partial<BiocidalProduct>>({
    productName: '',
    activeIngredient: '',
    activePercentage: 0,
    amountUsed: 0,
    unit: 'g' as 'g'
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('trend_analysis_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // For each report, fetch the visit data
      const reportsWithVisits = await Promise.all(
        data.map(async (report) => {
          const { data: visitData, error: visitError } = await supabase
            .from('visit_equipment_data')
            .select('*')
            .eq('trend_analysis_report_id', report.id)
            .order('visit_date', { ascending: true });

          if (visitError) throw visitError;

          // Group visit data by date
          const visitsByDate = visitData.reduce((acc: Record<string, any[]>, curr) => {
            const date = new Date(curr.visit_date).toISOString().split('T')[0];
            if (!acc[date]) {
              acc[date] = [];
            }
            acc[date].push(curr);
            return acc;
          }, {});

          // Extract all unique equipment
          const allEquipment = visitData.map(item => ({
            id: item.id,
            equipmentNumber: item.equipment_number || parseInt(item.equipment_id?.toString() || '0'),
            equipmentType: item.equipment_type,
            location: item.equipment_location,
            activityStatus: 'Aktivite Yok' as 'Aktivite Yok', // Default status
            rodentCount: 0,
            insectCount: 0,
            notes: '',
            houseflies: 0,
            mosquitoes: 0,
            moths: 0,
            bees: 0,
            fruitFlies: 0,
            driedFruitMoths: 0,
            flourMoths: 0,
            clothesMoths: 0,
            tobaccoMoths: 0,
            otherStoredPests: 0,
            uvaPercentage: 100
          }));

          // Create a unique equipment list based on equipment number
          const uniqueEquipment: EquipmentData[] = [];
          const equipmentNumbers = new Set<number>();
          
          allEquipment.forEach(eq => {
            if (!equipmentNumbers.has(eq.equipmentNumber)) {
              equipmentNumbers.add(eq.equipmentNumber);
              uniqueEquipment.push(eq as EquipmentData);
            }
          });
          
          // Sort equipment by number
          uniqueEquipment.sort((a, b) => a.equipmentNumber - b.equipmentNumber);

          // Convert to VisitData array
          const visits: VisitData[] = Object.entries(visitsByDate).map(([date, equipmentData]) => {
            // Extract biocidal products from the first equipment data item if available
            const biocidalProducts: BiocidalProduct[] = equipmentData[0]?.biocidal_products || [];
            
            // Create a map of equipment data by equipment number
            const equipmentMap = new Map<number, any>();
            equipmentData.forEach(item => {
              equipmentMap.set(item.equipment_number, item);
            });
            
            // Create equipment data for this visit based on the fixed equipment list
            const visitEquipmentData = uniqueEquipment.map(baseEquipment => {
              const matchingData = equipmentMap.get(baseEquipment.equipmentNumber);
              
              if (matchingData) {
                return {
                  ...baseEquipment,
                  activityStatus: matchingData.activity_level,
                  rodentCount: matchingData.rodent_count,
                  insectCount: matchingData.cockroach_count + matchingData.ant_count + (matchingData.other_pest_count || 0),
                  notes: matchingData.notes,
                  houseflies: matchingData.housefly_count,
                  mosquitoes: matchingData.mosquito_count,
                  moths: matchingData.moth_count,
                  bees: matchingData.bee_count,
                  fruitFlies: matchingData.fruit_fly_count,
                  driedFruitMoths: matchingData.dried_fruit_moth_count,
                  flourMoths: matchingData.flour_moth_count,
                  clothesMoths: matchingData.clothes_moth_count,
                  tobaccoMoths: matchingData.tobacco_moth_count,
                  otherStoredPests: matchingData.other_stored_pest_count,
                  uvaPercentage: matchingData.uva_measurement
                };
              }
              
              // If no matching data, return the base equipment with default values
              return { ...baseEquipment };
            });
            
            return {
              id: uuidv4(),
              date,
              equipmentData: visitEquipmentData,
              biocidalProducts
            };
          });

          // Extract unique equipment types
          const equipmentTypes = Array.from(
            new Set(
              visitData.map(item => item.equipment_type)
            )
          );

          return {
            id: report.id,
            companyName: report.company_name,
            customerName: report.customer_name,
            visits,
            equipmentList: uniqueEquipment,
            equipmentTypes,
            logoUrl: report.logo_url
          };
        })
      );

      setReports(reportsWithVisits);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Raporlar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReport = async () => {
    try {
      setSaving(true);
      
      // Create new report in Supabase
      const { data, error } = await supabase
        .from('trend_analysis_reports')
        .insert([
          {
            company_name: newReportData.companyName,
            customer_name: newReportData.customerName,
            report_url: '',
            report_date: new Date().toISOString()
          }
        ])
        .select();

      if (error) throw error;

      // Add the new report to the state
      const newReport: ReportData = {
        id: data[0].id,
        companyName: newReportData.companyName,
        customerName: newReportData.customerName,
        visits: [],
        equipmentList: [],
        equipmentTypes: []
      };

      setReports([newReport, ...reports]);
      setSelectedReport(newReport);
      setShowReportForm(false);
      setNewReportData({
        companyName: '',
        customerName: ''
      });
      setSuccess('Rapor başarıyla oluşturuldu.');
    } catch (error) {
      console.error('Error creating report:', error);
      setError('Rapor oluşturulurken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddVisit = () => {
    if (!selectedReport) return;

    // Check if equipment list is empty
    if (selectedReport.equipmentList.length === 0) {
      setError('Önce ekipman listesi oluşturmalısınız.');
      return;
    }

    // Create a new visit with a copy of the equipment list
    const newVisit: VisitData = {
      id: uuidv4(),
      date: newVisitData.date,
      // Create a deep copy of the equipment list with default activity values
      equipmentData: selectedReport.equipmentList.map(eq => ({
        ...eq,
        id: uuidv4(),
        activityStatus: 'Aktivite Yok',
        rodentCount: 0,
        insectCount: 0,
        notes: '',
        houseflies: 0,
        mosquitoes: 0,
        moths: 0,
        bees: 0,
        fruitFlies: 0,
        driedFruitMoths: 0,
        flourMoths: 0,
        clothesMoths: 0,
        tobaccoMoths: 0,
        otherStoredPests: 0,
        uvaPercentage: 100
      })),
      biocidalProducts: []
    };

    setSelectedReport({
      ...selectedReport,
      visits: [...selectedReport.visits, newVisit]
    });

    setCurrentVisit(newVisit);
    setShowVisitForm(false);
    setSuccess('Ziyaret başarıyla eklendi.');
  };

  const handleAddEquipment = () => {
    if (!selectedReport) return;

    const newEquipment: EquipmentData = {
      id: uuidv4(),
      equipmentNumber: newEquipmentData.equipmentNumber || 1,
      equipmentType: newEquipmentData.equipmentType || 'Kemirgen Yemli Monitör',
      location: newEquipmentData.location || '',
      activityStatus: 'Aktivite Yok',
      rodentCount: 0,
      insectCount: 0,
      notes: '',
      houseflies: 0,
      mosquitoes: 0,
      moths: 0,
      bees: 0,
      fruitFlies: 0,
      driedFruitMoths: 0,
      flourMoths: 0,
      clothesMoths: 0,
      tobaccoMoths: 0,
      otherStoredPests: 0,
      uvaPercentage: 100
    };

    // Add to the equipment list
    const updatedEquipmentList = [...selectedReport.equipmentList, newEquipment];
    
    // Sort by equipment number
    updatedEquipmentList.sort((a, b) => a.equipmentNumber - b.equipmentNumber);

    // Update all visits with the new equipment
    const updatedVisits = selectedReport.visits.map(visit => {
      return {
        ...visit,
        equipmentData: [
          ...visit.equipmentData,
          {
            ...newEquipment,
            id: uuidv4() // Generate a new ID for each visit's copy
          }
        ]
      };
    });

    setSelectedReport({
      ...selectedReport,
      equipmentList: updatedEquipmentList,
      visits: updatedVisits
    });

    // Reset form and increment equipment number for next entry
    setNewEquipmentData({
      ...newEquipmentData,
      equipmentNumber: (newEquipmentData.equipmentNumber || 0) + 1,
      location: ''
    });
    
    setShowEquipmentForm(false);
    setSuccess('Ekipman başarıyla eklendi.');
  };

  // Function to add bulk equipment
  const handleAddBulkEquipment = () => {
    if (!selectedReport) return;

    const { count, type, startNumber } = bulkEquipmentData;
    
    // Create array of new equipment
    const newEquipmentList: EquipmentData[] = [];
    
    for (let i = 0; i < count; i++) {
      const equipmentNumber = startNumber + i;
      
      newEquipmentList.push({
        id: uuidv4(),
        equipmentNumber,
        equipmentType: type,
        location: '', // Empty location to be filled later
        activityStatus: 'Aktivite Yok',
        rodentCount: 0,
        insectCount: 0,
        notes: '',
        houseflies: 0,
        mosquitoes: 0,
        moths: 0,
        bees: 0,
        fruitFlies: 0,
        driedFruitMoths: 0,
        flourMoths: 0,
        clothesMoths: 0,
        tobaccoMoths: 0,
        otherStoredPests: 0,
        uvaPercentage: 100
      });
    }
    
    // Add to the equipment list
    const updatedEquipmentList = [...selectedReport.equipmentList, ...newEquipmentList];
    
    // Sort by equipment number
    updatedEquipmentList.sort((a, b) => a.equipmentNumber - b.equipmentNumber);

    // Update all visits with the new equipment
    const updatedVisits = selectedReport.visits.map(visit => {
      return {
        ...visit,
        equipmentData: [
          ...visit.equipmentData,
          ...newEquipmentList.map(eq => ({
            ...eq,
            id: uuidv4() // Generate a new ID for each visit's copy
          }))
        ]
      };
    });

    setSelectedReport({
      ...selectedReport,
      equipmentList: updatedEquipmentList,
      visits: updatedVisits
    });
    
    setShowBulkEquipmentForm(false);
    setSuccess(`${count} ekipman başarıyla eklendi.`);
  };

  const handleAddBiocidal = () => {
    if (!selectedReport || !currentVisit) return;

    const newBiocidal: BiocidalProduct = {
      id: uuidv4(),
      productName: newBiocidalData.productName || '',
      activeIngredient: newBiocidalData.activeIngredient || '',
      activePercentage: newBiocidalData.activePercentage || 0,
      amountUsed: newBiocidalData.amountUsed || 0,
      unit: newBiocidalData.unit || 'g'
    };

    // Find the visit in the selected report
    const updatedVisits = selectedReport.visits.map(visit => {
      if (visit.id === currentVisit.id) {
        return {
          ...visit,
          biocidalProducts: [...visit.biocidalProducts, newBiocidal]
        };
      }
      return visit;
    });

    setSelectedReport({
      ...selectedReport,
      visits: updatedVisits
    });

    // Update current visit
    setCurrentVisit({
      ...currentVisit,
      biocidalProducts: [...currentVisit.biocidalProducts, newBiocidal]
    });

    // Reset form
    setNewBiocidalData({
      productName: '',
      activeIngredient: '',
      activePercentage: 0,
      amountUsed: 0,
      unit: 'g'
    });
    
    setShowBiocidalForm(false);
    setSuccess('Biyosidal ürün başarıyla eklendi.');
  };

  const handleEditEquipment = (equipment: EquipmentData) => {
    setCurrentEquipment(equipment);
    setNewEquipmentData({
      equipmentNumber: equipment.equipmentNumber,
      equipmentType: equipment.equipmentType,
      location: equipment.location,
      activityStatus: equipment.activityStatus,
      rodentCount: equipment.rodentCount || 0,
      insectCount: equipment.insectCount || 0,
      notes: equipment.notes || '',
      houseflies: equipment.houseflies || 0,
      mosquitoes: equipment.mosquitoes || 0,
      moths: equipment.moths || 0,
      bees: equipment.bees || 0,
      fruitFlies: equipment.fruitFlies || 0,
      driedFruitMoths: equipment.driedFruitMoths || 0,
      flourMoths: equipment.flourMoths || 0,
      clothesMoths: equipment.clothesMoths || 0,
      tobaccoMoths: equipment.tobaccoMoths || 0,
      otherStoredPests: equipment.otherStoredPests || 0,
      uvaPercentage: equipment.uvaPercentage || 100
    });
    setIsEditing(true);
    setShowEquipmentForm(true);
  };

  const handleEditVisitEquipment = (equipment: EquipmentData) => {
    setCurrentEquipment(equipment);
    setNewEquipmentData({
      equipmentNumber: equipment.equipmentNumber,
      equipmentType: equipment.equipmentType,
      location: equipment.location,
      activityStatus: equipment.activityStatus,
      rodentCount: equipment.rodentCount || 0,
      insectCount: equipment.insectCount || 0,
      notes: equipment.notes || '',
      houseflies: equipment.houseflies || 0,
      mosquitoes: equipment.mosquitoes || 0,
      moths: equipment.moths || 0,
      bees: equipment.bees || 0,
      fruitFlies: equipment.fruitFlies || 0,
      driedFruitMoths: equipment.driedFruitMoths || 0,
      flourMoths: equipment.flourMoths || 0,
      clothesMoths: equipment.clothesMoths || 0,
      tobaccoMoths: equipment.tobaccoMoths || 0,
      otherStoredPests: equipment.otherStoredPests || 0,
      uvaPercentage: equipment.uvaPercentage || 100
    });
    setIsEditing(true);
    setShowEquipmentForm(true);
  };

  const handleEditBiocidal = (biocidal: BiocidalProduct) => {
    setCurrentBiocidal(biocidal);
    setNewBiocidalData({
      productName: biocidal.productName,
      activeIngredient: biocidal.activeIngredient,
      activePercentage: biocidal.activePercentage,
      amountUsed: biocidal.amountUsed,
      unit: biocidal.unit
    });
    setIsEditing(true);
    setShowBiocidalForm(true);
  };

  const handleUpdateEquipment = () => {
    if (!selectedReport || !currentEquipment) return;

    const updatedEquipment: EquipmentData = {
      ...currentEquipment,
      equipmentNumber: newEquipmentData.equipmentNumber || currentEquipment.equipmentNumber,
      equipmentType: newEquipmentData.equipmentType || currentEquipment.equipmentType,
      location: newEquipmentData.location || currentEquipment.location,
      activityStatus: currentEquipment.activityStatus,
      rodentCount: currentEquipment.rodentCount,
      insectCount: currentEquipment.insectCount,
      notes: currentEquipment.notes,
      houseflies: currentEquipment.houseflies,
      mosquitoes: currentEquipment.mosquitoes,
      moths: currentEquipment.moths,
      bees: currentEquipment.bees,
      fruitFlies: currentEquipment.fruitFlies,
      driedFruitMoths: currentEquipment.driedFruitMoths,
      flourMoths: currentEquipment.flourMoths,
      clothesMoths: currentEquipment.clothesMoths,
      tobaccoMoths: currentEquipment.tobaccoMoths,
      otherStoredPests: currentEquipment.otherStoredPests,
      uvaPercentage: currentEquipment.uvaPercentage
    };

    // Update the equipment in the equipment list
    const updatedEquipmentList = selectedReport.equipmentList.map(equipment => {
      if (equipment.id === currentEquipment.id) {
        return updatedEquipment;
      }
      return equipment;
    });

    // Update the equipment in all visits
    const updatedVisits = selectedReport.visits.map(visit => {
      return {
        ...visit,
        equipmentData: visit.equipmentData.map(equipment => {
          if (equipment.equipmentNumber === currentEquipment.equipmentNumber) {
            return {
              ...equipment,
              equipmentType: updatedEquipment.equipmentType,
              location: updatedEquipment.location
            };
          }
          return equipment;
        })
      };
    });

    setSelectedReport({
      ...selectedReport,
      equipmentList: updatedEquipmentList,
      visits: updatedVisits
    });

    // Update current visit if it exists
    if (currentVisit) {
      setCurrentVisit({
        ...currentVisit,
        equipmentData: currentVisit.equipmentData.map(equipment => {
          if (equipment.equipmentNumber === currentEquipment.equipmentNumber) {
            return {
              ...equipment,
              equipmentType: updatedEquipment.equipmentType,
              location: updatedEquipment.location
            };
          }
          return equipment;
        })
      });
    }

    setIsEditing(false);
    setCurrentEquipment(null);
    setShowEquipmentForm(false);
    setSuccess('Ekipman başarıyla güncellendi.');
  };

  const handleUpdateVisitEquipment = () => {
    if (!selectedReport || !currentVisit || !currentEquipment) return;

    const updatedEquipment: EquipmentData = {
      ...currentEquipment,
      activityStatus: newEquipmentData.activityStatus || currentEquipment.activityStatus,
      rodentCount: newEquipmentData.rodentCount,
      insectCount: newEquipmentData.insectCount,
      notes: newEquipmentData.notes,
      houseflies: newEquipmentData.houseflies,
      mosquitoes: newEquipmentData.mosquitoes,
      moths: newEquipmentData.moths,
      bees: newEquipmentData.bees,
      fruitFlies: newEquipmentData.fruitFlies,
      driedFruitMoths: newEquipmentData.driedFruitMoths,
      flourMoths: newEquipmentData.flourMoths,
      clothesMoths: newEquipmentData.clothesMoths,
      tobaccoMoths: newEquipmentData.tobaccoMoths,
      otherStoredPests: newEquipmentData.otherStoredPests,
      uvaPercentage: newEquipmentData.uvaPercentage
    };

    // Update the equipment in the current visit
    const updatedVisits = selectedReport.visits.map(visit => {
      if (visit.id === currentVisit.id) {
        return {
          ...visit,
          equipmentData: visit.equipmentData.map(equipment => {
            if (equipment.id === currentEquipment.id) {
              return updatedEquipment;
            }
            return equipment;
          })
        };
      }
      return visit;
    });

    setSelectedReport({
      ...selectedReport,
      visits: updatedVisits
    });

    // Update current visit
    setCurrentVisit({
      ...currentVisit,
      equipmentData: currentVisit.equipmentData.map(equipment => {
        if (equipment.id === currentEquipment.id) {
          return updatedEquipment;
        }
        return equipment;
      })
    });

    setIsEditing(false);
    setCurrentEquipment(null);
    setShowEquipmentForm(false);
    setSuccess('Ekipman verisi başarıyla güncellendi.');
  };

  const handleUpdateBiocidal = () => {
    if (!selectedReport || !currentVisit || !currentBiocidal) return;

    const updatedBiocidal: BiocidalProduct = {
      ...currentBiocidal,
      productName: newBiocidalData.productName || currentBiocidal.productName,
      activeIngredient: newBiocidalData.activeIngredient || currentBiocidal.activeIngredient,
      activePercentage: newBiocidalData.activePercentage !== undefined ? newBiocidalData.activePercentage : currentBiocidal.activePercentage,
      amountUsed: newBiocidalData.amountUsed !== undefined ? newBiocidalData.amountUsed : currentBiocidal.amountUsed,
      unit: newBiocidalData.unit || currentBiocidal.unit
    };

    // Update the biocidal in the current visit
    const updatedVisits = selectedReport.visits.map(visit => {
      if (visit.id === currentVisit.id) {
        return {
          ...visit,
          biocidalProducts: visit.biocidalProducts.map(biocidal => {
            if (biocidal.id === currentBiocidal.id) {
              return updatedBiocidal;
            }
            return biocidal;
          })
        };
      }
      return visit;
    });

    setSelectedReport({
      ...selectedReport,
      visits: updatedVisits
    });

    // Update current visit
    setCurrentVisit({
      ...currentVisit,
      biocidalProducts: currentVisit.biocidalProducts.map(biocidal => {
        if (biocidal.id === currentBiocidal.id) {
          return updatedBiocidal;
        }
        return biocidal;
      })
    });

    setIsEditing(false);
    setCurrentBiocidal(null);
    setShowBiocidalForm(false);
    setSuccess('Biyosidal ürün başarıyla güncellendi.');
  };

  const handleRemoveEquipment = (equipmentId: string) => {
    if (!selectedReport) return;

    // Remove the equipment from the equipment list
    const updatedEquipmentList = selectedReport.equipmentList.filter(
      equipment => equipment.id !== equipmentId
    );

    // Get the equipment number to remove from all visits
    const equipmentToRemove = selectedReport.equipmentList.find(eq => eq.id === equipmentId);
    
    if (!equipmentToRemove) return;
    
    // Remove the equipment from all visits
    const updatedVisits = selectedReport.visits.map(visit => {
      return {
        ...visit,
        equipmentData: visit.equipmentData.filter(
          equipment => equipment.equipmentNumber !== equipmentToRemove.equipmentNumber
        )
      };
    });

    setSelectedReport({
      ...selectedReport,
      equipmentList: updatedEquipmentList,
      visits: updatedVisits
    });

    // Update current visit if it exists
    if (currentVisit) {
      setCurrentVisit({
        ...currentVisit,
        equipmentData: currentVisit.equipmentData.filter(
          equipment => equipment.equipmentNumber !== equipmentToRemove.equipmentNumber
        )
      });
    }
    
    setSuccess('Ekipman başarıyla kaldırıldı.');
  };

  const handleRemoveBiocidal = (biocidalId: string) => {
    if (!selectedReport || !currentVisit) return;

    // Remove the biocidal from the current visit
    const updatedVisits = selectedReport.visits.map(visit => {
      if (visit.id === currentVisit.id) {
        return {
          ...visit,
          biocidalProducts: visit.biocidalProducts.filter(biocidal => biocidal.id !== biocidalId)
        };
      }
      return visit;
    });

    setSelectedReport({
      ...selectedReport,
      visits: updatedVisits
    });

    // Update current visit
    setCurrentVisit({
      ...currentVisit,
      biocidalProducts: currentVisit.biocidalProducts.filter(biocidal => biocidal.id !== biocidalId)
    });
    
    setSuccess('Biyosidal ürün başarıyla kaldırıldı.');
  };

  const handleRemoveVisit = (visitId: string) => {
    if (!selectedReport) return;

    // Remove the visit from the selected report
    const updatedVisits = selectedReport.visits.filter(visit => visit.id !== visitId);

    setSelectedReport({
      ...selectedReport,
      visits: updatedVisits
    });

    // If the current visit is being removed, reset it
    if (currentVisit && currentVisit.id === visitId) {
      setCurrentVisit(null);
    }
    
    setSuccess('Ziyaret başarıyla kaldırıldı.');
  };

  // Handle logo file upload
  const handleLogoUpload = async (file: File) => {
    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `logo_${Date.now()}.${fileExt}`;
      const filePath = `trend_analysis/logos/${fileName}`;
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase
        .storage
        .from('documents')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: true
        });
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = supabase
        .storage
        .from('documents')
        .getPublicUrl(filePath);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      throw error;
    }
  };

  // Handle logo change
  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setLogoFile(files[0]);
      try {
        const logoUrl = await handleLogoUpload(files[0]);
        setLogoUrl(logoUrl);
        
        // Update selected report with logo URL
        if (selectedReport) {
          setSelectedReport({
            ...selectedReport,
            logoUrl
          });
        }
        
        setSuccess('Logo başarıyla yüklendi.');
      } catch (error) {
        setError('Logo yüklenirken bir hata oluştu.');
      }
    }
  };

  const handleSaveReport = async () => {
    if (!selectedReport) return;

    try {
      setSaving(true);

      // First, delete all existing visit data for this report
      const { error: deleteError } = await supabase
        .from('visit_equipment_data')
        .delete()
        .eq('trend_analysis_report_id', selectedReport.id);

      if (deleteError) throw deleteError;

      // Then, insert all the new visit data
      for (const visit of selectedReport.visits) {
        const visitDate = new Date(visit.date);
        
        // Insert equipment data
        for (const equipment of visit.equipmentData) {
          const { error: insertError } = await supabase
            .from('visit_equipment_data')
            .insert([
              {
                trend_analysis_report_id: selectedReport.id,
                visit_date: visitDate.toISOString(),
                equipment_id: equipment.id,
                equipment_number: equipment.equipmentNumber,
                equipment_type: equipment.equipmentType,
                equipment_location: equipment.location,
                activity_level: equipment.activityStatus,
                rodent_count: equipment.rodentCount || 0,
                cockroach_count: equipment.insectCount || 0,
                ant_count: 0,
                other_pest_count: 0,
                notes: equipment.notes,
                housefly_count: equipment.houseflies || 0,
                mosquito_count: equipment.mosquitoes || 0,
                moth_count: equipment.moths || 0,
                bee_count: equipment.bees || 0,
                fruit_fly_count: equipment.fruitFlies || 0,
                dried_fruit_moth_count: equipment.driedFruitMoths || 0,
                flour_moth_count: equipment.flourMoths || 0,
                clothes_moth_count: equipment.clothesMoths || 0,
                tobacco_moth_count: equipment.tobaccoMoths || 0,
                other_stored_pest_count: equipment.otherStoredPests || 0,
                uva_measurement: equipment.uvaPercentage || 100,
                biocidal_products: visit.biocidalProducts
              }
            ]);

          if (insertError) throw insertError;
        }
      }

      // Update the report with URL and logo
      const updateData: any = {};
      
      if (reportUrl) {
        updateData.report_url = reportUrl;
      }
      
      if (selectedReport.logoUrl) {
        updateData.logo_url = selectedReport.logoUrl;
      }
      
      if (Object.keys(updateData).length > 0) {
        const { error: updateError } = await supabase
          .from('trend_analysis_reports')
          .update(updateData)
          .eq('id', selectedReport.id);

        if (updateError) throw updateError;
      }

      setSuccess('Rapor başarıyla kaydedildi.');
    } catch (error) {
      console.error('Error saving report:', error);
      setError('Rapor kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = async () => {
    if (!reportRef.current || !selectedReport) return;

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Save the PDF
      const pdfOutput = pdf.output('blob');
      const fileName = `trend_analysis_${selectedReport.companyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase
        .storage
        .from('documents')
        .upload(`trend_analysis/${fileName}`, pdfOutput, {
          contentType: 'application/pdf',
          upsert: true
        });
      
      if (error) throw error;
      
      // Get the public URL
      const { data: urlData } = supabase
        .storage
        .from('documents')
        .getPublicUrl(`trend_analysis/${fileName}`);
      
      setReportUrl(urlData.publicUrl);
      
      // Download the PDF
      const link = document.createElement('a');
      link.href = URL.createObjectURL(pdfOutput);
      link.download = fileName;
      link.click();
      
      setSuccess('Rapor PDF olarak dışa aktarıldı.');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      setError('PDF dışa aktarılırken bir hata oluştu.');
    }
  };

  // Function to export as JPEG
  const handleExportJPEG = async () => {
    if (!reportRef.current || !selectedReport) return;

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      
      // Download the JPEG
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `trend_analysis_${selectedReport.companyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.jpg`;
      link.click();
      
      setSuccess('Rapor JPEG olarak dışa aktarıldı.');
    } catch (error) {
      console.error('Error exporting JPEG:', error);
      setError('JPEG dışa aktarılırken bir hata oluştu.');
    }
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setExcelFile(files[0]);
    }
  };

  const processExcelFile = async () => {
    if (!excelFile || !selectedReport) return;

    try {
      const data = await excelFile.arrayBuffer();
      const workbook = XLSX.read(data);
      
      // Get the first sheet for equipment data
      const firstSheetName = workbook.SheetNames[0];
      const equipmentSheet = workbook.Sheets[firstSheetName];
      const equipmentRows: any[] = XLSX.utils.sheet_to_json(equipmentSheet);
      
      // Get the second sheet for equipment types if it exists
      if (workbook.SheetNames.length > 1) {
        const secondSheetName = workbook.SheetNames[1];
        const typesSheet = workbook.Sheets[secondSheetName];
        const typesRows: any[] = XLSX.utils.sheet_to_json(typesSheet);
        
        // Extract equipment types from the second sheet
        if (typesRows.length > 0) {
          const newTypes = typesRows
            .filter(row => row.EquipmentType)
            .map(row => row.EquipmentType);
          
          if (newTypes.length > 0) {
            // Combine with existing types, remove duplicates
            const combinedTypes = Array.from(new Set([...equipmentTypes, ...newTypes]));
            setEquipmentTypes(combinedTypes);
            
            // Update the selected report's equipment types
            setSelectedReport({
              ...selectedReport,
              equipmentTypes: combinedTypes
            });
          }
        }
      }
      
      // Process equipment data
      if (equipmentRows.length > 0) {
        // Find the highest equipment number to start auto-numbering
        let highestNumber = 0;
        if (selectedReport.equipmentList.length > 0) {
          highestNumber = Math.max(...selectedReport.equipmentList.map(e => e.equipmentNumber));
        }
        
        const newEquipmentData: EquipmentData[] = equipmentRows.map((row, index) => {
          // Auto-number starting from the highest existing number + 1
          const equipmentNumber = row.EquipmentNumber || (highestNumber + index + 1);
          
          return {
            id: uuidv4(),
            equipmentNumber,
            equipmentType: row.EquipmentType || 'Kemirgen Yemli Monitör',
            location: row.Location || '', // Empty location if not provided
            activityStatus: 'Aktivite Yok',
            rodentCount: 0,
            insectCount: 0,
            notes: '',
            houseflies: 0,
            mosquitoes: 0,
            moths: 0,
            bees: 0,
            fruitFlies: 0,
            driedFruitMoths: 0,
            flourMoths: 0,
            clothesMoths: 0,
            tobaccoMoths: 0,
            otherStoredPests: 0,
            uvaPercentage: 100
          };
        });
        
        // Add new equipment to the equipment list
        const updatedEquipmentList = [...selectedReport.equipmentList, ...newEquipmentData];
        
        // Sort by equipment number
        updatedEquipmentList.sort((a, b) => a.equipmentNumber - b.equipmentNumber);
        
        // Add the new equipment to all visits
        const updatedVisits = selectedReport.visits.map(visit => {
          return {
            ...visit,
            equipmentData: [
              ...visit.equipmentData,
              ...newEquipmentData.map(eq => ({
                ...eq,
                id: uuidv4() // Generate a new ID for each visit's copy
              }))
            ]
          };
        });
        
        setSelectedReport({
          ...selectedReport,
          equipmentList: updatedEquipmentList,
          visits: updatedVisits
        });
        
        setShowExcelUpload(false);
        setExcelFile(null);
        setSuccess(`${newEquipmentData.length} ekipman başarıyla eklendi.`);
      } else {
        setError('Excel dosyasında veri bulunamadı.');
      }
    } catch (error) {
      console.error('Error processing Excel file:', error);
      setError('Excel dosyası işlenirken bir hata oluştu.');
    }
  };

  const generateReportSummary = () => {
    if (!selectedReport || selectedReport.visits.length === 0) {
      return {
        introduction: 'Henüz ziyaret verisi bulunmamaktadır.',
        development: '',
        conclusion: ''
      };
    }

    // Sort visits by date
    const sortedVisits = [...selectedReport.visits].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const firstVisitDate = new Date(sortedVisits[0].date).toLocaleDateString('tr-TR');
    const lastVisitDate = new Date(sortedVisits[sortedVisits.length - 1].date).toLocaleDateString('tr-TR');
    
    // Count total equipment
    const totalEquipment = selectedReport.equipmentList.length * sortedVisits.length;
    
    // Count equipment with activity
    const equipmentWithActivity = sortedVisits.reduce((sum, visit) => {
      return sum + visit.equipmentData.filter(eq => eq.activityStatus === 'Aktivite Var').length;
    }, 0);
    
    // Get equipment numbers with activity
    const equipmentNumbersWithActivity = new Set<number>();
    sortedVisits.forEach(visit => {
      visit.equipmentData
        .filter(eq => eq.activityStatus === 'Aktivite Var')
        .forEach(eq => equipmentNumbersWithActivity.add(eq.equipmentNumber));
    });
    
    // Count unique equipment numbers with activity
    const uniqueEquipmentWithActivity = equipmentNumbersWithActivity.size;
    
    // Calculate activity percentage
    const activityPercentage = totalEquipment > 0 
      ? ((equipmentWithActivity / totalEquipment) * 100).toFixed(2) 
      : '0';
    
    // Get equipment types used
    const equipmentTypes = new Set(
      selectedReport.equipmentList.map(eq => eq.equipmentType)
    );
    
    // Count flying insects
    const totalFlyingInsects = sortedVisits.reduce((sum, visit) => {
      return sum + visit.equipmentData.reduce((eqSum, eq) => {
        return eqSum + (eq.houseflies || 0) + (eq.mosquitoes || 0) + 
               (eq.moths || 0) + (eq.bees || 0) + (eq.fruitFlies || 0);
      }, 0);
    }, 0);
    
    // Count stored product pests
    const totalStoredPests = sortedVisits.reduce((sum, visit) => {
      return sum + visit.equipmentData.reduce((eqSum, eq) => {
        return eqSum + (eq.driedFruitMoths || 0) + (eq.flourMoths || 0) + 
               (eq.clothesMoths || 0) + (eq.tobaccoMoths || 0) + (eq.otherStoredPests || 0);
      }, 0);
    }, 0);
    
    // Count biocidal products used
    const totalBiocidalProducts = sortedVisits.reduce((sum, visit) => {
      return sum + visit.biocidalProducts.length;
    }, 0);
    
    // Generate introduction
    const introduction = `${selectedReport.companyName} firmasına ait ${selectedReport.customerName} tesisinde ${firstVisitDate} - ${lastVisitDate} tarihleri arasında gerçekleştirilen zararlı mücadelesi trend analizi raporu aşağıda sunulmuştur. Bu süre zarfında toplam ${sortedVisits.length} ziyaret gerçekleştirilmiş ve ${selectedReport.equipmentList.length} ekipman kontrolü yapılmıştır.`;
    
    // Generate development
    let development = `Analiz süresince ${equipmentTypes.size} farklı tip ekipman kullanılmıştır. `;
    
    if (equipmentWithActivity > 0) {
      development += `Toplamda ${equipmentWithActivity} ekipmanda aktivite tespit edilmiştir (Toplam aktivite oranı: %${activityPercentage}). `;
      
      if (uniqueEquipmentWithActivity > 0) {
        const activeNumbers = Array.from(equipmentNumbersWithActivity).sort((a, b) => a - b).join(', ');
        development += `Aktivite tespit edilen ekipman numaraları: ${activeNumbers}. `;
      }
    } else {
      development += `İncelenen ekipmanlarda herhangi bir aktivite tespit edilmemiştir. `;
    }
    
    if (totalFlyingInsects > 0) {
      development += `Uçan haşere monitörlerinde toplam ${totalFlyingInsects} adet haşere tespit edilmiştir. `;
    }
    
    if (totalStoredPests > 0) {
      development += `Depo zararlısı monitörlerinde toplam ${totalStoredPests} adet zararlı tespit edilmiştir. `;
    }
    
    if (totalBiocidalProducts > 0) {
      development += `Ziyaretler sırasında toplam ${totalBiocidalProducts} farklı biyosidal ürün kullanılmıştır. `;
    }
    
    // Generate conclusion
    let conclusion = '';
    
    if (equipmentWithActivity > 0) {
      if (parseFloat(activityPercentage) > 10) {
        const topActiveNumbers = Array.from(equipmentNumbersWithActivity).sort((a, b) => a - b).slice(0, 3).join(', ');
        conclusion = `Tesiste yüksek oranda zararlı aktivitesi tespit edilmiştir. Özellikle ${topActiveNumbers} numaralı ekipmanlarda yoğun aktivite gözlemlenmiştir. Acil müdahale ve kapsamlı bir mücadele programı önerilmektedir.`;
      } else {
        conclusion = `Tesiste düşük oranda zararlı aktivitesi tespit edilmiştir. Aktivite gözlemlenen alanlarda düzenli kontrol ve önleyici tedbirlerin sürdürülmesi önerilmektedir.`;
      }
    } else {
      conclusion = `Tesiste zararlı aktivitesi tespit edilmemiştir. Mevcut koruyucu önlemlerin sürdürülmesi ve düzenli kontrollerin devam ettirilmesi önerilmektedir.`;
    }
    
    return {
      introduction,
      development,
      conclusion
    };
  };

  const renderActivityChart = () => {
    if (!selectedReport || selectedReport.visits.length === 0) {
      return <div className="text-center text-gray-500 py-8">Grafik için yeterli veri bulunmamaktadır.</div>;
    }

    // Sort visits by date
    const sortedVisits = [...selectedReport.visits].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Calculate activity percentages for each visit
    const chartData = sortedVisits.map(visit => {
      const totalEquipment = visit.equipmentData.length;
      const activeEquipment = visit.equipmentData.filter(eq => eq.activityStatus === 'Aktivite Var').length;
      const activityPercentage = totalEquipment > 0 ? (activeEquipment / totalEquipment) * 100 : 0;
      
      return {
        date: new Date(visit.date).toLocaleDateString('tr-TR'),
        activityPercentage: parseFloat(activityPercentage.toFixed(2)),
        activeCount: activeEquipment,
        totalCount: totalEquipment
      };
    });

    // Chart dimensions
    const width = 800;
    const height = 400;
    const padding = { top: 40, right: 40, bottom: 60, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Calculate scales
    const xScale = chartWidth / Math.max(chartData.length - 1, 1);
    const yScale = chartHeight / 100; // 0-100%

    // Generate points for the line
    const points = chartData.map((point, i) => ({
      x: padding.left + i * xScale,
      y: padding.top + chartHeight - (point.activityPercentage * yScale)
    }));

    // Generate line path
    const linePath = points.map((point, i) => 
      i === 0 ? `M ${point.x},${point.y}` : `L ${point.x},${point.y}`
    ).join(' ');

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Ekipman Aktivite Trendi</h3>
        <svg width={width} height={height} className="mx-auto">
          {/* Background grid */}
          {Array.from({ length: 11 }).map((_, i) => (
            <line
              key={`grid-y-${i}`}
              x1={padding.left}
              y1={padding.top + i * (chartHeight / 10)}
              x2={padding.left + chartWidth}
              y2={padding.top + i * (chartHeight / 10)}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {chartData.map((_, i) => (
            <line
              key={`grid-x-${i}`}
              x1={padding.left + i * xScale}
              y1={padding.top}
              x2={padding.left + i * xScale}
              y2={padding.top + chartHeight}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Y-axis */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={padding.top + chartHeight}
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* X-axis */}
          <line
            x1={padding.left}
            y1={padding.top + chartHeight}
            x2={padding.left + chartWidth}
            y2={padding.top + chartHeight}
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* Y-axis labels */}
          {Array.from({ length: 11 }).map((_, i) => (
            <text
              key={`y-label-${i}`}
              x={padding.left - 10}
              y={padding.top + i * (chartHeight / 10) + 5}
              textAnchor="end"
              fontSize="12"
              fill="#4b5563"
            >
              {100 - i * 10}%
            </text>
          ))}
          
          {/* X-axis labels */}
          {chartData.map((point, i) => (
            <text
              key={`x-label-${i}`}
              x={padding.left + i * xScale}
              y={padding.top + chartHeight + 20}
              textAnchor="middle"
              fontSize="12"
              fill="#4b5563"
            >
              {point.date}
            </text>
          ))}
          
          {/* Chart title */}
          <text
            x={width / 2}
            y={20}
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
            fill="#1f2937"
          >
            Ekipman Aktivite Yüzdesi
          </text>
          
          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#16a34a"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {points.map((point, i) => (
            <g key={`point-${i}`}>
              <circle
                cx={point.x}
                cy={point.y}
                r="6"
                fill="#16a34a"
                stroke="#ffffff"
                strokeWidth="2"
              />
              
              {/* Data labels */}
              <text
                x={point.x}
                y={point.y - 15}
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
                fill="#16a34a"
              >
                {chartData[i].activityPercentage}%
              </text>
              
              <text
                x={point.x}
                y={point.y - 30}
                textAnchor="middle"
                fontSize="10"
                fill="#4b5563"
              >
                {chartData[i].activeCount}/{chartData[i].totalCount}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  const renderFlyingInsectChart = () => {
    if (!selectedReport || selectedReport.visits.length === 0) {
      return <div className="text-center text-gray-500 py-8">Grafik için yeterli veri bulunmamaktadır.</div>;
    }

    // Check if there are any flying insect monitors
    const hasFlyingInsectMonitors = selectedReport.equipmentList.some(
      eq => eq.equipmentType.toLowerCase().includes('uçan')
    );

    if (!hasFlyingInsectMonitors) {
      return <div className="text-center text-gray-500 py-8">Uçan haşere monitörü bulunmamaktadır.</div>;
    }

    // Sort visits by date
    const sortedVisits = [...selectedReport.visits].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Calculate insect counts for each visit
    const chartData = sortedVisits.map(visit => {
      const houseflies = visit.equipmentData.reduce((sum, eq) => sum + (eq.houseflies || 0), 0);
      const mosquitoes = visit.equipmentData.reduce((sum, eq) => sum + (eq.mosquitoes || 0), 0);
      const moths = visit.equipmentData.reduce((sum, eq) => sum + (eq.moths || 0), 0);
      const bees = visit.equipmentData.reduce((sum, eq) => sum + (eq.bees || 0), 0);
      const fruitFlies = visit.equipmentData.reduce((sum, eq) => sum + (eq.fruitFlies || 0), 0);
      
      return {
        date: new Date(visit.date).toLocaleDateString('tr-TR'),
        houseflies,
        mosquitoes,
        moths,
        bees,
        fruitFlies,
        total: houseflies + mosquitoes + moths + bees + fruitFlies
      };
    });

    // Chart dimensions
    const width = 800;
    const height = 400;
    const padding = { top: 40, right: 120, bottom: 60, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Find the maximum value for the y-axis
    const maxValue = Math.max(
      ...chartData.map(d => d.total),
      10 // Minimum max value to avoid empty charts
    );
    
    // Round up to the nearest 10
    const yMax = Math.ceil(maxValue / 10) * 10;

    // Calculate scales
    const xScale = chartWidth / Math.max(chartData.length - 1, 1);
    const yScale = chartHeight / yMax;

    // Colors for different insect types
    const colors = {
      houseflies: "#2563eb", // blue
      mosquitoes: "#7c3aed", // purple
      moths: "#db2777", // pink
      bees: "#eab308", // yellow
      fruitFlies: "#16a34a" // green
    };

    // Generate bar width
    const barWidth = xScale * 0.7;
    const barSpacing = xScale * 0.3;
    const insectTypes = ['houseflies', 'mosquitoes', 'moths', 'bees', 'fruitFlies'];
    const barGroupWidth = barWidth / insectTypes.length;

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Uçan Haşere Trendi</h3>
        <svg width={width} height={height} className="mx-auto">
          {/* Background grid */}
          {Array.from({ length: 6 }).map((_, i) => (
            <line
              key={`grid-y-${i}`}
              x1={padding.left}
              y1={padding.top + i * (chartHeight / 5)}
              x2={padding.left + chartWidth}
              y2={padding.top + i * (chartHeight / 5)}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Y-axis */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={padding.top + chartHeight}
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* X-axis */}
          <line
            x1={padding.left}
            y1={padding.top + chartHeight}
            x2={padding.left + chartWidth}
            y2={padding.top + chartHeight}
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* Y-axis labels */}
          {Array.from({ length: 6 }).map((_, i) => (
            <text
              key={`y-label-${i}`}
              x={padding.left - 10}
              y={padding.top + i * (chartHeight / 5) + 5}
              textAnchor="end"
              fontSize="12"
              fill="#4b5563"
            >
              {yMax - i * (yMax / 5)}
            </text>
          ))}
          
          {/* X-axis labels */}
          {chartData.map((point, i) => (
            <text
              key={`x-label-${i}`}
              x={padding.left + i * xScale + barWidth / 2}
              y={padding.top + chartHeight + 20}
              textAnchor="middle"
              fontSize="12"
              fill="#4b5563"
            >
              {point.date}
            </text>
          ))}
          
          {/* Chart title */}
          <text
            x={width / 2}
            y={20}
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
            fill="#1f2937"
          >
            Uçan Haşere Sayıları
          </text>
          
          {/* Bars */}
          {chartData.map((point, i) => (
            <g key={`bars-${i}`}>
              {insectTypes.map((type, j) => {
                const value = point[type as keyof typeof point] as number;
                const barHeight = value * yScale;
                const x = padding.left + i * xScale + j * barGroupWidth;
                const y = padding.top + chartHeight - barHeight;
                
                return (
                  <rect
                    key={`bar-${i}-${j}`}
                    x={x}
                    y={y}
                    width={barGroupWidth - 2}
                    height={barHeight}
                    fill={colors[type as keyof typeof colors]}
                    opacity={0.8}
                  />
                );
              })}
              
              {/* Total label */}
              <text
                x={padding.left + i * xScale + barWidth / 2}
                y={padding.top + chartHeight - (point.total * yScale) - 10}
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
                fill="#1f2937"
              >
                {point.total}
              </text>
            </g>
          ))}
          
          {/* Legend */}
          {Object.entries(colors).map(([type, color], i) => (
            <g key={`legend-${i}`} transform={`translate(${padding.left + chartWidth + 20}, ${padding.top + i * 25})`}>
              <rect
                width="15"
                height="15"
                fill={color}
                opacity={0.8}
              />
              <text
                x="25"
                y="12"
                fontSize="12"
                fill="#4b5563"
              >
                {type === 'houseflies' ? 'Karasinek' :
                 type === 'mosquitoes' ? 'Sivrisinek' :
                 type === 'moths' ? 'Güve' :
                 type === 'bees' ? 'Arı' : 'Meyve Sineği'}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  const renderStoredPestChart = () => {
    if (!selectedReport || selectedReport.visits.length === 0) {
      return <div className="text-center text-gray-500 py-8">Grafik için yeterli veri bulunmamaktadır.</div>;
    }

    // Check if there are any stored pest monitors
    const hasStoredPestMonitors = selectedReport.equipmentList.some(
      eq => eq.equipmentType.toLowerCase().includes('depo')
    );

    if (!hasStoredPestMonitors) {
      return <div className="text-center text-gray-500 py-8">Depo zararlısı monitörü bulunmamaktadır.</div>;
    }

    // Check if there's any stored pest data
    const hasStoredPestData = selectedReport.visits.some(visit => 
      visit.equipmentData.some(eq => 
        (eq.driedFruitMoths || 0) + 
        (eq.flourMoths || 0) + 
        (eq.clothesMoths || 0) + 
        (eq.tobaccoMoths || 0) + 
        (eq.otherStoredPests || 0) > 0
      )
    );

    if (!hasStoredPestData) {
      return <div className="text-center text-gray-500 py-8">Depo zararlısı verisi bulunmamaktadır.</div>;
    }

    // Sort visits by date
    const sortedVisits = [...selectedReport.visits].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Calculate pest counts for each visit
    const chartData = sortedVisits.map(visit => {
      const driedFruitMoths = visit.equipmentData.reduce((sum, eq) => sum + (eq.driedFruitMoths || 0), 0);
      const flourMoths = visit.equipmentData.reduce((sum, eq) => sum + (eq.flourMoths || 0), 0);
      const clothesMoths = visit.equipmentData.reduce((sum, eq) => sum + (eq.clothesMoths || 0), 0);
      const tobaccoMoths = visit.equipmentData.reduce((sum, eq) => sum + (eq.tobaccoMoths || 0), 0);
      const otherStoredPests = visit.equipmentData.reduce((sum, eq) => sum + (eq.otherStoredPests || 0), 0);
      
      return {
        date: new Date(visit.date).toLocaleDateString('tr-TR'),
        driedFruitMoths,
        flourMoths,
        clothesMoths,
        tobaccoMoths,
        otherStoredPests,
        total: driedFruitMoths + flourMoths + clothesMoths + tobaccoMoths + otherStoredPests
      };
    });

    // Chart dimensions
    const width = 800;
    const height = 400;
    const padding = { top: 40, right: 180, bottom: 60, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Find the maximum value for the y-axis
    const maxValue = Math.max(
      ...chartData.map(d => d.total),
      10 // Minimum max value to avoid empty charts
    );
    
    // Round up to the nearest 10
    const yMax = Math.ceil(maxValue / 10) * 10;

    // Calculate scales
    const xScale = chartWidth / Math.max(chartData.length - 1, 1);
    const yScale = chartHeight / yMax;

    // Colors for different pest types
    const colors = {
      driedFruitMoths: "#f97316", // orange
      flourMoths: "#84cc16", // lime
      clothesMoths: "#06b6d4", // cyan
      tobaccoMoths: "#8b5cf6", // violet
      otherStoredPests: "#64748b" // slate
    };

    // Generate bar width
    const barWidth = xScale * 0.7;
    const barSpacing = xScale * 0.3;
    const pestTypes = ['driedFruitMoths', 'flourMoths', 'clothesMoths', 'tobaccoMoths', 'otherStoredPests'];
    const barGroupWidth = barWidth / pestTypes.length;

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Depo Zararlısı Trendi</h3>
        <svg width={width} height={height} className="mx-auto">
          {/* Background grid */}
          {Array.from({ length: 6 }).map((_, i) => (
            <line
              key={`grid-y-${i}`}
              x1={padding.left}
              y1={padding.top + i * (chartHeight / 5)}
              x2={padding.left + chartWidth}
              y2={padding.top + i * (chartHeight / 5)}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Y-axis */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={padding.top + chartHeight}
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* X-axis */}
          <line
            x1={padding.left}
            y1={padding.top + chartHeight}
            x2={padding.left + chartWidth}
            y2={padding.top + chartHeight}
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* Y-axis labels */}
          {Array.from({ length: 6 }).map((_, i) => (
            <text
              key={`y-label-${i}`}
              x={padding.left - 10}
              y={padding.top + i * (chartHeight / 5) + 5}
              textAnchor="end"
              fontSize="12"
              fill="#4b5563"
            >
              {yMax - i * (yMax / 5)}
            </text>
          ))}
          
          {/* X-axis labels */}
          {chartData.map((point, i) => (
            <text
              key={`x-label-${i}`}
              x={padding.left + i * xScale + barWidth / 2}
              y={padding.top + chartHeight + 20}
              textAnchor="middle"
              fontSize="12"
              fill="#4b5563"
            >
              {point.date}
            </text>
          ))}
          
          {/* Chart title */}
          <text
            x={width / 2}
            y={20}
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
            fill="#1f2937"
          >
            Depo Zararlısı Sayıları
          </text>
          
          {/* Bars */}
          {chartData.map((point, i) => (
            <g key={`bars-${i}`}>
              {pestTypes.map((type, j) => {
                const value = point[type as keyof typeof point] as number;
                const barHeight = value * yScale;
                const x = padding.left + i * xScale + j * barGroupWidth;
                const y = padding.top + chartHeight - barHeight;
                
                return (
                  <rect
                    key={`bar-${i}-${j}`}
                    x={x}
                    y={y}
                    width={barGroupWidth - 2}
                    height={barHeight}
                    fill={colors[type as keyof typeof colors]}
                    opacity={0.8}
                  />
                );
              })}
              
              {/* Total label */}
              <text
                x={padding.left + i * xScale + barWidth / 2}
                y={padding.top + chartHeight - (point.total * yScale) - 10}
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
                fill="#1f2937"
              >
                {point.total}
              </text>
            </g>
          ))}
          
          {/* Legend */}
          {Object.entries(colors).map(([type, color], i) => (
            <g key={`legend-${i}`} transform={`translate(${padding.left + chartWidth + 20}, ${padding.top + i * 25})`}>
              <rect
                width="15"
                height="15"
                fill={color}
                opacity={0.8}
              />
              <text
                x="25"
                y="12"
                fontSize="12"
                fill="#4b5563"
              >
                {type === 'driedFruitMoths' ? 'Kuru Meyve Güvesi' :
                 type === 'flourMoths' ? 'Değirmen Güvesi' :
                 type === 'clothesMoths' ? 'Elbise Güvesi' :
                 type === 'tobaccoMoths' ? 'Tütün Güvesi' : 'Diğer Zararlılar'}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  const renderBiocidalProductChart = () => {
    if (!selectedReport || selectedReport.visits.length === 0) {
      return <div className="text-center text-gray-500 py-8">Grafik için yeterli veri bulunmamaktadır.</div>;
    }

    // Check if there's any biocidal product data
    const hasBiocidalData = selectedReport.visits.some(visit => visit.biocidalProducts.length > 0);

    if (!hasBiocidalData) {
      return <div className="text-center text-gray-500 py-8">Biyosidal ürün verisi bulunmamaktadır.</div>;
    }

    // Sort visits by date
    const sortedVisits = [...selectedReport.visits].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Get all unique product names
    const allProductNames = new Set<string>();
    sortedVisits.forEach(visit => {
      visit.biocidalProducts.forEach(product => {
        allProductNames.add(product.productName);
      });
    });
    
    const productNames = Array.from(allProductNames);
    
    // Assign colors to products
    const productColors: Record<string, string> = {};
    const colorPalette = [
      "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", 
      "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1"
    ];
    
    productNames.forEach((name, i) => {
      productColors[name] = colorPalette[i % colorPalette.length];
    });

    // Calculate product usage for each visit
    const chartData = sortedVisits.map(visit => {
      const productUsage: Record<string, number> = {};
      let totalAmount = 0;
      
      visit.biocidalProducts.forEach(product => {
        // Convert all to grams for consistency
        let amount = product.amountUsed;
        if (product.unit === 'kg') amount *= 1000;
        if (product.unit === 'l') amount *= 1000;
        
        productUsage[product.productName] = (productUsage[product.productName] || 0) + amount;
        totalAmount += amount;
      });
      
      return {
        date: new Date(visit.date).toLocaleDateString('tr-TR'),
        products: productUsage,
        totalAmount
      };
    });

    // Chart dimensions
    const width = 800;
    const height = 400;
    const padding = { top: 40, right: 180, bottom: 60, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Find the maximum value for the y-axis
    const maxValue = Math.max(
      ...chartData.map(d => d.totalAmount),
      10 // Minimum max value to avoid empty charts
    );
    
    // Round up to the nearest 100
    const yMax = Math.ceil(maxValue / 100) * 100;

    // Calculate scales
    const xScale = chartWidth / Math.max(chartData.length - 1, 1);
    const yScale = chartHeight / yMax;

    // Generate bar width
    const barWidth = xScale * 0.7;

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Biyosidal Ürün Kullanımı</h3>
        <svg width={width} height={height} className="mx-auto">
          {/* Background grid */}
          {Array.from({ length: 6 }).map((_, i) => (
            <line
              key={`grid-y-${i}`}
              x1={padding.left}
              y1={padding.top + i * (chartHeight / 5)}
              x2={padding.left + chartWidth}
              y2={padding.top + i * (chartHeight / 5)}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Y-axis */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={padding.top + chartHeight}
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* X-axis */}
          <line
            x1={padding.left}
            y1={padding.top + chartHeight}
            x2={padding.left + chartWidth}
            y2={padding.top + chartHeight}
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* Y-axis labels */}
          {Array.from({ length: 6 }).map((_, i) => (
            <text
              key={`y-label-${i}`}
              x={padding.left - 10}
              y={padding.top + i * (chartHeight / 5) + 5}
              textAnchor="end"
              fontSize="12"
              fill="#4b5563"
            >
              {yMax - i * (yMax / 5)} g
            </text>
          ))}
          
          {/* X-axis labels */}
          {chartData.map((point, i) => (
            <text
              key={`x-label-${i}`}
              x={padding.left + i * xScale + barWidth / 2}
              y={padding.top + chartHeight + 20}
              textAnchor="middle"
              fontSize="12"
              fill="#4b5563"
            >
              {point.date}
            </text>
          ))}
          
          {/* Chart title */}
          <text
            x={width / 2}
            y={20}
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
            fill="#1f2937"
          >
            Biyosidal Ürün Kullanımı (g/ml)
          </text>
          
          {/* Stacked bars */}
          {chartData.map((point, i) => {
            let yOffset = 0;
            
            return (
              <g key={`bars-${i}`}>
                {productNames.map(productName => {
                  const amount = point.products[productName] || 0;
                  if (amount === 0) return null;
                  
                  const barHeight = amount * yScale;
                  const x = padding.left + i * xScale;
                  const y = padding.top + chartHeight - yOffset - barHeight;
                  
                  yOffset += barHeight;
                  
                  return (
                    <rect
                      key={`bar-${i}-${productName}`}
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      fill={productColors[productName]}
                      opacity={0.8}
                    />
                  );
                })}
                
                {/* Total label */}
                <text
                  x={padding.left + i * xScale + barWidth / 2}
                  y={padding.top + chartHeight - yOffset - 10}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                  fill="#1f2937"
                >
                  {point.totalAmount}g
                </text>
              </g>
            );
          })}
          
          {/* Legend */}
          {productNames.map((name, i) => (
            <g key={`legend-${i}`} transform={`translate(${padding.left + chartWidth + 20}, ${padding.top + i * 25})`}>
              <rect
                width="15"
                height="15"
                fill={productColors[name]}
                opacity={0.8}
              />
              <text
                x="25"
                y="12"
                fontSize="12"
                fill="#4b5563"
              >
                {name}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  const renderUVAMeasurementChart = () => {
    if (!selectedReport || selectedReport.visits.length === 0) {
      return <div className="text-center text-gray-500 py-8">Grafik için yeterli veri bulunmamaktadır.</div>;
    }

    // Check if there are any UVA light traps
    const hasUVALightTraps = selectedReport.equipmentList.some(
      eq => eq.equipmentType.toLowerCase().includes('uçan')
    );

    if (!hasUVALightTraps) {
      return <div className="text-center text-gray-500 py-8">UVA lamba monitörü bulunmamaktadır.</div>;
    }

    // Check if there's any UVA measurement data
    const hasUVAData = selectedReport.visits.some(visit => 
      visit.equipmentData.some(eq => 
        eq.equipmentType.toLowerCase().includes('uçan') && eq.uvaPercentage !== undefined
      )
    );

    if (!hasUVAData) {
      return <div className="text-center text-gray-500 py-8">UVA ölçüm verisi bulunmamaktadır.</div>;
    }

    // Sort visits by date
    const sortedVisits = [...selectedReport.visits].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Calculate average UVA percentage for each visit
    const chartData = sortedVisits.map(visit => {
      const uvaEquipment = visit.equipmentData.filter(eq => 
        eq.equipmentType.toLowerCase().includes('uçan') && eq.uvaPercentage !== undefined
      );
      
      const avgUVA = uvaEquipment.length > 0
        ? uvaEquipment.reduce((sum, eq) => sum + (eq.uvaPercentage || 0), 0) / uvaEquipment.length
        : 0;
      
      return {
        date: new Date(visit.date).toLocaleDateString('tr-TR'),
        avgUVA: parseFloat(avgUVA.toFixed(2)),
        equipmentCount: uvaEquipment.length
      };
    });

    // Chart dimensions
    const width = 800;
    const height = 400;
    const padding = { top: 40, right: 40, bottom: 60, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Calculate scales
    const xScale = chartWidth / Math.max(chartData.length - 1, 1);
    const yScale = chartHeight / 100; // 0-100%

    // Generate points for the line
    const points = chartData.map((point, i) => ({
      x: padding.left + i * xScale,
      y: padding.top + chartHeight - (point.avgUVA * yScale)
    }));

    // Generate line path
    const linePath = points.map((point, i) => 
      i === 0 ? `M ${point.x},${point.y}` : `L ${point.x},${point.y}`
    ).join(' ');

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
        <h3 className="text-xl font-bold text-gray-800 mb-4">UVA Lamba Etkinliği</h3>
        <svg width={width} height={height} className="mx-auto">
          {/* Background grid */}
          {Array.from({ length: 11 }).map((_, i) => (
            <line
              key={`grid-y-${i}`}
              x1={padding.left}
              y1={padding.top + i * (chartHeight / 10)}
              x2={padding.left + chartWidth}
              y2={padding.top + i * (chartHeight / 10)}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {chartData.map((_, i) => (
            <line
              key={`grid-x-${i}`}
              x1={padding.left + i * xScale}
              y1={padding.top}
              x2={padding.left + i * xScale}
              y2={padding.top + chartHeight}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Y-axis */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={padding.top + chartHeight}
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* X-axis */}
          <line
            x1={padding.left}
            y1={padding.top + chartHeight}
            x2={padding.left + chartWidth}
            y2={padding.top + chartHeight}
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* Y-axis labels */}
          {Array.from({ length: 11 }).map((_, i) => (
            <text
              key={`y-label-${i}`}
              x={padding.left - 10}
              y={padding.top + i * (chartHeight / 10) + 5}
              textAnchor="end"
              fontSize="12"
              fill="#4b5563"
            >
              {100 - i * 10}%
            </text>
          ))}
          
          {/* X-axis labels */}
          {chartData.map((point, i) => (
            <text
              key={`x-label-${i}`}
              x={padding.left + i * xScale}
              y={padding.top + chartHeight + 20}
              textAnchor="middle"
              fontSize="12"
              fill="#4b5563"
            >
              {point.date}
            </text>
          ))}
          
          {/* Chart title */}
          <text
            x={width / 2}
            y={20}
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
            fill="#1f2937"
          >
            Ortalama UVA Lamba Etkinliği
          </text>
          
          {/* Reference line at 70% (minimum acceptable UVA) */}
          <line
            x1={padding.left}
            y1={padding.top + chartHeight - (70 * yScale)}
            x2={padding.left + chartWidth}
            y2={padding.top + chartHeight - (70 * yScale)}
            stroke="#ef4444"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          
          <text
            x={padding.left + 5}
            y={padding.top + chartHeight - (70 * yScale) - 5}
            fontSize="10"
            fill="#ef4444"
          >
            Min. 70%
          </text>
          
          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {points.map((point, i) => (
            <g key={`point-${i}`}>
              <circle
                cx={point.x}
                cy={point.y}
                r="6"
                fill="#06b6d4"
                stroke="#ffffff"
                strokeWidth="2"
              />
              
              {/* Data labels */}
              <text
                x={point.x}
                y={point.y - 15}
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
                fill="#06b6d4"
              >
                {chartData[i].avgUVA}%
              </text>
              
              <text
                x={point.x}
                y={point.y - 30}
                textAnchor="middle"
                fontSize="10"
                fill="#4b5563"
              >
                {chartData[i].equipmentCount} ekipman
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  const renderReport = () => {
    if (!selectedReport) return null;

    const reportSummary = generateReportSummary();

    return (
      <div ref={reportRef} className="bg-white p-8 rounded-lg shadow-lg">
        {/* Report Header with Logo */}
        <div className="text-center mb-8">
          {selectedReport.logoUrl && (
            <div className="mb-4 flex justify-center">
              <img 
                src={selectedReport.logoUrl} 
                alt="Company Logo" 
                className="max-h-20 max-w-xs object-contain"
                crossOrigin="anonymous"
              />
            </div>
          )}
          <h2 className="text-3xl font-bold text-gray-900 mb-2">TREND ANALİZ RAPORU</h2>
          <p className="text-xl text-gray-700">{selectedReport.companyName} - {selectedReport.customerName}</p>
          <p className="text-gray-600">
            {selectedReport.visits.length > 0 
              ? `${new Date(selectedReport.visits[0].date).toLocaleDateString('tr-TR')} - ${new Date(selectedReport.visits[selectedReport.visits.length - 1].date).toLocaleDateString('tr-TR')}`
              : 'Ziyaret verisi bulunmamaktadır'}
          </p>
        </div>

        {/* Report Summary */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="bg-pest-green-700 text-white w-8 h-8 rounded-full flex items-center justify-center mr-2">1</span>
            Giriş
          </h3>
          <p className="text-gray-700 mb-6 leading-relaxed">{reportSummary.introduction}</p>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="bg-pest-green-700 text-white w-8 h-8 rounded-full flex items-center justify-center mr-2">2</span>
            Gelişme
          </h3>
          <p className="text-gray-700 mb-6 leading-relaxed">{reportSummary.development}</p>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="bg-pest-green-700 text-white w-8 h-8 rounded-full flex items-center justify-center mr-2">3</span>
            Sonuç
          </h3>
          <p className="text-gray-700 mb-10 leading-relaxed">{reportSummary.conclusion}</p>
        </div>

        {/* Charts */}
        <div className="space-y-10">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="bg-pest-green-700 text-white w-8 h-8 rounded-full flex items-center justify-center mr-2">4</span>
            Trend Analiz Grafikleri
          </h3>
          
          <div className="mb-8">
            {renderActivityChart()}
          </div>
          
          <div className="mb-8">
            {renderFlyingInsectChart()}
          </div>
          
          <div className="mb-8">
            {renderStoredPestChart()}
          </div>
          
          <div className="mb-8">
            {renderBiocidalProductChart()}
          </div>
          
          <div className="mb-8">
            {renderUVAMeasurementChart()}
          </div>
        </div>

        {/* Visit Data */}
        <div className="mt-10">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="bg-pest-green-700 text-white w-8 h-8 rounded-full flex items-center justify-center mr-2">5</span>
            Ziyaret Verileri
          </h3>
          
          {selectedReport.visits.length === 0 ? (
            <p className="text-gray-500 italic">Henüz ziyaret verisi bulunmamaktadır.</p>
          ) : (
            <div className="space-y-8">
              {selectedReport.visits
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((visit, visitIndex) => (
                  <div key={visit.id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      Ziyaret {visitIndex + 1}: {new Date(visit.date).toLocaleDateString('tr-TR')}
                    </h4>
                    
                    {/* Visit summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500">Toplam Ekipman</p>
                        <p className="text-xl font-bold text-gray-800">{visit.equipmentData.length}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500">Aktivite Tespit Edilen</p>
                        <p className="text-xl font-bold text-gray-800">
                          {visit.equipmentData.filter(eq => eq.activityStatus === 'Aktivite Var').length}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500">Aktivite Oranı</p>
                        <p className="text-xl font-bold text-gray-800">
                          {visit.equipmentData.length > 0 
                            ? `%${((visit.equipmentData.filter(eq => eq.activityStatus === 'Aktivite Var').length / visit.equipmentData.length) * 100).toFixed(2)}`
                            : '0%'}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500">Biyosidal Ürünler</p>
                        <p className="text-xl font-bold text-gray-800">{visit.biocidalProducts.length}</p>
                      </div>
                    </div>
                    
                    {/* Equipment data table */}
                    <div className="overflow-x-auto mb-6">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tür</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Konum</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sayım</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {visit.equipmentData
                            .sort((a, b) => a.equipmentNumber - b.equipmentNumber)
                            .map(equipment => (
                              <tr key={equipment.id}>
                                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {equipment.equipmentNumber}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                  {equipment.equipmentType}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                  {equipment.location}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm">
                                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    equipment.activityStatus === 'Aktivite Var' 
                                      ? 'bg-red-100 text-red-800' 
                                      : 'bg-green-100 text-green-800'
                                  }`}>
                                    {equipment.activityStatus}
                                  </span>
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                  {equipment.equipmentType.toLowerCase().includes('kemirgen') && equipment.rodentCount !== undefined && (
                                    <span>{equipment.rodentCount} kemirgen</span>
                                  )}
                                  {equipment.equipmentType.toLowerCase().includes('hamamböceği') && equipment.insectCount !== undefined && (
                                    <span>{equipment.insectCount} böcek</span>
                                  )}
                                  {equipment.equipmentType.toLowerCase().includes('uçan') && (
                                    <span>
                                      {[
                                        equipment.houseflies ? `${equipment.houseflies} karasinek` : '',
                                        equipment.mosquitoes ? `${equipment.mosquitoes} sivrisinek` : '',
                                        equipment.moths ? `${equipment.moths} güve` : '',
                                        equipment.bees ? `${equipment.bees} arı` : '',
                                        equipment.fruitFlies ? `${equipment.fruitFlies} meyve sineği` : ''
                                      ].filter(Boolean).join(', ') || '0'}
                                      {equipment.uvaPercentage !== undefined && ` (UVA: %${equipment.uvaPercentage})`}
                                    </span>
                                  )}
                                  {equipment.equipmentType.toLowerCase().includes('depo') && (
                                    <span>
                                      {[
                                        equipment.driedFruitMoths ? `${equipment.driedFruitMoths} kuru meyve güvesi` : '',
                                        equipment.flourMoths ? `${equipment.flourMoths} değirmen güvesi` : '',
                                        equipment.clothesMoths ? `${equipment.clothesMoths} elbise güvesi` : '',
                                        equipment.tobaccoMoths ? `${equipment.tobaccoMoths} tütün güvesi` : '',
                                        equipment.otherStoredPests ? `${equipment.otherStoredPests} diğer` : ''
                                      ].filter(Boolean).join(', ') || '0'}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Biocidal products */}
                    {visit.biocidalProducts.length > 0 && (
                      <div>
                        <h5 className="text-md font-semibold text-gray-800 mb-2">Kullanılan Biyosidal Ürünler</h5>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün Adı</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aktif Madde</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aktif Oran</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Miktar</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {visit.biocidalProducts.map(product => (
                                <tr key={product.id}>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {product.productName}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                    {product.activeIngredient}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                    %{product.activePercentage}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                    {product.amountUsed} {product.unit}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="mt-10">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="bg-pest-green-700 text-white w-8 h-8 rounded-full flex items-center justify-center mr-2">6</span>
            Öneriler
          </h3>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-pest-green-600 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Düzenli monitoring sisteminin sürdürülmesi ve kayıtların tutulması</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-pest-green-600 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Aktivite tespit edilen alanlarda önleyici tedbirlerin artırılması</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-pest-green-600 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Personel farkındalık eğitimlerinin düzenli olarak yapılması</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-pest-green-600 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Hijyen ve sanitasyon uygulamalarının güçlendirilmesi</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-pest-green-600 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Biyosidal ürün kullanımının optimize edilmesi ve çevre dostu alternatiflerin değerlendirilmesi</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-pest-green-600 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Uçan haşere monitörlerindeki UVA lambalarının düzenli değiştirilmesi</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pt-8">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <BarChart3 className="h-12 w-12 text-blue-600 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              Trend Analiz Modülü
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Zararlı mücadele ekipmanlarının aktivite verilerini takip edin ve trend analizleri oluşturun.
            Ziyaret tarihlerine göre ekipman aktivitelerini görselleştirin.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 mt-0.5" />
              <span>{success}</span>
              <button 
                onClick={() => setSuccess(null)} 
                className="ml-auto"
              >
                <X className="h-5 w-5 text-green-700" />
              </button>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start">
              <AlertTriangle className="h-5 w-5 mr-2 mt-0.5" />
              <span>{error}</span>
              <button 
                onClick={() => setError(null)} 
                className="ml-auto"
              >
                <X className="h-5 w-5 text-red-700" />
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-2">1</span>
                    Raporlar
                  </h2>
                  
                  <button
                    onClick={() => setShowReportForm(true)}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mb-4 flex items-center justify-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Yeni Rapor Oluştur
                  </button>
                  
                  {reports.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Henüz rapor bulunmamaktadır.</p>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {reports.map(report => (
                        <div 
                          key={report.id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedReport?.id === report.id 
                              ? 'bg-blue-50 border border-blue-200' 
                              : 'hover:bg-gray-50 border border-gray-200'
                          }`}
                          onClick={() => setSelectedReport(report)}
                        >
                          <h3 className="font-medium text-gray-800">{report.companyName}</h3>
                          <p className="text-sm text-gray-600">{report.customerName}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {report.visits.length} ziyaret, {report.equipmentList.length} ekipman
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {selectedReport && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-2">2</span>
                      İşlemler
                    </h2>
                    
                    <div className="space-y-3">
                      {/* Logo Upload Section */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Firma Logosu
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="hidden"
                            id="logo-upload"
                          />
                          <label
                            htmlFor="logo-upload"
                            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer flex items-center justify-center"
                          >
                            <Image className="h-5 w-5 mr-2" />
                            {selectedReport.logoUrl ? 'Logo Değiştir' : 'Logo Yükle'}
                          </label>
                          {selectedReport.logoUrl && (
                            <div className="w-10 h-10 border rounded-md overflow-hidden">
                              <img 
                                src={selectedReport.logoUrl} 
                                alt="Logo" 
                                className="w-full h-full object-contain"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Equipment Management Buttons */}
                      <button
                        onClick={() => setShowEquipmentForm(true)}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Ekipman Ekle
                      </button>
                      
                      <button
                        onClick={() => setShowBulkEquipmentForm(true)}
                        className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                      >
                        <ListPlus className="h-5 w-5 mr-2" />
                        Toplu Ekipman Ekle
                      </button>
                      
                      <button
                        onClick={() => setShowExcelUpload(true)}
                        className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                      >
                        <Upload className="h-5 w-5 mr-2" />
                        Excel İle Yükle
                      </button>

                      {/* Visit Button */}
                      <button
                        onClick={() => {
                          if (selectedReport.equipmentList.length === 0) {
                            setError('Önce ekipman listesi oluşturmalısınız.');
                            return;
                          }
                          setCurrentVisit(null);
                          setShowVisitForm(true);
                        }}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        <Calendar className="h-5 w-5 mr-2" />
                        Yeni Ziyaret Ekle
                      </button>
                      
                      <button
                        onClick={() => setShowReportModal(true)}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                      >
                        <Eye className="h-5 w-5 mr-2" />
                        Raporu Görüntüle
                      </button>
                      
                      <button
                        onClick={handleExportPDF}
                        className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                      >
                        <Download className="h-5 w-5 mr-2" />
                        PDF İndir
                      </button>
                      
                      <button
                        onClick={handleExportJPEG}
                        className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center"
                      >
                        <Download className="h-5 w-5 mr-2" />
                        JPEG İndir
                      </button>
                      
                      <button
                        onClick={handleSaveReport}
                        disabled={saving}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Kaydediliyor...
                          </>
                        ) : (
                          <>
                            <Save className="h-5 w-5 mr-2" />
                            Raporu Kaydet
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Main Content */}
              <div className="lg:col-span-9">
                {selectedReport ? (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-2">3</span>
                        {selectedReport.companyName} - {selectedReport.customerName}
                      </h2>
                      <div className="text-sm text-gray-500">
                        {selectedReport.visits.length} ziyaret, {selectedReport.equipmentList.length} ekipman
                      </div>
                    </div>
                    
                    {/* Equipment List */}
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center">
                          <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-2">4</span>
                          Ekipman Listesi
                        </h3>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setShowEquipmentForm(true)}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors text-sm flex items-center"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Ekipman Ekle
                          </button>
                          <button
                            onClick={() => setShowBulkEquipmentForm(true)}
                            className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition-colors text-sm flex items-center"
                          >
                            <ListPlus className="h-4 w-4 mr-1" />
                            Toplu Ekle
                          </button>
                          <button
                            onClick={() => setShowExcelUpload(true)}
                            className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition-colors text-sm flex items-center"
                          >
                            <Upload className="h-4 w-4 mr-1" />
                            Excel İle Yükle
                          </button>
                        </div>
                      </div>
                      
                      {selectedReport.equipmentList.length === 0 ? (
                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-6">
                          <p className="font-medium">Henüz ekipman listesi oluşturulmamış.</p>
                          <p className="text-sm mt-1">Ziyaret ekleyebilmek için önce ekipman listesi oluşturmalısınız.</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tür</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Konum</th>
                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {selectedReport.equipmentList
                                .sort((a, b) => a.equipmentNumber - b.equipmentNumber)
                                .map(equipment => (
                                  <tr key={equipment.id}>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {equipment.equipmentNumber}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                      {equipment.equipmentType}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                      {equipment.location || <span className="text-gray-400 italic">Konum belirtilmemiş</span>}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                      <div className="flex space-x-2">
                                        <button
                                          onClick={() => handleEditEquipment(equipment)}
                                          className="text-blue-600 hover:text-blue-800"
                                          title="Düzenle"
                                        >
                                          <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                          onClick={() => handleRemoveEquipment(equipment.id)}
                                          className="text-red-600 hover:text-red-800"
                                          title="Sil"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                    
                    {/* Visits */}
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center">
                          <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-2">5</span>
                          Ziyaretler
                        </h3>
                        
                        <button
                          onClick={() => {
                            if (selectedReport.equipmentList.length === 0) {
                              setError('Önce ekipman listesi oluşturmalısınız.');
                              return;
                            }
                            setCurrentVisit(null);
                            setShowVisitForm(true);
                          }}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors text-sm flex items-center"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Ziyaret Ekle
                        </button>
                      </div>
                      
                      {selectedReport.visits.length === 0 ? (
                        <p className="text-gray-500 italic mb-4">Henüz ziyaret verisi bulunmamaktadır.</p>
                      ) : (
                        <div className="space-y-4 mb-6">
                          {selectedReport.visits
                            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                            .map((visit, index) => (
                              <div 
                                key={visit.id}
                                className={`border rounded-lg p-4 ${
                                  currentVisit?.id === visit.id 
                                    ? 'border-blue-500 bg-blue-50' 
                                    : 'border-gray-200 hover:border-blue-300'
                                }`}
                              >
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center">
                                    <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs">
                                      {index + 1}
                                    </div>
                                    <h4 className="font-medium text-gray-800">
                                      {new Date(visit.date).toLocaleDateString('tr-TR')}
                                    </h4>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => setCurrentVisit(visit)}
                                      className="text-blue-600 hover:text-blue-800"
                                      title="Ziyaret Detayları"
                                    >
                                      <Eye className="h-5 w-5" />
                                    </button>
                                    <button
                                      onClick={() => handleRemoveVisit(visit.id)}
                                      className="text-red-600 hover:text-red-800"
                                      title="Ziyareti Sil"
                                    >
                                      <Trash2 className="h-5 w-5" />
                                    </button>
                                  </div>
                                </div>
                                
                                <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                                  <div>
                                    <span className="text-gray-500">Ekipman:</span>{' '}
                                    <span className="font-medium">{visit.equipmentData.length}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Aktivite:</span>{' '}
                                    <span className="font-medium">
                                      {visit.equipmentData.filter(eq => eq.activityStatus === 'Aktivite Var').length}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Biyosidal:</span>{' '}
                                    <span className="font-medium">{visit.biocidalProducts.length}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Current Visit Details */}
                    {currentVisit && (
                      <div className="border-t pt-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-bold text-gray-800 flex items-center">
                            <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-2">6</span>
                            Ziyaret Detayı: {new Date(currentVisit.date).toLocaleDateString('tr-TR')}
                          </h3>
                          
                          <button
                            onClick={() => setShowBiocidalForm(true)}
                            className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition-colors text-sm flex items-center"
                          >
                            <Droplets className="h-4 w-4 mr-1" />
                            Biyosidal Ekle
                          </button>
                        </div>
                        
                        {/* Equipment Data */}
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                            <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs">6.1</span>
                            Ekipman Verileri
                          </h4>
                          
                          {currentVisit.equipmentData.length === 0 ? (
                            <p className="text-gray-500 italic">Henüz ekipman verisi bulunmamaktadır.</p>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tür</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Konum</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sayım</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {currentVisit.equipmentData
                                    .sort((a, b) => a.equipmentNumber - b.equipmentNumber)
                                    .map(equipment => (
                                      <tr key={equipment.id}>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                          {equipment.equipmentNumber}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                          {equipment.equipmentType}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                          {equipment.location || <span className="text-gray-400 italic">Konum belirtilmemiş</span>}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm">
                                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            equipment.activityStatus === 'Aktivite Var' 
                                              ? 'bg-red-100 text-red-800' 
                                              : 'bg-green-100 text-green-800'
                                          }`}>
                                            {equipment.activityStatus}
                                          </span>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                          {equipment.equipmentType.toLowerCase().includes('kemirgen') && equipment.rodentCount !== undefined && (
                                            <span>{equipment.rodentCount} kemirgen</span>
                                          )}
                                          {equipment.equipmentType.toLowerCase().includes('hamamböceği') && equipment.insectCount !== undefined && (
                                            <span>{equipment.insectCount} böcek</span>
                                          )}
                                          {equipment.equipmentType.toLowerCase().includes('uçan') && (
                                            <span>
                                              {[
                                                equipment.houseflies ? `${equipment.houseflies} karasinek` : '',
                                                equipment.mosquitoes ? `${equipment.mosquitoes} sivrisinek` : '',
                                                equipment.moths ? `${equipment.moths} güve` : '',
                                                equipment.bees ? `${equipment.bees} arı` : '',
                                                equipment.fruitFlies ? `${equipment.fruitFlies} meyve sineği` : ''
                                              ].filter(Boolean).join(', ') || '0'}
                                              {equipment.uvaPercentage !== undefined && ` (UVA: %${equipment.uvaPercentage})`}
                                            </span>
                                          )}
                                          {equipment.equipmentType.toLowerCase().includes('depo') && (
                                            <span>
                                              {[
                                                equipment.driedFruitMoths ? `${equipment.driedFruitMoths} kuru meyve güvesi` : '',
                                                equipment.flourMoths ? `${equipment.flourMoths} değirmen güvesi` : '',
                                                equipment.clothesMoths ? `${equipment.clothesMoths} elbise güvesi` : '',
                                                equipment.tobaccoMoths ? `${equipment.tobaccoMoths} tütün güvesi` : '',
                                                equipment.otherStoredPests ? `${equipment.otherStoredPests} diğer` : ''
                                              ].filter(Boolean).join(', ') || '0'}
                                            </span>
                                          )}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                          <div className="flex space-x-2">
                                            <button
                                              onClick={() => handleEditVisitEquipment(equipment)}
                                              className="text-blue-600 hover:text-blue-800"
                                              title="Düzenle"
                                            >
                                              <Edit className="h-4 w-4" />
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                        
                        {/* Biocidal Products */}
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                            <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs">6.2</span>
                            Biyosidal Ürünler
                          </h4>
                          
                          {currentVisit.biocidalProducts.length === 0 ? (
                            <p className="text-gray-500 italic">Henüz biyosidal ürün verisi bulunmamaktadır.</p>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün Adı</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aktif Madde</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aktif Oran</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Miktar</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {currentVisit.biocidalProducts.map(product => (
                                    <tr key={product.id}>
                                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {product.productName}
                                      </td>
                                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                        {product.activeIngredient}
                                      </td>
                                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                        %{product.activePercentage}
                                      </td>
                                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                        {product.amountUsed} {product.unit}
                                      </td>
                                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex space-x-2">
                                          <button
                                            onClick={() => handleEditBiocidal(product)}
                                            className="text-blue-600 hover:text-blue-800"
                                            title="Düzenle"
                                          >
                                            <Edit className="h-4 w-4" />
                                          </button>
                                          <button
                                            onClick={() => handleRemoveBiocidal(product.id)}
                                            className="text-red-600 hover:text-red-800"
                                            title="Sil"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                    <BarChart3 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Trend Analiz Raporu Oluşturun</h2>
                    <p className="text-gray-600 mb-6">
                      Zararlı mücadele ekipmanlarının aktivite verilerini takip edin ve trend analizleri oluşturun.
                    </p>
                    <button
                      onClick={() => setShowReportForm(true)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Yeni Rapor Oluştur
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* New Report Modal */}
      {showReportForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Yeni Rapor Oluştur</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Firma Adı
                </label>
                <input
                  type="text"
                  value={newReportData.companyName}
                  onChange={(e) => setNewReportData({ ...newReportData, companyName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Firma adı"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Müşteri Adı
                </label>
                <input
                  type="text"
                  value={newReportData.customerName}
                  onChange={(e) => setNewReportData({ ...newReportData, customerName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Müşteri adı"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowReportForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleCreateReport}
                disabled={!newReportData.companyName || !newReportData.customerName}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Oluştur
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Visit Modal */}
      {showVisitForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Yeni Ziyaret Ekle</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ziyaret Tarihi
                </label>
                <input
                  type="date"
                  value={newVisitData.date}
                  onChange={(e) => setNewVisitData({ ...newVisitData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {selectedReport && selectedReport.equipmentList.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Not:</strong> Bu ziyaret için {selectedReport.equipmentList.length} ekipman otomatik olarak eklenecektir.
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowVisitForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleAddVisit}
                disabled={!newVisitData.date}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Equipment Form Modal */}
      {showEquipmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {isEditing ? 'Ekipman Düzenle' : 'Yeni Ekipman Ekle'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ekipman Numarası
                </label>
                <input
                  type="number"
                  value={newEquipmentData.equipmentNumber}
                  onChange={(e) => setNewEquipmentData({ ...newEquipmentData, equipmentNumber: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ekipman numarası"
                  disabled={isEditing && currentVisit !== null} // Disable if editing a visit's equipment
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ekipman Türü
                </label>
                <select
                  value={newEquipmentData.equipmentType}
                  onChange={(e) => setNewEquipmentData({ ...newEquipmentData, equipmentType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isEditing && currentVisit !== null} // Disable if editing a visit's equipment
                >
                  {equipmentTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Konum
                </label>
                <input
                  type="text"
                  value={newEquipmentData.location}
                  onChange={(e) => setNewEquipmentData({ ...newEquipmentData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ekipman konumu"
                  disabled={isEditing && currentVisit !== null} // Disable if editing a visit's equipment
                />
              </div>
              
              {/* Only show activity status and counts when editing a visit's equipment */}
              {currentVisit && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Aktivite Durumu
                    </label>
                    <select
                      value={newEquipmentData.activityStatus}
                      onChange={(e) => setNewEquipmentData({ 
                        ...newEquipmentData, 
                        activityStatus: e.target.value as 'Aktivite Var' | 'Aktivite Yok' 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Aktivite Yok">Aktivite Yok</option>
                      <option value="Aktivite Var">Aktivite Var</option>
                    </select>
                  </div>
                  
                  {/* Conditional fields based on equipment type */}
                  {newEquipmentData.equipmentType?.toLowerCase().includes('kemirgen') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kemirgen Sayısı
                      </label>
                      <input
                        type="number"
                        value={newEquipmentData.rodentCount}
                        onChange={(e) => setNewEquipmentData({ ...newEquipmentData, rodentCount: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Kemirgen sayısı"
                        min="0"
                      />
                    </div>
                  )}
                  
                  {newEquipmentData.equipmentType?.toLowerCase().includes('hamamböceği') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Böcek Sayısı
                      </label>
                      <input
                        type="number"
                        value={newEquipmentData.insectCount}
                        onChange={(e) => setNewEquipmentData({ ...newEquipmentData, insectCount: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Böcek sayısı"
                        min="0"
                      />
                    </div>
                  )}
                  
                  {newEquipmentData.equipmentType?.toLowerCase().includes('uçan') && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          UVA Lamba Etkinliği (%)
                        </label>
                        <input
                          type="number"
                          value={newEquipmentData.uvaPercentage}
                          onChange={(e) => setNewEquipmentData({ ...newEquipmentData, uvaPercentage: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="UVA yüzdesi"
                          min="0"
                          max="100"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Karasinek Sayısı
                        </label>
                        <input
                          type="number"
                          value={newEquipmentData.houseflies}
                          onChange={(e) => setNewEquipmentData({ ...newEquipmentData, houseflies: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Karasinek sayısı"
                          min="0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sivrisinek Sayısı
                        </label>
                        <input
                          type="number"
                          value={newEquipmentData.mosquitoes}
                          onChange={(e) => setNewEquipmentData({ ...newEquipmentData, mosquitoes: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Sivrisinek sayısı"
                          min="0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Güve Sayısı
                        </label>
                        <input
                          type="number"
                          value={newEquipmentData.moths}
                          onChange={(e) => setNewEquipmentData({ ...newEquipmentData, moths: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Güve sayısı"
                          min="0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Arı Sayısı
                        </label>
                        <input
                          type="number"
                          value={newEquipmentData.bees}
                          onChange={(e) => setNewEquipmentData({ ...newEquipmentData, bees: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Arı sayısı"
                          min="0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Meyve Sineği Sayısı
                        </label>
                        <input
                          type="number"
                          value={newEquipmentData.fruitFlies}
                          onChange={(e) => setNewEquipmentData({ ...newEquipmentData, fruitFlies: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Meyve sineği sayısı"
                          min="0"
                        />
                      </div>
                    </>
                  )}
                  
                  {newEquipmentData.equipmentType?.toLowerCase().includes('depo') && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Kuru Meyve Güvesi
                        </label>
                        <input
                          type="number"
                          value={newEquipmentData.driedFruitMoths}
                          onChange={(e) => setNewEquipmentData({ ...newEquipmentData, driedFruitMoths: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Kuru meyve güvesi sayısı"
                          min="0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Değirmen Güvesi
                        </label>
                        <input
                          type="number"
                          value={newEquipmentData.flourMoths}
                          onChange={(e) => setNewEquipmentData({ ...newEquipmentData, flourMoths: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Değirmen güvesi sayısı"
                          min="0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Elbise Güvesi
                        </label>
                        <input
                          type="number"
                          value={newEquipmentData.clothesMoths}
                          onChange={(e) => setNewEquipmentData({ ...newEquipmentData, clothesMoths: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Elbise güvesi sayısı"
                          min="0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tütün Güvesi
                        </label>
                        <input
                          type="number"
                          value={newEquipmentData.tobaccoMoths}
                          onChange={(e) => setNewEquipmentData({ ...newEquipmentData, tobaccoMoths: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Tütün güvesi sayısı"
                          min="0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Diğer Depo Zararlıları
                        </label>
                        <input
                          type="number"
                          value={newEquipmentData.otherStoredPests}
                          onChange={(e) => setNewEquipmentData({ ...newEquipmentData, otherStoredPests: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Diğer zararlı sayısı"
                          min="0"
                        />
                      </div>
                    </>
                  )}
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notlar
                    </label>
                    <textarea
                      value={newEquipmentData.notes}
                      onChange={(e) => setNewEquipmentData({ ...newEquipmentData, notes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ekipman hakkında notlar"
                      rows={3}
                    />
                  </div>
                </>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEquipmentForm(false);
                  setIsEditing(false);
                  setCurrentEquipment(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={
                  isEditing 
                    ? (currentVisit ? handleUpdateVisitEquipment : handleUpdateEquipment) 
                    : handleAddEquipment
                }
                disabled={!newEquipmentData.equipmentType}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isEditing ? 'Güncelle' : 'Ekle'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Equipment Form Modal */}
      {showBulkEquipmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Toplu Ekipman Ekle</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ekipman Sayısı
                </label>
                <input
                  type="number"
                  value={bulkEquipmentData.count}
                  onChange={(e) => setBulkEquipmentData({ ...bulkEquipmentData, count: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Eklenecek ekipman sayısı"
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ekipman Türü
                </label>
                <select
                  value={bulkEquipmentData.type}
                  onChange={(e) => setBulkEquipmentData({ ...bulkEquipmentData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {equipmentTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Başlangıç Numarası
                </label>
                <input
                  type="number"
                  value={bulkEquipmentData.startNumber}
                  onChange={(e) => setBulkEquipmentData({ ...bulkEquipmentData, startNumber: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ekipman numaralandırma başlangıcı"
                  min="1"
                />
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Not:</strong> {bulkEquipmentData.count} adet {bulkEquipmentData.type} eklenecek. 
                  Numaralandırma {bulkEquipmentData.startNumber}'den başlayacak. 
                  Konum bilgileri boş bırakılacak, daha sonra düzenleyebilirsiniz.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowBulkEquipmentForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleAddBulkEquipment}
                disabled={bulkEquipmentData.count < 1}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Biocidal Product Form Modal */}
      {showBiocidalForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {isEditing ? 'Biyosidal Ürün Düzenle' : 'Yeni Biyosidal Ürün Ekle'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ürün Adı
                </label>
                <input
                  type="text"
                  value={newBiocidalData.productName}
                  onChange={(e) => setNewBiocidalData({ ...newBiocidalData, productName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ürün adı"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aktif Madde
                </label>
                <input
                  type="text"
                  value={newBiocidalData.activeIngredient}
                  onChange={(e) => setNewBiocidalData({ ...newBiocidalData, activeIngredient: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Aktif madde"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aktif Madde Oranı (%)
                </label>
                <input
                  type="number"
                  value={newBiocidalData.activePercentage}
                  onChange={(e) => setNewBiocidalData({ ...newBiocidalData, activePercentage: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Aktif madde oranı"
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kullanılan Miktar
                  </label>
                  <input
                    type="number"
                    value={newBiocidalData.amountUsed}
                    onChange={(e) => setNewBiocidalData({ ...newBiocidalData, amountUsed: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Miktar"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Birim
                  </label>
                  <select
                    value={newBiocidalData.unit}
                    onChange={(e) => setNewBiocidalData({ 
                      ...newBiocidalData, 
                      unit: e.target.value as 'g' | 'ml' | 'kg' | 'l'
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="g">g</option>
                    <option value="ml">ml</option>
                    <option value="kg">kg</option>
                    <option value="l">l</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowBiocidalForm(false);
                  setIsEditing(false);
                  setCurrentBiocidal(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={isEditing ? handleUpdateBiocidal : handleAddBiocidal}
                disabled={!newBiocidalData.productName || !newBiocidalData.activeIngredient || newBiocidalData.amountUsed === undefined}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isEditing ? 'Güncelle' : 'Ekle'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Excel Upload Modal */}
      {showExcelUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Excel ile Ekipman Yükle</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Excel Dosyası
                </label>
                <input
                  type="file"
                  onChange={handleExcelUpload}
                  accept=".xlsx, .xls"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Excel Formatı</h3>
                <p className="text-xs text-blue-700 mb-2">
                  Excel dosyanız aşağıdaki sütunları içerebilir:
                </p>
                <ul className="text-xs text-blue-700 list-disc pl-5 space-y-1">
                  <li>EquipmentNumber: Ekipman numarası (opsiyonel, otomatik atanır)</li>
                  <li>EquipmentType: Ekipman türü</li>
                  <li>Location: Konum (opsiyonel, boş bırakılabilir)</li>
                </ul>
                <p className="text-xs text-blue-700 mt-2">
                  İkinci sayfaya ekipman türlerini ekleyebilirsiniz (EquipmentType sütunu).
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowExcelUpload(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={processExcelFile}
                disabled={!excelFile}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Yükle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-7xl w-full h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Trend Analiz Raporu</h2>
              <div className="flex space-x-3">
                <button
                  onClick={handleExportPDF}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
                >
                  <Download className="h-5 w-5 mr-2" />
                  PDF İndir
                </button>
                <button
                  onClick={handleExportJPEG}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 flex items-center"
                >
                  <Download className="h-5 w-5 mr-2" />
                  JPEG İndir
                </button>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            {renderReport()}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendAnalysisPage;