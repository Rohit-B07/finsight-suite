import { jsonResponse, handleCors, getUserFromAuthHeader } from '../../authUtils';
import { DEMO_MODELS } from '../../demoData';

export async function GET(req) {
  const authHeader = req.headers.get('authorization');
  const user = getUserFromAuthHeader(authHeader);

  const out = DEMO_MODELS.map(m => ({
    ...m,
    mae: m.mae || m.metrics_json?.mae || 0,
    rmse: m.rmse || m.metrics_json?.rmse || 0,
    r2: m.r2 || m.metrics_json?.r2 || 0,
  }));

  return jsonResponse(out);
}

export async function OPTIONS() {
  return handleCors();
}
