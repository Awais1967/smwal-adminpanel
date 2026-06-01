# Make It Happen Admin Panel - Project Overview and Backend API Requirements

## Project Overview

Make It Happen Admin Panel is a React + Vite admin dashboard for managing the main platform operations. The frontend is built with React 19, React Router, Axios, Tailwind CSS, React Query dependencies, Recharts, and reusable internal UI components.

The dashboard currently covers these admin areas:

- Authentication and admin session management
- Matches management
- User profile management
- Courses and lessons content management
- Events management
- Mentorship session management
- Billing and transactions
- Support tickets and replies
- Message campaigns
- Organization settings, team members, email settings, and password changes

The frontend reads `VITE_API_URL` from the environment. If `VITE_API_URL` is empty, the app falls back to mock/local behavior. For backend integration, set:

```env
VITE_API_URL=https://your-api-domain.com/api
```

All authenticated API calls should accept:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

## Standard API Response Shape

For list endpoints, the frontend should receive paginated data:

```json
{
  "items": [],
  "total": 0,
  "page": 1,
  "pageSize": 10
}
```

Recommended list query parameters:

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

For single create/update/delete actions, return the changed resource or a success object:

```json
{
  "success": true
}
```

For errors, return:

```json
{
  "message": "Human readable error message"
}
```

## Required Backend APIs

