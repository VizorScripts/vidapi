// VidAPI Module Script
// Version: 1.0
// Author: vizor

/**
 * VidAPI Scraper Module for Sora
 * This module implements the core functions to search for content,
 * fetch detailed metadata, and retrieve streaming sources from VidAPI.
 *
 * Endpoints assumed:
 *  - Search: GET https://vidapi.xyz/api/search?query=<search-term>
 *  - Details: GET https://vidapi.xyz/api/details?id=<item-id>
 *  - Content: GET https://vidapi.xyz/api/content?id=<item-id>
 *
 * Adjust the endpoint paths if needed.
 */

// Base URL as defined in the JSON configuration.
const BASE_URL = "https://vidapi.xyz/";

/**
 * Search for shows or movies.
 * @param {string} query - The search term.
 * @returns {Promise<Array>} A promise that resolves to an array of search result objects.
 */
async function search(query) {
  const url = `${BASE_URL}api/search?query=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Network error during search.");
    }
    const data = await res.json();
    // Map the response data to the Sora expected format.
    return data.results.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      thumbnail: item.thumbnail,
      year: item.year
    }));
  } catch (err) {
    console.error("Search error:", err);
    return [];
  }
}

/**
 * Get details of a specific show or movie.
 * @param {string} id - The identifier of the item.
 * @returns {Promise<Object>} A promise that resolves to an object with detailed metadata.
 */
async function details(id) {
  const url = `${BASE_URL}api/details?id=${encodeURIComponent(id)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Network error during details fetch.");
    }
    const data = await res.json();
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      cast: data.cast,
      genres: data.genres,
      releaseDate: data.release_date
    };
  } catch (err) {
    console.error("Details error:", err);
    return {};
  }
}

/**
 * Get streaming sources for a specific show or movie.
 * @param {string} id - The identifier of the item.
 * @returns {Promise<Array>} A promise that resolves to an array of stream source objects.
 */
async function content(id) {
  const url = `${BASE_URL}api/content?id=${encodeURIComponent(id)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Network error during content fetch.");
    }
    const data = await res.json();
    // Map each stream to include its URL, quality, and type.
    return data.streams.map(stream => ({
      url: stream.url,
      quality: stream.quality || "720p", // default to 720p if not provided
      type: stream.type || "HLS"         // default to HLS if not provided
    }));
  } catch (err) {
    console.error("Content error:", err);
    return [];
  }
}

// Export functions so Sora can invoke them.
export { search, details, content };