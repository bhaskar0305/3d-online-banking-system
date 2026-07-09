import React, { useEffect, useState, useCallback } from 'react';
import { getAccount, getTransactions, transferMoney } from '../services/api';
import Card3D from '../components/Card3D';
import ChatBot from '../components/ChatBot';
import { Send, ArrowUpRight, ArrowDownLeft, LogOut, ShieldCheck, RefreshCw } from 'lucide-react';

export default function Dashboard({ onLogout }) {
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [transferData, setTransferData] = useState({ targetAccountNumber: '', amount: '', description: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

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
      fetchData(); // Refresh balance and transaction list
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data || 'Transfer failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-slate-950">
              SBI
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Digital Banking</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-sm text-slate-400 hidden sm:inline">
              Welcome back, <strong className="text-white">{account?.ownerName}</strong>
            </span>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-sm bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-slate-300 transition"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: 3D Card & Balance Overview */}
        <section className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs uppercase font-semibold text-cyan-400 tracking-wider">Virtual Debit Card</span>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            
            {/* 3D Interactive Card */}
            <Card3D
              cardNumber={account?.accountNumber}
              name={account?.ownerName}
              balance={account?.balance}
            />

            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-sm">
              <span className="text-slate-400">Account Type</span>
              <span className="font-semibold text-slate-200">{account?.accountType} SAVINGS</span>
            </div>
          </div>
        </section>

        {/* Middle Column: Money Transfer Panel */}
        <section className="lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-full">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Send className="w-5 h-5 text-cyan-400" /> Instant Money Transfer
            </h2>

            {message.text && (
              <div className={`p-3 rounded-xl text-xs mb-4 border ${
                message.type === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleTransfer} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Target Account Number</label>
                <input
                  type="text"
                  required
                  value={transferData.targetAccountNumber}
                  onChange={(e) => setTransferData({ ...transferData, targetAccountNumber: e.target.value })}
                  placeholder="e.g. 1009823471"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={transferData.amount}
                  onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Description / Remarks</label>
                <input
                  type="text"
                  value={transferData.description}
                  onChange={(e) => setTransferData({ ...transferData, description: e.target.value })}
                  placeholder="Rent, Payment, etc."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Confirm Transfer'}
              </button>
            </form>
          </div>
        </section>

        {/* Right Column: Transaction History */}
        <section className="lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-full flex flex-col">
            <h2 className="text-lg font-bold text-white mb-4">Recent Transactions</h2>
            
            <div className="flex-1 overflow-y-auto space-y-3 max-h-[380px] pr-2">
              {transactions.length === 0 ? (
                <p className="text-slate-500 text-sm">No recent transactions found.</p>
              ) : (
                transactions.map((tx) => {
                  const isOutgoing = tx.sourceAccount?.accountNumber === account?.accountNumber;
                  return (
                    <div key={tx.id} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isOutgoing ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          {isOutgoing ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{tx.description || tx.type}</p>
                          <p className="text-xs text-slate-500">{new Date(tx.timestamp).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-bold ${isOutgoing ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {isOutgoing ? '-' : '+'}${parseFloat(tx.amount).toFixed(2)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Floating AI Support Bot */}
      <ChatBot balance={account?.balance} accountNumber={account?.accountNumber} />
    </div>
  );
}