import React from 'react';
import { SlideItem, BrandProfile, SlideLayout, FontPairing, ThemeStyle, AspectFormat } from '../types';
import {
  Type,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Layout,
  Palette,
  Sparkles,
  Layers,
  Settings,
  Image as ImageIcon,
  Check,
  Move,
  RotateCcw,
  RefreshCw,
  Wand2,
  Languages,
} from 'lucide-react';

export const PALETTE_PRESETS = [
  {
    id: 'indigo-violet',
    name: 'Indigo & Violeta',
    primary: '#6366f1',
    secondary: '#1e1b4b',
    bg: '#0f172a',
    text: '#f8fafc',
    accent: '#ec4899',
  },
  {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    primary: '#00f2fe',
    secondary: '#1e293b',
    bg: '#050814',
    text: '#f0fdf4',
    accent: '#22c55e',
  },
  {
    id: 'luxury-gold',
    name: 'Luxo Ouro & Preto',
    primary: '#d97706',
    secondary: '#1c1917',
    bg: '#09090b',
    text: '#fef3c7',
    accent: '#fbbf24',
  },
  {
    id: 'clean-light',
    name: 'Clean Light Blue',
    primary: '#2563eb',
    secondary: '#f1f5f9',
    bg: '#ffffff',
    text: '#0f172a',
    accent: '#3b82f6',
  },
  {
    id: 'emerald-growth',
    name: 'Emerald Growth',
    primary: '#10b981',
    secondary: '#064e3b',
    bg: '#022c22',
    text: '#ecfdf5',
    accent: '#34d399',
  },
  {
    id: 'sunset-amber',
    name: 'Sunset Crimson',
    primary: '#ea580c',
    secondary: '#27272a',
    bg: '#18181b',
    text: '#fff7ed',
    accent: '#f43f5e',
  },
  {
    id: 'rose-elegance',
    name: 'Elegância Rose',
    primary: '#f43f5e',
    secondary: '#292524',
    bg: '#1c1917',
    text: '#fff1f2',
    accent: '#fb7185',
  },
  {
    id: 'pastel-purple',
    name: 'Pastel Lilás',
    primary: '#a855f7',
    secondary: '#f5f3ff',
    bg: '#fdf4ff',
    text: '#3b0764',
    accent: '#c084fc',
  },
];

interface SlideEditorSidebarProps {
  slides: SlideItem[];
  activeSlideIndex: number;
  setActiveSlideIndex: (idx: number) => void;
  updateActiveSlide: (fields: Partial<SlideItem>) => void;
  addSlide: (layout?: SlideLayout) => void;
  duplicateActiveSlide: () => void;
  deleteActiveSlide: () => void;
  moveSlide: (direction: 'up' | 'down') => void;
  brand: BrandProfile;
  updateBrand: (fields: Partial<BrandProfile>) => void;
  aspectRatio: AspectFormat;
  setAspectRatio: (format: AspectFormat) => void;
  themeStyle: ThemeStyle;
  setThemeStyle: (theme: ThemeStyle) => void;
  showSwipeIndicator: boolean;
  setShowSwipeIndicator: (show: boolean) => void;
  showSlideCounter: boolean;
  setShowSlideCounter: (show: boolean) => void;
  showBrandHandle: boolean;
  setShowBrandHandle: (show: boolean) => void;
  openAIModal: () => void;
  openBrandModal: () => void;
  openTranslateModal?: () => void;
  topicPrompt?: string;
  language?: string;
}

