/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CheckCircle2, ChevronRight, Clock, Trophy } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { cn } from '../lib/utils';
import { Button, Card } from './ui';

export interface Question {
  id: string;
  literatureId: string;
  question: string;
  options: string[];
  correctOption: number;
}

interface TestViewProps {
  questions: Question[];
  studentName: string;
  studentSurname: string;
  onFinish: (result: { score: number; total: number; answers: any[] }) => void;
  durationMinutes: number;
}

export function TestView({ questions, studentName, studentSurname, onFinish, durationMinutes }: TestViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (isFinished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished]);

  const handleNext = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === questions[currentIndex].correctOption;
    if (isCorrect) setScore(prev => prev + 1);

    const newAnswer = {
      questionId: questions[currentIndex].id,
      selected: selectedOption,
      isCorrect
    };

    setAnswers([...answers, newAnswer]);
    setSelectedOption(null);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    setIsFinished(true);
    onFinish({ score: score + (selectedOption === questions[currentIndex].correctOption ? 1 : 0), total: questions.length, answers });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center space-y-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto text-indigo-600"
        >
          <Trophy size={48} />
        </motion.div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900 font-sans">Tabriklaymiz, {studentName}!</h2>
          <p className="text-gray-600 text-lg">Siz testni muvaffaqiyatli yakunladingiz.</p>
        </div>
        
        <Card className="p-8 space-y-6">
          <div className="text-5xl font-black text-indigo-600">
            {score} / {questions.length}
          </div>
          <div className="text-xl font-bold text-gray-700">
            Natija: {Math.round((score / questions.length) * 100)}%
          </div>
          <div className="text-sm text-gray-500 uppercase tracking-widest font-semibold">
            To'g'ri javoblar
          </div>
          <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(score / questions.length) * 100}%` }}
              className="bg-indigo-600 h-full"
            />
          </div>
        </Card>

        <Button onClick={() => window.location.reload()} variant="outline">
          Bosh sahifaga qaytish
        </Button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-indigo-50">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-lg font-bold">
            {currentIndex + 1} / {questions.length}
          </div>
          <h3 className="font-medium text-gray-700 hidden sm:block">
            {studentName} {studentSurname}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-rose-500 font-mono font-bold">
          <Clock size={20} />
          {formatTime(timeLeft)}
        </div>
      </div>

      <motion.div
        key={currentIndex}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -20, opacity: 0 }}
      >
        <Card className="p-8 space-y-8">
          <h2 className="text-2xl font-bold text-gray-900 leading-tight">
            {currentQuestion.question}
          </h2>

          <div className="grid gap-4">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedOption(idx)}
                className={cn(
                  'w-full text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group',
                  selectedOption === idx 
                    ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200' 
                    : 'border-gray-100 hover:border-indigo-200 hover:bg-gray-50'
                )}
              >
                <span className="text-lg text-gray-800">{option}</span>
                {selectedOption === idx && <CheckCircle2 className="text-indigo-600" size={24} />}
              </button>
            ))}
          </div>
        </Card>
      </motion.div>

      <div className="flex justify-end">
        <Button 
          size="lg" 
          disabled={selectedOption === null}
          onClick={handleNext}
          className="flex items-center gap-2"
        >
          {currentIndex === questions.length - 1 ? "Tugatish" : "Keyingisi"}
          <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );
}
