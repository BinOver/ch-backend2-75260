import { TicketModel } from "../models/ticket.model.js";

export class TicketDAO {
  async create(ticketData) {
    const createdTicket = await TicketModel.create(ticketData);
    return await TicketModel.findById(createdTicket._id).populate(
      "products.product"
    );
  }

  async getAll() {
    return await TicketModel.find();
  }

  async getById(id) {
    return await TicketModel.findById(id);
  }
}

export const ticketDAO = new TicketDAO();
