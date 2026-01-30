# User Stories - NoStop: AI-Powered Route Planner (AI Edition)

## Epic 1: Conversational Route Planning (Intent Parsing)
**Priority**: Critical

### Story 1.1: Natural Language Route Request
**As a** cyclist with a vague idea of my workout
**I want to** type or say my plan in natural language (e.g., "Quiet 30km loop for tonight")
**So that** I don't have to manually fiddle with multiple filters and sliders.
**But** if my request is too ambiguous, the AI should make reasonable assumptions (e.g., default to 30km).

**Acceptance Criteria (Gherkin):**
```gherkin
Feature: AI Intent Parsing

  Scenario: User inputs a complex natural language request
    Given I am on the home screen
    When I type "Find a safe 40km route with no hills for tonight"
    Then the system should call the Minimax API
    And the parsed parameters should be:
      | distance      | 40km   |
      | elevation     | flat   |
      | safety_weight | high   |
      | time_of_day   | night  |
    And the route generation engine should use these parameters
```

## Epic 2: Semantic Safety Scoring (The "Common Sense" Engine)

### Story 2.1: Context-Aware Risk Assessment
**As a** safety-conscious night rider
**I want to** avoid routes that are risky specifically at night (e.g., Night Markets, School Zones)
**So that** I don't get stuck in traffic or face invisible hazards that standard maps miss.
**But** I don't want to block these roads during the day when they are safe.

**Acceptance Criteria (Gherkin):**
```gherkin
Feature: Semantic Safety Scoring

  Scenario: Evaluating a route near a Night Market on Friday night
    Given a candidate route passes within 50m of a "Night Market" POI
    And the current simulated time is "Friday 20:00"
    When the AI Semantic Engine evaluates the route
    Then it should assign a "High Risk" flag to that segment
    And the overall "Safety Score" should be penalized
    And the route should be ranked lower than alternative quiet roads
```

## Epic 3: AI Scouting Report (Emotional Interaction)

### Story 3.1: Professional Route Commentary
**As a** user deciding between routes
**I want to** read a short, professional summary of the route's character
**So that** I feel confident and excited about the ride.
**But** the summary must be accurate and highlight specific hazards.

**Acceptance Criteria (Gherkin):**
```gherkin
Feature: AI Scouting Report

  Scenario: Generating a summary for a recommended route
    Given a route has been generated with high bike lane coverage
    When the results card is displayed
    Then I should see a text summary starting with an encouraging hook (e.g., "Perfect for recovery...")
    And the text should mention specific data points (e.g., "90% bike lane")
    And the tone should be like a "Cycling Coach"
```

## Epic 4: Export & Integration

### Story 4.1: Standard GPX Export
**As a** user ready to ride
**I want to** export the final AI-selected route as a GPX file
**So that** I can load it into my Garmin/Wahoo head unit.

**Acceptance Criteria (Gherkin):**
```gherkin
Feature: GPX Export

  Scenario: Exporting an AI-generated route
    Given I have selected the "AI Recommendation #1" route
    When I click "Download GPX"
    Then a valid GPX file should be downloaded
    And the file name should reflect the intent (e.g., "NoStop_Quiet_Night_30km.gpx")
```
