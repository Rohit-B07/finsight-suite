import { jsonResponse, handleCors, getUserFromAuthHeader } from '../../authUtils';
import { DEMO_CATEGORIES } from '../../demoData';

export async function GET(req) {
  const authHeader = req.headers.get('authorization');
  const user = getUserFromAuthHeader(authHeader);
  return jsonResponse(DEMO_CATEGORIES);
}

export async function OPTIONS() {
  return handleCors();
}
