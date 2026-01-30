---
name: "prd-generator"
description: "Generates a comprehensive PRD based on IEEE 830 standard. Invoke when user wants to create a PRD or requirements document."
---

# PRD Generator

This skill generates a detailed Product Requirements Document (PRD) based on the IEEE 830 standard.

## Workflow

1.  **Read Template**: Read the content of `skills/prd-template-ieee830.md`.
2.  **Context Analysis**: Analyze the user's current problem statement or feature request.
3.  **Prompt Engineering**: Use the logic from `skills/prd-template-ieee830.md` to construct a prompt for the LLM that will generate the PRD.
4.  **Generation**: Generate the PRD content. The content should cover:
    *   Introduction (Purpose, Scope)
    *   Overall Description (Product perspective, User classes)
    *   Specific Requirements (Functional, External Interfaces, Performance)
