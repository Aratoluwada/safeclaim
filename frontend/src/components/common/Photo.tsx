import React, { useState } from 'react';
import { safeClaimImages, SafeClaimImage } from '../../data/imageManifest';
import { LanguageCode } from '../../types/api';
import { ImageIcon } from 'lucide-react';

interface PhotoProps {
  id: string;
  language?: LanguageCode;
  className?: string;
  duotone?: boolean;
  priority?: boolean;
}

export const Photo: React.FC<PhotoProps> = ({
  id,
  language = 'en',
  className = '',
  duotone = true,
  priority = false,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgMeta: SafeClaimImage | undefined = safeClaimImages[id];

  if (!imgMeta) {
    return (
      <div
        className={`flex items-center justify-center bg-[#F5EFEB] dark:bg-[#211D18] text-[#8E8273] rounded-xl border border-[#E8DFD5] dark:border-[#3D352C] p-6 ${className}`}
      >
        <ImageIcon className="w-8 h-8 opacity-40" />
      </div>
    );
  }

  const altText = imgMeta.alt[language] || imgMeta.alt.en;

  const duotoneFilter = duotone
    ? 'sepia(15%) contrast(102%) brightness(98%)'
    : 'none';

  return (
    <figure className={`overflow-hidden rounded-2xl bg-[#F5EFEB] dark:bg-[#211D18] ${className}`}>
      <div
        className="relative w-full overflow-hidden transition-all duration-300"
        style={{ aspectRatio: imgMeta.aspectRatio }}
      >
        {!hasError ? (
          <picture>
            {imgMeta.webpSrc && <source srcSet={imgMeta.webpSrc} type="image/webp" />}
            <img
              src={imgMeta.src}
              alt={altText}
              loading={priority ? 'eager' : 'lazy'}
              onLoad={() => setIsLoaded(true)}
              onError={() => setHasError(true)}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isLoaded ? 'opacity-100' : 'opacity-80'
              }`}
              style={{ filter: duotoneFilter }}
            />
          </picture>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-[#F5EFEB] dark:bg-[#211D18] text-[#8E8273]">
            <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-xs font-mono">{imgMeta.title}</span>
          </div>
        )}
      </div>
      {imgMeta.credit && (
        <figcaption className="px-3 py-1.5 text-[10px] font-mono text-[#8E8273] dark:text-[#7A7165] border-t border-[#E8DFD5]/60 dark:border-[#3D352C]/60 flex items-center justify-between">
          <span className="truncate">{imgMeta.title}</span>
          <span className="shrink-0">{imgMeta.credit}</span>
        </figcaption>
      )}
    </figure>
  );
};
