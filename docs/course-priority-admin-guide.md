# Course Priority Management - Admin Guide

## Overview
The course priority system allows you to control the order in which courses appear in the navbar dropdown and course listings. **Lower priority numbers appear first** (1=first position, 2=second position, 3=third position, etc.).

## Priority System Rules

### Priority Order
- **Priority 1** = First position (highest priority)
- **Priority 2** = Second position  
- **Priority 3** = Third position
- **Priority 4** = Fourth position
- **And so on...**
- **Priority 0 or no priority** = Default order (appears last, sorted by creation date)

### Display Order
1. **Trending courses** always appear first (regardless of priority)
2. **Regular courses** sorted by priority (1, 2, 3, 4, 5...)
3. **Same priority** courses sorted by creation date (newest first)
4. **Courses without priority** appear last

## How to Set Course Priority

### 1. Individual Course Priority (Manual)
- Go to `/admin/dashboard/courses/update/{course-link}`
- Find the "Course Priority" field in the "Course Settings" section
- Enter a number:
  - **1** = First position (highest priority)
  - **2** = Second position
  - **3** = Third position
  - **0** = Default order (appears last)
- Save the course

### 2. Cache Refresh (Important!)
After updating priorities, refresh the cache to see changes immediately:

```bash
# Refresh navbar cache to see updated order
POST /api/admin/refresh-navbar-cache
```

## API Endpoints

### Course Priority Management
```bash
# Update single course priority
PUT /api/course/priority
{
  "courseId": "course_id_here",
  "priority": 1
}

# Refresh cache after priority changes
POST /api/admin/refresh-navbar-cache
```

### Debug & Testing
```bash
# Check current priority order
GET /api/admin/debug-course-priorities

# Test priority ordering
GET /api/admin/course-priority-test
```

## Example Usage

### Scenario: Set Course Display Order
1. **Workday Adaptive Planning**: Set priority to **1** (appears first)
2. **Workday HCM Technical Training**: Set priority to **2** (appears second)  
3. **Workday Finance Training**: Set priority to **3** (appears third)
4. **Other courses**: Leave priority as **0** (appear last in creation order)

### After Setting Priorities:
1. Save each course with its priority
2. Call `POST /api/admin/refresh-navbar-cache` to refresh cache
3. Check navbar dropdown to see new order

## Troubleshooting

### Priority Not Working
1. **Check Cache**: Call refresh cache endpoint after priority changes
2. **Verify Priority Values**: Ensure priority is set correctly (1, 2, 3...)
3. **Check Trending Status**: Trending courses always appear first regardless of priority
4. **Wait for Cache**: Cache refreshes automatically every 60 seconds

### Course Still in Wrong Position
1. Verify the course priority is saved in database
2. Check if other courses have conflicting priorities
3. Use debug endpoint to see current sorting order
4. Refresh cache manually using the refresh endpoint

## Best Practices

### Priority Assignment
- **Reserve 1-10** for most important courses
- **Use gaps** (1, 3, 5, 7...) to allow inserting courses later
- **Group by importance** rather than using consecutive numbers
- **Document priorities** to avoid conflicts

### Maintenance
- Review priorities monthly
- Update based on course performance  
- Keep trending courses separate from priority system
- Use cache refresh after bulk priority updates