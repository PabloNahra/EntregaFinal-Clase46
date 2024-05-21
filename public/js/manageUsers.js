const restoreBtn = document.getElementById("restoreBtn");
// const recuperarBtn = document.getElementById("recuperarBtn");
const deleteBtn = document.getElementById("deleteBtn");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const resultMessage = document.getElementById("resultMessage");

window.addEventListener("DOMContentLoaded", async () => {
  const emailInput = document.getElementById("emailInput");
  const firstNameInput = document.querySelector('input[name="first_name"]');
  const lastNameInput = document.querySelector('input[name="last_name"]');
  const roleInput = document.getElementById("roleInput");
  const resultMessage = document.getElementById("resultMessage");
  const modifyRoleForm = document.getElementById("modifyRoleForm");

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
          lastNameInput.value = selectedUser.last_name;
          roleInput.value = selectedUser.role;
        }
      });
      // Obtener el correo electrónico seleccionado inicialmente
      const initialSelectedEmail = emailInput.value;
      const initialSelectedUser = data.usersAll.find(
        (user) => user.email === initialSelectedEmail
      );
      if (initialSelectedUser) {
        firstNameInput.value = initialSelectedUser.first_name;
        lastNameInput.value = initialSelectedUser.last_name;
        roleInput.value = initialSelectedUser.role;
        // Agregar el evento al formulario para modificar el rol
        modifyRoleForm.addEventListener("submit", async (e) => {
          e.preventDefault();

          // Obtener el correo electrónico seleccionado antes de la modificación
          const selectedEmailBeforeModification = emailInput.value;

          // Obtener el correo electrónico seleccionado
          const selectedEmail = emailInput.value;

          try {
            // Consultar el servicio para obtener los datos a partir del correo electrónico
            const userResponse = await fetch(
              `http://localhost:8080/api/users/getByEmail/${selectedEmail}`
            );
            const user = await userResponse.json();

            if (user) {
              // Esta función solo debe aplicar a usuarios USER o PREMIUM
              if (
                user.userByEmailDTO.role === "USER" ||
                user.userByEmailDTO.role === "PREMIUM"
              ) {
                const result = await fetch(
                  `http://localhost:8080/api/users/premium/${user.userByEmailDTO.user_id}`,
                  {
                    method: "POST",
                    body: JSON.stringify({
                      role: roleInput.value,
                    }),
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                );

                const respuesta = await result.json();

                if (result.status === 200 || result.status === 201) {
                  resultMessage.innerHTML = `Rol modificado exitosamente ${respuesta.message}`;
                } else {
                  resultMessage.innerHTML = `Error al modificar el rol ${respuesta.message}`;
                }

                // Recargar la lista de usuarios
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

                  // Seleccionar el correo electrónico antes de la modificación
                  emailInput.value = selectedEmailBeforeModification;

                  // Actualizar los campos correspondientes en la interfaz
                  const selectedUser = data.usersAll.find(
                    (user) => user.email === selectedEmailBeforeModification
                  );
                  if (selectedUser) {
                    firstNameInput.value = selectedUser.first_name;
                    lastNameInput.value = selectedUser.last_name;
                    roleInput.value = selectedUser.role;
                  }
                } else {
                  // Si hay algún error en la respuesta del servidor
                  resultMessage.textContent =
                    "Error al cargar la lista de correos electrónicos 1";
                }
              } else {
                resultMessage.innerHTML = `Solo se puede modificar el rol de usuarios USER o PREMIUM`;
              }
            } else {
              resultMessage.innerHTML =
                "No se encontró ningún usuario con el correo electrónico seleccionado";
            }
          } catch (error) {
            console.error(error);
            resultMessage.innerHTML = "Error al obtener el _id del usuario";
          }
        });
      }
    } else {
      // Si hay algún error en la respuesta del servidor
      resultMessage.textContent =
        "Error al cargar la lista de correos electrónicos 1";
    }
  } catch (error) {
    console.error(error);
    resultMessage.textContent =
      "Error al cargar la lista de correos electrónicos 2";
  }
});

deleteBtn.addEventListener("click", async () => {
  try {
    // Obtener el correo electrónico seleccionado
    const selectedEmail = emailInput.value;

    // Consultar el servicio para obtener los datos a partir del correo electrónico
    const userResponse = await fetch(
      `http://localhost:8080/api/users/getByEmail/${selectedEmail}`
    );
    const userData = await userResponse.json();

    if (userResponse.ok) {
      // Obtener el id del usuario
      const userId = userData.userByEmailDTO.user_id;

      // Realizar la solicitud para eliminar al usuario por su id
      const deleteUserResponse = await fetch(
        `http://localhost:8080/api/users/delete/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (deleteUserResponse.ok) {
        // Limpiar el mensaje anterior
        resultMessage.textContent = "";

        // Actualizar la interfaz o mostrar un mensaje de éxito
        resultMessage.textContent = "Usuario eliminado correctamente";

        // Refrescar la página después de 3 segundos
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        // Manejar el error de eliminación de usuario
        resultMessage.textContent = "Error al eliminar usuario";
      }
    } else {
      // Manejar el error de obtener el usuario por correo electrónico
      resultMessage.textContent = "Error al obtener el usuario";
    }
  } catch (error) {
    console.error(error);
    resultMessage.textContent = "Error inesperado";
  }
});
