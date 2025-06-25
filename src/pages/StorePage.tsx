import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Tag, 
  Star, 
  Plus, 
  Minus, 
  X, 
  ChevronRight, 
  Package, 
  Truck, 
  Shield, 
  Clock,
  Repeat,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Product {
  id: string;
  name: string;
  description: string;
  short_description: string;
  category_id: string;
  sku: string;
  price: number;
  compare_price: number;
  stock_quantity: number;
  image_url: string;
  is_featured: boolean;
  tags: string[];
  tax_rate: number;
  is_subscription: boolean;
  subscription_period: string | null;
  subscription_details: {
    billingCycle: string;
    totalMonths: number;
    features: string[];
  } | null;
  category: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const StorePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [productTypeFilter, setProductTypeFilter] = useState('all'); // 'all', 'regular', 'subscription'

  useEffect(() => {
    fetchData();
    loadCart();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      // Fetch products
      const { data: productsData } = await supabase
        .from('products')
        .select(`
          *,
          category:product_categories(name)
        `)
        .eq('is_active', true)
        .order('name');

      setCategories(categoriesData || []);
      setProducts(productsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCart = () => {
    const savedCart = localStorage.getItem('pestmentor_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error parsing cart:', e);
      }
    }
  };

  const saveCart = (cartItems: CartItem[]) => {
    localStorage.setItem('pestmentor_cart', JSON.stringify(cartItems));
    setCart(cartItems);
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      const updatedCart = cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      );
      saveCart(updatedCart);
    } else {
      saveCart([...cart, { product, quantity: 1 }]);
    }
    
    setShowCart(true);
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = cart.filter(item => item.product.id !== productId);
    saveCart(updatedCart);
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cart.map(item => 
      item.product.id === productId 
        ? { ...item, quantity: newQuantity } 
        : item
    );
    saveCart(updatedCart);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const getFilteredProducts = () => {
    return products.filter(product => {
      // Category filter
      const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
      
      // Search filter
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.short_description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Product type filter
      const matchesType = 
        productTypeFilter === 'all' || 
        (productTypeFilter === 'subscription' && product.is_subscription) ||
        (productTypeFilter === 'regular' && !product.is_subscription);
      
      return matchesCategory && matchesSearch && matchesType;
    });
  };

  // Helper function to get proper image URL
  const getImageUrl = (url: string | null) => {
    if (!url) return 'https://images.pexels.com/photos/4491461/pexels-photo-4491461.jpeg?auto=compress&cs=tinysrgb&w=800';
    
    if (url.startsWith('http')) {
      return url;
    }
    
    // If it's a storage path, get the public URL
    return supabase.storage.from('products').getPublicUrl(url).data.publicUrl;
  };

  // Format subscription period
  const formatSubscriptionPeriod = (period: string | null) => {
    switch (period) {
      case 'monthly': return 'Aylık';
      case 'quarterly': return '3 Aylık';
      case 'biannual': return '6 Aylık';
      case 'annual': return 'Yıllık';
      default: return 'Abonelik';
    }
  };

  // Format billing cycle
  const formatBillingCycle = (cycle: string) => {
    switch (cycle) {
      case 'monthly': return 'Aylık Ödeme';
      case 'quarterly': return '3 Aylık Ödeme';
      case 'biannual': return '6 Aylık Ödeme';
      case 'annual': return 'Yıllık Ödeme';
      default: return 'Aylık Ödeme';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pest-green-700"></div>
      </div>
    );
  }

  const filteredProducts = getFilteredProducts();
  const featuredProducts = products.filter(product => product.is_featured);

  return (
    <div className="pt-8">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-pest-green-50 to-pest-green-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            PestMentor Mağaza
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Zararlı mücadelesi için ihtiyacınız olan tüm ürünler ve profesyonel modüller.
            Kaliteli ürünler, uygun fiyatlar.
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
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500"
              />
            </div>

            {/* Filters */}
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

              <button
                onClick={() => setShowCart(true)}
                className="bg-pest-green-600 text-white px-4 py-3 rounded-lg hover:bg-pest-green-700 transition-colors flex items-center space-x-2 relative"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Sepet</span>
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                    {getCartItemCount()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
              <Star className="h-6 w-6 text-yellow-500 mr-2" />
              Öne Çıkan Ürünler
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product) => (
                <div 
                  key={product.id} 
                  id={product.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative">
                    <img 
                      src={getImageUrl(product.image_url)} 
                      alt={product.name} 
                      className="w-full h-48 object-cover"
                    />
                    {product.is_featured && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Öne Çıkan
                      </div>
                    )}
                    {product.is_subscription && (
                      <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <Repeat className="h-3 w-3 mr-1" />
                        <span>{formatSubscriptionPeriod(product.subscription_period)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="mb-2">
                      <span className="inline-block bg-pest-green-100 text-pest-green-800 text-xs px-2 py-1 rounded-full">
                        {product.category?.name}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                    
                    <p className="text-gray-600 text-sm mb-4 flex-1">
                      {product.short_description || product.description?.substring(0, 100) + '...'}
                    </p>
                    
                    <div className="flex justify-between items-end mt-auto">
                      <div>
                        <div className="text-xl font-bold text-pest-green-600">
                          ₺{product.price.toLocaleString('tr-TR')}
                          {product.is_subscription && (
                            <span className="text-sm font-normal text-gray-500 ml-1">
                              /{product.subscription_period === 'monthly' ? 'ay' : 
                                product.subscription_period === 'annual' ? 'yıl' : 
                                product.subscription_period === 'quarterly' ? '3 ay' : 
                                product.subscription_period === 'biannual' ? '6 ay' : 'dönem'}
                            </span>
                          )}
                        </div>
                        {product.compare_price > 0 && (
                          <div className="text-sm text-gray-500 line-through">
                            ₺{product.compare_price.toLocaleString('tr-TR')}
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-pest-green-600 text-white p-2 rounded-lg hover:bg-pest-green-700 transition-colors"
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            {productTypeFilter === 'subscription' ? 'Abonelik Ürünleri' : 
             productTypeFilter === 'regular' ? 'Normal Ürünler' : 'Tüm Ürünler'}
            {selectedCategory !== 'all' && categories.find(c => c.id === selectedCategory) && 
              ` - ${categories.find(c => c.id === selectedCategory)?.name}`
            }
          </h2>
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Ürün Bulunamadı</h3>
              <p className="text-gray-500">Arama kriterlerinizi değiştirmeyi deneyin.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  id={product.id}
                  className={`bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col ${
                    product.is_subscription ? 'border-blue-300' : ''
                  }`}
                >
                  <div className="relative">
                    <img 
                      src={getImageUrl(product.image_url)} 
                      alt={product.name} 
                      className="w-full h-48 object-cover"
                    />
                    {product.is_featured && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Öne Çıkan
                      </div>
                    )}
                    {product.is_subscription && (
                      <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                        <Repeat className="h-3 w-3 mr-1" />
                        <span>{formatSubscriptionPeriod(product.subscription_period)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="mb-2">
                      <span className="inline-block bg-pest-green-100 text-pest-green-800 text-xs px-2 py-1 rounded-full">
                        {product.category?.name}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                    
                    <p className="text-gray-600 text-sm mb-4 flex-1">
                      {product.short_description || product.description?.substring(0, 100) + '...'}
                    </p>
                    
                    {/* Subscription Features */}
                    {product.is_subscription && product.subscription_details?.features && (
                      <div className="mb-4 bg-blue-50 p-3 rounded-lg">
                        <div className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span>Abonelik Özellikleri:</span>
                        </div>
                        <ul className="text-xs text-blue-700 space-y-1">
                          {product.subscription_details.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="flex items-start">
                              <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 mr-1.5"></div>
                              <span>{feature}</span>
                            </li>
                          ))}
                          {product.subscription_details.features.length > 3 && (
                            <li className="text-blue-600 font-medium">+ {product.subscription_details.features.length - 3} daha fazla...</li>
                          )}
                        </ul>
                        <div className="text-xs text-blue-600 mt-2 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>
                            {formatBillingCycle(product.subscription_details.billingCycle)} • 
                            {product.subscription_details.totalMonths} ay
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-end mt-auto">
                      <div>
                        <div className="text-xl font-bold text-pest-green-600">
                          ₺{product.price.toLocaleString('tr-TR')}
                          {product.is_subscription && (
                            <span className="text-sm font-normal text-gray-500 ml-1">
                              /{product.subscription_period === 'monthly' ? 'ay' : 
                                product.subscription_period === 'annual' ? 'yıl' : 
                                product.subscription_period === 'quarterly' ? '3 ay' : 
                                product.subscription_period === 'biannual' ? '6 ay' : 'dönem'}
                            </span>
                          )}
                        </div>
                        {product.compare_price > 0 && (
                          <div className="text-sm text-gray-500 line-through">
                            ₺{product.compare_price.toLocaleString('tr-TR')}
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-pest-green-600 text-white p-2 rounded-lg hover:bg-pest-green-700 transition-colors"
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowCart(false)}></div>
          
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="relative w-screen max-w-md">
              <div className="h-full flex flex-col bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-medium text-gray-900">Alışveriş Sepeti</h2>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500"
                      onClick={() => setShowCart(false)}
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="mt-8">
                    {cart.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Sepetiniz Boş</h3>
                        <p className="text-gray-500">Sepetinize ürün ekleyin.</p>
                      </div>
                    ) : (
                      <div className="flow-root">
                        <ul className="divide-y divide-gray-200">
                          {cart.map((item) => (
                            <li key={item.product.id} className="py-6 flex">
                              <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-md border border-gray-200">
                                <img
                                  src={getImageUrl(item.product.image_url)}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              <div className="ml-4 flex-1 flex flex-col">
                                <div>
                                  <div className="flex justify-between text-base font-medium text-gray-900">
                                    <h3>{item.product.name}</h3>
                                    <p className="ml-4">₺{(item.product.price * item.quantity).toLocaleString('tr-TR')}</p>
                                  </div>
                                  {item.product.is_subscription && (
                                    <p className="mt-1 text-sm text-blue-600 flex items-center">
                                      <Repeat className="h-3 w-3 mr-1" />
                                      <span>{formatSubscriptionPeriod(item.product.subscription_period)}</span>
                                    </p>
                                  )}
                                </div>
                                <div className="flex-1 flex items-end justify-between text-sm">
                                  <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button
                                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                      className="p-2 text-gray-500 hover:text-gray-700"
                                      disabled={item.quantity <= 1}
                                    >
                                      <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="px-2">{item.quantity}</span>
                                    <button
                                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                      className="p-2 text-gray-500 hover:text-gray-700"
                                    >
                                      <Plus className="h-4 w-4" />
                                    </button>
                                  </div>

                                  <button
                                    type="button"
                                    className="font-medium text-red-600 hover:text-red-500"
                                    onClick={() => removeFromCart(item.product.id)}
                                  >
                                    Kaldır
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                    <p>Toplam</p>
                    <p>₺{getCartTotal().toLocaleString('tr-TR')}</p>
                  </div>
                  
                  <div className="mt-6">
                    <Link
                      to="/magaza/siparis"
                      state={{ cart }}
                      className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-pest-green-600 hover:bg-pest-green-700"
                      onClick={() => setShowCart(false)}
                    >
                      Siparişi Tamamla
                    </Link>
                  </div>
                  
                  <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                    <p>
                      <button
                        type="button"
                        className="text-pest-green-600 font-medium hover:text-pest-green-500"
                        onClick={() => setShowCart(false)}
                      >
                        Alışverişe Devam Et
                        <span aria-hidden="true"> &rarr;</span>
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Store Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <Truck className="h-10 w-10 text-pest-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Hızlı Teslimat</h3>
              <p className="text-gray-600 text-sm">Siparişleriniz en kısa sürede hazırlanır ve kargoya verilir.</p>
            </div>
            
            <div className="text-center">
              <Shield className="h-10 w-10 text-pest-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Güvenli Ödeme</h3>
              <p className="text-gray-600 text-sm">Banka havalesi ile güvenli ödeme imkanı.</p>
            </div>
            
            <div className="text-center">
              <Package className="h-10 w-10 text-pest-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Kaliteli Ürünler</h3>
              <p className="text-gray-600 text-sm">Tüm ürünlerimiz kalite kontrolünden geçmektedir.</p>
            </div>
            
            <div className="text-center">
              <Clock className="h-10 w-10 text-pest-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">7/24 Destek</h3>
              <p className="text-gray-600 text-sm">Sorularınız için her zaman yanınızdayız.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Products Section */}
      {products.some(p => p.is_subscription) && productTypeFilter !== 'subscription' && (
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
                <Repeat className="h-8 w-8 text-blue-600 mr-3" />
                Abonelik Ürünleri
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Modül abonelikleri ile işlerinizi daha verimli hale getirin. Aylık ödeme planı ile yıllık abonelikler.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products
                .filter(p => p.is_subscription)
                .slice(0, 3)
                .map((product) => (
                  <div 
                    key={product.id}
                    className="bg-white border-2 border-blue-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    <div className="bg-blue-600 text-white p-4">
                      <h3 className="text-xl font-bold">{product.name}</h3>
                      <div className="flex items-center mt-2">
                        <span className="text-2xl font-bold">₺{product.price.toLocaleString('tr-TR')}</span>
                        <span className="text-sm ml-1">/{product.subscription_period === 'monthly' ? 'ay' : 
                          product.subscription_period === 'annual' ? 'yıl' : 
                          product.subscription_period === 'quarterly' ? '3 ay' : 
                          product.subscription_period === 'biannual' ? '6 ay' : 'dönem'}</span>
                      </div>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <p className="text-gray-600 text-sm mb-4">
                        {product.short_description || product.description?.substring(0, 100) + '...'}
                      </p>
                      
                      {product.subscription_details?.features && (
                        <ul className="space-y-2 mb-6 flex-1">
                          {product.subscription_details.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                              <span className="text-gray-700 text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      
                      <div className="mt-auto">
                        <div className="text-sm text-gray-500 mb-4 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>
                            {formatBillingCycle(product.subscription_details?.billingCycle || 'monthly')} • 
                            {product.subscription_details?.totalMonths || 12} ay
                          </span>
                        </div>
                        
                        <button
                          onClick={() => addToCart(product)}
                          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                        >
                          <ShoppingCart className="h-5 w-5 mr-2" />
                          <span>Sepete Ekle</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            
            {products.filter(p => p.is_subscription).length > 3 && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setProductTypeFilter('subscription')}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  <span>Tüm Abonelik Ürünlerini Gör</span>
                  <ChevronRight className="h-5 w-5 ml-1" />
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-pest-green-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Özel Ürün mü Arıyorsunuz?
          </h2>
          <p className="text-xl text-pest-green-100 mb-8 max-w-2xl mx-auto">
            İhtiyacınız olan ürünü bulamadınız mı? Bizimle iletişime geçin, size özel çözüm sunalım.
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

export default StorePage;