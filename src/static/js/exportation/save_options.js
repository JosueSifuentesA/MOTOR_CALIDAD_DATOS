document.addEventListener("DOMContentLoaded", () => {
    alert("Elexir")
    restaurarSeleccion("criterio_option_exportation_container", "criterios_seleccionados", true);
    restaurarSeleccion("variable_option_exportation_container", "detalle_seleccionado", false);
    restaurarSeleccion("metadata_option_exportation_container", "metadatos_seleccionados", true);


    document.querySelectorAll(".criterio_option_exportation_container").forEach(div => {
        div.addEventListener("click", () => {
            div.classList.toggle("seleccionado");
            guardarSeleccion("criterio_option_exportation_container", "criterios_seleccionados", true);
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
        const seleccionados = Array.from(document.querySelectorAll(`.${clase}.seleccionado`))
                                  .map(div => div.textContent.trim());
        localStorage.setItem(storageKey, multiple ? JSON.stringify(seleccionados) : (seleccionados[0] || ""));
    }

    function restaurarSeleccion(clase, storageKey, multiple) {
        const guardado = localStorage.getItem(storageKey);
        if (!guardado) return;
        const valores = multiple ? JSON.parse(guardado) : [guardado];

        document.querySelectorAll(`.${clase}`).forEach(div => {
            const texto = div.textContent.trim();
            if (valores.includes(texto)) {
                div.classList.add("seleccionado");
            }
        });
    }
});

