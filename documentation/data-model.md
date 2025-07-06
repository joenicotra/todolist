# Things 3 Clone - Data Model Documentation

## Overview
This document outlines the consistent data model used throughout the static prototype to ensure all counts, projects, and tasks align properly across different views.

## Smart Lists
- **Today**: 3 tasks (urgent items due today)
- **Upcoming**: 8 tasks (items due soon)
- **Anytime**: 15 tasks (no specific due date)
- **Someday**: 3 tasks (future ideas/goals)
- **Inbox**: 2 tasks (unprocessed items)

**Total Smart List Tasks**: 31 tasks

## Areas & Projects

### Work Area (15 tasks total)
**Projects (3):**
1. **Website Redesign** - 7 tasks (70% complete)
   - Design Phase: 3/3 complete
   - Development Phase: 2/3 complete  
   - Testing & Launch: 0/1 complete

2. **Client Presentation** - 5 tasks (60% complete)
   - Preparation: 2/3 complete
   - Delivery: 1/2 complete

3. **Team Training** - 1 task (100% complete)
   - Training Session: 1/1 complete

**Area-level tasks (2):**
- Review quarterly reports
- Schedule team meeting

### Personal Area (14 tasks total)
**Projects (2):**
1. **Home Improvement** - 4 tasks (50% complete)
   - Living Room: 1/2 complete
   - Kitchen: 1/2 complete

2. **Fitness Goals** - 8 tasks (25% complete)
   - Strength Training: 1/3 complete
   - Cardio & Health: 1/5 complete

**Area-level tasks (2):**
- Book dentist appointment
- Plan weekend trip

## Count Logic
- **Area counts**: Total tasks in area (project tasks + area-level tasks)
- **Project counts**: Total tasks within that specific project
- **Smart list counts**: Tasks filtered by due date/priority across all areas

## Navigation Structure
```
Sidebar
├── Smart Lists
│   ├── Today (3)
│   ├── Upcoming (8)
│   ├── Anytime (15)
│   └── Someday (3)
├── Inbox (2)
├── Work Area (15)
│   ├── Website Redesign (7)
│   ├── Client Presentation (5)
│   └── Team Training (1)
└── Personal Area (14)
    ├── Home Improvement (4)
    └── Fitness Goals (8)
```

## Progress Calculations
Progress percentages are calculated as: (completed tasks / total tasks) × 100

- Website Redesign: 5/7 = 71% → displayed as 70%
- Client Presentation: 3/5 = 60%
- Team Training: 1/1 = 100%
- Home Improvement: 2/4 = 50%
- Fitness Goals: 2/8 = 25%

## Data Consistency Rules
1. All sidebar counts must match the actual content in their respective views
2. Project progress indicators must reflect actual task completion ratios
3. Area views must show all projects that appear as nested items in the sidebar
4. Project cards must link to their corresponding detailed project views
5. Task counts in project cards must match the detailed project view task counts
