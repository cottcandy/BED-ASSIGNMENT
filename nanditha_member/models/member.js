const sql = require("mssql");
const dbConfig = require("../dbConfigs/dbConfig.js");

class Member {
    constructor(id) {
        this.id = id;
    }
}

module.exports = Member;