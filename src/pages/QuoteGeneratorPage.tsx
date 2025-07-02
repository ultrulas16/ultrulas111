// Gerekli kütüphaneleri import ediyoruz. Sürükle-bırak için 'react-beautiful-dnd' ekledik.
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Download, Plus, Trash2, Save, DollarSign, Calendar, User, Building, CheckCircle, AlertTriangle, Percent, Edit, Image, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase'; // Supabase client'ınızın doğru yapılandırıldığından emin olun.

// Tipleri tanımlıyoruz
interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  discount: number; // YENİ: Kalem bazında indirim
  discountType: 'percent' | 'fixed'; // YENİ: İndirim türü
}

interface Quote {
  id: string;
  quote_number: string;
  client_name: string;
  client_company?: string;
  client_email?: string;
  client_phone?: string;
  client_address?: string;
  quote_date: string;
  valid_until: string;
  items: QuoteItem[];
  notes?: string;
  terms?: string;
  issuer_company: string;
  issuer_logo_url?: string; // İYİLEŞTİRME: base64 yerine URL tutuyoruz
  subtotal_discount: number; // YENİ: Ara toplam indirimi
  subtotal_discount_type: 'percent' | 'fixed';
  // user_id alanı RLS için eklenebilir
}

// Varsayılan değerler için bir fonksiyon
const createNewQuote = (): Quote => ({
    id: uuidv4(),
    quote_number: `TEK-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
    client_name: '',
    quote_date: new Date().toISOString().split('T')[0],
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [{ id: uuidv4(), description: '', quantity: 1, unitPrice: 0, taxRate: 20, discount: 0, discountType: 'fixed' }],
    issuer_company: 'PestMentor',
    subtotal_discount: 0,
    subtotal_discount_type: 'fixed',
    terms: 'Fiyatlarımıza KDV dahil değildir. Bu teklif yukarıda belirtilen tarihe kadar geçerlidir.'
});

// Ana Bileşen
const AdvancedQuoteGenerator = () => {
  const [quote, setQuote] = useState<Quote>(createNewQuote());
  const [savedQuotes, setSavedQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const quotePreviewRef = useRef<HTMLDivElement>(null);

  // --- Veri Çekme ---
  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('quotes').select('*').order('created_at', { ascending: false });
    if (error) {
      setMessage({ type: 'error', text: 'Kaydedilmiş teklifler yüklenemedi.' });
    } else {
      setSavedQuotes(data as Quote[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  // --- Hesaplamalar ---
  const totals = useMemo(() => {
    const subtotal = quote.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    
    const itemDiscounts = quote.items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.unitPrice;
      return sum + (item.discountType === 'percent' ? itemTotal * (item.discount / 100) : item.discount);
    }, 0);

    const subtotalAfterItemDiscounts = subtotal - itemDiscounts;

    const subtotalDiscountAmount = quote.subtotal_discount_type === 'percent'
      ? subtotalAfterItemDiscounts * (quote.subtotal_discount / 100)
      : quote.subtotal_discount;

    const totalDiscount = itemDiscounts + subtotalDiscountAmount;
    const discountedSubtotal = subtotal - totalDiscount;

    const taxAmount = quote.items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.unitPrice;
      const itemDiscount = item.discountType === 'percent' ? itemTotal * (item.discount / 100) : item.discount;
      const discountedItemTotal = itemTotal - itemDiscount;
      return sum + (discountedItemTotal * (item.taxRate / 100));
    }, 0);

    const totalAmount = discountedSubtotal + taxAmount;

    return { subtotal, totalDiscount, discountedSubtotal, taxAmount, totalAmount };
  }, [quote.items, quote.subtotal_discount, quote.subtotal_discount_type]);

  // --- Handler Fonksiyonları ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setQuote(prev => ({ ...prev, [name]: isNumber ? parseFloat(value) || 0 : value }));
  };

  const handleItemChange = (id: string, field: keyof QuoteItem, value: any) => {
    setQuote(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };
  
  const addItem = () => setQuote(p => ({ ...p, items: [...p.items, { id: uuidv4(), description: '', quantity: 1, unitPrice: 0, taxRate: 20, discount: 0, discountType: 'fixed' }] }));
  const removeItem = (id: string) => setQuote(p => ({ ...p, items: p.items.filter(item => item.id !== id) }));
  
  // YENİ ÖZELLİK: Sürükle-bırak ile sıralama
  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(quote.items);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setQuote(prev => ({ ...prev, items }));
  };

  // İYİLEŞTİRME: Logo yükleme Supabase Storage'a
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = `${uuidv4()}-${file.name}`;
    const { data, error } = await supabase.storage.from('logos').upload(fileName, file);

    if (error) {
        setMessage({ type: 'error', text: 'Logo yüklenemedi.' });
        return;
    }
    
    const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(data.path);
    setQuote(prev => ({ ...prev, issuer_logo_url: publicUrl }));
  };

  // İYİLEŞTİRME: Supabase'e kaydetme/güncelleme
  const handleSaveQuote = async () => {
    setIsSaving(true);
    const { data, error } = await supabase.from('quotes').upsert(quote).select();

    if (error) {
      setMessage({ type: 'error', text: 'Teklif kaydedilemedi.' });
    } else if (data) {
      setMessage({ type: 'success', text: 'Teklif başarıyla kaydedildi!' });
      fetchQuotes(); // Listeyi yenile
    }
    setIsSaving(false);
  };
  
  const handleDeleteQuote = async (id: string) => {
      if (!window.confirm("Bu teklifi silmek istediğinizden emin misiniz?")) return;
      const { error } = await supabase.from('quotes').delete().match({ id });
      if (error) {
        setMessage({ type: 'error', text: 'Teklif silinemedi.' });
      } else {
        setMessage({ type: 'success', text: 'Teklif silindi.' });
        fetchQuotes(); // Listeyi yenile
      }
  };

  const loadQuote = (selectedQuote: Quote) => {
      setQuote(selectedQuote);
      setMessage({ type: 'info', text: `${selectedQuote.quote_number} numaralı teklif yüklendi.`});
  };

  // İYİLEŞTİRME: PDF/JPEG oluşturma
  const generateDocument = async (format: 'pdf' | 'jpeg') => {
    if (!quotePreviewRef.current) return;
    setLoading(true);
    const element = quotePreviewRef.current;
    
    // Geçici olarak kenar boşluklarını kaldırıp tekrar eklemek için
    element.classList.add('p-0');
    
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    
    element.classList.remove('p-0');

    if (format === 'pdf') {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Teklif-${quote.quote_number}.pdf`);
    } else {
      const link = document.createElement('a');
      link.download = `Teklif-${quote.quote_number}.jpg`;
      link.href = canvas.toDataURL('image/jpeg');
      link.click();
    }
    setLoading(false);
  };
  
  const formatCurrency = (amount: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sol Panel: Formlar */}
      <div className="w-1/2 p-6 overflow-y-auto">
        {/* ... form içeriği ... */}
      </div>

