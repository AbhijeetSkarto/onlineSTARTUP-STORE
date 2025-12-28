
import React, { useState, useEffect } from 'react';
import { TESTIMONIALS, FAQS, COLORS } from './constants';
import { PricingTier } from './types';
import { InteractiveDemos } from './components/InteractiveDemos';
import { db, DBRecord } from './services/storage';

const App: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 47, minutes: 59, seconds: 59 });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState('analytics');
  const [records, setRecords] = useState<DBRecord[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) { seconds = 59; minutes--; }
        else if (hours > 0) { minutes = 59; hours--; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      setRecords(db.getRecords());
    }
  }, [isLoggedIn, activeTab]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setShowLoginModal(false);
    setIsLoggedIn(true);
    window.scrollTo(0, 0);
  };

  const handleDeleteRecord = (id: string) => {
    db.deleteRecord(id);
    setRecords(db.getRecords());
  };

  const Dashboard = () => (
    <div className="min-h-screen bg-[#0f172a] flex text-slate-200">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex">
        <div className="p-6">
          <div className="text-xl font-black text-indigo-400">WLS<span className="text-white">.STORE</span></div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Partner Portal</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {[
            { id: 'analytics', label: 'Analytics', icon: '📊' },
            { id: 'database', label: 'Database', icon: '💾' },
            { id: 'agents', label: 'AI Agents', icon: '🤖' },
            { id: 'settings', label: 'White-Labeling', icon: '⚙️' },
            { id: 'billing', label: 'Payouts', icon: '💰' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={() => setIsLoggedIn(false)} className="w-full text-left px-4 py-2 text-sm text-slate-500 hover:text-white transition">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, Partner</h1>
            <p className="text-slate-500 text-sm">Your SaaS is performing 24% better than last month.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              Backend Status: Online
            </div>
            <img src="https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff" className="w-10 h-10 rounded-full border border-indigo-500" alt="Profile" />
          </div>
        </header>

        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Revenue', value: '₹1,42,000', change: '+12%', color: 'text-emerald-400' },
                { label: 'Active Clients', value: '48', change: '+3', color: 'text-indigo-400' },
                { label: 'AI Responses', value: records.length.toString(), change: '+New', color: 'text-purple-400' },
                { label: 'DB Storage', value: `${(JSON.stringify(records).length / 1024).toFixed(2)} KB`, change: 'Optimal', color: 'text-amber-400' },
              ].map((stat, i) => (
                <div key={i} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className={`text-[10px] mt-2 font-bold ${stat.color}`}>{stat.change} since last week</p>
                </div>
              ))}
            </div>

            <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700/50 h-64 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent"></div>
               <p className="text-slate-500 font-medium">Real-time Interaction Stream Visualization</p>
            </div>
          </div>
        )}

        {activeTab === 'database' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-xl font-bold">Database Management</h2>
                <p className="text-sm text-slate-500">View and manage all records generated by your AI suite.</p>
              </div>
              <button 
                onClick={() => { db.clearAll(); setRecords([]); }}
                className="text-xs font-bold text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-lg transition"
              >
                Wipe Database
              </button>
            </div>

            <div className="bg-slate-800/50 rounded-3xl border border-slate-700/50 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-slate-700 text-slate-500">
                    <th className="px-6 py-4 font-bold uppercase text-[10px]">Type</th>
                    <th className="px-6 py-4 font-bold uppercase text-[10px]">Input Prompt</th>
                    <th className="px-6 py-4 font-bold uppercase text-[10px]">Timestamp</th>
                    <th className="px-6 py-4 font-bold uppercase text-[10px] text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {records.length > 0 ? records.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-700/20 transition">
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                          r.type === 'chat' ? 'bg-indigo-500/20 text-indigo-400' :
                          r.type === 'image' ? 'bg-emerald-500/20 text-emerald-400' :
                          r.type === 'voice' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-slate-500/20 text-slate-400'
                        }`}>
                          {r.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate text-slate-300 italic">"{r.input}"</td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {new Date(r.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDeleteRecord(r.id)}
                          className="text-slate-500 hover:text-red-400 transition"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-20 text-center text-slate-500 italic">No records found. Try using the demos on the landing page!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-8 animate-in fade-in duration-500">
            <section className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700/50 space-y-6">
              <h2 className="text-xl font-bold">White-Label Configuration</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Platform Name</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm" defaultValue="My Custom AI" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Custom Domain</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm" placeholder="app.yourbrand.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Logo Upload</label>
                  <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center text-sm text-slate-500 hover:border-indigo-500 transition cursor-pointer">
                    Click to upload PNG or SVG (Transparent recommended)
                  </div>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-bold transition">Save Branded Settings</button>
              </div>
            </section>
          </div>
        )}
        
        {(activeTab === 'agents' || activeTab === 'billing') && (
           <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
             <span className="text-6xl mb-4">🏗️</span>
             <h3 className="text-xl font-bold">Feature Under Construction</h3>
             <p className="text-sm">This module is available in the full production version.</p>
           </div>
        )}
      </main>
    </div>
  );

  const LoginModal = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black">Partner Login</h2>
            <p className="text-slate-400 text-sm">Enter your credentials to manage your AI SaaS</p>
          </div>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500 ml-1">Work Email</label>
              <input 
                type="email" 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm focus:border-indigo-500 outline-none transition" 
                placeholder="name@company.com"
                defaultValue="demo@whitelabelstartup.store"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500 ml-1">Password</label>
              <input 
                type="password" 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm focus:border-indigo-500 outline-none transition" 
                placeholder="••••••••"
                defaultValue="password123"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
            >
              Enter Dashboard
            </button>
          </form>
          <div className="text-center">
            <button onClick={() => setShowLoginModal(false)} className="text-sm text-slate-500 hover:text-white transition">Back to Home</button>
          </div>
        </div>
      </div>
    </div>
  );

  const PricingCard = ({ title, price, features, highlighted = false }: { title: string, price: string, features: string[], highlighted?: boolean }) => (
    <div className={`relative flex flex-col p-8 rounded-3xl border ${highlighted ? 'bg-indigo-900/20 border-indigo-500 scale-105 shadow-2xl shadow-indigo-500/20' : 'bg-slate-800/40 border-slate-700'} transition-all hover:translate-y-[-8px]`}>
      {highlighted && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
      )}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="flex items-baseline mb-6">
        <span className="text-4xl font-extrabold">{price}</span>
        <span className="text-slate-400 ml-2">One-time</span>
      </div>
      <ul className="space-y-4 mb-8 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-start text-sm text-slate-300">
            <svg className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            {f}
          </li>
        ))}
      </ul>
      <a href="#pricing" className={`w-full py-4 rounded-xl font-bold text-center transition-all ${highlighted ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg' : 'bg-slate-700 hover:bg-slate-600 text-slate-100'}`}>
        Secure Your Spot
      </a>
    </div>
  );

  if (isLoggedIn) return <Dashboard />;

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {showLoginModal && <LoginModal />}
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 overflow-hidden bg-dark-gradient">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]"></div>
        </div>

        <nav className="absolute top-0 w-full max-w-7xl mx-auto flex justify-between items-center py-6 px-6">
          <div className="text-2xl font-black tracking-tighter text-indigo-400">WLS<span className="text-white">.STORE</span></div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#demos" className="hover:text-white transition">Live Demos</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
          </div>
          <button 
            onClick={() => setShowLoginModal(true)} 
            className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-full text-sm font-bold border border-white/10 transition"
          >
            Login
          </button>
        </nav>

        <div className="max-w-4xl text-center z-10 space-y-8">
          <div className="inline-block bg-indigo-500/20 border border-indigo-500/30 px-4 py-1.5 rounded-full text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4">
            Limited Time: Founder's Launch Offer 🇮🇳
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1]">
            Launch YOUR Branded <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">AI SaaS in 24 Hours</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            White-label chatbot + CRM/automation. Charge clients ₹3,000/mo. <br className="hidden md:block" /> 
            10 clients = ₹30k/mo MRR. No coding. Full Branding.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center pt-4">
            <a href="#pricing" className="w-full md:w-auto px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-lg font-bold shadow-2xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95">
              Claim Launch Spot (₹9,999)
            </a>
            <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Only 50 spots available for Dec 2025
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-10">
            {["Your logo & domain", "Unlimited client accounts", "Instamojo/Razorpay ready"].map((benefit, i) => (
              <div key={i} className="flex items-center justify-center gap-2 text-slate-300 font-medium">
                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                {benefit}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-slate-900/50 py-12 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 grayscale filter">
            {/* Logos Placeholder */}
            {['GoHighLevel', 'CustomGPT', 'OpenAI', 'Razorpay', 'Meta'].map(l => (
              <span key={l} className="text-2xl font-black text-slate-100 italic">{l}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-black">Traditional SaaS is hard. <br/> <span className="text-indigo-500">We make it simple.</span></h2>
            <div className="space-y-8">
              <div className="flex gap-4 p-6 bg-red-500/5 border border-red-500/20 rounded-2xl">
                <div className="w-12 h-12 bg-red-500/20 flex items-center justify-center rounded-xl text-2xl">🛑</div>
                <div>
                  <h4 className="font-bold text-red-400">Building = 6 months + ₹10L</h4>
                  <p className="text-sm text-slate-400">Finding developers, debugging, and hosting kills your dream before it starts.</p>
                </div>
              </div>
              <div className="flex gap-4 p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                <div className="w-12 h-12 bg-emerald-500/20 flex items-center justify-center rounded-xl text-2xl">🚀</div>
                <div>
                  <h4 className="font-bold text-emerald-400">Launch in 24 Hours</h4>
                  <p className="text-sm text-slate-400">Our pre-built engine gives you a fully functional platform you can call your own tonight.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video bg-indigo-500/10 rounded-3xl border border-indigo-500/20 overflow-hidden shadow-2xl">
              <img src="https://picsum.photos/seed/dashboard/800/450" alt="Dashboard Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <p className="text-white font-bold text-lg">Your Brand Dashboard</p>
                <p className="text-slate-400 text-xs">Live Preview: 100% White-Labeled</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demos Section */}
      <div id="demos">
        <InteractiveDemos />
      </div>

      {/* How It Works */}
      <section className="py-24 px-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-4xl font-bold mb-16">Launch Plan: 3 Simple Steps</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: 1, title: "Buy & Brand", desc: "Get your unique login + branding kit instantly." },
              { step: 2, title: "Custom Setup", desc: "Add your logo and domain in under 15 minutes." },
              { step: 3, title: "Bill Clients", desc: "Add clients, set your price, and keep 100% profit." }
            ].map((s, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto shadow-xl">{s.step}</div>
                <h4 className="text-xl font-bold">{s.title}</h4>
                <p className="text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-5xl font-black">Choose Your Launch Plan</h2>
          <p className="text-slate-400">No subscriptions. One-time payment for Founder spots.</p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          <PricingCard 
            title="Solo Creator" 
            price="₹9,999" 
            features={["1 Branded Domain", "10 Client Accounts", "AI Smart Chatbot", "Basic CRM", "Standard Support", "Lifetime Access"]}
          />
          <PricingCard 
            highlighted 
            title="Agency Reseller" 
            price="₹24,999" 
            features={["Custom Root Domain", "50 Client Accounts", "Multi-Agent AI Studio", "Full CRM Automation", "WhatsApp Bot Builder", "Priority Support"]}
          />
          <PricingCard 
            title="Done-For-You" 
            price="₹49,999" 
            features={["Unlimited Client Accounts", "Custom UI Theme", "We Setup Everything for You", "Custom Sales Funnel", "1-on-1 Consultation", "VVIP Priority Support"]}
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="p-6 bg-slate-800/40 border border-slate-700 rounded-2xl space-y-4">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>)}
              </div>
              <p className="text-sm italic text-slate-300">"{t.quote}"</p>
              <div>
                <p className="font-bold">{t.name}</p>
                <p className="text-xs text-slate-500">{t.location}</p>
                <p className="text-xs font-bold text-emerald-500 mt-1">{t.revenue}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <details key={i} className="group bg-slate-800/40 border border-slate-700 rounded-2xl overflow-hidden">
              <summary className="p-6 cursor-pointer flex justify-between items-center font-bold">
                {faq.q}
                <span className="text-slate-500 group-open:rotate-180 transition-transform">↓</span>
              </summary>
              <div className="p-6 pt-0 text-slate-400 text-sm leading-relaxed border-t border-slate-700">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xl font-black text-indigo-400">WLS<span className="text-white">.STORE</span></div>
          <div className="text-slate-500 text-xs text-center md:text-left">
            © 2025 WhiteLabelStartup.store. All rights reserved. <br/>
            Launched with pride in India 🇮🇳
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-slate-500 hover:text-white transition">Terms</a>
            <a href="#" className="text-slate-500 hover:text-white transition">Privacy</a>
          </div>
        </div>
      </footer>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900/90 backdrop-blur-md border-t border-slate-700 py-3 px-6 z-50 flex items-center justify-between shadow-2xl">
        <div className="hidden md:flex flex-col">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-tighter">Founder Spots Left: 14/50</p>
          <div className="flex gap-2 text-sm font-mono text-slate-100">
            <span>{timeLeft.hours.toString().padStart(2, '0')}h</span>
            <span>{timeLeft.minutes.toString().padStart(2, '0')}m</span>
            <span>{timeLeft.seconds.toString().padStart(2, '0')}s</span>
          </div>
        </div>
        <a href="#pricing" className="flex-1 md:flex-none text-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-transform active:scale-95 text-sm md:text-base">
          Secure Founder Launch Price (₹9,999) →
        </a>
      </div>
    </div>
  );
};

export default App;
