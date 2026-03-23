'use client';

import { useEffect, useState } from 'react';
import useAuth from '@/app/src/hook/useAuth';
import {
  getAllTickets,
  getFAQs,
  createFAQ,
} from '@/app/src/services/helpdesk';

import ChatPanel from '@/app/components/helpdesk/ChatPanel';

export default function AdminHelpdesk() {
  const user = useAuth();

  const [view, setView] = useState<'tickets' | 'faq'>('tickets');

  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const [faqs, setFaqs] = useState<any[]>([]);
  const [question, setQ] = useState('');
  const [answer, setA] = useState('');

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'manager')) {
      loadTickets();
      loadFAQs();
    }
  }, [user]);

  const loadTickets = async () => {
    const res = await getAllTickets();
    setTickets(res.data);
  };

  const loadFAQs = async () => {
    const res = await getFAQs();
    setFaqs(res.data);
  };

  const handleCreateFAQ = async () => {
    if (!question || !answer) return;

    await createFAQ({ question, answer });
    setQ('');
    setA('');
    loadFAQs();
  };

  if (!user) return null;

  if (user.role !== 'admin' && user.role !== 'manager') {
    return <p className="p-6 text-red-500">Access Denied</p>;
  }

  return (
    <div className="flex h-screen">

      {/* 🔹 LEFT: Ticket List */}
      <div className="w-1/3 border-r p-4 overflow-y-auto">

        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setView('tickets')}
            className={`px-4 py-2 rounded-xl border transition-all duration-200 
                ${view === 'tickets'
                ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}
          >
            Tickets
          </button>

          <button
            onClick={() => setView('faq')}
            className={`px-4 py-2 rounded-xl border transition-all duration-200 
                ${view === 'faq'
                ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}
          >
            FAQ
          </button>
        </div>

        {/* 🎫 Ticket List */}
        {view === 'tickets' &&
          tickets.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedTicket(t)}
              className={`p-4 mb-3 rounded-xl border cursor-pointer transition-all duration-200
        ${selectedTicket?.id === t.id
                  ? 'bg-blue-50 border-blue-400 shadow-md'
                  : 'bg-white border-gray-200 hover:shadow-md hover:border-gray-300'
                }`}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">
                  {t.subject}
                </h3>

                {/* Status Badge */}
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium
            ${t.status === 'open'
                      ? 'bg-green-100 text-green-600'
                      : t.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                >
                  {t.status}
                </span>
              </div>

              <p className="text-sm text-gray-500 mt-1">
                Ticket #{t.id}
              </p>
            </div>
          ))}
        

        {/* ❓ FAQ Create */}
        {/* {view === 'faq' && (
          <>
            <input
              value={question}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Question"
              className="w-full border p-2 mb-2"
            />

            <textarea
              value={answer}
              onChange={(e) => setA(e.target.value)}
              placeholder="Answer"
              className="w-full border p-2 mb-2"
            />

            <button
              onClick={handleCreateFAQ}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Create FAQ
            </button>

            <div className="mt-4 space-y-2">
              {faqs.map((f) => (
                <div key={f.id} className="border p-2 rounded">
                  {f.question}
                </div>
              ))}
            </div>
          </>
        )} */}

        {view === 'faq' && (
  <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-200">

    {/* Title */}
    <h2 className="text-lg font-semibold text-gray-800 mb-4">
      Create FAQ
    </h2>

    {/* Question Input */}
    <input
      value={question}
      onChange={(e) => setQ(e.target.value)}
      placeholder="Enter question..."
      className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-xl 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 
                 transition-all duration-200"
    />

    {/* Answer Input */}
    <textarea
      value={answer}
      onChange={(e) => setA(e.target.value)}
      placeholder="Write answer..."
      rows={4}
      className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-xl 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 
                 transition-all duration-200 resize-none"
    />

    {/* Button */}
    <button
      onClick={handleCreateFAQ}
      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 
                 rounded-xl shadow-sm transition-all duration-200"
    >
      + Create FAQ
    </button>

    {/* FAQ List */}
    <div className="mt-6 space-y-3">
      {faqs.map((f) => (
        <div
          key={f.id}
          className="p-4 border border-gray-200 rounded-xl bg-gray-50 
                     hover:shadow-sm transition-all duration-200"
        >
          <p className="font-medium text-gray-800">
            {f.question}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {f.answer}
          </p>
        </div>
      ))}
    </div>
  </div>
)}

      </div>

      {/* 🔹 RIGHT: CHAT PANEL */}
      <div className="flex-1">

        {view === 'tickets' && (
          <>
            {selectedTicket ? (
              <ChatPanel ticket={selectedTicket} user={user} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Select a ticket
              </div>
            )}
          </>
        )}

        {view === 'faq' && (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">FAQs</h2>

            {faqs.map((f) => (
              <div key={f.id} className="mb-3">
                <h3 className="font-semibold">{f.question}</h3>
                <p>{f.answer}</p>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}