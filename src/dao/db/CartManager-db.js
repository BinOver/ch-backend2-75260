
import CartModel from "../models/cart.model.js";

class CartManager {
    async createCart() {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            console.error("Error al cargar los carritos desde el archivo", error)
            await this.saveCarts();
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart){
                console.log("Carrito no encontrado con ID " + cartId);
            }
            return cart;
        } catch (error) {
            console.error("Error al obtener el carrito por ID", error);
            throw error;
        }
    }

    async insertProductToCart(cartId, productId, quantity=1) {
        try {
            const cart = await this.getCartById(cartId);
            const existProduct = cart.products.find(item => {
                return item.product._id.toString() === productId
            });
            
            if (existProduct) {
                existProduct.quantity += quantity;
            }else {
                cart.products.push({
                    product: productId, 
                    quantity: quantity
                })
            };
            cart.markModified("products");
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al insertar producto al carrito.", error);
            throw error;
        }
    }

    async updateCart(cartId, products){
        try {
            const cart = await this.getCartById(cartId);
            if (cart) {
                products.forEach((newProduct) => {
                    const indexOfProduct = cart.products.findIndex((p) =>
                        p.product._id.toString() === newProduct.product._id.toString());
                    if (indexOfProduct !== -1) {
                        cart.products[indexOfProduct].quantity = newProduct.quantity;
                    } else {
                        cart.products.push(newProduct);
                    }
                });
                res.status(200).send({ resultado: "OK", carrito: cart.products });
            } else {
                res
                    .status(404)
                    .send({ resultado: "Carrito no encontrado", carrito: cart });
            }
            cart.markModified("products");
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al obtener el carrito", error);
            res.status(500).json({error: "Error interno del servidor"});
        }
    }
    
    async deleteCartProductByPID(cartId, productId) {
        try {
            const cart = await this.getCartById(cartId);
            console.log(cart)
            if (cart) {
                const indexToRemove = cart.products.findIndex(producto => producto._id.toString() === productId);
                cart.products.splice(indexToRemove, 1);
                await cart.save();
                return cart
            }
        }
        catch (error) {
            console.error("Error al borrar producto del carrito.", error);
            throw error;
        }
    };

    async deleteCartByCID(cartId) {
        try {
            const cart = await this.getCartById(cartId);
            if (cart) {
                cart.products = [];
                await cart.save();
                return cart;
            }
        }
        catch (error) {
            console.error("Error al borrar carrito.", error);
        }
    };

}

export default CartManager;