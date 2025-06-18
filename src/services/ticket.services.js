import { ticketDAO } from "../dao/db/TicketDB.dao.js";

export const ticketService = {
  createTicket: async (ticketData) => {
    return await ticketDAO.create(ticketData);
  },
  getAll: async () => await ticketDAO.getAll(),
  getById: async (id) => await ticketDAO.getById(id),
};
