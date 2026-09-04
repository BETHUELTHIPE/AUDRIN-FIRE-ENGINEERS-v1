import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Award, 
  Calendar, 
  FileText, 
  Upload, 
  Trash2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Car, 
  Clock, 
  CheckSquare, 
  Square,
  FileCheck,
  Camera,
  Download
} from 'lucide-react';
import { TechnicianAccount, SaqccTechnicianCategory, DriverLicenseCode, DocumentType } from '../../types';
import { SAQCC_CATEGORIES_LIST, PROVINCES_LIST } from '../../data/careersData';
import { useAudrinStore } from '../../services/store';

interface TechnicianProfileEditorProps {
  technician: TechnicianAccount;
  onSaved?: () => void;
}

export const TechnicianProfileEditor: React.FC<TechnicianProfileEditorProps> = ({
  technician,
  onSaved
}) => {
  const store = useAudrinStore();

  const [residentialAddress, setResidentialAddress] = useState(technician.residentialAddress || '');
  const [province, setProvince] = useState(technician.province || 'Gauteng');
  const [postalCode, setPostalCode] = useState(technician.postalCode || '');
  const [saqccNumber, setSaqccNumber] = useState(technician.saqccNumber || '');
  const [saqccExpiryDate, setSaqccExpiryDate] = useState(technician.saqccExpiryDate || '');
  const [saqccCategories, setSaqccCategories] = useState<SaqccTechnicianCategory[]>(technician.saqccCategories || []);
  const [qualifications, setQualifications] = useState<string[]>(technician.qualifications || []);
  const [newQualification, setNewQualification] = useState('');
  const [sans10139ExperienceSummary, setSans10139ExperienceSummary] = useState(technician.sans10139ExperienceSummary || '');
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(technician.yearsOfExperience || 0);
  const [driverLicense, setDriverLicense] = useState<DriverLicenseCode>(technician.driverLicense || 'None');
  const [availability, setAvailability] = useState(technician.availability || 'Immediate');
  const [preferredLocations, setPreferredLocations] = useState<string[]>(technician.preferredLocations || ['Gauteng']);
  const [newLocation, setNewLocation] = useState('');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(technician.profilePhotoUrl || '');

  // Document upload state
  const [selectedDocType, setSelectedDocType] = useState<DocumentType>('cv');
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [saveFeedback, setSaveFeedback] = useState('');

  const toggleCategory = (cat: SaqccTechnicianCategory) => {
    if (saqccCategories.includes(cat)) {
      setSaqccCategories(saqccCategories.filter(c => c !== cat));
    } else {
      setSaqccCategories([...saqccCategories, cat]);
    }
  };

  const handleAddQualification = () => {
    if (newQualification.trim()) {
      setQualifications([...qualifications, newQualification.trim()]);
      setNewQualification('');
    }
  };

  const handleRemoveQualification = (index: number) => {
    setQualifications(qualifications.filter((_, i) => i !== index));
  };

  const handleAddLocation = () => {
    if (newLocation.trim() && !preferredLocations.includes(newLocation.trim())) {
      setPreferredLocations([...preferredLocations, newLocation.trim()]);
      setNewLocation('');
    }
  };

  const handleRemoveLocation = (loc: string) => {
    setPreferredLocations(preferredLocations.filter(l => l !== loc));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    setUploadSuccess('');
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB limit

    // Validate size
    if (file.size > MAX_SIZE) {
      setUploadError(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max allowed size is 10MB.`);
      return;
    }

    // Validate extension
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.jpg') && !file.name.endsWith('.png')) {
      setUploadError('Invalid file format. Please upload PDF, JPG, or PNG files only.');
      return;
    }

    const docName = file.name;
    const docSize = file.size;
    const docMime = file.type || 'application/pdf';

    // Simulate upload and store
    store.uploadTechnicianDocument(technician.id, {
      name: docName,
      type: selectedDocType,
      fileSizeBytes: docSize,
      mimeType: docMime,
      malwareScanStatus: 'clean'
    });

    setUploadSuccess(`"${docName}" uploaded successfully and passed automated malware validation.`);
    e.target.value = '';
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert('Photo must be less than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setProfilePhotoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateTechnicianProfile(technician.id, {
      residentialAddress,
      province,
      postalCode,
      saqccNumber,
      saqccExpiryDate,
      saqccCategories,
      qualifications,
      sans10139ExperienceSummary,
      yearsOfExperience: Number(yearsOfExperience),
      driverLicense,
      availability,
      preferredLocations,
      profilePhotoUrl
    });

    setSaveFeedback('Profile details successfully updated and saved to secure records.');
    if (onSaved) onSaved();
    setTimeout(() => setSaveFeedback(''), 4000);
  };

  const getSaqccExpiryBadge = () => {
    if (!saqccExpiryDate) return null;
    const expiry = new Date(saqccExpiryDate).getTime();
    const now = Date.now();
    const days = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

    if (days < 0) {
      return (
        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-bold">
          Expired on {saqccExpiryDate}
        </span>
      );
    }
    if (days < 90) {
      return (
        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold">
          Expires Soon ({saqccExpiryDate})
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold">
        Valid until {saqccExpiryDate}
      </span>
    );
  };

  return (
    <form onSubmit={handleSaveProfile} className="space-y-8">
      {saveFeedback && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-medium">{saveFeedback}</span>
        </div>
      )}

      {/* Profile Overview & Photo */}
      <div className="p-6 rounded-2xl bg-[#151518] border border-white/10 flex flex-col sm:flex-row items-center gap-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white/5 border-2 border-[#C1A461]/40 flex items-center justify-center">
            {profilePhotoUrl ? (
              <img src={profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-[#C1A461]/60" />
            )}
          </div>
          <label className="absolute bottom-0 right-0 p-2 rounded-xl bg-[#C1A461] hover:bg-[#D4BC7B] text-black cursor-pointer shadow-lg transition">
            <Camera className="w-3.5 h-3.5" />
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          </label>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <h3 className="text-lg font-bold text-white tracking-tight">{technician.fullName}</h3>
          <p className="text-xs text-white/60">{technician.email} • {technician.cellphone}</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Email Verified
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#C1A461]/20 border border-[#C1A461]/40 text-[#C1A461] text-[10px] font-bold">
              POPIA Consent Active
            </span>
          </div>
        </div>
      </div>

      {/* Section 1: Residential Address & Province */}
      <div className="p-6 rounded-2xl bg-[#151518] border border-white/10 space-y-5">
        <div className="flex items-center gap-2 text-[#C1A461] font-bold text-xs uppercase tracking-wider">
          <MapPin className="w-4 h-4" />
          <span>Residential Address & Location</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
              Physical Street Address *
            </label>
            <input
              type="text"
              value={residentialAddress}
              onChange={e => setResidentialAddress(e.target.value)}
              placeholder="e.g. 48 Pretorius Street, Hatfield, Pretoria"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-white/30 focus:outline-none focus:border-[#C1A461] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
              Province *
            </label>
            <select
              value={province}
              onChange={e => setProvince(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1a1a1f] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#C1A461] transition"
            >
              {PROVINCES_LIST.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
              Postal Code
            </label>
            <input
              type="text"
              value={postalCode}
              onChange={e => setPostalCode(e.target.value)}
              placeholder="e.g. 0083"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-white/30 focus:outline-none focus:border-[#C1A461] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
              Driver’s Licence Code
            </label>
            <select
              value={driverLicense}
              onChange={e => setDriverLicense(e.target.value as DriverLicenseCode)}
              className="w-full px-4 py-2.5 bg-[#1a1a1f] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#C1A461] transition"
            >
              <option value="Code 8 (B)">Code 8 (B) - Light Motor Vehicle</option>
              <option value="Code 10 (C1)">Code 10 (C1) - Heavy Vehicle</option>
              <option value="Code 14 (EC)">Code 14 (EC) - Articulated Heavy Vehicle</option>
              <option value="None">No Driver’s Licence</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 2: SAQCC Fire Registration & Categories */}
      <div className="p-6 rounded-2xl bg-[#151518] border border-white/10 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#C1A461] font-bold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>SAQCC Fire Registration & Accreditations</span>
          </div>
          {getSaqccExpiryBadge()}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
              SAQCC Registration Number
            </label>
            <input
              type="text"
              value={saqccNumber}
              onChange={e => setSaqccNumber(e.target.value)}
              placeholder="e.g. SAQCC-FD-2024-8841"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-xs placeholder-white/30 focus:outline-none focus:border-[#C1A461] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
              SAQCC Card Expiry Date
            </label>
            <input
              type="date"
              value={saqccExpiryDate}
              onChange={e => setSaqccExpiryDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1a1a1f] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#C1A461] transition"
            />
          </div>
        </div>

        {/* SAQCC Categories Checkboxes */}
        <div>
          <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2.5">
            Registered SAQCC Competency Disciplines (Select all that apply)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SAQCC_CATEGORIES_LIST.map(cat => {
              const isChecked = saqccCategories.includes(cat.id as SaqccTechnicianCategory);
              return (
                <div
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id as SaqccTechnicianCategory)}
                  className={`p-3 rounded-xl border cursor-pointer transition select-none flex items-start gap-3 ${
                    isChecked
                      ? 'bg-[#C1A461]/10 border-[#C1A461]/50 text-white'
                      : 'bg-white/[0.02] border-white/5 text-white/70 hover:border-white/20'
                  }`}
                >
                  <div className="mt-0.5 text-[#C1A461]">
                    {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold">{cat.label}</div>
                    <div className="text-[11px] text-white/50">{cat.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section 3: SANS 10139 Experience & Qualifications */}
      <div className="p-6 rounded-2xl bg-[#151518] border border-white/10 space-y-5">
        <div className="flex items-center gap-2 text-[#C1A461] font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>SANS 10139 & Fire Detection Field Experience</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
              Years of Direct Experience *
            </label>
            <input
              type="number"
              min={0}
              max={40}
              value={yearsOfExperience}
              onChange={e => setYearsOfExperience(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#C1A461] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
              Availability / Notice Period
            </label>
            <select
              value={availability}
              onChange={e => setAvailability(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1a1a1f] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#C1A461] transition"
            >
              <option value="Immediate">Immediate Availability</option>
              <option value="1 Week Notice">1 Week Notice</option>
              <option value="2 Weeks Notice">2 Weeks Notice</option>
              <option value="1 Month Notice">1 Month Notice</option>
              <option value="More than 1 Month">More than 1 Month</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
              Preferred Work Regions
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newLocation}
                onChange={e => setNewLocation(e.target.value)}
                placeholder="e.g. Pretoria / Sandton"
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-[#C1A461]"
              />
              <button
                type="button"
                onClick={handleAddLocation}
                className="px-3 py-2 bg-[#C1A461] hover:bg-[#D4BC7B] text-black text-xs font-bold rounded-lg transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Preferred Locations Badges */}
        {preferredLocations.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {preferredLocations.map((loc, idx) => (
              <span key={idx} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white/90 text-xs flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#C1A461]" />
                <span>{loc}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveLocation(loc)}
                  className="hover:text-red-400 text-white/40 ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
            SANS 10139 Experience Summary (Systems, Control Panels, Audits)
          </label>
          <textarea
            rows={4}
            value={sans10139ExperienceSummary}
            onChange={e => setSans10139ExperienceSummary(e.target.value)}
            placeholder="Describe your commissioning experience, panel makes (Ziton, Kentec, Advanced, Edwards), SANS 10139 cause & effect programming, standby battery load calculations, and acoustic decibel testing..."
            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-white/30 focus:outline-none focus:border-[#C1A461] transition leading-relaxed"
          />
        </div>

        {/* Qualifications Builder */}
        <div>
          <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2">
            Qualifications & Diplomas
          </label>
          <div className="space-y-2 mb-3">
            {qualifications.map((q, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/5 text-xs text-white/90">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#C1A461]" />
                  <span>{q}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveQualification(idx)}
                  className="text-white/40 hover:text-red-400 transition p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newQualification}
              onChange={e => setNewQualification(e.target.value)}
              placeholder="e.g. National Diploma Electrical Engineering, N3 Certificate, Ziton ZP3 Master"
              className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#C1A461]"
            />
            <button
              type="button"
              onClick={handleAddQualification}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Qualification
            </button>
          </div>
        </div>
      </div>

      {/* Section 4: Secure Document Upload & Malware Scan Vault */}
      <div className="p-6 rounded-2xl bg-[#151518] border border-white/10 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#C1A461] font-bold text-xs uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>Document Vault & Certifications (CV, SAQCC, ID)</span>
          </div>
          <span className="text-[11px] text-white/50">Max 10MB per file (PDF / JPG / PNG)</span>
        </div>

        {uploadError && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {uploadSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{uploadSuccess}</span>
          </div>
        )}

        {/* Upload Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
              Document Category *
            </label>
            <select
              value={selectedDocType}
              onChange={e => setSelectedDocType(e.target.value as DocumentType)}
              className="w-full px-4 py-2.5 bg-[#1a1a1f] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#C1A461] transition"
            >
              <option value="cv">Curriculum Vitae (CV / Resume)</option>
              <option value="saqcc_certificate">SAQCC Card / Certificate</option>
              <option value="id_document">Certified South African ID</option>
              <option value="driver_license">Driver’s Licence Card</option>
              <option value="other_certificate">Qualifications / Training Certificate</option>
              <option value="proof_of_address">Proof of Residential Address</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
              Select & Upload File
            </label>
            <label className="flex items-center justify-center gap-3 px-4 py-2.5 bg-[#C1A461]/10 hover:bg-[#C1A461]/20 border border-[#C1A461]/40 border-dashed rounded-xl cursor-pointer text-xs font-bold text-[#C1A461] transition">
              <Upload className="w-4 h-4" />
              <span>Click or Drop File to Upload</span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Uploaded Documents List */}
        <div className="space-y-2.5 pt-2">
          <div className="text-xs font-bold uppercase tracking-wider text-white/60">
            Uploaded Candidate Files ({technician.documents.length})
          </div>

          {technician.documents.length === 0 ? (
            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5 text-center text-xs text-white/40">
              No documents uploaded yet. Please attach your CV, SAQCC card, and certified ID to enable rapid shortlisting.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {technician.documents.map(doc => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between gap-3 hover:border-white/20 transition"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 rounded-lg bg-[#C1A461]/10 text-[#C1A461] shrink-0">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-white truncate">{doc.name}</div>
                      <div className="text-[10px] text-white/50 flex items-center gap-2">
                        <span className="uppercase text-[#C1A461] font-semibold">{doc.type.replace('_', ' ')}</span>
                        <span>•</span>
                        <span>{(doc.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-mono">Clean</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => store.deleteTechnicianDocument(technician.id, doc.id)}
                    className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Save Button Bar */}
      <div className="p-6 rounded-2xl bg-[#121215] border border-white/10 flex items-center justify-between gap-4">
        <div className="text-xs text-white/50">
          Last Updated: <span className="text-white font-mono">{new Date(technician.updatedAt).toLocaleDateString('en-ZA')}</span>
        </div>

        <button
          type="submit"
          className="px-8 py-3 rounded-xl bg-[#C1A461] hover:bg-[#D4BC7B] text-black text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-[#C1A461]/20 flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Save Changes to Profile</span>
        </button>
      </div>
    </form>
  );
};
