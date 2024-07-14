export class Collection {
    /**
     * Creates a new collection
     * 
     * @param {string} name Collection name
     * @param {string} topic Collection topic
     * @param {Date} date Collection date
     */
    constructor(name, topic, date) {
        this.name = name;
        this.topic = topic;
        this.date = date;
    }

    /**
     * Creates a Collection from a deserialized JSON object
     * 
     * @param {any} json Deserialized JSON object
     * @returns {Collection}
     */
    static fromJson(json) {
        return new Collection(json.name, json.topic, new Date(json.date));
    }
}
