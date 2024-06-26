const sql = require("mssql");
const dbConfig = require("../dbConfig/yulin_dbConfig");

class Donation {
  constructor(donationID, donationAmount, donationDate, newEventID, eventType, eventDate, eventTime, eventLocation, newMemberID) {
    this.donationID = donationID;
    this.donationAmount = donationAmount;
    this.donationDate = donationDate;
    this.newEventID = newEventID;
    this.eventType = eventType;
    this.eventDate = eventDate;
    this.eventTime = eventTime;
    this.eventLocation = eventLocation;
    this.newMemberID = newMemberID;
  }

  static async getAllDonationsByMemberID(memberID) {
    try {
      const connection = await sql.connect(dbConfig);
      const query = `
        SELECT * FROM Donations WHERE NewMemberID = @memberID
      `;
      const result = await connection.request()
        .input('memberID', sql.VarChar, memberID)
        .query(query);
      
      return result.recordset.map(row => new Donation(
        row.DonationID, row.DonationAmount, row.DonationDate, row.NewEventID, row.EventType, row.EventDate, row.EventTime, row.EventLocation, row.NewMemberID
      ));
    } catch (error) {
      throw new Error(`Error retrieving donations: ${error.message}`);
    } finally {
      await sql.close();
    }
  }

  static async createDonation(donationData) {
    try {
      const connection = await sql.connect(dbConfig);
      const query = `
        INSERT INTO Donations (DonationAmount, EventType, EventDate, EventTime, EventLocation, NewEventID, NewMemberID)
        VALUES (@donationAmount, @eventType, @eventDate, @eventTime, @eventLocation, @newEventID, @newMemberID);
        SELECT SCOPE_IDENTITY() AS donationID;
      `;
      const result = await connection.request()
        .input('donationAmount', sql.Int, donationData.donationAmount)
        .input('eventType', sql.VarChar, donationData.eventType)
        .input('eventDate', sql.Date, donationData.eventDate)
        .input('eventTime', sql.VarChar, donationData.eventTime)
        .input('eventLocation', sql.VarChar, donationData.eventLocation)
        .input('newEventID', sql.VarChar, donationData.newEventID)
        .input('newMemberID', sql.VarChar, donationData.newMemberID)
        .query(query);

      const donationID = result.recordset[0].donationID;
      return await this.getDonationByID(donationID);
    } catch (error) {
      throw new Error(`Error creating donation: ${error.message}`);
    } finally {
      await sql.close();
    }
  }

  static async getDonationByID(donationID) {
    try {
      const connection = await sql.connect(dbConfig);
      const query = `
        SELECT * FROM Donations WHERE DonationID = @donationID
      `;
      const result = await connection.request()
        .input('donationID', sql.Int, donationID)
        .query(query);

      if (result.recordset.length > 0) {
        const row = result.recordset[0];
        return new Donation(
          row.DonationID, row.DonationAmount, row.DonationDate, row.NewEventID, row.EventType, row.EventDate, row.EventTime, row.EventLocation, row.NewMemberID
        );
      } else {
        throw new Error(`Donation with ID ${donationID} not found`);
      }
    } catch (error) {
      throw new Error(`Error retrieving donation: ${error.message}`);
    } finally {
      await sql.close();
    }
  }

  static async updateDonation(donationID, donationData) {
    try {
      const connection = await sql.connect(dbConfig);
      const query = `
        UPDATE Donations SET
          DonationAmount = @donationAmount,
          EventType = @eventType,
          EventDate = @eventDate,
          EventTime = @eventTime,
          EventLocation = @eventLocation,
          NewEventID = @newEventID,
          NewMemberID = @newMemberID
        WHERE DonationID = @donationID;
        SELECT * FROM Donations WHERE DonationID = @donationID;
      `;
      const result = await connection.request()
        .input('donationID', sql.Int, donationID)
        .input('donationAmount', sql.Int, donationData.donationAmount)
        .input('eventType', sql.VarChar, donationData.eventType)
        .input('eventDate', sql.Date, donationData.eventDate)
        .input('eventTime', sql.VarChar, donationData.eventTime)
        .input('eventLocation', sql.VarChar, donationData.eventLocation)
        .input('newEventID', sql.VarChar, donationData.newEventID)
        .input('newMemberID', sql.VarChar, donationData.newMemberID)
        .query(query);

      return await this.getDonationByID(donationID);
    } catch (error) {
      throw new Error(`Error updating donation: ${error.message}`);
    } finally {
      await sql.close();
    }
  }
}

module.exports = Donation;
