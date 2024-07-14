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
}
