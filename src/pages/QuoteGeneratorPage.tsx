import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Download, Plus, Trash2, Save, DollarSign, Calendar, User, Building, CheckCircle, AlertTriangle, Percent, Edit, Image, GripVertical, FileText, Upload, RefreshCw, X } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase'; // Supabase client'ınızın doğru yapılandırıldığından emin olun.

// --- Veri Yapıları (İsteklerinize Göre Güncellendi) ---
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
  user_id?: string; // Supabase RLS için
}

// --- Varsayılan Teklif Oluşturucu ---
const createNewQuote = (): Quote => ({
    id: uuidv4(),
    quote_number: `TEK-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`,
    client_name: '',
    quote_date: new Date().toISOString().split('T')[0],
    valid_until: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [{ id: uuidv4(), name: '', description: '', quantity: 1, unitPrice: 0, taxRate: 20, discount: 0, discountType: 'fixed' }],
    issuer_company: 'PestMentor',
    subtotal_discount: 0,
    subtotal_discount_type: 'fixed',
    terms: 'Fiyatlarımıza KDV dahil değildir. Bu teklif yukarıda belirtilen tarihe kadar geçerlidir.'
});

// --- Ana Bileşen ---
const QuoteGeneratorFinal = () => {
    const [quote, setQuote] = useState<Quote>(createNewQuote());
    const [savedQuotes, setSavedQuotes] = useState<Quote[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
    const quotePreviewRef = useRef<HTMLDivElement>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);

    // --- Mesaj Yönetimi ---
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [message]);
    
    // --- Veri Çekme ---
    const fetchQuotes = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await supabase.from('quotes').select('*').order('created_at', { ascending: false });
        if (error) {
            setMessage({ type: 'error', text: 'Teklifler yüklenirken hata oluştu: ' + error.message });
        } else {
            setSavedQuotes(data as Quote[]);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchQuotes();
    }, [fetchQuotes]);

    // --- Hesaplamalar ---
    const totals = useMemo(() => {
        const subtotal = quote.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const itemDiscounts = quote.items.reduce((sum, item) => {
            const itemTotal = item.quantity * item.unitPrice;
            return sum + (item.discountType === 'percent' ? itemTotal * (item.discount / 100) : item.discount);
        }, 0);
        const subtotalAfterItemDiscounts = subtotal - itemDiscounts;
        const subtotalDiscountAmount = quote.subtotal_discount_type === 'percent'
            ? subtotalAfterItemDiscounts * (quote.subtotal_discount / 100)
            : quote.subtotal_discount;
        const totalDiscount = itemDiscounts + subtotalDiscountAmount;
        const finalSubtotal = subtotal - totalDiscount;
        const taxAmount = quote.items.reduce((sum, item) => {
            const itemTotal = item.quantity * item.unitPrice;
            const itemDiscount = item.discountType === 'percent' ? itemTotal * (item.discount / 100) : item.discount;
            return sum + ((itemTotal - itemDiscount) * (item.taxRate / 100));
        }, 0);
        const totalAmount = finalSubtotal + taxAmount;
        return { subtotal, totalDiscount, finalSubtotal, taxAmount, totalAmount };
    }, [quote.items, quote.subtotal_discount, quote.subtotal_discount_type]);

    // --- Handler Fonksiyonları ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setQuote(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
    };

    const handleItemChange = (id: string, field: keyof QuoteItem, value: any) => {
        const numericFields = ['quantity', 'unitPrice', 'taxRate', 'discount'];
        setQuote(p => ({ ...p, items: p.items.map(i => i.id === id ? { ...i, [field]: numericFields.includes(field) ? parseFloat(value) || 0 : value } : i) }));
    };

    const addItem = () => setQuote(p => ({ ...p, items: [...p.items, { id: uuidv4(), name: '', description: '', quantity: 1, unitPrice: 0, taxRate: 20, discount: 0, discountType: 'fixed' }] }));
    const removeItem = (id: string) => { if (quote.items.length > 1) setQuote(p => ({ ...p, items: p.items.filter(i => i.id !== id) })) };

    const handleOnDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const items = Array.from(quote.items);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setQuote(prev => ({ ...prev, items }));
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsSaving(true);
        const fileName = `${uuidv4()}-${file.name}`;
        const { error } = await supabase.storage.from('logos').upload(fileName, file);
        if (error) {
            setMessage({ type: 'error', text: 'Logo yüklenemedi: ' + error.message });
            setIsSaving(false);
            return;
        }
        const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(fileName);
        setQuote(prev => ({ ...prev, issuer_logo_url: publicUrl }));
        setIsSaving(false);
    };

    const handleSaveQuote = async () => {
        setIsSaving(true);
        const { error } = await supabase.from('quotes').upsert(quote);
        if (error) {
            setMessage({ type: 'error', text: 'Teklif kaydedilemedi: ' + error.message });
        } else {
            setMessage({ type: 'success', text: 'Teklif başarıyla kaydedildi!' });
            await fetchQuotes();
        }
        setIsSaving(false);
    };

    const handleDeleteQuote = async (id: string) => {
        if (!window.confirm("Bu teklifi silmek istediğinizden emin misiniz?")) return;
        const { error } = await supabase.from('quotes').delete().match({ id });
        if (error) setMessage({ type: 'error', text: 'Teklif silinemedi.' });
        else {
            setMessage({ type: 'success', text: 'Teklif silindi.' });
            setQuote(createNewQuote());
            await fetchQuotes();
        }
    };

    const loadQuote = (selectedQuote: Quote) => {
      setQuote(selectedQuote);
      setMessage({ type: 'info', text: `${selectedQuote.quote_number} numaralı teklif yüklendi.`});
    };

    const generateDocument = async (format: 'pdf' | 'jpeg') => { /* ... önceki stabil versiyon ile aynı ... */ };
    const formatCurrency = (amount: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sol Panel: Form Alanları */}
            <main className="w-full lg:w-7/12 p-4 md:p-6 overflow-y-auto">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* ... form içeriği ... */}
                    {/* TEKLİF KALEMLERİ (SÜRÜKLE BIRAK ÖZELLİKLİ) */}
                     <div className="bg-white p-4 md:p-6 rounded-lg shadow">
                         <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Teklif Kalemleri</h2>
                            <button onClick={addItem} className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-semibold flex items-center hover:bg-blue-700 transition-all"><Plus className="h-4 mr-1"/>Kalem Ekle</button>
                         </div>
                         <DragDropContext onDragEnd={handleOnDragEnd}>
                            <Droppable droppableId="quoteItems">
                                {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                                    {quote.items.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps} className="grid grid-cols-12 gap-x-3 gap-y-2 border p-3 rounded-lg bg-gray-50/80 shadow-sm relative">
                                            <div {...provided.dragHandleProps} className="absolute top-3 -left-2 text-gray-400 cursor-grab hover:text-gray-600"><GripVertical size={16}/></div>
                                            {/* Form Alanları */}
                                            <div className="col-span-12 md:col-span-5"><label className="text-xs font-medium text-gray-600">Hizmet/Ürün</label><input type="text" value={item.name} onChange={e => handleItemChange(item.id, 'name', e.target.value)} placeholder="Hizmet Adı" className="w-full mt-1 p-2 border rounded-md text-sm"/></div>
                                            <div className="col-span-12 md:col-span-7"><label className="text-xs font-medium text-gray-600">Açıklama</label><input type="text" value={item.description} onChange={e => handleItemChange(item.id, 'description', e.target.value)} placeholder="Detaylar" className="w-full mt-1 p-2 border rounded-md text-sm"/></div>
                                            <div className="col-span-6 sm:col-span-3 md:col-span-2"><label className="text-xs font-medium text-gray-600">Miktar</label><input type="number" value={item.quantity} onChange={e => handleItemChange(item.id, 'quantity', e.target.value)} className="w-full mt-1 p-2 border rounded-md text-sm"/></div>
                                            <div className="col-span-6 sm:col-span-3 md:col-span-2"><label className="text-xs font-medium text-gray-600">Birim Fiyat</label><input type="number" value={item.unitPrice} onChange={e => handleItemChange(item.id, 'unitPrice', e.target.value)} className="w-full mt-1 p-2 border rounded-md text-sm"/></div>
                                            <div className="col-span-12 sm:col-span-6 md:col-span-4 flex items-end space-x-2">
                                                <div className="flex-grow"><label className="text-xs font-medium text-gray-600">İndirim</label><input type="number" value={item.discount} onChange={e => handleItemChange(item.id, 'discount', e.target.value)} className="w-full mt-1 p-2 border rounded-md text-sm"/></div>
                                                <select value={item.discountType} onChange={e => handleItemChange(item.id, 'discountType', e.target.value)} className="h-10 mt-1 border rounded-md text-sm"><option value="fixed">₺</option><option value="percent">%</option></select>
                                            </div>
                                            <div className="col-span-12 sm:col-span-6 md:col-span-2 flex items-end">
                                                <button onClick={() => removeItem(item.id)} className="w-full h-10 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-100 rounded-md transition-colors"><Trash2 size={18}/></button>
                                            </div>
                                        </div>
                                        )}
                                    </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                                )}
                            </Droppable>
                         </DragDropContext>
                    </div>
                </div>
            </main>
            
            {/* Sağ Panel: Özet, Önizleme ve İşlemler */}
            <aside className="hidden lg:block w-5/12 bg-white p-6 border-l border-gray-200">
                <div className="sticky top-6 space-y-6">
                    {/* ... Canlı Özet, Kaydedilmiş Teklifler ve İşlem Butonları ... */}
                </div>
            </aside>
        </div>
    );
};

export default QuoteGeneratorFinal;