import { buildHighlightedTitle } from './utils.js';

const API_KEY = "58cca5da2d71b564b61032fb0a517020";
const BASE_URL = "https://api.themoviedb.org/3/search/movie";

export class SearchComponent {
    constructor({ input, results, template, appContainer }) {
        this.input = input;
        this.results = results;
        this.template = template;
        this.appContainer = appContainer;

        this.cache = new Map();
        this.abortController = null;
        this.debounceTimer = null;

        this.init();
    }

    init() {
        this.input.addEventListener('input', (e) => {
            clearTimeout(this.debounceTimer);

            this.debounceTimer = setTimeout(() => {
                this.search(e.target.value.trim());
            }, 300);
        });
    }

    async search(query) {
        if (!query) return;

        console.log("Searching for:", query);

        // CACHE CHECK
        if (this.cache.has(query)) {
            console.log("Loaded from cache");
            this.render(this.cache.get(query), query);
            return;
        }

        // ABORT PREVIOUS REQUEST
        if (this.abortController) {
            console.log("Aborting previous request");
            this.abortController.abort();
        }

        this.abortController = new AbortController();

        this.appContainer.setAttribute('data-loading', 'true');

        try {
            const url = `${BASE_URL}?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;

            const res = await fetch(url, {
                signal: this.abortController.signal
            });

            const data = await res.json();

            console.log("API Data:", data);

            const results = data.results || [];

            this.cache.set(query, results);

            this.render(results, query);

        } catch (err) {
            if (err.name !== "AbortError") {
                console.error("Error:", err);
            }
        }

        this.appContainer.setAttribute('data-loading', 'false');
    }

    render(results, query) {
        const frag = new DocumentFragment();

        results.forEach(movie => {
            const clone = this.template.content.cloneNode(true);

            const titleEl = clone.querySelector('.title');

            const highlighted = buildHighlightedTitle(movie.title, query);

            titleEl.appendChild(highlighted);

            frag.appendChild(clone);
        });

        this.results.innerHTML = '';
        this.results.appendChild(frag);

        console.log("Rendered:", results.length);
    }
}