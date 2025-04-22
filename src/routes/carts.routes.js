import express from "express";
//import { CartManager } from "../dao/fs/CartManager.js"
import CartManager from "../dao/db/CartManager-db.js";

const routerCarts = express.Router();
const cartManager = new CartManager();

routerCarts.post("/", async (req,res) => {
    try {
        const newCart = await cartManager.createCart();
        res.json(newCart);
    } catch (error) {
        console.error ("Error al crear nuevo carrito", error);
        res.status(500).json({ error: "Error internio del servidor" });
    }
});

routerCarts.get("/:cid", async (req,res) => {
    const cartId = req.params.cid;
    try {
        const cart = await cartManager.getCartById(cartId);
        res.json(cart.products);
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
});

routerCarts.put("/:cid", async (req,res) => {
    const cartId = req.params.cid;
    const products = req.body;
    try {
        const cart = await cartManager.updateCart(cartId, products);
        res.json(cart.products);
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
});


routerCarts.post("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;
    try {
        const updateCart = await cartManager.insertProductToCart(cartId,productId,quantity);
        res.json(updateCart.products);
    } catch (error) {
        console.error("Error al agregar un producto al carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

routerCarts.put("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;
    try {
        const updateCart = await cartManager.insertProductToCart(cartId,productId,quantity);
        res.json(updateCart.products);
    } catch (error) {
        console.error("Error al agregar un producto al carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

routerCarts.delete('/:cid/products/:pid', async (req,res) =>{
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try {
        const deleteCartProduct = await cartManager.deleteCartProductByPID(cartId,productId);
        res.json(deleteCartProduct.products);
    } catch (error) {
        console.error("Error al borrar producto del carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }

} );
routerCarts.delete('/:cid',async (req,res) =>{
    const cartId = req.params.cid;
    try {
        const deleteCart = await cartManager.deleteCartByCID(cartId);
        res.json(deleteCart.products); 
    } catch (error) {
        console.error("Error al borrar producto del carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });  
    }
} );

export default routerCarts;