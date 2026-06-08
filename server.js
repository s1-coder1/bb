import React, { useState, useEffect } from 'react';

// Matematik formulalarni chiroyli render qilish uchun kichik yordamchi
function MathText({ text }) {
  if (!text) return null;
  const parts = text.split('$');
  return (
    <span>
      {parts.map((part, index) => {
        if (index % 2 === 1) {
          // Oddiy matn ichidagi $...$ formulalar uchun render
          return <code key={index} style={{ color: '#60a5fa', fontFamily: 'monospace', padding: '0 4px', fontSize: '1.1rem' }}>{part}</code>;
        }
        return part;
      })}
    </span>
  );
}

export default function Exam({ sessionData }) {
  const { questions, allowed_time_minutes } = sessionData.exam_session;
  const language = sessionData.metadata.language;
  const isUz = language === 'UZ';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(allowed_time_minutes * 60);
  const [isFinished, setIsFinished] = useState(false);

  // Taymer mexanizmi (180 minut uchun)
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsFinished(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (optionId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIndex]: optionId
    }));
  };

  const currentQuestion = questions[currentIndex];

  // IMTIHON TUGAGANDAN KEYINGI DIZAYN (OXIRIDA XATOLAR VA IZOHLAR CHIQADIGAN JOY)
  if (isFinished) {
    let score = 0;
    let mistakes = [];

    questions.forEach((q, idx) => {
      const isCorrect = selectedAnswers[idx] === q.correct_answer;
      if (isCorrect) {
        if (q.block === 'mandatory') score += 1.1;
        else if (q.subject === 'math_advanced') score += 3.1;
        else score += 2.1;
      } else {
        mistakes.push({
          num: idx + 1,
          question: q.question_text,
          yourAnswer: selectedAnswers[idx] || (isUz ? "Belgilanmagan" : "Не выбрано"),
          correctAnswer: q.correct_answer,
          rationale: q.rationale
        });
      }
    });

    return (
      <div style={{ maxWidth: '850px', margin: '40px auto', padding: '35px', backgroundColor: '#111827', borderRadius: '16px', border: '1px solid #1e293b', color: '#f3f4f6' }}>
        <h2 style={{ color: '#10b981', textAlign: 'center', fontSize: '2rem', marginBottom: '10px' }}>
          {isUz ? '🎯 Imtihon Yakunlandi' : '🎯 Экзамен Завершен'}
        </h2>
        <p style={{ fontSize: '1.4rem', textAlign: 'center', margin: '20px 0', color: '#9ca3af' }}>
          {isUz ? 'Siz to\'plagan umumiy ball:' : 'Ваш итоговый балл:'}{' '}
          <strong style={{ color: '#3b82f6', fontSize: '1.8rem' }}>{score.toFixed(1)}</strong>
        </p>
        
        <h3 style={{ borderBottom: '2px solid #1e293b', paddingBottom: '12px', marginTop: '40px', color: '#f3f4f6' }}>
          {isUz ? '❌ Yo\'l qo\'yilgan xatolar va tahlil:' : '❌ Допущенные ошибки и анализ:'}
        </h3>
        
        {mistakes.length === 0 ? (
          <p style={{ color: '#10b981', textAlign: 'center', fontSize: '1.2rem', marginTop: '20px' }}>
            {isUz ? 'Ajoyib! Hech qanday xato qilmadingiz. 100% natija!' : 'Потрясающе! Вы не допустили ни одной ошибки. 100% результат!'}
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
            {mistakes.map((m, i) => (
              <div key={i} style={{ padding: '20px', backgroundColor: '#1f2937', borderRadius: '10px', borderLeft: '5px solid #ef4444', border: '1px solid #374151', borderLeftWidth: '5px' }}>
                <p style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '12px' }}>
                  <strong>{m.num}-savol:</strong> <MathText text={m.question} />
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', backgroundColor: '#111827', padding: '10px', borderRadius: '6px', marginBottom: '12px' }}>
                  <span style={{ color: '#ef4444' }}>❌ {isUz ? 'Sizning javobingiz:' : 'Ваш ответ:'} <strong>{m.yourAnswer}</strong></span>
                  <span style={{ color: '#10b981' }}>✅ {isUz ? 'To\'g\'ri javob:' : 'Правильный ответ:'} <strong>{m.correctAnswer}</strong></span>
                </div>
                {m.rationale && (
                  <div style={{ fontStyle: 'italic', color: '#9ca3af', borderTop: '1px solid #374151', paddingTop: '10px', fontSize: '0.95rem' }}>
                    <strong style={{ color: '#3b82f6', notImplicit: 'none' }}>{isUz ? 'Ilmiy izoh: ' : 'Пояснение: '}</strong>
                    <MathText text={m.rationale} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <button onClick={() => window.location.reload()} style={{ display: 'block', margin: '40px auto 0', padding: '12px 30px', backgroundColor: '#3b82f6', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', transition: '0.2s' }}>
          {isUz ? 'Bosh sahifaga qaytish' : 'На главную страницу'}
        </button>
      </div>
    );
  }

  // TEST JARAYONI DIZAYNI (IZOHLAR BUTUNLAY O'CHIRILGAN)
  return (
    <div style={{ maxWidth: '850px', margin: '30px auto', padding: '20px', color: '#f3f4f6' }}>
      
      {/* TEPADAGI PANEL (AI YOZUVLARI YO'Q QILINDI, FAQAT FAKTLAR) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', backgroundColor: '#111827', padding: '16px 24px', borderRadius: '12px', border: '1px solid #1e293b' }}>
        <div>
          <span style={{ backgroundColor: '#1e3a8a', color: '#60a5fa', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold', marginRight: '10px', textTransform: 'uppercase' }}>
            {currentQuestion.block === 'mandatory' ? (isUz ? 'Majburiy Blok' : 'Обязательный Блок') : (isUz ? 'Profil Bloki' : 'Профильный Блок')}
          </span>
          <span style={{ backgroundColor: '#374151', color: '#d1d5db', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
            {currentQuestion.subject.replace('_', ' ')}
          </span>
        </div>
        <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#ef4444', letterSpacing: '1px', backgroundColor: '#1f2937', padding: '6px 14px', borderRadius: '8px' }}>
          ⏳ {formatTime(timeLeft)}
        </div>
      </div>

      {/* ASOSIY SAVOL ASOSI */}
      <div style={{ backgroundColor: '#111827', padding: '35px', borderRadius: '16px', border: '1px solid #1e293b', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)', marginBottom: '25px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9ca3af', fontSize: '0.95rem', marginBottom: '20px', borderBottom: '1px solid #1e293b', paddingBottom: '12px' }}>
          <span>{isUz ? 'Savol ketma-ketligi:' : 'Номер вопроса:'} <strong>{currentIndex + 1} / {questions.length}</strong></span>
          <span>{currentQuestion.block === 'mandatory' ? '1.1 Ball' : currentQuestion.subject === 'math_advanced' ? '3.1 Ball' : '2.1 Ball'}</span>
        </div>
        
        <h3 style={{ lineHeight: '1.6', fontSize: '1.3rem', fontWeight: '500', marginBottom: '30px', color: '#fff' }}>
          <MathText text={currentQuestion.question_text} />
        </h3>

        {/* VARIANTLAR RO'YXATI (CHALKAŞTIRILGAN JAVOBLAR BILAN) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {currentQuestion.options.map((opt) => {
            const isSelected = selectedAnswers[currentIndex] === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => handleOptionSelect(opt.id)}
                style={{
                  padding: '18px',
                  backgroundColor: isSelected ? '#1e3a8a' : '#1f2937',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  border: isSelected ? '2px solid #3b82f6' : '1px solid #374151',
                  transition: 'all 0.15s ease-in-out',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <span style={{ 
                  fontWeight: '700', 
                  marginRight: '16px', 
                  color: isSelected ? '#fff' : '#9ca3af',
                  backgroundColor: isSelected ? '#3b82f6' : '#111827',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  fontSize: '0.95rem'
                }}>{opt.id}</span>
                <span style={{ fontSize: '1.05rem', color: isSelected ? '#fff' : '#e5e7eb' }}>
                  <MathText text={opt.text} />
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* PASTDAGI NAVIGATSIYA TUGMALARI (IZOH KO'RISH TUGMASI BUTUNLAY YO'Q QILINDI) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(prev => prev - 1)}
          style={{ padding: '12px 26px', borderRadius: '8px', border: 'none', backgroundColor: '#374151', color: '#fff', fontWeight: '600', cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', opacity: currentIndex === 0 ? 0.4 : 1, transition: '0.2s' }}
        >
          {isUz ? '← Orqaga' : '← Назад'}
        </button>

        {currentIndex < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIndex(prev => prev + 1)}
            style={{ padding: '12px 26px', borderRadius: '8px', border: 'none', backgroundColor: '#3b82f6', color: '#fff', fontWeight: '600', cursor: 'pointer', transition: '0.2s' }}
          >
            {isUz ? 'Keyingisi →' : 'Вперед →'}
          </button>
        ) : (
          <button
            onClick={() => setIsFinished(true)}
            style={{ padding: '12px 30px', borderRadius: '8px', border: 'none', backgroundColor: '#10b981', color: '#fff', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)' }}
          >
            {isUz ? '🔒 Imtihonni Yakunlash' : '🔒 Завершить Экзамен'}
          </button>
        )}
      </div>
    </div>
  );
}