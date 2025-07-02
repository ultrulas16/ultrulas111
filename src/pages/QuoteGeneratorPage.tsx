import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  FileText, Download, Plus, Trash2, Save, DollarSign, Calendar, User,
  Image, Building, CheckCircle, AlertTriangle, Info, Copy, Edit, X
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { v4 as uuidv4 } from 'uuid';

// --- Veri Yapıları (TypeScript Arayüzleri) ---
interface QuoteItem {
  id: string;
  name: string;          // YENİ: Ana hizmet veya ürün adı
  description: string;   // Mevcut: Artık detay açıklama için kullanılıyor
  quantity: number;
  unitPrice: number;
  taxRate: number;
  totalPrice: number;
}

interface Quote {
  id: string;
  quoteNumber: string;
  clientName: string;
  companyName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  quoteDate: string;
  validUntil: string;
  items: QuoteItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  notes: string;
  terms: string;
  issuerCompany: string;
  issuerLogo: string | null;
  footerText: string;
}

// --- Hazır Hizmetler (Yeni Yapıya Uygun) ---
const commonServices = [
    { name: 'Hamam Böceği İlaçlama', description: 'Jel ve sıvı uygulama ile garantili çözüm.', unitPrice: 450, taxRate: 20 },
    { name: 'Kemirgen Kontrol Hizmeti', description: 'İstasyon kurulumu ve periyodik kontroller.', unitPrice: 500, taxRate: 20 },
    { name: 'Sivrisinek ve Uçkun Kontrolü', description: 'Dış alan ve iç mekan ULV uygulaması.', unitPrice: 600, taxRate: 20 },
    { name: 'Periyodik Bakım Anlaşması (Aylık)', description: 'Tüm zararlılar için aylık koruyucu ziyaret.', unitPrice: 350, taxRate: 20 },
    { name: 'Dezenfeksiyon Hizmeti', description: 'COVID-19 dahil tüm virüslere karşı ULV dezenfeksiyonu.', unitPrice: 700, taxRate: 20 },
    { name: 'Keşif ve Danışmanlık', description: 'Sorun tespiti ve aksiyon planı oluşturma.', unitPrice: 0, taxRate: 20 },
];

