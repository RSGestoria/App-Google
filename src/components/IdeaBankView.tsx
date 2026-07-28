import React, { useState } from 'react';
import { SAMPLE_IDEAS } from '../data/sampleIdeas';
import { IdeaItem } from '../types';
import { Lightbulb, Sparkles, Search, TrendingUp, Tag, ArrowRight, Flame } from 'lucide-react';

interface IdeaBankViewProps {
  onUseIdeaPrompt: (prompt: string) => void;
}

export const IdeaBankView: React.FC<IdeaBankViewProps> = ({ onUseIdeaPrompt }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');

  const categories = [
    'todos',
    'Marketing Digital',
    'Design & Redes Sociais',
    'Tecnologia & IA',
    'Finanças & Negócios',
    'Saúde & Estilo de Vida',
  ];

  const filteredIdeas = SAMPLE_IDEAS.filter((idea) => {
    const matchesSearch =
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.hook.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'todos' || idea.niche === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-500" />
            Banco de Ideias & Tendências Virais
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Formatos validados e tópicos de alto engajamento prontos para virar carrosséis 3:4.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar assunto ou nicho..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`py-2 px-4 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat === 'todos' ? 'Todas as Tendências' : cat}
          </button>
        ))}
      </div>

      {/* IDEAS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIdeas.map((idea) => (
          <div
            key={idea.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/50 transition duration-300 flex flex-col justify-between space-y-4 shadow-xl group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {idea.category}
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">
                  {idea.slidesCount} Slides Sugeridos
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition leading-snug">
                {idea.title}
              </h3>

              {/* Hook highlight box */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">
                  Gancho de Abertura (Hook)
                </span>
                <p className="text-xs text-slate-300 font-medium italic">"{idea.hook}"</p>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{idea.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {idea.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => onUseIdeaPrompt(`${idea.title}: ${idea.hook}`)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>Criar Carrossel com esta Ideia</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
