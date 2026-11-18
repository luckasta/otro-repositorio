
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const OpenAI = require('openai');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

const solicitudesIA = new Map();

const LIMITE_SOLICITUDES = 10;
const VENTANA_TIEMPO = 10 * 60 * 1000;
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));

const uri = process.env.MONGODB_URI;
console.log('¿Se encontró la conexión?', Boolean(uri));

const client = new MongoClient(uri);

const db = client.db('dulce_tentacion');

async function inicializarCombos() {
    const combosIniciales = [
        {
            nombre: 'Combo Dulce',
            descripcion: '8 cupcakes y 8 galletas decoradas',
            imagen: '/imagenes/combo dulce.jpeg',
            precio: 90000,
            activa: true
        },
        {
            nombre: 'Combo Celebración',
            descripcion: 'Una mini torta para 4 porciones y 8 cupcakes',
            imagen: '/imagenes/combo celebracion.jpeg',
            precio: 130000,
            activa: true
        },
        {
            nombre: 'Combo Galletitas',
            descripcion: '12 galletas decoradas',
            imagen: '/imagenes/combo galletas.jpeg',
            precio: 50000,
            activa: true
        },
        {
            nombre: 'Combo Especial',
            descripcion: '12 porciones de mini postres',
            imagen: '/imagenes/combo especial.jpeg',
            precio: 75000,
            activa: true
        }
    ];

    for (const combo of combosIniciales) {
        await db.collection('combos').updateOne(
            { nombre: combo.nombre },
            {
                $setOnInsert: {
                    ...combo,
                    fechaCreacion: new Date()
                }
            },
            { upsert: true }
        );
    }

    console.log('Combos iniciales verificados correctamente');
}

const JWT_SECRET = process.env.JWT_SECRET;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

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

app.delete('/api/admin/pedidos/:id', verificarToken, async (req, res) => {
    try {
        const { ObjectId } = require('mongodb');

        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                mensaje: 'Identificador de pedido no válido'
            });
        }

        const resultado = await db.collection('pedidos').deleteOne({
            _id: new ObjectId(req.params.id)
        });

        if (resultado.deletedCount === 0) {
            return res.status(404).json({
                mensaje: 'No se encontró el pedido'
            });
        }

        res.json({
            mensaje: 'Pedido eliminado correctamente'
        });

    } catch (error) {
        console.error('Error al eliminar el pedido:', error);

        res.status(500).json({
            mensaje: 'No se pudo eliminar el pedido'
        });
    }
});

app.get('/api/combos', async (req, res) => {
    try {
        const combos = await db.collection('combos')
            .find({ activa: true })
            .sort({ _id: -1 })
            .toArray();

        res.json(combos);

    } catch (error) {
        console.error('Error al consultar combos públicos:', error);

        res.status(500).json({
            mensaje: 'No se pudieron consultar los combos'
        });
    }
});

app.get('/api/admin/combos', verificarToken, async (req, res) => {
    try {
        const combos = await db.collection('combos')
            .find({})
            .sort({ _id: -1 })
            .toArray();

        res.json(combos);

    } catch (error) {
        console.error('Error al consultar combos:', error);

        res.status(500).json({
            mensaje: 'No se pudieron consultar los combos'
        });
    }
});

app.post('/api/admin/combos', verificarToken, async (req, res) => {
    try {
        const {
            nombre,
            descripcion,
            imagen,
            precio,
            activa
        } = req.body;

        if (!nombre || !descripcion || !precio) {
            return res.status(400).json({
                mensaje: 'El nombre, la descripción y el precio son obligatorios'
            });
        }

        const nuevoCombo = {
            nombre,
            descripcion,
            imagen: imagen || '',
            precio: Number(precio),
            activa: activa !== undefined ? activa : true,
            fechaCreacion: new Date()
        };

        const resultado = await db.collection('combos').insertOne(nuevoCombo);

        res.status(201).json({
            mensaje: 'Combo registrado correctamente',
            combo: {
                _id: resultado.insertedId,
                ...nuevoCombo
            }
        });

    } catch (error) {
        console.error('Error al registrar combo:', error);

        res.status(500).json({
            mensaje: 'No se pudo registrar el combo'
        });
    }
});

app.patch('/api/admin/combos/:id', verificarToken, async (req, res) => {
    try {
        const { ObjectId } = require('mongodb');
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                mensaje: 'ID de combo no válido'
            });
        }

        const { nombre, descripcion, imagen, precio, activa } = req.body;

        const actualizacion = {};

        if (nombre !== undefined) actualizacion.nombre = nombre;
        if (descripcion !== undefined) actualizacion.descripcion = descripcion;
        if (imagen !== undefined) actualizacion.imagen = imagen;
        if (precio !== undefined) actualizacion.precio = Number(precio);
        if (activa !== undefined) actualizacion.activa = activa;

        const resultado = await db.collection('combos').updateOne(
            { _id: new ObjectId(id) },
            { $set: actualizacion }
        );

        if (resultado.matchedCount === 0) {
            return res.status(404).json({
                mensaje: 'No se encontró el combo'
            });
        }

        res.json({
            mensaje: 'Combo actualizado correctamente'
        });

    } catch (error) {
        console.error('Error al actualizar combo:', error);

        res.status(500).json({
            mensaje: 'No se pudo actualizar el combo'
        });
    }
});

app.delete('/api/admin/combos/:id', verificarToken, async (req, res) => {
    try {
        const { ObjectId } = require('mongodb');
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                mensaje: 'ID de combo no válido'
            });
        }

        const resultado = await db.collection('combos').deleteOne({
            _id: new ObjectId(id)
        });

        if (resultado.deletedCount === 0) {
            return res.status(404).json({
                mensaje: 'No se encontró el combo'
            });
        }

        res.json({
            mensaje: 'Combo eliminado correctamente'
        });

    } catch (error) {
        console.error('Error al eliminar combo:', error);

        res.status(500).json({
            mensaje: 'No se pudo eliminar el combo'
        });
    }
});


