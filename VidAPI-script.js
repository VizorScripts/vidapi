// VidAPI Module Script
// Version: 1.0
// Author: vizor
const BASE_URL = "https://vidapi.xyz/";

/**
 * Fetch helper to handle network errors and ensure valid JSON responses.
 */
async function fetchJson(url) {
  try {
    console.log(`Fetching: ${url}`); // Debugging log
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const json = await response.json();
    console.log("API Response:", json); // Debugging log
    return json;
  } catch (err) {
    console.error("Fetch error:", err);
    return null;
  }
}

/**
 * Search function for fetching shows/movies.
 * @param {string} query - Search term.
 * @returns {Promise<Array>} List of search results.
 */
async function search(query) {
  const url = `${BASE_URL}api/search?query=${encodeURIComponent(query)}`;
  const data = await fetchJson(url);
  
  if (!data || !data.results) {
    console.error("Invalid search response:", data);
    return [];
  }

  return data.results.map(item => ({
    id: item.id || item._id,  // Fallback if API uses _id
    title: item.title || item.name, // Some APIs use `name`
    description: item.description || "",
    thumbnail: item.thumbnail || item.image || "",
    year: item.year || "Unknown"
  }));
}

/**
 * Fetch details of a specific show/movie.
 * @param {string} id - Unique ID of the content.
 * @returns {Promise<Object>} Detailed metadata.
 */
async function details(id) {
  const url = `${BASE_URL}api/details?id=${encodeURIComponent(id)}`;
  const data = await fetchJson(url);
  
  if (!data || !data.id) {
    console.error("Invalid details response:", data);
    return {};
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    cast: data.cast || [],
    genres: data.genres || [],
    releaseDate: data.release_date || "Unknown"
  };
}

/**
 * Fetch streaming sources for a specific show/movie.
 * @param {string} id - Unique ID of the content.
 * @returns {Promise<Array>} List of streaming sources.
 */
async function content(id) {
  const url = `${BASE_URL}api/content?id=${encodeURIComponent(id)}`;
  const data = await fetchJson(url);
  
  if (!data || !data.streams) {
    console.error("Invalid content response:", data);
    return [];
  }

  return data.streams.map(stream => ({
    url: stream.url,
    quality: stream.quality || "720p",
    type: stream.type || "HLS"
  }));
}

// Export functions for Sora.
export { search, details, content };