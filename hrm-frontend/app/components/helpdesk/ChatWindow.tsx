'use client';
interface ChatWindowProps {
  messages: any[];
  userId: number;
}

export default function ChatWindow({ messages, userId }: ChatWindowProps) {
  return (
    <div className="border rounded-lg p-4 h-80 overflow-y-auto bg-gray-50">
      {messages.map((m, i) => (
        <div
          key={i}
          className={`mb-2 p-2 rounded ${
            m.sender.id === userId ? 'bg-blue-100 self-end text-right' : 'bg-gray-200'
          }`}
        >
          <p className="text-sm font-medium">{m.sender.id === userId ? 'You' : 'HR'}</p>
          <p>{m.content}</p>
        </div>
      ))}
    </div>
  );
}