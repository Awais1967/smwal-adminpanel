# Admin Panel Frontend API Integration Plan

Project: Make It Happen / SMWAL Admin Panel
Frontend: React + Vite
Backend Base URL: `/api`
Environment Variable: `VITE_API_URL=http://localhost:5000/api`

## Main Goal

Move the admin panel from mock/localStorage data to real backend API data module by module, without changing the existing UI design or breaking current frontend behavior.

## Core Integration Rules

* Do not call Axios directly inside page components.
* Use service files inside `src/services`.
* Keep the current UI layout, modals, tables, filters, pagination, and cards.
* Use the existing `useTableData` hook where possible.
* List APIs should support `{ items, total, page, pageSize }`.
* API errors should show readable backend `message`.
* All protected requests must send `Authorization: Bearer <token>`.
* Use `mih_admin_token` for token storage.
* Use `mih_admin_user` for current admin storage.
* Keep mock mode only for local UI fallback when `VITE_API_URL` is empty.
* Production must always use `VITE_API_URL`.

---

# Phase 1: API Foundation Setup

## Files to Review / Update

```text
src/services/http.js
src/services/endpoints.js
src/context/AuthContext.jsx
src/hooks/useTableData.js
src/utils
```

## Tasks

1. Confirm Axios base URL is reading:

```env
VITE_API_URL=http://localhost:5000/api
```

2. Confirm Axios adds token automatically:

```http
Authorization: Bearer <mih_admin_token>
```

3. Add or verify global error handling:

* `401` → clear token and redirect to login
* `403` → show permission error
* `404` → show not found message
* `422` → show validation message
* `500` → show server error message

4. Add a response normalizer if needed:

```js
normalizeListResponse(response) => {
  items,
  total,
  page,
  pageSize
}
```

5. Make sure table queries pass:

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

## Result

All modules can use one shared API system instead of repeating Axios logic.

---

# Phase 2: Admin Authentication Integration

## Backend Endpoints

```text
POST /admin/auth/login
GET  /admin/auth/me
POST /admin/auth/logout
POST /admin/auth/forgot-password
POST /admin/auth/reset-password
POST /admin/auth/create
```

## Frontend Files

```text
src/services/auth.service.js
src/services/endpoints.js
src/context/AuthContext.jsx
src/routes/ProtectedRoute.jsx
src/pages/LoginPage.jsx
```

## Required Endpoint Update

Current frontend endpoints:

```js
login: "/auth/login"
me: "/auth/me"
logout: "/auth/logout"
```

Update to:

```js
login: "/admin/auth/login"
me: "/admin/auth/me"
logout: "/admin/auth/logout"
forgotPassword: "/admin/auth/forgot-password"
resetPassword: "/admin/auth/reset-password"
create: "/admin/auth/create"
```

## Integration Tasks

* Connect login form with `authService.login`.
* Store token in `mih_admin_token`.
* Store admin user in `mih_admin_user`.
* On app refresh, call `/admin/auth/me`.
* If token is invalid, clear localStorage and redirect to login.
* Connect logout button to `/admin/auth/logout`.
* Show admin name, role, and status in topbar.

## Test Cases

* Valid admin login works.
* Invalid login shows backend message.
* Refresh keeps session active.
* Expired token redirects to login.
* Logout invalidates frontend session.

---

# Phase 3: Dashboard Summary Integration

## Backend Endpoint

```text
GET /dashboard/summary
```

## Frontend Files

```text
src/pages/DashboardPage.jsx
src/services/dashboard.service.js
src/services/endpoints.js
```

Create `dashboard.service.js` if missing.

## Expected Data

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

## Integration Tasks

* Replace mock dashboard cards with API data.
* Connect charts to backend summary data.
* Add loading skeletons.
* Add error state if dashboard API fails.
* Keep fallback values as `0`.

## Test Cases

* Dashboard loads after login.
* Dashboard shows empty state if all values are zero.
* Dashboard does not crash if some nested keys are missing.
* Unauthorized request redirects to login.

---

# Phase 4: Users Module Integration

## Backend Endpoints

