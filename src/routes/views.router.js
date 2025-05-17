import { Router } from "express";
import { productDao } from "../dao/db/ProductDB.dao.js";
import { cartDao } from "../dao/db/CartManagerDB.dao.js";

const routerViews = Router();
//const productDAO = new productDAO();
//const cartDao = new cartDAO();

routerViews.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "", query = "" } = req.query;

    const products = await productDao.getProducts({
      limit: parseInt(limit),
      page: parseInt(page),
      sort,
      query,
    });

    const productsDocs = products.docs.map((p) => {
      const { _id, ...rest } = p.toObject();
      return { _id, ...rest };
    });
    console.log(productsDocs);
    res.render("home", {
      products: productsDocs,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      prevLink: products.prevLink,
      nextLink: products.nextLink,
      currentPage: products.page,
      totalPages: products.totalPages,
    });
  } catch (error) {
    res.status(500).send("Error interno del servidor");
  }
});

routerViews.get("/realtimeproducts", async (req, res) => {
  try {
    res.render("realtimeproducts");
  } catch (error) {
    res.status(500).send("Error interno del servidor");
  }
});

routerViews.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartDao.getCartById(cid);
    if (!cart) {
      return res.status(404).send("Carrito no encontrado");
    }
    const cartProducts = cart.products.map((c) => {
      const { _id, ...rest } = c.toObject();
      return rest;
    });

    console.log(cartProducts);

    res.render("cart", {
      cartId: cid,
      products: cartProducts,
    });
  } catch (error) {
    res.status(500).send("Error interno del servidor: " + error);
  }
});

routerViews.get("/login", (req, res) => {
  res.render("login");
});

routerViews.get("/register", (req, res) => {
  res.render("register");
});

routerViews.get("/profile", (req, res) => {
  res.render("profile");
});

export default routerViews;
