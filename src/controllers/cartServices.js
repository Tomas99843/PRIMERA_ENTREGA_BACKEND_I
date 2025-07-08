// cartServices.js es un servicio que maneja la lógica de negocio relacionada con los carritos de compras.

const CartRepos = require('../managers/cartRepos');  
const cartRepo = new CartRepos();  

class CartServices { 
    async createCart() {
        try {
            const newCart = await cartRepo.createCart();
            return {
                success: true,
                message: 'Carrito creado exitosamente',
                cart: newCart
            };
        } catch (error) {
            throw new Error('Error al crear carrito: ' + error.message);
        }
    }

    async getCartById(cartId) {
        try {
            if (!cartId || isNaN(cartId)) {
                throw new Error('ID de carrito inválido');
            }

            const carts = await cartRepo.carts;
            const cart = carts.find(c => c.id === parseInt(cartId));

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            return {
                success: true,
                cart: cart
            };
        } catch (error) {
            throw new Error('Error al obtener carrito: ' + error.message);
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            if (!cartId || isNaN(cartId)) {
                throw new Error('ID de carrito inválido');
            }
            if (!productId || isNaN(productId)) {
                throw new Error('ID de producto inválido');
            }
            if (quantity <= 0) {
                throw new Error('La cantidad debe ser mayor a cero');
            }

            const updatedCart = await cartRepo.addProductToCart(
                parseInt(cartId),
                parseInt(productId),
                quantity
            );

            return {
                success: true,
                message: 'Producto agregado al carrito',
                cart: updatedCart
            };
        } catch (error) {
            throw new Error('Error al agregar producto al carrito: ' + error.message);
        }
    }
}

module.exports = CartServices; 