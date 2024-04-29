import fs from "fs";
import {v4 as uuidv4} from "uuid";

export default class ProductManager {
    constructor(path) {
      this.path = path;
    }
  
    async getProducts() {
      try {
        if (fs.existsSync(this.path)) {
          const products = await fs.promises.readFile(this.path, "utf8");
          return JSON.parse(products);
        } else return [];
      } catch (error) {
        console.error(error);
      }
    }
  
    async addProduct(obj) {
      try {
        const product = {
            id: uuidv4(),
            ...obj
        }
        const products = await this.getProducts();
        if ((product.title, product.description, product.price, product.thumbnail, product.code, product.stock)) {
          if (products.some((p) => p.code === product.code)) {
            console.error("No es posible agregar ese producto: código repetido");
            return false;
          } else {
            products.push(product);
            await fs.promises.writeFile(this.path, JSON.stringify(products));
            return product;
          }
        }
      } catch (error){
          return console.error("Todos los campos son obligatorios", error);
      }
    }
  
    async getProductById(productId) {
      try {
        const products = await this.getProducts();
        const checkId = products.find((product) => product.id === productId);
        if (!checkId) return false;
        else return checkId;
      } catch (error) {
        console.error(error);
      }
    }
  
    async updateProduct(productId, updateData) {
      try {
        const products = await this.getProducts();
        let product = await this.getProductById(productId);
        if (product) {
          const productIndex = products.findIndex(
            (product) => product.id === productId
          );
          const finalProduct = { ...product, ...updateData };
          products.splice(productIndex, 1, finalProduct);
          await fs.promises.writeFile(this.path, JSON.stringify(products));
          return finalProduct;
        } else {
            return null
        }
      } catch (error){
        console.error("No fue posible actualizar el producto", error);
      }
    }
  
    async deleteProduct(productId) {
      try{
        const products = await this.getProducts();
        const productsFilter = products.filter((product) => product.id !== (productId));
        if(productsFilter){
            await fs.promises.writeFile(this.path, JSON.stringify(productsFilter));
            return true
        }
        else return null
      } catch (error){
        console.log("producto no encontrado para eliminar", error);
      }
    }
}