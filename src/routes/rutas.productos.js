import express from 'express';
import ProductServices from '../controllers/productServices.js';

const router = express.Router();
const productService = new ProductServices();


const successResponse = (res, data, message = 'Operación exitosa', status = 200) => {
  res.status(status).json({
    success: true,
    message,
    data
  });
};

const errorResponse = (res, message, status = 400) => {
  res.status(status).json({
    success: false,
    message
  });
};


router.get('/', async (req, res) => {
  try {
    const result = await productService.getAllProducts(req.query);
    successResponse(res, result);
  } catch (error) {
    errorResponse(res, `Error al obtener productos: ${error.message}`, 500);
  }
});


router.get('/:pid', async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.pid);
    if (!product) {
      return errorResponse(res, 'Producto no encontrado', 404);
    }
    successResponse(res, product);
  } catch (error) {
    const status = error.message.includes('no encontrado') ? 404 : 400;
    errorResponse(res, error.message, status);
  }
});


router.post('/', async (req, res) => {
  try {
    // Validación básica
    if (!req.body.title || !req.body.price || !req.body.category) {
      return errorResponse(res, 'Title, price y category son campos obligatorios', 400);
    }

    const newProduct = await productService.addProduct(req.body);
    successResponse(res, newProduct, 'Producto creado exitosamente', 201);
  } catch (error) {
    errorResponse(res, `Error al crear producto: ${error.message}`, 400);
  }
});


router.put('/:pid', async (req, res) => {
  try {
    // Validar campos permitidos
    const allowedUpdates = ['title', 'description', 'price', 'code', 'status', 'stock', 'category', 'thumbnails'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return errorResponse(res, 'Campos no permitidos para actualización', 400);
    }

    const updatedProduct = await productService.updateProduct(req.params.pid, req.body);
    if (!updatedProduct) {
      return errorResponse(res, 'Producto no encontrado', 404);
    }
    successResponse(res, updatedProduct, 'Producto actualizado exitosamente');
  } catch (error) {
    const status = error.message.includes('no encontrado') ? 404 : 400;
    errorResponse(res, error.message, status);
  }
});


router.delete('/:pid', async (req, res) => {
  try {
    const deletedProduct = await productService.deleteProduct(req.params.pid);
    if (!deletedProduct) {
      return errorResponse(res, 'Producto no encontrado', 404);
    }
    successResponse(res, deletedProduct, 'Producto eliminado exitosamente');
  } catch (error) {
    const status = error.message.includes('no encontrado') ? 404 : 400;
    errorResponse(res, error.message, status);
  }
});

export default router;