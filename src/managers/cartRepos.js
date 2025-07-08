// cartRepos.js se encarga de manejar la lógica de persistencia relacionada con los carritos.

const fs = require('fs').promises;
const path = require('path');

class CartRepos {  
    constructor() {
        this.filePath = path.resolve(__dirname, '../../data/carts.json');
        this.carts = [];
        this.nextId = 1;
        this.initialize();  
    }
    async initialize() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            this.carts = JSON.parse(data);       
            
            if (this.carts.length > 0) {
                this.nextId = Math.max(...this.carts.map(c => c.id)) + 1;
            }
        } catch (error) {
            if (error.code === 'ENOENT') {
                await this.saveToFile();
            } else {
                console.error('Error inicializando CartRepos:', error);
                throw error;
            }
        }
    }
    async saveToFile() {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            console.error('Error guardando carritos:', error);
            throw error;
        }
    }
    async createCart() {
        const newCart = {
            id: this.nextId++,
            products: []  
        };
        this.carts.push(newCart);
        await this.saveToFile();
        return newCart;
    }
    async addProductToCart(cartId, productId, quantity = 1) {
        const cartIndex = this.carts.findIndex(c => c.id === cartId);
        if (cartIndex === -1) {
            throw new Error('Carrito no encontrado');
        }
        const productIndex = this.carts[cartIndex].products.findIndex(
            p => p.product === productId
        );
        if (productIndex === -1) {
            this.carts[cartIndex].products.push({
                product: productId,
                quantity: quantity
            });
        } else {
            this.carts[cartIndex].products[productIndex].quantity += quantity;
        }
        await this.saveToFile();
        return this.carts[cartIndex];
    }
    async getCartById(id) {
        const cart = this.carts.find(c => c.id === id);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        return cart;
    }
}

module.exports = CartRepos;