"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, FileText, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PdfQuestionnaireProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export function PdfQuestionnaire({ onSubmit, isLoading }: PdfQuestionnaireProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);
  const [userId, setUserId] = useState<string>("");

  // Get user ID on component mount
  useState(() => {
    const storedUserId = localStorage.getItem("mindguard_user_id");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newUserId = crypto.randomUUID();
      localStorage.setItem("mindguard_user_id", newUserId);
      setUserId(newUserId);
    }
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setError("");
    
    if (!selectedFile) {
      return;
    }

    // Validate file type
    if (!selectedFile.type.includes('pdf')) {
      setError("Please upload a PDF file");
      return;
    }

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size should be less than 10MB");
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    const droppedFile = event.dataTransfer.files[0];
    
    if (!droppedFile) {
      return;
    }

    // Validate file type
    if (!droppedFile.type.includes('pdf')) {
      setError("Please upload a PDF file");
      return;
    }

    // Validate file size (max 10MB)
    if (droppedFile.size > 10 * 1024 * 1024) {
      setError("File size should be less than 10MB");
      return;
    }

    setFile(droppedFile);
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleSubmit = async () => {
    if (!file || !userId) return;

    try {
      setAnalyzing(true);
      setError("");
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', userId);

      // Upload file and get analysis
      const response = await fetch('http://localhost:5000/health-tracking/pdf-analysis', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze PDF');
      }

      const result = await response.json();
      onSubmit(result);
      
    } catch (err) {
      console.error('Error analyzing PDF:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze PDF');
    } finally {
      setAnalyzing(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
    setError("");
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center",
            error ? "border-red-500" : "border-muted-foreground/25"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {!file ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <FileText className="h-12 w-12 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-medium">Upload Medical Report</p>
                <p className="text-sm text-muted-foreground">
                  Drag and drop your PDF file here, or click to browse
                </p>
              </div>
              <Input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="pdf-upload"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('pdf-upload')?.click()}
                disabled={isLoading || analyzing}
              >
                <Upload className="mr-2 h-4 w-4" />
                Choose File
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-6 w-6 text-primary" />
                  <span className="font-medium">{file.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={removeFile}
                  disabled={isLoading || analyzing}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <Progress value={uploadProgress} className="w-full" />
              )}
              <Button
                onClick={handleSubmit}
                disabled={isLoading || analyzing}
                className="w-full"
              >
                {analyzing ? "Analyzing..." : "Analyze Report"}
              </Button>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 