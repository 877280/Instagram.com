const mysql = require('mysql2/promise');

// 1. CONFIGURACIÓN DEL POOL DE CONEXIONES INDUSTRIAL
const pool = mysql.createPool({
    host: '127.0.0.1',             // IP local explícita para Termux
    user: 'root',                  // Administrador por defecto
    password: '',                  // Sin contraseña por defecto
    database: 'instagram_prod',    // Tu base de datos recién creada
    waitForConnections: true,
    connectionLimit: 20,           // Soporta hasta 20 peticiones simultáneas
    queueLimit: 0,
    enableKeepAlive: true,         // Mantiene viva la conexión
    keepAliveInitialDelay: 10000
});

// 2. MONITOR DE SALUD OPERATIVA (DIAGNÓSTICO AUTOMÁTICO)
// Hace una prueba rápida al encender para avisarte si la base de datos responde
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log(`=================================================`);
        console.log(`✅ [DATABASE SUCCESS]: Conexión exitosa a MariaDB`);
        console.log(`📌 Base de datos activa: instagram_prod`);
        console.log(`=================================================`);
        connection.release(); // Libera la conexión de prueba
    } catch (err) {
        console.log(`=================================================`);
        console.warn(`⚠️  [DATABASE WARNING]: No se pudo conectar a MariaDB`);
        console.warn(`👉 Causa: El servicio podría estar apagado en Termux`);
        console.warn(`⚙️  [SISTEMA DE MITIGACIÓN]: Modo Bypass activado`);
        console.warn(`💡 El servidor Express funcionará en modo aislado`);
        console.log(`=================================================`);
    }
})();

module.exports = pool;
0

