from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker


BASE_DIR = Path(__file__).resolve().parent.parent
DATABASE_DIR = BASE_DIR / "storage" / "database"
DATABASE_DIR.mkdir(parents=True, exist_ok=True)

DATABASE_URL = f"sqlite:///{DATABASE_DIR / 'sde_career_connect.db'}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
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
