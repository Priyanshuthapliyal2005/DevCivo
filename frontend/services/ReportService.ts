import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface Report {
  id: string;
  title: string;
  createdAt: Date;
  data: any;
  insights: ReportInsight[];
}

export interface ReportInsight {
  category: string;
  description: string;
  severity?: 'low' | 'medium' | 'high';
  recommendations?: string[];
}

export class ReportService {
  static analyzeData(jsonData: any): ReportInsight[] {
    const insights: ReportInsight[] = [];
    
    // Analyze data structure
    const dataStructure = this.analyzeStructure(jsonData);
    insights.push(dataStructure);
    
    // Analyze emotional content if present
    if (jsonData.emotions || jsonData.sentiment) {
      const emotionalInsights = this.analyzeEmotionalContent(jsonData);
      insights.push(emotionalInsights);
    }
    
    // Add more analysis as needed
    
    return insights;
  }

  static generatePDF(report: Report): Blob {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text(report.title, 20, 20);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${report.createdAt.toLocaleString()}`, 20, 30);
    
    // Add insights
    doc.setFontSize(16);
    doc.text('Key Insights:', 20, 45);
    
    const insightRows = report.insights.map(insight => [
      insight.category,
      insight.description,
      insight.severity || 'N/A'
    ]);
    
    autoTable(doc, {
      startY: 50,
      head: [['Category', 'Description', 'Severity']],
      body: insightRows,
    });
    
    // Add raw data section
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Raw Data:', 20, 20);
    doc.setFontSize(10);
    doc.text(JSON.stringify(report.data, null, 2), 20, 30);
    
    return doc.output('blob');
  }

  private static analyzeStructure(data: any): ReportInsight {
    const depth = this.getObjectDepth(data);
    const keys = Object.keys(data).length;
    
    return {
      category: 'Data Structure',
      description: `Object contains ${keys} root keys with a maximum depth of ${depth} levels.`,
      severity: depth > 5 ? 'high' : depth > 3 ? 'medium' : 'low',
      recommendations: [
        depth > 5 ? 'Consider flattening data structure' : '',
        keys > 20 ? 'Consider grouping related data' : '',
      ].filter(r => r)
    };
  }

  private static getObjectDepth(obj: any): number {
    if (typeof obj !== 'object' || obj === null) return 0;
    return 1 + Math.max(...Object.values(obj).map(v => this.getObjectDepth(v)));
  }

  private static analyzeEmotionalContent(data: any): ReportInsight {
    // Add emotion-specific analysis logic
    return {
      category: 'Emotional Content',
      description: 'Analysis of emotional patterns in data',
      severity: 'medium',
      recommendations: []
    };
  }
} 