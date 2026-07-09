import React, { useEffect, useState, useCallback } from 'react';
import { getAccount, getTransactions, transferMoney } from '../services/api';
import Card3D from '../components/Card3D';
import ChatBot from '../components/ChatBot';
import { 
  Send, ArrowUpRight, ArrowDownLeft, LogOut, ShieldCheck, RefreshCw, 
  LayoutDashboard, History, User, Lock, HelpCircle, FileText, ChevronRight, Search 
} from 'lucide-react';

export default function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'transfer' | 'history' | 'profile'
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [transferData, setTransferData] = useState({ targetAccountNumber: '', amount: '', description: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTransfer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

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

  const filteredTransactions = transactions.filter(tx => 
    tx.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.transactionId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* 1. Portal Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-black text-slate-950 text-lg shadow-md shadow-amber-500/20">
              S
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">APEX DIGITAL BANKING</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Session Secure (TLS 1.3)</span>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-400">Welcome,</p>
              <p className="text-sm font-bold text-amber-400">{account?.ownerName || 'Valued Member'}</p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-xs bg-slate-700 hover:bg-slate-600 px-3.5 py-2 rounded-xl text-slate-200 transition"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* 2. Primary Navigation Bar */}
        <nav className="bg-slate-950/80 border-t border-slate-800 px-6">
          <div className="max-w-7xl mx-auto flex gap-2">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
              { id: 'transfer', label: 'Fund Transfer', icon: Send },
              { id: 'history', label: 'Transaction History', icon: History },
              { id: 'profile', label: 'Services & Profile', icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition border-b-2 ${
                    activeTab === tab.id
                      ? 'border-amber-400 text-amber-400 bg-slate-900/50'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {tab.label}
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Main Tab View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        
        {/* --- TAB 1: OVERVIEW --- */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 3D Card Column */}
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
                />
              </div>

              {/* Account Summary Widget */}
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Account Details</h3>
                <div className="flex justify-between items-center pb-2 border-b border-slate-700/60 text-sm">
                  <span className="text-slate-400">Account Number</span>
                  <span className="font-mono font-bold text-white">{account?.accountNumber}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-700/60 text-sm">
                  <span className="text-slate-400">Account Type</span>
                  <span className="font-bold text-emerald-400">{account?.accountType} SAVINGS</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Available Balance</span>
                  <span className="text-lg font-black text-amber-400">${account?.balance ? Number(account.balance).toFixed(2) : '0.00'}</span>
                </div>
              </div>
            </div>

            {/* Right Overview Quick Stats */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
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
          </div>
        )}

        {/* --- TAB 2: FUND TRANSFER --- */}
        {activeTab === 'transfer' && (
          <div className="max-w-2xl mx-auto bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Send className="w-5 h-5 text-amber-400" /> Instant Money Transfer (IMPS / NEFT)
            </h2>
            <p className="text-xs text-slate-400 mb-6">Transfer funds securely to any registered APEX bank account number.</p>

            {message.text && (
              <div className={`p-4 rounded-xl text-xs mb-6 border ${
                message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleTransfer} className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Beneficiary Account Number</label>
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
                <label className="text-xs font-semibold text-slate-300 block mb-1">Payment Remarks / Purpose</label>
                <input
                  type="text"
                  value={transferData.description}
                  onChange={(e) => setTransferData({ ...transferData, description: e.target.value })}
                  placeholder="e.g. Monthly Rent, Medical, Vendor Payment"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Authorize & Execute Transfer'}
              </button>
            </form>
          </div>
        )}

        {/* --- TAB 3: TRANSACTION HISTORY --- */}
        {activeTab === 'history' && (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
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
                  {filteredTransactions.map((tx) => {
                    const isOutgoing = tx.sourceAccount?.accountNumber === account?.accountNumber;
                    return (
                      <tr key={tx.id} className="hover:bg-slate-900/30 transition">
                        <td className="p-3 font-mono text-slate-400">{tx.transactionId?.slice(0, 8)}...</td>
                        <td className="p-3 text-slate-300">{new Date(tx.timestamp).toLocaleString()}</td>
                        <td className="p-3 font-semibold text-white">{tx.description || 'N/A'}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isOutgoing ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
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

        {/* --- TAB 4: SERVICES & PROFILE --- */}
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

      {/* Corporate Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-6 px-6 text-center text-xs text-slate-500">
        © 2026 APEX Banking Corporation. Encrypted Session Active.
      </footer>

      {/* Floating AI Support Bot */}
      <ChatBot balance={account?.balance} accountNumber={account?.accountNumber} />
    </div>
  );
}