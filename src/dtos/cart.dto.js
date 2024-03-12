
class CartProductDTO {
    constructor(productId, quantity) {
        this.productId = productId;
        this.quantity = quantity;
    }
}

class CartDTO {
    constructor(cart) {
        // Mapea los productos del carrito al DTO de productos
        this.products = cart.products.map(({ productId, quantity }) => new CartProductDTO(productId, quantity));
    }
}

export default CartDTO;
