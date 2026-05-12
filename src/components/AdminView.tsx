import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart3, 
  Package, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Search,
  Clock,
  ArrowRight,
  MoreVertical,
  ChevronDown,
  Plus,
  X,
  Trash2,
  Image as ImageIcon,
  Tag,
  Hash
} from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { OrderStatus, Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { CATEGORIES } from '../constants';

export function AdminView() {
  const { orders, products, updateOrderStatus, addProduct, updateProduct, deleteProduct } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    price: 0,
    internalPrice: 0,
    category: 'Snacks',
    image: '',
    stock: 100,
    popular: false,
    featured: false,
    priceMax: 0,
    deliveryDays: 1
  });

  const totalRevenue = (orders || []).reduce((sum, o) => sum + (o.total || 0), 0);
  const totalProfit = (orders || []).reduce((sum, o) => {
    return sum + (o.items || []).reduce((itemSum, item) => {
      const product = products.find(p => p.id === item.productId);
      const cost = product?.internalPrice || ((item.price || 0) * 0.6);
      return itemSum + ((item.price || 0) - cost) * (item.quantity || 1);
    }, 0);
  }, 0);

  const stats = [
    { label: 'Vendas Totais', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Lucro Estimado', value: formatCurrency(totalProfit), icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pedidos', value: orders.length, icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Clientes', value: [...new Set(orders.map(o => o.userId))].length, icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const handleStatusChange = (orderId: string, currentStatus: OrderStatus) => {
    const statuses: OrderStatus[] = ['received', 'buying', 'preparing', 'on_the_way', 'delivered'];
    const currentIndex = statuses.indexOf(currentStatus);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    updateOrderStatus(orderId, nextStatus);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateProduct(editingId, newProduct);
    } else {
      await addProduct(newProduct);
    }
    closeForm();
  };

  const closeForm = () => {
    setShowAddForm(false);
    setEditingId(null);
    setNewProduct({
      name: '',
      description: '',
      price: 0,
      internalPrice: 0,
      category: 'Snacks',
      image: '',
      stock: 100,
      popular: false,
      featured: false,
      priceMax: 0,
      deliveryDays: 1
    });
  };

  const openEditForm = (product: Product) => {
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      internalPrice: product.internalPrice,
      category: product.category,
      image: product.image,
      stock: product.stock,
      popular: product.popular,
      featured: product.featured,
      priceMax: product.priceMax || 0,
      deliveryDays: product.deliveryDays || 1
    });
    setEditingId(product.id);
    setShowAddForm(true);
  };

  return (
    <div className="flex flex-col gap-8 pb-32 animate-in fade-in duration-500 bg-slate-50 min-h-screen">
      <div className="px-6 pt-6 flex justify-between items-center bg-white border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Painel Admin</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Gestão do Office Market</p>
        </div>
        <button 
          onClick={() => { setEditingId(null); setShowAddForm(true); }}
          className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl shadow-slate-900/10 active:scale-95 transition-all"
        >
          <Plus size={24} strokeWidth={3} />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 px-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-5 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col gap-2"
          >
            <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center mb-1", stat.bg, stat.color)}>
              <stat.icon size={20} />
            </div>
            <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{stat.label}</div>
            <div className="text-xl font-black text-slate-900 tracking-tight">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Tabs / sections */}
      <div className="flex flex-col gap-8">
        {/* Product Management Section */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-6">
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Estoque & Produtos</h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{products.length} itens</span>
          </div>
          
          <div className="flex flex-col gap-3 px-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 cursor-pointer hover:border-emerald-200 transition-all" onClick={() => openEditForm(product)}>
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-sm font-bold text-slate-800 line-clamp-1">{product.name}</span>
                  {product.description && (
                    <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{product.description}</span>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-black text-emerald-600">
                      {product.priceMax 
                        ? `${formatCurrency(product.price)} - ${formatCurrency(product.priceMax)}` 
                        : formatCurrency(product.price)
                      }
                    </span>
                    {product.deliveryDays && product.deliveryDays > 1 && (
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-lg font-black">{product.deliveryDays} DIAS</span>
                    )}
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{product.category}</span>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteProduct(product.id); }}
                  className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-6">
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Entregas de Hoje</h3>
          </div>

          <div className="flex flex-col gap-4 px-6">
            {orders.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-8 text-center flex flex-col items-center gap-3">
                <Package size={40} className="text-slate-200" />
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Nenhum pedido pendente</p>
              </div>
            ) : (
              (orders || []).slice(0, 10).map((order) => (
                <div key={order.id} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-6 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-[1.25rem] bg-slate-900 flex items-center justify-center font-black text-white text-lg">
                          {(order.userName || 'U').charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900 tracking-tight">{order.userName}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">#{(order.id || '').slice(-6).toUpperCase()}</span>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">{order.deliveryDate}</span>
                            {order.isRecurring && (
                              <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 font-bold mt-1 line-clamp-1">{order.address || 'Endereço não informado'}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-lg font-black text-slate-900 tracking-tighter">{formatCurrency(order.total)}</span>
                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em]">PAGO</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 py-2 border-y border-slate-50">
                      <div className="flex -space-x-3">
                        {(order.items || []).slice(0, 3).map((item, idx) => (
                          <div key={idx} className="w-8 h-8 rounded-xl ring-4 ring-white bg-slate-50 overflow-hidden">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-slate-500 line-clamp-1">
                        {(order.items || []).map(i => i.name).join(', ')}
                      </span>
                    </div>

                    <div className="flex justify-between items-center gap-3">
                      <div className="flex-1 bg-slate-50 px-4 py-3 rounded-2xl flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{order.status}</span>
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map((s, idx) => (
                            <div key={idx} className={cn("w-1.5 h-1.5 rounded-full", idx <= ['received', 'buying', 'preparing', 'on_the_way', 'delivered'].indexOf(order.status) ? "bg-emerald-500" : "bg-slate-200")}></div>
                          ))}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleStatusChange(order.id, order.status)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-black p-4 rounded-2xl transition-all shadow-lg shadow-emerald-600/10 active:scale-95"
                      >
                        <ArrowRight size={20} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Product Modal/Form */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeForm}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] p-8 shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-slate-800 tracking-tighter">{editingId ? 'Editar Produto' : 'Novo Produto'}</h3>
                <button 
                  onClick={closeForm}
                  className="p-2.5 bg-slate-100 text-slate-400 rounded-2xl hover:text-slate-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nome do Produto</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="text"
                      required
                      placeholder="Ex: Coca Cola 350ml"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Descrição</label>
                  <textarea 
                    placeholder="Descrição detalhada do produto"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all min-h-[80px] resize-none"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Preço Venda</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="number"
                        step="0.01"
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                        value={newProduct.price || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Preço Custo</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="number"
                        step="0.01"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                        value={newProduct.internalPrice || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, internalPrice: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Prazo Entrega (Dias)</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="number"
                        min="1"
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                        value={newProduct.deliveryDays || 1}
                        onChange={(e) => setNewProduct({ ...newProduct, deliveryDays: parseInt(e.target.value) || 1 })}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Preço Máximo (Opcional)</label>
                    <div className="relative">
                      <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="number"
                        step="0.01"
                        placeholder="Ex: 8.00"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                        value={newProduct.priceMax || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, priceMax: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Estoque</label>
                    <div className="relative">
                      <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="number"
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                        value={newProduct.stock || 0}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Categoria</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all appearance-none"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    >
                      {CATEGORIES.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      checked={newProduct.popular || false}
                      onChange={(e) => setNewProduct({ ...newProduct, popular: e.target.checked })}
                    />
                    Produto Popular
                  </label>
                  
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      checked={newProduct.featured || false}
                      onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
                    />
                    Oferta do Dia
                  </label>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-end px-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">URL da Imagem</label>
                    <a 
                      href={`https://www.google.com/search?q=${encodeURIComponent(newProduct.name || 'produto')} png white background&tbm=isch`}
                      target="_blank" 
                      rel="noreferrer"
                      className="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1 hover:underline"
                    >
                      <Search size={10} /> Pesquisar Foto
                    </a>
                  </div>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="url"
                      required
                      placeholder="https://exemplo.com/foto.jpg"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    />
                  </div>
                </div>

                {newProduct.image && (
                  <div className="w-full aspect-video rounded-3xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50">
                    <img src={newProduct.image} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full bg-slate-900 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-slate-900/20 active:scale-95 transition-all text-xs uppercase tracking-widest mt-4"
                >
                  {editingId ? 'Atualizar Produto' : 'Salvar Produto'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
