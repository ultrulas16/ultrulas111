import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedModulePage from './components/ProtectedModulePage';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ServiceRegionsPage from './pages/ServiceRegionsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BankAccountPage from './pages/BankAccountPage';
import CompanyInfoPage from './pages/CompanyInfoPage';
import PestLibraryPage from './pages/PestLibraryPage';
import BlogPage from './pages/BlogPage';
import DocumentsPage from './pages/DocumentsPage';
import StorePage from './pages/StorePage';
import OrderPage from './pages/OrderPage';
import ModulesPage from './pages/ModulesPage';
import RiskAssessmentPage from './pages/RiskAssessmentPage';
import RiskActionPlanPage from './pages/RiskActionPlanPage';
import HazardRiskAssessmentPage from './pages/HazardRiskAssessmentPage';
import InspectionReportPage from './pages/InspectionReportPage';
import ComplianceCheckPage from './pages/ComplianceCheckPage';
import ContractPage from './pages/ContractPage';
import LayoutDesignerPage from './pages/LayoutDesignerPage';
import TrendAnalysisPage from './pages/TrendAnalysisPage';
import VisitCalendarPage from './pages/VisitCalendarPage';
import AutoTrendAnalysisPage from './pages/AutoTrendAnalysisPage';
import FranchisePage from './pages/FranchisePage';
import CareersPage from './pages/CareersPage';
import TrainingPresentationPage from './pages/TrainingPresentationPage';
import TrainingCertificatePage from './pages/TrainingCertificatePage';
import QuoteGeneratorPage from './pages/QuoteGeneratorPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import RiskAreaIdentificationPage from './pages/RiskAreaIdentificationPage';
import ThirdEyeReportPage from './pages/ThirdEyeReportPage';
import PestRiskAnalysisPage from './pages/PestRiskAnalysisPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ProfilePage from './pages/auth/ProfilePage';
import ChangePasswordPage from './pages/auth/ChangePasswordPage';

// Corporate Service Pages
import IPMPage from './pages/services/IPMPage';
import DisinfectionPage from './pages/services/DisinfectionPage';
import FumigationPage from './pages/services/FumigationPage';
import BirdControlPage from './pages/services/BirdControlPage';
import ThirdPartyConsultingPage from './pages/services/ThirdPartyConsultingPage';
import PestControlPage from './pages/services/PestControlPage';

// Standards Pages
import BRCPage from './pages/services/BRCPage';
import AIBPage from './pages/services/AIBPage';
import HACCPPage from './pages/services/HACCPPage';
import ISO22000Page from './pages/services/ISO22000Page';

