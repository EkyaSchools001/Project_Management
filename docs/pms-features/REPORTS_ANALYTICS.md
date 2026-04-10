# Reports & Analytics Module Specification

## Feature Summary
This module provides high-level insights into organizational performance, utilizing both deterministic data (Gantt, Stats) and probabilistic AI analysis.

## UI Components
*   **AI Insights Button**: Triggers a call to Llama 3 via backend to analyze project health.
*   **View Modes**:
    1.  **Dashboard**: High-level stats, progress bars, work distribution charts.
    2.  **Gantt**: Timeline view using detailed date tracking.
    3.  **Squad Logs**: Table of time entries.

## AI Integration
*   **Endpoint**: `POST api/ai/analyze`
*   **Payload**: Sends `overallStats` (Total Projects, Avg Progress, Hours) and `projects` list.
*   **Output**: Markdown formatted strategy/summary from the AI.

## Time Logging (Squad Logs)
*   **Data Source**: `time-logs` endpoint.
*   **Fields Displayed**:
    *   Member Name & Avatar.
    *   Project / Task context.
    *   Duration (Hours).
    *   Description (Notes).
    *   Date.

## Gantt Chart Logic
*   **Visualizes**: Project scopes (Start to End) and individual Task timelines.
*   **Interactivity**:
    *   Drag-and-drop to reschedule (if authorized).
    *   "Set Date" for backlog items (undated tasks).
    *   Visual indicators for "Ongoing" vs "Completed".

## User Permissions
*   **View Only**: Guests/Staff may only view the roadmap.
*   **Edit**: Admins/Managers can adjust timelines directly from the Gantt view.
