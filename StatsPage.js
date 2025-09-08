// src/components/StatsPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import useUrlMappings from '../hooks/useUrlMappings';
import log from '../logger'; // Logging middleware from Pre-Test Setup

const StatsPage = () => {
  const { mappings } = useUrlMappings();
  log('Rendering statistics page');

  const activeMappings = mappings.filter((m) => new Date(m.expiresAt) > new Date());

  return (
    <div>
      <h2>URL Statistics</h2>
      <table>
        <thead>
          <tr>
            <th>Shortcode</th>
            <th>Long URL</th>
            <th>Expires At</th>
            <th>Clicks</th>
            <th>Redirect</th>
          </tr>
        </thead>
        <tbody>
          {activeMappings.map((m) => (
            <tr key={m.shortcode}>
              <td>{m.shortcode}</td>
              <td>{m.longUrl}</td>
              <td>{new Date(m.expiresAt).toLocaleString()}</td>
              <td>{m.clicks}</td>
              <td>
                <a href={`/${m.shortcode}`} target="_blank" rel="noopener noreferrer">Go</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/">Back to Shortener</Link>
    </div>
  );
};

export default StatsPage;