"""
CRM Service - Customer Relationship Management
Comprehensive CRM with Customer 360° View, Sales Pipeline, and Marketing Automation
"""

from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, EmailStr
from typing import List, Dict, Optional, Any
from datetime import datetime, timedelta
from enum import Enum
import logging
from prometheus_fastapi_instrumentator import Instrumentator
import uuid

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="CRM Service - Pueblo Mente IA",
    description="Enterprise Customer Relationship Management System",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Prometheus
Instrumentator().instrument(app).expose(app)

# ============================================================================
# ENUMS
# ============================================================================

class ContactType(str, Enum):
    LEAD = "lead"
    PROSPECT = "prospect"
    CUSTOMER = "customer"
    PARTNER = "partner"
    VENDOR = "vendor"

class DealStage(str, Enum):
    QUALIFICATION = "qualification"
    NEEDS_ANALYSIS = "needs_analysis"
    PROPOSAL = "proposal"
    NEGOTIATION = "negotiation"
    CLOSED_WON = "closed_won"
    CLOSED_LOST = "closed_lost"

class ActivityType(str, Enum):
    EMAIL = "email"
    CALL = "call"
    MEETING = "meeting"
    TASK = "task"
    NOTE = "note"

class LeadSource(str, Enum):
    WEBSITE = "website"
    REFERRAL = "referral"
    SOCIAL_MEDIA = "social_media"
    ADVERTISING = "advertising"
    EVENT = "event"
    COLD_OUTREACH = "cold_outreach"
    PARTNER = "partner"

class Priority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

# ============================================================================
# MODELS
# ============================================================================

class ContactCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    job_title: Optional[str] = None
    contact_type: ContactType = ContactType.LEAD
    lead_source: Optional[LeadSource] = None
    tags: List[str] = []
    custom_fields: Dict[str, Any] = {}

