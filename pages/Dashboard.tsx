import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar, Megaphone, CheckCircle2, AlertCircle, Sparkles, MessageSquare, Image, Zap, FileText, Brain } from 'lucide-react';
import { Status, InstaStatus } from '../types';

export const Dashboard: React.FC = () => {
  const { core, events, posts, campaigns, reports } = useApp();
  const navigate = useNavigate();

  // Filter Data by Core
  const coreEvents = events.filter(e => e.core === core);
  const corePosts = posts.filter(p => p.core === core);
  const coreCampaigns = campaigns.filter(c => c.core === core);
  const coreReports = reports.filter(r => r.core === core);

  // Filter Upcoming Events (Today + 15 days)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const fifteenDaysFromNow = new Date(today);
  fifteenDaysFromNow.setDate(today.getDate() + 15);
  fifteenDaysFromNow.setHours(23, 59, 59, 999);

  const upcomingEvents = coreEvents.filter(event => {
    const eventDate = new Date(event.startDate);
    return eventDate >= today && eventDate <= fifteenDaysFromNow;
  }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  // KPIs
  const activeEventsCount = coreEvents.filter(e => e.status === Status.EM_ANDAMENTO).length;
  const plannedPostsCount = corePosts.filter(p => p.status === InstaStatus.CRIACAO || p.status === InstaStatus.IDEIA).length;
  const activeCampaignsCount = coreCampaigns.filter(c => c.status === Status.EM_ANDAMENTO).length;
  const reportsCount = coreReports.length;

  // Chart Data Preparation (More detailed trend data)
  const activityData = [
    { name: '01 Mar', posts: 2, eventos: 0, campanhas: 1 },
    { name: '05 Mar', posts: 5, eventos: 1, campanhas: 0 },
    { name: '10 Mar', posts: 3, eventos: 0, campanhas: 2 },
    { name: '15 Mar', posts: 7, eventos: 2, campanhas: 1 },
    { name: '20 Mar', posts: 4, eventos: 1, campanhas: 3 },
    { name: '25 Mar', posts: 9, eventos: 3, campanhas: 2 },
    { name: '30 Mar', posts: 6, eventos: 1, campanhas: 4 },
  ];

  const colorEvents = core === 'MOTOS' ? '#ef4444' : '#3b82f6'; // Red 500 : Blue 500
  const colorPosts = '#10b981'; // Emerald 500
  const colorCampaigns = '#f59e0b'; // Amber 500

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 animate-scale-in">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{label}</p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{entry.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const KPICard = ({ title, value, icon: Icon, colorClass, delay, path }: any) => (
    <div 
      onClick={() => path && navigate(path)}
      className={`bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-start justify-between hover:shadow-lg hover:scale-[1.02] transition-all duration-300 animate-slide-up cursor-pointer ${delay}`}
    >
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${colorClass} shadow-md`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Eventos Ativos" 
          value={activeEventsCount} 
          icon={Calendar} 
          colorClass={core === 'MOTOS' ? 'bg-red-500' : 'bg-blue-500'} 
          delay="delay-0"
          path="/events"
        />
        <KPICard 
          title="Posts em Produção" 
          value={plannedPostsCount} 
          icon={CheckCircle2} 
          colorClass="bg-emerald-500" 
          delay="delay-75"
          path="/instagram"
        />
        <KPICard 
          title="Campanhas MyHonda" 
          value={activeCampaignsCount} 
          icon={Megaphone} 
          colorClass="bg-amber-500" 
          delay="delay-100"
          path="/myhonda"
        />
        <KPICard 
          title="Relatórios (Mês)" 
          value={reportsCount} 
          icon={AlertCircle} 
          colorClass="bg-purple-500" 
          delay="delay-150"
          path="/reports"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 animate-slide-up delay-200 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Atividade de Marketing</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Volume de ações nos últimos 30 dias</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Live Data</span>
            </div>
          </div>
          
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colorPosts} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={colorPosts} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colorEvents} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={colorEvents} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCampaigns" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colorCampaigns} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={colorCampaigns} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-10" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 500}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 500}} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  align="right"
                  height={36} 
                  iconType="circle" 
                  wrapperStyle={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', paddingBottom: '20px' }}
                />
                <Area 
                  name="Instagram" 
                  type="monotone" 
                  dataKey="posts" 
                  stackId="1"
                  stroke={colorPosts} 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorPosts)" 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  animationDuration={1500} 
                />
                <Area 
                  name="Eventos" 
                  type="monotone" 
                  dataKey="eventos" 
                  stackId="1"
                  stroke={colorEvents} 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorEvents)" 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  animationDuration={1500} 
                  animationBegin={200}
                />
                <Area 
                  name="Campanhas" 
                  type="monotone" 
                  dataKey="campanhas" 
                  stackId="1"
                  stroke={colorCampaigns} 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorCampaigns)" 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  animationDuration={1500} 
                  animationBegin={400}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col animate-slide-up delay-300 hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Próximas Ações</h3>
          <div className="flex-1 overflow-y-auto pr-2 pb-2 space-y-2 max-h-[260px]">
            {upcomingEvents.map((event, index) => (
              <div 
                key={event.id} 
                className="flex gap-3 items-center p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-600 hover:scale-[1.02] cursor-default animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-base shadow-sm ${core === 'MOTOS' ? 'bg-red-50 text-red-600 dark:bg-red-900/50 dark:text-red-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'}`}>
                  {new Date(event.startDate).getDate()}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm line-clamp-1">{event.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{event.type} • {event.area}</p>
                </div>
                <span className={`ml-auto text-xs px-2 py-1 rounded-full font-medium ${event.status === Status.EM_ANDAMENTO ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                    {event.status === Status.EM_ANDAMENTO ? 'Ativo' : 'Plan'}
                </span>
              </div>
            ))}
            {upcomingEvents.length === 0 && (
                <div className="text-center py-10 text-slate-400 text-sm">Nenhum evento nos próximos 15 dias.</div>
            )}
          </div>
          <button 
            onClick={() => navigate('/events')}
            className={`mt-4 w-full py-2 rounded-lg text-sm font-medium border border-dashed hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 ${core === 'MOTOS' ? 'text-red-600 border-red-200 dark:border-red-900 dark:text-red-400' : 'text-blue-600 border-blue-200 dark:border-blue-900 dark:text-blue-400'}`}
          >
            Ver Calendário Completo
          </button>
        </div>
      </div>

      {/* AI Tools Section */}
      <div className="pt-8 border-t border-slate-100 dark:border-slate-800 animate-slide-up delay-500 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-5 flex items-center gap-2 relative z-10">
          <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <Sparkles className="text-amber-500" size={18} />
          </div>
          <span className="tracking-tight">Nossas plataformas de trabalho AI</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
          {[
            { name: 'Auto Design', suffix: 'By Motoeste', url: 'https://ai-autodesign.vercel.app/', icon: Zap, color: 'from-red-600 to-red-900', secondaryColor: 'bg-orange-500', glow: 'bg-red-600/20', border: 'group-hover:border-red-600/50', tint: 'hover:bg-red-600/[0.15]' },
            { name: 'ChatGPT', url: 'https://chat.openai.com', icon: MessageSquare, color: 'from-emerald-600 to-teal-500', secondaryColor: 'bg-cyan-400', glow: 'bg-emerald-500/20', border: 'group-hover:border-emerald-500/50', tint: 'hover:bg-emerald-500/[0.15]' },
            { name: 'Gemini', url: 'https://gemini.google.com', icon: Sparkles, color: 'from-blue-600 via-indigo-500 to-purple-500', secondaryColor: 'bg-pink-500', glow: 'bg-blue-500/20', border: 'group-hover:border-blue-500/50', tint: 'hover:bg-blue-500/[0.15]' },
            { name: 'Midjourney', url: 'https://www.midjourney.com', icon: Image, color: 'from-purple-600 to-pink-500', secondaryColor: 'bg-indigo-500', glow: 'bg-purple-500/20', border: 'group-hover:border-purple-500/50', tint: 'hover:bg-purple-500/[0.15]' },
            { name: 'Copy.ai', url: 'https://www.copy.ai', icon: FileText, color: 'from-slate-700 to-slate-900', secondaryColor: 'bg-blue-600', glow: 'bg-slate-500/20', border: 'group-hover:border-slate-500/50', tint: 'hover:bg-slate-500/[0.15]' },
            { name: 'Jasper', url: 'https://www.jasper.ai', icon: Brain, color: 'from-orange-600 to-red-500', secondaryColor: 'bg-yellow-400', glow: 'bg-orange-500/20', border: 'group-hover:border-orange-500/50', tint: 'hover:bg-orange-500/[0.15]' },
          ].map((tool: any, index) => (
            <a 
              key={index}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-4 transition-all duration-500 hover:-translate-y-1.5 overflow-hidden shadow-sm hover:shadow-xl ${tool.border} ${tool.tint}`}
            >
              {/* Animated Background Blobs - HIGH OPACITY & VIBRANT */}
              <div className={`absolute -right-4 -bottom-4 w-36 h-36 rounded-full blur-3xl opacity-60 group-hover:opacity-90 transition-all duration-700 bg-gradient-to-br ${tool.color}`} />
              <div className={`absolute -left-12 -top-12 w-28 h-28 rounded-full blur-3xl opacity-20 group-hover:opacity-50 transition-all duration-700 ${tool.secondaryColor}`} />
              
              {/* Icon Container */}
              <div className={`relative p-3.5 rounded-xl bg-gradient-to-br ${tool.color} text-white shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 flex-shrink-0`}>
                <tool.icon size={22} />
                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="flex flex-col flex-1 min-w-0 relative z-10">
                <div className="flex items-center justify-between gap-4 w-full">
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-sm tracking-tight group-hover:text-slate-900 dark:group-hover:text-white transition-colors truncate">
                    {tool.name}
                  </span>
                  {tool.suffix && (
                    <span className={`text-[9px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded bg-gradient-to-br ${tool.color} text-white shadow-sm whitespace-nowrap flex-shrink-0`}>
                      {tool.suffix}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`text-[10px] font-black uppercase tracking-widest bg-gradient-to-br ${tool.color} bg-clip-text text-transparent`}>
                    Ferramenta AI
                  </span>
                </div>
              </div>

              {/* Action Indicator */}
              <div className="ml-auto opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                <div className={`p-2 rounded-full ${tool.glow} text-slate-700 dark:text-slate-200 shadow-inner`}>
                   <Zap size={14} fill="currentColor" className="animate-pulse" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};