export const SlideEditorSidebar: React.FC<SlideEditorSidebarProps> = ({
  slides,
  activeSlideIndex,
  setActiveSlideIndex,
  updateActiveSlide,
  addSlide,
  duplicateActiveSlide,
  deleteActiveSlide,
  moveSlide,
  brand,
  updateBrand,
  aspectRatio,
  setAspectRatio,
  themeStyle,
  setThemeStyle,
  showSwipeIndicator,
  setShowSwipeIndicator,
  showSlideCounter,
  setShowSlideCounter,
  showBrandHandle,
  setShowBrandHandle,
  openAIModal,
  openBrandModal,
  openTranslateModal,
  topicPrompt = '',
  language = 'pt-BR',
}) => {
  const [activeTab, setActiveTab] = React.useState<'slide' | 'brand' | 'theme'>('slide');
  const [isRegeneratingSlide, setIsRegeneratingSlide] = React.useState(false);
  const [isGeneratingBgImage, setIsGeneratingBgImage] = React.useState(false);

  const currentSlide = slides[activeSlideIndex] || slides[0];

  const handleApplyPalette = (p: typeof PALETTE_PRESETS[0]) => {
    updateBrand({
      primaryColor: p.primary,
      secondaryColor: p.secondary,
      backgroundColor: p.bg,
      textColor: p.text,
      accentColor: p.accent,
    });
    setThemeStyle('custom');
  };

  const handleRegenerateCurrentSlide = async () => {
    if (!currentSlide) return;
    setIsRegeneratingSlide(true);
    try {
      const res = await fetch('/api/regenerate-slide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentSlide,
          topicPrompt,
          niche: brand.niche,
          brand,
          language,
        }),
      });
      const updated = await res.json();
      if (updated && updated.title) {
        updateActiveSlide(updated);
      }
    } catch (err) {
      console.error('Error regenerating slide:', err);
    } finally {
      setIsRegeneratingSlide(false);
    }
  };

  const handleGenerateBgImageForSlide = async () => {
    if (!currentSlide) return;
    setIsGeneratingBgImage(true);
    try {
      const res = await fetch('/api/generate-slide-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: currentSlide.title,
          prompt: topicPrompt || currentSlide.title,
          niche: brand.niche,
        }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        updateActiveSlide({ useAiBg: true, image: data.imageUrl });
      }
    } catch (err) {
      console.error('Error generating bg image:', err);
    } finally {
      setIsGeneratingBgImage(false);
    }
  };

  const handleBulletChange = (idx: number, val: string) => {
    const newBullets = [...(currentSlide.bullets || [])];
    newBullets[idx] = val;
    updateActiveSlide({ bullets: newBullets });
  };

  const addBullet = () => {
    updateActiveSlide({ bullets: [...(currentSlide.bullets || []), 'Novo item'] });
  };

  const removeBullet = (idx: number) => {
    const newBullets = (currentSlide.bullets || []).filter((_, i) => i !== idx);
    updateActiveSlide({ bullets: newBullets });
  };

  return (
    <div className="w-full lg:w-96 bg-slate-900/90 border-r border-slate-800 text-slate-100 flex flex-col h-full overflow-hidden shadow-xl backdrop-blur-md">
      {/* SIDEBAR TABS */}
      <div className="flex items-center border-b border-slate-800 p-2 bg-slate-950/60">
        <button
          onClick={() => setActiveTab('slide')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'slide'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          Slide Ativo
        </button>
        <button
          onClick={() => setActiveTab('theme')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'theme'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          Estilo & Layout
        </button>
        <button
          onClick={() => setActiveTab('brand')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'brand'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          Sua Marca
        </button>
      </div>

      {/* QUICK AI GENERATION & BRAND ANALYZER STRIP */}
      <div className="p-3 bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950 border-b border-slate-800 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={openAIModal}
            className="flex-1 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Gerar com IA
          </button>
          <button
            onClick={openBrandModal}
            className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition border border-slate-700"
            title="Analisar Marca por Link do Instagram/Website"
          >
            Analisar URL
          </button>
        </div>

        {openTranslateModal && (
          <button
            onClick={openTranslateModal}
            className="w-full py-2 px-3 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm"
          >
            <Languages className="w-3.5 h-3.5 text-emerald-400" />
            Extrair & Traduzir Post (ES LATAM 🇲🇽)
          </button>
        )}
      </div>

      {/* TAB CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {/* TAB 1: SLIDE CONTENT EDITING */}
        {activeTab === 'slide' && currentSlide && (
          <div className="space-y-5">
            {/* Slide Navigation & Actions Bar */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 tracking-wider uppercase">
                  Slide {activeSlideIndex + 1} de {slides.length}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveSlide('up')}
                    disabled={activeSlideIndex === 0}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 transition"
                    title="Mover para Cima"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveSlide('down')}
                    disabled={activeSlideIndex === slides.length - 1}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 transition"
                    title="Mover para Baixo"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={duplicateActiveSlide}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 transition"
                    title="Duplicar Slide"
                  >
                    <Copy className="w-3.5 h-3.5 text-indigo-300" />
                  </button>
                  <button
                    onClick={deleteActiveSlide}
                    disabled={slides.length <= 1}
                    className="p-1.5 rounded bg-slate-800 hover:bg-rose-900/60 text-rose-400 disabled:opacity-30 transition"
                    title="Excluir Slide"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Layout Type Picker */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Tipo de Layout
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'cover', label: '🚀 Capa' },
                    { id: 'content', label: '📝 Conteúdo' },
                    { id: 'checklist', label: '✅ Lista' },
                    { id: 'comparison', label: '⚖️ Comparativo' },
                    { id: 'quote', label: '💬 Citação' },
                    { id: 'stats', label: '📊 Métricas' },
                    { id: 'cta', label: '🎯 Chamada (CTA)' },
                  ].map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => updateActiveSlide({ layout: l.id as SlideLayout })}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-left transition flex items-center justify-between border ${
                        currentSlide.layout === l.id
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span>{l.label}</span>
                      {currentSlide.layout === l.id && <Check className="w-3 h-3 text-white shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Single Slide Regenerate with AI Button */}
              <button
                type="button"
                onClick={handleRegenerateCurrentSlide}
                disabled={isRegeneratingSlide}
                className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md disabled:opacity-60"
                title="Reescrever e aprimorar apenas o conteúdo deste slide individual com IA"
              >
                <Wand2 className={`w-3.5 h-3.5 ${isRegeneratingSlide ? 'animate-spin text-amber-300' : ''}`} />
                <span>{isRegeneratingSlide ? 'Reescrevendo Slide...' : 'Reescrever este Slide com IA'}</span>
              </button>
            </div>

            {/* AI Background Image Control Box */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Imagem IA de Fundo</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const next = !currentSlide.useAiBg;
                    if (next && !currentSlide.image) {
                      handleGenerateBgImageForSlide();
                    } else {
                      updateActiveSlide({ useAiBg: next });
                    }
                  }}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                    currentSlide.useAiBg
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {currentSlide.useAiBg ? 'Ativado' : 'Desativado'}
                </button>
              </div>

              {currentSlide.useAiBg && (
                <button
                  type="button"
                  onClick={handleGenerateBgImageForSlide}
                  disabled={isGeneratingBgImage}
                  className="w-full py-1.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-indigo-300 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isGeneratingBgImage ? 'animate-spin text-amber-400' : ''}`} />
                  <span>{isGeneratingBgImage ? 'Gerando Imagem...' : 'Gerar Nova Imagem IA'}</span>
                </button>
              )}
            </div>

            {/* Badge Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Selo / Badge de Topo</span>
                <span className="text-[10px] text-slate-500">Opcional</span>
              </label>
              <input
                type="text"
                value={currentSlide.badgeText || ''}
                onChange={(e) => updateActiveSlide({ badgeText: e.target.value })}
                placeholder="Ex: DICA RÁPIDA, PASSO 01, ALERTA"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Title Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Título do Slide
              </label>
              <textarea
                value={currentSlide.title || ''}
                onChange={(e) => updateActiveSlide({ title: e.target.value })}
                rows={2}
                placeholder="Digite o título principal..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Subtitle / Description Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Subtítulo / Descrição
              </label>
              <textarea
                value={currentSlide.subtitle || ''}
                onChange={(e) => updateActiveSlide({ subtitle: e.target.value })}
                rows={2}
                placeholder="Insira um subtítulo explicativo..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Drag Position Indicator & Reset */}
            {((currentSlide.titleOffset && (currentSlide.titleOffset.x !== 0 || currentSlide.titleOffset.y !== 0)) ||
              (currentSlide.subtitleOffset && (currentSlide.subtitleOffset.x !== 0 || currentSlide.subtitleOffset.y !== 0))) && (
              <div className="p-2.5 bg-indigo-950/40 border border-indigo-500/30 rounded-lg flex items-center justify-between text-xs text-indigo-200">
                <span className="text-[11px] font-medium flex items-center gap-1.5">
                  <Move className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Posição personalizada ativa</span>
                </span>
                <button
                  type="button"
                  onClick={() => updateActiveSlide({ titleOffset: { x: 0, y: 0 }, subtitleOffset: { x: 0, y: 0 } })}
                  className="px-2 py-1 bg-indigo-600/80 hover:bg-indigo-500 text-white rounded text-[10px] font-bold transition flex items-center gap-1 shrink-0"
                >
                  <RotateCcw className="w-3 h-3" /> Resetar
                </button>
              </div>
            )}

            {/* Layout Specific Fields */}
            {['content', 'quote'].includes(currentSlide.layout) && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Texto do Corpo / Citação
                </label>
                <textarea
                  value={currentSlide.body || ''}
                  onChange={(e) => updateActiveSlide({ body: e.target.value })}
                  rows={3}
                  placeholder="Insira o texto principal..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            {currentSlide.layout === 'quote' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Autor da Citação
                </label>
                <input
                  type="text"
                  value={currentSlide.quoteAuthor || ''}
                  onChange={(e) => updateActiveSlide({ quoteAuthor: e.target.value })}
                  placeholder="Ex: Steve Jobs, Autor Desconhecido"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            {['content', 'checklist'].includes(currentSlide.layout) && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    Tópicos / Itens
                  </label>
                  <button
                    onClick={addBullet}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Adicionar
                  </button>
                </div>
                {(currentSlide.bullets || []).map((bullet, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={bullet}
                      onChange={(e) => handleBulletChange(idx, e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={() => removeBullet(idx)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {currentSlide.layout === 'comparison' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-rose-400">
                    Forma Errada (Antes)
                  </label>
                  <textarea
                    value={currentSlide.comparisonBefore || ''}
                    onChange={(e) => updateActiveSlide({ comparisonBefore: e.target.value })}
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-emerald-400">
                    Forma Correta (Depois)
                  </label>
                  <textarea
                    value={currentSlide.comparisonAfter || ''}
                    onChange={(e) => updateActiveSlide({ comparisonAfter: e.target.value })}
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  />
                </div>
              </div>
            )}

            {currentSlide.layout === 'stats' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Número / Dado Gigante
                  </label>
                  <input
                    type="text"
                    value={currentSlide.statNumber || ''}
                    onChange={(e) => updateActiveSlide({ statNumber: e.target.value })}
                    placeholder="Ex: +42%, 10x, R$ 50k"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-bold text-indigo-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Rótulo / Descrição do Dado
                  </label>
                  <input
                    type="text"
                    value={currentSlide.statLabel || ''}
                    onChange={(e) => updateActiveSlide({ statLabel: e.target.value })}
                    placeholder="Ex: de aumento nas vendas no formato 3:4"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  />
                </div>
              </div>
            )}

            {currentSlide.layout === 'cta' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Texto do Botão de CTA
                </label>
                <input
                  type="text"
                  value={currentSlide.ctaText || ''}
                  onChange={(e) => updateActiveSlide({ ctaText: e.target.value })}
                  placeholder="Ex: SALVE ESTE POST AGORA 📌"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            {/* Add Slide Button */}
            <button
              onClick={() => addSlide('content')}
              className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 hover:border-indigo-500 text-slate-400 hover:text-indigo-300 text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" /> Adicionar Novo Slide
            </button>
          </div>
        )}

        {/* TAB 2: THEME, ASPECT RATIO & LAYOUT STYLE */}
        {activeTab === 'theme' && (
          <div className="space-y-5">
            {/* Aspect Ratio Configurator (Natively defaulted to 3:4) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Formato do Instagram
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['3:4', '4:5', '1:1'] as AspectFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setAspectRatio(fmt)}
                    className={`py-2 px-2 rounded-lg border text-xs font-bold flex flex-col items-center gap-1 transition ${
                      aspectRatio === fmt
                        ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300 shadow-sm'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{fmt}</span>
                    <span className="text-[10px] opacity-70 font-normal">
                      {fmt === '3:4' ? '1080x1440 (Ideal)' : fmt === '4:5' ? '1080x1350' : '1080x1080'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Preset Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Estilo Visual do Tema
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'modern-dark', name: 'Dark Modern', desc: 'Fundo escuro e marcante' },
                  { id: 'clean-light', name: 'Clean Light', desc: 'Fundo claro e minimalista' },
                  { id: 'luxury-gold', name: 'Luxury Gold', desc: 'Preto & Dourado Premium' },
                  { id: 'neon-vibrant', name: 'Tech Neon', desc: 'Cyan & Violeta Vibrante' },
                  { id: 'pastel-creative', name: 'Pastel Creative', desc: 'Tons suaves criativos' },
                  { id: 'corporate-blue', name: 'Corporate Blue', desc: 'Azul corporativo sério' },
                ].map((th) => (
                  <button
                    key={th.id}
                    onClick={() => setThemeStyle(th.id as ThemeStyle)}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      themeStyle === th.id
                        ? 'border-indigo-500 bg-indigo-950/60 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-xs font-bold">{th.name}</div>
                    <div className="text-[10px] opacity-70 mt-0.5">{th.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Preset Palettes */}
            <div className="space-y-2.5 p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block flex items-center justify-between">
                <span>Paletas Prontas (1-Clique)</span>
                <span className="text-[10px] text-indigo-400 font-normal">Aplica a todos os slides</span>
              </span>
              <div className="grid grid-cols-2 gap-2">
                {PALETTE_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleApplyPalette(p)}
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500 text-left transition flex flex-col gap-1.5 group"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[11px] font-bold text-slate-300 group-hover:text-white">
                        {p.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: p.primary }} />
                      <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: p.accent }} />
                      <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: p.bg }} />
                      <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: p.text }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Visibility Toggles */}
            <div className="space-y-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Elementos Visuais de Apoio
              </span>

              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                <span>Indicador "Arraste ➔"</span>
                <input
                  type="checkbox"
                  checked={showSwipeIndicator}
                  onChange={(e) => setShowSwipeIndicator(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                <span>Contador de Slides (ex: 1/5)</span>
                <input
                  type="checkbox"
                  checked={showSlideCounter}
                  onChange={(e) => setShowSlideCounter(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                <span>Assinatura da Marca no Topo/Rodapé</span>
                <input
                  type="checkbox"
                  checked={showBrandHandle}
                  onChange={(e) => setShowBrandHandle(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                />
              </label>
            </div>
          </div>
        )}

        {/* TAB 3: BRANDING & COLORS */}
        {activeTab === 'brand' && (
          <div className="space-y-5">
            <div className="p-3 bg-indigo-950/40 border border-indigo-800/40 rounded-xl text-xs space-y-1">
              <span className="font-bold text-indigo-300 block">Identidade Visual Unificada</span>
              <p className="text-slate-400">
                Altere aqui as cores e dados do perfil para refletir em todos os slides simultaneamente.
              </p>
            </div>

            {/* Handle & Name */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Nome do Perfil / Marca
                </label>
                <input
                  type="text"
                  value={brand.name}
                  onChange={(e) => updateBrand({ name: e.target.value })}
                  placeholder="Ex: Marketing Digital 360"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Usuário do Instagram (@handle)
                </label>
                <input
                  type="text"
                  value={brand.handle}
                  onChange={(e) => updateBrand({ handle: e.target.value })}
                  placeholder="Ex: @seu.perfil"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  URL do Avatar / Foto de Perfil
                </label>
                <input
                  type="text"
                  value={brand.avatarUrl || ''}
                  onChange={(e) => updateBrand({ avatarUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                />
              </div>
            </div>

            {/* Typography Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Família de Tipografia
              </label>
              <select
                value={brand.fontPairing}
                onChange={(e) => updateBrand({ fontPairing: e.target.value as FontPairing })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
              >
                <option value="sans-modern">Sans-Serif Moderna (Clean & Direta)</option>
                <option value="serif-display">Serifada Elegante (Editorial & Luxo)</option>
                <option value="tech-bold">Tech / Monospaced (Destaque & Código)</option>
                <option value="editorial">Editorial Clássica (Elegante)</option>
              </select>
            </div>

            {/* Quick Preset Palettes in Brand tab */}
            <div className="space-y-2.5 p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block flex items-center justify-between">
                <span>Trocar Paleta da Marca (1-Clique)</span>
              </span>
              <div className="grid grid-cols-2 gap-2">
                {PALETTE_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleApplyPalette(p)}
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500 text-left transition flex flex-col gap-1.5 group"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[11px] font-bold text-slate-300 group-hover:text-white">
                        {p.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: p.primary }} />
                      <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: p.accent }} />
                      <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: p.bg }} />
                      <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: p.text }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Controls */}
            <div className="space-y-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Editar Cores Hex Manualmente
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 block">Cor Principal</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={brand.primaryColor}
                      onChange={(e) => {
                        updateBrand({ primaryColor: e.target.value });
                        setThemeStyle('custom');
                      }}
                      className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                    />
                    <span className="text-xs font-mono">{brand.primaryColor}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 block">Cor de Fundo</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={brand.backgroundColor}
                      onChange={(e) => {
                        updateBrand({ backgroundColor: e.target.value });
                        setThemeStyle('custom');
                      }}
                      className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                    />
                    <span className="text-xs font-mono">{brand.backgroundColor}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 block">Cor do Texto</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={brand.textColor}
                      onChange={(e) => {
                        updateBrand({ textColor: e.target.value });
                        setThemeStyle('custom');
                      }}
                      className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                    />
                    <span className="text-xs font-mono">{brand.textColor}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 block">Cor de Destaque</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={brand.accentColor}
                      onChange={(e) => {
                        updateBrand({ accentColor: e.target.value });
                        setThemeStyle('custom');
                      }}
                      className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                    />
                    <span className="text-xs font-mono">{brand.accentColor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER SLIDE TIMELINE THUMBNAILS */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Linha do Tempo dos Slides ({slides.length})
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {slides.map((s, idx) => (
            <button
              key={s.id || idx}
              onClick={() => setActiveSlideIndex(idx)}
              className={`relative shrink-0 w-12 h-16 rounded-md border transition flex flex-col justify-between p-1 text-[9px] font-bold ${
                activeSlideIndex === idx
                  ? 'border-indigo-500 bg-indigo-950/80 text-indigo-200 ring-2 ring-indigo-500/40'
                  : 'border-slate-800 bg-slate-900 text-slate-500 hover:text-slate-300'
              }`}
            >
              <span>#{idx + 1}</span>
              <span className="truncate w-full text-[8px] opacity-75">{s.layout}</span>
            </button>
          ))}
          <button
            onClick={() => addSlide('content')}
            className="shrink-0 w-12 h-16 rounded-md border border-dashed border-slate-800 hover:border-indigo-500 text-slate-500 hover:text-indigo-300 flex items-center justify-center transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
