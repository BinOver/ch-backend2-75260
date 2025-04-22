import {promises as fs} from "fs";

export class ProductManager {
    static path = "./src/dao/fs/data/products.json"
    static lastPid=0;
    
    constructor(){
        this.products = [];
        this.readProducts();
    }


    async readProducts() {
        try {
            const prodData = await fs.readFile(ProductManager.path);
            this.products = JSON.parse(prodData);
            if (this.products.length > 0) {
                ProductManager.lastPid = Math.max(...this.products.map(product => product.id));
            }
        } catch (error) {
            console.error("Error al cargar los carritos desde el archivo", error)
            await this.saveCarts();
        }
    }

    async addProduct(product){
        const products = JSON.parse(await fs.readFile(ProductManager.path,"utf8"));
        
        //validar code unico
        if(products.some(item =>item.code === product.code)){
            console.error("El dato de code debe ser unico");
            return false;
        } else
        //Agregar ID al objeto product
            product.id = ++ProductManager.lastPid;
            products.push(product);
        //agregar producto a array de productos
        await fs.writeFile(ProductManager.path,JSON.stringify(products,null,2));
        return true;
    }

    async updateProduct(id, product){
        try {
            const products = JSON.parse(await fs.readFile(ProductManager.path,"utf8"));
            const index = products.findIndex(item => item.id === parseInt(id));

            console.log (products);
            console.log(id);
            console.log(index);

            if (index != -1){
                products[index] = product;
                await fs.writeFile(ProductManager.path,JSON.stringify(products,null,2));
                console.log("Producto actualizado" );
            } else {
                console.log("No se encontro el producto");
            }
        } catch (error) {
            console.log("Error al actualizar el producto");
            throw error;
        }
    }

    async getProducts(limit){
        const products = JSON.parse(await fs.readFile(ProductManager.path, "utf8"));
        if(isNaN(limit)){
            return products;
        }else {
            return products.slice(0,limit);
        }
    }

    async getProductById(id){
        const products = JSON.parse(await fs.readFile(ProductManager.path, "utf8"));
        //Busca el producto con el id enviado
        const getProduct = products.find(item => item.id === parseInt(id));
        // valida si el producto exista, si lo encuentra lo muestra
        if(!getProduct){
            return false;
        }else{
            return getProduct;
        }
    }

    async deleteProduct(id) {
        const products = JSON.parse(await fs.readFile(ProductManager.path, "utf8"));
        const isID = products.findIndex((product) => product.id === parseInt(id));
        if (isID != -1) {
            const modProducts = products.filter((prod) => prod.id !== parseInt(id));
            console.log(modProducts);
            await fs.writeFile(ProductManager.path,JSON.stringify(modProducts,null,2));
            return true;
        } else {
            return false
        }
    }
}

export default ProductManager;