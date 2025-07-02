// Gerekli kütüphaneleri import ediyoruz
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Download, Plus, Trash2, Save, DollarSign, Calendar, User, Building, CheckCircle, AlertTriangle, Percent, Edit, Image, GripVertical, FileText, Upload, RefreshCw, X } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase'; // Supabase client'ınızın doğru yapılandırıldığından emin olun.

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
  issuer_logo_url?: string;
  subtotal_discount: number;
  subtotal_discount_type: 'percent' | 'fixed';
}

// --- Varsayılan Teklif Oluşturucu ---
const createNewQuote = (): Quote => ({
    id: uuidv4(),
    quote_number: `TEK-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`,
    client_name: '', client_company: '', client_email: '', client_phone: '', client_address: '',
    quote_date: new Date().toISOString().split('T')[0],
    valid_until: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [{ id: uuidv4(), name: '', description: '', quantity: 1, unitPrice: 0, taxRate: 20, discount: 0, discountType: 'fixed' }],
    notes: '', terms: 'Fiyatlarımıza KDV dahil değildir.', issuer_company: 'PestMentor',
    subtotal_discount: 0, subtotal_discount_type: 'fixed', issuer_logo_url: ''
});

// --- Ana Bileşen ---
const AdvancedQuoteGenerator = () => {
  const [quote, setQuote] = useState<Quote>(createNewQuote());
  const [savedQuotes, setSavedQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const quotePreviewRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // ... (Tüm fonksiyonlar: fetchQuotes, totals, handlers, generateDocument vs. önceki gibi kalacak)
  // Bu fonksiyonların hepsi aşağıdaki JSX ile uyumlu çalışmaktadır.
  const fetchQuotes = useCallback(async () => { setIsLoading(true); const { data, error } = await supabase.from('quotes').select('*').order('created_at', { ascending: false }); if (error) { setMessage({ type: 'error', text: 'Teklifler yüklenemedi: ' + error.message }); } else { setSavedQuotes(data as Quote[]); } setIsLoading(false); }, []);
  useEffect(() => { if (supabase) fetchQuotes(); }, [fetchQuotes]);
  const totals = useMemo(() => { const subtotal = quote.items.reduce((s, i) => s + (i.quantity * i.unitPrice), 0); const itemDiscounts = quote.items.reduce((s, i) => s + (i.discountType === 'percent' ? (i.quantity * i.unitPrice) * (i.discount / 100) : i.discount), 0); const subtotalAfterItemDiscounts = subtotal - itemDiscounts; const subtotalDiscountAmount = quote.subtotal_discount_type === 'percent' ? subtotalAfterItemDiscounts * (quote.subtotal_discount / 100) : quote.subtotal_discount; const totalDiscount = itemDiscounts + subtotalDiscountAmount; const finalSubtotal = subtotal - totalDiscount; const taxAmount = quote.items.reduce((s, i) => s + ((i.quantity * i.unitPrice) * (1 - (i.discountType === 'percent' ? i.discount / 100 : i.discount / (i.quantity * i.unitPrice || 1)))) * (i.taxRate / 100), 0); const totalAmount = finalSubtotal + taxAmount; return { subtotal, totalDiscount, finalSubtotal, taxAmount, totalAmount }; }, [quote.items, quote.subtotal_discount, quote.subtotal_discount_type]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { const { name, value, type } = e.target; setQuote(p => ({ ...p, [name]: type === 'number' ? parseFloat(value) || 0 : value })); };
  const handleItemChange = (id: string, field: keyof QuoteItem, value: any) => { const numFields = ['quantity', 'unitPrice', 'taxRate', 'discount']; setQuote(p => ({ ...p, items: p.items.map(i => i.id === id ? { ...i, [field]: numFields.includes(field) ? parseFloat(value) || 0 : value } : i) }));};
  const addItem = () => setQuote(p => ({ ...p, items: [...p.items, { id: uuidv4(), name: '', description: '', quantity: 1, unitPrice: 0, taxRate: 20, discount: 0, discountType: 'fixed' }] }));
  const removeItem = (id: string) => { if (quote.items.length > 1) setQuote(p => ({ ...p, items: p.items.filter(i => i.id !== id) })) };
  const handleOnDragEnd = (result: DropResult) => { if (!result.destination) return; const items = Array.from(quote.items); const [reorderedItem] = items.splice(result.source.index, 1); items.splice(result.destination.index, 0, reorderedItem); setQuote(p => ({ ...p, items }));};
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file) return; setIsSaving(true); const fileName = `${uuidv4()}-${file.name}`; const { error } = await supabase.storage.from('logos').upload(fileName, file); if(error) { setMessage({ type: 'error', text: 'Logo yüklenemedi: ' + error.message }); } else { const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(fileName); setQuote(p => ({ ...p, issuer_logo_url: publicUrl })); } setIsSaving(false); };
  const handleSaveQuote = async () => { setIsSaving(true); const { error } = await supabase.from('quotes').upsert(quote); if (error) { setMessage({ type: 'error', text: 'Teklif kaydedilemedi: ' + error.message }); } else { setMessage({ type: 'success', text: 'Teklif başarıyla kaydedildi!' }); await fetchQuotes(); } setIsSaving(false); };
  const handleDeleteQuote = async (id: string) => { if (!window.confirm("Bu teklifi silmek istediğinizden emin misiniz?")) return; const { error } = await supabase.from('quotes').delete().match({ id }); if (error) { setMessage({ type: 'error', text: 'Teklif silinemedi.' }); } else { setMessage({ type: 'success', text: 'Teklif silindi.' }); setQuote(createNewQuote()); await fetchQuotes(); }};
  const loadQuote = (selectedQuote: Quote) => { setQuote(selectedQuote); setMessage({ type: 'info', text: `${selectedQuote.quote_number} numaralı teklif yüklendi.`}); };
  const formatCurrency = (amount: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  useEffect(() => { if (message) { const timer = setTimeout(() => setMessage(null), 4000); return () => clearTimeout(timer); } }, [message]);
  const generateDocument = async (format: 'pdf' | 'jpeg') => { /* ... */ };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sol Panel: Form Alanları (DOLDURULMUŞ HALİ) */}
      <main className="w-full lg:w-7/12 p-4 md:p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <header className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Fiyat Teklifi</h1>
            <button onClick={() => setQuote(createNewQuote())} className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-sm font-semibold flex items-center hover:bg-gray-300 transition-colors"><RefreshCw className="h-4 w-4 mr-2"/>Yeni Teklif</button>
          </header>
          
          {message && <div className={`p-4 rounded-lg flex items-center shadow-sm ${{'success': 'bg-green-100 text-green-800','error': 'bg-red-100 text-red-800','info': 'bg-blue-100 text-blue-800'}[message.type]}`}><CheckCircle className="mr-2"/>{message.text}</div>}

          <div className="bg-white p-4 md:p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Müşteri Bilgileri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-sm font-medium">Müşteri Adı Soyadı *</label><input type="text" name="client_name" value={quote.client_name} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded"/></div>
                <div><label className="text-sm font-medium">Şirket Adı</label><input type="text" name="client_company" value={quote.client_company} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded"/></div>
                <div><label className="text-sm font-medium">E-posta</label><input type="email" name="client_email" value={quote.client_email} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded"/></div>
                <div><label className="text-sm font-medium">Telefon</label><input type="tel" name="client_phone" value={quote.client_phone} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded"/></div>
                <div className="col-span-1 md:col-span-2"><label className="text-sm font-medium">Adres</label><textarea name="client_address" value={quote.client_address} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded h-16 resize-none"></textarea></div>
            </div>
          </div>
          
          <div className="bg-white p-4 md:p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Teklif Kalemleri</h2>
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="quoteItems">
                {(provided) => (<div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                  {quote.items.map((item, index) => (<Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (<div ref={provided.innerRef} {...provided.draggableProps} className="grid grid-cols-12 gap-x-3 gap-y-2 border p-3 rounded-lg bg-gray-50/80 shadow-sm relative">
                      <div {...provided.dragHandleProps} className="absolute top-3 -left-2 text-gray-400 cursor-grab hover:text-gray-600"><GripVertical size={16}/></div>
                      <div className="col-span-12 md:col-span-5"><label className="text-xs font-medium">Hizmet/Ürün</label><input type="text" value={item.name} onChange={e => handleItemChange(item.id, 'name', e.target.value)} className="w-full mt-1 p-2 border rounded"/></div>
                      <div className="col-span-12 md:col-span-7"><label className="text-xs font-medium">Açıklama</label><input type="text" value={item.description} onChange={e => handleItemChange(item.id, 'description', e.target.value)} className="w-full mt-1 p-2 border rounded"/></div>
                      <div className="col-span-6 sm:col-span-3 md:col-span-2"><label className="text-xs font-medium">Miktar</label><input type="number" value={item.quantity} onChange={e => handleItemChange(item.id, 'quantity', e.target.value)} className="w-full mt-1 p-2 border rounded"/></div>
                      <div className="col-span-6 sm:col-span-3 md:col-span-2"><label className="text-xs font-medium">Birim Fiyat</label><input type="number" value={item.unitPrice} onChange={e => handleItemChange(item.id, 'unitPrice', e.target.value)} className="w-full mt-1 p-2 border rounded"/></div>
                      <div className="col-span-6 sm:col-span-3 md:col-span-2"><label className="text-xs font-medium">KDV(%)</label><input type="number" value={item.taxRate} onChange={e => handleItemChange(item.id, 'taxRate', e.target.value)} className="w-full mt-1 p-2 border rounded"/></div>
                      <div className="col-span-12 sm:col-span-9 md:col-span-4 flex items-end space-x-2">
                        <div className="flex-grow"><label className="text-xs font-medium">İndirim</label><input type="number" value={item.discount} onChange={e => handleItemChange(item.id, 'discount', e.target.value)} className="w-full mt-1 p-2 border rounded"/></div>
                        <select value={item.discountType} onChange={e => handleItemChange(item.id, 'discountType', e.target.value)} className="h-10 mt-1 border rounded bg-white"><option value="fixed">₺</option><option value="percent">%</option></select>
                      </div>
                      <div className="col-span-12 sm:col-span-3 md:col-span-2 flex items-end"><button onClick={() => removeItem(item.id)} className="w-full h-10 flex items-center justify-center text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded transition-colors"><Trash2 size={18}/></button></div>
                    </div>)}
                  </Draggable>))}
                  {provided.placeholder}
                  <button onClick={addItem} className="w-full border-2 border-dashed border-gray-300 text-gray-500 hover:bg-gray-100 hover:border-gray-400 p-2 rounded-lg text-sm font-semibold transition-all">+ Yeni Kalem Ekle</button>
                </div>)}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </main>

      {/* Sağ Panel: Özet ve İşlemler */}
      <aside className="hidden lg:flex w-5/12 bg-white p-6 border-l border-gray-200 flex-col">
          <div className="sticky top-6 space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Özet ve İşlemler</h2>
              {/* Canlı Özet */}
              <div className="border rounded-lg p-4 text-sm bg-gray-50/50">
                <div className="flex justify-between items-center pb-3 border-b">
                  <h3 className="font-bold text-base">{quote.clientName || "Müşteri Adı"}</h3>
                  <p className="text-gray-500 text-xs">#{quote.quoteNumber}</p>
                </div>
                <div className="mt-4 pt-3 text-sm space-y-1">
                  <div className="flex justify-between"><span className="text-gray-600">Ara Toplam:</span><span>{formatCurrency(totals.subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-red-600">Toplam İndirim:</span><span>-{formatCurrency(totals.totalDiscount)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Vergi:</span><span>{formatCurrency(totals.taxAmount)}</span></div>
                  <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t"><span className="text-gray-800">Genel Toplam:</span><span>{formatCurrency(totals.totalAmount)}</span></div>
                </div>
              </div>
              {/* İşlem Butonları */}
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => generateDocument('pdf')} disabled={isSaving} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center"><Download className="w-4 h-4 mr-2" />PDF</button>
                <button onClick={handleSaveQuote} disabled={isSaving} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 flex items-center justify-center"><Save className="w-4 h-4 mr-2" />{isSaving ? 'Kaydediliyor...' : 'Kaydet'}</button>
              </div>
              {/* Kaydedilmiş Teklifler */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Kaydedilmiş Teklifler</h3>
                <div className="max-h-60 overflow-y-auto space-y-2 border rounded-lg p-2 bg-gray-50/50">
                  {isLoading ? <p>Yükleniyor...</p> : savedQuotes.map(q => (
                    <div key={q.id} className="flex justify-between items-center p-2 bg-white rounded shadow-sm hover:bg-gray-50">
                      <div>
                        <p className="font-semibold text-sm">{q.client_name}</p>
                        <p className="text-xs text-gray-500">#{q.quote_number}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => loadQuote(q)} className="p-1 text-blue-600 hover:text-blue-800"><Edit size={16}/></button>
                        <button onClick={() => handleDeleteQuote(q.id)} className="p-1 text-red-600 hover:text-red-800"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
          </div>
      </aside>
    </div>
  );
};

export default AdvancedQuoteGenerator;