const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

async function safeGet(path, revalidate = 300) {
  if (!API_URL) return null;

  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate } });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

export async function getPublicStats() {
  const data = await safeGet('/config/stats', 300);
  const s = data?.stats ?? data ?? {};
  const donations = s.totalDonations ?? 0;
  return {
    donors: s.totalDonors ?? 0,
    donations,
    livesImpacted: s.livesImpacted ?? donations * 3,
    requestsFulfilled: s.requestsFulfilled ?? 0,
  };
}

export async function getHospitals(params = {}) {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v)
  ).toString();
  const data = await safeGet(`/hospitals?${qs}`, 60);
  return {
    items: data?.hospitals ?? [],
    pagination: data?.pagination ?? { page: 1, limit: 12, total: 0, totalPages: 1 },
  };
}

export async function getBloodBanks(params = {}) {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v)
  ).toString();
  const data = await safeGet(`/blood-banks?${qs}`, 60);
  return {
    items: data?.bloodBanks ?? [],
    pagination: data?.pagination ?? { page: 1, limit: 20, total: 0, totalPages: 1 },
  };
}

export async function getAppVersion() {
  return await safeGet('/app-version', 60);
}

export async function getAppConfig() {
  return await safeGet('/config', 300);
}