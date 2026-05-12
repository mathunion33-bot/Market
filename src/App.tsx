import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Toaster } from 'react-hot-toast';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { CartView } from './components/CartView';
import { OrdersView } from './components/OrdersView';
import { ProfileView } from './components/ProfileView';
import { AdminView } from './components/AdminView';
import { LoginView } from './components/LoginView';
import { ShoppingBag } from 'lucide-react';

function AppContent() {
  const { user, loading, isAdmin } = useApp();
  const [activeTab, setActiveTab] = useState('home');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-emerald-600 rounded-[2rem] flex items-center justify-center animate-bounce shadow-xl shadow-emerald-600/20">
          <ShoppingBag size={32} className="text-white" />
        </div>
        <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 animate-[loading_1.5s_infinite_linear]"></div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}} />
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }

  return (
    <div className="h-full w-full bg-slate-50 max-w-md mx-auto relative shadow-2xl flex flex-col lg:border-x border-slate-200 overflow-hidden">
      <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pt-4 pb-24">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'orders' && <OrdersView />}
        {activeTab === 'cart' && <CartView onOrderSuccess={(id) => setActiveTab('orders')} onGoToHome={() => setActiveTab('home')} />}
        {activeTab === 'profile' && <ProfileView />}
        {activeTab === 'admin' && isAdmin && <AdminView />}
      </main>
      
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Background decoration elements */}
      <div className="fixed top-20 -left-20 w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-20 pointer-events-none -z-10"></div>
      <div className="fixed bottom-40 -right-20 w-64 h-64 bg-emerald-200 rounded-full blur-3xl opacity-20 pointer-events-none -z-10"></div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: '20px',
            background: '#0f172a',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '600',
            padding: '12px 24px',
            border: '1px solid rgba(255,255,255,0.1)'
          },
        }}
      />
    <div className="bg-slate-100 fixed inset-0 lg:static lg:h-screen lg:w-full lg:flex items-center justify-center font-sans antialiased text-slate-900 overflow-hidden relative">
      {/* Desktop Mockup Decoration */}
      <div className="hidden lg:flex fixed left-10 top-1/2 -translate-y-1/2 flex-col gap-6 max-w-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-emerald-600/20">O</div>
          <span className="font-black text-2xl tracking-tighter text-slate-800">OfficeMarket</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 leading-tight">Mude a forma como você compra snacks.</h1>
        <p className="text-slate-500 font-medium">O Office Market traz a conveniência para dentro do seu escritório com preços de mercado.</p>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estoque Local Ativo</span>
          </div>
        </div>
      </div>

      <AppContent />
      
      {/* Responsive Tip for desktop users */}
      <div className="hidden lg:flex fixed right-10 bottom-10 flex-col items-end gap-2 text-right">
        <div className="bg-emerald-600 text-white p-5 rounded-3xl shadow-xl shadow-emerald-600/20 animate-bounce">
          <ShoppingBag size={24} />
        </div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Experiência Mobile</p>
      </div>
    </div>
    </AppProvider>
  );
}
