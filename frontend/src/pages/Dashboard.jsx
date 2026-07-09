import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  Send, ArrowUpRight, ArrowDownLeft, LogOut, ShieldCheck, RefreshCw,
  LayoutDashboard, History, User, Lock, ChevronRight, Search, Users, Plus, KeyRound, X,
  ShieldAlert, Download
} from 'lucide-react';

import { getAccount, getTransactions, transferMoney } from '../services/api';
import { generatePdfStatement } from '../utils/pdfGenerator';
import Card3D from '../components/Card3D';
import ChatBot from '../components/ChatBot';
import AdminPortal from './AdminPortal';

export default function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [transferData, setTransferData] = useState({ targetAccountNumber: '', amount: '', description: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdminPortal, setShowAdminPortal] = useState(false);

  // Beneficiary / Payee States
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [showAddPayeeModal, setShowAddPayeeModal] = useState(false);
  const [payeeForm, setPayeeForm] = useState({ name: '', accountNumber: '', bankCode: 'APEX0001' });
  const [payeeMessage, setPayeeMessage] = useState({ type: '', text: '' });

  // 2FA Security Modal States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('882910'); // Simulated OTP
  const [otpError, setOtpError] = useState('');

  // Fetch Account & Transaction Info
  const fetchData = useCallback(async () => {
    try {
      const accRes = await getAccount();
      setAccount(accRes.data);

      const txRes = await getTransactions();
      setTransactions(txRes.data);
    } catch (err) {
      console.error('Failed to fetch account info', err);
    }
  }, []);

  // Fetch Saved Beneficiaries
  const fetchBeneficiaries = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8080/api/banking/beneficiaries', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBeneficiaries(res.data);
    } catch (err) {
      console.error('Failed to fetch beneficiaries', err);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchBeneficiaries();
  }, [fetchData, fetchBeneficiaries]);

  // Handle Add New Payee
  const handleAddPayee = async (e) => {
    e.preventDefault();
    setPayeeMessage({ type: '', text: '' });
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/api/banking/beneficiaries', payeeForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayeeMessage({ type: 'success', text: 'Payee added successfully!' });
      setPayeeForm({ name: '', accountNumber: '', bankCode: 'APEX0001' });
      fetchBeneficiaries();
      setTimeout(() => setShowAddPayeeModal(false), 1200);
    } catch (err) {
      setPayeeMessage({ type: 'error', text: err.response?.data || 'Failed to add payee.' });
    }
  };

  // Initiate Transfer - Triggers 2FA Modal first
  const handleInitiateTransfer = (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!transferData.targetAccountNumber || !transferData.amount) {
      setMessage({ type: 'error', text: 'Please fill out all required transfer fields.' });
      return;
    }

    // Generate random 6-digit OTP for simulation
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpInput('');
    setOtpError('');
    setShowOtpModal(true);
  };

  // Confirm 2FA OTP and execute transaction API
  const handleVerifyAndTransfer = async (e) => {
    e.preventDefault();
    if (otpInput !== generatedOtp) {
      setOtpError('Invalid OTP Code. Please verify and try again.');
      return;
    }

    setShowOtpModal(false);
    setLoading(true);

    try {
      const response = await transferMoney({
        ...transferData,
        amount: parseFloat(transferData.amount),
      });
      setMessage({ type: 'success', text: response.data });
      setTransferData({ targetAccountNumber: '', amount: '', description: '' });
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data || 'Transfer failed.' });
    } finally {
      setLoading(false);
    }
  };

  if (showAdminPortal) {
    return <AdminPortal onBackToDashboard={() => setShowAdminPortal(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">

      {/* Header & Tabs Navigation */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-black text-slate-950 text-lg shadow-md shadow-amber-500/20">
              S
            </div>
            <span className="text-lg font-bold text-white tracking-tight">APEX DIGITAL BANKING</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Session Secure (TLS 1.3)</span>
            </div>

            <button
              onClick={() => setShowAdminPortal(true)}
              className="flex items-center gap-1.5 text-xs bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 px-3 py-2 rounded-xl transition"
            >
              <ShieldAlert className="w-4 h-4" /> Admin Command Center
            </button>

            <button onClick={onLogout} className="flex items-center gap-2 text-xs bg-slate-700 hover:bg-slate-600 px-3.5 py-2 rounded-xl text-slate-200 transition">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        <nav className="bg-slate-950/80 border-t border-slate-800 px-6">
          <div className="max-w-7xl mx-auto flex gap-2">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
              { id: 'transfer', label: 'Fund Transfer & Payees', icon: Send },
              { id: 'history', label: 'Transaction History', icon: History },
              { id: 'profile', label: 'Services & Profile', icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition border-b-2 ${activeTab === tab.id ? 'border-amber-400 text-amber-400 bg-slate-900/50' : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
                    }`}
                >
                  <Icon className="w-4 h-4" /> {tab.label}
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">Primary Payment Card</span>
                  <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-1 rounded">3D Interactive</span>
                </div>

                <Card3D
                  cardNumber={account?.accountNumber}
                  name={account?.ownerName}
                  balance={account?.balance}
                  expiryDate={account?.expiryDate}
                  cvv={account?.cvv}
                  userPin={account?.cardPin}
                  isSample={false}
                />

              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Account Details</h3>
                <div className="flex justify-between items-center pb-2 border-b border-slate-700/60 text-sm">
                  <span className="text-slate-400">Account Number</span>
                  <span className="font-mono font-bold text-white">{account?.accountNumber}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Available Balance</span>
                  <span className="text-lg font-black text-amber-400">${account?.balance ? Number(account.balance).toFixed(2) : '0.00'}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-white">Recent Activity</h3>
                <button onClick={() => setActiveTab('history')} className="text-xs text-amber-400 hover:underline flex items-center gap-1">
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-3">
                {transactions.slice(0, 5).map((tx) => {
                  const isOutgoing = tx.sourceAccount?.accountNumber === account?.accountNumber;
                  return (
                    <div key={tx.id} className="flex justify-between items-center bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/50">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isOutgoing ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          {isOutgoing ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{tx.description || tx.type}</p>
                          <p className="text-[11px] text-slate-400">{new Date(tx.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-bold ${isOutgoing ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {isOutgoing ? '-' : '+'}${parseFloat(tx.amount).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FUND TRANSFER WITH SAVED PAYEES & 2FA */}
        {activeTab === 'transfer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left Column: Transfer Form */}
            <div className="lg:col-span-7 bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl relative">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Send className="w-5 h-5 text-amber-400" /> Secure Instant Transfer (IMPS / NEFT)
              </h2>
              <p className="text-xs text-slate-400 mb-6">Enter beneficiary details. High-value transfers require 2FA verification.</p>

              {message.text && (
                <div className={`p-4 rounded-xl text-xs mb-6 border ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  }`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleInitiateTransfer} className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Target Account Number</label>
                  <input
                    type="text"
                    required
                    value={transferData.targetAccountNumber}
                    onChange={(e) => setTransferData({ ...transferData, targetAccountNumber: e.target.value })}
                    placeholder="e.g. 1009823471"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Amount ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={transferData.amount}
                    onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                    placeholder="0.00"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Remarks / Note</label>
                  <input
                    type="text"
                    value={transferData.description}
                    onChange={(e) => setTransferData({ ...transferData, description: e.target.value })}
                    placeholder="e.g. Invoice #102, Rent"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
                >
                  {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Review & Proceed to 2FA'}
                </button>
              </form>
            </div>

            {/* Right Column: Beneficiary Payees Management */}
            <div className="lg:col-span-5 bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" /> Saved Beneficiaries
                  </h3>
                  <button
                    onClick={() => setShowAddPayeeModal(true)}
                    className="flex items-center gap-1 text-xs bg-slate-700 hover:bg-slate-600 text-amber-400 px-3 py-1.5 rounded-lg border border-amber-500/30 transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Payee
                  </button>
                </div>

                {beneficiaries.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No saved payees yet. Click "Add Payee" to register frequent transfer recipients.</p>
                ) : (
                  <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                    {beneficiaries.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => setTransferData({ ...transferData, targetAccountNumber: b.accountNumber })}
                        className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-xl hover:border-amber-400/50 cursor-pointer transition flex justify-between items-center"
                      >
                        <div>
                          <p className="text-xs font-bold text-white">{b.name}</p>
                          <p className="text-[11px] font-mono text-slate-400">Acc: {b.accountNumber}</p>
                        </div>
                        <span className="text-[10px] bg-slate-800 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded">
                          {b.bankCode}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-700 text-[11px] text-slate-400">
                💡 <strong className="text-slate-300">Quick Tip:</strong> Click any saved beneficiary card above to auto-fill their account number into the transfer form.
              </div>
            </div>

            {/* ADD PAYEE MODAL */}
            {showAddPayeeModal && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
                <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative">
                  <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-400" /> Add New Beneficiary
                    </h3>
                    <button onClick={() => setShowAddPayeeModal(false)} className="text-slate-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {payeeMessage.text && (
                    <div className={`p-3 rounded-xl text-xs border ${payeeMessage.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      }`}>
                      {payeeMessage.text}
                    </div>
                  )}

                  <form onSubmit={handleAddPayee} className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Payee Name</label>
                      <input
                        type="text"
                        required
                        value={payeeForm.name}
                        onChange={(e) => setPayeeForm({ ...payeeForm, name: e.target.value })}
                        placeholder="e.g. Sarah Connor"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Target Account Number</label>
                      <input
                        type="text"
                        required
                        value={payeeForm.accountNumber}
                        onChange={(e) => setPayeeForm({ ...payeeForm, accountNumber: e.target.value })}
                        placeholder="e.g. 1009823471"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Bank Routing / IFSC Code</label>
                      <input
                        type="text"
                        required
                        value={payeeForm.bankCode}
                        onChange={(e) => setPayeeForm({ ...payeeForm, bankCode: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 py-2.5 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl transition"
                    >
                      Save Beneficiary
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* 2FA OTP MODAL POPUP */}
            {showOtpModal && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
                <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
                  <KeyRound className="w-10 h-10 text-amber-400 mx-auto" />
                  <h3 className="text-lg font-bold text-white">Two-Factor Security Authentication</h3>
                  <p className="text-xs text-slate-400">
                    A security code has been generated. For testing, enter the OTP below:
                  </p>

                  <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-lg p-2 rounded-xl">
                    OTP: {generatedOtp}
                  </div>

                  {otpError && <p className="text-xs text-rose-400">{otpError}</p>}

                  <form onSubmit={handleVerifyAndTransfer} className="space-y-3">
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      required
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      className="w-full text-center text-lg font-mono tracking-widest bg-slate-900 border border-slate-700 rounded-xl py-2.5 text-white focus:outline-none focus:border-amber-400"
                    />

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowOtpModal(false)}
                        className="flex-1 py-2.5 text-xs font-semibold bg-slate-700 text-slate-300 rounded-xl hover:bg-slate-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 text-xs font-bold bg-amber-400 text-slate-950 rounded-xl hover:bg-amber-300"
                      >
                        Authorize Payment
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TRANSACTION STATEMENT */}
        {activeTab === 'history' && (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">Full Statement & Audit Logs</h2>
                <p className="text-xs text-slate-400">Complete record of deposits, debits, and transfers</p>
              </div>

              <div className="flex items-center gap-3">
                {/* PDF Download Button */}
                <button
                  onClick={() => generatePdfStatement(account, transactions)}
                  className="flex items-center gap-1.5 text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-3.5 py-2 rounded-xl transition"
                >
                  <Download className="w-4 h-4" /> Export PDF Statement
                </button>

                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search statement..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">Full Statement & Audit Logs</h2>
                <p className="text-xs text-slate-400">Complete record of deposits, debits, and transfers</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search statement..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-900/50 text-slate-400 uppercase font-semibold">
                    <th className="p-3">Transaction ID</th>
                    <th className="p-3">Date & Time</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Type</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {transactions.filter(tx =>
                    tx.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    tx.transactionId?.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map((tx) => {
                    const isOutgoing = tx.sourceAccount?.accountNumber === account?.accountNumber;
                    return (
                      <tr key={tx.id} className="hover:bg-slate-900/30 transition">
                        <td className="p-3 font-mono text-slate-400">{tx.transactionId?.slice(0, 8)}...</td>
                        <td className="p-3 text-slate-300">{new Date(tx.timestamp).toLocaleString()}</td>
                        <td className="p-3 font-semibold text-white">{tx.description || 'N/A'}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isOutgoing ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                            }`}>
                            {isOutgoing ? 'DEBIT' : 'CREDIT'}
                          </span>
                        </td>
                        <td className={`p-3 text-right font-bold text-sm ${isOutgoing ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {isOutgoing ? '-' : '+'}${parseFloat(tx.amount).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: SERVICES & PROFILE */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl mx-auto bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-amber-400" /> Account Services & Security Preferences
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-700/60">
                <span className="text-xs text-slate-400 block">Account Holder</span>
                <span className="text-base font-bold text-white">{account?.ownerName}</span>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-700/60">
                <span className="text-xs text-slate-400 block">Primary Account Number</span>
                <span className="text-base font-mono font-bold text-amber-400">{account?.accountNumber}</span>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-700/60">
                <span className="text-xs text-slate-400 block">KYC Status</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-1">
                  <ShieldCheck className="w-4 h-4" /> VERIFIED (LEVEL 3)
                </span>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-700/60">
                <span className="text-xs text-slate-400 block">Two-Factor Authentication</span>
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1 mt-1">
                  <Lock className="w-4 h-4" /> ENABLED
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-slate-950 border-t border-slate-800 py-6 px-6 text-center text-xs text-slate-500">
        © 2026 APEX Banking Corporation. Encrypted Session Active.
      </footer>

      <ChatBot
        account={account}
        transactions={transactions}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />
    </div>
  );
}