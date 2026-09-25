import { jsonResponse, handleCors, getUserFromAuthHeader } from '../../authUtils';
import { demoOptimize } from '../../demoData';

export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization');
    const user = getUserFromAuthHeader(authHeader);
    const orgId = user.org_id || 'demo-org';

    const { total_budget, period, scenario_type, constraints } = await req.json();

    if (!total_budget || total_budget <= 0) {
      return jsonResponse({ detail: 'Valid total_budget is required.' }, 400);
    }

    const validScenarios = ['conservative', 'balanced', 'aggressive'];
    const scenario = validScenarios.includes(scenario_type) ? scenario_type : 'balanced';
    const cons = Array.isArray(constraints) ? constraints : [];

    const recommendations = demoOptimize(total_budget, scenario, cons);

    return jsonResponse({
      mode: 'demo',
      org_id: orgId,
      period: period || 'Q4 2026',
      scenario_type: scenario,
      total_budget,
      recommendations,
    });
  } catch (e) {
    return jsonResponse({ detail: `Optimization failed: ${e.message}` }, 500);
  }
}

export async function OPTIONS() {
  return handleCors();
}
