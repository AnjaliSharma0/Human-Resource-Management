'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import ChatWindow from '@/app/components/helpdesk/ChatWindow';


let socket: Socket;

export default function ChatPage() {
  const { ticketId } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const userId = 1; // replace with logged-in user

  useEffect(() => {
     if (!ticketId) return;
    socket = io('http://localhost:3001'); // backend URL

    // Load existing messages
    fetchMessages();

    // Listen to incoming messages
    socket.on('receiveMessage', (msg) => {
      if (msg.ticket.id === +ticketId) setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [ticketId]);

  const fetchMessages = async () => {
    const res = await fetch(`http://localhost:3001/helpdesk/tickets/${ticketId}/messages`);
    const data = await res.json();
    setMessages(data);
  };

  const sendMessage = () => {
    if (!newMsg) return;
     if (!ticketId) return;
    socket.emit('sendMessage', { ticketId: +ticketId, senderId: userId, content: newMsg });
    setNewMsg('');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Ticket #{ticketId} Chat</h1>
      <ChatWindow messages={messages} userId={userId} />
      <div className="flex gap-2 mt-4">
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border rounded p-2"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}