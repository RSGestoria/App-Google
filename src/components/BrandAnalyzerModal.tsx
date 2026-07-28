import React, { useState } from 'react';
import { BrandProfile } from '../types';
import {
  Globe,
  Instagram,
  Sparkles,
  X,
  Check,
  Loader2,
  Palette,
  Type,
  Volume2,
  ArrowRight,
} from 'lucide-react';

interface BrandAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyBrand: (brand: BrandProfile) => void;
}

export const BrandAnalyzerModal: React.FC<BrandAnalyzerModalProps> = ({
  isOpen,
  onClose,
  onApplyBrand,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [handleInput, setHandleInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [analyzedBrand, setAnalyzedBrand] = useState<BrandProfile | null>(null);

  if (!isOpen) return null;

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim() && !handleInput.trim()) {
      setErrorMsg('Por favor, informe seu usuário do Instagram ou link do seu site.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/analyze-brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: urlInput.trim(),
          handle: handleInput.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao analisar o perfil/site.');
      }

      const brandData: BrandProfile = await res.json();
      setAnalyzedBrand(brandData);
    } catch (err: any) {
      console.error('Error in brand analysis:', err);
      setErrorMsg(err.message || 'Não foi possível analisar no momento.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (analyzedBrand) {
      onApplyBrand(analyzedBrand);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-6 my-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Analisador de Identidade Visual com IA
              </h3>
              <p className="text-xs text-slate-400">
                Forneça seu Instagram ou site para gerar paleta de cores e estilo visual único.
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

        {/* INPUT FORM */}
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                Usuário do Instagram
              </label>
              <input
                type="text"
                value={handleInput}
                onChange={(e) => setHandleInput(e.target.value)}
                placeholder="Ex: @sua.empresa"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                Ou Link do seu Site / Landing Page
              </label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Ex: https://minhamarca.com.br"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs font-semibold text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-md shadow-indigo-600/20 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Analisando Identidade com IA...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Analisar e Sugerir Estilo Visual
              </>
            )}
          </button>
        </form>

        {/* RESULTS CARD IF ANALYZED */}
        {analyzedBrand && (
          <div className="p-4 bg-slate-950 rounded-xl border border-indigo-500/30 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <img
                  src={analyzedBrand.avatarUrl}
                  alt={analyzedBrand.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">{analyzedBrand.name}</h4>
                  <span className="text-[10px] text-slate-400">{analyzedBrand.handle}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                {analyzedBrand.niche}
              </span>
            </div>

            {/* Color Palette Display */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-indigo-400" /> Paleta de Cores Recomendada
              </span>
              <div className="flex items-center gap-2">
                <div className="flex-1 space-y-1">
                  <div
                    className="h-8 rounded-lg border border-white/10 shadow-inner"
                    style={{ backgroundColor: analyzedBrand.primaryColor }}
                  />
                  <span className="text-[9px] font-mono text-slate-400 block text-center">
                    {analyzedBrand.primaryColor}
                  </span>
                </div>
                <div className="flex-1 space-y-1">
                  <div
                    className="h-8 rounded-lg border border-white/10 shadow-inner"
                    style={{ backgroundColor: analyzedBrand.secondaryColor }}
                  />
                  <span className="text-[9px] font-mono text-slate-400 block text-center">
                    {analyzedBrand.secondaryColor}
                  </span>
                </div>
                <div className="flex-1 space-y-1">
                  <div
                    className="h-8 rounded-lg border border-white/10 shadow-inner"
                    style={{ backgroundColor: analyzedBrand.backgroundColor }}
                  />
                  <span className="text-[9px] font-mono text-slate-400 block text-center">
                    {analyzedBrand.backgroundColor}
                  </span>
                </div>
                <div className="flex-1 space-y-1">
                  <div
                    className="h-8 rounded-lg border border-white/10 shadow-inner"
                    style={{ backgroundColor: analyzedBrand.accentColor }}
                  />
                  <span className="text-[9px] font-mono text-slate-400 block text-center">
                    {analyzedBrand.accentColor}
                  </span>
                </div>
              </div>
            </div>

            {/* Tone & Typography */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-indigo-400" /> Tom de Voz
                </span>
                <span className="font-bold text-slate-200 block truncate">
                  {analyzedBrand.tone}
                </span>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Type className="w-3 h-3 text-indigo-400" /> Tipografia
                </span>
                <span className="font-bold text-slate-200 block truncate uppercase">
                  {analyzedBrand.fontPairing}
                </span>
              </div>
            </div>

            <button
              onClick={handleApply}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
            >
              <Check className="w-4 h-4" /> Aplicar Estilo Visual ao Carrossel Ativo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
