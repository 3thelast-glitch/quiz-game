import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Question from '@/models/Question'

export async function GET(request: Request) {
  await connectDB()
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  const filter = category ? { category } : {}
  const questions = await Question.find(filter)
  return NextResponse.json(questions)
}