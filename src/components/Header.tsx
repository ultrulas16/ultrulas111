import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, Mail, ShoppingCart, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const userMenu = document.getElementById('user-menu');
      if (userMenu && !userMenu.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-pest-green-700 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              <a href="tel:02242338387" className="hover:text-pest-green-200 transition-colors">
                0224 233 83 87
              </a>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              <a href="mailto:info@pestmentor.com.tr" className="hover:text-pest-green-200 transition-colors">
                info@pestmentor.com.tr
              </a>
            </div>
          </div>
          <div className="hidden md:block text-right">
            <span className="text-sm">Türkiye'nin Güvenilir Zararlı Mücadele Uzmanı</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/pestmentor-logo-png-297x97.webp" 
              alt="PestMentor Logo" 
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop menu */}
          <ul className="hidden md:flex space-x-8">
            <li>
              <Link 
                to="/" 
                className={`font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-pest-green-700 border-b-2 border-pest-green-700 pb-1' 
                    : 'text-gray-700 hover:text-pest-green-700'
                }`}
              >
                Ana Sayfa
              </Link>
            </li>
            <li>
              <Link 
                to="/hizmetler" 
                className={`font-medium transition-colors ${
                  isActive('/hizmetler') 
                    ? 'text-pest-green-700 border-b-2 border-pest-green-700 pb-1' 
                    : 'text-gray-700 hover:text-pest-green-700'
                }`}
              >
                Hizmetler
              </Link>
            </li>
            <li>
              <Link 
                to="/magaza" 
                className={`font-medium transition-colors ${
                  isActive('/magaza') 
                    ? 'text-pest-green-700 border-b-2 border-pest-green-700 pb-1' 
                    : 'text-gray-700 hover:text-pest-green-700'
                }`}
              >
                Mağaza
              </Link>
            </li>
            <li>
              <Link 
                to="/moduller" 
                className={`font-medium transition-colors ${
                  isActive('/moduller') 
                    ? 'text-pest-green-700 border-b-2 border-pest-green-700 pb-1' 
                    : 'text-gray-700 hover:text-pest-green-700'
                }`}
              >
                Modüller
              </Link>
            </li>
            <li>
              <Link 
                to="/bayilik" 
                className={`font-medium transition-colors ${
                  isActive('/bayilik') 
                    ? 'text-pest-green-700 border-b-2 border-pest-green-700 pb-1' 
                    : 'text-gray-700 hover:text-pest-green-700'
                }`}
              >
                Bayilik
              </Link>
            </li>
            <li>
              <Link 
                to="/hizmet-bolgeleri" 
                className={`font-medium transition-colors ${
                  isActive('/hizmet-bolgeleri') 
                    ? 'text-pest-green-700 border-b-2 border-pest-green-700 pb-1' 
                    : 'text-gray-700 hover:text-pest-green-700'
                }`}
              >
                Hizmet Bölgeleri
              </Link>
            </li>
            <li>
              <Link 
                to="/hasere-kutuphanesi" 
                className={`font-medium transition-colors ${
                  isActive('/hasere-kutuphanesi') 
                    ? 'text-pest-green-700 border-b-2 border-pest-green-700 pb-1' 
                    : 'text-gray-700 hover:text-pest-green-700'
                }`}
              >
                Haşere Kütüphanesi
              </Link>
            </li>
            <li>
              <Link 
                to="/blog" 
                className={`font-medium transition-colors ${
                  isActive('/blog') 
                    ? 'text-pest-green-700 border-b-2 border-pest-green-700 pb-1' 
                    : 'text-gray-700 hover:text-pest-green-700'
                }`}
              >
                Blog
              </Link>
            </li>
            <li>
              <Link 
                to="/dokumanlar" 
                className={`font-medium transition-colors ${
                  isActive('/dokumanlar') 
                    ? 'text-pest-green-700 border-b-2 border-pest-green-700 pb-1' 
                    : 'text-gray-700 hover:text-pest-green-700'
                }`}
              >
                Dökümanlar
              </Link>
            </li>
            <li>
              <Link 
                to="/hakkimizda" 
                className={`font-medium transition-colors ${
                  isActive('/hakkimizda') 
                    ? 'text-pest-green-700 border-b-2 border-pest-green-700 pb-1' 
                    : 'text-gray-700 hover:text-pest-green-700'
                }`}
              >
                Hakkımızda
              </Link>
            </li>
            <li>
              <Link 
                to="/iletisim" 
                className={`font-medium transition-colors ${
                  isActive('/iletisim') 
                    ? 'text-pest-green-700 border-b-2 border-pest-green-700 pb-1' 
                    : 'text-gray-700 hover:text-pest-green-700'
                }`}
              >
                İletişim
              </Link>
            </li>
          </ul>

          {/* User menu and mobile menu button */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative" id="user-menu">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 text-gray-700 hover:text-pest-green-700 transition-colors"
                >
                  <div className="w-8 h-8 bg-pest-green-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-pest-green-700" />
                  </div>
                  <span className="hidden md:block font-medium">
                    {user.firstName || user.email.split('@')[0]}
                  </span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/auth/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profil
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Yönetim Paneli
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth/login"
                className="hidden md:flex items-center space-x-2 text-gray-700 hover:text-pest-green-700 transition-colors"
              >
                <User className="h-5 w-5" />
                <span className="font-medium">Giriş Yap</span>
              </Link>
            )}
            
            <button onClick={toggleMenu} className="md:hidden">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className={`block py-2 transition-colors ${
                    isActive('/') ? 'text-pest-green-700 font-medium' : 'text-gray-700 hover:text-pest-green-700'
                  }`}
                >
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link 
                  to="/hizmetler" 
                  className={`block py-2 transition-colors ${
                    isActive('/hizmetler') ? 'text-pest-green-700 font-medium' : 'text-gray-700 hover:text-pest-green-700'
                  }`}
                >
                  Hizmetler
                </Link>
              </li>
              <li>
                <Link 
                  to="/magaza" 
                  className={`block py-2 transition-colors ${
                    isActive('/magaza') ? 'text-pest-green-700 font-medium' : 'text-gray-700 hover:text-pest-green-700'
                  }`}
                >
                  Mağaza
                </Link>
              </li>
              <li>
                <Link 
                  to="/moduller" 
                  className={`block py-2 transition-colors ${
                    isActive('/moduller') ? 'text-pest-green-700 font-medium' : 'text-gray-700 hover:text-pest-green-700'
                  }`}
                >
                  Modüller
                </Link>
              </li>
              <li>
                <Link 
                  to="/bayilik" 
                  className={`block py-2 transition-colors ${
                    isActive('/bayilik') ? 'text-pest-green-700 font-medium' : 'text-gray-700 hover:text-pest-green-700'
                  }`}
                >
                  Bayilik
                </Link>
              </li>
              <li>
                <Link 
                  to="/hizmet-bolgeleri" 
                  className={`block py-2 transition-colors ${
                    isActive('/hizmet-bolgeleri') ? 'text-pest-green-700 font-medium' : 'text-gray-700 hover:text-pest-green-700'
                  }`}
                >
                  Hizmet Bölgeleri
                </Link>
              </li>
              <li>
                <Link 
                  to="/hasere-kutuphanesi" 
                  className={`block py-2 transition-colors ${
                    isActive('/hasere-kutuphanesi') ? 'text-pest-green-700 font-medium' : 'text-gray-700 hover:text-pest-green-700'
                  }`}
                >
                  Haşere Kütüphanesi
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  className={`block py-2 transition-colors ${
                    isActive('/blog') ? 'text-pest-green-700 font-medium' : 'text-gray-700 hover:text-pest-green-700'
                  }`}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  to="/dokumanlar" 
                  className={`block py-2 transition-colors ${
                    isActive('/dokumanlar') ? 'text-pest-green-700 font-medium' : 'text-gray-700 hover:text-pest-green-700'
                  }`}
                >
                  Dökümanlar
                </Link>
              </li>
              <li>
                <Link 
                  to="/hakkimizda" 
                  className={`block py-2 transition-colors ${
                    isActive('/hakkimizda') ? 'text-pest-green-700 font-medium' : 'text-gray-700 hover:text-pest-green-700'
                  }`}
                >
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link 
                  to="/iletisim" 
                  className={`block py-2 transition-colors ${
                    isActive('/iletisim') ? 'text-pest-green-700 font-medium' : 'text-gray-700 hover:text-pest-green-700'
                  }`}
                >
                  İletişim
                </Link>
              </li>
              {!user ? (
                <li>
                  <Link 
                    to="/auth/login" 
                    className="block py-2 text-pest-green-700 font-medium"
                  >
                    Giriş Yap
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link 
                      to="/auth/profile" 
                      className="block py-2 text-pest-green-700 font-medium"
                    >
                      Profil
                    </Link>
                  </li>
                  {user.role === 'admin' && (
                    <li>
                      <Link 
                        to="/admin/dashboard" 
                        className="block py-2 text-purple-700 font-medium"
                      >
                        Yönetim Paneli
                      </Link>
                    </li>
                  )}
                  <li>
                    <button 
                      onClick={handleSignOut}
                      className="block py-2 text-red-600 font-medium"
                    >
                      Çıkış Yap
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;