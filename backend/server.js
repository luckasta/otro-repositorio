const express = require('express');

const app = express();
app.use(express.json());

app.post('/api/pedidos', (req, res) => {
    const pedido = req.body;

    console.log('Nuevo pedido recibido:');
    console.log(pedido);

    res.json({
        mensaje: 'Pedido recibido correctamente',
        pedido: pedido
    });
});

const PORT = 3000;

app.get('/', (req, res) => {
    res.send('¡Bienvenido al servidor de Dulce Tentación!');
});

app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});