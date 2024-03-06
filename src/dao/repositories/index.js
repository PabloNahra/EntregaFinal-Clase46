import Products from "../factory/productFactory.js";
import ProductRepository from "./products.repository.js";

export const productsServices2 = new ProductRepository(new Products())