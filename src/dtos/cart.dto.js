class CartProductDTO {
    constructor(product, quantity) {
        this.product = product;
        this.quantity = quantity;
    }
}

class CartDTO {
    constructor(cart) {
        // Mapea los productos del carrito al DTO de productos
        this.products = cart.products.map(({ product, quantity }) => new CartProductDTO(product, quantity));
    }
}

export default CartDTO;
