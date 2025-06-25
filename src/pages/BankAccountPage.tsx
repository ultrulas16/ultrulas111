import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Building, Copy, CheckCircle, Shield, Lock, Phone, Mail } from 'lucide-react';

const BankAccountPage = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const bankAccounts = [
    {
      bankName: "Garanti BBVA",
      bankLogo: "🏦",
      companyName: "Sistem İlaçlama Sanayi ve Ticaret Limited Şirketi",
      iban: "TR66 0006 2000 0370 0006 2027 89",
      accountNumber: "37-6202789",
      branch: "GAZCILAR ŞUBESİ",
      currency: "TL",
      color: "emerald"
    },
    {
      bankName: "Ziraat Bankası",
      bankLogo: "🏛️",
      companyName: "Sistem İlaçlama Sanayi ve Ticaret Limited Şirketi",
      iban: "TR69 0001 0020 5479 9952 9350 01",
      accountNumber: "2054-79995293-5001",
      branch: "İZMİR YOLU ŞUBESİ",
      currency: "TL",
      color: "green"
    }
  ];

  const paymentSteps = [
    {
      step: 1,
      title: "Hizmet Talebi",
      description: "İletişim formunu doldurun veya bizi arayın"
    },
    {
      step: 2,
      title: "Keşif ve Teklif",
      description: "Keşif sonrası size özel teklif sunuyoruz"
    },
    {
      step: 3,
      title: "Ödeme",
      description: "Aşağıdaki hesap bilgilerimize ödemenizi yapabilirsiniz"
    },
    {
      step: 4,
      title: "Hizmet",
      description: "Ödeme onayı sonrası hizmetinizi gerçekleştiriyoruz"
    }
  ];

  return (
    <div className="pt-8">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-pest-green-50 to-pest-green-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <CreditCard className="h-12 w-12 text-pest-green-700 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              Hesap Bilgilerimiz
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hizmet bedellerinizi aşağıdaki banka hesaplarımıza güvenle ödeyebilirsiniz.
          </p>
        </div>
      </section>

      {/* Security Notice */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-4xl mx-auto">
            <div className="flex items-start space-x-4">
              <Shield className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Güvenlik Uyarısı</h3>
                <p className="text-blue-700">
                  Ödeme yapmadan önce mutlaka bizimle iletişime geçin ve hizmet detaylarını onaylayın. 
                  Sadece resmi hesap bilgilerimizi kullanın ve ödeme makbuzunuzu saklayın.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bank Accounts */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-pest-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Banka Hesaplarımız</h2>
            <p className="text-xl text-gray-600">
              Aşağıdaki hesaplardan herhangi birine ödemenizi yapabilirsiniz
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {bankAccounts.map((account, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
                <div className={`bg-gradient-to-r ${
                  account.color === 'emerald' 
                    ? 'from-emerald-600 to-emerald-700' 
                    : 'from-green-600 to-green-700'
                } p-6 text-white`}>
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{account.bankLogo}</div>
                    <div>
                      <h3 className="text-2xl font-bold">{account.bankName}</h3>
                      <p className="text-green-100">{account.branch}</p>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Şirket Unvanı</label>
                    <p className="text-gray-800 font-medium">{account.companyName}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">IBAN</label>
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                      <span className="font-mono text-lg text-gray-800">{account.iban}</span>
                      <button
                        onClick={() => copyToClipboard(account.iban.replace(/\s/g, ''), `iban-${index}`)}
                        className="ml-4 p-2 text-pest-green-700 hover:bg-pest-green-100 rounded-lg transition-colors"
                        title="IBAN'ı Kopyala"
                      >
                        {copiedField === `iban-${index}` ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Copy className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">Hesap Numarası</label>
                      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <span className="font-mono text-gray-800">{account.accountNumber}</span>
                        <button
                          onClick={() => copyToClipboard(account.accountNumber.replace(/[-]/g, ''), `account-${index}`)}
                          className="ml-2 p-1 text-pest-green-700 hover:bg-pest-green-100 rounded transition-colors"
                          title="Hesap Numarasını Kopyala"
                        >
                          {copiedField === `account-${index}` ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">Para Birimi</label>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="font-medium text-gray-800">{account.currency}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Process */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Ödeme Süreci</h2>
            <p className="text-xl text-gray-600">
              Hizmet alımından ödemeye kadar olan süreç
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-pest-green-200"></div>
              <div className="space-y-12">
                {paymentSteps.map((item, index) => (
                  <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                      <div className="bg-white rounded-xl p-6 shadow-lg">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-pest-green-700 text-white rounded-full flex items-center justify-center font-bold z-10">
                      {item.step}
                    </div>
                    <div className="w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-pest-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Önemli Notlar</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  <Lock className="h-6 w-6 text-pest-green-700 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-800">Güvenlik</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-pest-green-600 rounded-full mt-2 mr-3"></div>
                    <span>Ödeme yapmadan önce mutlaka bizimle iletişime geçin</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-pest-green-600 rounded-full mt-2 mr-3"></div>
                    <span>Sadece yukarıdaki resmi hesap bilgilerini kullanın</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-pest-green-600 rounded-full mt-2 mr-3"></div>
                    <span>Ödeme makbuzunuzu mutlaka saklayın</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  <Building className="h-6 w-6 text-pest-green-700 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-800">Ödeme Bilgileri</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-pest-green-600 rounded-full mt-2 mr-3"></div>
                    <span>Ödeme açıklamasına hizmet türünü yazın</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-pest-green-600 rounded-full mt-2 mr-3"></div>
                    <span>Ödeme sonrası dekont fotoğrafını WhatsApp ile gönderin</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-pest-green-600 rounded-full mt-2 mr-3"></div>
                    <span>Fatura bilgilerinizi önceden bildirin</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact for Payment */}
      <section className="py-20 bg-pest-green-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ödeme Konusunda Sorularınız mı Var?
          </h2>
          <p className="text-xl text-pest-green-100 mb-8 max-w-2xl mx-auto">
            Ödeme süreci hakkında detaylı bilgi almak için bizimle iletişime geçin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:02242338387" 
              className="bg-white text-pest-green-700 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-lg flex items-center justify-center space-x-2"
            >
              <Phone className="h-5 w-5" />
              <span>Hemen Arayın</span>
            </a>
            <Link 
              to="/iletisim" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-pest-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <Mail className="h-5 w-5" />
              <span>İletişim Formu</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BankAccountPage;