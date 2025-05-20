import { Schema, model } from "mongoose";
import { nanoid } from "nanoid";

export const ticketSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    default: () => nanoid(10),
  },
  purchase_datetime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  },
});

export const TicketModel = model("Ticket", ticketSchema);
