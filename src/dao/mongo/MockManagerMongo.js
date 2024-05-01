import { productsModel } from "../../models/products.model.js"
import ProductDTO from "../../dtos/product.dto.js";
import { Faker, es} from '@faker-js/faker'
import { faker } from '@faker-js/faker';

// CJS
//const { faker2 } = require('@faker-js/faker');

//import faker from 'faker/locale/es'
// const fakerSpanish = faker;

export class MockManager {
    constructor(path){
        this.path = path;
    }

    async genMockProd(cant){
        try {
            
            const fakerEs = new Faker({
                locale: es
            })
            
            //const added = await productsModel.create(product)
            if (cant) {
                for(let i=0; i <cant; i++){
                    let category = Math.random() < 0.5 ? 'casa' : 'bebe'; // Decide aleatoriamente entre 'casa' y 'bebe'
                    let product = {
                        title: fakerEs.commerce.productName(),
                        description: fakerEs.commerce.productName(),
                        code: faker.number.int(),
                        price: fakerEs.commerce.price(),
                        stock: fakerEs.number.int(),
                        //category: fakerEs.commerce.department(),
                        category: category,
                        thumbnail: fakerEs.image.url()
                    }
                    const newProduct = new ProductDTO(product)
                    const added = await productsModel.create(newProduct)
                }
                return {message: 'Mocks accionado'}
            }
        } catch (error) {
            return {message: `No se pudo accionar el Mock Products - ${error}`}
        }
    }
}


export default MockManager
