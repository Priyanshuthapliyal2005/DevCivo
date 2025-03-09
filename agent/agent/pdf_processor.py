from typing import Dict, Any
import fitz  # PyMuPDF
import google.generativeai as genai
from pathlib import Path
import os
from emotion_report_generator import generate_emotion_report
import json

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract text from a PDF file."""
    try:
        doc = fitz.open(pdf_path)
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    except Exception as e:
        raise Exception(f"Error extracting text from PDF: {str(e)}")
    finally:
        if 'doc' in locals():
            doc.close()

def process_medical_report(text: str) -> Dict[str, Any]:
    """Process medical report text and convert it to questionnaire format using Gemini."""
    
    # Configure Gemini
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    model = genai.GenerativeModel('gemini-1.5-pro')
    
    # Create a prompt for Gemini
    extraction_prompt = f"""You are a mental health professional analyzing a medical report. 
    Extract key information about the patient's mental health state and convert it into structured responses.
    
    Medical Report:
    {text}
    
    Based on the report content, provide responses for the following questions in a JSON format.
    IMPORTANT: Return ONLY the raw JSON object with no markdown formatting or additional text.
    
    {{
        "mood": <number between 1-10>,
        "anxiety": <"none"/"mild"/"moderate"/"severe">,
        "sleep_quality": <number between 1-10>,
        "energy_levels": <number between 1-10>,
        "physical_symptoms": <"none"/"mild"/"moderate"/"severe">,
        "concentration": <number between 1-10>,
        "self_care": <"none"/"minimal"/"moderate"/"extensive">,
        "social_interactions": <number between 1-10>,
        "intrusive_thoughts": <"none"/"mild"/"moderate"/"severe">,
        "optimism": <number between 1-10>,
        "stress_factors": <text description>,
        "coping_strategies": <text description>,
        "social_support": <number between 1-10>,
        "self_harm": <"none"/"passive"/"active"/"severe">,
        "discuss_professional": <text description>
    }}

    Ensure:
    1. All numeric values are between 1-10
    2. Categorical values exactly match the provided options
    3. The response is a valid JSON object
    4. No additional text or formatting is included"""

    try:
        # Get structured responses from Gemini
        response = model.generate_content(extraction_prompt)
        response_text = response.text.strip()
        
        # Remove any potential markdown code block formatting
        if response_text.startswith('```json'):
            response_text = response_text[7:]
        if response_text.startswith('```'):
            response_text = response_text[3:]
        if response_text.endswith('```'):
            response_text = response_text[:-3]
        
        response_text = response_text.strip()
        
        # Parse the JSON response
        try:
            questionnaire_data = json.loads(response_text)
        except json.JSONDecodeError as e:
            raise Exception(f"Invalid JSON response from Gemini: {str(e)}\nResponse: {response_text}")
        
        # Validate the response format
        required_fields = [
            "mood", "anxiety", "sleep_quality", "energy_levels", "physical_symptoms",
            "concentration", "self_care", "social_interactions", "intrusive_thoughts",
            "optimism", "stress_factors", "coping_strategies", "social_support",
            "self_harm", "discuss_professional"
        ]
        
        missing_fields = [field for field in required_fields if field not in questionnaire_data]
        if missing_fields:
            raise Exception(f"Missing required fields in Gemini response: {', '.join(missing_fields)}")
        
        # Generate emotion report using the existing function
        responses = [
            str(questionnaire_data["mood"]),
            questionnaire_data["anxiety"],
            str(questionnaire_data["sleep_quality"]),
            str(questionnaire_data["energy_levels"]),
            questionnaire_data["physical_symptoms"],
            str(questionnaire_data["concentration"]),
            questionnaire_data["self_care"],
            str(questionnaire_data["social_interactions"]),
            questionnaire_data["intrusive_thoughts"],
            str(questionnaire_data["optimism"]),
            questionnaire_data["stress_factors"],
            questionnaire_data["coping_strategies"],
            str(questionnaire_data["social_support"]),
            questionnaire_data["self_harm"],
            questionnaire_data["discuss_professional"]
        ]
        
        report = generate_emotion_report(responses)
        
        return {
            "questionnaire_data": questionnaire_data,
            "emotion_report": report
        }
        
    except Exception as e:
        raise Exception(f"Error processing medical report: {str(e)}")

async def analyze_pdf(pdf_path: str) -> Dict[str, Any]:
    """Main function to analyze a PDF medical report."""
    try:
        # Extract text from PDF
        text = extract_text_from_pdf(pdf_path)
        
        # Process the medical report
        result = process_medical_report(text)
        
        # Print the JSON result so it can be captured by Node.js
        print(json.dumps(result))
        return result
        
    except Exception as e:
        # Print error in JSON format so it can be parsed by Node.js
        error_json = {"error": str(e)}
        print(json.dumps(error_json))
        raise Exception(f"Error analyzing PDF: {str(e)}")

if __name__ == "__main__":
    # If run directly, process the PDF file provided as argument
    import sys
    if len(sys.argv) > 1:
        pdf_path = sys.argv[1]
        try:
            import asyncio
            result = asyncio.run(analyze_pdf(pdf_path))
            sys.exit(0)
        except Exception as e:
            sys.exit(1) 