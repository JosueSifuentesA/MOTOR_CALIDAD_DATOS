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
                }

                // Lógica del botón confirmar para Completitud
                const confirmarBtn = document.getElementById("btn_confirmar_completitud");
                if (confirmarBtn) {
                    confirmarBtn.addEventListener("click", () => {
                        console.log('Botón Confirmar clickeado para completitud');

                        const checkboxes = document.querySelectorAll("#completitud-column-checklist input[type='checkbox']:checked");
                        const columnasSeleccionadas = [];
                        checkboxes.forEach((checkbox) => {
                            columnasSeleccionadas.push(checkbox.value);
                        });

                        const pesoInput = document.getElementById("peso_criterio_completitud");
                        const peso = pesoInput ? pesoInput.value.trim() : "";

                        if (peso === "") {
                            alert("Por favor, ingresa un peso válido para completitud.");
                            return;
                        }

                        const criterioData = {
                            columnas: columnasSeleccionadas,
                            peso: peso
                        };

                        const pesoSpan = document.getElementById("criterio_peso_completitud");
                        if (pesoSpan) {
                            pesoSpan.textContent = peso + "%";
                        }


                        console.log("Guardando datos en localStorage:", criterioData);
                        localStorage.setItem("criterioCompletitud", JSON.stringify(criterioData));

                        popupOverlay.classList.add("hidden");
                    });
                }
            })
            .catch(error => console.error("Error cargando popup:", error));
    };

    const cargarColumnasDesdeLocalStorage = (ulId) => {
        const profileData = JSON.parse(localStorage.getItem("profileData") || "[]");
        const ul = document.getElementById(ulId);

        if (!ul || profileData.length === 0) return;

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

    const botonCompletitud = document.getElementById("configurar_completitud");
    if (botonCompletitud) {
        botonCompletitud.addEventListener("click", () => {
            openPopupFromUrl("/static/html/static_matriz_html/popup_completitud.html", () => {
                cargarColumnasDesdeLocalStorage("completitud-column-checklist");
            });
        });
    }

    // Cierre del popup con botón
    const cerrarBtn = document.getElementById("popup-close");
    if (cerrarBtn) {
        cerrarBtn.addEventListener("click", () => {
            const popupOverlay = document.getElementById("popup-overlay");
            if (popupOverlay) {
                popupOverlay.classList.add("hidden");
            }
        });
    }

    // Cierre del popup al hacer clic fuera del contenido
    const popupOverlay = document.getElementById("popup-overlay");
    if (popupOverlay) {
        popupOverlay.addEventListener("click", (e) => {
            if (e.target === popupOverlay) {
                popupOverlay.classList.add("hidden");
            }
        });
    }
});