class Contact(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    phone: Optional[str]
    company: Optional[str]
    job_title: Optional[str]
    contact_type: ContactType
    lead_source: Optional[LeadSource]
    tags: List[str]
    custom_fields: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
    last_contacted: Optional[datetime]
    lifetime_value: float = 0.0
    engagement_score: int = 0

class DealCreate(BaseModel):
    title: str
    contact_id: str
    value: float
    currency: str = "USD"
    stage: DealStage = DealStage.QUALIFICATION
    expected_close_date: Optional[datetime] = None
    probability: int = Field(default=50, ge=0, le=100)
    description: Optional[str] = None
    custom_fields: Dict[str, Any] = {}

class Deal(BaseModel):
    id: str
    title: str
    contact_id: str
    value: float
    currency: str
    stage: DealStage
    expected_close_date: Optional[datetime]
    probability: int
    description: Optional[str]
    custom_fields: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
    closed_at: Optional[datetime]
    owner_id: Optional[str]

class ActivityCreate(BaseModel):
    contact_id: str
    deal_id: Optional[str] = None
    activity_type: ActivityType
    title: str
    description: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    completed: bool = False
    priority: Priority = Priority.MEDIUM

class Activity(BaseModel):
    id: str
    contact_id: str
    deal_id: Optional[str]
    activity_type: ActivityType
    title: str
    description: Optional[str]
    scheduled_at: Optional[datetime]
    completed: bool
    completed_at: Optional[datetime]
    priority: Priority
    created_at: datetime

class Customer360Response(BaseModel):
    contact: Contact
    deals: List[Deal]
    activities: List[Activity]
    interactions_count: int
    total_revenue: float
    avg_deal_size: float
    last_purchase_date: Optional[datetime]
    next_activity: Optional[Activity]
    recommendations: List[str]
    health_score: int

class PipelineMetrics(BaseModel):
    total_deals: int
    total_value: float
    average_deal_size: float
    conversion_rate: float
    average_sales_cycle_days: float
    deals_by_stage: Dict[str, int]
    value_by_stage: Dict[str, float]

class LeadScoringResponse(BaseModel):
    contact_id: str
    lead_score: int
    score_breakdown: Dict[str, int]
    qualification_status: str
    recommended_actions: List[str]
    conversion_probability: float

# ============================================================================
# IN-MEMORY DATABASE (Replace with real DB in production)
# ============================================================================

contacts_db: Dict[str, Contact] = {}
deals_db: Dict[str, Deal] = {}
activities_db: Dict[str, Activity] = {}

# ============================================================================
# BUSINESS LOGIC
# ============================================================================

def calculate_lead_score(contact: Contact, activities: List[Activity]) -> LeadScoringResponse:
    """Calculate lead score based on multiple factors"""
    score = 0
    breakdown = {}

    # Email domain score
    if contact.email:
        if any(domain in contact.email for domain in ['gmail', 'yahoo', 'hotmail']):
            breakdown['email_quality'] = 5
        else:
            breakdown['email_quality'] = 15  # Business email
        score += breakdown['email_quality']

    # Company size (if available)
    if contact.company:
        breakdown['has_company'] = 10
        score += 10

    # Job title
    if contact.job_title:
        if any(title in (contact.job_title or '').lower() for title in ['ceo', 'founder', 'owner', 'director']):
            breakdown['job_title'] = 20
        elif any(title in (contact.job_title or '').lower() for title in ['manager', 'head', 'vp']):
            breakdown['job_title'] = 15
        else:
            breakdown['job_title'] = 5
        score += breakdown['job_title']

    # Engagement (activities)
    recent_activities = [a for a in activities if a.created_at > datetime.now() - timedelta(days=30)]
    engagement_score = min(len(recent_activities) * 5, 30)
    breakdown['engagement'] = engagement_score
    score += engagement_score

    # Lead source
    if contact.lead_source:
        source_scores = {
            LeadSource.REFERRAL: 20,
            LeadSource.PARTNER: 15,
            LeadSource.EVENT: 15,
            LeadSource.WEBSITE: 10,
            LeadSource.SOCIAL_MEDIA: 8,
            LeadSource.ADVERTISING: 5,
            LeadSource.COLD_OUTREACH: 3
        }
        breakdown['lead_source'] = source_scores.get(contact.lead_source, 5)
        score += breakdown['lead_source']

    # Qualification status
    if score >= 70:
        qualification = "HOT"
        conversion_prob = 0.75
    elif score >= 50:
        qualification = "WARM"
        conversion_prob = 0.45
    else:
        qualification = "COLD"
        conversion_prob = 0.15

    # Recommendations
    recommendations = []
    if score < 50:
        recommendations.append("Nurture with educational content")
        recommendations.append("Schedule discovery call to assess fit")
    elif score < 70:
        recommendations.append("Send personalized proposal")
        recommendations.append("Connect with decision maker")
    else:
        recommendations.append("Priority follow-up within 24 hours")
        recommendations.append("Send pricing and demo")

    return LeadScoringResponse(
        contact_id=contact.id,
        lead_score=score,
        score_breakdown=breakdown,
        qualification_status=qualification,
        recommended_actions=recommendations,
        conversion_probability=conversion_prob
    )

def calculate_health_score(contact: Contact, deals: List[Deal], activities: List[Activity]) -> int:
    """Calculate customer health score"""
    score = 50  # Base score

    # Recent engagement
    recent_activities = [a for a in activities if a.created_at > datetime.now() - timedelta(days=30)]
    score += min(len(recent_activities) * 3, 20)

    # Deal success rate
    closed_deals = [d for d in deals if d.stage in [DealStage.CLOSED_WON, DealStage.CLOSED_LOST]]
    won_deals = [d for d in closed_deals if d.stage == DealStage.CLOSED_WON]

    if closed_deals:
        win_rate = len(won_deals) / len(closed_deals)
        score += int(win_rate * 20)

    # Lifetime value
    if contact.lifetime_value > 10000:
        score += 10
    elif contact.lifetime_value > 5000:
        score += 5

    return min(max(score, 0), 100)

# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "crm-service",
        "version": "1.0.0",
        "total_contacts": len(contacts_db),
        "total_deals": len(deals_db),
        "timestamp": datetime.now().isoformat()
    }

