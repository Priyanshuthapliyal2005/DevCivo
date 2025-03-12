import React from 'react';
import { DetailedMentalHealthReport, MentalHealthReportGenerator } from '../../services/MentalHealthReportGenerator';

interface DetailedMentalHealthReportProps {
  report: DetailedMentalHealthReport;
}

export function DetailedMentalHealthReportView({ report }: DetailedMentalHealthReportProps) {
  const handleDownload = () => {
    try {
      const pdfBlob = MentalHealthReportGenerator.generatePDF(report);
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mental-health-report-${report.patientInfo.dateOfAssessment}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mental Health Report</h1>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Download PDF Report
        </button>
      </div>

      {/* Patient Information */}
      <section className="border-b pb-6">
        <h2 className="text-2xl font-semibold mb-4">Patient Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Patient Name:</p>
            <p>{report.patientInfo.name || '[Full Name]'}</p>
          </div>
          <div>
            <p className="text-gray-600">Date of Birth:</p>
            <p>{report.patientInfo.dateOfBirth || '[DD/MM/YYYY]'}</p>
          </div>
          <div>
            <p className="text-gray-600">Date of Assessment:</p>
            <p>{report.patientInfo.dateOfAssessment}</p>
          </div>
          <div>
            <p className="text-gray-600">Assessment Type:</p>
            <p>{report.patientInfo.assessmentType}</p>
          </div>
        </div>
      </section>

      {/* AI Summary & Insights */}
      <section className="border-b pb-6">
        <h2 className="text-2xl font-semibold mb-4">AI Summary & Insights</h2>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="italic text-gray-700">{report.aiSummary}</p>
        </div>
      </section>

      {/* Mental Health Metrics */}
      <section className="border-b pb-6">
        <h2 className="text-2xl font-semibold mb-4">Mental Health Metrics (AI Analysis)</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Score (%)</th>
                <th className="px-4 py-2 text-left">AI Interpretation</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(report.metrics).map(([key, value], index) => (
                <tr key={key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2 font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}</td>
                  <td className="px-4 py-2">{value}%</td>
                  <td className="px-4 py-2">{report.aiInterpretations[key as keyof typeof report.aiInterpretations]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* AI-Detected Patterns & Possible Causes */}
      <section className="border-b pb-6">
        <h2 className="text-2xl font-semibold mb-4">AI-Detected Patterns & Possible Causes</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">✅ Stress Triggers:</h3>
            <ul className="list-disc pl-6">
              {report.patterns.stressTriggers.map((trigger, index) => (
                <li key={index}>{trigger}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">✅ Sleep Issues:</h3>
            <ul className="list-disc pl-6">
              {report.patterns.sleepIssues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">✅ Energy & Mood:</h3>
            <ul className="list-disc pl-6">
              {report.patterns.energyAndMood.map((pattern, index) => (
                <li key={index}>{pattern}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Recommended Actions */}
      <section className="border-b pb-6">
        <h2 className="text-2xl font-semibold mb-4">Recommended Actions (AI Suggestions)</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">💡 Cognitive Well-being:</h3>
            <ul className="list-disc pl-6">
              {report.recommendations.cognitiveWellbeing.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">💡 Sleep Improvement:</h3>
            <ul className="list-disc pl-6">
              {report.recommendations.sleepImprovement.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">💡 Energy Boost:</h3>
            <ul className="list-disc pl-6">
              {report.recommendations.energyBoost.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">💡 Social Engagement:</h3>
            <ul className="list-disc pl-6">
              {report.recommendations.socialEngagement.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-4 italic">
          (All recommendations are AI-generated and should not replace professional consultation.)
        </p>
      </section>

      {/* Next Steps & Follow-Up */}
      <section className="border-b pb-6">
        <h2 className="text-2xl font-semibold mb-4">Next Steps & Follow-Up</h2>
        <div className="space-y-3">
          <div>
            <span className="font-medium">📅 Suggested Follow-Up Date: </span>
            <span>{report.nextSteps.followUpDate}</span>
          </div>
          <div>
            <span className="font-medium">🔍 AI Confidence Level: </span>
            <span>{report.nextSteps.aiConfidenceLevel}</span>
          </div>
          <div>
            <span className="font-medium">⚕ Consultation Needed? </span>
            <span>{report.nextSteps.consultationNeeded ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </section>

      {/* Verification */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Clinician / AI Verification</h2>
        <div className="space-y-3">
          <div>
            <span className="font-medium">📌 Verified by AI Model: </span>
            <span>{report.verification.aiModel}</span>
          </div>
          <div>
            <span className="font-medium">📌 Human Review: </span>
            <span>{report.verification.requiresHumanReview ? 'Required' : 'Not Required'}</span>
          </div>
        </div>
      </section>
    </div>
  );
} 