'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CATEGORIES = [
  { id: 'history',   name: 'التاريخ',       icon: '🏛️', color: 'border-yellow-400 text-yellow-400' },
  { id: 'science',   name: 'العلوم',        icon: '🔬', color: 'border-green-400 text-green-400' },
  { id: 'sports',    name: 'الرياضة',       icon: '⚽', color: 'border-blue-400 text-blue-400' },
  { id: 'geography', name: 'الجغرافيا',    icon: '🌍', color: 'border-purple-400 text-purple-400' },
  { id: 'art',       name: 'الفن والثقافة', icon: '🎨', color: 'border-pink-400 text-pink-400' },
  { id: 'tech',      name: 'التقنية',       icon: '💻', color: 'border-cyan-400 text-cyan-400' },
]

export default function CreateRoom() {
  const router = useRouter()
  const [team1, setTeam1] = useState('')
  const [team2, setTeam2] = useState('')
  const [selected1, setSelected1] = useState<string[]>([])
  const [selected2, setSelected2] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  const toggleCategory = (id: string, team: 1 | 2) => {
    const setter = team === 1 ? setSelected1 : setSelected2
    const current = team === 1 ? selected1 : selected2
    if (current.includes(id)) {
      setter(current.filter(c => c !== id))
    } else if (current.length < 3) {
      setter([...current, id])
    }
  }

  const createRoom = async () => {
    setLoading(true)
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    const res = await fetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomCode: code,
        team1: { name: team1, categories: selected1 },
        team2: { name: team2, categories: selected2 },
      }),
    })
    const data = await res.json()
    router.push(`/room/${data.roomCode}`)
  }

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-yellow-400 text-center mb-8">🎮 إنشاء غرفة جديدة</h1>

      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-white">اسم الفريقين</h2>
            <input
              className="w-full bg-slate-700 text-white rounded-xl p-3 outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="اسم الفريق الأول"
              value={team1}
              onChange={e => setTeam1(e.target.value)}
            />
            <input
              className="w-full bg-slate-700 text-white rounded-xl p-3 outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="اسم الفريق الثاني"
              value={team2}
              onChange={e => setTeam2(e.target.value)}
            />
          </div>
          <button
            disabled={!team1 || !team2}
            onClick={() => setStep(2)}
            className="w-full bg-yellow-400 text-black font-bold py-3 rounded-xl hover:bg-yellow-300 transition disabled:opacity-40"
          >
            التالي ←
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          {[1, 2].map(t => (
            <div key={t} className="bg-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                {t === 1 ? team1 : team2} — اختر 3 فئات
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map(cat => {
                  const sel = t === 1 ? selected1 : selected2
                  const isSelected = sel.includes(cat.id)
                  return (
                    <button
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id, t as 1 | 2)}
                      className={`border-2 rounded-xl p-3 flex items-center gap-2 transition ${
                        isSelected
                          ? `${cat.color} bg-slate-700`
                          : 'border-slate-600 text-slate-400 hover:border-slate-400'
                      }`}
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="font-medium">{cat.name}</span>
                      {isSelected && <span className="mr-auto text-green-400">✓</span>}
                    </button>
                  )
                })}
              </div>
              <p className="text-slate-400 text-sm mt-2">تم اختيار {t === 1 ? selected1.length : selected2.length}/3</p>
            </div>
          ))}
          <button
            disabled={selected1.length !== 3 || selected2.length !== 3 || loading}
            onClick={createRoom}
            className="w-full bg-yellow-400 text-black font-bold py-3 rounded-xl hover:bg-yellow-300 transition disabled:opacity-40"
          >
            {loading ? 'جاري الإنشاء...' : '🚀 إنشاء الغرفة'}
          </button>
        </div>
      )}
    </main>
  )
}