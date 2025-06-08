const pobiData = {
    completitud: {
        score: 0.17606837606837608,
        detalle: {
            TC_CODTARJETA: 1,
            TC_PERFIL_IDEAL: 0.7692307692307692,
            TC_PLASTICO: 0.8717948717948718
        }
    },
    consistencia: {
        score: 0.0019438290676195413,
        detalle: {
            TC_CODTARJETA: -0.01838941606514921,
            TC_INTERES: 0.16556720847248077
        }
    },
    exactitud: {
        score: 0.1,
        detalle: {
            TC_INTERES: 1,
            TC_PERFIL_IDEAL: 1,
            TC_PLASTICO: 1,
            TC_SALDOPROM_COMPRAS: 1,
            TC_SALDO_A: 1
        }
    },
    usabilidad: {
        score: 0.25897435897435894,
        detalle: {
            TC_CODTARJETA: 1,
            TC_INTERES: 0.7692307692307692,
            TC_PLASTICO: 0.8717948717948718
        }
    },
    score_final: 0.537
};

document.getElementById("scoreFinal").textContent = (pobiData.score_final * 100).toFixed(1) + "%";

// Radar Chart con fondo oscuro
const radarCtx = document.getElementById("radarChart").getContext("2d");

// Fondo del canvas
radarCtx.canvas.parentNode.style.backgroundColor = "#1D1C1C";

new Chart(radarCtx, {
    type: 'radar',
    data: {
        labels: ['Completitud', 'Consistencia', 'Exactitud', 'Usabilidad'],
        datasets: [{
            label: 'Score por Dimensión',
            data: [
                pobiData.completitud.score,
                pobiData.consistencia.score,
                pobiData.exactitud.score,
                pobiData.usabilidad.score
            ],
            backgroundColor: '#4F95F2',
            borderColor: '#4f5af2',
            borderWidth: 2,
            pointBackgroundColor: '#4f5af2'
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    color: '#ffffff'
                }
            }
        },
        scales: {
            r: {
                min: 0,
                max: 1,
                ticks: {
                    stepSize: 0.2,
                    color: '#cccccc',
                    backdropColor: 'transparent'
                },
                grid: {
                    color: '#888888'
                },
                angleLines: {
                    color: '#888888'
                },
                pointLabels: {
                    color: '#ffffff'
                }
            }
        }
    }
});


const detalleContainer = document.getElementById("detalleContainer");

function createDetalleTable(nombre, detalle) {
    const section = document.createElement("div");
    section.innerHTML = `<h3>${nombre}</h3>`;
    
    const table = document.createElement("table");
    table.innerHTML = `
        <thead>
            <tr><th>Campo</th><th>Score</th><th>Visual</th></tr>
        </thead>
        <tbody>
            ${Object.entries(detalle).map(([campo, valor]) => `
                <tr>
                    <td>${campo}</td>
                    <td>${valor.toFixed(3) * 100} %</td>
                    <td><div class="bar" style="width:${Math.max(0, valor) * 100}%;"></div></td>
                </tr>
            `).join('')}
        </tbody>
    `;
    section.appendChild(table);
    detalleContainer.appendChild(section);
}

['completitud', 'consistencia', 'exactitud', 'usabilidad'].forEach(dim => {
    createDetalleTable(dim, pobiData[dim].detalle);
});
