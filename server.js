import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// 90 ta savoldan iborat to'liq imtihon generatori
function generateFull90Questions(language, direction) {
  const isUz = language === "UZ";
  const questions = [];
  const currentDir = direction || "Kiberxavfsizlik";

  // ==========================================
  // 1. MAJBURIY BLOK (Jami 30 ta savol, har biri 1.1 ball)
  // ==========================================
  
  // Ona tili (10 ta savol: 1 - 10)
  for (let i = 1; i <= 10; i++) {
    questions.push({
      question_text: isUz 
        ? `Ona tili. ${i}-savol: Quyidagi so'zlardan qaysi biri imlo jihatdan to'g'ri yozilgan?` 
        : `Родной язык. ${i}-вопрос: Какое из следующих слов написано орфографически правильно?`,
      block: "mandatory",
      subject: "ona_tili_majburiy",
      options: [
        { id: "A", text: isUz ? "Oliy" : "Высший" },
        { id: "B", text: "Oley" },
        { id: "C", text: "Aliy" },
        { id: "D", text: "Olay" }
      ],
      correct_answer: "A",
      rationale: isUz ? "Ushbu so'zning adabiy tildagi to'g'ri yozilish shakli 'Oliy' hisoblanadi." : "Правильное написание этого слова — 'Oliy'."
    });
  }

  // Matematika majburiy (10 ta savol: 11 - 20)
  for (let i = 11; i <= 20; i++) {
    questions.push({
      question_text: isUz 
        ? `Majburiy Matematika. ${i}-savol: Oddiy tenglamani yeching: $x + ${i} = ${i + 5}$` 
        : `Обязательная Математика. ${i}-вопрос: Решите простое уравнение: $x + ${i} = ${i + 5}$`,
      block: "mandatory",
      subject: "matematika_majburiy",
      options: [
        { id: "A", text: "$5$" },
        { id: "B", text: `$${i}$` },
        { id: "C", text: "$0$" },
        { id: "D", text: "$10$" }
      ],
      correct_answer: "A",
      rationale: isUz ? `Tenglamadan $x$ ni topsak: $x = ${i + 5} - ${i} = 5$.` : `Находим $x$: $x = ${i + 5} - ${i} = 5$.`
    });
  }

  // O'zbekiston tarixi (10 ta savol: 21 - 30)
  for (let i = 21; i <= 30; i++) {
    questions.push({
      question_text: isUz 
        ? `O'zbekiston Tarixi. ${i}-savol: Qadimgi Turon davlati mudofaasi va strategiyasi asosini nima tashkil etgan?` 
        : `История Узбекистана. ${i}-вопрос: Что составляло основу обороны и стратегии древнего государства Турон?`,
      block: "mandatory",
      subject: "tarix_majburiy",
      options: [
        { id: "A", text: isUz ? "Kuchli otliq qo'shin va harbiy intizom" : "Сильная конница и военная дисциплина" },
        { id: "B", text: "Faqat mudofaa devorlari" },
        { id: "C", text: "Dengiz floti" },
        { id: "D", text: "Hech qanday strategiya bo'lmagan" }
      ],
      correct_answer: "A",
      rationale: isUz ? "Qadimgi Turon va buyuk sarkardalar imperiyasida otliq qo'shinlar asosiy zarbdor kuch bo'lgan." : "Конница была главной ударной силой в военном искусстве Турана."
    });
  }

  // ==========================================
  // 2. PROFIL BLOK (Jami 60 ta savol, har biri 3.1 ball)
  // ==========================================
  
  // 1-Mutaxassislik fani: Matematika (30 ta savol: 31 - 60)
  for (let i = 31; i <= 60; i++) {
    questions.push({
      question_text: isUz 
        ? `Profil: Matematika. ${i}-savol: $f(x) = ${i}x^2$ funksiyaning hosilasi $f'(x)$ ni toping.` 
        : `Профиль: Математика. ${i}-вопрос: Найдите производную функции $f(x) = ${i}x^2$.`,
      block: "profile",
      subject: "math_advanced",
      options: [
        { id: "A", text: `$${2 * i}x$` },
        { id: "B", text: `$${i}x$` },
        { id: "C", text: `$${i * 2}$` },
        { id: "D", text: "$x$" }
      ],
      correct_answer: "A",
      rationale: isUz ? `Daraja qoidasiga ko'ra: $(${i}x^2)' = ${i} \\cdot 2x = ${2 * i}x$.` : `По правилу степеней: $(${i}x^2)' = ${i} \\cdot 2x = ${2 * i}x$.`
    });
  }

  // 2-Mutaxassislik fani: AKT / Informatika (30 ta savol: 61 - 90)
  for (let i = 61; i <= 90; i++) {
    questions.push({
      question_text: isUz 
        ? `Profil: ${currentDir}. ${i}-savol: Tizim xavfsizligi va ma'lumotlar uzatishda eng ishonchli shifrlash algoritmi qaysi?` 
        : `Профиль: ${currentDir}. ${i}-вопрос: Какой алгоритм шифрования наиболее надежен для безопасности систем и передачи данных?`,
      block: "profile",
      subject: "specialty_subjects",
      options: [
        { id: "A", text: "AES-256 (Advanced Encryption Standard)" },
        { id: "B", text: "MD5 (Insecure)" },
        { id: "C", text: "Base64 encoding" },
        { id: "D", text: "Rot13 cipher" }
      ],
      correct_answer: "A",
      rationale: isUz 
        ? "AES-256 hozirgi kunda butun dunyoda davlat va bank tizimlarida ishlatiladigan eng xavfsiz simmetrik shifrlash standartidir." 
        : "AES-256 является наиболее безопасным стандартом симметричного шифрования, используемым в банковских и госструктурах."
    });
  }

  return {
    exam_session: {
      allowed_time_minutes: 180,
      questions: questions
    },
    metadata: {
      language: language || "UZ",
      direction: currentDir
    }
  };
}

