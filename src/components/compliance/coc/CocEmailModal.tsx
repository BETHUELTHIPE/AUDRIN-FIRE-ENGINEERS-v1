import React, { useState } from 'react';
import { SansCocCertificate } from '../../../types';
import { useAudrinStore } from '../../../services/store';
import { certificateEmailService } from '../../../services/CertificateEmailService';
import { Mail, X, CheckCircle2, ShieldCheck, Clock, Send, RotateCw, AlertTriangle, FileText, Check } from 'lucide-react';

interface CocEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  coc: SansCocCertificate;
  onSuccess?: () => void;
}

export const CocEmailModal: React.FC<CocEmailModalProps> = ({
  isOpen,
  onClose,
  coc,
  onSuccess
}) => {
  const store = useAudrinStore();

  const defaultClientEmail = coc.clientSafetyOfficer?.email || 'bethuelmoukangwe8@gmail.com';
  const defaultSafetyOfficerEmail = coc.clientSafetyOfficer?.email || 'safety@tshivhase.co.za';
  const defaultAdminCc = 'admin@audrinfire.co.za';

  const [clientEmail, setClientEmail] = useState(defaultClientEmail);
  const [safetyOfficerEmail, setSafetyOfficerEmail] = useState(defaultSafetyOfficerEmail);
  const [includeAdminCc, setIncludeAdminCc] = useState(true);
  const [attachSupportingReports, setAttachSupportingReports] = useState(true);
  const [subject, setSubject] = useState(`SANS 10139 Certificate of Compliance – ${coc.siteName} – ${coc.cocNumber}`);
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [dispatchedDetails, setDispatchedDetails] = useState<{
    recipients: string[];
    cc: string[];
    timestamp: string;
    checksum: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!clientEmail.trim()) {
      setErrorMessage('Client email address is required.');
      return;
    }

    setSending(true);
    setErrorMessage('');

    try {
      const ccList = includeAdminCc ? [defaultAdminCc, 'compliance@audrinfire.co.za'] : [];

      const result = await certificateEmailService.sendCertificateOfCompliance({
        coc,
        clientEmail: clientEmail.trim(),
        safetyOfficerEmail: safetyOfficerEmail.trim() || undefined,
        ccEmails: ccList,
        subject,
        attachSupportingReports,
        trigger: 'manual_dispatch'
      });

      const recipientList = [result.recipients.client];
      if (result.recipients.safetyOfficer) {
        recipientList.push(result.recipients.safetyOfficer);
      }

      setDispatchedDetails({
        recipients: recipientList,
        cc: result.recipients.cc,
        timestamp: `${result.formattedDeliveryDate} SAST (${result.deliveryTimestamp})`,
        checksum: result.documentChecksumSha256
      });
      setSending(false);
      setSentSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setSending(false);
      setErrorMessage(err.message || 'Failed to dispatch email.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#151518] border border-white/10 rounded-2xl w-full max-w-xl text-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-[#0E0E10] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C1A461]/20 text-[#C1A461] border border-[#C1A461]/40 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Email Certificate of Compliance</h3>
              <p className="text-xs text-white/50 font-mono">{coc.cocNumber} &middot; {coc.siteName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {sentSuccess && dispatchedDetails ? (
            <div className="py-2 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h4 className="text-base font-bold text-white">Certificate Successfully Dispatched</h4>
                <p className="text-xs text-white/70 mt-1">
                  The locked SANS 10139 COC PDF and audit trail have been securely transmitted.
                </p>
              </div>

              {/* Recipient Confirmation Box */}
              <div className="p-4 bg-black/50 border border-white/10 rounded-xl space-y-2.5 text-xs font-mono">
                <div className="text-[11px] font-bold text-[#C1A461] uppercase tracking-wide border-b border-white/10 pb-1">
                  Confirmed Recipients & Delivery Audit Log
                </div>
                <div>
                  <span className="text-white/50">Primary Recipient:</span>
                  <span className="text-emerald-400 ml-2 font-bold">{dispatchedDetails.recipients[0]}</span>
                </div>
                {dispatchedDetails.recipients[1] && (
                  <div>
                    <span className="text-white/50">Designated Safety Officer:</span>
                    <span className="text-emerald-400 ml-2 font-bold">{dispatchedDetails.recipients[1]}</span>
                  </div>
                )}
                {dispatchedDetails.cc.length > 0 && (
                  <div>
                    <span className="text-white/50">Copied Administrator (CC):</span>
                    <span className="text-white/80 ml-2">{dispatchedDetails.cc.join(', ')}</span>
                  </div>
                )}
                <div>
                  <span className="text-white/50">Timestamp:</span>
                  <span className="text-white/80 ml-2">{dispatchedDetails.timestamp}</span>
                </div>
                <div>
                  <span className="text-white/50">Delivery Status:</span>
                  <span className="text-emerald-400 ml-2 font-bold">Delivered (TLS 1.3 Encrypted &amp; Logged)</span>
                </div>
                <div className="break-all pt-1 border-t border-white/5">
                  <span className="text-white/50">Document Checksum:</span><br />
                  <code className="text-[#C1A461] text-[10px]">{dispatchedDetails.checksum}</code>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#C1A461] text-black rounded-xl text-xs font-bold transition hover:bg-[#d4bc7b]"
                >
                  Close &amp; Return to Register
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="p-3 rounded-xl bg-[#C1A461]/10 border border-[#C1A461]/20 text-xs text-[#C1A461]">
                <strong>Compliance Workflow Notice:</strong> The locked PDF document with SHA-256 anti-tamper checksum will be securely emailed to the client, the client designated safety officer, and CC'd to Audrin Fire Engineers records.
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono text-white/70 mb-1">
                  Primary Client Recipient *
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={e => setClientEmail(e.target.value)}
                  placeholder="client@company.co.za"
                  className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#C1A461]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-white/70 mb-1">
                  Designated Safety Officer Email
                </label>
                <input
                  type="email"
                  value={safetyOfficerEmail}
                  onChange={e => setSafetyOfficerEmail(e.target.value)}
                  placeholder="safety@company.co.za"
                  className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#C1A461]"
                />
              </div>

              <div className="p-3 bg-black/40 border border-white/5 rounded-xl space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-white/80">
                  <input
                    type="checkbox"
                    checked={includeAdminCc}
                    onChange={e => setIncludeAdminCc(e.target.checked)}
                    className="rounded border-white/20 text-[#C1A461] focus:ring-[#C1A461] bg-black/40"
                  />
                  <span>CC Authorised Audrin Fire Engineers Administrator (<code className="text-[#C1A461]">admin@audrinfire.co.za</code>)</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-white/80">
                  <input
                    type="checkbox"
                    checked={attachSupportingReports}
                    onChange={e => setAttachSupportingReports(e.target.checked)}
                    className="rounded border-white/20 text-[#C1A461] focus:ring-[#C1A461] bg-black/40"
                  />
                  <span>Include Supporting Inspection Reports (Pre-Work &amp; Post-Work Commissioning PDFs)</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-mono text-white/70 mb-1">
                  Email Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#C1A461]"
                />
              </div>

              {/* Delivery History */}
              {coc.emailDispatches && coc.emailDispatches.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-white/10">
                  <div className="text-[11px] font-mono text-white/60 flex items-center justify-between">
                    <span>Dispatch Audit History:</span>
                    <span className="text-[10px] text-white/40">Tamper-evident logs</span>
                  </div>
                  <div className="max-h-28 overflow-y-auto space-y-1.5">
                    {coc.emailDispatches.map((d, idx) => (
                      <div key={idx} className="p-2 bg-black/40 border border-white/5 rounded-lg text-[10px] font-mono flex items-center justify-between text-white/60">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            <span className="text-emerald-400 font-bold">Delivered:</span>
                            <span className="text-white">{d.recipients.join(', ')}</span>
                          </div>
                          <div className="text-[9px] text-white/40">
                            Checksum: <code className="text-[#C1A461]">{d.checksum ? d.checksum.substring(0, 16) + '...' : coc.documentChecksumSha256?.substring(0, 16) + '...'}</code> &middot; {new Date(d.sentAt).toLocaleString('en-ZA')}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setClientEmail(d.recipients[0] || clientEmail);
                            if (d.recipients[1]) setSafetyOfficerEmail(d.recipients[1]);
                            setSubject(d.subject || subject);
                          }}
                          className="px-2 py-1 bg-white/10 hover:bg-white/15 text-[#C1A461] rounded text-[9px] font-mono transition"
                          title="Resend to this recipient list"
                        >
                          Resend
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!sentSuccess && (
          <div className="p-4 border-t border-white/10 bg-[#0E0E10] flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-mono text-white/60 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={sending}
              className="px-5 py-2.5 rounded-xl bg-[#C1A461] hover:bg-[#d4bc7b] text-black font-bold text-xs flex items-center gap-2 transition disabled:opacity-50"
            >
              {sending ? <RotateCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>{sending ? 'Dispatching...' : 'Dispatch Locked COC'}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
