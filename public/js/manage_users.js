const restoreBtn = document.getElementById("restoreBtn");
const recuperarBtn = document.getElementById("recuperarBtn");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const resultMessage = document.getElementById("resultMessage");

window.addEventListener("DOMContentLoaded", async () => {
  const emailInput = document.getElementById("emailInput");
  const firstNameInput = document.querySelector('input[name="first_name"]');
  const resultMessage = document.getElementById("resultMessage");

  try {
    const response = await fetch("http://localhost:8080/api/users");
    const data = await response.json();

    if (response.ok) {
      // Limpiar cualquier opción existente en el select
      emailInput.innerHTML = "";

      
      // Agregar cada correo electrónico como una opción en el select
      data.usersAll.forEach((user) => {
        const option = document.createElement("option");
        option.value = user.email;
        option.textContent = user.email;
        emailInput.appendChild(option);
      });

      // Agregar un evento de cambio al select para actualizar el campo de nombre
      emailInput.addEventListener("change", () => {
        const selectedEmail = emailInput.value;
        const selectedUser = data.usersAll.find(
          (user) => user.email === selectedEmail
        );
        if (selectedUser) {
          firstNameInput.value = selectedUser.first_name;
        }
      });
      // Obtener el correo electrónico seleccionado inicialmente
      const initialSelectedEmail = emailInput.value;
      const initialSelectedUser = data.usersAll.find(
        (user) => user.email === initialSelectedEmail
      );
      if (initialSelectedUser) {
        firstNameInput.value = initialSelectedUser.first_name;
      }
    } else {
      // Si hay algún error en la respuesta del servidor
      resultMessage.textContent =
        "Error al cargar la lista de correos electrónicos";
    }
  } catch (error) {
    console.error(error);
    resultMessage.textContent =
      "Error al cargar la lista de correos electrónicos";
  }
});

restoreBtn.addEventListener("click", async (e) => {
  const email = emailInput.value;
  const password = passwordInput.value;
  const result = await fetch("http://localhost:8080/api/session/restore", {
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  if (result.status === 200 || result.status === 201) {
    resultMessage.innerHTML = "Password restaurada";
  } else {
    resultMessage.innerHTML = "Error al restaurar password";
  }
});

recuperarBtn.addEventListener("click", async (e) => {
  const email = emailInput.value;
  const result = await fetch("http://localhost:8080/api/session/recover", {
    body: JSON.stringify({ email }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  if (result.status === 200 || result.status === 201) {
    resultMessage.innerHTML = "Revise su casilla de correo";
  } else {
    resultMessage.innerHTML = "NO pudimos enviar el email de recuperación";
  }
});
