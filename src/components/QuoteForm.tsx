import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Building, 
  Home, 
  Bug, 
  Rat, 
  Bird, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Send, 
  CheckCircle, 
  User, 
  FileText 
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FormData {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  propertyType: string;
  address: string;
  city: string;
  district: string;
  pestType: string[];
  message: string;
  preferredTime: string;
  company: string;
}

const QuoteForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    propertyType: '',
    address: '',
    city: '',
    district: '',
    pestType: [],
    message: '',
    preferredTime: '',
    company: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const serviceTypes = [
    { id: 'ipm', name: 'Zararlı Mücadelesi (IPM)', icon: Bug },
    { id: 'rodent', name: 'Kemirgen Kontrolü', icon: Rat },
    { id: 'bird', name: 'Kuş Kontrolü', icon: Bird },
    { id: 'disinfection', name: 'Dezenfeksiyon', icon: FileText },
    { id: 'fumigation', name: 'Fumigasyon', icon: Building },
    { id: 'consulting', name: '3. Göz Danışmanlık', icon: User }
  ];

  const propertyTypes = [
    { id: 'residential', name: 'Konut', icon: Home },
    { id: 'commercial', name: 'Ticari Bina', icon: Building },
    { id: 'industrial', name: 'Endüstriyel Tesis', icon: Building },
    { id: 'warehouse', name: 'Depo', icon: Building },
    { id: 'restaurant', name: 'Restoran', icon: Building },
    { id: 'hotel', name: 'Otel', icon: Building }
  ];

  const pestTypes = [
    { id: 'cockroach', name: 'Hamam Böceği' },
    { id: 'ant', name: 'Karınca' },
    { id: 'rodent', name: 'Fare/Sıçan' },
    { id: 'mosquito', name: 'Sivrisinek' },
    { id: 'fly', name: 'Karasinek' },
    { id: 'tick', name: 'Kene' },
    { id: 'bedbug', name: 'Tahta Kurusu' },
    { id: 'moth', name: 'Güve' },
    { id: 'bee', name: 'Arı' },
    { id: 'wasp', name: 'Eşek Arısı' },
    { id: 'flea', name: 'Pire' },
    { id: 'spider', name: 'Örümcek' },
    { id: 'scorpion', name: 'Akrep' },
    { id: 'termite', name: 'Termit' },
    { id: 'lice', name: 'Bit' },
    { id: 'other', name: 'Diğer' }
  ];

  const cities = [
    'Bursa', 'İstanbul', 'İzmir', 'Ankara', 'Antalya', 'Mersin',
    'Afyon', 'Kocaeli', 'Yalova', 'Sakarya', 'Uşak', 'Balıkesir', 'Çanakkale'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePestTypeChange = (pestId: string) => {
    setFormData(prev => {
      if (prev.pestType.includes(pestId)) {
        return { ...prev, pestType: prev.pestType.filter(id => id !== pestId) };
      } else {
        return { ...prev, pestType: [...prev.pestType, pestId] };
      }
    });
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const validateStep = () => {
    setError(null);
    
    switch (step) {
      case 1:
        if (!formData.serviceType) {
          setError('Lütfen bir hizmet türü seçin');
          return false;
        }
        if (!formData.propertyType) {
          setError('Lütfen bir mekan türü seçin');
          return false;
        }
        return true;
      
      case 2:
        if (formData.serviceType === 'ipm' && formData.pestType.length === 0) {
          setError('Lütfen en az bir zararlı türü seçin');
          return false;
        }
        return true;
      
      case 3:
        if (!formData.city) {
          setError('Lütfen bir şehir seçin');
          return false;
        }
        return true;
      
      case 4:
        if (!formData.name) {
          setError('Lütfen adınızı girin');
          return false;
        }
        if (!formData.phone) {
          setError('Lütfen telefon numaranızı girin');
          return false;
        }
        // Basic phone validation
        if (!/^[0-9\s\-\+]{10,15}$/.test(formData.phone)) {
          setError('Lütfen geçerli bir telefon numarası girin');
          return false;
        }
        // Basic email validation if provided
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          setError('Lütfen geçerli bir e-posta adresi girin');
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Format pest types as a string
      const pestTypeString = formData.pestType.length > 0 
        ? formData.pestType.map(id => pestTypes.find(p => p.id === id)?.name).join(', ')
        : '';
      
      // Submit to Supabase
      const { error } = await supabase
        .from('discovery_requests')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            service_type: serviceTypes.find(s => s.id === formData.serviceType)?.name,
            property_type: propertyTypes.find(p => p.id === formData.propertyType)?.name,
            message: `${formData.message}${pestTypeString ? `\nZararlı Türleri: ${pestTypeString}` : ''}`,
            preferred_time: formData.preferredTime,
            city: formData.city,
            district: formData.district,
            address: formData.address,
            company_name: formData.company,
            source: 'website_quote_form'
          }
        ]);
      
      if (error) throw error;
      
      setSuccess(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Teklif talebiniz gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      serviceType: '',
      propertyType: '',
      address: '',
      city: '',
      district: '',
      pestType: [],
      message: '',
      preferredTime: '',
      company: ''
    });
    setStep(1);
    setSuccess(false);
    setError(null);
  };

  // If form submission was successful
  if (success) {
    return (
      <div className="bg-white rounded-xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Teklif Talebiniz Alındı</h3>
        <p className="text-gray-600 mb-6">
          Talebiniz başarıyla alındı. Uzman ekibimiz en kısa sürede sizinle iletişime geçecektir.
        </p>
        <button
          onClick={resetForm}
          className="bg-pest-green-600 text-white px-6 py-3 rounded-lg hover:bg-pest-green-700 transition-colors font-medium"
        >
          Yeni Teklif Talebi
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
      {/* Progress Bar */}
      <div className="bg-pest-green-600 p-4">
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4, 5].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  step >= stepNumber ? 'bg-white text-pest-green-600' : 'bg-pest-green-700 text-white'
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber < 5 && (
                <div 
                  className={`h-1 w-12 ${
                    step > stepNumber ? 'bg-white' : 'bg-pest-green-700'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          {/* Step 1: Service Type */}
          {step === 1 && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Hizmet Türü Seçin</h3>
              <p className="text-gray-600 mb-6">İhtiyacınız olan hizmet türünü seçin</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {serviceTypes.map((service) => (
                  <div 
                    key={service.id}
                    onClick={() => setFormData(prev => ({ ...prev, serviceType: service.id }))}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      formData.serviceType === service.id 
                        ? 'border-pest-green-600 bg-pest-green-50 shadow-md' 
                        : 'border-gray-200 hover:border-pest-green-300'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <service.icon className={`h-8 w-8 mb-2 ${
                        formData.serviceType === service.id ? 'text-pest-green-600' : 'text-gray-500'
                      }`} />
                      <span className={`text-sm font-medium ${
                        formData.serviceType === service.id ? 'text-pest-green-600' : 'text-gray-700'
                      }`}>
                        {service.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-4">Mekan Türü Seçin</h3>
              <p className="text-gray-600 mb-6">Hizmet alacağınız mekan türünü seçin</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {propertyTypes.map((property) => (
                  <div 
                    key={property.id}
                    onClick={() => setFormData(prev => ({ ...prev, propertyType: property.id }))}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      formData.propertyType === property.id 
                        ? 'border-pest-green-600 bg-pest-green-50 shadow-md' 
                        : 'border-gray-200 hover:border-pest-green-300'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <property.icon className={`h-8 w-8 mb-2 ${
                        formData.propertyType === property.id ? 'text-pest-green-600' : 'text-gray-500'
                      }`} />
                      <span className={`text-sm font-medium ${
                        formData.propertyType === property.id ? 'text-pest-green-600' : 'text-gray-700'
                      }`}>
                        {property.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Pest Type (only for IPM service) */}
          {step === 2 && (
            <div>
              {formData.serviceType === 'ipm' ? (
                <>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Zararlı Türleri</h3>
                  <p className="text-gray-600 mb-6">Mücadele etmek istediğiniz zararlı türlerini seçin</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {pestTypes.map((pest) => (
                      <div 
                        key={pest.id}
                        onClick={() => handlePestTypeChange(pest.id)}
                        className={`border rounded-lg p-3 cursor-pointer transition-all ${
                          formData.pestType.includes(pest.id) 
                            ? 'border-pest-green-600 bg-pest-green-50 shadow-md' 
                            : 'border-gray-200 hover:border-pest-green-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full mr-2 ${
                            formData.pestType.includes(pest.id) ? 'bg-pest-green-600' : 'bg-gray-200'
                          }`}></div>
                          <span className={`text-sm ${
                            formData.pestType.includes(pest.id) ? 'font-medium text-pest-green-600' : 'text-gray-700'
                          }`}>
                            {pest.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Ek Bilgiler</h3>
                  <p className="text-gray-600 mb-6">Hizmet talebiniz hakkında ek bilgiler</p>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tercih Edilen Zaman
                    </label>
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500"
                    >
                      <option value="">Seçiniz</option>
                      <option value="Hafta içi">Hafta içi</option>
                      <option value="Hafta sonu">Hafta sonu</option>
                      <option value="Sabah saatleri">Sabah saatleri</option>
                      <option value="Öğleden sonra">Öğleden sonra</option>
                      <option value="Akşam saatleri">Akşam saatleri</option>
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mesajınız
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500 resize-none"
                      placeholder="Hizmet talebiniz hakkında detaylı bilgi verebilirsiniz..."
                    ></textarea>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 3: Location */}
          {step === 3 && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Konum Bilgileri</h3>
              <p className="text-gray-600 mb-6">Hizmet alacağınız yerin konum bilgilerini girin</p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şehir *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500"
                  >
                    <option value="">Şehir Seçin</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İlçe
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500"
                    placeholder="İlçe"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adres
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500 resize-none"
                  placeholder="Açık adres"
                ></textarea>
              </div>
            </div>
          )}

          {/* Step 4: Contact Information */}
          {step === 4 && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">İletişim Bilgileri</h3>
              <p className="text-gray-600 mb-6">Size ulaşabilmemiz için iletişim bilgilerinizi girin</p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500"
                    placeholder="Adınız ve soyadınız"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500"
                    placeholder="Telefon numaranız"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500"
                    placeholder="E-posta adresiniz"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şirket Adı
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500"
                    placeholder="Şirket adınız (opsiyonel)"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Summary */}
          {step === 5 && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Teklif Özeti</h3>
              <p className="text-gray-600 mb-6">Lütfen bilgilerinizi kontrol edin ve teklif talebinizi gönderin</p>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Hizmet Bilgileri</h4>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Hizmet Türü:</strong> {serviceTypes.find(s => s.id === formData.serviceType)?.name}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Mekan Türü:</strong> {propertyTypes.find(p => p.id === formData.propertyType)?.name}
                    </p>
                    {formData.serviceType === 'ipm' && formData.pestType.length > 0 && (
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Zararlı Türleri:</strong> {formData.pestType.map(id => 
                          pestTypes.find(p => p.id === id)?.name).join(', ')}
                      </p>
                    )}
                    {formData.preferredTime && (
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Tercih Edilen Zaman:</strong> {formData.preferredTime}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Konum Bilgileri</h4>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Şehir:</strong> {formData.city}
                    </p>
                    {formData.district && (
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>İlçe:</strong> {formData.district}
                      </p>
                    )}
                    {formData.address && (
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Adres:</strong> {formData.address}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">İletişim Bilgileri</h4>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Ad Soyad:</strong> {formData.name}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Telefon:</strong> {formData.phone}
                  </p>
                  {formData.email && (
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>E-posta:</strong> {formData.email}
                    </p>
                  )}
                  {formData.company && (
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Şirket:</strong> {formData.company}
                    </p>
                  )}
                </div>
                
                {formData.message && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700 mb-2">Mesaj</h4>
                    <p className="text-sm text-gray-600">{formData.message}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center text-gray-600 hover:text-pest-green-600"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>Geri</span>
              </button>
            )}
            
            {step < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto bg-pest-green-600 text-white px-6 py-2 rounded-lg hover:bg-pest-green-700 transition-colors flex items-center"
              >
                <span>İleri</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="ml-auto bg-pest-green-600 text-white px-6 py-2 rounded-lg hover:bg-pest-green-700 transition-colors flex items-center disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span>Gönderiliyor...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-1" />
                    <span>Teklif Talebi Gönder</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuoteForm;