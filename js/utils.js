export function buildHighlightedTitle(title, query) {
    const container = document.createElement('span');

    const idx = title.toLowerCase().indexOf(query.toLowerCase());

    if (idx === -1) {
        container.textContent = title;
        return container;
    }

    const before = document.createTextNode(title.slice(0, idx));

    const match = document.createElement('span');
    match.className = 'highlight';
    match.textContent = title.slice(idx, idx + query.length);

    const after = document.createTextNode(
        title.slice(idx + query.length)
    );

    container.appendChild(before);
    container.appendChild(match);
    container.appendChild(after);

    return container;
}