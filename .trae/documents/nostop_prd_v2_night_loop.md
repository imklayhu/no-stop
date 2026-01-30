# Product Requirements Document (PRD) - NoStop: City Night Loop Edition
**Version**: 2.0 (Draft)
**Date**: 2026-01-30
**Status**: Proposal

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to define the requirements for the "City Night Loop" edition of the **NoStop** application. This iteration focuses on solving the specific pain points of urban cycling enthusiasts who train on weeknights. It aims to provide a safe, efficient, and continuous riding experience by intelligently recommending nearby "loop" routes and providing specialized training assistance.

### 1.2 Scope
**NoStop** is a mobile application (and potential hardware integration) that assists cyclists in:
1.  **Discovery**: Finding safe, well-lit, and traffic-friendly loop routes near their home.
2.  **Navigation**: Guiding them from home to the loop start point (commute leg).
3.  **Training**: providing a "Loop Mode" that automatically counts laps, tracks distance, and monitors training goals (e.g., 30km total) without manual intervention.

This MVP specifically targets the "Night Ride" scenario in urban environments.

### 1.3 Definitions
*   **Loop (绕圈)**: A closed-circuit route (ring or U-turn style) typically 3km-5km in length, allowing continuous riding with minimal stops.
*   **Junk Miles (垃圾里程)**: The distance ridden to get to the training ground, which is often stop-and-go and not part of the effective training.
*   **Effective Training**: The distance ridden within the loop at target intensity.

## 2. Overall Description

### 2.1 Product Perspective
NoStop functions as a specialized navigation and training companion. It leverages map data (lighting, lanes, traffic) to filter routes and uses GPS for real-time tracking. It differs from general navigation apps (which optimize for A to B efficiency) by optimizing for **safety, continuity, and training quality**.

### 2.2 User Characteristics
*   **Persona**: Senior Urban Cyclist (资深城市骑友).
*   **Context**: Works during the day, trains 6 PM - 10 PM on weeknights.
*   **Needs**: High safety (lighting, bike lanes), efficiency (low traffic, no sharp turns), and convenience (near home).
*   **Equipment**: Road bike, lights (front/rear), cycling computer, heart rate monitor.

### 2.3 Product Functions
1.  **Smart Loop Recommendation**:
    *   Input: Current location, desired total distance (e.g., 30km), max distance to start point.
    *   Output: List of recommended loops with "Safety" and "Flow" scores.
2.  **Navigation to Start**: Turn-by-turn navigation to the loop entry point.
3.  **Loop Training Mode**:
    *   Auto-detect entry into the loop.
    *   **Auto Lap Counting**: Automatically increment lap count when passing the start/finish point.
    *   Target Progress: Show "Laps Remaining" or "Distance Remaining" to hit the goal.
    *   Audio cues (optional): "Lap 3 complete, 7 to go".

### 2.4 User Environment
*   **Mobile Device**: Android/iOS smartphones mounted on handlebars or in jersey pockets.
*   **Connectivity**: 4G/5G required for mapping, GPS required for tracking.
*   **Physical**: Nighttime outdoor environment; screen must be readable in low light/darkness (Dark Mode default).

### 2.5 Constraints
*   **Safety Critical**: Recommendations must prioritize roads with streetlights and bike lanes.
*   **Accuracy**: Lap counting must handle GPS drift; "Start Point" detection needs a radius tolerance.
*   **Battery**: App must be energy efficient for 2-3 hour rides.

## 3. Specific Requirements

### 3.1 External Interface Requirements
*   **User Interface**:
    *   **Dark Mode First**: High contrast neon on black for night visibility.
    *   **Large Touch Targets**: Easy operation with cycling gloves.
    *   **Minimalist Dashboard**: During riding, show only: Laps, Distance, Speed, Time.
*   **Hardware Interfaces**:
    *   GPS/GNSS Receiver.
    *   (Future) Bluetooth LE for Speed/Cadence sensors.

### 3.2 Functional Requirements

#### 3.2.1 Smart Loop Recommendation Engine
*   **FR-1.1**: System shall identify potential loops based on:
    *   **Shape**: Circular or "Out-and-Back" (U-turn) geometry.
    *   **Length**: 2km - 5km per lap.
*   **FR-1.2**: System shall score and filter loops based on "Night Ride Factors":
    *   **Lighting**: Priority to roads with high density of streetlights (using map metadata or user tagging).
    *   **Lane Separation**: Priority to roads with dedicated non-motorized lanes.
    *   **Traffic Composition**: Penalty for roads with high historical truck traffic at night (6-10 PM).
    *   **Curvature**: Penalty for sharp < 90-degree turns that break rhythm.
*   **FR-1.3**: System shall calculate "Commute Cost" (distance from home to loop start).
*   **FR-1.4**: System shall present Top 3 recommendations with labels like "Brightest", "Fastest", "Closest".

#### 3.2.2 Loop Training Mode
*   **FR-2.1**: User sets a goal (e.g., "30km" or "10 Laps").
*   **FR-2.2**: Upon reaching the loop start point, the App switches to "Loop Mode".
*   **FR-2.3**: System records a "Lap Marker" GPS coordinate.
*   **FR-2.4**: When user passes the Lap Marker (within 20m radius) in the correct direction, system increments Lap Count.
*   **FR-2.5**: Dashboard displays:
    *   Current Lap / Total Laps (e.g., "3 / 10").
    *   Remaining Distance.
    *   Current Lap Pace/Speed.

#### 3.2.3 Safety & Alerts
*   **FR-3.1**: "Bad Road" Warning: If user approaches a known construction zone or hazard, provide audio/visual alert.
*   **FR-3.2**: "Sunset" Mode: Automatically switch UI to dark mode based on local sunset time.

### 3.3 Performance Requirements
*   **Response Time**: Route generation < 5 seconds.
*   **GPS Latency**: Speed/Position updates < 1 second.
*   **Lap Detection**: Missed lap rate < 1%.

### 3.4 Data Requirements
*   **Map Data**: Needs integration with providers (Baidu/Gaode/Mapbox) capable of distinguishing bike lanes.
*   **Crowdsourcing (Future)**: Allow users to report "No lights" or "Construction" to update route scores.

## 4. Verification & Acceptance Criteria
*   **Scenario A**: User selects "30km", rides to a 3km loop. App guides to start, auto-counts 10 laps, and congratulates user upon completion.
*   **Scenario B**: User tries to select a route with no bike lane; App displays "Low Safety Score" warning.
