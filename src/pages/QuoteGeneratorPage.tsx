import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Download, Plus, Trash2, Save, DollarSign, Calendar, User, Building, CheckCircle, AlertTriangle, Percent, Edit, Image, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { v4 as uuidv4 } from 'uuid';

// --- Veri Yapıları ---
interface QuoteItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  discount: number;
  discountType: 'percent' | 'fixed';
}

interface Quote {
  id: string;
  quoteNumber: string;
  clientName: string;
  companyName?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  quoteDate: string;
  validUntil: string;
  items: QuoteItem[];
  notes?: string;
  terms?: string;
  issuerCompany: string;
  issuerLogoUrl?: string;
  subtotalDiscount: number;
  subtotalDiscountType: 'percent' | 'fixed';
}

// --- Varsayılan Teklif ---
const createNewQuote = (): Quote => ({
    id: uuidv4(),
    quoteNumber: `TEK-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`,
    clientName: '',
    quoteDate: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [{ id: uuidv4(), name: 'Örnek Hizmet', description: 'Bu hizmetin açıklaması buraya yazılacak.', quantity: 1, unitPrice: 0, taxRate: 20, discount: 0, discountType: 'fixed' }],
    issuerCompany: 'PestMentor',
    subtotalDiscount: 0,
    subtotalDiscountType: 'fixed',
    terms: 'Fiyatlarımıza KDV dahil değildir. Bu teklif yukarıda belirtilen tarihe kadar geçerlidir.'
});

