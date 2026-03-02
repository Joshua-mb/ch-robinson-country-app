import { useState } from 'react';
import { findRoute } from './utils/bfs';
import { COUNTRY_NAMES } from './data/countryGraph';
import './App.css';

export default function App() {
  // Three separate pieces of state instead of one big object — keeps re-renders
  // scoped. When the error changes, React only re-renders what depends on error,
  // not the whole component tree.
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null); // string[] of country codes, or null
  const [error, setError] = useState('');

  function handleSearch(e) {
    // Prevent the form from doing a full page reload on submit — the default
    // browser behavior for forms. We're handling everything in JS instead.
    e.preventDefault();
    const { path, error: routeError } = findRoute(input);
    if (routeError) {
      setError(routeError);
      setResult(null); // make sure any stale route doesn't show alongside the error
    } else {
      setError('');
      setResult(path);
    }
  }

  function handleInputChange(e) {
    setInput(e.target.value);
    // Wipe the previous result as soon as the user starts editing so they
    // don't accidentally read a route that's no longer for what they typed.
    if (result || error) {
      setResult(null);
      setError('');
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">C.H. Robinson Country Route Finder</h1>
        <p className="app-subtitle">
          Find the shortest overland truck route from the&nbsp;
          <span className="highlight">USA</span> to your destination.
        </p>
      </header>

      <main className="app-main">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="input-group">
            <label htmlFor="country-input" className="input-label">
              Destination Country Code
            </label>
            <div className="input-row">
              <input
                id="country-input"
                type="text"
                className="country-input"
                value={input}
                onChange={handleInputChange}
                placeholder="e.g. PAN"
                maxLength={3}    // ISO alpha-3 codes are exactly 3 characters
                autoComplete="off"
                spellCheck={false}
                // Ties this input to the error message for screen readers —
                // when aria-describedby is set, assistive tech reads the
                // linked element after the input's own label.
                aria-describedby={error ? 'error-message' : undefined}
              />
              <button type="submit" className="search-btn">
                Find Route
              </button>
            </div>
            <p className="input-hint">
              Enter a 3-letter ISO country code (case-insensitive).
            </p>
          </div>
        </form>

        {/* role="alert" tells screen readers to announce this immediately
            when it appears, without the user having to navigate to it. */}
        {error && (
          <div id="error-message" className="error-box" role="alert">
            {error}
          </div>
        )}

        {result && (
          // aria-live="polite" means the result will be announced after the
          // user finishes what they're doing — less disruptive than "assertive"
          // which would interrupt them mid-sentence.
          <section className="result-section" aria-live="polite">
            <h2 className="result-heading">
              Route&nbsp;
              <span className="highlight">
                USA &rarr; {result[result.length - 1]}
              </span>
            </h2>
            <p className="result-meta">
              {result.length === 1
                ? 'You are already at the starting point.'
                // result.length - 1 gives us the number of border crossings
                // (total stops minus the starting country USA).
                : `${result.length - 1} border crossing${result.length - 1 === 1 ? '' : 's'}`}
            </p>

            {/* Ordered list so the numbering is semantic, not just visual.
                Screen readers will announce "1 of 4, United States" etc. */}
            <ol className="route-list">
              {result.map((code, index) => (
                <li key={code} className="route-item">
                  <div className="route-card">
                    <span className="route-step">{index + 1}</span>
                    <div className="route-country">
                      <span className="route-code">{code}</span>
                      {/* Look up the full name from COUNTRY_NAMES so we're
                          not duplicating that data inside the component. */}
                      <span className="route-name">{COUNTRY_NAMES[code]}</span>
                    </div>
                  </div>
                  {/* Only render the arrow between stops, not after the last one. */}
                  {index < result.length - 1 && (
                    <span className="route-arrow" aria-hidden="true">&#8595;</span>
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}
      </main>

      <footer className="app-footer">
        <p>Routes cover overland truck travel through North &amp; Central America only.</p>
      </footer>
    </div>
  );
}
