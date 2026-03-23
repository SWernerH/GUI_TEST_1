import { getImageUrl } from './utils.js';

const API_KEY = '58cca5da2d71b564b61032fb0a517020';
const DETAILS_URL = 'https://api.themoviedb.org/3/movie';

function getMovieId() {
    return new URLSearchParams(window.location.search).get('id');
}

async function loadMovie() {
    const id = getMovieId();
    const detailsEl = document.getElementById('movieDetails');

    if (!id) {
        detailsEl.innerHTML = '<p class="error">Missing movie id.</p>';
        return;
    }

    try {
        const [detailsRes, creditsRes, videosRes] = await Promise.allSettled([
            fetch(`${DETAILS_URL}/${id}?api_key=${API_KEY}`),
            fetch(`${DETAILS_URL}/${id}/credits?api_key=${API_KEY}`),
            fetch(`${DETAILS_URL}/${id}/videos?api_key=${API_KEY}`)
        ]);

        const movie = detailsRes.status === 'fulfilled' ? await detailsRes.value.json() : null;
        const credits = creditsRes.status === 'fulfilled' ? await creditsRes.value.json() : null;
        const videos = videosRes.status === 'fulfilled' ? await videosRes.value.json() : null;

        if (!movie) throw new Error("Movie failed");

        const cast = credits?.cast?.slice(0, 5).map(c => c.name).join(', ') || 'N/A';
        const trailer = videos?.results?.find(v => v.type === 'Trailer');
        const trailerLink = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;

        const backdropUrl = getImageUrl(movie.backdrop_path, 'w780');
        const posterUrl = getImageUrl(movie.poster_path, 'w500');

        detailsEl.innerHTML = `
            <div class="banner" style="background-image:url('${backdropUrl || ''}')"></div>
            <div class="details-content">
                <img class="poster-large" src="${posterUrl}" alt="${movie.title}" />
                <div class="text-block">
                    <h2>${movie.title}</h2>
                    <p>${movie.overview}</p>
                    <p><strong>Cast:</strong> ${cast}</p>
                    ${trailerLink ? `<a href="${trailerLink}" target="_blank">Watch Trailer</a>` : ''}
                </div>
            </div>
        `;
    } catch (err) {
        console.error(err);
        detailsEl.innerHTML = '<p class="error">Failed to load movie.</p>';
    }
}

window.addEventListener('DOMContentLoaded', loadMovie);