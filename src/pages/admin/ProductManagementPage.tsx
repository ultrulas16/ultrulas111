import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Filter,
  Star,
  X,
  Save,
  Upload,
  Tag,
  DollarSign,
  BarChart3,
  AlertCircle,
  Percent,
  Clock,
  Repeat
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Product {
  id: string;
  name: string;
  description: string;
  short_description: string;
  category_id: string;
  sku: string;
  price: number;
  compare_price: number;
  cost_price: number;
  stock_quantity: number;
  min_stock_level: number;
  weight: number;
  image_url: string;
  gallery_urls: string[];
  is_active: boolean;
  is_featured: boolean;
  tags: string[];
  specifications: any;
  usage_instructions: string;
  safety_notes: string;
  tax_rate: number;
  category: {
    name: string;
  };
  is_subscription: boolean;
  subscription_period: string | null;
  subscription_details: any;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const ProductManagementPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [productTypeFilter, setProductTypeFilter] = useState('all'); // 'all', 'regular', 'subscription'

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    short_description: '',
    category_id: '',
    sku: '',
    price: 0,
    compare_price: 0,
    cost_price: 0,
    stock_quantity: 0,
    min_stock_level: 0,
    weight: 0,
    is_active: true,
    is_featured: false,
    tags: [] as string[],
    specifications: {},
    usage_instructions: '',
    safety_notes: '',
    tax_rate: 10, // Default tax rate
    image: null as File | null,
    image_url: '',
    is_subscription: false,
    subscription_period: 'monthly',
    subscription_details: {
      billingCycle: 'monthly',
      totalMonths: 12,
      features: []
    }
  });

  useEffect(() => {
    fetchData();
    checkStorageBucket();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory, productTypeFilter]);

  const checkStorageBucket = async () => {
    try {
      const { data, error } = await supabase.storage.listBuckets();
      if (error) {
        console.error('Error checking buckets:', error);
        return;
      }
      
      const productsBucket = data?.find(bucket => bucket.name === 'products');
      if (!productsBucket) {
        setStorageError('Storage bucket "products" not found. Please create it in your Supabase dashboard.');
      } else {
        setStorageError(null);
      }
    } catch (error) {
      console.error('Error checking storage bucket:', error);
    }
  };

  const fetchData = async () => {
    try {
      // Kategorileri getir
      const { data: categoriesData } = await supabase
        .from('product_categories')
        .select('*')
        .order('name');

      // Ürünleri getir
      const { data: productsData } = await supabase
        .from('products')
        .select(`
          *,
          category:product_categories(name)
        `)
        .order('name');

      setCategories(categoriesData || []);
      setProducts(productsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category_id === selectedCategory);
    }

    if (productTypeFilter !== 'all') {
      if (productTypeFilter === 'subscription') {
        filtered = filtered.filter(product => product.is_subscription);
      } else if (productTypeFilter === 'regular') {
        filtered = filtered.filter(product => !product.is_subscription);
      }
    }

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleImageUpload = async (file: File) => {
    // Check if storage bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    if (bucketsError) throw bucketsError;
    
    const productsBucket = buckets?.find(bucket => bucket.name === 'products');
    if (!productsBucket) {
      throw new Error('Storage bucket "products" not found. Please create it in your Supabase dashboard under Storage section.');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    return filePath;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = formData.image_url;

      // Only try to upload if there's a new image file
      if (formData.image) {
        try {
          imageUrl = await handleImageUpload(formData.image);
        } catch (uploadError: any) {
          console.error('Image upload error:', uploadError);
          alert(`Görsel yüklenirken hata oluştu: ${uploadError.message}`);
          setUploading(false);
          return;
        }
      }

      // Prepare subscription details if it's a subscription product
      let subscriptionDetails = formData.is_subscription ? formData.subscription_details : null;

      const productData = {
        name: formData.name,
        description: formData.description,
        short_description: formData.short_description,
        category_id: formData.category_id,
        sku: formData.sku,
        price: formData.price,
        compare_price: formData.compare_price,
        cost_price: formData.cost_price,
        stock_quantity: formData.stock_quantity,
        min_stock_level: formData.min_stock_level,
        weight: formData.weight,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        tags: formData.tags,
        specifications: formData.specifications,
        usage_instructions: formData.usage_instructions,
        safety_notes: formData.safety_notes,
        tax_rate: formData.tax_rate,
        is_subscription: formData.is_subscription,
        subscription_period: formData.is_subscription ? formData.subscription_period : null,
        subscription_details: subscriptionDetails,
        ...(imageUrl && { image_url: imageUrl })
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
      }

      await fetchData();
      resetForm();
      setShowAddModal(false);
      setEditingProduct(null);
    } catch (error: any) {
      console.error('Error saving product:', error);
      alert(`Ürün kaydedilirken hata oluştu: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Ürün silinirken hata oluştu.');
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  const toggleFeatured = async (id: string, isFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_featured: !isFeatured })
        .eq('id', id);

      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error updating product featured status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      short_description: '',
      category_id: '',
      sku: '',
      price: 0,
      compare_price: 0,
      cost_price: 0,
      stock_quantity: 0,
      min_stock_level: 0,
      weight: 0,
      is_active: true,
      is_featured: false,
      tags: [],
      specifications: {},
      usage_instructions: '',
      safety_notes: '',
      tax_rate: 10, // Default tax rate
      image: null,
      image_url: '',
      is_subscription: false,
      subscription_period: 'monthly',
      subscription_details: {
        billingCycle: 'monthly',
        totalMonths: 12,
        features: []
      }
    });
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      short_description: product.short_description,
      category_id: product.category_id,
      sku: product.sku,
      price: product.price,
      compare_price: product.compare_price,
      cost_price: product.cost_price,
      stock_quantity: product.stock_quantity,
      min_stock_level: product.min_stock_level,
      weight: product.weight,
      is_active: product.is_active,
      is_featured: product.is_featured,
      tags: product.tags || [],
      specifications: product.specifications || {},
      usage_instructions: product.usage_instructions,
      safety_notes: product.safety_notes,
      tax_rate: product.tax_rate || 10, // Default to 10% if not set
      image: null,
      image_url: product.image_url || '',
      is_subscription: product.is_subscription || false,
      subscription_period: product.subscription_period || 'monthly',
      subscription_details: product.subscription_details || {
        billingCycle: 'monthly',
        totalMonths: 12,
        features: []
      }
    });
    setShowAddModal(true);
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addFeature = (feature: string) => {
    if (feature && !formData.subscription_details.features.includes(feature)) {
      setFormData(prev => ({
        ...prev,
        subscription_details: {
          ...prev.subscription_details,
          features: [...prev.subscription_details.features, feature]
        }
      }));
    }
  };

  const removeFeature = (featureToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      subscription_details: {
        ...prev.subscription_details,
        features: prev.subscription_details.features.filter(feature => feature !== featureToRemove)
      }
    }));
  };

  // Helper function to get proper image URL
  const getImageUrl = (url: string | null) => {
    if (!url) return 'https://images.pexels.com/photos/4491461/pexels-photo-4491461.jpeg?auto=compress&cs=tinysrgb&w=100';
    
    if (url.startsWith('http')) {
      return url;
    }
    
    // If it's a storage path, get the public URL
    return supabase.storage.from('products').getPublicUrl(url).data.publicUrl;
  };

  // Available tax rates
  const taxRates = [
    { value: 1, label: '%1' },
    { value: 10, label: '%10' },
    { value: 20, label: '%20' }
  ];

  // Subscription periods
  const subscriptionPeriods = [
    { value: 'monthly', label: 'Aylık' },
    { value: 'quarterly', label: '3 Aylık' },
    { value: 'biannual', label: '6 Aylık' },
    { value: 'annual', label: 'Yıllık' }
  ];

  // Billing cycles
  const billingCycles = [
    { value: 'monthly', label: 'Aylık Ödeme' },
    { value: 'quarterly', label: '3 Aylık Ödeme' },
    { value: 'biannual', label: '6 Aylık Ödeme' },
    { value: 'annual', label: 'Yıllık Ödeme' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pest-green-700"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Storage Error Alert */}
      {storageError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Storage Bucket Required</h3>
              <p className="text-sm text-red-700 mt-1">
                {storageError}
              </p>
              <div className="mt-2 text-sm text-red-700">
                <p className="font-medium">To fix this:</p>
                <ol className="list-decimal list-inside mt-1 space-y-1">
                  <li>Go to your Supabase dashboard</li>
                  <li>Navigate to Storage section</li>
                  <li>Create a new bucket named "products"</li>
                  <li>Set it to public if you want images to be publicly accessible</li>
                  <li>Refresh this page</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ürün Yönetimi</h1>
          <p className="text-gray-600 mt-2">Mağaza ürünlerini yönetin</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingProduct(null);
            setShowAddModal(true);
          }}
          className="bg-pest-green-600 text-white px-6 py-3 rounded-lg hover:bg-pest-green-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Yeni Ürün</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
            >
              <option value="all">Tüm Kategoriler</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={productTypeFilter}
              onChange={(e) => setProductTypeFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
            >
              <option value="all">Tüm Ürünler</option>
              <option value="regular">Normal Ürünler</option>
              <option value="subscription">Abonelik Ürünleri</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ürün
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fiyat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stok
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={getImageUrl(product.image_url)}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded mr-4"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          {product.name}
                          {product.is_featured && (
                            <Star className="h-4 w-4 text-yellow-500 ml-2" />
                          )}
                          {product.is_subscription && (
                            <Repeat className="h-4 w-4 text-blue-500 ml-2" title="Abonelik Ürünü" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pest-green-100 text-pest-green-800">
                      {product.category?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center">
                      <span>₺{product.price.toLocaleString('tr-TR')}</span>
                      <span className="ml-1 text-xs text-gray-500">
                        (KDV: %{product.tax_rate || 10})
                      </span>
                    </div>
                    {product.compare_price > 0 && (
                      <div className="text-gray-500 line-through text-xs">
                        ₺{product.compare_price.toLocaleString('tr-TR')}
                      </div>
                    )}
                    {product.is_subscription && (
                      <div className="text-blue-600 text-xs flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>
                          {product.subscription_period === 'monthly' ? 'Aylık' : 
                           product.subscription_period === 'quarterly' ? '3 Aylık' : 
                           product.subscription_period === 'biannual' ? '6 Aylık' : 
                           product.subscription_period === 'annual' ? 'Yıllık' : 
                           'Abonelik'}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className={product.stock_quantity <= product.min_stock_level ? 'text-red-600' : ''}>
                      {product.stock_quantity} adet
                    </div>
                    {product.stock_quantity <= product.min_stock_level && (
                      <div className="text-xs text-red-500">Düşük stok!</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => toggleActive(product.id, product.is_active)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.is_active ? 'Aktif' : 'Pasif'}
                      </button>
                      <button
                        onClick={() => toggleFeatured(product.id, product.is_featured)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.is_featured
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {product.is_featured ? 'Öne Çıkan' : 'Normal'}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.open(`/magaza#${product.id}`, '_blank')}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => startEdit(product)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingProduct(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Type Selection */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ürün Tipi
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="productType"
                      checked={!formData.is_subscription}
                      onChange={() => setFormData(prev => ({ ...prev, is_subscription: false }))}
                      className="form-radio h-4 w-4 text-pest-green-600"
                    />
                    <span className="ml-2">Normal Ürün</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="productType"
                      checked={formData.is_subscription}
                      onChange={() => setFormData(prev => ({ ...prev, is_subscription: true }))}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">Abonelik Ürünü</span>
                  </label>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ürün Adı *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori *
                  </label>
                  <select
                    required
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500"
                  >
                    <option value="">Kategori Seçin</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fiyat (₺) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    KDV Oranı (%)
                  </label>
                  <select
                    value={formData.tax_rate}
                    onChange={(e) => setFormData({ ...formData, tax_rate: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500"
                  >
                    {taxRates.map((rate) => (
                      <option key={rate.value} value={rate.value}>
                        {rate.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Karşılaştırma Fiyatı (₺)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.compare_price}
                    onChange={(e) => setFormData({ ...formData, compare_price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stok Miktarı
                  </label>
                  <input
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500"
                  />
                </div>
              </div>

              {/* Subscription specific fields */}
              {formData.is_subscription && (
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                    <Repeat className="h-5 w-5 mr-2" />
                    Abonelik Detayları
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Abonelik Süresi
                      </label>
                      <select
                        value={formData.subscription_period}
                        onChange={(e) => setFormData({ ...formData, subscription_period: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {subscriptionPeriods.map((period) => (
                          <option key={period.value} value={period.value}>
                            {period.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Faturalama Döngüsü
                      </label>
                      <select
                        value={formData.subscription_details.billingCycle}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          subscription_details: {
                            ...formData.subscription_details,
                            billingCycle: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {billingCycles.map((cycle) => (
                          <option key={cycle.value} value={cycle.value}>
                            {cycle.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Toplam Ay
                    </label>
                    <input
                      type="number"
                      value={formData.subscription_details.totalMonths}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        subscription_details: {
                          ...formData.subscription_details,
                          totalMonths: parseInt(e.target.value) || 12
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Abonelik Özellikleri
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.subscription_details.features.map((feature, index) => (
                        <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                          <span>{feature}</span>
                          <button
                            type="button"
                            onClick={() => removeFeature(feature)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex">
                      <input
                        type="text"
                        id="feature-input"
                        placeholder="Yeni özellik ekle"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const input = e.target as HTMLInputElement;
                            if (input.value.trim()) {
                              addFeature(input.value.trim());
                              input.value = '';
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById('feature-input') as HTMLInputElement;
                          if (input.value.trim()) {
                            addFeature(input.value.trim());
                            input.value = '';
                          }
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700"
                      >
                        Ekle
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kısa Açıklama
                </label>
                <input
                  type="text"
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500"
                  placeholder="Ürün listesinde görünecek kısa açıklama"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detaylı Açıklama
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kullanım Talimatları
                </label>
                <textarea
                  value={formData.usage_instructions}
                  onChange={(e) => setFormData({ ...formData, usage_instructions: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Güvenlik Notları
                </label>
                <textarea
                  value={formData.safety_notes}
                  onChange={(e) => setFormData({ ...formData, safety_notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500"
                  placeholder="Güvenlik uyarıları ve dikkat edilmesi gerekenler"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ürün Görseli
                </label>
                {storageError && (
                  <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                    Image upload is disabled until storage bucket is created.
                  </div>
                )}
                <input
                  type="file"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500"
                  accept="image/*"
                  disabled={!!storageError}
                />
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or enter image URL:
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                {(editingProduct?.image_url || formData.image_url) && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-1">Preview:</p>
                    <img 
                      src={getImageUrl(formData.image_url || editingProduct?.image_url)} 
                      alt="Product preview" 
                      className="h-20 w-auto object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Aktif</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Öne Çıkan</span>
                </label>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-pest-green-600 text-white px-4 py-2 rounded-lg hover:bg-pest-green-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Kaydediliyor...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>{editingProduct ? 'Güncelle' : 'Kaydet'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagementPage;