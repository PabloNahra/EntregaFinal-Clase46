// cart.js

document.addEventListener("DOMContentLoaded", function () {
  // Obtener todos los botones de aumento y disminución
  const increaseButtons = document.querySelectorAll(".increase-quantity-btn");
  const decreaseButtons = document.querySelectorAll(".decrease-quantity-btn");

  // Agregar evento de clic a cada botón de aumento
  increaseButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      // Obtener el id del producto del botón
      const productId = button.getAttribute("data-product-id");
      // Obtener el input de cantidad asociado a este producto
      const quantityInput = document.getElementById("quantity" + productId);
      // Obtener la cantidad actual
      let quantity = parseInt(quantityInput.value);
      // Aumentar la cantidad en 1
      quantity++;
      // Actualizar el valor del input de cantidad
      quantityInput.value = quantity;

      // Actualización al servidor
      updateCart(productId, quantity);
    });
  });

  // Agregar evento de clic a cada botón de disminución
  decreaseButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      // Obtener el id del producto del botón
      const productId = button.getAttribute("data-product-id");
      // Obtener el input de cantidad asociado a este producto
      const quantityInput = document.getElementById("quantity" + productId);
      // Obtener la cantidad actual
      let quantity = parseInt(quantityInput.value);
      // Restar la cantidad en 1 si la cantidad actual es mayor que 1
      if (quantity > 1) {
        quantity--;
      }
      // Actualizar el valor del input de cantidad
      quantityInput.value = quantity;
    });
  });
});



function updateCart(productId, newQuantity) {

    console.log("Dentro de updateCart")
    console.log(productId)
    console.log(newQuantity)

    // Construir el body de la solicitud
    const body = JSON.stringify({
        products: [
            { 
                product: productId,
                quantity: newQuantity
            }
        ]
    });

    // Configurar la solicitud fetch
    fetch("http://localhost:8080/api/carts/65e8d8ace25d0afffb59ce1a", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: body
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al actualizar el carrito");
        }
        // Manejar la respuesta si es necesario
        console.log("El carrito se ha actualizado correctamente");
    })
    .catch(error => {
        console.error("Error:", error);
    });
}