// Admin Pages
import AdminLoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import DocumentManagementPage from './pages/admin/DocumentManagementPage';
import ProductManagementPage from './pages/admin/ProductManagementPage';
import OrderManagementPage from './pages/admin/OrderManagementPage';
import DiscoveryRequestsPage from './pages/admin/DiscoveryRequestsPage';
import SystemSettingsPage from './pages/admin/SystemSettingsPage';
import FranchiseApplicationsPage from './pages/admin/FranchiseApplicationsPage';
import JobApplicationsPage from './pages/admin/JobApplicationsPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import EmailCampaignsPage from './pages/admin/EmailCampaignsPage';
import RecipientGroupsPage from './pages/admin/RecipientGroupsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Routes>
            {/* Admin Routes - No Header/Footer */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/documents" 
              element={
                <ProtectedRoute>
                  <DocumentManagementPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/products" 
              element={
                <ProtectedRoute>
                  <ProductManagementPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/orders" 
              element={
                <ProtectedRoute>
                  <OrderManagementPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/discovery-requests" 
              element={
                <ProtectedRoute>
                  <DiscoveryRequestsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/system-settings" 
              element={
                <ProtectedRoute>
                  <SystemSettingsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/franchise-applications" 
              element={
                <ProtectedRoute>
                  <FranchiseApplicationsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/job-applications" 
              element={
                <ProtectedRoute>
                  <JobApplicationsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute>
                  <UserManagementPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/email-campaigns" 
              element={
                <ProtectedRoute>
                  <EmailCampaignsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/recipient-groups" 
              element={
                <ProtectedRoute>
                  <RecipientGroupsPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Auth Routes - No Header/Footer */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            <Route 
              path="/auth/profile" 
              element={
                <ProtectedRoute>
                  <Header />
                  <ProfilePage />
                  <Footer />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/auth/change-password" 
              element={
                <ProtectedRoute>
                  <Header />
                  <ChangePasswordPage />
                  <Footer />
                </ProtectedRoute>
              } 
            />
            
            {/* Public Routes with Header and Footer */}
            <Route path="/*" element={
              <>
                <Header />
                <main>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/hizmetler" element={<ServicesPage />} />
                    <Route path="/hizmet-bolgeleri" element={<ServiceRegionsPage />} />
                    <Route path="/hakkimizda" element={<AboutPage />} />
                    <Route path="/iletisim" element={<ContactPage />} />
                    <Route path="/hesap-bilgileri" element={<BankAccountPage />} />
                    <Route path="/firma-bilgileri" element={<CompanyInfoPage />} />
                    <Route path="/hasere-kutuphanesi" element={<PestLibraryPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/dokumanlar" element={<DocumentsPage />} />
                    <Route path="/magaza" element={<StorePage />} />
                    <Route path="/magaza/siparis" element={<OrderPage />} />
                    <Route path="/bayilik" element={<FranchisePage />} />
                    <Route path="/kariyer" element={<CareersPage />} />
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />
                    
                    {/* Protected Module Routes */}
                    <Route path="/moduller" element={<ModulesPage />} />
                    <Route path="/moduller/risk-degerlendirme" element={
                      <ProtectedModulePage modulePath="/moduller/risk-degerlendirme">
                        <RiskAssessmentPage />
                      </ProtectedModulePage>
                    } />
                    <Route path="/moduller/risk-aksiyon-plani" element={
                      <ProtectedModulePage modulePath="/moduller/risk-aksiyon-plani">
                        <RiskActionPlanPage />
                      </ProtectedModulePage>
                    } />
                    <Route path="/moduller/tehlike-risk-degerlendirme" element={
                      <ProtectedModulePage modulePath="/moduller/tehlike-risk-degerlendirme">
                        <HazardRiskAssessmentPage />
                      </ProtectedModulePage>
                    } />
                    <Route path="/moduller/denetim-raporu" element={
                      <ProtectedModulePage modulePath="/moduller/denetim-raporu">
                        <InspectionReportPage />
                      </ProtectedModulePage>
                    } />
                    <Route path="/moduller/uygunluk-kontrol" element={
                      <ProtectedModulePage modulePath="/moduller/uygunluk-kontrol">
                        <ComplianceCheckPage />
                      </ProtectedModulePage>
                    } />
                    <Route path="/moduller/sozlesme" element={
                      <ProtectedModulePage modulePath="/moduller/sozlesme">
                        <ContractPage />
                      </ProtectedModulePage>
                    } />
                    <Route path="/moduller/ekipman-krokisi" element={
                      <ProtectedModulePage modulePath="/moduller/ekipman-krokisi">
                        <LayoutDesignerPage />
                      </ProtectedModulePage>
                    } />
                    <Route path="/moduller/trend-analiz" element={
                      <ProtectedModulePage modulePath="/moduller/trend-analiz">
                        <TrendAnalysisPage />
                      </ProtectedModulePage>
                    } />
                    <Route path="/moduller/ziyaret-takvimi" element={
                      <ProtectedModulePage modulePath="/moduller/ziyaret-takvimi">
                        <VisitCalendarPage />
                      </ProtectedModulePage>
                    } />
                    <Route path="/moduller/otomatik-trend-analiz" element={
                      <ProtectedModulePage modulePath="/moduller/otomatik-trend-analiz">
                        <AutoTrendAnalysisPage />
                      </ProtectedModulePage>
                    } />
                    <Route path="/moduller/egitim-sunumu" element={
                      <ProtectedModulePage modulePath="/moduller/egitim-sunumu">
                        <TrainingPresentationPage />
                      </ProtectedModulePage>
                    } />
                    <Route path="/moduller/egitim-sertifikasi" element={
                      <ProtectedModulePage modulePath="/moduller/egitim-sertifikasi">
                        <TrainingCertificatePage />
                      </ProtectedModulePage>
                    } />
                    <Route path="/moduller/fiyat-teklifi" element={
                      <ProtectedModulePage modulePath="/moduller/fiyat-teklifi">
                        <QuoteGeneratorPage />
                      </ProtectedModulePage>
                    } />
                    <Route path="/moduller/riskli-alan-belirleme" element={
                      <ProtectedModulePage modulePath="/moduller/riskli-alan-belirleme">
                        <RiskAreaIdentificationPage />
                      </ProtectedModulePage>
                    } />
                    <Route path="/moduller/3-goz-raporu" element={
                      <ProtectedModulePage modulePath="/moduller/3-goz-raporu">
                        <ThirdEyeReportPage />
                      </ProtectedModulePage>
                    } />
                    <Route path="/moduller/zararli-risk-analizi" element={
                      <ProtectedModulePage modulePath="/moduller/zararli-risk-analizi">
                        <PestRiskAnalysisPage />
                      </ProtectedModulePage>
                    } />

                    {/* Corporate Service Routes */}
                    <Route path="/hizmetler/zarli-mucadelesi-ipm" element={<IPMPage />} />
                    <Route path="/hizmetler/dezenfeksiyon" element={<DisinfectionPage />} />
                    <Route path="/hizmetler/fumigasyon" element={<FumigationPage />} />
                    <Route path="/hizmetler/kus-kontrolu" element={<BirdControlPage />} />
                    <Route path="/hizmetler/ucuncu-goz-danismanlik" element={<ThirdPartyConsultingPage />} />
                    <Route path="/hizmetler/hasere-mucadelesi" element={<PestControlPage />} />
                    
                    {/* Standards Routes */}
                    <Route path="/hizmetler/brc-zarli-mucadelesi" element={<BRCPage />} />
                    <Route path="/hizmetler/aib-zarli-mucadelesi" element={<AIBPage />} />
                    <Route path="/hizmetler/haccp-zarli-mucadelesi" element={<HACCPPage />} />
                    <Route path="/hizmetler/iso22000-zarli-mucadelesi" element={<ISO22000Page />} />
                  </Routes>
                </main>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;