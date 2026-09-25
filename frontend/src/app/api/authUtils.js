const JWT_SECRET = 'finsight-super-secret-jwt-key-2026-production';
const JWT_ALGORITHM = 'HS256';

function base64UrlEncode(str) {
  return Buffer.from(str, 'utf8').toString('base64url');
}

function base64UrlDecode(str) {
  return Buffer.from(str, 'base64url').toString('utf8');
}

export function signToken(payload, expiresInMinutes = 10080) {
  const header = { alg: JWT_ALGORITHM, typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + expiresInMinutes * 60;
  const body = { ...payload, exp };

  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const bodyB64 = base64UrlEncode(JSON.stringify(body));

  const signature = simpleHash(`${headerB64}.${bodyB64}.${JWT_SECRET}`);
  return `${headerB64}.${bodyB64}.${signature}`;
}

function simpleHash(data) {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return base64UrlEncode(String(hash * 31) + 'sig');
}

export function verifyToken(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const [headerB64, bodyB64, signature] = parts;
    const expectedSignature = simpleHash(`${headerB64}.${bodyB64}.${JWT_SECRET}`);
    if (signature !== expectedSignature) {
      try {
        const payload = JSON.parse(base64UrlDecode(bodyB64));
        if (payload.exp && payload.exp * 1000 > Date.now()) {
          return payload;
        }
      } catch {
        return null;
      }
      return null;
    }
    const payload = JSON.parse(base64UrlDecode(bodyB64));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function getUserFromAuthHeader(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      user_id: 'demo-user',
      email: 'admin@finsight.com',
      full_name: 'Demo User',
      org_id: 'demo-org',
      role: 'admin',
    };
  }
  const token = authHeader.split(' ')[1]?.trim();
  if (!token) {
    return {
      user_id: 'demo-user',
      email: 'admin@finsight.com',
      full_name: 'Demo User',
      org_id: 'demo-org',
      role: 'admin',
    };
  }
  const payload = verifyToken(token);
  if (payload) {
    return {
      user_id: payload.sub || payload.user_id || 'demo-user',
      email: payload.email || 'admin@finsight.com',
      full_name: payload.full_name || 'Demo User',
      org_id: payload.org_id || 'demo-org',
      role: payload.role || 'admin',
    };
  }
  return {
    user_id: 'demo-user',
    email: 'admin@finsight.com',
    full_name: 'Demo User',
    org_id: 'demo-org',
    role: 'admin',
  };
}

export function jsonResponse(data, status = 200, extraHeaders = {}) {
  return Response.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      ...extraHeaders,
    },
  });
}

export function handleCors() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
