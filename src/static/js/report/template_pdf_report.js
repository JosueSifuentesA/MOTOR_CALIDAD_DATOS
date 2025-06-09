
document.getElementById("scoreFinal").textContent = (pobiData.score_final * 100).toFixed(1) + "%";


const radarCtx = document.getElementById("radarChart").getContext("2d");
radarCtx.canvas.parentNode.style.backgroundColor = "#1D1C1C";


const criterios = Object.keys(pobiData).filter(key => key !== "score_final");


const radarLabels = criterios.map(key => key.charAt(0).toUpperCase() + key.slice(1));
const radarScores = criterios.map(key => pobiData[key].score || 0);

new Chart(radarCtx, {
    type: 'radar',
    data: {
        labels: radarLabels,
        datasets: [{
            label: 'Score por Dimensión',
            data: radarScores,
            backgroundColor: 'rgba(79, 149, 242, 0.5)',
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
    section.innerHTML = `<h3>${nombre.charAt(0).toUpperCase() + nombre.slice(1)}</h3>`;

    const table = document.createElement("table");
    table.innerHTML = `
        <thead>
            <tr><th>Campo</th><th>Score</th><th>Visual</th></tr>
        </thead>
        <tbody>
            ${Object.entries(detalle).map(([campo, valor]) => `
                <tr>
                    <td>${campo}</td>
                    <td>${(valor * 100).toFixed(1)}%</td>
                    <td><div class="bar" style="width:${Math.max(0, valor) * 100}%;"></div></td>
                </tr>
            `).join('')}
        </tbody>
        <div class="page-break"></div>
    `;
    section.appendChild(table);
    detalleContainer.appendChild(section);
}

// Generar tablas dinámicamente solo si el criterio tiene detalle
criterios.forEach(dim => {
    if (pobiData[dim].detalle) {
        createDetalleTable(dim, pobiData[dim].detalle);
    }
});
