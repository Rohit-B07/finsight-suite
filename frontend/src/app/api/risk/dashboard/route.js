import { jsonResponse, handleCors, getUserFromAuthHeader } from '../../authUtils';
import { DEMO_ALERTS, DEMO_INDICATORS } from '../../demoData';

export async function GET(req) {
  const authHeader = req.headers.get('authorization');
  const user = getUserFromAuthHeader(authHeader);
  const orgId = user.org_id || 'demo-org';

  const weights = { liquidity: 0.25, budget_variance: 0.25, vendor_concentration: 0.20, forecast_deviation: 0.15, volatility: 0.15 };
  let totalW = 0;
  let score = 0;
  for (const [k, w] of Object.entries(weights)) {
    if (DEMO_INDICATORS[k] && DEMO_INDICATORS[k].length > 0) {
      score += DEMO_INDICATORS[k][0].value * w;
      totalW += w;
    }
  }
  const finalScore = totalW > 0 ? Math.round((score / totalW) * 10) / 10 : 52.4;
  const severity = finalScore >= 75 ? 'critical' : finalScore >= 50 ? 'high' : finalScore >= 25 ? 'medium' : 'low';

  const unacknowledged = DEMO_ALERTS.filter(a => !a.acknowledged).length;

  return jsonResponse({
    mode: 'demo',
    org_id: orgId,
    overall_score: finalScore,
    severity,
    latest_score: {
      composite_score: finalScore,
      severity,
      period: 'Q4 2026',
      created_at: new Date().toISOString(),
    },
    unacknowledged_alerts_count: unacknowledged,
    latest_indicators: DEMO_INDICATORS,
  });
}

export async function OPTIONS() {
  return handleCors();
}
