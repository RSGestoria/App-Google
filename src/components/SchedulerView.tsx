import React, { useState } from 'react';
import { ScheduledPost, CarouselProject, BrandProfile } from '../types';
import {
  Calendar as CalendarIcon,
  Clock,
  Instagram,
  Linkedin,
  Video,
  Pin,
  Plus,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Trash2,
  Send,
  Sparkles,
} from 'lucide-react';

interface SchedulerViewProps {
  currentProject: CarouselProject;
  brand: BrandProfile;
}

export const SchedulerView: React.FC<SchedulerViewProps> = ({ currentProject, brand }) => {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([
    {
      id: 'sched-1',
      projectId: currentProject.id,
      projectTitle: '5 Erros que Matam suas Vendas no Instagram',
      scheduledDate: '2026-07-29',
      scheduledTime: '18:00',
      platforms: ['instagram', 'linkedin'],
      status: 'scheduled',
      thumbnailSlide: currentProject.slides[0] || {
        id: 's1',
        layout: 'cover',
        title: '5 Erros de Vendas no Instagram',
        badgeText: 'AGENDADO',
      },
      caption: currentProject.caption || 'Confira os 5 erros mais comuns...',
      hashtags: currentProject.hashtags || ['#instagram', '#vendas'],
      brandHandle: brand.handle || '@seuperfil',
    },
    {
      id: 'sched-2',
      projectId: 'proj-old',
      projectTitle: 'Guia do Carrossel 3:4 Perfeito',
      scheduledDate: '2026-07-27',
      scheduledTime: '12:30',
      platforms: ['instagram', 'linkedin', 'tiktok'],
      status: 'published',
      thumbnailSlide: {
        id: 's2',
        layout: 'cover',
        title: 'Guia do Carrossel 3:4',
        badgeText: 'PUBLICADO',
      },
      caption: 'Aprenda a criar carrosséis de alta retenção...',
      hashtags: ['#design', '#carrossel'],
      brandHandle: brand.handle || '@seuperfil',
    },
  ]);

  const [selectedPlatforms, setSelectedPlatforms] = useState<
    ('instagram' | 'linkedin' | 'tiktok' | 'pinterest')[]
  >(['instagram', 'linkedin']);
  const [scheduleDate, setScheduleDate] = useState('2026-07-30');
  const [scheduleTime, setScheduleTime] = useState('19:30');
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'published'>('all');

  const togglePlatform = (p: 'instagram' | 'linkedin' | 'tiktok' | 'pinterest') => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter((item) => item !== p));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const handleScheduleCurrentProject = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost: ScheduledPost = {
      id: `sched-${Date.now()}`,
      projectId: currentProject.id,
      projectTitle: currentProject.title || 'Carrossel Sem Título',
      scheduledDate: scheduleDate,
      scheduledTime: scheduleTime,
      platforms: selectedPlatforms,
      status: 'scheduled',
      thumbnailSlide: currentProject.slides[0],
      caption: currentProject.caption,
      hashtags: currentProject.hashtags,
      brandHandle: brand.handle || '@seuperfil',
    };

    setScheduledPosts([newPost, ...scheduledPosts]);
    alert('Publicação agendada com sucesso!');
  };

  const deletePost = (id: string) => {
    setScheduledPosts(scheduledPosts.filter((p) => p.id !== id));
  };

  const filteredPosts = scheduledPosts.filter((p) => {
    if (statusFilter === 'all') return true;
    return p.status === statusFilter;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-indigo-400" />
            Agendador Multiredes & Planejador de Conteúdo
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Agende seus carrosséis 3:4 para Instagram, LinkedIn, TikTok e Pinterest no melhor horário.
          </p>
        </div>

        {/* STATUS FILTER TABS */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {(['all', 'scheduled', 'published'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold capitalize transition ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st === 'all' ? 'Todos' : st === 'scheduled' ? 'Agendados' : 'Publicados'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT FORM: SCHEDULE CURRENT CAROUSEL */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Agendar Carrossel Ativo
            </h3>
            <p className="text-xs text-slate-400">
              Configurações para o carrossel "{currentProject.title || 'Ativo'}".
            </p>
          </div>

          <form onSubmit={handleScheduleCurrentProject} className="space-y-4">
            {/* PLATFORM SELECTOR MULTI-SELECT */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Redes Sociais de Destino
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'instagram', label: 'Instagram (3:4)', icon: Instagram, color: 'text-pink-400' },
                  { id: 'linkedin', label: 'LinkedIn (PDF)', icon: Linkedin, color: 'text-blue-400' },
                  { id: 'tiktok', label: 'TikTok Feed', icon: Video, color: 'text-cyan-400' },
                  { id: 'pinterest', label: 'Pinterest Pins', icon: Pin, color: 'text-rose-400' },
                ].map((plat) => {
                  const IconComp = plat.icon;
                  const isSelected = selectedPlatforms.includes(
                    plat.id as 'instagram' | 'linkedin' | 'tiktok' | 'pinterest'
                  );
                  return (
                    <button
                      type="button"
                      key={plat.id}
                      onClick={() =>
                        togglePlatform(
                          plat.id as 'instagram' | 'linkedin' | 'tiktok' | 'pinterest'
                        )
                      }
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-950/60 text-white shadow-sm'
                          : 'border-slate-800 bg-slate-950 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <IconComp className={`w-4 h-4 ${plat.color}`} />
                      <span>{plat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DATE & TIME INPUTS */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <CalendarIcon className="w-3.5 h-3.5 text-indigo-400" /> Data de Publicação
                </label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" /> Horário
                </label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
            </div>

            {/* PREVIEW SUMMARY */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Resumo do Agendamento
              </span>
              <p className="text-slate-200 font-semibold">
                {currentProject.slides.length} slides em {selectedPlatforms.length} redes selecionadas.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-md shadow-indigo-600/20"
            >
              <Send className="w-4 h-4" /> Confirmar Agendamento no Calendário
            </button>
          </form>
        </div>

        {/* RIGHT QUEUE LIST */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-bold text-slate-200">
            Fila de Publicações Programadas ({filteredPosts.length})
          </h3>

          {filteredPosts.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 space-y-2">
              <CalendarIcon className="w-8 h-8 mx-auto opacity-40 text-indigo-400" />
              <p className="text-xs font-semibold">Nenhuma publicação agendada neste filtro.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4 hover:border-slate-700 transition"
                >
                  <div className="flex items-center gap-3">
                    {/* Thumbnail preview */}
                    <div className="w-12 h-16 bg-slate-950 rounded-lg border border-slate-800 p-1 flex flex-col justify-between shrink-0 overflow-hidden">
                      <span className="text-[8px] font-bold text-indigo-400 truncate">
                        {post.thumbnailSlide?.badgeText || '3:4'}
                      </span>
                      <span className="text-[9px] font-extrabold text-white line-clamp-2 leading-none">
                        {post.thumbnailSlide?.title}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{post.projectTitle}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            post.status === 'published'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                          }`}
                        >
                          {post.status === 'published' ? 'Publicado' : 'Agendado'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1 font-mono">
                          <CalendarIcon className="w-3.5 h-3.5 text-indigo-400" />
                          {post.scheduledDate} às {post.scheduledTime}
                        </span>
                        <span className="text-slate-600">|</span>
                        <span className="text-slate-300 font-semibold">{post.brandHandle}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deletePost(post.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                    title="Cancelar / Remover Post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
