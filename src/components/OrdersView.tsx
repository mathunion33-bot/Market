import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ClipboardList, Package, Truck, CheckCircle2, Clock, MapPin, ReceiptText, X } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { OrderStatus, Order } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export function OrdersView() {
  const { orders } = useApp();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case 'received': return { label: 'Recebido', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50/50' };
      case 'buying': return { label: 'Comprando', icon: ReceiptText, color: 'text-purple-600', bg: 'bg-purple-50/50' };
      case 'preparing': return { label: 'Separando', icon: Package, color: 'text-orange-600', bg: 'bg-orange-50/50' };
      case 'on_the_way': return { label: 'A caminho', icon: Truck, color: 'text-emerald-600', bg: 'bg-emerald-50/50' };
      case 'delivered': return { label: 'Entregue', icon: CheckCircle2, color: 'text-slate-400', bg: 'bg-slate-100' };
      default: return { label: 'Pendente', icon: Clock, color: 'text-slate-300', bg: 'bg-slate-50' };
    }
  };

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-6 text-center gap-6">
        <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200">
          <ClipboardList size={48} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-800 mb-2 tracking-tight">Sem pedidos por aqui</h2>
          <p className="text-sm text-slate-400 font-medium">Você ainda não realizou nenhum pedido. Que tal um snack agora?</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-32 animate-in slide-in-from-right duration-500">
      <div className="px-6 pt-4 flex flex-col gap-1">
        <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Meus Pedidos</h2>
        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">{orders.length} pedidos realizados</p>
      </div>

      <div className="flex flex-col gap-5 px-6">
        {orders.map((order) => {
          const status = getStatusConfig(order.status);
          const Icon = status.icon;
          
          return (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="p-5 flex flex-col gap-5">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">PEDIDO #{(order.id || '').slice(-6).toUpperCase()}</span>
                    <span className="text-xs text-slate-500 font-bold">Previsão: {order.deliveryDate}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    {order.isRecurring && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        Semanal
                      </div>
                    )}
                    <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest", status.color, status.bg)}>
                      <Icon size={12} strokeWidth={3} />
                      {status.label}
                    </div>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="flex items-center gap-4 py-1">
                  <div className="flex -space-x-3 overflow-hidden">
                    {(order.items || []).slice(0, 3).map((item, idx) => (
                      <div key={idx} className="inline-block h-12 w-12 rounded-2xl ring-4 ring-white overflow-hidden bg-slate-50">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                    ))}
                    {(order.items || []).length > 3 && (
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-[10px] font-black text-slate-400 ring-4 ring-white">
                        +{(order.items || []).length - 3}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-800 tracking-tight">
                      {(order.items || []).length} {(order.items || []).length === 1 ? 'item' : 'itens'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold truncate max-w-[150px] uppercase tracking-wider">
                      {(order.items || []).map(i => i.name).join(', ')}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-slate-50"></div>

                {/* Footer */}
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Total Pago</span>
                    <span className="text-xl font-black text-slate-900 tracking-tighter">{formatCurrency(order.total)}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-5 py-3 rounded-2xl transition-all active:scale-95 shadow-lg shadow-slate-900/10"
                  >
                    Detalhes
                  </button>
                </div>
              </div>
              
              {/* Delivery Tip */}
              {order.status !== 'delivered' && (
                <div className="bg-emerald-600 p-4 flex items-center gap-3">
                  <div className="bg-emerald-500/20 p-2 rounded-xl text-white">
                    <MapPin size={16} />
                  </div>
                  <p className="text-[10px] text-white font-bold leading-tight uppercase tracking-wider">
                    Entregue amanhã • diretamente na sua mesa
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] p-8 shadow-2xl relative z-10 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tighter">Pedido</h3>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mt-1 block">
                    #{(selectedOrder.id || '').slice(-6).toUpperCase()}
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-2.5 bg-slate-100 text-slate-400 rounded-2xl hover:text-slate-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest px-1">Status</span>
                  <div className="flex gap-2">
                    <div className={cn(
                      "flex flex-1 items-center gap-2 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest",
                      getStatusConfig(selectedOrder.status).color,
                      getStatusConfig(selectedOrder.status).bg
                    )}>
                      {React.createElement(getStatusConfig(selectedOrder.status).icon, { size: 16, strokeWidth: 3 })}
                      {getStatusConfig(selectedOrder.status).label}
                    </div>
                    {selectedOrder.isRecurring && (
                      <div className="flex items-center gap-2 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        Assinatura Semanal
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest px-1">Comprador</span>
                  <div className="bg-slate-50 p-4 rounded-2xl flex flex-col gap-1">
                    <span className="text-sm font-bold text-slate-800">{selectedOrder.userName}</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1"><MapPin size={10} /> {selectedOrder.address}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest px-1">Itens ({(selectedOrder.items || []).length})</span>
                  <div className="flex flex-col gap-3 bg-slate-50 p-4 rounded-[2rem]">
                    {(selectedOrder.items || []).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl overflow-hidden bg-white shrink-0">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-sm font-bold text-slate-800 truncate">{item.name}</span>
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.quantity}x • {formatCurrency(item.price)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedOrder.observation && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest px-1">Observação</span>
                    <div className="bg-orange-50 text-orange-800 p-4 rounded-2xl text-xs font-bold leading-relaxed">
                      "{selectedOrder.observation}"
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest px-1">Total do Pedido</span>
                  <div className="bg-emerald-50 text-emerald-800 px-5 py-4 rounded-3xl flex justify-between items-center text-xl font-black tracking-tighter">
                    <span>Total</span>
                    <span>{formatCurrency(selectedOrder.total)}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold text-center mt-2 uppercase tracking-widest max-w-[250px] mx-auto leading-relaxed">
                    Pagamento via PIX • Comprovante enviado via WhatsApp
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
