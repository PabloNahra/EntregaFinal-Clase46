const userDataDiv = document.getElementById("user-data");
const firstName = userDataDiv.dataset.firstName;
const lastName = userDataDiv.dataset.lastName;
const uEmail = userDataDiv.dataset.email;
const id = userDataDiv.dataset.id;

const addToCartBtns = document.getElementsByClassName("add-to-cart-btn");
for (let btn of addToCartBtns) {
  btn.addEventListener("click", (event) => {
    addProductToCart(btn.id);
  });
}

const addProductToCart = async (pId) => {
  try {
    let ultCart;
    console.log("Dentro de addProductToCart");
    console.log(pId);
    console.log(uEmail);

    // Buscar si el usuario tiene un cId activo (ultimo sin status finalizado)
    const userCarts = await fetch(
      `http://localhost:8080/api/carts/user_email/${uEmail}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (userCarts.ok) {
      const responseData = await userCarts.json();
      const carritos = responseData.rdo;
      console.log("carritos");
      console.log(carritos);

      // Filtrar carritos por estado y ordenar por last_connection
      const filteredCarts = carritos.filter((cart) => {
        const status = cart.status ? cart.status.toUpperCase() : null;
        return status !== "FINALIZADO" && status !== "CANCELADO";
      });
      filteredCarts.sort(
        (a, b) => new Date(b.last_connection) - new Date(a.last_connection)
      );

      // Tomar el carrito más reciente si hay alguno después de filtrar y ordenar
      //      let ultCart
      if (filteredCarts.length > 0) {
        ultCart = filteredCarts[0];
      } else {
        ultCart = null; // Si no hay carritos después de filtrar y ordenar
      }
    }
    if (ultCart) {
      // Verificar si el producto ya existe en ese carrito
      const existeProducto = ultCart.products.some(
        (producto) => producto.product === pId
      );

      if (existeProducto) {
        // Si ya existe, agregarle una unidad, o realizar cualquier otra acción que necesites
        // Si no existe agregar el producto
        const result = await fetch(
          `http://localhost:8080/api/carts/${ultCart._id}/product/${pId}`,
          {
            body: JSON.stringify({
              quantity: 1,
            }),
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (result.status === 200 || result.status === 201) {
          alert("Se agregó correctamente");
        } else {
          alert("Error, no se pudo agregar");
        }
      } else {
        // Si no existe, agregar el producto al carrito
        const result = await fetch(
          `http://localhost:8080/api/carts/${ultCart._id}/product/${pId}`,
          {
            body: JSON.stringify({
              quantity: 1,
            }),
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (result.status === 200 || result.status === 201) {
          alert("Se agregó correctamente");
        } else {
          alert("Error, no se pudo agregar");
        }
      }
    } else {
      // Generar un nuevo carrito con el producto
      const result = await fetch(`http://localhost:8080/api/carts`, {
        body: JSON.stringify({
          // user_id: "664171d632e9089c3a2cb2c3",
          products : [{product: pId, "quantity": 1}]
        }),
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (result.status === 200 || result.status === 201) {
        alert("Se agregó correctamente");
      } else {
        alert("Error, no se pudo agregar");
      }
    }
  } catch (error) {
    alert("Error, no se pudo agregar");
  }
};
