import express from 'express';
import { engine } from 'express-handlebars';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import ProductRepos from './managers/productRepos.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const productRepo = new ProductRepos();


app.engine('handlebars', engine({
  layoutsDir: join(__dirname, 'views/layouts'),
  defaultLayout: 'main',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true
  }
}));
app.set('view engine', 'handlebars');
app.set('views', join(__dirname, 'views'));


app.use(express.static(join(__dirname, 'public')));
app.use('/socket.io', express.static(join(__dirname, '../node_modules/socket.io/client-dist')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', async (req, res) => {
  const products = await productRepo.getProducts();
  res.render('home', {
    title: 'Vista Cliente',
    products
  });
});

app.get('/realtimeproducts', async (req, res) => {
  const products = await productRepo.getProducts();
  res.render('realTimeProducts', {
    title: 'Productos en Tiempo Real',
    products
  });
});


io.on('connection', (socket) => {
  console.log('Cliente conectado');
  
  socket.on('agregarProducto', async (producto) => {
    try {
      await productRepo.addProduct(producto);
      const products = await productRepo.getProducts();
      io.emit('productosActualizados', products);
    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  socket.on('eliminarProducto', async (id) => {
    try {
      await productRepo.deleteProduct(id);
      const products = await productRepo.getProducts();
      io.emit('productosActualizados', products);
    } catch (error) {
      socket.emit('error', error.message);
    }
  });
});


httpServer.listen(8080, () => {
  console.log('Servidor en http://localhost:8080');
});