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

  // Create a new member
  static async createUser(user) {
    try {
      const connection = await sql.connect(dbConfig);
      const query = `
        INSERT INTO Members (MemberEmail, FirstName, LastName, MemberPassword, Birthday, PhoneNumber)
        VALUES (@memberEmail, @firstName, @lastName, @memberPassword, @birthday, @phoneNumber);
        SELECT SCOPE_IDENTITY() AS memberID;
      `;
      const result = await connection.request()
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
      await sql.close();
    }
  }

  // Log in a member
  static async loginUser(email, password) {
    try {
      const connection = await sql.connect(dbConfig);
      const query = `
        SELECT * FROM Members WHERE MemberEmail = @memberEmail AND MemberPassword = @memberPassword
      `;
      const result = await connection.request()
        .input('memberEmail', sql.VarChar(255), email)
        .input('memberPassword', sql.Char(12), password)
        .query(query);

      if (result.recordset.length > 0) {
        const row = result.recordset[0];
        return new Member(
          row.NewMemberID, row.MemberEmail, row.FirstName, row.LastName, row.MemberPassword, row.Birthday, row.PhoneNumber
        );
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      throw new Error(`Error logging in member: ${error.message}`);
    } finally {
      await sql.close();
    }
  }

  // Get all members
  static async getAllUsers() {
    try {
      const connection = await sql.connect(dbConfig);
      const query = `
        SELECT * FROM Members
      `;
      const result = await connection.request().query(query);
      return result.recordset.map(row => new Member(
        row.NewMemberID, row.MemberEmail, row.FirstName, row.LastName, row.MemberPassword, row.Birthday, row.PhoneNumber
      ));
    } catch (error) {
      throw new Error(`Error retrieving members: ${error.message}`);
    } finally {
      await sql.close();
    }
  }

  // Get a member by ID
  static async getUserById(memberID) {
    try {
      const connection = await sql.connect(dbConfig);
      const query = `
        SELECT * FROM Members WHERE NewMemberID = @memberID
      `;
      const result = await connection.request()
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
      await sql.close();
    }
  }

  // Update a member by ID
  static async updateUser(memberID, newUserData) {
    try {
      const connection = await sql.connect(dbConfig);
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
      const result = await connection.request()
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
      await sql.close();
    }
  }

  // Delete a member by ID
  static async deleteUser(memberID) {
    try {
      const connection = await sql.connect(dbConfig);
      const query = `
        DELETE FROM Members WHERE NewMemberID = @memberID
      `;
      const result = await connection.request()
        .input('memberID', sql.VarChar(4), memberID)
        .query(query);

      return result.rowsAffected[0] > 0;
    } catch (error) {
      throw new Error(`Error deleting member: ${error.message}`);
    } finally {
      await sql.close();
    }
  }
}

module.exports = Member;
