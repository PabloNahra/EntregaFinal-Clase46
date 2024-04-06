document.addEventListener('DOMContentLoaded', () => {
    const recoverForm = document.getElementById('recoverForm');
    const tokenInput = document.getElementById('tokenInput');

    // Extraer el token de la URL
    const token = window.location.pathname.split('/').pop();    
    console.log(token)
    tokenInput.value = token;

    // Manejar el envío del formulario
    recoverForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

        const newPassword = document.getElementById('newPasswordInput').value;
        console.log(newPassword)

        try {
            const response = await fetch(`http://localhost:8080/api/session/recoverpass/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newPassword })
            });

            if (response.ok) {
                const resultMessage = document.getElementById('resultMessage');
                resultMessage.innerHTML = 'Contraseña recuperada correctamente.';
            } else {
                throw new Error('Error al enviar la solicitud.');
            }
        } catch (error) {
            console.error(error);
            const resultMessage = document.getElementById('resultMessage');
            resultMessage.innerHTML = 'Error al enviar la solicitud.';
        }
    });
});
