# BloodLink App and Public API Reference

This reference describes the backend implementation in this repository. The Admin Panel, Website, and Android source repositories are not present here, so their configured URLs, request code, and actual compatibility cannot be verified from this workspace.

## Connection

- Local base URL: `http://localhost:5000/api/v1`
- Production base URL currently documented by the repository: `https://api.bloodlink.tech/api/v1`
- Prefix is configurable with `API_PREFIX`; port defaults to `5000`.
- HTTP clients use JSON and protected user routes require `Authorization: Bearer <userAccessToken>`.
- Origin-less requests (including typical native mobile requests) are allowed by CORS. Browser origins are restricted to `CLIENT_URL`, `ADMIN_URL`, `http://localhost:3000`, and `http://localhost:3001`.
- Root probes are `GET /` and `GET /health`; the API health endpoint is `GET /api/v1/health`.

## Response and Errors

Most controllers return `{ success, statusCode, message, data }`. Validation errors are HTTP 400 with `{ success: false, statusCode: 400, message, errors: [{ field, message }] }`. Errors may also be 401 (missing/invalid user token), 403 (authenticated but forbidden/inactive account), 404 (missing resource or route), 409 (duplicate/conflicting operation), 413 (oversize JSON body), and 429 (rate limit). Development errors can include a stack.

