import { Router } from 'express';
import { handleTicketChat, getTickets, updateTicket } from '../controllers/tickets.controller';

const router = Router();

// /api/v1/tickets
router.get('/', getTickets);
router.patch('/:id', updateTicket);
router.post('/chat', handleTicketChat);

export default router;
