import { ResumeData, JobDescription, ATSAnalysisResult, InterviewQuestion, AnswerEvaluation } from '../types/resume';
import { DEMO_ATS_ANALYSIS } from '../data/demoData';

export interface ImproveTextResponse {
  improvedText: string;
  explanation: string;
  actionVerbsUsed?: string[];
  suggestedMetricHint?: string;
  questionPrompt?: string;
  source?: string;
}

export const apiService = {
  async improveText(
    originalText: string,
    sectionType: string,
    context?: string
  ): Promise<ImproveTextResponse> {
    try {
      const res = await fetch('/api/gemini/improve-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalText, sectionType, context }),
      });
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.warn('Fallback text improvement used:', err);
      const isReactWeb = /made a website using react/i.test(originalText);
      return {
        improvedText: isReactWeb
          ? 'Developed a responsive web application using React, implementing reusable components and interactive user interfaces.'
          : originalText
              .replace(/^worked on /i, 'Architected and engineered ')
              .replace(/^made a /i, 'Developed a ')
              .replace(/^helped /i, 'Collaborated to build '),
        explanation: 'Polished with active engineering action verbs while preserving factual integrity.',
        actionVerbsUsed: isReactWeb ? ['Developed', 'Implementing'] : ['Architected', 'Developed'],
        suggestedMetricHint: 'Consider adding measurable metrics like [e.g. latency, user volume, or efficiency gain] if measured.',
        questionPrompt: 'Did this work result in a measurable speedup, user count, or automated process?',
        source: 'client_fallback',
      };
    }
  },

  async improveFullResume(
    resume: ResumeData,
    jobDescription?: JobDescription
  ): Promise<{ improvements: import('../types/resume').ResumeImprovementItem[] }> {
    try {
      const res = await fetch('/api/gemini/improve-full-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDescription }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Fallback full resume improvement used:', err);
      return {
        improvements: [
          {
            id: 'imp-fallback-1',
            sectionType: 'summary',
            sectionTitle: 'Professional Summary',
            originalText: resume.summary,
            improvedText: `Results-driven ${resume.targetRole || 'Software'} engineer specializing in ${resume.skills?.flatMap(s => s.skills).slice(0, 4).join(', ') || 'modern development'}. Proven background architecting reliable systems, authoring clean APIs, and delivering scalable solutions.`,
            explanation: 'Replaced passive phrasing with active technical keywords.',
            actionVerbsUsed: ['Architecting', 'Authoring', 'Delivering'],
            suggestedMetricHint: 'Mention GPA or quantitative honors if applicable.'
          }
        ]
      };
    }
  },

  async generateSummary(resume: ResumeData): Promise<{ summary: string; highlightedKeywords?: string[] }> {
    try {
      const res = await fetch('/api/gemini/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resume),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Fallback summary generation used:', err);
      const skills = resume.skills.flatMap(s => s.skills).slice(0, 4).join(', ');
      return {
        summary: `Dedicated ${resume.targetRole || 'Software Professional'} specializing in ${skills || 'full-stack technologies'}. Experienced in designing modular applications and delivering robust software solutions with high technical rigor.`,
      };
    }
  },

  async extractJob(jobText: string, jobTitle?: string): Promise<NonNullable<JobDescription['extracted']>> {
    try {
      const res = await fetch('/api/gemini/extract-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobText, jobTitle }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      return data.extracted;
    } catch (err) {
      console.warn('Fallback job extraction used:', err);
      return {
        requiredSkills: ['Problem Solving', 'Communication', 'Software Development'],
        preferredSkills: ['System Design', 'Agile'],
        educationRequirements: ["Bachelor's in relevant discipline"],
        experienceRequirements: ['Entry to mid-level experience'],
        tools: ['Git'],
        technologies: ['Core programming languages'],
        importantKeywords: ['Software', 'Development', 'Engineering'],
        responsibilities: ['Build and maintain high quality software features']
      };
    }
  },

  async analyzeATS(resume: ResumeData, jobDescription: JobDescription): Promise<ATSAnalysisResult> {
    try {
      const res = await fetch('/api/gemini/analyze-ats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDescription }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      return data.analysis;
    } catch (err) {
      console.warn('Fallback ATS analysis used:', err);
      return DEMO_ATS_ANALYSIS;
    }
  },

  async generateInterviewQuestions(
    resume: ResumeData,
    jobDescription?: JobDescription
  ): Promise<InterviewQuestion[]> {
    try {
      const res = await fetch('/api/gemini/interview-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDescription }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      return data.questions;
    } catch (err) {
      console.warn('Fallback interview questions used:', err);
      return [
        {
          id: 'q-demo-1',
          type: 'project',
          question: `Can you walk me through the architecture of your project "${resume.projects[0]?.name || 'DocuSense'}"? What design decisions did you make?`,
          context: 'Assesses architectural ownership and technical depth.',
          sampleExpectedConcepts: ['Component decoupling', 'State/Data management', 'Edge cases'],
          difficulty: 'Junior'
        },
        {
          id: 'q-demo-2',
          type: 'technical',
          question: 'How do you structure database schemas to minimize redundant data while ensuring fast read queries?',
          context: 'Assesses database fundamentals and normalization.',
          sampleExpectedConcepts: ['Normalization (3NF)', 'Indexing strategies', 'Denormalization trade-offs'],
          difficulty: 'Junior'
        },
        {
          id: 'q-demo-3',
          type: 'behavioral',
          question: 'Tell me about a time you encountered a persistent bug or unexpected failure. How did you diagnose and resolve it?',
          context: 'Evaluates resilience, systematic debugging, and communication.',
          sampleExpectedConcepts: ['Logs inspection', 'Hypothesis testing', 'Root cause postmortem'],
          difficulty: 'Junior'
        }
      ];
    }
  },

  async evaluateAnswer(
    question: InterviewQuestion,
    userAnswer: string
  ): Promise<AnswerEvaluation> {
    try {
      const res = await fetch('/api/gemini/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, userAnswer }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      return data.evaluation;
    } catch (err) {
      console.warn('Fallback answer evaluation used:', err);
      const len = userAnswer.trim().split(/\s+/).length;
      return {
        score: len > 35 ? 8 : 6,
        technicalCorrectness: 7,
        relevance: 8,
        clarity: 7,
        communication: 8,
        completeness: len > 40 ? 8 : 6,
        positivePoints: ['Answer is direct and engages with the core concept.'],
        areasOfImprovement: ['Could include specific metrics or quantify results using the STAR framework.'],
        idealModelAnswer: 'A strong response outlines the problem, the specific engineering solution implemented, and concludes with measurable outcomes.'
      };
    }
  }
};
