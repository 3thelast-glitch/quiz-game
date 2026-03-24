'use client'
import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'

const CATEGORY_NAMES: Record<string, string> = {
  history: 'التاريخ', science: 'العلوم', sports: 'الرياضة',
  geography: 'الجغرافيا', art: 'الفن والثقافة', tech: 'التقنية',
}
const CATEGORY_ICONS: Record<string, string> = {
  history: '🏛️', science: '🔬', sports: '⚽',
  geography: '🌍', art: '🎨', tech: '💻',
}

type Question = { _id: string; question: string; answer: string; category: string }
type Team = { name: string; categories: string[]; score: number; hints: number }
type Session = { roomCode: string; team1: Team; team2: Team; status: string; currentTurn: string }

export default function RoomPage() {
  const { code } = useParams()
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [questions, setQuestions] = useState<Record<string, Question[]>>({})
  const [currentCat, setCurrentCat] = useState<string | null>(null)
  const [currentQ, setCurrentQ] = useState<Question | null>(null)
  const [qIndex, setQIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [timer, setTimer] = useState(30)
  const [timerActive, setTimerActive] = useState(false)
  const [usedQuestions, setUsedQuestions] = useState<Set<string>>(new Set())
  const [phase, setPhase] = useState<'picking' | 'question' | 'result'>('picking')
  const [scores, setScores] = useState({ team1: 0, team2: 0 })
  const [hints, setHints] = useState({ team1: 3, team2: 3 })
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    fetch(`/api/rooms?code=${code}`)
      .then(r => r.json())
      .then(async (s: Session) => {
        setSession(s)
        const allCats = [...new Set([...s.team1.categories, ...s.team2.categories])]
        const qMap: Record<string, Question[]> = {}
        await Promise.all(allCats.map(async cat => {
          const res = await fetch(`/api/questions?category=${cat}`)
          qMap[cat] = await res.json()
        }))
        setQuestions(qMap)
      })
  }, [code])

  useEffect(() => {
    if (!timerActive) return
    if (timer === 0) { setTimerActive(false); setShowAnswer(true); return }
    const t = setTimeout(() => setTimer(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timer, timerActive])

  const currentTeam = session?.currentTurn === 'team1' ? session?.team1 : session?.team2
  const opposingTeam = session?.currentTurn === 'team1' ? session?.team2 : session?.team1
  const currentTeamKey = session?.currentTurn as 'team1' | 'team2'

  const pickCategory = (cat: string) => {
    const qs = questions[cat]?.filter(q => !usedQuestions.has(q._id))
    if (!qs?.length) return
    const q = qs[Math.floor(Math.random() * qs.length)]
    setCurrentCat(cat)
    setCurrentQ(q)
    setShowAnswer(false)
    setShowHint(false)
    setTimer(30)
    setTimerActive(true)
    setPhase('question')
  }

  const markCorrect = () => {
    setTimerActive(false)
    setUsedQuestions(prev => new Set([...prev, currentQ!._id]))
    setScores(prev => ({ ...prev, [currentTeamKey]: prev[currentTeamKey] + 1 }))
    nextTurn()
  }

  const markWrong = () => {
    setTimerActive(false)
    setUsedQuestions(prev => new Set([...prev, currentQ!._id]))
    nextTurn()
  }

  const useHint = () => {
    if (hints[currentTeamKey] <= 0) return
    setHints(prev => ({ ...prev, [currentTeamKey]: prev[currentTeamKey] - 1 }))
    setShowHint(true)
  }

  const nextTurn = () => {
    setPhase('picking')
    setCurrentQ(null)
    setCurrentCat(null)
    setShowAnswer(false)
    setShowHint(false)
    if (session) {
      setSession(prev => prev ? {
        ...prev,
        currentTurn: prev.currentTurn === 'team1' ? 'team2' : 'team1'
      } : prev)
    }
  }

  if (!session) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-white text-xl animate-pulse">جاري التحميل...</p>
    </div>
  )

  const activeCategories = opposingTeam?.categories || []

  return (
    <main className="min-h-screen p-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="bg-slate-800 rounded-xl p-3 text-center">
          <p className="text-slate-400 text-xs">الفريق الأول</p>
          <p className="text-white font-bold">{session.team1.name}</p>
          <p className="text-yellow-400 text-2xl font-bold">{scores.team1}</p>
        </div>
        <div className="text-center">
          <p className="text-slate-400 text-sm">الغرفة</p>
          <p className="text-yellow-400 font-mono font-bold text-lg">{code}</p>
          <p className="text-slate-400 text-xs mt-1">دور {currentTeam?.name}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-3 text-center">
          <p className="text-slate-400 text-xs">الفريق الثاني</p>
          <p className="text-white font-bold">{session.team2.name}</p>
          <p className="text-yellow-400 text-2xl font-bold">{scores.team2}</p>
        </div>
      </div>

      {/* Picking Phase */}
      {phase === 'picking' && (
        <div className="bg-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-2 text-center">
            {currentTeam?.name} — اختر فئة
          </h2>
          <p className="text-slate-400 text-sm text-center mb-6">
            ستُجيب على أسئلة الفريق الآخر
          </p>
          <div className="grid grid-cols-3 gap-3">
            {activeCategories.map(cat => (
              <button
                key={cat}
                onClick={() => pickCategory(cat)}
                className="bg-slate-700 hover:bg-slate-600 rounded-xl p-4 flex flex-col items-center gap-2 transition border-2 border-slate-600 hover:border-yellow-400"
              >
                <span className="text-3xl">{CATEGORY_ICONS[cat]}</span>
                <span className="text-white text-sm font-medium">{CATEGORY_NAMES[cat]}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 flex justify-center gap-2">
            <span className="text-slate-400 text-sm">🪄 وسائل المساعدة:</span>
            <span className="text-yellow-400 text-sm font-bold">{hints[currentTeamKey]} متبقية</span>
          </div>
        </div>
      )}

      {/* Question Phase */}
      {phase === 'question' && currentQ && (
        <div className="space-y-4">
          <div className="bg-slate-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-400 text-sm">{CATEGORY_ICONS[currentCat!]} {CATEGORY_NAMES[currentCat!]}</span>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl border-4 ${
                timer > 15 ? 'border-green-400 text-green-400' :
                timer > 5  ? 'border-yellow-400 text-yellow-400' :
                             'border-red-400 text-red-400'
              }`}>{timer}</div>
            </div>
            <p className="text-white text-xl font-bold text-center my-6">{currentQ.question}</p>
            {showHint && (
              <div className="bg-yellow-400/10 border border-yellow-400 rounded-xl p-3 text-center">
                <p className="text-yellow-400 text-sm">💡 تلميح: الجواب يبدأ بـ "{currentQ.answer[0]}"</p>
              </div>
            )}
            {showAnswer && (
              <div className="bg-green-400/10 border border-green-400 rounded-xl p-4 text-center mt-4">
                <p className="text-green-400 font-bold text-lg">{currentQ.answer}</p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={useHint}
              disabled={hints[currentTeamKey] <= 0 || showHint}
              className="bg-yellow-400/20 border border-yellow-400 text-yellow-400 rounded-xl p-3 font-bold hover:bg-yellow-400/30 transition disabled:opacity-30"
            >
              💡 تلميح ({hints[currentTeamKey]})
            </button>
            <button
              onClick={() => setShowAnswer(true)}
              className="bg-slate-700 border border-slate-500 text-white rounded-xl p-3 font-bold hover:bg-slate-600 transition"
            >
              👁 الجواب
            </button>
            <button
              onClick={markCorrect}
              className="bg-green-500 text-white rounded-xl p-3 font-bold hover:bg-green-400 transition"
            >
              ✅ صح
            </button>
          </div>
          <button
            onClick={markWrong}
            className="w-full bg-red-500/20 border border-red-500 text-red-400 rounded-xl p-3 font-bold hover:bg-red-500/30 transition"
          >
            ❌ خطأ / تخطي
          </button>
        </div>
      )}
    </main>
  )
}