import { jsonResponse, handleCors, getUserFromAuthHeader } from '../../../authUtils';
import { DEMO_MODELS } from '../../../demoData';

let modelState = JSON.parse(JSON.stringify(DEMO_MODELS));

export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization');
    const user = getUserFromAuthHeader(authHeader);

    const { model_id, version } = await req.json();
    const identifier = model_id || version;

    if (!identifier) {
      return jsonResponse({ detail: 'Either model_id or version is required' }, 400);
    }

    modelState = modelState.map(m => ({
      ...m,
      is_active: (version && m.version === version) || (model_id && m.id === model_id),
    }));

    const active = modelState.find(m => m.is_active);
    if (!active) {
      return jsonResponse({ detail: 'Model version not found' }, 404);
    }

    return jsonResponse({
      mode: 'demo',
      activated: identifier,
      active_model: active,
    });
  } catch (e) {
    return jsonResponse({ detail: `Activate failed: ${e.message}` }, 500);
  }
}

export async function OPTIONS() {
  return handleCors();
}
