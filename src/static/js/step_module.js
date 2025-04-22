document.addEventListener('DOMContentLoaded', () => {
    console.log("SE LOGRO CONECTAR EL STEP_MODULE")
    const path = window.location.pathname;
    const currentStep = path.split('/').pop();

    const steps = [
        {name: '',selector:'.sidebar_option_perfilado' },
        { name: 'perfilado', selector: '.sidebar_option_perfilado' },
        { name: 'matriz_evaluacion', selector: '.sidebar_option_matriz' },
        { name: 'reportes', selector: '.sidebar_option_reportes' },
        { name: 'exportacion', selector: '.sidebar_option_exportacion' }
    ];

    const stepIndex = steps.findIndex(step => step.name === currentStep);

    steps.forEach((step, index) => {
        const element = document.querySelector(step.selector);
        if (!element) return;

        if (index < stepIndex) {
            element.classList.add('step--completo');
        } else if (index === stepIndex) {
            element.classList.add('step--actual');
        } else {
            element.classList.add('step--pendiente');
        }

        // Asignar clase al separador vertical siguiente
        const separator = element.nextElementSibling;
        if (separator && separator.classList.contains('sidebar_separation_line')) {
            const line = separator.querySelector('.line');
            if (line) {
                if (index < stepIndex) {
                    line.classList.add('line--completo');
                } else {
                    line.classList.add('line--pendiente');
                }
            }
        }
    });
});
