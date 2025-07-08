// rutas.productos.js - Define las rutas para operaciones CRUD de productos

const express = require('express');
const router = express.Router();
const ProductServices = require('../controllers/productServices');
const productService = new ProductServices();

router.get('/', async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


router.get('/:pid', async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.pid);
        res.status(200).json({
            success: true,
            data: product
        });
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

router.post('/', async (req, res) => {
    try {
        const newProduct = await productService.addProduct(req.body);
        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            data: newProduct
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});


router.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await productService.updateProduct(req.params.pid, req.body);
        res.status(200).json({
            success: true,
            message: 'Producto actualizado exitosamente',
            data: updatedProduct
        });
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


router.delete('/:pid', async (req, res) => {
    try {
        const deletedProduct = await productService.deleteProduct(req.params.pid);
        res.status(200).json({
            success: true,
            message: 'Producto eliminado exitosamente',
            data: deletedProduct
        });
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

module.exports = router;