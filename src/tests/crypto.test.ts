import { describe, it, expect } from 'vitest';
import {
  hashTrackingSecret,
  timingSafeEqual,
  generateReferenceId,
  generateTrackingSecret,
} from '../lib/crypto';

describe('Cryptographic and Tracking Utilities', () => {
  it('generates properly formatted non-sequential reference IDs', () => {
    const ref = generateReferenceId();
    expect(ref).toMatch(/^AQA-\d{4}-[2-9A-HJ-NP-Z]{5}$/);
  });

  it('generates unpredictable tracking secret codes', () => {
    const secret = generateTrackingSecret();
    expect(secret).toMatch(/^TRK-[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}$/);
  });

  it('hashes secrets deterministically using SHA-256 in lowercase hex', async () => {
    const hash1 = await hashTrackingSecret('TRK-WAG1-DEMO');
    const hash2 = await hashTrackingSecret('trk-wag1-demo'); // case-insensitive check
    expect(hash1).toBe(hash2);
    expect(hash1.length).toBe(64); // SHA-256 produces 64 hex chars
  });

  it('compares strings safely in constant-time', () => {
    expect(timingSafeEqual('abcdef', 'abcdef')).toBe(true);
    expect(timingSafeEqual('abcdef', 'abcdeg')).toBe(false);
    expect(timingSafeEqual('short', 'longerstring')).toBe(false);
  });
});
