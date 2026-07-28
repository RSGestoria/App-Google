import React, { useState } from 'react';
import { SlideItem, BrandProfile, AspectFormat, ThemeStyle } from '../types';
import { CarouselCanvas } from './CarouselCanvas';
import {
  X,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Copy,
  Check,
} from 'lucide-react';

interface InstagramPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: SlideItem[];
  brand: BrandProfile;
  caption: string;
  caption2?: string;
  hashtags: string[];
  aspectRatio: AspectFormat;
  themeStyle: ThemeStyle;
  showSwipeIndicator: boolean;
  showSlideCounter: boolean;
  showBrandHandle: boolean;
}

export const InstagramPreviewModal: React.FC<InstagramPreviewModalProps> = ({
  isOpen,
  onClose,
  slides,
  brand,
  caption,
  caption2,
  hashtags,
  aspectRatio,
  themeStyle,
  showSwipeIndicator,
  showSlideCounter,
  showBrandHandle,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedCaptionTab, setSelectedCaptionTab] = useState<'cap1' | 'cap2'>('cap1');
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [showFullCaption, setShowFullCaption] = useState(false);

  if (!isOpen) return null;

  const activeCaptionText = selectedCaptionTab === 'cap2' && caption2 ? caption2 : caption;

  const handleCopyCaption = () => {
    const fullText = `${activeCaptionText}\n\n${hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const nextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col my-auto max-h-[90vh]">
        {/* MODAL HEADER */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
            <Smartphone className="w-4 h-4" />
            <span>Simulador de Feed do Instagram (Visualização Ao Vivo 3:4)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY LAYOUT: PHONE MOCKUP + CAPTION PANEL */}
        <div className="grid grid-cols-1 md:grid-cols-12 overflow-y-auto">
          {/* LEFT: INSTAGRAM PHONE MOCKUP */}
          <div className="md:col-span-7 bg-black p-4 md:p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-800">
            {/* Phone Frame */}
            <div className="w-full max-w-[340px] bg-slate-950 rounded-[32px] border-4 border-slate-800 p-2 shadow-2xl relative">
              {/* Notch */}
              <div className="w-24 h-4 bg-slate-800 rounded-b-xl mx-auto mb-2" />

              {/* Instagram Feed Header */}
              <div className="p-2.5 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-2">
                  <img
                    src={
                      brand.avatarUrl ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                    }
                    alt={brand.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-indigo-500"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white leading-none">
                      {(brand.handle || '@seuperfil').replace('@', '')}
                    </span>
                    <span className="text-[10px] text-slate-400">Publicação Original</span>
                  </div>
                </div>
                <MoreHorizontal className="w-4 h-4 text-slate-400" />
              </div>

              {/* Carousel Slide Display */}
              <div className="relative group my-1">
                <CarouselCanvas
                  slide={slides[currentSlideIndex]}
                  slideIndex={currentSlideIndex}
                  totalSlides={slides.length}
                  brand={brand}
                  aspectRatio={aspectRatio}
                  themeStyle={themeStyle}
                  showSwipeIndicator={showSwipeIndicator}
                  showSlideCounter={showSlideCounter}
                  showBrandHandle={showBrandHandle}
                />

                {/* Left/Right Slide Arrows */}
                {currentSlideIndex > 0 && (
                  <button
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-900/80 text-white backdrop-blur-sm border border-white/10 shadow-md hover:scale-110 transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
                {currentSlideIndex < slides.length - 1 && (
                  <button
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-900/80 text-white backdrop-blur-sm border border-white/10 shadow-md hover:scale-110 transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Instagram Action Icons */}
              <div className="p-2.5 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <button onClick={() => setLiked(!liked)} className="transition hover:scale-110">
                    <Heart
                      className={`w-5 h-5 ${liked ? 'fill-rose-500 text-rose-500' : 'text-white'}`}
                    />
                  </button>
                  <MessageCircle className="w-5 h-5 text-white" />
                  <Send className="w-5 h-5 text-white" />
                </div>

                {/* Pagination Dots */}
                <div className="flex items-center gap-1">
                  {slides.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all ${
                        currentSlideIndex === idx
                          ? 'w-4 bg-indigo-500'
                          : 'w-1.5 bg-slate-700'
                      }`}
                    />
                  ))}
                </div>

                <button onClick={() => setSaved(!saved)} className="transition hover:scale-110">
                  <Bookmark
                    className={`w-5 h-5 ${saved ? 'fill-indigo-500 text-indigo-500' : 'text-white'}`}
                  />
                </button>
              </div>

              {/* Likes & Footer Preview */}
              <div className="px-2.5 pb-2 text-[11px] text-slate-300">
                <span className="font-bold">Curtido por carrossel_studio e outras 1.482 pessoas</span>
              </div>
            </div>
          </div>

          {/* RIGHT: CAPTION, HASHTAGS & COPY AREA */}
          <div className="md:col-span-5 p-6 bg-slate-900 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-200">
                  Legendas Prontas (2 Opções)
                </h3>
                <button
                  onClick={handleCopyCaption}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                >
                  {copiedCaption ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copiar Opção {selectedCaptionTab === 'cap1' ? '1' : '2'}
                    </>
                  )}
                </button>
              </div>

              {/* CAPTION SWITCHER TABS */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setSelectedCaptionTab('cap1')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition flex flex-col items-center justify-center ${
                    selectedCaptionTab === 'cap1'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>Legenda 1</span>
                  <span className="text-[9px] font-normal opacity-80">Direta & Persuasiva</span>
                </button>
                <button
                  onClick={() => setSelectedCaptionTab('cap2')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition flex flex-col items-center justify-center ${
                    selectedCaptionTab === 'cap2'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>Legenda 2</span>
                  <span className="text-[9px] font-normal opacity-80">Storytelling & Engajamento</span>
                </button>
              </div>

              {/* Caption Box */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed max-h-64 overflow-y-auto custom-scrollbar whitespace-pre-wrap">
                <p>
                  <span className="font-bold text-white mr-1.5">
                    {brand.handle || '@seuperfil'}
                  </span>
                  {showFullCaption ? activeCaptionText : `${activeCaptionText.slice(0, 180)}... `}
                  {activeCaptionText.length > 180 && (
                    <button
                      onClick={() => setShowFullCaption(!showFullCaption)}
                      className="text-slate-500 hover:text-indigo-400 font-bold ml-1"
                    >
                      {showFullCaption ? 'ver menos' : 'mais'}
                    </button>
                  )}
                </p>

                {hashtags.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap gap-1">
                    {hashtags.map((tag, idx) => (
                      <span key={idx} className="text-indigo-400 hover:underline">
                        {tag.startsWith('#') ? tag : `#${tag}`}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Note */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-[11px] text-slate-400">
              💡 <strong className="text-slate-200">Dica de Engajamento:</strong> O formato 3:4 ocupa a tela inteira do smartphone na vertical, garantindo máxima legibilidade da sua legenda e dos seus slides!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
