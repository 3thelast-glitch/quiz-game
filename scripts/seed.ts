import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-game'

const categories = [
  { id: 'history',   name: 'التاريخ',    icon: '🏛️', color: '#f59e0b' },
  { id: 'science',   name: 'العلوم',     icon: '🔬', color: '#10b981' },
  { id: 'sports',    name: 'الرياضة',    icon: '⚽', color: '#3b82f6' },
  { id: 'geography', name: 'الجغرافيا',  icon: '🌍', color: '#8b5cf6' },
  { id: 'art',       name: 'الفن والثقافة', icon: '🎨', color: '#ec4899' },
  { id: 'tech',      name: 'التقنية',    icon: '💻', color: '#06b6d4' },
]

const questions = [
  // التاريخ
  { category: 'history', question: 'من أسس المملكة العربية السعودية؟', answer: 'الملك عبدالعزيز بن سعود', difficulty: 'easy' },
  { category: 'history', question: 'في أي عام تأسست جامعة الدول العربية؟', answer: '1945', difficulty: 'medium' },
  { category: 'history', question: 'ما هي أول دولة تنال استقلالها في أفريقيا؟', answer: 'إثيوبيا', difficulty: 'hard' },
  { category: 'history', question: 'من بنى الأهرامات؟', answer: 'الفراعنة المصريون', difficulty: 'easy' },
  { category: 'history', question: 'في أي عام سقطت الدولة العثمانية؟', answer: '1922', difficulty: 'medium' },
  { category: 'history', question: 'ما عاصمة الخلافة العباسية؟', answer: 'بغداد', difficulty: 'easy' },
  // العلوم
  { category: 'science', question: 'ما هو أسرع حيوان بري في العالم؟', answer: 'الفهد', difficulty: 'easy' },
  { category: 'science', question: 'كم عدد عظام جسم الإنسان البالغ؟', answer: '206 عظمة', difficulty: 'medium' },
  { category: 'science', question: 'ما هو الرمز الكيميائي للذهب؟', answer: 'Au', difficulty: 'easy' },
  { category: 'science', question: 'ما اسم العالم الذي اكتشف الجاذبية؟', answer: 'إسحاق نيوتن', difficulty: 'easy' },
  { category: 'science', question: 'كم تبلغ سرعة الضوء تقريباً؟', answer: '300,000 كيلومتر في الثانية', difficulty: 'medium' },
  { category: 'science', question: 'ما هو أصغر كوكب في المجموعة الشمسية؟', answer: 'عطارد', difficulty: 'medium' },
  // الرياضة
  { category: 'sports', question: 'كم عدد لاعبي كرة القدم في الفريق الواحد؟', answer: '11 لاعباً', difficulty: 'easy' },
  { category: 'sports', question: 'في أي بلد أقيمت كأس العالم 2022؟', answer: 'قطر', difficulty: 'easy' },
  { category: 'sports', question: 'من فاز بكأس العالم 2022؟', answer: 'الأرجنتين', difficulty: 'easy' },
  { category: 'sports', question: 'كم طول ملعب كرة السلة الرسمي؟', answer: '28 متراً', difficulty: 'hard' },
  { category: 'sports', question: 'كم مرة فازت البرازيل بكأس العالم؟', answer: '5 مرات', difficulty: 'medium' },
  { category: 'sports', question: 'ما الرياضة التي يُلعب فيها بمضرب وريشة؟', answer: 'الريشة الطائرة (بادمنتون)', difficulty: 'easy' },
  // الجغرافيا
  { category: 'geography', question: 'ما هي أكبر دولة في العالم مساحةً؟', answer: 'روسيا', difficulty: 'easy' },
  { category: 'geography', question: 'ما هو أطول نهر في العالم؟', answer: 'نهر النيل', difficulty: 'easy' },
  { category: 'geography', question: 'ما عاصمة أستراليا؟', answer: 'كانبيرا', difficulty: 'medium' },
  { category: 'geography', question: 'كم عدد دول الخليج العربي؟', answer: '6 دول', difficulty: 'easy' },
  { category: 'geography', question: 'ما هي أعلى قمة جبلية في العالم؟', answer: 'إيفرست', difficulty: 'easy' },
  { category: 'geography', question: 'ما هي أصغر دولة في العالم؟', answer: 'الفاتيكان', difficulty: 'medium' },
  // الفن والثقافة
  { category: 'art', question: 'من رسم لوحة الموناليزا؟', answer: 'ليوناردو دا فينشي', difficulty: 'easy' },
  { category: 'art', question: 'من كتب رواية ألف ليلة وليلة؟', answer: 'مجهول - تراث شعبي عربي', difficulty: 'medium' },
  { category: 'art', question: 'ما اسم أشهر مسرحية لشكسبير؟', answer: 'هاملت', difficulty: 'easy' },
  { category: 'art', question: 'من هو ملك الشعر العربي؟', answer: 'المتنبي', difficulty: 'medium' },
  { category: 'art', question: 'في أي بلد نشأ فن الأوبرا؟', answer: 'إيطاليا', difficulty: 'medium' },
  { category: 'art', question: 'ما اسم اللوحة التي رسم فيها مونش الصرخة؟', answer: 'الصرخة (The Scream)', difficulty: 'hard' },
  // التقنية
  { category: 'tech', question: 'من أسس شركة Apple؟', answer: 'ستيف جوبز وستيف وزنياك', difficulty: 'easy' },
  { category: 'tech', question: 'ماذا تعني اختصار HTML؟', answer: 'HyperText Markup Language', difficulty: 'easy' },
  { category: 'tech', question: 'في أي عام أُطلق أول iPhone؟', answer: '2007', difficulty: 'medium' },
  { category: 'tech', question: 'ما هو أكثر نظام تشغيل استخداماً في الخوادم؟', answer: 'Linux', difficulty: 'medium' },
  { category: 'tech', question: 'ما معنى اختصار CPU؟', answer: 'Central Processing Unit', difficulty: 'easy' },
  { category: 'tech', question: 'من اخترع شبكة الإنترنت العالمية (WWW)؟', answer: 'تيم بيرنرز لي', difficulty: 'hard' },
]

async function seed() {
  await mongoose.connect(MONGODB_URI)
  console.log('✅ Connected to MongoDB')

  await mongoose.connection.collection('categories').deleteMany({})
  await mongoose.connection.collection('questions').deleteMany({})

  await mongoose.connection.collection('categories').insertMany(categories)
  await mongoose.connection.collection('questions').insertMany(questions)

  console.log('✅ Seeded', categories.length, 'categories and', questions.length, 'questions')
  await mongoose.disconnect()
}

seed().catch(console.error)
