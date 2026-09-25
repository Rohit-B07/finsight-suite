import { jsonResponse, handleCors, getUserFromAuthHeader } from '../../../../authUtils';

export async function GET(req, { params }) {
  const authHeader = req.headers.get('authorization');
  const user = getUserFromAuthHeader(authHeader);
  const modelId = params.model_id;

  const demoArtifact = `DEMO-MODEL-ARTIFACT-${modelId}-${Date.now()}`;
  const buffer = Buffer.from(demoArtifact, 'utf-8');

  return new Response(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${modelId || 'model'}.pkl"`,
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export async function OPTIONS() {
  return handleCors();
}
