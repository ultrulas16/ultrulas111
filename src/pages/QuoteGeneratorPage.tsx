import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  Plus, 
  Trash2, 
  Save, 
  DollarSign, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  CheckCircle, 
  X, 
  Upload,
  AlertTriangle,
  Percent,
  Info,
  Copy,
  Edit,
  Image
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  totalPrice: number;
}

interface Quote {
  id: string;
  quoteNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  companyName: string;
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

const QuoteGeneratorPage = () => {
  const [quote, setQuote] = useState<Quote>({
    id: uuidv4(),
    quoteNumber: generateQuoteNumber(),
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    companyName: '',
    quoteDate: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [
      {
        id: uuidv4(),
        description: '',
        quantity: 1,
        unitPrice: 0,
        taxRate: 10,
        totalPrice: 0
      }
    ],
    subtotal: 0,
    taxAmount: 0,
    totalAmount: 0,
    notes: '',
    terms: 'Bu teklif yukarıda belirtilen tarihe kadar geçerlidir. Fiyatlara KDV dahildir.',
    issuerCompany: 'PestMentor',
    issuerLogo: null,
    footerText: 'PestMentor © 2025 | Sistem İlaçlama San. ve Tic. Ltd. Şti. | www.pestmentor.com.tr'
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedQuotes, setSavedQuotes] = useState<Quote[]>([]);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const quoteRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Available tax rates
  const taxRates = [
    { value: 1, label: '%1' },
    { value: 10, label: '%10' },
    { value: 20, label: '%20' }
  ];

  // Common service types for quick add
  const commonServices = [
    { description: 'Hamam Böceği İlaçlama', unitPrice: 350, taxRate: 10 },
    { description: 'Kemirgen Kontrolü', unitPrice: 450, taxRate: 10 },
    { description: 'Sivrisinek İlaçlama', unitPrice: 300, taxRate: 10 },
    { description: 'Karınca İlaçlama', unitPrice: 250, taxRate: 10 },
    { description: 'Dezenfeksiyon Hizmeti', unitPrice: 500, taxRate: 10 },
    { description: 'Periyodik Bakım (Aylık)', unitPrice: 200, taxRate: 10 },
    { description: 'Kuş Kontrolü', unitPrice: 600, taxRate: 10 },
    { description: 'Fumigasyon Hizmeti', unitPrice: 1200, taxRate: 10 },
    { description: 'Keşif Hizmeti', unitPrice: 0, taxRate: 10 },
    { description: 'Acil Müdahale', unitPrice: 550, taxRate: 10 }
  ];

  useEffect(() => {
    loadSavedQuotes();
    calculateTotals();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [quote.items]);

  useEffect(() => {
    // Estimate total pages based on number of items
    // This is a rough estimate and might need adjustment
    const estimatedPages = Math.max(1, Math.ceil(quote.items.length / 10));
    setTotalPages(estimatedPages);
    
    // Reset current page if it's beyond the total
    if (currentPage > estimatedPages) {
      setCurrentPage(1);
    }
  }, [quote.items.length]);

  const loadSavedQuotes = () => {
    const saved = localStorage.getItem('pestmentor_quotes');
    if (saved) {
      try {
        setSavedQuotes(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading saved quotes:', e);
      }
    }
  };

  const saveQuotes = (quotes: Quote[]) => {
    localStorage.setItem('pestmentor_quotes', JSON.stringify(quotes));
    setSavedQuotes(quotes);
  };

  function generateQuoteNumber() {
    const prefix = 'TEK';
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${date}-${random}`;
  }

  const calculateItemTotal = (item: QuoteItem) => {
    const total = item.quantity * item.unitPrice;
    return parseFloat(total.toFixed(2));
  };

  const calculateTotals = () => {
    const items = [...quote.items];
    
    // Calculate each item's total price
    const updatedItems = items.map(item => ({
      ...item,
      totalPrice: calculateItemTotal(item)
    }));
    
    // Calculate subtotal
    const subtotal = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    // Calculate tax amount
    const taxAmount = updatedItems.reduce((sum, item) => {
      const itemTax = item.totalPrice * (item.taxRate / 100);
      return sum + itemTax;
    }, 0);
    
    // Calculate total amount
    const totalAmount = subtotal + taxAmount;
    
    setQuote(prev => ({
      ...prev,
      items: updatedItems,
      subtotal: parseFloat(subtotal.toFixed(2)),
      taxAmount: parseFloat(taxAmount.toFixed(2)),
      totalAmount: parseFloat(totalAmount.toFixed(2))
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuote(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (id: string, field: keyof QuoteItem, value: any) => {
    setQuote(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      });
      
      return { ...prev, items: updatedItems };
    });
  };

  const addItem = (predefinedService?: typeof commonServices[0]) => {
    const newItem: QuoteItem = {
      id: uuidv4(),
      description: predefinedService?.description || '',
      quantity: 1,
      unitPrice: predefinedService?.unitPrice || 0,
      taxRate: predefinedService?.taxRate || 10,
      totalPrice: predefinedService ? predefinedService.unitPrice : 0
    };
    
    setQuote(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (id: string) => {
    setQuote(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setQuote(prev => ({
            ...prev,
            issuerLogo: event.target?.result as string
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const saveQuote = () => {
    // Check if quote already exists in saved quotes
    const existingIndex = savedQuotes.findIndex(q => q.id === quote.id);
    
    if (existingIndex >= 0) {
      // Update existing quote
      const updatedQuotes = [...savedQuotes];
      updatedQuotes[existingIndex] = quote;
      saveQuotes(updatedQuotes);
    } else {
      // Add new quote
      saveQuotes([...savedQuotes, quote]);
    }
    
    setSuccess('Teklif başarıyla kaydedildi!');
    setTimeout(() => setSuccess(null), 3000);
  };

  const loadQuote = (savedQuote: Quote) => {
    setQuote(savedQuote);
    setShowSavedModal(false);
  };

  const deleteQuote = (id: string) => {
    if (window.confirm('Bu teklifi silmek istediğinizden emin misiniz?')) {
      const updatedQuotes = savedQuotes.filter(q => q.id !== id);
      saveQuotes(updatedQuotes);
    }
  };

  const resetForm = () => {
    if (window.confirm('Formu sıfırlamak istediğinizden emin misiniz? Tüm bilgiler silinecektir.')) {
      setQuote({
        id: uuidv4(),
        quoteNumber: generateQuoteNumber(),
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        clientAddress: '',
        companyName: '',
        quoteDate: new Date().toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [
          {
            id: uuidv4(),
            description: '',
            quantity: 1,
            unitPrice: 0,
            taxRate: 10,
            totalPrice: 0
          }
        ],
        subtotal: 0,
        taxAmount: 0,
        totalAmount: 0,
        notes: '',
        terms: 'Bu teklif yukarıda belirtilen tarihe kadar geçerlidir. Fiyatlara KDV dahildir.',
        issuerCompany: 'PestMentor',
        issuerLogo: null,
        footerText: 'PestMentor © 2025 | Sistem İlaçlama San. ve Tic. Ltd. Şti. | www.pestmentor.com.tr'
      });
    }
  };

  const generatePDF = async () => {
    if (!quoteRef.current) return;
    
    setLoading(true);
    
    try {
      // First, ensure the quote is properly styled for A4
      const quoteElement = quoteRef.current;
      
      // Create a PDF with A4 dimensions
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Get all page elements
      const pageElements = quoteElement.querySelectorAll('.report-page');
      
      // If no explicit pages, treat the whole quote as one page
      if (pageElements.length === 0) {
        const canvas = await html2canvas(quoteElement, {
          scale: 2,
          logging: false,
          useCORS: true,
          backgroundColor: '#ffffff'
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const imgWidth = 210; // A4 width in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      } else {
        // Process each page
        for (let i = 0; i < pageElements.length; i++) {
          if (i > 0) {
            pdf.addPage();
          }
          
          const pageElement = pageElements[i] as HTMLElement;
          const canvas = await html2canvas(pageElement, {
            scale: 2,
            logging: false,
            useCORS: true,
            backgroundColor: '#ffffff'
          });
          
          const imgData = canvas.toDataURL('image/jpeg', 1.0);
          const imgWidth = 210; // A4 width in mm
          const imgHeight = canvas.height * imgWidth / canvas.width;
          
          pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
        }
      }
      
      pdf.save(`Teklif_${quote.quoteNumber}.pdf`);
      
      setSuccess('PDF başarıyla oluşturuldu!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('PDF generation error:', error);
      setError('PDF oluşturulurken bir hata oluştu.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const generateJPEG = async () => {
    if (!quoteRef.current) return;
    
    setLoading(true);
    
    try {
      // Get all page elements
      const pageElements = quoteRef.current.querySelectorAll('.report-page');
      
      // If no explicit pages, treat the whole quote as one page
      if (pageElements.length === 0) {
        const canvas = await html2canvas(quoteRef.current, {
          scale: 2,
          logging: false,
          useCORS: true,
          backgroundColor: '#ffffff'
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        // Create a download link
        const link = document.createElement('a');
        link.href = imgData;
        link.download = `Teklif_${quote.quoteNumber}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Process each page
        for (let i = 0; i < pageElements.length; i++) {
          const pageElement = pageElements[i] as HTMLElement;
          const canvas = await html2canvas(pageElement, {
            scale: 2,
            logging: false,
            useCORS: true,
            backgroundColor: '#ffffff'
          });
          
          const imgData = canvas.toDataURL('image/jpeg', 1.0);
          
          // Create a download link
          const link = document.createElement('a');
          link.href = imgData;
          link.download = `Teklif_${quote.quoteNumber}_Sayfa${i+1}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Add a small delay between downloads
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      setSuccess('JPEG başarıyla oluşturuldu!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('JPEG generation error:', error);
      setError('JPEG oluşturulurken bir hata oluştu.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Group items by tax rate for the summary
  const getItemsByTaxRate = () => {
    const groupedItems: Record<number, { subtotal: number, tax: number }> = {};
    
    quote.items.forEach(item => {
      if (!groupedItems[item.taxRate]) {
        groupedItems[item.taxRate] = { subtotal: 0, tax: 0 };
      }
      
      groupedItems[item.taxRate].subtotal += item.totalPrice;
      groupedItems[item.taxRate].tax += item.totalPrice * (item.taxRate / 100);
    });
    
    return Object.entries(groupedItems).map(([rate, values]) => ({
      rate: parseInt(rate),
      subtotal: values.subtotal,
      tax: values.tax
    }));
  };

  // Navigate between pages in preview mode
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Fiyat Teklifi Modülü</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowSavedModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            disabled={savedQuotes.length === 0}
          >
            <FileText className="h-5 w-5" />
            <span>Kaydedilmiş Teklifler</span>
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <Image className="h-5 w-5" />
            <span>{showPreview ? 'Düzenleme Modu' : 'Önizleme Modu'}</span>
          </button>
        </div>
      </div>

      {/* Success and Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {showPreview ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Teklif Önizleme</h2>
            <div className="flex space-x-4">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
              >
                Önceki Sayfa
              </button>
              <span className="px-3 py-1 bg-gray-100 rounded-md">
                Sayfa {currentPage} / {totalPages}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
              >
                Sonraki Sayfa
              </button>
            </div>
          </div>
          
          <div className="overflow-auto max-h-[calc(100vh-250px)] bg-gray-100 p-4 rounded-lg">
            <div 
              ref={quoteRef}
              className="mx-auto bg-white shadow-lg"
              style={{ width: '210mm' }}
            >
              {/* Page 1: Quote Header and Items */}
              <div className="report-page p-10" style={{ minHeight: '297mm' }}>
                {/* Quote Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-1">FİYAT TEKLİFİ</h1>
                    <p className="text-gray-600">Teklif No: {quote.quoteNumber}</p>
                  </div>
                  <div className="text-right">
                    {quote.issuerLogo ? (
                      <img 
                        src={quote.issuerLogo} 
                        alt="Company Logo" 
                        className="h-16 object-contain mb-2" 
                      />
                    ) : (
                      <div className="h-16 flex items-center justify-end">
                        <h2 className="text-2xl font-bold text-pest-green-700">{quote.issuerCompany}</h2>
                      </div>
                    )}
                    <p className="text-gray-600">Tarih: {formatDate(quote.quoteDate)}</p>
                    <p className="text-gray-600">Geçerlilik: {formatDate(quote.validUntil)}</p>
                  </div>
                </div>

                {/* Client and Company Information */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div className="border-r pr-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">Müşteri Bilgileri</h3>
                    <p className="font-medium">{quote.clientName}</p>
                    {quote.companyName && <p className="text-gray-700">{quote.companyName}</p>}
                    {quote.clientAddress && <p className="text-gray-700">{quote.clientAddress}</p>}
                    {quote.clientPhone && (
                      <p className="text-gray-700 flex items-center mt-2">
                        <Phone className="h-4 w-4 mr-1 text-gray-500" />
                        {quote.clientPhone}
                      </p>
                    )}
                    {quote.clientEmail && (
                      <p className="text-gray-700 flex items-center">
                        <Mail className="h-4 w-4 mr-1 text-gray-500" />
                        {quote.clientEmail}
                      </p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">Teklifi Veren</h3>
                    <p className="font-medium">{quote.issuerCompany}</p>
                    <p className="text-gray-700">Kükürtlü Mahallesi Belde Caddesi</p>
                    <p className="text-gray-700">Gündüz Sokak Tan Apartmanı No:2</p>
                    <p className="text-gray-700">Osmangazi, BURSA</p>
                    <p className="text-gray-700 flex items-center mt-2">
                      <Phone className="h-4 w-4 mr-1 text-gray-500" />
                      0224 233 83 87
                    </p>
                    <p className="text-gray-700 flex items-center">
                      <Mail className="h-4 w-4 mr-1 text-gray-500" />
                      info@pestmentor.com.tr
                    </p>
                  </div>
                </div>

                {/* Quote Items */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">Teklif Kalemleri</h3>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-2 px-4 text-left border border-gray-200">Açıklama</th>
                        <th className="py-2 px-4 text-right border border-gray-200 w-20">Miktar</th>
                        <th className="py-2 px-4 text-right border border-gray-200 w-32">Birim Fiyat</th>
                        <th className="py-2 px-4 text-right border border-gray-200 w-20">KDV</th>
                        <th className="py-2 px-4 text-right border border-gray-200 w-32">Toplam</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quote.items.map((item, index) => (
                        <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="py-2 px-4 border border-gray-200">{item.description}</td>
                          <td className="py-2 px-4 text-right border border-gray-200">{item.quantity}</td>
                          <td className="py-2 px-4 text-right border border-gray-200">₺{formatCurrency(item.unitPrice)}</td>
                          <td className="py-2 px-4 text-right border border-gray-200">%{item.taxRate}</td>
                          <td className="py-2 px-4 text-right border border-gray-200 font-medium">₺{formatCurrency(item.totalPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Quote Summary */}
                <div className="flex justify-end mb-8">
                  <div className="w-64">
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Ara Toplam:</span>
                      <span>₺{formatCurrency(quote.subtotal)}</span>
                    </div>
                    
                    {/* Tax breakdown by rate */}
                    {getItemsByTaxRate().map((taxGroup, index) => (
                      <div key={index} className="flex justify-between py-2 border-b">
                        <span className="font-medium">KDV (%{taxGroup.rate}):</span>
                        <span>₺{formatCurrency(taxGroup.tax)}</span>
                      </div>
                    ))}
                    
                    <div className="flex justify-between py-2 border-b font-bold text-lg">
                      <span>Toplam:</span>
                      <span>₺{formatCurrency(quote.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* Notes and Terms */}
                {(quote.notes || quote.terms) && (
                  <div className="mb-8">
                    {quote.notes && (
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Notlar</h3>
                        <p className="text-gray-700 whitespace-pre-line">{quote.notes}</p>
                      </div>
                    )}
                    
                    {quote.terms && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Şartlar ve Koşullar</h3>
                        <p className="text-gray-700 whitespace-pre-line">{quote.terms}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="absolute bottom-10 left-10 right-10 text-center text-gray-500 text-sm border-t pt-4">
                  {quote.footerText}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setShowPreview(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Düzenleme Moduna Dön
            </button>
            
            <div className="flex space-x-4">
              <button
                onClick={generateJPEG}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>İşleniyor...</span>
                  </>
                ) : (
                  <>
                    <Image className="h-5 w-5" />
                    <span>JPEG İndir</span>
                  </>
                )}
              </button>
              
              <button
                onClick={generatePDF}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>İşleniyor...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    <span>PDF İndir</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quote Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <User className="h-6 w-6 text-blue-600 mr-2" />
                Müşteri Bilgileri
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Müşteri Adı *
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    value={quote.clientName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Müşteri adı ve soyadı"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şirket Adı
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={quote.companyName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Şirket adı (opsiyonel)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta
                  </label>
                  <input
                    type="email"
                    name="clientEmail"
                    value={quote.clientEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="E-posta adresi"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    name="clientPhone"
                    value={quote.clientPhone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Telefon numarası"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adres
                  </label>
                  <textarea
                    name="clientAddress"
                    value={quote.clientAddress}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Müşteri adresi"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Quote Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Calendar className="h-6 w-6 text-blue-600 mr-2" />
                Teklif Detayları
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teklif Numarası
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      name="quoteNumber"
                      value={quote.quoteNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      readOnly
                    />
                    <button
                      onClick={() => setQuote(prev => ({ ...prev, quoteNumber: generateQuoteNumber() }))}
                      className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r-md hover:bg-gray-300"
                      title="Yeni numara oluştur"
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teklif Tarihi *
                  </label>
                  <input
                    type="date"
                    name="quoteDate"
                    value={quote.quoteDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Geçerlilik Tarihi *
                  </label>
                  <input
                    type="date"
                    name="validUntil"
                    value={quote.validUntil}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şirket Adınız
                  </label>
                  <input
                    type="text"
                    name="issuerCompany"
                    value={quote.issuerCompany}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Şirket adınız"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şirket Logosu
                  </label>
                  <div className="flex items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200 transition-colors flex items-center"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Logo Yükle
                    </label>
                    {quote.issuerLogo && (
                      <div className="ml-4 relative">
                        <img src={quote.issuerLogo} alt="Logo" className="h-10 object-contain" />
                        <button
                          onClick={() => setQuote(prev => ({ ...prev, issuerLogo: null }))}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Bilgi Metni
                  </label>
                  <input
                    type="text"
                    name="footerText"
                    value={quote.footerText}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Alt bilgi metni"
                  />
                </div>
              </div>
            </div>

            {/* Quote Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <DollarSign className="h-6 w-6 text-blue-600 mr-2" />
                  Teklif Kalemleri
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => addItem()}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Kalem Ekle
                  </button>
                  <div className="relative group">
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors text-sm flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Hazır Hizmet
                    </button>
                    <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md p-2 hidden group-hover:block z-10 max-h-60 overflow-y-auto">
                      {commonServices.map((service, index) => (
                        <button
                          key={index}
                          onClick={() => addItem(service)}
                          className="block w-full text-left text-sm py-2 px-2 hover:bg-gray-100 rounded"
                        >
                          <div className="font-medium">{service.description}</div>
                          <div className="text-gray-600 text-xs">₺{formatCurrency(service.unitPrice)} + %{service.taxRate} KDV</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-2 px-4 text-left border border-gray-200">Açıklama</th>
                      <th className="py-2 px-4 text-right border border-gray-200 w-20">Miktar</th>
                      <th className="py-2 px-4 text-right border border-gray-200 w-32">Birim Fiyat</th>
                      <th className="py-2 px-4 text-right border border-gray-200 w-20">KDV</th>
                      <th className="py-2 px-4 text-right border border-gray-200 w-32">Toplam</th>
                      <th className="py-2 px-4 text-center border border-gray-200 w-16">İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quote.items.map((item, index) => (
                      <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="py-2 px-4 border border-gray-200">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Hizmet açıklaması"
                          />
                        </td>
                        <td className="py-2 px-4 border border-gray-200">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-right focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-2 px-4 border border-gray-200">
                          <div className="flex items-center">
                            <span className="text-gray-500 mr-1">₺</span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-right focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </td>
                        <td className="py-2 px-4 border border-gray-200">
                          <select
                            value={item.taxRate}
                            onChange={(e) => handleItemChange(item.id, 'taxRate', parseInt(e.target.value))}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-right focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            {taxRates.map((rate) => (
                              <option key={rate.value} value={rate.value}>
                                {rate.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2 px-4 text-right border border-gray-200 font-medium">
                          ₺{formatCurrency(item.totalPrice)}
                        </td>
                        <td className="py-2 px-4 text-center border border-gray-200">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Sil"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Quote Summary */}
              <div className="flex justify-end mt-6">
                <div className="w-64">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">Ara Toplam:</span>
                    <span>₺{formatCurrency(quote.subtotal)}</span>
                  </div>
                  
                  {/* Tax breakdown by rate */}
                  {getItemsByTaxRate().map((taxGroup, index) => (
                    <div key={index} className="flex justify-between py-2 border-b">
                      <span className="font-medium">KDV (%{taxGroup.rate}):</span>
                      <span>₺{formatCurrency(taxGroup.tax)}</span>
                    </div>
                  ))}
                  
                  <div className="flex justify-between py-2 border-b font-bold text-lg">
                    <span>Toplam:</span>
                    <span>₺{formatCurrency(quote.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes and Terms */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FileText className="h-6 w-6 text-blue-600 mr-2" />
                Notlar ve Şartlar
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notlar
                  </label>
                  <textarea
                    name="notes"
                    value={quote.notes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Teklif hakkında ek notlar..."
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şartlar ve Koşullar
                  </label>
                  <textarea
                    name="terms"
                    value={quote.terms}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Teklif şartları ve koşulları..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <button
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <X className="h-5 w-5" />
                <span>Formu Temizle</span>
              </button>
              
              <div className="flex space-x-4">
                <button
                  onClick={saveQuote}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-5 w-5" />
                  <span>Kaydet</span>
                </button>
                
                <button
                  onClick={() => setShowPreview(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Image className="h-5 w-5" />
                  <span>Önizleme</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quote Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-32">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FileText className="h-6 w-6 text-blue-600 mr-2" />
                Teklif Özeti
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Müşteri</h3>
                  <p className="text-gray-800">{quote.clientName || 'Belirtilmemiş'}</p>
                  {quote.companyName && <p className="text-gray-600 text-sm">{quote.companyName}</p>}
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Teklif Bilgileri</h3>
                  <p className="text-gray-800">Teklif No: {quote.quoteNumber}</p>
                  <p className="text-gray-800">Tarih: {formatDate(quote.quoteDate)}</p>
                  <p className="text-gray-800">Geçerlilik: {formatDate(quote.validUntil)}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Kalemler</h3>
                  <p className="text-gray-800">{quote.items.length} kalem</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Tutarlar</h3>
                  <div className="flex justify-between">
                    <span>Ara Toplam:</span>
                    <span>₺{formatCurrency(quote.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>KDV:</span>
                    <span>₺{formatCurrency(quote.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Toplam:</span>
                    <span>₺{formatCurrency(quote.totalAmount)}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <button
                    onClick={() => setShowPreview(true)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Image className="h-5 w-5" />
                    <span>Tam Önizleme</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saved Quotes Modal */}
      {showSavedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Kaydedilmiş Teklifler</h2>
              <button
                onClick={() => setShowSavedModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {savedQuotes.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Kaydedilmiş Teklif Bulunamadı</h3>
                <p className="text-gray-500">Henüz hiç teklif oluşturmadınız veya kaydetmediniz.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teklif No</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Müşteri</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Toplam</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {savedQuotes.map((savedQuote) => (
                      <tr key={savedQuote.id} className="hover:bg-gray-50">
                        <td className="py-4 px-4 text-sm font-medium text-gray-900">{savedQuote.quoteNumber}</td>
                        <td className="py-4 px-4 text-sm text-gray-500">
                          {savedQuote.clientName}
                          {savedQuote.companyName && <div className="text-xs text-gray-400">{savedQuote.companyName}</div>}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-500">{formatDate(savedQuote.quoteDate)}</td>
                        <td className="py-4 px-4 text-sm text-gray-500">₺{formatCurrency(savedQuote.totalAmount)}</td>
                        <td className="py-4 px-4 text-sm font-medium">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => loadQuote(savedQuote)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Düzenle"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => deleteQuote(savedQuote.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Sil"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <Info className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Fiyat Teklifi Modülü Kullanımı</h3>
            <ul className="space-y-2 text-blue-700">
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2"></div>
                <span>Müşteri bilgilerini, şirket adını ve teklif detaylarını girin</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2"></div>
                <span>Teklif kalemlerini ekleyin veya hazır hizmetlerden seçin</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2"></div>
                <span>Her kalem için miktar, birim fiyat ve KDV oranını belirleyin</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2"></div>
                <span>İsterseniz şirket logonuzu yükleyin ve alt bilgi metnini özelleştirin</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2"></div>
                <span>Notlar ve şartlar bölümünü tamamlayın</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2"></div>
                <span>Önizleme modunda teklifinizi kontrol edin</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2"></div>
                <span>PDF veya JPEG formatında indirin veya kaydedin</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteGeneratorPage;