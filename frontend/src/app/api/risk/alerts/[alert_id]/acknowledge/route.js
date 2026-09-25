import { jsonResponse, handleCors, getUserFromAuthHeader } from '../../../../authUtils';
import { DEMO_ALERTS, DEMO_NARRATIVES } from '../../../../demoData';

export async function POST(req, { params }) {
  try {
    const authHeader = req.headers.get('authorization');
    const user = getUserFromAuthHeader(authHeader);
    const orgId = user.org_id || 'demo-org';
    const alertId = params.alert_id;

    if (alertId) {
      const idx = DEMO_ALERTS.findIndex(a => String(a.id) === String(alertId));
      if (idx !== -1) {
        DEMO_ALERTS[idx] = { ...DEMO_ALERTS[idx], acknowledged: true };
      }
    }

    return jsonResponse({
      mode: 'demo',
      id: alertId,
      acknowledged: true,
      acknowledged_at: new Date().toISOString(),
      acknowledged_by: orgId,
    });
  } catch (e) {
    return jsonResponse({ detail: `Acknowledge failed: ${e.message}` }, 500);
  }
}

export async function OPTIONS() {
  return handleCors();
}
