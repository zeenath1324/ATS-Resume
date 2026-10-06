import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  User,
  Send,
  CheckCircle2,
  RefreshCw,
  ChevronRight,
  HelpCircle,
  Award,
  Layers,
  Star,
  ArrowRight,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { apiService } from '../../services/api';
import { InterviewQuestion, AnswerEvaluation } from '../../types/resume';

export const InterviewCoach: React.FC = () => {
  const { activeResume, activeJob } = useResume();

  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Load questions on mount or generate fresh
  const fetchQuestions = async () => {
    setIsGeneratingQuestions(true);
    setEvaluation(null);
    setUserAnswer('');
    try {
      const qList = await apiService.generateInterviewQuestions(activeResume, activeJob);
      setQuestions(qList);
      setCurrentQuestionIndex(0);
    } catch (err) {
      console.warn('Questions fetch error:', err);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [activeResume.id, activeJob.id]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleEvaluateAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim() || !currentQuestion) return;

    setIsEvaluating(true);
    try {
      const evalResult = await apiService.evaluateAnswer(currentQuestion, userAnswer);
      setEvaluation(evalResult);
    } catch (err: any) {
      alert('Error evaluating answer: ' + err.message);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setUserAnswer('');
      setEvaluation(null);
    }
  };

  const handleLoadSampleAnswer = () => {
    if (!currentQuestion) return;
    if (currentQuestion.type === 'project') {
      setUserAnswer(`In our DocuSense project, we processed dense 500-page enterprise manuals. We faced high retrieval latency when chunk sizes were too large. To fix this, I implemented recursive character text splitting with 400-token chunks and 10% overlap, and integrated Chroma vector storage with cosine similarity indexing. This brought search latency down from 2.5s to 380ms while maintaining zero hallucinated citations.`);
    } else if (currentQuestion.type === 'technical') {
      setUserAnswer(`In Python, lists are mutable, ordered sequences which can be dynamically modified in place, whereas tuples are immutable. Tuples provide faster iteration, reduced memory footprint, and can be used as dictionary keys when their elements are hashable. In database indexing, B-Trees balance read and write performance through logarithmic search complexity.`);
    } else {
      setUserAnswer(`When our initial API specs shifted halfway through the sprint, I immediately communicated with our backend lead to clarify the breaking changes. We held a 15-minute sync, decoupled our mock interfaces to unblock frontend work, and renegotiated the delivery milestones so we still launched on time without burnout.`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-white/10 text-white backdrop-blur-xs">
              <Bot className="w-5 h-5 text-amber-300" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
              Interactive AI Interview Coach
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Personalized Mock Interview Session
          </h1>
          <p className="text-xs text-purple-100 mt-1 max-w-xl leading-relaxed">
            Questions synthesized from your verified projects in <strong className="text-white">"{activeResume.title}"</strong> and target job requirements for <strong className="text-white">{activeJob.title}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchQuestions}
            disabled={isGeneratingQuestions}
            className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-white/20"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingQuestions ? 'animate-spin' : ''}`} />
            <span>Generate New Questions</span>
          </button>
        </div>
      </div>

      {isGeneratingQuestions ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/90 shadow-xs space-y-4">
          <Sparkles className="w-10 h-10 text-purple-600 mx-auto animate-pulse" />
          <h3 className="font-bold text-lg text-slate-800">Synthesizing Tailored Interview Questions...</h3>
          <p className="text-xs text-slate-500">
            Analyzing your resume projects, technical stack, and target job description with Gemini AI.
          </p>
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-xs space-y-4">
          <p className="text-xs text-slate-500">No questions generated yet.</p>
          <button onClick={fetchQuestions} className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold">
            Generate Questions
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Question Queue & Category Switcher (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Question Queue ({questions.length})
                </span>
                <span className="text-xs text-purple-600 font-bold">
                  {currentQuestionIndex + 1} of {questions.length}
                </span>
              </div>

              <div className="space-y-2">
                {questions.map((q, idx) => {
                  const isCurrent = idx === currentQuestionIndex;
                  return (
                    <button
                      key={q.id || idx}
                      onClick={() => {
                        setCurrentQuestionIndex(idx);
                        setUserAnswer('');
                        setEvaluation(null);
                      }}
                      className={`w-full p-3 rounded-2xl text-left transition-all border ${
                        isCurrent
                          ? 'border-purple-600 bg-purple-50/70 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[9px] ${
                          q.type === 'project' ? 'bg-indigo-100 text-indigo-800' :
                          q.type === 'technical' ? 'bg-blue-100 text-blue-800' :
                          q.type === 'behavioral' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {q.type}
                        </span>
                        <span className="text-slate-400 font-medium">#{idx + 1}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 line-clamp-2">
                        {q.question}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Active Interactive Interview Arena (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {currentQuestion && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
                {/* Active Question Box */}
                <div className="p-5 bg-gradient-to-br from-purple-50/80 to-indigo-50/50 rounded-2xl border border-purple-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-200/80 text-purple-900 font-bold text-[10px] uppercase tracking-wider">
                      {currentQuestion.type} Question
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Difficulty: <strong>{currentQuestion.difficulty}</strong>
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    "{currentQuestion.question}"
                  </h3>

                  <div className="pt-2 border-t border-purple-200/60 text-xs text-purple-900 flex items-start gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                    <span><strong>Interviewer Context:</strong> {currentQuestion.context}</span>
                  </div>
                </div>

                {/* Candidate Answer Form */}
                <form onSubmit={handleEvaluateAnswer} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Your Answer (STAR Method Recommended)
                    </label>
                    <button
                      type="button"
                      onClick={handleLoadSampleAnswer}
                      className="text-xs text-purple-600 hover:text-purple-800 font-semibold"
                    >
                      ⚡ Populate Sample Answer to Test
                    </button>
                  </div>

                  <textarea
                    rows={6}
                    required
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Structure your answer clearly: 1) Context & Situation, 2) Technical Action/Design Decision, 3) Measurable Result..."
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm leading-relaxed focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all font-sans"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Word count: {userAnswer.trim().split(/\s+/).filter(Boolean).length}
                    </span>

                    <button
                      type="submit"
                      disabled={isEvaluating || !userAnswer.trim()}
                      className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
                    >
                      {isEvaluating ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Evaluating on 5 Dimensions...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>Submit Answer for AI Evaluation</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* AI Evaluation Report */}
                {evaluation && (
                  <div className="mt-8 pt-6 border-t border-slate-200 space-y-6 animate-in fade-in zoom-in-95">
                    {/* Score Ribbon */}
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 block">
                          AI Evaluation Score
                        </span>
                        <h4 className="text-2xl font-extrabold">{evaluation.score} / 10</h4>
                        <p className="text-xs text-emerald-100">Strong technical grasp with clear articulation.</p>
                      </div>

                      {/* 5 Dimensions Pills */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                        <div className="p-2 bg-white/10 rounded-xl">
                          <span className="text-[10px] text-emerald-200 block">Technical</span>
                          <span className="font-extrabold text-white">{evaluation.technicalCorrectness}/10</span>
                        </div>
                        <div className="p-2 bg-white/10 rounded-xl">
                          <span className="text-[10px] text-emerald-200 block">Relevance</span>
                          <span className="font-extrabold text-white">{evaluation.relevance}/10</span>
                        </div>
                        <div className="p-2 bg-white/10 rounded-xl">
                          <span className="text-[10px] text-emerald-200 block">Clarity</span>
                          <span className="font-extrabold text-white">{evaluation.clarity}/10</span>
                        </div>
                        <div className="p-2 bg-white/10 rounded-xl">
                          <span className="text-[10px] text-emerald-200 block">Delivery</span>
                          <span className="font-extrabold text-white">{evaluation.communication}/10</span>
                        </div>
                        <div className="p-2 bg-white/10 rounded-xl">
                          <span className="text-[10px] text-emerald-200 block">Depth</span>
                          <span className="font-extrabold text-white">{evaluation.completeness}/10</span>
                        </div>
                      </div>
                    </div>

                    {/* Feedback Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Positive points */}
                      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>What You Did Well</span>
                        </div>
                        <ul className="list-disc pl-4 space-y-1 text-emerald-900/90 leading-relaxed">
                          {evaluation.positivePoints.map((pt, i) => (
                            <li key={i}>{pt}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Areas of improvement */}
                      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                        <div className="flex items-center gap-1.5 font-bold text-amber-950">
                          <TrendingUp className="w-4 h-4 text-amber-600" />
                          <span>How to Elevate This Answer</span>
                        </div>
                        <ul className="list-disc pl-4 space-y-1 text-amber-900/90 leading-relaxed">
                          {evaluation.areasOfImprovement.map((pt, i) => (
                            <li key={i}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Exemplary Model Answer */}
                    <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                          Exemplary ATS/STAR Model Answer
                        </span>
                      </div>
                      <p className="text-slate-300 leading-relaxed italic">
                        "{evaluation.idealModelAnswer}"
                      </p>
                    </div>

                    {/* Next Question Navigation */}
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={handleNextQuestion}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
                      >
                        <span>Next Question</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
