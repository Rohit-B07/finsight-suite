import { jsonResponse, handleCors } from '../authUtils';
import { DEMO_INDICATORS } from '../demoData';

export async function GET() {
  return jsonResponse({
    status: 'ok',
    version: '1.1.0',
    dependencies: {
      supabase: 'disconnected (demo mode)',
      redis: 'not_checked',
      celery_workers: 'not_checked',
      ml_model_loaded: true,
    },
    mode: 'demo_fallback',
    latest_indicators: DEMO_INDICATORS,
  });
}

export async function OPTIONS() {
  return handleCors();
}
