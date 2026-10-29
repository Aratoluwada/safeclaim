import React, { useState } from 'react';
import { AskResponse, LanguageCode, VerdictLabel } from '../../types/api';
import { TRANSLATIONS } from '../../utils/translations';
import { Share2, Check, Copy, ExternalLink, X } from 'lucide-react';
import { VerdictStamp } from '../common/VerdictStamp';

interface ShareVerdictModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  response: AskResponse;
  language: LanguageCode;
}

export const ShareVerdictModal: React.FC<ShareVerdictModalProps> = ({
  isOpen,
  onClose,
  query,
  response,
  language,
}) => {
  const [copied, setCopied] = useState(false);
  const t = TRANSLATIONS[language];

  if (!isOpen) return null;

  const isGrounded = response.grounded;
  const lowerAnswer = (response.answer || '').toLowerCase();
  const verdictLabel: VerdictLabel = !isGrounded
    ? 'NO_OFFICIAL_SOURCE_FOUND'
    : lowerAnswer.includes('not prevent') ||
      lowerAnswer.includes('does not') ||
      lowerAnswer.includes('refut') ||
      lowerAnswer.includes('debunk') ||
      lowerAnswer.includes('zero confirmed') ||
      lowerAnswer.includes('no ebola')
    ? 'CONTRADICTED_BY_OFFICIAL_SOURCE'
    : 'SUPPORTED_BY_OFFICIAL_SOURCE';

  const verdictText = verdictLabel.replace(/_/g, ' ');

  const shareText = `*SafeClaim AI Verification Receipt* 🏛️
Claim: "${query}"
Verdict: ${verdictText}

Summary:
${isGrounded ? response.answer : t.abstentionLead}

${
  isGrounded && response.citations.length > 0
    ? `Official Receipts:\n${response.citations
        .map((c) => `• ${c.publisher}: ${c.doc_title} (${c.url})`)
        .join('\n')}`
    : 'No official government publication confirms this claim.'
}

${
  response.hotline_info
    ? `Emergency Line: ${response.hotline_info.name} (${response.hotline_info.number})`
    : 'NCDC Toll-Free Emergency: 6232'
}

Verified via SafeClaim AI — The trusted neighbour with the receipts.`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs"
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-[#FBF7F0] dark:bg-[#1C1814] border-2 border-[#D4C5B3] dark:border-[#3D352C] shadow-2xl p-5 sm:p-6 text-[#1F1B16] dark:text-[#F4EEE4] space-y-4"
      >
        <div className="flex items-center justify-between border-b border-[#E8DFD5] dark:border-[#2D261F] pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-accent" />
            <h3 id="share-modal-title" className="font-display font-bold text-lg">
              {t.shareVerdict}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="cursor-pointer p-1.5 rounded-lg text-[#63584C] hover:text-[#2D261F] dark:hover:text-[#E8DFD5] hover:bg-[#E8DFD5]/50 dark:hover:bg-[#2D261F]/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-[#63584C] dark:text-[#A89E90]">
            Formatted for WhatsApp &amp; SMS groups
          </span>
          <VerdictStamp
            verdict={verdictLabel}
            size="sm"
            rotate={false}
          />
        </div>

        {/* WhatsApp Preview Card */}
        <div className="bg-[#FCFBF7] dark:bg-[#231F1A] p-3.5 rounded-xl border border-[#E8DFD5] dark:border-[#3D352C] font-mono text-xs text-[#1F1B16] dark:text-[#F4EEE4] whitespace-pre-wrap max-h-56 overflow-y-auto leading-relaxed">
          {shareText}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
          <button
            onClick={handleCopy}
            className="cursor-pointer w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[#D4C5B3] dark:border-[#3D352C] bg-white dark:bg-[#2A241E] hover:bg-[#F5EFEB] dark:hover:bg-[#342D26] font-semibold text-sm transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                  {t.copiedToClipboard}
                </span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#63584C]" />
                <span>Copy Formatted Text</span>
              </>
            )}
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A5C36] hover:bg-[#074528] text-white font-semibold text-sm shadow-xs transition-colors"
          >
            <span>{t.shareOnWhatsApp}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
