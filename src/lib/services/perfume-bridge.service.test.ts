import { describe, it, expect } from 'vitest';
import { extractFragellaIdFromSearchItem } from './perfume-bridge.service';

describe('extractFragellaIdFromSearchItem', () => {
  it('returns direct id when item.id exists', () => {
    expect(extractFragellaIdFromSearchItem({ id: 'chanel-bleu' })).toBe('chanel-bleu');
    expect(extractFragellaIdFromSearchItem({ id: '123', name: 'X' })).toBe('123');
  });

  it('rejects direct ids starting with idx-', () => {
    expect(extractFragellaIdFromSearchItem({ id: 'idx-0' })).toBeNull();
    expect(extractFragellaIdFromSearchItem({ _id: 'idx-5' })).toBeNull();
  });

  it('extracts canonical id from /fragrances/<slug> URL', () => {
    expect(
      extractFragellaIdFromSearchItem({
        'Purchase URL': 'https://example.com/fragrances/dior-sauvage',
      })
    ).toBe('dior-sauvage');
    expect(
      extractFragellaIdFromSearchItem({
        purchase_url: 'https://fragella.com/ar/fragrances/chanel-bleu',
      })
    ).toBe('chanel-bleu');
  });

  it('rejects generic URL last-segment fallback (non-/fragrances/ URL must return null)', () => {
    expect(
      extractFragellaIdFromSearchItem({
        url: 'https://example.com/some/chanel-bleu',
      })
    ).toBeNull();
    expect(
      extractFragellaIdFromSearchItem({
        link: 'https://store.com/products/perfume-name',
      })
    ).toBeNull();
  });

  it('returns null for malformed encoded URL instead of throwing', () => {
    expect(
      extractFragellaIdFromSearchItem({
        'Purchase URL': '%',
      })
    ).toBeNull();
    expect(
      extractFragellaIdFromSearchItem({
        url: 'https://x.com/fragrances/%2',
      })
    ).toBeNull();
  });

  it('rejects blocklisted URL-derived segments like /fragrances/perfume', () => {
    expect(
      extractFragellaIdFromSearchItem({
        'Purchase URL': 'https://x.com/fragrances/perfume',
      })
    ).toBeNull();
    expect(
      extractFragellaIdFromSearchItem({
        url: 'https://x.com/fragrances/en_us',
      })
    ).toBeNull();
    expect(
      extractFragellaIdFromSearchItem({
        url: 'https://x.com/fragrances/eau-de-parfum',
      })
    ).toBeNull();
  });

  it('rejects blocklisted slugs in direct ID path', () => {
    expect(extractFragellaIdFromSearchItem({ slug: 'perfume' })).toBeNull();
    expect(extractFragellaIdFromSearchItem({ slug: 'fragrances' })).toBeNull();
    expect(extractFragellaIdFromSearchItem({ slug: 'eau-de-parfum' })).toBeNull();
  });

  it('accepts valid slugs in direct ID path', () => {
    expect(extractFragellaIdFromSearchItem({ slug: 'chanel-bleu' })).toBe('chanel-bleu');
  });
});

describe('extractFragellaIdFromSearchItem — PascalCase Name+Brand fallback', () => {
  it('derives slug from PascalCase Name + Brand when no id/slug exists', () => {
    expect(extractFragellaIdFromSearchItem({
      Name: 'Aventus',
      Brand: 'Creed',
      'Purchase URL': 'https://fragrancenet.com/cologne/creed/creed-aventus'
    })).toBe('creed-aventus');
  });

  it('derives slug with multi-word names', () => {
    expect(extractFragellaIdFromSearchItem({
      Name: 'Bleu de Chanel',
      Brand: 'Chanel'
    })).toBe('chanel-bleu-de-chanel');
  });

  it('derives slug with multi-word brand', () => {
    expect(extractFragellaIdFromSearchItem({
      Name: 'Oud Wood',
      Brand: 'Tom Ford'
    })).toBe('tom-ford-oud-wood');
  });

  it('handles camelCase brand object with name field', () => {
    expect(extractFragellaIdFromSearchItem({
      Name: 'Oud Wood',
      brand: { name: 'Tom Ford' }
    })).toBe('tom-ford-oud-wood');
  });

  it('returns null when Name is missing', () => {
    expect(extractFragellaIdFromSearchItem({
      Brand: 'Creed',
      'Purchase URL': 'https://example.com'
    })).toBeNull();
  });

  it('returns null when Brand is missing', () => {
    expect(extractFragellaIdFromSearchItem({
      Name: 'Aventus'
    })).toBeNull();
  });

  it('strips special characters from derived slug', () => {
    expect(extractFragellaIdFromSearchItem({
      Name: "Terre d'Hermès",
      Brand: 'Hermès'
    })).toBe('herms-terre-dherms');
  });

  it('prefers direct id over Name+Brand derivation', () => {
    expect(extractFragellaIdFromSearchItem({
      id: 'creed-aventus-123',
      Name: 'Aventus',
      Brand: 'Creed'
    })).toBe('creed-aventus-123');
  });

  it('prefers URL-derived id over Name+Brand derivation', () => {
    expect(extractFragellaIdFromSearchItem({
      Name: 'Aventus',
      Brand: 'Creed',
      'Purchase URL': 'https://fragella.com/ar/fragrances/creed-aventus-edp'
    })).toBe('creed-aventus-edp');
  });
});
