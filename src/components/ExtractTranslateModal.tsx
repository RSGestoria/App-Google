import React, { useState } from 'react';
import { SlideItem } from '../types';
import {
  Languages,
  Sparkles,
  X,
  Check,
  Loader2,
  Globe,
  FileText,
  ArrowRight,
  Instagram,
  Copy,
  AlertCircle,
} from 'lucide-react';

interface ExtractTranslateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: {
    title: string;
    slides: SlideItem[];
    caption: string;
    hashtags: string[];
    language: 'es-LA';
  }) => void;
}

export const ExtractTranslateModal: React.FC<ExtractTranslateModalProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const [inputContent, setInputContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [translatedResult, setTranslatedResult] = useState<{
    title: string;
    slides: SlideItem[];
    caption: string;
    hashtags: string[];
  } | null>(null);

  if (!isOpen) return null;

  const handleExtractAndTranslate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim()) {
      setErrorMsg('Cole o link da publicação do Instagram/site ou insira o texto original.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/extract-translate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          urlOrText: inputContent.trim(),
          language: 'es-LA',
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Erro ao extrair e traduzir publicação.');
      }

      const data = await res.json();
      if (!data.slides || data.slides.length === 0) {
        throw new Error('Não foi possível estruturar os slides a partir do texto fornecido.');
      }

      setTranslatedResult({
        title: data.title || 'Carrossel Traduzido (ES LATAM)',
        slides: data.slides,
        caption: data.caption || '',
        hashtags: data.hashtags || ['#carruselinstagram', '#espanollatam', '#marketingdigital'],
      });
    } catch (err: any) {
      console.error('Error extracting/translating:', err);
      setErrorMsg(err.message || 'Erro de conexão ao traduzir para Espanhol LATAM.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyToEditor = () => {
    if (translatedResult) {
      onApply({
        title: translatedResult.title,
        slides: translatedResult.slides,
        caption: translatedResult.caption,
        hashtags: translatedResult.hashtags,
        language: 'es-LA',
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 my-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Extrair & Traduzir Publicação
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase border border-emerald-500/30">
                  Español LATAM 🇲🇽 🇨🇴 🇦🇷
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Cole o link ou os textos de qualquer post e a IA extrairá os tópicos e traduzirá para Espanhol Latino-Americano nativo.
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
        <form onSubmit={handleExtractAndTranslate} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                Link da Publicação ou Texto dos Slides (PT-BR)
              </label>
              <button
                type="button"
                onClick={() => setInputContent(`Como Criar Conteúdo de Alto Impacto no Instagram\n\nPasso 1: Entenda o seu público e sua audiência\nVocê precisa conhecer os maiores desejos e necessidades do seu cliente.\n\nPasso 2: Mantenha a consistência semanal\nPublicar conteúdo de valor atrai mais seguidores e aumenta suas vendas.\n\nPasso 3: Faça um chamado para ação claro\nSempre peça para salvar este post e compartilhar com seus amigos.`)}
                className="text-[10px] text-emerald-400 hover:underline font-semibold"
              >
                + Testar com Exemplo de Post PT-BR
              </button>
            </div>
            <textarea
              rows={5}
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              placeholder="Cole o link do post do Instagram (ex: https://instagram.com/p/...) ou os textos originais em Português do seu carrossel..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
            />
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span>💡</span>
              <span>
                <b>Dica:</b> Você pode colar um link público do Instagram/Website <i>ou</i> colar o texto original do seu post em Português.
              </span>
            </p>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/20 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Extraindo Textos e Traduzindo para Espanhol LATAM...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Extrair Textos e Traduzir Automaticamente
              </>
            )}
          </button>
        </form>

        {/* TRANSLATED RESULT PREVIEW */}
        {translatedResult && (
          <div className="p-4 bg-slate-950 rounded-xl border border-emerald-500/30 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Resultado da Tradução
                </span>
                <h4 className="text-sm font-bold text-white">{translatedResult.title}</h4>
              </div>
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs font-bold">
                {translatedResult.slides.length} Slides Traduzidos
              </span>
            </div>

            {/* Slides Mini Preview List */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {translatedResult.slides.map((slide, idx) => (
                <div
                  key={slide.id || idx}
                  className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 text-[10px]">
                      Slide {idx + 1} ({slide.layout})
                    </span>
                    {slide.badgeText && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[9px] font-semibold">
                        {slide.badgeText}
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-white">{slide.title}</div>
                  {slide.subtitle && (
                    <div className="text-slate-400 text-[11px]">{slide.subtitle}</div>
                  )}
                  {slide.bullets && slide.bullets.length > 0 && (
                    <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-0.5 mt-1">
                      {slide.bullets.map((b, bIdx) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* Caption & Hashtags Translated Preview */}
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                Legenda Traduzida (Espanhol LATAM)
              </span>
              <p className="text-slate-300 line-clamp-3 whitespace-pre-line text-[11px]">
                {translatedResult.caption}
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                {translatedResult.hashtags.map((h, i) => (
                  <span key={i} className="text-[10px] text-emerald-400 font-mono">
                    {h}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={handleApplyToEditor}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-md"
            >
              <Check className="w-4 h-4" /> Importar Carrossel Traduzido para o Editor (ES LATAM)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
