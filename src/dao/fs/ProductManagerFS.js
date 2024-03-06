import fs from 'fs'

export class ProdManager{
    constructor(path){
        this.path = path;
    }

    async getLength() {
        const products = await this.getProducts()
        return products.length
    }

    async getMaxId() {
        const products = await this.getProducts();
    
        if (products.length === 0) {
            return 0; // Si no hay elementos, devuelve 0 o cualquier valor predeterminado
        }
    
        const maxId = products.reduce((max, product) => {
            return product.id > max ? product.id : max;
        }, products[0].id);
    
        return maxId;
    }
    

    async getProducts(){
        try{
            const data = await fs.promises.readFile(this.path, 'utf-8')
            const products = JSON.parse(data)
            return products
        } catch (error){
            return []
        }
    }

    async addProduct(product){
        if (!product.title || !product.description || !product.code || 
            !product.price 
            || !product.stock == undefined || !product.stock == null 
            || !product.category) {
            return console.error('Datos incompletos')   
            }
        
        const available = product.available ?? 1;
        const id = parseInt(await this.getMaxId(), 10) + 1

        const products = await this.getProducts()            
        const newProduct = {
            id: id,
            title: product.title,
            description: product.description,
            code: product.code,
            price: product.price,
            available: available,
            stock: product.stock,
            category: product.category,
            thumbnail: product.thumbnail
        }
        
        products.push(newProduct)

        await fs.promises.writeFile(this.path, JSON.stringify(products), 'utf-8')
    }

    async getProductById(id){
        const products = await this.getProducts()
        const product = products.find(p => p.id === id)
        if (!product){
            return console.error('Prod NO encontrado')
        }
        return product        
    }

    async deleteProduct(id){
        const products = await this.getProducts()
        const productsNotDeleted = products.filter(product => product.id !== id)
        await fs.promises.writeFile(this.path, JSON.stringify(productsNotDeleted), 'utf-8')
    }

    async updateProduct(id, productToUpdate){
        const products = await this.getProducts()
        const productId = parseInt(id, 10)
        const updatedProducts = products.map(product => {
            if(product.id === productId){
                return {
                    ...product,
                    ...productToUpdate,
                    id: productId
                }
            }
            return product
        }) 

    await fs.promises.writeFile(this.path, JSON.stringify(updatedProducts), 'utf-8')

    }
}

export default ProdManager
