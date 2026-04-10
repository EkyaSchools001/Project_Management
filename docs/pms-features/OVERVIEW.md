# PMS Module Overview

## Introduction
The Project Management System (PMS) module is designed to streamline project tracking, task assignment, team collaboration, and performance analytics. This documentation outlines the features and data structures extracted from the updated PMS codebase to be integrated into the main School Management Application.

## Core Modules

1.  **Project Management**
    *   Portfolio view of all active initiatives.
    *   Budget and timeline tracking.
    *   Squad assignment.

2.  **Task Execution**
    *   Sprint-based task boards (Backlog, In Progress, Review, Done).
    *   Priority management (Critical, High, Medium, Low).
    *   Granular status tracking.

3.  **Analytics & Reports**
    *   AI-driven insights (Llama 3 integration).
    *   Gantt chart visualization.
    *   Time logging and team performance metrics.

4.  **Team Directory**
    *   Role-based access control (Admin, Manager, Team Member, Customer).
    *   Departmental grouping.

5.  **Calendar & Scheduling**
    *   Google Calendar synchronization.
    *   Meeting room booking.
    *   project timeline visualization.

## Integration Strategy
These modules will likely be nested under the `Department` detail views, allowing each department (e.g., "Technology", "Marketing") to manage their own set of projects and tasks.
