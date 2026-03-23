import { initSearch } from './search.js';

document.addEventListener('DOMContentLoaded', () => {
    initSearch({
        input: document.getElementById('searchBox'),
        suggestions: document.getElementById('suggestions'),
        template: document.getElementById('movieTemplate')
    });
});