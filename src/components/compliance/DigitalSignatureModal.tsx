import React from 'react';
import { DigitalSignatureData } from '../../types';
import { DigitalSignatureCanvas } from './DigitalSignatureCanvas';
import { 
  ShieldCheck, 
  X
} from 'lucide-react';

interface DigitalSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignComplete: (signature: DigitalSignatureData) => void;
  documentTitle: string;
  documentNumber: string;
  defaultSignerName: string;
  defaultSignerRole: string;
  defaultSignerEmail: string;
  consentStatement: string;
}

export const DigitalSignatureModal: React.FC<DigitalSignatureModalProps> = ({
  isOpen,
  onClose,
  onSignComplete,
  documentTitle,
  documentNumber,
  defaultSignerName,
  defaultSignerRole,
  defaultSignerEmail,
  consentStatement
}) => {
  if (!isOpen) return null;

  const isTechnician = defaultSignerRole.toLowerCase().includes('technician') ||
                       defaultSignerRole.toLowerCase().includes('installer') ||
                       defaultSignerRole.toLowerCase().includes('engineer');

  const isCommissioner = defaultSignerRole.toLowerCase().includes('commissioner');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="w-full max-w-3xl bg-[#151518] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto">
        
        {/* Modal Top Navigation */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#1A1A20] to-[#121215] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#C1A461]" />
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#C1A461] tracking-widest block">
                SANS 10139 &middot; Cryptographic Digital Sign-Off
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white">
                {documentTitle} ({documentNumber})
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Embedded Digital Signature Canvas */}
        <div className="p-4 sm:p-6 max-h-[85vh] overflow-y-auto">
          <DigitalSignatureCanvas
            documentTitle={documentTitle}
            documentNumber={documentNumber}
            defaultSignerName={defaultSignerName}
            defaultSignerRole={defaultSignerRole}
            defaultSignerEmail={defaultSignerEmail}
            consentStatement={consentStatement}
            isTechnician={isTechnician}
            isCommissioner={isCommissioner}
            allowWitness={true}
            onSignatureCapture={(signature) => {
              onSignComplete(signature);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
};
