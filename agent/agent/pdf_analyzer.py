import sys
import json
import fitz  # PyMuPDF
from typing import Dict, Any
import os
from llama_cpp import Llama

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

def analyze_medical_report(text: str, llm: Llama) -> Dict[str, Any]:
    """Analyze medical report text using LLM."""
    
    # Prompt for the LLM to analyze the medical report
    prompt = f"""You are a mental health professional analyzing a medical report. Based on the following report text, extract relevant information about the patient's mental health state and provide structured data according to our questionnaire format.

Report Text:
{text}

Please analyze the text and provide a JSON response with the following structure:
{{
    "questionnaire_data": {{
        "mood": <number 1-10>,
        "anxiety": <"none"|"mild"|"moderate"|"severe">,
        "sleep_quality": <number 1-10>,
        "energy_levels": <number 1-10>,
        "physical_symptoms": <"none"|"mild"|"moderate"|"severe">,
        "concentration": <number 1-10>,
        "self_care": <"none"|"minimal"|"moderate"|"extensive">,
        "social_interactions": <number 1-10>,
        "intrusive_thoughts": <"none"|"mild"|"moderate"|"severe">,
        "optimism": <number 1-10>,
        "stress_factors": <string describing main stressors>,
        "coping_strategies": <string describing coping methods>,
        "social_support": <number 1-10>,
        "self_harm": <"none"|"passive"|"active"|"severe">,
        "discuss_professional": <string about professional discussion needs>
    }},
    "emotion_report": {{
        "summary": {{
            "emotions_count": {{"neutral": 1}},
            "average_confidence": <number 0-1>,
            "average_valence": <number 0-1>,
            "crisis_count": <number>,
            "risk_factors": []
        }},
        "disorder_indicators": []
    }}
}}

Ensure all numeric values are within their specified ranges and categorical values match the exact options given. Make educated guesses based on the context if specific values aren't directly stated, but maintain clinical accuracy."""

    # Get response from LLM
    response = llm(
        prompt,
        max_tokens=2000,
        temperature=0.2,
        stop=["```"],
        echo=False
    )

    try:
        # Extract the JSON part from the response
        response_text = response["choices"][0]["text"]
        # Find the start and end of the JSON object
        start = response_text.find("{")
        end = response_text.rfind("}") + 1
        json_str = response_text[start:end]
        
        # Parse the JSON response
        analysis = json.loads(json_str)
        
        # Validate the response structure
        required_fields = {
            "questionnaire_data": [
                "mood", "anxiety", "sleep_quality", "energy_levels",
                "physical_symptoms", "concentration", "self_care",
                "social_interactions", "intrusive_thoughts", "optimism",
                "stress_factors", "coping_strategies", "social_support",
                "self_harm", "discuss_professional"
            ],
            "emotion_report": {
                "summary": [
                    "emotions_count", "average_confidence",
                    "average_valence", "crisis_count", "risk_factors"
                ],
                "disorder_indicators": []
            }
        }

        # Validate questionnaire_data
        for field in required_fields["questionnaire_data"]:
            if field not in analysis["questionnaire_data"]:
                raise ValueError(f"Missing required field: questionnaire_data.{field}")

        # Validate emotion_report
        for field in required_fields["emotion_report"]["summary"]:
            if field not in analysis["emotion_report"]["summary"]:
                raise ValueError(f"Missing required field: emotion_report.summary.{field}")

        if "disorder_indicators" not in analysis["emotion_report"]:
            raise ValueError("Missing required field: emotion_report.disorder_indicators")

        return analysis

    except json.JSONDecodeError as e:
        raise Exception(f"Error parsing LLM response as JSON: {str(e)}")
    except Exception as e:
        raise Exception(f"Error processing LLM response: {str(e)}")

def main():
    if len(sys.argv) != 2:
        print("Usage: python pdf_analyzer.py <pdf_path>")
        sys.exit(1)

    pdf_path = sys.argv[1]
    
    try:
        # Initialize LLM
        model_path = os.getenv("LLAMA_MODEL_PATH", "models/llama-2-7b-chat.gguf")
        llm = Llama(
            model_path=model_path,
            n_ctx=4096,  # Increased context window
            n_threads=4
        )
        
        # Extract text from PDF
        text = extract_text_from_pdf(pdf_path)
        
        # Analyze the text
        analysis = analyze_medical_report(text, llm)
        
        # Output the analysis as JSON
        print(json.dumps(analysis))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main() 