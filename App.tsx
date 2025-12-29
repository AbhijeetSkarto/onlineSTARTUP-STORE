
import React, { useState, useEffect, useMemo } from 'react';
import { PRODUCTS } from './constants';
import { Product, Category } from './types';
import { InteractiveDemos } from './components/InteractiveDemos';
import { db } from './services/storage';

const App: React.FC = () => {
  const [view, setView] = useState<'store' | 'product'>('store');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [showCart, setShowCart] = useState(false);
  const [cartIds, setCartIds] = useState<string[]>(db.getCart());
  const [timeLeft, setTimeLeft] = useState(28400); 

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(p => p > 0 ? p - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}h ${m}m ${sec}s`;
  };

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return PRODUCTS;
    return PRODUCTS.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  const cartItems = useMemo(() => PRODUCTS.filter(p => cartIds.includes(p.id)), [cartIds]);
  const cartTotal = useMemo(() => cartItems.reduce((acc, curr) => acc + curr.price, 0), [cartItems]);

  const addToCart = (productId: string) => {
    db.addToCart(productId);
    setCartIds(db.getCart());
    setShowCart(true);
  };

  const removeFromCart = (productId: string) => {
    db.removeFromCart(productId);
    setCartIds(db.getCart());
  };

  const Nav = () => (
    <nav className="fixed top-0 left-0 right-0 z-[100] glass border-b border-slate-200/50">
      <div className="container-custom py-5 flex justify-between items-center">
        <div 
          onClick={() => setView('store')} 
          className="text-lg font-black tracking-tighter cursor-pointer flex items-center gap-2"
        >
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-xs">O</div>
          <span className="uppercase tracking-[0.1em]">Online Startup <span className="text-slate-400">Store</span></span>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="hidden md:flex gap-8">
            {['AI Systems', 'Automation', 'Chatbots'].map(item => (
              <a key={item} href="#marketplace" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
                {item}
              </a>
            ))}
          </div>
          <div className="h-4 w-px bg-slate-200 hidden md:block"></div>
          <button 
            onClick={() => setShowCart(true)} 
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            Selection ({cartIds.length})
          </button>
        </div>
      </div>
    </nav>
  );

  const Hero = () => (
    <section className="relative pt-48 pb-32 overflow-hidden bg-white">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-slate-50 rounded-[100%] blur-[120px] opacity-60 -z-10"></div>
      <div className="container-custom text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
          New: Veo 3.1 Fast Video Intelligence Now Live
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.05] mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
          The Global <span className="text-gradient">Acquisition Engine</span> For Modern Startups.
        </h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-normal animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          Acquire world-class AI systems, automated workflows, and branded SaaS components. Launch under your brand in 48 hours. Secure 50% profit share on every resale.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
          <a href="#lab" className="px-10 py-5 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-[11px] hover:scale-[1.02] transition-transform shadow-2xl shadow-slate-300">
            Open Innovation Lab
          </a>
          <a href="#marketplace" className="px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-slate-50 transition-colors">
            View Marketplace
          </a>
        </div>
      </div>
    </section>
  );

  const ProductGrid = () => (
    <section id="marketplace" className="py-32 bg-slate-50">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Proprietary Solutions</h2>
            <p className="text-slate-500 uppercase tracking-widest text-[11px] font-bold">Standardized Excellence • 48H Fast-Track Deployment</p>
          </div>
          
          <div className="flex items-center gap-2 p-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar max-w-full">
            <button 
              onClick={() => setActiveCategory('All')}
              className={`px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === 'All' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900'}`}
            >
              All
            </button>
            {Object.values(Category).map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all min-w-max ${activeCategory === cat ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, idx) => (
            <div 
              key={product.id} 
              className="group bg-white border border-slate-200 rounded-2xl overflow-hidden luxury-shadow luxury-shadow-hover transition-all duration-500 animate-in fade-in slide-in-from-bottom-10"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div 
                className="aspect-[16/10] relative overflow-hidden cursor-pointer"
                onClick={() => { setSelectedProduct(product); setView('product'); window.scrollTo(0,0); }}
              >
                <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0" alt={product.name} />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-slate-900 border border-slate-100 shadow-sm">{product.category}</span>
                </div>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors">{product.name}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 h-8">{product.description}</p>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Licensing Fee</span>
                    <span className="text-xl font-bold text-slate-900">₹{product.price.toLocaleString()}</span>
                  </div>
                  <button 
                    onClick={() => addToCart(product.id)}
                    className="px-6 py-3 bg-slate-50 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all border border-slate-100"
                  >
                    {cartIds.includes(product.id) ? 'Selected' : 'Acquire'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const InnovationLabSection = () => (
    <section id="lab" className="py-32 bg-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-20 space-y-4">
          <h2 className="text-4xl font-black tracking-tight text-slate-900">Innovation Lab <span className="text-slate-300">3.0</span></h2>
          <p className="text-slate-500 uppercase tracking-widest text-[11px] font-bold">Try the tech before acquisition • Powered by Google Gemini & Veo</p>
        </div>
        <div className="max-w-5xl mx-auto">
          <InteractiveDemos />
        </div>
      </div>
    </section>
  );

  const Cart = () => (
    <div className={`fixed inset-0 z-[200] flex justify-end transition-all duration-700 ${showCart ? 'visible' : 'invisible pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-700 ${showCart ? 'opacity-100' : 'opacity-0'}`} onClick={() => setShowCart(false)}></div>
      <div className={`w-full max-w-lg bg-white h-full shadow-2xl p-12 flex flex-col transition-transform duration-700 ${showCart ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center mb-16">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Brand Portfolio</h2>
          <button onClick={() => setShowCart(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all text-xl">✕</button>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-8 no-scrollbar">
          {cartItems.map(item => (
            <div key={item.id} className="flex gap-6 items-center p-4 rounded-2xl border border-slate-100 group">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                <img src={item.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={item.name} />
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-bold text-xs uppercase tracking-widest text-slate-900">{item.name}</h4>
                <p className="text-slate-900 font-bold">₹{item.price.toLocaleString()}</p>
                <button onClick={() => removeFromCart(item.id)} className="text-[9px] text-red-500 font-bold uppercase tracking-widest hover:underline transition-all">Remove</button>
              </div>
            </div>
          ))}
          {cartItems.length === 0 && (
            <div className="text-center py-40 space-y-6">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">💼</span>
              </div>
              <p className="text-slate-400 font-medium italic text-sm">Your portfolio selection is currently empty.</p>
            </div>
          )}
        </div>

        <div className="pt-12 space-y-8 border-t border-slate-100 mt-auto">
          <div className="flex justify-between items-baseline px-2">
            <span className="text-slate-400 uppercase tracking-widest text-[10px] font-black">Total Acquisition Cost</span>
            <span className="text-4xl font-black tracking-tight text-slate-900">₹{cartTotal.toLocaleString()}</span>
          </div>
          <button 
            disabled={cartItems.length === 0}
            onClick={() => {
              const msg = encodeURIComponent(`I'm ready to acquire:\n${cartItems.map(i => `- ${i.name}`).join('\n')}\nTotal: ₹${cartTotal.toLocaleString()}`);
              window.open(`https://wa.me/917009899194?text=${msg}`);
            }}
            className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl hover:scale-[1.02] transition-transform disabled:opacity-30"
          >
            Confirm Licensing via WhatsApp
          </button>
          <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">Setup commences within 48 hours of confirmation.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Nav />
      <Cart />
      
      {view === 'store' ? (
        <main>
          <Hero />
          
          <div className="bg-slate-900 py-4 overflow-hidden border-y border-white/10">
            <div className="container-custom flex justify-center items-center gap-12 text-white/40 text-[9px] font-black uppercase tracking-[0.5em] animate-pulse">
              <span>Trusted by 450+ Brands</span>
              <span className="w-1.5 h-1.5 bg-white/20 rounded-full"></span>
              <span>Proprietary AI Core</span>
              <span className="w-1.5 h-1.5 bg-white/20 rounded-full"></span>
              <span>Global Licensing Ready</span>
            </div>
          </div>

          <InnovationLabSection />
          <ProductGrid />

          <section className="bg-slate-950 py-40 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="grid grid-cols-12 h-full container-custom border-x border-white/5">
                {[...Array(11)].map((_, i) => <div key={i} className="border-r border-white/5 h-full"></div>)}
              </div>
            </div>
            
            <div className="container-custom relative z-10 text-center space-y-16">
              <div className="space-y-6">
                <h4 className="text-slate-400 uppercase tracking-[0.6em] text-[10px] font-black">The Scarcity Protocol</h4>
                <h2 className="text-5xl md:text-8xl text-white font-black tracking-tighter leading-none">Empire In <span className="text-gradient">48 Hours.</span></h2>
                <div className="bg-white/5 inline-block px-8 py-4 rounded-2xl border border-white/10 mt-8">
                  <span className="text-white text-2xl font-black tabular-nums tracking-widest">{formatTime(timeLeft)}</span>
                  <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em] mt-2">Next Brand Deployment Slot Available</p>
                </div>
              </div>
              <p className="text-white/50 text-lg uppercase tracking-[0.2em] leading-relaxed max-w-2xl mx-auto font-light">
                Secure your master license today. Own the technology. <br/>Control the market. <span className="text-white font-bold">Keep 50% Profit on every sale.</span>
              </p>
              <a href="https://wa.me/917009899194" target="_blank" className="inline-block px-16 py-6 bg-white text-slate-900 rounded-xl font-black uppercase tracking-[0.4em] text-[11px] hover:scale-[1.05] transition-transform">
                Claim License Spot
              </a>
            </div>
          </section>
        </main>
      ) : selectedProduct && (
        <main className="pt-48 pb-32">
          <div className="container-custom">
            <button onClick={() => setView('store')} className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all mb-20">
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to Marketplace
            </button>
            
            <div className="grid lg:grid-cols-2 gap-24 items-start">
              <div className="space-y-16">
                <div className="space-y-8">
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-500">
                    {selectedProduct.category}
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-none">{selectedProduct.name}</h1>
                  <p className="text-xl text-slate-500 font-normal leading-relaxed">{selectedProduct.longDescription}</p>
                </div>

                <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200 space-y-10">
                  <div className="flex justify-between items-end">
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Licensing Cost</span>
                      <p className="text-5xl font-black text-slate-900">₹{selectedProduct.price.toLocaleString()}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block">Deployment: 48H</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Lifetime Brand Rights</span>
                    </div>
                  </div>
                  <button onClick={() => addToCart(selectedProduct.id)} className="w-full bg-slate-900 text-white py-8 rounded-2xl font-black uppercase tracking-widest text-[12px] shadow-2xl hover:bg-slate-800 transition-all">
                    Acquire Master License
                  </button>
                </div>
              </div>

              <div className="space-y-12">
                <div className="bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 group">
                  <img src={selectedProduct.image} className="w-full aspect-[4/5] object-cover grayscale transition-all duration-700 group-hover:grayscale-0" alt={selectedProduct.name} />
                </div>
                {selectedProduct.demoType && (
                  <div className="glass p-12 rounded-3xl border border-slate-200 shadow-xl space-y-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black uppercase tracking-widest text-slate-900">Interactive Demo</h3>
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    </div>
                    <InteractiveDemos initialView={selectedProduct.demoType} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      )}

      <footer className="bg-white border-t border-slate-100 py-32">
        <div className="container-custom text-center space-y-16">
          <div className="text-xl font-black tracking-tighter uppercase text-slate-900 flex items-center justify-center gap-3">
             <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-xs">O</div>
             Online Startup Store
          </div>
          <div className="flex flex-wrap justify-center gap-x-16 gap-y-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
             {['Licensing', 'Consultancy', 'Legal', 'Infrastructure', 'Support'].map(item => (
               <a key={item} href="#" className="hover:text-slate-900 transition-colors">{item}</a>
             ))}
          </div>
          <div className="space-y-4 pt-16 border-t border-slate-50">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">© 2025 Online Startup Store • All Proprietary Rights Reserved</p>
            <p className="text-[9px] font-medium text-slate-400 max-w-xl mx-auto leading-relaxed">The Online Startup Store is a master licensing gateway. All deployments are under white-label terms. Profit participation is legally bound to resale performance.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