// Massiv elementlarini tasodifiy aralashtirish funksiyasi (Fisher-Yates)
function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]
    ];
  }

  return array;
}

// API Endpoint
app.post("/api/generate-exam", (req, res) => {
  const { language, direction } = req.body;
  
  // 1. 90 ta to'liq savolni generatsiya qilamiz
  const fullExamData = generateFull90Questions(language, direction);
  
  // 2. Har bir savolning variantlarini xavfsiz aralashtiramiz
  fullExamData.exam_session.questions.forEach((question) => {
    // To'g'ri javob matnini aniqlab olamiz
    const correctAnswerText = question.options.find(opt => opt.id === question.correct_answer).text;
    
    // ✅ TUZATILDI: Variantlar ob'ektlarining to'liq yangi nusxasini yaratib keyin shuffle qilamiz (Deep copy element-wise)
    const deepCopiedOptions = question.options.map(opt => ({ ...opt }));
    const shuffledOptions = shuffle(deepCopiedOptions);
    
    // Aralashgan variantlarga yangi A, B, C, D harflarini tarqatamiz
    const letterIds = ["A", "B", "C", "D"];
    shuffledOptions.forEach((opt, index) => {
      opt.id = letterIds[index];
    });
    
    // Yangilangan variantlarni savol ichiga saqlaymiz
    question.options = shuffledOptions;
    
    // To'g'ri javob matni qaysi yangi harfga to'g'ri kelganini aniqlaymiz
    const newCorrectOption = question.options.find(opt => opt.text === correctAnswerText);
    question.correct_answer = newCorrectOption.id;
  });
  
  // 3. Savollarning o'zini ham to'liq tasodifiy aralashtiramiz
  fullExamData.exam_session.questions = shuffle(fullExamData.exam_session.questions);
  
  // 4. Tayyor ma'lumotlarni frontendga yuboramiz
  res.json(fullExamData);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server to'liq va random 90 ta savol bilan ${PORT}-portda ishlamoqda.`);
});