require('dotenv').config();

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI;
const correo = process.env.ADMIN_EMAIL;
const contrasena = process.env.ADMIN_PASSWORD;

async function crearAdmin() {
    if (!uri || !correo || !contrasena) {
        throw new Error('Faltan variables de entorno en el archivo .env');
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();

        const db = client.db('dulce_tentacion');

        // Convertimos la contraseña en un hash seguro.
        const contrasenaHash = await bcrypt.hash(contrasena, 12);

        // Creamos o actualizamos el administrador.
        await db.collection('admins').updateOne(
            { email: correo.trim().toLowerCase() },
            {
                $set: {
                    email: correo.trim().toLowerCase(),
                    passwordHash: contrasenaHash,
                    role: 'admin'
                }
            },
            { upsert: true }
        );

        console.log('¡Administrador registrado correctamente!');

    } catch (error) {
        console.error('Error al crear el administrador:', error);

    } finally {
        await client.close();
    }
}

crearAdmin();