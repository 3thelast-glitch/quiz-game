export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold text-yellow-400 mb-4">🎮 Quiz Game</h1>
      <p className="text-xl text-gray-300 mb-8">لعبة مسابقات ثقافية جماعية</p>
      <div className="flex gap-4">
        <button className="bg-yellow-400 text-black px-8 py-3 rounded-xl text-lg font-bold hover:bg-yellow-300 transition">
          إنشاء غرفة
        </button>
        <button className="border border-yellow-400 text-yellow-400 px-8 py-3 rounded-xl text-lg font-bold hover:bg-yellow-400 hover:text-black transition">
          انضم لغرفة
        </button>
      </div>
    </main>
  )
}