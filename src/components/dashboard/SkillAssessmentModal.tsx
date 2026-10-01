import React, { useState, useEffect } from 'react';
import { X, Clock, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, RotateCcw } from 'lucide-react';
import { SKILL_QUIZZES, QuizQuestion } from '../../data/assessmentQuestions';
import { useApp } from '../../context/AppContext';

interface SkillAssessmentModalProps {
  skillName: string;
  onClose: () => void;
}

export const SkillAssessmentModal: React.FC<SkillAssessmentModalProps> = ({
  skillName,
  onClose,
}) => {
  const { recordAssessmentPass } = useApp();

  const quiz = SKILL_QUIZZES[skillName] || SKILL_QUIZZES['Python'];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimitSeconds);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (isSubmitted) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const currentQuestion = quiz.questions[currentIdx];

  const handleSelectOption = (optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionIdx,
    }));
  };

  const calculateScore = () => {
    let correctCount = 0;
    quiz.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });
    return Math.round((correctCount / quiz.questions.length) * 100);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const score = calculateScore();
    if (score >= quiz.passingScore) {
      recordAssessmentPass(quiz.skillName, score);
    }
  };

  const score = isSubmitted ? calculateScore() : 0;
  const isPassed = score >= quiz.passingScore;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-indigo-50/40">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-100/70 px-2.5 py-0.5 rounded-full mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Skill Verification Challenge</span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">
              {quiz.skillName} Algorithmic & Systems Assessment
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {!isSubmitted && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-lg border border-amber-200 text-xs font-mono font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                </span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {!isSubmitted ? (
          <div className="p-6 space-y-5">
            {/* Progress indicators */}
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Question {currentIdx + 1} of {quiz.questions.length}</span>
              <span>Pass Criterion: {quiz.passingScore}%</span>
            </div>

            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / quiz.questions.length) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {currentQuestion.question}
              </h4>

              {currentQuestion.codeSnippet && (
                <div className="mt-3 p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto">
                  <pre>{currentQuestion.codeSnippet}</pre>
                </div>
              )}
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQuestion.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentQuestion.id] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-900 shadow-2xs font-semibold'
                        : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span>{opt}</span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(prev => prev - 1)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 disabled:opacity-40 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Previous
              </button>

              {currentIdx < quiz.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx(prev => prev + 1)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs"
                >
                  Submit Challenge
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Submission Results View */
          <div className="p-6 text-center space-y-5">
            <div
              className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                isPassed ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
              }`}
            >
              {isPassed ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
            </div>

            <div>
              <h4 className="text-xl font-extrabold text-slate-900">
                {isPassed ? `${quiz.skillName} Assessment Verified ✓` : 'Assessment Incomplete'}
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {isPassed
                  ? `Congratulations! You scored ${score}%. An official verification evidence token has been minted and added to your passport.`
                  : `You scored ${score}%. The benchmark is ${quiz.passingScore}%. You can review explanations and re-attempt to earn your verification badge.`}
              </p>
            </div>

            {/* Score pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full text-xs font-bold text-slate-800">
              <span>Score: {score}%</span>
              <span>•</span>
              <span className={isPassed ? 'text-emerald-600' : 'text-rose-600'}>
                {isPassed ? 'VERIFIED' : 'NOT PASSED'}
              </span>
            </div>

            {/* Question Breakdown */}
            <div className="text-left space-y-3 pt-3 border-t border-slate-100 max-h-56 overflow-y-auto">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Detailed Explanations & Answers
              </span>
              {quiz.questions.map((q, idx) => {
                const isCorrect = selectedAnswers[q.id] === q.correctIndex;
                return (
                  <div
                    key={q.id}
                    className={`p-3 rounded-xl border text-xs ${
                      isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
                    }`}
                  >
                    <div className="font-semibold text-slate-900 mb-1 flex items-center justify-between">
                      <span>Q{idx + 1}: {q.question}</span>
                      <span className={isCorrect ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                        {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      <strong>Key Concept:</strong> {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              {!isPassed && (
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setCurrentIdx(0);
                    setSelectedAnswers({});
                    setTimeLeft(quiz.timeLimitSeconds);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
