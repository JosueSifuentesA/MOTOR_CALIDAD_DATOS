document.addEventListener("DOMContentLoaded", () => {
    const openPopupFromUrlValidez = (url, callback) => {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                const popupOverlay = document.getElementById("popup-overlay");
                const popupContent = document.getElementById("popup-content");

                if (popupContent && popupOverlay) {
                    popupContent.innerHTML = html;
                    popupOverlay.classList.remove("hidden");

                    if (callback) callback();
                    cargarColumnasDesdeLocalStorage();
                }
            })
            .catch(error => console.error("Error cargando popup:", error));
    };

    const configurarValidezBtn = document.getElementById("configurar_validez");
    if (configurarValidezBtn) {
        configurarValidezBtn.addEventListener("click", () => {
            openPopupFromUrlValidez("/static/html/static_matriz_html/popup_validez.html", () => {
                console.log("Popup de validez abierto correctamente");
                setupConfirmButton();
            });
        });
    }

    const cargarColumnasDesdeLocalStorage = () => {
        const profileData = JSON.parse(localStorage.getItem('profileData'));
        const criterioGuardado = JSON.parse(localStorage.getItem("criterioValidez"));

        const checklistContainer = document.getElementById('validez-column-checklist');
        if (checklistContainer && profileData?.length) {
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

                const columnaGuardada = criterioGuardado?.columnas?.find(c => c.columna === item.Columna);
                if (columnaGuardada) {
                    select.value = columnaGuardada.tipo;
                }

                const label = document.createElement('label');
                label.setAttribute('for', select.id);
                label.textContent = `Seleccionar tipo para ${item.Columna}`;

                listItem.appendChild(label);
                listItem.appendChild(select);
                checklistContainer.appendChild(listItem);
            });
        }

        const pesoInput = document.getElementById("peso_criterio_validez");
        if (pesoInput && criterioGuardado?.peso) {
            pesoInput.value = criterioGuardado.peso;
        }

        const pesoSpan = document.getElementById("criterio_peso_validez");
        if (pesoSpan && criterioGuardado?.peso) {
            pesoSpan.textContent = criterioGuardado.peso + "%";
        }
    };

    const setupConfirmButton = () => {
        const confirmarBtn = document.getElementById("btn_confirmar_validez");

        if (confirmarBtn) {
            confirmarBtn.addEventListener("click", () => {
                console.log('Botón Confirmar clickeado para validez');

                const selects = document.querySelectorAll("#validez-column-checklist select");
                const columnasSeleccionadas = [];

                selects.forEach(select => {
                    const columna = select.id.split("-")[2];
                    const tipoSeleccionado = select.value;
                    columnasSeleccionadas.push({ columna, tipo: tipoSeleccionado });
                });

                if (!columnasSeleccionadas.length) {
                    alert("Por favor, selecciona al menos un tipo de columna.");
                    return;
                }

                const pesoInput = document.getElementById("peso_criterio_validez");
                const peso = pesoInput?.value.trim();

                if (!peso) {
                    alert("Por favor, ingresa un peso válido para validez.");
                    return;
                }

                const criterioValidezData = {
                    columnas: columnasSeleccionadas,
                    peso: peso
                };

                localStorage.setItem("criterioValidez", JSON.stringify(criterioValidezData));

                const pesoSpan = document.getElementById("criterio_peso_validez");
                if (pesoSpan) {
                    pesoSpan.textContent = peso + "%";
                }

                const popupOverlay = document.getElementById("popup-overlay");
                if (popupOverlay) {
                    popupOverlay.classList.add("hidden");
                }
            });
        }
    };
});



const mostrarPesoGuardadoValidez = () => {
    const criterioGuardado = JSON.parse(localStorage.getItem("criterioValidez"));
    const pesoSpan = document.getElementById("criterio_peso_validez");
    
    if (criterioGuardado?.peso && pesoSpan) {
        pesoSpan.textContent = criterioGuardado.peso + "%";
    }
};

mostrarPesoGuardadoValidez();