import base64
import json
import os

from google import genai
from google.genai import types
from pydantic import BaseModel, Field


class GeminiAnalysisResult(BaseModel):
    vulnerability_score: int = Field(ge=0, le=100)
    risk_label: str
    summary: str


_PROMPT = """You are an expert utility infrastructure inspector. Analyze this photo of a utility pole or grid asset.

Identify any anomalies such as:
- Vegetation encroachment (trees/branches near power lines)
- Rust or corrosion on transformers or hardware
- Wire fatigue, sagging conductors
- Pole degradation, leaning, cracks
- Insulator damage
- Overloaded circuits or equipment

Return a JSON object with exactly these fields:
- vulnerability_score: integer 0-100 (0 = no issues, 100 = critical failure imminent)
- risk_label: short label for the primary risk (e.g. "Vegetation Encroachment", "Transformer Rust", "None Detected")
- summary: 1-3 sentence description of what you observe and the recommended action
"""


def analyze_image(image_b64: str) -> GeminiAnalysisResult:
    """Send a base64 image to Gemini and return structured analysis."""
    api_key = os.environ.get("GOOGLE_API_KEY", "")
    client = genai.Client(api_key=api_key)

    if image_b64.startswith("data:"):
        image_b64 = image_b64.split(",", 1)[1]

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            types.Part(
                inline_data=types.Blob(
                    mime_type="image/jpeg",
                    data=base64.b64decode(image_b64),
                )
            ),
            _PROMPT,
        ],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=GeminiAnalysisResult,
        ),
    )

    parsed = json.loads(response.text)
    return GeminiAnalysisResult(**parsed)
