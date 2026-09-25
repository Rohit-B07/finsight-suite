export const DEMO_CATEGORIES = [
  { id: 1, name: 'Marketing & Advertising', current_budget: 200000, min_spend: 100000, max_spend: 500000, is_locked: false, category_name: 'Marketing & Advertising' },
  { id: 2, name: 'Research & Development', current_budget: 300000, min_spend: 200000, max_spend: 600000, is_locked: false, category_name: 'Research & Development' },
  { id: 3, name: 'Operations & Infrastructure', current_budget: 500000, min_spend: 300000, max_spend: 800000, is_locked: true, category_name: 'Operations & Infrastructure' },
  { id: 4, name: 'Sales & Distribution', current_budget: 180000, min_spend: 80000, max_spend: 400000, is_locked: false, category_name: 'Sales & Distribution' },
  { id: 5, name: 'HR & Administration', current_budget: 120000, min_spend: 50000, max_spend: 250000, is_locked: false, category_name: 'HR & Administration' },
];

export const DEMO_PRIORITIES = [
  { id: 1, priority_name: 'Growth', weight: 40, description: 'Revenue expansion and market penetration' },
  { id: 2, priority_name: 'Profitability', weight: 30, description: 'Margin optimization and unit economics' },
  { id: 3, priority_name: 'Innovation', weight: 20, description: 'New capabilities and AI-driven workflows' },
  { id: 4, priority_name: 'Stability', weight: 10, description: 'Cash reserves and risk containment' },
];

const now = new Date();
const isoDate = (offsetMs = 0) => new Date(now.getTime() + offsetMs).toISOString();

export const DEMO_ALERTS = [
  { id: 'alert-001', severity: 'critical', indicator_type: 'Vendor Concentration',
    message: 'Vendor concentration risk exceeds 80% threshold — top 3 suppliers represent critical exposure. Diversification recommended.',
    created_at: isoDate(-30 * 60000), acknowledged: false, period: 'Q4 2026',
    threshold_breached: 'Vendor score 81.0 exceeds threshold 80' },
  { id: 'alert-002', severity: 'high', indicator_type: 'Liquidity',
    message: 'Liquidity ratio approaching minimum acceptable threshold. Review payables schedule and cash reserves.',
    created_at: isoDate(-60 * 60000), acknowledged: false, period: 'Q4 2026',
    threshold_breached: 'Liquidity inverted score 66.0 exceeds threshold 65' },
  { id: 'alert-003', severity: 'high', indicator_type: 'Volatility',
    message: 'Expense volatility elevated in Operations & Infrastructure. Run scenario stress test.',
    created_at: isoDate(-3 * 3600 * 1000), acknowledged: false, period: 'Q4 2026',
    threshold_breached: 'Volatility index 72.0 indicates unexpected variance' },
  { id: 'alert-004', severity: 'medium', indicator_type: 'Budget Variance',
    message: 'Q3 Operational spend trending 12.4% above recommended budget allocation. Finance review required.',
    created_at: isoDate(-6 * 3600 * 1000), acknowledged: false, period: 'Q4 2026' },
  { id: 'alert-005', severity: 'medium', indicator_type: 'Market Volatility',
    message: 'Market volatility indicator increased 18% in the last 24 hours. Consider hedging positions.',
    created_at: isoDate(-12 * 3600 * 1000), acknowledged: false, period: 'Q4 2026' },
  { id: 'alert-006', severity: 'low', indicator_type: 'System',
    message: 'Weekly risk recalibration completed successfully. 5 indicators processed, 0 critical anomalies detected.',
    created_at: isoDate(-48 * 3600 * 1000), acknowledged: true, period: 'Q4 2026' },
];

export const DEMO_INDICATORS = {
  liquidity: [{ indicator_type: 'liquidity', value: 34, created_at: '2026-09-24T10:00:00Z' }],
  budget_variance: [{ indicator_type: 'budget_variance', value: 55, created_at: '2026-09-24T10:00:00Z' }],
  vendor_concentration: [{ indicator_type: 'vendor_concentration', value: 81, created_at: '2026-09-24T10:00:00Z' }],
  forecast_deviation: [{ indicator_type: 'forecast_deviation', value: 38, created_at: '2026-09-24T10:00:00Z' }],
  volatility: [{ indicator_type: 'volatility', value: 72, created_at: '2026-09-24T10:00:00Z' }],
};

export const DEMO_MODELS = [
  {
    id: 'demo-m1', version: 'v2.4.1', algorithm: 'XGBoost',
    trained_at: isoDate(-6 * 24 * 3600 * 1000),
    mae: 450.2, rmse: 620.5, r2: 0.942,
    training_samples: 12840, training_duration: '14m 32s', features: 47,
    is_active: true,
    metrics_json: { mae: 450.2, rmse: 620.5, r2: 0.942, mape: 4.12 },
  },
  {
    id: 'demo-m2', version: 'v2.3.0', algorithm: 'XGBoost',
    trained_at: isoDate(-33 * 24 * 3600 * 1000),
    mae: 512.8, rmse: 715.3, r2: 0.921,
    training_samples: 11620, training_duration: '12m 08s', features: 42,
    is_active: false,
    metrics_json: { mae: 512.8, rmse: 715.3, r2: 0.921, mape: 4.87 },
  },
  {
    id: 'demo-m3', version: 'v2.1.0', algorithm: 'Gradient Boosting',
    trained_at: isoDate(-81 * 24 * 3600 * 1000),
    mae: 602.1, rmse: 835.7, r2: 0.894,
    training_samples: 9840, training_duration: '9m 54s', features: 38,
    is_active: false,
    metrics_json: { mae: 602.1, rmse: 835.7, r2: 0.894, mape: 5.93 },
  },
];

