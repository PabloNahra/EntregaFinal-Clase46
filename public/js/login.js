const restoreBtn = document.getElementById('restoreBtn')
const recuperarBtn = document.getElementById('recuperarBtn')
const emailInput = document.getElementById('emailInput')
const passwordInput = document.getElementById('passwordInput')
const resultMessage = document.getElementById('resultMessage')

restoreBtn.addEventListener('click', async (e) => {
    const email = emailInput.value
    const password = passwordInput.value
    const result = await fetch('http://localhost:8080/api/session/restore', {
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
    console.log("Dentro de recuperar btn")
    const email = emailInput.value
    // const password = passwordInput.value
    const result = await fetch('http://localhost:8080/api/session/recover', {
        body: JSON.stringify({email}),
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
