import { Router } from "express";
import { checkRole } from "../middleware/checkRole.js";
import { userController } from "../controllers/user.controller.js";
import passport from "passport";

const routerSessions = Router();

routerSessions.post("/register", userController.register);
routerSessions.post("/login", userController.login);
routerSessions.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

routerSessions.get(
  "/private-headers",
  passport.authenticate("jwt"),
  (req, res) => res.send(req.user)
);

routerSessions.get(
  "/private-cookies",
  passport.authenticate("jwt_cookies", { session: false }),
  (req, res) => res.send(req.user)
);

routerSessions.get(
  "/private-cookies-admin",
  passport.authenticate("jwt_cookies", { session: false }),
  checkRole("admin"),
  (req, res) => res.send(req.user)
);

routerSessions.get(
  "/current",
  passport.authenticate("jwt_cookies", { session: false }),
  checkRole("user"),
  //(req, res) => res.json(req.user)
  (req, res) => {
    res.status(200).json({
      message: "El usuario se autentico correctamente",
      user: req.user,
    });
  }
);

export default routerSessions;
