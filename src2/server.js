import express from "express";
import ProductManager from "./manager/products-manager.js";

const productManager = new ProductManager("../products.json");

const app = express();

app.use(express.json())

app.get("/products", async (req, res) => {
    try {
        const { limit } = req.query
        const products = await productManager.getProducts();
        if (limit) {
            const productsSlice = products.slice(0,limit)
            return res.status(200).json(productsSlice);
        } else res.status(200).json(products)
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

app.post("/products", async (req, res) => {
    try {
        const product = await productManager.addProduct(req.body);
        res.status(201).json(product)
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
})

app.get("/products/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(pid)
        if (!product) res.status(404).json({msg: "Product not found"})
        else res.status(200).json(product)
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
})

app.put("/products/:idProd", async (req, res) => {
    try {
        const {idProd} = req.params;
        const prodUpdate = await productManager.updateProduct(idProd, req.body);
        if (!prodUpdate) res.status(404).json({ msg: "Error updating user" });
        else res.status(200).json(prodUpdate) 
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
})

app.delete("/products/:idProd", async (req, res) => {
    try {
        const {idProd} = req.params;
        const prodDelete = await productManager.deleteProduct(idProd)
        if(prodDelete) res.status(200).json({msg : `Product id: ${idProd} deleted successfully`})
        else res.status(404).json({ msg: "Error delete product" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
})

const PORT = 8080;

app.listen(PORT, () => console.log(`Server ok on port ${PORT}`));