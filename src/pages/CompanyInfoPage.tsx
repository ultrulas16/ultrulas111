import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building, MapPin, Phone, Mail, FileText, Copy, CheckCircle, CreditCard, Info, Briefcase } from 'lucide-react';

const CompanyInfoPage = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const companyInfo = {
    name: "SİSTEM İLAÇLAMA SANAYİ VE TİCARET LİMİTED ŞİRKETİ",
    address: "KÜKÜRTLÜ MAHALLESİ BELDE CADDESİ GÜNDÜZ SOKAK TAN APARTMANI NO:2 OSMANGAZİ BURSA",
    phone: "0224 233 83 87",
    email: "muhasebe@pestmentor.com.tr",
    taxOffice: "SETBAŞI VERGİ DAİRESİ",
    taxNumber: "7710035611"
  };

  return (
    <div className="pt-8">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <Building className="h-12 w-12 text-blue-600 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              Firma Bilgileri
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sistem İlaçlama Sanayi ve Ticaret Limited Şirketi cari bilgileri
          </p>
        </div>
      </section>

      {/* Company Information */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                <Info className="h-6 w-6 text-blue-600 mr-3" />
                Firma Cari Bilgileri
              </h2>
              
              <div className="space-y-6">
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Firma Adı
                  </label>
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                    <span className="font-medium text-gray-800">{companyInfo.name}</span>
                    <button
                      onClick={() => copyToClipboard(companyInfo.name, 'name')}
                      className="ml-4 p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Firma Adını Kopyala"
                    >
                      {copiedField === 'name' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Adres
                  </label>
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                    <span className="font-medium text-gray-800">{companyInfo.address}</span>
                    <button
                      onClick={() => copyToClipboard(companyInfo.address, 'address')}
                      className="ml-4 p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Adresi Kopyala"
                    >
                      {copiedField === 'address' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Telefon
                    </label>
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                      <span className="font-medium text-gray-800">{companyInfo.phone}</span>
                      <button
                        onClick={() => copyToClipboard(companyInfo.phone, 'phone')}
                        className="ml-4 p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Telefonu Kopyala"
                      >
                        {copiedField === 'phone' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Copy className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      E-posta
                    </label>
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                      <span className="font-medium text-gray-800">{companyInfo.email}</span>
                      <button
                        onClick={() => copyToClipboard(companyInfo.email, 'email')}
                        className="ml-4 p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="E-postayı Kopyala"
                      >
                        {copiedField === 'email' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Copy className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tax Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Vergi Dairesi
                    </label>
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                      <span className="font-medium text-gray-800">{companyInfo.taxOffice}</span>
                      <button
                        onClick={() => copyToClipboard(companyInfo.taxOffice, 'taxOffice')}
                        className="ml-4 p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Vergi Dairesini Kopyala"
                      >
                        {copiedField === 'taxOffice' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Copy className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Vergi Numarası
                    </label>
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                      <span className="font-medium text-gray-800">{companyInfo.taxNumber}</span>
                      <button
                        onClick={() => copyToClipboard(companyInfo.taxNumber, 'taxNumber')}
                        className="ml-4 p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Vergi Numarasını Kopyala"
                      >
                        {copiedField === 'taxNumber' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Copy className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center text-blue-600">
                  <Briefcase className="h-5 w-5 mr-2" />
                  <span className="font-medium">Resmi işlemlerinizde yukarıdaki bilgileri kullanabilirsiniz.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bank Accounts Link */}
      <section className="py-12 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Banka Hesap Bilgilerimiz
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Ödemeleriniz için banka hesap bilgilerimize ulaşabilirsiniz.
          </p>
          <Link 
            to="/hesap-bilgileri" 
            className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-lg inline-flex items-center space-x-2"
          >
            <CreditCard className="h-5 w-5" />
            <span>Banka Hesap Bilgileri</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CompanyInfoPage;