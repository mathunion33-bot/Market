import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Chrome, LayoutGrid, Mail, Lock, User, MapPin } from 'lucide-react';

export function LoginView() {
  const { loginWithGoogle, loginAnonymously, loginWithEmail, signUpWithEmail } = useApp();
  
  const [mode, setMode] = useState<'options' | 'login' | 'signup'>('options');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await loginWithEmail(email, password);
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signUpWithEmail(email, password, name, address);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 selection:bg-emerald-400 selection:text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-5 pointer-events-none">
        <LayoutGrid size={600} className="absolute -top-40 -left-40 rotate-12 text-slate-900" />
        <ShoppingBag size={400} className="absolute -bottom-40 -right-40 -rotate-12 text-emerald-600" />
      </div>

      <div className="w-full max-w-sm flex flex-col gap-10 relative z-10">
        <div className="flex flex-col items-center gap-6">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="w-24 h-24 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-600/30"
          >
            <ShoppingBag size={48} className="text-white" />
          </motion.div>
          
          <div className="text-center flex flex-col gap-2">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-black tracking-tighter text-slate-900"
            >
              Office Market
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-slate-400 text-sm font-bold uppercase tracking-widest"
            >
              Conveniência Premium
            </motion.p>
          </div>
        </div>

        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-4"
        >
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col gap-4 overflow-hidden relative min-h-[300px]">
            <AnimatePresence mode="wait">
              {mode === 'options' && (
                <motion.div 
                  key="options"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex flex-col gap-4 w-full"
                >
                  <p className="text-center text-sm font-medium text-slate-500 leading-relaxed mb-2">
                    Economize tempo e dinheiro com snacks e bebidas entregues na sua mesa.
                  </p>
                  
                  <button 
                    onClick={() => setMode('login')}
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-900/10 flex items-center justify-center gap-4 hover:bg-slate-800 active:scale-95 transition-all"
                  >
                    <Mail size={20} className="text-slate-400" />
                    <span className="uppercase text-xs tracking-widest">Entrar com E-mail</span>
                  </button>

                  <button 
                    onClick={loginWithGoogle}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-4 hover:bg-slate-100 active:scale-95 transition-all"
                  >
                    <Chrome size={20} className="text-slate-500" />
                    <span className="uppercase text-xs tracking-widest">Google</span>
                  </button>
                  <button 
                    onClick={loginAnonymously}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-4 hover:bg-slate-100 active:scale-95 transition-all"
                  >
                    <span className="uppercase text-xs tracking-widest">Visitante</span>
                  </button>

                  <div className="mt-2 text-center">
                    <button 
                      onClick={() => setMode('signup')}
                      className="text-emerald-600 text-xs font-bold uppercase tracking-widest hover:text-emerald-500"
                    >
                      Criar uma conta
                    </button>
                  </div>
                </motion.div>
              )}

              {mode === 'login' && (
                <motion.form 
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleLogin}
                  className="flex flex-col gap-4 w-full"
                >
                  <div className="flex flex-col gap-2">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="email"
                        required
                        placeholder="Seu e-mail"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="password"
                        required
                        placeholder="Sua senha"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-4 hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-70"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <span className="uppercase text-xs tracking-widest">Entrar</span>
                    )}
                  </button>

                  <div className="mt-2 text-center">
                    <button 
                      type="button"
                      onClick={() => setMode('options')}
                      className="text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-slate-600"
                    >
                      Voltar
                    </button>
                  </div>
                </motion.form>
              )}

              {mode === 'signup' && (
                <motion.form 
                  key="signup"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleSignup}
                  className="flex flex-col gap-3 w-full"
                >
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="text"
                      required
                      placeholder="Nome completo"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="email"
                      required
                      placeholder="E-mail"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="text"
                      required
                      placeholder="Andar / Setor (Endereço)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="password"
                      required
                      placeholder="Senha (mín 6 carac.)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                      value={password}
                      minLength={6}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-4 hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-70"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <span className="uppercase text-xs tracking-widest">Criar Conta</span>
                    )}
                  </button>

                  <div className="mt-1 text-center">
                    <button 
                      type="button"
                      onClick={() => setMode('options')}
                      className="text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-slate-600"
                    >
                      Voltar
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
          
          <p className="text-[10px] text-slate-300 text-center font-bold uppercase tracking-widest">
            Unidade São Paulo • 4º ao 8º Andar
          </p>
        </motion.div>
      </div>
    </div>
  );
}
