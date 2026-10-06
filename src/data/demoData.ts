import { ResumeData, JobDescription, ATSAnalysisResult, ResumeHealthReport } from '../types/resume';

export const DEMO_FRESHER_RESUME: ResumeData = {
  id: 'resume-demo-1',
  title: 'GenAI & Software Engineer Resume',
  targetRole: 'Generative AI / Software Engineer',
  isFresher: true,
  template: 'fresher',
  themeColor: '#2563eb', // Blue-600
  fontFamily: 'sans',
  fontSize: 'base',
  spacing: 'normal',
  sectionOrder: [
    'summary',
    'skills',
    'projects',
    'internships',
    'education',
    'certifications',
    'achievements',
    'languages'
  ],
  personalInfo: {
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma.dev@gmail.com',
    phone: '+1 (555) 234-5678',
    location: 'San Jose, CA',
    linkedin: 'linkedin.com/in/aarav-sharma-ai',
    github: 'github.com/aaravsharma-dev',
    portfolio: 'aaravsharma.dev',
    headline: 'Aspiring AI & Full Stack Engineer | Python, React, GenAI & SQL'
  },
  summary: 'Motivated Computer Science graduate with hands-on expertise in Python, Generative AI workflows, SQL, and modern React web development. Proven track record of developing functional AI prototypes, including a retrieval-augmented generation (RAG) assistant and enterprise business intelligence dashboards. Eager to contribute high-velocity software engineering and machine learning capabilities to engineering teams.',
  education: [
    {
      id: 'edu-1',
      degree: 'Bachelor of Science in Computer Science',
      college: 'California State University',
      university: 'CSU System',
      location: 'San Jose, CA',
      graduationYear: '2025',
      cgpaOrPercentage: '3.85 / 4.00 (Summa Cum Laude)',
      fieldOfStudy: 'Computer Science & Artificial Intelligence',
      relevantCoursework: [
        'Data Structures & Algorithms',
        'Database Management Systems (SQL)',
        'Machine Learning & Deep Learning',
        'Web Systems Architecture',
        'Object-Oriented Design'
      ]
    }
  ],
  skills: [
    {
      category: 'Programming Languages',
      skills: ['Python', 'SQL', 'TypeScript', 'JavaScript', 'C++']
    },
    {
      category: 'AI/ML & GenAI',
      skills: ['Generative AI', 'LangChain', 'Prompt Engineering', 'RAG Pipelines', 'Vector Databases (ChromaDB)', 'Scikit-Learn', 'Hugging Face']
    },
    {
      category: 'Web & Frontend',
      skills: ['React', 'Next.js', 'Tailwind CSS', 'REST APIs', 'Node.js']
    },
    {
      category: 'Databases & Cloud',
      skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Docker', 'AWS (S3, EC2 Basics)', 'Git/GitHub']
    },
    {
      category: 'Data & Analytics',
      skills: ['Power BI', 'Pandas', 'NumPy', 'Data Visualization']
    },
    {
      category: 'Soft Skills',
      skills: ['Agile Collaboration', 'Technical Problem Solving', 'Cross-Functional Communication', 'Continuous Learning']
    }
  ],
  experience: [],
  internships: [
    {
      id: 'intern-1',
      company: 'NeuralCraft Solutions',
      role: 'Machine Learning & GenAI Engineering Intern',
      duration: 'June 2024 – August 2024',
      responsibilities: [
        'Engineered an internal document Q&A assistant using LangChain, OpenAI embeddings, and Chroma vector database, reducing document search latency by 45%.',
        'Implemented semantic caching layer and structured prompt engineering templates to reduce LLM token usage and API latency.',
        'Collaborated with a cross-functional team of 4 engineers in two-week Agile sprints, participating in daily standups and Git code reviews.'
      ],
      learnings: 'Gained hands-on production experience with vector retrieval, embedding dimensionality, and latency optimization in LLM applications.'
    }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'DocuSense: Enterprise RAG Assistant',
      technologies: ['Python', 'LangChain', 'ChromaDB', 'FastAPI', 'React'],
      description: 'Developed an end-to-end Retrieval-Augmented Generation (RAG) web application allowing users to upload dense technical PDFs and query them in natural language with source-attributed answers.',
      contribution: 'Designed the chunking strategy (recursive character splitting with overlap), vector store indexing, and built the interactive React frontend with real-time streaming citations.',
      outcome: 'Achieved sub-second query retrieval accuracy on 500+ page enterprise manuals with zero citation hallucinations.',
      liveLink: 'https://docusense-demo.vercel.app',
      githubLink: 'https://github.com/aaravsharma-dev/docusense-rag'
    },
    {
      id: 'proj-2',
      name: 'OmniAnalytics: E-Commerce Power BI & SQL Dashboard',
      technologies: ['Power BI', 'PostgreSQL', 'Python', 'Pandas'],
      description: 'Built a full-stack data pipeline and interactive executive dashboard analyzing 120,000+ transaction records for an e-commerce platform.',
      contribution: 'Authored complex SQL queries including window functions, CTEs, and cohort retention metrics. Designed 5 interactive Power BI report views for customer lifetime value (LTV) and churn forecasting.',
      outcome: 'Identified a 14% drop-off in checkout funnel conversions and automated weekly scheduled executive reporting.',
      githubLink: 'https://github.com/aaravsharma-dev/omni-analytics-bi'
    },
    {
      id: 'proj-3',
      name: 'CodeSync: Collaborative Real-Time Code Editor',
      technologies: ['React', 'TypeScript', 'Node.js', 'Socket.io', 'Tailwind CSS'],
      description: 'Created a browser-based collaborative code editor supporting multi-cursor live synchronization, syntax highlighting, and virtual execution sandbox.',
      contribution: 'Engineered WebSocket conflict resolution for simultaneous line edits and created responsive dark-mode UI with customizable editor themes.',
      outcome: 'Supports up to 10 simultaneous connected peers with under 40ms sync latency.',
      githubLink: 'https://github.com/aaravsharma-dev/codesync-collab'
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'Generative AI with Large Language Models',
      issuer: 'DeepLearning.AI & AWS (Coursera)',
      year: '2024',
      credentialLink: 'https://coursera.org/verify/GENAI-CERT-992'
    },
    {
      id: 'cert-2',
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      year: '2024',
      credentialLink: 'https://aws.amazon.com/verification/CLF-C02-881'
    }
  ],
  achievements: [
    {
      id: 'ach-1',
      title: '1st Place – AI Innovation Hackathon 2024',
      description: 'Built an automated accessible audio-visual learning agent for visually impaired students among 60+ competing collegiate teams.',
      year: '2024'
    },
    {
      id: 'ach-2',
      title: 'Dean’s Honor List (All Semesters)',
      description: 'Maintained 3.85 GPA across all academic semesters in the Department of Computer Science.',
      year: '2021 – 2025'
    }
  ],
  languages: [
    { language: 'English', proficiency: 'Native' },
    { language: 'Spanish', proficiency: 'Intermediate' }
  ],
  interests: ['Open Source AI Models', 'Competitive Programming', 'Tech Podcast Production', 'Robotics Club'],
  lastModified: new Date().toISOString()
};

