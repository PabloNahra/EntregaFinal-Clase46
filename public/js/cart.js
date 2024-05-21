// cart.js

document.addEventListener("DOMContentLoaded", function () {
  
  // Obtener todos los botones de aumento y disminución
  const increaseButtons = document.querySelectorAll(".increase-quantity-btn");
  const decreaseButtons = document.querySelectorAll(".decrease-quantity-btn");
  const removeButtons = document.querySelectorAll(".remove-product-btn");
  const vaciarCarritoBtn = document.querySelector(".empty-cart");
  const confirmForm = document.querySelector("form[action='/payment-process']");

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
      // Obtener el valor de cId del atributo de datos
      const cartDiv = document.getElementById("cart");
      const cId = cartDiv.dataset.cartId;

      // Lógica para eliminar el producto del carrito
      // Configurar la solicitud fetch
      fetch(`http://localhost:8080/api/carts/${cId}/products/${productId}`, {
        // body: JSON.stringify({ quantity: 1 }),
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al actualizar el carrito");
          }
          // Recargar la página después de eliminar el producto
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  });

  // Agregar evento de clic al botón
  vaciarCarritoBtn.addEventListener("click", function () {
    // Obtener el valor de cId del atributo de datos
    const cartDiv = document.getElementById("cart");
    const cId = cartDiv.dataset.cartId;

    // Lógica para eliminar el producto del carrito
    // Configurar la solicitud fetch
    fetch(`http://localhost:8080/api/carts/${cId}`, {
      // body: JSON.stringify({ quantity: 1 }),
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al vaciar el carrito");
        }
        // Recargar la página después de eliminar el producto
        window.location.reload();
      })
      .catch((error) => {
        alert("Error:", error);
      });
  });

  // Agregar un evento de escucha al evento de envío del formulario - Confirmar Compra
  confirmForm.addEventListener("submit", function (event) {
    // Prevenir el comportamiento predeterminado del formulario (no enviar la solicitud de forma predeterminada)
    event.preventDefault();
    // Obtener el valor de cId del atributo de datos
    const cartDiv = document.getElementById("cart");
    const cId = cartDiv.dataset.cartId;

    // Cambiar el estado del carrito a En Proceso de pago
    // Configurar la solicitud fetch
    fetch(`http://localhost:8080/api/carts/${cId}/payment-process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Error al actualizar el carrito a EN PROCESO DE PAGO"
          );
        }
        // Recargar la página después de eliminar el producto
        // window.location.reload();
      })
      .catch((error) => {
        alert("Error:", error);
      });

    // Ahora puedes enviar el formulario de confirmación de compra si es necesario
    confirmForm.submit();
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
      alert("El carrito se ha actualizado correctamente");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
