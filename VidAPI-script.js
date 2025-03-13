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
        const url = `${BASE_URL}api/search?query=${encodeURIComponent(query)}`;
        const data = await fetchJson(url);
        return data && data.results ? data.results.map(item => ({
            id: item.id || item._id,
            title: item.title || item.name,
            description: item.description || '',
            thumbnail: item.thumbnail || item.image || '',
            year: item.year || 'Unknown'
        })) : (console.error('Invalid search response:', data), []);
    }

    async function details(id) {
        const url = `${BASE_URL}api/details?id=${encodeURIComponent(id)}`;
        const data = await fetchJson(url);
        return data && data.id ? {
            id: data.id,
            title: data.title,
            description: data.description,
            cast: data.cast || [],
            genres: data.genres || [],
            releaseDate: data.release_date || 'Unknown'
        } : (console.error('Invalid details response:', data), {});
    }

    async function content(id) {
        const url = `${BASE_URL}api/content?id=${encodeURIComponent(id)}`;
        const data = await fetchJson(url);
        return data && data.streams ? data.streams.map(stream => ({
            url: stream.url,
            quality: stream.quality || '720p',
            type: stream.type || 'HLS'
        })) : (console.error('Invalid content response:', data), []);
    }

    function extractStreamUrl(html) {
        const scriptMatch = html.match(/<script[^>]*>\s*(eval\(function\(p,a,c,k,e,d[\s\S]*?)<\/script>/);
        if (!scriptMatch) {
            console.log("No packed script found");
            return JSON.stringify({ stream: 'N/A' });
        }
        
        const unpackedScript = unpack(scriptMatch[1]);
        
        const streamMatch = unpackedScript.match(/(?<=file:")[^"]+/);
        const stream = streamMatch ? streamMatch[0].trim() : 'N/A';
        
        console.log(stream);
        return stream;
    }

    export { search, details, content, extractStreamUrl };
})();
