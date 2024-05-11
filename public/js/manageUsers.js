const restoreBtn = document.getElementById("restoreBtn");
const recuperarBtn = document.getElementById("recuperarBtn");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const resultMessage = document.getElementById("resultMessage");

window.addEventListener("DOMContentLoaded", async () => {
  const emailInput = document.getElementById("emailInput");
  const firstNameInput = document.querySelector('input[name="first_name"]');
  const lastNameInput = document.querySelector('input[name="last_name"]');
  // const roleNameInput = document.querySelector('input[name="role"]');
  const roleInput = document.getElementById("roleInput");
  const resultMessage = document.getElementById("resultMessage");
  const modifyRoleForm = document.getElementById("modifyRoleForm");

  try {
    const response = await fetch("http://localhost:8080/api/users");
    const data = await response.json();
    console.log(data);

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
          console.log("Dentro del submit");

          // Obtener el correo electrónico seleccionado
          const selectedEmail = emailInput.value;
          console.log(selectedEmail);

          try {
            // Consultar el userModel para obtener el _id a partir del correo electrónico
            // const user = await userModel.findOne({ email: selectedEmail });
            const userResponse = await fetch(
              `http://localhost:8080/api/users/getByEmail/${selectedEmail}`
            );
            const user = await userResponse.json();
            console.log(user);

            if (user) {
              // Esta función solo debe aplicar a usuarios USER o PREMIUM
              console.log("user.role")
              console.log(user.userByEmailDTO.role)
              if (user.userByEmailDTO.role === "USER" || user.userByEmailDTO.role === "PREMIUM") {
                //if (1 === 1) {
                console.log("Dentro del userResponse");
                console.log(user);
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

                console.log("Dentro del manageUsers result.status");
                console.log(result.status);
                const respuesta = await result.json();
                console.log("respuesta");
                console.log(respuesta);
                console.log(respuesta.message);

                if (result.status === 200 || result.status === 201) {
                  resultMessage.innerHTML = `Rol modificado exitosamente ${respuesta.message}`;
                } else {
                  resultMessage.innerHTML = `Error al modificar el rol ${respuesta.message}`;
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
