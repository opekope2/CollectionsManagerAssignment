/**
 * Shortcut for document.getElementById
 * @param {string} id Element ID
 * @returns {HTMLElement|null}
 */
export function _(id) {
    return document.getElementById(id);
}

/**
 * Shortcut for document.createElement
 * 
 * @param {string} tag Element tag name
 * @param {Function} builder Element builder, which receives the newly created element as an argument
 * @returns {HTMLElement}
 */
export function element(tag, builder) {
    const element = document.createElement(tag);
    builder(element);
    return element;
}

/**
 * Creates a TR element from its given children
 * 
 * @param {Node} tds Child TD elements
 * @returns {HTMLTableRowElement}
 */
export function tr(tds) {
    return element("tr", tr => {
        for (const td of tds) {
            tr.appendChild(td);
        }
    });
}

/**
 * Creates a TD element with a given text content
 * 
 * @param {string|null} text The text content of the created TD element
 * @returns {HTMLTableCellElement}
 */
export function td(text) {
    return element("td", td => {
        if (text) {
            td.innerText = text;
        }
    });
}
