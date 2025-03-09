import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useState, useEffect } from 'react';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  }
});

const ReportDocument = ({ data, analysis }) => (
  <Document style={styles.document}>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Mental Health Assessment Report</Text>
      
      <View style={styles.section}>
        <Text style={styles.text}>Patient ID: {data[0].input.user_id}</Text>
        <Text style={styles.text}>Report Date: {new Date().toLocaleDateString()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>Key Findings:</Text>
        <Text style={styles.text}>Average Mood: {analysis.averageMood}</Text>
        <Text style={styles.text}>Risk Level: {analysis.riskLevel}</Text>
        <Text style={styles.text}>Common Symptoms: {analysis.commonSymptoms.join(', ')}</Text>
      </View>
    </Page>
  </Document>
);

const Report = ({ data }) => {
  const [reports, setReports] = useState([]);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    // Analyze the data
    const analyzedData = analyzeData(data);
    setAnalysis(analyzedData);
    
    // Load previous reports
    loadPreviousReports();
  }, [data]);

  const analyzeData = (data) => {
    // Calculate averages and trends
    const averageMood = data.reduce((acc, entry) => acc + entry.input.mood, 0) / data.length;
    
    // Determine risk level
    const riskLevel = calculateRiskLevel(data);
    
    // Find common symptoms
    const commonSymptoms = findCommonSymptoms(data);

    return {
      averageMood,
      riskLevel,
      commonSymptoms,
      timestamps: data.map(entry => entry.input.timestamp)
    };
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Patient Reports</h2>
      
      {/* Current Report */}
      <div className="mb-8">
        <h3 className="text-xl mb-4">Current Report</h3>
        {analysis && (
          <PDFDownloadLink 
            document={<ReportDocument data={data} analysis={analysis} />}
            fileName="mental-health-report.pdf"
          >
            {({ loading }) => 
              loading ? 'Generating report...' : 'Download Report'
            }
          </PDFDownloadLink>
        )}
      </div>

      {/* Visualizations */}
      <div className="mb-8">
        <h3 className="text-xl mb-4">Trends</h3>
        <LineChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="input.timestamp" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="input.mood" stroke="#8884d8" />
          <Line type="monotone" dataKey="input.anxiety" stroke="#82ca9d" />
        </LineChart>
      </div>

      {/* Previous Reports */}
      <div>
        <h3 className="text-xl mb-4">Previous Reports</h3>
        <div className="grid gap-4">
          {reports.map((report, index) => (
            <div key={index} className="p-4 border rounded">
              <p>Report Date: {report.date}</p>
              <button className="text-blue-500">Download</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Report; 