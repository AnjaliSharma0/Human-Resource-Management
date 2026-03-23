// // 'use client';
// // import { useEffect, useState } from 'react';
// // import { useParams } from 'next/navigation';
// // import { io, Socket } from 'socket.io-client';
// // import ChatWindow from '@/app/components/helpdesk/ChatWindow';


// // let socket: Socket;

// // export default function ChatPage() {
// //   const { ticketId } = useParams();
// //   const [messages, setMessages] = useState<any[]>([]);
// //   const [newMsg, setNewMsg] = useState('');
// //   const userId = 1; // replace with logged-in user

// //   useEffect(() => {
// //      if (!ticketId) return;
// //     socket = io('http://localhost:5000'); // backend URL

// //     // Load existing messages
// //     fetchMessages();

// //     // Listen to incoming messages
// //     socket.on('receiveMessage', (msg) => {
// //       if (msg.ticket.id === +ticketId) setMessages(prev => [...prev, msg]);
// //     });

// //     return () => {
// //       socket.disconnect();
// //     };
// //   }, [ticketId]);

// //   const fetchMessages = async () => {
// //     const res = await fetch(`http://localhost:5000/helpdesk/tickets/${ticketId}/messages`);
// //     const data = await res.json();
// //     setMessages(data);
// //   };

// //   const sendMessage = () => {
// //     if (!newMsg) return;
// //      if (!ticketId) return;
// //     socket.emit('sendMessage', { ticketId: +ticketId, senderId: userId, content: newMsg });
// //     setNewMsg('');
// //   };

// //   return (
// //     <div className="p-6 max-w-3xl mx-auto">
// //       <h1 className="text-3xl font-bold mb-6">Ticket #{ticketId} Chat</h1>
// //       <ChatWindow messages={messages} userId={userId} />
// //       <div className="flex gap-2 mt-4">
// //         <input
// //           type="text"
// //           value={newMsg}
// //           onChange={(e) => setNewMsg(e.target.value)}
// //           placeholder="Type your message..."
// //           className="flex-1 border rounded p-2"
// //         />
// //         <button
// //           onClick={sendMessage}
// //           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
// //         >
// //           Send
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// 'use client';
// import { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import { io, Socket } from 'socket.io-client';
// import ChatWindow from '@/app/components/helpdesk/ChatWindow';

// interface Message {
//   id?: number;
//   content: string;
//   sender: {
//     id: number;
//     name: string;
//   };
// }

// let socket: Socket;

// export default function ChatPage() {
//   const params = useParams();

//   const ticketId = params?.ticketId
//     ? Array.isArray(params.ticketId)
//       ? params.ticketId[0]
//       : params.ticketId
//     : null;

//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMsg, setNewMsg] = useState('');
//   const [userId, setUserId] = useState<number | null>(null);

//   // ✅ Get userId from localStorage
//   useEffect(() => {
//     const id = localStorage.getItem("userId");
//     if (id) setUserId(Number(id));
//   }, []);

//   // ✅ Socket + load messages
//   useEffect(() => {
//     if (!ticketId) return;

//     socket = io('http://localhost:5000');

//     fetchMessages();

//     socket.on('receiveMessage', (msg: Message & { ticket?: any }) => {
//       if (msg.ticket?.id === Number(ticketId)) {
//         setMessages(prev => [...prev, msg]);
//       }
//     });

//     return () => {
//       socket.off('receiveMessage'); // ✅ prevent duplicate listeners
//       socket.disconnect();
//     };
//   }, [ticketId]);

//   // ✅ Fetch messages
//   const fetchMessages = async () => {
//     if (!ticketId) return;

//     const res = await fetch(
//       `http://localhost:5000/helpdesk/tickets/${ticketId}/messages`
//     );
//     const data = await res.json();
//     setMessages(data);
//   };

//   // ✅ Send message
//   const sendMessage = () => {
//     if (!newMsg || !ticketId || !userId) return;

//     socket.emit('sendMessage', {
//       ticketId: Number(ticketId),
//       senderId: userId,
//       content: newMsg,
//     });

//     setNewMsg('');
//   };

//   // ✅ Handle invalid route
//   if (!ticketId) {
//     return <p className="p-6">Invalid Ticket</p>;
//   }

//   return (
//     <div className="p-6 max-w-3xl mx-auto flex flex-col h-[90vh]">
//       <h1 className="text-3xl font-bold mb-4">
//         Ticket #{ticketId} Chat
//       </h1>

//       {/* Chat Window */}
//       <div className="flex-1 overflow-hidden">
//         <ChatWindow messages={messages} userId={userId || 0} />
//       </div>

//       {/* Input */}
//       <div className="flex gap-2 mt-4">
//         <input
//           type="text"
//           value={newMsg}
//           onChange={(e) => setNewMsg(e.target.value)}
//           placeholder="Type your message..."
//           className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />

//         <button
//           onClick={sendMessage}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { io } from 'socket.io-client';
import useAuth from '@/app/src/hook/useAuth';


let socket: any;

export default function ChatPage() {
  const { ticketId } = useParams();
  const user = useAuth();

  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState('');

  useEffect(() => {
    if (!ticketId || !user) return;

    socket = io('http://localhost:5000');

    socket.emit('joinTicket', Number(ticketId));

    fetchMessages();

    socket.on('receiveMessage', (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.disconnect();
  }, [ticketId, user]);

  const fetchMessages = async () => {
    const res = await fetch(`http://localhost:5000/helpdesk/tickets/${ticketId}/messages`);
    const data = await res.json();
    setMessages(data);
    console.log(data)
  };

  const sendMessage = () => {
    if (!newMsg || !user) return;

    socket.emit('sendMessage', {
      ticketId: Number(ticketId),
      senderId: user.id,
      content: newMsg,
    });
 
    setNewMsg('');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Chat</h1>

      <div className="h-[400px] overflow-y-auto border rounded p-3 mb-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-2 ${m.sender?.id === user?.id ? 'text-right' : ''}`}
          >
            <div className="text-xs text-gray-500">
              {m.sender?.firstname || 'Unknown'}
            </div>

            <div className="inline-block bg-blue-100 px-3 py-2 rounded">
              {m.content}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4 rounded">
          Send
        </button>
      </div>
    </div>
  );
}