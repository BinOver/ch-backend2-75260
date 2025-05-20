import express from "express";
import { cartService } from "../services/cart.service.js";
import passport from "passport";
import { checkRole } from "../middleware/checkRole.js";
import { cartPurchaseService } from "../services/cartPurchase.service.js";

const routerCarts = express.Router();

routerCarts.post("/", async (req, res) => {
  try {
    const newCart = await cartService.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    console.error("Error al crear nuevo carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

routerCarts.get("/:cid", async (req, res) => {
  try {
    const cart = await cartService.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart.products);
  } catch (error) {
    console.error("Error al obtener el carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

routerCarts.put(
  "/:cid",
  passport.authenticate("jwt_cookies", { session: false }),
  checkRole("user"),
  async (req, res) => {
    try {
      const updatedCart = await cartService.updateCart(
        req.params.cid,
        req.body
      );
      res.json(updatedCart.products);
    } catch (error) {
      console.error("Error al actualizar el carrito", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);

routerCarts.post(
  "/:cid/products/:pid",
  passport.authenticate("jwt_cookies", { session: false }),
  checkRole("user"),
  async (req, res) => {
    try {
      const quantity = req.body.quantity || 1;
      const updatedCart = await cartService.insertProductToCart(
        req.params.cid,
        req.params.pid,
        quantity
      );
      res.json(updatedCart.products);
    } catch (error) {
      console.error("Error al agregar producto al carrito", error);
      res.status(500).json({
        error:
          "Error interno del servidor al intentar agregar productos al carro",
      });
    }
  }
);

routerCarts.put(
  "/:cid/products/:pid",
  passport.authenticate("jwt_cookies", { session: false }),
  checkRole("user"),
  async (req, res) => {
    try {
      const quantity = Number(req.body.quantity) || 1;
      if (isNaN(quantity) || quantity < 1) {
        quantity = 1;
      }
      const updatedCart = await cartService.insertProductToCart(
        req.params.cid,
        req.params.pid,
        quantity
      );
      res.json(updatedCart.products);
    } catch (error) {
      console.error("Error al actualizar producto del carrito", error);
      res.status(500).json({
        error:
          "Error interno del servidor el intentar sumar un producto al carro",
      });
    }
  }
);

routerCarts.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const updatedCart = await cartService.deleteProductFromCart(
      req.params.cid,
      req.params.pid
    );
    res.json(updatedCart.products);
  } catch (error) {
    console.error("Error al eliminar producto del carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

routerCarts.delete("/:cid", async (req, res) => {
  try {
    const emptiedCart = await cartService.emptyCart(req.params.cid);
    res.json(emptiedCart.products);
  } catch (error) {
    console.error("Error al vaciar el carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//Finalizar compra
routerCarts.post(
  "/:cid/purchase",
  passport.authenticate("jwt_cookies", { session: false }),
  checkRole("user"),
  async (req, res) => {
    try {
      const result = await cartPurchaseService.purchaseCart(
        req.params.cid,
        req.user.email
      );
      res.json(result);
    } catch (error) {
      console.error("Error al finalizar la compra: ", error);
      res.status(500).json({ error: "Error al finalizar la compra." });
    }
  }
);

export default routerCarts;
