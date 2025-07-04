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
- [ ] Create `public/static-prototype.html` as main prototype file
- [ ] Set up basic HTML5 structure with semantic markup
- [ ] Include meta tags for responsive design and PWA readiness
- [ ] Add favicon and basic app manifest references

#### 1.2 Implement CSS Design System
- [ ] Create `public/css/design-system.css` from JSON specification
- [ ] Implement CSS custom properties for all colors from design system:
  - Primary colors (#007AFF, #4A90E2, #0051D5)
  - Secondary colors (orange, red, green, teal, yellow, purple)
  - Neutral palette (white, light gray, medium gray, dark gray, charcoal, black)
  - Semantic colors (success, warning, error, info)
- [ ] Set up typography system with font families and weights
- [ ] Create utility classes for spacing, shadows, and border radius
- [ ] Implement responsive breakpoints for mobile and desktop

#### 1.3 Create Component CSS Classes
- [ ] Sidebar styling (.sidebar, .sidebar-item, .sidebar-icon)
- [ ] Task styling (.task-card, .task-checkbox, .task-text)
- [ ] Button styling (.btn-primary, .btn-secondary, .btn-ghost)
- [ ] Dropdown styling (.dropdown-container, .dropdown-item)
- [ ] Card styling (.card-default, .card-highlighted)
- [ ] Icon styling (.icon-sm, .icon-md, .icon-lg)
- [ ] Input styling (.input-field, .input-notes)

### 2. Core Layout Structure
**Estimated Time: 2 days**

#### 2.1 Main Application Layout
- [ ] Create two-pane layout (240px sidebar + main content)
- [ ] Implement sidebar with fixed positioning
- [ ] Create main content area with proper margins
- [ ] Add bottom toolbar with button styling
- [ ] Ensure layout works on mobile with responsive behavior

#### 2.2 Sidebar Implementation
- [ ] Create smart lists section (Inbox, Today, Upcoming, Anytime, Someday, Logbook, Trash)
- [ ] Add sidebar icons with proper colors from design system:
  - Inbox: #007AFF
  - Today: #FF9500  
  - Upcoming: #FF3B30
  - Anytime: #5AC8FA
  - Someday: #FFCC00
  - Logbook: #34C759
  - Trash: #8E8E93
- [ ] Implement areas and projects hierarchical structure
- [ ] Add "New List" button at bottom of sidebar
- [ ] Create hover and active states for sidebar items

#### 2.3 Main Content Area Structure
- [ ] Create header section with title and actions
- [ ] Implement main content scrollable area
- [ ] Add empty state placeholders
- [ ] Create "Press ⌘N to create a new to-do" hint styling

### 3. Smart Lists Views
**Estimated Time: 3 days**

#### 3.1 Today View Implementation
- [ ] Create Today view layout matching `full-image.png`
- [ ] Implement calendar events section at top
- [ ] Add "Today" tasks section with proper spacing
- [ ] Create "This Evening" section with distinct styling
- [ ] Add task input area with placeholder text
- [ ] Style progress indicators and task counters

#### 3.2 Inbox View Implementation
- [ ] Create empty Inbox state with proper messaging
- [ ] Style for receiving dropped/created tasks
- [ ] Add quick task creation interface
- [ ] Implement task list container structure

#### 3.3 Upcoming View Implementation
- [ ] Create date-grouped task sections
- [ ] Style date headers with proper typography
- [ ] Implement expandable/collapsible date sections
- [ ] Add drag-drop visual indicators (static)

#### 3.4 Anytime View Implementation
- [ ] Create ungrouped task list layout
- [ ] Add filtering/sorting visual controls
- [ ] Style for high task volume scenarios

#### 3.5 Someday View Implementation
- [ ] Create distinct "ideas" styling approach
- [ ] Add visual distinction from active tasks
- [ ] Implement looser layout for brainstorming feel

#### 3.6 Logbook View Implementation
- [ ] Create completed task archive styling
- [ ] Add date-based grouping for historical items
- [ ] Style with muted colors to show completion

### 4. Task Components
**Estimated Time: 2 days**

#### 4.1 Task Card Implementation
- [ ] Create basic task card layout with checkbox and text
- [ ] Implement circular checkbox styling (20px, blue border)
- [ ] Add completed state with strikethrough text
- [ ] Style notes area with proper typography
- [ ] Add inline editing visual states
- [ ] Implement priority indicators

#### 4.2 Task Details Implementation
- [ ] Create expanded task card for editing
- [ ] Add notes area with rich text styling
- [ ] Implement tag selection interface
- [ ] Create date picker interface elements
- [ ] Add checklist sub-items styling
- [ ] Style attachment and link preview areas

#### 4.3 Magic Plus Button
- [ ] Create floating action button (48px circle, bottom right)
- [ ] Implement blue gradient background (#007AFF)
- [ ] Add proper shadow (0 4px 16px rgba(0,122,255,0.3))
- [ ] Create hover state animations
- [ ] Add pulse/scale effects for interaction feedback

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
- [ ] Analyze `area-dropdown.png` for exact styling
- [ ] Create dark background dropdown (#3C3C43)
- [ ] Implement white text on dark background
- [ ] Add "Add Tags", "Delete Area", "Share..." options
- [ ] Style menu items with proper hover states
- [ ] Add menu separators and icons

#### 6.2 New List Dropdown
- [ ] Analyze `new-list-dropdown.png` for layout
- [ ] Create "New Project" and "New Area" sections
- [ ] Add descriptive text for each option
- [ ] Style with proper background and shadows
- [ ] Implement hover states for menu items

#### 6.3 New Project Menu
- [ ] Analyze `new-project-menu.png` for functionality
- [ ] Create context menu for project actions
- [ ] Add options: Complete Project, When, Add Tags, Add Deadline, Move, Repeat, Duplicate Project, Delete Project, Share
- [ ] Style with dark theme consistency
- [ ] Add appropriate icons for each action

### 7. Interactive States and Animations
**Estimated Time: 1.5 days**

#### 7.1 Hover States
- [ ] Implement sidebar item hover backgrounds
- [ ] Add task card hover states
- [ ] Create button hover color transitions
- [ ] Add dropdown item hover effects
- [ ] Style magic plus button hover scaling

#### 7.2 Focus States
- [ ] Add keyboard focus indicators for accessibility
- [ ] Implement form input focus states
- [ ] Create navigation focus styling
- [ ] Add skip links for keyboard navigation

#### 7.3 Loading and Empty States
- [ ] Create loading skeleton animations
- [ ] Design empty state illustrations
- [ ] Add proper messaging for each empty view
- [ ] Style connection/offline indicators

### 8. Responsive Design Implementation
**Estimated Time: 1 day**

#### 8.1 Mobile Layout
- [ ] Create responsive sidebar (collapsible on mobile)
- [ ] Adjust task card spacing for touch
- [ ] Implement mobile-friendly dropdowns
- [ ] Optimize magic plus button for mobile

#### 8.2 Tablet Layout
- [ ] Optimize two-pane layout for tablet
- [ ] Adjust touch targets for tablet use
- [ ] Implement proper landscape orientation

### 9. CSS Architecture and Optimization
**Estimated Time: 0.5 days**

#### 9.1 Code Organization
- [ ] Organize CSS files by component/feature
- [ ] Implement CSS custom properties efficiently
- [ ] Remove unused styles and optimize file size
- [ ] Add CSS comments for complex styling rules

#### 9.2 Browser Compatibility
- [ ] Test in Chrome, Firefox, Safari, Edge
- [ ] Add vendor prefixes where needed
- [ ] Implement fallbacks for older browsers
- [ ] Validate HTML and CSS

### 10. Documentation and Handoff
**Estimated Time: 0.5 days**

#### 10.1 Create Implementation Guide
- [ ] Document CSS architecture decisions
- [ ] Create component style guide
- [ ] List all HTML classes and their purposes
- [ ] Note any deviations from original Things 3 design

#### 10.2 Prepare for React Conversion
- [ ] Identify reusable component patterns
- [ ] Document interactive behaviors to implement
- [ ] List dynamic content areas
- [ ] Note state management requirements

## Deliverables
- `public/static-prototype.html` - Complete static prototype
- `public/css/` - All CSS files organized by component
- `documentation/static-prototype-guide.md` - Implementation documentation
- Screenshots comparing static version to original Things 3 designs

## Success Criteria
- [ ] Pixel-perfect match to Things 3 design screenshots
- [ ] All colors match design system specification exactly
- [ ] Responsive design works on desktop, tablet, and mobile
- [ ] All interactive states (hover, focus) implemented
- [ ] HTML is semantic and accessible
- [ ] CSS is organized and maintainable
- [ ] Load time under 2 seconds on 3G connection

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