// --- Ana Bileşen ---
const QuoteGeneratorPage = () => {
  const quotePreviewRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [savedQuotes, setSavedQuotes] = useState<Quote[]>([]);
  const [showSavedModal, setShowSavedModal] = useState(false);

  // --- Yeni Teklif Oluşturma Fonksiyonu ---
  const createNewQuote = useCallback((): Quote => ({
    id: uuidv4(),
    quoteNumber: `TEK-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    clientName: '', companyName: '', clientEmail: '', clientPhone: '', clientAddress: '',
    quoteDate: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [{ id: uuidv4(), name: '', description: '', quantity: 1, unitPrice: 0, taxRate: 20, totalPrice: 0 }],
    subtotal: 0, taxAmount: 0, totalAmount: 0, notes: '',
    terms: 'Fiyatlarımıza KDV dahil değildir. Ödeme, hizmet tamamlandığında peşin olarak alınır.',
    issuerCompany: 'PestMentor', issuerLogo: null,
    footerText: 'PestMentor © 2025 | www.pestmentor.com.tr'
  }), []);

  const [quote, setQuote] = useState<Quote>(createNewQuote());

  // --- Veri Yönetimi ve Hesaplamalar ---
  useEffect(() => {
    const saved = localStorage.getItem('pestmentor_quotes');
    if (saved) {
      setSavedQuotes(JSON.parse(saved));
    }
  }, []);

  const calculateTotals = useCallback((items: QuoteItem[]) => {
    const newItems = items.map(item => ({
      ...item,
      totalPrice: item.quantity * item.unitPrice
    }));

    const subtotal = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const taxAmount = newItems.reduce((sum, item) => sum + (item.totalPrice * (item.taxRate / 100)), 0);
    const totalAmount = subtotal + taxAmount;

    setQuote(prev => ({ ...prev, items: newItems, subtotal, taxAmount, totalAmount }));
  }, []);

  useEffect(() => {
    calculateTotals(quote.items);
  }, [quote.items, calculateTotals]);

  // --- Handler Fonksiyonları ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setQuote(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleItemChange = (id: string, field: keyof QuoteItem, value: any) => {
    const updatedItems = quote.items.map(item =>
      item.id === id ? { ...item, [field]: (field === 'quantity' || field === 'unitPrice' || field === 'taxRate') ? parseFloat(value) || 0 : value } : item
    );
    setQuote(prev => ({ ...prev, items: updatedItems }));
  };
  
  const addItem = (service?: typeof commonServices[0]) => {
    const newItem: QuoteItem = {
      id: uuidv4(),
      name: service?.name || '',
      description: service?.description || '',
      quantity: 1,
      unitPrice: service?.unitPrice || 0,
      taxRate: service?.taxRate || 20,
      totalPrice: service?.unitPrice || 0
    };
    setQuote(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const removeItem = (id: string) => {
    if (quote.items.length > 1) {
      setQuote(prev => ({ ...prev, items: prev.items.filter(item => item.id !== id) }));
    } else {
        setMessage({type: 'error', text: 'Teklifte en az bir kalem bulunmalıdır.'})
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setQuote(prev => ({ ...prev, issuerLogo: event.target?.result as string }));
      reader.readAsDataURL(file);
    }
  };
  
  const saveCurrentQuote = () => {
    const quotes = [...savedQuotes];
    const existingIndex = quotes.findIndex(q => q.id === quote.id);
    if (existingIndex > -1) {
      quotes[existingIndex] = quote;
    } else {
      quotes.unshift(quote);
    }
    localStorage.setItem('pestmentor_quotes', JSON.stringify(quotes));
    setSavedQuotes(quotes);
    setMessage({ type: 'success', text: 'Teklif başarıyla kaydedildi!' });
  };
  
  const loadQuote = (id: string) => {
    const loadedQuote = savedQuotes.find(q => q.id === id);
    if (loadedQuote) {
        setQuote(loadedQuote);
        setShowSavedModal(false);
        setMessage({ type: 'success', text: `${loadedQuote.quoteNumber} numaralı teklif yüklendi.`});
    }
  };
  
  const deleteQuote = (id: string) => {
      if(window.confirm('Bu teklifi kalıcı olarak silmek istediğinize emin misiniz?')) {
        const updatedQuotes = savedQuotes.filter(q => q.id !== id);
        localStorage.setItem('pestmentor_quotes', JSON.stringify(updatedQuotes));
        setSavedQuotes(updatedQuotes);
      }
  };

  const generateDocument = async (format: 'pdf' | 'jpeg') => {
    if (!quotePreviewRef.current) return;
    setLoading(true);
    const element = quotePreviewRef.current;
    
    // Geçici stil değişiklikleri
    const originalPadding = element.style.padding;
    element.style.padding = '2.5rem'; // A4 için daha uygun bir padding
    
    try {
        const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
        if (format === 'pdf') {
            const imgData = canvas.toDataURL('image/png', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Teklif-${quote.quoteNumber}.pdf`);
        } else {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/jpeg', 0.95);
            link.download = `Teklif-${quote.quoteNumber}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    } catch (e) {
        console.error("Rapor oluşturma hatası:", e);
        setMessage({type: 'error', text: 'Rapor oluşturulamadı.'});
    } finally {
        element.style.padding = originalPadding; // Stili geri al
        setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  
  useEffect(() => {
      if(message) {
          const timer = setTimeout(() => setMessage(null), 3000);
          return () => clearTimeout(timer);
      }
  }, [message]);

  // JSX
  return (
    <div className="container mx-auto px-4 py-8">
      {/* ... Başlık ve Mesajlar ... */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Fiyat Teklifi Oluşturucu</h1>
      {message && (
          <div className={`p-4 mb-4 rounded-lg flex items-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.type === 'success' ? <CheckCircle className="mr-2"/> : <AlertTriangle className="mr-2"/>} {message.text}
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol Sütun: Formlar */}
        <div className="lg:col-span-2 space-y-6">
          {/* ... Müşteri, Teklif, Logo, Notlar Formları ... */}
          {/* Kalemler Tablosu (Yeni Yapıya Uygun) */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Teklif Kalemleri</h2>
                <div className="flex space-x-2">
                    {/* Hazır Hizmet Ekleme */}
                    <div className="relative group">
                        <button className="bg-green-600 text-white px-3 py-1 rounded-md text-sm flex items-center"><Plus className="h-4 mr-1"/>Hazır Hizmet</button>
                        <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-md p-2 hidden group-hover:block z-20 max-h-60 overflow-y-auto">
                            {commonServices.map(s => <button key={s.name} onClick={() => addItem(s)} className="block w-full text-left text-sm p-2 hover:bg-gray-100 rounded"><div className="font-semibold">{s.name}</div><div className="text-xs text-gray-500">{s.description}</div></button>)}
                        </div>
                    </div>
                    <button onClick={() => addItem()} className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center"><Plus className="h-4 mr-1"/>Yeni Kalem</button>
                </div>
            </div>

            <div className="space-y-4">
            {quote.items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-3 border p-3 rounded-lg bg-gray-50/50">
                    <div className="col-span-12 md:col-span-5">
                        <label className="text-xs font-medium text-gray-600">Hizmet/Ürün</label>
                        <input type="text" value={item.name} onChange={e => handleItemChange(item.id, 'name', e.target.value)} placeholder="Örn: Kemirgen Kontrolü" className="w-full mt-1 p-2 border rounded-md text-sm"/>
                    </div>
                    <div className="col-span-12 md:col-span-7">
                        <label className="text-xs font-medium text-gray-600">Açıklama</label>
                        <textarea value={item.description} onChange={e => handleItemChange(item.id, 'description', e.target.value)} placeholder="Hizmet detayları..." className="w-full mt-1 p-2 border rounded-md text-sm h-12 resize-none"/>
                    </div>
                    <div className="col-span-4 md:col-span-2">
                        <label className="text-xs font-medium text-gray-600">Miktar</label>
                        <input type="number" value={item.quantity} onChange={e => handleItemChange(item.id, 'quantity', e.target.value)} className="w-full mt-1 p-2 border rounded-md text-sm"/>
                    </div>
                    <div className="col-span-4 md:col-span-3">
                        <label className="text-xs font-medium text-gray-600">Birim Fiyat (₺)</label>
                        <input type="number" value={item.unitPrice} onChange={e => handleItemChange(item.id, 'unitPrice', e.target.value)} className="w-full mt-1 p-2 border rounded-md text-sm"/>
                    </div>
                    <div className="col-span-4 md:col-span-2">
                        <label className="text-xs font-medium text-gray-600">KDV (%)</label>
                        <input type="number" value={item.taxRate} onChange={e => handleItemChange(item.id, 'taxRate', e.target.value)} className="w-full mt-1 p-2 border rounded-md text-sm"/>
                    </div>
                    <div className="col-span-12 md:col-span-5 flex items-end space-x-2">
                        <div className="flex-grow">
                             <label className="text-xs font-medium text-gray-600">Toplam</label>
                             <p className="w-full mt-1 p-2 border rounded-md text-sm bg-gray-100">{formatCurrency(item.totalPrice)}</p>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="h-10 w-10 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-100 rounded-md"><Trash2 size={18}/></button>
                    </div>
                </div>
            ))}
            </div>
          </div>
        </div>

        {/* Sağ Sütun: Önizleme ve İşlemler */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            {/* ... Özet Paneli ... */}
            <div ref={quotePreviewRef} className="hidden">
                {/* PDF/JPEG çıktısı için gizli önizleme alanı. Tasarım burada. */}
                <div className="p-10 text-xs"> {/* Font küçültüldü */}
                     <header className="flex justify-between items-start pb-4 border-b mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">FİYAT TEKLİFİ</h1>
                            <p className="text-xs text-gray-500 mt-1">Teklif No: {quote.quoteNumber}</p>
                        </div>
                        {quote.issuerLogo ? <img src={quote.issuerLogo} alt="Logo" className="h-14 object-contain" /> : <h2 className="text-xl font-bold text-gray-700">{quote.issuerCompany}</h2>}
                    </header>
                    <section className="grid grid-cols-2 gap-6 mb-6 text-xs">
                         {/* Müşteri ve Teklif Bilgileri */}
                    </section>
                    <section className="mb-6">
                        <table className="w-full text-xs">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-2 text-left font-semibold text-gray-600 border-b w-2/5">Hizmet/Ürün</th>
                                    <th className="p-2 text-right font-semibold text-gray-600 border-b">Miktar</th>
                                    <th className="p-2 text-right font-semibold text-gray-600 border-b">Birim Fiyat</th>
                                    <th className="p-2 text-right font-semibold text-gray-600 border-b">Toplam</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quote.items.map(item => (
                                    <tr key={item.id} className="border-b">
                                        <td className="p-2 align-top">
                                            <div className="font-semibold text-gray-800">{item.name}</div>
                                            <div className="text-gray-600 pl-2">{item.description}</div>
                                        </td>
                                        <td className="p-2 text-right align-top">{item.quantity}</td>
                                        <td className="p-2 text-right align-top">{formatCurrency(item.unitPrice)}</td>
                                        <td className="p-2 text-right align-top font-medium">{formatCurrency(item.totalPrice)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                    {/* ... Toplamlar ve Notlar ... */}
                </div>
            </div>
            {/* ... İşlem Butonları ... */}
            <div className="space-y-2 mt-6">
                <button onClick={() => generateDocument('pdf')} disabled={loading} className="w-full flex items-center justify-center bg-blue-600 text-white p-2.5 rounded-md hover:bg-blue-700 disabled:bg-gray-400"><Download size={18} className="mr-2"/>{loading ? 'İşleniyor...' : 'PDF İndir'}</button>
                <button onClick={() => generateDocument('jpeg')} disabled={loading} className="w-full flex items-center justify-center bg-green-600 text-white p-2.5 rounded-md hover:bg-green-700 disabled:bg-gray-400"><Image size={18} className="mr-2"/>{loading ? 'JPEG İndir...' : 'JPEG İndir'}</button>
                <button onClick={saveCurrentQuote} className="w-full flex items-center justify-center bg-indigo-600 text-white p-2.5 rounded-md hover:bg-indigo-700"><Save size={18} className="mr-2"/>Kaydet</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Kaydedilmiş Teklifler Modalı */}
      {showSavedModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] flex flex-col">
                  {/* ... Modal içeriği ... */}
              </div>
          </div>
      )}
    </div>
  );
};

export default QuoteGeneratorPage;