//const btns = document.getElementsByTagName('button');
/*
for(let btn of btns){
    btn.addEventListener('click', (event) => {
        addProductToCart(btn.id);
    });
}
*/
const addToCartBtns = document.getElementsByClassName('add-to-cart-btn');
for (let btn of addToCartBtns) {
    btn.addEventListener('click', (event) => {
        addProductToCart(btn.id);
    });
}

const addProductToCart = async (pId) => {
    try {
        console.log("Dentro de addProductToCart")
        console.log("pId")
        console.log(pId)
        // Buscar si el usuario tiene un cId activo (ultimo sin status finalizado)

        // Buscar si el producto ya existe en ese carrito

        // Si ya existe agregarle una unidad

        // Si no existe agregar el producto
        const result = await fetch(`http://localhost:8080/api/carts/6642cce3df2eb01b9c11f586/product/${pId}`, {
            body: JSON.stringify({
                quantity: 1
            }),
            method: 'post',
            headers: {
               'Content-Type': 'application/json' 
            }
        });
        if(result.status === 200 || result.status === 201){
            alert('Se agregó correctamente');
        }
        else{
            alert('Error, no se pudo agregar');
        }
        



    } catch (error) {
        alert('Error, no se pudo agregar');
    }
}