export const DEMO_JOB_DESCRIPTIONS: JobDescription[] = [
  {
    id: 'job-1',
    title: 'Generative AI & LLM Engineer Intern',
    company: 'ScaleNexus AI',
    dateAdded: '2025-02-15',
    rawText: `ScaleNexus AI is seeking a passionate Generative AI / LLM Engineer Intern to join our applied AI team. In this role, you will build next-generation applications powered by modern foundation models.

Key Responsibilities:
- Design, evaluate, and deploy Retrieval-Augmented Generation (RAG) pipelines using vector databases.
- Develop custom prompt engineering strategies and evaluation metrics for model outputs.
- Build clean, responsive internal web interfaces using React and modern CSS.
- Collaborate with backend engineers to integrate REST APIs and microservices using Python and FastAPI.
- Implement caching, token optimization, and latency monitoring across production LLM calls.

Requirements:
- Bachelor's or Master's degree in Computer Science, AI, Data Science, or related field (current student or recent graduate).
- Strong proficiency in Python and solid fundamentals in Data Structures and Algorithms.
- Demonstrated experience with Generative AI tools (LangChain, LlamaIndex, or Hugging Face).
- Hands-on knowledge of vector stores (ChromaDB, Pinecone, or FAISS).
- Familiarity with SQL and relational databases (PostgreSQL or MySQL).
- Basic understanding of containerization with Docker and cloud concepts (AWS).
- Strong communication, analytical thinking, and eagerness to learn in a fast-paced environment.

Preferred Qualifications:
- Experience building full-stack applications with React or Next.js.
- Prior internship or significant academic/open-source projects in AI/ML.
- Knowledge of LLM evaluation frameworks (Ragas, TruLens) and fine-tuning basics.`,
    extracted: {
      requiredSkills: [
        'Python',
        'Generative AI',
        'RAG Pipelines',
        'Vector Databases',
        'Prompt Engineering',
        'SQL',
        'REST APIs',
        'FastAPI',
        'Data Structures & Algorithms'
      ],
      preferredSkills: [
        'React',
        'LangChain',
        'Docker',
        'AWS',
        'ChromaDB',
        'PostgreSQL',
        'LLM Evaluation'
      ],
      educationRequirements: [
        "Bachelor's or Master's in Computer Science, AI, Data Science, or related engineering discipline"
      ],
      experienceRequirements: [
        'Internship or academic/personal project experience in AI/ML'
      ],
      tools: ['Git', 'Docker', 'AWS', 'PostgreSQL', 'ChromaDB', 'FastAPI'],
      technologies: ['Python', 'React', 'LangChain', 'LlamaIndex', 'Hugging Face', 'SQL'],
      importantKeywords: [
        'RAG',
        'Vector Database',
        'Prompt Engineering',
        'LangChain',
        'Python',
        'FastAPI',
        'React',
        'Docker',
        'SQL',
        'Token Optimization'
      ],
      responsibilities: [
        'Design and deploy RAG pipelines',
        'Optimize LLM prompts and token usage',
        'Develop React user interfaces for AI workflows',
        'Author REST APIs in Python/FastAPI',
        'Perform model output evaluation'
      ]
    }
  },
  {
    id: 'job-2',
    title: 'Full Stack Software Engineer (Entry Level)',
    company: 'Apex Cloud Solutions',
    dateAdded: '2025-02-10',
    rawText: `Apex Cloud Solutions is hiring an Entry-Level Full Stack Software Engineer to build scalable customer-facing SaaS platforms.

Responsibilities:
- Build modern, accessible frontends using React, TypeScript, and Tailwind CSS.
- Write robust backend services and RESTful APIs in Node.js or Python.
- Optimize database queries and schemas using PostgreSQL and Prisma/TypeORM.
- Participate in code reviews, automated unit testing, and CI/CD pipelines.

Requirements:
- Degree in Computer Science, Software Engineering, or equivalent practical experience.
- Proficiency in JavaScript/TypeScript and Python.
- Solid understanding of web fundamentals, HTTP protocols, and component-based UI design.
- Hands-on experience with SQL databases and Git version control.`,
    extracted: {
      requiredSkills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'RESTful APIs', 'Git'],
      preferredSkills: ['PostgreSQL', 'Tailwind CSS', 'Docker', 'CI/CD', 'Automated Testing'],
      educationRequirements: ["Degree in Computer Science or Software Engineering"],
      experienceRequirements: ['0-2 years of software development experience or internship'],
      tools: ['Git', 'PostgreSQL', 'Docker', 'GitHub Actions'],
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Python'],
      importantKeywords: ['Full Stack', 'React', 'TypeScript', 'PostgreSQL', 'RESTful APIs', 'Component Design', 'Git'],
      responsibilities: ['Build React frontend interfaces', 'Develop backend services', 'Optimize SQL schemas']
    }
  },
  {
    id: 'job-3',
    title: 'Junior Data & BI Analyst',
    company: 'Vanguard Metrics',
    dateAdded: '2025-02-05',
    rawText: `Vanguard Metrics is looking for a Junior Data & BI Analyst to turn complex data into actionable insights for strategic decision-making.

Key Responsibilities:
- Build interactive executive dashboards using Power BI and Tableau.
- Write advanced SQL queries for ETL, metric aggregation, and database validation.
- Clean and analyze datasets using Python (Pandas, NumPy).
- Present key findings clearly to non-technical stakeholders.

Qualifications:
- Bachelor's degree in CS, Data Analytics, Statistics, or Business Information Systems.
- High proficiency in SQL (joins, window functions, CTEs) and Power BI.
- Experience with Python data analysis libraries.
- Strong analytical curiosity and communication skills.`,
    extracted: {
      requiredSkills: ['SQL', 'Power BI', 'Python', 'Pandas', 'Data Analysis', 'Data Visualization', 'Communication'],
      preferredSkills: ['Tableau', 'PostgreSQL', 'ETL Pipelines', 'NumPy', 'Cohort Analysis'],
      educationRequirements: ["Bachelor's in CS, Data Analytics, Statistics or related"],
      experienceRequirements: ['Entry level with project portfolio or internship'],
      tools: ['Power BI', 'Tableau', 'PostgreSQL', 'Excel'],
      technologies: ['SQL', 'Python', 'Pandas', 'NumPy'],
      importantKeywords: ['Power BI', 'SQL', 'Window Functions', 'ETL', 'Data Visualization', 'Pandas', 'Dashboard'],
      responsibilities: ['Build interactive Power BI dashboards', 'Write advanced SQL queries', 'Clean data with Python']
    }
  }
];

