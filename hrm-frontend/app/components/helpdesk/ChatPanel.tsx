'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

let socket: any;

export default function ChatPanel({ ticket, user }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState('');

  useEffect(() => {
    socket = io('http://localhost:5000');

    socket.emit('joinTicket', ticket.id);

    fetchMessages();

    socket.on('receiveMessage', (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.disconnect();
  }, [ticket]);

  const fetchMessages = async () => {
    const res = await fetch(
      `http://localhost:5000/helpdesk/tickets/${ticket.id}/messages`
    );
    const data = await res.json();
    setMessages(data);
  };

  const sendMessage = () => {
    if (!newMsg) return;

    socket.emit('sendMessage', {
      ticketId: ticket.id,
      senderId: user.id,
      content: newMsg,
    });

    setNewMsg('');
  };

  return (
    <div className="flex flex-col h-full">

      {/* 🔝 Header */}
      <div className="p-4 border-b bg-gray-50 flex justify-between">
        <div className='border-none shadow-md p-3'>
          <h2 className="font-bold">{ticket.subject}</h2>
          <span className="text-sm text-gray-900 ">
            Status: {ticket.status}
          </span>
        </div>
      </div>

      {/* 💬 Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.sender?.id === user.id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div>
              <div className="text-sm text-gray-500">
                {m.sender?.name}
              </div>

              <div className="bg-blue-100 px-3 py-2 rounded-lg max-w-xs">
                💬 {m.content}
              </div>
            </div>
          </div>
        ))}
         {/* ✍️ Input */}
      <div className="p-3 flex gap-2 w-full px-4 py-2 border border-gray-200 rounded-xl shadow-sm 
                      bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                      transition-all duration-200">
        <input
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          className="flex-1 border rounded p-2"
          placeholder="Type message..."
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Send
        </button>
      </div>

     
      </div>
      {(user.role === 'admin' || user.role === 'manager') && (
  <select 
    onChange={async (e) => {
      await fetch(`http://localhost:5000/helpdesk/tickets/${ticket.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: e.target.value }),
            });
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm 
                      bg-white text-gray-700 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                      transition-all duration-200"
              defaultValue={ticket.status}
            >
              <option value="open">Open</option>
              <option value="pending">Pending</option>
              <option value="closed">Closed</option>
            </select>
          )}
    </div>
  );
}