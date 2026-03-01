import { useState } from 'react';
import { findRoute } from './utils/bfs';
import { COUNTRY_NAMES } from './data/countryGraph';
import './App.css';

export default function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null); // string[] | null
  const [error, setError] = useState('');

  function handleSearch(e) {
    e.preventDefault();
    const { path, error: routeError } = findRoute(input);
    if (routeError) {
      setError(routeError);
      setResult(null);
    } else {
      setError('');
      setResult(path);
    }
  }

  function handleInputChange(e) {
    setInput(e.target.value);
    // Clear previous results when the user starts typing again
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
                maxLength={3}
                autoComplete="off"
                spellCheck={false}
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

        {error && (
          <div id="error-message" className="error-box" role="alert">
            {error}
          </div>
        )}

        {result && (
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
                : `${result.length - 1} border crossing${result.length - 1 === 1 ? '' : 's'}`}
            </p>

            <ol className="route-list">
              {result.map((code, index) => (
                <li key={code} className="route-item">
                  <div className="route-card">
                    <span className="route-step">{index + 1}</span>
                    <div className="route-country">
                      <span className="route-code">{code}</span>
                      <span className="route-name">{COUNTRY_NAMES[code]}</span>
                    </div>
                  </div>
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
