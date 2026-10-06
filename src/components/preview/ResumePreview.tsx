import React, { useRef, useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Printer,
  FileText,
  Sliders,
  Sparkles,
  ArrowLeft,
  Share2,
  FileCode,
  Type
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { NavTab } from '../common/Navbar';
import jsPDF from 'jspdf';

interface ResumePreviewProps {
  onNavigate: (tab: NavTab) => void;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ onNavigate }) => {
  const {
    activeResume,
    setTemplate,
    setFontFamily,
    setFontSize,
    setSpacing,
    setThemeColor,
  } = useResume();

  const printAreaRef = useRef<HTMLDivElement>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Template options
  const templates: { id: typeof activeResume.template; label: string; desc: string }[] = [
    { id: 'fresher', label: 'Fresher ATS', desc: 'Projects & Coursework First' },
    { id: 'classic', label: 'Classic Ivy', desc: 'Traditional Single-Column' },
    { id: 'modern', label: 'Modern Clean', desc: 'Sleek Headings & Lines' },
    { id: 'technical', label: 'Technical Core', desc: 'Skills & Architecture Focused' },
    { id: 'minimal', label: 'Pure Minimal', desc: 'Zero Distraction, Max Scan Score' },
  ];

  // Browser print to PDF (gold standard for vector, selectable ATS text)
  const handlePrintPDF = () => {
    window.print();
  };

  // Programmatic jsPDF text export
  const handleDirectPDF = () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF({
        unit: 'pt',
        format: 'a4',
      });

      const p = activeResume.personalInfo;
      let y = 40;

      // Name & Contact
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text(p.fullName || 'Candidate', 40, y);
      y += 18;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const contactLine = [p.email, p.phone, p.location, p.linkedin, p.github].filter(Boolean).join(' | ');
      doc.text(contactLine, 40, y);
      y += 20;

      // Summary
      if (activeResume.summary) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('PROFESSIONAL SUMMARY', 40, y);
        y += 12;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const splitSummary = doc.splitTextToSize(activeResume.summary, 515);
        doc.text(splitSummary, 40, y);
        y += splitSummary.length * 12 + 10;
      }

      // Skills
      if (activeResume.skills.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('TECHNICAL SKILLS', 40, y);
        y += 12;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        activeResume.skills.forEach(cat => {
          const line = `${cat.category}: ${cat.skills.join(', ')}`;
          const split = doc.splitTextToSize(line, 515);
          doc.text(split, 40, y);
          y += split.length * 12;
        });
        y += 10;
      }

      // Projects
      if (activeResume.projects.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('KEY PROJECTS', 40, y);
        y += 12;
        activeResume.projects.forEach(proj => {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9.5);
          doc.text(`${proj.name} | ${proj.technologies.join(', ')}`, 40, y);
          y += 12;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          const splitDesc = doc.splitTextToSize(`• ${proj.description}`, 515);
          doc.text(splitDesc, 40, y);
          y += splitDesc.length * 12;
          if (proj.outcome) {
            const splitOutcome = doc.splitTextToSize(`• Outcome: ${proj.outcome}`, 515);
            doc.text(splitOutcome, 40, y);
            y += splitOutcome.length * 12;
          }
          y += 6;
        });
        y += 8;
      }

      // Education
      if (activeResume.education.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('EDUCATION', 40, y);
        y += 12;
        activeResume.education.forEach(edu => {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9.5);
          doc.text(`${edu.degree} - ${edu.college} (${edu.graduationYear})`, 40, y);
          y += 12;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          if (edu.cgpaOrPercentage) {
            doc.text(`CGPA / Performance: ${edu.cgpaOrPercentage}`, 40, y);
            y += 12;
          }
          y += 4;
        });
      }

      doc.save(`${activeResume.personalInfo.fullName.replace(/\s+/g, '_')}_Resume_ATS.pdf`);
    } catch (e) {
      console.warn('jsPDF fallback:', e);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  // Generate valid Word DOCX file (HTML-based MIME doc that Word natively opens)
  const handleDownloadDOCX = () => {
    if (!printAreaRef.current) return;
    const content = printAreaRef.current.innerHTML;
    const header = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${activeResume.personalInfo.fullName} Resume</title><style>
      body { font-family: Arial, sans-serif; font-size: 10pt; line-height: 1.4; color: #111; }
      h1 { font-size: 16pt; margin-bottom: 2pt; }
      h2 { font-size: 11pt; border-bottom: 1pt solid #ccc; margin-top: 10pt; margin-bottom: 4pt; text-transform: uppercase; }
      p { margin: 2pt 0; }
      ul { margin: 2pt 0 4pt 16pt; padding: 0; }
      li { margin-bottom: 2pt; }
    </style></head><body>`;
    const footer = `</body></html>`;
    const source = header + content + footer;

    const blob = new Blob(['\ufeff', source], {
      type: 'application/msword'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeResume.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy Plain Text ATS Format
  const handleCopyPlainText = () => {
    const p = activeResume.personalInfo;
    let text = `${p.fullName}\n${p.email} | ${p.phone} | ${p.location}\nLinkedIn: ${p.linkedin} | GitHub: ${p.github}\n\n`;

    if (activeResume.summary) {
      text += `PROFESSIONAL SUMMARY\n${activeResume.summary}\n\n`;
    }

    if (activeResume.skills.length > 0) {
      text += `TECHNICAL SKILLS\n`;
      activeResume.skills.forEach(c => {
        text += `${c.category}: ${c.skills.join(', ')}\n`;
      });
      text += `\n`;
    }

    if (activeResume.projects.length > 0) {
      text += `PROJECTS\n`;
      activeResume.projects.forEach(pr => {
        text += `${pr.name} (${pr.technologies.join(', ')})\n`;
        text += `- ${pr.description}\n`;
        if (pr.outcome) text += `- Outcome: ${pr.outcome}\n`;
        text += `\n`;
      });
    }

    if (activeResume.education.length > 0) {
      text += `EDUCATION\n`;
      activeResume.education.forEach(ed => {
        text += `${ed.degree} | ${ed.college} (${ed.graduationYear})\n`;
        if (ed.cgpaOrPercentage) text += `CGPA/Percentage: ${ed.cgpaOrPercentage}\n`;
        text += `\n`;
      });
    }

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Font family styles
  const fontClass =
    activeResume.fontFamily === 'serif'
      ? 'font-serif'
      : activeResume.fontFamily === 'mono'
      ? 'font-mono'
      : 'font-sans';

  const sizeClass =
    activeResume.fontSize === 'sm'
      ? 'text-[11px] leading-relaxed'
      : activeResume.fontSize === 'lg'
      ? 'text-sm leading-relaxed'
      : 'text-xs leading-relaxed';

  const spacingClass =
    activeResume.spacing === 'compact'
      ? 'space-y-3'
      : activeResume.spacing === 'spacious'
      ? 'space-y-6'
      : 'space-y-4';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Print stylesheet override for vector print */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          body * {
            visibility: hidden !important;
          }
          #ats-resume-print-area, #ats-resume-print-area * {
            visibility: visible !important;
          }
          #ats-resume-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}} />

      {/* Top Header & Customizer Toolbar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Live ATS Resume Preview
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
              Machine-Readable
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Compliant with major ATS parsers (Workday, Taleo, Greenhouse, Lever). Single-column, no unreadable tables.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePrintPDF}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF (Vector)</span>
          </button>

          <button
            onClick={handleDirectPDF}
            disabled={isExporting}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={handleDownloadDOCX}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Download DOCX</span>
          </button>

          <button
            onClick={handleCopyPlainText}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedText ? 'Copied Plain Text!' : 'Copy Plain Text'}</span>
          </button>
        </div>
      </div>

      {/* Formatting & Template Controls Row */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Template Selector */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-600">Template:</span>
          <div className="flex flex-wrap gap-1">
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setTemplate(tpl.id)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  activeResume.template === tpl.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {tpl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Font Family */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-600">Font:</span>
          <div className="flex gap-1">
            {(['sans', 'serif', 'mono'] as const).map((font) => (
              <button
                key={font}
                onClick={() => setFontFamily(font)}
                className={`px-2.5 py-1 rounded-lg uppercase tracking-wider text-[11px] font-semibold ${
                  activeResume.fontFamily === font
                    ? 'bg-slate-800 text-white'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                {font}
              </button>
            ))}
          </div>
        </div>

        {/* Font Size & Spacing */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-600">Size:</span>
            <div className="flex gap-1">
              {(['sm', 'base', 'lg'] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => setFontSize(sz)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    activeResume.fontSize === sz
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  {sz.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-600">Spacing:</span>
            <div className="flex gap-1">
              {(['compact', 'normal', 'spacious'] as const).map((sp) => (
                <button
                  key={sp}
                  onClick={() => setSpacing(sp)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold capitalize ${
                    activeResume.spacing === sp
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  {sp}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* A4 Paper Preview Container */}
      <div className="flex justify-center overflow-x-auto py-4">
        <div
          id="ats-resume-print-area"
          ref={printAreaRef}
          className={`w-[800px] min-h-[1130px] bg-white text-slate-900 border border-slate-300 shadow-2xl p-12 sm:p-14 ${fontClass} ${sizeClass} ${spacingClass} rounded-sm`}
        >
          {/* Header Section */}
          <div className="border-b pb-4 text-center sm:text-left border-slate-800">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 uppercase">
              {activeResume.personalInfo.fullName || 'Candidate Name'}
            </h1>
            {activeResume.personalInfo.headline && (
              <p className="font-semibold text-slate-700 mt-0.5">
                {activeResume.personalInfo.headline}
              </p>
            )}
            <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-[11px] text-slate-600">
              {activeResume.personalInfo.email && <span>{activeResume.personalInfo.email}</span>}
              {activeResume.personalInfo.phone && <span>• {activeResume.personalInfo.phone}</span>}
              {activeResume.personalInfo.location && <span>• {activeResume.personalInfo.location}</span>}
              {activeResume.personalInfo.linkedin && (
                <span>• <a href={`https://${activeResume.personalInfo.linkedin}`} className="text-blue-700 underline">{activeResume.personalInfo.linkedin}</a></span>
              )}
              {activeResume.personalInfo.github && (
                <span>• <a href={`https://${activeResume.personalInfo.github}`} className="text-blue-700 underline">{activeResume.personalInfo.github}</a></span>
              )}
              {activeResume.personalInfo.portfolio && (
                <span>• <a href={`https://${activeResume.personalInfo.portfolio}`} className="text-blue-700 underline">{activeResume.personalInfo.portfolio}</a></span>
              )}
            </div>
          </div>

          {/* Dynamic Section Ordering */}
          {activeResume.sectionOrder.map((sectionKey) => {
            if (sectionKey === 'summary' && activeResume.summary) {
              return (
                <div key="summary" className="space-y-1.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                    Professional Summary
                  </h2>
                  <p className="leading-relaxed text-slate-800">
                    {activeResume.summary}
                  </p>
                </div>
              );
            }

            if (sectionKey === 'skills' && activeResume.skills.length > 0) {
              return (
                <div key="skills" className="space-y-1.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                    Technical & Professional Skills
                  </h2>
                  <div className="space-y-1">
                    {activeResume.skills.map((cat, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline gap-1">
                        <span className="font-bold text-slate-900 shrink-0 min-w-[170px]">
                          {cat.category}:
                        </span>
                        <span className="text-slate-800">
                          {cat.skills.join(', ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (sectionKey === 'projects' && activeResume.projects.length > 0) {
              return (
                <div key="projects" className="space-y-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                    Technical Projects
                  </h2>
                  <div className="space-y-3">
                    {activeResume.projects.map((proj) => (
                      <div key={proj.id} className="space-y-1">
                        <div className="flex items-baseline justify-between">
                          <span className="font-bold text-slate-900">
                            {proj.name}
                          </span>
                          <span className="text-[11px] font-medium text-slate-600">
                            [{proj.technologies.join(', ')}]
                          </span>
                        </div>
                        <ul className="list-disc pl-4 space-y-0.5 text-slate-800">
                          <li>{proj.description}</li>
                          {proj.contribution && <li>Contribution: {proj.contribution}</li>}
                          {proj.outcome && <li>Outcome: {proj.outcome}</li>}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (sectionKey === 'internships' && activeResume.internships.length > 0) {
              return (
                <div key="internships" className="space-y-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                    Internships & Practical Training
                  </h2>
                  <div className="space-y-2.5">
                    {activeResume.internships.map((it) => (
                      <div key={it.id} className="space-y-1">
                        <div className="flex items-baseline justify-between font-bold text-slate-900">
                          <span>{it.role} — {it.company}</span>
                          <span className="text-[11px] font-normal text-slate-600">{it.duration}</span>
                        </div>
                        <ul className="list-disc pl-4 space-y-0.5 text-slate-800">
                          {it.responsibilities.map((resp, rIdx) => (
                            <li key={rIdx}>{resp}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (sectionKey === 'experience' && activeResume.experience.length > 0) {
              return (
                <div key="experience" className="space-y-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                    Work Experience
                  </h2>
                  <div className="space-y-2.5">
                    {activeResume.experience.map((exp) => (
                      <div key={exp.id} className="space-y-1">
                        <div className="flex items-baseline justify-between font-bold text-slate-900">
                          <span>{exp.role} — {exp.company}</span>
                          <span className="text-[11px] font-normal text-slate-600">{exp.duration}</span>
                        </div>
                        <ul className="list-disc pl-4 space-y-0.5 text-slate-800">
                          {exp.responsibilities.map((resp, rIdx) => (
                            <li key={rIdx}>{resp}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (sectionKey === 'education' && activeResume.education.length > 0) {
              return (
                <div key="education" className="space-y-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                    Education
                  </h2>
                  <div className="space-y-2">
                    {activeResume.education.map((edu) => (
                      <div key={edu.id} className="space-y-0.5">
                        <div className="flex items-baseline justify-between font-bold text-slate-900">
                          <span>{edu.degree}</span>
                          <span className="text-[11px] font-normal text-slate-600">{edu.graduationYear}</span>
                        </div>
                        <div className="flex items-baseline justify-between text-slate-700">
                          <span>{edu.college} {edu.university ? `(${edu.university})` : ''}</span>
                          {edu.cgpaOrPercentage && (
                            <span className="text-[11px] font-medium text-slate-600">
                              CGPA: {edu.cgpaOrPercentage}
                            </span>
                          )}
                        </div>
                        {edu.relevantCoursework && edu.relevantCoursework.length > 0 && (
                          <p className="text-[11px] text-slate-600">
                            Coursework: {edu.relevantCoursework.join(', ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (sectionKey === 'certifications' && activeResume.certifications.length > 0) {
              return (
                <div key="certifications" className="space-y-1.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                    Certifications & Licenses
                  </h2>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-800">
                    {activeResume.certifications.map((c) => (
                      <li key={c.id}>
                        <strong>{c.name}</strong> — {c.issuer} ({c.year})
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }

            if (sectionKey === 'achievements' && activeResume.achievements.length > 0) {
              return (
                <div key="achievements" className="space-y-1.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                    Honors & Achievements
                  </h2>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-800">
                    {activeResume.achievements.map((a) => (
                      <li key={a.id}>
                        <strong>{a.title}</strong>: {a.description} {a.year ? `(${a.year})` : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }

            if (sectionKey === 'languages' && (activeResume.languages.length > 0 || activeResume.interests.length > 0)) {
              return (
                <div key="languages" className="space-y-1">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                    Languages & Interests
                  </h2>
                  {activeResume.languages.length > 0 && (
                    <p className="text-slate-800">
                      <strong>Languages:</strong> {activeResume.languages.map(l => `${l.language} (${l.proficiency})`).join(', ')}
                    </p>
                  )}
                  {activeResume.interests.length > 0 && (
                    <p className="text-slate-800">
                      <strong>Interests:</strong> {activeResume.interests.join(', ')}
                    </p>
                  )}
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
    </div>
  );
};
