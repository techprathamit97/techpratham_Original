# Course Priority System Implementation

## Overview
Added priority-based ordering system for courses and categories to control display order in navbar and course listings.

## Changes Made

### 1. Database Models
- **Course Model**: Added `priority` field (Number, default: 0, indexed)
- **Category Model**: Added `priority` field (Number, default: 0, indexed) and `displayInNavbar` field (Boolean, default: true)

### 2. API Updates
- **fetch-grouped**: Sorts courses by priority DESC, then createdAt DESC
- **fetch**: Sorts courses by priority DESC, then createdAt DESC  
- **filtered**: Sorts courses by priority DESC, then createdAt DESC
- **category/fetch**: Sorts categories by priority DESC, then position ASC

### 3. New APIs
- **course/priority**: Manage individual and batch course priority updates
- **migrate/course-priority**: Migration endpoint for existing courses
- **admin/course-priority-test**: Testing utilities for priority system

## Usage

### Setting Course Priority
```javascript
// Single course priority update
PUT /api/course/priority
{
  "courseId": "course_id_here",
  "priority": 50
}

// Batch update multiple courses
PATCH /api/course/priority  
{
  "updates": [
    {"courseId": "id1", "priority": 50},
    {"courseId": "id2", "priority": 30}
  ]
}
```

### Migration for Existing Courses
```javascript
// Check migration status
GET /api/migrate/course-priority

// Run migration (sets priority: 0 for courses without priority)
POST /api/migrate/course-priority
```

### Testing Priority System
```javascript
// View courses ordered by priority
GET /api/admin/course-priority-test

// Set sample priorities for testing
POST /api/admin/course-priority-test
```

## Priority Rules
- **Higher numbers = Higher priority** (displayed first)
- **Default priority = 0** for all existing courses
- **Trending courses** always appear first regardless of priority
- **Categories** sorted by priority first, then position
- **Courses within categories** sorted by priority first, then creation date

## Backward Compatibility
- All existing courses get priority: 0 by default
- No breaking changes to existing APIs
- Frontend components automatically use new ordering
- Migration is optional and safe to run multiple times

## Frontend Impact
- Navbar course dropdown automatically shows priority-ordered courses
- Course category pages show priority-ordered courses
- No frontend code changes required - ordering happens at API level