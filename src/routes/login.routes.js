import express from "express";

const routerLogin = new express.Router();

routerLogin.get("/login", (req, res) => {
  try {
    let user = req.query.user;
    req.session.user = user;
    res.send("El usuario fue guardado");
  } catch (error) {
    console.error("Error en el logging de usuario", error);
    res.status(500).json({ error: "Error en el logging de usuario" });
  }
});

export default routerLogin;
