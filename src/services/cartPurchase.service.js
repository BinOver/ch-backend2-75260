import { cartDao } from "../dao/db/CartManagerDB.dao.js";
import { productDao } from "../dao/db/ProductDB.dao.js";
import { ticketService } from "./ticket.services.js";

export const cartPurchaseService = {
  async purchaseCart(cartId, userEmail) {
    const cart = await cartDao.getCartById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    const productsToPurchase = [];
    const productsNotAvailable = [];
    let totalAmount = 0;

    for (const item of cart.products) {
      const product = await productDao.getProductById(item.product._id);
      if (product && product.stock >= item.quantity) {
        // Restar stock
        product.stock -= item.quantity;
        await productDao.updateProduct(product._id, product);

        totalAmount += product.price * item.quantity;
        productsToPurchase.push(item);
      } else {
        productsNotAvailable.push(item);
      }
    }

    if (productsToPurchase.length === 0) {
      return {
        message: "No hay productos con stock suficiente",
        productsNotAvailable,
      };
    }

    // Crear ticket
    const ticket = await ticketService.createTicket({
      amount: totalAmount,
      purchaser: userEmail,
    });

    // Vaciar el carrito sólo de los productos comprados
    cart.products = productsNotAvailable;
    await cartDao.updateCart(cartId, cart.products);

    return {
      message: "Compra realizada con éxito",
      ticket,
      productsNotAvailable,
    };
  },
};
