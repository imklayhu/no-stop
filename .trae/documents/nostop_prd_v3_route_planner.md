# Product Requirements Document (PRD) - NoStop: Smart Route Planner
**Version**: 3.0 (Draft)
**Date**: 2026-01-30
**Status**: Proposal

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to define the requirements for **NoStop (Route Planner Edition)**. This product iteration pivots from a real-time training companion to a **specialized route planning tool**. It solves the problem of "manual route plotting" and "physical scouting" by using AI and map data to generate high-quality, loop-based training routes that can be exported as GPX files for use in cycling computers.

### 1.2 Scope
**NoStop** is a web/mobile tool that allows users to:
1.  **Generate**: Create loop routes based on location, distance, and time of day (Night/Day).
2.  **Verify**: View a "Virtual Scouting Report" that highlights road conditions (lighting, traffic prediction).
3.  **Export**: Download a standard `.gpx` file for transfer to Garmin/Wahoo/Bryton devices.

**Out of Scope**:
*   Real-time turn-by-turn navigation (handled by the bike computer).
*   In-ride data tracking (speed, cadence, heart rate).
*   Lap counting or training plan execution.

### 1.3 Definitions
*   **Virtual Scouting (云探路)**: The process of using algorithmic data (satellite imagery, POI density, street view analysis, historical traffic) to assess road suitability without physical presence.
*   **GPX (GPS Exchange Format)**: The standard file format for sharing route data.
*   **Loop (绕圈)**: A closed-circuit route.

## 2. Overall Description

### 2.1 Product Perspective
NoStop acts as a pre-ride planning utility. It sits upstream of the riding activity.
Flow: **NoStop (Plan & Export)** -> **Bike Computer (Import & Guide)** -> **User (Ride)**.

### 2.2 User Characteristics
*   **Target User**: Serious Cyclists (Amateur to Pro).
*   **Behavior**: They own dedicated GPS head units (Garmin Edge, Wahoo Elemnt). They care deeply about "flow" (not stopping) and safety.
*   **Pain Point**: "I want to ride a 40km loop tonight, but I don't know where is safe, and I don't want to spend 30 mins drawing lines on Strava."

### 2.3 Product Functions
1.  **Intelligent Route Generation**:
    *   **Inputs**: Start Point, Total Distance (e.g., 30km), Loop Size Preference (e.g., ~3km/lap), Scenario (Night/Day).
    *   **Logic**: Find nearby closed loops that match "Safety" and "Flow" criteria. Connect start point to loop (commute leg).
2.  **Route Preview & Selection**:
    *   Show Top 3 candidates.
    *   Display "Suitability Tags": e.g., "Brightly Lit", "Wide Bike Lane", "Low Traffic".
3.  **One-Click Export**:
    *   Generate `.gpx` file.
    *   (Optional) Direct share to 3rd party apps if API available.

### 2.4 Constraints
*   **Map Data**: Reliance on accurate underlying map data (Baidu/Mapbox) for road attributes.
*   **File Compatibility**: GPX output must be compatible with major hardware brands.

## 3. Specific Requirements

### 3.1 Functional Requirements

#### 3.1.1 Route Generation Engine
*   **FR-1.1**: System shall accept user location (auto-detect or manual pin).
*   **FR-1.2**: System shall accept "Target Distance" (e.g., 30km).
*   **FR-1.3**: System shall accept "Scenario Mode":
    *   **Night Mode**: Penalize unlit roads, penalize heavy truck routes, require bike lanes.
    *   **Day Mode**: Standard safety scoring, prioritize scenery or lower traffic density.
*   **FR-1.4**: System shall generate a "Commute + Loop" structure.
    *   Route = Home -> Loop Start -> (Loop x N) -> Home.
    *   *Note*: The GPX usually contains one full lap geometry or the full track. For MVP, we generate the full track (e.g., Home -> A -> B -> C -> A -> Home). Or simply the Loop itself if user drives there. *Decision: Generate the full "Rideable" track.*

#### 3.1.2 Virtual Scouting Report (Route Details)
*   **FR-2.1**: For each generated route, display a "Scouting Report":
    *   **Road Composition**: % Bike Lane, % Shared Road.
    *   **Traffic Estimate**: "Low", "Medium", "High" based on time of day.
    *   **Lighting Score** (Night Mode only): "Well Lit", "Dim", "Unknown".
    *   **Surface Quality**: (If data available) "Paved", "Rough".
*   **FR-2.2**: Display critical "Waypoints" on the map (e.g., Sharp Turn warnings, Construction zones).

#### 3.1.3 Export & Integration
*   **FR-3.1**: Provide "Download GPX" button.
*   **FR-3.2**: File naming convention: `NoStop_{Date}_{Distance}km_{LocationName}.gpx`.
*   **FR-3.3**: Ensure GPX includes elevation data (if available) for the bike computer's climb profile.

### 3.2 User Interface Requirements
*   **Platform**: Mobile Web / Desktop Web (Responsive).
*   **Map Interaction**: High-fidelity map with "satellite" layer option for manual verification.
*   **Simplicity**: "Generate" -> "Pick" -> "Download". No login required for MVP (optional).

### 3.3 Performance Requirements
*   **Generation Speed**: < 10 seconds to find candidate loops.
*   **File Generation**: Instant (< 1s).

## 4. Verification Strategy
*   **User Acceptance Test**: User exports a route, puts it on a Garmin, and rides it.
    *   *Success*: The route follows safe roads, the turn-by-turn on Garmin works, and the loop is actually "rideable" (no locked gates, no stairs).
*   **Data Validation**: Random sample check of generated routes against Street View to confirm "Bike Lane" tags are accurate.

## 5. Roadmap
*   **v1.0 (MVP)**: Web App. Manual Location Input. GPX Download. Night/Day logic.
*   **v1.1**: "Send to Device" integration (Garmin Connect API).
*   **v1.2**: Community Verification (Users upvote/downvote generated loops).
