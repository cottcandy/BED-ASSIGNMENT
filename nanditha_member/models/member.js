const sql = require("mssql");
const dbConfig = require("../dbConfig/nanditha_dbConfig");

class Member {
  constructor(memberID, memberEmail, firstName, lastName, memberPassword, birthday, phoneNumber) {
    this.memberID = memberID;
    this.memberEmail = memberEmail;
    this.firstName = firstName;
    this.lastName = lastName;
    this.memberPassword = memberPassword;
    this.birthday = birthday;
    this.phoneNumber = phoneNumber;
  }

  static async createUser(user) {
    try {
      const pool = await sql.connect(dbConfig);
      const query = `
        INSERT INTO Members (MemberEmail, FirstName, LastName, MemberPassword, Birthday, PhoneNumber)
        VALUES (@memberEmail, @firstName, @lastName, @memberPassword, @birthday, @phoneNumber);
        SELECT SCOPE_IDENTITY() AS memberID;
      `;
      const result = await pool.request()
        .input('memberEmail', sql.VarChar(255), user.memberEmail)
        .input('firstName', sql.VarChar(50), user.firstName)
        .input('lastName', sql.VarChar(50), user.lastName)
        .input('memberPassword', sql.Char(12), user.memberPassword)
        .input('birthday', sql.Date, user.birthday)
        .input('phoneNumber', sql.VarChar(20), user.phoneNumber)
        .query(query);

      const memberID = result.recordset[0].memberID;
      return await this.getUserById(memberID);
    } catch (error) {
      throw new Error(`Error creating member: ${error.message}`);
    } finally {
      sql.close();
    }
  }

  static async loginUser(email, password) {
    let pool;
    try {
      pool = await sql.connect(dbConfig);
  
      const query = `
        SELECT NewMemberID, MemberEmail, FirstName, LastName, MemberPassword, Birthday, PhoneNumber
        FROM Members
        WHERE MemberEmail = @memberEmail
      `;
      const result = await pool.request()
        .input('memberEmail', sql.VarChar(255), email)
        .query(query);
  
      if (result.recordset.length === 1) {
        const row = result.recordset[0];
        if (row.MemberPassword === password) {
          return new Member(
            row.NewMemberID, row.MemberEmail, row.FirstName, row.LastName, row.MemberPassword, row.Birthday, row.PhoneNumber
          );
        } else {
          throw new Error("Invalid email or password");
        }
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      throw new Error(`Error logging in member: ${error.message}`);
    } finally {
      try {
        if (pool) await pool.close();
      } catch (err) {
        console.error('Error closing SQL pool:', err.message);
      }
    }
  }  

  static async getAllUsers() {
    try {
      const pool = await sql.connect(dbConfig);
      const query = `
        SELECT * FROM Members
      `;
      const result = await pool.request().query(query);
      return result.recordset.map(row => new Member(
        row.NewMemberID, row.MemberEmail, row.FirstName, row.LastName, row.MemberPassword, row.Birthday, row.PhoneNumber
      ));
    } catch (error) {
      throw new Error(`Error retrieving members: ${error.message}`);
    } finally {
      sql.close();
    }
  }

  static async getUserById(memberID) {
    try {
      const pool = await sql.connect(dbConfig);
      const query = `
        SELECT * FROM Members WHERE NewMemberID = @memberID
      `;
      const result = await pool.request()
        .input('memberID', sql.VarChar(4), memberID)
        .query(query);

      if (result.recordset.length > 0) {
        const row = result.recordset[0];
        return new Member(
          row.NewMemberID, row.MemberEmail, row.FirstName, row.LastName, row.MemberPassword, row.Birthday, row.PhoneNumber
        );
      } else {
        throw new Error(`Member with ID ${memberID} not found`);
      }
    } catch (error) {
      throw new Error(`Error retrieving member: ${error.message}`);
    } finally {
      sql.close();
    }
  }

  static async updateUser(memberID, newUserData) {
    try {
      const pool = await sql.connect(dbConfig);
      const query = `
        UPDATE Members SET
          MemberEmail = @memberEmail,
          FirstName = @firstName,
          LastName = @lastName,
          MemberPassword = @memberPassword,
          Birthday = @birthday,
          PhoneNumber = @phoneNumber
        WHERE NewMemberID = @memberID;
        SELECT * FROM Members WHERE NewMemberID = @memberID;
      `;
      const result = await pool.request()
        .input('memberID', sql.VarChar(4), memberID)
        .input('memberEmail', sql.VarChar(255), newUserData.memberEmail)
        .input('firstName', sql.VarChar(50), newUserData.firstName)
        .input('lastName', sql.VarChar(50), newUserData.lastName)
        .input('memberPassword', sql.Char(12), newUserData.memberPassword)
        .input('birthday', sql.Date, newUserData.birthday)
        .input('phoneNumber', sql.VarChar(20), newUserData.phoneNumber)
        .query(query);

      return await this.getUserById(memberID);
    } catch (error) {
      throw new Error(`Error updating member: ${error.message}`);
    } finally {
      sql.close();
    }
  }

  static async deleteUser(memberID) {
    try {
      const pool = await sql.connect(dbConfig);
      const query = `
        DELETE FROM Members WHERE NewMemberID = @memberID
      `;
      const result = await pool.request()
        .input('memberID', sql.VarChar(4), memberID)
        .query(query);

      return result.rowsAffected[0] > 0;
    } catch (error) {
      throw new Error(`Error deleting member: ${error.message}`);
    } finally {
      sql.close();
    }
  }
}

module.exports = Member;
