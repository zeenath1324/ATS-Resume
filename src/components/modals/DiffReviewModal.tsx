import React, { useState } from 'react';
import { Check, X, Sparkles, AlertCircle, Edit3, HelpCircle, PlusCircle, RotateCcw } from 'lucide-react';

interface DiffReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalText: string;
  improvedText: string;
  explanation?: string;
  actionVerbsUsed?: string[];
  suggestedMetricHint?: string;
  questionPrompt?: string;
  onApply: (finalText: string) => void;
  title?: string;
}

export const DiffReviewModal: React.FC<DiffReviewModalProps> = ({
  isOpen,
  onClose,
  originalText,
  improvedText,
  explanation,
  actionVerbsUsed,
  suggestedMetricHint,
  questionPrompt,
  onApply,
  title = 'Review AI Resume Improvement'
}) => {
  const [editedText, setEditedText] = useState(improvedText);
  const [isEditing, setIsEditing] = useState(false);

  React.useEffect(() => {
    setEditedText(improvedText);
    setIsEditing(false);
  }, [improvedText]);

  if (!isOpen) return null;

  const handleInsertPlaceholder = () => {
    setIsEditing(true);
    setEditedText(prev => {
      const trimmed = prev.trim();
      const placeholder = ' [e.g., improved query speed by 30% / handled 10K+ records]';
      if (trimmed.endsWith('.')) {
        return trimmed.slice(0, -1) + placeholder + '.';
      }
      return trimmed + placeholder + '.';
    });
  };

  const handleResetToAI = () => {
    setEditedText(improvedText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white/10 rounded-xl">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">{title}</h3>
              <p className="text-[11px] text-blue-100">Factual refinement • Action verbs • Zero hallucinations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Factual Integrity Banner */}
        <div className="px-6 py-3 bg-amber-50/90 border-b border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <div className="text-[11px] leading-relaxed">
            <strong>Strict Factual Integrity:</strong> The AI elevates phrasing, removes filler, and injects strong engineering verbs. It will <em>never</em> invent jobs, companies, technologies, or numbers.
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {explanation && (
            <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-2xl text-xs text-blue-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-blue-900 block sm:inline mr-1">ATS Optimization:</span>
                <span className="leading-relaxed">{explanation}</span>
              </div>
              {actionVerbsUsed && actionVerbsUsed.length > 0 && (
                <div className="flex gap-1.5 flex-wrap shrink-0">
                  {actionVerbsUsed.map((verb, idx) => (
                    <span key={idx} className="bg-blue-200/90 text-blue-900 font-bold px-2 py-0.5 rounded-md text-[10px] tracking-wide">
                      +{verb}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Missing Metrics & Question Prompt Coach */}
          {(suggestedMetricHint || questionPrompt) && (
            <div className="p-4 bg-purple-50/80 border border-purple-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                  <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
                  <span>Metric & Impact Coach</span>
                </div>
                <button
                  type="button"
                  onClick={handleInsertPlaceholder}
                  className="px-2.5 py-1 bg-white hover:bg-purple-100 text-purple-700 rounded-lg text-[11px] font-bold border border-purple-200 transition-colors flex items-center gap-1"
                >
                  <PlusCircle className="w-3 h-3" />
                  Insert Metric Placeholder
                </button>
              </div>

              {questionPrompt && (
                <p className="text-xs text-purple-800 font-medium italic">
                  "{questionPrompt}"
                </p>
              )}

              {suggestedMetricHint && (
                <p className="text-[11px] text-purple-700 leading-relaxed">
                  💡 {suggestedMetricHint}
                </p>
              )}
            </div>
          )}

          {/* Side by side or stacked comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Text */}
            <div className="flex flex-col border border-slate-200 rounded-2xl p-4 bg-slate-50/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Original Provided Text
                </span>
                <span className="text-[10px] text-slate-400 font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                  {originalText.length} chars
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed flex-1 font-normal">
                {originalText || <span className="italic text-slate-400">Empty section text</span>}
              </p>
            </div>

            {/* AI Suggestion */}
            <div className="flex flex-col border-2 border-indigo-400/80 rounded-2xl p-4 bg-indigo-50/40 relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  ATS-Optimized Suggestion
                </span>
                <div className="flex items-center gap-2">
                  {editedText !== improvedText && (
                    <button
                      type="button"
                      onClick={handleResetToAI}
                      title="Reset to original AI suggestion"
                      className="text-[11px] text-slate-500 hover:text-indigo-600 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-bold bg-white px-2 py-0.5 rounded-lg border border-indigo-200"
                  >
                    <Edit3 className="w-3 h-3" />
                    {isEditing ? 'Preview' : 'Edit Before Applying'}
                  </button>
                </div>
              </div>

              {isEditing ? (
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full flex-1 p-3 text-xs sm:text-sm bg-white border border-indigo-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none font-sans leading-relaxed"
                  rows={6}
                />
              ) : (
                <p className="text-xs sm:text-sm text-slate-900 font-medium whitespace-pre-wrap leading-relaxed flex-1">
                  {editedText}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            Keep Original
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                onApply(editedText);
                onClose();
              }}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Apply AI Improvement to Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

