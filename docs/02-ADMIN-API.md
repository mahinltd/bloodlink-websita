# BloodLink Admin API Reference

This document reflects the backend routes registered in this repository. No Admin Panel source code is available in this workspace, so frontend calls and end-to-end compatibility are not verified.

## Connection and Authentication

Base URL: `https://api.bloodlink.tech/api/v1` as currently documented in the repository. Local default: `http://localhost:5000/api/v1`. Admin routes are under `/admin`.

Admin authentication is separate from user authentication: admin tokens are signed with `ADMIN_JWT_SECRET`, use the configured `ADMIN_JWT_EXPIRES_IN` lifetime (default 8h), and are sent as `Authorization: Bearer <adminToken>`. User access tokens cannot authenticate admin routes. `POST /admin/auth/logout` is a server-side audit action; it does not revoke or blacklist the stateless admin token.

Successful responses from the main admin controller use `{ success, statusCode, message, data }`. The directory controller uses its own smaller response envelope; details below. Validation errors from the shared validation middleware are HTTP 400 and include `errors`.

## Roles

`super_admin` bypasses all role checks. It is not creatable through the admin creation endpoint.

| Role | Route authorization in implementation |
|---|---|
| `super_admin` | All admin routes |
| `support_admin` | Users, donors, request moderation, report moderation, broadcast, directory reads |
| `monitoring_admin` | Request moderation, report moderation, system health, audit logs, directory reads |
| `content_admin` | Config, app version, directory reads and writes |
| `verification_admin` | Verification queue, details, approval and rejection |

The dashboard endpoint is available to every authenticated admin. Admin management endpoints are super-admin-only.

## Admin Authentication and Management

| Method | Path | Access | Request / response |
|---|---|---|---|
| POST | `/admin/auth/login` | Public, auth rate limit | `{ email, password }`; returns `{ admin, token }` or `{ requiresTwoFactor, pendingToken }` |
| POST | `/admin/auth/2fa/login` | Public, auth rate limit | `{ pendingToken, code }`; `code` is a six-digit TOTP |
| GET | `/admin/auth/me` | Any active admin | Current admin |
| POST | `/admin/auth/logout` | Any active admin | Audit event only; client should discard token |
| POST | `/admin/auth/2fa/setup` | Any active admin | No body; returns `otpauthUrl`, `manualKey` |
| POST | `/admin/auth/2fa/enable` | Any active admin | `{ code }`, six-digit TOTP |
| POST | `/admin/admins` | `super_admin` | `{ fullName, email, password, role }`; password 10-64 chars; role cannot be `super_admin` |
| GET | `/admin/admins` | `super_admin` | Admin list |
| PATCH | `/admin/admins/:id/deactivate` | `super_admin` | Deactivate another admin; self-deactivation is rejected |

If 2FA is enabled, the initial login token is a five-minute pending token and is not an API access token. Complete login with `/admin/auth/2fa/login`. TOTP request key is `code`, not `otp`.

## Dashboard and Moderation

| Method | Path | Access | Query / body |
|---|---|---|---|
| GET | `/admin/analytics/dashboard` | Any active admin | Counts/distributions for users, donors, requests, registrations, divisions, and pending queues |
| GET | `/admin/users` | `support_admin` | `search`, `status`, `role`, `verified`, `page`, `limit` |
| GET | `/admin/users/:id` | `support_admin` | User, donor profile, verification history, donation count, report count; FCM tokens removed |
| PATCH | `/admin/users/:id/status` | `support_admin` | `{ action: "suspend" | "ban" | "restore", reason? }` |
| GET | `/admin/donors` | `support_admin` | `bloodGroup`, `availability`, `verified`, `search`, `page`, `limit` |
| PATCH | `/admin/donors/:id/availability` | `support_admin` | `{ status: "available" | "unavailable" | "paused" }` |
| GET | `/admin/requests` | `support_admin`, `monitoring_admin` | `status`, `urgency`, `search`, `page`, `limit` |
| GET | `/admin/requests/:id` | `support_admin`, `monitoring_admin` | Request and responses |
| PATCH | `/admin/requests/:id/moderate` | `support_admin`, `monitoring_admin` | `{ action: "reject" | "close", reason? }` |
| GET | `/admin/reports` | `support_admin`, `monitoring_admin` | `status`, `category`, `page`, `limit` |
| PATCH | `/admin/reports/:id` | `support_admin`, `monitoring_admin` | `{ status: "reviewing" | "resolved" | "dismissed", adminNotes? }` |

Suspending or banning a user revokes user refresh tokens and clears FCM tokens; the action creates a security notification. Restoring sets the account status to active. Request moderation maps `reject` to `rejected` and `close` to `cancelled`; the requester and interested/contact-requesting donors are notified. Admin filters are read by controller but not all are strictly validated.

Dashboard response keys are `users` (total, donors, activeDonors, regularUsers, verified), `bloodGroupDistribution`, `requests` (active, sosActive, completed, cancelled, expired, total), `registrations` (daily, monthly), `divisionDistribution`, and `queues` (pendingVerifications, pendingReports). This is not the stale `requests.byStatus` shape previously shown in this guide.

## Verification

All verification admin paths require `verification_admin` (or `super_admin`).

