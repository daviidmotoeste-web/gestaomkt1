import React, { useState, useEffect } from 'react';
import { useApp } from '../context';
import { useNavigate } from 'react-router-dom';
import { Bike, Car, ArrowRight, Mail, CheckCircle2, ShieldCheck } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('Login component mounted');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.includes('@') || !email.includes('.')) {
        setError('Por favor, insira um e-mail válido.');
        return;
    }

    setLoading(true);
    
    try {
        const success = await login(email);
        if (success) {
            navigate('/');
        } else {
            setError('Não foi possível conectar. Verifique suas credenciais.');
        }
    } catch (err) {
        setError('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-white dark:bg-slate-900">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 relative z-10">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
            
            {/* Header */}
            <div className="text-left">
                <div className="flex items-center justify-start gap-2 mb-6">
                     <div className="bg-red-600 p-2 rounded-lg text-white">
                        <Bike size={24} />
                     </div>
                     <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Motoeste</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                    Bem-vindo de volta
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg">
                    Acesse o painel de gestão de marketing.
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl flex items-center justify-start gap-3 text-red-600 dark:text-red-400 animate-slide-up">
                    <ShieldCheck size={20} />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 text-left ml-1">
                        E-mail Corporativo
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                        </div>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                            placeholder="nome@motoeste.com.br"
                            required
                            autoFocus
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Verificando...
                        </span>
                    ) : (
                        <>
                            Acessar Painel
                            <ArrowRight size={20} />
                        </>
                    )}
                </button>
            </form>

            {/* Footer */}
            <div className="pt-8 text-left">
                <p className="text-xs text-slate-400 dark:text-slate-500">
                    © 2026 Grupo Motoeste. Sistema interno de gestão.
                </p>
            </div>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
            <img 
                src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop" 
                alt="Motorcycle Background" 
                className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/90 to-red-900/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-start p-16 h-full text-white text-left">
            <div className="absolute top-12 right-12">
                <div className="flex gap-4 opacity-50">
                    <Bike size={32} />
                    <div className="w-px h-8 bg-white/20" />
                    <Car size={32} />
                </div>
            </div>
            
            <div className="max-w-lg space-y-6 flex flex-col items-start">
                <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-red-900/20 animate-scale-in">
                    <CheckCircle2 size={32} className="text-white" />
                </div>
                <h2 className="text-4xl font-bold leading-tight">
                    Gestão unificada para <span className="text-red-500">Motos</span> e <span className="text-blue-400">Carros</span>.
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed">
                    Acompanhe campanhas, gerencie o calendário de conteúdo e visualize relatórios de desempenho em um só lugar.
                </p>
                
                {/* Stats/Features Pills */}
                <div className="flex gap-3 pt-4">
                    <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium border border-white/10">
                        Marketing
                    </div>
                    <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium border border-white/10">
                        Social Media
                    </div>
                    <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium border border-white/10">
                        Analytics
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};