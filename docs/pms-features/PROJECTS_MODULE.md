# Projects Module Specification

## Feature Summary
The Projects module serves as the high-level container for all work. It allows Managers and Admins to define scopes, budgets, and timelines.

## UI Components
*   **Stats Overview**: Active Projects, Team Size, Average Duration.
*   **Project Cards**: Visual representation with progress status, budget overlay, and manager avatar.
*   **Create Modal**: Form to initialize new projects.

## Data Structure & Inputs

### Project Entity
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | String | Yes | The official name of the project (e.g., "Q4 Marketing Campaign"). |
| `description` | Text (Long) | No | Detailed goals and deliverables. |
| `status` | Enum | Yes | `IN_PROGRESS`, `COMPLETED`, `ON_HOLD`. Default: `IN_PROGRESS`. |
| `startDate` | Date | Yes | Project kickoff date. |
| `endDate` | Date | Yes | Expected completion date. |
| `budget` | Number | No | Allocated budget in INR. |
| `managerId` | LookUp (User) | Yes | Reference to user with `ADMIN` or `MANAGER` role. |
| `memberIds` | Array[User] | No | List of assigned team members ("Squad"). |

## Logic & Rules
1.  **Access Control**: Only `ADMIN` and `MANAGER` roles can create or delete projects.
2.  **Status styling**:
    *   Completed: Emerald/Green
    *   In Progress: Blue
    *   On Hold: Amber
3.  **Calculated Fields**:
    *   `progress`: Calculated in Reports based on task completion % (e.g., 5/10 tasks done = 50%).

## API Endpoints (Reference)
*   `GET /projects`: List all projects.
*   `POST /projects`: Create a new project.
*   `GET /projects/:id`: Get details (including tasks).
