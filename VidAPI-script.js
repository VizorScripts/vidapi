(function () {
    const BASE_URL = 'https://vidapi.xyz/';

    async function fetchJson(url) {
        try {
            console.log(`Fetching: ${url}`);
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            console.log('API Response:', data);
            return data;
        } catch (error) {
            console.error('Fetch error:', error);
            return null;
        }
    }

    async function search(query) {
        const url = `${BASE_URL}ani-api/search?q=${encodeURIComponent(query)}&page=1`;
        const data = await fetchJson(url);
        return data && data.results && Array.isArray(data.results) ? data.results.map(item => ({
            id: item.id || item._id,
            title: item.title || item.name,
            description: item.description || '',
            thumbnail: item.thumbnail || item.image || '',
            year: item.year || 'Unknown'
        })) : (console.error('Invalid search response:', data), []);
    }

    async function details(linkUrl) {
        const url = `${BASE_URL}ani-api/anime?url=${encodeURIComponent(linkUrl)}`;
        const data = await fetchJson(url);
        return data && data.title ? {
            id: data.id || linkUrl,
            title: data.title,
            description: data.description || 'No description available',
            cast: data.cast || [],
            genres: data.genres || [],
            releaseDate: data.release_date || 'Unknown'
        } : (console.error('Invalid details response:', data), {});
    }

    async function content(linkUrl, episode) {
        const url = `${BASE_URL}embed/anime/${encodeURIComponent(linkUrl)}-${encodeURIComponent(episode)}`;
        return [{ url, quality: '720p', type: 'HLS' }];
    }

    function extractStreamUrl(html) {
        const scriptMatch = html.match(/<script[^>]*>\s*(eval\(function\(p,a,c,k,e,d[\s\S]*?)<\/script>/);
        if (!scriptMatch) {
            console.log("No packed script found");
            return JSON.stringify({ stream: 'N/A' });
        }
        
        try {
            const unpackedScript = eval(scriptMatch[1]);
            const streamMatch = unpackedScript.match(/(?<=file:")[^"]+/);
            const stream = streamMatch ? streamMatch[0].trim() : 'N/A';
            console.log(stream);
            return stream;
        } catch (e) {
            console.error("Error unpacking script:", e);
            return JSON.stringify({ stream: 'N/A' });
        }
    }

    export { search, details, content, extractStreamUrl };
})();
