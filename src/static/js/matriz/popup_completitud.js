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
                    cargarColumnasDesdeLocalStorage("completitud-column-checklist");
                    setupConfirmarCompletitud();
                }
            })
            .catch(error => console.error("Error cargando popup:", error));
    };

    const cargarColumnasDesdeLocalStorage = (ulId) => {
        const profileData = JSON.parse(localStorage.getItem("profileData") || "[]");
        const criterioGuardado = JSON.parse(localStorage.getItem("criterioCompletitud") || "{}");
        const ul = document.getElementById(ulId);

        if (!ul || profileData.length === 0) return;

        ul.innerHTML = "";

        profileData.forEach((col, index) => {
            const li = document.createElement("li");

            const checked = criterioGuardado.columnas?.includes(col.Columna) ? "checked" : "";

            li.innerHTML = `
                <label>
                    <input type="checkbox" name="columna_${index}" value="${col.Columna}" data-columna="${col.Columna}" ${checked}>
                    ${col.Columna}
                </label>`;
            ul.appendChild(li);
        });

        const pesoInput = document.getElementById("peso_criterio_completitud");
        if (criterioGuardado.peso && pesoInput) {
            pesoInput.value = criterioGuardado.peso;
        }
    };

    const setupConfirmarCompletitud = () => {
        const confirmarBtn = document.getElementById("btn_confirmar_completitud");

        if (confirmarBtn) {
            confirmarBtn.addEventListener("click", () => {
                console.log("Botón Confirmar clickeado para completitud");

                const checkboxes = document.querySelectorAll("#completitud-column-checklist input[type='checkbox']:checked");
                const columnasSeleccionadas = Array.from(checkboxes).map(cb => cb.value);

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

                const popupOverlay = document.getElementById("popup-overlay");
                if (popupOverlay) {
                    popupOverlay.classList.add("hidden");
                }
            });
        }
    };

    const botonCompletitud = document.getElementById("configurar_completitud");
    if (botonCompletitud) {
        botonCompletitud.addEventListener("click", () => {
            openPopupFromUrl("/static/html/static_matriz_html/popup_completitud.html", () => {
                console.log("Popup completitud cargado");
            });
        });
    }

    const mostrarPesoGuardadoCompletitud = () => {
        const criterioGuardado = JSON.parse(localStorage.getItem("criterioCompletitud"));
        const pesoSpan = document.getElementById("criterio_peso_completitud");

        if (criterioGuardado?.peso && pesoSpan) {
            pesoSpan.textContent = criterioGuardado.peso + "%";
        }
    };

    const cerrarBtn = document.getElementById("popup-close");
    if (cerrarBtn) {
        cerrarBtn.addEventListener("click", () => {
            const popupOverlay = document.getElementById("popup-overlay");
            if (popupOverlay) {
                popupOverlay.classList.add("hidden");
            }
        });
    }

    
    const popupOverlay = document.getElementById("popup-overlay");
    if (popupOverlay) {
        popupOverlay.addEventListener("click", (e) => {
            if (e.target === popupOverlay) {
                popupOverlay.classList.add("hidden");
            }
        });
    }

});
