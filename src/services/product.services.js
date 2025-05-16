import { productDao } from "../dao/db/ProductDB.dao.js";

class ProductService {
  async getProducts({ limit = 10, page = 1, sort = "", query = "" }) {
    return await productDao.getProducts({ limit, page, sort, query });
  }

  async getProductById(id) {
    return await productDao.getProductById(id);
  }

  async addProduct(productData) {
    const exists = await productDao.getProductByCode(productData.code);
    if (exists) throw new Error("Ya existe un producto con ese código");
    return await productDao.addProduct(productData);
  }

  async updateProduct(id, productData) {
    return await productDao.updateProduct(id, productData);
  }

  async deleteProduct(id) {
    return await productDao.deleteProduct(id);
  }
}

export const productService = new ProductService();
