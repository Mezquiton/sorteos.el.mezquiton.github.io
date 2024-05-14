document.addEventListener("DOMContentLoaded", function() {
    const gridItems = document.querySelectorAll('.grid-item');
    const unlockInput = document.getElementById('unlock-input');
    const unlockButton = document.getElementById('unlock-button');
    const unlockErrorMessage = document.getElementById('unlock-error-message');

    let unlocked = false; // Variable para controlar si se ha desbloqueado con éxito

    unlockButton.addEventListener('click', function() {
        const password = unlockInput.value.trim();
        if (password === 'Gabriel feo') {
            unlockErrorMessage.style.display = 'none'; // Oculta el mensaje de error
            unlocked = true; // Marca el desbloqueo como exitoso
            unlockInput.disabled = true; // Deshabilita el campo de contraseña después del desbloqueo
            unlockButton.disabled = true; // Deshabilita el botón después del desbloqueo
        } else {
            unlockErrorMessage.style.display = 'block'; // Muestra el mensaje de error
            unlocked = false; // Marca el desbloqueo como fallido
        }
    });

    gridItems.forEach(gridItem => {
        const index = gridItem.dataset.index;
        const isSelected = getCookie(`gridItem-${index}`);
        if (isSelected === 'selected') {
            gridItem.classList.add('selected');
            gridItem.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            gridItem.style.color = '#fff';
        }

        gridItem.addEventListener('click', function() {
            if (unlocked) {
                if (gridItem.classList.contains('selected')) {
                    gridItem.classList.remove('selected');
                    setCookie(`gridItem-${index}`, '', -1); // Elimina la cookie
                    gridItem.style.backgroundColor = '';
                    gridItem.style.color = '';
                } else {
                    gridItem.classList.add('selected');
                    setCookie(`gridItem-${index}`, 'selected', 365); // Establece la cookie por un año
                    gridItem.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                    gridItem.style.color = '#fff';
                }
                updateDatabaseState(index); // Actualiza el estado en la base de datos
            } else {
                if (!gridItem.classList.contains('selected')) {
                    gridItem.classList.add('selected');
                    setCookie(`gridItem-${index}`, 'selected', 365); // Establece la cookie por un año
                    gridItem.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                    gridItem.style.color = '#fff';
                    updateDatabaseState(index); // Actualiza el estado en la base de datos
                }
            }
        });
    });

    // Función para establecer una cookie
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = name + '=' + value + ';expires=' + expires.toUTCString();
    }

    // Función para obtener el valor de una cookie
    function getCookie(name) {
        const cookieArr = document.cookie.split(';');
        for (let i = 0; i < cookieArr.length; i++) {
            let cookiePair = cookieArr[i].split('=');
            if (name === cookiePair[0].trim()) {
                return decodeURIComponent(cookiePair[1]);
            }
        }
        return null;
    }

    // Configuración de Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyCm8ldKjvUEt89TVMYC0VqFpXtTG9HXVGg",
        authDomain: "corredor-natural-418006.firebaseapp.com",
        projectId: "corredor-natural-418006",
        storageBucket: "natural-broker-418006.appspot.com",
        messagingSenderId: "1015338111443",
        appId: "1:1015338111443:web:ecb815368f8f79c903df26",
        measurementId: "G-5H8DQE4NGE" // Opcional si estás utilizando Firebase Analytics
    };

    // Inicializar Firebase
    firebase.initializeApp(firebaseConfig);

    // Obtener una referencia a la base de datos
    const database = firebase.database();

    // Función para actualizar el estado de una casilla en la base de datos
    function updateDatabaseState(index) {
        const isSelected = gridItems[index].classList.contains('selected');
        database.ref('casillas/casilla' + index).set(isSelected);
    }

    // Escuchar cambios en la base de datos y actualizar la interfaz de usuario
    database.ref('casillas').on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            const index = childSnapshot.key.substr(7); // Obtener el número de casilla desde el nombre (casillaX)
            const isSelected = childSnapshot.val();
            const gridItem = document.querySelector(`.grid-item[data-index="${index}"]`);

            if (isSelected) {
                gridItem.classList.add('selected');
                gridItem.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                gridItem.style.color = '#fff';
            } else {
                gridItem.classList.remove('selected');
                gridItem.style.backgroundColor = '';
                gridItem.style.color = '';
            }
        });
    });

});
