/* ==========================================
   INTERACTIVIDAD GENERAL Y MENÚ MÓVIL
========================================== */

document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        // Abrir/cerrar el menú en dispositivos móviles al hacer clic en el ícono
        menuToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('open');
        });

        // Cerrar el menú automáticamente al hacer clic en cualquier enlace del menú
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('open');
            });
        });
    }
});