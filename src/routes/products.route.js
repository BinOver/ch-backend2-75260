import { Router } from "express";
//import { ProductManager } from "../dao/fs/ProductManager.js";
import ProductManager from "../dao/db/ProductManager-db.js";


const routerProd = Router();
const productManager = new ProductManager();

routerProd.get("/",async (req,res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const products = await productManager.getProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query,
        });

        res.json({
            status:'success',
            payload: products,
            /* totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null, */
        });

    } catch(error){
        console.error("Se ha producido un erro al obtener los productos",error);
        res.status(500).send({error: "Error de servidor"})
    }
});

routerProd.get("/:pid", async (req,res) => {
    const pid = req.params.pid;
    const prod = await productManager.getProductById(pid);
    if(prod) {
        res.status(200).send(prod);
    } else {
        res.status(404).send("Producto no encontrado");
    }
});

routerProd.post("/", async (req,res) => {
    const confirm = await productManager.addProduct(req.body);
    if (confirm){
        res.status(200).send("Producto creado correctamente");
    } else {
        res.status(400).send("Producto ya existente");
    }
});

routerProd.put("/:id", async(req,res) => {
    const confirm = await productManager.updateProduct(req.params.id,req.body);
    if (confirm){
        res.status(200).send("Producto actualizado correctamente.");
    } else {
        res.status(404).send("Producto ya existente.");
    }
});

routerProd.delete("/:id", async(req,res) => {
    const confirm = await productManager.deleteProduct(req.params.id);
    if (confirm) {
        res.status(200).send("Producto eliminado correctamente.");
    } else {
        res.status(404).send("Producto no encontrado.");
    }
});

export default routerProd;