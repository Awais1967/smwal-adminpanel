# Admin Panel Frontend API Integration Overview

## Purpose

This document describes how the Make It Happen admin panel frontend should connect to the backend API. It is written for frontend and backend developers who need a shared understanding of the app structure, authentication flow, API service layer, expected response shapes, screen-level data needs, and the remaining work required to move the admin panel from local/mock state to production API data.

The admin panel is a React + Vite application located in `smwal-adminpanel`. It manages the operational areas of the platform:

- Matches
- Users
- Courses and lessons
- Events
- Mentorship sessions
- Billing and transactions
- Support tickets
- Message campaigns
- Organization settings
- Admin authentication

## Current Frontend Stack

The frontend uses:

- React 19
- Vite
- React Router
- Axios
- Tailwind CSS
- React Icons
- Recharts
- Local reusable UI components

Important frontend folders:

```text
src/components      Reusable feature and shared UI components
src/context         Auth and admin shell state
src/hooks           Shared hooks for pagination, debounce, modals, tables, toast
src/pages           Route-level admin screens
src/routes          Route config and route guards
src/services        Axios client, endpoints, and API service modules
src/config          Navigation, page metadata, table columns, select options
src/utils           Formatters, validators, constants, mapping helpers
```

## API Base URL

The frontend reads the API base URL from:

```env
VITE_API_URL=http://localhost:5000/api
```

Production example:

```env
VITE_API_URL=https://api.makeithappen.com/api
```

Axios is configured in:

```text
src/services/http.js
```

If `VITE_API_URL` is empty, the app enters mock mode. This is useful for local UI work, but production integration must always provide `VITE_API_URL`.

## Backend Route Alignment

The backend mounts all routes under:

```text
/api
```

Current backend admin authentication routes are:

```text
POST /api/admin/auth/login
GET  /api/admin/auth/me
POST /api/admin/auth/logout
POST /api/admin/auth/forgot-password
POST /api/admin/auth/reset-password
POST /api/admin/auth/create
```

Current frontend auth endpoint constants are:

```js
login: "/auth/login"
me: "/auth/me"
logout: "/auth/logout"
```

Before production integration, update the frontend admin auth endpoints to:

```js
login: "/admin/auth/login"
me: "/admin/auth/me"
logout: "/admin/auth/logout"
forgotPassword: "/admin/auth/forgot-password"
resetPassword: "/admin/auth/reset-password"
create: "/admin/auth/create"
```

The main admin panel routes can remain relative to `/api`, for example:

```text
GET /api/users
GET /api/matches
GET /api/dashboard/summary
GET /api/settings/basic
```

## Request Headers

Authenticated requests must send:

