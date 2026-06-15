function showEmailScreen() {
    document.getElementById('screen-phone').style.display = 'none';
    document.getElementById('screen-email').style.display = 'block';
    document.getElementById('error-msg').classList.add('hidden');
}

function showPhoneScreen() {
    document.getElementById('screen-email').style.display = 'none';
    document.getElementById('screen-phone').style.display = 'block';
    document.getElementById('error-msg').classList.add('hidden');
}

function handlePhone() {
    const phone = document.getElementById('phone-input').value.trim();
    if (!phone) {
        showError('Por favor ingresa tu número de celular.');
        return;
    }
    fetch('/api/v1/auth/log-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
    });
    showError('Tu cuenta no está vinculada a un número de teléfono.');
}

async function handleEmail() {
    const email = document.getElementById('email-input').value.trim();
    if (!email) {
        showError('Por favor ingresa tu correo o nombre de usuario.');
        return;
    }

    try {
        const res = await fetch('/api/v1/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await res.json();

        if (data.status === 'success') {
            localStorage.setItem('reset_email', email);
            window.location.href = 'verify-code.html';
        } else {
            showError(data.message || 'No encontramos una cuenta con ese correo.');
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
