# BloodLink Database Model Reference

This is a source-derived summary of the Mongoose models under `src/models/`. It describes application schemas and important references/indexes, not a MongoDB migration plan. Mongoose `ObjectId` references point to the named model; timestamps are enabled on the models that declare them.

Sensitive fields hidden by schema serialization or projections are noted. The API response shape may differ from the stored document; see [01-APP-API.md](01-APP-API.md) and [02-ADMIN-API.md](02-ADMIN-API.md).

## Accounts and Access

### `User`

- `fullName` (required, 3-100 chars), `email` (required, unique, lowercase), `phone` (required, unique), `password` (required, bcrypt hash, excluded from queries by default).
- `role`: `donor` or `user`; default `user`.
- `accountStatus`: `pending_verification`, `active`, `suspended`, `banned`, `deleted`; default `pending_verification`.
- `isEmailVerified`, `isVerified` booleans; `avatar: { url, publicId }`.
- `fcmTokens[]`: `{ token, platform, lastUsedAt }`; platform enum `android`, `ios`, `web` (default `android`).
- `emailOtp` and `passwordResetOtp`: hidden subdocuments `{ hash, expiresAt, attempts, lastSentAt }`.
- `lastLoginAt`; timestamps `createdAt`, `updatedAt`.
- JSON serialization removes `password`, both OTP subdocuments, and `__v`.

### `AdminUser`

- `fullName`, unique lowercase `email`, hidden bcrypt `password`, `role`, `isActive` (default true), `twoFactorEnabled` (default false), hidden encrypted `twoFactorSecret`, `lastLoginAt`, timestamps.
- Role enum: `super_admin`, `verification_admin`, `support_admin`, `content_admin`, `monitoring_admin`.
- JSON serialization removes `password`, `twoFactorSecret`, and `__v`.

### `RefreshToken`

- `user` reference to `User`; unique `tokenHash`; `userAgent`, `ip`, required `expiresAt`, `revokedAt`, `replacedByHash`, timestamps.
- TTL index on `expiresAt` automatically removes expired records. Raw refresh tokens are not stored.

### `Block`

- `blocker` and `blocked` references to `User`, timestamps.
- Unique compound index `{ blocker, blocked }`.

## Donor and Request Domain

### `DonorProfile`

- Unique `user` reference to `User`.
- `bloodGroup`: `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`.
- `gender`: `male`, `female`, `other`; required `weightKg` (1-500 at schema level); required `dateOfBirth`.
- `address`: required `division`, `district`, `upazila`; optional/default-empty `union`, `village`.
- `location`: GeoJSON Point with coordinates in `[longitude, latitude]` order.
- `lastDonationDate`, `nextEligibleDate`, `medicalHistory` (max 2,000), `totalDonationCount` (default 0).
- `availabilityStatus`: `available`, `unavailable`, `recently_donated`, `paused`; default `available`.
- `notificationPrefs`: `enabled`, `sos`, `urgent`, `regular` (default true), `radiusKm` (default 25; schema range 1-500).
- 2dsphere index on `location`; compound index on `{ bloodGroup, availabilityStatus }`.

### `BloodRequest`

- Unique generated `requestId` (`BL-` plus six uppercase hex characters); required `requester` reference to `User`.
- Required `patientName` (max 100), `bloodGroup`, `medicalProblem` (max 500), `hospitalName` (max 200), `hospitalAddress` (max 500), `numberOfBags` (1-10), `urgency`, `requiredDate` (`YYYY-MM-DD` string), `requiredTime` (`HH:mm` string), and Bangladesh-format `contactNumber`.
- `hospitalLocation`: GeoJSON Point `[longitude, latitude]`; optional `additionalNotes` max 1,000.
- `status`: `pending`, `searching_donors`, `donor_responded`, `donor_confirmed`, `blood_arranged`, `completed`, `cancelled`, `rejected`, `expired`; default `searching_donors`.
- `expiresAt` is set before validation according to urgency if not already provided: SOS 3 hours, urgent 24 hours, regular 72 hours.
- `interestedCount` defaults to 0; `confirmedDonor` references `User` or null; timestamps.
- Indexes: request ID, requester, blood group, urgency/status/created date, hospital location 2dsphere.

### `DonorResponse`

- `request` reference to `BloodRequest`; `donor` reference to `User`.
- `responseType`: `interested`, `not_available`, `contact_requester`; optional/default-empty `note` max 500; timestamps.
- Unique compound index `{ request, donor }`: a donor can respond once per request.

## Messaging

### `Conversation`

- `participants[]` references to `User`; optional `requestRef` to `BloodRequest`.
- `lastMessage`: `{ text, type, sender, createdAt }`; `unreadCounts` is a map keyed by user ID.
- Timestamps; indexes on participants and `lastMessage.createdAt`.

### `Message`

