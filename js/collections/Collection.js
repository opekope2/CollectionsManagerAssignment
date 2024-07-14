import { Item } from "./Item.js";

export class Collection {
    /**
     * Creates a new collection
     * 
     * @param {string} name Collection name
     * @param {string} topic Collection topic
     * @param {Date} date Collection date
     * @param {Item[]} items Collection items
     */
    constructor(name, topic, date, items) {
        this.name = name;
        this.topic = topic;
        this.date = date;
        this.items = items;
    }

    /**
     * Adds an item to the collection
     * 
     * @param {Item} item The item to add
     */
    addItem(item) {
        this.items.push(item);
    }

    /**
     * Removes an item from the collection
     * 
     * @param {Item} item The item to remove
     */
    removeItem(item) {
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
        }
    }

    /**
     * Creates a Collection from a deserialized JSON object
     * 
     * @param {any} json Deserialized JSON object
     * @returns {Collection}
     */
    static fromJson(json) {
        return new Collection(json.name, json.topic, new Date(json.date), json.items.map(item => Item.fromJson(item)));
    }
}
