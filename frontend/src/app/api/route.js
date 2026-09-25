import { jsonResponse, handleCors } from './authUtils';

export async function GET() {
  return jsonResponse({
    status: 'ok',
    service: 'finsight-suite-api',
    version: '1.1.0',
    engines: {
      budget_optimizer: 'SLSQP (scipy) - demo',
      risk_scorer: 'weighted-composite-v1',
      ml_backend: 'xgb+sklearn - demo',
    },
  });
}

export async function OPTIONS() {
  return handleCors();
}
