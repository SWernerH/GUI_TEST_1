import { SearchComponent } from './search.js';

document.addEventListener('DOMContentLoaded', () => {
    new SearchComponent({
        input: document.getElementById('searchBox'),
        results: document.getElementById('results'),
        template: document.getElementById('movieTemplate'),
        appContainer: document.getElementById('app')
    });
});