'use client';
import { useEffect, useState } from 'react';

import { Button, TextField } from '@mui/material';
import api from '../src/services/api';
import TicketCard from '../components/helpdesk/TicketCard';

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [subject, setSubject] = useState('');
  const userId = 1; // replace with logged-in user

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = () => {
    api.get(`/helpdesk/tickets/user/${userId}`).then(res => setTickets(res.data));
  };

  const createTicket = async () => {
    if (!subject) return;
    await api.post('/helpdesk/tickets', { userId, subject });
    setSubject('');
    loadTickets();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Tickets</h1>

      <div className="flex gap-2 mb-6">
        <TextField
          label="New Ticket Subject"
          variant="outlined"
          size="small"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="flex-1"
        />
        <Button variant="contained" color="primary" onClick={createTicket}>
          Submit
        </Button>
      </div>

      <div className="grid gap-4">
        {tickets.map((t: any) => (
          <TicketCard key={t.id} ticket={t} />
        ))}
      </div>
    </div>
  );
}