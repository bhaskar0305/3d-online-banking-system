import React, { useState } from 'react';
import { Bot, X, Send, Download, Sparkles } from 'lucide-react';
import { generatePdfStatement } from '../utils/pdfGenerator';

export default function ChatBot({ account, transactions, onNavigateTab, onPrefillTransfer }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your APEX Smart Banking Action Assistant. Ask me anything or command me to navigate or download statements!' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userText = input;
    const userMsg = { sender: 'user', text: userText };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    const query = userText.toLowerCase();
    let reply = "I can help you check balances, download statements, or jump between tabs. Try asking 'Download statement' or 'Transfer $100'.";

    // Intent 1: Download Statement
    if (query.includes('statement') || query.includes('pdf') || query.includes('download')) {
      reply = "Generating your official PDF account statement now...";
      setTimeout(() => {
        generatePdfStatement(account, transactions);
      }, 800);
    } 
    // Intent 2: Check Balance
    else if (query.includes('balance') || query.includes('how much')) {
      reply = `Your current available balance is $${Number(account?.balance || 0).toFixed(2)}.`;
    } 
    // Intent 3: Navigate to Fund Transfer / Pre-fill
    else if (query.includes('transfer') || query.includes('send money')) {
      if (onNavigateTab) onNavigateTab('transfer');
      reply = "Taking you to the Fund Transfer tab now!";
    } 
    // Intent 4: View History
    else if (query.includes('history') || query.includes('transactions')) {
      if (onNavigateTab) onNavigateTab('history');
      reply = "Switched to your full transaction history statement!";
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold px-5 py-3 rounded-full shadow-2xl hover:scale-105 transition"
        >
          <Bot className="w-5 h-5" />
          <span className="text-xs tracking-wide">AI Action Bot</span>
        </button>
      )}

      {isOpen && (
        <div className="w-80 h-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-slate-800 p-4 flex justify-between items-center text-white border-b border-slate-700">
            <div className="flex items-center gap-2 font-bold text-xs text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>APEX Smart Action Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Action Pills */}
          <div className="bg-slate-950 px-3 py-2 border-b border-slate-800 flex gap-2 overflow-x-auto text-[10px]">
            <button
              onClick={() => generatePdfStatement(account, transactions)}
              className="bg-slate-800 hover:bg-slate-700 text-amber-400 px-2.5 py-1 rounded-lg border border-amber-500/30 flex items-center gap-1 whitespace-nowrap"
            >
              <Download className="w-3 h-3" /> PDF Statement
            </button>
            <button
              onClick={() => onNavigateTab && onNavigateTab('transfer')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 whitespace-nowrap"
            >
              Transfer Funds
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`max-w-[85%] p-3 rounded-xl text-xs ${
                  m.sender === 'user'
                    ? 'bg-amber-400 text-slate-950 font-semibold ml-auto rounded-br-none'
                    : 'bg-slate-800 text-slate-200 border border-slate-700 mr-auto rounded-bl-none'
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type command..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
            <button onClick={handleSend} className="bg-amber-400 text-slate-950 p-2 rounded-xl">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}