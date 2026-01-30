# Product Requirements Document (PRD) - NoStop: AI-Powered Route Planner (v5.0)
**Version**: 5.0 (Interaction Enhancement)
**Date**: 2026-01-30
**Status**: Proposal

## 1. Introduction

### 1.1 Purpose
This update (v5.0) focuses on refining the **Post-Generation Interaction Flow**. It addresses the user need for handling unsatisfactory results ("Regenerate") and the specific steps required to confirm, save, and export a satisfactory route ("Export Flow").

### 1.2 Scope
New interaction flows to be defined:
1.  **Regeneration Flow**: How users reject a route and provide feedback for a better second attempt.
2.  **Export & Save Flow**: The step-by-step process of downloading the GPX file and saving the route to "My Collections".
3.  **Route Comparison**: Switching between multiple candidate routes (if available).

## 2. Overall Description

### 2.1 User Interaction Model
*   **The "Coach" Metaphor**: The AI acts like a coach presenting a plan. The user can say "Looks good, let's go" (Export) or "I don't like this part" (Regenerate).
*   **Feedback Loop**: Regeneration is not just a reload; it's a conversation. "Too far? Okay, let's find something shorter."

## 3. Specific Requirements

### 3.1 Functional Requirements

#### 3.1.1 Route Regeneration (The "Retry" Loop)
*   **FR-4.1**: System shall provide a "Regenerate" or "Try Another" option on the Result Page.
*   **FR-4.2**: Upon clicking "Regenerate", System shall present a quick feedback modal/chip selection:
    *   "Too far"
    *   "Too risky"
    *   "Change area"
    *   Custom input (e.g., "I hate riding near the river").
*   **FR-4.3**: System shall use the negative feedback to adjust parameters and generate a new route.

#### 3.1.2 Route Confirmation & Export
*   **FR-5.1**: Upon clicking "Export GPX", System shall show a confirmation modal.
*   **FR-5.2**: Modal shall allow file renaming (Default: `NoStop_{Date}_{Location}.gpx`).
*   **FR-5.3**: System shall provide a "Save to History" toggle (on by default).
*   **FR-5.4**: Upon successful export, show a "Ready to Ride" success state with instructions (e.g., "File saved. Open in Garmin Connect").

#### 3.1.3 Multi-Candidate Switching
*   **FR-6.1**: If AI finds multiple good matches, allow horizontal swiping between "Option A" and "Option B".
*   **FR-6.2**: AI Commentary must update to reflect the specific route currently in view.

### 3.2 User Interface Requirements
*   **Regenerate Button**: Secondary action (Ghost button or icon), less prominent than Export.
*   **Export Success State**: Full-screen overlay or large toast notification to confirm the action is complete.
*   **Feedback Modal**: Simple tag selection to minimize typing effort.

### 3.3 Performance Requirements
*   **Regeneration Speed**: Should feel faster than initial generation (since location context is already loaded).

## 4. Interaction Flows
*   **Flow A (Success)**: Chat -> Analyzing -> Result -> Click Export -> Confirm Name -> Download Starts -> Success Msg.
*   **Flow B (Retry)**: Chat -> Analyzing -> Result -> Click Regenerate -> Select "Too Hilly" -> Analyzing (New Constraints) -> New Result.
