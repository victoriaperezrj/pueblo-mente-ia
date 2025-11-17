"""
Target Audience Generator Service
AI-powered persona generation with DALL-E 3 avatars
"""
import json
import asyncio
from typing import List, Dict, Any, Optional
from datetime import datetime
import openai
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.schemas import (
    TargetAudienceRequest,
    TargetAudienceResponse,
    PersonaProfile
)
from app.models.database import TargetAudience
import logging
import uuid

logger = logging.getLogger(__name__)


class TargetAudienceService:
    """Service for target audience analysis and persona generation"""

    def __init__(self, db: Session):
        self.db = db
        self.client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)

    async def generate_audience_analysis(
        self,
        request: TargetAudienceRequest
    ) -> TargetAudienceResponse:
        """
        Generate comprehensive target audience analysis with personas
        """
        try:
            logger.info(f"Generating target audience for user: {request.user_id}")

            # Step 1: Generate personas with GPT-4
            personas_data = await self._generate_personas_with_gpt(request)

            # Step 2: Generate DALL-E avatars if enabled
            if request.generate_personas and settings.ENABLE_DALLE_GENERATION:
                personas_data = await self._generate_persona_avatars(personas_data)

            # Step 3: Generate audience strategy
            strategy = await self._generate_audience_strategy(request, personas_data)

            # Step 4: Create response
            response = self._create_response(request, personas_data, strategy)

            # Step 5: Save to database
            self._save_to_database(request, response)

            return response

        except Exception as e:
            logger.error(f"Target audience generation error: {str(e)}")
            raise

    async def _generate_personas_with_gpt(
        self,
        request: TargetAudienceRequest
    ) -> List[Dict[str, Any]]:
        """
        Generate detailed persona profiles using GPT-4
        """
        try:
            prompt = f"""Create {request.num_personas} detailed customer personas for this business:

**Business Description:**
{request.business_description}

**Product/Service:**
{request.product_service}

**Country/Market:**
{request.country}

For each persona, provide comprehensive details including:

1. **Demographics**:
   - Name (realistic for the country)
   - Age range
   - Occupation
   - Income level
   - Location (city/region)

2. **Psychographics**:
   - Interests (5-7 items)
   - Values (4-6 items)
   - Pain points (4-6 specific problems they face)
   - Goals (4-6 aspirations)

3. **Behavioral**:
   - Buying behavior (detailed description)
   - Preferred channels (where they shop/consume)
   - Decision factors (what influences their purchases)

4. **Communication**:
   - Communication style
   - Content preferences (types of content they engage with)

5. **Visual Description**:
   - Detailed physical description for avatar generation (appearance, style, setting)

Respond with valid JSON:
{{
  "personas": [
    {{
      "persona_id": "<unique-id>",
      "name": "<name>",
      "age_range": "<range>",
      "occupation": "<job>",
      "income_level": "<low|medium|high|very-high>",
      "location": "<city, region>",
      "interests": ["interest 1", ...],
      "values": ["value 1", ...],
      "pain_points": ["pain 1", ...],
      "goals": ["goal 1", ...],
      "buying_behavior": "<detailed description>",
      "preferred_channels": ["channel 1", ...],
      "decision_factors": ["factor 1", ...],
      "communication_style": "<description>",
      "content_preferences": ["type 1", ...],
      "avatar_description": "<detailed visual description for DALL-E>"
    }}
  ]
}}"""

            response = self.client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert marketing strategist and customer insights analyst. Create realistic, detailed customer personas based on market research and behavioral psychology."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.8,
                max_tokens=4000,
                response_format={"type": "json_object"}
            )

            data = json.loads(response.choices[0].message.content)
            personas = data.get("personas", [])

            logger.info(f"Generated {len(personas)} personas with GPT-4")
            return personas

        except Exception as e:
            logger.error(f"Persona generation error: {str(e)}")
            raise

    async def _generate_persona_avatars(
        self,
        personas: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Generate DALL-E 3 avatars for personas
        """
        async def generate_one_avatar(persona: Dict[str, Any]) -> Dict[str, Any]:
            try:
                avatar_description = persona.get("avatar_description", "")

                # Enhance prompt for professional business personas
                enhanced_prompt = f"""Professional headshot portrait: {avatar_description}.
High quality, professional photography, business casual attire, neutral background,
confident expression, studio lighting. Photorealistic style."""

                logger.info(f"Generating DALL-E avatar for persona: {persona.get('name')}")

                response = self.client.images.generate(
                    model="dall-e-3",
                    prompt=enhanced_prompt[:1000],  # DALL-E has character limit
                    size="1024x1024",
                    quality="standard",
                    n=1
                )

                avatar_url = response.data[0].url
                persona["avatar_url"] = avatar_url

                logger.info(f"Avatar generated successfully for: {persona.get('name')}")

            except Exception as e:
                logger.error(f"DALL-E generation error for {persona.get('name')}: {str(e)}")
                persona["avatar_url"] = None

            return persona

        # Generate avatars in parallel
        tasks = [generate_one_avatar(p) for p in personas]
        updated_personas = await asyncio.gather(*tasks, return_exceptions=True)

        # Filter out exceptions
        valid_personas = [p for p in updated_personas if isinstance(p, dict)]

        return valid_personas

    async def _generate_audience_strategy(
        self,
        request: TargetAudienceRequest,
        personas: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Generate marketing and engagement strategy
        """
        try:
            personas_summary = json.dumps(personas, indent=2)[:4000]

            prompt = f"""Based on these customer personas, create a comprehensive audience strategy:

**Personas:**
{personas_summary}

**Business:**
{request.business_description}

**Product/Service:**
{request.product_service}

Provide:

1. **Primary Segment**: Main target audience with:
   - Size estimation
   - Characteristics
   - Why they're primary

2. **Secondary Segments**: Additional audience segments (2-3)

3. **Market Sizing**:
   - Estimated total audience size
   - Addressable market

4. **Marketing Channels**: Top 7-10 channels ranked by effectiveness

5. **Messaging Recommendations**: 5-7 key messaging strategies

6. **Engagement Tactics**: 7-10 specific tactics to engage these personas

Respond with valid JSON:
{{
  "primary_segment": {{
    "name": "<segment name>",
    "size_estimate": "<size>",
    "characteristics": ["char 1", ...],
    "rationale": "<why primary>"
  }},
  "secondary_segments": [
    {{
      "name": "<name>",
      "size_estimate": "<size>",
      "potential": "<description>"
    }}
  ],
  "estimated_audience_size": "<total estimate>",
  "addressable_market": "<addressable estimate>",
  "marketing_channels": [
    "channel 1",
    "channel 2",
    ...
  ],
  "messaging_recommendations": [
    "message 1",
    ...
  ],
  "engagement_tactics": [
    "tactic 1",
    ...
  ],
  "confidence_level": <float 0-1>
}}"""

            response = self.client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a growth marketing expert specializing in audience segmentation and go-to-market strategies."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=3000,
                response_format={"type": "json_object"}
            )

            strategy = json.loads(response.choices[0].message.content)
            logger.info("Audience strategy generated")

            return strategy

        except Exception as e:
            logger.error(f"Strategy generation error: {str(e)}")
            raise

    def _create_response(
        self,
        request: TargetAudienceRequest,
        personas_data: List[Dict[str, Any]],
        strategy: Dict[str, Any]
    ) -> TargetAudienceResponse:
        """Create response object"""

        # Parse personas
        personas = []
        avatars_generated = 0

        for p in personas_data:
            try:
                persona = PersonaProfile(
                    persona_id=p.get("persona_id", str(uuid.uuid4())),
                    name=p.get("name", "Unknown"),
                    age_range=p.get("age_range", "25-45"),
                    occupation=p.get("occupation", "Professional"),
                    income_level=p.get("income_level", "medium"),
                    location=p.get("location", request.country),
                    interests=p.get("interests", []),
                    values=p.get("values", []),
                    pain_points=p.get("pain_points", []),
                    goals=p.get("goals", []),
                    buying_behavior=p.get("buying_behavior", ""),
                    preferred_channels=p.get("preferred_channels", []),
                    decision_factors=p.get("decision_factors", []),
                    communication_style=p.get("communication_style", ""),
                    content_preferences=p.get("content_preferences", []),
                    avatar_url=p.get("avatar_url"),
                    avatar_description=p.get("avatar_description", "")
                )
                personas.append(persona)

                if p.get("avatar_url"):
                    avatars_generated += 1

            except Exception as e:
                logger.error(f"Error creating persona profile: {str(e)}")

        return TargetAudienceResponse(
            audience_id=str(uuid.uuid4()),
            analysis_date=datetime.utcnow(),
            personas=personas,
            primary_segment=strategy.get("primary_segment", {}),
            secondary_segments=strategy.get("secondary_segments", []),
            estimated_audience_size=strategy.get("estimated_audience_size"),
            addressable_market=strategy.get("addressable_market"),
            marketing_channels=strategy.get("marketing_channels", []),
            messaging_recommendations=strategy.get("messaging_recommendations", []),
            engagement_tactics=strategy.get("engagement_tactics", []),
            confidence_level=float(strategy.get("confidence_level", 0.75))
        )

    def _save_to_database(
        self,
        request: TargetAudienceRequest,
        response: TargetAudienceResponse
    ):
        """Save audience analysis to database"""
        try:
            target_audience = TargetAudience(
                user_id=request.user_id,
                business_id=request.business_id,
                business_description=request.business_description,
                product_service=request.product_service,
                country=request.country,
                personas=[p.model_dump() for p in response.personas],
                num_personas_generated=len(response.personas),
                primary_segment=response.primary_segment,
                secondary_segments=response.secondary_segments,
                estimated_audience_size=response.estimated_audience_size,
                addressable_market=response.addressable_market,
                marketing_channels=response.marketing_channels,
                messaging_recommendations=response.messaging_recommendations,
                engagement_tactics=response.engagement_tactics,
                confidence_level=response.confidence_level,
                dalle_images_generated=sum(1 for p in response.personas if p.avatar_url)
            )

            self.db.add(target_audience)
            self.db.commit()
            logger.info(f"Target audience saved for user: {request.user_id}")

        except Exception as e:
            logger.error(f"Database save error: {str(e)}")
            self.db.rollback()
            raise
