export type Bloom = {
  v: number;
  m: number;
  k: number;
  n: number;
  bits: string;
};

const LN2 = Math.log(2);

const fnv1a = (input: string, seed: number): number => {
  let hash = seed >>> 0;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
};

const indexesFor = (key: string, m: number, k: number): number[] => {
  const h1 = fnv1a(key, 0x811c9dc5);
  const h2 = fnv1a(key, 0x811c9dc5 ^ 0x9e3779b9) | 1;
  const out: number[] = [];
  let combined = h1 >>> 0;
  for (let i = 0; i < k; i++) {
    out.push(combined % m);
    combined = (combined + h2) >>> 0;
  }
  return out;
};

const bytesToBase64 = (bytes: Uint8Array): string => {
  let binary = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary);
};

const base64ToBytes = (base64: string): Uint8Array => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

export const buildBloom = (
  keys: readonly string[],
  { fp, version }: { fp: number; version: number }
): Bloom => {
  const n = Math.max(keys.length, 1);
  const m = Math.max(8, Math.ceil((-n * Math.log(fp)) / (LN2 * LN2)));
  const k = Math.max(1, Math.round((m / n) * LN2));
  const bytes = new Uint8Array(Math.ceil(m / 8));

  for (const key of keys) {
    for (const idx of indexesFor(key, m, k)) {
      bytes[idx >>> 3] |= 1 << (idx & 7);
    }
  }

  return { v: version, m, k, n: keys.length, bits: bytesToBase64(bytes) };
};

export const bloomHas = (bloom: Bloom, key: string): boolean => {
  const bytes = base64ToBytes(bloom.bits);
  for (const idx of indexesFor(key, bloom.m, bloom.k)) {
    if ((bytes[idx >>> 3] & (1 << (idx & 7))) === 0) return false;
  }
  return true;
};
