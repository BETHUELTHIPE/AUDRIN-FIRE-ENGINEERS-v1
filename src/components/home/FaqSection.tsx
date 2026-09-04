import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert, 
  FileText,
  PhoneCall
} from 'lucide-react';
import { FAQS, COMPANY_DETAILS } from '../../data/initialData';

interface FaqSectionProps {
  onRequestService?: () => void;
  onReportFault?: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  onRequestService = () => {},
  onReportFault = () => {}
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 lg:py-28 bg-[#0D0D0E] text-white border-b border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151518] border border-white/10 text-[10px] font-bold uppercase tracking-wider text-[#C1A461]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Technical Knowledge & Standards</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            Frequently Asked Fire Detection Questions
          </h2>
          <p className="text-sm text-white/50 leading-relaxed font-normal">
            Essential technical insights into SANS 10139 compliance, quarterly maintenance cycles, fault resolution, and system category design.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={`faq-${idx}`}
                className={`rounded-3xl border transition duration-300 overflow-hidden ${
                  isOpen ? 'bg-[#151518] border-[#C1A461]/40 shadow-xl' : 'bg-[#151518]/60 border-white/5'
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 flex items-center justify-between text-left gap-4 cursor-pointer"
                >
                  <span className="text-sm font-bold text-white leading-snug">
                    {faq.question}
                  </span>
                  <div className={`p-1.5 rounded-full bg-[#0A0A0B] border border-white/5 shrink-0 transition ${isOpen ? 'rotate-180 text-[#C1A461]' : 'text-white/40'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 border-t border-white/5 text-xs text-white/60 leading-relaxed space-y-3 font-normal">
                    <p>{faq.answer}</p>
                    <div className="pt-2 flex items-center gap-2 text-[10px] font-mono text-white/40 uppercase tracking-wider">
                      <span>Compliance Guidance</span>
                      <span>•</span>
                      <span>SANS 10139 Recommended Practices</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-14 p-7 rounded-3xl bg-[#151518] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <h4 className="font-bold text-sm text-white tracking-tight">
              Have a bespoke commercial inquiry or urgent panel fault?
            </h4>
            <p className="text-xs text-white/50 mt-0.5">
              Speak directly with our technical engineering desk in Pretoria West.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onReportFault}
              className="px-4 py-2.5 bg-[#0A0A0B] hover:bg-[#1E1E22] border border-red-500/30 text-red-300 text-xs font-bold uppercase tracking-wider rounded-xl transition"
            >
              Report Fault
            </button>
            <button
              onClick={onRequestService}
              className="px-5 py-2.5 bg-[#C1A461] hover:bg-[#D4BC7B] text-black text-xs font-bold uppercase tracking-[1.5px] rounded-xl transition shadow-lg shadow-black/40"
            >
              Request Service
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

