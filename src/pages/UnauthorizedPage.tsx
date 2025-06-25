import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldOff, Home, ArrowLeft, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UnauthorizedPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
          <ShieldOff className="h-10 w-10 text-red-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Erişim Reddedildi</h1>
        
        <p className="text-gray-600 mb-6">
          Bu modüle erişim yetkiniz bulunmamaktadır. Erişim için lütfen sistem yöneticisiyle iletişime geçin.
        </p>
        
        <div className="space-y-4">
          <Link
            to="/moduller"
            className="block w-full bg-pest-green-600 text-white py-3 px-4 rounded-lg hover:bg-pest-green-700 transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Modüller Sayfasına Dön
          </Link>
          
          <Link
            to="/"
            className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <Home className="h-5 w-5 mr-2" />
            Ana Sayfaya Dön
          </Link>
          
          <a
            href="mailto:info@pestmentor.com.tr"
            className="block w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <Mail className="h-5 w-5 mr-2" />
            Yönetici ile İletişime Geç
          </a>
        </div>
      </div>
      
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>Kullanıcı: {user?.email || 'Giriş yapılmamış'}</p>
        <p>Yardım için: info@pestmentor.com.tr</p>
      </div>
    </div>
  );
};

export default UnauthorizedPage;