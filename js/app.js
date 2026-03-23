import { initSearch } from './search.js';

document.addEventListener('DOMContentLoaded', () => {
    initSearch({
        input: document.getElementById('searchBox'),
        results: document.getElementById('results'),
        template: document.getElementById('movieTemplate'),
        appContainer: document.getElementById('app'),
        details: document.getElementById('movie-info')
    });
});