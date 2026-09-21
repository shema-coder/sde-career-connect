"""
Knowledge Layer constants.
"""

VERIFIED_CURRENT = "verified_current"
HISTORICAL_REFERENCE = "historical_reference"
NEEDS_VERIFICATION = "needs_verification"
NO_VERIFIED_INFORMATION = "no_verified_information"

VERIFICATION_STATUSES = {
    VERIFIED_CURRENT,
    HISTORICAL_REFERENCE,
    NEEDS_VERIFICATION,
    NO_VERIFIED_INFORMATION,
}

SOURCE_TYPES = {
    "official_institution",
    "government",
    "official_scholarship_provider",
    "sde_verified",
    "reputable_secondary",
    "other",
}
