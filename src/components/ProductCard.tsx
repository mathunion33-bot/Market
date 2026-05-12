import React from 'react';
import { Product } from '../types';
import { Plus, ShoppingCart, TrendingDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, cn } from '../lib/utils';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useApp();
  
  const discount = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col h-full bento-card-hover"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
          referrerPolicy="no-referrer"
        />
        {discount && (
          <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full flex items-center justify-center gap-1 shadow-lg shadow-emerald-600/20">
            -{discount}%
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <div className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mb-1">{product.category}</div>
        <h3 className={cn("text-sm font-bold text-slate-800 line-clamp-1 h-5 tracking-tight", !product.description && "mb-2")}>{product.name}</h3>
        {product.description && (
          <p className="text-xs text-slate-500 line-clamp-2 h-8 leading-tight mb-2">{product.description}</p>
        )}
        
        <div className="mt-auto">
          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="text-lg font-black text-slate-900">
              {product.priceMax 
                ? `${formatCurrency(product.price)} - ${formatCurrency(product.priceMax)}`
                : formatCurrency(product.price)
              }
            </span>
            {product.oldPrice && !product.priceMax && (
              <span className="text-xs text-slate-400 line-through font-medium">{formatCurrency(product.oldPrice)}</span>
            )}
          </div>
          
          <button
            onClick={() => addToCart(product)}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-slate-900/10"
          >
            <Plus size={16} strokeWidth={3} />
            <span className="text-xs uppercase tracking-widest">Adicionar</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
