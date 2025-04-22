import {promises as fs} from "fs";

export class CartManager {
    static path = "./src/dao/fs/data/carts.json";
    static lastCid = 0;

    constructor() {
        this.carts = [];
        this.readCarts();
    }

    async readCarts() {
        try {
            const cartsData = await fs.readFile(CartManager.path);
            this.carts = JSON.parse(cartsData);
            if (this.carts.length > 0) {
                CartManager.lastCid = Math.max(...this.carts.map(cart => cart.id));
            }
        } catch (error) {
            console.error("Error al cargar los carritos desde el archivo", error)
            await this.saveCarts();
        }
    }

    async saveCarts() {
        await fs.writeFile(CartManager.path, JSON.stringify(this.carts, null, 2));
    }

    async createCart() {
        const newCart = {
            id: ++CartManager.lastCid,
            products:[]
        }
        this.carts.push(newCart);
        await this.saveCarts();
        return newCart;
    }

    async getCartById(cartId) {
        try {
            const cart = this.carts.find(c => c.id === parseInt(cartId))
            if (!cart){
                throw new Error(`No existe un carrito con el id ${cartId}`);
            }
            return cart;
        } catch (error) {
            console.error("Error al obtener el carrito por ID", error);
            throw error;
        }
    }

    async insertProductToCart(cartId, productId, quantity=1) {
        const cart = await this.getCartById(cartId);
        const existProduct = cart.products.find(p => p.product === productId);

        if (existProduct) {
            existProduct.quantity += quantity;
        } else {
            cart.products.push({
                product: productId, 
                quantity
            })
        }

        await this.saveCarts();
        return cart;
    }
}

export default CartManager;