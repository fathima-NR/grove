import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const categorySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  blurb: { type: String, required: true },
  image: { type: String, required: true },
  accent: { type: String, required: true },
});

export type CategoryDocument = InferSchemaType<typeof categorySchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Category = mongoose.model('Category', categorySchema);
