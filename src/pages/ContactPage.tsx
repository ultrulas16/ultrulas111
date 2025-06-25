import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Calendar, Users } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    propertyType: '',
    message: '',
    preferredTime: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log('Form submitted:', formData);
    alert('Mesajınız alındı! En kısa sürede size dönüş yapacağız.');
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      serviceType: '',
      propertyType: '',
      message: '',
      preferredTime: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const serviceTypes = [
    'Böcek Mücadelesi',
    'Kemirgen Kontrolü',
    'Dezenfeksiyon',
    'Konut İlaçlaması',
    'Ticari Mekan İlaçlaması',
    'Periyodik Bakım',
    'Acil Müdahale'
  ];

  const propertyTypes = [
    'Ev/Daire',
    'Villa',
    'Ofis',
    'Mağaza',
    'Restoran',
    'Fabrika',
    'Depo',
    'Diğer'
  ];

  const contactInfo = [
    {
      icon: Phone,
      title: "Telefon",
      content: "0224 233 83 87",
      link: "tel:02242338387",
      description: "7/24 acil durum hattı"
    },
    {
      icon: Mail,
      title: "E-posta",
      content: "info@pestmentor.com.tr",
      link: "mailto:info@pestmentor.com.tr",
      description: "24 saat içinde yanıt"
    },
    {
      icon: MapPin,
      title: "Adres",
      content: "Kükürtlü Mahallesi Belde Caddesi Gündüz Sokak Tan Apartmanı No:2",
      link: "#",
      description: "Osmangazi, BURSA"
    },
    {
      icon: Clock,
      title: "Çalışma Saatleri",
      content: "Pazartesi - Cumartesi: 08:00 - 18:00",
      link: "#",
      description: "Pazar: Acil durumlar için arayın"
    }
  ];

  const serviceAreas = [
    'Bursa', 'İstanbul', 'İzmir', 'Ankara', 'Antalya', 'Mersin',
    'Afyon', 'Kocaeli', 'Yalova', 'Sakarya', 'Uşak', 'Balıkesir', 'Çanakkale'
  ];

  const faqs = [
    {
      question: "Keşif hizmeti nasıl çalışır?",
      answer: "Uzman ekibimiz mekanınıza gelerek detaylı inceleme yapar, zararlı türlerini tespit eder ve size en uygun çözümü sunar."
    },
    {
      question: "İlaçlama sonrası ne kadar süre beklemek gerekir?",
      answer: "Kullandığımız ürünlere göre değişmekle birlikte, genellikle 2-4 saat sonra mekanınızı güvenle kullanabilirsiniz. Detaylı bilgiyi uygulama sonrası veririz."
    },
    {
      question: "Periyodik bakım ne sıklıkla yapılır?",
      answer: "Mekanın özelliğine ve zararlı türüne göre aylık, 2 aylık veya 3 aylık periyotlarla düzenli kontrol ve bakım hizmeti sunuyoruz."
    },
    {
      question: "Kullandığınız ürünler güvenli mi?",
      answer: "Evet, sadece lisanslı, çevre dostu ve insan sağlığına zararsız ürünler kullanıyoruz. Tüm ürünlerimiz resmi onaylara sahiptir."
    }
  ];

  return (
    <div className="pt-8">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-pest-green-50 to-pest-green-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            İletişim
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Size en yakın çözümü sunabilmek için bizimle iletişime geçin. 
            Keşif hizmeti ile başlayalım!
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div key={index} className="text-center bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <info.icon className="h-8 w-8 text-pest-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{info.title}</h3>
                {info.link.startsWith('tel:') || info.link.startsWith('mailto:') ? (
                  <a href={info.link} className="text-pest-green-600 hover:text-pest-green-700 font-medium block mb-1">
                    {info.content}
                  </a>
                ) : (
                  <p className="text-gray-700 font-medium mb-1">{info.content}</p>
                )}
                <p className="text-sm text-gray-500">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-pest-green-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <div className="flex items-center mb-6">
                  <MessageCircle className="h-8 w-8 text-pest-green-600 mr-3" />
                  <h2 className="text-3xl font-bold text-gray-800">Bize Ulaşın</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500 transition-colors"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500 transition-colors"
                        placeholder="Telefon numaranız"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500 transition-colors"
                      placeholder="E-posta adresiniz"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hizmet Türü
                      </label>
                      <select
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500 transition-colors"
                      >
                        <option value="">Seçiniz</option>
                        {serviceTypes.map((service, index) => (
                          <option key={index} value={service}>{service}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mekan Türü
                      </label>
                      <select
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500 transition-colors"
                      >
                        <option value="">Seçiniz</option>
                        {propertyTypes.map((property, index) => (
                          <option key={index} value={property}>{property}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tercih Edilen Zaman
                    </label>
                    <input
                      type="text"
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500 transition-colors"
                      placeholder="Örn: Hafta içi sabah saatleri"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mesajınız *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500 transition-colors resize-none"
                      placeholder="Zararlı mücadele ihtiyacınızı detaylı olarak açıklayın..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-pest-green-600 text-white px-8 py-3 rounded-lg hover:bg-pest-green-700 transition-colors font-medium flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <Send className="h-5 w-5" />
                    <span>Mesaj Gönder</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-8">
              {/* Quick Contact */}
              <div className="bg-pest-green-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Acil Durum?</h3>
                <p className="text-pest-green-100 mb-6">
                  Acil zararlı mücadele ihtiyacınız için 7/24 ulaşabileceğiniz destek hattımız.
                </p>
                <a 
                  href="tel:02242338387"
                  className="bg-white text-pest-green-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium inline-flex items-center space-x-2"
                >
                  <Phone className="h-5 w-5" />
                  <span>Hemen Arayın</span>
                </a>
              </div>

              {/* Service Areas */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Hizmet Alanlarımız</h3>
                <div className="grid grid-cols-2 gap-3">
                  {serviceAreas.map((area, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-pest-green-600 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{area}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Working Hours */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <Calendar className="h-6 w-6 text-pest-green-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-800">Çalışma Saatleri</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Pazartesi - Cuma</span>
                    <span className="text-pest-green-600 font-medium">08:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Cumartesi</span>
                    <span className="text-pest-green-600 font-medium">08:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Pazar</span>
                    <span className="text-orange-600 font-medium">Acil Durum</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Sık Sorulan Sorular</h2>
            <p className="text-xl text-gray-600">Merak ettiğiniz konularda yanıtlar</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;