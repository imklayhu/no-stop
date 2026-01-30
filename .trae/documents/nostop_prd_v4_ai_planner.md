# Product Requirements Document (PRD) - NoStop: AI-Powered Route Planner
**Version**: 4.0 (Draft)
**Date**: 2026-01-30
**Status**: Proposal

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to define the requirements for **NoStop (AI Edition)**. This iteration integrates **Minimax Large Language Model (LLM)** capabilities to transform the product from a rule-based route finder into an intelligent, context-aware cycling assistant. It addresses the user's need for natural interaction and deep environmental risk assessment.

### 1.2 Scope
**NoStop** is a web/mobile tool that leverages AI to:
1.  **Parse Intent**: Understand natural language requests (e.g., "Find a quiet 30km loop for tonight").
2.  **Score Semantically**: Use "Common Sense Reasoning" to identify environmental risks (e.g., Night Markets, School Zones) that traditional maps miss.
3.  **Generate Emotionally**: Provide route commentaries that sound like a seasoned cycling coach.
4.  **Export**: Deliver standard GPX files for hardware compatibility.

### 1.3 Definitions
*   **Intent Parsing (意图解析)**: Extracting structured parameters (distance, vibe, time) from unstructured text/voice.
*   **Semantic Safety Scoring (常识推理评分)**: Evaluating road safety based on time-specific environmental context (e.g., "Friday Night" + "Night Market" = High Risk).
*   **AI Scouting Report (AI 探路报告)**: A generated narrative describing the route's character and specific advisories.

## 2. Overall Description

### 2.1 Product Perspective
NoStop functions as an intelligent layer on top of standard map data.
Flow: **User (Natural Language)** -> **AI Agent (Parse & Plan)** -> **Map Service (Data)** -> **AI Agent (Score & Narrate)** -> **User (Review & Export)**.

### 2.2 User Characteristics
*   **Target User**: Serious Cyclists who value efficiency and safety.
*   **Behavior**: They prefer conversational efficiency over complex UI controls. They trust "expert advice" over raw data.

### 2.3 Product Functions
1.  **Conversational Route Planning**:
    *   Input: "I want to do a quick 20km spin, no hills, very safe."
    *   Output: AI extracts `distance: 20km`, `elevation: flat`, `safety_weight: high`.
2.  **Semantic Safety Engine**:
    *   Logic: Cross-reference Route Candidates with POI Data (Schools, Markets, Factories) and Time.
    *   Action: Downgrade routes with high "invisible risk" (e.g., delivery driver hotspots near malls).
3.  **AI Scouting Report**:
    *   Output: "This route is perfect for your recovery ride. It's 90% bike lane. Be careful at km 5 near the shopping mall - it gets busy with delivery bikes around 7 PM."

## 3. Specific Requirements

### 3.1 Functional Requirements

#### 3.1.1 AI Intent Parsing (Minimax Integration)
*   **FR-1.1**: System shall accept text input.
*   **FR-1.2**: System shall call Minimax API to extract:
    *   Target Distance (e.g., "30km").
    *   Target Time (e.g., "1 hour" -> ~25km).
    *   Vibe/Preferences (e.g., "Quiet" -> Low Traffic weighting; "Fast" -> Low Turn weighting).
*   **FR-1.3**: System shall fallback to default values if intent is unclear (e.g., Default 30km).

#### 3.1.2 Semantic Safety Scoring
*   **FR-2.1**: System shall identify POIs within 50m of the route.
*   **FR-2.2**: System shall use Minimax to evaluate "Contextual Risk":
    *   *Input*: POI types (e.g., "Night Market"), Current Time (e.g., "Friday 20:00").
    *   *Reasoning*: "Night Market active at 20:00 implies high pedestrian/scooter traffic."
    *   *Output*: Risk Score (0-100).
*   **FR-2.3**: System shall filter out routes with Risk Score > Threshold.

#### 3.1.3 AI Scouting Report Generation
*   **FR-3.1**: System shall generate a 100-word summary for the selected route.
*   **FR-3.2**: Tone shall be "Professional, Encouraging, Cautionary".
*   **FR-3.3**: Content must include:
    *   Highlight (Best part of the route).
    *   Advisory (Specific hazard location).
    *   Suitability (e.g., "Good for FTP testing").

### 3.2 User Interface Requirements
*   **Input**: Prominent Chat/Search Bar: "Tell me what you want to ride today..."
*   **Output**: Card layout with AI Summary at the top, followed by map and data.

### 3.3 Performance Requirements
*   **AI Latency**: Intent parsing < 2s; Route Commentary < 3s.
*   **Streaming**: Use streaming response for the Commentary to reduce perceived latency.

## 4. Verification Strategy
*   **Turing Test Lite**: Show users an AI-generated route report vs. a human-written one. Goal: Users prefer AI version or cannot tell the difference.
*   **Risk Aversion Test**: Feed the system known "bad routes" (e.g., through a busy night market). Success if AI identifies the risk and lowers the score.

## 5. Roadmap
*   **v1.0 (AI MVP)**: Text Input -> Route Generation -> AI Commentary.
*   **v1.1**: Voice Input Support.
*   **v1.2**: Personalized AI (Remembers user's past preferences: "Like last Tuesday but longer").
