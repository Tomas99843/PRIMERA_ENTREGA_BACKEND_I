//productRepos.js es un repositorio que maneja la lógica de persistencia relacionada con los productos.

const fs = require('fs').promises;
const path = require('path');

class ProductRepos {
    constructor() {
        this.filePath = path.resolve(__dirname, '../../data/products.json');
    }

    async #readFile() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                await fs.writeFile(this.filePath, '[]');
                return [];
            }
            throw error;
        }
    }
    async #saveFile(products) {
        await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
    }
    async addProduct(productData) {
        const products = await this.#readFile();        
        const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
        const missingFields = requiredFields.filter(field => !productData[field]);
        if (missingFields.length > 0) {
            throw new Error(`Faltan campos: ${missingFields.join(', ')}`);
        }
        if (products.some(p => p.code === productData.code)) {
            throw new Error(`El código ${productData.code} ya existe`);
        }
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        const newProduct = {
            id: newId,
            ...productData,
            status: productData.status ?? true, 
            thumbnails: productData.thumbnails || []
        };
        products.push(newProduct);
        await this.#saveFile(products);
        return newProduct;
    }
    async getProducts() {
        return await this.#readFile();
    }
    async getProductById(id) {
        const products = await this.#readFile();
        const product = products.find(p => p.id === id);
        if (!product) throw new Error('Producto no encontrado');
        return product;
    }
    async updateProduct(id, updatedFields) {
        if ('id' in updatedFields) {
            throw new Error('No se puede modificar el ID');
        }
        const products = await this.#readFile();
        const index = products.findIndex(p => p.id === id);
        if (index === -1) throw new Error('Producto no encontrado');
        products[index] = { ...products[index], ...updatedFields };
        await this.#saveFile(products);
        return products[index];
    }
    async deleteProduct(id) {
        const products = await this.#readFile();
        const index = products.findIndex(p => p.id === id);
        if (index === -1) throw new Error('Producto no encontrado');
        const [deletedProduct] = products.splice(index, 1);
        await this.#saveFile(products);
        return deletedProduct;
    }
}
module.exports = ProductRepos;