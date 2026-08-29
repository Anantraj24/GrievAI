import React, { useState } from 'react';
import { Attachment } from '../../types';

interface EvidenceGalleryProps {
  attachments: Attachment[];
}

export const EvidenceGallery: React.FC<EvidenceGalleryProps> = ({ attachments }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!attachments || attachments.length === 0) {
    return (
      <div className="text-xs text-gray-500 italic p-3 bg-[#10131a] rounded border border-[#262626]">
        No attachments uploaded with this case.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {attachments.map((att) => {
          const isImg = att.type.startsWith('image') || att.url.includes('image') || att.name.endsWith('.jpg') || att.name.endsWith('.png');
          return (
            <div
              key={att.id}
              onClick={() => isImg && setSelectedImage(att.url)}
              className="flex items-center gap-3 p-3 rounded-lg bg-[#10131a] border border-[#262626] hover:border-blue-500/50 transition-all cursor-pointer group"
            >
              {isImg ? (
                <div className="w-12 h-12 rounded overflow-hidden bg-[#171717] shrink-0 border border-[#262626]">
                  <img alt={att.name} src={att.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-blue-400">
                  <span className="material-symbols-outlined text-2xl">description</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate group-hover:text-blue-400 transition-colors">{att.name}</p>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono mt-0.5">
                  <span>{att.size}</span>
                  <span>•</span>
                  <span>{att.uploadedAt.slice(0, 10)}</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-sm text-gray-500 group-hover:text-white transition-colors">
                visibility
              </span>
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-xl border border-gray-700 bg-[#171717] p-2">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full hover:bg-black transition-colors"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
            <img alt="Evidence Full Preview" src={selectedImage} className="max-w-full max-h-[85vh] object-contain rounded-lg" />
          </div>
        </div>
      )}
    </>
  );
};
