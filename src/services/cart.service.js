import { cartDao } from "../dao/db/CartManagerDB.dao.js";

export const cartService = {
  createCart: async () => {
    return await cartDao.createCart();
  },

  getCartById: async (cartId) => {
    return await cartDao.getCartById(cartId);
  },

  insertProductToCart: async (cartId, productId, quantity = 1) => {
    return await cartDao.insertProductToCart(cartId, productId, quantity);
  },

  updateCart: async (cartId, products) => {
    return await cartDao.updateCart(cartId, products);
  },

  deleteProductFromCart: async (cartId, productId) => {
    return await cartDao.deleteCartProductByPID(cartId, productId);
  },

  emptyCart: async (cartId) => {
    return await cartDao.deleteCartByCID(cartId);
  },
};
