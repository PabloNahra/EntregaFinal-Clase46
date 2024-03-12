class ProductDTO {
    constructor(product){
        this.title = product.title
        this.description = product.description
        this.code = product.code
        this.price = product.price
        this.available = product.available
        this.stock = product.stock
        this.category = product.category
        this.thumbnail = product.thumbnail
    }
}

export default ProductDTO