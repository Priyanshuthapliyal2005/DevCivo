import { Report, ReportInsight } from './ReportService';
import { MentalHealthData } from './MentalHealthReportService';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface DetailedMentalHealthReport {
  patientInfo: {
    name?: string;
    dateOfBirth?: string;
    dateOfAssessment: string;
    assessmentType: 'Routine Check' | 'Initial Assessment' | 'Follow-up';
  };
  aiSummary: string;
  metrics: {
    moodStability: number;
    anxietyLevel: number;
    sleepQuality: number;
    energyLevel: number;
    concentration: number;
    socialInteraction: number;
    optimism: number;
  };
  aiInterpretations: {
    moodStability: string;
    anxietyLevel: string;
    sleepQuality: string;
    energyLevel: string;
    concentration: string;
    socialInteraction: string;
    optimism: string;
  };
  patterns: {
    stressTriggers: string[];
    sleepIssues: string[];
    energyAndMood: string[];
  };
  recommendations: {
    cognitiveWellbeing: string[];
    sleepImprovement: string[];
    energyBoost: string[];
    socialEngagement: string[];
  };
  nextSteps: {
    followUpDate: string;
    aiConfidenceLevel: 'High' | 'Moderate' | 'Low';
    consultationNeeded: boolean;
  };
  verification: {
    aiModel: string;
    requiresHumanReview: boolean;
  };
}

export class MentalHealthReportGenerator {
  static generateDetailedReport(
    data: MentalHealthData[],
    insights: ReportInsight[],
    options?: {
      patientInfo?: {
        name?: string;
        dateOfBirth?: string;
        dateOfAssessment: string;
        assessmentType: 'Routine Check' | 'Initial Assessment' | 'Follow-up';
      }
    }
  ): DetailedMentalHealthReport {
    const latestData = data[data.length - 1];
    const today = new Date().toISOString().split('T')[0];

    // Generate AI summary based on insights and data
    const aiSummary = this.generateAISummary(latestData, insights);

    // Calculate metrics
    const metrics = this.calculateMetrics(latestData);

    // Generate interpretations
    const interpretations = this.generateInterpretations(metrics, latestData);

    // Analyze patterns
    const patterns = this.analyzePatterns(data, insights);

    // Generate recommendations
    const recommendations = this.generateRecommendations(latestData, insights);

    return {
      patientInfo: {
        name: options?.patientInfo?.name,
        dateOfBirth: options?.patientInfo?.dateOfBirth,
        dateOfAssessment: options?.patientInfo?.dateOfAssessment || today,
        assessmentType: options?.patientInfo?.assessmentType || 'Routine Check'
      },
      aiSummary,
      metrics,
      aiInterpretations: interpretations,
      patterns,
      recommendations,
      nextSteps: {
        followUpDate: this.calculateFollowUpDate(options?.patientInfo?.dateOfAssessment || today),
        aiConfidenceLevel: this.determineAIConfidence(latestData),
        consultationNeeded: this.assessConsultationNeed(latestData, insights)
      },
      verification: {
        aiModel: 'MindGuard Analysis v1.0',
        requiresHumanReview: this.determineIfHumanReviewNeeded(latestData, insights)
      }
    };
  }

  private static generateAISummary(
    data: MentalHealthData,
    insights: ReportInsight[]
  ): string {
    const moodState = data.input.mood >= 7 ? 'stable' : 'fluctuating';
    const anxietyState = data.input.anxiety === 'none' ? 'minimal' : 'present';
    const sleepState = data.input.sleep_quality >= 7 ? 'adequate' : 'disturbed';

    return `The AI assessment indicates ${moodState} mood with ${anxietyState} anxiety and ${sleepState} sleep patterns. ${
      data.input.energy_levels < 5 ? 'Energy levels and concentration are below optimal, ' : 'Energy levels are maintaining, '
    }suggesting ${this.getLifestyleImpactSummary(data)}.`;
  }

