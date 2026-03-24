import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import GameSession from '@/models/GameSession'

export async function POST(request: Request) {
  await connectDB()
  const body = await request.json()
  const session = await GameSession.create(body)
  return NextResponse.json({ roomCode: session.roomCode })
}

export async function GET(request: Request) {
  await connectDB()
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  if (!code) return NextResponse.json({ error: 'No code provided' }, { status: 400 })
  const session = await GameSession.findOne({ roomCode: code })
  if (!session) return NextResponse.json({ error: 'Room not found' }, { status: 404 })
  return NextResponse.json(session)
}