export function demoOptimize(totalBudget, scenarioType = 'balanced', constraints = []) {
  const categories = [...DEMO_CATEGORIES];
  const totalCurrent = categories.reduce((s, c) => s + c.current_budget, 0);
  const scale = totalCurrent ? totalBudget / totalCurrent : 1;
  const scenarioFactors = {
    conservative: [0.95, 0.98, 1.00, 1.02, 1.05],
    balanced: [1.25, 0.95, 0.93, 1.167, 1.083],
    aggressive: [1.50, 1.10, 0.85, 1.30, 0.95],
  };
  const factors = scenarioFactors[scenarioType] || scenarioFactors.balanced;
  const impactMap = {
    conservative: ['Low', 'Low', 'Medium', 'Medium', 'Medium'],
    balanced: ['High', 'Medium', 'Low', 'High', 'Medium'],
    aggressive: ['High', 'Medium', 'Low', 'High', 'Low'],
  };
  const impacts = impactMap[scenarioType] || impactMap.balanced;
  const confidence = [0.88, 0.92, 0.96, 0.84, 0.90];

  return categories.map((cat, i) => {
    let recommended = Math.round(cat.current_budget * factors[i] * scale / 100) * 100;
    for (const c of constraints) {
      if ((c.category && c.category.toLowerCase().includes(cat.name.toLowerCase())) || c.category_id === cat.id) {
        recommended = c.exact;
        break;
      }
    }
    const change = cat.current_budget === 0 ? 0 : ((recommended - cat.current_budget) / cat.current_budget) * 100;
    return {
      category_id: cat.id,
      category_name: cat.name,
      category: cat.name,
      current_budget: cat.current_budget,
      recommended_budget: recommended,
      change_percent: Math.round(change * 10) / 10,
      projected_impact: impacts[i % impacts.length],
      confidence: confidence[i % confidence.length],
      scenario_type: scenarioType,
    };
  });
}

export function demoPredictions(orgId, horizon = 12) {
  const predictions = [];
  const base = 500000;
  for (let i = 0; i < horizon; i++) {
    const trend = 8000 * i;
    const seasonal = 25000 * Math.sin(i * 0.52);
    const predicted = Math.round((base + trend + seasonal) / 1000) * 1000;
    const lower = Math.round(predicted * 0.92 / 1000) * 1000;
    const upper = Math.round(predicted * 1.08 / 1000) * 1000;
    predictions.push({
      id: `pred-${orgId}-${i}`,
      org_id: orgId,
      period: `M${i + 1}`,
      predicted_value: predicted,
      lower_bound: lower,
      upper_bound: upper,
      confidence: 0.94,
      model_version: 'v2.4.1',
      created_at: isoDate(-(horizon - i) * 3600 * 1000),
    });
  }
  return predictions;
}

export function demoScoreHistory(limit = 20, period = 'Q4 2026') {
  const series = [];
  const baseScore = 52.4;
  for (let i = 0; i < limit; i++) {
    const s = Math.max(0, Math.min(100, baseScore + (Math.sin(i * 0.8) * 12) + (Math.random() * 4 - 2)));
    const rounded = Math.round(s * 10) / 10;
    const sev = rounded >= 75 ? 'critical' : rounded >= 50 ? 'high' : rounded >= 25 ? 'medium' : 'low';
    series.push({
      composite_score: rounded,
      severity: sev,
      created_at: isoDate(-(limit - i) * 24 * 3600 * 1000),
      period,
    });
  }
  return series;
}

export const DEMO_NARRATIVES = {
  'alert-001': {
    headline: 'Critical Vendor Concentration Risk Detected',
    explanation: 'Analysis shows 81% of procurement spend is concentrated across the top 3 suppliers, exceeding the 80% risk threshold. This exposes the organization to significant supply chain disruption risk, contract renegotiation leverage loss, and potential single-point-of-failure scenarios. Historical industry data indicates that vendors with >60% share increase pricing by an average of 14% at renewal when aware of limited alternatives.',
    recommended_action: 'Immediately initiate RFPs for at least 2 secondary vendors in the Operations category. Target reducing top-3 concentration to below 65% within 90 days. Assign a dedicated procurement resource to manage the diversification program and negotiate contractual safeguards (price caps, SLA penalties) with existing primary suppliers.',
    action_category: 'Procurement Diversification',
    estimated_cost: 45000,
    urgency: 'Immediate',
    generated_by: 'demo-fallback',
    created_at: isoDate(-10 * 60000),
  },
  default: {
    headline: 'Risk Alert Requires Attention',
    explanation: 'This alert was triggered when a monitored risk indicator breached its configured threshold. The composite risk model has flagged this condition as statistically significant relative to the 90-day baseline distribution. Continued operation without remediation increases the likelihood of downstream financial impact within the current reporting period.',
    recommended_action: 'Review the associated indicator breakdown with your finance team. Validate the underlying data feeds, then either (a) acknowledge and monitor if the breach was transient, or (b) initiate the standard mitigation playbook for this indicator class. Escalate to the risk committee if the severity remains elevated for more than 3 business days.',
    action_category: 'Review & Monitor',
    estimated_cost: 0,
    urgency: 'Standard',
    generated_by: 'demo-fallback',
    created_at: isoDate(-5 * 60000),
  },
};
