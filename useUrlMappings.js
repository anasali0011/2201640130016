// src/hooks/useUrlMappings.js
import { useState, useEffect } from 'react';
import log from '../logger'; // Logging middleware from Pre-Test Setup

const STORAGE_KEY = 'urlMappings';

const useUrlMappings = () => {
  const [mappings, setMappings] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setMappings(JSON.parse(stored));
      log('Loaded mappings from localStorage');
    }
  }, []);

  useEffect(() => {
    if (mappings.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mappings));
      log('Saved mappings to localStorage');
    }
  }, [mappings]);

  const addMapping = (newMapping) => {
    setMappings((prev) => [...prev, newMapping]);
    log(`Added new mapping: ${JSON.stringify(newMapping)}`);
  };

  const getMapping = (shortcode) => {
    log(`Fetching mapping for shortcode: ${shortcode}`);
    return mappings.find((m) => m.shortcode === shortcode);
  };

  const updateClicks = (shortcode) => {
    setMappings((prev) =>
      prev.map((m) =>
        m.shortcode === shortcode ? { ...m, clicks: m.clicks + 1 } : m
      )
    );
    log(`Incremented clicks for shortcode: ${shortcode}`);
  };

  return { mappings, addMapping, getMapping, updateClicks };
};

export default useUrlMappings;