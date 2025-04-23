document.getElementById("ejecutar_evaluacion").addEventListener("click", async function () {
    try {
        const tabla = localStorage.getItem("selectedTableName");

        const criterios = {

            criterioConsistencia: localStorage.getItem("criterioConsistencia"),
            criterioExactitud: localStorage.getItem("criterioExactitud"),
            criterioValidez: localStorage.getItem("criterioValidez"),
            criterioUsabilidad: localStorage.getItem("criterioUsabilidad"),
            criterioCompletitud: localStorage.getItem("criterioCompletitud"),

        }

        print(criterios)


        if (!tabla || !criterios) {
            alert("Faltan datos en localStorage. Asegúrate de tener 'tabla' y 'criteriosEvaluacion'.");
            return;
        }

        const response = await fetch("/evaluar-localstorage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                data: tabla,
                criterios: criterios,
            }),
        });

        const resultado = await response.json();

        if (!response.ok) {
            alert("Error en la evaluación.");
            return;
        }

        const popupContent = document.getElementById("popup-content");
        popupContent.innerHTML = "";
        for (const [criterio, info] of Object.entries(resultado)) {
            if (criterio === "score_final") continue;

            const section = document.createElement("div");
            section.classList.add("criterio-section");

            const titulo = document.createElement("h4");
            titulo.textContent = `🧠 ${criterio.toUpperCase()} - Score: ${(info.score * 100).toFixed(2)}%`;

            const detalle = document.createElement("pre");
            detalle.textContent = JSON.stringify(info.detalle, null, 2);

            section.appendChild(titulo);
            section.appendChild(detalle);
            popupContent.appendChild(section);
        }

        // Agregar score final
        const total = document.createElement("h3");
        total.textContent = `🎯 Score Final: ${(resultado.score_final * 100).toFixed(2)}%`;
        popupContent.appendChild(total);

        // Mostrar popup
        document.getElementById("popup-overlay").classList.remove("hidden");

    } catch (err) {
        console.log(err)
        console.error("Error de red o ejecución:", err);
        alert("Error inesperado al evaluar.");
    }
});

// Botón para cerrar popup
document.getElementById("popup-close").addEventListener("click", function () {
    document.getElementById("popup-overlay").classList.add("hidden");
});
