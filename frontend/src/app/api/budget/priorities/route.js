import { jsonResponse, handleCors, getUserFromAuthHeader } from '../../authUtils';
import { DEMO_PRIORITIES } from '../../demoData';

export async function GET(req) {
  const authHeader = req.headers.get('authorization');
  const user = getUserFromAuthHeader(authHeader);
  const { searchParams } = new URL(req.url);
  const period = searchParams.get('period') || 'Q4 2026';
  return jsonResponse(DEMO_PRIORITIES.map(p => ({ ...p, period })));
}

export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization');
    const user = getUserFromAuthHeader(authHeader);
    const orgId = user.org_id || 'demo-org';
    const { period, priorities } = await req.json();

    if (!Array.isArray(priorities)) {
      return jsonResponse({ detail: 'Priorities array is required.' }, 400);
    }

    const totalWeight = priorities.reduce((acc, p) => acc + Number(p.weight || 0), 0);
    if (totalWeight < 99 || totalWeight > 101) {
      return jsonResponse({
        message: `Weights must sum to approximately 100. Current sum: ${totalWeight.toFixed(2)}`,
        current_sum: Math.round(totalWeight * 100) / 100,
      }, 400);
    }

    const saved = priorities.map((p, i) => ({
      id: p.id || i + 1,
      priority_name: p.priority_name,
      weight: Number(p.weight),
      description: p.description || '',
      period: period || 'Q4 2026',
    }));

    return jsonResponse({
      mode: 'demo',
      org_id: orgId,
      period: period || 'Q4 2026',
      priorities: saved,
    });
  } catch (e) {
    return jsonResponse({ detail: `Save priorities failed: ${e.message}` }, 500);
  }
}

export async function OPTIONS() {
  return handleCors();
}
