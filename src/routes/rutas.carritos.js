// rutas.carritos.js define las rutas para manejar operaciones de carritos de compras

const express = require('express');
const router = express.Router();
const CartServices = require('../controllers/cartServices'); 
const cartService = new CartServices();

router.post('/', async (req, res) => {
    try {
        const result = await cartService.createCart();
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const result = await cartService.getCartById(req.params.cid);
        res.status(200).json(result);
    } catch (error) {
        if (error.message.includes('no encontrado')) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        } else {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const quantity = req.body.quantity || 1;
        
        if (isNaN(quantity) || quantity <= 0) {
            throw new Error('La cantidad debe ser un número mayor a cero');
        }
        const result = await cartService.addProductToCart(cid, pid, quantity);
        res.status(200).json(result);
    } catch (error) {
        if (error.message.includes('inválido')) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        } else if (error.message.includes('no encontrado')) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        } else {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
});
module.exports = router;