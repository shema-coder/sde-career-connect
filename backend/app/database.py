import os
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker


BASE_DIR = Path(__file__).resolve().parent.parent
DATABASE_DIR = BASE_DIR / "storage" / "database"

# Local development fallback.
DATABASE_DIR.mkdir(parents=True, exist_ok=True)

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"sqlite:///{DATABASE_DIR / 'sde_career_connect.db'}",
)

# Render/PostgreSQL may provide postgres:// while SQLAlchemy expects
# postgresql://.
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace(
        "postgres://",
        "postgresql+psycopg://",
        1,
    )

if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace(
        "postgresql://",
        "postgresql+psycopg://",
        1,
    )

connect_args = {}

if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


class Base(DeclarativeBase):
    pass


def get_db():
    database = SessionLocal()

    try:
        yield database
    finally:
        database.close()

def ensure_student_application_schema():
    """
    Safely add columns introduced after the original
    student_applications table was created.

    This is intentionally idempotent so it can run on every
    application startup without damaging existing data.
    """
    from sqlalchemy import inspect, text

    table_name = "student_applications"

    inspector = inspect(engine)

    if table_name not in inspector.get_table_names():
        return

    existing_columns = {
        column["name"]
        for column in inspector.get_columns(table_name)
    }

    missing_columns = []

    if "request_type" not in existing_columns:
        missing_columns.append(
            (
                "request_type",
                "VARCHAR(50) NOT NULL DEFAULT 'UNIVERSITY_APPLICATION'",
            )
        )

    if "service_type" not in existing_columns:
        missing_columns.append(
            (
                "service_type",
                "VARCHAR(100)",
            )
        )

    if "writing_answers" not in existing_columns:
        missing_columns.append(
            (
                "writing_answers",
                "TEXT",
            )
        )

    if not missing_columns:
        return

    with engine.begin() as connection:
        for column_name, column_definition in missing_columns:
            connection.execute(
                text(
                    f'ALTER TABLE "{table_name}" '
                    f'ADD COLUMN "{column_name}" {column_definition}'
                )
            )

        if "request_type" not in existing_columns:
            connection.execute(
                text(
                    'CREATE INDEX IF NOT EXISTS '
                    '"ix_student_applications_request_type" '
                    'ON "student_applications" ("request_type")'
                )
            )

