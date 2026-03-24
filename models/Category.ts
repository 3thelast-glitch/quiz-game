import mongoose, { Schema } from 'mongoose'

const CategorySchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  icon: { type: String, required: true },
  color: { type: String, required: true },
})

export default mongoose.models.Category || mongoose.model('Category', CategorySchema)