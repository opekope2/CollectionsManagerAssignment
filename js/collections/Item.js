export class Item {
    /**
     * Creates a new collection item
     * 
     * @param {string} name Collection item name
     */
    constructor(name) {
        this.name = name;
    }

    /**
     * Creates an Item from a deserialized JSON object
     * 
     * @param {any} json Deserialized JSON object
     * @returns {Item}
     */
    static fromJson(json) {
        return new Item(json.name);
    }
}
