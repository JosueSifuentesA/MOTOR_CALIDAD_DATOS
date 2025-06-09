document.addEventListener("DOMContentLoaded", () => {
    restaurarSeleccion("criterio_option_exportation_container_handler", "criterios_seleccionados", true);
    restaurarSeleccion("variable_option_exportation_container", "detalle_seleccionado", false);
    restaurarSeleccion("metadata_option_exportation_container", "metadatos_seleccionados", true);

    document.querySelectorAll(".criterio_option_exportation_container_handler input[type='checkbox']").forEach(input => {
        input.addEventListener("change", () => {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (!label) return;

            if (input.checked) label.classList.add("seleccionado");
            else label.classList.remove("seleccionado");

            guardarSeleccion("criterio_option_exportation_container_handler", "criterios_seleccionados", true);
        });
    });

    document.querySelectorAll(".variable_option_exportation_container").forEach(div => {
        div.addEventListener("click", () => {
            document.querySelectorAll(".variable_option_exportation_container").forEach(d => d.classList.remove("seleccionado"));
            div.classList.add("seleccionado");
            guardarSeleccion("variable_option_exportation_container", "detalle_seleccionado", false);
        });
    });

    document.querySelectorAll(".metadata_option_exportation_container").forEach(div => {
        div.addEventListener("click", () => {
            div.classList.toggle("seleccionado");
            guardarSeleccion("metadata_option_exportation_container", "metadatos_seleccionados", true);
        });
    });

    function guardarSeleccion(clase, storageKey, multiple) {
        if(clase === "criterio_option_exportation_container_handler"){

            const seleccionados = Array.from(document.querySelectorAll(`.${clase} label.seleccionado`)).map(label => {
                const span = label.querySelector("span");
                return span ? span.textContent.trim() : label.textContent.trim();
            });
            localStorage.setItem(storageKey, multiple ? JSON.stringify(seleccionados) : (seleccionados[0] || ""));
        } else {

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

    document.getElementById("ejecutar_exportacion")?.addEventListener("click", () => {
        const criterios = Array.from(document.querySelectorAll(".criterio_option_exportation_container_handler label.seleccionado"))
                              .map(label => label.querySelector("span")?.textContent.trim() || label.textContent.trim());

        const metadatos = Array.from(document.querySelectorAll('input[name="metadatos"]:checked')).map(el => el.value);


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

        function limpiarNombreArchivo(nombre) {
            return nombre.replace(/[^a-zA-Z0-9_-]/g, '') || 'reporte';
        }


        const criteriosSeleccionados = datosFormulario.criterios || [];

        const criteriosMapeo = {
            "Exactitud": "exactitud",
            "Completitud": "completitud",
            "Consistencia": "consistencia",
            "Usabilidad": "usabilidad"
        };

        // Filtramos resultado_evaluacion solo con los criterios solicitados
        const resultadoFiltrado = {};

        criteriosSeleccionados.forEach(nombreCriterio => {
            const clave = criteriosMapeo[nombreCriterio];
            if (clave && resultado_evaluacion.hasOwnProperty(clave)) {
                resultadoFiltrado[clave] = resultado_evaluacion[clave];
            }
        });

        // Siempre puedes mantener el score final si lo necesitas
        if (resultado_evaluacion.hasOwnProperty("score_final")) {
            resultadoFiltrado["score_final"] = resultado_evaluacion["score_final"];
        }

        const dataExportacion = {
            dataFormulario: datosFormulario,
            resultadoEvaluacion: resultadoFiltrado
        };


        const nombreLimpio = limpiarNombreArchivo(dataExportacion.dataFormulario.nombre_archivo)

        if (dataExportacion.dataFormulario.tipo_reporte === "excel"){
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
                a.download =  `${nombreLimpio}.xlsx`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            })
            .catch(err => console.error("Error enviando evaluación:", err));

        }else if (dataExportacion.dataFormulario.tipo_reporte === "pdf"){

            fetch('/exportar_pdf', {
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
                a.download =  `${nombreLimpio}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            })
            .catch(err => console.error("Error enviando evaluación:", err));

        }

        console.log("Opciones seleccionadas:", JSON.stringify(dataExportacion, null, 2));
    });
});



