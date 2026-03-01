# C.H. Robinson Country Route Finder

A React web application that calculates the shortest overland truck route from the **USA** to any country in North and Central America using Breadth-First Search (BFS).

---

## Tech Stack

| Layer      | Choice                          |
|------------|---------------------------------|
| Framework  | React 19 (Create React App)     |
| Language   | JavaScript (ES2020+)            |
| Styling    | Plain CSS (custom properties)   |
| Algorithm  | BFS (breadth-first search)      |
| Testing    | Jest + React Testing Library    |

---

## How to Run Locally

**Prerequisites:** Node.js 18+ and npm.

```bash
# 1. Clone the repository
git clone <repo-url>
cd ch-robinson-country-app

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The page reloads automatically on file changes.

### Other scripts

```bash
npm test    # Run tests in watch mode
npm run build  # Production build to /build
```

---

## How BFS Works in This App

BFS guarantees the **shortest path** in an unweighted, undirected graph by exploring nodes layer by layer—all countries reachable in 1 crossing before any reachable in 2, and so on.

### Step-by-step

1. **Initialise** the queue with a single path: `[["USA"]]`.
2. **Dequeue** the first path and inspect its last node (the current country).
3. **Goal check** — if the current country is the destination, return the path immediately. Because BFS processes nodes in order of distance, the first match is always the shortest route.
4. **Expand** — for each unvisited neighbour of the current country, create a new path by appending the neighbour and enqueue it.
5. **Mark visited** — a `Set` prevents revisiting countries, avoiding cycles.
6. **Repeat** from step 2 until the destination is found or the queue empties (no route).

### Example: USA → PAN

```
Queue start: [["USA"]]

Level 1 → enqueue: ["USA","CAN"], ["USA","MEX"]
Level 2 → enqueue: ["USA","MEX","GTM"], ["USA","MEX","BLZ"]
Level 3 → enqueue paths through GTM and BLZ neighbours …
…
Found: ["USA","MEX","GTM","HND","NIC","CRI","PAN"]  ← 6 border crossings
```

Implementation: [src/utils/bfs.js](src/utils/bfs.js)
Graph data: [src/data/countryGraph.js](src/data/countryGraph.js)

---

## Project Structure

```
src/
├── data/
│   └── countryGraph.js   # Country border adjacency map + display names
├── utils/
│   └── bfs.js            # findRoute() — BFS pathfinding logic
├── App.js                # Main React component (form, results display)
├── App.css               # All styles
└── index.js              # React entry point
```

---

## Assumptions

| # | Assumption |
|---|-----------|
| 1 | **Shortest path** is always preferred when multiple overland routes exist between two countries. |
| 2 | **USA is always the starting point.** Entering `USA` returns `["USA"]` immediately. |
| 3 | **CAN is a valid destination.** It returns `["USA", "CAN"]` (one border crossing). |
| 4 | The graph covers only **contiguous land borders** in North and Central America — no sea routes. |
| 5 | Country codes are treated **case-insensitively** (`pan`, `Pan`, and `PAN` are all accepted). |
| 6 | **Empty input** prompts the user to enter a code rather than performing a search. |
| 7 | The graph is **undirected**: if country A borders B then B also borders A. |

---

## Supported Countries

| Code | Country      |
|------|--------------|
| USA  | United States |
| CAN  | Canada        |
| MEX  | Mexico        |
| BLZ  | Belize        |
| GTM  | Guatemala     |
| SLV  | El Salvador   |
| HND  | Honduras      |
| NIC  | Nicaragua     |
| CRI  | Costa Rica    |
| PAN  | Panama        |
