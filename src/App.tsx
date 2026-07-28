import React, { useState, useEffect } from 'react';
import {
  CarouselProject,
  SlideItem,
  BrandProfile,
  AspectFormat,
  ThemeStyle,
  PresetTemplate,
} from './types';
import { Navbar } from './components/Navbar';
import { CarouselCanvas } from './components/CarouselCanvas';
import { SlideEditorSidebar } from './components/SlideEditorSidebar';
import { SlideFilmstrip } from './components/SlideFilmstrip';
import { InstagramPreviewModal } from './components/InstagramPreviewModal';
import { ExportModal } from './components/ExportModal';
import { AIGeneratorModal } from './components/AIGeneratorModal';
import { BrandAnalyzerModal } from './components/BrandAnalyzerModal';
import { TemplateSelector } from './components/TemplateSelector';
import { IdeaBankView } from './components/IdeaBankView';
import { SchedulerView } from './components/SchedulerView';
import { PRESET_TEMPLATES } from './data/templates';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Eye,
  Download,
  Plus,
  Wand2,
  Globe,
  Share2,
  Move,
  Undo2,
  Redo2,
} from 'lucide-react';

export default function App() {
  // Main view navigation: 'editor' | 'templates' | 'ideas' | 'analyzer' | 'scheduler'
  const [currentView, setCurrentView] = useState<
    'editor' | 'templates' | 'ideas' | 'analyzer' | 'scheduler'
  >('editor');

  // Modals state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isBrandOpen, setIsBrandOpen] = useState(false);

  // Active Project & Canvas state
  const [projectTitle, setProjectTitle] = useState(
    '5 Erros que Matam suas Vendas no Instagram'
  );
  const [aspectRatio, setAspectRatio] = useState<AspectFormat>('3:4');
  const [themeStyle, setThemeStyle] = useState<ThemeStyle>('modern-dark');
  const [showSwipeIndicator, setShowSwipeIndicator] = useState(true);
  const [showSlideCounter, setShowSlideCounter] = useState(true);
  const [showBrandHandle, setShowBrandHandle] = useState(true);

  // Active Slide index
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Brand profile
  const [brand, setBrand] = useState<BrandProfile>({
    handle: '@marketing.digital',
    name: 'Marketing Digital 360',
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    primaryColor: '#6366f1',
    secondaryColor: '#a855f7',
    backgroundColor: '#0f172a',
    textColor: '#f8fafc',
    accentColor: '#ec4899',
    fontPairing: 'sans-modern',
    niche: 'Marketing & Vendas',
    tone: 'Direto e Provocativo',
  });

  // Carousel slides state
  const [slides, setSlides] = useState<SlideItem[]>([
    {
      id: 'slide-1',
      layout: 'cover',
      title: '5 ERROS QUE MATAM SUAS VENDAS NO INSTAGRAM',
      subtitle: 'O erro #3 é o que 90% dos perfis cometem sem perceber!',
      badgeText: 'ESTRATÉGIA 3:4',
      ctaText: 'Arraste para descobrir ➔',
    },
    {
      id: 'slide-2',
      layout: 'content',
      title: '01. Não usar a Proporção 3:4 nos Carrosséis',
      subtitle: 'O formato 3:4 ocupa 20% a mais de tela do que o quadrado clássico.',
      body: 'Mais espaço visual na linha do tempo do seu seguidor significa mais tempo de atenção e retenção da sua mensagem.',
      bullets: [
        'Área inteira de 1080x1440px no celular',
        'Visualização imersiva na rolagem do feed',
        'Aumenta o tempo de leitura do post',
      ],
      badgeText: 'ERRO #1',
    },
    {
      id: 'slide-3',
      layout: 'comparison',
      title: '02. Focar nas Características e não nas Dores',
      subtitle: 'Veja a diferença na prática entre falar do produto e falar da transformação:',
      comparisonBefore: '❌ "Nosso curso tem 40 aulas gravadas em HD"',
      comparisonAfter: '✅ "Aprenda a fechar clientes de R$ 5 mil em menos de 30 dias"',
      badgeText: 'ERRO #2',
    },
    {
      id: 'slide-4',
      layout: 'checklist',
      title: '03. Falta de uma Chamada para Ação (CTA)',
      subtitle: 'Todo slide de carrossel precisa conduzir o leitor para o próximo passo:',
      bullets: [
        'Defina um único objetivo por publicação',
        'Peça para salvar em posts educativos',
        'Peça para comentar palavras-chave de automação',
        'Nunca encerre sem um direcionamento claro',
      ],
      badgeText: 'ERRO #3',
    },
    {
      id: 'slide-5',
      layout: 'cta',
      title: 'QUER TRANSFORMAR SEU PERFIL EM UMA MÁQUINA DE CLIENTES?',
      subtitle: 'Salve este post agora e coloque em prática no seu próximo post!',
      ctaText: '📌 SALVE ESTE CARROSSEL PARA CONSULTAR DEPOIS',
      badgeText: 'PASSO FINAL',
    },
  ]);

  // Caption & Hashtags
  const [caption, setCaption] = useState(
    `🚀 O formato 3:4 é o maior segredo dos perfis que mais vendem no Instagram atualmente.\n\nQuando você publica um carrossel em 1080x1440px, seu conteúdo ocupa quase a tela inteira do smartphone do seguidor. Isso reduz as distrações e aumenta drasticamente a retenção.\n\nConfira os 5 erros da publicação acima e me diga nos comentários: qual deles você mais cometia?`
  );
  const [caption2, setCaption2] = useState(
    `💡 Você já reparou como alguns perfis conseguem prende a atenção no Instagram de forma quase hipnótica?\n\nNão é sorte. É a combinação de ganchos visuais e o formato vertical 3:4, que bloqueia o ruído do feed.\n\n👇 Me conta aqui: você já está usando a proporção 3:4 nos seus posts ou ainda publica em formato quadrado?`
  );

  const [hashtags, setHashtags] = useState([
    '#carrossel3x4',
    '#marketingdigital',
    '#instagramparanegocios',
    '#criacaodeconteudo',
    '#estrategiademarketing',
    '#vendasnoinstagram',
  ]);

  // Undo/Redo History Stack
  const [past, setPast] = useState<SlideItem[][]>([]);
  const [future, setFuture] = useState<SlideItem[][]>([]);

  const pushToHistoryAndSetSlides = (
    newSlidesOrFn: SlideItem[] | ((prev: SlideItem[]) => SlideItem[])
  ) => {
    setSlides((prev) => {
      const resolved = typeof newSlidesOrFn === 'function' ? newSlidesOrFn(prev) : newSlidesOrFn;
      if (JSON.stringify(resolved) !== JSON.stringify(prev)) {
        setPast((p) => [...p.slice(-30), prev]);
        setFuture([]);
      }
      return resolved;
    });
  };

  const handleUndo = () => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    setFuture((f) => [slides, ...f]);
    setPast(newPast);
    setSlides(previous);
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    setPast((p) => [...p, slides]);
    setFuture(newFuture);
    setSlides(next);
  };

  // Keyboard Shortcuts for Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [past, future, slides]);

  // Slide Modification Helpers
  const updateActiveSlide = (fields: Partial<SlideItem>) => {
    pushToHistoryAndSetSlides((prev) =>
      prev.map((s, idx) => (idx === activeSlideIndex ? { ...s, ...fields } : s))
    );
  };

  const addSlide = (layout: SlideItem['layout'] = 'content') => {
    const newSlide: SlideItem = {
      id: `slide-${Date.now()}`,
      layout,
      title: 'Novo Slide',
      subtitle: 'Insira um texto explicativo aqui...',
      badgeText: `SLIDE 0${slides.length + 1}`,
      bullets: ['Primeiro tópico relevante', 'Segundo ponto importante'],
    };
    pushToHistoryAndSetSlides((prev) => [...prev, newSlide]);
    setActiveSlideIndex(slides.length);
  };

  const duplicateActiveSlide = () => {
    const current = slides[activeSlideIndex];
    if (!current) return;
    const dup: SlideItem = {
      ...current,
      id: `slide-dup-${Date.now()}`,
      title: `${current.title} (Cópia)`,
    };
    const newSlides = [...slides];
    newSlides.splice(activeSlideIndex + 1, 0, dup);
    pushToHistoryAndSetSlides(newSlides);
    setActiveSlideIndex(activeSlideIndex + 1);
  };

  const deleteActiveSlide = () => {
    if (slides.length <= 1) return;
    const newSlides = slides.filter((_, idx) => idx !== activeSlideIndex);
    pushToHistoryAndSetSlides(newSlides);
    setActiveSlideIndex(Math.max(0, activeSlideIndex - 1));
  };

  const moveSlide = (direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? activeSlideIndex - 1 : activeSlideIndex + 1;
    if (targetIdx < 0 || targetIdx >= slides.length) return;

    const newSlides = [...slides];
    const temp = newSlides[activeSlideIndex];
    newSlides[activeSlideIndex] = newSlides[targetIdx];
    newSlides[targetIdx] = temp;

    pushToHistoryAndSetSlides(newSlides);
    setActiveSlideIndex(targetIdx);
  };

  const updateBrand = (fields: Partial<BrandProfile>) => {
    setBrand((prev) => ({ ...prev, ...fields }));
  };

  const handleApplyPresetTemplate = (template: PresetTemplate) => {
    setProjectTitle(template.name);
    setAspectRatio(template.aspectRatio);
    setThemeStyle(template.themeStyle);

    if (template.defaultBrand) {
      setBrand((prev) => ({
        ...prev,
        ...template.defaultBrand,
      }));
    }

    const loadedSlides: SlideItem[] = template.slides.map((s, idx) => ({
      ...s,
      id: `tmpl-s-${idx}-${Date.now()}`,
    }));

    setSlides(loadedSlides);
    setActiveSlideIndex(0);
    setCurrentView('editor');
  };

  const handleCarouselGenerated = (data: {
    title: string;
    slides: SlideItem[];
    caption: string;
    caption2?: string;
    hashtags: string[];
  }) => {
    setProjectTitle(data.title);
    setSlides(data.slides);
    setCaption(data.caption);
    if (data.caption2) {
      setCaption2(data.caption2);
    }
    setHashtags(data.hashtags);
    setActiveSlideIndex(0);
    setCurrentView('editor');
  };

  const handleUseIdeaPrompt = (prompt: string) => {
    setIsAIOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* NAVBAR */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        openExportModal={() => setIsExportOpen(true)}
        openPreviewModal={() => setIsPreviewOpen(true)}
        openAIModal={() => setIsAIOpen(true)}
        projectTitle={projectTitle}
        setProjectTitle={setProjectTitle}
      />

      {/* VIEW: 3:4 CAROUSEL CANVAS EDITOR */}
      {currentView === 'editor' && (
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          {/* LEFT SIDEBAR: Slide & Brand Editor Controls */}
          <SlideEditorSidebar
            slides={slides}
            activeSlideIndex={activeSlideIndex}
            setActiveSlideIndex={setActiveSlideIndex}
            updateActiveSlide={updateActiveSlide}
            addSlide={addSlide}
            duplicateActiveSlide={duplicateActiveSlide}
            deleteActiveSlide={deleteActiveSlide}
            moveSlide={moveSlide}
            brand={brand}
            updateBrand={updateBrand}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            themeStyle={themeStyle}
            setThemeStyle={setThemeStyle}
            showSwipeIndicator={showSwipeIndicator}
            setShowSwipeIndicator={setShowSwipeIndicator}
            showSlideCounter={showSlideCounter}
            setShowSlideCounter={setShowSlideCounter}
            showBrandHandle={showBrandHandle}
            setShowBrandHandle={setShowBrandHandle}
            openAIModal={() => setIsAIOpen(true)}
            openBrandModal={() => setIsBrandOpen(true)}
            topicPrompt={projectTitle}
          />

          {/* CENTER CANVAS DISPLAY AREA */}
          <div className="flex-1 bg-slate-950 flex flex-col items-center justify-between p-4 md:p-8 overflow-y-auto custom-scrollbar relative">
            {/* Top Toolbar Strip */}
            <div className="w-full max-w-2xl flex items-center justify-between gap-4 mb-4 bg-slate-900/60 p-3 rounded-2xl border border-slate-800 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-indigo-600 text-white tracking-wider">
                  {aspectRatio}
                </span>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="bg-transparent text-xs md:text-sm font-bold text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-2 py-1 max-w-[200px] md:max-w-xs truncate"
                  placeholder="Título do Projeto..."
                />
              </div>

              <div className="flex items-center gap-2">
                {/* Undo / Redo buttons */}
                <div className="flex items-center gap-1 border-r border-slate-800 pr-2">
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={past.length === 0}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition flex items-center gap-1 text-xs font-semibold"
                    title="Desfazer alteração no slide (Ctrl+Z)"
                  >
                    <Undo2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="hidden sm:inline">Desfazer</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRedo}
                    disabled={future.length === 0}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition flex items-center gap-1 text-xs font-semibold"
                    title="Refazer alteração no slide (Ctrl+Y)"
                  >
                    <Redo2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="hidden sm:inline">Refazer</span>
                  </button>
                </div>

                <button
                  onClick={() => setIsBrandOpen(true)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition"
                  title="Analisar Marca por URL"
                >
                  <Globe className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden sm:inline">Analisar Marca</span>
                </button>
                <button
                  onClick={() => setIsPreviewOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 transition shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Instagram</span>
                </button>
              </div>
            </div>

            {/* Live 3:4 Slide Canvas Box */}
            <div className="w-full max-w-md my-auto relative group flex flex-col items-center justify-center">
              <div className="w-full mb-2 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400 bg-slate-900/40 px-3 py-1 rounded-full border border-slate-800/80">
                <Move className="w-3 h-3 text-indigo-400" />
                <span>Clique e arraste títulos e subtítulos para mover no slide</span>
              </div>

              <CarouselCanvas
                slide={slides[activeSlideIndex] || slides[0]}
                slideIndex={activeSlideIndex}
                totalSlides={slides.length}
                brand={brand}
                aspectRatio={aspectRatio}
                themeStyle={themeStyle}
                showSwipeIndicator={showSwipeIndicator}
                showSlideCounter={showSlideCounter}
                showBrandHandle={showBrandHandle}
                onUpdateSlide={updateActiveSlide}
              />

              {/* Prev / Next Slide Floating Arrows */}
              {activeSlideIndex > 0 && (
                <button
                  onClick={() => setActiveSlideIndex(activeSlideIndex - 1)}
                  className="absolute -left-5 md:-left-8 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/90 text-white border border-slate-700 shadow-2xl hover:bg-indigo-600 hover:scale-110 transition z-20"
                  title="Slide Anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              {activeSlideIndex < slides.length - 1 && (
                <button
                  onClick={() => setActiveSlideIndex(activeSlideIndex + 1)}
                  className="absolute -right-5 md:-right-8 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/90 text-white border border-slate-700 shadow-2xl hover:bg-indigo-600 hover:scale-110 transition z-20"
                  title="Próximo Slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Interactive Slide Filmstrip Carousel at Bottom */}
            <SlideFilmstrip
              slides={slides}
              activeSlideIndex={activeSlideIndex}
              setActiveSlideIndex={setActiveSlideIndex}
              addSlide={() => addSlide()}
              duplicateSlide={duplicateActiveSlide}
              deleteSlide={deleteActiveSlide}
              moveSlide={moveSlide}
              brand={brand}
              themeStyle={themeStyle}
              aspectRatio={aspectRatio}
            />
          </div>
        </main>
      )}

      {/* VIEW: PRESET TEMPLATES */}
      {currentView === 'templates' && (
        <TemplateSelector onSelectTemplate={handleApplyPresetTemplate} />
      )}

      {/* VIEW: IDEA BANK & TRENDS */}
      {currentView === 'ideas' && (
        <IdeaBankView onUseIdeaPrompt={handleUseIdeaPrompt} />
      )}

      {/* VIEW: BRAND ANALYZER PAGE */}
      {currentView === 'analyzer' && (
        <div className="p-8 max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-white flex items-center justify-center gap-2">
              <Globe className="w-7 h-7 text-indigo-400" />
              Analisador de Identidade Visual de Perfil / Site
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-lg mx-auto">
              Digite seu usuário do Instagram ou a URL do seu site. A Inteligência Artificial irá extrair sua paleta de cores, tipografia e tom de voz para personalizar todos os carrosséis.
            </p>
          </div>
          <button
            onClick={() => setIsBrandOpen(true)}
            className="mx-auto block px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg"
          >
            Abrir Analisador de Marca
          </button>
        </div>
      )}

      {/* VIEW: SCHEDULER & POST PLANNER */}
      {currentView === 'scheduler' && (
        <SchedulerView
          currentProject={{
            id: 'proj-active',
            title: projectTitle,
            aspectRatio,
            themeStyle,
            slides,
            brand,
            caption,
            hashtags,
            status: 'draft',
            createdAt: new Date().toISOString(),
            showSwipeIndicator,
            showSlideCounter,
            showBrandHandle,
          }}
          brand={brand}
        />
      )}

      {/* MODALS */}
      <InstagramPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        slides={slides}
        brand={brand}
        caption={caption}
        caption2={caption2}
        hashtags={hashtags}
        aspectRatio={aspectRatio}
        themeStyle={themeStyle}
        showSwipeIndicator={showSwipeIndicator}
        showSlideCounter={showSlideCounter}
        showBrandHandle={showBrandHandle}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        slides={slides}
        brand={brand}
        caption={caption}
        caption2={caption2}
        hashtags={hashtags}
        aspectRatio={aspectRatio}
        themeStyle={themeStyle}
        showSwipeIndicator={showSwipeIndicator}
        showSlideCounter={showSlideCounter}
        showBrandHandle={showBrandHandle}
      />

      <AIGeneratorModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        brand={brand}
        onCarouselGenerated={handleCarouselGenerated}
      />

      <BrandAnalyzerModal
        isOpen={isBrandOpen}
        onClose={() => setIsBrandOpen(false)}
        onApplyBrand={(newBrand) => {
          setBrand(newBrand);
          if (newBrand.backgroundColor) {
            setThemeStyle('custom');
          }
        }}
      />
    </div>
  );
}
