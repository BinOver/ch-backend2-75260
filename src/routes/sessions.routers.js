import { Router } from "express";
import bcrypt from "bcrypt";
import userModel from "../dao/models/user.model.js";
import { checkRole } from "../middleware/checkRole.js";
import { userController } from "../controllers/user.controller.js";
import passport from "passport";

const routerSessions = Router();

/* routerSessions.post("/register", async (req, res) => {
  const { first_name, last_name, email, password, age } = req.body;
  try {
    const existUser = await userModel.findOne({ email: email });
    if (existUser) {
      return res.status(400).send("El correo electronico ya esta registrado");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const newUser = await userModel.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      age,
    });
    //req.session.user ={...newUser,_doc};
    req.session.user = { ...newUser };
    res.status(200).send("Usuario creado con exito");
  } catch (error) {
    res.status(500).send("Error interno al crear usuario " + error);
  }
});

routerSessions.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email: email });
    console.log(user);
    const validPassword = await bcrypt.compare(password, user.password);
    if (user) {
      if (validPassword) {
        req.session.user = {
          email: user.email,
          age: user.age,
          first_name: user.first_name,
          last_name: user.last_name,
        };
        res.redirect("/profile");
      } else {
        res.status(401).send("Password Incorrecto");
      }
    } else {
      res.status(404).send("Usuario no encontrado");
    }
  } catch (error) {
    res.status(500).send("Error interno al logear usuario");
  }
}); */

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

export default routerSessions;
