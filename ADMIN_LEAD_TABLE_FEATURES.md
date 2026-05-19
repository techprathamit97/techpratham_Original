# Admin Lead Table - Source Tracking Features

## Table Columns (in order)
1. **Name** - Lead's full name
2. **Email** - Lead's email address
3. **Phone** - Lead's phone number (formatted)
4. **Course** - Course they're interested in
5. **Message** - Lead's message (with Show More/Less toggle)
6. **Form Type** - Type of form submitted (course-callback, Reach out to us, etc.)
7. **Source** ⭐ - **NEW: Shows where the lead came from**
8. **IP Address** - Lead's IP address
9. **Country** - Lead's country (geo-located from IP)
10. **Date** - When the lead was submitted

## Source Column Details

### Visual Indicators (Color-Coded Badges)

#### 🔵 Google Ads (Blue Badge)
```
Badge: "Google Ads"
Background: bg-blue-600
Text: white
Meaning: Lead came from Google Ads campaign
```

#### 🟢 Website Form (Green Badge)
```
Badge: "Website Form"
Background: bg-green-600
Text: white
Meaning: Lead came from organic/direct traffic (SEO, direct visit, etc.)
```

#### ⚫ Other (Gray Badge)
```
Badge: "Other"
Background: bg-gray-600
Text: white
Meaning: Lead source is unknown or other
```

## Filtering & Search

### Source Filter Dropdown
Located in the toolbar above the table:
- **All Sources** - Show all leads (default)
- **Google Ads** - Show only Google Ads leads
- **Website Form** - Show only website form leads
- **Other** - Show only other source leads

### Search
Search box includes source field, so you can search for:
- "google_ads" - Find all Google Ads leads
- "website_form" - Find all website form leads

## PDF Export

When you download the PDF report, it includes:
- All filtered leads
- Source column with proper formatting:
  - "Google Ads" for google_ads
  - "Website Form" for website_form
  - "Other" for other sources

## Example Table View

```
Name          | Email              | Phone        | Course    | Form Type      | Source        | IP Address    | Country | Date
--------------|-------------------|--------------|-----------|----------------|---------------|---------------|---------|----------
John Doe      | john@email.com     | +91-9876...  | Python    | course-callback| Google Ads    | 203.0.113.45  | India   | 1/15/2025
Jane Smith    | jane@email.com     | +91-9876...  | Java      | Reach out to us| Website Form  | 198.51.100.23 | India   | 1/15/2025
Bob Johnson   | bob@email.com      | +91-9876...  | Web Dev   | course-callback| Website Form  | 192.0.2.15    | India   | 1/14/2025
```

## How Source is Determined

### Google Ads Source
Lead is marked as "Google Ads" when:
- ✅ Visitor has GCLID parameter in URL (from Google Ads click)
- ✅ Visitor has utm_source=google parameter
- ✅ Form submitted successfully

### Website Form Source
Lead is marked as "Website Form" when:
- ✅ Visitor has NO GCLID parameter
- ✅ Visitor has NO utm_source=google parameter
- ✅ Form submitted successfully
- Examples: Organic search, direct visit, social media, etc.

## Admin Dashboard Benefits

✅ **Quick Identification** - See at a glance which leads came from Google Ads
✅ **ROI Tracking** - Compare Google Ads leads vs organic leads
✅ **Budget Analysis** - Understand which channel brings better quality leads
✅ **Filtering** - Quickly filter to see only Google Ads or organic leads
✅ **Reporting** - Export PDF with source information for stakeholders

## Implementation Details

**File**: `pages/admin/dashboard/lead.tsx`

**Key Features**:
- Source filter state: `sourceFilter`
- Filter logic in `filteredData` useMemo
- Color-coded badge rendering in table rows
- PDF export includes source field
- Search includes source field

**Database Model**: `models/Lead.ts`
```typescript
source: {
    type: String,
    enum: ['google_ads', 'website_form', 'other'],
    default: 'website_form'
}
```

## Usage Tips

1. **Filter by Source**: Use the dropdown to see only Google Ads or Website Form leads
2. **Search**: Type "google_ads" or "website_form" in search to find specific sources
3. **Export**: Download PDF to share lead source breakdown with team
4. **Analyze**: Compare conversion rates between Google Ads and organic traffic
5. **Optimize**: Use source data to optimize marketing spend
