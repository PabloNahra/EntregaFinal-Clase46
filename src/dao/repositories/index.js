import Products from "../factory/productFactory.js";
import ProductRepository from "./products.repository.js";

export const productsServicesRep = new ProductRepository(new Products())