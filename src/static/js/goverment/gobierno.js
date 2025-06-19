document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".cards_handler_card");

    cards.forEach(card => {
        card.addEventListener("click", async () => {
            const tableName = card.dataset.tableName;

            try {
                const response = await fetch("/obtener_columnas", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ table_name: tableName })
                });

                const data = await response.json();

                if (data.status === "ok") {
                    mostrarColumnasEnCatalogo(data.columnas, tableName);
                } else {
                    alert("Error al obtener columnas: " + data.mensaje);
                }
            } catch (error) {
                console.error("Error al hacer la solicitud:", error);
                alert("Error de conexión con el servidor.");
            }
        });
    });
});

function mostrarColumnasEnCatalogo(columnas, tabla) {
    const container = document.getElementById("columns_container");
    container.innerHTML = ""; // Limpiar columnas anteriores

    columnas.forEach(col => {
        const label = document.createElement("label");
        label.textContent = `📝 ${col}`;
        container.appendChild(label);
    });

    // Mostrar contenedor con columnas
    document.getElementById("catalog_detail_container_info").style.display = "flex";
    // Ocultar mensaje de "no seleccionada"
    document.getElementById("catalog_detail_container_no_selection").style.display = "none";

    console.log(`Columnas de la tabla ${tabla}:`, columnas);
}
