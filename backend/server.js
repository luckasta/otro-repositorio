
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors({
    origin: 'http://localhost:5175'
}));

const uri = process.env.MONGODB_URI;
console.log('¿Se encontró la conexión?', Boolean(uri));

const client = new MongoClient(uri);

const db = client.db('dulce_tentacion');

const JWT_SECRET = process.env.JWT_SECRET;

function verificarToken(req, res, next) {
    const autorizacion = req.headers.authorization;

    if (!autorizacion) {
        return res.status(401).json({
            mensaje: 'No tienes autorización para acceder'
        });
    }

    const token = autorizacion.split(' ')[1];

    try {
        const datos = jwt.verify(token, JWT_SECRET);

        if (datos.role !== 'admin') {
            return res.status(403).json({
                mensaje: 'No tienes permisos de administrador'
            });
        }

        req.admin = datos;
        next();

    } catch (error) {
        return res.status(401).json({
            mensaje: 'Token inválido o expirado'
        });
    }
}

async function conectarMongoDB() {
    try {
        await client.connect();

        console.log('¡Conectados correctamente a MongoDB Atlas!');

    } catch (error) {
        console.error('Error al conectar con MongoDB:', error);
    }
}

app.use(express.json());

app.post('/api/pedidos', async (req, res) => {
    try {
        const pedido = {
    ...req.body,
    estado: 'Pendiente',
    fecha: new Date()
};

        const resultado = await db.collection('pedidos').insertOne(pedido);

        res.status(201).json({
            mensaje: 'Pedido guardado correctamente',
            id: resultado.insertedId
        });

    } catch (error) {
        console.error('Error al guardar el pedido:', error);

        res.status(500).json({
            mensaje: 'No se pudo guardar el pedido'
        });
    }
});

app.get('/api/admin/pedidos', verificarToken, async (req, res) => {
    try {
        const pedidos = await db.collection('pedidos')
            .find({})
            .sort({ _id: -1 })
            .toArray();

        res.json(pedidos);

    } catch (error) {
        console.error('Error al consultar pedidos:', error);

        res.status(500).json({
            mensaje: 'No se pudieron consultar los pedidos'
        });
    }
});

app.patch('/api/admin/pedidos/:id', verificarToken, async (req, res) => {
    try {
        const { ObjectId } = require('mongodb');
        const { estado } = req.body;

        const estadosPermitidos = [
            'Pendiente',
            'En preparación',
            'Entregado'
        ];

        if (!estadosPermitidos.includes(estado)) {
            return res.status(400).json({
                mensaje: 'Estado no válido'
            });
        }

        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                mensaje: 'Identificador de pedido no válido'
            });
        }

        const resultado = await db.collection('pedidos').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { estado: estado } }
        );

        if (resultado.matchedCount === 0) {
            return res.status(404).json({
                mensaje: 'No se encontró el pedido'
            });
        }

        res.json({
            mensaje: 'Estado del pedido actualizado correctamente'
        });

    } catch (error) {
        console.error('Error al actualizar el pedido:', error);

        res.status(500).json({
            mensaje: 'No se pudo actualizar el pedido'
        });
    }
});

const PORT = 3000;

app.get('/', (req, res) => {
    res.send('¡Bienvenido al servidor de Dulce Tentación!');
});

app.get('/api/prueba', (req, res) => {
    res.json({
        mensaje: 'La conexión con el backend funciona'
    });
});

app.post('/api/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;

   
        if (!email || !password) {
            return res.status(400).json({
                mensaje: 'Debes ingresar correo y contraseña'
            });
        }

      
        const admin = await db.collection('admins').findOne({
            email: email.trim().toLowerCase()
        });

        if (!admin) {
            return res.status(401).json({
                mensaje: 'Correo o contraseña incorrectos'
            });
        }

       
        const contrasenaCorrecta = await bcrypt.compare(
            password,
            admin.passwordHash
        );

        if (!contrasenaCorrecta) {
            return res.status(401).json({
                mensaje: 'Correo o contraseña incorrectos'
            });
        }

        
        const token = jwt.sign(
            {
                id: admin._id.toString(),
                role: admin.role
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            mensaje: 'Inicio de sesión exitoso',
            token
        });

    } catch (error) {
        console.error('Error al iniciar sesión:', error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
});

conectarMongoDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor funcionando en http://localhost:${PORT}`);
    });
});

