import { jsonResponse, handleCors, getUserFromAuthHeader } from '../../../authUtils';

export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization');
    const user = getUserFromAuthHeader(authHeader);
    const orgId = user.org_id || 'demo-org';
    const { indicators } = await req.json();

    if (!Array.isArray(indicators) || indicators.length === 0) {
      return jsonResponse({ ingested: 0, alerts_generated: 0 });
    }

    return jsonResponse({
      mode: 'demo',
      ingested: indicators.length,
      alerts_generated: Math.min(2, indicators.length),
      message: 'Demo mode: indicators processed in memory only',
      period: indicators[0]?.period || 'Q4 2026',
      org_id: orgId,
    });
  } catch (e) {
    return jsonResponse({ detail: `Ingest failed: ${e.message}` }, 500);
  }
}

export async function OPTIONS() {
  return handleCors();
}
