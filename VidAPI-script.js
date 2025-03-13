// vizor
script: (function() {
    const BASE_URL = 'https://vidapi.xyz/';
    const CORS_PROXY = ''; // Add CORS proxy if needed

    async function fetchData(url) {
        try {
            const response = await fetch(CORS_PROXY + url, {
                headers: { "Referer": BASE_URL }
            });
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            return null;
        }
    }

    async function search(query) {
        const data = await fetchData(`${BASE_URL}ani-api/search?q=${encodeURIComponent(query)}&page=1`);
        return (data?.results || []).map(item => ({
            id: item.id || item._id,
            title: item.title || item.name,
            type: 'anime',
            thumbnail: item.thumbnail || item.image || '',
            year: item.year || '',
            rating: item.rating
        }));
    }

    async function details(linkUrl) {
        const data = await fetchData(`${BASE_URL}ani-api/anime?url=${encodeURIComponent(linkUrl)}`);
        if (!data) return {};
        
        return {
            title: data.title,
            description: data.description,
            episodes: data.episodes,
            genres: data.genres,
            status: data.status,
            totalEpisodes: data.total_episodes,
            otherInfo: {
                "Release Date": data.release_date,
                "Type": data.type,
                "Rating": data.rating
            }
        };
    }

    async function content(linkUrl, episode) {
        // Correctly format episode URL with '-episode-' segment
        const embedUrl = `${BASE_URL}embed/anime/${encodeURIComponent(linkUrl)}-episode-${encodeURIComponent(episode)}`;
        return [{
            url: embedUrl,
            quality: '720p',
            type: 'HLS',
            headers: { "Referer": BASE_URL }
        }];
    }

    function extractStreamUrl(html) {
        try {
            const packedScript = html.match(/eval\(function\(p,a,c,k,e,d.*?<\/script>/s)?.[0];
            if (!packedScript) return null;

            const unpacked = unescape(packedScript
                .replace(/<script.*?>|<\/script>/g, '')
                .replace(/eval\(/g, ''));
            
            const streamUrl = unpacked.match(/(file:|src:)"(.*?m3u8.*?)"/)?.[2];
            return streamUrl ? { url: streamUrl, headers: { "Referer": BASE_URL } } : null;
        } catch (e) {
            console.error('Extraction error:', e);
            return null;
        }
    }

    export { search, details, content, extractStreamUrl };
})();