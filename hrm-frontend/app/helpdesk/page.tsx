'use client';

import { useEffect, useState } from 'react';
import useAuth from '@/app/src/hook/useAuth';
import { getTickets, getAllTickets, getFAQs } from '@/app/src/services/helpdesk';

import Sidebar from '@/app/components/helpdesk/Sidebar';
import ChatPanel from '@/app/components/helpdesk/ChatPanel';
import CreateTicketModal from '@/app/components/helpdesk/ChatModel';

export default function HelpdeskPage() {
  const user = useAuth();

  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [view, setView] = useState<'tickets' | 'faq'>('tickets');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadTickets();
      loadFAQs();
    }
  }, [user]);

  const loadTickets = async () => {
    let res;

    if (user!.role === 'admin' || user!.role === 'manager') {
      res = await getAllTickets();
    } else {
      res = await getTickets(user!.id);
    }

    setTickets(res.data);
  };

  const loadFAQs = async () => {
    const res = await getFAQs();
    setFaqs(res.data);
  };

  if (!user) return null;

  return (
    <div className="flex h-screen">

      {/* 🔹 LEFT SIDEBAR */}
      <Sidebar
        tickets={tickets}
        onSelect={(t: any) => {
          setSelectedTicket(t);
          setView('tickets');
        }}
        onCreate={() => setOpen(true)}
        role={user.role}
      />

      {/* 🔹 RIGHT CONTENT */}
      <div className="flex-1 flex flex-col">

        {/* 🔝 TOP BAR */}
        <div className="flex justify-between items-center p-3 border-b bg-gray-50">

          <div className="flex gap-3">
            <button
              onClick={() => setView('tickets')}
              className={`px-3 py-1 rounded ${
                view === 'tickets' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              Tickets
            </button>

            <button
              onClick={() => setView('faq')}
              className={`px-3 py-1 rounded ${
                view === 'faq' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              FAQs
            </button>
          </div>

        </div>

        {/* 💬 CHAT VIEW */}
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

        {/* ❓ FAQ VIEW */}
        {view === 'faq' && (
          <div className="p-6 overflow-y-auto">

            <h2 className="text-2xl font-bold mb-4">FAQs</h2>

            <div className="space-y-4">
              {faqs.map((f) => (
                <div key={f.id} className="border p-4 rounded shadow-sm">
                  <h3 className="font-semibold">{f.question}</h3>
                  <p className="text-gray-600 mt-2">{f.answer}</p>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>

      {/* ➕ CREATE TICKET MODAL */}
      <CreateTicketModal
        open={open}
        onClose={() => setOpen(false)}
        user={user}
        reload={loadTickets}
      />

    </div>
  );
}