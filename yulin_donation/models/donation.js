const sql = require("mssql");
const dbConfig = require("../dbConfigs/dbConfig.js");

class Donation {
    constructor(id) {
        this.id = id;
    }
}

module.exports = Donation;