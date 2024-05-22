//import { obtenerApiUrl } from '/util.js';
//import { obtenerApiUrl } from "./util.js";
const userDataDiv = document.getElementById("user-data");
const firstName = userDataDiv.dataset.firstName;
const lastName = userDataDiv.dataset.lastName;
const uEmail = userDataDiv.dataset.email;

/*
const apiURL = obtenerApiUrl();
console.log("apiURL")
console.log(apiURL)
*/
console.log("API_URL 1", API_URL)

document.addEventListener("DOMContentLoaded", async () => {
  // Valor fijo de cId para inicialización
  let fixedCId = "1"; // Definido como let para poder reasignarlo

  const userDataDiv = document.getElementById("user-data");
  const uEmail = userDataDiv.dataset.email;

  //console.log("Probando variable de entorno")
  //const apiURL = await obtenerApiUrl()
  //console.log(apiURL)

  try {

    console.log("API_URL 2", API_URL)

    let ultCart;
    const userCarts = await fetch(`${API_URL}/api/carts/user_email/${uEmail}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (userCarts.ok) {
      const responseData = await userCarts.json();
      const carritos = responseData.rdo;

      const filteredCarts = carritos.filter((cart) => {
        const status = cart.status ? cart.status.toUpperCase() : null;
        return status !== "FINALIZADO" && status !== "CANCELADO";
      });
      filteredCarts.sort((a, b) => new Date(b.last_connection) - new Date(a.last_connection));

      if (filteredCarts.length > 0) {
        ultCart = filteredCarts[0];
        // Obtengo el último id de carrito
        fixedCId = ultCart._id;
      } else {
        ultCart = null;
      }
    }

    const cartLink = document.getElementById("cart-link");
    cartLink.href = `/cart/${fixedCId}`;
  } catch (error) {
    console.error("Error fetching user carts:", error);
  }
});

const addToCartBtns = document.getElementsByClassName("add-to-cart-btn");
for (let btn of addToCartBtns) {
  btn.addEventListener("click", () => {
    addProductToCart(btn.id);
  });
}

const addProductToCart = async (pId) => {
  try {
    let ultCart;
    const userCarts = await fetch(`${API_URL}/api/carts/user_email/${uEmail}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (userCarts.ok) {
      const responseData = await userCarts.json();
      const carritos = responseData.rdo;

      const filteredCarts = carritos.filter((cart) => {
        const status = cart.status ? cart.status.toUpperCase() : null;
        return status !== "FINALIZADO" && status !== "CANCELADO";
      });
      filteredCarts.sort((a, b) => new Date(b.last_connection) - new Date(a.last_connection));

      if (filteredCarts.length > 0) {
        ultCart = filteredCarts[0];
      } else {
        ultCart = null;
      }
    }

    if (ultCart) {
      const existeProducto = ultCart.products.some((producto) => producto.product === pId);

      const result = await fetch(
        `${API_URL}/api/carts/${ultCart._id}/product/${pId}`,
        {
          body: JSON.stringify({ quantity: 1 }),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (result.status === 200 || result.status === 201) {
        alert("Se agregó correctamente");
        /*
        const cartLink = document.getElementById("cart-link");
        cartLink.href = `/cart/${ultCart._id}`;
        */
        // Recargar la página después de eliminar el producto
        window.location.reload();
      } else {
        alert("Error, no se pudo agregar");
      }
    } else {
      const result = await fetch(`${API_URL}/api/carts`, {
        body: JSON.stringify({
          products: [{ product: pId, quantity: 1 }],
        }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (result.status === 200 || result.status === 201) {
        const newCart = await result.json();
        alert("Se agregó correctamente");
        /*
        const cartLink = document.getElementById("cart-link");
        cartLink.href = `/cart/${newCart._id}`;
        */
        // Recargar la página después de eliminar el producto
        window.location.reload();
      } else {
        alert("Error, no se pudo agregar");
      }
    }
  } catch (error) {
    alert("Error, no se pudo agregar");
  }
};
