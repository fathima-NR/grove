import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    details: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true },
    category: { type: String, required: true, index: true },
    image: { type: String, required: true },
    badge: { type: String, default: '' },
    rating: { type: Number, required: true, min: 0, max: 5 },
    reviewCount: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    featured: { type: Boolean, default: false },
    seasonal: { type: Boolean, default: false },
    origin: { type: String, required: true },
  },
  { timestamps: true },
);

export type ProductDocument = InferSchemaType<typeof productSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Product = mongoose.model('Product', productSchema);
