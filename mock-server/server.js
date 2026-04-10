// Minimal mock server for Nexa client E2E tests
// Implements the same API contracts as the real nexa-server backend.
// No business logic – only enough data for the UI to render correctly.

const express = require('express');
const cors = require('cors');
const {v4: uuidv4} = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // parse form-encoded bodies (refresh_token, etc.)
app.use((req, res, next) => {
  console.log(req.method, req.path, req.body)
  next()
})

// ── In-memory user store ──────────────────────────────────────────────────────
let users = [];

function seed() {
  users = [
    {
      id: uuidv4(),
      username: 'superadmin',
      password: 'superadmin123',
      name: 'Super Admin',
      role: 'ADMIN',
      gender: 'Male',
      dob: null,
      avatar: null,
    },
  ];
}

seed();

// ── Token helpers (simple base64 JSON — for mocking only) ────────────────────
function createTokens(userId) {
  const access = Buffer.from(JSON.stringify({userId, type: 'access'})).toString('base64');
  const refresh = Buffer.from(JSON.stringify({userId, type: 'refresh'})).toString('base64');
  return {accessToken: access, refreshToken: refresh};
}

function getUserFromAuthHeader(authHeader) {
  if (!authHeader?.startsWith('Bearer ')) return null;
  try {
    const {userId} = JSON.parse(Buffer.from(authHeader.slice(7), 'base64').toString());
    return users.find(u => u.id === userId) ?? null;
  } catch {
    return null;
  }
}

function toProfile(user) {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    gender: user.gender,
    dob: user.dob,
  };
}

function toAccountResponse(user) {
  return {
    profile: toProfile(user),
    accessToken: createTokens(user.id),
  };
}

function genderToLabel(value) {
  const n = parseFloat(value);
  if (isNaN(n)) return 'Non-binary';
  if (n <= 0.1) return 'Male';
  if (n <= 0.4) return 'More masculine';
  if (n <= 0.6) return 'Non-binary';
  if (n <= 0.9) return 'More feminine';
  return 'Female';
}

// ── Routes ────────────────────────────────────────────────────────────────────

// POST /user-login
// Supports two modes:
//   1. Admin credential login: body { username, password }
//   2. Google OIDC login: OIDC-Token header present (mocked — creates/returns a USER)
app.post('/user-login', (req, res) => {
  if (req.headers['oidc-token']) {
    let user = users.find(u => u.role === 'USER');
    if (!user) {
      user = {
        id: uuidv4(),
        username: 'google_user',
        password: null,
        name: 'Google User',
        role: 'USER',
        gender: 'Non-binary',
        dob: null,
        avatar: null,
      };
      users.push(user);
    }
    return res.json(toAccountResponse(user));
  }

  const {username, password} = req.body ?? {};
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({title: 'Unauthorized', detail: 'Username not found', status: 401});
  }
  if (user.password !== password) {
    return res.status(401).json({title: 'Unauthorized', detail: 'Wrong password', status: 401});
  }
  res.json(toAccountResponse(user));
});

// POST /tokens/refresh  (refresh_token in form-encoded body)
app.post('/tokens/refresh', (req, res) => {
  const rawToken = req.body?.refresh_token;
  if (!rawToken) return res.status(401).json({title: 'Unauthorized', status: 401});
  try {
    const {userId} = JSON.parse(Buffer.from(rawToken, 'base64').toString());
    const user = users.find(u => u.id === userId);
    if (!user) return res.status(401).json({title: 'Unauthorized', status: 401});
    res.json(toAccountResponse(user));
  } catch {
    return res.status(401).json({title: 'Unauthorized', status: 401});
  }
});

// POST /logout  (refresh_token in form-encoded body)
app.post('/logout', (req, res) => {
  // In the real server this invalidates the refresh token server-side.
  // Mock just acknowledges the request.
  res.status(200).json({ok: true});
});

// POST /admins — register a new admin (caller must be an existing ADMIN)
app.post('/admins', (req, res) => {
  const caller = getUserFromAuthHeader(req.headers.authorization);
  if (!caller || caller.role !== 'ADMIN') {
    return res.status(401).json({title: 'Unauthorized', status: 401});
  }

  const {username, name, password, gender, dob, avatar} = req.body ?? {};
  if (users.find(u => u.username === username)) {
    return res.status(409).json({title: 'Conflict', detail: 'Username already exists', status: 409});
  }

  const newAdmin = {
    id: uuidv4(),
    username,
    name,
    password: password ?? null,
    role: 'ADMIN',
    gender: genderToLabel(gender ?? 0.5),
    dob: dob ?? null,
    avatar: avatar ?? null,
  };
  users.push(newAdmin);
  res.status(201).json(toProfile(newAdmin));
});

// GET /profiles/me
app.get('/profiles/me', (req, res) => {
  const user = getUserFromAuthHeader(req.headers.authorization);
  if (!user) return res.status(401).json({title: 'Unauthorized', status: 401});
  res.json(toProfile(user));
});

// PATCH /profiles/me
app.patch('/profiles/me', (req, res) => {
  const user = getUserFromAuthHeader(req.headers.authorization);
  if (!user) return res.status(401).json({title: 'Unauthorized', status: 401});

  const {name, gender, dob} = req.body ?? {};
  if (name !== undefined) user.name = name;
  if (gender !== undefined) user.gender = genderToLabel(gender);
  if (dob !== undefined) user.dob = dob;
  res.json(toProfile(user));
});

// POST /profiles/me/password?password=<current>&new_password=<new>
app.post('/profiles/me/password', (req, res) => {
  const user = getUserFromAuthHeader(req.headers.authorization);
  if (!user) return res.status(401).json({title: 'Unauthorized', status: 401});

  const {password, new_password} = req.query;
  if (password && user.password !== password) {
    return res.status(401).json({title: 'Unauthorized', detail: 'Wrong password', status: 401});
  }
  user.password = new_password;
  res.json(toProfile(user));
});

// ── Test helpers ──────────────────────────────────────────────────────────────

// GET /health — readiness probe (used by start-server-and-test)
app.get('/health', (_req, res) => res.json({ok: true}));

// POST /test/reset — reset in-memory state between Cypress tests
app.post('/test/reset', (_req, res) => {
  seed();
  res.json({ok: true});
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Nexa mock server running at http://localhost:${PORT}`);
});

