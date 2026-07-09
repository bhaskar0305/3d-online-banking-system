import React, { useState } from 'react';
import { Bot, X, Send } from 'lucide-react';

export default function ChatBot({ balance, accountNumber }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your AI Banking Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    
    const query = input.toLowerCase();
    let reply = "I can help with balance inquiries, transfers, and general info. Try asking 'balance' or 'account number'.";

    if (query.includes('balance')) {
      reply = `Your current available balance is $${balance || '0.00'}.`;
    } else if (query.includes('account') || query.includes('number')) {
      reply = `Your primary account number is ${accountNumber || 'N/A'}.`;
    } else if (query.includes('transfer') || query.includes('send')) {
      reply = "To transfer funds, use the 'Quick Transfer' panel on your dashboard and enter the target account number.";
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 600);

    setInput('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-3 rounded-full shadow-2xl hover:scale-105 transition"
        >
          <Bot className="w-6 h-6" />
          <span className="font-semibold">AI Assistant</span>
        </button>
      )}

      {isOpen && (
        <div className="w-80 h-96 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-cyan-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2 font-bold">
              <Bot className="w-5 h-5" />
              <span>Smart Support Bot</span>
            </div>
            <button onClick={() => setIsOpen(false)}><X className="w-5 h-5" /></button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`max-w-[80%] p-3 rounded-xl text-sm ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white ml-auto rounded-br-none'
                    : 'bg-gray-800 text-gray-200 mr-auto rounded-bl-none'
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-gray-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask something..."
              className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            />
            <button onClick={handleSend} className="bg-cyan-500 text-white p-2 rounded-xl">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}