app.get('/api/precios', async (req, res) => {
    try {
        const precios = await db.collection('precios').findOne({
            _id: 'categorias'
        });

        res.json(precios || {
            tortas: 0,
            cupcakes: 0,
            postres: 0,
            galletas: 0
        });

    } catch (error) {
        console.error('Error al obtener los precios:', error);
        res.status(500).json({
            mensaje: 'Error al obtener los precios'
        });
    }
});



app.post('/api/ia/chat', async (req, res) => {
    try {
        const { mensaje, historial = [] } = req.body;

        
        if (
            typeof mensaje !== 'string' ||
            !mensaje.trim() ||
            mensaje.length > 1000
        ) {
            return res.status(400).json({
                mensaje: 'Envía un mensaje válido de máximo 1000 caracteres'
            });
        }
        const ip = req.ip;
const ahora = Date.now();

const registro = solicitudesIA.get(ip);

if (registro && ahora - registro.inicio < VENTANA_TIEMPO) {

    if (registro.cantidad >= LIMITE_SOLICITUDES) {
        return res.status(429).json({
            mensaje: 'Has alcanzado el límite de mensajes. Inténtalo nuevamente en unos minutos. 💜'
        });
    }

    registro.cantidad++;

} else {
    solicitudesIA.set(ip, {
        inicio: ahora,
        cantidad: 1
    });
}

        
        const [combos, precios] = await Promise.all([
            db.collection('combos')
                .find({ activa: true })
                .toArray(),

            db.collection('precios').findOne({
                _id: 'categorias'
            })
        ]);

        console.log('Combos obtenidos para la IA:', combos);

        const todosLosCombos = await db.collection('combos').find({}).toArray();

        console.log('Todos los combos en MongoDB:', todosLosCombos);

        
        const informacionTienda = {
            preciosDesde: precios || {
                tortas: 0,
                cupcakes: 0,
                postres: 0,
                galletas: 0
            },
            combosDisponibles: combos
        };

        const mensajesAnteriores = Array.isArray(historial)
            ? historial
                .filter(m =>
                    m &&
                    ['user', 'assistant'].includes(m.role) &&
                    typeof m.content === 'string'
                )
                .slice(-10)
                .map(m => ({
                    role: m.role,
                    content: m.content.slice(0, 1200)
                }))
            : [];

        const respuesta = await openai.responses.create({
            model: 'gpt-6-luna',
            reasoning: {
                effort: 'none'
            },
            instructions: `
                Eres la asesora virtual de Dulce Tentación,
                un emprendimiento de repostería creativa.

                Tu función es atender a los clientes y ayudarlos
                a elegir productos según sus gustos, necesidades,
                ocasión y presupuesto.

                INFORMACIÓN DE LA TIENDA:
                ${JSON.stringify(informacionTienda, null, 2)}

                REGLAS IMPORTANTES:

                1. Sé amable, cercana, paciente y utiliza un
                lenguaje natural en español.

                2. Si el cliente está indeciso, haz preguntas
                para conocer la ocasión, cantidad de personas,
                gustos y presupuesto.

                3. Recomienda productos y combos que realmente
                existan en la información proporcionada.

                4. Puedes proponer combinaciones personalizadas
                de tortas, cupcakes, postres y galletas,
                aunque no sean combos oficiales.

                5. Los precios de las categorías son precios
                mínimos orientativos, NO precios unitarios.
                No los sumes como si fueran precios por unidad.

                6. Los combos tienen precios registrados,
                pero aclara que pueden variar según el diseño
                y las cantidades solicitadas.

                7. Nunca inventes precios, productos,
                ingredientes ni disponibilidad.

                8. Si no tienes información suficiente para
                calcular una combinación personalizada,
                explica que requiere una cotización.

                9. Ayuda al cliente a aprovechar su presupuesto
                y compara alternativas cuando sea útil.

                10. No confirmes pedidos ni pagos.
                Invita al cliente a continuar mediante
                el formulario de contacto de la página.

                11. Mantén las respuestas claras y no demasiado
                extensas.
            `,
            input: [
                ...mensajesAnteriores,
                {
                    role: 'user',
                    content: mensaje.trim()
                }
            ]
        });

        res.json({
            respuesta: respuesta.output_text
        });

    } catch (error) {
        console.error('Error en la asesora virtual:', error);

        res.status(500).json({
            mensaje: 'No pudimos obtener una respuesta. Inténtalo nuevamente.'
        });
    }
});

app.patch('/api/admin/precios', verificarToken, async (req, res) => {
    try {
        const { tortas, cupcakes, postres, galletas } = req.body;

        const precios = { tortas, cupcakes, postres, galletas };

        // Validar que todos los precios sean números positivos o cero
        for (const precio of Object.values(precios)) {
            if (
                typeof precio !== 'number' ||
                !Number.isFinite(precio) ||
                precio < 0
            ) {
                return res.status(400).json({
                    mensaje: 'Todos los precios deben ser números positivos o cero'
                });
            }
        }

        await db.collection('precios').updateOne(
            { _id: 'categorias' },
            { $set: precios },
            { upsert: true }
        );

        res.json({
            mensaje: 'Precios actualizados correctamente',
            precios
        });

    } catch (error) {
        console.error('Error al actualizar los precios:', error);
        res.status(500).json({
            mensaje: 'Error al actualizar los precios'
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
            'Entregado',
            'Cancelado'
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

const PORT = process.env.PORT || 3000;

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

conectarMongoDB().then(async () => {
    await inicializarCombos();

    app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});
});
