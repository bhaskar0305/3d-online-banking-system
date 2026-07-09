import React, { useState } from 'react';
import { Shield, Lock, CreditCard, ChevronRight, UserPlus, LogIn, Phone, Globe, HelpCircle } from 'lucide-react';
import { login, register } from '../services/api';
import Card3D from '../components/Card3D';

export default function LandingPage({ onLoginSuccess }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    phoneNumber: ''
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
        setSuccess('Registration successful! Please sign in with your new credentials.');
        setAuthMode('login');
      }
    } catch (err) {
      setError(err.response?.data || 'An error occurred during authentication.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Info Bar */}
      <div className="bg-slate-950 text-slate-400 text-xs py-2 px-6 flex justify-between items-center border-b border-slate-800">
        <div className="flex gap-6">
          <span className="hover:text-amber-400 cursor-pointer flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> Personal Banking</span>
          <span className="hover:text-amber-400 cursor-pointer">Corporate</span>
          <span className="hover:text-amber-400 cursor-pointer">NRI Banking</span>
          <span className="hover:text-amber-400 cursor-pointer">Agri & Rural</span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-cyan-400" /> 1800-425-3800</span>
          <span className="flex items-center gap-1 hover:text-white cursor-pointer"><HelpCircle className="w-3.5 h-3.5" /> Support</span>
        </div>
      </div>

      {/* Main Bank Header Navigation */}
      <header className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700/60 sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">
              S
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white leading-none">APEX BANK</h1>
              <span className="text-[10px] text-amber-400 tracking-widest uppercase font-semibold">Internet Banking Portal</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex gap-8 text-sm font-medium text-slate-300">
            <a href="#accounts" className="hover:text-amber-400 transition">Accounts</a>
            <a href="#cards" className="hover:text-amber-400 transition">Cards</a>
            <a href="#loans" className="hover:text-amber-400 transition">Loans</a>
            <a href="#investment" className="hover:text-amber-400 transition">Investments</a>
            <a href="#security" className="hover:text-amber-400 transition">Security</a>
          </nav>

          {/* Quick Auth Actions */}
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
              <UserPlus className="w-4 h-4" /> Register New Account
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Hero Content */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Shield className="w-4 h-4" /> Next-Generation 256-Bit Encrypted Portal
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Smart, Secure & Seamless <br />
            <span className="bg-gradient-to-r from-amber-400 to-cyan-400 bg-clip-text text-transparent">
              Digital Internet Banking
            </span>
          </h2>
          <p className="text-slate-400 text-base max-w-xl leading-relaxed">
            Experience real-time transfers, 3D interactive account management, AI assistance, and high-security encrypted transactions tailored for modern finance.
          </p>

          {/* 3D Black & Gold Card Preview Section */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 shadow-2xl">
            <div className="flex justify-between items-center mb-2 px-2">
              <span className="text-xs font-bold text-amber-400 tracking-wider uppercase">Apex Black Gold Edition</span>
              <span className="text-xs text-slate-400">Drag to rotate 360°</span>
            </div>
            {/* Interactive 3D Card Model Component */}
            <Card3D />
          </div>
        </div>

        {/* Right Auth Portal Modal Box */}
        <div className="lg:col-span-5 bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl relative">
          <div className="flex border-b border-slate-700 mb-6">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 pb-3 text-sm font-bold transition border-b-2 ${
                authMode === 'login' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 pb-3 text-sm font-bold transition border-b-2 ${
                authMode === 'register' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Open New Account
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
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                    placeholder="John Doe"
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                    placeholder="john@example.com"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                    placeholder="9876543210"
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">User ID / Username</label>
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
              {authMode === 'login' ? 'Proceed to Secure Portal' : 'Register & Generate Account'} <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>

      {/* Corporate Banking Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-10 px-6 mt-12 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold mb-3">APEX Internet Banking</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Licensed banking service provider. Encrypted using standard TLS 1.3 multi-factor security layers.
            </p>
          </div>
          <div>
            <h4 className="text-slate-200 font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-amber-400 cursor-pointer">NetBanking Guidelines</li>
              <li className="hover:text-amber-400 cursor-pointer">Security Tips & Fraud Advisory</li>
              <li className="hover:text-amber-400 cursor-pointer">Interest Rates & Fees</li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-200 font-semibold mb-3">Customer Care</h4>
            <ul className="space-y-2 text-xs">
              <li>Toll Free: 1800-425-3800</li>
              <li>Report Unauthorized Transaction</li>
              <li>Locate Branch / ATM</li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-200 font-semibold mb-3">Security Certified</h4>
            <div className="flex gap-2 text-xs text-emerald-400 items-center">
              <Lock className="w-4 h-4" /> ISO 27001 Certified Banking System
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-900 pt-6 text-center text-xs text-slate-600">
          © 2026 APEX Banking Corporation. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}