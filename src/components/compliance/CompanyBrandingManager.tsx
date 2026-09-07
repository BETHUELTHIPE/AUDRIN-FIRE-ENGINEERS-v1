import React, { useState } from 'react';
import { useAudrinStore } from '../../services/store';
import { CompanyProfileBranding, AudrinIssuerSettings } from '../../types';
import { 
  Building2, 
  Image as ImageIcon, 
  FileText, 
  MapPin, 
  Phone, 
  Mail, 
  Shield, 
  Save, 
  Upload, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Lock,
  Layers,
  Globe,
  Plus,
  Trash2,
  X
} from 'lucide-react';

export interface CompanyBrandingManagerProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const CompanyBrandingManager: React.FC<CompanyBrandingManagerProps> = ({
  isOpen = true,
  onClose
}) => {
  if (isOpen === false) return null;

  const store = useAudrinStore();
  const currentBranding = store.getCurrentCompanyBranding();
  const issuerSettings = store.getIssuerSettings();
  const currentUser = store.getCurrentUser();
  const sites = store.getSites();

  const [activeTab, setActiveTab] = useState<'client_profile' | 'branding_assets' | 'site_hierarchy' | 'issuer_settings' | 'live_preview'>('client_profile');
  
  const [formData, setFormData] = useState<CompanyProfileBranding>({ ...currentBranding });
  const [issuerData, setIssuerData] = useState<AudrinIssuerSettings>({ ...issuerSettings });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [previewMode, setPreviewMode] = useState<'portrait' | 'landscape'>('portrait');

  const isAdmin = currentUser.role === 'ops_admin' || currentUser.role === 'super_admin' || currentUser.role === 'content_admin';

  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateCompanyBranding(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSaveIssuer = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateIssuerSettings(issuerData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        logoUrl: fakeUrl,
        logoFileName: file.name
      }));
    }
  };

  const handleLetterheadUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        letterheadUrl: fakeUrl,
        letterheadFileName: file.name
      }));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1E1E24] via-[#16161A] to-[#0F0F12] border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C1A461]/20 text-[#C1A461] border border-[#C1A461]/40 font-mono uppercase tracking-wider">
              Section 1 &middot; System Controls
            </span>
            <span className="text-xs font-mono text-white/40">
              Version {formData.version}.0
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Company Profile, Branding & Multi-Site Settings
          </h1>
          <p className="text-sm text-white/60 max-w-2xl">
            Configure client corporate identity, logos, letterheads, emergency points of contact, and Audrin Fire Engineers issuer statutory credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <div className="px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              Changes saved and audit logged!
            </div>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('client_profile')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'client_profile'
              ? 'bg-[#C1A461] text-black shadow-lg shadow-[#C1A461]/20'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Client Corporate Profile
        </button>

        <button
          onClick={() => setActiveTab('branding_assets')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'branding_assets'
              ? 'bg-[#C1A461] text-black shadow-lg shadow-[#C1A461]/20'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Logos & Letterhead Assets
        </button>

        <button
          onClick={() => setActiveTab('site_hierarchy')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'site_hierarchy'
              ? 'bg-[#C1A461] text-black shadow-lg shadow-[#C1A461]/20'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <MapPin className="w-4 h-4" />
          Site Hierarchy & GPS ({sites.length})
        </button>

        {isAdmin && (
          <button
            onClick={() => setActiveTab('issuer_settings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'issuer_settings'
                ? 'bg-[#C1A461] text-black shadow-lg shadow-[#C1A461]/20'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Shield className="w-4 h-4" />
            Audrin Issuer Credentials (Admin)
          </button>
        )}

        <button
          onClick={() => setActiveTab('live_preview')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'live_preview'
              ? 'bg-[#C1A461] text-black shadow-lg shadow-[#C1A461]/20'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Eye className="w-4 h-4" />
          Live Document Layout Preview
        </button>
      </div>

      {/* Tab 1: Client Corporate Profile */}
      {activeTab === 'client_profile' && (
        <form onSubmit={handleSaveClient} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Legal Entity Information */}
            <div className="p-6 rounded-2xl bg-[#151518] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#C1A461]" />
                Client Legal Entity Details
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-white/50 mb-1 font-mono uppercase text-[10px]">
                    Registered Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.registeredName}
                    onChange={e => setFormData({ ...formData, registeredName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#C1A461] outline-none font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/50 mb-1 font-mono uppercase text-[10px]">
                      Trading Name / Brand
                    </label>
                    <input
                      type="text"
                      value={formData.tradingName}
                      onChange={e => setFormData({ ...formData, tradingName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#C1A461] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 mb-1 font-mono uppercase text-[10px]">
                      CIPC Registration No.
                    </label>
                    <input
                      type="text"
                      value={formData.registrationNumber}
                      onChange={e => setFormData({ ...formData, registrationNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#C1A461] outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/50 mb-1 font-mono uppercase text-[10px]">
                      SARS VAT Registration No.
                    </label>
                    <input
                      type="text"
                      value={formData.vatNumber}
                      onChange={e => setFormData({ ...formData, vatNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#C1A461] outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 mb-1 font-mono uppercase text-[10px]">
                      Default Purchase Order Ref
                    </label>
                    <input
                      type="text"
                      value={formData.purchaseOrderReference}
                      onChange={e => setFormData({ ...formData, purchaseOrderReference: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#C1A461] outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/50 mb-1 font-mono uppercase text-[10px]">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={formData.website || ''}
                    onChange={e => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#C1A461] outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Addresses */}
            <div className="p-6 rounded-2xl bg-[#151518] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C1A461]" />
                Registered Addresses
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-white/50 mb-1 font-mono uppercase text-[10px]">
                    Physical Address (Headquarters) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.physicalAddress}
                    onChange={e => setFormData({ ...formData, physicalAddress: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#C1A461] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/50 mb-1 font-mono uppercase text-[10px]">
                    Postal Address
                  </label>
                  <textarea
                    rows={2}
                    value={formData.postalAddress}
                    onChange={e => setFormData({ ...formData, postalAddress: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#C1A461] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/50 mb-1 font-mono uppercase text-[10px]">
                    Billing / Invoicing Address
                  </label>
                  <textarea
                    rows={2}
                    value={formData.billingAddress}
                    onChange={e => setFormData({ ...formData, billingAddress: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#C1A461] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Contacts */}
            <div className="p-6 rounded-2xl bg-[#151518] border border-white/10 space-y-4 md:col-span-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C1A461]" />
                Designated Stakeholder Contacts
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Primary Contact */}
                <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2">
                  <div className="font-bold text-[#C1A461] uppercase font-mono text-[10px]">
                    Primary Life-Safety Officer
                  </div>
                  <div>
                    <label className="text-white/40 block text-[10px]">Full Name</label>
                    <input
                      type="text"
                      value={formData.primaryContact.name}
                      onChange={e => setFormData({
                        ...formData,
                        primaryContact: { ...formData.primaryContact, name: e.target.value }
                      })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs mt-0.5"
                    />
                  </div>
                  <div>
                    <label className="text-white/40 block text-[10px]">Role / Designation</label>
                    <input
                      type="text"
                      value={formData.primaryContact.role}
                      onChange={e => setFormData({
                        ...formData,
                        primaryContact: { ...formData.primaryContact, role: e.target.value }
                      })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs mt-0.5"
                    />
                  </div>
                  <div>
                    <label className="text-white/40 block text-[10px]">Email</label>
                    <input
                      type="email"
                      value={formData.primaryContact.email}
                      onChange={e => setFormData({
                        ...formData,
                        primaryContact: { ...formData.primaryContact, email: e.target.value }
                      })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs mt-0.5 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-white/40 block text-[10px]">Mobile Number</label>
                    <input
                      type="text"
                      value={formData.primaryContact.mobile}
                      onChange={e => setFormData({
                        ...formData,
                        primaryContact: { ...formData.primaryContact, mobile: e.target.value }
                      })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs mt-0.5 font-mono"
                    />
                  </div>
                </div>

                {/* Accounts Contact */}
                <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2">
                  <div className="font-bold text-white/70 uppercase font-mono text-[10px]">
                    Accounts & Invoicing
                  </div>
                  <div>
                    <label className="text-white/40 block text-[10px]">Contact Name</label>
                    <input
                      type="text"
                      value={formData.accountsContact.name}
                      onChange={e => setFormData({
                        ...formData,
                        accountsContact: { ...formData.accountsContact, name: e.target.value }
                      })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs mt-0.5"
                    />
                  </div>
                  <div>
                    <label className="text-white/40 block text-[10px]">Accounts Email</label>
                    <input
                      type="email"
                      value={formData.accountsContact.email}
                      onChange={e => setFormData({
                        ...formData,
                        accountsContact: { ...formData.accountsContact, email: e.target.value }
                      })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs mt-0.5 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-white/40 block text-[10px]">Telephone</label>
                    <input
                      type="text"
                      value={formData.accountsContact.telephone}
                      onChange={e => setFormData({
                        ...formData,
                        accountsContact: { ...formData.accountsContact, telephone: e.target.value }
                      })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs mt-0.5 font-mono"
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20 space-y-2">
                  <div className="font-bold text-red-400 uppercase font-mono text-[10px] flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    24/7 Life Safety Dispatch
                  </div>
                  <div>
                    <label className="text-white/40 block text-[10px]">Dispatch / Control Room</label>
                    <input
                      type="text"
                      value={formData.emergencyContact.name}
                      onChange={e => setFormData({
                        ...formData,
                        emergencyContact: { ...formData.emergencyContact, name: e.target.value }
                      })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs mt-0.5"
                    />
                  </div>
                  <div>
                    <label className="text-white/40 block text-[10px]">24/7 Telephone</label>
                    <input
                      type="text"
                      value={formData.emergencyContact.telephone}
                      onChange={e => setFormData({
                        ...formData,
                        emergencyContact: { ...formData.emergencyContact, telephone: e.target.value }
                      })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs mt-0.5 font-mono text-red-300"
                    />
                  </div>
                  <div>
                    <label className="text-white/40 block text-[10px]">Emergency Cellphone</label>
                    <input
                      type="text"
                      value={formData.emergencyContact.mobile}
                      onChange={e => setFormData({
                        ...formData,
                        emergencyContact: { ...formData.emergencyContact, mobile: e.target.value }
                      })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs mt-0.5 font-mono text-red-300"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Special Instructions */}
            <div className="p-6 rounded-2xl bg-[#151518] border border-white/10 space-y-4 md:col-span-2">
              <h3 className="text-sm font-bold text-white">Client Site Operational Protocols & Notes</h3>
              <textarea
                rows={3}
                value={formData.clientSpecificNotes || ''}
                onChange={e => setFormData({ ...formData, clientSpecificNotes: e.target.value })}
                placeholder="e.g. Advance 48-hour notice required for audible alarm testing. Hot work prohibited between 08:00 and 17:00."
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-[#C1A461]"
              />
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#C1A461] hover:bg-[#d5b976] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#C1A461]/20 transition"
            >
              <Save className="w-4 h-4" />
              Save Client Profile
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Branding & Assets */}
      {activeTab === 'branding_assets' && (
        <form onSubmit={handleSaveClient} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Logo Upload Box */}
            <div className="p-6 rounded-2xl bg-[#151518] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#C1A461]" />
                  Client Organization Logo
                </h3>
                <span className="text-[10px] font-mono text-white/40 uppercase">
                  PNG / SVG / JPG (Max 5MB)
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-black/40 border border-dashed border-white/20 text-center space-y-4">
                {formData.logoUrl ? (
                  <div className="space-y-3">
                    <img 
                      src={formData.logoUrl} 
                      alt="Client Logo" 
                      className="h-20 max-w-[200px] object-contain mx-auto rounded-lg bg-white/5 p-2"
                    />
                    <div className="text-xs font-mono text-[#C1A461]">{formData.logoFileName}</div>
                  </div>
                ) : (
                  <div className="py-6 space-y-2">
                    <ImageIcon className="w-10 h-10 text-white/20 mx-auto" />
                    <p className="text-xs text-white/40">No client logo currently uploaded.</p>
                  </div>
                )}

                <div>
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold cursor-pointer transition">
                    <Upload className="w-4 h-4" />
                    {formData.logoUrl ? 'Replace Logo' : 'Upload Client Logo'}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleLogoUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Letterhead Upload Box */}
            <div className="p-6 rounded-2xl bg-[#151518] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#C1A461]" />
                  Official Client Letterhead / Stationery
                </h3>
                <span className="text-[10px] font-mono text-white/40 uppercase">
                  PDF / DOCX / PNG (Max 10MB)
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-black/40 border border-dashed border-white/20 text-center space-y-4">
                {formData.letterheadFileName ? (
                  <div className="space-y-2">
                    <FileText className="w-10 h-10 text-[#C1A461] mx-auto" />
                    <div className="text-xs font-mono text-white font-bold">{formData.letterheadFileName}</div>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/20 font-mono">
                      Active Letterhead Template
                    </span>
                  </div>
                ) : (
                  <div className="py-6 space-y-2">
                    <FileText className="w-10 h-10 text-white/20 mx-auto" />
                    <p className="text-xs text-white/40">Default header/footer layout used.</p>
                  </div>
                )}

                <div>
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold cursor-pointer transition">
                    <Upload className="w-4 h-4" />
                    Upload Letterhead File
                    <input 
                      type="file" 
                      accept=".pdf,.png,.jpg,.jpeg,.docx" 
                      onChange={handleLetterheadUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Footer Text & Presentation Options */}
            <div className="p-6 rounded-2xl bg-[#151518] border border-white/10 space-y-4 md:col-span-2">
              <h3 className="text-sm font-bold text-white">Document Footer Disclaimer & Letterhead Positioning</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-white/50 mb-1 font-mono uppercase text-[10px]">
                    Custom Report Footer Line
                  </label>
                  <input
                    type="text"
                    value={formData.footerText || ''}
                    onChange={e => setFormData({ ...formData, footerText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-[#C1A461]"
                  />
                </div>

                <div>
                  <label className="block text-white/50 mb-1 font-mono uppercase text-[10px]">
                    Letterhead Application Type
                  </label>
                  <select
                    value={formData.letterheadType}
                    onChange={e => setFormData({ ...formData, letterheadType: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-[#C1A461]"
                  >
                    <option value="header_footer">Dynamic Header + Dynamic Footer</option>
                    <option value="full_page_background">Full Page Stationary Background (PDF)</option>
                    <option value="none">Standard Audrin Fire Engineering Layout</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#C1A461] hover:bg-[#d5b976] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#C1A461]/20 transition"
            >
              <Save className="w-4 h-4" />
              Save Branding Assets
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Site Hierarchy */}
      {activeTab === 'site_hierarchy' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Registered Multi-Site Hierarchy</h3>
              <p className="text-xs text-white/50">Buildings and commercial occupancies under this client organization profile.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sites.map(site => (
              <div key={site.id} className="p-5 rounded-2xl bg-[#151518] border border-white/10 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C1A461]/20 text-[#C1A461] font-bold">
                      {site.siteCode || site.id.toUpperCase()}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1.5">{site.name}</h4>
                    <p className="text-xs text-white/50">{site.address}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                    site.status === 'compliant' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30' : 'bg-amber-950/80 text-amber-400 border border-amber-500/30'
                  }`}>
                    {site.status || 'compliant'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[11px] font-mono">
                  <div>
                    <span className="text-white/40 block">Occupancy:</span>
                    <span className="text-white">{site.occupancyClass || site.buildingType} ({site.systemCategory || 'Category L1'})</span>
                  </div>
                  <div>
                    <span className="text-white/40 block">GPS Coordinates:</span>
                    <span className="text-white">{site.latitude ? site.latitude.toFixed(4) : '-25.7479'}, {site.longitude ? site.longitude.toFixed(4) : '28.2293'}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block">Site Manager:</span>
                    <span className="text-white">{site.contactPerson}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block">Operating Hours:</span>
                    <span className="text-white">{site.operatingHours || '08:00 - 17:00 (Mon - Fri)'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Audrin Issuer Credentials (Admin) */}
      {activeTab === 'issuer_settings' && isAdmin && (
        <form onSubmit={handleSaveIssuer} className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#151518] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#C1A461]" />
                Audrin Fire Engineers (Pty) Ltd &middot; Statutory Issuer Credentials
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                Audrin Fire Control Desk
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-white/50 mb-1 font-mono uppercase text-[10px]">
                  Legal Entity Name
                </label>
                <input
                  type="text"
                  value={issuerData.legalName}
                  onChange={e => setIssuerData({ ...issuerData, legalName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-medium focus:border-[#C1A461]"
                />
              </div>

              <div>
                <label className="block text-white/50 mb-1 font-mono uppercase text-[10px]">
                  Trading Descriptor
                </label>
                <input
                  type="text"
                  value={issuerData.serviceDescriptor}
                  onChange={e => setIssuerData({ ...issuerData, serviceDescriptor: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#C1A461]"
                />
              </div>

              <div>
                <label className="block text-white/50 mb-1 font-mono uppercase text-[10px]">
                  Company Registration Number
                </label>
                <input
                  type="text"
                  value={issuerData.registrationNumber}
                  onChange={e => setIssuerData({ ...issuerData, registrationNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono focus:border-[#C1A461]"
                />
              </div>

              <div>
                <label className="block text-white/50 mb-1 font-mono uppercase text-[10px]">
                  Telephone Number (Direct Life Safety Hotline)
                </label>
                <input
                  type="text"
                  value={issuerData.telephone}
                  onChange={e => setIssuerData({ ...issuerData, telephone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-[#C1A461] focus:border-[#C1A461]"
                />
              </div>

              <div>
                <label className="block text-white/50 mb-1 font-mono uppercase text-[10px]">
                  Official Inquiries Email
                </label>
                <input
                  type="email"
                  value={issuerData.email}
                  onChange={e => setIssuerData({ ...issuerData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono focus:border-[#C1A461]"
                />
              </div>

              <div>
                <label className="block text-white/50 mb-1 font-mono uppercase text-[10px]">
                  Head Office Physical Address
                </label>
                <input
                  type="text"
                  value={issuerData.physicalAddress}
                  onChange={e => setIssuerData({ ...issuerData, physicalAddress: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:border-[#C1A461]"
                />
              </div>

              <div>
                <label className="block text-white/50 mb-1 font-mono uppercase text-[10px]">
                  Lead Commissioner Name
                </label>
                <input
                  type="text"
                  value={issuerData.leadCommissionerName}
                  onChange={e => setIssuerData({ ...issuerData, leadCommissionerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-medium focus:border-[#C1A461]"
                />
              </div>

              <div>
                <label className="block text-white/50 mb-1 font-mono uppercase text-[10px]">
                  Lead Commissioner SAQCC Registration No.
                </label>
                <input
                  type="text"
                  value={issuerData.leadCommissionerSaqcc}
                  onChange={e => setIssuerData({ ...issuerData, leadCommissionerSaqcc: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-emerald-400 focus:border-[#C1A461]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#C1A461] hover:bg-[#d5b976] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#C1A461]/20 transition"
              >
                <Save className="w-4 h-4" />
                Update Audrin Issuer Credentials
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 5: Live Document Layout Preview */}
      {activeTab === 'live_preview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Live Official Report / Certificate Header & Footer Simulation</h3>
              <p className="text-xs text-white/50">Visual verification of how Client Identity and Audrin Fire Engineers Issuer credentials render on generated documents.</p>
            </div>
          </div>

          {/* Paper Mockup */}
          <div className="p-8 rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-300 max-w-4xl mx-auto space-y-6 font-sans">
            
            {/* Header Area */}
            <div className="flex items-start justify-between border-b-2 border-slate-800 pb-4">
              <div className="space-y-1.5">
                <img 
                  src="/audrin-logo.svg" 
                  alt="Audrin Fire Engineers Logo" 
                  className="h-10 w-auto object-contain mb-1" 
                  referrerPolicy="no-referrer"
                />
                <div className="text-xs uppercase font-bold tracking-widest text-[#987d3a]">
                  {issuerData.legalName}
                </div>
                <div className="text-[11px] text-slate-600">
                  {issuerData.serviceDescriptor}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Reg: {issuerData.registrationNumber} &middot; Tel: {issuerData.telephone} &middot; Email: {issuerData.email}
                </div>
                <div className="text-[10px] text-slate-500">
                  {issuerData.physicalAddress}
                </div>
              </div>

              {formData.logoUrl && (
                <div className="text-right space-y-1">
                  <div className="text-[9px] uppercase font-bold text-slate-400">Client / Asset Owner</div>
                  <img 
                    src={formData.logoUrl} 
                    alt="Client" 
                    className="h-12 max-w-[140px] object-contain ml-auto"
                  />
                  <div className="text-[10px] font-bold text-slate-700">{formData.tradingName || formData.registeredName}</div>
                </div>
              )}
            </div>

            {/* Document Title & Watermark simulation */}
            <div className="py-4 text-center space-y-2">
              <div className="inline-block px-3 py-1 rounded bg-amber-100 border border-amber-400 text-amber-900 font-mono text-xs font-bold uppercase tracking-wider">
                SOURCE-LIMITED DRAFT - NOT AN ISSUABLE CERTIFICATE
              </div>
              <h2 className="text-xl font-bold uppercase text-slate-900 tracking-tight">
                Fire Detection & Alarm System Inspection Record
              </h2>
              <div className="text-xs text-slate-500 font-mono">
                Document Ref: PRE-2026-0041 &middot; SANS 10139 / SANS 10400-T Controlled Record
              </div>
            </div>

            {/* Sample Table / Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs border border-slate-200 p-4 rounded bg-slate-50">
              <div>
                <span className="font-bold block text-slate-500">Client Entity:</span>
                <span className="font-medium text-slate-900">{formData.registeredName}</span>
              </div>
              <div>
                <span className="font-bold block text-slate-500">Site Facility:</span>
                <span className="font-medium text-slate-900">Menlyn Central Commercial Park - Tower A</span>
              </div>
              <div>
                <span className="font-bold block text-slate-500">Lead Fire Technician:</span>
                <span className="font-medium text-slate-900">Sipho Ndlovu (SAQCC-8812040987)</span>
              </div>
              <div>
                <span className="font-bold block text-slate-500">Lead Commissioner Sign-off:</span>
                <span className="font-medium text-slate-900">{issuerData.leadCommissionerName} ({issuerData.leadCommissionerSaqcc})</span>
              </div>
            </div>

            {/* Footer Area */}
            <div className="pt-6 border-t border-slate-300 flex items-center justify-between text-[10px] text-slate-500">
              <div>
                {formData.footerText || `${formData.registeredName} · Confidential Technical Record`}
              </div>
              <div className="font-mono">
                Generated via Audrin Source-Controlled Platform &middot; Page 1 of 1
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
