import React, { useState } from 'react';
import { 
  Building2, 
  CreditCard, 
  Copy, 
  CheckCircle, 
  Wallet, 
  ArrowRight,
  ShieldCheck,
  Building
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface BankAccount {
  id: string;
  bankName: string;
  branchName: string;
  accountNumber: string;
  iban: string;
  logoColor: string;
}

const BankAccountPage = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const bankAccounts: BankAccount[] = [
    {
      id: '1',
      bankName: 'T. GARANTİ BANKASI A.Ş.',
      branchName: 'GAZCILAR ŞUBESİ (629)',
      accountNumber: '6297367',
      iban: 'TR82 0006 2000 0370 0006 2973 67',
      logoColor: 'bg-green-600'
    },
    {
      id: '2',
      bankName: 'TÜRKİYE İŞ BANKASI A.Ş.',
      branchName: 'NİLÜFER ŞUBESİ (2251)',
      accountNumber: '331402',
      iban: 'TR13 0006 4000 0012 2510 3314 02',
      logoColor: 'bg-blue-700'
    }
  ];

  const copyToClipboard = (text: string, id: string) => {
    // Remove spaces from IBAN for a cleaner copy if desired, but usually people want the spaces for readability
    // Let's keep spaces as they are in the official format
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-800 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-6 ring-1 ring-white/20">
            <Wallet className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Banka Hesap Bilgileri
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Ödemelerinizi aşağıda yer alan resmi banka hesaplarımıza EFT veya Havale yoluyla gerçekleştirebilirsiniz.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 -mt-12 relative z-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-8">
              {bankAccounts.map((account) => (
                <div 
                  key={account.id}
                  className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden transform transition-all hover:scale-[1.01]"
                >
                  <div className="p-1 sm:p-2 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center space-x-3 px-4 py-2">
                       <div className={`${account.logoColor} p-2 rounded-xl text-white shadow-lg`}>
                         <Building2 size={24} />
                       </div>
                       <div>
                         <h3 className="text-lg font-bold text-gray-800">{account.bankName}</h3>
                         <p className="text-sm text-gray-500 font-medium">{account.branchName}</p>
                       </div>
                    </div>
                    <div className="hidden sm:block px-6">
                      <ShieldCheck className="text-green-500 h-6 w-6" />
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Left: Account Basics */}
                      <div className="space-y-6">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                            Hesap Sahibi
                          </label>
                          <p className="text-gray-800 font-semibold text-lg">
                            SİSTEM İLAÇLAMA SAN. VE TİC. LTD. ŞTİ.
                          </p>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                            Hesap Numarası
                          </label>
                          <p className="text-gray-800 font-mono text-xl tracking-tight">
                            {account.accountNumber}
                          </p>
                        </div>
                      </div>

                      {/* Right: IBAN */}
                      <div className="flex flex-col justify-end">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 text-right md:text-left">
                          IBAN Numarası
                        </label>
                        <div className="relative group">
                          <div className="bg-gray-50 rounded-2xl p-4 border-2 border-dashed border-gray-200 group-hover:border-blue-300 transition-colors flex items-center justify-between">
                            <span className="text-gray-800 font-mono font-bold text-lg overflow-hidden text-ellipsis whitespace-nowrap">
                              {account.iban}
                            </span>
                            <button
                              onClick={() => copyToClipboard(account.iban, account.id)}
                              className="ml-4 flex-shrink-0 bg-white p-3 rounded-xl shadow-sm border border-gray-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110 active:scale-95"
                              title="IBAN'ı Kopyala"
                            >
                              {copiedId === account.id ? (
                                <CheckCircle className="h-5 w-5" />
                              ) : (
                                <Copy className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                          {copiedId === account.id && (
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1.5 px-3 rounded-lg animate-bounce shadow-xl">
                              Kopyalandı!
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Info Footer */}
            <div className="mt-16 bg-white rounded-3xl p-8 border border-gray-100 shadow-lg text-center">
              <div className="flex justify-center mb-6">
                 <div className="bg-blue-50 p-4 rounded-full">
                    <Building className="h-8 w-8 text-blue-600" />
                 </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Firma Bilgilerimize Mi İhtiyacınız Var?</h3>
              <p className="text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
                Vergi dairesi, vergi numarası ve resmi adres gibi diğer cari bilgilerimize Firma Bilgileri sayfasından ulaşabilirsiniz.
              </p>
              <Link 
                to="/firma-bilgileri"
                className="inline-flex items-center space-x-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all hover:shadow-2xl hover:shadow-black/20 group"
              >
                <span>Firma Bilgilerini Görüntüle</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Footer */}
      <section className="py-12 bg-white border-t border-gray-100 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all">
             <div className="flex items-center space-x-2">
               <ShieldCheck className="h-6 w-6" />
               <span className="font-bold text-lg">Güvenli Ödeme</span>
             </div>
             <div className="flex items-center space-x-2">
               <CreditCard className="h-6 w-6" />
               <span className="font-bold text-lg">EFT / Havale</span>
             </div>
          </div>
          <p className="mt-8 text-gray-400 text-sm">
            © {new Date().getFullYear()} Sistem İlaçlama San. ve Tic. Ltd. Şti. Tüm Hakları Saklıdır.
          </p>
        </div>
      </section>
    </div>
  );
};

export default BankAccountPage;