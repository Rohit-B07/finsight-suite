import { jsonResponse, handleCors, getUserFromAuthHeader } from '../../../authUtils';
import { demoPredictions } from '../../../demoData';

export async function GET(req, { params }) {
  const authHeader = req.headers.get('authorization');
  const user = getUserFromAuthHeader(authHeader);
  const userOrg = user.org_id || 'demo-org';
  const orgId = params.org_id;

  if (userOrg && userOrg !== 'demo-org' && orgId !== userOrg) {
    return jsonResponse({ detail: 'Not authorized to access predictions for this org' }, 403);
  }

  const { searchParams } = new URL(req.url);
  const horizon = Math.min(parseInt(searchParams.get('horizon') || '12', 10), 24);

  return jsonResponse({
    mode: 'demo',
    org_id: orgId,
    model_version: 'v2.4.1',
    horizon,
    predictions: demoPredictions(orgId, horizon),
  });
}

export async function OPTIONS() {
  return handleCors();
}
