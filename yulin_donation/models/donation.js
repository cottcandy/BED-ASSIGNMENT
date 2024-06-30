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

  static async getDonationByID(donationID) {
    try {
        console.log(`Getting donation with ID: ${donationID}`);
        const connection = await sql.connect(dbConfig);
        const query = `
          SELECT * FROM Donations WHERE DonationID = @donationID
        `;
        const result = await connection.request()
          .input('DonationID', sql.Int, donationID)
          .query(query);

        console.log("Query executed successfully");
        console.log("Result:", result.recordset);

        if (result.recordset.length > 0) {
            const row = result.recordset[0];
            return new Donation(
                row.DonationID, row.DonationAmount, row.DonationDate, row.NewEventID, row.EventType, row.EventDate, row.EventTime, row.EventLocation, row.NewMemberID
            );
        } else {
            throw new Error(`Donation with ID ${donationID} not found`);
        }
    } catch (error) {
        console.error(`Error retrieving donation: ${error.message}`);
        throw new Error(`Error retrieving donation: ${error.message}`);
    } finally {
        await sql.close();
    }
  }

  static async getAllDonations() {
    try {
      const connection = await sql.connect(dbConfig);
      const query = `
        SELECT *
        FROM Donations
        ORDER BY DonationDate DESC, DonationID ASC
      `;
      const result = await connection.request().query(query);
  
      const donations = result.recordset.map(row => {
        const { DonationID, DonationAmount, DonationDate, NewDonationID, EventType, NewMemberID } = row;
        return new Donation(DonationID, DonationAmount, DonationDate, NewDonationID, EventType, NewMemberID);
      });
  
      console.log("Query executed successfully");
      console.log("Result:", donations);
  
      await sql.close(); // Close connection after successful query execution
  
      return donations;
    } catch (error) {
      console.error(`Error retrieving donations: ${error.message}`);
      throw new Error(`Error retrieving donations: ${error.message}`);
    } finally {
      await sql.close(); // Ensure connection is always closed, even in case of error
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