```text
GET    /users
GET    /users/:id
POST   /users
PUT    /users/:id
DELETE /users/:id
```

## Query Params

```text
page
pageSize
search
status
country
gender
sortBy
sortOrder
```

## Frontend Files

```text
src/services/users.service.js
src/pages/UsersPage.jsx
src/components/users
```

## Expected User Object

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

## Integration Tasks

* Remove localStorage-based user data.
* Use `usersService.list` with `useTableData`.
* Connect search, status, country, and gender filters.
* Connect create user modal.
* Connect edit user modal.
* Connect delete confirmation modal.
* Load user detail by ID when opening detail drawer/modal.
* Add portrait upload before create/update if image is selected.

## Test Cases

* Users list loads from API.
* Pagination requests correct page.
* Search resets page to 1.
* Filters reset page to 1.
* Create user works.
* Edit user works.
* Delete user refreshes table.
* Invalid form shows backend validation message.

---

# Phase 5: Matches Module Integration

## Backend Endpoints

```text
GET    /matches
GET    /matches/:id
PUT    /matches/:id
DELETE /matches/:id
```

## Query Params

```text
page
pageSize
search
status
sortBy
sortOrder
```

## Frontend Files

```text
src/services/matches.service.js
src/pages/MatchesPage.jsx
src/components/matches
```

## Expected Match Object

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

## Statuses

```text
Active
Pending
Cancelled
```

## Integration Tasks

* Replace mock match table with `matchesService.list`.
* Add server-side status filter.
* Open detail modal using `matchesService.getById`.
* Update match status using `matchesService.update`.
* Delete match using `matchesService.remove`.
* Refresh table after update/delete.
* Show cancellation state and feedback fields if backend returns them.

## Test Cases

* Match list loads.
* Filter by Active/Pending/Cancelled works.
* Match detail opens.
* Status update persists.
* Delete removes match from list.
* Cancelled match displays end date.

---

# Phase 6: Courses Module Integration

## Backend Endpoints

```text
GET    /courses
GET    /courses/:id
POST   /courses
PUT    /courses/:id
DELETE /courses/:id
```

## Query Params

```text
page
pageSize
search
category
status
sortBy
sortOrder
```

## Frontend Files

```text
src/services/courses.service.js
src/pages/CoursesContentPage.jsx
src/components/courses
```

## Expected Course Object

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

## Integration Tasks

* Replace localStorage course data.
* Connect course list with API pagination.
* Connect course create/edit/delete.
* Upload cover image before saving if file selected.
* Refresh course table after mutation.
* Keep course status values aligned: Published, Draft.

## Test Cases

* Course list loads.
* Search courses works.
* Filter by category/status works.
* Create course works.
* Edit course works.
* Delete course works.
* Cover image URL saves correctly.

---

# Phase 7: Lessons Module Integration

## Backend Endpoints

```text
GET    /lessons
GET    /courses/:courseId/lessons
POST   /lessons
PUT    /lessons/:id
DELETE /lessons/:id
```

## Frontend Files

```text
src/services/lessons.service.js
src/pages/CoursesContentPage.jsx
src/components/lessons
```

## Expected Lesson Object

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

## Integration Tasks

* Load lessons by selected course.
* Connect add lesson modal.
* Connect edit lesson modal.
* Connect delete lesson action.
* Upload attachment before create/update if file selected.
* Refresh lesson list after mutation.
* Keep status values aligned: Published, Draft.

## Test Cases

* Lessons load for selected course.
* Add lesson works.
* Edit lesson works.
* Delete lesson works.
* Attachment URL saves correctly.
* Lesson table updates after course change.

---

# Phase 8: Events Module Integration

## Backend Endpoints

```text
GET    /events
GET    /events/:id
POST   /events
PUT    /events/:id
DELETE /events/:id
```

## Query Params

```text
page
pageSize
search
status
country
sortBy
sortOrder
```

## Frontend Files

```text
src/services/events.service.js
src/pages/EventsPage.jsx
src/components/events
```

## Expected Event Object

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

## Statuses

```text
Upcoming
Draft
Closed
```

