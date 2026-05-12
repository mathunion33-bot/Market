import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, ShoppingBag, ClipboardList, User, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { cart, isAdmin } = useApp();
  
  const tabs = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'orders', icon: ClipboardList, label: 'Pedidos' },
    { id: 'cart', icon: ShoppingBag, label: 'Carrinho', badge: cart.length },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  if (isAdmin) {
    tabs.splice(1, 0, { id: 'admin', icon: ShieldCheck, label: 'Admin' });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-slate-200 px-2 pb-8 pt-3 max-w-md mx-auto shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
      <div className="flex justify-between items-center px-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative flex flex-col items-center gap-1.5 p-2 min-w-[64px] transition-all",
              activeTab === tab.id ? "text-emerald-600 scale-110" : "text-slate-400 opacity-60 hover:opacity-100"
            )}
          >
            <div className={cn(
              "p-2 rounded-xl transition-all",
              activeTab === tab.id ? "bg-emerald-50" : "bg-transparent"
            )}>
              <tab.icon size={20} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
            
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute -top-3 w-8 h-1.5 bg-emerald-600 rounded-full"
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
              />
            )}
            
            {tab.badge ? (
              <span className="absolute top-2 right-3 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[10px] font-black text-white shadow-lg">
                {tab.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </nav>
  );
}
