
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors({
    origin: 'http://localhost:5174'
}));

const uri = process.env.MONGODB_URI;
console.log('¿Se encontró la conexión?', Boolean(uri));

const client = new MongoClient(uri);

const db = client.db('dulce_tentacion');

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
        const pedido = req.body;

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

const PORT = 3000;

app.get('/', (req, res) => {
    res.send('¡Bienvenido al servidor de Dulce Tentación!');
});

app.get('/api/prueba', (req, res) => {
    res.json({
        mensaje: 'La conexión con el backend funciona'
    });
});

conectarMongoDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor funcionando en http://localhost:${PORT}`);
    });
});

