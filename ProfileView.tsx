import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Settings, 
  MapPin, 
  CreditCard, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  Moon,
  Sun,
  Camera,
  X,
  Save,
  Gift,
  Star
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function ProfileView() {
  const { profile, logout, isAdmin, updateProfile, orders } = useApp();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [addressInput, setAddressInput] = useState(profile?.address || '');
  const [nameInput, setNameInput] = useState(profile?.displayName || '');

  const handleSaveProfile = async () => {
    await updateProfile({ address: addressInput, displayName: nameInput });
    setIsEditingProfile(false);
  };

  const handleHelpClick = () => {
    window.open('https://wa.me/5511941774380', '_blank');
  };

  const myOrders = orders.filter(o => o.userId === profile?.uid);
  const validOrdersCount = myOrders.filter(o => o.status !== 'cancelled').length;
  const points = validOrdersCount % 10;
  const hasBonus = validOrdersCount > 0 && validOrdersCount % 10 === 0;

  const menuItems = [
    { 
      icon: User, 
      label: 'Dados Pessoais', 
      value: profile?.displayName || 'Definir nome...',
      onClick: () => setIsEditingProfile(true)
    },
    { 
      icon: MapPin, 
      label: 'Endereço de Entrega (Mesa)', 
      value: profile?.address || 'Definir endereço...',
      onClick: () => setIsEditingProfile(true)
    },
    { 
      icon: CreditCard, 
      label: 'Métodos de Pagamento', 
      value: 'PIX (Padrão e Único)',
      onClick: () => {}
    },
    { 
      icon: Settings, 
      label: 'Preferências', 
      value: 'Notificações & Mais',
      onClick: () => {}
    },
    { 
      icon: HelpCircle, 
      label: 'Ajuda & Suporte',
      value: 'WhatsApp: (11) 94177-4380',
      onClick: handleHelpClick
    },
  ];

  return (
    <div className="flex flex-col gap-8 pb-32 animate-in fade-in duration-500">
      {/* Profile Header */}
      <div className="relative px-6 pt-8 pb-4 flex flex-col items-center">
        <div className="relative mb-6 group">
          <div className="w-32 h-32 rounded-[3.5rem] border-4 border-white shadow-2xl overflow-hidden bg-slate-900 flex items-center justify-center">
            {profile?.photoURL ? (
              <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-black text-white">{profile?.displayName?.charAt(0)}</span>
            )}
          </div>
          <button className="absolute bottom-1 right-1 bg-emerald-600 text-white p-3 rounded-2xl border-4 border-slate-50 shadow-xl active:scale-95 transition-transform">
            <Camera size={18} />
          </button>
        </div>
        
        <div className="text-center flex flex-col gap-1">
          <h2 className="text-2xl font-black text-slate-800 tracking-tighter flex items-center justify-center gap-2">
            {profile?.displayName}
            {isAdmin && <div className="bg-emerald-500/10 p-1 rounded-lg"><ShieldCheck size={20} className="text-emerald-600" /></div>}
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{profile?.email}</p>
        </div>
      </div>

      {/* Stats Summary Bento Style */}
      <div className="px-6 grid grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm flex flex-col items-center text-center group transition-all hover:border-emerald-200">
          <span className="text-2xl font-black text-slate-900 tracking-tighter mb-1">{myOrders.length}</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pedidos</span>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm flex flex-col items-center text-center group transition-all hover:border-emerald-200">
          <span className="text-2xl font-black text-emerald-600 tracking-tighter mb-1">PRO</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</span>
        </div>
      </div>

      {/* Loyalty Card */}
      <div className="px-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-[2.5rem] shadow-xl shadow-slate-900/20 text-white relative overflow-hidden">
          <Star className="absolute -top-10 -right-10 text-white/5" size={150} />
          
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <Gift size={24} className={hasBonus ? "text-emerald-400 animate-pulse" : "text-white"} />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tighter">Clube Fidelidade</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {hasBonus ? 'Bônus liberado!' : `${10 - points} pedidos para o bônus`}
              </p>
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-300">
              <span>Progresso Atual</span>
              <span className={hasBonus ? "text-emerald-400" : "text-white"}>{hasBonus ? 10 : points}/10</span>
            </div>
            <div className="h-4 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(hasBonus ? 10 : points) * 10}%` }}
                transition={{ duration: 1, type: "spring" }}
                className={cn(
                  "h-full rounded-full",
                  hasBonus ? "bg-emerald-500" : "bg-white"
                )}
              />
            </div>
          </div>
          
          {hasBonus && (
            <motion.button 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full mt-6 bg-emerald-500 hover:bg-emerald-400 text-white font-black py-4 rounded-2xl transition-colors text-xs uppercase tracking-widest"
              onClick={() => {
                window.open('https://wa.me/5511941774380?text=Olá! Bati meus 10 pedidos e vim resgatar meu bônus Fidelidade!', '_blank');
              }}
            >
              Resgatar Bônus pelo WhatsApp
            </motion.button>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex flex-col gap-3 px-6">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-1">Configurações</h3>
        <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-sm">
          {menuItems.map((item, idx) => (
            <React.Fragment key={idx}>
              <button 
                onClick={item.onClick}
                className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors group text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/50 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-all">
                    <item.icon size={20} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-bold text-slate-800 tracking-tight">{item.label}</span>
                    {item.value && <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 line-clamp-1">{item.value}</span>}
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-200 group-hover:text-slate-400 flex-shrink-0 transition-colors" />
              </button>
              {idx !== menuItems.length - 1 && <div className="h-px bg-slate-50 mx-6"></div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="px-6 mt-2 flex flex-col items-center gap-8">
        <button 
          onClick={logout}
          className="w-full bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 border border-slate-200/50 uppercase text-[10px] tracking-widest"
        >
          <LogOut size={16} />
          Encerrar Sessão
        </button>
        <div className="text-center">
          <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.3em] mb-1">Office Market Premium</p>
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest leading-loose">v2.4.1 (Build 2024)</p>
        </div>
      </div>

      <AnimatePresence>
        {isEditingProfile && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditingProfile(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] p-8 shadow-2xl relative z-10 max-h-[90dvh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-8 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsEditingProfile(false)}
                    className="p-2.5 bg-slate-100 text-slate-400 rounded-2xl hover:text-slate-600 transition-colors"
                  >
                    <X size={24} />
                  </button>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tighter">Meus Dados</h3>
                </div>
                <button 
                  onClick={handleSaveProfile}
                  className="bg-emerald-600 text-white font-black px-4 py-3 rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all text-xs uppercase tracking-widest flex items-center gap-2"
                >
                  <Save size={16} />
                  Salvar
                </button>
              </div>

              <div className="flex flex-col gap-6 overflow-y-auto no-scrollbar pb-8 pt-2 flex-1 overscroll-contain">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Seu Nome</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                      placeholder="Ex: Matheus"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Seu Endereço / Mesa</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                      placeholder="Ex: Mesa 42, 4º Andar, Setor Sul"
                      value={addressInput}
                      onChange={(e) => setAddressInput(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
