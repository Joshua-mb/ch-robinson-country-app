# C.H. Robinson Country Route Finder

An app that finds the shortest route of countries a truck driver must travel through from the USA to a destination country. Built for C.H. Robinson to help determine what customs documentation is needed for North American shipments.

**Live URL:** https://orange-tree-0bc10780f.2.azurestaticapps.net/

---

## Requirements

- User enters a 3-letter country code
- App displays the ordered list of countries from USA to the destination
- Valid codes: `CAN`, `USA`, `MEX`, `BLZ`, `GTM`, `SLV`, `HND`, `NIC`, `CRI`, `PAN` (not case-sensitive)

---

## How to Use

1. Visit the [live URL](https://orange-tree-0bc10780f2.azurestaticapps.net)
2. Enter a 3-letter country code into the input field
3. The route list will display on screen

---

## Responses

**Success** — displays the ordered route from USA to destination:
```
USA → MEX → GTM → HND → NIC → CRI → PAN
```

**Failure** — displays a clear error message if an invalid code is entered:
```
"XYZ" is not a recognised country code. Valid codes: USA, CAN, MEX, ...
```

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

Open [http://localhost:3000](http://localhost:3000). The page reloads automatically on file changes.

```bash
npm test        # Run the test suite
npm run build   # Production build to /build
```

---

## How BFS Works

BFS (Breadth-First Search) guarantees the shortest path in a graph by exploring all nodes at the current distance before moving one step further. The first time the destination is reached it is always via the fewest possible border crossings.

**Steps:**

1. Start the queue with a single path: `[["USA"]]`
2. Dequeue the first path and look at its last country
3. If that country is the destination, return the path — it's the shortest route
4. Otherwise, enqueue a new path for each unvisited neighbour
5. A `visited` Set prevents revisiting countries and avoids infinite loops
6. If the queue empties without finding the destination, no overland route exists

**Example — USA → PAN:**

```
Start:   [["USA"]]
Level 1: ["USA","CAN"]  ["USA","MEX"]
Level 2: ["USA","MEX","GTM"]  ["USA","MEX","BLZ"]
...
Found:   ["USA","MEX","GTM","HND","NIC","CRI","PAN"]  (6 crossings)
```

---

## Design Decisions

- **React** — matches C.H. Robinson's frontend tech stack
- **BFS** — guarantees the shortest path through the country graph; simple and correct for this small, unweighted graph
- **Azure Static Web Apps + GitHub Actions** — every push to the main branch automatically redeploys the site via CI/CD

---

## Assumptions

| # | Assumption |
|---|-----------|
| 1 | Shortest path is used when multiple overland routes exist |
| 2 | USA is always the starting point and is included first in the result |
| 3 | Entering `CAN` returns `["USA", "CAN"]` |
| 4 | Entering `USA` returns `["USA"]` — the driver is already at the start |
| 5 | Invalid codes return an error message listing the valid options |
| 6 | No special case is needed for Alaska (overland route only; ferry routes excluded) |
| 7 | Country codes are case-insensitive — `pan`, `Pan`, and `PAN` all work |

---

## File Structure

```
src/
├── data/
│   └── countryGraph.js     # COUNTRY_GRAPH adjacency map and COUNTRY_NAMES display labels.
│                           # Pure data — no logic. Edit here to add or change borders.
│
├── utils/
│   └── bfs.js              # findRoute(code) — BFS pathfinding function.
│                           # Takes a country code, returns { path, error }.
│                           # No React imports; can be tested independently.
│
├── App.js                  # Main React component. Owns the input field, calls
│                           # findRoute(), and renders the route list or error message.
│
├── App.css                 # All styles for the app (variables, layout, form, results).
│
├── index.js                # React entry point — mounts <App /> into the DOM.
│
└── App.test.js             # Placeholder test file from Create React App scaffold.

public/
└── index.html              # HTML shell that Create React App builds into.
```

---

## Tech Stack

| Layer      | Choice                       |
|------------|------------------------------|
| Framework  | React 19 (Create React App)  |
| Language   | JavaScript (ES2020+)         |
| Styling    | Plain CSS (custom properties)|
| Algorithm  | BFS (breadth-first search)   |
| Hosting    | Azure Static Web Apps        |
| CI/CD      | GitHub Actions               |
