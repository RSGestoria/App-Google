import React, { useState } from 'react';
import { BrandProfile, SlideItem, ContentLanguage } from '../types';
import { Sparkles, X, Loader2, Wand2, Hash, AlignLeft, Layers, Globe } from 'lucide-react';

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: BrandProfile;
  onCarouselGenerated: (data: {
    title: string;
    slides: SlideItem[];
    caption: string;
    caption2?: string;
    hashtags: string[];
  }) => void;
}

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({
  isOpen,
  onClose,
  brand,
  onCarouselGenerated,
}) => {
  const [topicPrompt, setTopicPrompt] = useState('');
  const [slideCount, setSlideCount] = useState(5);
  const [language, setLanguage] = useState<ContentLanguage>('pt-BR');
  const [useBrandData, setUseBrandData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicPrompt.trim()) {
      setErrorMsg('Descreva o tema ou assunto do seu carrossel.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/generate-carousel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: topicPrompt.trim(),
          brand,
          niche: brand.niche,
          slideCount,
          language,
          useBrandData,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao gerar carrossel.');
      }

      const generatedData = await res.json();
      onCarouselGenerated(generatedData);
      onClose();
    } catch (err: any) {
      console.error('AI Generation error:', err);
      setErrorMsg(err.message || 'Erro ao comunicar com a Inteligência Artificial.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 my-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Gerador de Carrosséis 3:4 com IA
              </h3>
              <p className="text-xs text-slate-400">
                Digite um tema e escolha o idioma do seu conteúdo.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleGenerate} className="space-y-4">
          {/* LANGUAGE SELECTOR */}
          <div className="space-y-1.5 p-3 bg-indigo-950/30 border border-indigo-800/40 rounded-xl">
            <label className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              Idioma da Publicação / Publicación
            </label>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setLanguage('pt-BR')}
                className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition ${
                  language === 'pt-BR'
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🇧🇷 Português (Brasil)</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage('es-LA')}
                className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition ${
                  language === 'es-LA'
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🇲🇽 Español (Latam)</span>
              </button>
            </div>
          </div>

          {/* BRAND ANALYSIS vs PROMPT MODE TOGGLE */}
          <div className="space-y-1.5 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs">
            <label className="font-bold text-slate-300 block mb-1">
              {language === 'es-LA' ? 'Base de Generación de la IA' : 'Base de Geração da IA'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setUseBrandData(true)}
                className={`p-2 rounded-lg border text-[11px] font-bold text-left transition ${
                  useBrandData
                    ? 'bg-indigo-950/80 border-indigo-500 text-indigo-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-bold">🌐 {language === 'es-LA' ? 'Prompt + Análisis de Marca/Sitio' : 'Prompt + Análise do Site/Marca'}</div>
                <div className="text-[10px] opacity-75 font-normal mt-0.5">
                  {brand.website ? `Website: ${brand.website}` : `@handle: ${brand.handle}`}
                </div>
              </button>
              <button
                type="button"
                onClick={() => setUseBrandData(false)}
                className={`p-2 rounded-lg border text-[11px] font-bold text-left transition ${
                  !useBrandData
                    ? 'bg-indigo-950/80 border-indigo-500 text-indigo-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-bold">🎯 {language === 'es-LA' ? 'Solo en base al Prompt' : 'Apenas com base no Prompt'}</div>
                <div className="text-[10px] opacity-75 font-normal mt-0.5">
                  {language === 'es-LA' ? 'Tema libre escrito abajo' : 'Tema livre escrito abaixo'}
                </div>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">
              {language === 'es-LA' ? 'Descripción del Tema del Carrusel / Post' : 'Descrição do Tema da Publicação'}
            </label>
            <textarea
              value={topicPrompt}
              onChange={(e) => setTopicPrompt(e.target.value)}
              rows={3}
              placeholder={
                language === 'es-LA'
                  ? 'Ej: Cómo conseguir tus primeros 1.000 seguidores en Instagram usando carruseles 3:4 sin gastar en anuncios...'
                  : 'Ex: Como conseguir os primeiros 1.000 seguidores no Instagram usando carrosséis de 3:4 sem gastar com anúncios...'
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                {language === 'es-LA' ? 'Cantidad de Páginas' : 'Quantidade de Páginas'}
              </label>
              <select
                value={slideCount}
                onChange={(e) => setSlideCount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-bold"
              >
                <option value={1}>{language === 'es-LA' ? '1 Página (Publicación Única)' : '1 Página (Post Único)'}</option>
                <option value={2}>{language === 'es-LA' ? '2 Páginas (Carrucel Corto)' : '2 Páginas (Carrossel Curto)'}</option>
                <option value={3}>{language === 'es-LA' ? '3 Páginas (Rápido)' : '3 Páginas (Rápido)'}</option>
                <option value={4}>{language === 'es-LA' ? '4 Páginas (Estándar)' : '4 Páginas (Padrão)'}</option>
                <option value={5}>{language === 'es-LA' ? '5 Páginas (Recomendado ⭐)' : '5 Páginas (Recomendado ⭐)'}</option>
                <option value={6}>{language === 'es-LA' ? '6 Páginas (Detallado)' : '6 Páginas (Detalhado)'}</option>
                <option value={7}>{language === 'es-LA' ? '7 Páginas (Guía)' : '7 Páginas (Guia Completo)'}</option>
                <option value={8}>{language === 'es-LA' ? '8 Páginas (Profundo)' : '8 Páginas (Aprofundado)'}</option>
                <option value={9}>{language === 'es-LA' ? '9 Páginas (Extenso)' : '9 Páginas (Extenso)'}</option>
                <option value={10}>{language === 'es-LA' ? '10 Páginas (Máximo Instagram)' : '10 Páginas (Máximo do Instagram)'}</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                {language === 'es-LA' ? 'Nicho de la Marca' : 'Nicho da Marca'}
              </label>
              <input
                type="text"
                value={brand.niche || 'Marketing Digital'}
                readOnly
                className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 text-xs text-slate-400 cursor-not-allowed font-medium"
              />
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs font-semibold text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
              {errorMsg}
            </p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {language === 'es-LA' ? 'Generando Carrusel 3:4 con IA...' : 'Gerando Carrossel 3:4 com IA...'}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {language === 'es-LA' ? 'Generar Carrusel + Leyenda & Hashtags' : 'Gerar Carrossel + Legendas & Hashtags'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
