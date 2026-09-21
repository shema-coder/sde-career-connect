# SDE Career Connect Knowledge Layer

This is the structured knowledge foundation for SDE Career Connect.

## Purpose

The Knowledge Layer will eventually provide verified information to:

- SDE AI
- Opportunity Finder
- Application Support
- Scholarship Finder
- Student Dashboard
- Application Tracker
- Opportunity Alerts

## Current phase

The first phase creates the institutional registry for the 15 institutions
supported by SDE Career Connect.

At this stage, institutional records are intentionally marked:

`needs_verification`

Blank URLs and empty programme/requirement/scholarship/deadline fields
must not be interpreted as facts.

## Verification statuses

- `verified_current`
- `historical_reference`
- `needs_verification`
- `no_verified_information`

## Planned knowledge categories

### Institutions
Identity, aliases, official website, admissions portal and application URL.

### Programmes
Programme name, level, institution, pathway, subject requirements and
verification status.

### Admission requirements
Academic qualifications, subject requirements, documents, marks and
institution-specific rules.

### Scholarships
Provider, eligibility, benefits, deadline, documents and application URL.

### Deadlines
Intake, opening date, closing date, deadline type and source.

### TVET mappings
Trade, programme, institution, pathway restrictions and evidence.

### Sources
Source title, URL, source type, verification status and last verification date.

## Important rule

The AI must never convert an unverified record into a current fact.

Official institutional sources should normally have the highest priority
for current admissions, programmes, requirements and application status.
