'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';

interface QuizProps {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export function Quiz({
  question,
  options,
  correctAnswer,
  explanation,
}: QuizProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
  };

  const isCorrect = selectedAnswer === correctAnswer;

  return (
    <div className="my-6 p-6 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
      <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
        {question}
      </h3>

      <div className="space-y-3 mb-6">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => !showResult && handleSubmit(index)}
            disabled={showResult}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              showResult && selectedAnswer === index
                ? isCorrect
                  ? 'border-green-500 bg-green-50 dark:bg-green-950'
                  : 'border-red-500 bg-red-50 dark:bg-red-950'
                : showResult && index === correctAnswer
                ? 'border-green-500 bg-green-50 dark:bg-green-950'
                : 'border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 cursor-pointer'
            } ${showResult ? 'cursor-default' : ''}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-slate-900 dark:text-white">{option}</span>
              {showResult && selectedAnswer === index && (
                isCorrect ? (
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                )
              )}
              {showResult && index === correctAnswer && selectedAnswer !== index && (
                <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
              )}
            </div>
          </button>
        ))}
      </div>

      {showResult && (
        <div
          className={`p-4 rounded-lg ${
            isCorrect
              ? 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 border border-green-300 dark:border-green-700'
              : 'bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 border border-red-300 dark:border-red-700'
          }`}
        >
          <p className="font-semibold mb-2">
            {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
          </p>
          {explanation && <p className="text-sm">{explanation}</p>}
        </div>
      )}

      {!showResult && (
        <button
          onClick={() => handleSubmit(selectedAnswer ?? 0)}
          disabled={selectedAnswer === null}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg font-medium transition-colors"
        >
          Submit Answer
        </button>
      )}
    </div>
  );
}
