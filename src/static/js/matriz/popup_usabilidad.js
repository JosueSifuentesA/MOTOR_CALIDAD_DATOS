document.addEventListener("DOMContentLoaded", () => {
    const openPopupFromUrl = (url, callback) => {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                const popupOverlay = document.getElementById("popup-overlay");
                const popupContent = document.getElementById("popup-content");

                if (popupContent && popupOverlay) {
                    popupContent.innerHTML = html;
                    popupOverlay.classList.remove("hidden");

                    if (callback) callback();

                    configurarConfirmacionUsabilidad();
                    configurarCierrePopup();
                }
            })
            .catch(error => console.error("Error cargando popup:", error));
    };

    const cargarColumnasDesdeLocalStorage = (ulId) => {
        const profileData = JSON.parse(localStorage.getItem("profileData") || "[]");
        const ul = document.getElementById(ulId);
        if (!ul || profileData.length === 0) return;

        ul.innerHTML = "";

        profileData.forEach((col, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <label>
                    <input type="checkbox" name="columna_${index}" value="${col.Columna}" data-columna="${col.Columna}">
                    ${col.Columna}
                </label>`;
            ul.appendChild(li);
        });

        
        const criterioUsabilidadData = JSON.parse(localStorage.getItem("criterioUsabilidad"));
        if (criterioUsabilidadData && criterioUsabilidadData.columnas) {
            criterioUsabilidadData.columnas.forEach(columna => {
                const checkbox = document.querySelector(`input[type="checkbox"][value="${columna}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }

        
        const pesoInput = document.getElementById("peso_criterio_usabilidad");
        if (criterioUsabilidadData && criterioUsabilidadData.peso) {
            if (pesoInput) {
                pesoInput.value = criterioUsabilidadData.peso;
            }
            const pesoSpan = document.getElementById("criterio_peso_usabilidad");
            if (pesoSpan) {
                pesoSpan.textContent = `${criterioUsabilidadData.peso}%`;
            }
        }
    };

    const configurarConfirmacionUsabilidad = () => {
        const confirmarBtn = document.getElementById("btn_confirmar_usabilidad");
        if (!confirmarBtn) return;

        confirmarBtn.addEventListener("click", () => {
            const checkboxes = document.querySelectorAll("#usabilidad-column-checklist input[type='checkbox']:checked");
            const columnasSeleccionadas = Array.from(checkboxes).map(cb => cb.value);

            const pesoInput = document.getElementById("peso_criterio_usabilidad");
            const peso = pesoInput ? pesoInput.value.trim() : "";

            if (peso === "") {
                alert("Por favor, ingresa un peso válido.");
                return;
            }

            const criterioData = {
                columnas: columnasSeleccionadas,
                peso: peso
            };

            
            localStorage.setItem("criterioUsabilidad", JSON.stringify(criterioData));

            
            const pesoSpan = document.getElementById("criterio_peso_usabilidad");
            if (pesoSpan) {
                pesoSpan.textContent = `${peso}%`;
            }

            const popupOverlay = document.getElementById("popup-overlay");
            if (popupOverlay) {
                popupOverlay.classList.add("hidden");
            }
        });
    };

    const configurarCierrePopup = () => {
        const cerrarBtn = document.getElementById("popup-close");
        const popupOverlay = document.getElementById("popup-overlay");

        if (cerrarBtn && popupOverlay) {
            cerrarBtn.addEventListener("click", () => popupOverlay.classList.add("hidden"));
        }

        if (popupOverlay) {
            popupOverlay.addEventListener("click", (e) => {
                if (e.target === popupOverlay) {
                    popupOverlay.classList.add("hidden");
                }
            });
        }
    };

    const botonUsabilidad = document.getElementById("configurar_usabilidad");
    if (botonUsabilidad) {
        botonUsabilidad.addEventListener("click", () => {
            openPopupFromUrl("/static/html/static_matriz_html/popup_usabilidad.html", () => {
                cargarColumnasDesdeLocalStorage("usabilidad-column-checklist");
            });
        });
    }

    
    const criterioUsabilidadData = JSON.parse(localStorage.getItem("criterioUsabilidad"));
    if (criterioUsabilidadData && criterioUsabilidadData.peso) {
        const pesoInput = document.getElementById("peso_criterio_usabilidad");
        const pesoSpan = document.getElementById("criterio_peso_usabilidad");
        if (pesoInput && pesoSpan) {
            pesoInput.value = criterioUsabilidadData.peso;
            pesoSpan.textContent = `${criterioUsabilidadData.peso}%`;
        }
    }
});