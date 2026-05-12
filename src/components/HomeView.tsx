import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../constants';
import { ProductCard } from './ProductCard';
import { Search, Bell, Sparkles, Filter } from 'lucide-react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { cn } from '../lib/utils';

export function HomeView() {
  const { products, profile } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [showRecurringHint, setShowRecurringHint] = useState(false);

  const featuredProduct = products.find(p => p.featured) || products.find(p => p.popular);

  const filteredProducts = products.filter(p => {
    if (!selectedCategory) return p.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Check if the product's category matches either the category ID or the category Name
    const targetCat = CATEGORIES.find(c => c.id === selectedCategory);
    const pCat = (p.category || '').toLowerCase();
    
    const matchesCategory = pCat === selectedCategory.toLowerCase() || 
                            (targetCat && pCat === targetCat.name.toLowerCase());
                            
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const popularProducts = products.filter(p => p.popular).slice(0, 4);

  return (
    <div className="flex flex-col gap-6 pb-24 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center px-6 pt-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Olá, {profile?.displayName?.split(' ')[0] || 'Usuário'}! 👋</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">O que vamos pedir hoje?</p>
        </div>
        <div className="flex gap-2">
          <button className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm text-slate-500 hover:text-emerald-600 transition-colors">
            <Bell size={20} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Buscar snacks, bebidas..."
            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm placeholder:text-slate-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Hero Bento Section */}
      {!searchTerm && !selectedCategory && featuredProduct && (
        <div className="px-6 grid grid-cols-1 gap-4">
          {/* Main Banner */}
          <div className="bg-emerald-600 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg shadow-emerald-600/20">
            <div className="relative z-10 flex flex-col items-start">
              <span className="bg-emerald-500/50 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                <Sparkles size={12} /> Oferta em Destaque
              </span>
              <h2 className="text-2xl font-black mt-4 leading-tight">{featuredProduct.name}</h2>
              {featuredProduct.description && (
                <p className="text-emerald-100 mt-1 text-sm font-medium opacity-80 line-clamp-2">{featuredProduct.description}</p>
              )}
              <button 
                onClick={() => {
                  setSearchTerm(featuredProduct.name);
                }}
                className="mt-6 bg-white text-emerald-700 font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest active:scale-95 transition-transform"
              >
                Comprar agora
              </button>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] w-48 h-48 bg-emerald-500 rounded-full blur-3xl opacity-50"></div>
            {featuredProduct.image && (
              <img src={featuredProduct.image} alt={featuredProduct.name} className="absolute right-[-10px] bottom-[-10px] w-32 h-32 object-contain opacity-40 mix-blend-overlay rotate-12" />
            )}
          </div>
        </div>
      )}

      {/* Categories Bento Row */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center px-6">
          <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Categorias</h3>
        </div>
        <div className="flex gap-3 overflow-x-auto px-6 py-2 no-scrollbar">
          <button 
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all whitespace-nowrap font-bold text-sm",
              selectedCategory === null 
                ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20" 
                : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
            )}
          >
            <Icons.LayoutGrid size={18} />
            Todos
          </button>
          {CATEGORIES.map((cat) => {
            const Icon = (Icons as any)[cat.icon] || Icons.HelpCircle;
            return (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all whitespace-nowrap font-bold text-sm",
                  selectedCategory === cat.id 
                    ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20" 
                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                )}
              >
                <Icon size={18} />
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of items */}
      <div className="flex flex-col gap-4 px-6">
        <div className="flex justify-between items-center">
          <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">
            {selectedCategory ? CATEGORIES.find(c => c.id === selectedCategory)?.name : 'Produtos em destaque'}
          </h3>
          <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Ver tudo</button>
        </div>
        
        {filteredProducts.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center gap-4 bg-white rounded-3xl border border-slate-200 border-dashed">
            <Icons.Ghost size={48} className="text-slate-100" />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Nenhum produto encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((p) => (
              <div key={p.id} className="animate-in zoom-in-95 duration-300">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recurring Order Promo (Bento Style) */}
      {!searchTerm && !selectedCategory && (
        <div className="px-6 mb-4">
          <div className="bg-slate-900 rounded-3xl p-6 text-white flex flex-col shadow-xl shadow-slate-900/10">
            <div className="bg-emerald-500/20 text-emerald-400 p-3 rounded-2xl w-fit mb-4 border border-emerald-500/10">
              <Icons.RefreshCw size={24} />
            </div>
            <h3 className="text-xl font-black mb-2 tracking-tight">Pedido Recorrente</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">Repita seu pedido favorito automaticamente toda segunda-feira e nunca fique sem snacks.</p>
            {showRecurringHint ? (
              <div className="mt-6 bg-emerald-500/10 border border-emerald-500/20 px-4 py-4 rounded-xl animate-in fade-in slide-in-from-bottom-2">
                <p className="text-emerald-400 text-sm font-bold text-center leading-relaxed">
                  Adicione os produtos que deseja ao carrinho e ative a opção "Assinatura Semanal" na tela de pagamento.
                </p>
              </div>
            ) : (
              <button 
                onClick={() => setShowRecurringHint(true)}
                className="mt-6 w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95"
              >
                Configurar Agora
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
