import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Presentation, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Save, 
  ArrowLeft, 
  ArrowRight, 
  Maximize, 
  Minimize,
  Image,
  Layout,
  FileText,
  Check,
  X,
  Copy,
  Upload,
  List,
  Grid,
  Search,
  Filter,
  AlertTriangle,
  Info
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { fetchTemplates, Template } from '../services/presentationService';

interface Slide {
  id: string;
  type: 'title' | 'content' | 'two-column' | 'image' | 'thank-you';
  content: any;
  background: string;
}

interface Presentation {
  id: string;
  name: string;
  slides: Slide[];
  companyName: string;
  companyLogo: string | null;
  footerText: string;
  lastEdited: Date;
}

const TrainingPresentationPage = () => {
  const [activeView, setActiveView] = useState<'templates' | 'editor' | 'preview'>('templates');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [currentPresentation, setCurrentPresentation] = useState<Presentation | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStandard, setSelectedStandard] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [footerText, setFooterText] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [presentationName, setPresentationName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const fullscreenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadTemplates();
    loadSavedPresentations();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const loadedTemplates = await fetchTemplates();
      setTemplates(loadedTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
      setError('Şablonlar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const loadSavedPresentations = () => {
    const savedPresentations = localStorage.getItem('pestmentor_presentations');
    if (savedPresentations) {
      try {
        const parsed = JSON.parse(savedPresentations);
        setPresentations(parsed.map((p: any) => ({
          ...p,
          lastEdited: new Date(p.lastEdited)
        })));
      } catch (e) {
        console.error('Error parsing saved presentations:', e);
      }
    }
  };

  const savePresentations = (updatedPresentations: Presentation[]) => {
    localStorage.setItem('pestmentor_presentations', JSON.stringify(updatedPresentations));
    setPresentations(updatedPresentations);
  };

  const createNewPresentation = (template: Template) => {
    const newPresentation: Presentation = {
      id: `presentation-${Date.now()}`,
      name: template.name,
      slides: template.slides,
      companyName: '',
      companyLogo: null,
      footerText: 'PestMentor © 2025 | www.pestmentor.com.tr',
      lastEdited: new Date()
    };
    
    setCurrentPresentation(newPresentation);
    setCompanyName('');
    setCompanyLogo(null);
    setFooterText('PestMentor © 2025 | www.pestmentor.com.tr');
    setCurrentSlideIndex(0);
    setActiveView('editor');
  };

  const editPresentation = (presentation: Presentation) => {
    setCurrentPresentation(presentation);
    setCompanyName(presentation.companyName);
    setCompanyLogo(presentation.companyLogo);
    setFooterText(presentation.footerText);
    setCurrentSlideIndex(0);
    setActiveView('editor');
  };

  const deletePresentation = (id: string) => {
    if (window.confirm('Bu sunumu silmek istediğinizden emin misiniz?')) {
      const updatedPresentations = presentations.filter(p => p.id !== id);
      savePresentations(updatedPresentations);
    }
  };

  const savePresentation = () => {
    if (!currentPresentation) return;
    
    const updatedPresentation: Presentation = {
      ...currentPresentation,
      name: presentationName || currentPresentation.name,
      companyName,
      companyLogo,
      footerText,
      lastEdited: new Date()
    };
    
    const existingIndex = presentations.findIndex(p => p.id === updatedPresentation.id);
    let updatedPresentations: Presentation[];
    
    if (existingIndex >= 0) {
      updatedPresentations = [...presentations];
      updatedPresentations[existingIndex] = updatedPresentation;
    } else {
      updatedPresentations = [...presentations, updatedPresentation];
    }
    
    savePresentations(updatedPresentations);
    setCurrentPresentation(updatedPresentation);
    setShowSaveModal(false);
    setSuccess('Sunum başarıyla kaydedildi!');
    
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCompanyLogo(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const nextSlide = () => {
    if (!currentPresentation) return;
    if (currentSlideIndex < currentPresentation.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (fullscreenRef.current?.requestFullscreen) {
        fullscreenRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (activeView === 'preview') {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          document.exitFullscreen();
        }
      } else if (e.key === 'f') {
        toggleFullscreen();
      }
    }
  };

  const exportToPDF = () => {
    alert('PDF export functionality will be implemented here');
    // Implementation would use html2canvas and jsPDF to create a PDF of the slides
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStandard = selectedStandard === 'all' || template.standard === selectedStandard;
    return matchesSearch && matchesStandard;
  });

  const filteredPresentations = presentations.filter(presentation => 
    presentation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderSlide = (slide: Slide) => {
    switch (slide.type) {
      case 'title':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{slide.content.title}</h1>
            <h2 className="text-2xl md:text-3xl text-gray-600">{slide.content.subtitle}</h2>
            {companyLogo && (
              <div className="absolute top-8 right-8">
                <img src={companyLogo} alt="Company Logo" className="h-16 object-contain" />
              </div>
            )}
          </div>
        );
      
      case 'content':
        return (
          <div className="h-full px-12 py-8">
            <h2 className="text-3xl font-bold mb-8">{slide.content.title}</h2>
            <ul className="space-y-4">
              {slide.content.bullets.map((bullet: string, index: number) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-pest-green-600 rounded-full mt-2.5 mr-3"></div>
                  <span className="text-xl">{bullet}</span>
                </li>
              ))}
            </ul>
            {companyLogo && (
              <div className="absolute top-8 right-8">
                <img src={companyLogo} alt="Company Logo" className="h-16 object-contain" />
              </div>
            )}
          </div>
        );
      
      case 'two-column':
        return (
          <div className="h-full px-12 py-8">
            <h2 className="text-3xl font-bold mb-8">{slide.content.title}</h2>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">{slide.content.leftTitle}</h3>
                <ul className="space-y-3">
                  {slide.content.leftContent.map((item: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-pest-green-600 rounded-full mt-2 mr-3"></div>
                      <span className="text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">{slide.content.rightTitle}</h3>
                <ul className="space-y-3">
                  {slide.content.rightContent.map((item: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-pest-green-600 rounded-full mt-2 mr-3"></div>
                      <span className="text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {companyLogo && (
              <div className="absolute top-8 right-8">
                <img src={companyLogo} alt="Company Logo" className="h-16 object-contain" />
              </div>
            )}
          </div>
        );
      
      case 'image':
        return (
          <div className="h-full px-12 py-8">
            <h2 className="text-3xl font-bold mb-6">{slide.content.title}</h2>
            <div className="flex justify-center">
              <img 
                src={slide.content.imageUrl} 
                alt={slide.content.title} 
                className="max-h-[60%] object-contain"
              />
            </div>
            {slide.content.caption && (
              <p className="text-center text-gray-600 mt-4">{slide.content.caption}</p>
            )}
            {companyLogo && (
              <div className="absolute top-8 right-8">
                <img src={companyLogo} alt="Company Logo" className="h-16 object-contain" />
              </div>
            )}
          </div>
        );
      
      case 'thank-you':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{slide.content.title}</h1>
            <h2 className="text-2xl md:text-3xl text-gray-600">{slide.content.subtitle}</h2>
            {companyName && (
              <div className="mt-12">
                <p className="text-xl font-medium">{companyName}</p>
              </div>
            )}
            {companyLogo && (
              <div className="absolute top-8 right-8">
                <img src={companyLogo} alt="Company Logo" className="h-16 object-contain" />
              </div>
            )}
          </div>
        );
      
      default:
        return <div>Unsupported slide type</div>;
    }
  };

  const standards = [
    { id: 'all', name: 'Tüm Standartlar' },
    { id: 'BRC', name: 'BRC' },
    { id: 'AIB', name: 'AIB' },
    { id: 'HACCP', name: 'HACCP' },
    { id: 'ISO22000', name: 'ISO 22000' },
    { id: 'IPM', name: 'IPM' },
    { id: 'GENERAL', name: 'Genel' },
    { id: 'PESTS', name: 'Zararlı Türleri' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Templates View */}
      {activeView === 'templates' && (
        <div>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Eğitim Sunumu Modülü</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveView('templates')}
                className="bg-pest-green-600 text-white px-4 py-2 rounded-lg hover:bg-pest-green-700 transition-colors"
              >
                Şablonlar
              </button>
              {presentations.length > 0 && (
                <button
                  onClick={() => setActiveView('editor')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sunumlarım
                </button>
              )}
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Şablon ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500"
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <select
                  value={selectedStandard}
                  onChange={(e) => setSelectedStandard(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                >
                  {standards.map((standard) => (
                    <option key={standard.id} value={standard.id}>
                      {standard.name}
                    </option>
                  ))}
                </select>

                <div className="flex border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 ${viewMode === 'grid' ? 'bg-pest-green-600 text-white' : 'text-gray-600'}`}
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 ${viewMode === 'list' ? 'bg-pest-green-600 text-white' : 'text-gray-600'}`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Templates Grid/List */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pest-green-700"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          ) : (
            <>
              {filteredTemplates.length === 0 ? (
                <div className="text-center py-12">
                  <Presentation className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Şablon Bulunamadı</h3>
                  <p className="text-gray-500">Arama kriterlerinizi değiştirmeyi deneyin.</p>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                    >
                      <div className={`${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                        <div className="bg-gradient-to-r from-pest-green-600 to-pest-green-700 p-6 text-white">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold">{template.name}</h3>
                            <span className="bg-white text-pest-green-700 px-2 py-1 rounded text-xs font-medium">
                              {template.standard}
                            </span>
                          </div>
                          <p className="text-sm text-pest-green-100">{template.description}</p>
                        </div>
                      </div>

                      <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <div className="mb-4">
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <Presentation className="h-4 w-4 mr-2" />
                            <span>{template.slides.length} slayt</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <FileText className="h-4 w-4 mr-2" />
                            <span>{getTemplateCategory(template.standard)}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => createNewPresentation(template)}
                          className="w-full bg-pest-green-600 text-white py-2 px-4 rounded-lg hover:bg-pest-green-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Bu Şablonu Kullan</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Saved Presentations Section */}
              {presentations.length > 0 && (
                <div className="mt-16">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Kaydedilmiş Sunumlarım</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPresentations.map((presentation) => (
                      <div key={presentation.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="bg-blue-600 p-6 text-white">
                          <h3 className="text-xl font-bold mb-2">{presentation.name}</h3>
                          <p className="text-sm text-blue-100">
                            Son düzenleme: {presentation.lastEdited.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center text-sm text-gray-600 mb-4">
                            <Presentation className="h-4 w-4 mr-2" />
                            <span>{presentation.slides.length} slayt</span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => editPresentation(presentation)}
                              className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              <span>Düzenle</span>
                            </button>
                            <button
                              onClick={() => deletePresentation(presentation.id)}
                              className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Editor View */}
      {activeView === 'editor' && currentPresentation && (
        <div>
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <button
                onClick={() => setActiveView('templates')}
                className="mr-4 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-3xl font-bold text-gray-800">{currentPresentation.name}</h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowSaveModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Save className="h-5 w-5" />
                <span>Kaydet</span>
              </button>
              <button
                onClick={() => setActiveView('preview')}
                className="bg-pest-green-600 text-white px-4 py-2 rounded-lg hover:bg-pest-green-700 transition-colors flex items-center space-x-2"
              >
                <Presentation className="h-5 w-5" />
                <span>Sunumu Başlat</span>
              </button>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
              <Check className="h-5 w-5 mr-2" />
              {success}
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Slide Navigation */}
            <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-1 h-[calc(100vh-200px)] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Slaytlar</h2>
              <div className="space-y-4">
                {currentPresentation.slides.map((slide, index) => (
                  <div 
                    key={slide.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      index === currentSlideIndex 
                        ? 'border-pest-green-600 bg-pest-green-50' 
                        : 'border-gray-200 hover:border-pest-green-300'
                    }`}
                    onClick={() => setCurrentSlideIndex(index)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Slayt {index + 1}</span>
                      <span className="text-xs text-gray-500">{getSlideTypeName(slide.type)}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {getSlideTitle(slide)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Slide Editor */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Sunum Bilgileri</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Şirket Adı
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pest-green-500"
                      placeholder="Şirket adını girin"
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
                      {companyLogo && (
                        <div className="ml-4 relative">
                          <img src={companyLogo} alt="Logo" className="h-10 object-contain" />
                          <button
                            onClick={() => setCompanyLogo(null)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Bilgi Metni
                  </label>
                  <input
                    type="text"
                    value={footerText}
                    onChange={(e) => setFooterText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pest-green-500"
                    placeholder="Alt bilgi metni girin"
                  />
                </div>
              </div>

              {/* Slide Preview */}
              <div className="bg-white rounded-lg shadow-md p-6 h-[calc(100vh-400px)] overflow-hidden">
                <div className="bg-gray-100 h-full rounded-lg relative flex flex-col">
                  <div className="flex-1 overflow-auto p-8">
                    {currentPresentation.slides[currentSlideIndex] && 
                      renderSlide(currentPresentation.slides[currentSlideIndex])
                    }
                  </div>
                  {/* Footer */}
                  <div className="bg-gray-200 p-3 text-sm text-gray-600 flex justify-between items-center">
                    <span>{footerText}</span>
                    <span>Slayt {currentSlideIndex + 1} / {currentPresentation.slides.length}</span>
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={prevSlide}
                  disabled={currentSlideIndex === 0}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Önceki
                </button>
                <button
                  onClick={nextSlide}
                  disabled={currentSlideIndex === currentPresentation.slides.length - 1}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 flex items-center"
                >
                  Sonraki
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          </div>

          {/* Save Modal */}
          {showSaveModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Sunumu Kaydet</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sunum Adı
                  </label>
                  <input
                    type="text"
                    value={presentationName || currentPresentation.name}
                    onChange={(e) => setPresentationName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pest-green-500"
                    placeholder="Sunum adını girin"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowSaveModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    İptal
                  </button>
                  <button
                    onClick={savePresentation}
                    className="px-4 py-2 bg-pest-green-600 text-white rounded-md hover:bg-pest-green-700"
                  >
                    Kaydet
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preview Mode */}
      {activeView === 'preview' && currentPresentation && (
        <div 
          ref={fullscreenRef}
          className="fixed inset-0 bg-white z-50 flex flex-col"
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          <div className="flex-1 overflow-hidden relative">
            {currentPresentation.slides[currentSlideIndex] && (
              <div className="h-full">
                {renderSlide(currentPresentation.slides[currentSlideIndex])}
              </div>
            )}
            
            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 bg-gray-100 p-3 text-sm text-gray-600 flex justify-between items-center">
              <span>{footerText}</span>
              <span>Slayt {currentSlideIndex + 1} / {currentPresentation.slides.length}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveView('editor')}
                className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Düzenleme Modu</span>
              </button>
              <button
                onClick={toggleFullscreen}
                className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 flex items-center space-x-2"
              >
                {isFullscreen ? (
                  <>
                    <Minimize className="h-4 w-4" />
                    <span>Tam Ekrandan Çık</span>
                  </>
                ) : (
                  <>
                    <Maximize className="h-4 w-4" />
                    <span>Tam Ekran</span>
                  </>
                )}
              </button>
              <button
                onClick={exportToPDF}
                className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>PDF İndir</span>
              </button>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={prevSlide}
                disabled={currentSlideIndex === 0}
                className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:hover:bg-gray-700"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextSlide}
                disabled={currentSlideIndex === currentPresentation.slides.length - 1}
                className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:hover:bg-gray-700"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <Info className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Sunum Modülü Kullanımı</h3>
            <ul className="space-y-2 text-blue-700">
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2"></div>
                <span>Şablonlar arasından seçim yaparak yeni bir sunum oluşturun</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2"></div>
                <span>Şirket adı, logo ve alt bilgi ekleyerek sunumu kişiselleştirin</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2"></div>
                <span>Sunumu kaydedin ve istediğiniz zaman düzenleyin</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2"></div>
                <span>Tam ekran modunda sunumu gösterin veya PDF olarak indirin</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2"></div>
                <span>Sunum modunda klavye tuşlarını kullanabilirsiniz: Sağ/Sol ok tuşları, F tuşu (tam ekran), ESC tuşu (çıkış)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getSlideTypeName = (type: string): string => {
  switch (type) {
    case 'title': return 'Başlık Slaytı';
    case 'content': return 'İçerik Slaytı';
    case 'two-column': return 'İki Sütunlu Slayt';
    case 'image': return 'Görsel Slaytı';
    case 'thank-you': return 'Teşekkür Slaytı';
    default: return 'Slayt';
  }
};

const getSlideTitle = (slide: Slide): string => {
  switch (slide.type) {
    case 'title':
    case 'content':
    case 'two-column':
    case 'image':
      return slide.content.title || 'Başlıksız Slayt';
    case 'thank-you':
      return slide.content.title || 'Teşekkürler';
    default:
      return 'Başlıksız Slayt';
  }
};

const getTemplateCategory = (standard: string): string => {
  switch (standard) {
    case 'BRC': return 'BRC Standardı';
    case 'AIB': return 'AIB Standardı';
    case 'HACCP': return 'HACCP Standardı';
    case 'ISO22000': return 'ISO 22000 Standardı';
    case 'IPM': return 'Entegre Zararlı Yönetimi';
    case 'GENERAL': return 'Genel Eğitim';
    case 'PESTS': return 'Zararlı Türleri';
    default: return standard;
  }
};

export default TrainingPresentationPage;