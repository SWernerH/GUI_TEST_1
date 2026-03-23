import { getImageUrl } from './utils.js';

const API_KEY = '58cca5da2d71b564b61032fb0a517020';
const BASE_URL = 'https://api.themoviedb.org/3/search/movie';

function getQuery() {
    return new URLSearchParams(window.location.search).get('q') || '';
}

function createCard(movie) {
    const card = document.createElement('article');
    card.className = 'grid-card';
    card.addEventListener('click', () => {
        window.location.href = `details.html?id=${movie.id}`;
    });

    const poster = document.createElement('img');
    poster.className = 'grid-poster';
    poster.alt = movie.title;
    poster.src = getImageUrl(movie.poster_path, 'w342') || 'https://via.placeholder.com/342x513?text=No+Image';

    const title = document.createElement('h3');
    title.textContent = movie.title;

    card.appendChild(poster);
    card.appendChild(title);

    return card;
}

async function loadResults() {
    const query = getQuery().trim();
    const queryDisplay = document.getElementById('queryDisplay');
    const resultsGrid = document.getElementById('resultsGrid');
    const noResults = document.getElementById('noResults');

    queryDisplay.textContent = query ? `for "${query}"` : '';

    if (!query) {
        noResults.hidden = false;
        noResults.textContent = 'No search query specified. Use the search page first.';
        return;
    }

    const url = `${BASE_URL}?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        const movies = data.results || [];

        if (!movies.length) {
            noResults.hidden = false;
            resultsGrid.innerHTML = '';
            return;
        }

        noResults.hidden = true;
        resultsGrid.innerHTML = '';
        movies.forEach(movie => {
            const card = createCard(movie);
            resultsGrid.appendChild(card);
        });
    } catch (error) {
        console.error(error);
        noResults.hidden = false;
        noResults.textContent = 'Failed to fetch results. Please try again.';
    }
}

window.addEventListener('DOMContentLoaded', loadResults);
