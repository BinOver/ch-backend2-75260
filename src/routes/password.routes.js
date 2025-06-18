import { Router } from "express";
import {
  requestReset,
  resetPasswordForm,
  submitNewPassword,
} from "../controllers/password.controller.js";

const routerPassword = Router();

routerPassword.post("/request-reset", requestReset);
routerPassword.get("/reset/:token", resetPasswordForm);
routerPassword.post("/reset/:token", submitNewPassword);

export default routerPassword;