// Sağ Panel: Canlı Önizleme ve Özet
// ...
<div ref={quotePreviewRef} className="flex-grow border rounded-lg p-7 overflow-y-auto bg-white shadow-inner"> {/* Değişiklik: p-8 -> p-7 */}
    {/* Önizleme içeriği buraya gelecek. */}
    <header className="flex justify-between items-start pb-4 border-b mb-6"> {/* Değişiklik: pb-6 mb-8 -> pb-4 mb-6 */}
        <div>
            {/* Değişiklik: text-3xl -> text-2xl ve text-sm -> text-xs */}
            <h1 className="text-2xl font-bold text-gray-800">FİYAT TEKLİFİ</h1>
            <p className="text-xs text-gray-500 mt-1">Teklif No: {quote.quote_number}</p>
        </div>
        {quote.issuer_logo_url ?
            <img src={quote.issuer_logo_url} alt="Logo" className="h-14 object-contain" /> // Değişiklik: h-16 -> h-14
            : <h2 className="text-xl font-bold text-gray-700">{quote.issuer_company}</h2>
        }
    </header>

    <section className="grid grid-cols-2 gap-6 mb-6 text-xs"> {/* Değişiklik: gap-8 mb-8 -> gap-6 mb-6 ve text-sm -> text-xs */}
        <div>
            <h3 className="font-semibold text-gray-500 uppercase tracking-wider mb-2">MÜŞTERİ BİLGİLERİ</h3>
            <p className="font-bold text-sm text-gray-800">{quote.client_name || 'Müşteri Adı'}</p>
            {quote.client_company && <p className="text-gray-600">{quote.client_company}</p>}
            <p className="text-gray-600 mt-1">{quote.client_address || 'Müşteri Adresi'}</p>
            <p className="text-gray-600">{quote.client_phone || 'Telefon'}</p>
            <p className="text-gray-600">{quote.client_email || 'E-posta'}</p>
        </div>
        <div className="text-right">
            <h3 className="font-semibold text-gray-500 uppercase tracking-wider mb-2">TEKLİF BİLGİLERİ</h3>
            <p><span className="font-semibold text-gray-600">Teklif Tarihi:</span> {new Date(quote.quote_date).toLocaleDateString('tr-TR')}</p>
            <p><span className="font-semibold text-gray-600">Geçerlilik Tarihi:</span> {new Date(quote.valid_until).toLocaleDateString('tr-TR')}</p>
        </div>
    </section>

    {/* Değişiklik: tablo ve içerisindeki tüm metinler için text-xs sınıfı eklendi */}
    <section className="mb-6">
        <table className="w-full text-xs">
            <thead className="bg-gray-50">
                <tr>
                    <th className="p-2 text-left font-semibold text-gray-600 border-b border-gray-200">#</th>
                    <th className="p-2 text-left font-semibold text-gray-600 border-b border-gray-200 w-2/5">Açıklama</th>
                    <th className="p-2 text-right font-semibold text-gray-600 border-b border-gray-200">Miktar</th>
                    <th className="p-2 text-right font-semibold text-gray-600 border-b border-gray-200">Birim Fiyat</th>
                    <th className="p-2 text-right font-semibold text-gray-600 border-b border-gray-200">İndirim</th>
                    <th className="p-2 text-right font-semibold text-gray-600 border-b border-gray-200">Toplam</th>
                </tr>
            </thead>
            <tbody>
                {quote.items.map((item, index) => {
                    const itemTotal = item.quantity * item.unitPrice;
                    const discountAmount = item.discountType === 'percent' ? itemTotal * (item.discount / 100) : item.discount;
                    return (
                        <tr key={item.id} className="border-b border-gray-100">
                            <td className="p-2">{index + 1}</td>
                            <td className="p-2">{item.description}</td>
                            <td className="p-2 text-right">{item.quantity}</td>
                            <td className="p-2 text-right">{formatCurrency(item.unitPrice)}</td>
                            <td className="p-2 text-right text-red-600">
                                {discountAmount > 0 && `-${formatCurrency(discountAmount)}`}
                            </td>
                            <td className="p-2 text-right font-medium">{formatCurrency(itemTotal - discountAmount)}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </section>

    <div className="flex justify-end">
        <div className="w-1/2 max-w-xs text-xs space-y-1"> {/* Değişiklik: text-sm -> text-xs */}
            <div className="flex justify-between">
                <span className="text-gray-600">Ara Toplam:</span>
                <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-600">Genel İndirim:</span>
                <span className="font-medium text-red-600">-{formatCurrency(totals.totalDiscount - (totals.subtotal - totals.discountedSubtotal))}</span>
            </div>
            <div className="flex justify-between border-t pt-1 mt-1">
                <span className="text-gray-600">İndirimli Ara Toplam:</span>
                <span className="font-medium">{formatCurrency(totals.discountedSubtotal)}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-600">KDV Toplamı:</span>
                <span className="font-medium">{formatCurrency(totals.taxAmount)}</span>
            </div>
            <div className="flex justify-between font-bold text-base text-gray-800 border-t-2 border-gray-300 pt-2 mt-2"> {/* Değişiklik: text-xl -> text-base */}
                <span>GENEL TOPLAM:</span>
                <span>{formatCurrency(totals.totalAmount)}</span>
            </div>
        </div>
    </div>

    {(quote.notes || quote.terms) && (
    <footer className="mt-8 pt-4 border-t text-xs text-gray-600">
        {quote.notes && (
            <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-1">Notlar</h4>
                <p className="whitespace-pre-wrap">{quote.notes}</p>
            </div>
        )}
        {quote.terms && (
            <div>
                <h4 className="font-semibold text-gray-700 mb-1">Şartlar</h4>
                <p className="whitespace-pre-wrap">{quote.terms}</p>
            </div>
        )}
    </footer>
    )}
</div>

export default AdvancedQuoteGenerator;