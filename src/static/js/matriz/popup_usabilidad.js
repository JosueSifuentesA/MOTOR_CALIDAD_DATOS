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

                    configurarConfirmacion();
                    configurarCierrePopup();
                }
            })
            .catch(error => console.error("Error cargando popup:", error));
    };

    const cargarColumnasDesdeLocalStorage = (ulId) => {
        const profileData = JSON.parse(localStorage.getItem("profileData") || "[]");
        const ul = document.getElementById(ulId);
        if (!ul || profileData.length === 0) return;

        ul.innerHTML = ""; // Limpia antes de agregar nuevas columnas

        profileData.forEach((col, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <label>
                    <input type="checkbox" name="columna_${index}" value="${col.Columna}" data-columna="${col.Columna}">
                    ${col.Columna}
                </label>`;
            ul.appendChild(li);
        });
    };

    const configurarConfirmacion = () => {
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

            const criterioUsabilidadData = {
                columnas: columnasSeleccionadas,
                peso: peso
            };

            localStorage.setItem("criterioUsabilidad", JSON.stringify(criterioUsabilidadData));

            // Actualiza visualmente el peso en el DOM si existe
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
});
