# User Management Specification

## Roles & Hierarchy
The system uses a flat role structure with specific permissions mapping.

### Roles
1.  **ADMIN** (`ADMIN`): Full access to system configs, user management, and all projects.
2.  **MANAGER** (`MANAGER`): Can create projects, assign tasks, and view full analytics.
3.  **TEAM_MEMBER** (`TEAM_MEMBER`): Can view assigned tasks, update task status, and log time.
4.  **CUSTOMER** (`CUSTOMER`): Limited view (likely explicit permissions required).

## Team Directory Features
*   **Search**: Filter by Name, Email, Department, or Manager.
*   **Role Filter**: Dropdown to view specific role groups.
*   **Department Grouping**: Automatically groups users by their `department` field in the UI.

## User Data Fields
| Field | Type | Description |
| :--- | :--- | :--- |
| `fullName` | String | Display name. |
| `email` | String | Unique identifier/login. |
| `role` | Enum | See Roles above. |
| `department` | String | Used for grouping (e.g., "Engineering", "Sales"). |
| `managerId` | LookUp | The user this person reports to. |
| `dateOfBirth` | Date | Used for birthday notifications/display. |

## Stats
The module displays live counts for:
*   Total Admins
*   Total Managers
*   Total Team Members
*   Total Customers
