import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Search, 
  Check, 
  X, 
  FileText, 
  Image, 
  Users, 
  Building, 
  Phone, 
  Mail, 
  Clock, 
  CalendarDays,
  Upload,
  Bug,
  Rat,
  Bird,
  Zap
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface Customer {
  id: string;
  name: string;
  company_name: string;
  address: string | null;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  contract_type: string | null;
  visit_frequency: string;
  visit_count: number;
  start_date: string;
  end_date: string;
  logo_url: string | null;
}

interface Visit {
  id: string;
  customer_id: string;
  date: string;
  visit_type: string;
  notes: string | null;
  status: string;
  technicians: string[];
  pest_types?: string[];
}

interface MonthData {
  name: string;
  shortName: string;
  days: number;
  startDay: number;
}

const VisitCalendarPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showAddVisitModal, setShowAddVisitModal] = useState(false);
  const [showEditCustomerModal, setShowEditCustomerModal] = useState(false);
  const [showEditVisitModal, setShowEditVisitModal] = useState(false);
  const [showDeleteCustomerModal, setShowDeleteCustomerModal] = useState(false);
  const [showDeleteVisitModal, setShowDeleteVisitModal] = useState(false);
  const [showYearlyCalendarModal, setShowYearlyCalendarModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: '',
    company_name: '',
    address: '',
    contact_person: '',
    phone: '',
    email: '',
    contract_type: '',
    visit_frequency: 'monthly',
    visit_count: 12,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
  });
  const [newVisit, setNewVisit] = useState<Partial<Visit>>({
    date: new Date().toISOString().split('T')[0],
    visit_type: 'Rutin Kontrol',
    notes: '',
    status: 'scheduled',
    technicians: [],
    pest_types: []
  });
  const [editCustomer, setEditCustomer] = useState<Partial<Customer>>({});
  const [editVisit, setEditVisit] = useState<Partial<Visit>>({});
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const [visitToDelete, setVisitToDelete] = useState<string | null>(null);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [technician, setTechnician] = useState('');
  const [pestType, setPestType] = useState('');
  const [footerInfo, setFooterInfo] = useState({
    companyName: 'PestMentor',
    companyAddress: 'Kükürtlü Mah. Belde Cad. Gündüz Sok. No:2, Osmangazi, Bursa',
    companyPhone: '0224 233 83 87',
    companyEmail: 'info@pestmentor.com.tr'
  });

  const yearlyCalendarRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      fetchVisits(selectedCustomer.id);
    } else {
      setVisits([]);
    }
  }, [selectedCustomer]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('visit_calendar_customers')
        .select('*')
        .order('company_name');

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVisits = async (customerId: string) => {
    try {
      const { data, error } = await supabase
        .from('visit_calendar_visits')
        .select('*')
        .eq('customer_id', customerId)
        .order('date');

      if (error) throw error;
      setVisits(data || []);
    } catch (error) {
      console.error('Error fetching visits:', error);
    }
  };

  const handleAddCustomer = async () => {
    try {
      let logoUrl = null;
      
      if (logoFile) {
        try {
          const fileExt = logoFile.name.split('.').pop();
          const fileName = `${Date.now()}.${fileExt}`;
          const filePath = `${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(`logos/${filePath}`, logoFile);
            
          if (uploadError) throw uploadError;
          
          const { data } = supabase.storage
            .from('documents')
            .getPublicUrl(`logos/${filePath}`);
            
          logoUrl = data.publicUrl;
        } catch (error) {
          console.error('Error uploading logo:', error);
          alert('Error uploading logo. Please try again.');
          return;
        }
      }
      
      const { data, error } = await supabase
        .from('visit_calendar_customers')
        .insert([{
          ...newCustomer,
          logo_url: logoUrl
        }])
        .select();

      if (error) throw error;
      
      setCustomers([...customers, data[0]]);
      setShowAddCustomerModal(false);
      setNewCustomer({
        name: '',
        company_name: '',
        address: '',
        contact_person: '',
        phone: '',
        email: '',
        contract_type: '',
        visit_frequency: 'monthly',
        visit_count: 12,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
      });
      setLogoFile(null);
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  const handleEditCustomer = async () => {
    if (!selectedCustomer) return;
    
    try {
      let logoUrl = editCustomer.logo_url;
      
      if (logoFile) {
        try {
          const fileExt = logoFile.name.split('.').pop();
          const fileName = `${Date.now()}.${fileExt}`;
          const filePath = `${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(`logos/${filePath}`, logoFile);
            
          if (uploadError) throw uploadError;
          
          const { data } = supabase.storage
            .from('documents')
            .getPublicUrl(`logos/${filePath}`);
            
          logoUrl = data.publicUrl;
        } catch (error) {
          console.error('Error uploading logo:', error);
          alert('Error uploading logo. Please try again.');
          return;
        }
      }
      
      const { error } = await supabase
        .from('visit_calendar_customers')
        .update({
          ...editCustomer,
          logo_url: logoUrl
        })
        .eq('id', selectedCustomer.id);

      if (error) throw error;
      
      fetchCustomers();
      setShowEditCustomerModal(false);
      setEditCustomer({});
      setLogoFile(null);
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return;
    
    try {
      const { error } = await supabase
        .from('visit_calendar_customers')
        .delete()
        .eq('id', customerToDelete);

      if (error) throw error;
      
      setCustomers(customers.filter(c => c.id !== customerToDelete));
      if (selectedCustomer?.id === customerToDelete) {
        setSelectedCustomer(null);
      }
      setShowDeleteCustomerModal(false);
      setCustomerToDelete(null);
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const handleAddVisit = async () => {
    if (!selectedCustomer) return;
    
    try {
      const { data, error } = await supabase
        .from('visit_calendar_visits')
        .insert([{
          ...newVisit,
          customer_id: selectedCustomer.id
        }])
        .select();

      if (error) throw error;
      
      setVisits([...visits, data[0]]);
      setShowAddVisitModal(false);
      setNewVisit({
        date: new Date().toISOString().split('T')[0],
        visit_type: 'Rutin Kontrol',
        notes: '',
        status: 'scheduled',
        technicians: [],
        pest_types: []
      });
    } catch (error) {
      console.error('Error adding visit:', error);
    }
  };

  const handleEditVisit = async () => {
    if (!selectedVisit) return;
    
    try {
      const { error } = await supabase
        .from('visit_calendar_visits')
        .update(editVisit)
        .eq('id', selectedVisit.id);

      if (error) throw error;
      
      fetchVisits(selectedCustomer!.id);
      setShowEditVisitModal(false);
      setEditVisit({});
      setSelectedVisit(null);
    } catch (error) {
      console.error('Error updating visit:', error);
    }
  };

  const handleDeleteVisit = async () => {
    if (!visitToDelete) return;
    
    try {
      const { error } = await supabase
        .from('visit_calendar_visits')
        .delete()
        .eq('id', visitToDelete);

      if (error) throw error;
      
      setVisits(visits.filter(v => v.id !== visitToDelete));
      setShowDeleteVisitModal(false);
      setVisitToDelete(null);
    } catch (error) {
      console.error('Error deleting visit:', error);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const addTechnician = () => {
    if (technician.trim()) {
      if (showAddVisitModal) {
        setNewVisit({
          ...newVisit,
          technicians: [...(newVisit.technicians || []), technician.trim()]
        });
      } else if (showEditVisitModal) {
        setEditVisit({
          ...editVisit,
          technicians: [...(editVisit.technicians || []), technician.trim()]
        });
      }
      setTechnician('');
    }
  };

  const removeTechnician = (index: number) => {
    if (showAddVisitModal) {
      const updatedTechnicians = [...(newVisit.technicians || [])];
      updatedTechnicians.splice(index, 1);
      setNewVisit({
        ...newVisit,
        technicians: updatedTechnicians
      });
    } else if (showEditVisitModal) {
      const updatedTechnicians = [...(editVisit.technicians || [])];
      updatedTechnicians.splice(index, 1);
      setEditVisit({
        ...editVisit,
        technicians: updatedTechnicians
      });
    }
  };

  const addPestType = () => {
    if (pestType.trim()) {
      if (showAddVisitModal) {
        setNewVisit({
          ...newVisit,
          pest_types: [...(newVisit.pest_types || []), pestType.trim()]
        });
      } else if (showEditVisitModal) {
        setEditVisit({
          ...editVisit,
          pest_types: [...(editVisit.pest_types || []), pestType.trim()]
        });
      }
      setPestType('');
    }
  };

  const removePestType = (index: number) => {
    if (showAddVisitModal) {
      const updatedPestTypes = [...(newVisit.pest_types || [])];
      updatedPestTypes.splice(index, 1);
      setNewVisit({
        ...newVisit,
        pest_types: updatedPestTypes
      });
    } else if (showEditVisitModal) {
      const updatedPestTypes = [...(editVisit.pest_types || [])];
      updatedPestTypes.splice(index, 1);
      setEditVisit({
        ...editVisit,
        pest_types: updatedPestTypes
      });
    }
  };

  const getVisitFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'monthly': return 'Aylık';
      case 'bimonthly': return '2 Aylık';
      case 'quarterly': return '3 Aylık';
      case 'semiannual': return '6 Aylık';
      case 'annual': return 'Yıllık';
      case 'custom': return 'Özel';
      default: return frequency;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Planlandı';
      case 'completed': return 'Tamamlandı';
      case 'cancelled': return 'İptal Edildi';
      default: return status;
    }
  };

  const generateYearlyCalendar = () => {
    const months: MonthData[] = [
      { name: 'OCAK', shortName: 'Oca', days: 31, startDay: new Date(year, 0, 1).getDay() },
      { name: 'ŞUBAT', shortName: 'Şub', days: (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28, startDay: new Date(year, 1, 1).getDay() },
      { name: 'MART', shortName: 'Mar', days: 31, startDay: new Date(year, 2, 1).getDay() },
      { name: 'NİSAN', shortName: 'Nis', days: 30, startDay: new Date(year, 3, 1).getDay() },
      { name: 'MAYIS', shortName: 'May', days: 31, startDay: new Date(year, 4, 1).getDay() },
      { name: 'HAZİRAN', shortName: 'Haz', days: 30, startDay: new Date(year, 5, 1).getDay() },
      { name: 'TEMMUZ', shortName: 'Tem', days: 31, startDay: new Date(year, 6, 1).getDay() },
      { name: 'AĞUSTOS', shortName: 'Ağu', days: 31, startDay: new Date(year, 7, 1).getDay() },
      { name: 'EYLÜL', shortName: 'Eyl', days: 30, startDay: new Date(year, 8, 1).getDay() },
      { name: 'EKİM', shortName: 'Eki', days: 31, startDay: new Date(year, 9, 1).getDay() },
      { name: 'KASIM', shortName: 'Kas', days: 30, startDay: new Date(year, 10, 1).getDay() },
      { name: 'ARALIK', shortName: 'Ara', days: 31, startDay: new Date(year, 11, 1).getDay() }
    ];

    return (
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-pest-green-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">{year} Yılı Ziyaret Takvimi</h2>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setYear(year - 1)}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              {year - 1}
            </button>
            <span className="font-bold">{year}</span>
            <button
              onClick={() => setYear(year + 1)}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              {year + 1}
            </button>
          </div>
        </div>

        {selectedCustomer && (
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800">{selectedCustomer.company_name}</h3>
              <p className="text-gray-600">{getVisitFrequencyText(selectedCustomer.visit_frequency)} Ziyaret - Toplam {selectedCustomer.visit_count} Ziyaret</p>
              <p className="text-gray-600">Sözleşme: {new Date(selectedCustomer.start_date).toLocaleDateString('tr-TR')} - {new Date(selectedCustomer.end_date).toLocaleDateString('tr-TR')}</p>
            </div>
            {selectedCustomer.logo_url && (
              <img 
                src={selectedCustomer.logo_url} 
                alt={`${selectedCustomer.company_name} Logo`} 
                className="h-16 object-contain"
              />
            )}
          </div>
        )}

        <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
          {months.map((month, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <div className="bg-pest-green-600 text-white p-2 text-center font-bold">
                {month.name}
              </div>
              <div className="p-2">
                <div className="grid grid-cols-7 gap-1 text-center text-xs mb-1">
                  <div>Pt</div>
                  <div>Sa</div>
                  <div>Ça</div>
                  <div>Pe</div>
                  <div>Cu</div>
                  <div>Ct</div>
                  <div>Pa</div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {Array.from({ length: month.startDay === 0 ? 6 : month.startDay - 1 }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-6"></div>
                  ))}
                  {Array.from({ length: month.days }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${year}-${String(index + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dayVisits = visits.filter(v => v.date === dateStr);
                    
                    return (
                      <div 
                        key={`day-${day}`} 
                        className={`h-6 flex items-center justify-center rounded-full ${
                          dayVisits.length > 0 
                            ? 'bg-pest-green-600 text-white font-bold' 
                            : ''
                        }`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Planlanan Ziyaretler</h3>
          <div className="space-y-4">
            {visits.filter(v => new Date(v.date).getFullYear() === year).map((visit, index) => {
              const visitDate = new Date(visit.date);
              const monthName = months[visitDate.getMonth()].name;
              const day = visitDate.getDate();
              
              return (
                <div key={visit.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-2">
                        <Calendar className="h-5 w-5 text-pest-green-600 mr-2" />
                        <span className="font-bold text-gray-800">
                          {day} {monthName} ZİYARETİ
                        </span>
                        <span className={`ml-3 px-2 py-1 text-xs rounded-full ${getStatusColor(visit.status)}`}>
                          {getStatusText(visit.status)}
                        </span>
                      </div>
                      <div className="text-gray-700 mb-2">
                        <span className="font-bold">{selectedCustomer?.company_name}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-gray-600">Teknisyenler: {visit.technicians?.join(', ') || 'Belirtilmemiş'}</span>
                        </div>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-gray-600">Ziyaret Türü: {visit.visit_type}</span>
                        </div>
                        {visit.pest_types && visit.pest_types.length > 0 && (
                          <div className="flex items-center md:col-span-2">
                            <Bug className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-gray-600">Zararlı Türleri: {visit.pest_types.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer with company and customer information */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-gray-800 mb-2">Şirket Bilgileri</h4>
              <div className="space-y-1 text-sm">
                <p className="text-gray-600">{footerInfo.companyName}</p>
                <p className="text-gray-600">{footerInfo.companyAddress}</p>
                <p className="text-gray-600">Tel: {footerInfo.companyPhone}</p>
                <p className="text-gray-600">E-posta: {footerInfo.companyEmail}</p>
              </div>
            </div>
            
            {selectedCustomer && (
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Müşteri Bilgileri</h4>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-600">{selectedCustomer.company_name}</p>
                  {selectedCustomer.contact_person && (
                    <p className="text-gray-600">İlgili Kişi: {selectedCustomer.contact_person}</p>
                  )}
                  {selectedCustomer.address && (
                    <p className="text-gray-600">Adres: {selectedCustomer.address}</p>
                  )}
                  {selectedCustomer.phone && (
                    <p className="text-gray-600">Tel: {selectedCustomer.phone}</p>
                  )}
                  {selectedCustomer.email && (
                    <p className="text-gray-600">E-posta: {selectedCustomer.email}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const exportToJPEG = async () => {
    if (!yearlyCalendarRef.current) return;
    
    try {
      // Set a loading state or indicator here if needed
      
      // Use html2canvas to capture the entire calendar
      const canvas = await html2canvas(yearlyCalendarRef.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // Enable CORS for images
        allowTaint: true, // Allow tainted canvas
        backgroundColor: '#ffffff', // White background
        logging: false, // Disable logging
        windowWidth: yearlyCalendarRef.current.scrollWidth,
        windowHeight: yearlyCalendarRef.current.scrollHeight
      });
      
      // Convert canvas to JPEG
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // Create a download link
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `${selectedCustomer?.company_name || 'Ziyaret'}_Takvimi_${year}.jpeg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Error exporting to JPEG:', error);
      alert('JPEG dışa aktarma sırasında bir hata oluştu.');
    }
  };

  const exportToPDF = async () => {
    if (!yearlyCalendarRef.current) return;
    
    try {
      const canvas = await html2canvas(yearlyCalendarRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 277;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 10, 10, imgWidth, imgHeight);
      pdf.save(`${selectedCustomer?.company_name || 'Ziyaret'}_Takvimi_${year}.pdf`);
      
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('PDF dışa aktarma sırasında bir hata oluştu.');
    }
  };

  const filteredCustomers = customers.filter(customer => 
    customer.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pest-green-700"></div>
      </div>
    );
  }

  return (
    <div className="pt-8 pb-16">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <CalendarDays className="h-12 w-12 text-blue-600 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              Ziyaret Takvimi
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Müşterileriniz için yıllık ilaçlama ziyaret takvimi oluşturun ve takip edin.
            Ziyaretleri planlayın, düzenleyin ve raporlayın.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <Calendar className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-800">Müşteri Ziyaret Takvimi</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowAddCustomerModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="h-5 w-5 mr-1" />
                Yeni Müşteri
              </button>
              {selectedCustomer && (
                <>
                  <button
                    onClick={() => setShowAddVisitModal(true)}
                    className="bg-pest-green-600 text-white px-4 py-2 rounded-lg hover:bg-pest-green-700 transition-colors flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-1" />
                    Ziyaret Ekle
                  </button>
                  <button
                    onClick={() => {
                      setShowYearlyCalendarModal(true);
                    }}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                  >
                    <CalendarDays className="h-5 w-5 mr-1" />
                    Yıllık Takvim
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Customer List */}
            <div className="w-full md:w-1/3 lg:w-1/4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Müşteri ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {filteredCustomers.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">Müşteri bulunamadı</p>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <div
                        key={customer.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedCustomer?.id === customer.id
                            ? 'bg-blue-100 border border-blue-300'
                            : 'bg-white border border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium text-gray-800">{customer.company_name}</h3>
                            <p className="text-sm text-gray-600">{getVisitFrequencyText(customer.visit_frequency)}</p>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditCustomer(customer);
                                setShowEditCustomerModal(true);
                              }}
                              className="p-1 text-gray-500 hover:text-blue-600"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCustomerToDelete(customer.id);
                                setShowDeleteCustomerModal(true);
                              }}
                              className="p-1 text-gray-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Visit Calendar */}
            <div className="w-full md:w-2/3 lg:w-3/4">
              {selectedCustomer ? (
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{selectedCustomer.company_name}</h3>
                      <p className="text-gray-600">{getVisitFrequencyText(selectedCustomer.visit_frequency)} - {selectedCustomer.visit_count} ziyaret/yıl</p>
                    </div>
                    {selectedCustomer.logo_url && (
                      <img 
                        src={selectedCustomer.logo_url} 
                        alt={`${selectedCustomer.company_name} Logo`} 
                        className="h-12 object-contain"
                      />
                    )}
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-800 mb-2">Müşteri Bilgileri</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-start">
                        <Building className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-gray-600">Şirket: {selectedCustomer.company_name}</p>
                          <p className="text-gray-600">İlgili Kişi: {selectedCustomer.contact_person || 'Belirtilmemiş'}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Phone className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-gray-600">Telefon: {selectedCustomer.phone || 'Belirtilmemiş'}</p>
                          <p className="text-gray-600">E-posta: {selectedCustomer.email || 'Belirtilmemiş'}</p>
                        </div>
                      </div>
                      <div className="flex items-start md:col-span-2">
                        <Mail className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-gray-600">Adres: {selectedCustomer.address || 'Belirtilmemiş'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-800 mb-2">Sözleşme Bilgileri</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-2" />
                        <p className="text-gray-600">Sözleşme Türü: {selectedCustomer.contract_type || 'Belirtilmemiş'}</p>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-gray-400 mr-2" />
                        <p className="text-gray-600">Başlangıç: {new Date(selectedCustomer.start_date).toLocaleDateString('tr-TR')}</p>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-gray-400 mr-2" />
                        <p className="text-gray-600">Bitiş: {new Date(selectedCustomer.end_date).toLocaleDateString('tr-TR')}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Ziyaretler</h4>
                    {visits.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">Henüz ziyaret planlanmamış</p>
                    ) : (
                      <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {visits.map((visit) => (
                          <div key={visit.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center mb-1">
                                  <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                                  <span className="font-medium text-gray-800">
                                    {new Date(visit.date).toLocaleDateString('tr-TR')}
                                  </span>
                                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getStatusColor(visit.status)}`}>
                                    {getStatusText(visit.status)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">
                                  <span className="font-medium">Ziyaret Türü:</span> {visit.visit_type}
                                </p>
                                {visit.technicians && visit.technicians.length > 0 && (
                                  <p className="text-sm text-gray-600 mb-1">
                                    <span className="font-medium">Teknisyenler:</span> {visit.technicians.join(', ')}
                                  </p>
                                )}
                                {visit.pest_types && visit.pest_types.length > 0 && (
                                  <p className="text-sm text-gray-600 mb-1">
                                    <span className="font-medium">Zararlı Türleri:</span> {visit.pest_types.join(', ')}
                                  </p>
                                )}
                                {visit.notes && (
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Notlar:</span> {visit.notes}
                                  </p>
                                )}
                              </div>
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => {
                                    setSelectedVisit(visit);
                                    setEditVisit(visit);
                                    setShowEditVisitModal(true);
                                  }}
                                  className="p-1 text-gray-500 hover:text-blue-600"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setVisitToDelete(visit.id);
                                    setShowDeleteVisitModal(true);
                                  }}
                                  className="p-1 text-gray-500 hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Müşteri Seçilmedi</h3>
                  <p className="text-gray-500 mb-4">Ziyaret takvimini görüntülemek için sol taraftan bir müşteri seçin veya yeni müşteri ekleyin.</p>
                  <button
                    onClick={() => setShowAddCustomerModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-1" />
                    Yeni Müşteri Ekle
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Yeni Müşteri Ekle</h3>
              <button
                onClick={() => setShowAddCustomerModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Müşteri Adı
                </label>
                <input
                  type="text"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Şirket Adı
                </label>
                <input
                  type="text"
                  value={newCustomer.company_name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, company_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  İlgili Kişi
                </label>
                <input
                  type="text"
                  value={newCustomer.contact_person || ''}
                  onChange={(e) => setNewCustomer({ ...newCustomer, contact_person: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon
                </label>
                <input
                  type="text"
                  value={newCustomer.phone || ''}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta
                </label>
                <input
                  type="email"
                  value={newCustomer.email || ''}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sözleşme Türü
                </label>
                <input
                  type="text"
                  value={newCustomer.contract_type || ''}
                  onChange={(e) => setNewCustomer({ ...newCustomer, contract_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adres
                </label>
                <textarea
                  value={newCustomer.address || ''}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ziyaret Sıklığı
                </label>
                <select
                  value={newCustomer.visit_frequency}
                  onChange={(e) => setNewCustomer({ ...newCustomer, visit_frequency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="monthly">Aylık</option>
                  <option value="bimonthly">2 Aylık</option>
                  <option value="quarterly">3 Aylık</option>
                  <option value="semiannual">6 Aylık</option>
                  <option value="annual">Yıllık</option>
                  <option value="custom">Özel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yıllık Ziyaret Sayısı
                </label>
                <input
                  type="number"
                  value={newCustomer.visit_count}
                  onChange={(e) => setNewCustomer({ ...newCustomer, visit_count: parseInt(e.target.value) })}
                  min={1}
                  max={52}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Başlangıç Tarihi
                </label>
                <input
                  type="date"
                  value={newCustomer.start_date}
                  onChange={(e) => setNewCustomer({ ...newCustomer, start_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bitiş Tarihi
                </label>
                <input
                  type="date"
                  value={newCustomer.end_date}
                  onChange={(e) => setNewCustomer({ ...newCustomer, end_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                    <Upload className="h-5 w-5" />
                    <span>Logo Yükle</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  {logoFile && (
                    <span className="text-sm text-gray-600">{logoFile.name}</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddCustomerModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleAddCustomer}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {showEditCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Müşteri Düzenle</h3>
              <button
                onClick={() => setShowEditCustomerModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Müşteri Adı
                </label>
                <input
                  type="text"
                  value={editCustomer.name || ''}
                  onChange={(e) => setEditCustomer({ ...editCustomer, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Şirket Adı
                </label>
                <input
                  type="text"
                  value={editCustomer.company_name || ''}
                  onChange={(e) => setEditCustomer({ ...editCustomer, company_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  İlgili Kişi
                </label>
                <input
                  type="text"
                  value={editCustomer.contact_person || ''}
                  onChange={(e) => setEditCustomer({ ...editCustomer, contact_person: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon
                </label>
                <input
                  type="text"
                  value={editCustomer.phone || ''}
                  onChange={(e) => setEditCustomer({ ...editCustomer, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta
                </label>
                <input
                  type="email"
                  value={editCustomer.email || ''}
                  onChange={(e) => setEditCustomer({ ...editCustomer, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sözleşme Türü
                </label>
                <input
                  type="text"
                  value={editCustomer.contract_type || ''}
                  onChange={(e) => setEditCustomer({ ...editCustomer, contract_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adres
                </label>
                <textarea
                  value={editCustomer.address || ''}
                  onChange={(e) => setEditCustomer({ ...editCustomer, address: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ziyaret Sıklığı
                </label>
                <select
                  value={editCustomer.visit_frequency || 'monthly'}
                  onChange={(e) => setEditCustomer({ ...editCustomer, visit_frequency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="monthly">Aylık</option>
                  <option value="bimonthly">2 Aylık</option>
                  <option value="quarterly">3 Aylık</option>
                  <option value="semiannual">6 Aylık</option>
                  <option value="annual">Yıllık</option>
                  <option value="custom">Özel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yıllık Ziyaret Sayısı
                </label>
                <input
                  type="number"
                  value={editCustomer.visit_count || 12}
                  onChange={(e) => setEditCustomer({ ...editCustomer, visit_count: parseInt(e.target.value) })}
                  min={1}
                  max={52}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Başlangıç Tarihi
                </label>
                <input
                  type="date"
                  value={editCustomer.start_date || ''}
                  onChange={(e) => setEditCustomer({ ...editCustomer, start_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bitiş Tarihi
                </label>
                <input
                  type="date"
                  value={editCustomer.end_date || ''}
                  onChange={(e) => setEditCustomer({ ...editCustomer, end_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                    <Upload className="h-5 w-5" />
                    <span>Logo Yükle</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  {logoFile && (
                    <span className="text-sm text-gray-600">{logoFile.name}</span>
                  )}
                  {!logoFile && editCustomer.logo_url && (
                    <div className="flex items-center">
                      <img 
                        src={editCustomer.logo_url} 
                        alt="Current Logo" 
                        className="h-8 object-contain mr-2"
                      />
                      <span className="text-sm text-gray-600">Mevcut Logo</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowEditCustomerModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleEditCustomer}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Güncelle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Visit Modal */}
      {showAddVisitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Yeni Ziyaret Ekle</h3>
              <button
                onClick={() => setShowAddVisitModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ziyaret Tarihi
                </label>
                <input
                  type="date"
                  value={newVisit.date}
                  onChange={(e) => setNewVisit({ ...newVisit, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ziyaret Türü
                </label>
                <select
                  value={newVisit.visit_type}
                  onChange={(e) => setNewVisit({ ...newVisit, visit_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Rutin Kontrol">Rutin Kontrol</option>
                  <option value="Periyodik İlaçlama">Periyodik İlaçlama</option>
                  <option value="Acil Müdahale">Acil Müdahale</option>
                  <option value="Takip Ziyareti">Takip Ziyareti</option>
                  <option value="Şikayet Değerlendirme">Şikayet Değerlendirme</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durum
                </label>
                <select
                  value={newVisit.status}
                  onChange={(e) => setNewVisit({ ...newVisit, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="scheduled">Planlandı</option>
                  <option value="completed">Tamamlandı</option>
                  <option value="cancelled">İptal Edildi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teknisyenler
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={technician}
                    onChange={(e) => setTechnician(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Teknisyen adı"
                  />
                  <button
                    type="button"
                    onClick={addTechnician}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Ekle
                  </button>
                </div>
                {newVisit.technicians && newVisit.technicians.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {newVisit.technicians.map((tech, index) => (
                      <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
                        <span>{tech}</span>
                        <button
                          type="button"
                          onClick={() => removeTechnician(index)}
                          className="ml-1 text-blue-800 hover:text-blue-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zararlı Türleri
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={pestType}
                    onChange={(e) => setPestType(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Zararlı türü"
                  />
                  <button
                    type="button"
                    onClick={addPestType}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Ekle
                  </button>
                </div>
                {newVisit.pest_types && newVisit.pest_types.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {newVisit.pest_types.map((type, index) => (
                      <div key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center">
                        <span>{type}</span>
                        <button
                          type="button"
                          onClick={() => removePestType(index)}
                          className="ml-1 text-green-800 hover:text-green-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notlar
                </label>
                <textarea
                  value={newVisit.notes || ''}
                  onChange={(e) => setNewVisit({ ...newVisit, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddVisitModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleAddVisit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Visit Modal */}
      {showEditVisitModal && selectedVisit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Ziyaret Düzenle</h3>
              <button
                onClick={() => setShowEditVisitModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ziyaret Tarihi
                </label>
                <input
                  type="date"
                  value={editVisit.date || ''}
                  onChange={(e) => setEditVisit({ ...editVisit, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ziyaret Türü
                </label>
                <select
                  value={editVisit.visit_type || ''}
                  onChange={(e) => setEditVisit({ ...editVisit, visit_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Rutin Kontrol">Rutin Kontrol</option>
                  <option value="Periyodik İlaçlama">Periyodik İlaçlama</option>
                  <option value="Acil Müdahale">Acil Müdahale</option>
                  <option value="Takip Ziyareti">Takip Ziyareti</option>
                  <option value="Şikayet Değerlendirme">Şikayet Değerlendirme</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durum
                </label>
                <select
                  value={editVisit.status || ''}
                  onChange={(e) => setEditVisit({ ...editVisit, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="scheduled">Planlandı</option>
                  <option value="completed">Tamamlandı</option>
                  <option value="cancelled">İptal Edildi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teknisyenler
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={technician}
                    onChange={(e) => setTechnician(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Teknisyen adı"
                  />
                  <button
                    type="button"
                    onClick={addTechnician}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Ekle
                  </button>
                </div>
                {editVisit.technicians && editVisit.technicians.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {editVisit.technicians.map((tech, index) => (
                      <div key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
                        <span>{tech}</span>
                        <button
                          type="button"
                          onClick={() => removeTechnician(index)}
                          className="ml-1 text-blue-800 hover:text-blue-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zararlı Türleri
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={pestType}
                    onChange={(e) => setPestType(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Zararlı türü"
                  />
                  <button
                    type="button"
                    onClick={addPestType}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Ekle
                  </button>
                </div>
                {editVisit.pest_types && editVisit.pest_types.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {editVisit.pest_types.map((type, index) => (
                      <div key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center">
                        <span>{type}</span>
                        <button
                          type="button"
                          onClick={() => removePestType(index)}
                          className="ml-1 text-green-800 hover:text-green-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notlar
                </label>
                <textarea
                  value={editVisit.notes || ''}
                  onChange={(e) => setEditVisit({ ...editVisit, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowEditVisitModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleEditVisit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Güncelle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Customer Confirmation Modal */}
      {showDeleteCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center mb-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Müşteriyi Sil</h3>
              <p className="text-sm text-gray-500 mt-2">
                Bu müşteriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve tüm ziyaret kayıtları da silinecektir.
              </p>
            </div>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setShowDeleteCustomerModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleDeleteCustomer}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Visit Confirmation Modal */}
      {showDeleteVisitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center mb-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Ziyareti Sil</h3>
              <p className="text-sm text-gray-500 mt-2">
                Bu ziyareti silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
              </p>
            </div>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setShowDeleteVisitModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleDeleteVisit}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Yearly Calendar Modal */}
      {showYearlyCalendarModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-7xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Yıllık Ziyaret Takvimi</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={exportToJPEG}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Image className="h-5 w-5 mr-1" />
                  JPEG İndir
                </button>
                <button
                  onClick={exportToPDF}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                >
                  <FileText className="h-5 w-5 mr-1" />
                  PDF İndir
                </button>
                <button
                  onClick={() => setShowYearlyCalendarModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div ref={yearlyCalendarRef} className="bg-white p-6">
              {generateYearlyCalendar()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitCalendarPage;