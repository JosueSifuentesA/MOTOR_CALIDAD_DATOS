document.addEventListener("DOMContentLoaded", () => {
    // Función para abrir el popup desde una URL
    const openPopupFromUrlValidez = (url, callback) => {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                const popupOverlay = document.getElementById("popup-overlay");
                const popupContent = document.getElementById("popup-content");

                if (popupContent && popupOverlay) {
                    popupContent.innerHTML = html;
                    popupOverlay.classList.remove("hidden"); // Mostrar el popup

                    if (callback) callback(); // Inicializar el script del hijo

                    cargarColumnasDesdeLocalStorage(); // Cargar columnas dinámicamente
                }
            })
            .catch(error => console.error("Error cargando popup:", error));
    };

    // Evento al botón para abrir el popup de configuración de validez
    const configurarValidezBtn = document.getElementById("configurar_validez");
    if (configurarValidezBtn) {
        configurarValidezBtn.addEventListener("click", () => {
            openPopupFromUrlValidez("/static/html/static_matriz_html/popup_validez.html", () => {
                console.log("Popup de validez abierto correctamente");
                setupConfirmButton();
            });
        });
    }

    // Función para cargar las columnas desde localStorage
    const cargarColumnasDesdeLocalStorage = () => {
        const profileData = JSON.parse(localStorage.getItem('profileData'));

        if (profileData && Array.isArray(profileData)) {
            const checklistContainer = document.getElementById('validez-column-checklist');
            checklistContainer.innerHTML = '';

            profileData.forEach(item => {
                const listItem = document.createElement('li');

                const select = document.createElement('select');
                select.id = `column-select-${item.Columna}`;

                const opciones = [
                    { value: 'texto', label: 'Texto' },
                    { value: 'numero', label: 'Número' },
                    { value: 'fecha', label: 'Fecha' }
                ];

                opciones.forEach(op => {
                    const option = document.createElement('option');
                    option.value = op.value;
                    option.textContent = op.label;
                    select.appendChild(option);
                });

                const label = document.createElement('label');
                label.setAttribute('for', select.id);
                label.textContent = `Seleccionar tipo para ${item.Columna}`;

                listItem.appendChild(label);
                listItem.appendChild(select);
                checklistContainer.appendChild(listItem);
            });
        }
    };

    // Función que configura el evento del botón Confirmar
    const setupConfirmButton = () => {
        const confirmarBtn = document.getElementById("btn_confirmar_validez");

        if (confirmarBtn) {
            confirmarBtn.addEventListener("click", () => {
                console.log('Botón Confirmar clickeado para validez');

                const selectsValidez = document.querySelectorAll("#validez-column-checklist select");
                const columnasSeleccionadasValidez = [];

                selectsValidez.forEach(select => {
                    const columna = select.id.split("-")[2];
                    const tipoSeleccionado = select.value;
                    columnasSeleccionadasValidez.push({ columna, tipo: tipoSeleccionado });
                });

                if (columnasSeleccionadasValidez.length === 0) {
                    alert("Por favor, selecciona al menos un tipo de columna.");
                    return;
                }

                const pesoInputValidez = document.getElementById("peso_criterio_validez");
                const pesoValidez = pesoInputValidez ? pesoInputValidez.value.trim() : "";

                if (pesoValidez === "") {
                    alert("Por favor, ingresa un peso válido para validez.");
                    return;
                }

                const criterioValidezData = {
                    columnas: columnasSeleccionadasValidez,
                    peso: pesoValidez
                };

                const pesoSpan = document.getElementById("criterio_peso_validez");
                if (pesoSpan) {
                    pesoSpan.textContent = pesoValidez + "%";
                }

                console.log("Guardando datos en localStorage:", criterioValidezData);
                localStorage.setItem("criterioValidez", JSON.stringify(criterioValidezData));

                const popupOverlay = document.getElementById("popup-overlay");
                if (popupOverlay) {
                    popupOverlay.classList.add("hidden");
                }
            });
        }
    };
});