# Implementation Plan - Redesign Cards

## Objective
Redesign all the cards of the project to match the style of the "preset dashboard" (which uses `CardLegacy`).

## Changes

### `src/components/ui/card.tsx`
- Updated the base `Card` component to use the following styles:
  - `rounded-2xl`: Increased border radius.
  - `border-gray-100`: Lighter border color.
  - `bg-white`: Explicit white background.
  - `hover:shadow-md`: Added hover shadow effect.
  - `transition-all duration-300`: Smooth transitions.
  - `overflow-hidden`: Ensure content doesn't spill out.

## Verification
- Checked that `CardLegacy.jsx` uses the `dashboard-card` class which corresponds to the new styles.
- Verified that `Card` component is used throughout the project (e.g. `DashboardPreview.tsx`, `TeacherDashboard.tsx`, etc), ensuring widespread adoption of the new design.
