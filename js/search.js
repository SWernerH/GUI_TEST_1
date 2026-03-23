import { highlightTitle, getImageUrl } from './utils.js';

const API_KEY = "58cca5da2d71b564b61032fb0a517020";
const BASE_URL = "https://api.themoviedb.org/3/search/movie";

let cache = new Map();
let abortController = null;
let debounceTimer = null;

export function initSearch({ input, results, template, appContainer, details }) {

    input.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);

        debounceTimer = setTimeout(() => {
            handleSearch(e.target.value.trim(), results, template, appContainer, details);
        }, 300);
    });
}

async function handleSearch(query, results, template, appContainer, details) {
    if (!query) return;

    console.log("Searching:", query);

    if (cache.has(query)) {
        renderResults(cache.get(query), query, results, template, details);
        return;
    }

    if (abortController) {
        abortController.abort();
    }

    abortController = new AbortController();

    appContainer.setAttribute('data-loading', 'true');

    try {
        const url = `${BASE_URL}?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;

        const res = await fetch(url, {
            signal: abortController.signal
        });

        const data = await res.json();
        const movies = data.results || [];

        cache.set(query, movies);

        renderResults(movies, query, results, template, details);

    } catch (err) {
        if (err.name !== "AbortError") {
            console.error(err);
        }
    }

    appContainer.setAttribute('data-loading', 'false');
}

function renderResults(movies, query, results, template, details) {
    const frag = new DocumentFragment();

    movies.forEach(movie => {
        const clone = template.content.cloneNode(true);

        const titleEl = clone.querySelector('.title');
        const imgEl = clone.querySelector('.poster');

        // Title highlight
        titleEl.appendChild(highlightTitle(movie.title, query));

        // Poster (flyer)
        imgEl.src = getImageUrl(movie.poster_path, "w200");

        // Click → show banner
        clone.querySelector('.movie-item').addEventListener('click', () => {
            showDetails(movie, details);
        });

        frag.appendChild(clone);
    });

    results.innerHTML = '';
    results.appendChild(frag);
}

function showDetails(movie, details) {
    const banner = getImageUrl(movie.backdrop_path, "w780");

    details.innerHTML = `
        <h2>${movie.title}</h2>
        <img src="${banner}" style="width:100%; margin-top:10px;" />
        <p>${movie.overview || "No description available."}</p>
    `;
}