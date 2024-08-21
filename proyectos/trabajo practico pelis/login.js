document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // prevengo el envio del formulario

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    let isValid = true; 

    // Validacion de email
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;//pongo los caracteres validos
    const emailError = document.getElementById('emailError'); 

    if (!emailPattern.test(email)) { //testeo a ver si tiene solo caracteres validos que puse anteriormente
        emailError.textContent = 'Por favor, introduce un email válido.'; 
        isValid = false;
    } else {
        emailError.textContent = '';
    }

    // valido contraseña que al menos tenga 6 caracteres
    const passwordError = document.getElementById('passwordError');
    if (password.length < 6) {
        passwordError.textContent = 'La contraseña debe tener al menos 6 caracteres.';
        isValid = false;
    } else {
        passwordError.textContent = '';
    }

    if (isValid) { //si es valido hago algo, decidi mandarlo a la pagina inicial
        const customAlert = document.getElementById('customAlert')
        //alert('inicio de sesion exitoso')
        console.log('anduvio equis d');
        customAlert.style.display = 'block'
        setTimeout(function() {
            window.location.href = 'index.html';
        }, 3000);
    }
    //creo que para la creacion de cuenta podria usar el mismo js pero con un boton
    //que ademas que haga todo esto es decir ponerle le dos id que verifique que no
    //se este usando el mail que ponen aunque no se si da algun problema poner dos id
});