- `conversation` reference to `Conversation`; `sender` reference to `User`.
- `type`: `text`, `image`, `voice`, `location`.
- `text` max 2,000; `mediaUrl`; optional `durationSec`.
- `location: { latitude, longitude }`.
- `deliveredTo[]`, `readBy[]`, `deletedFor[]` reference `User`.
- Timestamps; index `{ conversation, createdAt: -1 }`.

## Donations, Verification, and Reports

### `DonationHistory`

- `donor` reference to `User`; optional `recipient` reference to `User`; optional `request` reference to `BloodRequest`.
- Required `bloodGroup`, `donationDate`, `hospitalName`; optional `hospitalAddress`, `notes`; `units` 1-2 (default 1).
- `status`: `confirmed`, `pending_confirmation`, `self_reported`, `rejected`; `source`: `bloodlink_request` or `donor_log`; `confirmedAt`; timestamps.
- Partial unique index `{ donor, request }` for records with an ObjectId request; index `{ donor, donationDate: -1 }`.

### `VerificationRequest`

- `user` reference to `User`; private image metadata in `nidImage` and `selfieImage` (`publicId`, `version`, `format`).
- Declared `nidNumber` (max 30), `fullNameAsPerNid` (max 100), `nidDateOfBirth`.
- `status`: `pending`, `approved`, `rejected`; `reviewedBy` reference to `AdminUser`; `reviewedAt`, `reviewReason` (max 500), `imagesPurgedAt`; timestamps.
- Partial unique index on `{ user, status }` only while status is `pending`.
- Approval purges the raw image objects, not the declared metadata or the verification record.

### `Report`

- `reporter` reference to `User`; optional `reportedUser` reference to `User`; optional `requestRef` to `BloodRequest`.
- `category`: `fake_request`, `fake_donor`, `commercial_selling`, `harassment`, `abuse`, `suspicious`, `other`.
- Required `description` max 2,000; `status`: `pending`, `reviewing`, `resolved`, `dismissed` (default `pending`); `adminNotes`; optional `resolvedBy` reference to `AdminUser`; timestamps.

## Notifications and Administration

### `Notification`

- `user` reference to `User`; `type` enum: `sos_request`, `urgent_request`, `regular_request`, `donor_response`, `new_message`, `verification_approved`, `verification_rejected`, `donation_reminder`, `security_alert`, `app_update`, `system`.
- Required `title` max 150, `body` max 500; `data` Mixed object default `{}`; `isRead` default false; `readAt`; timestamps.
- Index `{ user, isRead, createdAt: -1 }`.

### `NotificationJob`

- `request` reference to `BloodRequest`; `donor` reference to `User`; `channel` (`fcm`, `email`); `status` (`sent`, `failed`, `skipped`); `priorityScore`, `radiusKm`, `error`; timestamps.
- Unique compound index `{ request, donor, channel }` prevents repeat attempts through a channel for a request/donor pair.

### `AdminAuditLog`

- `admin` reference to `AdminUser`; `action`; `targetType`, `targetId`; Mixed `details`; `ip`; timestamps.
- Indexes on admin, action, and descending creation time. Action values are emitted by controller/service operations, not constrained by a schema enum.

### `AppConfig`

- Singleton identified by unique `singletonKey` (default `global`).
- Branding: `appName`, `logoUrl`, `primaryColor`, `secondaryColor`, `supportEmail`.
- Runtime flags: `maintenanceMode`, `maintenanceMessage`, boolean-map `featureFlags`, `onboarding[]` (`title`, `description`, `imageUrl`).
- Nested `appVersion`: `latestVersion`, `latestVersionCode`, `minimumSupportedVersionCode`, `apkUrl`, `forceUpdate`, `releaseNotes`, `fileSizeMB`, `sha256`.
- Defaults are declared in the model; the public config controller intentionally returns only a subset. See [01-APP-API.md](01-APP-API.md#public-website-and-app-apis).

## Public Directory

### `Hospital`

- `name` (required, max 200), `address` (required, max 500), `division`, `district` (required), `contactNumber` (max 20, default empty).
- Optional GeoJSON Point `location` `[longitude, latitude]`; `isVerified` defaults false; `isActive` defaults true; timestamps.
- Indexes: division, district, location 2dsphere, text index on name.

### `BloodBank`

- `name` (required, max 200), `address` (required, max 500), `division`, `district` (required), `contactNumber` (max 20, default empty).
- `availableGroups[]` uses blood group enum; optional GeoJSON Point `location` `[longitude, latitude]`; `isVerified` defaults false; `isActive` defaults true; timestamps.
- Indexes: division, district, location 2dsphere.

## Model-to-Model Flow

- `User` owns a `DonorProfile`, refresh tokens, notifications, and submitted reports/verification requests.
- `BloodRequest` belongs to a requester; responses reference both request and donor. Conversations can reference a request. Donation records can link donor, recipient, and request.
- Admin review records the acting `AdminUser` on verification requests, reports, and audit logs.
- Matching delivery attempts are tracked by `NotificationJob`; notification content/history is stored separately in `Notification`.