export const DEMO_ATS_ANALYSIS: ATSAnalysisResult = {
  overallScore: 84,
  disclaimer: 'AI-based ATS compatibility estimate. This score measures textual alignment, keyword density, and structural readability against the specified job description. It does not guarantee interview shortlisting.',
  calculationExplanation: 'Weighted composite metric evaluating: Keyword Match (25%), Technical Skills Alignment (25%), Academic & Practical Experience (20%), Education & Coursework (10%), ATS Structural Parsability (10%), and Formatting & Readability (10%).',
  categories: {
    keywordMatch: {
      score: 86,
      weight: 25,
      feedback: 'Excellent match on primary role keywords (RAG, Python, LangChain, Vector Database, Prompt Engineering, React).',
      suggestions: [
        'Consider mentioning "FastAPI" in your DocuSense project description to match backend API requirements.'
      ]
    },
    skillsMatch: {
      score: 88,
      weight: 25,
      feedback: 'Candidate has 8 of the 9 required skills and 6 of the 7 preferred skills.',
      suggestions: [
        'Highlight your Docker fundamentals in your skills section or project deployment notes.'
      ]
    },
    experienceMatch: {
      score: 80,
      weight: 20,
      feedback: 'Strong alignment for fresher level with 1 relevant industry internship and 3 substantive technical projects.',
      suggestions: [
        'Quantify API latency improvements or token cost reductions with estimated percentage ranges if observed.'
      ]
    },
    educationMatch: {
      score: 95,
      weight: 10,
      feedback: 'Directly matches requirement: BS in Computer Science with Summa Cum Laude distinction.',
      suggestions: []
    },
    resumeStructure: {
      score: 90,
      weight: 10,
      feedback: 'Standard ATS-friendly section headers, single-column layout, and clear chronological flow.',
      suggestions: [
        'Ensure contact email and phone remain in plain text without graphics.'
      ]
    },
    jobRelevance: {
      score: 85,
      weight: 10,
      feedback: 'Every project directly showcases competencies asked in the job description.',
      suggestions: []
    },
    readability: {
      score: 88,
      weight: 10,
      feedback: 'Strong action verbs (Engineered, Implemented, Developed, Authored). Clean bullet sentence lengths.',
      suggestions: [
        'Keep all project bullet points under 3 lines for optimal scanner skimming.'
      ]
    }
  },
  matchedKeywords: [
    {
      keyword: 'Python',
      category: 'hard-skill',
      frequencyInJob: 6,
      foundInResume: true,
      importance: 'critical',
      whyItMatters: 'Core programming language for LLM pipelines and backend microservices.',
      whereToAddNaturally: 'Already prominently featured in Skills, Projects, and Internships.'
    },
    {
      keyword: 'RAG / Retrieval-Augmented Generation',
      category: 'domain',
      frequencyInJob: 4,
      foundInResume: true,
      importance: 'critical',
      whyItMatters: 'Core focus of the engineering team.',
      whereToAddNaturally: 'DocuSense project title and bullet points.'
    },
    {
      keyword: 'Vector Database (ChromaDB)',
      category: 'tool',
      frequencyInJob: 3,
      foundInResume: true,
      importance: 'critical',
      whyItMatters: 'Required for embedding indexing and similarity search.',
      whereToAddNaturally: 'Featured in Skills and NeuralCraft internship.'
    },
    {
      keyword: 'React',
      category: 'tool',
      frequencyInJob: 3,
      foundInResume: true,
      importance: 'high',
      whyItMatters: 'Preferred for building interactive frontend interfaces for internal AI tooling.',
      whereToAddNaturally: 'Featured in Skills and DocuSense UI.'
    },
    {
      keyword: 'SQL & PostgreSQL',
      category: 'hard-skill',
      frequencyInJob: 3,
      foundInResume: true,
      importance: 'high',
      whyItMatters: 'Required for relational metadata storage and transactional workflows.',
      whereToAddNaturally: 'Featured in OmniAnalytics project and Skills.'
    },
    {
      keyword: 'LangChain',
      category: 'tool',
      frequencyInJob: 2,
      foundInResume: true,
      importance: 'high',
      whyItMatters: 'Key orchestration framework used for prompt chaining and document loading.',
      whereToAddNaturally: 'Mentioned in NeuralCraft internship and DocuSense project.'
    }
  ],
  missingKeywords: [
    {
      keyword: 'FastAPI',
      category: 'tool',
      frequencyInJob: 2,
      foundInResume: false,
      importance: 'high',
      whyItMatters: 'The team builds backend model endpoints using FastAPI.',
      whereToAddNaturally: 'If you used FastAPI or REST APIs in your DocuSense project backend, explicitly specify "FastAPI" in the project technologies list.'
    },
    {
      keyword: 'Docker / Containerization',
      category: 'tool',
      frequencyInJob: 2,
      foundInResume: false,
      importance: 'medium',
      whyItMatters: 'Used for packaging and containerizing services in team staging environments.',
      whereToAddNaturally: 'Mention in Skills under Tools or in your project description if you containerized the local service.'
    },
    {
      keyword: 'LLM Evaluation (Ragas / TruLens)',
      category: 'domain',
      frequencyInJob: 1,
      foundInResume: false,
      importance: 'medium',
      whyItMatters: 'Preferred qualification for measuring retrieval recall and hallucination rates.',
      whereToAddNaturally: 'Recommended learning path item before your technical interview.'
    }
  ],
  skillGap: {
    candidateSkills: [
      'Python',
      'SQL',
      'Generative AI',
      'Prompt Engineering',
      'RAG Pipelines',
      'React',
      'Vector Databases (ChromaDB)',
      'Power BI',
      'LangChain',
      'Git'
    ],
    missingSkills: ['FastAPI Backend Endpoints', 'Docker Containerization', 'Automated LLM Evaluation (Ragas)'],
    learningPath: [
      {
        step: 1,
        skill: 'FastAPI REST Endpoints',
        action: 'Build a 3-route FastAPI backend serving a question-answering endpoint with Pydantic validation.',
        projectIdea: 'Wrap your DocuSense query pipeline into an asynchronous FastAPI endpoint with OpenAPI Swagger docs.'
      },
      {
        step: 2,
        skill: 'Docker Containerization',
        action: 'Write a Dockerfile and docker-compose.yml to orchestrate a Python API and Chroma vector database.',
        projectIdea: 'Create a one-command `docker compose up` setup for your GitHub repository.'
      },
      {
        step: 3,
        skill: 'LLM Evaluation with Ragas',
        action: 'Study context precision, faithfulness, and answer relevancy metrics.',
        projectIdea: 'Evaluate 20 sample queries on your RAG assistant and publish an evaluation benchmark chart in your README.'
      }
    ]
  },
  breakdown: {
    keywordMatch: 17,
    skillsMatch: 16,
    experienceRelevance: 12,
    projectRelevance: 13,
    educationMatch: 10,
    resumeStructure: 8,
    readability: 8,
  },
  projectAnalysis: [
    {
      projectName: 'DocuSense: Enterprise RAG Assistant',
      relevanceScore: 94,
      relevantTechnologies: ['Python', 'LangChain', 'ChromaDB', 'FastAPI', 'React'],
      relevantSkills: ['Vector Retrieval', 'Prompt Engineering', 'Full-Stack Architecture'],
      missingOrWeakInfo: 'Add backend throughput or query volume if measured.',
      suggestion: 'Highlight sub-second retrieval accuracy and specific chunking methodology.'
    },
    {
      projectName: 'OmniAnalytics: E-Commerce Dashboard',
      relevanceScore: 88,
      relevantTechnologies: ['PostgreSQL', 'Python', 'Pandas', 'Power BI'],
      relevantSkills: ['Complex SQL', 'Data Pipeline Engineering'],
      missingOrWeakInfo: 'Could mention automated deployment pipeline if used.',
      suggestion: 'Quantify query latency reduction achieved with index optimization.'
    },
    {
      projectName: 'CodeSync: Collaborative Code Editor',
      relevanceScore: 84,
      relevantTechnologies: ['React', 'TypeScript', 'Node.js', 'Socket.io'],
      relevantSkills: ['Real-Time WebSockets', 'Frontend Component Design'],
      missingOrWeakInfo: 'Quantify active users or concurrent connection testing.',
      suggestion: 'Explicitly describe the conflict resolution strategy used during simultaneous edits.'
    }
  ],
  structureIssues: [
    { section: 'Contact Information', exists: true, status: 'passed', detail: 'Complete header with verified LinkedIn & GitHub.' },
    { section: 'Professional Summary', exists: true, status: 'passed', detail: 'ATS-tailored opening summary.' },
    { section: 'Education', exists: true, status: 'passed', detail: 'B.S. in Computer Science with GPA listed.' },
    { section: 'Skills', exists: true, status: 'passed', detail: 'Categorized across 8 standard categories.' },
    { section: 'Projects', exists: true, status: 'passed', detail: '3 substantive technical applications.' },
    { section: 'Experience / Internships', exists: true, status: 'passed', detail: '1 relevant GenAI engineering internship.' }
  ],
  contentIssues: [
    { type: 'grammar', location: 'Summary & Bullets', issue: 'Good grammar and punctuation standards verified.', suggestion: 'Continue using concise 1-2 sentence engineering statements.' }
  ],
  topReasons: [
    'Missing 3 secondary tools mentioned in posting (FastAPI, Docker, and Ragas).',
    'Fresher Mode active: High project and internship depth compensates for corporate tenure.',
    'CodeSync project could specify test concurrency numbers to prove production scalability.',
    'Education and hard skills (Python, SQL, RAG) match posting core expectations with 90%+ alignment.'
  ],
  improvementActions: [
    { priority: 1, title: 'Incorporate FastAPI in Project Details', action: 'If your DocuSense backend used FastAPI, explicitly state it in your technologies list and bullet points.', impact: '+4 points' },
    { priority: 2, title: 'Add Docker Containerization', action: 'Include Docker under tools if you containerized your DocuSense or CodeSync applications for local testing.', impact: '+3 points' },
    { priority: 3, title: 'Quantify Concurrency in CodeSync', action: 'State the number of concurrent socket connections tested (e.g. tested with 10+ simultaneous peers).', impact: '+2 points' },
    { priority: 4, title: 'Explore LLM Evaluation (Ragas)', action: 'Complete a brief evaluation tutorial with Ragas to address preferred qualification before interview.', impact: '+2 points' }
  ],
  tailoredImprovements: [
    {
      section: 'Project: DocuSense',
      original: 'Developed an end-to-end Retrieval-Augmented Generation (RAG) web application allowing users to upload dense technical PDFs.',
      improved: 'Architected an end-to-end Retrieval-Augmented Generation (RAG) pipeline utilizing Python, LangChain, and ChromaDB to ingest multi-page enterprise PDFs with sub-second retrieval latency.',
      rationale: 'Elevates passive phrasing into clear engineering action verbs and highlights key ATS keywords directly in the opening line.'
    },
    {
      section: 'Summary',
      original: 'Motivated Computer Science graduate with hands-on expertise in Python, Generative AI workflows, SQL, and modern React web development.',
      improved: 'Computer Science graduate specializing in Python, Generative AI architectures (RAG, Vector DBs), and full-stack React applications. Built sub-second document retrieval systems and scalable analytics pipelines.',
      rationale: 'Replaces generic introductory filler with immediate, high-impact technical keywords targeted at the job description.'
    }
  ],
  timestamp: new Date().toISOString()
};

