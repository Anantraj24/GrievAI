import httpx
import json
import logging
from typing import Dict, Any, List, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

ADVERSARIAL_INJECTION_PATTERNS = [
    "ignore previous instructions",
    "ignore all previous",
    "disregard all previous",
    "system prompt override",
    "you are now dan",
    "bypass safety",
    "jailbreak",
    "sudo mode",
    "unrestricted mode"
]

def sanitize_text_input(text: str) -> str:
    """Detect and neutralize prompt injection keywords before sending to LLM."""
    if not text:
        return ""
    cleaned = text
    for pattern in ADVERSARIAL_INJECTION_PATTERNS:
        if pattern.lower() in cleaned.lower():
            logger.warning(f"Potential prompt injection pattern detected and neutralized: {pattern}")
            import re
            cleaned = re.sub(re.escape(pattern), "[REDACTED_INPUT]", cleaned, flags=re.IGNORECASE)
    return cleaned

class OllamaClient:
    def __init__(
        self,
        base_url: str = settings.OLLAMA_BASE_URL,
        model: str = settings.OLLAMA_LLM_MODEL,
        embed_model: str = settings.OLLAMA_EMBED_MODEL
    ):
        self.base_url = base_url
        self.model = model
        self.embed_model = embed_model
        
    async def _generate(self, prompt: str, system: str = "") -> str:
        """Helper to call Ollama generate API with timeout and error resilience"""
        safe_prompt = sanitize_text_input(prompt)
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(
                    f"{self.base_url}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": safe_prompt,
                        "system": system,
                        "stream": False,
                        "options": {
                            "temperature": 0.1
                        }
                    }
                )
                response.raise_for_status()
                data = response.json()
                return data.get("response", "")
        except Exception as e:
            logger.warning(f"Ollama generation request failed or timed out: {e}")
            return "{}"

    async def analyze_grievance(self, text: str, location: Optional[str] = None) -> Dict[str, Any]:
        """Extract structured NLU triage data from grievance text."""
        system_prompt = """You are an expert grievance triage and NLU classification engine.
Analyze the student grievance description and location.
Return ONLY valid JSON matching this exact schema with NO markdown codeblocks or other text:
{
    "language": "English/Hindi/Hinglish/Other",
    "issue_summary": "Concise 1-2 sentence factual summary",
    "category": "Estate & Campus Facilities/Academic Affairs/IT & Digital Services/Hostel & Residence/Campus Safety & Harassment/Finance & Accounts/Other",
    "subcategory": "Specific subcategory or null",
    "location": "Extracted location or null",
    "duration_days": 1,
    "previously_reported": false,
    "reported_to": null,
    "affected_scope": "Individual/Room/Floor/Hostel/Department/Campus",
    "safety_signal": false,
    "essential_service_signal": false,
    "confidence": 0.90
}"""
        
        prompt = f"Grievance Description:\n{text}\n\nReported Location:\n{location or 'Not specified'}"
        response = await self._generate(prompt=prompt, system=system_prompt)
        
        try:
            clean_response = response.strip()
            if clean_response.startswith("```json"):
                clean_response = clean_response[7:]
            if clean_response.startswith("```"):
                clean_response = clean_response[3:]
            if clean_response.endswith("```"):
                clean_response = clean_response[:-3]
            
            parsed = json.loads(clean_response.strip())
            if isinstance(parsed, dict) and "confidence" in parsed:
                return parsed
        except Exception as e:
            logger.warning(f"Could not parse Ollama JSON output: {e}, raw: {response[:100]}")
            
        # Resilient fallback state
        return {
            "language": "English",
            "issue_summary": text[:150] if len(text) > 150 else text,
            "category": "Other",
            "subcategory": None,
            "location": location,
            "duration_days": 1,
            "previously_reported": False,
            "reported_to": None,
            "affected_scope": "Individual",
            "safety_signal": False,
            "essential_service_signal": False,
            "confidence": 0.0,
            "fallback": True
        }

    async def generate_embedding(self, text: str) -> List[float]:
        """Generate dense vector embedding for semantic similarity search."""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    f"{self.base_url}/api/embeddings",
                    json={
                        "model": self.embed_model,
                        "prompt": text
                    }
                )
                response.raise_for_status()
                data = response.json()
                return data.get("embedding", [0.0] * 1024)
        except Exception as e:
            logger.warning(f"Ollama embedding request failed: {e}")
            # Return synthetic 1024-dim zero vector for offline fallback
            return [0.0] * 1024

    async def draft_response(self, grievance_text: str, resolution_notes: str, tone: str = "Formal") -> str:
        """Draft a polite, context-aware institutional response."""
        system_prompt = f"""You are an administrative officer drafting a {tone.lower()} official response to a student regarding their grievance.
Guidelines:
- Tone: {tone}
- Clear, empathetic, professional, and actionable
- Do not include placeholders like [Insert Date] or [Name]
- Provide a direct complete response ready to send to the student."""
        
        prompt = f"Grievance Description:\n{grievance_text}\n\nInternal Action/Resolution Notes:\n{resolution_notes}"
        response = await self._generate(prompt=prompt, system=system_prompt)
        draft = response.strip()
        if not draft or draft == "{}":
            return f"Thank you for contacting administrative support regarding your grievance. We have processed your request ({resolution_notes}) and updated the case status."
        return draft

# Global singleton instance
ai_client = OllamaClient()