| Method | Path | Request / response |
|---|---|---|
| GET | `/admin/verification/queue` | Optional `status` (`pending`, `approved`, `rejected`), `page`, `limit`; defaults to pending |
| GET | `/admin/verification/:id` | Details and fresh signed image URLs when images have not been purged |
| POST | `/admin/verification/:id/approve` | No body required; approves and purges raw images |
| POST | `/admin/verification/:id/reject` | `{ reason }`; trimmed, required, max 500 chars |

Approval marks the user verified, records reviewer/time, deletes raw NID/selfie files, and sends a user notification. Rejection records the reason and sends a notification; a new request can then be submitted. Signed URL lifetime is determined by the storage service; the inspected controller does not declare a duration in its response contract.

## Directory Endpoints

The backend currently registers two admin directory route modules at `/admin`, in this order: `admin.routes.js`, then `adminDirectory.routes.js`. They overlap and do not form one consistent CRUD contract. Do not treat the table as a single interchangeable API without checking which handler matches the HTTP method.

| Method | Path | Effective handler and access |
|---|---|---|
| GET | `/admin/hospitals`, `/admin/blood-banks` | `adminDirectory` list handler; active admin with `content_admin`, `support_admin`, or `monitoring_admin` (super admin also passes) |
| POST | `/admin/hospitals`, `/admin/blood-banks` | Earlier `admin.routes` handler; `content_admin`; validates `name`, `address`, `division`, `district`, optional `contactNumber`, `latitude`, `longitude`, `isVerified`; blood bank also accepts `availableGroups` |
| PATCH | `/admin/hospitals/:id`, `/admin/blood-banks/:id` | Earlier `admin.routes` handler; `content_admin`; updates using the `admin.controller` payload builder |
| DELETE | `/admin/hospitals/:id`, `/admin/blood-banks/:id` | Earlier `admin.routes` delete handler; `content_admin` |
| PUT | `/admin/hospitals/:id`, `/admin/blood-banks/:id` | `adminDirectory` update handler; `content_admin`; accepts its own field allowlist |
| PATCH | `/admin/hospitals/:id/verify`, `/admin/blood-banks/:id/verify` | `adminDirectory` verify handler; `{ isVerified: boolean }`; `content_admin` |

The earlier module shadows the legacy module's duplicate POST and DELETE handlers. The admin-controller directory schema uses `contactNumber`, latitude/longitude and blood-bank `availableGroups`. The legacy update handler accepts `phone`, `email`, `website`, `bloodGroups`, and `bloodGroupsAvailable` in its allowlist, although those are not fields in the current `Hospital`/`BloodBank` Mongoose schemas. Its list/create/update/verify responses do not consistently use the standard response envelope. This route overlap and field mismatch are implementation gaps, not just documentation differences.

Public, unauthenticated directory reads are separate routes: `GET /hospitals` and `GET /blood-banks` (without `/admin`); see [01-APP-API.md](01-APP-API.md#public-website-and-app-apis).

## Config, Version, Broadcast, Monitoring

| Method | Path | Access | Request / response |
|---|---|---|---|
| GET | `/admin/config` | `content_admin` | `{ config }` |
| PUT | `/admin/config` | `content_admin` | Partial supported public config fields: `appName`, `logoUrl`, `primaryColor`, `secondaryColor`, `supportEmail`, `maintenanceMode`, `maintenanceMessage`, `featureFlags`, `onboarding` |
| PUT | `/admin/app-version` | `content_admin` | Partial fields: `latestVersion`, `latestVersionCode`, `minimumSupportedVersionCode`, `apkUrl`, `forceUpdate`, `releaseNotes`, `fileSizeMB`, `sha256` |
| POST | `/admin/broadcast` | `support_admin` | `{ audience: "all" | "donors" | "users", title, body }` |
| POST | `/admin/notifications/broadcast` | `support_admin` | Same handler and payload as `/admin/broadcast` |
| GET | `/admin/system/health` | `monitoring_admin` | API, database, socket, notification counts, memory and cron-job status |
| GET | `/admin/audit-logs` | `monitoring_admin` | Optional `action` prefix, `adminId`, `page`, `limit` |

`/admin/config` allows the listed top-level fields; app version is a separate nested model object updated through `/admin/app-version`. The version validator accepts semver for `latestVersion`, integer version codes, a URL, boolean `forceUpdate`, release notes up to 2,000 chars, nonnegative file size, and a 64-character SHA-256 string.

Broadcast persists an in-app `system` notification for active users and sends FCM in batches of 100. Response data is `{ sent, pushSent }`; `sent` counts selected users, not confirmed device deliveries.

System health response includes `api`, `database`, `socket.onlineUsers`, `notifications24h` (`pushSent`, `pushFailed`, `emailsSent`), `memoryMB` (`rss`, `heapUsed`), and `cronJobs`. Audit log rows use the `AdminAuditLog` schema; action examples should be treated as event names, not an exhaustive fixed enum.

## Integration Caveats

- Use admin token endpoints and the exact `token` response property; the docs previously called it `accessToken`.
- Use `fullName` (not `name`) when creating admin users, and `code` (not `otp`) for TOTP.
- The duplicate directory route registration has inconsistent payload contracts and should be consolidated in backend code before relying on all documented CRUD variants as equivalent.
- This document verifies backend route wiring and implementations only. Confirm Admin Panel base URL, role-aware navigation, body fields, and error handling in its repository before claiming end-to-end alignment.
