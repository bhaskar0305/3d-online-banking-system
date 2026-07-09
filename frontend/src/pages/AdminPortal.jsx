import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  ShieldAlert, Users, DollarSign, Activity, Lock, CheckCircle, Search, LogOut, ArrowLeft 
} from 'lucide-react';

export default function AdminPortal({ onBackToDashboard }) {
  const [metrics, setMetrics] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('accounts');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const fetchAdminData = async () => {
    try {
      const metricsRes = await axios.get('http://localhost:8080/api/admin/metrics', authHeaders);
      setMetrics(metricsRes.data);

      const accountsRes = await axios.get('http://localhost:8080/api/admin/accounts', authHeaders);
      setAccounts(accountsRes.data);

      const txRes = await axios.get('http://localhost:8080/api/admin/transactions', authHeaders);
      setTransactions(txRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleStatus = async (accountId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'FROZEN' : 'ACTIVE';
    try {
      await axios.put(`http://localhost:8080/api/admin/accounts/${accountId}/status?status=${newStatus}`, {}, authHeaders);
      fetchAdminData();
    } catch (err) {
      alert('Failed to update account status.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <span className="text-base font-bold text-white tracking-tight">APEX Bank Executive Command Center</span>
        </div>

        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-xl text-slate-300 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Customer Portal
        </button>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex justify-between items-center text-slate-400 mb-2">
              <span className="text-xs uppercase font-semibold">Total Accounts</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-black text-white">{metrics?.totalAccounts || 0}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex justify-between items-center text-slate-400 mb-2">
              <span className="text-xs uppercase font-semibold">System Liquidity</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-amber-400">
              ${metrics?.totalSystemLiquidity ? Number(metrics.totalSystemLiquidity).toFixed(2) : '0.00'}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex justify-between items-center text-slate-400 mb-2">
              <span className="text-xs uppercase font-semibold">Total Audit Log Count</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white">{metrics?.totalTransactionsCount || 0}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex justify-between items-center text-slate-400 mb-2">
              <span className="text-xs uppercase font-semibold">Core Security Status</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-sm font-bold text-emerald-400 mt-2">NOMINAL / SECURE</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('accounts')}
                className={`text-xs font-bold pb-2 border-b-2 transition ${
                  activeTab === 'accounts' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400'
                }`}
              >
                Account Directory ({accounts.length})
              </button>
              <button
                onClick={() => setActiveTab('audit')}
                className={`text-xs font-bold pb-2 border-b-2 transition ${
                  activeTab === 'audit' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400'
                }`}
              >
                Global Audit Stream ({transactions.length})
              </button>
            </div>

            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search records..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* ACCOUNTS DIRECTORY TABLE */}
          {activeTab === 'accounts' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold bg-slate-950/50">
                    <th className="p-3">ID</th>
                    <th className="p-3">Account Number</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Balance</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {accounts.filter(a => a.accountNumber.includes(search)).map((acc) => (
                    <tr key={acc.id} className="hover:bg-slate-950/30 transition">
                      <td className="p-3 font-mono text-slate-500">{acc.id}</td>
                      <td className="p-3 font-mono font-bold text-white">{acc.accountNumber}</td>
                      <td className="p-3 text-slate-300">{acc.accountType}</td>
                      <td className="p-3 font-bold text-amber-400">${Number(acc.balance).toFixed(2)}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          acc.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {acc.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleToggleStatus(acc.id, acc.status)}
                          className={`px-3 py-1 rounded text-[11px] font-semibold transition ${
                            acc.status === 'ACTIVE'
                              ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                              : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                          }`}
                        >
                          {acc.status === 'ACTIVE' ? 'Freeze Account' : 'Unfreeze Account'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* GLOBAL AUDIT STREAM TABLE */}
          {activeTab === 'audit' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold bg-slate-950/50">
                    <th className="p-3">Tx ID</th>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Type</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {transactions.filter(t => t.transactionId?.includes(search)).map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-950/30 transition">
                      <td className="p-3 font-mono text-slate-500">{tx.transactionId?.slice(0, 8)}...</td>
                      <td className="p-3 text-slate-300">{new Date(tx.timestamp).toLocaleString()}</td>
                      <td className="p-3 text-white">{tx.description || 'N/A'}</td>
                      <td className="p-3 font-bold text-cyan-400">{tx.type}</td>
                      <td className="p-3 text-right font-mono font-bold text-amber-400">${Number(tx.amount).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}