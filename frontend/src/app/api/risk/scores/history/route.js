import { jsonResponse, handleCors, getUserFromAuthHeader } from '../../../authUtils';
import { demoScoreHistory } from '../../../demoData';

export async function GET(req) {
  const authHeader = req.headers.get('authorization');
  const user = getUserFromAuthHeader(authHeader);

  const { searchParams } = new URL(req.url);
  const period = searchParams.get('period') || 'Q4 2026';
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  return jsonResponse(demoScoreHistory(Math.min(limit, 100), period));
}

export async function OPTIONS() {
  return handleCors();
}
