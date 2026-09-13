from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base


def utc_now():
    return datetime.now(timezone.utc)


class StudentApplication(Base):
    __tablename__ = "student_applications"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    reference_code: Mapped[str] = mapped_column(
        String(40),
        unique=True,
        index=True,
        nullable=False,
    )

    tracking_pin_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    institution: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    full_names: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    gender: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    province: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    district: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    sector: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    cell: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    village: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    index_number: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    national_id: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    phone: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    date_of_birth: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )

    trade_option: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    disability: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    disability_details: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    refugee: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    faculty1: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    faculty2: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    faculty3: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(60),
        default="Submitted",
        nullable=False,
        index=True,
    )

    public_message: Mapped[str] = mapped_column(
        Text,
        default="Your request has been received and is waiting for review.",
        nullable=False,
    )

    private_notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    consent: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        onupdate=utc_now,
        nullable=False,
    )
