const sql = require("mssql");
const dbConfig = require('../dbConfig/klaris_dbConfig');
class Admin {
    constructor(adminID, email, password) {
        this.adminID = adminID;
        this.email = email;
        this.password = password;
    }

    static async login(email, password) {
        const [admin] = await db.query('SELECT * FROM Administrators WHERE AdminEmail = ? AND AdminPassword = ?', [email, password]);
        if (admin) {
            return new Admin(admin.AdminID, admin.AdminEmail, admin.AdminPassword);
        }
        return null;
    }

    static async loginByID(adminID, password) {
        const [admin] = await db.query('SELECT * FROM Administrators WHERE AdminID = ? AND AdminPassword = ?', [adminID, password]);
        if (admin) {
            return new Admin(admin.AdminID, admin.AdminEmail, admin.AdminPassword);
        }
        return null;
    }
}

module.exports = Admin;
