import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, Plus, Minus, CreditCard, ChevronRight, ShoppingBag, Clock, ArrowRight, MapPin, Repeat, Copy, Check } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { cn } from '../lib/utils';
import { generatePixPayload } from '../lib/pix';

export function CartView({ onOrderSuccess, onGoToHome }: { onOrderSuccess: (orderId: string) => void, onGoToHome: () => void }) {
  const { cart, updateCartQuantity, removeFromCart, checkout, user, profile } = useApp();
  const [observation, setObservation] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isPixStep, setIsPixStep] = useState(false);
  const [completedTotal, setCompletedTotal] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  const subtotal = (cart || []).reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const deliveryFee = 0; // Internal delivery is free
  const total = subtotal + deliveryFee;

  const maxLeadTime = (cart || []).reduce((max, item) => Math.max(max, item.deliveryDays || 1), 1);

  const handleCheckoutClick = () => {
    setCompletedTotal(total);
    setIsPixStep(true);
  };

  const handleConfirmOrder = async () => {
    setIsCheckingOut(true);
    const orderId = await checkout(observation, isRecurring);
    if (orderId) {
      onOrderSuccess(orderId);
    }
    setIsCheckingOut(false);
    setIsPixStep(false);
  };

  const handleCopyPix = (payload: string) => {
    navigator.clipboard.writeText(payload);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (isPixStep) {
    const pixPayload = generatePixPayload('+5511941774380', 'OFFICE MARKET', 'SAO PAULO', completedTotal);
    const whatsappMsg = `Olá! Acabei de fazer o PIX no valor de ${formatCurrency(completedTotal)}. Segue meu comprovante!`;
    
    return (
      <div className="flex flex-col items-center justify-start py-4 px-6 text-center gap-8 animate-in zoom-in duration-500 pb-32">
        <div className="flex flex-col items-center gap-3 mt-4">
          <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-600 mb-2 border border-emerald-100 shadow-xl shadow-emerald-600/10">
            <CreditCard size={40} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Pagamento PIX</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Quase lá! Finalize sua compra</p>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 relative group transition-all hover:scale-[1.02]">
          <QRCodeSVG 
            value={pixPayload} 
            size={220}
            level="H"
            includeMargin
          />
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl whitespace-nowrap">
            {formatCurrency(completedTotal)}
          </div>
        </div>
        
        <div className="w-full flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-2 relative group w-full mb-2">
            <div className="flex items-center justify-between gap-3 text-[10px] font-black text-slate-500 bg-slate-100/80 border border-slate-200/60 p-4 rounded-2xl w-full">
              <span className="truncate break-all flex-1 text-left">{pixPayload}</span>
              <button
                onClick={() => handleCopyPix(pixPayload)}
                className="flex-shrink-0 bg-white shadow-sm border border-slate-200 text-slate-700 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                title="Copiar PIX"
              >
                {isCopied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
              </button>
            </div>
            {isCopied && (
              <span className="absolute -top-8 right-0 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg animate-in fade-in slide-in-from-bottom-2">
                Código copiado!
              </span>
            )}
          </div>
          
          <a 
            href={`https://wa.me/5511941774380?text=${encodeURIComponent(whatsappMsg)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] hover:bg-[#1ebd5c] text-white font-black py-4 rounded-2xl shadow-xl shadow-[#25D366]/20 active:scale-95 transition-all uppercase text-xs tracking-widest flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            Enviar Comprovante
          </a>
          
          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-100">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
              Após o pagamento, confirme o pedido:
            </span>
            <button 
              onClick={handleConfirmOrder}
              disabled={isCheckingOut}
              className={cn(
                "w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl shadow-xl shadow-slate-900/10 active:scale-95 transition-all uppercase text-xs tracking-widest flex items-center justify-center gap-2",
                isCheckingOut && "opacity-70 pointer-events-none"
              )}
            >
              {isCheckingOut ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Confirmar Pedido"
              )}
            </button>
          </div>

          <button 
            onClick={() => setIsPixStep(false)}
            disabled={isCheckingOut}
            className="w-full text-slate-400 text-[10px] font-black uppercase tracking-widest py-2 hover:text-slate-600 transition-colors mt-2"
          >
            Voltar ao carrinho
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-8 text-center gap-8">
        <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 border border-slate-100 shadow-sm">
          <ShoppingBag size={48} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tighter mb-2">Sacola Vazia</h2>
          <p className="text-sm text-slate-400 font-medium leading-relaxed">Que tal dar uma olhada nas ofertas do dia e garantir seu snack preferido?</p>
        </div>
        <button 
          onClick={onGoToHome}
          className="bg-slate-900 hover:bg-slate-800 text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-slate-900/10 uppercase text-xs tracking-widest transition-all active:scale-95"
        >
          Explorar Produtos
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-500 overflow-y-auto no-scrollbar pb-32">
      <div className="px-6 pt-4 flex flex-col gap-1">
        <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Minha Sacola</h2>
        <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">{cart.length} {cart.length === 1 ? 'item selecionado' : 'itens selecionados'}</p>
      </div>

      {/* Cart Items */}
      <div className="flex flex-col gap-4 px-6 mt-6">
        <AnimatePresence>
          {cart.map((item) => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex gap-4 transition-all hover:border-slate-300"
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex flex-col justify-between flex-1 py-0.5">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 tracking-tight line-clamp-1">{item.name}</h3>
                  <div className="text-sm font-black text-slate-900 mt-1">{formatCurrency(item.price)}</div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3 bg-slate-50 px-2 py-1 rounded-xl border border-slate-200/50">
                    <button 
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="p-1 text-slate-400 hover:text-emerald-600 transition-colors"
                    >
                      <Minus size={14} strokeWidth={3} />
                    </button>
                    <span className="text-xs font-black text-slate-800 w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="p-1 text-slate-400 hover:text-emerald-600 transition-colors"
                    >
                      <Plus size={14} strokeWidth={3} />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-slate-200 hover:text-red-500 transition-all hover:scale-110"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Address & Observation */}
      <div className="px-6 mt-4 flex flex-col gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <MapPin size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Endereço de Entrega</span>
            <span className="text-sm font-bold text-slate-800 mt-0.5 tracking-tight">{profile?.address || 'Por favor, defina um endereço no Perfil'}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
            <Clock size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Previsão de Entrega</span>
            <span className="text-sm font-bold text-slate-800 mt-0.5 tracking-tight">
              {maxLeadTime} {maxLeadTime === 1 ? 'dia útil' : 'dias úteis'} (Previsto: {
                (() => {
                  const d = new Date();
                  d.setDate(d.getDate() + maxLeadTime);
                  return d.toLocaleDateString('pt-BR');
                })()
              })
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <Repeat size={20} />
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-black text-slate-800 tracking-tight">Assinatura Semanal</span>
                <button 
                  onClick={() => {
                    if (user?.isAnonymous) {
                      alert('Apenas usuários com conta Google podem criar assinaturas recorrentes.');
                      return;
                    }
                    setIsRecurring(!isRecurring);
                  }}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    isRecurring ? "bg-emerald-500" : "bg-slate-200"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow-sm",
                    isRecurring ? "left-7" : "left-1"
                  )} />
                </button>
              </div>
              <p className="text-[10px] text-slate-500 font-bold mt-1 leading-relaxed">
                {user?.isAnonymous 
                  ? 'Faça login no Perfil para usar.' 
                  : 'Receba os mesmos itens toda semana automaticamente. O pagamento é feito via PIX a cada nova entrega.'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <label className="text-[10px] font-black text-slate-400 block mb-3 uppercase tracking-widest">Observação do Pedido (Opcional)</label>
          <textarea 
            placeholder="Ex: Deixar na recepção do 4º andar..."
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none placeholder:text-slate-300 transition-all"
            rows={2}
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
          />
        </div>
      </div>

      {/* Summary */}
      <div className="px-6 mt-4">
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-center text-sm font-bold">
            <span className="text-slate-400 uppercase tracking-widest text-[10px]">Subtotal</span>
            <span className="text-slate-700">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-bold">
            <span className="text-slate-400 uppercase tracking-widest text-[10px]">Taxa de Entrega</span>
            <span className="text-emerald-600 uppercase tracking-widest text-[10px]">Grátis</span>
          </div>
          <div className="h-px bg-slate-50"></div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-black text-slate-800 uppercase tracking-widest">Total</span>
            <span className="text-2xl font-black text-slate-900 tracking-tighter">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Footer / Checkout Button */}
      <div className="fixed bottom-24 left-0 right-0 px-6 max-w-md mx-auto z-40">
        <button 
          onClick={handleCheckoutClick}
          disabled={isCheckingOut || !profile?.address}
          className={cn(
            "w-full font-black py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 uppercase text-xs tracking-widest",
            isCheckingOut || !profile?.address 
              ? "bg-slate-200 text-slate-400 shadow-none pointer-events-none" 
              : "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20"
          )}
        >
          {isCheckingOut ? (
            <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <span>{!profile?.address ? 'Adicione um Endereço no Perfil' : 'Finalizar Pedido'}</span>
              <ArrowRight size={18} strokeWidth={3} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
