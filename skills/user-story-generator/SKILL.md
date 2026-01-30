---
name: "user-story-generator"
description: "Generates AI-enhanced User Stories with Gherkin acceptance criteria. Invoke when user needs to break down requirements into stories."
---

# User Story Generator

This skill converts high-level requirements into detailed User Stories with Gherkin-style Acceptance Criteria.

## Workflow

1.  **Read Template**: Read the content of `skills/user-story-generator.md`.
2.  **Identify Requirement**: Identify the specific feature or requirement to be broken down.
3.  **Generate Story**: For each requirement, generate a User Story following the format:
    *   **Title**: Human-readable summary.
    *   **Use Case**: As a... I want... So that... But... (Obstacle-aware format).
    *   **Acceptance Criteria**: Scenario... Given... When... Then... (Gherkin format).
4.  **Review**: Check for logical compounds and suggest splitting if necessary.
