import React, { useState } from 'react';
import { 
  Building2, 
  Copy, 
  CheckCircle, 
  Wallet, 
  ArrowRight,
  ShieldCheck,
  Building,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

const BankAccountPage = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const companyName = "SİSTEM İLAÇLAMA SAN. VE TİC. LTD. ŞTİ.";
  const bankDetails = {
    bankName: 'GARANTİ BBVA',
    branchName: 'GAZCILAR ŞUBESİ (629)',
    iban: 'TR820006200003700006297367' // Boşluksuz format
  };

  const copyToClipboard = (text: string, fieldId: string) => {
    // Boşlukları silerek kopyala (zaten state içinde boşluksuz ama her ihtimale karşı)
    const cleanText = text.replace(/\s/g, '');
    navigator.clipboard.writeText(cleanText).then(() => {
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const copyTextOnly = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-white md:bg-gray-50 flex flex-col font-sans">
      {/* Hero Section - Premium & Dynamic */}
      <section className="bg-gradient-to-br from-[#00AB66] to-[#007A4D] py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="10" cy="10" r="30" fill="white" />
            <circle cx="90" cy="80" r="40" fill="white" />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-6 ring-1 ring-white/20">
            <Wallet className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Ödeme Bilgileri
          </h1>
          <p className="text-lg md:text-xl text-green-50 max-w-2xl mx-auto leading-relaxed px-4">
            Güvenli ödeme işlemleri için resmi banka hesap bilgilerimiz aşağıdadır.
          </p>
        </div>
      </section>

      {/* Main Content - Mobile Optimized Card */}
      <section className="py-12 -mt-10 md:-mt-16 relative z-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-[2rem] shadow-2xl shadow-green-900/10 border border-gray-100 overflow-hidden">
              
              {/* Bank Header */}
              <div className="p-6 md:p-8 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-[#00AB66] p-3 rounded-2xl text-white shadow-lg shadow-green-200">
                    <Building2 size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">{bankDetails.bankName}</h3>
                    <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">{bankDetails.branchName}</p>
                  </div>
                </div>
                <div className="bg-green-100 text-green-700 p-2 rounded-full hidden sm:block">
                  <ShieldCheck size={20} />
                </div>
              </div>

              {/* Details List */}
              <div className="p-6 md:p-10 space-y-10">
                
                {/* Company Name Section */}
                <div className="group">
                  <div className="flex justify-between items-end mb-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                      Hesap Sahibi / Ünvan
                    </label>
                    {copiedField === 'company' && (
                      <span className="text-green-600 text-[10px] font-bold animate-pulse">Kopyalandı!</span>
                    )}
                  </div>
                  <div 
                    onClick={() => copyTextOnly(companyName, 'company')}
                    className="flex items-center justify-between bg-gray-50 hover:bg-green-50 p-4 md:p-5 rounded-2xl border-2 border-transparent hover:border-green-100 transition-all cursor-pointer group"
                  >
                    <span className="text-gray-900 font-bold text-sm md:text-base leading-tight break-words pr-4">
                      {companyName}
                    </span>
                    <div className="bg-white p-2 rounded-lg shadow-sm group-hover:bg-[#00AB66] group-hover:text-white transition-colors flex-shrink-0">
                      {copiedField === 'company' ? <CheckCircle size={18} /> : <Copy size={18} />}
                    </div>
                  </div>
                </div>

                {/* IBAN Section */}
                <div className="group">
                  <div className="flex justify-between items-end mb-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                      IBAN Numarası
                    </label>
                    {copiedField === 'iban' && (
                      <span className="text-green-600 text-[10px] font-bold animate-pulse">Kopyalandı!</span>
                    )}
                  </div>
                  <div 
                    onClick={() => copyToClipboard(bankDetails.iban, 'iban')}
                    className="flex flex-col md:flex-row items-center justify-between bg-gray-50 hover:bg-green-50 p-4 md:p-5 rounded-2xl border-2 border-transparent hover:border-green-100 transition-all cursor-pointer group"
                  >
                    <span className="text-[#00AB66] font-mono font-black text-lg md:text-xl tracking-tighter break-all text-center md:text-left mb-3 md:mb-0">
                      {bankDetails.iban}
                    </span>
                    <div className="w-full md:w-auto bg-white p-3 rounded-xl shadow-sm group-hover:bg-[#00AB66] group-hover:text-white transition-colors flex items-center justify-center space-x-2">
                      <span className="text-xs font-bold md:hidden">IBAN'ı Kopyala</span>
                      {copiedField === 'iban' ? <CheckCircle size={20} /> : <Copy size={20} />}
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Info */}
              <div className="p-6 bg-green-50 border-t border-green-100 flex items-start space-x-3">
                <Info size={18} className="text-[#00AB66] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-green-800 leading-relaxed font-medium">
                  Ödeme açıklamasına fatura numaranızı veya ilgili firma adını yazmayı unutmayınız. İşleminiz onaylandığında tarafınıza bilgi iletilecektir.
                </p>
              </div>
            </div>

            {/* Support Grid */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link 
                to="/firma-bilgileri"
                className="flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-100 p-2 rounded-lg text-gray-600">
                    <Building size={20} />
                  </div>
                  <span className="font-bold text-gray-700 text-sm">Firma Bilgileri</span>
                </div>
                <ArrowRight size={18} className="text-gray-300 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
              </Link>

              <div className="flex items-center justify-center p-5 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100">
                <ShieldCheck size={20} className="text-green-600 mr-2" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Resmi Ödeme Kanalı</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Mobile Optimized */}
      <footer className="mt-auto py-10 text-center px-4">
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest leading-loose">
          © {new Date().getFullYear()} SİSTEM İLAÇLAMA SAN. VE TİC. LTD. ŞTİ.<br />
          TÜM HAKLARI SAKLIDIR.
        </p>
      </footer>
    </div>
  );
};

export default BankAccountPage;