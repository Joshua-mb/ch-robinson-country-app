import { COUNTRY_GRAPH } from '../data/countryGraph';

/**
 * Finds the shortest overland route from the USA to a destination country
 * using Breadth-First Search (BFS).
 *
 * BFS guarantees the shortest path in an unweighted graph because it explores
 * all nodes at the current depth before moving to nodes one level deeper.
 * The first time the destination is reached it must therefore be via the
 * fewest possible border crossings.
 *
 * Algorithm steps:
 *  1. Normalise the destination code to uppercase.
 *  2. Validate the code exists in the graph.
 *  3. Special-case: if destination is "USA" return ["USA"] immediately.
 *  4. Initialise the BFS queue with a single path: [["USA"]].
 *  5. Track visited nodes so we never revisit a country.
 *  6. Dequeue the first path, inspect the last node in that path.
 *     a. If it equals the destination, return the path — shortest route found.
 *     b. Otherwise, enqueue a new path for each unvisited neighbour.
 *  7. If the queue empties without finding the destination, no route exists.
 *
 * @param {string} destinationCode - Three-letter country code (case-insensitive).
 * @returns {{ path: string[] | null, error: string | null }}
 *   `path` is the ordered list of country codes from USA to destination,
 *   or null when no route exists. `error` is a human-readable message on
 *   failure, or null on success.
 */
export function findRoute(destinationCode) {
  if (!destinationCode || destinationCode.trim() === '') {
    return { path: null, error: 'Please enter a country code.' };
  }

  const destination = destinationCode.trim().toUpperCase();

  // Validate the destination exists in the known graph
  if (!COUNTRY_GRAPH[destination]) {
    return {
      path: null,
      error: `"${destinationCode.trim()}" is not a recognised country code. Valid codes: ${Object.keys(COUNTRY_GRAPH).join(', ')}.`,
    };
  }

  // Already at the starting point
  if (destination === 'USA') {
    return { path: ['USA'], error: null };
  }

  // BFS initialisation
  // Each element in the queue is a path (array of country codes) from USA
  // to the last node in that array.
  const queue = [['USA']];

  // Visited set prevents infinite loops in the undirected graph
  const visited = new Set(['USA']);

  while (queue.length > 0) {
    // Dequeue the first path (FIFO — essential for BFS level ordering)
    const currentPath = queue.shift();
    const currentCountry = currentPath[currentPath.length - 1];

    // Explore each neighbour of the current country
    for (const neighbour of COUNTRY_GRAPH[currentCountry]) {
      if (visited.has(neighbour)) continue;

      const newPath = [...currentPath, neighbour];

      // Destination reached — BFS guarantees this is the shortest path
      if (neighbour === destination) {
        return { path: newPath, error: null };
      }

      visited.add(neighbour);
      queue.push(newPath);
    }
  }

  // Queue exhausted without reaching destination (disconnected graph)
  return {
    path: null,
    error: `No overland route found from USA to ${destination}.`,
  };
}
