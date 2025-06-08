document.addEventListener("DOMContentLoaded", () => {
    restaurarSeleccion("criterio_option_exportation_container_handler", "criterios_seleccionados", true);
    restaurarSeleccion("variable_option_exportation_container", "detalle_seleccionado", false);
    restaurarSeleccion("metadata_option_exportation_container", "metadatos_seleccionados", true);

    // Criterios: inputs checkbox dentro de contenedor _handler
    document.querySelectorAll(".criterio_option_exportation_container_handler input[type='checkbox']").forEach(input => {
        input.addEventListener("change", () => {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (!label) return;

            if (input.checked) label.classList.add("seleccionado");
            else label.classList.remove("seleccionado");

            guardarSeleccion("criterio_option_exportation_container_handler", "criterios_seleccionados", true);
        });
    });

    // Variables (igual que antes)
    document.querySelectorAll(".variable_option_exportation_container").forEach(div => {
        div.addEventListener("click", () => {
            document.querySelectorAll(".variable_option_exportation_container").forEach(d => d.classList.remove("seleccionado"));
            div.classList.add("seleccionado");
            guardarSeleccion("variable_option_exportation_container", "detalle_seleccionado", false);
        });
    });

    // Metadatos (igual que antes)
    document.querySelectorAll(".metadata_option_exportation_container").forEach(div => {
        div.addEventListener("click", () => {
            div.classList.toggle("seleccionado");
            guardarSeleccion("metadata_option_exportation_container", "metadatos_seleccionados", true);
        });
    });

    function guardarSeleccion(clase, storageKey, multiple) {
        if(clase === "criterio_option_exportation_container_handler"){
            // Guardar criterios desde los labels que tengan la clase seleccionado dentro del handler
            const seleccionados = Array.from(document.querySelectorAll(`.${clase} label.seleccionado`)).map(label => {
                const span = label.querySelector("span");
                return span ? span.textContent.trim() : label.textContent.trim();
            });
            localStorage.setItem(storageKey, multiple ? JSON.stringify(seleccionados) : (seleccionados[0] || ""));
        } else {
            // Variables y Metadatos
            const seleccionados = Array.from(document.querySelectorAll(`.${clase}.seleccionado`)).map(div => {
                const span = div.querySelector("span");
                return span ? span.textContent.trim() : div.textContent.trim();
            });
            localStorage.setItem(storageKey, multiple ? JSON.stringify(seleccionados) : (seleccionados[0] || ""));
        }
    }

    function restaurarSeleccion(clase, storageKey, multiple) {
        const guardado = localStorage.getItem(storageKey);
        if (!guardado) return;
        const valores = multiple ? JSON.parse(guardado) : [guardado];

        if (clase === "criterio_option_exportation_container_handler") {
            // Restaurar criterios: marcar checkbox y label.seleccionado
            document.querySelectorAll(`.${clase} input[type="checkbox"]`).forEach(input => {
                const label = document.querySelector(`label[for="${input.id}"]`);
                if (!label) return;

                const span = label.querySelector("span");
                const texto = span ? span.textContent.trim() : label.textContent.trim();

                if (valores.includes(texto)) {
                    input.checked = true;
                    label.classList.add("seleccionado");
                } else {
                    input.checked = false;
                    label.classList.remove("seleccionado");
                }
            });
        } else {
            // Restaurar variables y metadatos
            document.querySelectorAll(`.${clase}`).forEach(div => {
                const span = div.querySelector("span");
                const texto = span ? span.textContent.trim() : div.textContent.trim();
                if (valores.includes(texto)) {
                    div.classList.add("seleccionado");
                } else {
                    div.classList.remove("seleccionado");
                }
            });
        }
    }

    // BOTÓN DE EXPORTACIÓN
    document.getElementById("ejecutar_exportacion")?.addEventListener("click", () => {
        const criterios = Array.from(document.querySelectorAll(".criterio_option_exportation_container_handler label.seleccionado"))
                              .map(label => label.querySelector("span")?.textContent.trim() || label.textContent.trim());

        const metadatos = Array.from(document.querySelectorAll('input[name="metadatos"]:checked')).map(el => el.value);

        // Obtener nivel de detalle
        const nivel_detalle = document.querySelector('#nivel_detalle').value;

        const tipoReporte = document.querySelector("input[name='tipo_reporte']:checked")?.value || null;
        const nombreArchivo = document.querySelector("input[name='file_name']")?.value || "";

        const datosFormulario = {
            criterios: criterios,
            metadatos: metadatos,
            nivel_detalle: nivel_detalle,
            tipo_reporte: tipoReporte,
            nombre_archivo: nombreArchivo
        };

        const resultado_evaluacion = JSON.parse(localStorage.getItem("resultado_evaluacion"));

        const dataExportacion = {
            dataFormulario : datosFormulario,
            resultadoEvaluacion : resultado_evaluacion
        }

        fetch('/exportar_evaluacion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataExportacion)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la respuesta del servidor");
            }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "reporte_calidad.xlsx"; // o cualquier nombre que pongas en el backend
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
        .catch(err => console.error("Error enviando evaluación:", err));



        console.log("Opciones seleccionadas:", JSON.stringify(dataExportacion, null, 2));
    });
});



