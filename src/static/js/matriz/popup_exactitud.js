document.addEventListener("DOMContentLoaded", () => {
    const openPopupFromUrlExactitud = (url, callback) => {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                const popupOverlay = document.getElementById("popup-overlay");
                const popupContent = document.getElementById("popup-content");

                if (popupContent && popupOverlay) {
                    popupContent.innerHTML = html;
                    popupOverlay.classList.remove("hidden");

                    if (callback) callback();
                    cargarColumnasDesdeLocalStorageExactitud();
                    configurarSeleccionOutliers(); // <- Nueva función
                }
            })
            .catch(error => console.error("Error cargando popup:", error));
    };

    const configurarExactitudBtn = document.getElementById("configurar_exactitud");
    if (configurarExactitudBtn) {
        configurarExactitudBtn.addEventListener("click", () => {
            openPopupFromUrlExactitud("/static/html/static_matriz_html/popup_exactitud.html", () => {
                console.log("Popup de exactitud abierto correctamente");
                setupConfirmButtonExactitud();
            });
        });
    }

    const cargarColumnasDesdeLocalStorageExactitud = () => {
        const profileData = JSON.parse(localStorage.getItem('profileData'));
        const criterioExactitud = JSON.parse(localStorage.getItem('criterioExactitud'));
    
        if (profileData && Array.isArray(profileData)) {
            const checklistContainer = document.getElementById('exactitud-column-checklist');
            checklistContainer.innerHTML = '';
    
            const columnasFiltradas = profileData.filter(item =>
                item["Tipo de Dato"] === "float64" || item["Tipo de Dato"].includes("datetime")
            );
    
            columnasFiltradas.forEach(item => {
                const listItem = document.createElement('li');
                listItem.style.marginBottom = "1rem";
    
                const label = document.createElement('label');
                label.textContent = `Exactitud para ${item.Columna}:`;
                label.style.display = "block";
    
                listItem.appendChild(label);
    
                if (item["Tipo de Dato"].includes("datetime")) {
                    const minDate = document.createElement('input');
                    minDate.type = 'date';
                    minDate.id = `min-date-${item.Columna}`;
                    minDate.classList.add('input-fecha');
                    minDate.placeholder = 'Fecha mínima';
    
                    const maxDate = document.createElement('input');
                    maxDate.type = 'date';
                    maxDate.id = `max-date-${item.Columna}`;
                    maxDate.classList.add('input-fecha');
                    maxDate.placeholder = 'Fecha máxima';
    
                    
                    if (criterioExactitud && Array.isArray(criterioExactitud.columnas)) {
                        const colGuardada = criterioExactitud.columnas.find(c => c.columna === item.Columna && c.tipo === 'fecha');
                        if (colGuardada) {
                            minDate.value = colGuardada.min || '';
                            maxDate.value = colGuardada.max || '';
                        }
                    }
    
                    const dateContainer = document.createElement('div');
                    dateContainer.style.display = "flex";
                    dateContainer.style.gap = "0.5rem";
    
                    dateContainer.appendChild(minDate);
                    dateContainer.appendChild(maxDate);
    
                    listItem.appendChild(dateContainer);
                } else if (item["Tipo de Dato"] === "float64") {
                    const columnaNombre = document.createElement('p');
                    columnaNombre.textContent = `Columna: ${item.Columna}`;
                    listItem.appendChild(columnaNombre);
                }
    
                checklistContainer.appendChild(listItem);
            });
        }
    
        // Precargar el peso si ya fue guardado
        const pesoInput = document.getElementById("peso_criterio_exactitud");
        if (pesoInput && criterioExactitud && criterioExactitud.peso) {
            pesoInput.value = criterioExactitud.peso;
        }
    };
    

    const setupConfirmButtonExactitud = () => {
        const confirmarBtn = document.getElementById("btn_confirmar_exactitud");
    
        if (confirmarBtn) {
            confirmarBtn.addEventListener("click", () => {
                console.log('Botón Confirmar clickeado para exactitud');
    
                const profileData = JSON.parse(localStorage.getItem('profileData'));
                const columnasExactitud = [];
    
                profileData.forEach(item => {
                    if (item["Tipo de Dato"].includes("datetime")) {
                        const minInput = document.getElementById(`min-date-${item.Columna}`);
                        const maxInput = document.getElementById(`max-date-${item.Columna}`);
    
                        if (minInput && maxInput && (minInput.value || maxInput.value)) {
                            columnasExactitud.push({
                                columna: item.Columna,
                                tipo: 'fecha',
                                min: minInput.value,
                                max: maxInput.value
                            });
                        }
    
                    } else if (item["Tipo de Dato"] === "float64") {
                        columnasExactitud.push({
                            columna: item.Columna,
                            tipo: 'float'
                        });
                    }
                });
    
                if (columnasExactitud.length === 0) {
                    alert("Selecciona al menos una configuración de exactitud.");
                    return;
                }
    
                const pesoInput = document.getElementById("peso_criterio_exactitud");
                const peso = pesoInput ? pesoInput.value.trim() : "";
    
                if (peso === "") {
                    alert("Por favor, ingresa un peso válido para exactitud.");
                    return;
                }
    
                // Recuperar el objeto existente de criterioExactitud (si existe)
                const criterioExactitudActual = JSON.parse(localStorage.getItem("criterioExactitud")) || {};
    
                const criterioExactitudData = {
                    ...criterioExactitudActual,
                    columnas: columnasExactitud,
                    peso: peso
                    // NO sobreescribimos `accion_outliders` si ya existe
                };
    
                console.log("Guardando datos de exactitud:", criterioExactitudData);
                localStorage.setItem("criterioExactitud", JSON.stringify(criterioExactitudData));
    
                const pesoSpan = document.getElementById("criterio_peso_exactitud");
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
    

    const configurarSeleccionOutliers = () => {
        const deleteDiv = document.querySelector(".delete_bad_data");
        const quarantineDiv = document.querySelector(".quarantine_bad_data");
    
        const activarSeleccion = (tipo) => {
            deleteDiv.classList.remove("selected");
            quarantineDiv.classList.remove("selected");
    
            if (tipo === "delete") {
                deleteDiv.classList.add("selected");
            } else if (tipo === "quarantine") {
                quarantineDiv.classList.add("selected");
            }
    
            // Guardar en localStorage
            const criterioExactitud = JSON.parse(localStorage.getItem("criterioExactitud")) || {};
            criterioExactitud.accion_outliders = tipo;
            localStorage.setItem("criterioExactitud", JSON.stringify(criterioExactitud));
        };
    
        deleteDiv.addEventListener("click", () => activarSeleccion("delete"));
        quarantineDiv.addEventListener("click", () => activarSeleccion("quarantine"));
    
        // Al cargar el popup: establecer selección por defecto o restaurar lo guardado
        const criterioExactitud = JSON.parse(localStorage.getItem("criterioExactitud"));
        const accionGuardada = criterioExactitud?.accion_outliders || "quarantine";
        activarSeleccion(accionGuardada);  // esto también actualiza visualmente
    };

});
