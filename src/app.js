// app.js - Punto de entrada principal de la aplicación API de Ecommerce

const express = require('express');
const app = express();


const productRoutes = require('./routes/rutas.productos');
const cartRoutes = require('./routes/rutas.carritos');


app.use(express.json());


app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);


app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'API de Ecommerce funcionando correctamente',
        endpoints: {
            products: '/api/products',
            carts: '/api/carts'
        }
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
    console.log('Endpoints disponibles:');
    console.log(`- Productos: http://localhost:${PORT}/api/products`);
    console.log(`- Carritos: http://localhost:${PORT}/api/carts`);
});