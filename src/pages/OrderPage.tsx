import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  User, 
  MapPin, 
  CreditCard, 
  Check,
  ArrowLeft,
  Package,
  Truck,
  Phone,
  Mail,
  Percent
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CartItem {
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    sku: string;
    tax_rate: number; // Added tax rate field
  };
  quantity: number;
}

interface OrderData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  company_name: string;
  billing_address: {
    address: string;
    city: string;
    district: string;
    postal_code: string;
  };
  shipping_address: {
    address: string;
    city: string;
    district: string;
    postal_code: string;
  };
  notes: string;
  payment_method: string;
}

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [sameAsShipping, setSameAsShipping] = useState(true);

  const [orderData, setOrderData] = useState<OrderData>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    company_name: '',
    billing_address: {
      address: '',
      city: '',
      district: '',
      postal_code: ''
    },
    shipping_address: {
      address: '',
      city: '',
      district: '',
      postal_code: ''
    },
    notes: '',
    payment_method: 'bank_transfer'
  });

  useEffect(() => {
    if (location.state?.cart) {
      setCart(location.state.cart);
    } else {
      // Sepet boşsa mağazaya yönlendir
      navigate('/magaza');
    }
  }, [location.state, navigate]);

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getShippingCost = () => {
    const subtotal = getSubtotal();
    return subtotal > 500 ? 0 : 50; // 500 TL üzeri ücretsiz kargo
  };

  const getTaxAmount = (item: CartItem) => {
    return (item.product.price * item.quantity) * (item.product.tax_rate / 100);
  };

  const getTotalTax = () => {
    return cart.reduce((total, item) => total + getTaxAmount(item), 0);
  };

  const getTotal = () => {
    return getSubtotal() + getShippingCost() + getTotalTax();
  };

  const getTaxRateLabel = (rate: number) => {
    return `%${rate}`;
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setOrderData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof OrderData] as any,
          [child]: value
        }
      }));
    } else {
      setOrderData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSameAsShippingChange = (checked: boolean) => {
    setSameAsShipping(checked);
    if (checked) {
      setOrderData(prev => ({
        ...prev,
        shipping_address: { ...prev.billing_address }
      }));
    }
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return orderData.customer_name && orderData.customer_email && orderData.customer_phone;
      case 2:
        return orderData.billing_address.address && orderData.billing_address.city;
      case 3:
        return orderData.payment_method;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    } else {
      alert('Lütfen tüm gerekli alanları doldurun.');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const submitOrder = async () => {
    setLoading(true);
    try {
      // Sipariş oluştur
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_name: orderData.customer_name,
          customer_email: orderData.customer_email,
          customer_phone: orderData.customer_phone,
          company_name: orderData.company_name,
          billing_address: orderData.billing_address,
          shipping_address: sameAsShipping ? orderData.billing_address : orderData.shipping_address,
          subtotal: getSubtotal(),
          tax_amount: getTotalTax(),
          shipping_amount: getShippingCost(),
          total_amount: getTotal(),
          payment_method: orderData.payment_method,
          notes: orderData.notes
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Sipariş kalemlerini oluştur
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_sku: item.product.sku,
        quantity: item.quantity,
        unit_price: item.product.price,
        total_price: item.product.price * item.quantity,
        tax_rate: item.product.tax_rate,
        tax_amount: getTaxAmount(item)
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      setOrderNumber(order.order_number);
      setOrderComplete(true);
      
      // Sepeti temizle
      localStorage.removeItem('pestmentor_cart');
      
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Sipariş oluşturulurken hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
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

  if (orderComplete) {
    return (
      <div className="pt-8 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Siparişiniz Alındı!
              </h1>
              <p className="text-gray-600 mb-6">
                Sipariş numaranız: <strong>{orderNumber}</strong>
              </p>
              <p className="text-gray-600 mb-8">
                Siparişiniz başarıyla oluşturuldu. En kısa sürede sizinle iletişime geçeceğiz.
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => navigate('/magaza')}
                  className="w-full bg-pest-green-600 text-white py-3 px-6 rounded-lg hover:bg-pest-green-700 transition-colors"
                >
                  Alışverişe Devam Et
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Ana Sayfaya Dön
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-8 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/magaza')}
            className="flex items-center text-pest-green-600 hover:text-pest-green-700 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Mağazaya Dön
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Sipariş Tamamla</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[
              { step: 1, title: 'Bilgiler', icon: User },
              { step: 2, title: 'Adres', icon: MapPin },
              { step: 3, title: 'Ödeme', icon: CreditCard },
              { step: 4, title: 'Onay', icon: Check }
            ].map(({ step, title, icon: Icon }) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= step ? 'bg-pest-green-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`ml-2 ${currentStep >= step ? 'text-pest-green-600' : 'text-gray-600'}`}>
                  {title}
                </span>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-4 ${
                    currentStep > step ? 'bg-pest-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {/* Step 1: Customer Information */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Müşteri Bilgileri</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ad Soyad *
                      </label>
                      <input
                        type="text"
                        required
                        value={orderData.customer_name}
                        onChange={(e) => handleInputChange('customer_name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                        placeholder="Adınız ve soyadınız"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-posta *
                      </label>
                      <input
                        type="email"
                        required
                        value={orderData.customer_email}
                        onChange={(e) => handleInputChange('customer_email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                        placeholder="E-posta adresiniz"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefon *
                      </label>
                      <input
                        type="tel"
                        required
                        value={orderData.customer_phone}
                        onChange={(e) => handleInputChange('customer_phone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                        placeholder="Telefon numaranız"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Şirket Adı
                      </label>
                      <input
                        type="text"
                        value={orderData.company_name}
                        onChange={(e) => handleInputChange('company_name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                        placeholder="Şirket adınız (opsiyonel)"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Address Information */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Adres Bilgileri</h2>
                  
                  {/* Billing Address */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Fatura Adresi</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Adres *
                        </label>
                        <textarea
                          required
                          value={orderData.billing_address.address}
                          onChange={(e) => handleInputChange('billing_address.address', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                          rows={3}
                          placeholder="Tam adresiniz"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          İl *
                        </label>
                        <input
                          type="text"
                          required
                          value={orderData.billing_address.city}
                          onChange={(e) => handleInputChange('billing_address.city', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                          placeholder="İl"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          İlçe
                        </label>
                        <input
                          type="text"
                          value={orderData.billing_address.district}
                          onChange={(e) => handleInputChange('billing_address.district', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                          placeholder="İlçe"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Same as Billing Checkbox */}
                  <div className="mb-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={sameAsShipping}
                        onChange={(e) => handleSameAsShippingChange(e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Teslimat adresi fatura adresi ile aynı</span>
                    </label>
                  </div>

                  {/* Shipping Address */}
                  {!sameAsShipping && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Teslimat Adresi</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Adres *
                          </label>
                          <textarea
                            required
                            value={orderData.shipping_address.address}
                            onChange={(e) => handleInputChange('shipping_address.address', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                            rows={3}
                            placeholder="Tam adresiniz"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            İl *
                          </label>
                          <input
                            type="text"
                            required
                            value={orderData.shipping_address.city}
                            onChange={(e) => handleInputChange('shipping_address.city', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                            placeholder="İl"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            İlçe
                          </label>
                          <input
                            type="text"
                            value={orderData.shipping_address.district}
                            onChange={(e) => handleInputChange('shipping_address.district', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                            placeholder="İlçe"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Payment Method */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Ödeme Yöntemi</h2>
                  <div className="space-y-4">
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment_method"
                        value="bank_transfer"
                        checked={orderData.payment_method === 'bank_transfer'}
                        onChange={(e) => handleInputChange('payment_method', e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Banka Havalesi / EFT</div>
                        <div className="text-sm text-gray-600">Sipariş onayı sonrası hesap bilgilerimizi paylaşacağız</div>
                      </div>
                    </label>
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment_method"
                        value="cash_on_delivery"
                        checked={orderData.payment_method === 'cash_on_delivery'}
                        onChange={(e) => handleInputChange('payment_method', e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Kapıda Ödeme</div>
                        <div className="text-sm text-gray-600">Ürünler teslim edilirken nakit ödeme</div>
                      </div>
                    </label>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sipariş Notları
                    </label>
                    <textarea
                      value={orderData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500"
                      rows={3}
                      placeholder="Siparişiniz hakkında özel notlarınız..."
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Order Confirmation */}
              {currentStep === 4 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Sipariş Onayı</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Müşteri Bilgileri</h3>
                      <p className="text-gray-600">{orderData.customer_name}</p>
                      <p className="text-gray-600">{orderData.customer_email}</p>
                      <p className="text-gray-600">{orderData.customer_phone}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Teslimat Adresi</h3>
                      <p className="text-gray-600">
                        {(sameAsShipping ? orderData.billing_address : orderData.shipping_address).address}
                      </p>
                      <p className="text-gray-600">
                        {(sameAsShipping ? orderData.billing_address : orderData.shipping_address).district}, {(sameAsShipping ? orderData.billing_address : orderData.shipping_address).city}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Ödeme Yöntemi</h3>
                      <p className="text-gray-600">
                        {orderData.payment_method === 'bank_transfer' ? 'Banka Havalesi / EFT' : 'Kapıda Ödeme'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <button
                    onClick={prevStep}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Geri
                  </button>
                )}
                {currentStep < 4 ? (
                  <button
                    onClick={nextStep}
                    className="ml-auto px-6 py-3 bg-pest-green-600 text-white rounded-lg hover:bg-pest-green-700 transition-colors"
                  >
                    İleri
                  </button>
                ) : (
                  <button
                    onClick={submitOrder}
                    disabled={loading}
                    className="ml-auto px-6 py-3 bg-pest-green-600 text-white rounded-lg hover:bg-pest-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Sipariş Oluşturuluyor...</span>
                      </>
                    ) : (
                      <span>Siparişi Tamamla</span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Sipariş Özeti</h3>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-3">
                    <img
                      src={getImageUrl(item.product.image_url)}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{item.product.name}</h4>
                      <div className="flex items-center text-sm">
                        <p className="text-gray-600">
                          {item.quantity} x ₺{item.product.price.toLocaleString('tr-TR')}
                        </p>
                        <span className="text-xs text-gray-500 ml-2">
                          (KDV: {getTaxRateLabel(item.product.tax_rate)})
                        </span>
                      </div>
                    </div>
                    <span className="font-medium text-gray-900">
                      ₺{(item.product.price * item.quantity).toLocaleString('tr-TR')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ara Toplam:</span>
                  <span className="font-medium">₺{getSubtotal().toLocaleString('tr-TR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">KDV:</span>
                  <span className="font-medium">₺{getTotalTax().toLocaleString('tr-TR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kargo:</span>
                  <span className="font-medium">
                    {getShippingCost() === 0 ? 'Ücretsiz' : `₺${getShippingCost().toLocaleString('tr-TR')}`}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Toplam:</span>
                  <span className="text-pest-green-600">₺{getTotal().toLocaleString('tr-TR')}</span>
                </div>
              </div>

              {/* Tax Breakdown */}
              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                  <Percent className="h-4 w-4 mr-1" />
                  KDV Dağılımı
                </h4>
                {[...new Set(cart.map(item => item.product.tax_rate))].map(rate => {
                  const itemsWithRate = cart.filter(item => item.product.tax_rate === rate);
                  const taxTotal = itemsWithRate.reduce((sum, item) => sum + getTaxAmount(item), 0);
                  
                  return (
                    <div key={rate} className="flex justify-between text-sm">
                      <span className="text-gray-600">%{rate} KDV:</span>
                      <span className="font-medium">₺{taxTotal.toLocaleString('tr-TR')}</span>
                    </div>
                  );
                })}
              </div>

              {getShippingCost() === 0 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <Truck className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm text-green-700 font-medium">Ücretsiz Kargo!</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;