### Auth

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/auth/login` | Admin login |
| `GET` | `/auth/me` | Get current authenticated admin |
| `POST` | `/auth/logout` | Logout current admin |
| `POST` | `/auth/forgot-password` | Send reset email |
| `POST` | `/auth/reset-password` | Reset password with token |
| `POST` | `/auth/request-access` | Submit admin access request |

Login payload:

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

Login response:

```json
{
  "token": "jwt-token",
  "user": {
    "id": "admin_1",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### Matches

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/matches` | List matches |
| `GET` | `/matches/:id` | Get match details |
| `PUT` | `/matches/:id` | Update match status/details |
| `DELETE` | `/matches/:id` | Delete/cancel match |

Expected match fields:

```json
{
  "id": "match_1",
  "user1": "Martin K.",
  "user2": "Sarah A.",
  "user1Email": "martin@email.com",
  "user2Email": "sarah@email.com",
  "status": "Active",
  "dateMatched": "2025-05-17",
  "startDate": "2025-05-17",
  "endDate": null
}
```

Statuses: `Active`, `Pending`, `Cancelled`.

### Users

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/users` | List users |
| `GET` | `/users/:id` | Get user profile |
| `POST` | `/users` | Create user |
| `PUT` | `/users/:id` | Update user |
| `DELETE` | `/users/:id` | Delete/deactivate user |

Expected user fields:

```json
{
  "id": "usr_1",
  "name": "Martin K.",
  "email": "martin@email.com",
  "phone": "+92 300 656 5460",
  "age": 28,
  "gender": "Male",
  "country": "UK",
  "city": "London, UK",
  "married": "No",
  "status": "Active",
  "match": "",
  "portraitUrl": ""
}
```

Statuses: `Active`, `Inactive`.

### Courses

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/courses` | List courses |
| `GET` | `/courses/:id` | Get course details |
| `POST` | `/courses` | Create course |
| `PUT` | `/courses/:id` | Update course |
| `DELETE` | `/courses/:id` | Delete course |

Expected course fields:

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

Statuses: `Published`, `Draft`.

### Lessons

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/lessons` | List all lessons |
| `GET` | `/courses/:courseId/lessons` | List lessons for one course |
| `POST` | `/lessons` | Create lesson |
| `PUT` | `/lessons/:id` | Update lesson |
| `DELETE` | `/lessons/:id` | Delete lesson |

Expected lesson fields:

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

### Events

The Events module lets admins create, publish, edit, review, and remove platform events. It supports public-facing event discovery indirectly by maintaining the event details users will eventually see, while the admin panel focuses on operational fields such as schedule, location, registration count, fee, publication status, and cover image.

Current frontend behavior is still mostly local-state/local-storage based, but the UI already expects the backend to replace that storage with a standard CRUD flow. Admins can:

- View a paginated table of events.
- Search by event name, location, city, or country.
- Filter by event status and country.
- Create a new event with name, country, city, date, start time, end time, fee, short description, and optional cover photo.
- Edit event details after creation.
- Change status between `Upcoming`, `Draft`, and `Closed`.
- View event details in a read-only modal.
- Delete an event from the platform.

Backend implementation notes:

- `date` should be returned as an ISO date string, for example `2025-06-18`.
- `startTime` and `endTime` should use `HH:mm` 24-hour format.
- `fee` should be numeric. The frontend can format currency labels.
- `registrations` should represent the current active registration count for the event.
- `location` can be returned for convenience, but `city` and `country` should also be returned as separate fields because the UI filters and displays them independently.
- New events should usually default to `Upcoming` when created from the current UI, unless the backend receives an explicit `Draft` status in a future version.
- Deleting an event may be implemented as a hard delete or a soft delete, but deleted events should not appear in the default `/events` list.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/events` | List events |
| `GET` | `/events/:id` | Get event details |
| `POST` | `/events` | Create event |
| `PUT` | `/events/:id` | Update event |
| `DELETE` | `/events/:id` | Delete event |

Expected event fields:

```json
{
  "id": "evt_1",
  "name": "Community Hangout",
  "country": "UK",
  "city": "Manchester",
  "location": "Manchester, UK",
  "date": "2025-06-18",
  "startTime": "09:00",
  "endTime": "11:00",
  "fee": 15,
  "status": "Upcoming",
  "registrations": 18,
  "description": "Event summary",
  "coverPhotoUrl": ""
}
```

Statuses: `Upcoming`, `Draft`, `Closed`.

### Mentorship Sessions

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/mentorship-sessions` | List mentorship sessions |
| `GET` | `/mentorship-sessions/:id` | Get session details |
| `POST` | `/mentorship-sessions` | Create session |
| `PUT` | `/mentorship-sessions/:id` | Update session |
| `DELETE` | `/mentorship-sessions/:id` | Delete/cancel session |

Expected mentorship fields:

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

Statuses: `Scheduled`, `Completed`, `Cancelled`.

### Billing

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/billing/transactions` | List transactions |
| `GET` | `/billing/transactions/:id` | Get transaction details |
| `DELETE` | `/billing/transactions/:id` | Delete/remove transaction record |
| `GET` | `/billing/transactions/revenue-breakdown` | Revenue donut chart data |
| `GET` | `/billing/transactions/revenue-overview` | Revenue monthly bar chart data |

Expected transaction fields:

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
  "paymentDate": "2025-06-18",
  "date": "2025-06-18",
  "location": "London, UK"
}
```

Statuses: `Paid`, `Pending`, `Failed`.

Revenue breakdown response:

```json
[
  { "name": "Subscriptions", "value": 45, "trend": "up" },
  { "name": "Events", "value": 30, "trend": "up" },
  { "name": "Donations", "value": 25, "trend": "down" }
]
```

Revenue overview response:

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

### Support

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/support/tickets` | List support tickets |
| `GET` | `/support/tickets/:id` | Get ticket details |
| `POST` | `/support/tickets/:id/reply` | Send ticket reply |
| `PUT` | `/support/tickets/:id` | Update ticket status/details |
| `DELETE` | `/support/tickets/:id` | Delete ticket |

Expected ticket fields:

```json
{
  "id": "#1021",
  "ticketId": "#1021",
  "user": "Martin K.",
  "email": "martin@email.com",
  "type": "Account",
  "issueType": "Account",
  "status": "New",
  "date": "2025-06-18",
  "dateSubmitted": "2025-06-18",
  "message": "Support request message"
}
```

Statuses: `New`, `In Progress`, `Resolved`, `Urgent`.

Reply payload:

```json
{
  "reply": "Support response text"
}
```

### Messages / Campaigns

The frontend has a full Messages UI, but no service file exists yet. Backend should add campaign APIs so this section can move away from local storage.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/messages/campaigns` | List message campaigns |
| `GET` | `/messages/campaigns/:id` | Get campaign details |
| `POST` | `/messages/campaigns` | Create draft or sent campaign |
| `PUT` | `/messages/campaigns/:id` | Update campaign |
| `DELETE` | `/messages/campaigns/:id` | Delete campaign |

Expected campaign fields:

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

Statuses: `Draft`, `Sent`.

Priorities: `Low`, `Normal`, `High`.

### Settings

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/settings/basic` | Get organization basic info |
| `PUT` | `/settings/basic` | Update organization basic info |
| `GET` | `/settings/members` | List admin/team members |
| `POST` | `/settings/members` | Create member |
| `PUT` | `/settings/members/:id` | Update member |
| `DELETE` | `/settings/members/:id` | Delete member |
| `GET` | `/settings/email` | Get email settings |
| `PUT` | `/settings/email` | Update email settings |
| `POST` | `/settings/change-password` | Change current admin password |

Basic settings fields:

```json
{
  "ministryName": "Make It Happen",
  "country": "United States",
  "organizationType": "Non-profit"
}
```

Member fields:

```json
{
  "id": "member_1",
  "name": "Ayesha Khan",
  "email": "ayesha@org.com",
  "role": "Admin",
  "status": "Active"
}
```

Email settings fields:

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

## File Uploads

The UI has file inputs for user portraits, course covers, lesson attachments, and event covers. The backend can support this either with multipart upload endpoints or a generic media upload API.

Recommended endpoint:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/uploads` | Upload image/file and return URL |

Recommended response:

```json
{
  "id": "asset_1",
  "url": "https://cdn.example.com/file.jpg",
  "name": "file.jpg",
  "type": "image/jpeg",
  "size": 123456
}
```

## Dashboard Summary APIs

Current summary cards use frontend static values. For production, add aggregate endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/dashboard/summary` | Global admin metrics |
| `GET` | `/users/summary` | User counts |
| `GET` | `/matches/summary` | Match counts |
| `GET` | `/courses/summary` | Course/lesson counts |
| `GET` | `/events/summary` | Event counts |
| `GET` | `/mentorship-sessions/summary` | Mentorship counts |
| `GET` | `/billing/summary` | Revenue/payment counts |
| `GET` | `/support/tickets/summary` | Ticket counts |
| `GET` | `/messages/campaigns/summary` | Campaign metrics |

## Frontend Integration Notes

- Existing endpoint constants are in `src/services/endpoints.js`.
- Axios setup is in `src/services/http.js`.
- Existing service modules already exist for auth, matches, users, courses, lessons, events, mentorship, billing, support, and settings.
- The current page components mostly use local seed data/local storage, so the next integration step is replacing those page-level local states with service calls.
- The frontend expects readable `message` values in failed API responses.
- Dates should preferably be returned as ISO strings from the backend. The frontend can format them for display.
