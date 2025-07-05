# Phase 1: Static HTML Implementation

## Overview
Create a pixel-perfect static HTML implementation of the Things 3 interface using the design system and screenshots as reference. This phase focuses on building the visual foundation without any React functionality.

## Prerequisites
- Review `/documentation/design/things3-design-system.json` for color palette and styling rules
- Analyze all PNG screenshots in `/documentation/design/` for layout patterns
- Reference `/documentation/master-prd.md` for feature requirements

## Task Breakdown

### 1. Project Setup & Design System Implementation
**Estimated Time: 1 day**

#### 1.1 Create HTML Foundation
- [x] Create `public/static-prototype.html` as main prototype file
- [x] Set up basic HTML5 structure with semantic markup
- [x] Include meta tags for responsive design and PWA readiness
- [x] Add favicon and basic app manifest references

#### 1.2 Implement CSS Design System
- [x] Create `public/css/design-system.css` from JSON specification
- [x] Implement CSS custom properties for all colors from design system:
  - Primary colors (#007AFF, #4A90E2, #0051D5)
  - Secondary colors (orange, red, green, teal, yellow, purple)
  - Neutral palette (white, light gray, medium gray, dark gray, charcoal, black)
  - Semantic colors (success, warning, error, info)
- [x] Set up typography system with font families and weights
- [x] Create utility classes for spacing, shadows, and border radius
- [x] Implement responsive breakpoints for mobile and desktop

#### 1.3 Create Component CSS Classes
- [x] Sidebar styling (.sidebar, .sidebar-item, .sidebar-icon)
- [x] Task styling (.task-card, .task-checkbox, .task-text)
- [x] Button styling (.btn-primary, .btn-secondary, .btn-ghost)
- [x] Dropdown styling (.dropdown-container, .dropdown-item)
- [x] Card styling (.card-default, .card-highlighted)
- [x] Icon styling (.icon-sm, .icon-md, .icon-lg)
- [x] Input styling (.input-field, .input-notes)

### 2. Core Layout Structure
**Estimated Time: 2 days**

#### 2.1 Main Application Layout
- [x] Create two-pane layout (240px sidebar + main content)
- [x] Implement sidebar with fixed positioning
- [x] Create main content area with proper margins
- [x] Add bottom toolbar with button styling
- [x] Ensure layout works on mobile with responsive behavior

#### 2.2 Sidebar Implementation
- [x] Create smart lists section (Inbox, Today, Upcoming, Anytime, Someday, Logbook, Trash)
- [x] Add sidebar icons with proper colors from design system:
  - Inbox: #007AFF
  - Today: #FF9500
  - Upcoming: #FF3B30
  - Anytime: #5AC8FA
  - Someday: #FFCC00
  - Logbook: #34C759
  - Trash: #8E8E93
- [x] Implement areas and projects hierarchical structure
- [x] Add "New List" button at bottom of sidebar
- [x] Create hover and active states for sidebar items

#### 2.3 Main Content Area Structure
- [x] Create header section with title and actions
- [x] Implement main content scrollable area
- [x] Add empty state placeholders
- [x] Create "Press ⌘N to create a new to-do" hint styling

### 3. Smart Lists Views
**Estimated Time: 3 days**

#### 3.1 Today View Implementation
- [x] Create Today view layout matching `full-image.png`
- [x] Implement calendar events section at top
- [x] Add "Today" tasks section with proper spacing
- [x] Create "This Evening" section with distinct styling
- [x] Add task input area with placeholder text
- [x] Style progress indicators and task counters

#### 3.2 Inbox View Implementation
- [x] Create empty Inbox state with proper messaging
- [x] Style for receiving dropped/created tasks
- [x] Add quick task creation interface
- [x] Implement task list container structure

#### 3.3 Upcoming View Implementation
- [x] Create date-grouped task sections
- [x] Style date headers with proper typography
- [x] Implement expandable/collapsible date sections
- [x] Add drag-drop visual indicators (static)

#### 3.4 Anytime View Implementation
- [x] Create ungrouped task list layout
- [x] Add filtering/sorting visual controls
- [x] Style for high task volume scenarios

#### 3.5 Someday View Implementation
- [x] Create distinct "ideas" styling approach
- [x] Add visual distinction from active tasks
- [x] Implement looser layout for brainstorming feel

#### 3.6 Logbook View Implementation
- [x] Create completed task archive styling
- [x] Add date-based grouping for historical items
- [x] Style with muted colors to show completion

### 4. Task Components
**Estimated Time: 2 days**

#### 4.1 Task Card Implementation
- [x] Create basic task card layout with checkbox and text
- [x] Implement circular checkbox styling (20px, blue border)
- [x] Add completed state with strikethrough text
- [x] Style notes area with proper typography
- [x] Add inline editing visual states
- [x] Implement priority indicators

#### 4.2 Task Details Implementation
- [x] Create expanded task card for editing
- [x] Add notes area with rich text styling
- [x] Implement tag selection interface
- [x] Create date picker interface elements
- [x] Add checklist sub-items styling
- [x] Style attachment and link preview areas

#### 4.3 Magic Plus Button
- [x] Create floating action button (48px circle, bottom right)
- [x] Implement blue gradient background (#007AFF)
- [x] Add proper shadow (0 4px 16px rgba(0,122,255,0.3))
- [x] Create hover state animations
- [x] Add pulse/scale effects for interaction feedback

### 5. Project and Area Views
**Estimated Time: 2 days**

#### 5.1 Project View Implementation
- [ ] Analyze `project-view-tasks and headers.png` for layout
- [ ] Create project header with title and progress indicator
- [ ] Implement heading sections for task organization
- [ ] Add task list with proper spacing and grouping
- [ ] Style project completion indicator (pie chart visual)
- [ ] Add notes area for project descriptions

#### 5.2 Area View Implementation
- [ ] Analyze `area-view-projects.png` for layout structure
- [ ] Create area overview with contained projects
- [ ] Implement project cards with progress indicators
- [ ] Add area-level task list for non-project tasks
- [ ] Style area header and description sections

### 6. Dropdown and Menu Components
**Estimated Time: 1.5 days**

#### 6.1 Area Dropdown Menu
- [x] Analyze `area-dropdown.png` for exact styling
- [x] Create dark background dropdown (#3C3C43)
- [x] Implement white text on dark background
- [x] Add "Add Tags", "Delete Area", "Share..." options
- [x] Style menu items with proper hover states
- [x] Add menu separators and icons

#### 6.2 New List Dropdown
- [x] Analyze `new-list-dropdown.png` for layout
- [x] Create "New Project" and "New Area" sections
- [x] Add descriptive text for each option
- [x] Style with proper background and shadows
- [x] Implement hover states for menu items

#### 6.3 New Project Menu
- [x] Analyze `new-project-menu.png` for functionality
- [x] Create context menu for project actions
- [x] Add options: Complete Project, When, Add Tags, Add Deadline, Move, Repeat, Duplicate Project, Delete Project, Share
- [x] Style with dark theme consistency
- [x] Add appropriate icons for each action

### 7. Interactive States and Animations
**Estimated Time: 1.5 days**

#### 7.1 Hover States
- [x] Implement sidebar item hover backgrounds
- [x] Add task card hover states
- [x] Create button hover color transitions
- [x] Add dropdown item hover effects
- [x] Style magic plus button hover scaling

#### 7.2 Focus States
- [x] Add keyboard focus indicators for accessibility
- [x] Implement form input focus states
- [x] Create navigation focus styling
- [x] Add skip links for keyboard navigation

#### 7.3 Loading and Empty States
- [x] Create loading skeleton animations
- [x] Design empty state illustrations
- [x] Add proper messaging for each empty view
- [x] Style connection/offline indicators

### 8. Responsive Design Implementation
**Estimated Time: 1 day**

#### 8.1 Mobile Layout
- [x] Create responsive sidebar (collapsible on mobile)
- [x] Adjust task card spacing for touch
- [x] Implement mobile-friendly dropdowns
- [x] Optimize magic plus button for mobile

#### 8.2 Tablet Layout
- [x] Optimize two-pane layout for tablet
- [x] Adjust touch targets for tablet use
- [x] Implement proper landscape orientation

### 9. CSS Architecture and Optimization
**Estimated Time: 0.5 days**

#### 9.1 Code Organization
- [x] Organize CSS files by component/feature
- [x] Implement CSS custom properties efficiently
- [x] Remove unused styles and optimize file size
- [x] Add CSS comments for complex styling rules

#### 9.2 Browser Compatibility
- [x] Test in Chrome, Firefox, Safari, Edge
- [x] Add vendor prefixes where needed
- [x] Implement fallbacks for older browsers
- [x] Validate HTML and CSS

### 10. Documentation and Handoff
**Estimated Time: 0.5 days**

#### 10.1 Create Implementation Guide
- [x] Document CSS architecture decisions
- [x] Create component style guide
- [x] List all HTML classes and their purposes
- [x] Note any deviations from original Things 3 design

#### 10.2 Prepare for React Conversion
- [x] Identify reusable component patterns
- [x] Document interactive behaviors to implement
- [x] List dynamic content areas
- [x] Note state management requirements

## Deliverables
- `public/static-prototype.html` - Complete static prototype
- `public/css/` - All CSS files organized by component
- `documentation/static-prototype-guide.md` - Implementation documentation
- Screenshots comparing static version to original Things 3 designs

## Phase 1.5: Enhanced Interactivity (Post-Static Implementation)

### 11. Inline Area and Project Creation
#### 11.1 New Area Functionality
- [ ] Implement inline area creation from "New Area" dropdown
- [ ] Create area in sidebar with inline editing capability
- [ ] Display new area view in main content area
- [ ] Add editable notes section under area title
- [ ] Enable click-to-edit for area name and notes

#### 11.2 New Project Functionality
- [ ] Implement inline project creation from "New Project" dropdown
- [ ] Create project in sidebar with inline editing capability
- [ ] Display new project view in main content area
- [ ] Add editable notes section under project title
- [ ] Enable click-to-edit for project name and notes

#### 11.3 Enhanced Keyboard Shortcuts
- [ ] Replace Cmd+N with Option+N for cross-browser compatibility
- [ ] Implement context-aware task creation:
  - [ ] Add to current view if not Logbook/Trash
  - [ ] Add to Inbox and route there if in Logbook/Trash
- [ ] Update keyboard shortcut documentation

## Success Criteria
- [x] Pixel-perfect match to Things 3 design screenshots
- [x] All colors match design system specification exactly
- [x] Responsive design works on desktop, tablet, and mobile
- [x] All interactive states (hover, focus) implemented
- [x] HTML is semantic and accessible
- [x] CSS is organized and maintainable
- [x] Load time under 2 seconds on 3G connection
- [ ] Inline area/project creation with editable notes
- [ ] Context-aware keyboard shortcuts working across browsers

## Dependencies
- Design system JSON file
- Things 3 reference screenshots
- Web fonts (system fonts as fallback)

## Risk Mitigation
- **Design Accuracy**: Regular comparison with reference screenshots
- **Browser Compatibility**: Test early and often across browsers
- **Performance**: Optimize images and CSS from the start
- **Maintainability**: Use consistent naming conventions and CSS organization

This phase establishes the visual foundation that will be converted to React components in Phase 2.