const sql = require("mssql");
const dbConfig = require("../dbConfig/lixin_dbConfig");

class Event {
  constructor(eventID, eventType, eventDate, eventTime, eventLocation, adminID) {
    this.eventID = eventID;
    this.eventType = eventType;
    this.eventDate = eventDate;
    this.eventTime = eventTime;
    this.eventLocation = eventLocation;
    this.adminID = adminID;
  }
  
  static async getEventById(eventID) {
    try {
      console.log(`Getting event with ID: ${eventID}`);
      const connection = await sql.connect(dbConfig);
      const query = `
        SELECT *
        FROM Events
        WHERE EventID = @eventID
      `;
      const result = await connection.request()
        .input('EventID', sql.Int, eventID)
        .query(query);
      
      console.log("Query executed successfully");
      console.log("Result:", result.recordset);
  
      if (result.recordset.length > 0) {
        const { eventID, eventType, eventDate, eventTime, eventLocation, adminID } = result.recordset[0];
        return new Event(eventID, eventType, eventDate, eventTime, eventLocation, adminID);
      } else {
        throw new Error(`Event with ID ${eventID} not found`);
      }
    } catch (error) {
      console.error(`Error retrieving event: ${error.message}`);
      throw new Error(`Error retrieving event: ${error.message}`);
    } finally {
      await sql.close();
    }
  }  

  static async getAllEvents() {
    try {
      const connection = await sql.connect(dbConfig);
      const query = `
        SELECT *
        FROM Events
        ORDER BY EventDate DESC, EventTime ASC
      `;
      const result = await connection.request().query(query);

      const events = result.recordset.map(row => {
        const { EventID, EventType, EventDate, EventTime, EventLocation, AdminID } = row;
        return new Event(EventID, EventType, EventDate, EventTime, EventLocation, AdminID);
      });

      return events;
    } catch (error) {
      throw new Error(`Error retrieving events: ${error.message}`);
    } finally {
      await sql.close();
    }
  }

  static async createEvent(eventData) {
    try {
      const connection = await sql.connect(dbConfig);
      const query = `
        INSERT INTO Events (EventType, EventDate, EventTime, EventLocation, AdminID)
        VALUES (@eventType, @eventDate, @eventTime, @eventLocation, @adminID);
        SELECT SCOPE_IDENTITY() AS eventID;
      `;
      const result = await connection.request()
        .input('eventType', sql.NVarChar, eventData.eventType)
        .input('eventDate', sql.Date, eventData.eventDate)
        .input('eventTime', sql.NVarChar, eventData.eventTime)
        .input('eventLocation', sql.NVarChar, eventData.eventLocation)
        .input('adminID', sql.NVarChar, eventData.adminID)
        .query(query);

      const eventID = result.recordset[0].eventID;
      return await this.getEventById(eventID);
    } catch (error) {
      throw new Error(`Error creating event: ${error.message}`);
    } finally {
      await sql.close();
    }
  }

  static async updateEvent(eventID, eventData) {
    try {
      const connection = await sql.connect(dbConfig);
      const query = `
        UPDATE Events
        SET EventType = @eventType,
            EventDate = @eventDate,
            EventTime = @eventTime,
            EventLocation = @eventLocation,
            AdminID = @adminID
        WHERE EventID = @eventID
      `;
      const result = await connection.request()
        .input('eventID', sql.Int, eventID)
        .input('eventType', sql.NVarChar, eventData.eventType)
        .input('eventDate', sql.Date, eventData.eventDate)
        .input('eventTime', sql.NVarChar, eventData.eventTime)
        .input('eventLocation', sql.NVarChar, eventData.eventLocation)
        .input('adminID', sql.NVarChar, eventData.adminID)
        .query(query);

      if (result.rowsAffected[0] > 0) {
        return await this.getEventById(eventID);
      } else {
        throw new Error(`Event with ID ${eventID} not found`);
      }
    } catch (error) {
      throw new Error(`Error updating event: ${error.message}`);
    } finally {
      await sql.close();
    }
  }

  static async deleteEvent(eventID) {
    try {
      const connection = await sql.connect(dbConfig);
      const query = `
        DELETE FROM Events
        WHERE EventID = @eventID
      `;
      const result = await connection.request()
        .input('eventID', sql.Int, eventID)
        .query(query);

      return result.rowsAffected[0] > 0;
    } catch (error) {
      throw new Error(`Error deleting event: ${error.message}`);
    } finally {
      await sql.close();
    }
  }
}

module.exports = Event;
