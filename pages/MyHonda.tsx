import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context';
import { Megaphone, Users, CalendarClock, ArrowRight, X, Save, Trash2, ChevronDown, LayoutList, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Status, MyHondaCampaign, Area } from '../types';
import { DatePicker } from '../components/DatePicker';

export const MyHondaCampaigns: React.FC = () => {
  const { core, campaigns, addCampaign, updateCampaign, deleteCampaign, user } = useApp();
  const coreCampaigns = campaigns.filter(c => c.core === core);
  
  const accentColor = core === 'MOTOS' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400';
  const buttonClass = core === 'MOTOS' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700';
  const textClass = core === 'MOTOS' ? 'text-red-600' : 'text-blue-600';

  // View Mode State
  const [viewMode, setViewMode] = useState<'LIST' | 'CALENDAR'>('LIST');
  const [viewDate, setViewDate] = useState(new Date());

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Accordion State
  const [expandedMonths, setExpandedMonths] = useState<string[]>([]);

  // Form Fields
  const [title, setTitle] = useState('');
  const [area, setArea] = useState<Area>(Area.VENDAS);
  const [targetAudience, setTargetAudience] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState<MyHondaCampaign['type']>('Promocional');
  const [status, setStatus] = useState<Status>(Status.PLANEJADO);
  const [responsible, setResponsible] = useState(user?.name || '');

  // Helper to get current month key "YYYY-MM"
  const getCurrentMonthKey = () => {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  // Set initial expanded state to current month only
  useEffect(() => {
      setExpandedMonths([getCurrentMonthKey()]);
  }, []);

  const toggleMonth = (monthKey: string) => {
      setExpandedMonths(prev => 
        prev.includes(monthKey) 
            ? prev.filter(k => k !== monthKey) 
            : [...prev, monthKey]
      );
  };

  // --- CALENDAR LOGIC (View Mode) ---
  const calendarData = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];
    
    // Prev Month Padding
    for (let i = firstDay - 1; i >= 0; i--) {
        const d = new Date(year, month - 1, daysInPrevMonth - i);
        days.push({
            date: d,
            day: daysInPrevMonth - i,
            isCurrentMonth: false,
            dateStr: d.toISOString().split('T')[0]
        });
    }

    // Current Month
    for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(year, month, i);
        days.push({
            date: d,
            day: i,
            isCurrentMonth: true,
            dateStr: d.toISOString().split('T')[0]
        });
    }

    // Next Month Padding
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
        const d = new Date(year, month + 1, i);
        days.push({
            date: d,
            day: i,
            isCurrentMonth: false,
            dateStr: d.toISOString().split('T')[0]
        });
    }

    return days;
  }, [viewDate]);

  const goToPrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const goToNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  const goToToday = () => setViewDate(new Date());

  const monthName = viewDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  const capitalizedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  // Group campaigns by Month/Year (For List View)
  const groupedCampaigns = useMemo(() => {
    const groups: Record<string, MyHondaCampaign[]> = {};

    coreCampaigns.forEach(campaign => {
        const date = new Date(campaign.startDate);
        // Create a sortable key: YYYY-MM
        const sortKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!groups[sortKey]) {
            groups[sortKey] = [];
        }
        groups[sortKey].push(campaign);
    });

    // Sort keys descending (newest first) and map to display structure
    return Object.keys(groups).sort((a, b) => b.localeCompare(a)).map(key => {
        const [year, month] = key.split('-');
        const dateObj = new Date(parseInt(year), parseInt(month) - 1);
        const monthName = dateObj.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
        
        return {
            id: key,
            title: monthName.charAt(0).toUpperCase() + monthName.slice(1),
            items: groups[key]
        };
    });
  }, [coreCampaigns]);

  const handleOpenForm = (campaign?: MyHondaCampaign) => {
      if (campaign) {
          setEditingId(campaign.id);
          setTitle(campaign.title);
          setArea(campaign.area);
          setTargetAudience(campaign.targetAudience);
          setStartDate(campaign.startDate);
          setEndDate(campaign.endDate);
          setType(campaign.type);
          setStatus(campaign.status);
          setResponsible(campaign.responsible);
      } else {
          setEditingId(null);
          setTitle('');
          setArea(Area.VENDAS);
          setTargetAudience('');
          setStartDate('');
          setEndDate('');
          setType('Promocional');
          setStatus(Status.PLANEJADO);
          setResponsible(user?.name || '');
      }
      setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const payload: MyHondaCampaign = {
          id: editingId || Date.now().toString(),
          core,
          title,
          area,
          targetAudience,
          startDate,
          endDate,
          type,
          status,
          responsible
      };

      if (editingId) {
          updateCampaign(payload);
          alert('Campanha atualizada!');
      } else {
          addCampaign(payload);
          alert('Campanha criada!');
          
          // Auto expand the month of the new campaign
          const date = new Date(startDate);
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          if (!expandedMonths.includes(key)) {
              setExpandedMonths(prev => [...prev, key]);
          }
      }
      setIsFormOpen(false);
  };

  const handleDelete = () => {
      if (editingId && window.confirm('Tem certeza que deseja excluir esta campanha?')) {
          deleteCampaign(editingId);
          setIsFormOpen(false);
      }
  };

  return (
    <div className="space-y-6 relative h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
         <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                Gestão de Campanhas <span className={`${accentColor}`}>MyHonda</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400">Controle de disparos e réguas de relacionamento.</p>
         </div>
         <div className="flex gap-3">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1 flex">
                 <button 
                    onClick={() => setViewMode('LIST')}
                    className={`p-2 rounded flex items-center gap-2 text-sm font-medium transition-all ${viewMode === 'LIST' ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                 >
                    <LayoutList size={18} />
                    <span className="hidden md:inline">Lista</span>
                 </button>
                 <button 
                    onClick={() => setViewMode('CALENDAR')}
                    className={`p-2 rounded flex items-center gap-2 text-sm font-medium transition-all ${viewMode === 'CALENDAR' ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                 >
                    <CalendarIcon size={18} />
                    <span className="hidden md:inline">Calendário</span>
                 </button>
            </div>
             <button 
                onClick={() => handleOpenForm()}
                className={`px-4 py-2 text-white rounded-lg shadow-sm font-medium transition-colors ${buttonClass}`}
             >
                Nova Campanha
             </button>
         </div>
      </div>

      {/* --- LIST VIEW --- */}
      {viewMode === 'LIST' && (
          <div className="space-y-4 flex-1 overflow-y-auto pb-4">
          {groupedCampaigns.length > 0 ? (
            groupedCampaigns.map((group) => {
                const isExpanded = expandedMonths.includes(group.id);
                const isCurrentMonth = group.id === getCurrentMonthKey();

                return (
                    <div key={group.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300">
                        <button 
                            onClick={() => toggleMonth(group.id)}
                            className={`w-full flex items-center justify-between p-4 cursor-pointer transition-colors ${isExpanded ? 'bg-slate-50 dark:bg-slate-700/50' : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'}`}
                        >
                            <div className="flex items-center gap-3">
                                <h2 className={`text-lg font-bold ${isCurrentMonth ? accentColor : 'text-slate-700 dark:text-slate-200'}`}>
                                    {group.title}
                                </h2>
                                {isCurrentMonth && (
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300`}>
                                        Atual
                                    </span>
                                )}
                                <span className="text-xs text-slate-400 font-medium">({group.items.length} ações)</span>
                            </div>
                            <ChevronDown className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {isExpanded && (
                            <div className="p-4 grid grid-cols-1 gap-4 border-t border-slate-100 dark:border-slate-700 animate-slide-up">
                                {group.items.map(campaign => (
                                    <div 
                                        key={campaign.id} 
                                        onClick={() => handleOpenForm(campaign)}
                                        className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5 flex flex-col md:flex-row gap-6 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer group/card"
                                    >
                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover/card:scale-110 ${core === 'MOTOS' ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                            <Megaphone size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1 group-hover/card:text-blue-600 dark:group-hover/card:text-blue-400 transition-colors">{campaign.title}</h3>
                                                    <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 mb-3">
                                                        {campaign.type}
                                                    </span>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${campaign.status === Status.EM_ANDAMENTO ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                                                    {campaign.status}
                                                </span>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                                <div className="flex items-start gap-2">
                                                    <Users size={16} className="text-slate-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Público</p>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">{campaign.targetAudience}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <CalendarClock size={16} className="text-slate-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Período</p>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">{new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-[8px] font-bold text-slate-600 dark:text-slate-300 mt-0.5">{campaign.responsible.charAt(0)}</div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Criador</p>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">{campaign.responsible}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center md:border-l border-slate-100 dark:border-slate-700 md:pl-6">
                                            <button className="p-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                                                <ArrowRight size={24} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })
          ) : (
              <div className="text-center py-20 text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                  Nenhuma campanha encontrada para este núcleo.
              </div>
          )}
          </div>
      )}

      {/* --- CALENDAR VIEW --- */}
      {viewMode === 'CALENDAR' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col flex-1 animate-slide-up">
              {/* Calendar Header */}
              <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 shrink-0">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <CalendarIcon size={20} className={accentColor} />
                        {capitalizedMonthName}
                  </h2>
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 p-1">
                        <button onClick={goToPrevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded text-slate-600 dark:text-slate-300 transition-colors">
                            <ChevronLeft size={18} />
                        </button>
                        <button onClick={goToToday} className="px-3 py-1 text-xs font-bold uppercase hover:bg-slate-100 dark:hover:bg-slate-600 rounded text-slate-600 dark:text-slate-300 transition-colors">
                            Hoje
                        </button>
                        <button onClick={goToNextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded text-slate-600 dark:text-slate-300 transition-colors">
                            <ChevronRight size={18} />
                        </button>
                  </div>
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 shrink-0">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                    <div key={day} className="py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    {day}
                    </div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 auto-rows-fr flex-1 overflow-y-auto">
                {calendarData.map((cell, i) => {
                    // Check if campaign is active on this day
                    const dayCampaigns = coreCampaigns.filter(c => {
                        const start = c.startDate;
                        const end = c.endDate;
                        return cell.dateStr >= start && cell.dateStr <= end;
                    });
                    
                    const isToday = new Date().toISOString().split('T')[0] === cell.dateStr;

                    return (
                        <div key={i} className={`min-h-[100px] border-b border-r border-slate-100 dark:border-slate-700 p-2 relative transition-colors ${!cell.isCurrentMonth ? 'bg-slate-50/40 dark:bg-slate-800/40 text-slate-300 dark:text-slate-600' : 'bg-white dark:bg-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-700/50'}`}>
                             <div className="flex justify-between items-start mb-1">
                                <span className={`text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full 
                                    ${isToday 
                                        ? (core === 'MOTOS' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white') 
                                        : (cell.isCurrentMonth ? 'text-slate-700 dark:text-slate-300' : 'text-slate-300 dark:text-slate-600')
                                    }`}>
                                    {cell.day}
                                </span>
                             </div>

                             <div className="space-y-1 mt-1">
                                {dayCampaigns.map(camp => (
                                    <div 
                                        key={camp.id}
                                        onClick={(e) => { e.stopPropagation(); handleOpenForm(camp); }}
                                        className={`text-[10px] px-1.5 py-1 rounded truncate cursor-pointer shadow-sm hover:opacity-80 transition-all active:scale-95 ${core === 'MOTOS' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'}`}
                                        title={`${camp.title} (${new Date(camp.startDate).toLocaleDateString()} - ${new Date(camp.endDate).toLocaleDateString()})`}
                                    >
                                        {camp.title}
                                    </div>
                                ))}
                             </div>
                        </div>
                    );
                })}
              </div>
          </div>
      )}

      {/* Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
             <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in duration-200 border border-slate-200 dark:border-slate-700">
                 {/* Header */}
                 <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                            {editingId ? 'Editar Campanha' : 'Nova Campanha MyHonda'}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {editingId ? 'Gerenciar régua de relacionamento' : 'Criar novo disparo'} para <span className={`font-bold ${textClass}`}>{core}</span>
                        </p>
                    </div>
                    <button 
                        onClick={() => setIsFormOpen(false)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Título da Campanha</label>
                                <input 
                                    required
                                    type="text" 
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="Ex: Troca de Óleo Premiada"
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tipo de Disparo</label>
                                <select 
                                    value={type}
                                    onChange={e => setType(e.target.value as MyHondaCampaign['type'])}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                >
                                    <option value="Informativo">Informativo</option>
                                    <option value="Promocional">Promocional</option>
                                    <option value="Relacionamento">Relacionamento</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Área</label>
                                <select 
                                    value={area}
                                    onChange={e => setArea(e.target.value as Area)}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                >
                                     {Object.values(Area).map(a => (
                                        <option key={a} value={a}>{a}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <DatePicker 
                                    label="Data de Início"
                                    value={startDate}
                                    onChange={setStartDate}
                                    required
                                />
                            </div>

                            <div>
                                <DatePicker 
                                    label="Data de Término"
                                    value={endDate}
                                    onChange={setEndDate}
                                    required
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Público-Alvo</label>
                                <input 
                                    required
                                    type="text" 
                                    value={targetAudience}
                                    onChange={e => setTargetAudience(e.target.value)}
                                    placeholder="Ex: Clientes inativos há mais de 6 meses..."
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                                <select 
                                    value={status}
                                    onChange={e => setStatus(e.target.value as Status)}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                >
                                     {Object.values(Status).map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>

                             <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Responsável</label>
                                <input 
                                    required
                                    type="text" 
                                    value={responsible}
                                    onChange={e => setResponsible(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                />
                            </div>
                        </div>

                         <div className="flex justify-between pt-6 border-t border-slate-100 dark:border-slate-700">
                            <div>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="px-4 py-2 text-red-600 font-medium hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <Trash2 size={18} />
                                        Excluir
                                    </button>
                                )}
                            </div>
                            <div className="flex gap-4">
                                <button 
                                    type="button" 
                                    onClick={() => setIsFormOpen(false)}
                                    className="px-6 py-2 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className={`flex items-center gap-2 px-6 py-2 text-white font-bold rounded-lg shadow-sm transition-colors ${buttonClass}`}
                                >
                                    <Save size={18} />
                                    {editingId ? 'Salvar Alterações' : 'Criar Campanha'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
             </div>
        </div>
      )}
    </div>
  );
};