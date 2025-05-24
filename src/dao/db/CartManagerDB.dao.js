import MongoDao from "../mongo.dao.js";
import CartModel from "../models/cart.model.js";

class CartDao extends MongoDao {
  constructor() {
    super(CartModel);
  }

  async createCart() {
    const newCart = new this.model({ products: [] });
    return await newCart.save();
  }

  async getCartById(cartId) {
    return await this.model.findById(cartId).populate("products.product");
  }

  async insertProductToCart(cartId, productId, quantity = 1) {
    quantity = Number(quantity);
    if (isNaN(quantity) || quantity < 1) {
      quantity = 1;
    }
    console.log("Cantidad solicitada:", quantity, "Tipo:", typeof quantity);
    const cart = await this.getCartById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    const existing = cart.products.find(
      (item) => item.product._id.toString() === productId
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    cart.markModified("products");
    return await cart.save();
  }

  async updateCart(cartId, products) {
    const cart = await this.getCartById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    for (const newProduct of products) {
      const index = cart.products.findIndex(
        (p) => p.product._id.toString() === newProduct.product._id.toString()
      );
      if (index !== -1) {
        cart.products[index].quantity = newProduct.quantity;
      } else {
        cart.products.push(newProduct);
      }
    }

    cart.markModified("products");
    return await cart.save();
  }

  async replaceCartProducts(cartId, newProducts) {
    const cart = await this.getCartById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.products = newProducts;
    return await cart.save();
  }

  async deleteCartProductByPID(cartId, productId) {
    const cart = await this.getCartById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    const index = cart.products.findIndex(
      (p) => p.product._id.toString() === productId
    );
    if (index !== -1) {
      cart.products.splice(index, 1);
      cart.markModified("products");
      return await cart.save();
    }

    return cart;
  }

  async deleteCartByCID(cartId) {
    const cart = await this.getCartById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.products = [];
    return await cart.save();
  }
}

export const cartDao = new CartDao();
