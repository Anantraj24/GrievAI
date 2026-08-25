import httpx
import json
from typing import Dict, Any, List

class OllamaClient:
    def __init__(self, base_url: str = "http://localhost:11434", model: str = "llama3"):
        self.base_url = base_url
        self.model = model
        
    async def _generate(self, prompt: str, system: str = "") -> str:
        """Helper to call Ollama generate API"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": prompt,
                        "system": system,
                        "stream": False,
                        "options": {
                            "temperature": 0.1 # Low temperature for structured output
                        }
                    },
                    timeout=30.0
                )
                response.raise_for_status()
                data = response.json()
                return data.get("response", "")
            except Exception as e:
                # Log error in production
                print(f"Ollama generation failed: {e}")
                return "{}"
                
    async def extract_entities(self, text: str) -> Dict[str, Any]:
        """Extract key entities from text using LLM."""
        system_prompt = \"\"\"
        You are an entity extraction system. Extract key entities from the grievance description.
        Output MUST be valid JSON with the following format and NO markdown wrapping or other text:
        {
            "urgency": "High/Medium/Low",
            "category": "Maintenance/Academic/Administrative/Other",
            "key_entities": ["entity1", "entity2"]
        }
        \"\"\"
        
        response = await self._generate(prompt=text, system=system_prompt)
        try:
            # Clean response in case the model added markdown blocks
            clean_response = response.strip()
            if clean_response.startswith("```json"):
                clean_response = clean_response[7:]
            if clean_response.endswith("```"):
                clean_response = clean_response[:-3]
            
            return json.loads(clean_response)
        except json.JSONDecodeError:
            return {"error": "Failed to parse JSON from model output", "raw": response}

    async def analyze_sentiment(self, text: str) -> Dict[str, Any]:
        """Analyze sentiment and tone of the grievance."""
        system_prompt = \"\"\"
        Analyze the sentiment and emotional tone of this text.
        Output MUST be valid JSON with the following format and NO markdown wrapping or other text:
        {
            "sentiment": "Positive/Neutral/Negative/Angry/Distressed",
            "score": 0.0 to 1.0,
            "requires_empathy": true/false
        }
        \"\"\"
        
        response = await self._generate(prompt=text, system=system_prompt)
        try:
            clean_response = response.strip()
            if clean_response.startswith("```json"):
                clean_response = clean_response[7:]
            if clean_response.endswith("```"):
                clean_response = clean_response[:-3]
                
            return json.loads(clean_response)
        except json.JSONDecodeError:
            return {"error": "Failed to parse JSON", "raw": response}
            
    async def generate_embedding(self, text: str) -> List[float]:
        """Generate vector embedding for semantic search."""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/api/embeddings",
                    json={
                        "model": "nomic-embed-text", # Standard embedding model
                        "prompt": text
                    },
                    timeout=30.0
                )
                response.raise_for_status()
                data = response.json()
                return data.get("embedding", [])
            except Exception as e:
                print(f"Ollama embedding failed: {e}")
                return []
                
    async def draft_response(self, text: str, resolution_notes: str) -> str:
        """Draft a professional response to the student."""
        system_prompt = \"\"\"
        You are an administrative assistant. Draft a polite, professional response to the student 
        regarding their grievance. Use the resolution notes provided.
        Keep it concise and empathetic. Do not include placeholders, generate the final text.
        \"\"\"
        prompt = f"Grievance: {text}\nResolution Notes: {resolution_notes}"
        
        response = await self._generate(prompt=prompt, system=system_prompt)
        return response.strip()

# Global singleton instance
ai_client = OllamaClient(model="llama3") # Can be configured via settings
