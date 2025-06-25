import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, Calendar, Eye, Search, Filter, Building, Award, Shield, Beaker, FileCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  created_at: string;
}

const DocumentsPage = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [downloadAttempts, setDownloadAttempts] = useState<Record<string, number>>({});
  const [captchaRequired, setCaptchaRequired] = useState<string | null>(null);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaData, setCaptchaData] = useState({ num1: 0, num2: 0, operator: '+', answer: 0 });
  const [captchaError, setCaptchaError] = useState(false);
  const [downloadBlocked, setDownloadBlocked] = useState<string[]>([]);
  const downloadTimestamps = useRef<Record<string, number[]>>({});

  const categories = [
    { id: 'all', name: 'Tümü', icon: FileText },
    { id: 'firma_belgeleri', name: 'Firma Belgeleri', icon: Building },
    { id: 'sertifikalar', name: 'Sertifikalar', icon: Award },
    { id: 'kalite_belgeleri', name: 'Kalite Belgeleri', icon: Shield },
    { id: 'msds_ruhsatlar', name: 'MSDS & Ruhsatlar', icon: Beaker }
  ];

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [documents, searchTerm, selectedCategory]);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map old categories to new combined category
      const mappedData = data?.map(doc => ({
        ...doc,
        category: doc.category === 'msds' || doc.category === 'ruhsatlar' ? 'msds_ruhsatlar' : doc.category
      })) || [];
      
      setDocuments(mappedData);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDocuments = () => {
    let filtered = documents;

    // Kategori filtresi
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(doc => doc.category === selectedCategory);
    }

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDocuments(filtered);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.icon : FileText;
  };

  // Generate a random math CAPTCHA
  const generateCaptcha = () => {
    // Generate two random numbers between 1 and 20
    let num1 = Math.floor(Math.random() * 20) + 1;
    let num2 = Math.floor(Math.random() * 20) + 1;
    
    // Choose a random operator (addition, subtraction, or multiplication)
    const operators = ['+', '-', '×'];
    const operatorIndex = Math.floor(Math.random() * operators.length);
    const operator = operators[operatorIndex];
    
    // Calculate the answer
    let answer;
    switch (operator) {
      case '+':
        answer = num1 + num2;
        break;
      case '-':
        // Ensure the result is positive
        if (num1 >= num2) {
          answer = num1 - num2;
        } else {
          answer = num2 - num1;
          // Swap numbers so the larger one comes first
          const temp = num1;
          num1 = num2;
          num2 = temp;
        }
        break;
      case '×':
        // Use smaller numbers for multiplication to keep it simple
        answer = num1 * num2;
        break;
      default:
        answer = num1 + num2;
    }
    
    setCaptchaData({ num1, num2, operator, answer });
    setCaptchaInput('');
    setCaptchaError(false);
  };

  // Check if download pattern is suspicious (too many downloads in short time)
  const isSuspiciousActivity = (docId: string) => {
    const now = Date.now();
    const recentDownloads = downloadTimestamps.current[docId] || [];
    
    // Keep only downloads from the last 5 minutes
    const recentTimeWindow = recentDownloads.filter(timestamp => now - timestamp < 5 * 60 * 1000);
    downloadTimestamps.current[docId] = recentTimeWindow;
    
    // If more than 3 downloads in 5 minutes, require captcha
    return recentTimeWindow.length >= 3;
  };

  // Track download attempt
  const trackDownloadAttempt = (docId: string) => {
    // Record timestamp
    const now = Date.now();
    if (!downloadTimestamps.current[docId]) {
      downloadTimestamps.current[docId] = [];
    }
    downloadTimestamps.current[docId].push(now);
    
    // Increment attempt counter
    setDownloadAttempts(prev => ({
      ...prev,
      [docId]: (prev[docId] || 0) + 1
    }));
    
    // Check if we need to block this IP temporarily
    if ((downloadAttempts[docId] || 0) > 10) {
      setDownloadBlocked(prev => [...prev, docId]);
      // Auto-unblock after 30 minutes
      setTimeout(() => {
        setDownloadBlocked(prev => prev.filter(id => id !== docId));
        setDownloadAttempts(prev => ({...prev, [docId]: 0}));
      }, 30 * 60 * 1000);
    }
  };

  const handleDownload = async (docToDownload: Document) => {
    // Check if this document is blocked for this session
    if (downloadBlocked.includes(docToDownload.id)) {
      alert('Çok fazla indirme denemesi yaptınız. Lütfen daha sonra tekrar deneyin.');
      return;
    }
    
    // Track this attempt
    trackDownloadAttempt(docToDownload.id);
    
    // Check if suspicious activity
    if (isSuspiciousActivity(docToDownload.id)) {
      setCaptchaRequired(docToDownload.id);
      generateCaptcha();
      return;
    }
    
    try {
      // Add a small random delay to further deter bots
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
      
      // Supabase Storage'dan dosyayı indir
      const { data, error } = await supabase.storage
        .from('documents')
        .download(docToDownload.file_url);

      if (error) throw error;

      // Blob URL oluştur ve indir
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = docToDownload.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Dosya indirilemedi. Lütfen daha sonra tekrar deneyin.');
    }
  };

  const handleCaptchaSubmit = async (docId: string) => {
    // Check if the input is a number
    const userAnswer = parseInt(captchaInput);
    if (isNaN(userAnswer)) {
      setCaptchaError(true);
      return;
    }
    
    // Check if the answer is correct
    if (userAnswer !== captchaData.answer) {
      setCaptchaError(true);
      generateCaptcha(); // Generate a new captcha if wrong
      return;
    }
    
    // Captcha passed
    setCaptchaRequired(null);
    setCaptchaInput('');
    
    // Find the document and download it
    const docToDownload = documents.find(doc => doc.id === docId);
    if (docToDownload) {
      // Reset the download attempts for this document
      setDownloadAttempts(prev => ({...prev, [docId]: 0}));
      
      // Download the document
      try {
        // Supabase Storage'dan dosyayı indir
        const { data, error } = await supabase.storage
          .from('documents')
          .download(docToDownload.file_url);

        if (error) throw error;

        // Blob URL oluştur ve indir
        const url = URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = docToDownload.file_name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading document:', error);
        alert('Dosya indirilemedi. Lütfen daha sonra tekrar deneyin.');
      }
    }
  };

  if (loading) {
    return (
      <div className="pt-8">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pest-green-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-8">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-pest-green-50 to-pest-green-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <FileText className="h-12 w-12 text-pest-green-700 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              Dökümanlar
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Firma belgelerimiz, sertifikalarımız ve kalite dökümanlarımızı inceleyebilir ve indirebilirsiniz.
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white sticky top-24 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Döküman ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-pest-green-700 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-pest-green-100 hover:text-pest-green-700'
                  }`}
                >
                  <category.icon className="h-4 w-4" />
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Documents Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Döküman Bulunamadı</h3>
              <p className="text-gray-500">Arama kriterlerinizi değiştirmeyi deneyin.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDocuments.map((docItem) => {
                const CategoryIcon = getCategoryIcon(docItem.category);
                return (
                  <div key={docItem.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-pest-green-600 to-pest-green-700 p-6 text-white">
                      <div className="flex items-center space-x-3 mb-3">
                        <CategoryIcon className="h-6 w-6" />
                        <span className="text-sm font-medium bg-white bg-opacity-20 px-2 py-1 rounded">
                          {getCategoryName(docItem.category)}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold leading-tight">{docItem.title}</h3>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {docItem.description && (
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {docItem.description}
                        </p>
                      )}

                      {/* File Info */}
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Dosya Türü:</span>
                          <span className="font-medium text-gray-700 uppercase">
                            {docItem.file_type || 'PDF'}
                          </span>
                        </div>
                        {docItem.file_size && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Dosya Boyutu:</span>
                            <span className="font-medium text-gray-700">
                              {formatFileSize(docItem.file_size)}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Tarih:</span>
                          <span className="font-medium text-gray-700">
                            {new Date(docItem.created_at).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleDownload(docItem)}
                          className="flex-1 bg-pest-green-600 text-white px-4 py-2 rounded-lg hover:bg-pest-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
                        >
                          <Download className="h-4 w-4" />
                          <span>İndir</span>
                        </button>
                        <button
                          onClick={() => window.open(docItem.file_url, '_blank')}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Captcha Modal */}
      {captchaRequired && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Güvenlik Doğrulaması</h3>
            <p className="text-gray-600 mb-6">
              Lütfen aşağıdaki matematik sorusunu cevaplayarak insan olduğunuzu doğrulayın.
            </p>
            
            <div className="mb-6">
              <div className="bg-gray-100 p-4 rounded-lg text-center mb-4">
                <span className="text-xl font-bold text-gray-800">
                  {captchaData.num1} {captchaData.operator} {captchaData.num2} = ?
                </span>
              </div>
              
              <input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500 ${
                  captchaError ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Cevabınızı girin"
                autoFocus
              />
              {captchaError && (
                <p className="text-red-600 text-sm mt-1">
                  Yanlış cevap. Lütfen tekrar deneyin.
                </p>
              )}
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setCaptchaRequired(null)}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={() => handleCaptchaSubmit(captchaRequired)}
                className="flex-1 bg-pest-green-600 text-white px-4 py-2 rounded-lg hover:bg-pest-green-700 transition-colors"
              >
                Doğrula
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Döküman Kategorileri</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.slice(1).map((category) => (
                <div key={category.id} className="bg-gray-50 rounded-xl p-6 text-center">
                  <category.icon className="h-8 w-8 text-pest-green-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{category.name}</h3>
                  <p className="text-gray-600 text-sm">
                    {category.id === 'firma_belgeleri' && 'Şirket kuruluş belgeleri ve resmi evraklar'}
                    {category.id === 'sertifikalar' && 'Kalite ve yeterlilik sertifikalarımız'}
                    {category.id === 'kalite_belgeleri' && 'ISO, HACCP ve diğer kalite belgeleri'}
                    {category.id === 'msds_ruhsatlar' && 'Malzeme güvenlik bilgi formları ve faaliyet ruhsatları'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-pest-green-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Daha Fazla Bilgi İçin
          </h2>
          <p className="text-xl text-pest-green-100 mb-8 max-w-2xl mx-auto">
            Dökümanlarımız hakkında sorularınız varsa bizimle iletişime geçin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/iletisim" 
              className="bg-white text-pest-green-700 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-lg"
            >
              İletişime Geçin
            </Link>
            <a 
              href="tel:02242338387" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-pest-green-700 transition-colors font-medium"
            >
              Hemen Arayın
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DocumentsPage;