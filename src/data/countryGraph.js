/**
 * Country border graph for North and Central America.
 *
 * Each key is a three-letter ISO-3166-1 alpha-3 country code.
 * Each value is an array of country codes that share a land border with the key country.
 *
 * This graph is undirected: if A borders B then B also borders A.
 * The graph covers the contiguous overland route from the USA south through Central America.
 */
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

/**
 * Full country names keyed by their three-letter code.
 * Used for display purposes in the results list.
 */
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
