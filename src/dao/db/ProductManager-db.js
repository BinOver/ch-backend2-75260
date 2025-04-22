import ProductModel from "../models/product.model.js";

class ProductManager {
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

    async addProduct({title,description,price,img,code,stock,category,thumbnails,status=true}){
        try {
            //validar code unico
            const existCode = await ProductModel.findOne({code:code});
            if(existCode){
                console.error("El dato de code debe ser unico");
                return false;
            }
            const newProduct = await ProductModel({
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                thumbnails,
                status
            })
            await newProduct.save();
            return true;
        } catch (err) {
            console.log("Error al agregar el producto" + err);
            throw err;
        }
    }

    async updateProduct(id, updatedProduct){
        try {
            const updated = await ProductModel.findByIdAndUpdate(id, updatedProduct);
            if(!updated) {
                console.log("No se encuentra el producto.")
                return false;
            }else {
                console.log("Producto actualizado.");
                return updated;
            }
        } catch (error) {
            console.log("Error al actualizar el producto");
            throw error;
        }
    }

    async getProducts({limit = 10, page = 1, sort = '', query = ''} = {}) {
        try {
            
            const skip = (page - 1) * limit;
            
            let queryOptions = {};
            if(query){
                queryOptions = { category:query };
            };

            const sortOptions = {};
            if(sort) {
                if(sort === 'asc' || sort === 'desc'){
                    sortOptions.price = sort === 'asc' ? 1:-1;
                }
            };

            
            const products = await ProductModel
                .find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);

            const arrayProducts = await ProductModel.countDocuments(queryOptions);
            const totalPages = Math.ceil(arrayProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            return {
                docs: products,
                totalPages,
                prevPage: hasPrevPage ? page -1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };

        } catch (err) {
            console.log("Error al encontrar productos" + err);
            throw err;
        }
    }

    async getProductById(id){
        try {
            const getProduct = await ProductModel.findById(id);
            // valida si el producto exista, si lo encuentra lo muestra
            if(!getProduct){
                console.log("Producto no encontrado.");
                return false;
            }else{
                console.log("Producto encontrado.");
                return getProduct;
            }
        } catch (err) {
            console.log("error al buscar producto por id." + err);
            throw err;
        }
    }

    async deleteProduct(id) {
        try {
            const delProduct = await ProductModel.findByIdAndDelete(id);
            if(!delProduct) {
                console.log("No se encuentra el producto a borrar.");
                return false;
            }else {
                console.log("Producto eliminado.");
                return delProduct;
            }
        }catch(err) {
            console.log("error al eliminar producto por id." + err);
            throw err;
        }
    }
}

export default ProductManager;