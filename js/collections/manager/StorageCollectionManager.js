import { Collection } from "../Collection.js";
import { BaseCollectionManager } from "./BaseCollectionManager.js";

const COLLECTIONS_KEY = "Collections";

export class StorageCollectionManager extends BaseCollectionManager {
    #storage;
    /**
     * @type {Collection[]}
     */
    #collections = [];

    /**
     * Creates a collection manager with a backing storage
     * 
     * @param {Storage} storage Backing storage
     */
    constructor(storage) {
        super();
        this.#storage = storage;
        const collections = JSON.parse(this.#storage.getItem(COLLECTIONS_KEY)) || [];
        this.#collections = collections.map(collection => Collection.fromJson(collection));
    }

    #save() {
        this.#storage.setItem(COLLECTIONS_KEY, JSON.stringify(this.#collections));
    }

    addCollection(collection) {
        this.#collections.push(collection);
        this.#save();
    }

    getCollections() {
        return this.#collections;
    }

    updateCollection(collection) {
        if (this.#collections.includes(collection)) {
            // #collections stores the reference, so only flushing is required
            this.#save();
        }
    }

    deleteCollection(collection) {
        const index = this.#collections.indexOf(collection);
        if (index > -1) {
            this.#collections.splice(index, 1);
            this.#save();
        }
    }
}