# ---------- CONTACTS ----------

@app.post("/api/v1/crm/contacts", response_model=Contact, status_code=201)
async def create_contact(contact_data: ContactCreate):
    """Create a new contact"""
    contact_id = str(uuid.uuid4())

    contact = Contact(
        id=contact_id,
        **contact_data.dict(),
        created_at=datetime.now(),
        updated_at=datetime.now(),
        last_contacted=None
    )

    contacts_db[contact_id] = contact
    logger.info(f"Contact created: {contact_id}")

    return contact

@app.get("/api/v1/crm/contacts/{contact_id}", response_model=Contact)
async def get_contact(contact_id: str):
    """Get contact by ID"""
    if contact_id not in contacts_db:
        raise HTTPException(status_code=404, detail="Contact not found")

    return contacts_db[contact_id]

@app.get("/api/v1/crm/contacts", response_model=List[Contact])
async def list_contacts(
    contact_type: Optional[ContactType] = None,
    lead_source: Optional[LeadSource] = None,
    limit: int = Query(default=50, le=500),
    offset: int = Query(default=0, ge=0)
):
    """List all contacts with filtering"""
    contacts = list(contacts_db.values())

    if contact_type:
        contacts = [c for c in contacts if c.contact_type == contact_type]

    if lead_source:
        contacts = [c for c in contacts if c.lead_source == lead_source]

    # Sort by created_at descending
    contacts.sort(key=lambda x: x.created_at, reverse=True)

    return contacts[offset:offset + limit]

@app.put("/api/v1/crm/contacts/{contact_id}", response_model=Contact)
async def update_contact(contact_id: str, updates: Dict[str, Any]):
    """Update contact"""
    if contact_id not in contacts_db:
        raise HTTPException(status_code=404, detail="Contact not found")

    contact = contacts_db[contact_id]

    for key, value in updates.items():
        if hasattr(contact, key):
            setattr(contact, key, value)

    contact.updated_at = datetime.now()
    contacts_db[contact_id] = contact

    return contact

@app.delete("/api/v1/crm/contacts/{contact_id}", status_code=204)
async def delete_contact(contact_id: str):
    """Delete contact"""
    if contact_id not in contacts_db:
        raise HTTPException(status_code=404, detail="Contact not found")

    del contacts_db[contact_id]
    logger.info(f"Contact deleted: {contact_id}")

# ---------- DEALS ----------

@app.post("/api/v1/crm/deals", response_model=Deal, status_code=201)
async def create_deal(deal_data: DealCreate):
    """Create a new deal"""
    if deal_data.contact_id not in contacts_db:
        raise HTTPException(status_code=404, detail="Contact not found")

    deal_id = str(uuid.uuid4())

    deal = Deal(
        id=deal_id,
        **deal_data.dict(),
        created_at=datetime.now(),
        updated_at=datetime.now(),
        closed_at=None,
        owner_id=None
    )

    deals_db[deal_id] = deal
    logger.info(f"Deal created: {deal_id}")

    return deal

@app.get("/api/v1/crm/deals/{deal_id}", response_model=Deal)
async def get_deal(deal_id: str):
    """Get deal by ID"""
    if deal_id not in deals_db:
        raise HTTPException(status_code=404, detail="Deal not found")

    return deals_db[deal_id]

