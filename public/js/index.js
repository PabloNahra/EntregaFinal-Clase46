const logoutBtn = document.getElementById('logoutBtn')


document.addEventListener("DOMContentLoaded", () => {

    console.log("API_URL INDEX", API_URL)

    // Set the href attribute of the "Ver Productos" link
    const productsLink = document.getElementById("products-link");
    productsLink.href = `${API_URL}/products`;
});

logoutBtn.addEventListener('click', async (e) => {
    const result = await fetch(`${API_URL}/api/session/logout`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
    }})
    const { redirect } = await result.json()
    window.location.href = redirect
})