import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin, ShoppingCart, ClipboardList } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="/pestmentor-logo-png-297x97.webp" 
                alt="PestMentor Logo" 
                className="h-12 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Sistem İlaçlama Sanayi ve Ticaret Limited Şirketi olarak, 
              Türkiye genelinde 32 yılı aşkın süredir profesyonel zararlı mücadele 
              hizmetleri sunuyoruz. Modern teknikler ve çevre dostu yöntemlerle 
              müşterilerimize en kaliteli hizmeti veriyoruz.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-pest-green-400" />
                <a href="tel:02242338387" className="text-gray-300 hover:text-pest-green-400 transition-colors">
                  0224 233 83 87
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-pest-green-400" />
                <a href="mailto:info@pestmentor.com.tr" className="text-gray-300 hover:text-pest-green-400 transition-colors">
                  info@pestmentor.com.tr
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-pest-green-400 mt-1" />
                <div className="text-gray-300">
                  <p>Pazartesi - Cumartesi: 08:00 - 18:00</p>
                  <p>Pazar: Acil durumlar için arayın</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Hızlı Linkler</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-pest-green-400 transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link to="/hizmetler" className="text-gray-300 hover:text-pest-green-400 transition-colors">
                  Hizmetlerimiz
                </Link>
              </li>
              <li>
                <Link to="/magaza" className="text-gray-300 hover:text-pest-green-400 transition-colors">
                  Mağaza
                </Link>
              </li>
              <li>
                <Link to="/moduller" className="text-gray-300 hover:text-pest-green-400 transition-colors">
                  Modüller
                </Link>
              </li>
              <li>
                <Link to="/bayilik" className="text-gray-300 hover:text-pest-green-400 transition-colors">
                  Bayilik
                </Link>
              </li>
              <li>
                <Link to="/kariyer" className="text-gray-300 hover:text-pest-green-400 transition-colors">
                  Kariyer
                </Link>
              </li>
              <li>
                <Link to="/hizmet-bolgeleri" className="text-gray-300 hover:text-pest-green-400 transition-colors">
                  Hizmet Bölgeleri
                </Link>
              </li>
              <li>
                <Link to="/hakkimizda" className="text-gray-300 hover:text-pest-green-400 transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link to="/iletisim" className="text-gray-300 hover:text-pest-green-400 transition-colors">
                  İletişim
                </Link>
              </li>
              <li>
                <Link to="/hasere-kutuphanesi" className="text-gray-300 hover:text-pest-green-400 transition-colors">
                  Haşere Kütüphanesi
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-pest-green-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/dokumanlar" className="text-gray-300 hover:text-pest-green-400 transition-colors">
                  Dökümanlar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Kurumsal</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/hesap-bilgileri" className="text-gray-300 hover:text-pest-green-400 transition-colors">
                  Banka Hesap Bilgileri
                </Link>
              </li>
              <li>
                <Link to="/firma-bilgileri" className="text-gray-300 hover:text-pest-green-400 transition-colors">
                  Firma Cari Bilgileri
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-pest-green-400 transition-colors">
                  Gizlilik Politikası
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-pest-green-400 transition-colors">
                  Kullanım Şartları
                </a>
              </li>
            </ul>
            
            <h4 className="text-lg font-semibold text-white mt-8 mb-6">İletişim</h4>
            <div className="flex items-start space-x-3 mb-6">
              <MapPin className="h-5 w-5 text-gray-400 mt-1" />
              <div className="text-gray-300 text-sm leading-relaxed">
                Kükürtlü Mahallesi<br />
                Belde Caddesi Gündüz Sokak<br />
                Tan Apartmanı No:2<br />
                Osmangazi, BURSA
              </div>
            </div>
            
            <div>
              <h5 className="font-medium mb-3">Bizi Takip Edin</h5>
              <div className="flex space-x-3">
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pest-green-700 transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pest-green-700 transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pest-green-700 transition-colors">
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} PestMentor - Sistem İlaçlama San. ve Tic. Ltd. Şti. Tüm hakları saklıdır.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-pest-green-400 transition-colors">
                Gizlilik Politikası
              </a>
              <a href="#" className="text-gray-400 hover:text-pest-green-400 transition-colors">
                Kullanım Şartları
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;