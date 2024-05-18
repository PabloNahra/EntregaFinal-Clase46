// cart.js

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM completamente cargado y parseado");

  // Obtener todos los botones de aumento y disminución
  const increaseButtons = document.querySelectorAll(".increase-quantity-btn");
  const decreaseButtons = document.querySelectorAll(".decrease-quantity-btn");
  const removeButtons = document.querySelectorAll(".remove-product-btn");

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
        // Actualizar el valor del input de cantidad
        quantityInput.value = quantity;

        // Actualización al servidor
        updateCart(productId, quantity);
      }
    });
  });

  // Agregar evento de clic a cada botón de eliminación
  removeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      // Obtener el ID del producto del botón
      const productId = button.getAttribute("data-product-id");
      console.log("remove")
      console.log(productId)

      // Lógica para eliminar el producto del carrito
      // (Puedes implementar esto usando una función como updateCart(productId, 0))

      // Aquí puedes llamar a una función para eliminar el producto del carrito
      // deleteProductFromCart(productId);
    });
  });
});

function updateCart(productId, newQuantity) {
  const cartDiv = document.getElementById("cart");
  // Obtener el valor de cId del atributo de datos
  const cId = cartDiv.dataset.cartId;

  // Configurar la solicitud fetch
  fetch(`http://localhost:8080/api/carts/${cId}/product/${productId}`, {
    body: JSON.stringify({ quantity: 1 }),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al actualizar el carrito");
      }
      // Manejar la respuesta si es necesario
      console.log("El carrito se ha actualizado correctamente");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
