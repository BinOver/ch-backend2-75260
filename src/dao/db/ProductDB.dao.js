import MongoDao from "../mongo.dao.js";
import ProductModel from "../models/product.model.js";

class ProductDao extends MongoDao {
  constructor() {
    super(ProductModel); // Hereda los métodos genéricos
  }

  // Obtener productos con paginación, orden y filtros
  async getProducts({ limit = 10, page = 1, sort = "", query = "" }) {
    const skip = (page - 1) * limit;
    const filter = query ? { category: query } : {};
    const sortOptions =
      sort === "asc" || sort === "desc"
        ? { price: sort === "asc" ? 1 : -1 }
        : {};

    const products = await this.model
      .find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const totalProducts = await this.model.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    return {
      docs: products,
      totalPages,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      prevLink:
        page > 1
          ? `/api/products?page=${
              page - 1
            }&limit=${limit}&sort=${sort}&query=${query}`
          : null,
      nextLink:
        page < totalPages
          ? `/api/products?page=${
              page + 1
            }&limit=${limit}&sort=${sort}&query=${query}`
          : null,
    };
  }

  // Buscar producto por ID
  async getProductById(id) {
    return await this.model.findById(id);
  }

  // Buscar producto por código (único)
  async getProductByCode(code) {
    return await this.model.findOne({ code });
  }

  // Crear nuevo producto
  async addProduct(productData) {
    const existCode = await this.getProductByCode(productData.code);
    if (existCode) {
      throw new Error("El código de producto ya existe.");
    }
    const newProduct = new this.model(productData);
    return await newProduct.save();
  }

  // Actualizar producto por ID
  async updateProduct(id, updatedData) {
    const updated = await this.model.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!updated) {
      throw new Error("Producto no encontrado.");
    }
    return updated;
  }

  // Eliminar producto por ID
  async deleteProduct(id) {
    const deleted = await this.model.findByIdAndDelete(id);
    if (!deleted) {
      throw new Error("Producto no encontrado.");
    }
    return deleted;
  }
}

export const productDao = new ProductDao();
