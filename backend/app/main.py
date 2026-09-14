from datetime import datetime, timezone
import secrets
import string

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from .models import NewsPost, StudentApplication
from .schemas import (
    ApplicationCreate,
    ApplicationCreatedResponse,
    ApplicationResponse,
    AdminApplicationResponse,
    AdminApplicationUpdate,
    NewsPostCreate,
    NewsPostResponse,
    NewsPostUpdate,
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
        "https://sde-career-connect.vercel.app",
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




def public_news_response(post: NewsPost) -> NewsPostResponse:
    return NewsPostResponse(
        id=post.id,
        slug=post.slug,
        title=post.title,
        summary=post.summary,
        content=post.content,
        category=post.category,
        date=post.date,
        author=post.author,
        icon=post.icon,
        image=post.image,
        application_link=post.application_link,
        youtube_link=post.youtube_link,
        whatsapp_link=post.whatsapp_link,
        status=post.status,
        featured=post.featured,
        urgent=post.urgent,
        created_at=post.created_at,
        updated_at=post.updated_at,
    )


@app.get(
    "/news",
    response_model=list[NewsPostResponse],
)
def get_public_news(
    db: Session = Depends(get_db),
):
    posts = (
        db.query(NewsPost)
        .filter(NewsPost.status == "published")
        .order_by(
            NewsPost.urgent.desc(),
            NewsPost.featured.desc(),
            NewsPost.created_at.desc(),
        )
        .all()
    )

    return [public_news_response(post) for post in posts]


@app.get(
    "/news/{slug}",
    response_model=NewsPostResponse,
)
def get_public_news_article(
    slug: str,
    db: Session = Depends(get_db),
):
    post = (
        db.query(NewsPost)
        .filter(
            NewsPost.slug == slug,
            NewsPost.status == "published",
        )
        .first()
    )

    if not post:
        raise HTTPException(
            status_code=404,
            detail="News article not found.",
        )

    return public_news_response(post)


@app.get(
    "/admin/news",
    response_model=list[NewsPostResponse],
)
def get_admin_news(
    db: Session = Depends(get_db),
):
    posts = (
        db.query(NewsPost)
        .order_by(NewsPost.created_at.desc())
        .all()
    )

    return posts


@app.post(
    "/admin/news",
    response_model=NewsPostResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_news_post(
    payload: NewsPostCreate,
    db: Session = Depends(get_db),
):
    existing = (
        db.query(NewsPost)
        .filter(NewsPost.slug == payload.slug.strip())
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail="A news article with this slug already exists.",
        )

    allowed_statuses = {"draft", "published"}

    if payload.status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Invalid news status.",
        )

    post = NewsPost(
        slug=payload.slug.strip(),
        title=payload.title.strip(),
        summary=payload.summary.strip(),
        content=payload.content,
        category=payload.category.strip(),
        date=payload.date.strip(),
        author=payload.author.strip(),
        icon=payload.icon.strip() or "🎓",
        image=payload.image,
        application_link=payload.application_link,
        youtube_link=payload.youtube_link,
        whatsapp_link=payload.whatsapp_link,
        status=payload.status,
        featured=payload.featured,
        urgent=payload.urgent,
    )

    db.add(post)
    db.commit()
    db.refresh(post)

    return post


@app.patch(
    "/admin/news/{post_id}",
    response_model=NewsPostResponse,
)
def update_news_post(
    post_id: int,
    payload: NewsPostUpdate,
    db: Session = Depends(get_db),
):
    post = (
        db.query(NewsPost)
        .filter(NewsPost.id == post_id)
        .first()
    )

    if not post:
        raise HTTPException(
            status_code=404,
            detail="News article not found.",
        )

    allowed_statuses = {"draft", "published"}

    if payload.status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Invalid news status.",
        )

    duplicate = (
        db.query(NewsPost)
        .filter(
            NewsPost.slug == payload.slug.strip(),
            NewsPost.id != post_id,
        )
        .first()
    )

    if duplicate:
        raise HTTPException(
            status_code=409,
            detail="A news article with this slug already exists.",
        )

    post.slug = payload.slug.strip()
    post.title = payload.title.strip()
    post.summary = payload.summary.strip()
    post.content = payload.content
    post.category = payload.category.strip()
    post.date = payload.date.strip()
    post.author = payload.author.strip()
    post.icon = payload.icon.strip() or "🎓"
    post.image = payload.image
    post.application_link = payload.application_link
    post.youtube_link = payload.youtube_link
    post.whatsapp_link = payload.whatsapp_link
    post.status = payload.status
    post.featured = payload.featured
    post.urgent = payload.urgent

    db.commit()
    db.refresh(post)

    return post


@app.delete(
    "/admin/news/{post_id}",
)
def delete_news_post(
    post_id: int,
    db: Session = Depends(get_db),
):
    post = (
        db.query(NewsPost)
        .filter(NewsPost.id == post_id)
        .first()
    )

    if not post:
        raise HTTPException(
            status_code=404,
            detail="News article not found.",
        )

    db.delete(post)
    db.commit()

    return {
        "message": "News article deleted successfully.",
        "id": post_id,
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
