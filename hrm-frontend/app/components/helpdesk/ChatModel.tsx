'use client';

import { useState } from 'react';
import { createTicket } from '@/app/src/services/helpdesk';

export default function CreateTicketModal({ open, onClose, user, reload }: any) {
  const [subject, setSubject] = useState('');

  const handleSubmit = async () => {
    if (!subject) return;

    await createTicket({
      userId: user.id,
      subject,
    });

    setSubject('');
    reload();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-[400px]">

        <h2 className="text-xl font-bold mb-4">Create Ticket</h2>

        <input
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border p-2 mb-4"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>

      </div>
    </div>
  );
}