```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

The frontend already adds the bearer token from local storage in the Axios request interceptor:

```text
localStorage key: mih_admin_token
```

The current admin user is stored under:

```text
localStorage key: mih_admin_user
```

## Authentication Flow

The frontend auth state lives in:

```text
src/context/AuthContext.jsx
```

Expected login flow:

1. Admin submits email and password from the login page.
2. `authService.login()` sends `POST /admin/auth/login`.
3. Backend returns a JWT token and admin user object.
4. Frontend stores the token in `mih_admin_token`.
5. Frontend stores the user in `mih_admin_user`.
6. Protected routes become available.
7. On app refresh, `AuthProvider` calls `GET /admin/auth/me`.
8. If the token is invalid or expired, frontend clears local storage and returns to login.

Expected login payload:

```json
{
  "email": "admin@makeithappen.com",
  "password": "Admin@12345"
}
```

Expected login response:

```json
{
  "token": "jwt-token",
  "user": {
    "id": "admin_id",
    "name": "Admin User",
    "email": "admin@makeithappen.com",
    "role": "Super Admin",
    "status": "Active"
  }
}
```

Expected `GET /admin/auth/me` response:

```json
{
  "id": "admin_id",
  "name": "Admin User",
  "email": "admin@makeithappen.com",
  "role": "Super Admin",
  "status": "Active"
}
```

## Standard Response Shapes

List endpoints should return:

```json
{
  "items": [],
  "total": 0,
  "page": 1,
  "pageSize": 10
}
```

Single resource endpoints should return the resource directly:

```json
{
  "id": "resource_id",
  "name": "Example"
}
```

Create and update endpoints should return the created or updated resource:

```json
{
  "id": "resource_id",
  "name": "Updated Example"
}
```

Delete endpoints can return:

```json
{
  "success": true,
  "message": "Deleted successfully"
}
```

Error responses should return a readable `message` field:

```json
{
  "success": false,
  "message": "Human readable error message"
}
```

The Axios response interceptor converts backend errors into JavaScript `Error` objects using `response.data.message`, so clear messages matter for UI alerts and toast notifications.

## Query Parameters

Table-based screens should support server-side pagination, search, filters, and sorting.

Recommended common query parameters:

```text
page
pageSize
search
status
country
category
type
sortBy
sortOrder
```

The shared `useTableData` hook expects a fetcher that receives:

```js
{
  page,
  pageSize,
  search,
  filters
}
```

When connecting pages to APIs, flatten `filters` into API query params before calling service methods. Example:

```js
usersService.list({
  page,
  pageSize,
  search,
  status: filters.status,
  country: filters.country,
})
```

## Frontend Service Layer

API modules are already prepared in:

```text
src/services
```

Current service files:

```text
auth.service.js
matches.service.js
users.service.js
courses.service.js
lessons.service.js
events.service.js
mentorship.service.js
billing.service.js
support.service.js
settings.service.js
```

The shared endpoint constants are in:

```text
src/services/endpoints.js
```

Recommended rule:

Do not call Axios directly from page components. Add or update a service method first, then call the service from the page or a feature hook.

## Screen-by-Screen API Requirements

### Dashboard Summary

The admin shell and feature summary cards need aggregate metrics.

Recommended endpoint:

```text
GET /dashboard/summary
```

Expected response:

```json
{
  "users": {
    "total": 1200,
    "active": 980,
    "inactive": 220
  },
  "matches": {
    "total": 300,
    "active": 180,
    "pending": 95,
    "cancelled": 25
  },
  "courses": {
    "total": 24,
    "published": 18,
    "draft": 6
  },
  "events": {
    "total": 12,
    "upcoming": 8,
    "draft": 2,
    "closed": 2
  },
  "billing": {
    "revenue": 24500,
    "paid": 900,
    "pending": 80,
    "failed": 20
  },
  "support": {
    "total": 90,
    "new": 15,
    "inProgress": 20,
    "resolved": 55
  }
}
```

### Matches

Frontend service:

```text
src/services/matches.service.js
```

Endpoints:

```text
GET    /matches
GET    /matches/:id
PUT    /matches/:id
DELETE /matches/:id
```

List query support:

```text
page, pageSize, search, status, sortBy, sortOrder
```

Expected match object:

```json
{
  "id": "match_1",
  "user1": "Martin K.",
  "user2": "Sarah A.",
  "user1Email": "martin@email.com",
  "user2Email": "sarah@email.com",
  "status": "Active",
  "dateMatched": "2026-05-17",
  "startDate": "2026-05-17",
  "endDate": null
}
```

Statuses:

```text
Active, Pending, Cancelled
```

Frontend integration work:

- Replace local table rows with `matchesService.list`.
- Load details modal data from `matchesService.getById`.
- Persist status changes through `matchesService.update`.
- Persist deletes through `matchesService.remove`.
- Refresh the table after mutations.

### Users

Frontend service:

```text
src/services/users.service.js
```

Endpoints:

```text
GET    /users
GET    /users/:id
POST   /users
PUT    /users/:id
DELETE /users/:id
```

List query support:

```text
page, pageSize, search, status, country, gender, sortBy, sortOrder
```

Expected user object:

```json
{
  "id": "usr_1",
  "name": "Martin K.",
  "email": "martin@email.com",
  "phone": "+92 300 656 5460",
  "age": 28,
  "gender": "Male",
  "country": "UK",
  "city": "London",
  "married": "No",
  "status": "Active",
  "match": "",
  "portraitUrl": ""
}
```

Statuses:

```text
Active, Inactive
```

Frontend integration work:

- Replace `localStorage` user state in `UsersPage.jsx`.
- Use API pagination rather than client-side slicing.
- Upload portraits through upload API before user create/update if a file is selected.
- Keep modal forms controlled and submit through service methods.

### Courses

Frontend service:

```text
src/services/courses.service.js
```

Endpoints:

```text
GET    /courses
GET    /courses/:id
POST   /courses
PUT    /courses/:id
DELETE /courses/:id
```

List query support:

```text
page, pageSize, search, category, status, sortBy, sortOrder
```

Expected course object:

```json
{
  "id": "course_1",
  "title": "Purposeful Relationships",
  "category": "Foundations",
  "shortDescription": "Course summary",
  "lessons": 6,
  "status": "Published",
  "coverPhotoUrl": "",
  "updated": "2026-06-18"
}
```

Statuses:

```text
Published, Draft
```

Frontend integration work:

- Replace `localStorage` course state in `CoursesContentPage.jsx`.
- Use `coursesService.list`, `create`, `update`, and `remove`.
- Use a separate upload call for cover images if backend does not accept multipart on course endpoints.
- Refresh course detail tabs after course or lesson mutations.

### Lessons

Frontend service:

```text
src/services/lessons.service.js
```

Endpoints:

```text
GET    /lessons
GET    /courses/:courseId/lessons
POST   /lessons
PUT    /lessons/:id
DELETE /lessons/:id
```

Expected lesson object:

```json
{
  "id": "lesson_1",
  "courseId": "course_1",
  "title": "Lesson title",
  "type": "Video and Interactive",
  "summary": "Lesson summary",
  "duration": "10 minutes",
  "status": "Published",
  "attachmentUrl": ""
}
```

Statuses:

```text
Published, Draft
```

Frontend integration work:

- Connect lesson tables and modals to `lessonsService`.
- Support filtering lessons by selected course.
- Upload lesson attachments before create/update when needed.

### Events

Frontend service:

```text
src/services/events.service.js
```

Endpoints:

```text
GET    /events
GET    /events/:id
POST   /events
PUT    /events/:id
DELETE /events/:id
```

List query support:

```text
page, pageSize, search, status, country, sortBy, sortOrder
```

Expected event object:

```json
{
  "id": "evt_1",
  "name": "Community Hangout",
  "country": "UK",
  "city": "Manchester",
  "location": "Manchester, UK",
  "date": "2026-06-18",
  "startTime": "09:00",
  "endTime": "11:00",
  "fee": 15,
  "status": "Upcoming",
  "registrations": 18,
  "description": "Event summary",
  "coverPhotoUrl": ""
}
```

Statuses:

```text
Upcoming, Draft, Closed
```

Frontend integration work:

- Replace event `localStorage` state in `EventsPage.jsx`.
- Preserve ISO date strings from the API and format only in UI.
- Upload cover images before create/update when needed.
- Refresh summary cards after create, update, and delete.

### Mentorship Sessions

Frontend service:

```text
src/services/mentorship.service.js
```

Endpoints:

```text
GET    /mentorship-sessions
GET    /mentorship-sessions/:id
POST   /mentorship-sessions
PUT    /mentorship-sessions/:id
DELETE /mentorship-sessions/:id
```

List query support:

```text
page, pageSize, search, status, sessionType, sortBy, sortOrder
```

Expected mentorship session object:

```json
{
  "id": "session_1",
  "user1": "Martin K.",
  "user2": "Sarah A.",
  "topics": ["Effective communication"],
  "topic": "Effective communication",
  "status": "Scheduled",
  "date": "2026-02-17",
  "time": "10:00",
  "sessionType": "Remote",
  "slot": "2026-02-17 - 10:00",
  "created": "2026-02-10"
}
```

Statuses:

```text
Scheduled, Completed, Cancelled
```

Frontend integration work:

- Replace mentorship `localStorage` state in `MentorshipPage.jsx`.
- Use API data for add, edit, view, and delete modals.
- Validate date/time before sending payloads.

### Billing

Frontend service:

```text
src/services/billing.service.js
```

Endpoints:

```text
GET    /billing/transactions
GET    /billing/transactions/:id
DELETE /billing/transactions/:id
GET    /billing/transactions/revenue-breakdown
GET    /billing/transactions/revenue-overview
```

List query support:

```text
page, pageSize, search, status, paymentType, paymentMethod, sortBy, sortOrder
```

Expected transaction object:

```json
{
  "id": "txn_1",
  "user": "Martin K.",
  "transactionId": "TXN-92001",
  "txn": "TXN-92001",
  "email": "martin@email.com",
  "paymentType": "Subscription",
  "type": "Subscription",
  "paymentMethod": "Card",
  "amount": 19,
  "status": "Paid",
  "paymentDate": "2026-06-18",
  "date": "2026-06-18",
  "location": "London, UK"
}
```

Statuses:

```text
Paid, Pending, Failed
```

Expected revenue breakdown response:

```json
[
  { "name": "Subscriptions", "value": 45, "trend": "up" },
  { "name": "Events", "value": 30, "trend": "up" },
  { "name": "Donations", "value": 25, "trend": "down" }
]
```

Expected revenue overview response:

```json
[
  {
    "month": "Jan",
    "Subscriptions": 6000,
    "Events": 3000,
    "Donations": 2200
  }
]
```

Frontend integration work:

- Replace billing `localStorage` state in `BillingPage.jsx`.
- Use `billingService.revenueBreakdown` and `billingService.revenueOverview` for charts.
- Refresh charts after payment record changes if backend metrics are dynamic.

### Support Tickets

Frontend service:

```text
src/services/support.service.js
```

Endpoints:

```text
GET    /support/tickets
GET    /support/tickets/:id
POST   /support/tickets/:id/reply
PUT    /support/tickets/:id
DELETE /support/tickets/:id
```

List query support:

```text
page, pageSize, search, status, type, sortBy, sortOrder
```

Expected ticket object:

```json
{
  "id": "#1021",
  "ticketId": "#1021",
  "user": "Martin K.",
  "email": "martin@email.com",
  "type": "Account",
  "issueType": "Account",
  "status": "New",
  "date": "2026-06-18",
  "dateSubmitted": "2026-06-18",
  "message": "Support request message"
}
```

Reply payload:

```json
{
  "reply": "Support response text"
}
```

Statuses:

```text
New, In Progress, Resolved, Urgent
```

Frontend integration work:

- Replace support `localStorage` state in `SupportPage.jsx`.
- Load full ticket details from API when opening a ticket modal.
- Send replies through `supportService.reply`.
- Persist status changes through `supportService.update`.

### Messages and Campaigns

The Messages page currently uses local state. Add a frontend service file before integration:

```text
src/services/messages.service.js
```

Add endpoint constants:

```js
messages: {
  campaigns: "/messages/campaigns",
}
```

Recommended service methods:

```js
list(params)
getById(id)
create(payload)
update(id, payload)
remove(id)
summary(params)
```

Endpoints:

```text
GET    /messages/campaigns
GET    /messages/campaigns/:id
POST   /messages/campaigns
PUT    /messages/campaigns/:id
DELETE /messages/campaigns/:id
GET    /messages/campaigns/summary
```

Expected campaign object:

```json
{
  "id": "campaign_1",
  "campaignName": "June Re-engagement",
  "segment": "Inactive 30-Day Users",
  "recipients": 412,
  "status": "Sent",
  "sent": 40,
  "openRate": 71,
  "ctr": 28,
  "sendDate": "2026-04-02",
  "sendTime": "15:00",
  "priority": "Normal",
  "message": "Message body",
  "date": "Apr 2, 2026"
}
```

Statuses:

```text
Draft, Sent
```

Priorities:

```text
Low, Normal, High
```

Frontend integration work:

- Create `messages.service.js`.
- Replace message campaign `localStorage` state in `MessagesPage.jsx`.
- Use create/update endpoints for campaign composer modal.
- Refresh campaign metrics after sending or deleting.

### Settings

Frontend service:

```text
src/services/settings.service.js
```

Endpoints:

```text
GET    /settings/basic
PUT    /settings/basic
GET    /settings/members
POST   /settings/members
PUT    /settings/members/:id
DELETE /settings/members/:id
GET    /settings/email
PUT    /settings/email
POST   /settings/change-password
```

Expected basic settings object:

```json
{
  "ministryName": "Make It Happen",
  "country": "United States",
  "organizationType": "Non-profit"
}
```

Expected member object:

```json
{
  "id": "member_1",
  "name": "Ayesha Khan",
  "email": "ayesha@org.com",
  "role": "Admin",
  "status": "Active"
}
```

Expected email settings object:

```json
{
  "defaultSenderName": "Sarah Smith",
  "defaultSenderEmail": "support@org.com"
}
```

Change password payload:

```json
{
  "currentPassword": "old-password",
  "newPassword": "new-password",
  "confirmPassword": "new-password"
}
```

Frontend integration work:

- Replace settings `localStorage` state in `SettingsPage.jsx`.
- Load basic settings and email settings on page mount.
- Use `settingsService.listMembers` for members table.
- Refresh members after create, update, and delete.
- Clear password form after successful change.

## File Upload Integration

The frontend has file inputs for:

- User portraits
- Course cover photos
- Lesson attachments
- Event cover photos

Recommended upload endpoint:

```text
POST /uploads
```

Request format:

```http
Content-Type: multipart/form-data
Authorization: Bearer <jwt-token>
```

Request body:

```text
file=<selected-file>
folder=users|courses|lessons|events
```

Expected response:

```json
{
  "id": "asset_1",
  "url": "https://cdn.example.com/file.jpg",
  "name": "file.jpg",
  "type": "image/jpeg",
  "size": 123456
}
```

Recommended frontend flow:

1. User selects a file.
2. Frontend validates file type and size.
3. Frontend uploads the file to `/uploads`.
4. Backend returns the public `url`.
5. Frontend sends that `url` in the create/update payload for the feature resource.

Do not store raw `File` objects in API resource payloads unless the backend endpoint explicitly supports multipart resource creation.

## Loading, Empty, and Error States

Every API-connected screen should handle:

- Initial loading state
- Empty table state
- API error state
- Mutation loading state
- Success notification
- Validation error notification
- Refetch after mutation

The existing shared components support this pattern:

```text
SkeletonTable
SkeletonCard
EmptyState
Alert
Pagination
DataTable
Modal
DeleteConfirmModal
```

For tables, prefer the existing `useTableData` hook so search, pagination, and refresh behavior stays consistent.

## Data Mapping Rules

To keep frontend code simple, backend responses should use the field names expected by the UI where possible. If backend domain models use different names, add a small mapper in the service layer rather than spreading mapping logic across page components.

Recommended approach:

```text
Backend response -> service mapper -> page/component state
```

Examples:

- Convert Mongo `_id` to `id`.
- Convert date objects to ISO date strings.
- Convert nullable fields to empty strings only if the UI requires it.
- Keep status labels consistent with frontend select options.

## Date and Time Rules

Backend should return:

```text
Dates: YYYY-MM-DD or full ISO strings
Times: HH:mm in 24-hour format
DateTime: ISO 8601
```

Frontend should handle display formatting in UI only. API payloads should remain stable and machine-readable.

## Authorization and Roles

The admin panel should eventually support role-based access.

Suggested role levels:

```text
Super Admin
Admin
Support
Content Manager
Finance
Read Only
```

Recommended backend behavior:

- Return the current admin role from `/admin/auth/me`.
- Protect sensitive endpoints by role.
- Return `403` with a readable message when permission is denied.

Recommended frontend behavior:

- Hide or disable actions the current admin cannot perform.
- Still rely on backend permission checks for security.
- Show a readable error message for `403` responses.

## CORS Requirements

Backend CORS must allow:

```text
http://localhost:5173
https://makeithappen-mu.vercel.app
```

If credentials or cookies are introduced later, keep CORS credentials settings aligned. The current frontend uses bearer tokens in local storage, not cookies.

## Integration Checklist

1. Set `VITE_API_URL=http://localhost:5000/api` in the frontend `.env`.
2. Update frontend auth endpoints from `/auth/*` to `/admin/auth/*`.
3. Confirm backend returns standard list shapes: `{ items, total, page, pageSize }`.
4. Confirm backend errors include `message`.
5. Connect `AuthContext` to real admin auth.
6. Replace `localStorage` state in each page with service calls.
7. Add `messages.service.js` and message endpoint constants.
8. Add upload service for images and attachments.
9. Wire summary cards to `/dashboard/summary` or feature summary endpoints.
10. Add per-screen loading, empty, error, and mutation states.
11. Test token expiration and unauthorized redirects.
12. Test create, edit, delete, detail view, filters, search, and pagination for every module.

