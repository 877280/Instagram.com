async function resetPassword() {
    const newPassword = document.getElementById('new-password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();
    const token = localStorage.getItem('reset_token');

    if (!newPassword || !confirmPassword) {
        showError('Por favor completa todos los campos.');
        return;
    }

    if (newPassword.length < 6) {
        showError('La contraseña debe tener al menos 6 caracteres.');
        return;
    }

    if (newPassword !== confirmPassword) {
        showError('Las contraseñas no coinciden.');
        return;
    }

    try {
        const res = await fetch('/api/v1/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, newPassword })
        });

        const data = await res.json();

        if (data.status === 'success') {
            document.getElementById('error-msg').classList.add('hidden');
            document.getElementById('success-msg').classList.remove('hidden');
            localStorage.removeItem('reset_email');
            localStorage.removeItem('reset_token');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            showError('Error al cambiar la contraseña. Intenta de nuevo.');
        }
    } catch (err) {
        showError('Error de conexión. Intenta de nuevo.');
    }
}

function showError(msg) {
    const el = document.getElementById('error-msg');
    el.textContent = msg;
    el.classList.remove('hidden');
}
