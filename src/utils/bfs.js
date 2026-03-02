import { COUNTRY_GRAPH } from '../data/countryGraph';

// Finds the shortest overland route from the USA to a destination country.
// We're using BFS (Breadth-First Search) because it explores level by level —
// all 1-hop neighbors first, then 2-hop, then 3-hop, and so on. That means
// the very first time we reach the destination it's guaranteed to be via the
// fewest border crossings. Dijkstra's would also work but it's overkill here
// since every border crossing has the same "cost" (there are no weights).
export function findRoute(destinationCode) {
  if (!destinationCode || destinationCode.trim() === '') {
    return { path: null, error: 'Please enter a country code.' };
  }

  // Normalize to uppercase so "pan", "Pan", and "PAN" all work the same way.
  // Doing this once up front means we never have to think about case again.
  const destination = destinationCode.trim().toUpperCase();

  // If the code isn't in our graph it's either a real country we haven't
  // modeled (like Cuba) or a typo. Either way we can't route to it.
  if (!COUNTRY_GRAPH[destination]) {
    return {
      path: null,
      error: `"${destination}" is not a recognised country code. Valid codes: ${Object.keys(COUNTRY_GRAPH).join(', ')}.`,
    };
  }

  // Edge case: the user asked for a route to the starting point itself.
  // Returning ["USA"] here keeps the path format consistent — it's always
  // an ordered list of codes — without running BFS unnecessarily.
  if (destination === 'USA') {
    return { path: ['USA'], error: null };
  }

  // The queue stores full paths, not just individual nodes. Each item is
  // an array of country codes representing the route walked so far.
  // Storing paths instead of just the "current node" lets us reconstruct
  // the answer for free — when we hit the destination the path IS the answer.
  const queue = [['USA']];

  // The visited Set prevents us from circling back to a country we've already
  // been to. Without this, the undirected graph would cause infinite loops
  // (USA -> MEX -> USA -> MEX -> ...).
  const visited = new Set(['USA']);

  while (queue.length > 0) {
    // shift() pulls from the front — this is what makes it BFS (FIFO order).
    // If we used pop() instead we'd get DFS, which wouldn't guarantee the
    // shortest path.
    const currentPath = queue.shift();
    const currentCountry = currentPath[currentPath.length - 1];

    for (const neighbour of COUNTRY_GRAPH[currentCountry]) {
      // Skip any country we've already queued up — we only need to visit
      // each node once since the first visit is always the shortest route.
      if (visited.has(neighbour)) continue;

      // Build the new path by appending the neighbor to the current path.
      // Spread instead of push so each path in the queue stays independent
      // (push would mutate the shared array).
      const newPath = [...currentPath, neighbour];

      // BFS guarantees that the first time we land on the destination node,
      // we got there via the fewest border crossings — so we're done.
      if (neighbour === destination) {
        return { path: newPath, error: null };
      }

      visited.add(neighbour);
      queue.push(newPath);
    }
  }

  // If we drain the whole queue without ever hitting the destination, there's
  // no connected path — the two countries are in separate components of the
  // graph. Shouldn't happen with our current data but good to handle anyway.
  return {
    path: null,
    error: `No overland route found from USA to ${destination}.`,
  };
}
