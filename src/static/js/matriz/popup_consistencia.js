document.addEventListener("DOMContentLoaded", function () {
    const btnConsistencia = document.getElementById("configurar_consistencia");

    btnConsistencia.addEventListener("click", function () {
        const tableName = localStorage.getItem("selectedTableName");
        if (!tableName) {
            alert("Por favor selecciona una tabla primero.");
            return;
        }

        const popupOverlay = document.getElementById("popup-overlay");
        const popupContent = document.getElementById("popup-content");

        popupOverlay.classList.remove("hidden");

        popupContent.innerHTML = `
            <h2>Evaluando consistencia...</h2>
            <div class="progress-bar" style="width: 100%; background: #ddd; border-radius: 8px; overflow: hidden; margin-top: 10px;">
                <div id="progress-fill" style="height: 20px; width: 10%; background-color: #4CAF50; transition: width 0.3s;"></div>
            </div>
            <div>
                <label for="peso_criterio_consistencia">Ingresa el peso (%): </label>
                <input type="number" id="peso_criterio_consistencia" placeholder="0" min="0" max="100" />
            </div>
            <button id="guardar_peso_btn" style="margin-top: 10px;">Guardar Peso</button>
        `;

        const progressFill = document.getElementById("progress-fill");

        let progreso = 10;
        const intervalo = setInterval(() => {
            if (progreso < 90) {
                progreso += 5;
                progressFill.style.width = `${progreso}%`;
            }
        }, 300);

        fetch(`/evaluar_consistencia?table_name=${encodeURIComponent(tableName)}`)
            .then(response => {
                if (!response.ok) throw new Error("Error en la respuesta del servidor");
                return response.json();
            })
            .then(data => {

                console.log("Consistencia evaluada correctamente, espera a que el usuario ingrese el peso.");

                localStorage.setItem("criterioConsistencia", JSON.stringify(data.resultado));


                clearInterval(intervalo);
                progressFill.style.width = "100%";
            })
            .catch(error => {
                clearInterval(intervalo);
                popupOverlay.classList.add("hidden");
                console.error("Error al evaluar consistencia:", error);
                alert("Ocurrió un error durante la evaluación de consistencia.");
            });

        const guardarPesoBtn = document.getElementById("guardar_peso_btn");
        guardarPesoBtn.addEventListener("click", () => {
            const pesoInput = document.getElementById("peso_criterio_consistencia");
            const peso = pesoInput ? pesoInput.value.trim() : "0";

            if (peso && peso >= 0 && peso <= 100) {

                localStorage.setItem("criterioPesoConsistencia", peso);


                const pesoSpan = document.getElementById("criterio_peso_consistencia");
                if (pesoSpan) {
                    pesoSpan.textContent = `${peso}%`;
                }


                const popupOverlay = document.getElementById("popup-overlay");
                if (popupOverlay) {
                    popupOverlay.classList.add("hidden");
                }
                alert("Peso guardado exitosamente.");
            } else {
                alert("Por favor, ingresa un peso válido entre 0 y 100.");
            }
        });
    });


    const popupClose = document.getElementById("popup-close");
    popupClose.addEventListener("click", () => {
        const popupOverlay = document.getElementById("popup-overlay");
        popupOverlay.classList.add("hidden");
    });


    const criterioConsistenciaGuardado = JSON.parse(localStorage.getItem("criterioConsistencia") || "{}");
    if (criterioConsistenciaGuardado.peso) {
        const pesoSpan = document.getElementById("criterio_peso_consistencia");
        if (pesoSpan) {
            pesoSpan.textContent = `${criterioConsistenciaGuardado.peso}%`;
        }
    }
});


document.addEventListener("DOMContentLoaded", function () {
    
    const criterioPesoConsistencia = localStorage.getItem("criterioPesoConsistencia");

    
    if (criterioPesoConsistencia) {
        const pesoSpan = document.getElementById("criterio_peso_consistencia");
        if (pesoSpan) {
            pesoSpan.textContent = `${criterioPesoConsistencia}%`;
        }
    }
});
