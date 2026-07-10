const VERCEL_API = "https://api.vercel.com";

export const patchEdgeConfig = async (
  key: string,
  value: unknown
): Promise<void> => {
  const edgeConfigId = process.env.EDGE_CONFIG_ID;
  const token = process.env.VERCEL_API_TOKEN;
  const teamId = process.env.VERCEL_TEAM_ID;

  if (!edgeConfigId || !token) {
    throw new Error(
      "patchEdgeConfig: EDGE_CONFIG_ID and VERCEL_API_TOKEN are required"
    );
  }

  const url = new URL(`${VERCEL_API}/v1/edge-config/${edgeConfigId}/items`);
  if (teamId) url.searchParams.set("teamId", teamId);

  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [{ operation: "upsert", key, value }],
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`patchEdgeConfig failed: ${res.status} ${detail}`);
  }
};
