"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MessageSquare, Sparkles, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { MentalHealthReportGenerator } from "../../services/MentalHealthReportGenerator";
import localData from '../../../backend/data.json';

export function DashboardOverview() {
  const [username, setUsername] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [healthData, setHealthData] = useState({
    healthreports: {
      mood: 0,
      anxiety: 0,
      sleep: 0,
      energy: 0,
      concentration: 0,
      socialInteraction: 0,
      optimism: 0
    }
  });
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          setUsername('Guest');
          return;
        }

        const response = await fetch('http://localhost:5000/api/user/profile', {
          headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json'
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUsername(data.username || 'User');
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUsername('Guest');
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchHealthData = async () => {
      setIsLoading(true);
      try {
        // Get the latest entry from local data
        const latestEntry = localData[localData.length - 1];
        
        if (latestEntry) {
          // Convert the input values to the format expected by the UI
          const convertedData = {
            healthreports: {
              mood: (latestEntry.input.mood / 10) * 100,
              anxiety: latestEntry.input.anxiety === "none" ? 0 : 
                      latestEntry.input.anxiety === "moderate" ? 50 : 
                      latestEntry.input.anxiety === "severe" ? 100 : 0,
              sleep: (latestEntry.input.sleep_quality / 10) * 100,
              energy: (latestEntry.input.energy_levels / 10) * 100,
              concentration: (latestEntry.input.concentration / 10) * 100,
              socialInteraction: (latestEntry.input.social_interactions / 10) * 100,
              optimism: (latestEntry.input.optimism / 10) * 100
            }
          };

          setHealthData(convertedData);
          localStorage.setItem('healthData', JSON.stringify(convertedData));
        }
      } catch (error) {
        console.error('Error loading local health data:', error);
        const cachedData = localStorage.getItem('healthData');
        if (cachedData) {
          setHealthData(JSON.parse(cachedData));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchHealthData();
  }, []);

  // Add this after fetching data
  console.log('Current health data:', healthData.healthreports);

  const submitQuestionnaireData = async (data: any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch('http://localhost:5000/api/questionnaire/update', {
        method: 'PUT',
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to update questionnaire data');
      }

      const updatedData = await response.json();
      setHealthData({
        healthreports: {
          mood: updatedData.mood/10 * 100 || 0,
          anxiety: updatedData.anxiety/10 * 100 || 0,
          sleep: updatedData.sleep/10 * 100 || 0,
          energy: updatedData.energy/10 * 100 || 0,
          concentration: updatedData.concentration/10 * 100 || 0,
          socialInteraction: updatedData.socialInteraction/10 * 100 || 0,
          optimism: updatedData.optimism/10 * 100 || 0
        }
      });
    } catch (error) {
      console.error('Error updating questionnaire data:', error);
    }
  };

  const handleDailyCheckIn = () => {
    const newData = {
      mood: 75,
      anxiety: 30,
      sleep: 80,
      energy: 65,
      concentration: 70,
      socialInteraction: 60,
      optimism: 85
    };
    submitQuestionnaireData(newData);
  };

  const handleTestSubmit = async () => {
    const testData = {
      healthreports: {
        mood: 75,
        anxiety: 60,
        sleep: 80,
        energy: 70,
        concentration: 65,
        socialInteraction: 55,
        optimism: 85
      }
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/questionnaire/update', {
        method: 'PUT',
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      });

      if (!response.ok) throw new Error('Failed to submit test data');

      const updatedData = await response.json();
      setHealthData({
        healthreports: {
          mood: updatedData.mood/10 * 100 || 0,
          anxiety: updatedData.anxiety/10 * 100 || 0,
          sleep: updatedData.sleep/10 * 100 || 0,
          energy: updatedData.energy/10 * 100 || 0,
          concentration: updatedData.concentration/10 * 100 || 0,
          socialInteraction: updatedData.socialInteraction/10 * 100 || 0,
          optimism: updatedData.optimism/10 * 100 || 0
        }
      });
    } catch (error) {
      console.error('Error submitting test data:', error);
    }
  };

  const submitTestData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch('http://localhost:5000/api/questionnaire/submit', {
        method: 'POST',
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to submit test data');
      }

      const data = await response.json();
      console.log('Submitted test data:', data);
      
      setHealthData({
        healthreports: data.healthreports
      });
    } catch (error) {
      console.error('Error submitting test data:', error);
    }
  };

  const handleDownloadReport = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      // Get the latest entry from local data
      const latestEntry = localData[localData.length - 1];
      if (!latestEntry) {
        throw new Error('No health data found. Please complete a health assessment first.');
      }

      console.log('Using local data:', latestEntry);

      // Transform the data into the expected format
      const mentalHealthData = [{
        input: {
          mood: latestEntry.input.mood,
          anxiety: latestEntry.input.anxiety,
          sleep_quality: latestEntry.input.sleep_quality,
          energy_levels: latestEntry.input.energy_levels,
          concentration: latestEntry.input.concentration,
          social_interactions: latestEntry.input.social_interactions,
          optimism: latestEntry.input.optimism,
          self_care: latestEntry.input.self_care,
          self_harm: latestEntry.input.self_harm,
          intrusive_thoughts: latestEntry.input.intrusive_thoughts,
          physical_symptoms: latestEntry.input.physical_symptoms,
          stress_factors: latestEntry.input.stress_factors,
          coping_strategies: latestEntry.input.coping_strategies,
          discuss_professional: latestEntry.input.discuss_professional,
          social_support: latestEntry.input.social_support
        },
        output: {
          summary: {
            emotions_count: latestEntry.output.summary.emotions_count,
            average_confidence: latestEntry.output.summary.average_confidence,
            average_valence: latestEntry.output.summary.average_valence,
            crisis_count: latestEntry.output.summary.crisis_count,
            risk_factors: latestEntry.output.summary.risk_factors
          },
          disorder_indicators: latestEntry.output.disorder_indicators
        },
        timestamp: new Date().toISOString()
      }];

      // Generate insights from the data
      const insights = [{
        category: 'Mental Health Analysis',
        description: `Analysis based on ${mentalHealthData.length} data points`,
        severity: latestEntry.input.intrusive_thoughts === 'severe' || latestEntry.output.summary.crisis_count > 0 ? 'high' : 'medium',
        recommendations: [
          ...latestEntry.output.summary.risk_factors.map(factor => `Address ${factor.toLowerCase()}`),
          latestEntry.input.self_care === 'extensive' ? 'Maintain current self-care routine' : 'Consider increasing self-care activities',
          latestEntry.input.discuss_professional === 'yes' ? 'Continue professional consultation' : 'Consider professional consultation'
        ]
      }];

      console.log('Generating detailed report...');
      // Generate detailed report
      const detailedReport = MentalHealthReportGenerator.generateDetailedReport(
        mentalHealthData,
        insights,
        {
          patientInfo: {
            name: username !== 'Guest' ? username : undefined,
            dateOfAssessment: new Date().toISOString().split('T')[0],
            assessmentType: 'Routine Check'
          }
        }
      );
      console.log('Generated report:', detailedReport);

      console.log('Generating PDF...');
      // Generate and download PDF
      const pdfBlob = MentalHealthReportGenerator.generatePDF(detailedReport);
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      const date = new Date().toISOString().split('T')[0];
      link.download = `mental-health-report-${date}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      console.log('PDF generated and download initiated');
    } catch (error) {
      console.error('Error generating report:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
      }
      alert(error instanceof Error ? error.message : 'Failed to generate report. Please try again.');
    }
  };

  // Add this before the return statement
  useEffect(() => {
    console.log('Rendered health data:', healthData.healthreports);
  }, [healthData]);

  if (isLoading) {
    return <div>Loading health data...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {username}</h1>
          <p className="text-muted-foreground">
            Here's an overview of your mental health journey
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <CalendarDays className="h-4 w-4" />
            Book Consultation
          </Button>
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={handleDownloadReport}
          >
            <Download className="h-4 w-4" />
            Download Report
          </Button>
          <Button className="gap-2" onClick={handleDailyCheckIn}>
            <Sparkles className="h-4 w-4" />
            Daily Check-in
          </Button>
          <Button className="gap-2" onClick={submitTestData}>
            <Sparkles className="h-4 w-4" />
            Submit Test Data
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Your Wellness Journey</CardTitle>
          <CardDescription>
            You've been making steady progress over the past 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Mood Stability</p>
                <span className="text-sm text-muted-foreground">
                  {healthData.healthreports.mood}%
                </span>
              </div>
              <Progress 
                value={healthData.healthreports.mood} 
                className="h-2" 
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Anxiety Level</p>
                <span className="text-sm text-muted-foreground">
                  {healthData.healthreports.anxiety}%
                </span>
              </div>
              <Progress 
                value={healthData.healthreports.anxiety} 
                className="h-2" 
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Sleep Quality</p>
                <span className="text-sm text-muted-foreground">
                  {healthData.healthreports.sleep}%
                </span>
              </div>
              <Progress 
                value={healthData.healthreports.sleep} 
                className="h-2" 
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Energy Level</p>
                <span className="text-sm text-muted-foreground">
                  {healthData.healthreports.energy}%
                </span>
              </div>
              <Progress 
                value={healthData.healthreports.energy} 
                className="h-2" 
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Concentration</p>
                <span className="text-sm text-muted-foreground">
                  {healthData.healthreports.concentration}%
                </span>
              </div>
              <Progress 
                value={healthData.healthreports.concentration} 
                className="h-2" 
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Social Interaction</p>
                <span className="text-sm text-muted-foreground">
                  {healthData.healthreports.socialInteraction}%
                </span>
              </div>
              <Progress 
                value={healthData.healthreports.socialInteraction} 
                className="h-2" 
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Optimism</p>
                <span className="text-sm text-muted-foreground">
                  {healthData.healthreports.optimism}%
                </span>
              </div>
              <Progress 
                value={healthData.healthreports.optimism} 
                className="h-2" 
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 md:flex-row">
            <Card className="flex-1">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">AI Insight</CardTitle>
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your anxiety patterns show improvement after morning meditation. Consider adding 5 more minutes to your routine.
                </p>
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">Dr. Sarah Johnson</p>
                <p className="text-sm text-muted-foreground">Tomorrow at 2:00 PM</p>
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Community</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  3 new responses to your post in "Anxiety Management" group
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}