@app.get("/api/v1/crm/deals", response_model=List[Deal])
async def list_deals(
    stage: Optional[DealStage] = None,
    contact_id: Optional[str] = None,
    limit: int = Query(default=50, le=500),
    offset: int = Query(default=0, ge=0)
):
    """List all deals with filtering"""
    deals = list(deals_db.values())

    if stage:
        deals = [d for d in deals if d.stage == stage]

    if contact_id:
        deals = [d for d in deals if d.contact_id == contact_id]

    deals.sort(key=lambda x: x.created_at, reverse=True)

    return deals[offset:offset + limit]

@app.put("/api/v1/crm/deals/{deal_id}/stage")
async def update_deal_stage(deal_id: str, stage: DealStage):
    """Update deal stage"""
    if deal_id not in deals_db:
        raise HTTPException(status_code=404, detail="Deal not found")

    deal = deals_db[deal_id]
    deal.stage = stage
    deal.updated_at = datetime.now()

    if stage in [DealStage.CLOSED_WON, DealStage.CLOSED_LOST]:
        deal.closed_at = datetime.now()

        # Update contact LTV if won
        if stage == DealStage.CLOSED_WON:
            contact = contacts_db[deal.contact_id]
            contact.lifetime_value += deal.value
            contacts_db[deal.contact_id] = contact

    deals_db[deal_id] = deal

    return deal

# ---------- ACTIVITIES ----------

@app.post("/api/v1/crm/activities", response_model=Activity, status_code=201)
async def create_activity(activity_data: ActivityCreate):
    """Create a new activity"""
    if activity_data.contact_id not in contacts_db:
        raise HTTPException(status_code=404, detail="Contact not found")

    activity_id = str(uuid.uuid4())

    activity = Activity(
        id=activity_id,
        **activity_data.dict(),
        created_at=datetime.now(),
        completed_at=None if not activity_data.completed else datetime.now()
    )

    activities_db[activity_id] = activity

    # Update last contacted
    contact = contacts_db[activity_data.contact_id]
    contact.last_contacted = datetime.now()
    contacts_db[activity_data.contact_id] = contact

    logger.info(f"Activity created: {activity_id}")

    return activity

@app.get("/api/v1/crm/activities", response_model=List[Activity])
async def list_activities(
    contact_id: Optional[str] = None,
    deal_id: Optional[str] = None,
    activity_type: Optional[ActivityType] = None,
    completed: Optional[bool] = None,
    limit: int = Query(default=50, le=500)
):
    """List activities with filtering"""
    activities = list(activities_db.values())

    if contact_id:
        activities = [a for a in activities if a.contact_id == contact_id]

    if deal_id:
        activities = [a for a in activities if a.deal_id == deal_id]

    if activity_type:
        activities = [a for a in activities if a.activity_type == activity_type]

    if completed is not None:
        activities = [a for a in activities if a.completed == completed]

    activities.sort(key=lambda x: x.created_at, reverse=True)

    return activities[:limit]

@app.put("/api/v1/crm/activities/{activity_id}/complete")
async def complete_activity(activity_id: str):
    """Mark activity as completed"""
    if activity_id not in activities_db:
        raise HTTPException(status_code=404, detail="Activity not found")

    activity = activities_db[activity_id]
    activity.completed = True
    activity.completed_at = datetime.now()
    activities_db[activity_id] = activity

    return activity

# ---------- ANALYTICS ----------

