# Discord Frontend

The frontend for the Discord-style application. It is a Next.js App Router
application and should communicate with backend services through the API
gateway, not directly with internal service ports.

## Local development

Start the backend from the repository root:

```bash
docker compose up --build
```

Start the frontend in this directory:

```bash
npm install
npm run dev
```

The frontend runs at `http://localhost:4000`. The API gateway runs at
`http://localhost:3000`.

Create `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_MESSAGING_URL=http://localhost:3004
```

Use `NEXT_PUBLIC_API_URL` for REST requests. `NEXT_PUBLIC_MESSAGING_URL` is
needed for Socket.IO until the gateway exposes a messaging socket proxy.

## Frontend implementation checklist

### 1. Authentication and account

Implement these screens and flows:

- Login with email and password.
- Registration with `fullname`, `username`, `email`, `password`, and optional
  `mobile`, `dob`, and `image`.
- Google sign-in and callback handling.
- Forgot password, OTP verification, and password reset.
- Logout and protected-route redirects.
- Account details, profile image upload, password change, and user lookup.

REST endpoints:

| Method  | Gateway endpoint            | Frontend use                                   |
| ------- | --------------------------- | ---------------------------------------------- |
| `POST`  | `/api/auth/register`        | Multipart registration; image field is `image` |
| `POST`  | `/api/auth/login`           | Create authenticated session                   |
| `GET`   | `/api/auth/google`          | Start Google OAuth                             |
| `POST`  | `/api/auth/forget-password` | Send reset OTP                                 |
| `POST`  | `/api/auth/verify-otp`      | Verify email OTP                               |
| `PATCH` | `/api/auth/reset-password`  | Reset password with `newPasword`               |
| `POST`  | `/api/auth/logout`          | End session                                    |
| `GET`   | `/api/user/getme`           | Load current user                              |
| `POST`  | `/api/user/getuser`         | Find users                                     |
| `PATCH` | `/api/user/update-details`  | Update `mobile_no` or `dob`                    |
| `PATCH` | `/api/user/update-profile`  | Multipart profile image upload                 |
| `PATCH` | `/api/user/change-password` | Change password                                |

### 2. Servers and membership

Build the server list, server creation modal, server discovery/join flow,
server details, member list, kick confirmation, and leave/delete actions.

| Method   | Gateway endpoint                     | Frontend use                                            |
| -------- | ------------------------------------ | ------------------------------------------------------- |
| `POST`   | `/api/guild/create`                  | Create server; multipart fields are `icon` and `banner` |
| `GET`    | `/api/guild/getserver`               | Load servers for the current user                       |
| `GET`    | `/api/guild/getserver-details`       | Load selected server details                            |
| `POST`   | `/api/guild/join-server/:invitecode` | Join with invite code                                   |
| `DELETE` | `/api/guild/delete-server`           | Delete a server                                         |
| `POST`   | `/api/guild/kick/:serverid/:user`    | Remove a member                                         |
| `POST`   | `/api/guild/leave-server`            | Leave a server                                          |

### 3. Channels

Add a channel sidebar, create-channel dialog, channel editing, and channel
selection state. Load channels whenever the selected server changes.

| Method  | Gateway endpoint                     | Frontend use               |
| ------- | ------------------------------------ | -------------------------- |
| `POST`  | `/api/channel/create`                | Create a channel           |
| `PATCH` | `/api/channel/update/:channelid`     | Rename or update a channel |
| `POST`  | `/api/channel/getchannels/:serverId` | Load channels for a server |

### 4. Roles and permissions

Add role management to server settings. The UI should only show actions the
current member is allowed to perform and should handle forbidden responses.

| Method   | Gateway endpoint               | Frontend use      |
| -------- | ------------------------------ | ----------------- |
| `POST`   | `/api/role/create/:serverId`   | Create a role     |
| `PATCH`  | `/api/role/update/:serverId`   | Update a role     |
| `GET`    | `/api/role/getroles/:serverId` | Load server roles |
| `DELETE` | `/api/role/delete/:serverId`   | Delete a role     |

### 5. Messaging and realtime updates

Implement message history, message composer, optimistic/loading states, and
reconnection handling.

| Method | Gateway endpoint                         | Frontend use         |
| ------ | ---------------------------------------- | -------------------- |
| `POST` | `/api/message/getallmessages/:channelId` | Load channel history |
| `POST` | `/api/message/createmessage/:channelId`  | Send a message       |

The messaging service also exposes Socket.IO directly on port `3004`:

```ts
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_MESSAGING_URL!, {
  extraHeaders: {
    accesstoken: accessToken,
    refreshtoken: refreshToken,
  },
});

socket.emit("join-channel", channelId);
socket.on("new-message", handleNewMessage);
socket.emit("leave-channel", channelId);
```

The socket middleware currently expects `accesstoken` and `refreshtoken`
handshake headers. The backend emits `new-message` after a message is sent.
Keep the socket subscribed only to the currently selected channel.

## API client conventions

- Centralize requests in `app/lib/api.ts` or an equivalent client module.
- Prefix every REST path with `NEXT_PUBLIC_API_URL`.
- Send `credentials: "include"` so gateway cookies are included.
- Use `FormData` for registration, profile, and server image uploads; do not
  set the `Content-Type` header manually for multipart requests.
- Treat `401` as a session-expired state and redirect to `/auth/login`.
- Render backend validation errors beside the relevant form fields.
- Keep server, channel, user, and message state separate so changing a channel
  does not reload unrelated data.

Example request helper:

```ts
const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}
```

## Recommended frontend structure

```text
app/
	auth/                 login, register, password recovery
	dashboard/            server and channel workspace
	components/           shared UI and dialogs
	lib/api.ts            REST client
	lib/socket.ts         Socket.IO client lifecycle
	lib/types.ts          API and UI types
	stores/                session, server, channel, and message state
```

## Backend integration gaps to resolve

- `socket.io-client` is installed and the connection helper lives in
  `app/lib/socket.ts`.
- The API gateway proxies REST messaging routes but does not proxy Socket.IO.
  For local development, connect directly to port `3004`; for deployment,
  expose a gateway websocket route or configure the public messaging URL.
- The gateway protects every non-public path with JWT verification. Confirm
  whether the frontend should rely on the access-token cookie or receive token
  values for the Socket.IO handshake.
- The voice service has no frontend-facing routes documented yet. Voice-room
  UI should wait until its transport and API contract are available.

## Useful commands

```bash
npm run dev
npm run lint
npm run build
```
