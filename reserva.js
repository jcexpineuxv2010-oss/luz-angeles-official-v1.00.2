document.addEventListener('DOMContentLoaded', function () {
    // --- Detectar si viene una terapia seleccionada desde otra página ---
    const urlParams = new URLSearchParams(window.location.search);
    const terapiaParam = urlParams.get('terapia');

    if (terapiaParam) {
        const radioTarget = document.querySelector(`input[name="tipoTerapia"][value="${terapiaParam}"]`);
        if (radioTarget) {
            radioTarget.checked = true;
        }
    }
    // ------------------------------------------------------------------------

    const formReserva = document.getElementById('formReserva');
    const fechaInput = document.getElementById('fechaCita');

    // CONFIGURACIÓN DE FECHA MÍNIMA: A partir del día siguiente
    if (fechaInput) {
        const manana = new Date();
        manana.setDate(manana.getDate() + 1); // Suma un día exacto
        
        const anio = manana.getFullYear();
        const mes = String(manana.getMonth() + 1).padStart(2, '0');
        const dia = String(manana.getDate()).padStart(2, '0');
        
        fechaInput.min = `${anio}-${mes}-${dia}`;
    }

    if (formReserva) {
        formReserva.addEventListener('submit', function (e) {
            e.preventDefault();

            // 1. Capturar los datos del formulario usando los IDs correctos
            const tipoTerapia = document.querySelector('input[name="tipoTerapia"]:checked').value;
            const fecha = document.getElementById('fechaCita').value;
            const hora = document.getElementById('horaCita').value;
            
            const nombre = document.getElementById('nombrePaciente').value.trim();
            const correo = document.getElementById('correoPaciente').value.trim();
            const telefono = document.getElementById('telefonoPaciente').value.trim();
            const nroOperacion = document.getElementById('nroOperacion') ? document.getElementById('nroOperacion').value.trim() : '';

            // 2. Crear el objeto de la nueva cita
            const nuevaCita = {
                terapia: tipoTerapia,
                fecha: fecha,
                hora: hora,
                nombre: nombre,
                correo: correo,
                telefono: telefono,
                operacion: nroOperacion,
                estado: "Pendiente"
            };

            // 3. Guardar en el almacenamiento local (localStorage) para que viaje al panel admin
            let citas = JSON.parse(localStorage.getItem("citasLuzAngeles")) || [];
            citas.push(nuevaCita);
            localStorage.setItem("citasLuzAngeles", JSON.stringify(citas));

            // 4. Alerta visual de éxito
            alert(`¡Cita agendada con éxito!\n\nModalidad: Terapia ${tipoTerapia}\nFecha: ${fecha}\nHora: ${hora}\n\nLos datos han sido enviados al consultorio.`);

            // 5. Reiniciar formulario y restablecer la fecha mínima de mañana
            formReserva.reset();
            if (fechaInput) {
                const manana = new Date();
                manana.setDate(manana.getDate() + 1);
                const anio = manana.getFullYear();
                const mes = String(manana.getMonth() + 1).padStart(2, '0');
                const dia = String(manana.getDate()).padStart(2, '0');
                fechaInput.min = `${anio}-${mes}-${dia}`;
            }
        });
    }
});