//productServices.js es un servicio que maneja la lógica de negocio relacionada con los productos.

const ProductRepos = require('../managers/productRepos');  
const productRepo = new ProductRepos();  

class ProductServices {  
    async getAllProducts() {  
        try {  
            return await productRepo.getProducts();  
        } catch (error) {  
            throw new Error('Error al obtener productos: ' + error.message);  
        }  
    }  

    async getProductById(id) {  
        try {  
            if (!id || isNaN(id)) {  
                throw new Error('ID de producto inválido');  
            }  
            const product = await productRepo.getProductById(parseInt(id));  
            return product;  
        } catch (error) {  
            throw new Error('Error al buscar producto: ' + error.message);  
        }  
    }  

    async addProduct(productData) {  
        try {  
            const newProduct = await productRepo.addProduct(productData);  
            return {  
                success: true,  
                message: 'Producto creado exitosamente',  
                data: newProduct  
            };  
        } catch (error) {  
            throw new Error('Error al agregar producto: ' + error.message);  
        }  
    }  

    async updateProduct(id, updatedFields) {  
        try {  
            const product = await productRepo.updateProduct(id, updatedFields);  
            return {  
                success: true,  
                message: 'Producto actualizado',  
                data: product  
            };  
        } catch (error) {  
            throw new Error('Error al actualizar: ' + error.message);  
        }  
    }  

    async deleteProduct(id) {  
        try {  
            const deletedProduct = await productRepo.deleteProduct(id);  
            return {  
                success: true,  
                message: 'Producto eliminado',  
                data: deletedProduct  
            };  
        } catch (error) {  
            throw new Error('Error al eliminar: ' + error.message);  
        }  
    }  
}  

module.exports = ProductServices;  