## Integration Tasks

* Replace event localStorage data.
* Connect events table with `eventsService.list`.
* Add search, status, and country filters.
* Connect create/edit/delete event.
* Upload cover image before saving if selected.
* Preserve API date as ISO or `YYYY-MM-DD`.
* Format date only in UI.
* Refresh event summary cards after mutation.

## Test Cases

* Event list loads.
* Filter by country works.
* Filter by status works.
* Create event works.
* Edit event works.
* Delete event works.
* Closed/Draft event displays correctly.

---

# Phase 9: Mentorship Sessions Integration

## Backend Endpoints

```text
GET    /mentorship-sessions
GET    /mentorship-sessions/:id
POST   /mentorship-sessions
PUT    /mentorship-sessions/:id
DELETE /mentorship-sessions/:id
```

## Query Params

```text
page
pageSize
search
status
sessionType
sortBy
sortOrder
```

## Frontend Files

```text
src/services/mentorship.service.js
src/pages/MentorshipPage.jsx
src/components/mentorship
```

## Expected Object

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

## Statuses

```text
Scheduled
Completed
Cancelled
```

## Integration Tasks

* Replace localStorage mentorship data.
* Connect session list with API pagination.
* Connect add/edit/delete session modals.
* Validate date and time before request.
* Show topics as tags or comma-separated text.
* Refresh table after mutation.

## Test Cases

* Mentorship list loads.
* Filter by status works.
* Filter by sessionType works.
* Add session works.
* Edit session works.
* Delete session works.

---

# Phase 10: Billing & Transactions Integration

## Backend Endpoints

```text
GET    /billing/transactions
GET    /billing/transactions/:id
DELETE /billing/transactions/:id
GET    /billing/transactions/revenue-breakdown
GET    /billing/transactions/revenue-overview
```

## Query Params

```text
page
pageSize
search
status
paymentType
paymentMethod
sortBy
sortOrder
```

## Frontend Files

```text
src/services/billing.service.js
src/pages/BillingPage.jsx
src/components/billing
```

## Expected Transaction Object

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

## Statuses

```text
Paid
Pending
Failed
```

## Integration Tasks

* Replace billing localStorage data.
* Connect transaction table with API.
* Connect payment status/type/method filters.
* Connect revenue breakdown chart.
* Connect revenue overview chart.
* Open transaction detail using getById.
* Delete transaction only if allowed by backend.

## Test Cases

* Transaction list loads.
* Filter by payment type works.
* Filter by status works.
* Revenue charts load.
* Transaction detail opens.
* Delete works if backend allows.

---

# Phase 11: Support Tickets Integration

## Backend Endpoints

```text
GET    /support/tickets
GET    /support/tickets/:id
POST   /support/tickets/:id/reply
PUT    /support/tickets/:id
DELETE /support/tickets/:id
```

## Query Params

```text
page
pageSize
search
status
type
sortBy
sortOrder
```

## Frontend Files

```text
src/services/support.service.js
src/pages/SupportPage.jsx
src/components/support
```

## Expected Ticket Object

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

## Statuses

```text
New
In Progress
Resolved
Urgent
```

## Integration Tasks

* Replace support localStorage data.
* Connect ticket list with API.
* Open ticket detail with getById.
* Connect reply form with `supportService.reply`.
* Connect status update.
* Connect delete ticket if backend supports it.
* Refresh table after reply/status update.

## Test Cases

* Ticket list loads.
* Search works.
* Filter by status/type works.
* Detail modal opens.
* Reply submits.
* Status update persists.
* Delete works if allowed.

---

# Phase 12: Messages & Campaigns Integration

## New Frontend Service File

```text
src/services/messages.service.js
```

## Add Endpoint Constants

```js
messages: {
  campaigns: "/messages/campaigns",
  summary: "/messages/campaigns/summary"
}
```

## Backend Endpoints

```text
GET    /messages/campaigns
GET    /messages/campaigns/:id
POST   /messages/campaigns
PUT    /messages/campaigns/:id
DELETE /messages/campaigns/:id
GET    /messages/campaigns/summary
```

