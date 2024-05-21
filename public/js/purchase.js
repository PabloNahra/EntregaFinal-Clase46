// purchase.js

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM PURCHASE PURCHASE.JS completamente cargado y parseado");

  const urlParams = new URLSearchParams(window.location.search);
  const cartId = urlParams.get('cId');
  const ticketId = urlParams.get('tId');

  // Mostrar los valores en la página
  document.getElementById('cartId').textContent = cartId;
  document.getElementById('ticketId').textContent = ticketId;
});
