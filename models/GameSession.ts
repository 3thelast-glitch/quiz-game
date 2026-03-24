import mongoose, { Schema } from 'mongoose'

const GameSessionSchema = new Schema({
  roomCode: { type: String, required: true, unique: true },
  team1: {
    name: String,
    categories: [String],
    score: { type: Number, default: 0 },
    hints: { type: Number, default: 3 },
  },
  team2: {
    name: String,
    categories: [String],
    score: { type: Number, default: 0 },
    hints: { type: Number, default: 3 },
  },
  status: { type: String, enum: ['waiting', 'playing', 'finished'], default: 'waiting' },
  currentTurn: { type: String, enum: ['team1', 'team2'], default: 'team1' },
}, { timestamps: true })

export default mongoose.models.GameSession || mongoose.model('GameSession', GameSessionSchema)