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
                <div className="mb-14 -mt-4">
                     <img 
                        src="https://media.beefree.cloud/pub/bfra/6x2ega8t/ag2/40v/gt6/Vetor%20Motoeste%20%C2%AE%20Black.svg" 
                        alt="Motoeste Logo" 
                        className="h-8 w-auto dark:hidden"
                        referrerPolicy="no-referrer"
                     />
                     <img 
                        src="https://media.beefree.cloud/pub/bfra/6x2ega8t/vn3/f6x/9oi/Vetor%20Motoeste%20%C2%AE.svg" 
                        alt="Motoeste Logo" 
                        className="h-8 w-auto hidden dark:block"
                        referrerPolicy="no-referrer"
                     />
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-red-600 dark:text-red-500 tracking-tight mb-3">
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
                    © 2026 Grupo Motoeste | Sistema para Gestão de Marketing.
                </p>
            </div>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex w-1/2 bg-slate-950 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
            <img 
                src="https://media.beefree.cloud/pub/bfra/6x2ega8t/v02/7ki/fdv/banner%20login.png" 
                alt="Motorcycle Background" 
                className="w-full h-full object-cover opacity-50"
            />
            {/* Clean gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-start p-16 h-full text-white text-left">
            {/* Top Right Icons */}
            <div className="absolute top-12 right-12 opacity-40">
                <div className="flex gap-4">
                    <Bike size={24} />
                    <div className="w-px h-6 bg-white/30" />
                    <Car size={24} />
                </div>
            </div>
            
            <div className="max-w-lg space-y-8 flex flex-col items-start animate-fade-in">
                {/* Icon - Glassmorphism */}
                <div className="w-14 h-14 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl flex items-center justify-center mb-2">
                    <CheckCircle2 size={28} className="text-white/90" />
                </div>

                <h2 className="text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white">
                    Gestão unificada <br />
                    <span className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent font-normal">Motos & Carros</span>
                </h2>
                
                <p className="text-slate-400 text-lg leading-relaxed font-light max-w-md">
                    Centralize suas campanhas, calendário e relatórios em uma única plataforma intuitiva e eficiente.
                </p>
                
                {/* Features - Clean List */}
                <div className="flex flex-col gap-3 pt-4">
                    <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                        Marketing Digital
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                        Social Media Analytics
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                        Relatórios em Tempo Real
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};