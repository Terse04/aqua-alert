/**
 * SHA-256 hash generator using standard Web Crypto API.
 * Converts secret tracking code to lowercase hex string for secure non-reversible storage.
 */
export async function hashTrackingSecret(secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(secret.trim().toUpperCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Constant-time string comparison to mitigate timing attacks.
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Generates an unguessable tracking secret (e.g., "WTR-7G8K-4N2P")
 */
export function generateTrackingSecret(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const getChunk = (len: number) => {
    let res = '';
    const array = new Uint8Array(len);
    crypto.getRandomValues(array);
    for (let i = 0; i < len; i++) {
      res += chars[array[i] % chars.length];
    }
    return res;
  };
  return `TRK-${getChunk(4)}-${getChunk(4)}`;
}

/**
 * Generates a memorable non-sequential complaint reference ID (e.g., "AQA-2024-WAG78")
 */
export function generateReferenceId(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let randomPart = '';
  const array = new Uint8Array(5);
  crypto.getRandomValues(array);
  for (let i = 0; i < 5; i++) {
    randomPart += chars[array[i] % chars.length];
  }
  const year = new Date().getFullYear();
  return `AQA-${year}-${randomPart}`;
}
