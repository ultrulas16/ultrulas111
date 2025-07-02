a>
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