The legacy admin-directory list/create/update/verify handlers have a smaller envelope (`{ success, data }`, and sometimes `message`) and do not consistently include `statusCode`; see [02-ADMIN-API.md](02-ADMIN-API.md#directory-endpoints).

Pagination is supported only on endpoints that explicitly list `page` and `limit`. Shared pagination defaults to page 1, limit 20, and a route-specific maximum; it is not applied to every list.

## Authentication

User access-token lifetime defaults to 15 minutes and refresh-token lifetime to 30 days; both are configurable through `JWT_ACCESS_EXPIRES_IN` and `JWT_REFRESH_EXPIRES_IN`. OTP lifetime defaults to 10 minutes (`OTP_EXPIRES_IN_MINUTES`).

Registration creates a `pending_verification` user (and donor profile for donor registration), sends a four-digit email OTP, and returns `{ userId, email, role }`; it does not issue tokens. `POST /auth/verify-email` activates the account and returns `{ user, accessToken, refreshToken }`. Login returns user tokens and, for donors, the donor profile. A pending email verification returns HTTP 403 with `data.needsVerification` and `data.email`.

| Method | Path | Access | Request |
|---|---|---|---|
| POST | `/auth/register/user` | Public, auth rate limit | `fullName`, `email`, `phone`, `password` |
| POST | `/auth/register/donor` | Public, auth rate limit | User fields plus donor fields below |
| POST | `/auth/verify-email` | Public, auth rate limit | `email`, four-digit `otp` |
| POST | `/auth/resend-otp` | Public, auth rate limit | `email` |
| POST | `/auth/login` | Public, auth rate limit | `email`, `password` |
| POST | `/auth/refresh` | Public, auth rate limit | `refreshToken` |
| POST | `/auth/logout` | Public | `refreshToken`; revokes that refresh token |
| POST | `/auth/forgot-password` | Public, auth rate limit | `email`; enumeration-safe response |
| POST | `/auth/reset-password` | Public, auth rate limit | `email`, `otp`, `newPassword`; revokes all sessions |
| POST | `/auth/logout-all` | User bearer token | No body; revokes all user refresh tokens |
| POST | `/auth/change-password` | User bearer token | `currentPassword`, `newPassword`; response contains replacement tokens |
| GET | `/auth/me` | User bearer token | Returns user, donor profile or null, and latest verification status |

Registration donor fields: `bloodGroup`, `gender`, `weightKg`, `dateOfBirth`, `division`, `district`, and `upazila` are required. `union`, `village`, `lastDonationDate`, `medicalHistory`, and `totalDonationCount` are optional. Age must be 18 through 64, weight 30 through 300 kg, and phone must match `01[3-9]` plus eight digits. Passwords are 8-64 characters and must contain a letter and a number.

## User and Donor APIs

All paths in this section are protected by a user bearer token.

| Method | Path | Request / behavior |
|---|---|---|
| GET | `/users/me` | User and donor profile (null for non-donor) |
| PATCH | `/users/me` | Optional `fullName`, `phone` |
| POST | `/users/me/avatar` | Multipart field `avatar`; JPG/PNG/WEBP, max 5 MB |
| DELETE | `/users/me/avatar` | Remove avatar |
| POST | `/users/me/fcm-token` | `token`, optional `platform` (`android`, `ios`, `web`); maximum five tokens per user |
| DELETE | `/users/me/fcm-token` | `token` |
| POST | `/users/me/convert-to-donor` | Required donor registration fields; no credentials |
| DELETE | `/users/me` | `password`; soft-deletes account and revokes sessions |
| POST | `/users/:id/block` | Block user; messaging is disabled between either party |
| DELETE | `/users/:id/block` | Unblock user |
| GET | `/users/me/blocked` | Blocked users |
| GET | `/donors/search` | Filters below; user token required |
| GET | `/donors/me` | Donor only; own profile and `isEligibleNow` |
| PATCH | `/donors/me` | Optional profile/address/notification preference fields |
| PUT | `/donors/me/availability` | `{ "status": "available" | "unavailable" | "recently_donated" | "paused" }` |
| PUT | `/donors/me/location` | `{ "latitude": 23.8, "longitude": 90.4 }` |
| GET | `/donors/:id` | Donor profile; medical history and cooldown date are omitted |

`GET /donors/search` accepts `bloodGroup`, `division`, `district`, `upazila`, `availability`, `verified`, `latitude`, `longitude`, `radiusKm`, `page`, and `limit`. Coordinates must be supplied together. Radius is in km (maximum 500; implementation fallback is 50 km). A donor's phone is included only when availability is `available`. The implementation returns `donors` and pagination inside `data`.

## Blood Requests and Matching

All request and matching paths require a user bearer token. A donor account is additionally required for `/requests/:id/respond`.

| Method | Path | Request / behavior |
|---|---|---|
| POST | `/requests` | Create request; body fields below; queues matching asynchronously |
| GET | `/requests/feed` | `tab` (`sos`, `urgent`, `regular`), `bloodGroup`, `search`, `latitude`, `longitude`, `radiusKm`, `page`, `limit`; SOS-first ordering |
| GET | `/requests/my` | Own requests; optional `status`, `page`, `limit` |
| GET | `/requests/:id` | Request, `myResponse`, `isOwner` |
| PATCH | `/requests/:id/status` | `{ "status": "..." }`; requester only, transitions below |
| GET | `/requests/:id/responses` | Requester only |
| POST | `/requests/:id/respond` | Donor only; `responseType` (`interested`, `not_available`, `contact_requester`), optional `note` |
| POST | `/requests/:id/select-donor` | Requester only; `{ "donorId": "<user ObjectId>" }` |
| POST | `/matching/trigger/:requestId` | Requester only; rerun matching for active request |
| GET | `/matching/preview/:requestId` | Requester only; preview has no priority score |

Request creation requires `patientName`, `bloodGroup`, `medicalProblem`, `hospitalName`, `hospitalAddress`, `numberOfBags`, `urgency`, `requiredDate`, `requiredTime`, and `contactNumber`. Optional location must be supplied as top-level `latitude` and `longitude` (not a nested location object); optional `additionalNotes` is max 1,000 characters. Bag count is 1-10. Required date cannot be in the past; time is `HH:mm`.

`tab` is the feed filter used by the controller. Although `urgency` is accepted by the feed validator, the controller does not use it as a filter. The location query/body names are `latitude`, `longitude`, and `radiusKm`, not `lat`, `lng`, or `radius`.

Allowed requester status transitions are: `searching_donors` to `blood_arranged` or `cancelled`; `donor_responded` to `donor_confirmed`, `blood_arranged`, or `cancelled`; `donor_confirmed` to `blood_arranged` or `cancelled`; and `blood_arranged` to `completed` or `cancelled`. Other transitions return 400. Request urgency expiry is `sos` 3 hours, `urgent` 24 hours, `regular` 72 hours; request-expiry job checks every 10 minutes.

The matching engine uses the configured default radius, 25 km, 50 km, and configured maximum radius (deduplicated/sorted), and stops after reaching its 15-donor target. It filters by compatible blood group, available status, eligibility, and notification preferences. Priority score is an operational ranking only, not a medical eligibility score. Matching is queued on creation; SOS with no interested donor is escalated every 30 minutes at the maximum radius.

Compatible donor groups by required recipient group:

| Required group | Compatible donor groups |
|---|---|
| O- | O- |
| O+ | O-, O+ |
| A- | O-, A- |
| A+ | O-, O+, A-, A+ |
| B- | O-, B- |
| B+ | O-, O+, B-, B+ |
| AB- | O-, A-, B-, AB- |
| AB+ | All eight groups |

## Conversations and Messages

All endpoints require a user bearer token. Message creation is REST; real-time delivery is Socket.IO.

| Method | Path | Request / behavior |
|---|---|---|
| GET | `/conversations` | All user's conversations; implementation does not paginate |
| POST | `/conversations` | `participantId`, optional `requestRef` (MongoDB ObjectId); get-or-create |
| GET | `/conversations/:conversationId` | Participant only; details include `isOnline` and `isBlocked` |
| GET | `/conversations/:conversationId/messages` | Participant only; optional `before` ISO-8601 timestamp and `limit` (default 30, max 50) |
| POST | `/conversations/:conversationId/messages` | `type` and type-specific fields below |
| POST | `/messages/upload/image` | Multipart `image`; JPG/PNG/WEBP, max 5 MB; returns `mediaUrl` |
| POST | `/messages/upload/voice` | Multipart `voice`; supported audio types, max 10 MB; returns `mediaUrl` |
| DELETE | `/messages/:id` | Delete for the current user only |

Message types are `text` (`text`, max 2,000 chars), `image` (`mediaUrl`), `voice` (`mediaUrl`, optional `durationSec` 0-600), and `location` (top-level `latitude`, `longitude`). A malformed conversation ID returns 400, a nonexistent conversation 404, non-participant access 403, and messaging across a block 403.

## Notifications, Donations, Reports, Verification

| Method | Path | Request / behavior |
|---|---|---|
| GET | `/notifications` | Optional `unread=true`, `page`, `limit`; returns notifications, unread count, pagination |
| GET | `/notifications/unread-count` | Current unread count |
| PATCH | `/notifications/read-all` | Mark all current user's notifications read |
| PATCH | `/notifications/:id/read` | Mark one owned notification read |
| POST | `/donations` | Donor only; `donationDate`; optional `requestId`, `hospitalName`, `hospitalAddress`, `units` (1-2), `notes` |
| GET | `/donations/me` | Donor only; own history, page/limit |
| GET | `/donations/me/stats` | Donor only; history counts, eligibility dates, badges and disclaimer |
| GET | `/donations/me/badges` | Donor only; confirmed-donation milestones |
| GET | `/donations/to-confirm` | User token; donations awaiting the current user as recipient |
| POST | `/donations/:id/confirm` | Recipient only; confirm pending donation |
| POST | `/donations/:id/reject` | Recipient only; reject pending donation |
| GET | `/donations/:id/certificate` | Donor owner only; confirmed donations only |
| DELETE | `/donations/:id` | Donor owner only; confirmed records cannot be deleted |
| POST | `/reports` | `category`, `description`, and at least one of `reportedUser` or `requestRef` |
| GET | `/reports/my` | Current user's reports |
| POST | `/verification/submit` | Multipart `nid` and `selfie` files required; optional `nidNumber`, `fullNameAsPerNid`, `nidDateOfBirth` |
| GET | `/verification/my` | Current verification status; response includes `captureMethod: in_app_camera_only` |

Donation log `requestId` is a MongoDB request ObjectId, not the human-readable `BL-...` code. A request-linked donation must be logged by a donor who responded to that request; it awaits recipient confirmation. Without a request, `hospitalName` is required. Donation history statuses are `confirmed`, `pending_confirmation`, `self_reported`, and `rejected`. Badges count confirmed donations only. The 90-day cooldown is configurable and is a platform availability rule, not medical eligibility advice.

Report categories: `fake_request`, `fake_donor`, `commercial_selling`, `harassment`, `abuse`, `suspicious`, `other`. Reports require a user or request reference; the request field is named `requestRef`.

Verification images are private uploads; both files are required by the controller. The endpoint does not itself enforce camera capture; it returns a client instruction flag. Admin approval deletes raw images, while declared verification metadata remains stored. Pending duplicate submissions return 409.

## Public Website and App APIs

These routes are unauthenticated in the backend. The Website/Android clients are not present here, so their use is not verified.

| Method | Path | Query / response |
|---|---|---|
| GET | `/hospitals` | `division`, `district`, `search`, `page`, `limit`; `data.hospitals` and pagination; active records only; default limit 12, max 50 |
| GET | `/blood-banks` | `division`, `district`, `bloodGroup`, `search`, `page`, `limit`; `data.bloodBanks` and pagination; active records only; default limit 20, max 50 |
| GET | `/config` | Public safe config fields: app name, logo, primary color, support email, maintenance mode, feature flags, onboarding |
| GET | `/config/stats` | `totalDonors`, confirmed `totalDonations`, estimated `livesImpacted` (3 per donation), `requestsFulfilled` |
| GET | `/app-version` | Latest/minimum version codes, force update flag, APK URL, release notes, file size, SHA-256 |
| GET | `/health` | Under API prefix: runtime and database state |

`GET /config` omits `secondaryColor` and `maintenanceMessage` even though both exist in the model. `GET /app-version` returns version fields nested under response `data`.

## Constants

- Blood groups: `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`.
- Request statuses include `pending`, `searching_donors`, `donor_responded`, `donor_confirmed`, `blood_arranged`, `completed`, `cancelled`, `rejected`, `expired`.
- Donor availability: `available`, `unavailable`, `recently_donated`, `paused`.
- User roles: `user`, `donor`. Admin roles and permissions are in [02-ADMIN-API.md](02-ADMIN-API.md).

## Limits and Integration Notes

- General API rate limit: 300 requests per 15 minutes. Auth-limited endpoints: 30 per 15 minutes. These limits are applied in addition to the general limit.
- JSON request bodies are limited to 2 MB; image uploads to 5 MB; voice uploads to 10 MB.
- Several protected routes perform owner/participant checks in controllers, not only in the route declaration; send the user token consistently.
- This reference is backend-only. To verify zero cross-platform 400/404s, the platform repositories and deployed environment configuration must be checked against these paths, field names, enum values, and token handling.
