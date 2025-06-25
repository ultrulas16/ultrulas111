import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Send, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Users,
  TrendingUp,
  Award,
  Clock,
  Shield
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const FranchisePage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    district: '',
    address: '',
    investmentBudget: '',
    businessExperience: '',
    currentOccupation: '',
    whyInterested: '',
    additionalInfo: '',
    heardFrom: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Submit to Supabase
      const { error } = await supabase
        .from('franchise_applications')
        .insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            city: formData.city,
            district: formData.district,
            address: formData.address,
            investment_budget: formData.investmentBudget,
            business_experience: formData.businessExperience,
            current_occupation: formData.currentOccupation,
            why_interested: formData.whyInterested,
            additional_info: formData.additionalInfo,
            heard_from: formData.heardFrom,
            status: 'new'
          }
        ]);

      if (error) throw error;
      
      setSuccess(true);
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        city: '',
        district: '',
        address: '',
        investmentBudget: '',
        businessExperience: '',
        currentOccupation: '',
        whyInterested: '',
        additionalInfo: '',
        heardFrom: ''
      });
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setError('Başvurunuz gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const franchiseBenefits = [
    {
      icon: Building,
      title: "Güçlü Marka",
      description: "33 yıllık sektör deneyimi ve güçlü marka bilinirliği"
    },
    {
      icon: Users,
      title: "Kapsamlı Eğitim",
      description: "Teknik ve işletme konularında detaylı eğitim programları"
    },
    {
      icon: Shield,
      title: "Sürekli Destek",
      description: "Operasyon, pazarlama ve teknik konularda sürekli destek"
    },
    {
      icon: TrendingUp,
      title: "Yüksek Karlılık",
      description: "Düşük yatırım maliyeti ve yüksek karlılık potansiyeli"
    }
  ];

  const franchiseRequirements = [
    "Minimum 250.000 TL yatırım kapasitesi",
    "Ticari deneyim veya girişimcilik ruhu",
    "PestMentor değerlerine uyum",
    "Müşteri odaklı yaklaşım",
    "Bölgesinde aktif çalışma isteği",
    "Uzun vadeli iş ortaklığı vizyonu"
  ];

  const franchiseProcess = [
    {
      step: 1,
      title: "Başvuru",
      description: "Online başvuru formunu doldurarak sürecin ilk adımını tamamlayın"
    },
    {
      step: 2,
      title: "Ön Görüşme",
      description: "Başvurunuz incelendikten sonra ön görüşme için davet edileceksiniz"
    },
    {
      step: 3,
      title: "Detaylı Bilgilendirme",
      description: "Franchise sistemi, yatırım ve karlılık hakkında detaylı bilgilendirme"
    },
    {
      step: 4,
      title: "Sözleşme",
      description: "Karşılıklı anlaşma sonrası franchise sözleşmesinin imzalanması"
    },
    {
      step: 5,
      title: "Eğitim ve Kurulum",
      description: "Kapsamlı eğitim programı ve işletme kurulum desteği"
    }
  ];

  const cities = [
    'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin', 'Aydın', 'Balıkesir',
    'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli',
    'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari',
    'Hatay', 'Isparta', 'Mersin', 'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir',
    'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş', 'Nevşehir',
    'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Tekirdağ', 'Tokat',
    'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak', 'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman',
    'Kırıkkale', 'Batman', 'Şırnak', 'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye',
    'Düzce'
  ].sort();

  const investmentRanges = [
    '250.000 TL - 500.000 TL',
    '500.000 TL - 750.000 TL',
    '750.000 TL - 1.000.000 TL',
    '1.000.000 TL ve üzeri'
  ];

  const heardFromOptions = [
    'İnternet Araması',
    'Sosyal Medya',
    'Arkadaş/Tanıdık Tavsiyesi',
    'Mevcut Bayiden',
    'Dergi/Gazete',
    'Fuar/Etkinlik',
    'Diğer'
  ];

  return (
    <div className="pt-8">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-amber-50 to-amber-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <Building className="h-12 w-12 text-amber-600 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              Bayilik Başvurusu
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            PestMentor bayilik sistemi ile kendi işinizin sahibi olun. 
            33 yıllık sektör deneyimimiz ve güçlü marka bilinirliğimiz ile 
            karlı bir iş fırsatı sunuyoruz.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Bayilik Avantajları</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              PestMentor bayisi olmanın size sunduğu benzersiz avantajlar
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {franchiseBenefits.map((benefit, index) => (
              <div key={index} className="text-center bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-all duration-300">
                <benefit.icon className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements & Process */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Requirements */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Bayilik Şartları</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                PestMentor bayisi olmak için aranan temel kriterler:
              </p>
              
              <div className="space-y-4">
                {franchiseRequirements.map((requirement, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-amber-600 mt-1" />
                    <span className="text-gray-700">{requirement}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Process */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Başvuru Süreci</h2>
              <div className="space-y-6">
                {franchiseProcess.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                      {step.step}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Bayilik Başvuru Formu</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              PestMentor bayisi olmak için aşağıdaki formu doldurarak başvurunuzu yapabilirsiniz.
            </p>
          </div>

          {success ? (
            <div className="max-w-3xl mx-auto bg-green-50 border border-green-200 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Başvurunuz Alındı!</h3>
              <p className="text-gray-600 mb-6">
                Bayilik başvurunuz başarıyla alındı. Ekibimiz başvurunuzu inceledikten sonra 
                en kısa sürede sizinle iletişime geçecektir.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium"
              >
                Yeni Başvuru Yap
              </button>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-8">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="h-5 w-5 text-amber-600 mr-2" />
                    Kişisel Bilgiler
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ad Soyad *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="Adınız ve soyadınız"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-posta *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="E-posta adresiniz"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="Telefon numaranız"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mevcut Meslek
                      </label>
                      <input
                        type="text"
                        name="currentOccupation"
                        value={formData.currentOccupation}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="Mevcut mesleğiniz"
                      />
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 text-amber-600 mr-2" />
                    Lokasyon Bilgileri
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        İl *
                      </label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      >
                        <option value="">İl Seçiniz</option>
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="İlçe"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adres
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                        placeholder="Açık adresiniz"
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Briefcase className="h-5 w-5 text-amber-600 mr-2" />
                    İş Bilgileri
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Yatırım Bütçesi *
                      </label>
                      <select
                        name="investmentBudget"
                        value={formData.investmentBudget}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      >
                        <option value="">Bütçe Seçiniz</option>
                        {investmentRanges.map((range) => (
                          <option key={range} value={range}>{range}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        İş Deneyimi (Yıl)
                      </label>
                      <input
                        type="text"
                        name="businessExperience"
                        value={formData.businessExperience}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="İş deneyiminiz (yıl olarak)"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Neden PestMentor Bayisi Olmak İstiyorsunuz? *
                      </label>
                      <textarea
                        name="whyInterested"
                        value={formData.whyInterested}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                        placeholder="PestMentor bayisi olmak isteme nedeninizi açıklayın..."
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FileText className="h-5 w-5 text-amber-600 mr-2" />
                    Ek Bilgiler
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Eklemek İstediğiniz Bilgiler
                      </label>
                      <textarea
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                        placeholder="Eklemek istediğiniz diğer bilgiler..."
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bizi Nereden Duydunuz?
                      </label>
                      <select
                        name="heardFrom"
                        value={formData.heardFrom}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      >
                        <option value="">Seçiniz</option>
                        {heardFromOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-amber-600 text-white py-3 px-6 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Gönderiliyor...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        <span>Başvuruyu Gönder</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Sık Sorulan Sorular</h2>
            <p className="text-xl text-gray-600">
              Bayilik sistemi hakkında merak edilenler
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Bayilik için gereken minimum yatırım tutarı nedir?</h3>
              <p className="text-gray-600">
                PestMentor bayiliği için minimum 250.000 TL yatırım bütçesi gerekmektedir. Bu tutar, başlangıç ekipmanları, 
                eğitim, ilk stok ve işletme sermayesini kapsamaktadır.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Bayilik süreci ne kadar sürer?</h3>
              <p className="text-gray-600">
                Başvurunuzun onaylanmasından işletmenizin açılışına kadar geçen süre ortalama 2-3 aydır. 
                Bu süre, lokasyon seçimi, eğitim programı ve ekipman tedariki gibi faktörlere bağlı olarak değişebilir.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Sektör deneyimim olmasa da bayilik alabilir miyim?</h3>
              <p className="text-gray-600">
                Evet, sektör deneyiminiz olmasa da bayilik alabilirsiniz. Kapsamlı eğitim programımız ve sürekli destek 
                sistemimiz sayesinde, zararlı mücadele sektöründe deneyiminiz olmasa bile başarılı olmanızı sağlayacak 
                tüm bilgi ve becerileri kazandırıyoruz.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Hangi bölgelerde bayilik verilmektedir?</h3>
              <p className="text-gray-600">
                Türkiye'nin tüm illerinde bayilik vermekteyiz. Ancak bazı illerde mevcut bayilerimiz bulunduğundan, 
                başvurunuz sırasında tercih ettiğiniz bölgenin uygunluğu değerlendirilecektir.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Ne tür eğitimler veriliyor?</h3>
              <p className="text-gray-600">
                Bayilerimize teknik eğitim (zararlı türleri, mücadele yöntemleri, ekipman kullanımı), 
                işletme yönetimi (müşteri ilişkileri, satış teknikleri, finansal yönetim) ve 
                pazarlama (dijital pazarlama, müşteri kazanımı) konularında kapsamlı eğitimler sunuyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-amber-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Başarılı Bir İş Ortaklığına Hazır mısınız?
          </h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            PestMentor bayisi olarak kendi işinizin sahibi olun ve büyüyen zararlı mücadele 
            sektöründe yerinizi alın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#application-form" 
              className="bg-white text-amber-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-lg"
            >
              Hemen Başvur
            </a>
            <a 
              href="tel:02242338387" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-amber-600 transition-colors font-medium"
            >
              Detaylı Bilgi Al
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FranchisePage;