  private static calculateMetrics(data: MentalHealthData): DetailedMentalHealthReport['metrics'] {
    return {
      moodStability: data.input.mood * 10,
      anxietyLevel: this.convertAnxietyToScore(data.input.anxiety),
      sleepQuality: data.input.sleep_quality * 10,
      energyLevel: data.input.energy_levels * 10,
      concentration: data.input.concentration * 10,
      socialInteraction: data.input.social_interactions * 10,
      optimism: data.input.optimism * 10
    };
  }

  private static generateInterpretations(
    metrics: DetailedMentalHealthReport['metrics'],
    data: MentalHealthData
  ): DetailedMentalHealthReport['aiInterpretations'] {
    return {
      moodStability: `Generally ${metrics.moodStability >= 70 ? 'stable' : 'fluctuating'} with ${
        metrics.moodStability >= 70 ? 'minor' : 'notable'
      } fluctuations`,
      anxietyLevel: `${data.input.anxiety} anxiety detected`,
      sleepQuality: `${metrics.sleepQuality >= 70 ? 'Normal' : 'Disturbed'} sleep patterns`,
      energyLevel: `${metrics.energyLevel >= 70 ? 'Optimal' : 'Low'} energy; ${
        metrics.energyLevel < 50 ? 'possible fatigue detected' : 'maintaining normal levels'
      }`,
      concentration: `${metrics.concentration >= 70 ? 'Good' : 'Slight difficulty in'} focus`,
      socialInteraction: `${metrics.socialInteraction >= 70 ? 'Active' : 'Moderate'} engagement in social activities`,
      optimism: `${metrics.optimism >= 70 ? 'Positive' : 'Reserved'} outlook overall`
    };
  }

  private static analyzePatterns(
    data: MentalHealthData[],
    insights: ReportInsight[]
  ): DetailedMentalHealthReport['patterns'] {
    const latestData = data[data.length - 1];
    
    return {
      stressTriggers: [
        `Workload ${this.analyzeStressLevel(latestData)} in the past week`,
        ...this.extractStressTriggers(latestData)
      ],
      sleepIssues: this.analyzeSleepIssues(latestData),
      energyAndMood: this.analyzeEnergyMoodPatterns(latestData)
    };
  }

  private static generateRecommendations(
    data: MentalHealthData,
    insights: ReportInsight[]
  ): DetailedMentalHealthReport['recommendations'] {
    return {
      cognitiveWellbeing: this.getCognitiveRecommendations(data),
      sleepImprovement: this.getSleepRecommendations(data),
      energyBoost: this.getEnergyRecommendations(data),
      socialEngagement: this.getSocialRecommendations(data)
    };
  }

  // Helper methods
  private static convertAnxietyToScore(anxiety: string): number {
    const anxietyScores = {
      'none': 10,
      'mild': 70,
      'moderate': 40,
      'severe': 20
    };
    return anxietyScores[anxiety as keyof typeof anxietyScores] || 50;
  }

  private static getLifestyleImpactSummary(data: MentalHealthData): string {
    if (data.input.energy_levels < 5 && data.input.concentration < 5) {
      return 'possible fatigue or work-life imbalance';
    }
    return 'generally maintained daily functioning';
  }

