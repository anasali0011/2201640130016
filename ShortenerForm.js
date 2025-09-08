// src/components/ShortenerForm.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useUrlMappings from '../hooks/useUrlMappings';
import log from '../logger'; // Logging middleware from Pre-Test Setup

const ShortenerForm = () => {
  const [longUrl, setLongUrl] = useState('');
  const [customShortcode, setCustomShortcode] = useState('');
  const [validityMinutes, setValidityMinutes] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const { addMapping, mappings } = useUrlMappings();

  const generateShortcode = () => {
    log('Generating random shortcode');
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  };

  const isShortcodeUnique = (code) => {
    log(`Checking uniqueness for shortcode: ${code}`);
    return !mappings.some((m) => m.shortcode === code);
  };

  const validateCustomShortcode = (code) => {
    const regex = /^[a-zA-Z0-9]{4,10}$/;
    return regex.test(code);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    log(`Submitting form with longUrl: ${longUrl}, customShortcode: ${customShortcode}, validityMinutes: ${validityMinutes}`);

    if (!longUrl) {
      setError('Long URL is required');
      log('Error: Long URL is required');
      return;
    }

    let shortcode = customShortcode.trim();
    if (shortcode) {
      log(`Validating custom shortcode: ${shortcode}`);
      if (!validateCustomShortcode(shortcode)) {
        setError('Custom shortcode must be alphanumeric and between 4-10 characters');
        log('Error: Invalid custom shortcode');
        return;
      }
      if (!isShortcodeUnique(shortcode)) {
        setError('Custom shortcode already exists');
        log('Error: Custom shortcode already exists');
        return;
      }
    } else {
      do {
        shortcode = generateShortcode();
      } while (!isShortcodeUnique(shortcode));
      log(`Generated unique shortcode: ${shortcode}`);
    }

    const validity = validityMinutes ? parseInt(validityMinutes, 10) : 30;
    const expiresAt = new Date(Date.now() + validity * 60 * 1000).toISOString();
    log(`Setting expiration to: ${expiresAt}`);

    addMapping({ shortcode, longUrl, expiresAt, clicks: 0 });
    setResult(`${window.location.origin}/${shortcode}`);
    log(`Short URL created: ${window.location.origin}/${shortcode}`);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Long URL:
          <input
            type="url"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Custom Shortcode (optional):
          <input
            type="text"
            value={customShortcode}
            onChange={(e) => setCustomShortcode(e.target.value)}
          />
        </label>
        <br />
        <label>
          Validity (minutes, optional, default 30):
          <input
            type="number"
            value={validityMinutes}
            onChange={(e) => setValidityMinutes(e.target.value)}
            min="1"
          />
        </label>
        <br />
        <button type="submit">Shorten URL</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && (
        <div>
          <p>Short URL: <a href={result} target="_blank" rel="noopener noreferrer">{result}</a></p>
        </div>
      )}
      <Link to="/stats">View Statistics</Link>
    </div>
  );
};

export default ShortenerForm;