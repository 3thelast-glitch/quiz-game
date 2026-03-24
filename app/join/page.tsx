'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function JoinRoom() {
  const router = useRouter()
  const [code, setCode] = useState('')

  const join = () => {
    if (code.trim().length >= 4) {
      router.push(`/room/${code.trim().toUpperCase()}`)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-yellow-400 mb-8">🔑 انضم لغرفة</h1>
      <div className="bg-slate-800 rounded-2xl p-8 w-full max-w-sm space-y-4">
        <input
          className="w-full bg-slate-700 text-white text-center text-2xl tracking-widest rounded-xl p-4 outline-none focus:ring-2 focus:ring-yellow-400 uppercase"
          placeholder="ABC123"
          maxLength={6}
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === 'Enter' && join()}
        />
        <button
          disabled={code.length < 4}
          onClick={join}
          className="w-full bg-yellow-400 text-black font-bold py-3 rounded-xl hover:bg-yellow-300 transition disabled:opacity-40"
        >
          انضم ←
        </button>
      </div>
      <button onClick={() => router.push('/')} className="mt-6 text-slate-400 hover:text-white transition">
        ← العودة للرئيسية
      </button>
    </main>
  )
}