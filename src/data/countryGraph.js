// Adjacency list representation of the border graph — basically a dictionary
// where each key is a country and its value is the list of countries it touches.
// Using an object here so neighbor lookups are O(1) instead of scanning a flat array.
//
// All keys use ISO 3166-1 alpha-3 codes (3-letter codes) because they're
// unambiguous. "GT" could mean Guatemala or a dozen other things depending
// on the standard, but "GTM" is always Guatemala.
//
// The graph is undirected — if Mexico borders Guatemala then Guatemala
// borders Mexico. You'll notice each pair appears on both sides of the list.
// Keeping it symmetric makes the BFS simpler since it never has to think about
// direction.
//
// Scope is intentionally limited to the contiguous overland corridor from
// Canada down through Panama. Island nations (Cuba, Jamaica, etc.) are excluded
// because there's no truck route across open water.
export const COUNTRY_GRAPH = {
  USA: ['CAN', 'MEX'],
  CAN: ['USA'],
  MEX: ['USA', 'GTM', 'BLZ'],
  BLZ: ['MEX', 'GTM'],
  GTM: ['MEX', 'BLZ', 'SLV', 'HND'],
  SLV: ['GTM', 'HND'],
  HND: ['GTM', 'SLV', 'NIC'],
  NIC: ['HND', 'CRI'],
  CRI: ['NIC', 'PAN'],
  PAN: ['CRI'],
};

// Friendly display names keyed by the same 3-letter codes used in the graph.
// We keep this separate from the graph so the BFS logic never has to care
// about human-readable strings — that's purely a UI concern.
export const COUNTRY_NAMES = {
  USA: 'United States',
  CAN: 'Canada',
  MEX: 'Mexico',
  BLZ: 'Belize',
  GTM: 'Guatemala',
  SLV: 'El Salvador',
  HND: 'Honduras',
  NIC: 'Nicaragua',
  CRI: 'Costa Rica',
  PAN: 'Panama',
};
