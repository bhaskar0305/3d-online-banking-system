import React, { useState } from 'react';
import { Shield, Lock, CreditCard, ChevronRight, UserPlus, LogIn, Phone, Globe, HelpCircle, Landmark, Wallet, Percent } from 'lucide-react';
import { login, register } from '../services/api';
import Card3D from '../components/Card3D';

export default function LandingPage({ onLoginSuccess }) {
  const [authMode, setAuthMode] = useState('login');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    phoneNumber: '',
    cardPin: '1234'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (authMode === 'login') {
        const { data } = await login({ username: formData.username, password: formData.password });
        localStorage.setItem('token', data.accessToken);
        onLoginSuccess();
      } else {
        await register(formData);
        setSuccess('Registration successful! Please sign in with your credentials.');
        setAuthMode('login');
      }
    } catch (err) {
      setError(err.response?.data || 'An error occurred during authentication.');
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Info Bar */}
      <div className="bg-slate-950 text-slate-400 text-xs py-2 px-6 flex justify-between items-center border-b border-slate-800">
        <div className="flex gap-6">
          <span className="hover:text-amber-400 cursor-pointer flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> Personal Banking</span>
          <span className="hover:text-amber-400 cursor-pointer">Corporate Portal</span>
          <span className="hover:text-amber-400 cursor-pointer">NRI Services</span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-cyan-400" /> 1800-425-3800</span>
          <span className="flex items-center gap-1 hover:text-white cursor-pointer"><HelpCircle className="w-3.5 h-3.5" /> 24x7 Help Desk</span>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="bg-slate-800/90 backdrop-blur-md border-b border-slate-700/60 sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">
              A
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white leading-none">APEX BANK</h1>
              <span className="text-[10px] text-amber-400 tracking-widest uppercase font-semibold">Internet Banking Portal</span>
            </div>
          </div>

          <nav className="hidden lg:flex gap-8 text-sm font-medium text-slate-300">
            <button onClick={() => scrollToSection('accounts')} className="hover:text-amber-400 transition">Accounts</button>
            <button onClick={() => scrollToSection('cards')} className="hover:text-amber-400 transition">Cards</button>
            <button onClick={() => scrollToSection('loans')} className="hover:text-amber-400 transition">Loans</button>
            <button onClick={() => scrollToSection('security')} className="hover:text-amber-400 transition">Security</button>
          </nav>

          <div className="flex gap-3">
            <button
              onClick={() => setAuthMode('login')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
                authMode === 'login' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              }`}
            >
              <LogIn className="w-4 h-4" /> Internet Banking
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
                authMode === 'register' ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              }`}
            >
              <UserPlus className="w-4 h-4" /> Open Account
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Shield className="w-4 h-4" /> 256-Bit Encrypted Next-Gen NetBanking
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Next-Gen Digital Banking <br />
            <span className="bg-gradient-to-r from-amber-400 to-cyan-400 bg-clip-text text-transparent">
              Built for Modern Enterprise
            </span>
          </h2>

          {/* Sample 3D Card Display */}
          <div id="cards" className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 shadow-2xl">
            <div className="flex justify-between items-center mb-2 px-2">
              <span className="text-xs font-bold text-amber-400 tracking-wider uppercase">Sample Black Gold Edition Card</span>
              <span className="text-xs text-slate-400">Interactive 3D Render</span>
            </div>
            <Card3D isSample={true} />
          </div>
        </div>

        {/* Auth Panel */}
        <div className="lg:col-span-5 bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl">
          <div className="flex border-b border-slate-700 mb-6">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 pb-3 text-sm font-bold transition border-b-2 ${
                authMode === 'login' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 pb-3 text-sm font-bold transition border-b-2 ${
                authMode === 'register' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400'
              }`}
            >
              Register New User
            </button>
          </div>

          {error && <div className="bg-rose-500/10 border border-rose-500/40 text-rose-400 text-xs p-3 rounded-xl mb-4">{error}</div>}
          {success && <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs p-3 rounded-xl mb-4">{success}</div>}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'register' && (
              <>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                    placeholder="John Doe"
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                    placeholder="john@example.com"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">4-Digit Security Card PIN</label>
                  <input
                    type="password"
                    maxLength={4}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                    placeholder="e.g. 8821"
                    onChange={(e) => setFormData({ ...formData, cardPin: e.target.value })}
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Username</label>
              <input
                type="text"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                placeholder="Enter username"
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                placeholder="••••••••"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className={`w-full mt-2 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-slate-950 ${
                authMode === 'login' ? 'bg-amber-400 hover:bg-amber-300' : 'bg-cyan-400 hover:bg-cyan-300'
              }`}
            >
              {authMode === 'login' ? 'Access Portal' : 'Register & Create Account'} <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>

      {/* Feature Sections */}
      <section id="accounts" className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60">
          <Landmark className="w-8 h-8 text-amber-400 mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">High-Yield Savings</h3>
          <p className="text-xs text-slate-400">Earn up to 7.5% annual interest on primary digital account deposits.</p>
        </div>
        <div id="loans" className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60">
          <Percent className="w-8 h-8 text-cyan-400 mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">Instant Loans</h3>
          <p className="text-xs text-slate-400">Pre-approved home and personal credit line approvals within 10 minutes.</p>
        </div>
        <div id="security" className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60">
          <Lock className="w-8 h-8 text-emerald-400 mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">TLS 1.3 Encryption</h3>
          <p className="text-xs text-slate-400">Multi-factor 2FA hardware authentication for all external wire transfers.</p>
        </div>
      </section>
    </div>
  );
}