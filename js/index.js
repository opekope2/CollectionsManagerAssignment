import { Collection } from "./collections/Collection.js";
import { BaseCollectionManager } from "./collections/manager/BaseCollectionManager.js";
import { StorageCollectionManager } from "./collections/manager/StorageCollectionManager.js";
import { _, element, td, tr } from "./util.js";

/**
 * @type {BaseCollectionManager}
 */
const collectionManager = new StorageCollectionManager(window.localStorage);

_("createCollectionForm").onsubmit = event => {
    /**
     * @type {HTMLFormElement}
     */
    const form = event.target;
    /**
     * @type {HTMLFormControlsCollection}
     */
    const elements = form.elements;
    const title = elements["title"].value,
        topic = elements["topic"].value,
        date = elements["date"].value;

    collectionManager.addCollection(new Collection(title, topic, new Date(date)));
};

reloadCollections();

/**
 * Loads the collections into a table
 * 
 * @param {HTMLTableSectionElement} table The table element to append the collections into
 */
function loadCollectionsInto(table) {
    // Clear children
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }

    // Populate children
    const collections = collectionManager.getCollections();
    for (const collection of collections) {
        const title = td(collection.name),
            topic = td(collection.topic),
            date = td(collection.date.toDateString()),
            operations = td(null);
        const rename = element("button", button => {
            button.type = "button";
            button.classList.add("btn", "btn-outline-secondary");
            button.textContent = "Átnevezés";
            button.onclick = () => {
                const name = prompt("Gyűjtemény átnevezése", collection.name);
                if (!name) return;

                collection.name = name;
                collectionManager.updateCollection(collection);
                reloadCollections();
            };
        });

        operations.appendChild(rename);

        table.appendChild(tr([title, topic, date, operations]));
    }
}

function reloadCollections() {
    loadCollectionsInto(_("collections"));
}