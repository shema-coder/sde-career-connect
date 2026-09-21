"""
Reusable SDE Career Connect knowledge service.

This service deliberately starts with structured institutional records.
It does not claim that blank fields are verified facts.

Future phases can populate:
- programmes
- requirements
- scholarships
- deadlines
- TVET mappings
- official URLs
- source records
"""

import json
from pathlib import Path
from typing import Any


DATA_FILE = Path(__file__).resolve().parent / "data" / "institutions.json"


def _load_registry() -> dict[str, Any]:
    with DATA_FILE.open("r", encoding="utf-8") as file:
        return json.load(file)


def get_all_institutions() -> list[dict[str, Any]]:
    registry = _load_registry()
    return registry.get("institutions", [])


def get_institution(code: str) -> dict[str, Any] | None:
    normalized = code.strip().upper()

    for institution in get_all_institutions():
        if institution.get("code", "").upper() == normalized:
            return institution

    return None


def find_institutions(query: str) -> list[dict[str, Any]]:
    """
    Find institutions by code, name, or alias.

    This is intentionally simple and deterministic.
    AI/web search can be layered on top later.
    """

    normalized = query.strip().lower()

    if not normalized:
        return []

    matches = []

    for institution in get_all_institutions():
        candidates = [
            institution.get("code", ""),
            institution.get("name", ""),
            *institution.get("aliases", []),
        ]

        if any(
            normalized in str(candidate).lower()
            for candidate in candidates
        ):
            matches.append(institution)

    return matches


def get_knowledge_summary() -> dict[str, Any]:
    institutions = get_all_institutions()

    return {
        "registry_version": _load_registry().get("version"),
        "institution_count": len(institutions),
        "institution_codes": [
            institution.get("code")
            for institution in institutions
        ],
        "verification_note": (
            "Institution records are structural registry entries. "
            "Blank URLs and empty knowledge sections must be verified "
            "before being presented as current information."
        ),
    }
