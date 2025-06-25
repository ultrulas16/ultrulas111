import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Calendar, 
  Send, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Users,
  Clock,
  Award,
  Heart,
  Upload,
  Paperclip
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const CareersPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    education: '',
    experience: '',
    position: '',
    coverLetter: '',
    resumeUrl: '',
    heardFrom: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFileName(file.name);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `resumes/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, resumeUrl: data.publicUrl }));
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Dosya yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Submit to Supabase
      const { error } = await supabase
        .from('job_applications')
        .insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            city: formData.city,
            education: formData.education,
            experience: formData.experience,
            position: formData.position,
            cover_letter: formData.coverLetter,
            resume_url: formData.resumeUrl,
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
        education: '',
        experience: '',
        position: '',
        coverLetter: '',
        resumeUrl: '',
        heardFrom: ''
      });
      setFileName('');
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setError('Başvurunuz gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const openPositions = [
    {
      title: "Saha Teknisyeni",
      location: "Bursa",
      type: "Tam Zamanlı",
      description: "Zararlı mücadele uygulamalarını gerçekleştirecek, müşteri lokasyonlarında hizmet verecek teknisyen aranmaktadır.",
      requirements: [
        "En az lise mezunu",
        "B sınıfı ehliyet sahibi",
        "Esnek çalışma saatlerine uyum sağlayabilecek",
        "Tercihen zararlı mücadele deneyimi olan"
      ]
    },
    {
      title: "Satış Temsilcisi",
      location: "İstanbul",
      type: "Tam Zamanlı",
      description: "Kurumsal müşterilere zararlı mücadele hizmetlerimizin tanıtımını ve satışını gerçekleştirecek satış temsilcisi aranmaktadır.",
      requirements: [
        "En az ön lisans mezunu",
        "Satış deneyimi olan",
        "İkna kabiliyeti yüksek",
        "MS Office programlarına hakim"
      ]
    },
    {
      title: "Müşteri Hizmetleri Uzmanı",
      location: "Bursa",
      type: "Tam Zamanlı",
      description: "Müşteri taleplerini karşılayacak, randevu planlaması yapacak ve müşteri memnuniyetini sağlayacak uzman aranmaktadır.",
      requirements: [
        "En az lise mezunu",
        "Güçlü iletişim becerileri",
        "Müşteri hizmetleri deneyimi",
        "Planlama ve organizasyon yeteneği"
      ]
    },
    {
      title: "Zararlı Mücadele Uzmanı",
      location: "İzmir",
      type: "Tam Zamanlı",
      description: "Zararlı türlerini tanıyan, mücadele yöntemlerini bilen ve saha ekibine teknik destek verebilecek uzman aranmaktadır.",
      requirements: [
        "Tercihen biyoloji, ziraat veya ilgili bölüm mezunu",
        "Zararlı mücadele sektöründe deneyimli",
        "Saha çalışmalarına uyum sağlayabilecek",
        "Teknik bilgi ve donanıma sahip"
      ]
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

  const positions = [
    'Saha Teknisyeni',
    'Satış Temsilcisi',
    'Müşteri Hizmetleri Uzmanı',
    'Zararlı Mücadele Uzmanı',
    'Ofis Personeli',
    'Yönetici Pozisyonu',
    'Stajyer',
    'Diğer'
  ];

  const educationLevels = [
    'İlköğretim',
    'Lise',
    'Ön Lisans',
    'Lisans',
    'Yüksek Lisans',
    'Doktora'
  ];

  const experienceLevels = [
    'Deneyimsiz',
    '1-3 Yıl',
    '3-5 Yıl',
    '5-10 Yıl',
    '10+ Yıl'
  ];

  const heardFromOptions = [
    'İnternet Araması',
    'Sosyal Medya',
    'Kariyer Sitesi',
    'Arkadaş/Tanıdık Tavsiyesi',
    'Okul/Üniversite',
    'Diğer'
  ];

  const benefits = [
    {
      icon: Award,
      title: "Kariyer Gelişimi",
      description: "Sürekli eğitim ve gelişim fırsatları ile kariyer basamaklarını tırmanın"
    },
    {
      icon: Users,
      title: "Dinamik Ekip",
      description: "Profesyonel ve dinamik bir ekibin parçası olun"
    },
    {
      icon: Heart,
      title: "Sosyal Haklar",
      description: "Rekabetçi maaş ve kapsamlı sosyal haklar paketi"
    },
    {
      icon: Clock,
      title: "İş-Yaşam Dengesi",
      description: "Çalışanlarımızın iş-yaşam dengesine önem veriyoruz"
    }
  ];

  return (
    <div className="pt-8">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <Briefcase className="h-12 w-12 text-blue-600 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              Kariyer Fırsatları
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            PestMentor ailesine katılın ve profesyonel kariyerinizde bir sonraki adımı atın. 
            Dinamik ekibimizin bir parçası olarak gelişin ve büyüyün.
          </p>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Neden PestMentor?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              PestMentor'da çalışmanın avantajları
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-all duration-300">
                <benefit.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Açık Pozisyonlar</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Şu anda başvuruya açık pozisyonlarımız
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {openPositions.map((position, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{position.title}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {position.type}
                  </span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{position.location}</span>
                </div>
                <p className="text-gray-600 mb-4">{position.description}</p>
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">Gereksinimler:</h4>
                  <ul className="space-y-1">
                    {position.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2"></div>
                        <span className="text-sm text-gray-600">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <a 
                  href="#application-form" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  <span>Başvur</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="application-form" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">İş Başvuru Formu</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              PestMentor ailesine katılmak için aşağıdaki formu doldurarak başvurunuzu yapabilirsiniz.
            </p>
          </div>

          {success ? (
            <div className="max-w-3xl mx-auto bg-green-50 border border-green-200 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Başvurunuz Alındı!</h3>
              <p className="text-gray-600 mb-6">
                İş başvurunuz başarıyla alındı. İnsan Kaynakları ekibimiz başvurunuzu inceledikten sonra 
                uygun görülürse sizinle iletişime geçecektir.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
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
                    <User className="h-5 w-5 text-blue-600 mr-2" />
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Telefon numaranız"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Şehir *
                      </label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Şehir Seçiniz</option>
                        {cities.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Education & Experience */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <GraduationCap className="h-5 w-5 text-blue-600 mr-2" />
                    Eğitim ve Deneyim
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Eğitim Durumu *
                      </label>
                      <select
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Eğitim Durumu Seçiniz</option>
                        {educationLevels.map((level) => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deneyim *
                      </label>
                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Deneyim Seçiniz</option>
                        {experienceLevels.map((level) => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Position & Resume */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Briefcase className="h-5 w-5 text-blue-600 mr-2" />
                    Pozisyon ve Özgeçmiş
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Başvurulan Pozisyon *
                      </label>
                      <select
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Pozisyon Seçiniz</option>
                        {positions.map((position) => (
                          <option key={position} value={position}>{position}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Özgeçmiş (CV) *
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="resume-upload"
                          accept=".pdf,.doc,.docx"
                        />
                        <label
                          htmlFor="resume-upload"
                          className={`w-full px-4 py-3 border border-gray-300 rounded-lg flex items-center justify-center cursor-pointer ${
                            formData.resumeUrl ? 'bg-green-50 border-green-300' : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          {uploading ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                              <span>Yükleniyor...</span>
                            </div>
                          ) : formData.resumeUrl ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-5 w-5 mr-2" />
                              <span>{fileName || 'Dosya yüklendi'}</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-gray-600">
                              <Upload className="h-5 w-5 mr-2" />
                              <span>Özgeçmiş Yükle (PDF, DOC, DOCX)</span>
                            </div>
                          )}
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Maksimum dosya boyutu: 5MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cover Letter & Additional Info */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FileText className="h-5 w-5 text-blue-600 mr-2" />
                    Ek Bilgiler
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ön Yazı
                      </label>
                      <textarea
                        name="coverLetter"
                        value={formData.coverLetter}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        placeholder="Kendinizi tanıtan ve neden bu pozisyona uygun olduğunuzu anlatan kısa bir yazı..."
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    disabled={loading || !formData.resumeUrl}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
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
                  {!formData.resumeUrl && (
                    <p className="text-sm text-red-600 mt-2 text-center">
                      * Başvuru yapabilmek için özgeçmiş yüklemeniz gerekmektedir.
                    </p>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* Company Culture */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Şirket Kültürümüz</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                PestMentor'da çalışanlarımızın gelişimine ve mutluluğuna önem veriyoruz. 
                Profesyonel bir çalışma ortamında, sürekli öğrenme ve gelişme fırsatları sunuyoruz.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <p className="text-gray-600">Sürekli eğitim ve gelişim programları</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <p className="text-gray-600">Takım çalışmasını destekleyen ortam</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <p className="text-gray-600">İnovasyon ve yaratıcılığı teşvik eden yaklaşım</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <p className="text-gray-600">Çalışan memnuniyeti odaklı yönetim</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <p className="text-gray-600">Sosyal aktiviteler ve takım etkinlikleri</p>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="PestMentor Şirket Kültürü" 
                className="rounded-2xl shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Kariyerinizde Yeni Bir Sayfa Açın
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            PestMentor ailesine katılın ve profesyonel kariyerinizde fark yaratın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#application-form" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-lg"
            >
              Hemen Başvur
            </a>
            <a 
              href="mailto:kariyer@pestmentor.com.tr" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-medium"
            >
              Bize Ulaşın
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareersPage;