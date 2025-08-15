import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'El título del producto es requerido'] 
  },
  description: {
    type: String,
    default: "Sin descripción"
  },
  price: { 
    type: Number, 
    required: [true, 'El precio del producto es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },
  code: { 
    type: String, 
    required: [true, 'El código del producto es requerido'],
    unique: true
  },
  category: { 
    type: String, 
    required: [true, 'La categoría del producto es requerida'] 
  },
  status: {
    type: Boolean,
    default: true
  },
  stock: { 
    type: Number, 
    default: 0,
    min: [0, 'El stock no puede ser negativo']
  },
  thumbnails: {
    type: [String],
    default: []
  }
}, { 
  timestamps: true,
  versionKey: false
});


productSchema.plugin(mongoosePaginate);


productSchema.pre('save', function(next) {
  if (!this.code) {
    const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
    const timePart = Date.now().toString(36).slice(-4);
    this.code = `PROD-${timePart}-${randomPart}`;
  }
  next();
});


productSchema.pre('updateOne', async function(next) {
  const update = this.getUpdate();
  if (update.code) {
    const exists = await mongoose.models.Product.findOne({ code: update.code });
    if (exists) throw new Error('El código ya está en uso');
  }
  next();
});

export default mongoose.model('Product', productSchema);