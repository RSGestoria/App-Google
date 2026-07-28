import React, { useState } from 'react';
import { PRESET_TEMPLATES } from '../data/templates';
import { PresetTemplate, CarouselProject, SlideItem, BrandProfile } from '../types';
import { LayoutTemplate, Sparkles, Check, ArrowRight, Layers } from 'lucide-react';

interface TemplateSelectorProps {
  onSelectTemplate: (template: PresetTemplate) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelectTemplate }) => {
  const [selectedNiche, setSelectedNiche] = useState<string>('todos');

  const niches = [
    'todos',
    'Marketing & Vendas',
    'Educação & Design',
    'Desenvolvimento Pessoal & Luxo',
    'Tecnologia & IA',
  ];

  const filteredTemplates = selectedNiche === 'todos'
    ? PRESET_TEMPLATES
    : PRESET_TEMPLATES.filter((t) => t.niche === selectedNiche);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
            <LayoutTemplate className="w-6 h-6 text-indigo-400" />
            Modelos Pré-definidos de Carrossel 3:4
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Escolha um modelo otimizado para seu nicho e comece a editar instantaneamente.
          </p>
        </div>

        {/* NICHE FILTER TABS */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto custom-scrollbar">
          {niches.map((n) => (
            <button
              key={n}
              onClick={() => setSelectedNiche(n)}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold whitespace-nowrap capitalize transition ${
                selectedNiche === n
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {n === 'todos' ? 'Todos os Nichos' : n}
            </button>
          ))}
        </div>
      </div>

      {/* TEMPLATES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/50 transition duration-300 flex flex-col justify-between space-y-4 group shadow-xl"
          >
            {/* Visual Header Card */}
            <div
              className={`h-48 rounded-xl bg-gradient-to-br ${template.previewColor} p-4 flex flex-col justify-between border border-white/10 shadow-inner relative overflow-hidden`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/40 backdrop-blur-md text-white border border-white/10">
                  {template.category}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500 text-white">
                  3:4
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest block">
                  {template.slides[0]?.badgeText || 'DESTAQUE'}
                </span>
                <h3 className="text-sm font-extrabold text-white line-clamp-2 leading-tight">
                  {template.slides[0]?.title}
                </h3>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-300 font-semibold border-t border-white/10 pt-2">
                <span>{template.slides.length} Slides</span>
                <span>{template.defaultBrand.handle}</span>
              </div>
            </div>

            {/* Template Info & Action */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition">
                  {template.name}
                </h3>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {template.niche}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                {template.description}
              </p>
            </div>

            <button
              onClick={() => onSelectTemplate(template)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition group-hover:shadow-md"
            >
              <span>Usar Este Modelo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
