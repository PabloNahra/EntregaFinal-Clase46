// payment-process.js

/*
app.get('/payment-process/:cId', (req, res) => {
  const cId = req.params.cId;
  res.render('payment-process', { cId });
});
*/
document.addEventListener("DOMContentLoaded", function () {

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

    // Ejecutar el EndPoint para confirmar el carrito y generar el ticket (Capturar el número de ticket)
    try {

      if (metodosPago && metodosPago.length > 0){
        const response = await fetch(
          `${API_URL}/api/carts/${cartId}/purchase`,
          {
            body: JSON.stringify({ paymentMethods: metodosPago }),
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        const result = await response.json(); // Convertir la respuesta a JSON
        if (result.status === 200 || result.status === 201) {
          alert("Se creó el ticket correctamente");
  
          const ticketId = result.ticketId.toString();
  
          // Establece el valor de ticketId en el campo oculto del formulario
          document.getElementById("ticketId").value = result.ticketId;
  
          // Enviar el submit para renderizar la pantalla de finalización
          // form.submit(); // Descomenta esta línea si deseas enviar el formulario después de procesarlo
          // Redirigir a la página de confirmación de compra con cId y tId en la URL
          window.location.href = `/purchase?cId=${cartId}&tId=${ticketId}`;
        } else {
          alert("Error, no se pudo crear el ticket");
          window.location.reload();
        }
  

      } else {
        alert("Debe registrar por lo menos un medio de pago ")
        window.location.reload();
      }
    } catch (error) {
      console.error("Error al crear el ticket:", error);
      alert("Error: no se pudo crear el ticket");
    }
  });
});
