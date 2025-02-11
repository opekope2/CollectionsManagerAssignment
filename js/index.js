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
 * @type {HTMLDivElement}
 */
const moveItemList = _("moveItemList");

/**
 * @type {HTMLTableRowElement}
 */
const collectionTemplate = _("collectionTemplate");
collectionTemplate.removeAttribute("id");
/**
 * @type {HTMLTableRowElement}
 */
const collectionItemsTemplate = _("collectionItemsTemplate");
collectionItemsTemplate.removeAttribute("id");
/**
 * @type {HTMLLIElement}
 */
const collectionItemTemplate = _("collectionItemTemplate");
collectionItemTemplate.removeAttribute("id");
/**
 * @type {HTMLButtonElement}
 */
const moveItemButtonTemplate = _("moveItemButtonTemplate");
moveItemButtonTemplate.removeAttribute("id");

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
    for (const [i, collection] of collections.entries()) {
        /**
         * @type {Item[]}
         */
        const itemsToRemove = [];
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
        /**
         * @type {HTMLButtonElement}
         */
        const removeItemsButton = collectionRow.querySelector('[data-template="removeItems"]');
        removeItemsButton.onclick = () => {
            if (confirm(`Biztosan törölsz ${itemsToRemove.length} elemet?`)) {
                for (const itemToRemove of itemsToRemove) {
                    collection.removeItem(itemToRemove);
                }
                itemsToRemove.splice(0, itemsToRemove.length);
                removeItemsButton.disabled = true;
                collectionManager.updateCollection(collection);
                reloadCollections();
            }
        };

        table.appendChild(collectionRow);

        if (!collection.items.length) continue;

        /**
         * @type {HTMLTableRowElement}
         */
        const collectionItemsRow = collectionItemsTemplate.cloneNode(true);
        const collectionItemsTable = collectionItemsRow.querySelector('[data-template="colletionItem"]');
        for (const [j, item] of collection.items.entries()) {
            /**
             * @type {HTMLLIElement}
             */
            const collectionItemRow = collectionItemTemplate.cloneNode(true);
            /**
             * @type {HTMLInputElement}
             */
            const nameCheckbox = collectionItemRow.querySelector('[data-template="nameCheckbox"]');
            /** 
             * @type {HTMLLabelElement}
             */
            const nameLabel = collectionItemRow.querySelector('[data-template="nameLabel"]');
            nameCheckbox.id = `collection${i}item${j}`;
            nameCheckbox.onchange = () => {
                if (nameCheckbox.checked) {
                    itemsToRemove.push(item);
                    removeItemsButton.disabled = false;
                } else {
                    const index = itemsToRemove.indexOf(item);
                    if (index > -1) {
                        itemsToRemove.splice(index, 1);
                    }
                    if (!itemsToRemove.length) {
                        removeItemsButton.disabled = true;
                    }
                }
            }
            nameLabel.htmlFor = `collection${i}item${j}`;
            nameLabel.textContent = item.name;
            collectionItemRow.querySelector('[data-template="move"]').onclick = () => {
                const otherCollections = collectionManager.getCollections();

                moveItemList.replaceChildren();
                for (const otherCollection of otherCollections) {
                    if (otherCollection === collection) continue;
                    /**
                     * @type {HTMLButtonElement}
                     */
                    const moveItemToCollection = moveItemButtonTemplate.cloneNode(true);
                    moveItemToCollection.textContent = otherCollection.name;
                    moveItemToCollection.onclick = () => {
                        collection.removeItem(item);
                        collectionManager.updateCollection(collection);

                        otherCollection.addItem(item);
                        collectionManager.updateCollection(otherCollection);

                        reloadCollections();
                    };

                    moveItemList.appendChild(moveItemToCollection);
                }
            };
            collectionItemRow.querySelector('[data-template="rename"]').onclick = () => {
                const name = prompt("Elem átnevezése", item.name);
                if (!name) return;

                item.name = name;
                collectionManager.updateCollection(collection);
                reloadCollections();
            };
            collectionItemRow.querySelector('[data-template="delete"]').onclick = () => {
                if (confirm("Biztosan törlöd?")) {
                    collection.removeItem(item);
                    collectionManager.updateCollection(collection);
                    reloadCollections();
                }
            };

            collectionItemsTable.appendChild(collectionItemRow);
        }

        table.appendChild(collectionItemsRow);
    }
}

function reloadCollections() {
    loadCollectionsInto(_("collections"));
}