import React from 'react';
import { SlideItem, BrandProfile, ThemeStyle, AspectFormat } from '../types';
import { Plus, Copy, Trash2, ChevronLeft, ChevronRight, Wand2, Layout } from 'lucide-react';

interface SlideFilmstripProps {
  slides: SlideItem[];
  activeSlideIndex: number;
  setActiveSlideIndex: (idx: number) => void;
  addSlide: () => void;
  duplicateSlide: () => void;
  deleteSlide: () => void;
  moveSlide: (direction: 'up' | 'down') => void;
  brand: BrandProfile;
  themeStyle: ThemeStyle;
  aspectRatio: AspectFormat;
}

export const SlideFilmstrip: React.FC<SlideFilmstripProps> = ({
  slides,
  activeSlideIndex,
  setActiveSlideIndex,
  addSlide,
  duplicateSlide,
  deleteSlide,
  moveSlide,
  brand,
  themeStyle,
  aspectRatio,
}) => {
  return (
    <div className="w-full max-w-4xl mt-4 px-2 py-3 bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl flex items-center gap-3 overflow-x-auto custom-scrollbar">
      <div className="flex items-center gap-2 px-1">
        {slides.map((s, idx) => {
          const isActive = activeSlideIndex === idx;
          return (
            <div
              key={s.id || idx}
              onClick={() => setActiveSlideIndex(idx)}
              className={`relative shrink-0 cursor-pointer group rounded-xl p-2 transition-all duration-200 border text-left ${
                isActive
                  ? 'bg-indigo-950/70 border-indigo-500/80 ring-2 ring-indigo-500/30 scale-105 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90'
              } w-28 md:w-32 h-36 flex flex-col justify-between overflow-hidden select-none`}
            >
              {/* Header Badge */}
              <div className="flex items-center justify-between gap-1 z-10">
                <span
                  className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {idx + 1}
                </span>
                <span className="text-[9px] font-semibold text-slate-400 uppercase truncate">
                  {s.layout}
                </span>
              </div>

              {/* Slide Content Mini Abstract Preview */}
              <div className="my-auto space-y-1 py-1">
                <p className="text-[10px] font-bold text-slate-200 line-clamp-2 leading-tight">
                  {s.title || 'Sem título'}
                </p>
                {s.subtitle && (
                  <p className="text-[8px] text-slate-400 line-clamp-2 leading-tight">
                    {s.subtitle}
                  </p>
                )}
              </div>

              {/* Bottom Layout Bar Indicator */}
              <div className="w-full flex items-center justify-between pt-1 border-t border-slate-800/60 z-10">
                <span className="text-[8px] font-bold text-indigo-400 truncate">
                  {s.badgeText || `Slide ${idx + 1}`}
                </span>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                )}
              </div>

              {/* Hover Quick Action Overlay */}
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center gap-1.5 z-20">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSlideIndex(idx);
                    duplicateSlide();
                  }}
                  className="p-1.5 bg-slate-800 hover:bg-indigo-600 text-white rounded-lg transition"
                  title="Duplicar Slide"
                >
                  <Copy className="w-3 h-3" />
                </button>
                {slides.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSlideIndex(idx);
                      deleteSlide();
                    }}
                    className="p-1.5 bg-slate-800 hover:bg-rose-600 text-white rounded-lg transition"
                    title="Excluir Slide"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Add New Slide Button Box */}
        <button
          type="button"
          onClick={addSlide}
          className="shrink-0 w-24 h-36 rounded-xl border-2 border-dashed border-slate-800 hover:border-indigo-500/80 bg-slate-950/40 hover:bg-indigo-950/20 text-slate-400 hover:text-indigo-300 transition-all duration-200 flex flex-col items-center justify-center gap-2 group cursor-pointer"
        >
          <div className="p-2 rounded-full bg-slate-900 group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <Plus className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold tracking-tight">+ Adicionar</span>
        </button>
      </div>
    </div>
  );
};