## Suggested Implementation Order

Use this order to reduce risk:

1. Auth endpoint alignment and real login.
2. Shared upload service.
3. Users page.
4. Courses and lessons.
5. Events.
6. Matches.
7. Mentorship sessions.
8. Support tickets.
9. Billing and charts.
10. Messages and campaigns.
11. Settings.
12. Dashboard summary metrics.

Auth should come first because every protected API depends on a valid token. Users and settings are good early modules because they prove basic CRUD, pagination, and validation patterns before moving into more complex screens.

## Testing Plan

Manual frontend checks:

- Login succeeds with a valid admin.
- Login shows backend message for invalid credentials.
- Refresh keeps the session if token is valid.
- Refresh logs out if token is invalid.
- Each table loads data from API.
- Search resets pagination to page 1.
- Filters reset pagination to page 1.
- Pagination requests the correct page.
- Create modals persist new records.
- Edit modals persist changes.
- Delete modals remove records.
- Detail modals show API data.
- File uploads return URLs and those URLs persist.
- Charts render with backend chart data.

Recommended automated checks:

- Unit tests for service mappers.
- Component tests for empty/loading/error states.
- Integration tests for auth redirect behavior.
- End-to-end tests for login and one complete CRUD module.

## Final Production Readiness Notes

Before release:

- Remove or disable mock behavior for production builds.
- Keep `VITE_API_URL` set in the deployment environment.
- Confirm backend rate limits do not block normal admin table usage.
- Confirm all admin routes require valid admin JWTs.
- Confirm all destructive actions require backend authorization.
- Confirm uploaded files are validated by type and size.
- Confirm all date fields render correctly across time zones.
- Confirm the frontend never exposes secrets in environment variables.

