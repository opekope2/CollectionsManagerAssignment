import { Collection } from "./collections/Collection.js";
import { Item } from "./collections/Item.js";
import { BaseCollectionManager } from "./collections/manager/BaseCollectionManager.js";
import { StorageCollectionManager } from "./collections/manager/StorageCollectionManager.js";
import { _ } from "./util.js";

/**
 * @type {BaseCollectionManager}
 */
const collectionManager = new StorageCollectionManager(window.localStorage);
/**
 * @type {HTMLTableRowElement}
 */
const collectionTemplate = _("collectionTemplate");
collectionTemplate.id = null;
/**
 * @type {HTMLTableRowElement}
 */
const collectionItemsTemplate = _("collectionItemsTemplate");
collectionItemsTemplate.id = null;
/**
 * @type {HTMLTableRowElement}
 */
const collectionItemTemplate = _("collectionItemTemplate");
collectionItemTemplate.id = null;

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

    collectionManager.addCollection(new Collection(title, topic, new Date(date), []));
};

reloadCollections();

/**
 * Loads the collections into a table
 * 
 * @param {HTMLTableSectionElement} table The table element to append the collections into
 */
function loadCollectionsInto(table) {
    table.replaceChildren();

    const collections = collectionManager.getCollections();
    for (const collection of collections) {
        /**
         * @type {HTMLTableRowElement}
         */
        const collectionRow = collectionTemplate.cloneNode(true);
        collectionRow.querySelector('[data-template="name"]').textContent = collection.name;
        collectionRow.querySelector('[data-template="title"]').textContent = collection.topic;
        collectionRow.querySelector('[data-template="date"]').textContent = collection.date.toDateString();
        collectionRow.querySelector('[data-template="rename"]').onclick = () => {
            const name = prompt("Gyűjtemény átnevezése", collection.name);
            if (!name) return;

            collection.name = name;
            collectionManager.updateCollection(collection);
            reloadCollections();
        };
        collectionRow.querySelector('[data-template="addItem"]').onclick = () => {
            const name = prompt("Elem hozzáadása");
            if (!name) return;

            collection.addItem(new Item(name));
            collectionManager.updateCollection(collection);
            reloadCollections();
        };

        table.appendChild(collectionRow);

        if (!collection.items.length) continue;

        /**
         * @type {HTMLTableRowElement}
         */
        const collectionItemsRow = collectionItemsTemplate.cloneNode(true);
        const collectionItemsTable = collectionItemsRow.querySelector('[data-template="colletionItem"]');
        for (const item of collection.items) {
            /**
             * @type {HTMLTableRowElement}
             */
            const collectionItemRow = collectionItemTemplate.cloneNode(true);
            collectionItemRow.querySelector('[data-template="name"]').textContent = item.name;

            collectionItemsTable.appendChild(collectionItemRow);
        }

        table.appendChild(collectionItemsRow);
    }
}

function reloadCollections() {
    loadCollectionsInto(_("collections"));
}