export const DEMO_HEALTH_REPORT: ResumeHealthReport = {
  overallHealthScore: 88,
  items: [
    {
      id: 'h-1',
      category: 'contact',
      severity: 'info',
      issue: 'Professional LinkedIn and GitHub provided',
      recommendation: 'Both profiles are verified and prominently placed in header.',
      sectionLink: 'personalInfo'
    },
    {
      id: 'h-2',
      category: 'impact',
      severity: 'warning',
      issue: 'One project description lacks a measurable metric',
      recommendation: 'In the CodeSync project, quantify either the number of active users, latency in ms, or supported concurrent connections.',
      sectionLink: 'projects'
    },
    {
      id: 'h-3',
      category: 'content',
      severity: 'info',
      issue: 'Action verb distribution is strong',
      recommendation: 'No repetitive verbs detected ("Engineered", "Developed", "Authored", "Collaborated").',
      sectionLink: 'experience'
    },
    {
      id: 'h-4',
      category: 'formatting',
      severity: 'info',
      issue: 'Single-page ATS length compliance',
      recommendation: 'Optimal content density for early career candidate. No overflow to partial second page.',
      sectionLink: 'preview'
    },
    {
      id: 'h-5',
      category: 'content',
      severity: 'warning',
      issue: 'High-frequency keyword "FastAPI" omitted',
      recommendation: 'If you have worked with FastAPI, adding it under Skills or Projects will increase ATS match by approximately 4%.',
      sectionLink: 'skills'
    }
  ]
};
