import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/home/Hero';
import { EmergencyFaultBanner } from './components/home/EmergencyFaultBanner';
import { HowWeWorkTimeline } from './components/home/HowWeWorkTimeline';
import { FeaturedServices } from './components/home/FeaturedServices';
import { WhyChooseUs } from './components/home/WhyChooseUs';
import { SystemsAndIndustries } from './components/home/SystemsAndIndustries';
import { GallerySection } from './components/home/GallerySection';
import { FaqSection } from './components/home/FaqSection';
import { ServiceDetailPage } from './components/services/ServiceDetailPage';
import { RequestServiceWizard } from './components/requests/RequestServiceWizard';
import { ReportFaultWizard } from './components/requests/ReportFaultWizard';
import { VoiceAiGuide } from './components/voice/VoiceAiGuide';
import { CustomerDashboard } from './components/dashboard/CustomerDashboard';
import { StaffDashboard } from './components/dashboard/StaffDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { LegalPages } from './components/legal/LegalPages';
import { AboutUsPage } from './components/about/AboutUsPage';
import { ContactPage } from './components/contact/ContactPage';
import { CareersPage } from './components/careers/CareersPage';
import { FireDetectionLogbookView } from './components/compliance/FireDetectionLogbookView';
import { CertificateOfComplianceForm } from './components/compliance/CertificateOfComplianceForm';
import { SafetyFileDashboard } from './components/compliance/SafetyFileDashboard';
import { SafetyFileCover } from './components/compliance/SafetyFileCover';
import { ComplianceAuditLog } from './components/compliance/ComplianceAuditLog';
import { AuthModals } from './components/auth/AuthModals';
import { InfrastructureDocsModal } from './components/infrastructure/InfrastructureDocsModal';
import { useAudrinStore } from './services/store';
import { Mic, ShieldAlert, FileCode, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function App() {
  const store = useAudrinStore();
  const theme = store.getTheme();
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedServiceSlug, setSelectedServiceSlug] = useState<string>('sans-10139-system-design-installation');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot_password'>('login');
  const [infraModalOpen, setInfraModalOpen] = useState(false);
  const [voiceGuideOpen, setVoiceGuideOpen] = useState(false);
  const [selectedDossierId, setSelectedDossierId] = useState<string | undefined>(undefined);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedServiceSlug]);

  // Ensure DOM theme attributes match store and bind Alt+T shortcut
  useEffect(() => {
    store.applyThemeToDom(theme);

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
        return;
      }
      if ((e.altKey && e.key.toLowerCase() === 't') || (e.shiftKey && e.key.toLowerCase() === 't')) {
        e.preventDefault();
        store.toggleTheme();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [theme, store]);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const handleSelectService = (slug: string) => {
    setSelectedServiceSlug(slug);
    setCurrentView('service-detail');
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div 
      data-theme={theme}
      className={`min-h-screen ${theme === 'dark' ? 'theme-dark bg-[#07122E] text-slate-100' : 'theme-light bg-[#F8FAFC] text-slate-900'} flex flex-col selection:bg-[#C1A461] selection:text-black font-sans antialiased transition-colors duration-200`}
    >
      {/* Top Navigation Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onRequestService={() => setCurrentView('request-service')}
        onReportFault={() => setCurrentView('report-fault')}
        onOpenLogin={() => handleOpenAuth('login')}
        onOpenVoiceGuide={() => setVoiceGuideOpen(true)}
      />

      {/* Main View Router with Modern Fluid Transition */}
      <main className={`flex-grow ${theme === 'dark' ? 'bg-[#07122E]' : 'bg-[#F8FAFC]'}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {currentView === 'home' && (
              <div className="space-y-0">
                <Hero
                  onRequestService={(slug) => {
                    if (slug) setSelectedServiceSlug(slug);
                    setCurrentView('request-service');
                  }}
                  onReportFault={() => setCurrentView('report-fault')}
                  onOpenVoiceGuide={() => setVoiceGuideOpen(true)}
                  onNavigate={handleNavigate}
                />
                <EmergencyFaultBanner onReportFault={() => setCurrentView('report-fault')} />
                <FeaturedServices
                  onSelectService={handleSelectService}
                  onRequestService={(slug) => {
                    if (slug) setSelectedServiceSlug(slug);
                    setCurrentView('request-service');
                  }}
                />
                <HowWeWorkTimeline onOpenVoiceGuide={() => setVoiceGuideOpen(true)} />
                <WhyChooseUs />
                <SystemsAndIndustries />
                <GallerySection />
                <FaqSection />
              </div>
            )}

            {currentView === 'service-detail' && (
              <ServiceDetailPage
                serviceSlug={selectedServiceSlug}
                onBack={() => setCurrentView('home')}
                onRequestService={() => setCurrentView('request-service')}
                onSelectService={(slug) => setSelectedServiceSlug(slug)}
              />
            )}

            {currentView === 'request-service' && (
              <RequestServiceWizard
                initialServiceSlug={selectedServiceSlug}
                onCancel={() => setCurrentView('home')}
                onSuccess={() => setCurrentView('customer-dashboard')}
              />
            )}

            {currentView === 'report-fault' && (
              <ReportFaultWizard
                onCancel={() => setCurrentView('home')}
                onSuccess={() => setCurrentView('customer-dashboard')}
              />
            )}

            {currentView === 'customer-dashboard' && (
              <CustomerDashboard
                onRequestService={() => setCurrentView('request-service')}
                onReportFault={() => setCurrentView('report-fault')}
                onSelectService={handleSelectService}
              />
            )}

            {currentView === 'staff-dashboard' && (
              <StaffDashboard />
            )}

            {currentView === 'fire-logbook' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <FireDetectionLogbookView />
              </div>
            )}

            {currentView === 'admin-dashboard' && (
              <AdminDashboard onNavigate={handleNavigate} />
            )}

            {['certificate-of-compliance', 'coc-form', 'sans-coc'].includes(currentView) && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#151518] border border-white/5 shadow-xl">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCurrentView('admin-dashboard')}
                      className="px-3.5 py-2 bg-[#0A0A0B] hover:bg-[#1E1E22] text-white/80 hover:text-white rounded-xl text-xs font-mono font-bold flex items-center gap-2 border border-white/10 transition cursor-pointer"
                    >
                      &larr; Return to Admin Dashboard
                    </button>
                    <div className="h-5 w-px bg-white/10 hidden sm:block" />
                    <div>
                      <h1 className="text-sm font-bold text-white">SANS 10139 Certificate of Compliance Route</h1>
                      <p className="text-[10px] font-mono text-[#C1A461]">SAQCC Commissioner Statutory Module</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Authorized Commissioner Session Active
                    </span>
                  </div>
                </div>

                <CertificateOfComplianceForm
                  isOpen={true}
                  onClose={() => setCurrentView('admin-dashboard')}
                  onSaved={() => setCurrentView('admin-dashboard')}
                />
              </div>
            )}

            {['safety-file-dashboard', 'safety-file', 'safety-files'].includes(currentView) && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <SafetyFileDashboard
                  onNavigateToCover={(dId) => {
                    setSelectedDossierId(dId);
                    setCurrentView('safety-file-cover');
                  }}
                  onNavigateToAudit={(projId) => {
                    if (projId) setSelectedDossierId(projId);
                    setCurrentView('compliance-audit-log');
                  }}
                  onNavigateToCoc={() => setCurrentView('coc-form')}
                />
              </div>
            )}

            {currentView === 'safety-file-cover' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <SafetyFileCover
                  dossierId={selectedDossierId}
                  onBack={() => setCurrentView('safety-file-dashboard')}
                  onNavigateToAudit={() => setCurrentView('compliance-audit-log')}
                />
              </div>
            )}

            {['compliance-audit-log', 'compliance-audit', 'audit-trail'].includes(currentView) && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ComplianceAuditLog
                  onBack={() => setCurrentView('safety-file-dashboard')}
                  onNavigateToSafetyFile={(dId) => {
                    setSelectedDossierId(dId);
                    setCurrentView('safety-file-dashboard');
                  }}
                />
              </div>
            )}

            {currentView === 'about' && (
              <AboutUsPage onRequestService={() => setCurrentView('request-service')} />
            )}

            {currentView === 'careers' && (
              <CareersPage />
            )}

            {currentView === 'contact' && (
              <ContactPage />
            )}

            {['privacy-policy', 'terms', 'cookie-policy', 'popia-notice'].includes(currentView) && (
              <LegalPages
                pageType={currentView as any}
                onBack={() => setCurrentView('home')}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Interactive Voice AI Guide Overlay Modal */}
      <VoiceAiGuide
        isOpen={voiceGuideOpen}
        onClose={() => setVoiceGuideOpen(false)}
        onRequestService={() => {
          setVoiceGuideOpen(false);
          setCurrentView('request-service');
        }}
      />

      {/* Floating Action Utilities Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-6 right-6 z-40 flex flex-col gap-2.5 items-end"
      >
        {/* Floating Quick Theme Toggle (Daylight / Night Navy) */}
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => store.toggleTheme()}
          className="flex items-center gap-2 px-3.5 py-2 bg-[#151518]/95 hover:bg-[#1E1E22] text-white rounded-full border border-white/10 shadow-xl text-xs font-mono transition cursor-pointer"
          title={theme === 'dark' ? 'Night Inspection Mode Active. Click to switch to Daylight (Alt+T)' : 'Daylight Theme Active. Click to switch to Night Inspection Mode (Alt+T)'}
        >
          {theme === 'dark' ? (
            <>
              <Moon className="w-3.5 h-3.5 text-[#C1A461]" />
              <span className="text-[11px] font-bold text-[#C1A461]">Night Navy</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[11px] font-bold text-slate-800">Daylight</span>
            </>
          )}
        </motion.button>

        {/* Floating Voice AI Assistant button */}
        {!voiceGuideOpen && (
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setVoiceGuideOpen(true)}
            aria-label="Open SANS 10139 Voice AI Walkthrough"
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#C1A461] to-[#A88B46] hover:from-[#D4BC7B] hover:to-[#C1A461] text-black rounded-full shadow-2xl shadow-black/60 text-xs font-bold tracking-wide transition-all duration-300 border border-white/10 cursor-pointer"
          >
            <Mic className="w-4 h-4 text-black animate-pulse" />
            <span className="uppercase tracking-wider font-extrabold text-[11px]">Voice AI Guide</span>
          </motion.button>
        )}

        {/* Backend Infrastructure Docs button */}
        <motion.button
          whileHover={{ scale: 1.04, y: -1 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setInfraModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#151518]/90 hover:bg-[#1E1E22] text-white/70 hover:text-white rounded-full border border-white/10 shadow-xl text-xs font-mono transition cursor-pointer"
          title="Inspect AWS ECS & Terraform Architecture"
        >
          <FileCode className="w-3.5 h-3.5 text-[#C1A461]" />
          <span className="text-[11px]">AWS ECS Architecture</span>
        </motion.button>
      </motion.div>

      {/* Authentication Modals */}
      <AuthModals
        isOpen={authModalOpen}
        mode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSwitchMode={(mode) => setAuthModalMode(mode)}
      />

      {/* Backend Infrastructure Docs Modal */}
      <InfrastructureDocsModal
        isOpen={infraModalOpen}
        onClose={() => setInfraModalOpen(false)}
      />

      {/* Global Footer */}
      <Footer
        onNavigate={handleNavigate}
        onSelectService={handleSelectService}
      />
    </div>
  );
}

export default App;
