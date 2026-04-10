# Tasks Module Specification

## Feature Summary
The Tasks module handles the day-to-day execution units. It provides a "Sandbox" view for individual contributors to manage their assigned work.

## UI Components
*   **Performance Widgets**: Backlog Count, Active Sprint Count, Completed Count.
*   **Workplace Toolbar**: Search and Status Filtering tabs.
*   **Task Deck**: Table/List view of tasks with inline status editing.

## Data Structure & Inputs

### Task Entity
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `title` | String | Yes | Headline of the task (e.g., "Design landing page"). |
| `description` | Text (Long) | No | Technical requirements. |
| `projectId` | LookUp (Project)| Yes | The parent project this task belongs to. |
| `status` | Enum | Yes | `TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`. Default: `TODO`. |
| `priority` | Enum | Yes | `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`. Default: `MEDIUM`. |
| `startDate` | Date | No | Scheduled start. |
| `dueDate` | Date | No | Deadline. |
| `assigneeIds` | Array[User] | No | Users responsible for execution. |

## Logic & Rules
1.  **Filtering**:
    *   By Text: Matches Title or Project Name.
    *   By Status: Tabs for 'Everything', 'Backlog', 'In Progress', 'Done'.
2.  **Color Coding**:
    *   **Priority**: Critical (Rose), High (Orange), Medium (Amber), Low (Emerald).
    *   **Status**: Done (Emerald), In Progress (Blue), In Review (Purple), Todo (Gray).
3.  **State Transitions**: Updates via inline dropdown in the table view.

## API Endpoints (Reference)
*   `GET /tasks/my-tasks`: Get tasks assigned to current user.
*   `POST /tasks`: Create a new task.
*   `PATCH /tasks/:id/status`: Update status only.
*   `PUT /tasks/:id`: Full update.
