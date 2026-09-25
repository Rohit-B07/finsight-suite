import { jsonResponse, handleCors, getUserFromAuthHeader } from '../../authUtils';
import { DEMO_CATEGORIES, demoOptimize } from '../../demoData';

export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization');
    const user = getUserFromAuthHeader(authHeader);
    const orgId = user.org_id || 'demo-org';
    const { org_id, proposed_change, scenario } = await req.json();

    const effectiveOrg = org_id || orgId;
    const change = proposed_change || {};
    const scenarioType = scenario || 'balanced';

    const totalBudget = DEMO_CATEGORIES.reduce((acc, c) => acc + c.current_budget, 0);
    const currentAllocation = {};
    const projectedAllocation = {};
    DEMO_CATEGORIES.forEach(c => {
      currentAllocation[c.name] = c.current_budget;
      projectedAllocation[c.name] = c.current_budget;
    });

    if (change.from_category && change.to_category && change.amount) {
      const from = DEMO_CATEGORIES.find(c => c.name.toLowerCase().includes(change.from_category.toLowerCase()));
      const to = DEMO_CATEGORIES.find(c => c.name.toLowerCase().includes(change.to_category.toLowerCase()));
      if (from && to) {
        projectedAllocation[from.name] = Math.max(0, projectedAllocation[from.name] - Number(change.amount));
        projectedAllocation[to.name] = projectedAllocation[to.name] + Number(change.amount);
      }
    }

    const currentScore = 68.5;
    const projectedScore = 72.3;

    return jsonResponse({
      current_score: currentScore,
      projected_score: projectedScore,
      score_delta: Number((projectedScore - currentScore).toFixed(1)),
      current_allocation: currentAllocation,
      projected_allocation: projectedAllocation,
      feasible: true,
      violation_reason: null,
      mode: 'demo',
      org_id: effectiveOrg,
      scenario_type: scenarioType,
    });
  } catch (e) {
    return jsonResponse({ detail: `Simulation failed: ${e.message}` }, 500);
  }
}

export async function OPTIONS() {
  return handleCors();
}
