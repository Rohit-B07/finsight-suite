import { signToken, jsonResponse, handleCors, getUserFromAuthHeader } from '../../authUtils';

const DEMO_USERS = new Map([
  ['admin@finsight.com', {
    id: 'usr-admin-1',
    email: 'admin@finsight.com',
    full_name: 'FinSight Administrator',
    role: 'admin',
    org_id: 'demo-org',
    password: 'admin123',
  }],
]);

function hashPassword(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return String(hash);
}

export async function POST(req) {
  try {
    const { email, password, full_name, role } = await req.json();
    const cleanEmail = email?.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return jsonResponse({ detail: 'Please enter a valid email address.' }, 400);
    }
    if (!password || password.length < 6) {
      return jsonResponse({ detail: 'Password must be at least 6 characters.' }, 400);
    }
    if (!full_name || full_name.length < 2) {
      return jsonResponse({ detail: 'Full name must be at least 2 characters.' }, 400);
    }

    if (DEMO_USERS.has(cleanEmail)) {
      return jsonResponse({ detail: 'User with this email already exists. Please login instead.' }, 400);
    }

    const newUser = {
      id: `usr-${Math.random().toString(36).slice(2, 10)}`,
      email: cleanEmail,
      full_name: full_name.trim(),
      role: role || 'admin',
      org_id: 'demo-org',
      password: password,
    };
    DEMO_USERS.set(cleanEmail, newUser);

    const tokenData = {
      sub: newUser.id,
      email: newUser.email,
      role: newUser.role,
      org_id: newUser.org_id,
      full_name: newUser.full_name,
    };
    const access_token = signToken(tokenData);

    return jsonResponse({
      access_token,
      token_type: 'bearer',
      user: {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        role: newUser.role,
        org_id: newUser.org_id,
      },
    }, 201);
  } catch (e) {
    return jsonResponse({ detail: `Registration failed: ${e.message}` }, 500);
  }
}

export async function OPTIONS() {
  return handleCors();
}

export async function GET() {
  return jsonResponse({ detail: 'Method Not Allowed' }, 405);
}