## Expected Campaign Object

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

## Statuses

```text
Draft
Sent
```

## Priorities

```text
Low
Normal
High
```

## Integration Tasks

* Create `messages.service.js`.
* Replace Messages page local state.
* Connect list, detail, create, update, delete.
* Connect campaign composer modal.
* Connect summary cards/charts if page has them.
* Refresh table after sending/deleting campaigns.

## Test Cases

* Campaign list loads.
* Create draft campaign works.
* Edit campaign works.
* Send campaign works if backend supports it.
* Delete campaign works.
* Summary endpoint loads metrics.

---

# Phase 13: Settings Integration

## Backend Endpoints

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

## Frontend Files

```text
src/services/settings.service.js
src/pages/SettingsPage.jsx
src/components/settings
```

## Expected Basic Settings

```json
{
  "ministryName": "Make It Happen",
  "country": "United States",
  "organizationType": "Non-profit"
}
```

## Expected Member Object

```json
{
  "id": "member_1",
  "name": "Ayesha Khan",
  "email": "ayesha@org.com",
  "role": "Admin",
  "status": "Active"
}
```

## Expected Email Settings

```json
{
  "defaultSenderName": "Sarah Smith",
  "defaultSenderEmail": "support@org.com"
}
```

## Change Password Payload

```json
{
  "currentPassword": "old-password",
  "newPassword": "new-password",
  "confirmPassword": "new-password"
}
```

## Integration Tasks

* Replace settings localStorage state.
* Load basic settings on page mount.
* Load email settings on page mount.
* Load organization members through API.
* Connect save basic settings.
* Connect save email settings.
* Connect add/edit/delete members.
* Connect change password form.
* Clear password fields after success.

## Test Cases

* Settings load correctly.
* Save basic settings works.
* Save email settings works.
* Add member works.
* Edit member works.
* Delete member works.
* Change password validates confirmation.

---

# Phase 14: File Upload Integration

## Recommended Endpoint

```text
POST /uploads
```

## Upload Use Cases

```text
User portraits
Course cover photos
Lesson attachments
Event cover photos
```

## Frontend File

```text
src/services/upload.service.js
```

## Request Format

```http
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

## Request Body

```text
file=<selected-file>
folder=users|courses|lessons|events
```

## Expected Response

```json
{
  "id": "asset_1",
  "url": "https://cdn.example.com/file.jpg",
  "name": "file.jpg",
  "type": "image/jpeg",
  "size": 123456
}
```

## Integration Tasks

* Create `upload.service.js`.
* Validate file type and size before upload.
* Upload file first.
* Use returned `url` in resource create/update payload.
* Do not send raw File object inside JSON payload.

## Test Cases

* Image upload works.
* Invalid file type blocked.
* Large file blocked.
* Returned URL saves in user/course/event/lesson payload.

---

# Phase 15: Final Integration QA

## Global Checks

* Login works with real backend.
* Every protected page redirects to login without token.
* Every table loads from API.
* Search works.
* Filters work.
* Pagination works.
* Create works.
* Edit works.
* Delete works.
* Detail modals load real API data.
* File uploads save URLs.
* Charts load backend data.
* API errors show readable toast messages.
* Loading skeletons appear while fetching.
* Empty states appear when no records exist.
* Frontend does not expose secrets.
* Production has `VITE_API_URL` configured.
* Mock behavior is disabled for production.

## Suggested Implementation Order

1. Auth endpoint alignment and login
2. Shared API client verification
3. Upload service
4. Users
5. Courses
6. Lessons
7. Events
8. Matches
9. Mentorship sessions
10. Support tickets
11. Billing and charts
12. Messages and campaigns
13. Settings
14. Dashboard summary
15. Final QA and cleanup

## Developer Notes

* Start with Auth because all other modules require token-based access.
* Integrate Users early because it proves CRUD, pagination, filters, modals, and upload flow.
* Integrate Courses and Lessons together because they are connected.
* Integrate Billing after payments are stable.
* Integrate Dashboard after all major modules are connected so summary metrics are accurate.
