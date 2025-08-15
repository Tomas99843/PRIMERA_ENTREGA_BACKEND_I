import express from 'express';
import { engine } from 'express-handlebars';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';
import ProductServices from './controllers/productServices.js'; 
import productRouter from './routes/rutas.productos.js';
import cartRouter from './routes/rutas.carritos.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const productService = new ProductServices();


mongoose.connect('mongodb+srv://coderhouse:coderhouse123@tomas98.dq0q7gz.mongodb.net/ecommerce?retryWrites=true&w=majority')
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error de conexión:', err));


app.engine('handlebars', engine({
  layoutsDir: join(__dirname, 'views/layouts'),
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.set('views', join(__dirname, 'views'));


app.use('/css', express.static(join(__dirname, 'public/css'), {
  setHeaders: (res, path) => {
    res.set('Content-Type', 'text/css');
  }
}));

app.get('/css/styles.css', (req, res) => {
  res.sendFile(join(__dirname, 'public/css/styles.css'), {
    headers: {
      'Content-Type': 'text/css'
    }
  });
});

app.use(express.static(join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/css/styles.css', (req, res) => {
  res.sendFile(join(__dirname, 'public/css/styles.css'), {
    headers: {
      'Content-Type': 'text/css'
    }
  });
});


app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);


app.get('/', async (req, res) => {
  try {
    const result = await productService.getAllProducts({});
    res.render('home', {
      title: 'Productos',
      products: result.payload,
      layout: 'main'
    });
  } catch (error) {
    res.status(500).render('error', { error });
  }
});

app.get('/realtimeproducts', async (req, res) => {
  try {
    const result = await productService.getAllProducts({});
    res.render('realTimeProducts', {
      title: 'Productos en Tiempo Real',
      products: result.payload,
      script: 'realTimeProducts',
      layout: 'main'
    });
  } catch (error) {
    res.status(500).render('error', { error });
  }
});


io.on('connection', (socket) => {
  console.log('🟢 Cliente conectado:', socket.id);

  productService.getAllProducts({})
    .then(result => socket.emit('productosIniciales', result.payload));

  socket.on('agregarProducto', async (producto) => {
    try {
      const newProduct = await productService.addProduct({
        ...producto,
        price: Number(producto.price),
        stock: Number(producto.stock || 10)
      });
      const result = await productService.getAllProducts({});
      io.emit('productosActualizados', result.payload);
    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  socket.on('eliminarProducto', async (id) => {
    try {
      await productService.deleteProduct(id);
      const result = await productService.getAllProducts({});
      io.emit('productosActualizados', result.payload);
    } catch (error) {
      socket.emit('error', error.message);
    }
  });
});


const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});