import { Router } from "express";
import { checkRole } from "../middleware/checkRole.js";
import { userController } from "../controllers/user.controller.js";
import passport from "passport";

const routerSessions = Router();

routerSessions.post("/register", userController.register);
routerSessions.post("/login", userController.login);

routerSessions.get(
  "/private-headers",
  passport.authenticate("jwt"),
  (req, res) => res.send(req.user)
);

routerSessions.get(
  "/private-cookies",
  passport.authenticate("jwt_cookies"),
  (req, res) => res.send(req.user)
);

routerSessions.get(
  "/private-cookies-admin",
  passport.authenticate("jwt_cookies"),
  checkRole("admin"),
  (req, res) => res.send(req.user)
);

routerSessions.get(
  "/current",
  passport.authenticate("jwt_cookies", { session: false }),
  checkRole("admin"),
  (req, res) => res.json(req.user)
);

export default routerSessions;
