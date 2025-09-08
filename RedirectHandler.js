// src/components/RedirectHandler.js
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useUrlMappings from '../hooks/useUrlMappings';
import log from '../logger'; // Logging middleware from Pre-Test Setup

const RedirectHandler = () => {
  const { shortcode } = useParams();
  const { getMapping, updateClicks } = useUrlMappings();
  log(`Handling redirect for shortcode: ${shortcode}`);

  useEffect(() => {
    const mapping = getMapping(shortcode);
    if (mapping) {
      const now = new Date();
      const expiresAt = new Date(mapping.expiresAt);
      if (now < expiresAt) {
        updateClicks(shortcode);
        log(`Redirecting to: ${mapping.longUrl}`);
        window.location.href = mapping.longUrl;
      } else {
        log(`Shortcode expired: ${shortcode}`);
        // Render expired message
      }
    } else {
      log(`Shortcode not found: ${shortcode}`);
      // Render not found message
    }
  }, [shortcode, getMapping, updateClicks]);

  // Render loading or error
  const mapping = getMapping(shortcode);
  if (!mapping) {
    return <p>Short URL not found.</p>;
  }
  const now = new Date();
  const expiresAt = new Date(mapping.expiresAt);
  if (now >= expiresAt) {
    return <p>Short URL has expired.</p>;
  }
  return <p>Redirecting...</p>;
};

export default RedirectHandler;