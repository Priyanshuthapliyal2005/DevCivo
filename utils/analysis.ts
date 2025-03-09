export const calculateRiskLevel = (data) => {
  const latestEntry = data[data.length - 1];
  const riskFactors = latestEntry.output.summary.risk_factors;
  
  if (riskFactors.length > 5) return 'High';
  if (riskFactors.length > 2) return 'Medium';
  return 'Low';
};

export const findCommonSymptoms = (data) => {
  const symptoms = data.reduce((acc, entry) => {
    entry.output.summary.risk_factors.forEach(factor => {
      acc[factor] = (acc[factor] || 0) + 1;
    });
    return acc;
  }, {});

  return Object.entries(symptoms)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([symptom]) => symptom);
}; 