  private static calculateFollowUpDate(currentDate: string): string {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + 14); // Default to 2 weeks follow-up
    return date.toISOString().split('T')[0];
  }

  private static determineAIConfidence(data: MentalHealthData): 'High' | 'Moderate' | 'Low' {
    const hasCompleteData = Object.values(data.input).every(val => val !== undefined && val !== null);
    const hasConsistentPatterns = data.output.summary.average_confidence > 0.7;
    
    if (hasCompleteData && hasConsistentPatterns) return 'High';
    if (hasCompleteData || hasConsistentPatterns) return 'Moderate';
    return 'Low';
  }

  private static assessConsultationNeed(
    data: MentalHealthData,
    insights: ReportInsight[]
  ): boolean {
    return (
      data.output.crisis_count > 0 ||
      data.input.anxiety === 'severe' ||
      data.input.mood < 4 ||
      insights.some(insight => insight.severity === 'high')
    );
  }

  private static determineIfHumanReviewNeeded(
    data: MentalHealthData,
    insights: ReportInsight[]
  ): boolean {
    return (
      data.output.crisis_count > 0 ||
      data.input.self_harm !== 'none' ||
      insights.some(insight => insight.severity === 'high')
    );
  }

  private static analyzeStressLevel(data: MentalHealthData): string {
    return data.input.mood < 5 ? 'increase' : 'stable';
  }

  private static extractStressTriggers(data: MentalHealthData): string[] {
    const triggers = [];
    if (data.input.sleep_quality < 5) {
      triggers.push('Possible late-night screen time affecting sleep cycle');
    }
    if (data.input.energy_levels < 5) {
      triggers.push('Inconsistent eating habits');
    }
    return triggers;
  }

  private static analyzeSleepIssues(data: MentalHealthData): string[] {
    const issues = [];
    if (data.input.sleep_quality < 7) {
      issues.push('Irregular sleep schedule detected');
      if (data.input.anxiety !== 'none') {
        issues.push('Anxiety may be affecting sleep quality');
      }
    }
    return issues;
  }

  private static analyzeEnergyMoodPatterns(data: MentalHealthData): string[] {
    const patterns = [];
    if (data.input.energy_levels < 5 && data.input.mood < 5) {
      patterns.push('Low energy correlating with decreased mood');
    }
    if (data.input.concentration < 5) {
      patterns.push('Reduced concentration affecting daily performance');
    }
    return patterns;
  }

  private static getCognitiveRecommendations(data: MentalHealthData): string[] {
    const recommendations = ['Try mindfulness exercises or journaling for stress management'];
    if (data.input.anxiety !== 'none') {
      recommendations.push('Practice deep breathing exercises during anxious moments');
    }
    if (data.input.concentration < 5) {
      recommendations.push('Use the Pomodoro Technique for better focus');
    }
    return recommendations;
  }

  private static getSleepRecommendations(data: MentalHealthData): string[] {
    const recommendations = ['Avoid screen time 1 hour before sleep'];
    if (data.input.sleep_quality < 5) {
      recommendations.push('Maintain a fixed sleep schedule');
      recommendations.push('Create a calming bedtime routine');
    }
    return recommendations;
  }

  private static getEnergyRecommendations(data: MentalHealthData): string[] {
    const recommendations = ['Incorporate short breaks during work hours'];
    if (data.input.energy_levels < 5) {
      recommendations.push('Maintain regular meal times');
      recommendations.push('Consider light exercise during break times');
    }
    return recommendations;
  }

  private static getSocialRecommendations(data: MentalHealthData): string[] {
    const recommendations = ['Plan interactive activities to improve mood'];
    if (data.input.social_interactions < 5) {
      recommendations.push('Schedule regular check-ins with friends or family');
      recommendations.push('Join group activities aligned with your interests');
    }
    return recommendations;
  }

  static generatePDF(report: DetailedMentalHealthReport): Blob {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Title
    doc.setFontSize(24);
    doc.text('Mental Health Report', pageWidth / 2, 20, { align: 'center' });
    
    // Patient Information
    doc.setFontSize(16);
    doc.text('Patient Information', 20, 40);
    
    const patientInfo = [
      ['Patient Name:', report.patientInfo.name || '[Full Name]'],
      ['Date of Birth:', report.patientInfo.dateOfBirth || '[DD/MM/YYYY]'],
      ['Date of Assessment:', report.patientInfo.dateOfAssessment],
      ['Assessment Type:', report.patientInfo.assessmentType]
    ];
    
    autoTable(doc, {
      startY: 45,
      head: [],
      body: patientInfo,
      theme: 'plain',
      styles: { fontSize: 12 }
    });
    
    // AI Summary
    doc.setFontSize(16);
    doc.text('AI Summary & Insights', 20, doc.lastAutoTable.finalY + 20);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    const summaryLines = doc.splitTextToSize(report.aiSummary, pageWidth - 40);
    doc.text(summaryLines, 20, doc.lastAutoTable.finalY + 30);
    doc.setFont('helvetica', 'normal');
    
    // Mental Health Metrics
    doc.setFontSize(16);
    doc.text('Mental Health Metrics (AI Analysis)', 20, doc.lastAutoTable.finalY + 50);
    
    const metricsData = Object.entries(report.metrics).map(([key, value]) => [
      key.replace(/([A-Z])/g, ' $1').trim(),
      `${value}%`,
      report.aiInterpretations[key as keyof typeof report.aiInterpretations]
    ]);
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 55,
      head: [['Category', 'Score (%)', 'AI Interpretation']],
      body: metricsData,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [100, 100, 100] }
    });
    
    // AI-Detected Patterns
    doc.addPage();
    doc.setFontSize(16);
    doc.text('AI-Detected Patterns & Possible Causes', 20, 20);
    
    let yPos = 35;
    
    // Stress Triggers
    doc.setFontSize(12);
    doc.text('✓ Stress Triggers:', 20, yPos);
    report.patterns.stressTriggers.forEach(trigger => {
      yPos += 10;
      doc.text('• ' + trigger, 30, yPos);
    });
    
    // Sleep Issues
    yPos += 20;
    doc.text('✓ Sleep Issues:', 20, yPos);
    report.patterns.sleepIssues.forEach(issue => {
      yPos += 10;
      doc.text('• ' + issue, 30, yPos);
    });
    
    // Energy & Mood
    yPos += 20;
    doc.text('✓ Energy & Mood:', 20, yPos);
    report.patterns.energyAndMood.forEach(pattern => {
      yPos += 10;
      doc.text('• ' + pattern, 30, yPos);
    });
    
    // Recommendations
    yPos += 30;
    doc.setFontSize(16);
    doc.text('Recommended Actions (AI Suggestions)', 20, yPos);
    
    const addRecommendations = (title: string, recs: string[], startY: number) => {
      doc.setFontSize(12);
      doc.text('💡 ' + title + ':', 20, startY);
      recs.forEach((rec, index) => {
        doc.text('• ' + rec, 30, startY + (index + 1) * 10);
      });
      return startY + (recs.length + 1) * 10;
    };
    
    yPos = addRecommendations('Cognitive Well-being', report.recommendations.cognitiveWellbeing, yPos + 15);
    yPos = addRecommendations('Sleep Improvement', report.recommendations.sleepImprovement, yPos + 10);
    yPos = addRecommendations('Energy Boost', report.recommendations.energyBoost, yPos + 10);
    yPos = addRecommendations('Social Engagement', report.recommendations.socialEngagement, yPos + 10);
    
    // Next Steps & Follow-Up
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Next Steps & Follow-Up', 20, 20);
    
    const nextStepsData = [
      ['📅 Suggested Follow-Up Date:', report.nextSteps.followUpDate],
      ['🔍 AI Confidence Level:', report.nextSteps.aiConfidenceLevel],
      ['⚕ Consultation Needed?:', report.nextSteps.consultationNeeded ? 'Yes' : 'No']
    ];
    
    autoTable(doc, {
      startY: 30,
      head: [],
      body: nextStepsData,
      theme: 'plain',
      styles: { fontSize: 12 }
    });
    
    // Verification
    doc.setFontSize(16);
    doc.text('Clinician / AI Verification', 20, doc.lastAutoTable.finalY + 20);
    
    const verificationData = [
      ['📌 Verified by AI Model:', report.verification.aiModel],
      ['📌 Human Review:', report.verification.requiresHumanReview ? 'Required' : 'Not Required']
    ];
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 25,
      head: [],
      body: verificationData,
      theme: 'plain',
      styles: { fontSize: 12 }
    });
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(10);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }
    
    return doc.output('blob');
  }
} 