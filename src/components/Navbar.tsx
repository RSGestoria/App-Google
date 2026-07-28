import React from 'react';
import {
  Sparkles,
  LayoutTemplate,
  Lightbulb,
  Globe,
  Calendar,
  Eye,
  Download,
  Check,
  Zap,
  Languages,
} from 'lucide-react';

interface NavbarProps {
  currentView: 'editor' | 'templates' | 'ideas' | 'analyzer' | 'scheduler';
  setCurrentView: (view: 'editor' | 'templates' | 'ideas' | 'analyzer' | 'scheduler') => void;
  openExportModal: () => void;
  openPreviewModal: () => void;
  openAIModal: () => void;
  openTranslateModal?: () => void;
  projectTitle: string;
  setProjectTitle: (title: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  openExportModal,
  openPreviewModal,
  openAIModal,
  openTranslateModal,
  projectTitle,
  setProjectTitle,
}) => {
  return (
    <header className="h-16 bg-slate-950 border-b border-slate-800 text-white px-4 md:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-md">
      {/* BRAND & LOGO */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-indigo-500/20">
          3:4
        </div>
        <div className="hidden sm:flex flex-col">
          <span className="font-extrabold text-sm md:text-base tracking-tight leading-none bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            Carrossel Studio AI
          </span>
          <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase">
            Instagram 3:4 High Quality
          </span>
        </div>
      </div>

      {/* VIEW SWITCHER TABS */}
      <nav className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
        <button
          onClick={() => setCurrentView('editor')}
          className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
            currentView === 'editor'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Editor 3:4</span>
        </button>

        <button
          onClick={() => setCurrentView('templates')}
          className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
            currentView === 'templates'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <LayoutTemplate className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Modelos</span>
        </button>

        <button
          onClick={() => setCurrentView('ideas')}
          className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
            currentView === 'ideas'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Ideias & Tendências</span>
        </button>

        <button
          onClick={() => setCurrentView('analyzer')}
          className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
            currentView === 'analyzer'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Analisador de Marca</span>
        </button>

        <button
          onClick={() => setCurrentView('scheduler')}
          className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
            currentView === 'scheduler'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Agendamento</span>
        </button>
      </nav>

      {/* ACTION BUTTONS */}
      <div className="flex items-center gap-2">
        {openTranslateModal && (
          <button
            onClick={openTranslateModal}
            className="p-2 md:px-3 md:py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
            title="Extrair e Traduzir Publicação para Espanhol LATAM"
          >
            <Languages className="w-4 h-4 text-emerald-400" />
            <span className="hidden xl:inline">Traduzir Post (ES LATAM)</span>
          </button>
        )}

        <button
          onClick={openPreviewModal}
          className="p-2 md:px-3 md:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
          title="Pré-visualizar no Feed do Instagram"
        >
          <Eye className="w-4 h-4 text-indigo-400" />
          <span className="hidden lg:inline">Pré-visualização ao Vivo</span>
        </button>

        <button
          onClick={openExportModal}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-indigo-600/20"
        >
          <Download className="w-4 h-4" />
          <span>Exportar</span>
        </button>
      </div>
    </header>
  );
};
