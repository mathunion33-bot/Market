import React from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { ShoppingBag, Chrome, LayoutGrid } from 'lucide-react';

export function LoginView() {
  const { loginWithGoogle, loginAnonymously } = useApp();

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
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col gap-4">
            <p className="text-center text-sm font-medium text-slate-500 leading-relaxed mb-2">
              Economize tempo e dinheiro com snacks e bebidas entregues na sua mesa.
            </p>
            
            <button 
              onClick={loginWithGoogle}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-900/10 flex items-center justify-center gap-4 hover:bg-slate-800 active:scale-95 transition-all"
            >
              <Chrome size={20} className="text-white" />
              <span className="uppercase text-xs tracking-widest">Entrar com Google</span>
            </button>
            <button 
              onClick={loginAnonymously}
              className="w-full bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl shadow-sm flex items-center justify-center gap-4 hover:bg-slate-200 active:scale-95 transition-all"
            >
              <span className="uppercase text-xs tracking-widest">Entrar como Visitante</span>
            </button>
          </div>
          
          <p className="text-[10px] text-slate-300 text-center font-bold uppercase tracking-widest">
            Unidade São Paulo • 4º ao 8º Andar
          </p>
        </motion.div>
      </div>
    </div>
  );
}