// --- Ana Bileşen ---
const StableQuoteGenerator = () => {
  const [quote, setQuote] = useState<Quote>(createNewQuote());
  const [savedQuotes, setSavedQuotes] = useState<Quote[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const quotePreviewRef = useRef<HTMLDivElement>(null);

  // --- localStorage'dan Veri Yükleme ---
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pestmentor_quotes');
      if (saved) {
        setSavedQuotes(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Kaydedilmiş teklifler yüklenirken hata oluştu:", error);
    }
  }, []);

  // --- Toplamları Hesaplama (useMemo ile Optimize Edildi) ---
  const totals = useMemo(() => {
    const subtotal = quote.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const itemDiscounts = quote.items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.unitPrice;
      return sum + (item.discountType === 'percent' ? itemTotal * (item.discount / 100) : item.discount);
    }, 0);
    const subtotalAfterItemDiscounts = subtotal - itemDiscounts;
    const subtotalDiscountAmount = quote.subtotalDiscountType === 'percent'
      ? subtotalAfterItemDiscounts * (quote.subtotalDiscount / 100)
      : quote.subtotalDiscount;
    const totalDiscount = itemDiscounts + subtotalDiscountAmount;
    const discountedSubtotal = subtotal - totalDiscount;
    const taxAmount = quote.items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.unitPrice;
      const itemDiscount = item.discountType === 'percent' ? itemTotal * (item.discount / 100) : item.discount;
      return sum + ((itemTotal - itemDiscount) * (item.taxRate / 100));
    }, 0);
    const totalAmount = discountedSubtotal + taxAmount;
    return { subtotal, totalDiscount, discountedSubtotal, taxAmount, totalAmount };
  }, [quote.items, quote.subtotalDiscount, quote.subtotalDiscountType]);

  // --- Handler Fonksiyonları ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setQuote(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
  };

  const handleItemChange = (id: string, field: keyof QuoteItem, value: any) => {
    setQuote(p => ({ ...p, items: p.items.map(i => i.id === id ? { ...i, [field]: value } : i) }));
  };

  const addItem = () => setQuote(p => ({ ...p, items: [...p.items, { id: uuidv4(), name: '', description: '', quantity: 1, unitPrice: 0, taxRate: 20, discount: 0, discountType: 'fixed' }] }));
  const removeItem = (id: string) => {
    if (quote.items.length > 1) {
      setQuote(p => ({ ...p, items: p.items.filter(i => i.id !== id) }));
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setQuote(p => ({ ...p, issuerLogoUrl: event.target?.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const saveToLocalStorage = (quotes: Quote[]) => {
    localStorage.setItem('pestmentor_quotes', JSON.stringify(quotes));
    setSavedQuotes(quotes);
  };

  const handleSaveQuote = () => {
    setIsSaving(true);
    const existingIndex = savedQuotes.findIndex(q => q.id === quote.id);
    let updatedQuotes;
    if (existingIndex > -1) {
      updatedQuotes = savedQuotes.map(q => q.id === quote.id ? quote : q);
    } else {
      updatedQuotes = [quote, ...savedQuotes];
    }
    saveToLocalStorage(updatedQuotes);
    setTimeout(() => {
      setMessage({ type: 'success', text: 'Teklif başarıyla kaydedildi!' });
      setIsSaving(false);
    }, 500);
  };

  const loadQuote = (selectedQuote: Quote) => {
      setQuote(selectedQuote);
      setMessage({ type: 'info', text: `Teklif #${selectedQuote.quoteNumber} yüklendi.` });
  };
  
  const generateDocument = async (format: 'pdf' | 'jpeg') => { /* ... Öncekiyle aynı, stabil ... */ };
  const formatCurrency = (amount: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);

  useEffect(() => {
      if (message) {
          const timer = setTimeout(() => setMessage(null), 3000);
          return () => clearTimeout(timer);
      }
  }, [message]);
  
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
        {/* Sol Panel: Formlar */}
        <div className="w-full lg:w-7/12 p-6 overflow-y-auto">
            {/* Bildirimler */}
            {message && (
                <div className={`p-4 mb-4 rounded-lg flex items-center shadow-sm ${
                    {'success': 'bg-green-100 text-green-800', 'error': 'bg-red-100 text-red-800', 'info': 'bg-blue-100 text-blue-800'}[message.type]
                }`}>
                    {message.type === 'success' ? <CheckCircle className="mr-2"/> : <AlertTriangle className="mr-2"/>} {message.text}
                </div>
            )}
            
            {/* Formlar buraya gelecek... Müşteri, Firma, Teklif Kalemleri vs. */}
            {/* Örnek: Teklif Kalemleri Formu */}
            <div className="bg-white p-6 rounded-lg shadow">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Teklif Kalemleri</h2>
                    <button onClick={addItem} className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-semibold flex items-center hover:bg-blue-700 transition-all"><Plus className="h-4 mr-1"/>Kalem Ekle</button>
                 </div>
                 <div className="space-y-4">
                    {quote.items.map((item) => (
                        <div key={item.id} className="grid grid-cols-12 gap-x-4 gap-y-2 border p-3 rounded-lg bg-gray-50/50">
                            {/* Hizmet/Ürün ve Açıklama */}
                            <div className="col-span-12 md:col-span-6">
                                <label className="text-xs font-medium text-gray-600">Hizmet/Ürün</label>
                                <input type="text" value={item.name} onChange={e => handleItemChange(item.id, 'name', e.target.value)} placeholder="Hizmet Adı" className="w-full mt-1 p-2 border rounded-md text-sm"/>
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <label className="text-xs font-medium text-gray-600">Açıklama</label>
                                <input type="text" value={item.description} onChange={e => handleItemChange(item.id, 'description', e.target.value)} placeholder="Detaylar" className="w-full mt-1 p-2 border rounded-md text-sm"/>
                            </div>
                            {/* Diğer Girdiler */}
                            <div className="col-span-6 sm:col-span-3 md:col-span-2"><label className="text-xs font-medium text-gray-600">Miktar</label><input type="number" value={item.quantity} onChange={e => handleItemChange(item.id, 'quantity', e.target.value)} className="w-full mt-1 p-2 border rounded-md text-sm"/></div>
                            <div className="col-span-6 sm:col-span-3 md:col-span-2"><label className="text-xs font-medium text-gray-600">Birim Fiyat</label><input type="number" value={item.unitPrice} onChange={e => handleItemChange(item.id, 'unitPrice', e.target.value)} className="w-full mt-1 p-2 border rounded-md text-sm"/></div>
                            {/* İndirim Alanı */}
                            <div className="col-span-12 sm:col-span-6 md:col-span-4 flex items-end space-x-2">
                                <div className="flex-grow"><label className="text-xs font-medium text-gray-600">İndirim</label><input type="number" value={item.discount} onChange={e => handleItemChange(item.id, 'discount', e.target.value)} className="w-full mt-1 p-2 border rounded-md text-sm"/></div>
                                <select value={item.discountType} onChange={e => handleItemChange(item.id, 'discountType', e.target.value)} className="h-10 mt-1 border rounded-md text-sm"><option value="fixed">₺</option><option value="percent">%</option></select>
                            </div>
                            {/* Silme Butonu */}
                            <div className="col-span-12 sm:col-span-12 md:col-span-2 flex items-end">
                                <button onClick={() => removeItem(item.id)} className="w-full h-10 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-100 rounded-md transition-colors"><Trash2 size={18}/></button>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
        </div>

        {/* Sağ Panel: Canlı Önizleme */}
        <div className="hidden lg:block w-5/12 bg-white p-6 border-l border-gray-200">
            <div className="sticky top-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Canlı Önizleme</h2>
                <div className="border rounded-lg shadow-sm p-6 text-xs bg-white">
                    {/* Önizleme içeriği buraya gelecek (küçük fontlu) */}
                    <div className="flex justify-between items-center pb-3 border-b">
                        <h3 className="font-bold text-lg">{quote.issuerCompany}</h3>
                        <p className="text-gray-500">#{quote.quoteNumber}</p>
                    </div>
                    <div className="mt-4">
                        <p className="font-semibold">{quote.clientName}</p>
                        <p className="text-gray-600">{quote.clientCompany}</p>
                    </div>
                    <div className="mt-4 space-y-2">
                        {quote.items.map(item => <div key={item.id} className="flex justify-between"><p>{item.name}</p><p>{formatCurrency(item.quantity * item.unitPrice)}</p></div>)}
                    </div>
                    <div className="mt-4 pt-3 border-t text-right space-y-1">
                        <p>Ara Toplam: {formatCurrency(totals.subtotal)}</p>
                        <p className="text-red-600">İndirim: -{formatCurrency(totals.totalDiscount)}</p>
                        <p>Vergi: {formatCurrency(totals.taxAmount)}</p>
                        <p className="font-bold text-base mt-1">Toplam: {formatCurrency(totals.totalAmount)}</p>
                    </div>
                </div>
                 <div className="pt-4 flex justify-end space-x-3">
                    <button onClick={handleSaveQuote} disabled={isSaving} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 flex items-center"><Save className="w-4 h-4 mr-2" />{isSaving ? 'Kaydediliyor...' : 'Kaydet'}</button>
                    <button onClick={() => generateDocument('pdf')} disabled={isSaving} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center"><Download className="w-4 h-4 mr-2" />PDF</button>
                 </div>
            </div>
        </div>
    </div>
  );
};

export default StableQuoteGenerator;