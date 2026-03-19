'use client';
import Link from 'next/link';

interface TicketCardProps {
  ticket: { id: number; subject: string; status: string };
}

export default function TicketCard({ ticket }: TicketCardProps) {
  const statusColor = {
    open: 'bg-green-100 text-green-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    closed: 'bg-gray-100 text-gray-800',
  }[ticket.status] || 'bg-gray-100 text-gray-800';

  return (
    <Link href={`/helpdesk/chat/${ticket.id}`} className="block border rounded-lg p-4 shadow hover:shadow-lg transition duration-200">
      <div className="flex justify-between items-center">
        <p className="font-medium text-lg">{ticket.subject}</p>
        <span className={`px-2 py-1 rounded text-sm font-semibold ${statusColor}`}>{ticket.status}</span>
      </div>
    </Link>
  );
}