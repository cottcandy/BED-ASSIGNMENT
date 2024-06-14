const sql = require("mssql");
const dbConfig = require("../dbConfigs/dbConfig.js");

class Events {
    constructor(id) {
        this.id = id;
    }
}

module.exports = Events;