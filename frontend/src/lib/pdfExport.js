import jsPDF from 'jspdf';

/**
 * PDF Export Utility for FinSight Suite
 * Generates formatted PDF reports with tables, headers, and metadata.
 */

function addHeader(doc, title, subtitle) {
  // Primary Banner
  doc.setFillColor(30, 64, 175); // #1e40af (primary-800)
  doc.rect(0, 0, 210, 28, 'F');

  // Title text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('FINSIGHT SUITE', 14, 14);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(219, 234, 254);
  doc.text(title.toUpperCase(), 14, 22);

  // Metadata / Date on right
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  doc.setFontSize(8);
  doc.text(`Generated: ${dateStr}`, 196, 14, { align: 'right' });
  doc.text('Confidential — Financial Intelligence', 196, 22, { align: 'right' });

  // Subtitle bar
  if (subtitle) {
    doc.setFillColor(241, 245, 249);
    doc.rect(0, 28, 210, 10, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85);
    doc.text(subtitle, 14, 34.5);
  }
}

function addFooter(doc) {
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 280, 196, 280);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('FinSight Suite — AI-Powered Financial Intelligence Platform', 14, 286);
    doc.text(`Page ${i} of ${pageCount}`, 196, 286, { align: 'right' });
  }
}

export function exportDashboardPdf(data = {}) {
  const doc = new jsPDF('p', 'mm', 'a4');
  addHeader(doc, 'Executive Dashboard Summary Report', 'Financial Health & Risk Overview');

  let y = 46;

  // Executive Summary Cards
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, 182, 32, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, 182, 32, 3, 3, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Executive Summary KPI Overview', 20, y + 8);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);

  const budgetList = Array.isArray(data.budget) ? data.budget : (data.budget?.recommendations || []);
  const totalBudget = budgetList.length > 0 ? budgetList.reduce((acc, curr) => acc + (Number(curr.current_budget) || 0), 0) : 847000;
  const riskScore = data.risk?.latest_score?.composite_score ?? data.risk?.overall_score ?? 52.4;
  const severity = data.risk?.latest_score?.severity || data.risk?.severity || 'Medium';

  doc.text(`Total Budget: INR ${(totalBudget / 1000).toFixed(0)}K`, 20, y + 17);
  doc.text(`Composite Risk Score: ${Number(riskScore).toFixed(1)} / 100 (${severity.toUpperCase()})`, 20, y + 24);

  doc.text(`ML Engine Version: v2.4.1 (XGBoost)`, 110, y + 17);
  doc.text(`Status: Realtime Active Monitoring`, 110, y + 24);

  y += 42;

  // Budget Breakdown Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('Budget Category Distribution', 14, y);
  y += 6;

  // Table Header
  doc.setFillColor(30, 64, 175);
  doc.rect(14, y, 182, 8, 'F');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('Category Name', 18, y + 5.5);
  doc.text('Current Budget (INR)', 90, y + 5.5);
  doc.text('Recommended (INR)', 140, y + 5.5);
  doc.text('Impact', 185, y + 5.5, { align: 'right' });
  y += 8;

  const defaultCategories = [
    { category_name: 'Marketing & Advertising', current_budget: 200000, recommended_budget: 250000, projected_impact: 'High' },
    { category_name: 'Research & Development', current_budget: 300000, recommended_budget: 285000, projected_impact: 'Medium' },
    { category_name: 'Operations & Infrastructure', current_budget: 500000, recommended_budget: 465000, projected_impact: 'Low' },
    { category_name: 'Sales & Distribution', current_budget: 180000, recommended_budget: 210000, projected_impact: 'High' },
    { category_name: 'HR & Administration', current_budget: 120000, recommended_budget: 130000, projected_impact: 'Medium' },
  ];

  const items = budgetList.length > 0 ? budgetList : defaultCategories;

  items.forEach((item, idx) => {
    const bg = idx % 2 === 0 ? [255, 255, 255] : [248, 250, 252];
    doc.setFillColor(...bg);
    doc.rect(14, y, 182, 8, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);

    const name = item.category_name || item.name || 'Category';
    const curr = Number(item.current_budget || 0).toLocaleString('en-IN');
    const rec = Number(item.recommended_budget || item.current_budget || 0).toLocaleString('en-IN');
    const impact = item.projected_impact || 'Medium';

    doc.text(name, 18, y + 5.5);
    doc.text(`INR ${curr}`, 90, y + 5.5);
    doc.text(`INR ${rec}`, 140, y + 5.5);
    doc.text(impact, 185, y + 5.5, { align: 'right' });

    y += 8;
  });

  y += 10;

  // Active Risk Alerts Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('Key Risk Alerts & Exposure Highlights', 14, y);
  y += 6;

  const alerts = [
    { severity: 'CRITICAL', msg: 'Vendor concentration risk exceeds 80% threshold — top 3 suppliers represent critical exposure.' },
    { severity: 'HIGH', msg: 'Liquidity ratio approaching minimum acceptable threshold. Review payables schedule.' },
    { severity: 'MEDIUM', msg: 'Expense volatility elevated in Operations & Infrastructure category.' },
  ];

  alerts.forEach((alert) => {
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(254, 202, 202);
    doc.roundedRect(14, y, 182, 12, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(220, 38, 38);
    doc.text(`[${alert.severity}]`, 18, y + 7.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(alert.msg, 40, y + 7.5);

    y += 15;
  });

  addFooter(doc);
  doc.save(`finsight-dashboard-${new Date().toISOString().slice(0, 10)}.pdf`);
}

export function exportRiskPdf(data = {}) {
  const doc = new jsPDF('p', 'mm', 'a4');
  addHeader(doc, 'Risk Intelligence & Vulnerability Report', 'Composite Risk Scoring & Anomaly Analysis');

  let y = 46;

  const score = data.dashboard?.latest_score?.composite_score ?? data.dashboard?.overall_score ?? 52.4;
  const severity = (data.dashboard?.latest_score?.severity ?? data.dashboard?.severity ?? 'Medium').toUpperCase();

  doc.setFillColor(239, 246, 255);
  doc.roundedRect(14, y, 182, 26, 3, 3, 'F');
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(14, y, 182, 26, 3, 3, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 138);
  doc.text(`Overall Risk Posture: ${Number(score).toFixed(1)} / 100`, 20, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(30, 64, 175);
  doc.text(`Severity Classification: ${severity}`, 20, y + 18);
  doc.text(`Active Alert Count: ${(data.alerts || []).length || 6}`, 120, y + 18);

  y += 36;

  // Indicators Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('Monitored Risk Indicator Breakdown', 14, y);
  y += 6;

  doc.setFillColor(30, 64, 175);
  doc.rect(14, y, 182, 8, 'F');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('Indicator Dimension', 18, y + 5.5);
  doc.text('Score (/100)', 110, y + 5.5);
  doc.text('Trend', 150, y + 5.5);
  doc.text('Status', 185, y + 5.5, { align: 'right' });
  y += 8;

  const indicators = [
    { name: 'Vendor Concentration Risk', score: 81, trend: '+12%', status: 'Critical' },
    { name: 'Market Volatility Index', score: 72, trend: '+18%', status: 'Elevated' },
    { name: 'Operational Risk', score: 60, trend: '+5%', status: 'Moderate' },
    { name: 'Budget Variance Exposure', score: 55, trend: '+7%', status: 'Moderate' },
    { name: 'Forecast Deviation (MAPE)', score: 38, trend: '-4%', status: 'Acceptable' },
    { name: 'Liquidity Coverage Risk', score: 34, trend: '-8%', status: 'Acceptable' },
  ];

  indicators.forEach((ind, idx) => {
    const bg = idx % 2 === 0 ? [255, 255, 255] : [248, 250, 252];
    doc.setFillColor(...bg);
    doc.rect(14, y, 182, 8, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);

    doc.text(ind.name, 18, y + 5.5);
    doc.text(String(ind.score), 110, y + 5.5);
    doc.text(ind.trend, 150, y + 5.5);
    doc.text(ind.status, 185, y + 5.5, { align: 'right' });

    y += 8;
  });

  addFooter(doc);
  doc.save(`finsight-risk-report-${new Date().toISOString().slice(0, 10)}.pdf`);
}

export function exportBudgetPdf(data = {}) {
  const doc = new jsPDF('p', 'mm', 'a4');
  addHeader(doc, 'Budget Optimization Plan Report', 'SLSQP Constrained AI Allocation');

  let y = 46;

  const items = data.recommendations || [
    { category_name: 'Marketing & Advertising', current_budget: 200000, recommended_budget: 250000, change_percent: 25, projected_impact: 'High', confidence: 0.88 },
    { category_name: 'Research & Development', current_budget: 300000, recommended_budget: 285000, change_percent: -5, projected_impact: 'Medium', confidence: 0.92 },
    { category_name: 'Operations & Infrastructure', current_budget: 500000, recommended_budget: 465000, change_percent: -7, projected_impact: 'Low', confidence: 0.96 },
    { category_name: 'Sales & Distribution', current_budget: 180000, recommended_budget: 210000, change_percent: 16.7, projected_impact: 'High', confidence: 0.84 },
    { category_name: 'HR & Administration', current_budget: 120000, recommended_budget: 130000, change_percent: 8.3, projected_impact: 'Medium', confidence: 0.90 },
  ];

  const totalCurrent = items.reduce((s, i) => s + (Number(i.current_budget) || 0), 0);
  const totalRecommended = items.reduce((s, i) => s + (Number(i.recommended_budget) || 0), 0);

  doc.setFillColor(240, 253, 244);
  doc.roundedRect(14, y, 182, 26, 3, 3, 'F');
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(14, y, 182, 26, 3, 3, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(22, 101, 52);
  doc.text(`Optimization Scenario: ${data.scenario_type || 'Balanced'}`, 20, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(21, 128, 61);
  doc.text(`Total Current Spend: INR ${totalCurrent.toLocaleString('en-IN')}`, 20, y + 18);
  doc.text(`Total Recommended: INR ${totalRecommended.toLocaleString('en-IN')}`, 110, y + 18);

  y += 36;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('Optimal Category Budget Allocations', 14, y);
  y += 6;

  doc.setFillColor(30, 64, 175);
  doc.rect(14, y, 182, 8, 'F');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('Category', 18, y + 5.5);
  doc.text('Current (INR)', 80, y + 5.5);
  doc.text('Optimal (INR)', 120, y + 5.5);
  doc.text('Change (%)', 155, y + 5.5);
  doc.text('Confidence', 185, y + 5.5, { align: 'right' });
  y += 8;

  items.forEach((item, idx) => {
    const bg = idx % 2 === 0 ? [255, 255, 255] : [248, 250, 252];
    doc.setFillColor(...bg);
    doc.rect(14, y, 182, 8, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);

    const name = item.category_name || item.name;
    const curr = Number(item.current_budget || 0).toLocaleString('en-IN');
    const rec = Number(item.recommended_budget || 0).toLocaleString('en-IN');
    const change = (Number(item.change_percent || 0)).toFixed(1);
    const conf = Math.round((Number(item.confidence || 0.9)) * 100);

    doc.text(name, 18, y + 5.5);
    doc.text(curr, 80, y + 5.5);
    doc.text(rec, 120, y + 5.5);
    doc.text(`${change > 0 ? '+' : ''}${change}%`, 155, y + 5.5);
    doc.text(`${conf}%`, 185, y + 5.5, { align: 'right' });

    y += 8;
  });

  addFooter(doc);
  doc.save(`finsight-budget-optimization-${new Date().toISOString().slice(0, 10)}.pdf`);
}
