# Calendar & Integration Specification

## Feature Summary
A comprehensive scheduling tool that combines local PMS tasks/meetings with external Google Calendar events.

## Components
*   **FullCalendar**: The core UI engine (Day, Week, Month, List views).
*   **Sidebar**:
    *   **Upcoming Meetings**: List of next 5 meetings.
    *   **Filter Panel**: Toggle visibility of event types.
*   **Google Sync**: OAuth flow to fetch external events.

## Event Types
1.  **Meeting**:
    *   Specific start/end time.
    *   Can have a physical `room` or `meetingLink`.
    *   Includes a list of `participants`.
2.  **Task**:
    *   Synced from the Tasks module.
    *   Visualized based on Start/Due dates.

## Google Calendar Integration
*   **Auth Flow**:
    1.  User clicks "Sync with Google".
    2.  Redirects to `auth/google` (Backend).
    3.  Callback to `CalendarPage` with `?code=...`.
    4.  Frontend exchanges code for tokens via `auth/google/tokens`.
*   **Status Check**: App checks `auth/google/status` on load to show "Connected" state.

## Meeting Scheduling Input
*   **Title**: Meeting subject.
*   **Description**: Agenda.
*   **Date/Time Range**.
*   **Location**: Room name or "Online".
*   **Participants**: Multi-select from system users.

## Logic
*   **Drag & Drop**: Moving an event on the calendar calls the API to update its start/end time.
*   **Permissions**: Only Organizer or Admin can Edit/Cancel a meeting.
