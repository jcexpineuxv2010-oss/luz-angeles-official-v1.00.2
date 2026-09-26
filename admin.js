// --- PROTECCIÓN DE ACCESO (LOGIN) ---
if (localStorage.getItem("sesionActiva") !== "true") {
    alert("Acceso no autorizado. Por favor, inicia sesión.");
    window.location.href = "login.html";
}
document.addEventListener("DOMContentLoaded", () => {
    cargarCitas();
});

function cargarCitas() {
    const tablaBody = document.getElementById("tablaCitasBody");
    const sinCitasDiv = document.getElementById("sinCitas");
    
    // Obtenemos las citas guardadas en el navegador (simulando base de datos local)
    let citas = JSON.parse(localStorage.getItem("citasLuzAngeles")) || [];

    tablaBody.innerHTML = "";

    if (citas.length === 0) {
        sinCitasDiv.style.display = "block";
        return;
    } else {
        sinCitasDiv.style.display = "none";
    }

    citas.forEach((cita, index) => {
        let fila = document.createElement("tr");
        fila.style.borderBottom = "1px solid #f0f0f0";

        let estadoColor = cita.estado === "Confirmada" ? "#28a745" : "#f0ad4e";

        fila.innerHTML = `
            <td style="padding: 15px; font-weight: 600; color: var(--primary-color);">${cita.nombre}</td>
            <td style="padding: 15px;">${cita.terapia}</td>
            <td style="padding: 15px;">${cita.fecha} <br><small style="color: #666;">${cita.hora}</small></td>
            <td style="padding: 15px;">${cita.telefono}<br><small>${cita.correo}</small></td>
            <td style="padding: 15px;"><span style="background: ${estadoColor}; color: white; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">${cita.estado || 'Pendiente'}</span></td>
            <td style="padding: 15px; text-align: center; display: flex; gap: 8px; justify-content: center;">
                <button onclick="confirmarYAgendar(${index})" style="background: #28a745; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 0.85rem;" title="Confirmar y Google Calendar"><i class="fa-solid fa-check"></i></button>
                <button onclick="enviarWhatsAppRecordatorio(${index})" style="background: #25d366; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 0.85rem;" title="Enviar WhatsApp"><i class="fa-brands fa-whatsapp"></i></button>
                <button onclick="eliminarCita(${index})" style="background: #d9534f; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 0.85rem;" title="Eliminar cita"><i class="fa-solid fa-trash-can"></i></button>
            </td>
        `;
        tablaBody.appendChild(fila);
    });
}

function confirmarYAgendar(index) {
    let citas = JSON.parse(localStorage.getItem("citasLuzAngeles")) || [];
    let cita = citas[index];

    cita.estado = "Confirmada";
    localStorage.setItem("citasLuzAngeles", JSON.stringify(citas));

    // 1. Limpiar la fecha (ej: "2026-10-02" pasa a "20261002")
    const fechaLimpia = cita.fecha.replace(/-/g, '');

    // 2. Convertir la hora seleccionada (ej: "03:00 PM" o "15:00") a formato HHMMSS
    let horaStr = cita.hora.trim();
    let hInicio = 15; // Valor por defecto (3:00 PM)
    let mInicio = 0;

    if (horaStr.toUpperCase().includes('PM') || horaStr.toUpperCase().includes('AM')) {
        let partes = horaStr.split(':');
        hInicio = parseInt(partes[0]);
        let minutosPartes = partes[1].split(' ');
        mInicio = parseInt(minutosPartes[0]);

        if (horaStr.toUpperCase().includes('PM') && hInicio < 12) hInicio += 12;
        if (horaStr.toUpperCase().includes('AM') && hInicio === 12) hInicio = 0;
    } else if (horaStr.includes(':')) {
        let partes = horaStr.split(':');
        hInicio = parseInt(partes[0]);
        mInicio = parseInt(partes[1]);
    }

    let hFin = hInicio + 1;

    let hInicioStr = String(hInicio).padStart(2, '0');
    let hFinStr = String(hFin).padStart(2, '0');
    let mStr = String(mInicio).padStart(2, '0');

    const horaInicioFormateada = `${hInicioStr}${mStr}00`;
    const horaFinFormateada = `${hFinStr}${mStr}00`;

    const fechaHoraInicio = `${fechaLimpia}T${horaInicioFormateada}`;
    const fechaHoraFin = `${fechaLimpia}T${horaFinFormateada}`;

    const titulo = encodeURIComponent(`Sesión de Terapia (${cita.terapia}) - ${cita.nombre}`);
    const detalles = encodeURIComponent(`Cita psicológica con ${cita.nombre}.\nTeléfono: ${cita.telefono}\nCorreo: ${cita.correo}`);
    
    // 3. URL con el parámetro mágico para que genere el Meet automáticamente
    const urlCalendar = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titulo}&details=${detalles}&dates=${fechaHoraInicio}/${fechaHoraFin}&add=GoogleMeet`;

    window.open(urlCalendar, '_blank');
    cargarCitas();
}

function enviarWhatsAppRecordatorio(index) {
    let citas = JSON.parse(localStorage.getItem("citasLuzAngeles")) || [];
    let cita = citas[index];

    const texto = `Hola *${cita.nombre}*, te escribimos del consultorio Luz Angeles para recordarte y confirmar tu cita de *Terapia ${cita.terapia}* programada para el día *${cita.fecha}* a las *${cita.hora}*. ¿Confirmas tu asistencia?`;
    const urlWa = `https://wa.me/51${cita.telefono.replace(/\s+/g, '')}?text=${encodeURIComponent(texto)}`;
    
    window.open(urlWa, '_blank');
}

function eliminarCita(index) {
    if (confirm("¿Estás seguro de eliminar esta cita del sistema?")) {
        let citas = JSON.parse(localStorage.getItem("citasLuzAngeles")) || [];
        citas.splice(index, 1);
        localStorage.setItem("citasLuzAngeles", JSON.stringify(citas));
        cargarCitas();
    }
}

function cerrarSesion() {
    localStorage.removeItem("sesionActiva");
    window.location.href = "login.html";
}