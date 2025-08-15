import express from 'express';
import Cart from '../models/Cart.js';

const router = express.Router();


const successRes = (res, payload = null, message = 'Operación exitosa') => 
  res.json({ status: 'success', message, payload });

const errorRes = (res, status = 500, message = 'Error interno') => 
  res.status(status).json({ status: 'error', message });


router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const cart = await Cart.findByIdAndUpdate(
      req.params.cid,
      { $pull: { products: { product: req.params.pid } } },
      { new: true }
    ).populate('products.product');
    
    if (!cart) return errorRes(res, 404, 'Carrito no encontrado');
    successRes(res, cart, 'Producto eliminado del carrito');
  } catch (error) {
    errorRes(res, 500, error.message);
  }
});


router.put('/:cid', async (req, res) => {
  try {
    if (!Array.isArray(req.body.products)) {
      return errorRes(res, 400, 'Formato inválido: products debe ser un array');
    }

    const cart = await Cart.findByIdAndUpdate(
      req.params.cid,
      { products: req.body.products },
      { new: true, runValidators: true }
    ).populate('products.product');

    if (!cart) return errorRes(res, 404, 'Carrito no encontrado');
    successRes(res, cart);
  } catch (error) {
    errorRes(res, 500, error.message);
  }
});


router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || isNaN(quantity)) {
      return errorRes(res, 400, 'La cantidad debe ser un número válido');
    }

    const cart = await Cart.findOneAndUpdate(
      { _id: req.params.cid, 'products.product': req.params.pid },
      { $set: { 'products.$.quantity': quantity } },
      { new: true }
    ).populate('products.product');

    if (!cart) return errorRes(res, 404, 'Carrito o producto no encontrado');
    successRes(res, cart);
  } catch (error) {
    errorRes(res, 500, error.message);
  }
});


router.delete('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findByIdAndUpdate(
      req.params.cid,
      { products: [] },
      { new: true }
    );
    if (!cart) return errorRes(res, 404, 'Carrito no encontrado');
    successRes(res, cart, 'Carrito vaciado');
  } catch (error) {
    errorRes(res, 500, error.message);
  }
});

export default router;