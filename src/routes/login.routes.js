import express from "express";
import userModel from "../dao/models/user.model.js";
const routerLogin = new express.Router();

routerLogin.get("/login", async (req, res) => {
  try {
    const email = req.query.user;

    const user = await userModel.findOne({ email }).populate("cart");
    console.log("routerLogin.get.user: ", user);

    if (!user) return res.status(404).send("Usuario no encontrado");

    res.redirect("/");
  } catch (error) {
    console.error("Error en el login", error);
    res.status(500).json({ error: "Error en el login" });
  }
});

export default routerLogin;
