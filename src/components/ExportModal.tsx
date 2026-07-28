import React, { useState } from 'react';
import { SlideItem, BrandProfile, AspectFormat, ThemeStyle } from '../types';
import { CarouselCanvas } from './CarouselCanvas';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import {
  X,
  Download,
  FileArchive,
  FileText,
  Copy,
  Check,
  Loader2,
  Sparkles,
  Share2,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: SlideItem[];
  brand: BrandProfile;
  caption: string;
  caption2?: string;
  hashtags: string[];
  aspectRatio: AspectFormat;
  themeStyle: ThemeStyle;
  showSwipeIndicator: boolean;
  showSlideCounter: boolean;
  showBrandHandle: boolean;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  slides,
  brand,
  caption,
  caption2,
  hashtags,
  aspectRatio,
  themeStyle,
  showSwipeIndicator,
  showSlideCounter,
  showBrandHandle,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [activeCaptionTab, setActiveCaptionTab] = useState<'cap1' | 'cap2'>('cap1');

  if (!isOpen) return null;

  // Helper to render hidden DOM elements into base64 images via html2canvas
  const renderSlideToDataUrl = async (index: number): Promise<string> => {
    const element = document.getElementById(`export-hidden-slide-${index}`);
    if (!element) throw new Error(`Element export-hidden-slide-${index} not found`);

    const canvas = await html2canvas(element, {
      scale: 3, // High resolution output
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });
    return canvas.toDataURL('image/png', 1.0);
  };

  // Export 1: Individual PNG Images Download
  const handleExportPNGs = async () => {
    setIsExporting(true);
    setExportProgress(10);
    try {
      for (let i = 0; i < slides.length; i++) {
        setExportProgress(Math.round(((i + 1) / slides.length) * 90));
        const dataUrl = await renderSlideToDataUrl(i);

        const link = document.createElement('a');
        link.download = `carrossel-3x4-slide-${i + 1}.png`;
        link.href = dataUrl;
        link.click();
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    } catch (err) {
      console.error('Error exporting PNGs:', err);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  // Export 2: Download ZIP Archive
  const handleExportZIP = async () => {
    setIsExporting(true);
    setExportProgress(10);
    try {
      const zip = new JSZip();
      const folder = zip.folder('carrossel-3x4-instagram');

      for (let i = 0; i < slides.length; i++) {
        setExportProgress(Math.round(((i + 1) / slides.length) * 80));
        const dataUrl = await renderSlideToDataUrl(i);
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
        folder?.file(`slide-${i + 1}.png`, base64Data, { base64: true });
      }

      setExportProgress(90);
      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `carrossel-instagram-3x4-${Date.now()}.zip`;
      link.click();
    } catch (err) {
      console.error('Error exporting ZIP:', err);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  // Export 3: LinkedIn PDF Document Exporter
  const handleExportPDF = async () => {
    setIsExporting(true);
    setExportProgress(10);
    try {
      // 3:4 ratio PDF dimensions in mm (1080x1440 ratio => 108mm x 144mm)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [108, 144],
      });

      for (let i = 0; i < slides.length; i++) {
        setExportProgress(Math.round(((i + 1) / slides.length) * 85));
        const dataUrl = await renderSlideToDataUrl(i);

        if (i > 0) pdf.addPage([108, 144], 'portrait');
        pdf.addImage(dataUrl, 'PNG', 0, 0, 108, 144);
      }

      setExportProgress(95);
      pdf.save(`carrossel-linkedin-presentation-${Date.now()}.pdf`);
    } catch (err) {
      console.error('Error exporting PDF:', err);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const activeCaptionText = activeCaptionTab === 'cap2' && caption2 ? caption2 : caption;

  const handleCopyCaption = () => {
    const fullText = `${activeCaptionText}\n\n${hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      {/* Hidden container for rendering high-res canvas exports */}
      <div className="fixed -left-[9999px] -top-[9999px] pointer-events-none opacity-0">
        {slides.map((s, idx) => (
          <div key={idx} id={`export-hidden-slide-${idx}`} className="w-[1080px] h-[1440px]">
            <CarouselCanvas
              slide={s}
              slideIndex={idx}
              totalSlides={slides.length}
              brand={brand}
              aspectRatio={aspectRatio}
              themeStyle={themeStyle}
              showSwipeIndicator={showSwipeIndicator}
              showSlideCounter={showSlideCounter}
              showBrandHandle={showBrandHandle}
              isExporting={true}
            />
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 my-auto">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Exportar Carrossel em Alta Qualidade (3:4)
              </h3>
              <p className="text-xs text-slate-400">
                Gere imagens PNG em alta resolução, pacotes ZIP ou PDFs para LinkedIn.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isExporting}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PROGRESS BAR IF EXPORTING */}
        {isExporting && (
          <div className="p-4 bg-slate-950 rounded-xl border border-indigo-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-400">
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Renderizando Slides em Alta
                Resolução...
              </span>
              <span>{exportProgress}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* EXPORT OPTIONS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* OPTION 1: ZIP BUNDLE */}
          <button
            onClick={handleExportZIP}
            disabled={isExporting}
            className="p-4 rounded-xl bg-slate-950 hover:bg-indigo-950/50 border border-slate-800 hover:border-indigo-500 text-left transition space-y-2 group"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-600/20 group-hover:bg-indigo-600 text-indigo-400 group-hover:text-white flex items-center justify-center transition">
              <FileArchive className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-indigo-300">
                Pacote ZIP
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Todos os {slides.length} slides organizados em arquivo compactado.
              </p>
            </div>
          </button>

          {/* OPTION 2: PDF DOCUMENT FOR LINKEDIN */}
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="p-4 rounded-xl bg-slate-950 hover:bg-indigo-950/50 border border-slate-800 hover:border-indigo-500 text-left transition space-y-2 group"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-600/20 group-hover:bg-purple-600 text-purple-400 group-hover:text-white flex items-center justify-center transition">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-purple-300">
                PDF para LinkedIn
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Ideal para postagens em carrossel de documento no LinkedIn.
              </p>
            </div>
          </button>

          {/* OPTION 3: INDIVIDUAL PNGs */}
          <button
            onClick={handleExportPNGs}
            disabled={isExporting}
            className="p-4 rounded-xl bg-slate-950 hover:bg-indigo-950/50 border border-slate-800 hover:border-indigo-500 text-left transition space-y-2 group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-600/20 group-hover:bg-emerald-600 text-emerald-400 group-hover:text-white flex items-center justify-center transition">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-emerald-300">
                Imagens PNG
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Download direto das imagens no seu navegador.
              </p>
            </div>
          </button>
        </div>

        {/* CAPTION & HASHTAGS QUICK COPY AREA */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-indigo-400" />
              Legendas Prontas (2 Opções) & Hashtags
            </span>
            <button
              onClick={handleCopyCaption}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition"
            >
              {copiedCaption ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copiar Opção {activeCaptionTab === 'cap1' ? '1' : '2'}
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveCaptionTab('cap1')}
              className={`py-1.5 px-2 rounded-md font-bold text-xs transition ${
                activeCaptionTab === 'cap1'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Option 1: Direta & Persuasiva
            </button>
            <button
              onClick={() => setActiveCaptionTab('cap2')}
              className={`py-1.5 px-2 rounded-md font-bold text-xs transition ${
                activeCaptionTab === 'cap2'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Option 2: Storytelling & Engajamento
            </button>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg text-xs text-slate-300 font-mono max-h-32 overflow-y-auto whitespace-pre-wrap border border-slate-800">
            {activeCaptionText}
            {'\n\n'}
            {hashtags.join(' ')}
          </div>
        </div>
      </div>
    </div>
  );
};
