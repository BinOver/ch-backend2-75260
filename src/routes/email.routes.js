import { Router } from "express";
import { sendMailEth } from "../controllers/email.controller.js";

const routerEmail = Router();

routerEmail.post("/send", sendMailEth);

export default routerEmail;
