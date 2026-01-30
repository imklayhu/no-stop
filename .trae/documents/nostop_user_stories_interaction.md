# User Stories - NoStop: Interaction Flows (v5.0)

## Epic 5: Route Regeneration (Iterative Planning)

### Story 5.1: Reject & Retry
**As a** user who isn't satisfied with the AI's first suggestion
**I want to** quickly tell the AI *why* (e.g., "Too far", "Too risky") and get a new route
**So that** I don't have to restart the entire chat from scratch.
**But** the feedback process must be one-tap fast, not typing a long essay.

**Acceptance Criteria (Gherkin):**
```gherkin
Feature: Route Regeneration

  Scenario: User rejects a route because it is too hilly
    Given I am viewing the "Route Result" page
    When I click the "Regenerate" button
    Then a feedback modal should appear with options: "Too far", "Too hilly", "Too risky"
    When I select "Too hilly"
    Then the system should transition to "Analyzing" state
    And the new route should have "Elevation Gain" < Previous Route
```

## Epic 6: Export & Confirmation

### Story 6.1: Confirm Export Details
**As a** user ready to export
**I want to** review the file name and confirm the save action
**So that** I can easily find the file later on my device.

**Acceptance Criteria (Gherkin):**
```gherkin
Feature: Export Confirmation

  Scenario: Exporting a GPX file
    Given I clicked "Export GPX"
    Then a modal should appear showing the default filename "NoStop_2023-10-27_NightLoop.gpx"
    When I click "Confirm Download"
    Then the file download should start
    And a "Success" overlay should appear saying "Ready to Ride!"
```

### Story 6.2: Multi-Route Comparison
**As a** user with multiple good options
**I want to** swipe between candidate routes
**So that** I can pick the one that best fits my mood.

**Acceptance Criteria (Gherkin):**
```gherkin
Feature: Route Swiping

  Scenario: Comparing two routes
    Given the AI found 2 suitable routes
    When I swipe left on the route card
    Then the map should update to show "Route B"
    And the "Coach Commentary" text should update to describe Route B
```
