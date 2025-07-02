// Gerekli kütüphaneleri import ediyoruz. Sürükle-bırak için 'react-beautiful-dnd' ekledik.
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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

      {/* Sağ Panel: Canlı Önizleme ve Özet */}
      <div className="w-1/2 bg-white p-6 border-l border-gray-200 flex flex-col">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Canlı Önizleme</h2>
        <div ref={quotePreviewRef} className="flex-grow border rounded-lg p-8 overflow-y-auto bg-white shadow-inner">
            {/* Önizleme içeriği buraya gelecek. Örneğin: */}
            <header className="flex justify-between items-start pb-6 border-b">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">FİYAT TEKLİFİ</h1>
                    <p className="text-sm text-gray-500">Teklif No: {quote.quote_number}</p>
                </div>
                {quote.issuer_logo_url && <img src={quote.issuer_logo_url} alt="Logo" className="h-16 object-contain" />}
            </header>
            {/* ... Diğer önizleme detayları ... */}
            <div className="mt-8 text-right font-semibold">
                <p>Ara Toplam: {formatCurrency(totals.subtotal)}</p>
                <p className="text-red-600">İndirim: -{formatCurrency(totals.totalDiscount)}</p>
                <p>Vergi ({quote.items[0]?.taxRate}%): {formatCurrency(totals.taxAmount)}</p>
                <p className="text-2xl font-bold border-t mt-2 pt-2">Genel Toplam: {formatCurrency(totals.totalAmount)}</p>
            </div>
        </div>
        <div className="pt-6 flex justify-end space-x-3">
            <button onClick={() => generateDocument('jpeg')} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center"><Image className="w-4 h-4 mr-2" />{loading ? 'İşleniyor...' : 'JPEG'}</button>
            <button onClick={() => generateDocument('pdf')} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center"><Download className="w-4 h-4 mr-2" />{loading ? 'İşleniyor...' : 'PDF'}</button>
            <button onClick={handleSaveQuote} disabled={isSaving} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 flex items-center"><Save className="w-4 h-4 mr-2" />{isSaving ? 'Kaydediliyor...' : 'Kaydet'}</button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedQuoteGenerator;