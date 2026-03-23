export function highlightTitle(title, query) {
    const container = document.createElement('span');
    const index = title.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) {
        container.textContent = title;
        return container;
    }
    const before = document.createTextNode(title.slice(0, index));
    const match = document.createElement('span');
    match.className = 'highlight';
    match.textContent = title.slice(index, index + query.length);
    const after = document.createTextNode(
        title.slice(index + query.length)
    );
    container.appendChild(before);
    container.appendChild(match);
    container.appendChild(after);
    return container;
}

export function getImageUrl(path, size = "w200") {
    if (!path) return "";
    return `https://image.tmdb.org/t/p/${size}${path}`;
}