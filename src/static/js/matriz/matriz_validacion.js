// Función para obtener los resultados de los criterios desde la API
const obtenerResultadosDeCriterios = async (tableName) => {
    try {
        const response = await fetch(`/evaluar_consistencia?table_name=${tableName}`);
        const data = await response.json();

        if (data.success) {
            const resultados = data.resultado;

            // Leer los datos de localStorage
            const criteriosGuardados = JSON.parse(localStorage.getItem("criteriosGuardados"));

            // Realizar el cálculo ponderado de los resultados
            const resultadosConPonderacion = calcularResultadosConPonderacion(resultados, criteriosGuardados);

            // Mostrar los resultados en el front-end o hacer lo que necesites con los resultados ponderados
            console.log(resultadosConPonderacion);
        } else {
            console.error("Error al obtener los resultados de la API", data.error);
        }
    } catch (error) {
        console.error("Error al realizar la solicitud:", error);
    }
};

// Función para calcular los resultados ponderados de acuerdo a los criterios almacenados en localStorage
const calcularResultadosConPonderacion = (resultados, criteriosGuardados) => {
    const resultadosPonderados = {};

    for (const criterio in resultados) {
        const resultadoCriterio = resultados[criterio];
        const peso = criteriosGuardados[criterio]?.peso || 0;

        // Calculamos el puntaje ponderado por cada columna
        const resultadoPonderado = resultadoCriterio.score_final * (peso / 100);
        resultadosPonderados[criterio] = {
            ...resultadoCriterio,
            resultado_ponderado: resultadoPonderado
        };
    }

    // Calcular el puntaje global ponderado
    const puntajeGlobal = Object.values(resultadosPonderados).reduce((acc, { resultado_ponderado }) => acc + resultado_ponderado, 0);
    resultadosPonderados.puntaje_global = puntajeGlobal;

    return resultadosPonderados;
};


const guardarCriteriosEnLocalStorage = () => {
    const criterios = {
        completitud: { peso: 20 },  // Aquí se deben reemplazar con los pesos reales que el usuario ingrese
        consistencia: { peso: 20 },
        exactitud: { peso: 20 },
        usabilidad: { peso: 20 },
        validez: { peso: 20 }
    };

    localStorage.setItem("criteriosGuardados", JSON.stringify(criterios));
};


const cargarCriteriosDesdeLocalStorage = () => {
    const criteriosGuardados = JSON.parse(localStorage.getItem("criteriosGuardados"));

    if (criteriosGuardados) {
        // Actualizar los valores en la interfaz si es necesario
        console.log(criteriosGuardados);
    } else {
        console.error("No se encontraron criterios en el localStorage.");
    }
};


document.getElementById("ejecutar_evaluacion").addEventListener("click", async function () {
    try {
        const tabla = "selectedTableName";
        //const criterios = JSON.parse(localStorage.getItem("criteriosEvaluacion"));

        const criterios = {

            criterioConsistencia: localStorage.getItem("criterioConsistencia"),
            criterioExactitud: localStorage.getItem("criterioExactitud"),
            criterioValidez: localStorage.getItem("criterioValidez"),
            criterioUsabilidad: localStorage.getItem("criterioUsabilidad"),
            //"criterioPesoConsistencia": JSON.parse(localStorage.getItem("criterioPesoConsistencia")),
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

        // Renderizar los resultados en el popup
        const popupContent = document.getElementById("popup-content");
        popupContent.innerHTML = ""; // Limpiar contenido anterior

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
