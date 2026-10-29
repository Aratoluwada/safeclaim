import React from 'react';
import { VerdictStamp } from '../common/VerdictStamp';
import { Share2, Check, ArrowRight } from 'lucide-react';

interface PhoneFrameProps {
  className?: string;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ className = '' }) => {
  return (
    <div
      className={`w-full max-w-sm mx-auto rounded-[28px] p-3 bg-[#1F1B16] dark:bg-[#0D0B09] shadow-2xl border-4 border-[#3D352C] ${className}`}
    >
      {/* Phone speaker & camera notch */}
      <div className="flex items-center justify-center pb-2">
        <div className="w-16 h-1.5 rounded-full bg-[#3D352C]" />
      </div>

      {/* Screen container */}
      <div className="rounded-[20px] overflow-hidden bg-[#ECE5DD] dark:bg-[#1A1815] text-[#1F1B16] dark:text-[#F4EEE4] flex flex-col font-sans text-xs">
        {/* WhatsApp-style chat header */}
        <div className="bg-[#0A5C36] text-[#FAF4E8] px-3.5 py-2.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FAF4E8] text-accent flex items-center justify-center font-bold text-xs">
              SC
            </div>
            <div>
              <div className="font-semibold text-xs flex items-center gap-1.5">
                <span>SafeClaim Fact Check</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div className="text-[10px] text-emerald-100">Official Government Receipts</div>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-200">6232 / BOT</span>
        </div>

        {/* Chat message body with paper pattern */}
        <div className="p-3 space-y-3 min-h-[310px] flex flex-col justify-end bg-repeat" style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.03) 1px, transparent 0)', backgroundSize: '16px 16px' }}>
          {/* User message: Forwarded rumour */}
          <div className="self-start max-w-[88%] bg-white dark:bg-[#25211B] p-2.5 rounded-lg rounded-tl-none shadow-xs border border-[#E8DFD5] dark:border-[#3D352C]">
            <div className="flex items-center gap-1 text-[10px] text-[#63584C] italic mb-1">
              <Share2 className="w-3 h-3 text-[#7A6F62]" />
              <span>Forwarded many times</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#1F1B16] dark:text-[#F4EEE4]">
              "Breaking: NCDC says drinking concentrated salt water prevents cholera instantly. Forward to family groups now!!"
            </p>
            <div className="flex justify-end text-[9px] text-[#7A6F62] mt-1">11:42 AM</div>
          </div>

          {/* SafeClaim Grounded Response */}
          <div className="self-end max-w-[92%] bg-accent-tint dark:bg-accent-tint p-3 rounded-lg rounded-tr-none shadow-sm border border-accent-border space-y-2">
            <div className="flex items-center justify-between gap-2">
              <VerdictStamp
                verdict="CONTRADICTED_BY_OFFICIAL_SOURCE"
                size="sm"
                rotate={false}
                customLabel="Contradicted"
              />
              <span className="text-[9px] font-mono text-[#7A6F62]">Ref: NCDC-CHOLERA-24</span>
            </div>

            <p className="text-[11px] leading-snug font-medium text-[#1F1B16] dark:text-[#E2E8F0]">
              Salt water ingestion does <span className="font-bold underline text-red-700 dark:text-red-400">not</span> treat or prevent cholera. In fact, drinking salt solution can trigger severe dehydration and kidney shock{' '}
              <span className="inline-block px-1 py-0.2 rounded bg-emerald-100 text-accent font-mono font-bold text-[9px]">
                [ncdc#1]
              </span>
              .
            </p>

            {/* Pulled official source receipt */}
            <div className="bg-white dark:bg-[#1F1B16] p-2 rounded border border-[#E8DFD5] dark:border-[#3D352C] text-[10px]">
              <div className="flex items-center justify-between font-mono font-bold text-accent text-[9px] mb-0.5">
                <span>NCDC OFFICIAL ADVISORY</span>
                <span>ncdc.gov.ng</span>
              </div>
              <p className="italic text-[#63584C] dark:text-[#CFC6B8] text-[10px] line-clamp-2">
                "Only clean oral rehydration salts (ORS) and clean water are recommended for dehydration..."
              </p>
            </div>

            <div className="flex items-center justify-between text-[9px] text-[#63584C] pt-0.5">
              <span>Verified in 0.8s</span>
              <span className="flex items-center text-accent font-semibold">
                NCDC Hotline: 6232 <Check className="w-3 h-3 ml-0.5" />
              </span>
            </div>
          </div>
        </div>

        {/* Mock chat footer */}
        <div className="p-2 bg-white dark:bg-[#201C17] border-t border-[#E8DFD5] dark:border-[#3D352C] flex items-center justify-between text-[#7A6F62] text-[10px] px-3">
          <span>Type or forward rumour...</span>
          <div className="w-5 h-5 rounded-full bg-[#0A5C36] text-white flex items-center justify-center">
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
};
