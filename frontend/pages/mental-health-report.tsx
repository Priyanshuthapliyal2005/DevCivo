import React, { useEffect, useState } from 'react';
import { DetailedMentalHealthReportView } from '../components/reports/DetailedMentalHealthReport';
import { MentalHealthReportGenerator, DetailedMentalHealthReport } from '../services/MentalHealthReportGenerator';
import { MentalHealthData } from '../services/MentalHealthReportService';
import { ReportService, ReportInsight } from '../services/ReportService';

export default function MentalHealthReportPage() {
  const [report, setReport] = useState<DetailedMentalHealthReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch mental health data and insights
        const response = await fetch('/api/health-tracking/latest');
        if (!response.ok) {
          throw new Error('Failed to fetch health data');
        }

        const data = await response.json();
        const mentalHealthData: MentalHealthData[] = data.entries;
        const insights: ReportInsight[] = data.insights;

        // Generate detailed report
        const detailedReport = MentalHealthReportGenerator.generateDetailedReport(
          mentalHealthData,
          insights
        );

        setReport(detailedReport);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">Generating your mental health report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">
          Please complete a mental health assessment to view your report.
        </p>
      </div>
    );
  }

  return <DetailedMentalHealthReportView report={report} />;
} 