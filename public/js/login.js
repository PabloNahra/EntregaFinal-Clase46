const restoreBtn = document.getElementById('restoreBtn')
const recuperarBtn = document.getElementById('recuperarBtn')
const emailInput = document.getElementById('emailInput')
const passwordInput = document.getElementById('passwordInput')
const resultMessage = document.getElementById('resultMessage')

console.log("API_URL LOGIN", API_URL)

restoreBtn.addEventListener('click', async (e) => {
    const email = emailInput.value
    const password = passwordInput.value
    const result = await fetch(`${API_URL}/api/session/restore`, {
        body: JSON.stringify({email, password}),
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST'
    })
    if(result.status === 200 || result.status===201){
        resultMessage.innerHTML = 'Password restaurada'
    }
    else {
        resultMessage.innerHTML = 'Error al restaurar password'
    }
})


recuperarBtn.addEventListener('click', async (e) => {
    const email = emailInput.value
    const result = await fetch(`${API_URL}/api/session/recover`, {
        body: JSON.stringify({email}),
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST'
    })
    if(result.status === 200 || result.status===201){
        resultMessage.innerHTML = 'Revise su casilla de correo'
    }
    else {
        resultMessage.innerHTML = 'NO pudimos enviar el email de recuperación'
    }
})
