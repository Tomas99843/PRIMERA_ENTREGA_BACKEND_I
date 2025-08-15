import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  products: [{
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product',
      required: [true, 'El ID del producto es requerido']
    },
    quantity: { 
      type: Number, 
      default: 1,
      min: [1, 'La cantidad mínima es 1']
    }
  }]
}, { 
  timestamps: true,
  versionKey: false
});


cartSchema.pre('save', function(next) {
  const productsMap = new Map();
  
  this.products.forEach(item => {
    const productId = item.product.toString();
    productsMap.set(productId, (productsMap.get(productId) || 0) + item.quantity);
  });

  this.products = Array.from(productsMap).map(([product, quantity]) => ({
    product: new mongoose.Types.ObjectId(product),
    quantity
  }));

  next();
});


cartSchema.statics.addProduct = async function(cartId, productId, quantity = 1) {
  return this.findByIdAndUpdate(
    cartId,
    { $push: { products: { product: productId, quantity } } },
    { new: true }
  ).populate('products.product');
};

export default mongoose.model('Cart', cartSchema);