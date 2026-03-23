import { highlightTitle, getImageUrl } from './utils.js';

const API_KEY = "58cca5da2d71b564b61032fb0a517020";
const BASE_URL = "https://api.themoviedb.org/3/search/movie";

let cache = new Map();
let abortController = null;
let debounceTimer = null;
let activeIndex = -1;

export function initSearch({ input, suggestions, template }) {

    input.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);

        debounceTimer = setTimeout(() => {
            handleSearch(e.target.value.trim(), suggestions, template);
        }, 300);
    });

    input.addEventListener('keydown', (e) => {
        const items = suggestions.querySelectorAll('.movie-item');

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIndex = (activeIndex + 1) % items.length;
            updateActive(items);
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIndex = (activeIndex - 1 + items.length) % items.length;
            updateActive(items);
        }

        if (e.key === 'Enter') {
            e.preventDefault();

            if (items[activeIndex]) {
                items[activeIndex].click();
                return;
            }

            const query = input.value.trim();
            if (query) {
                window.location.href = `results.html?q=${encodeURIComponent(query)}`;
            }
        }
    });
}

function updateActive(items) {
    items.forEach(item => item.classList.remove('active'));
    if (items[activeIndex]) {
        items[activeIndex].classList.add('active');
    }
}

async function handleSearch(query, suggestions, template) {
    suggestions.innerHTML = '';
    activeIndex = -1;

    if (!query) return;

    if (cache.has(query)) {
        renderSuggestions(cache.get(query), query, suggestions, template);
        return;
    }

    if (abortController) {
        abortController.abort();
    }

    abortController = new AbortController();

    try {
        document.body.setAttribute('data-loading', 'true');

        const url = `${BASE_URL}?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
        const res = await fetch(url, { signal: abortController.signal });
        const data = await res.json();

        const movies = data.results || [];
        cache.set(query, movies);

        renderSuggestions(movies, query, suggestions, template);

    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error(err);
        }
    } finally {
        document.body.setAttribute('data-loading', 'false');
    }
}

function renderSuggestions(movies, query, suggestions, template) {
    if (!movies.length) {
        suggestions.innerHTML = '<li class="no-results">No matches found.</li>';
        return;
    }

    const frag = new DocumentFragment();

    movies.slice(0, 6).forEach(movie => {
        const clone = template.content.cloneNode(true);

        const titleEl = clone.querySelector('.title');
        const imgEl = clone.querySelector('.poster');
        const item = clone.querySelector('.movie-item');

        titleEl.appendChild(highlightTitle(movie.title, query));
        imgEl.src = getImageUrl(movie.poster_path, 'w154');

        item.addEventListener('click', () => {
            window.location.href = `details.html?id=${movie.id}`;
        });

        frag.appendChild(clone);
    });

    suggestions.innerHTML = '';
    suggestions.appendChild(frag);
}