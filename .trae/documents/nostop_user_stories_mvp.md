# User Stories - NoStop: Smart Route Planner (MVP)

## Epic 1: Route Generation Engine
**Priority**: Critical

### Story 1.1: Generate Loop Route (Basic)
**As a** serious cyclist planning a workout
**I want to** input my start location, total distance (e.g., 30km), and preferred loop size
**So that** I can get a rideable route that connects my home to a suitable training loop without manual plotting.
**But** I don't want the loop to be too far away, forcing me to ride junk miles.

**Acceptance Criteria (Gherkin):**
```gherkin
Feature: Basic Route Generation

  Scenario: User requests a 30km route
    Given I am on the "Generate Route" page
    And my location is detected as "Century Park"
    When I enter "30km" as target distance
    And I click "Generate"
    Then the system should return a list of routes
    And each route should have a "Total Distance" between 28km and 32km
    And the route structure should be "Start -> Loop Entry -> Loop(s) -> Loop Exit -> Start"
```

### Story 1.2: Night Mode Filtering
**As a** cyclist training on a weeknight
**I want to** select "Night Mode" before generating
**So that** the algorithm filters out unlit roads and prioritizes well-lit avenues.
**But** if no perfectly lit route exists, warn me instead of returning nothing.

**Acceptance Criteria (Gherkin):**
```gherkin
Feature: Night Mode Logic

  Scenario: Generating a night route
    Given I have selected "Night Mode"
    When I request a route
    Then the system should prioritize roads with "Streetlight Density" > Threshold
    And the system should penalize roads with "Truck Traffic" > High
    And the generated route's "Safety Score" should reflect lighting conditions
```

## Epic 2: Virtual Scouting (Route Verification)

### Story 2.1: View Route Details (Scouting Report)
**As a** user reviewing a candidate route
**I want to** see a "Virtual Scouting Report" with tags like "Well Lit", "Wide Bike Lane", "Low Traffic"
**So that** I can trust the route quality without physically going there.
**But** the data must be accurate, otherwise I will lose trust.

**Acceptance Criteria (Gherkin):**
```gherkin
Feature: Route Scouting Report

  Scenario: Viewing route details
    Given I see a list of 3 candidate routes
    When I click on "Route A"
    Then I should see a map overlay
    And I should see tags indicating "Road Type" (e.g., Bike Lane: 80%)
    And I should see a "Traffic Prediction" for the current time
```

## Epic 3: Export & Integration

### Story 3.1: Export to GPX
**As a** user who has selected a perfect route
**I want to** download a standard `.gpx` file with one click
**So that** I can send it to my Garmin/Wahoo head unit for turn-by-turn navigation.

**Acceptance Criteria (Gherkin):**
```gherkin
Feature: GPX Export

  Scenario: Downloading a route
    Given I have selected "Route B"
    When I click "Download GPX"
    Then a file named "NoStop_{Date}_{Distance}.gpx" should be downloaded
    And the file should be valid XML
    And the file should contain track points (trkpt) for the entire ride
```

## Epic 4: Technical Foundation

### Story 4.1: Map Data Integration
**As a** developer
**I want to** integrate a map provider (e.g., Mapbox/Baidu) that supports "Bike Lane" and "Road Type" attributes
**So that** the generation engine has the raw data needed for scoring.

**Acceptance Criteria (Gherkin):**
```gherkin
Feature: Map Data Readiness

  Scenario: Fetching road attributes
    Given the backend service is running
    When I query a specific road segment coordinates
    Then the API should return "is_bike_lane" or equivalent metadata
    And the response time should be under 200ms
```
