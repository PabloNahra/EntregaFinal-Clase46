// payment-process.js

/*
app.get('/payment-process/:cId', (req, res) => {
  const cId = req.params.cId;
  res.render('payment-process', { cId });
});
*/
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM PAYMENT-PROCESS completamente cargado y parseado");

  // Selecciona el formulario
  const form = document.querySelector("form");

  // Obtén el cId del atributo data-cart-id
  const paymentDiv = document.getElementById("payment");
  const cartId = paymentDiv.getAttribute("data-cart-id");

  // Escucha el evento submit del formulario
  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevenir el envío del formulario para procesarlo con JavaScript

    // Selecciona todos los checkboxes de formas de pago
    const checkboxes = document.querySelectorAll(
      'input[name="paymentMethods"]:checked'
    );

    // Crea una lista para almacenar los valores seleccionados en mayúsculas
    const metodosPago = Array.from(checkboxes).map((checkbox) =>
      checkbox.value.toUpperCase()
    );

    console.log(metodosPago); // Imprime la lista en la consola para verificar
    console.log(cartId);

    // Ejecutar el EndPoint para confirmar el carrito y generar el ticket (Capturar el número de ticket)
    // Ejecutar el EndPoint para confirmar el carrito y generar el ticket (Capturar el número de ticket)
    try {
      const response = await fetch(
        `http://localhost:8080/api/carts/${cartId}/purchase`,
        {
          body: JSON.stringify({ paymentMethods: metodosPago }),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json(); // Convertir la respuesta a JSON
      console.log("result");
      console.log(result);

      if (result.status === 200 || result.status === 201) {
        alert("Se creó el ticket correctamente");
        console.log("result.ticketId");
        console.log(result);
        console.log(result.ticketId);

        console.log("cartId");
        console.log(cartId);

        // Establece el valor de ticketId en el campo oculto del formulario
        document.getElementById("ticketId").value = result.ticketId;

        // Enviar el submit para renderizar la pantalla de finalización
        form.submit(); // Descomenta esta línea si deseas enviar el formulario después de procesarlo
      } else {
        alert("Error, no se pudo crear el ticket");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error al crear el ticket:", error);
      alert("Error: no se pudo crear el ticket");
    }
  });
});
