import React, { useState } from 'react';
import { SlideItem, BrandProfile, AspectFormat, ThemeStyle } from '../types';
import { ArrowRight, CheckCircle2, Quote, Sparkles, XCircle, ChevronRight, Bookmark, Move, RotateCcw, Image as ImageIcon, RefreshCw } from 'lucide-react';

interface CarouselCanvasProps {
  slide: SlideItem;
  slideIndex: number;
  totalSlides: number;
  brand: BrandProfile;
  aspectRatio: AspectFormat;
  themeStyle: ThemeStyle;
  showSwipeIndicator: boolean;
  showSlideCounter: boolean;
  showBrandHandle: boolean;
  isExporting?: boolean;
  canvasRef?: React.RefObject<HTMLDivElement | null>;
  onUpdateSlide?: (updatedSlide: SlideItem) => void;
}

interface DraggableTextProps {
  offset?: { x: number; y: number };
  onOffsetChange?: (offset: { x: number; y: number }) => void;
  isExporting?: boolean;
  label: string;
  children: React.ReactNode;
  className?: string;
}

const DraggableText: React.FC<DraggableTextProps> = ({
  offset,
  onOffsetChange,
  isExporting,
  label,
  children,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialOffset, setInitialOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const currentX = offset?.x || 0;
  const currentY = offset?.y || 0;
  const hasMoved = currentX !== 0 || currentY !== 0;

  if (isExporting || !onOffsetChange) {
    return (
      <div
        className={className}
        style={{
          transform: hasMoved ? `translate3d(${currentX}px, ${currentY}px, 0)` : undefined,
        }}
      >
        {children}
      </div>
    );
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('.drag-reset-btn')) return;
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialOffset({ x: currentX, y: currentY });

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !onOffsetChange) return;
    e.preventDefault();
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    onOffsetChange({
      x: Math.round(initialOffset.x + deltaX),
      y: Math.round(initialOffset.y + deltaY),
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOffsetChange) {
      onOffsetChange({ x: 0, y: 0 });
    }
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group touch-none select-none transition-shadow ${
        isDragging
          ? 'cursor-grabbing ring-2 ring-indigo-500/80 ring-offset-2 ring-offset-transparent rounded-lg z-30 p-1'
          : 'cursor-grab hover:ring-1 hover:ring-indigo-400/50 hover:ring-offset-1 rounded-lg p-1'
      } ${className}`}
      style={{
        transform: `translate3d(${currentX}px, ${currentY}px, 0)`,
        transition: isDragging ? 'none' : 'transform 0.08s ease-out',
      }}
      title={`Arrastar ${label} (clique e arraste para mover)`}
    >
      {children}

      {(isHovered || isDragging || hasMoved) && (
        <div
          className={`absolute -top-3 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md z-40 transition-opacity ${
            isDragging
              ? 'bg-indigo-600 text-white opacity-100'
              : 'bg-slate-900/90 text-indigo-300 opacity-80 group-hover:opacity-100 border border-indigo-500/30'
          }`}
        >
          <Move className="w-2.5 h-2.5" />
          <span>{label}</span>
          {hasMoved && (
            <button
              type="button"
              onClick={handleReset}
              className="drag-reset-btn ml-1 hover:text-red-300 p-0.5 rounded bg-white/10 hover:bg-white/20 transition"
              title="Resetar posição original"
            >
              <RotateCcw className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export const CarouselCanvas: React.FC<CarouselCanvasProps> = ({
  slide,
  slideIndex,
  totalSlides,
  brand,
  aspectRatio,
  themeStyle,
  showSwipeIndicator,
  showSlideCounter,
  showBrandHandle,
  isExporting = false,
  canvasRef,
  onUpdateSlide,
}) => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const handleTitleOffsetChange = (offset: { x: number; y: number }) => {
    if (onUpdateSlide) {
      onUpdateSlide({
        ...slide,
        titleOffset: offset,
      });
    }
  };

  const handleSubtitleOffsetChange = (offset: { x: number; y: number }) => {
    if (onUpdateSlide) {
      onUpdateSlide({
        ...slide,
        subtitleOffset: offset,
      });
    }
  };

  // Aspect ratio class helper
  const getAspectClass = () => {
    switch (aspectRatio) {
      case '3:4':
        return 'aspect-[3/4]'; // 1080x1440
      case '4:5':
        return 'aspect-[4/5]'; // 1080x1350
      case '1:1':
        return 'aspect-square'; // 1080x1080
      default:
        return 'aspect-[3/4]';
    }
  };

  // Font family pairing helper
  const getFontFamilyClass = () => {
    switch (brand.fontPairing) {
      case 'serif-display':
        return 'font-serif';
      case 'tech-bold':
        return 'font-mono tracking-tight';
      case 'editorial':
        return 'font-serif tracking-wide';
      case 'sans-modern':
      default:
        return 'font-sans';
    }
  };

  // Theme style background classes
  const getThemeBgStyle = (): React.CSSProperties => {
    if (slide.customBg) {
      return { background: slide.customBg };
    }

    switch (themeStyle) {
      case 'modern-dark':
        return { background: `linear-gradient(135deg, ${brand.backgroundColor || '#0f172a'} 0%, #030712 100%)` };
      case 'clean-light':
        return { background: `linear-gradient(135deg, ${brand.backgroundColor || '#ffffff'} 0%, #f1f5f9 100%)` };
      case 'luxury-gold':
        return { background: `linear-gradient(135deg, ${brand.backgroundColor || '#09090b'} 0%, #1c1917 100%)` };
      case 'neon-vibrant':
        return { background: `linear-gradient(135deg, ${brand.backgroundColor || '#030712'} 0%, #1e1b4b 100%)` };
      case 'pastel-creative':
        return { background: `linear-gradient(135deg, ${brand.backgroundColor || '#fdf4ff'} 0%, #fae8ff 100%)` };
      case 'corporate-blue':
        return { background: `linear-gradient(135deg, ${brand.backgroundColor || '#0f172a'} 0%, #1e3a8a 100%)` };
      case 'custom':
      default:
        return { background: `linear-gradient(135deg, ${brand.backgroundColor || '#0f172a'} 0%, ${brand.secondaryColor || '#030712'} 100%)` };
    }
  };

  const isDark = themeStyle !== 'clean-light' && themeStyle !== 'pastel-creative';
  const textColor = brand.textColor || (isDark ? '#f8fafc' : '#0f172a');
  const accentColor = (themeStyle === 'custom' && brand.primaryColor) ? brand.primaryColor : (slide.accentColor || brand.primaryColor || '#6366f1');

  return (
    <div
      ref={canvasRef}
      id={`slide-canvas-${slideIndex}`}
      className={`relative w-full overflow-hidden shadow-2xl transition-all duration-300 ${getAspectClass()} ${getFontFamilyClass()} flex flex-col justify-between select-none rounded-xl`}
      style={{
        ...getThemeBgStyle(),
        color: textColor,
        // High resolution export scaling safety
        boxSizing: 'border-box',
      }}
    >
      {/* Decorative ambient background blur or subtle gradient glow */}
      <div
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-25 blur-3xl pointer-events-none z-0"
        style={{ backgroundColor: accentColor }}
      />
      <div
        className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none z-0"
        style={{ backgroundColor: brand.secondaryColor || '#a855f7' }}
      />

      {/* Background AI Generated Image Layer */}
      {(slide.useAiBg || slide.image) && slide.image && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={slide.image}
            alt="Fundo IA"
            className="w-full h-full object-cover opacity-30 mix-blend-overlay scale-105 transition-all duration-700"
            crossOrigin="anonymous"
          />
          <div
            className="absolute inset-0"
            style={{
              background: isDark
                ? 'linear-gradient(to bottom, rgba(15, 23, 42, 0.75) 0%, rgba(15, 23, 42, 0.88) 100%)'
                : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.92) 100%)',
            }}
          />
        </div>
      )}

      {/* AI Background Image Control Badge on Canvas */}
      {!isExporting && onUpdateSlide && (
        <div className="absolute top-2 right-2 z-40 flex items-center gap-1 p-1 bg-slate-950/85 backdrop-blur-md border border-indigo-500/30 rounded-lg shadow-lg text-[10px] text-white">
          <button
            type="button"
            disabled={isGeneratingImage}
            onClick={async () => {
              const nextState = !slide.useAiBg;
              if (nextState && !slide.image) {
                setIsGeneratingImage(true);
                try {
                  const res = await fetch('/api/generate-slide-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: slide.title, prompt: slide.title, niche: brand.niche }),
                  });
                  const data = await res.json();
                  if (data.imageUrl) {
                    onUpdateSlide({ ...slide, useAiBg: true, image: data.imageUrl });
                  } else {
                    onUpdateSlide({ ...slide, useAiBg: true });
                  }
                } catch (e) {
                  onUpdateSlide({ ...slide, useAiBg: true });
                } finally {
                  setIsGeneratingImage(false);
                }
              } else {
                onUpdateSlide({ ...slide, useAiBg: nextState });
              }
            }}
            className={`px-2 py-0.5 rounded font-bold transition flex items-center gap-1 ${
              slide.useAiBg
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3 h-3 text-indigo-300" />
            <span>Fundo IA {slide.useAiBg ? 'ON' : 'OFF'}</span>
          </button>

          {slide.useAiBg && (
            <button
              type="button"
              disabled={isGeneratingImage}
              onClick={async () => {
                setIsGeneratingImage(true);
                try {
                  const res = await fetch('/api/generate-slide-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: slide.title, prompt: slide.title, niche: brand.niche }),
                  });
                  const data = await res.json();
                  if (data.imageUrl) {
                    onUpdateSlide({ ...slide, useAiBg: true, image: data.imageUrl });
                  }
                } catch (e) {
                  console.error(e);
                } finally {
                  setIsGeneratingImage(false);
                }
              }}
              className="p-1 hover:bg-indigo-900/60 text-indigo-300 rounded transition disabled:opacity-50"
              title="Gerar/Trocar Imagem de Fundo com IA"
            >
              <RefreshCw className={`w-3 h-3 ${isGeneratingImage ? 'animate-spin text-amber-400' : ''}`} />
            </button>
          )}
        </div>
      )}

      {/* HEADER BAR: Brand Profile & Slide Counter */}
      <div className="relative z-10 p-6 md:p-8 flex items-center justify-between border-b border-white/10">
        {showBrandHandle ? (
          <div className="flex items-center gap-3">
            {brand.avatarUrl ? (
              <img
                src={brand.avatarUrl}
                alt={brand.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20 shadow-sm"
                crossOrigin="anonymous"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-sm"
                style={{ backgroundColor: accentColor }}
              >
                {(brand.name || 'M').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-bold text-sm leading-tight tracking-tight drop-shadow-sm">
                {brand.name || 'Minha Marca'}
              </span>
              <span className="text-xs opacity-75 font-medium">
                {brand.handle || '@seuperfil'}
              </span>
            </div>
          </div>
        ) : (
          <div />
        )}

        {showSlideCounter && (
          <div
            className="px-3 py-1 rounded-full text-xs font-bold tracking-wider backdrop-blur-md border border-white/15"
            style={{
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              color: textColor,
            }}
          >
            {slideIndex + 1} / {totalSlides}
          </div>
        )}
      </div>

      {/* MAIN BODY CONTENT AREA */}
      <div className="relative z-10 px-6 md:px-10 py-6 flex-1 flex flex-col justify-center">
        {/* Optional Badge */}
        {slide.badgeText && (
          <div className="mb-4">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold tracking-wider uppercase shadow-sm"
              style={{
                backgroundColor: accentColor,
                color: '#ffffff',
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {slide.badgeText}
            </span>
          </div>
        )}

        {/* LAYOUT: COVER / HOOK */}
        {slide.layout === 'cover' && (
          <div className="space-y-4">
            <DraggableText
              label="Título"
              offset={slide.titleOffset}
              onOffsetChange={handleTitleOffsetChange}
              isExporting={isExporting}
            >
              <h1
                className="text-2xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tight drop-shadow-sm"
                style={{ color: textColor }}
              >
                {slide.title}
              </h1>
            </DraggableText>

            {slide.subtitle && (
              <DraggableText
                label="Subtítulo"
                offset={slide.subtitleOffset}
                onOffsetChange={handleSubtitleOffsetChange}
                isExporting={isExporting}
              >
                <p className="text-sm md:text-lg opacity-90 leading-relaxed font-medium">
                  {slide.subtitle}
                </p>
              </DraggableText>
            )}
          </div>
        )}

        {/* LAYOUT: STANDARD CONTENT */}
        {slide.layout === 'content' && (
          <div className="space-y-4">
            <DraggableText
              label="Título"
              offset={slide.titleOffset}
              onOffsetChange={handleTitleOffsetChange}
              isExporting={isExporting}
            >
              <h2 className="text-xl md:text-3xl font-bold leading-snug">
                {slide.title}
              </h2>
            </DraggableText>

            {slide.subtitle && (
              <DraggableText
                label="Subtítulo"
                offset={slide.subtitleOffset}
                onOffsetChange={handleSubtitleOffsetChange}
                isExporting={isExporting}
              >
                <p className="text-sm md:text-base opacity-90 font-medium">
                  {slide.subtitle}
                </p>
              </DraggableText>
            )}

            {slide.body && (
              <p className="text-sm md:text-base opacity-80 leading-relaxed">
                {slide.body}
              </p>
            )}

            {slide.bullets && slide.bullets.length > 0 && (
              <div className="space-y-2.5 mt-4">
                {slide.bullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2
                      className="w-5 h-5 shrink-0 mt-0.5"
                      style={{ color: accentColor }}
                    />
                    <span className="text-xs md:text-sm opacity-90 leading-snug font-medium">
                      {bullet}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* LAYOUT: CHECKLIST / LIST */}
        {slide.layout === 'checklist' && (
          <div className="space-y-4">
            <DraggableText
              label="Título"
              offset={slide.titleOffset}
              onOffsetChange={handleTitleOffsetChange}
              isExporting={isExporting}
            >
              <h2 className="text-xl md:text-3xl font-bold">{slide.title}</h2>
            </DraggableText>

            {slide.subtitle && (
              <DraggableText
                label="Subtítulo"
                offset={slide.subtitleOffset}
                onOffsetChange={handleSubtitleOffsetChange}
                isExporting={isExporting}
              >
                <p className="text-xs md:text-sm opacity-80">{slide.subtitle}</p>
              </DraggableText>
            )}

            {slide.bullets && (
              <div className="space-y-3 mt-4">
                {slide.bullets.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl flex items-center gap-3 backdrop-blur-md border border-white/10 shadow-sm"
                    style={{
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                    }}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ backgroundColor: accentColor }}
                    >
                      {idx + 1}
                    </div>
                    <span className="text-xs md:text-sm font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* LAYOUT: COMPARISON (BEFORE / AFTER) */}
        {slide.layout === 'comparison' && (
          <div className="space-y-4">
            <DraggableText
              label="Título"
              offset={slide.titleOffset}
              onOffsetChange={handleTitleOffsetChange}
              isExporting={isExporting}
            >
              <h2 className="text-xl md:text-2xl font-bold">{slide.title}</h2>
            </DraggableText>

            {slide.subtitle && (
              <DraggableText
                label="Subtítulo"
                offset={slide.subtitleOffset}
                onOffsetChange={handleSubtitleOffsetChange}
                isExporting={isExporting}
              >
                <p className="text-xs md:text-sm opacity-80">{slide.subtitle}</p>
              </DraggableText>
            )}

            <div className="grid grid-cols-1 gap-3 mt-2">
              <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                  <XCircle className="w-4 h-4" /> COMO NÃO FAZER
                </div>
                <p className="text-xs md:text-sm font-medium">
                  {slide.comparisonBefore || 'A abordagem antiga e ineficiente.'}
                </p>
              </div>
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> FORMA RECOMENDADA
                </div>
                <p className="text-xs md:text-sm font-semibold">
                  {slide.comparisonAfter || 'A nova estratégia de alta conversão.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* LAYOUT: QUOTE / HIGHLIGHT */}
        {slide.layout === 'quote' && (
          <div className="space-y-4 text-center px-2">
            <Quote
              className="w-10 h-10 mx-auto opacity-40"
              style={{ color: accentColor }}
            />
            <DraggableText
              label="Título / Citação"
              offset={slide.titleOffset}
              onOffsetChange={handleTitleOffsetChange}
              isExporting={isExporting}
            >
              <h2 className="text-lg md:text-2xl font-serif italic leading-relaxed">
                {slide.body || slide.title}
              </h2>
            </DraggableText>

            {slide.quoteAuthor && (
              <p className="text-xs md:text-sm font-bold tracking-wider uppercase opacity-80 mt-4">
                — {slide.quoteAuthor}
              </p>
            )}
          </div>
        )}

        {/* LAYOUT: STATS / BIG NUMBER */}
        {slide.layout === 'stats' && (
          <div className="space-y-4 text-center">
            <span
              className="text-5xl md:text-7xl font-black tracking-tight drop-shadow-md block"
              style={{ color: accentColor }}
            >
              {slide.statNumber || '10x'}
            </span>
            <DraggableText
              label="Título"
              offset={slide.titleOffset}
              onOffsetChange={handleTitleOffsetChange}
              isExporting={isExporting}
            >
              <h3 className="text-lg md:text-2xl font-bold">{slide.statLabel || slide.title}</h3>
            </DraggableText>

            {slide.subtitle && (
              <DraggableText
                label="Subtítulo"
                offset={slide.subtitleOffset}
                onOffsetChange={handleSubtitleOffsetChange}
                isExporting={isExporting}
              >
                <p className="text-xs md:text-sm opacity-80">{slide.subtitle}</p>
              </DraggableText>
            )}
          </div>
        )}

        {/* LAYOUT: CALL TO ACTION (CTA) */}
        {slide.layout === 'cta' && (
          <div className="space-y-6 text-center py-4">
            <DraggableText
              label="Título"
              offset={slide.titleOffset}
              onOffsetChange={handleTitleOffsetChange}
              isExporting={isExporting}
            >
              <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">
                {slide.title}
              </h2>
            </DraggableText>

            {slide.subtitle && (
              <DraggableText
                label="Subtítulo"
                offset={slide.subtitleOffset}
                onOffsetChange={handleSubtitleOffsetChange}
                isExporting={isExporting}
              >
                <p className="text-sm md:text-base opacity-90 max-w-xs mx-auto">
                  {slide.subtitle}
                </p>
              </DraggableText>
            )}

            <div
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm md:text-base font-bold shadow-lg transform transition hover:scale-105"
              style={{
                backgroundColor: accentColor,
                color: '#ffffff',
              }}
            >
              <Bookmark className="w-5 h-5 fill-current" />
              {slide.ctaText || 'SALVE ESTE POST AGORA'}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER BAR: Swipe Indicator & Branding */}
      <div className="relative z-10 p-6 md:p-8 flex items-center justify-between border-t border-white/10 text-xs font-semibold opacity-90">
        <div className="flex items-center gap-1">
          <span className="opacity-75">{brand.handle || '@seuperfil'}</span>
        </div>

        {showSwipeIndicator && slideIndex < totalSlides - 1 && (
          <div className="flex items-center gap-1.5 animate-pulse text-xs font-bold">
            <span>Arraste</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        )}

        {slideIndex === totalSlides - 1 && (
          <div className="flex items-center gap-1 text-xs font-bold" style={{ color: accentColor }}>
            <span>Fim</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
};

