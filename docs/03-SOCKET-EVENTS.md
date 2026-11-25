# BloodLink Socket.IO Contract

This document describes events actually registered/emitted by the backend. Android, Website, and Admin Panel client implementations are not present in this workspace, so client subscription behavior is not verified.

## Connection and Authentication

- Local URL: `http://localhost:5000`; production URL currently documented by the repository: `https://api.bloodlink.tech`.
- Connect to the Socket.IO server at the API origin (not the `/api/v1` REST path).
- Authenticate with `auth: { token: <userAccessToken> }`; a `Bearer` token in the handshake Authorization header is also accepted.
- The socket uses the user JWT secret, not the admin JWT secret. Only an active user account is accepted.
- Allowed browser origins are configured `CLIENT_URL`, `ADMIN_URL`, and localhost ports 3000/3001. Origin-less clients are allowed.
- Successful connections join `user:<userId>`. Multiple device sockets for one user receive room events.
- Connect/disconnect presence events are sent only to users who share a conversation with that user. Presence changes only on first connection and final disconnect.

Example:

```js
import { io } from 'socket.io-client';

const socket = io('https://api.bloodlink.tech', {
  auth: { token: userAccessToken },
  transports: ['websocket'],
});
```

## Client to Server

| Event | Payload | Backend behavior |
|---|---|---|
| `typing` | `{ conversationId }` | If the sender belongs to the conversation, emit `typing` to the other participant(s) |
| `stop_typing` | `{ conversationId }` | If participant, emit `stop_typing` to other participant(s) |
| `message:delivered` | `{ messageId }` | Adds current user to message `deliveredTo`; emits receipt to message sender |
| `message:read` | `{ conversationId }` | For participants, marks incoming messages read, zeroes unread count, emits receipt to partner(s) |
| `location:start` | `{ conversationId }` | Starts a live-location session for this user/conversation |
| `location:update` | `{ conversationId, latitude, longitude }` | Emits only for an active session and numeric coordinates |
| `location:stop` | `{ conversationId }` | Stops active session and notifies partner(s) |
| `notification:get_count` | No payload | Emits the current unread count to all of this user's connected sockets |
| `notification:read` | `{ notificationId }` | Marks an owned notification read, then emits a fresh count |
| `notification:read_all` | No payload | Marks all current user's notifications read, then emits a fresh count |

Chat event handlers validate conversation participation for typing, read receipts, and live location. The `message:delivered` handler accepts only `messageId` and updates the message directly; clients should emit it only for messages actually delivered to the authenticated user.

## Server to Client

| Event | Payload | When emitted |
|---|---|---|
| `message:new` | `{ conversationId, message }` | New REST-created message; emitted to both sender and recipient user rooms |
| `message:delivered` | `{ conversationId, messageId, userId }` | Recipient emitted delivery receipt |
| `message:read` | `{ conversationId, readerId }` | Partner marked incoming messages read |
| `typing` | `{ conversationId, userId }` | Conversation partner is typing |
| `stop_typing` | `{ conversationId, userId }` | Conversation partner stopped typing |
| `user:online` | `{ userId }` | First socket connection for a user with conversation partners |
| `user:offline` | `{ userId }` | Last socket disconnect for that user |
| `location:started` | `{ conversationId, userId }` | Partner started a location session |
| `location:update` | `{ conversationId, userId, latitude, longitude, timestamp }` | Partner updated active location |
| `location:stopped` | `{ conversationId, userId }` | Partner stopped sharing or disconnected |
| `notification:new` | `{ type, title, body, data }` | Generic notification service emits to user room; payload does not include notification document ID |
| `notification:count` | `{ unreadCount }` | After socket notification count/read operations |
| `request:update` | Request status/response payload described below | Requester or responders receive a request change |

`message:new.message` is the populated message object; it is nested inside the wrapper and is not the entire event payload. It includes the conversation reference, sender, type, content/media/location values, and timestamps as returned by Mongoose.

### `request:update`

On a donor response, the requester receives:

```json
{
  "requestId": "<MongoDB ObjectId>",
  "requestCode": "BL-XXXXXX",
  "status": "donor_responded",
  "interestedCount": 1,
  "newResponse": {
    "donorId": "<user ObjectId>",
    "donorName": "Donor name",
    "responseType": "interested"
  }
}
```

On requester status change, the requester and donor responders receive:

```json
{
  "requestId": "<MongoDB ObjectId>",
  "requestCode": "BL-XXXXXX",
  "status": "blood_arranged"
}
```

`requestId` in the socket payload is the MongoDB document ID. `requestCode` is the human-readable `BL-...` ID.

## REST and Socket Flow

Messages are sent through `POST /api/v1/conversations/:conversationId/messages`. The server stores the message, emits `message:new` to the user's and partner's rooms, and creates a notification/FCM push if the partner is offline. The receiving client may emit `message:delivered`; when the conversation is read it may emit `message:read`. The backend stores delivery/read state in message documents and emits receipts to the sender.

The `message:delivered` event payload is only `{ messageId }`; `conversationId` is not used by that handler. Read receipts require `{ conversationId }`. See [01-APP-API.md](01-APP-API.md#conversations-and-messages) for REST endpoint details.

Generic notification service calls emit `notification:new`; matching notifications are persisted and sent via FCM in the matching service but are not emitted through that generic socket event path. Do not assume every notification row results in a `notification:new` event.

Live-location coordinates are named `latitude` and `longitude`, not `lat` and `lng`. Disconnect automatically stops that user's active location sessions. The implementation broadcasts disconnect `location:stopped` events at namespace level.

## Client Lifecycle

Clients should connect with a current user access token after user authentication and disconnect on logout. On token expiry, refresh using the REST auth flow, then reconnect with the new access token. On app foreground, `notification:get_count` can request a fresh unread count. Live location is session-based and only emits updates after `location:start`.
