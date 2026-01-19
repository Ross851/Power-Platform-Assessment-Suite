# Changelog

All notable changes to the Power Platform Assessment Suite will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - 2026-01-19

#### Comprehensive Governance Documentation
- Added 8 comprehensive Power Platform governance documentation files to `/docs/governance/`:
  - **Glossary.md** - Governance terminology reference (environments, solutions, ALM, DLP, licensing, CoE)
  - **Implementation_Workbook.md** - 8-part actionable implementation workbook covering tenant configuration, DLP strategy, environment strategy, ALM, CoE, licensing, and disaster recovery
  - **Top_Tips_and_Talking_Points.md** - Strategic talking points and quick wins including Block-by-Default DLP, environment routing, and tenant isolation
  - **Workshop_Script.md** - Interactive discovery workshop guide (~2.5 hours) with maturity assessment and chapter-based discovery
  - **Junior_Developer_Guide.md** - Maker onboarding resource covering personal environments, solutions, ALM workflow, and anti-patterns
  - **Justification_and_Citations.md** - Evidence-based justifications with official Microsoft citations for 12 major governance strategies
  - **Environmental_Strategy.md** - Comprehensive implementation brief covering three-container architecture, licensing considerations, data residency, and CI/CD pipeline
  - **Quick_Reference_Card.md** - Single-page desk reference with Day 1 actions, decision trees, and emergency contacts

#### Governance Assessment Integration
- Added TypeScript assessment modules to `/lib/governance/integration/`:
  - **governance-workbook-questions.ts** - Assessment questions derived from Implementation Workbook covering:
    - Tenant Isolation and Cross-Tenant Restrictions
    - DLP Block-by-Default strategy
    - Default Environment naming and routing
    - Managed Environment licensing risks
  - **environmental-strategy-questions.ts** - Risk assessment questions covering:
    - Compliance risks (data residency)
    - Operational risks (rollback plans)
    - Audit risks (deployment tracking)
    - Phase 1 prerequisites (inventory, classification)
  - **pl600-governance-scenarios.ts** - PL-600 exam-style scenario questions covering:
    - Default Environment security at scale (5,000 users)
    - ALM maturity and solution layering
    - Tenant Isolation for regulatory compliance
  - **README.md** - Integration documentation with usage examples

#### Documentation Enhancements
- Created `/docs/governance/README.md` - Comprehensive navigation index for all governance documentation with:
  - Detailed overview of each document
  - Recommended reading paths for different audiences (IT Leadership, Implementation Teams, Governance Champions, Makers, Architects)
  - Integration notes with Assessment Suite
  - Links to related documentation
- Updated main `README.md` with new Governance Documentation section linking to all governance resources

### Context
All deliverables are dated January 2026 and align with the latest Microsoft Learn guidance on Power Platform governance, security, and ALM best practices. The documentation provides:
- Strategic guidance for three-container architecture (Default, Personal Developer, Managed Environments)
- Critical licensing warnings about Managed Environments
- Phase-based implementation approach with clear decision points
- Comprehensive terminology for consistent communication
- Evidence-based justifications with Microsoft citations
- Practical workshop and onboarding materials

---

## [0.1.0] - Previous Release

### Added
- Initial release with 10 assessment standards
- Multi-project support
- Export functionality (Excel, JSON, Word)
- RAG status indicators
- Document review capabilities
- Responsive design
- Evidence tracking
- Risk ownership assignment
