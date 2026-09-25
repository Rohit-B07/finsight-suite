import { jsonResponse, handleCors, getUserFromAuthHeader } from '../../authUtils';
import { DEMO_ALERTS } from '../../demoData';

export async function GET(req) {
  const authHeader = req.headers.get('authorization');
  const user = getUserFromAuthHeader(authHeader);

  const { searchParams } = new URL(req.url);
  const severity = searchParams.get('severity');
  const acknowledged = searchParams.get('acknowledged');
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);

  let filtered = [...DEMO_ALERTS];

  if (acknowledged !== null && acknowledged !== undefined) {
    const isAck = acknowledged === 'true' || acknowledged === '1';
    filtered = filtered.filter(a => a.acknowledged === isAck);
  }
  if (severity && severity !== 'all') {
    filtered = filtered.filter(a => (a.severity || '').toLowerCase() === severity.toLowerCase());
  }

  const result = filtered.slice(offset, offset + limit);
  return jsonResponse(result);
}

export async function OPTIONS() {
  return handleCors();
}
