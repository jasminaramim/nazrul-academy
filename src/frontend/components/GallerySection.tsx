import React, { useState } from 'react';
import { Image as ImageIcon, Video, Play, X, Eye } from 'lucide-react';
import { GalleryItem } from '../../shared/types';

interface GallerySectionProps {
  gallery: GalleryItem[];
  showAll?: boolean;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery, showAll = false }) => {
  const [filter, setFilter] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = [
    { id: 'all', label: 'সকল' },
    { id: 'image', label: 'ছবি' },
    { id: 'video', label: 'ভিডিও' },
    { id: 'স্মৃতিচারণ', label: 'পুরনো স্মৃতি' },
    { id: 'ক্যাম্পাস', label: 'ক্যাম্পাস' },
  ];

  const filtered = gallery.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'image') return item.type === 'image';
    if (filter === 'video') return item.type === 'video';
    return item.category === filter;
  });

  const displayList = showAll ? filtered : filtered.slice(0, 8);

  return (
    <section className="py-16 bg-white border-b border-slate-200/70" id="gallery-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#00732A] uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            স্মৃতির অ্যালবাম
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            ছবি ও ভিডিও গ্যালারি
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            নজরুল একাডেমি প্রাঙ্গণের সোনালী অতীত ও পুনর্মিলনীর স্মৃতিময় মুহূর্ত
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                filter === cat.id
                  ? 'bg-[#00732A] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {displayList.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 aspect-4/3 cursor-pointer shadow-2xs hover:shadow-lg transition-all"
            >
              <img
                src={item.type === 'video' && item.videoThumbnail ? item.videoThumbnail : item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                loading="lazy"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Video icon badge */}
              {item.type === 'video' && (
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#CA0000] text-white flex items-center justify-center shadow-md">
                  <Play className="w-4 h-4 fill-white translate-x-0.5" />
                </div>
              )}

              {/* Title & Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <span className="text-[10px] font-bold text-amber-300 bg-black/40 px-2 py-0.5 rounded-full border border-amber-400/30 inline-block mb-1">
                  {item.category || item.date}
                </span>
                <h3 className="text-xs sm:text-sm font-bold leading-tight line-clamp-1 group-hover:text-amber-200 transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox / Video Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <button
            onClick={() => setActiveItem(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl p-4 text-white">
            <div className="relative aspect-video w-full bg-black rounded-xl overflow-hidden flex items-center justify-center">
              {activeItem.type === 'video' ? (
                activeItem.url.includes('youtube') || activeItem.url.includes('embed') ? (
                  <iframe
                    src={activeItem.url}
                    title={activeItem.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  <div className="text-center p-8">
                    <Video className="w-16 h-16 text-red-500 mx-auto mb-3" />
                    <p className="text-sm">ভিডিও প্লেয়ার প্রস্তুত হচ্ছে...</p>
                    <a
                      href={activeItem.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-block px-4 py-2 bg-[#CA0000] text-white rounded-lg text-xs font-bold"
                    >
                      ইউটিউবে দেখুন
                    </a>
                  </div>
                )
              ) : (
                <img
                  src={activeItem.url}
                  alt={activeItem.title}
                  className="max-h-[70vh] w-auto object-contain mx-auto"
                />
              )}
            </div>

            <div className="mt-4 px-2">
              <h3 className="text-lg font-bold text-white">{activeItem.title}</h3>
              {activeItem.description && (
                <p className="text-xs sm:text-sm text-slate-300 mt-1">{activeItem.description}</p>
              )}
              <span className="text-xs text-amber-400 mt-1 block">তারিখ: {activeItem.date}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
