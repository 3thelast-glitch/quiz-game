import mongoose, { Schema } from 'mongoose'

const QuestionSchema = new Schema({
  category: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
})

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema)