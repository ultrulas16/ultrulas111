import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle, Shield, ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('Beklenmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pest-green-50 to-pest-green-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-block mb-6">
            <img 
              src="/pestmentor-logo-png-297x97.webp" 
              alt="PestMentor Logo" 
              className="h-16 w-auto mx-auto"
            />
          </Link>
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-pest-green-700 mr-2" />
            <h2 className="text-3xl font-bold text-gray-900">
              Şifremi Unuttum
            </h2>
          </div>
          <p className="text-gray-600">
            Şifrenizi sıfırlamak için e-posta adresinizi girin
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          {success ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Şifre sıfırlama bağlantısı gönderildi</h3>
              <p className="mt-2 text-sm text-gray-500">
                E-posta adresinize şifre sıfırlama bağlantısı gönderdik. Lütfen gelen kutunuzu kontrol edin.
              </p>
              <div className="mt-6">
                <Link
                  to="/auth/login"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pest-green-600 hover:bg-pest-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pest-green-500"
                >
                  Giriş sayfasına dön
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Hata</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pest-green-500 focus:border-pest-green-500 transition-colors"
                    placeholder="ornek@pestmentor.com.tr"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-pest-green-700 hover:bg-pest-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pest-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Gönderiliyor...
                  </div>
                ) : (
                  'Şifre Sıfırlama Bağlantısı Gönder'
                )}
              </button>
            </form>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link to="/auth/login" className="font-medium text-pest-green-600 hover:text-pest-green-500 flex items-center justify-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Giriş sayfasına dön
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link 
            to="/" 
            className="text-sm text-pest-green-700 hover:text-pest-green-800 font-medium"
          >
            ← Ana sayfaya dön
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;