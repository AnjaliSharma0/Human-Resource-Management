import api from './api';

export const getTickets = (userId: number) =>
  api.get(`/helpdesk/tickets/user/${userId}`);

export const createTicket = (data: any) =>
  api.post('/helpdesk/tickets', data);

export const getMessages = (ticketId: number) =>
  api.get(`/helpdesk/tickets/${ticketId}/messages`);

export const getFAQs = () =>
  api.get('/helpdesk/faqs');

export const createFAQ = (data: any) =>
  api.post('/helpdesk/faqs', data);

export const getAllTickets = () =>
  api.get('/helpdesk/tickets');