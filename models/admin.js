const sql = require("mssql");
const dbConfig = require("../dbConfigs/dbConfig.js");

class Admin {
    constructor(id) {
        this.id = id;
    }
}

module.exports = Admin;