import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Wind,
  Factory,
  Home,
  Wheat,
  Trash2,
  Droplets,
  CheckCircle,
  X,
  Download,
  Building,
  Calendar,
  User,
  FileText,
  Mail,
  Phone
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const LocationAnalysisPage = () => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    assessorCompany: 'PestMentor',
    assessorName: '',
    clientCompany: '',
    clientName: '',
    assessmentDate: new Date().toISOString().split('T')[0],
    factoryAddress: '',
    factoryCoordinates: '',
    logoUrl: ''
  });

  // Location analysis items state
  const [locationFactors, setLocationFactors] = useState<{
    [category: string]: {
      title: string;
      items: {
        id: string;
        text: string;
        status: 'positive' | 'negative' | 'neutral' | null;
        notes: string;
      }[];
    };
  }>({
    'environmental': {
      title: 'Çevresel Faktörler',
      items: [
        { id: 'env1', text: 'Hakim rüzgar yönü', status: null, notes: '' },
        { id: 'env2', text: 'Yakınlardaki su kaynakları (nehir, göl vb.)', status: null, notes: '' },
        { id: 'env3', text: 'Bölgedeki genel hava kalitesi', status: null, notes: '' },
      ]
    },
    'neighbors': {
      title: 'Komşu Yapılanma',
      items: [
        { id: 'nei1', text: 'Komşu işletmelerin sektörü ve faaliyetleri', status: null, notes: '' },
        { id: 'nei2', text: 'Yakınlardaki konut alanlarının mesafesi', status: null, notes: '' },
        { id: 'nei3', text: 'Bölgedeki altyapı durumu (yol, kanalizasyon)', status: null, notes: '' },
      ]
    },
    'landUse': {
      title: 'Arazi Kullanımı',
      items: [
        { id: 'land1', text: 'Tarım arazilerine yakınlık', status: null, notes: '' },
        { id: 'land2', text: 'Tesisin sanayi bölgesi içinde yer alması', status: null, notes: '' },
        { id: 'land3', text: 'Yakınlardaki ormanlık veya doğal yaşam alanları', status: null, notes: '' },
      ]
    },
    'risks': {
      title: 'Potansiyel Riskler',
      items: [
        { id: 'risk1', text: 'Çöp veya atık depolama alanlarına yakınlık', status: null, notes: '' },
        { id: 'risk2', text: 'Sel, taşkın veya heyelan riski olan bölgelere yakınlık', status: null, notes: '' },
        { id: 'risk3', text: 'Yüksek riskli (kimyasal vb.) tesislere yakınlık', status: null, notes: '' },
      ]
    }
  });

  // Predefined factors for quick add
  const predefinedFactors = {
    'Çevresel Faktörler': [
      'Hakim rüzgar yönü',
      'Yakınlardaki su kaynakları (nehir, göl vb.)',
      'Bölgedeki genel hava kalitesi',
      'Toz ve emisyon kaynaklarına yakınlık',
    ],
    'Komşu Yapılanma': [
      'Komşu işletmelerin sektörü ve faaliyetleri',
      'Yakınlardaki konut alanlarının mesafesi',
      'Bölgedeki altyapı durumu (yol, kanalizasyon)',
      'Okul, hastane gibi hassas binalara yakınlık',
    ],
    'Arazi Kullanımı': [
      'Tarım arazilerine yakınlık',
      'Tesisin sanayi bölgesi içinde yer alması',
      'Yakınlardaki ormanlık veya doğal yaşam alanları',
      'Tarihi veya koruma altındaki alanlara yakınlık',
    ],
    'Potansiyel Riskler': [
      'Çöp veya atık depolama alanlarına yakınlık',
      'Sel, taşkın veya heyelan riski olan bölgelere yakınlık',
      'Yüksek riskli (kimyasal vb.) tesislere yakınlık',
      'Yoğun trafikli yollara yakınlık ve kaza riski',
    ]
  };

  // Calculate overall risk score
  const calculateRiskScore = () => {
    let totalItems = 0;
    let negativeItems = 0;

    Object.values(locationFactors).forEach(category => {
      category.items.forEach(item => {
        if (item.status !== null) {
          totalItems++;
          if (item.status === 'negative') {
            negativeItems++;
          }
        }
      });
    });

    return totalItems > 0 ? Math.round((negativeItems / totalItems) * 100) : 0;
  };

  const riskScore = calculateRiskScore();

  const getRiskLevel = (score: number) => {
    if (score > 60) return { label: 'Yüksek Risk', color: 'text-red-600' };
    if (score > 30) return { label: 'Orta Risk', color: 'text-orange-600' };
    return { label: 'Düşük Risk', color: 'text-green-600' };
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle factor item changes
  const handleFactorChange = (category: string, id: string, field: 'status' | 'notes', value: any) => {
    setLocationFactors(prev => {
      const newFactors = { ...prev };
      const itemIndex = newFactors[category].items.findIndex(item => item.id === id);
      if (itemIndex !== -1) {
        newFactors[category].items[itemIndex] = {
          ...newFactors[category].items[itemIndex],
          [field]: value
        };
      }
      return newFactors;
    });
  };

  // Add a new category
  const addCategory = () => {
    const newCategoryId = `category${Object.keys(locationFactors).length + 1}`;
    setLocationFactors(prev => ({
      ...prev,
      [newCategoryId]: {
        title: `Yeni Kategori ${Object.keys(prev).length + 1}`,
        items: []
      }
    }));
  };
  
  // Update category title
  const updateCategoryTitle = (categoryId: string, newTitle: string) => {
    setLocationFactors(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        title: newTitle
      }
    }));
  };

  // Add a new factor to a category
  const addFactor = (categoryId: string, text: string = '') => {
    setLocationFactors(prev => {
      const newFactors = { ...prev };
      const newFactorId = `${categoryId}_item${newFactors[categoryId].items.length + 1}`;
      newFactors[categoryId].items.push({
        id: newFactorId,
        text: text || `Yeni faktör ${newFactors[categoryId].items.length + 1}`,
        status: null,
        notes: ''
      });
      return newFactors;
    });
  };
  
  // Remove a factor
  const removeFactor = (categoryId: string, itemId: string) => {
    setLocationFactors(prev => {
      const newFactors = { ...prev };
      newFactors[categoryId].items = newFactors[categoryId].items.filter(item => item.id !== itemId);
      return newFactors;
    });
  };

  // Remove a category
  const removeCategory = (categoryId: string) => {
    setLocationFactors(prev => {
      const newFactors = { ...prev };
      delete newFactors[categoryId];
      return newFactors;
    });
  };

  // Add predefined factors
  const addPredefinedFactors = (categoryId: string, categoryTitle: string) => {
    const factorsToAdd = predefinedFactors[categoryTitle as keyof typeof predefinedFactors];
    if (factorsToAdd) {
      factorsToAdd.forEach(factorText => {
        addFactor(categoryId, factorText);
      });
    }
  };

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData(prev => ({ ...prev, logoUrl: event.target?.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate PDF report
  const generatePDF = async () => {
    if (!reportRef.current) return;
    setLoading(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Konum_Analizi_${formData.clientCompany}_${formData.assessmentDate}.pdf`);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('PDF oluşturulurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Generate JPEG image
  const generateJPEG = async () => {
    if (!reportRef.current) return;
    setLoading(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `Konum_Analizi_${formData.clientCompany}_${formData.assessmentDate}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('JPEG generation error:', error);
      alert('JPEG oluşturulurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: 'positive' | 'negative' | 'neutral' | null) => {
    switch (status) {
      case 'positive':
        return <CheckCircle size={14} />;
      case 'negative':
        return <X size={14} />;
      default:
        return <span className="text-xs">?</span>;
    }
  };

  const getStatusColor = (status: 'positive' | 'negative' | 'neutral' | null) => {
    switch (status) {
      case 'positive':
        return 'bg-green-500 text-white';
      case 'negative':
        return 'bg-red-500 text-white';
      case 'neutral':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form Section */}
        <div className="lg:w-1/3 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Konum Analiz Formu</h2>
            
            <div className="space-y-4 mb-6">
              {/* Assessor and Client Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Müşteri Firma</label>
                <input
                  type="text"
                  name="clientCompany"
                  value={formData.clientCompany}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Müşteri firma adı"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fabrika Adresi</label>
                <input
                  type="text"
                  name="factoryAddress"
                  value={formData.factoryAddress}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Fabrikanın açık adresi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Koordinatlar (Opsiyonel)</label>
                <input
                  type="text"
                  name="factoryCoordinates"
                  value={formData.factoryCoordinates}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Örn: 40.1234, 29.5678"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Değerlendirme Tarihi</label>
                <input
                  type="date"
                  name="assessmentDate"
                  value={formData.assessmentDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo Yükle</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          </div>

          {/* Categories and Factors Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Analiz Kategorileri</h2>
              <button
                onClick={addCategory}
                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors text-sm"
              >
                + Kategori Ekle
              </button>
            </div>
            
            <div className="space-y-6">
              {Object.entries(locationFactors).map(([categoryId, category]) => (
                <div key={categoryId} className="border border-gray-200 rounded-md p-4">
                  <div className="flex justify-between items-center mb-3">
                    <input
                      type="text"
                      value={category.title}
                      onChange={(e) => updateCategoryTitle(categoryId, e.target.value)}
                      className="font-semibold text-gray-800 border-b border-dashed border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                    />
                    <button
                      onClick={() => removeCategory(categoryId)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    {category.items.map((item) => (
                      <div key={item.id} className="flex items-start space-x-2">
                        <div className="flex space-x-1 mt-1">
                          <button onClick={() => handleFactorChange(categoryId, item.id, 'status', 'positive')} className={`w-6 h-6 rounded-full flex items-center justify-center ${item.status === 'positive' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}><CheckCircle size={14} /></button>
                          <button onClick={() => handleFactorChange(categoryId, item.id, 'status', 'negative')} className={`w-6 h-6 rounded-full flex items-center justify-center ${item.status === 'negative' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}><X size={14} /></button>
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={item.text}
                            onChange={(e) => {
                                const newItems = [...category.items];
                                const index = newItems.findIndex(i => i.id === item.id);
                                newItems[index] = { ...newItems[index], text: e.target.value };
                                setLocationFactors(prev => ({
                                  ...prev,
                                  [categoryId]: { ...prev[categoryId], items: newItems }
                                }));
                            }}
                            className="w-full text-sm text-gray-700 border-b border-dashed border-gray-200 focus:outline-none focus:border-blue-500"
                          />
                          <input
                            type="text"
                            value={item.notes}
                            onChange={(e) => handleFactorChange(categoryId, item.id, 'notes', e.target.value)}
                            placeholder="Not ekle..."
                            className="w-full text-xs text-gray-500 mt-1 focus:outline-none"
                          />
                        </div>
                        <button
                          onClick={() => removeFactor(categoryId, item.id)}
                          className="text-red-500 hover:text-red-700 mt-1"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button onClick={() => addFactor(categoryId)} className="text-sm text-blue-500 hover:text-blue-700">
                      + Faktör Ekle
                    </button>
                    <div className="relative group">
                      <button className="text-sm text-green-500 hover:text-green-700">
                        + Hazır Faktörler
                      </button>
                      <div className="absolute left-0 mt-2 w-64 bg-white shadow-lg rounded-md p-2 hidden group-hover:block z-10">
                        {predefinedFactors[category.title as keyof typeof predefinedFactors] ? (
                          predefinedFactors[category.title as keyof typeof predefinedFactors].map((factor, index) => (
                            <button
                              key={index}
                              onClick={() => addFactor(categoryId, factor)}
                              className="block w-full text-left text-xs py-1 px-2 hover:bg-gray-100 rounded"
                            >
                              {factor}
                            </button>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500 p-2">Bu kategori için hazır faktör yok.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Buttons */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Rapor Oluştur</h2>
            <div className="flex flex-col space-y-3">
              <button
                onClick={generatePDF}
                disabled={loading}
                className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'İşleniyor...' : <><Download className="mr-2" size={18} /> PDF İndir</>}
              </button>
              <button
                onClick={generateJPEG}
                disabled={loading}
                className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'İşleniyor...' : <><Download className="mr-2" size={18} /> JPEG İndir</>}
              </button>
            </div>
            {showSuccessMessage && (
              <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                <span className="block sm:inline">Rapor başarıyla oluşturuldu!</span>
              </div>
            )}
          </div>
        </div>

        {/* Report Preview */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Rapor Önizleme</h2>
            <div
              ref={reportRef}
              className="bg-white border border-gray-200 rounded-lg p-12 max-w-4xl mx-auto"
              style={{ minHeight: '297mm', width: '210mm' }}
            >
              {/* Report Header */}
              <div className="flex justify-between items-center mb-8 border-b pb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Fabrika Konum Analiz Raporu</h1>
                  <p className="text-gray-600 mt-1">Çevresel ve Yapısal Değerlendirme</p>
                </div>
                {formData.logoUrl && (
                  <img src={formData.logoUrl} alt="Company Logo" className="h-16 object-contain"/>
                )}
              </div>

              {/* Client and Location Info */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">Müşteri Bilgileri</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start"><Building className="h-4 w-4 text-gray-500 mr-2 mt-0.5" /><p><strong>Firma:</strong> {formData.clientCompany || 'Belirtilmemiş'}</p></div>
                    <div className="flex items-start"><User className="h-4 w-4 text-gray-500 mr-2 mt-0.5" /><p><strong>Yetkili:</strong> {formData.clientName || 'Belirtilmemiş'}</p></div>
                    <div className="flex items-start"><Calendar className="h-4 w-4 text-gray-500 mr-2 mt-0.5" /><p><strong>Tarih:</strong> {new Date(formData.assessmentDate).toLocaleDateString('tr-TR')}</p></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">Lokasyon Bilgileri</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start"><MapPin className="h-4 w-4 text-gray-500 mr-2 mt-0.5" /><p><strong>Adres:</strong> {formData.factoryAddress || 'Belirtilmemiş'}</p></div>
                    <div className="flex items-start"><FileText className="h-4 w-4 text-gray-500 mr-2 mt-0.5" /><p><strong>Koordinatlar:</strong> {formData.factoryCoordinates || 'Belirtilmemiş'}</p></div>
                  </div>
                </div>
              </div>

              {/* Risk Score */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">Genel Risk Değerlendirmesi</h3>
                <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                  <div className={`text-4xl font-bold ${getRiskLevel(riskScore).color}`}>
                    {getRiskLevel(riskScore).label}
                  </div>
                  <div className="ml-6 flex-1">
                     <p className="text-sm text-gray-600">
                       Çevresel ve yapısal faktörlere dayalı olarak, tesis lokasyonunun genel risk seviyesi belirlenmiştir. Negatif olarak işaretlenen {Object.values(locationFactors).flatMap(c => c.items).filter(i => i.status === 'negative').length} adet faktör bulunmaktadır.
                     </p>
                  </div>
                </div>
              </div>

              {/* Analysis Details */}
              <div className="space-y-6">
                {Object.entries(locationFactors).map(([categoryId, category]) => (
                  <div key={categoryId}>
                    <h4 className="font-semibold text-gray-800 mb-2 text-base border-b pb-1">{category.title}</h4>
                    <div className="space-y-2">
                      {category.items.map((item) => (
                        <div key={item.id} className="flex items-start border-b border-gray-100 pb-2">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${getStatusColor(item.status)}`}>
                            {getStatusIcon(item.status)}
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm">{item.text}</p>
                            {item.notes && (
                              <p className="text-xs text-gray-500 mt-1"><strong>Not:</strong> {item.notes}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t pt-4 mt-12 text-xs text-gray-500 flex justify-between">
                <div>
                  <p>Rapor Tarihi: {new Date().toLocaleDateString('tr-TR')}</p>
                  <p>Denetleyen: {formData.assessorName || 'Belirtilmemiş'}</p>
                </div>
                <div className="text-right">
                  <p>{formData.assessorCompany}</p>
                  <p>www.pestmentor.com.tr</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
       {/* CTA Section */}
       <section className="mt-12 bg-blue-600 rounded-lg p-8 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Profesyonel Konum Analizi ve Danışmanlık</h2>
          <p className="text-xl text-blue-100 mb-8">
            Uzman ekibimiz, yatırımınız için en doğru lokasyonu belirlemenize ve mevcut tesisinizin risklerini yönetmenize yardımcı olur.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/iletisim" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-lg flex items-center justify-center space-x-2"
            >
              <Mail className="h-5 w-5" />
              <span>İletişime Geçin</span>
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
    </div>
  );
};

export default LocationAnalysisPage;