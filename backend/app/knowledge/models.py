from dataclasses import dataclass, field
from typing import Any


@dataclass
class KnowledgeSource:
    title: str
    url: str = ""
    source_type: str = "other"
    verification_status: str = "needs_verification"
    last_verified: str | None = None
    notes: str = ""


@dataclass
class InstitutionKnowledge:
    code: str
    name: str
    aliases: list[str] = field(default_factory=list)
    institution_type: str = "university"
    country: str = "Rwanda"

    official_website: str = ""
    admissions_url: str = ""
    application_url: str = ""

    description: str = ""

    programmes: list[dict[str, Any]] = field(default_factory=list)
    admission_requirements: list[dict[str, Any]] = field(default_factory=list)
    scholarships: list[dict[str, Any]] = field(default_factory=list)
    deadlines: list[dict[str, Any]] = field(default_factory=list)
    tvet_mappings: list[dict[str, Any]] = field(default_factory=list)

    sources: list[KnowledgeSource] = field(default_factory=list)

    verification_status: str = "needs_verification"
    last_verified: str | None = None

    notes: list[str] = field(default_factory=list)
