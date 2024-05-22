document.addEventListener('DOMContentLoaded', () => {
    const recoverForm = document.getElementById('recoverForm');
    const tokenInput = document.getElementById('tokenInput');

    console.log("API_URL recoverPass", API_URL)

    // Extraer el token de la URL
    const token = window.location.pathname.split('/').pop();    
    tokenInput.value = token;

    // Manejar el envío del formulario
    recoverForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

        const newPassword = document.getElementById('newPasswordInput').value;
        try {
            const response = await fetch(`${API_URL}/api/session/recoverpass/${token}`, {
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
