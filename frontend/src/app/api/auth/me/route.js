import { jsonResponse, handleCors, getUserFromAuthHeader } from '../../authUtils';

export async function GET(req) {
  const authHeader = req.headers.get('authorization');
  const user = getUserFromAuthHeader(authHeader);
  return jsonResponse({
    status: 'authenticated',
    user,
  });
}

export async function OPTIONS() {
  return handleCors();
}