@app.get("/api/v1/crm/contacts/{contact_id}/360", response_model=Customer360Response)
async def get_customer_360(contact_id: str):
    """Get Customer 360° view with complete contact history"""
    if contact_id not in contacts_db:
        raise HTTPException(status_code=404, detail="Contact not found")

    contact = contacts_db[contact_id]

    # Get all related data
    contact_deals = [d for d in deals_db.values() if d.contact_id == contact_id]
    contact_activities = [a for a in activities_db.values() if a.contact_id == contact_id]

    # Calculate metrics
    total_revenue = sum(d.value for d in contact_deals if d.stage == DealStage.CLOSED_WON)
    won_deals = [d for d in contact_deals if d.stage == DealStage.CLOSED_WON]
    avg_deal_size = total_revenue / len(won_deals) if won_deals else 0

    last_purchase = max([d.closed_at for d in won_deals if d.closed_at], default=None)

    # Next activity
    upcoming_activities = [
        a for a in contact_activities
        if not a.completed and a.scheduled_at and a.scheduled_at > datetime.now()
    ]
    next_activity = min(upcoming_activities, key=lambda x: x.scheduled_at) if upcoming_activities else None

    # Health score
    health_score = calculate_health_score(contact, contact_deals, contact_activities)

    # Recommendations
    recommendations = []
    if not upcoming_activities:
        recommendations.append("Schedule follow-up activity")
    if health_score < 50:
        recommendations.append("Customer at risk - increase engagement")
    if last_purchase and (datetime.now() - last_purchase).days > 90:
        recommendations.append("No recent purchases - send reactivation campaign")

    return Customer360Response(
        contact=contact,
        deals=contact_deals,
        activities=contact_activities,
        interactions_count=len(contact_activities),
        total_revenue=total_revenue,
        avg_deal_size=avg_deal_size,
        last_purchase_date=last_purchase,
        next_activity=next_activity,
        recommendations=recommendations,
        health_score=health_score
    )

@app.get("/api/v1/crm/pipeline/metrics", response_model=PipelineMetrics)
async def get_pipeline_metrics():
    """Get sales pipeline metrics and analytics"""
    deals = list(deals_db.values())

    total_deals = len(deals)
    total_value = sum(d.value for d in deals)
    avg_deal_size = total_value / total_deals if total_deals > 0 else 0

    # Conversion rate (won / total closed)
    closed_deals = [d for d in deals if d.stage in [DealStage.CLOSED_WON, DealStage.CLOSED_LOST]]
    won_deals = [d for d in closed_deals if d.stage == DealStage.CLOSED_WON]
    conversion_rate = len(won_deals) / len(closed_deals) if closed_deals else 0

    # Average sales cycle
    sales_cycles = [
        (d.closed_at - d.created_at).days
        for d in won_deals
        if d.closed_at
    ]
    avg_sales_cycle = sum(sales_cycles) / len(sales_cycles) if sales_cycles else 0

    # Deals by stage
    deals_by_stage = {}
    value_by_stage = {}

    for stage in DealStage:
        stage_deals = [d for d in deals if d.stage == stage]
        deals_by_stage[stage.value] = len(stage_deals)
        value_by_stage[stage.value] = sum(d.value for d in stage_deals)

    return PipelineMetrics(
        total_deals=total_deals,
        total_value=round(total_value, 2),
        average_deal_size=round(avg_deal_size, 2),
        conversion_rate=round(conversion_rate, 3),
        average_sales_cycle_days=round(avg_sales_cycle, 1),
        deals_by_stage=deals_by_stage,
        value_by_stage=value_by_stage
    )

@app.get("/api/v1/crm/leads/{contact_id}/score", response_model=LeadScoringResponse)
async def score_lead(contact_id: str):
    """Calculate lead score and qualification status"""
    if contact_id not in contacts_db:
        raise HTTPException(status_code=404, detail="Contact not found")

    contact = contacts_db[contact_id]
    contact_activities = [a for a in activities_db.values() if a.contact_id == contact_id]

    return calculate_lead_score(contact, contact_activities)

@app.get("/api/v1/crm/reports/top-customers")
async def get_top_customers(limit: int = 10):
    """Get top customers by lifetime value"""
    contacts = list(contacts_db.values())
    contacts.sort(key=lambda x: x.lifetime_value, reverse=True)

    return {
        "top_customers": [
            {
                "id": c.id,
                "name": f"{c.first_name} {c.last_name}",
                "company": c.company,
                "lifetime_value": c.lifetime_value,
                "email": c.email
            }
            for c in contacts[:limit]
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003, workers=2)
