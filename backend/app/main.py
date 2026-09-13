from datetime import datetime, timezone
import secrets
import string

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from .models import StudentApplication
from .schemas import (
    ApplicationCreate,
    ApplicationCreatedResponse,
    ApplicationResponse,
    AdminApplicationResponse,
    AdminApplicationUpdate,
)


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SDE Career Connect API",
    version="1.0.0",
    description="Backend for SDE Career Connect student application support.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)


def create_reference_code() -> str:
    year = datetime.now(timezone.utc).year
    suffix = "".join(
        secrets.choice(string.digits)
        for _ in range(6)
    )
    return f"SDE-AS-{year}-{suffix}"


def create_tracking_pin() -> str:
    return "".join(
        secrets.choice(string.digits)
        for _ in range(6)
    )


def public_application_response(
    application: StudentApplication,
) -> ApplicationResponse:
    return ApplicationResponse(
        reference_code=application.reference_code,
        institution=application.institution,
        status=application.status,
        public_message=application.public_message,
        created_at=application.created_at,
        updated_at=application.updated_at,
    )


@app.get("/")
def root():
    return {
        "service": "SDE Career Connect API",
        "status": "running",
        "version": "1.0.0",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "sde-career-connect-api",
    }


@app.post(
    "/applications",
    response_model=ApplicationCreatedResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_application(
    payload: ApplicationCreate,
    db: Session = Depends(get_db),
):
    if not payload.consent:
        raise HTTPException(
            status_code=400,
            detail="Consent is required before submitting.",
        )

    reference_code = create_reference_code()

    while db.query(StudentApplication).filter(
        StudentApplication.reference_code == reference_code
    ).first():
        reference_code = create_reference_code()

    tracking_pin = create_tracking_pin()

    application = StudentApplication(
        **payload.model_dump(exclude={"consent"}),
        reference_code=reference_code,
        tracking_pin_hash=pwd_context.hash(tracking_pin),
        status="Submitted",
        public_message=(
            "Your request has been received and is waiting for review."
        ),
    )

    db.add(application)
    db.commit()
    db.refresh(application)

    return ApplicationCreatedResponse(
        reference_code=application.reference_code,
        institution=application.institution,
        status=application.status,
        public_message=application.public_message,
        created_at=application.created_at,
        updated_at=application.updated_at,
        tracking_pin=tracking_pin,
    )


@app.get(
    "/admin/applications",
    response_model=list[AdminApplicationResponse],
)
def get_admin_applications(
    db: Session = Depends(get_db),
):
    applications = (
        db.query(StudentApplication)
        .order_by(StudentApplication.created_at.desc())
        .all()
    )

    return applications


@app.patch(
    "/admin/applications/{application_id}",
    response_model=AdminApplicationResponse,
)
def update_admin_application(
    application_id: int,
    payload: AdminApplicationUpdate,
    db: Session = Depends(get_db),
):
    allowed_statuses = {
        "Received",
        "Under Review",
        "Documents Required",
        "In Progress",
        "Accepted",
        "Completed",
        "Rejected",
    }

    application = (
        db.query(StudentApplication)
        .filter(StudentApplication.id == application_id)
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found.",
        )

    clean_status = payload.status.strip()

    if clean_status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Invalid application status.",
        )

    application.status = clean_status
    application.public_message = payload.public_message.strip()
    application.private_notes = (
        payload.private_notes.strip()
        if payload.private_notes
        else None
    )

    db.commit()
    db.refresh(application)

    return application

@app.post(
    "/applications/track",
    response_model=ApplicationResponse,
)
def track_application(
    reference_code: str,
    tracking_pin: str,
    db: Session = Depends(get_db),
):
    application = db.query(StudentApplication).filter(
        StudentApplication.reference_code == reference_code.strip()
    ).first()

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found or tracking details are incorrect.",
        )

    if not pwd_context.verify(
        tracking_pin,
        application.tracking_pin_hash,
    ):
        raise HTTPException(
            status_code=404,
            detail="Application not found or tracking details are incorrect.",
        )

    return public_application_response(application)
