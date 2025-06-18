import { cartDao } from "../dao/db/CartManagerDB.dao.js";
import { productDao } from "../dao/db/ProductDB.dao.js";
import { ticketService } from "./ticket.services.js";

export const cartPurchaseService = {
  async purchaseCart(cartId, userEmail) {
    const cart = await cartDao.getCartById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    const purchasedProducts = [];
    const notPurchasedProducts = [];
    let totalAmount = 0;

    for (const cartItem of cart.products) {
      const dbProduct = await productDao.getById(cartItem.product._id);

      if (!dbProduct) {
        notPurchasedProducts.push(cartItem.product._id);
        continue;
      }

      if (dbProduct.stock >= cartItem.quantity) {
        dbProduct.stock -= cartItem.quantity;
        await dbProduct.save();

        purchasedProducts.push({
          product: dbProduct._id,
          quantity: cartItem.quantity,
        });

        totalAmount += dbProduct.price * cartItem.quantity;
      } else {
        notPurchasedProducts.push(cartItem.product._id);
      }
    }

    let ticket = null;
    if (purchasedProducts.length > 0) {
      ticket = await ticketService.createTicket({
        amount: totalAmount,
        purchaser: userEmail,
        purchase_datetime: new Date(),
        products: purchasedProducts,
      });
    }

    const remainingItems = cart.products.filter((item) =>
      notPurchasedProducts.includes(item.product._id.toString())
    );
    //await cartDao.updateCart(cartId, remainingItems);
    await cartDao.replaceCartProducts(cartId, remainingItems);

    const processedProducts = purchasedProducts.map((item) => ({
      productId: item.product,
      quantity: item.quantity,
    }));

    const notProcessedDetailed = await Promise.all(
      notPurchasedProducts.map(async (prodId) => {
        const product = await productDao.getById(prodId);
        return product ? { _id: product._id, title: product.title } : null;
      })
    );

    return {
      message: ticket
        ? "Compra realizada parcialmente o completamente"
        : "Compra no realizada por falta de stock",
      ticket,
      processedProducts,
      notProcessedProducts: notProcessedDetailed.filter(Boolean),
    };
  },
};
