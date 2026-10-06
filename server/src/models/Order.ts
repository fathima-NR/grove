import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const orderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, required: true },
    unit: { type: String, required: true },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['preparing', 'packed', 'out-for-delivery', 'delivered'],
      default: 'preparing',
    },
    address: {
      fullName: { type: String, required: true },
      line1: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true },
);

export type OrderDocument = InferSchemaType<typeof orderSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Order = mongoose.model('Order', orderSchema);
