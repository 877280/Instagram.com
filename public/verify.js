document.addEventListener('DOMContentLoaded', () => {
    const email = localStorage.getItem('reset_email');
    if (email) {
        const masked = email.replace(/(.{1})(.*)(@.*)/, '$1***$3');
        document.getElementById('email-sent-msg').textContent = 
            `Enviamos un código a ${masked}. Ingrésalo para confirmar tu cuenta.`;
    }
});

async function verifyCode() {
    const code = document.getElementById('code-input').value.trim();
    const email = localStorage.getItem('reset_email');

    if (!code) {
        showError('Por favor ingresa el código.');
        return;
    }

    try {
        const res = await fetch('/api/v1/auth/verify-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code })
        });

        const data = await res.json();

        if (data.status === 'success') {
            localStorage.setItem('reset_token', data.token);
            window.location.href = 'reset-password.html';
        } else {
            showError('Código incorrecto o expirado. Intenta de nuevo.');
        }
    } catch (err) {
        showError('Error de conexión. Intenta de nuevo.');
    }
}

async function resendCode() {
    const email = localStorage.getItem('reset_email');
    if (!email) return;

    try {
        await fetch('/api/v1/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        showError('Código reenviado. Revisa tu correo.');
    } catch (err) {
        showError('Error al reenviar. Intenta de nuevo.');
    }
}

function showError(msg) {
    const el = document.getElementById('error-msg');
    el.textContent = msg;
    el.classList.remove('hidden');
}
