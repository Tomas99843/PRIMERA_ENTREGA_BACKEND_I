import Product from '../models/Product.js';

class ProductServices {
    async getAllProducts({ limit = 10, page = 1, sort, query }) {
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
            lean: true
        };

        const filter = query ? { 
            $or: [
                { category: { $regex: query, $options: 'i' } },
                { title: { $regex: query, $options: 'i' } }
            ],
            status: true
        } : { status: true };

        try {
            const result = await Product.paginate(filter, options);
            return {
                status: 'success',
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage 
                    ? `/api/products?page=${result.prevPage}&limit=${limit}${query ? `&query=${query}` : ''}${sort ? `&sort=${sort}` : ''}`
                    : null,
                nextLink: result.hasNextPage 
                    ? `/api/products?page=${result.nextPage}&limit=${limit}${query ? `&query=${query}` : ''}${sort ? `&sort=${sort}` : ''}`
                    : null
            };
        } catch (error) {
            throw new Error('Error al obtener productos: ' + error.message);
        }
    }

    async addProduct(productData) {
        try {
            
            if (!productData.title || !productData.price || !productData.category) {
                throw new Error('Title, price y category son campos obligatorios');
            }

            
            const newProduct = await Product.create({
                title: productData.title,
                description: productData.description || 'Sin descripción',
                price: Number(productData.price),
                code: productData.code || `PROD-${Date.now().toString(36).slice(-6).toUpperCase()}`,
                status: productData.status !== false, // Default true
                stock: Number(productData.stock) || 0,
                category: productData.category,
                thumbnails: productData.thumbnails || []
            });

            return newProduct;
        } catch (error) {
            throw new Error('Error al agregar producto: ' + error.message);
        }
    }

    async getProductById(id) {
        try {
            const product = await Product.findById(id);
            if (!product) throw new Error('Producto no encontrado');
            return product;
        } catch (error) {
            throw new Error('Error al buscar producto por ID: ' + error.message);
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            
            const allowedUpdates = ['title', 'description', 'price', 'code', 'status', 'stock', 'category', 'thumbnails'];
            const filteredUpdates = Object.keys(updatedFields)
                .filter(key => allowedUpdates.includes(key))
                .reduce((obj, key) => {
                    obj[key] = updatedFields[key];
                    return obj;
                }, {});

            const product = await Product.findByIdAndUpdate(id, filteredUpdates, { 
                new: true,
                runValidators: true 
            });

            if (!product) throw new Error('Producto no encontrado');
            return product;
        } catch (error) {
            throw new Error('Error al actualizar producto: ' + error.message);
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await Product.findByIdAndDelete(id);
            if (!deletedProduct) throw new Error('Producto no encontrado');
            return deletedProduct;
        } catch (error) {
            throw new Error('Error al eliminar producto: ' + error.message);
        }
    }
}

export default ProductServices;