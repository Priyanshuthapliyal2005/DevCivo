interface MentalHealthData {
  input: {
    user_id: string;
    mood: number;
    anxiety: string;
    sleep_quality: number;
    // ... other input fields
  };
  output: {
    summary: {
      emotions_count: Record<string, number>;
      average_confidence: number;
      average_valence: number;
      crisis_count: number;
      risk_factors: string[];
    };
    disorder_indicators: string[];
  };
}

class MentalHealthReportService {
  static analyzeData(data: MentalHealthData[]): ReportInsight[] {
    const insights: ReportInsight[] = [];
    
    // User Trends Analysis
    const userTrends = this.analyzeUserTrends(data);
    insights.push(userTrends);
    
    // Emotional State Analysis
    const emotionalState = this.analyzeEmotionalState(data);
    insights.push(emotionalState);
    
    // Risk Assessment
    const riskAssessment = this.analyzeRiskFactors(data);
    insights.push(riskAssessment);
    
    return insights;
  }

  private static analyzeUserTrends(data: MentalHealthData[]): ReportInsight {
    const latestEntries = data.slice(-5); // Look at last 5 entries
    const moodTrend = latestEntries.map(entry => entry.input.mood);
    const avgMood = moodTrend.reduce((a, b) => a + b, 0) / moodTrend.length;
    
    return {
      category: 'User Trends',
      description: `Average mood over last ${latestEntries.length} entries: ${avgMood.toFixed(1)}/10`,
      severity: avgMood < 4 ? 'high' : avgMood < 7 ? 'medium' : 'low',
      recommendations: this.getMoodRecommendations(avgMood)
    };
  }

  private static getMoodRecommendations(avgMood: number): string[] {
    if (avgMood < 4) {
      return [
        'Consider immediate professional consultation',
        'Implement daily mood tracking',
        'Establish regular check-ins with support system'
      ];
    }
    // ... other recommendation logic
    return [];
  }

  private static analyzeEmotionalState(data: MentalHealthData[]): ReportInsight {
    const latestEntry = data[data.length - 1];
    const emotions = latestEntry.output.summary.emotions_count;
    
    return {
      category: 'Emotional State',
      description: `Primary emotions: ${Object.entries(emotions)
        .map(([emotion, count]) => `${emotion} (${count}x)`)
        .join(', ')}`,
      severity: latestEntry.output.crisis_count > 0 ? 'high' : 'low',
      recommendations: []
    };
  }

  private static analyzeRiskFactors(data: MentalHealthData[]): ReportInsight {
    const latestEntry = data[data.length - 1];
    
    return {
      category: 'Risk Assessment',
      description: `Identified ${latestEntry.output.summary.risk_factors.length} risk factors: ${latestEntry.output.summary.risk_factors.join(', ')}`,
      severity: latestEntry.output.summary.crisis_count > 2 ? 'high' : 'medium',
      recommendations: this.getRiskRecommendations(latestEntry)
    };
  }

  private static getRiskRecommendations(entry: MentalHealthData): string[] {
    const recommendations = [];
    if (entry.output.summary.crisis_count > 0) {
      recommendations.push('Immediate professional intervention recommended');
    }
    if (entry.output.disorder_indicators.length > 0) {
      recommendations.push('Schedule consultation for detailed assessment');
    }
    return recommendations;
  }
} 