import { jsonResponse, handleCors, getUserFromAuthHeader } from '../../../../authUtils';
import { DEMO_NARRATIVES } from '../../../../demoData';

export async function POST(req, { params }) {
  try {
    const authHeader = req.headers.get('authorization');
    const user = getUserFromAuthHeader(authHeader);
    const alertId = params.alert_id;
    const orgId = user.org_id || 'demo-org';

    const narrative = DEMO_NARRATIVES[alertId] || DEMO_NARRATIVES.default;

    return jsonResponse({
      ...narrative,
      alert_id: alertId,
      org_id: orgId,
    });
  } catch (e) {
    return jsonResponse(DEMO_NARRATIVES.default, 200);
  }
}

export async function OPTIONS() {
  return handleCors();
}
