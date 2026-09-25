import { signToken, jsonResponse, handleCors } from '../../authUtils';

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

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const cleanEmail = email?.trim().toLowerCase();

    if (!cleanEmail || !password) {
      return jsonResponse({ detail: 'Email and password are required.' }, 400);
    }

    const user = DEMO_USERS.get(cleanEmail);

    if (user) {
      if (user.password !== password) {
        return jsonResponse({ detail: 'Incorrect email or password.' }, 401);
      }
    } else {
      if (cleanEmail && password && password.length >= 6) {
        const newUser = {
          id: `usr-${Math.random().toString(36).slice(2, 10)}`,
          email: cleanEmail,
          full_name: cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          role: 'admin',
          org_id: 'demo-org',
          password,
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
        }, 200);
      }
      return jsonResponse({ detail: 'Incorrect email or password.' }, 401);
    }

    const tokenData = {
      sub: user.id,
      email: user.email,
      role: user.role,
      org_id: user.org_id,
      full_name: user.full_name,
    };
    const access_token = signToken(tokenData);

    return jsonResponse({
      access_token,
      token_type: 'bearer',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        org_id: user.org_id,
      },
    }, 200);
  } catch (e) {
    return jsonResponse({ detail: `Login failed: ${e.message}` }, 500);
  }
}

export async function OPTIONS() {
  return handleCors();
}
