import { Router } from "express";
import { productService } from "../services/product.services.js";

const routerProd = Router();

routerProd.get("/", async (req, res) => {
  try {
    const products = await productService.getProducts(req.query);
    res.json({ status: "success", payload: products });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener productos", detail: error.message });
  }
});

routerProd.get("/:pid", async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.pid);
    if (!product) return res.status(404).send("Producto no encontrado");
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

routerProd.post("/", async (req, res) => {
  try {
    const created = await productService.addProduct(req.body);
    res.status(201).send("Producto creado correctamente");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

routerProd.put("/:id", async (req, res) => {
  try {
    const updated = await productService.updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).send("Producto no encontrado");
    res.status(200).send("Producto actualizado correctamente");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

routerProd.delete("/:id", async (req, res) => {
  try {
    const deleted = await productService.deleteProduct(req.params.id);
    if (!deleted) return res.status(404).send("Producto no encontrado");
    res.status(200).send("Producto eliminado correctamente");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default routerProd;
