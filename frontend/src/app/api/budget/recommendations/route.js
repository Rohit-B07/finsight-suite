import { jsonResponse, handleCors, getUserFromAuthHeader } from '../../authUtils';
import { demoOptimize } from '../../demoData';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const authHeader = req.headers.get('authorization');
  const user = getUserFromAuthHeader(authHeader);

  const { searchParams } = new URL(req.url);
  const period = searchParams.get('period');
  const scenarioType = searchParams.get('scenario_type') || 'balanced';

  const recommendations = demoOptimize(1000000, scenarioType, []);
  const orgId = user.org_id || 'demo-org';

  return jsonResponse({
    mode: 'demo',
    org_id: orgId,
    period: period || 'Q4 2026',
    scenario_type: scenarioType,
    total_budget: 1000000,
    recommendations,
  });
}

export async function OPTIONS() {
  return handleCors();
}
